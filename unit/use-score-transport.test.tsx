import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useScoreTransport } from '@/lib/playback/use-score-transport';
import type { SoundFontManager } from '@/lib/playback/soundfont-manager';
import type { Score, SynthAudioBatchIterator } from '@/lib/webmscore-loader';

const scoreWithIterator = (iterator?: SynthAudioBatchIterator) => ({
    setSoundFont: vi.fn(),
    synthAudioBatch: vi.fn(async () => iterator ?? (vi.fn(async () => []) as SynthAudioBatchIterator)),
}) as unknown as Score;

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe('useScoreTransport', () => {
    it('forces a fresh soundfont attempt when retrying unavailable playback', async () => {
        const ensure = vi.fn(async () => false);
        const manager = { ensure, prefetch: vi.fn() } as unknown as SoundFontManager<Score>;
        const score = scoreWithIterator();
        const { result } = renderHook(() => useScoreTransport({
            score,
            durationMs: 10_000,
            startMs: 0,
            volume: 1,
            soundFontManager: manager,
        }));

        await act(async () => { await result.current.togglePlayPause(); });
        expect(result.current.state).toBe('unavailable');
        expect(ensure).toHaveBeenNthCalledWith(1, score, { forceRetry: false });

        await act(async () => { await result.current.togglePlayPause(); });
        expect(ensure).toHaveBeenNthCalledWith(2, score, { forceRetry: true });
    });

    it('uses explicit compatibility audio when streaming synthesis is unavailable', async () => {
        let currentTime = 0;
        let paused = true;
        const audio = {
            readyState: 1,
            duration: 12,
            volume: 1,
            get currentTime() { return currentTime; },
            set currentTime(value: number) { currentTime = value; },
            get paused() { return paused; },
            play: vi.fn(async () => { paused = false; }),
            pause: vi.fn(() => { paused = true; }),
            addEventListener: vi.fn(),
            removeAttribute: vi.fn(),
            load: vi.fn(),
            onended: null as (() => void) | null,
            onerror: null as (() => void) | null,
        };
        vi.stubGlobal('Audio', function FakeAudio() { return audio; });
        vi.stubGlobal('URL', {
            ...URL,
            createObjectURL: vi.fn(() => 'blob:compatibility-audio'),
            revokeObjectURL: vi.fn(),
        });
        const score = {
            setSoundFont: vi.fn(),
            saveAudio: vi.fn(async () => new Uint8Array([1, 2, 3])),
        } as unknown as Score;
        const manager = {
            ensure: vi.fn(async () => true),
            prefetch: vi.fn(),
        } as unknown as SoundFontManager<Score>;
        const onMessage = vi.fn();
        const { result } = renderHook(() => useScoreTransport({
            score,
            durationMs: 10_000,
            startMs: 0,
            volume: 0.75,
            soundFontManager: manager,
            onMessage,
        }));

        await act(async () => { await result.current.togglePlayPause(); });

        expect(score.saveAudio).toHaveBeenCalledWith('wav');
        expect(audio.play).toHaveBeenCalledOnce();
        expect(audio.volume).toBe(0.75);
        expect(result.current.fallbackMode).toBe(true);
        expect(result.current.state).toBe('playing');
        expect(onMessage).toHaveBeenCalledWith('Streaming unavailable — preparing compatibility audio…');
        expect(onMessage).toHaveBeenLastCalledWith('Compatibility audio');
    });

    it('falls back to compatibility audio when a streaming attempt fails', async () => {
        const audio = {
            readyState: 1,
            duration: 12,
            volume: 1,
            currentTime: 0,
            paused: true,
            play: vi.fn(async () => {}),
            pause: vi.fn(),
            addEventListener: vi.fn(),
            removeAttribute: vi.fn(),
            load: vi.fn(),
            onended: null as (() => void) | null,
            onerror: null as (() => void) | null,
        };
        vi.stubGlobal('Audio', function FakeAudio() { return audio; });
        vi.stubGlobal('URL', {
            ...URL,
            createObjectURL: vi.fn(() => 'blob:stream-fallback'),
            revokeObjectURL: vi.fn(),
        });
        vi.stubGlobal('AudioContext', function FakeAudioContext() {
            return {
                currentTime: 0,
                sampleRate: 44_100,
                state: 'running',
                destination: {},
                createGain: () => ({ gain: { value: 1 }, connect: vi.fn(), disconnect: vi.fn() }),
                close: vi.fn(async () => {}),
            };
        });
        const score = {
            setSoundFont: vi.fn(),
            synthAudioBatch: vi.fn(async () => { throw new Error('stream failed'); }),
            saveAudio: vi.fn(async () => new Uint8Array([1, 2, 3])),
        } as unknown as Score;
        const manager = {
            ensure: vi.fn(async () => true),
            prefetch: vi.fn(),
        } as unknown as SoundFontManager<Score>;
        const { result } = renderHook(() => useScoreTransport({
            score,
            durationMs: 10_000,
            startMs: 0,
            volume: 1,
            soundFontManager: manager,
        }));

        await act(async () => { await result.current.togglePlayPause(); });

        expect(score.synthAudioBatch).toHaveBeenCalledOnce();
        expect(score.saveAudio).toHaveBeenCalledWith('wav');
        expect(result.current.fallbackMode).toBe(true);
        expect(result.current.state).toBe('playing');
    });

    it('does not change a paused transport back to playing when more PCM arrives', async () => {
        let resolveSecond!: (value: Awaited<ReturnType<SynthAudioBatchIterator>>) => void;
        const second = new Promise<Awaited<ReturnType<SynthAudioBatchIterator>>>((resolve) => {
            resolveSecond = resolve;
        });
        const floats = new Float32Array(1_024);
        let pull = 0;
        const iterator = vi.fn(async () => {
            pull += 1;
            if (pull === 1) return [{
                chunk: new Uint8Array(floats.buffer),
                startTime: 0,
                endTime: 0.1,
                done: false,
            }];
            return second;
        }) as SynthAudioBatchIterator;
        const sources: Array<{ onended: (() => void) | null }> = [];
        let contextState: AudioContextState = 'running';
        const audioContext = {
            currentTime: 0,
            sampleRate: 44_100,
            get state() { return contextState; },
            destination: {} as AudioNode,
            createGain: vi.fn(() => ({
                gain: { value: 1 },
                connect: vi.fn(),
                disconnect: vi.fn(),
            })),
            createBuffer: vi.fn(() => ({ copyToChannel: vi.fn() })),
            createBufferSource: vi.fn(() => {
                const source = {
                    buffer: null,
                    connect: vi.fn(),
                    disconnect: vi.fn(),
                    start: vi.fn(),
                    stop: vi.fn(),
                    onended: null as (() => void) | null,
                };
                sources.push(source);
                return source;
            }),
            suspend: vi.fn(async () => { contextState = 'suspended'; }),
            resume: vi.fn(async () => { contextState = 'running'; }),
            close: vi.fn(async () => { contextState = 'closed'; }),
        } as unknown as AudioContext;
        vi.stubGlobal('AudioContext', function FakeAudioContext() { return audioContext; });
        const manager = {
            ensure: vi.fn(async () => true),
            prefetch: vi.fn(),
        } as unknown as SoundFontManager<Score>;
        const { result } = renderHook(() => useScoreTransport({
            score: scoreWithIterator(iterator),
            durationMs: 10_000,
            startMs: 0,
            volume: 1,
            soundFontManager: manager,
        }));

        act(() => { void result.current.togglePlayPause(); });
        await waitFor(() => expect(result.current.state).toBe('playing'));
        await act(async () => { await result.current.togglePlayPause(); });
        expect(result.current.state).toBe('paused');

        await act(async () => {
            resolveSecond([{
                chunk: new Uint8Array(floats.buffer),
                startTime: 0.1,
                endTime: 0.2,
                done: true,
            }]);
            await second;
        });
        expect(result.current.state).toBe('paused');
    });

    it('keeps a paused seek paused and re-synthesizes from that position on resume', async () => {
        const floats = new Float32Array(1_024);
        const makeIterator = (startTime: number) => vi.fn(async (cancel?: boolean) => cancel ? [] : [{
            chunk: new Uint8Array(floats.buffer),
            startTime,
            endTime: startTime + 0.1,
            done: true,
        }]) as SynthAudioBatchIterator;
        const iterators = [makeIterator(0), makeIterator(4)];
        const synthAudioBatch = vi.fn(async () => iterators.shift()!);
        const score = { setSoundFont: vi.fn(), synthAudioBatch } as unknown as Score;
        let contextState: AudioContextState = 'running';
        const audioContext = {
            currentTime: 10,
            sampleRate: 44_100,
            get state() { return contextState; },
            destination: {} as AudioNode,
            createGain: vi.fn(() => ({ gain: { value: 1 }, connect: vi.fn(), disconnect: vi.fn() })),
            createBuffer: vi.fn(() => ({ copyToChannel: vi.fn() })),
            createBufferSource: vi.fn(() => ({
                buffer: null,
                connect: vi.fn(),
                disconnect: vi.fn(),
                start: vi.fn(),
                stop: vi.fn(),
                onended: null as (() => void) | null,
            })),
            suspend: vi.fn(async () => { contextState = 'suspended'; }),
            resume: vi.fn(async () => { contextState = 'running'; }),
            close: vi.fn(async () => { contextState = 'closed'; }),
        } as unknown as AudioContext;
        vi.stubGlobal('AudioContext', function FakeAudioContext() { return audioContext; });
        const manager = {
            ensure: vi.fn(async () => true),
            prefetch: vi.fn(),
        } as unknown as SoundFontManager<Score>;
        const { result } = renderHook(() => useScoreTransport({
            score,
            durationMs: 10_000,
            startMs: 0,
            volume: 1,
            soundFontManager: manager,
        }));

        await act(async () => { await result.current.togglePlayPause(); });
        await act(async () => { await result.current.togglePlayPause(); });
        act(() => { result.current.seek(4_000); });
        await waitFor(() => expect(result.current.positionMs).toBe(4_000));
        expect(result.current.state).toBe('paused');

        await act(async () => { await result.current.togglePlayPause(); });
        expect(synthAudioBatch).toHaveBeenNthCalledWith(2, 4, 2);
        expect(result.current.state).toBe('playing');
    });

    it('does not let a slow paused seek overwrite a newer play attempt', async () => {
        let finishCancellation!: () => void;
        const cancellation = new Promise<void>((resolve) => { finishCancellation = resolve; });
        const floats = new Float32Array(1_024);
        const firstIterator = vi.fn(async (cancel?: boolean) => {
            if (cancel) await cancellation;
            return cancel ? [] : [{
                chunk: new Uint8Array(floats.buffer),
                startTime: 0,
                endTime: 0.1,
                done: true,
            }];
        }) as SynthAudioBatchIterator;
        const secondIterator = vi.fn(async () => [{
            chunk: new Uint8Array(floats.buffer),
            startTime: 0,
            endTime: 0.1,
            done: true,
        }]) as SynthAudioBatchIterator;
        const iterators = [firstIterator, secondIterator];
        const synthAudioBatch = vi.fn(async () => iterators.shift()!);
        const score = { setSoundFont: vi.fn(), synthAudioBatch } as unknown as Score;
        let contextState: AudioContextState = 'running';
        const sourcesCreated: unknown[] = [];
        const audioContext = {
            currentTime: 10,
            sampleRate: 44_100,
            get state() { return contextState; },
            destination: {} as AudioNode,
            createGain: vi.fn(() => ({ gain: { value: 1 }, connect: vi.fn(), disconnect: vi.fn() })),
            createBuffer: vi.fn(() => ({ copyToChannel: vi.fn() })),
            createBufferSource: vi.fn(() => {
                const source = {
                    buffer: null,
                    connect: vi.fn(),
                    disconnect: vi.fn(),
                    start: vi.fn(),
                    stop: vi.fn(),
                    onended: null as (() => void) | null,
                };
                sourcesCreated.push(source);
                return source;
            }),
            suspend: vi.fn(async () => { contextState = 'suspended'; }),
            resume: vi.fn(async () => { contextState = 'running'; }),
            close: vi.fn(async () => { contextState = 'closed'; }),
        } as unknown as AudioContext;
        vi.stubGlobal('AudioContext', function FakeAudioContext() { return audioContext; });
        const manager = {
            ensure: vi.fn(async () => true),
            prefetch: vi.fn(),
        } as unknown as SoundFontManager<Score>;
        const { result } = renderHook(() => useScoreTransport({
            score,
            durationMs: 10_000,
            startMs: 0,
            volume: 1,
            soundFontManager: manager,
        }));

        await act(async () => { await result.current.togglePlayPause(); });
        await act(async () => { await result.current.togglePlayPause(); });
        expect(result.current.state).toBe('paused');

        act(() => {
            result.current.seek(4_000);
            void result.current.togglePlayPause();
        });
        await waitFor(() => expect(synthAudioBatch).toHaveBeenCalledTimes(2));
        await waitFor(() => expect(result.current.state).toBe('playing'));
        expect(sourcesCreated).toHaveLength(2);
        expect(contextState).toBe('running');

        await act(async () => {
            finishCancellation();
            await cancellation;
        });
        expect(result.current.state).toBe('playing');
        expect(result.current.positionMs).toBe(0);
    });
});
