'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Score, SynthAudioBatchIterator } from '../webmscore-loader';
import { DEFAULT_RENDER_WINDOW } from '../playback-window';
import { SoundFontManager } from './soundfont-manager';
import { cancelSynthStream, scheduleSynthBatchStream } from './stream-scheduler';
import { clampScorePosition, scoreTimeAt, type TransportClockAnchor } from './transport-clock';

export type ScoreTransportState = 'idle' | 'preparing' | 'playing' | 'paused' | 'ended' | 'unavailable';

type Options = {
    score: Score | null;
    durationMs: number;
    startMs: number;
    volume: number;
    onMessage?: (message: string) => void;
    soundFontManager?: SoundFontManager<Score>;
};

export function useScoreTransport(options: Options) {
    const [state, setState] = useState<ScoreTransportState>('idle');
    const stateRef = useRef<ScoreTransportState>('idle');
    const [positionMs, setPositionMs] = useState(options.startMs);
    const [renderWindowIdle, setRenderWindowIdle] = useState(true);
    const [fallbackMode, setFallbackMode] = useState(false);
    const positionRef = useRef(options.startMs);
    const scoreRef = useRef(options.score);
    const durationRef = useRef(options.durationMs);
    const startRef = useRef(options.startMs);
    const optionStartRef = useRef(options.startMs);
    const volumeRef = useRef(options.volume);
    const messageRef = useRef(options.onMessage);
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const sourcesRef = useRef<AudioBufferSourceNode[]>([]);
    const iteratorRef = useRef<SynthAudioBatchIterator | null>(null);
    const playbackAttemptRef = useRef(0);
    const pendingStopAttemptRef = useRef<number | null>(null);
    const generationRef = useRef(0);
    const clockRef = useRef<TransportClockAnchor | null>(null);
    const soundFontManagerRef = useRef(options.soundFontManager ?? new SoundFontManager<Score>());
    const fallbackAudioRef = useRef<HTMLAudioElement | null>(null);
    const fallbackUrlRef = useRef<string | null>(null);

    scoreRef.current = options.score;
    durationRef.current = options.durationMs;
    if (optionStartRef.current !== options.startMs) {
        optionStartRef.current = options.startMs;
        startRef.current = options.startMs;
    }
    volumeRef.current = options.volume;
    messageRef.current = options.onMessage;

    const publishState = useCallback((next: ScoreTransportState) => {
        stateRef.current = next;
        setState(next);
    }, []);

    const publishPosition = useCallback((next: number) => {
        const clamped = clampScorePosition(next, durationRef.current);
        positionRef.current = clamped;
        setPositionMs(clamped);
    }, []);

    useEffect(() => {
        if (gainNodeRef.current) gainNodeRef.current.gain.value = options.volume;
        if (fallbackAudioRef.current) fallbackAudioRef.current.volume = options.volume;
    }, [options.volume]);

    const pauseFallbackAudio = useCallback(() => {
        const audio = fallbackAudioRef.current;
        if (audio && !audio.paused) audio.pause();
    }, []);

    const releaseFallbackAudio = useCallback(() => {
        const audio = fallbackAudioRef.current;
        const url = fallbackUrlRef.current;
        fallbackAudioRef.current = null;
        fallbackUrlRef.current = null;
        if (audio) {
            audio.pause();
            audio.removeAttribute('src');
            audio.load();
        }
        if (url) URL.revokeObjectURL(url);
    }, []);

    const ensureAudioContext = useCallback(async () => {
        const audioContext = audioContextRef.current ?? new AudioContext({ sampleRate: 44_100 });
        audioContextRef.current = audioContext;
        if (!gainNodeRef.current) {
            const gain = audioContext.createGain();
            gain.gain.value = volumeRef.current;
            gain.connect(audioContext.destination);
            gainNodeRef.current = gain;
        }
        if (audioContext.state === 'suspended') await audioContext.resume();
        return audioContext;
    }, []);

    const cancel = useCallback(async (awaitCancel = true) => {
        const attempt = ++playbackAttemptRef.current;
        clockRef.current = null;
        setRenderWindowIdle(false);
        pauseFallbackAudio();
        await cancelSynthStream({ sourcesRef, iteratorRef, generationRef }, { awaitCancel });
        if (attempt === playbackAttemptRef.current) setRenderWindowIdle(true);
        return attempt;
    }, [pauseFallbackAudio]);

    const stopAt = useCallback(async (
        targetMs: number,
        nextState: ScoreTransportState = 'idle',
    ) => {
        const attempt = ++playbackAttemptRef.current;
        pendingStopAttemptRef.current = attempt;
        clockRef.current = null;
        setRenderWindowIdle(false);
        pauseFallbackAudio();
        await cancelSynthStream({ sourcesRef, iteratorRef, generationRef }, { awaitCancel: true });
        if (pendingStopAttemptRef.current === attempt) pendingStopAttemptRef.current = null;
        if (attempt !== playbackAttemptRef.current) return false;
        setRenderWindowIdle(true);
        publishPosition(targetMs);
        publishState(nextState);
        return true;
    }, [pauseFallbackAudio, publishPosition, publishState]);

    const playFallbackFrom = useCallback(async (
        activeScore: Score,
        targetMs: number,
        attempt: number,
        prepare: boolean,
    ) => {
        let audio = fallbackAudioRef.current;
        if (!audio || prepare) {
            if (!activeScore.saveAudio) throw new Error('Compatibility audio is unavailable in this build.');
            messageRef.current?.('Streaming unavailable — preparing compatibility audio…');
            const wav = await activeScore.saveAudio('wav');
            if (attempt !== playbackAttemptRef.current) return;
            if (fallbackUrlRef.current) URL.revokeObjectURL(fallbackUrlRef.current);
            const url = URL.createObjectURL(new Blob([new Uint8Array(wav)], { type: 'audio/wav' }));
            fallbackUrlRef.current = url;
            audio = new Audio(url);
            fallbackAudioRef.current = audio;
            await new Promise<void>((resolve, reject) => {
                if (audio!.readyState >= 1) {
                    resolve();
                    return;
                }
                audio!.addEventListener('loadedmetadata', () => resolve(), { once: true });
                audio!.addEventListener('error', () => reject(new Error('Compatibility audio could not be decoded.')), { once: true });
            });
        }
        if (attempt !== playbackAttemptRef.current) return;
        audio.volume = volumeRef.current;
        audio.currentTime = Math.max(0, Math.min(targetMs / 1000, Number.isFinite(audio.duration) ? audio.duration : targetMs / 1000));
        audio.onended = () => {
            if (attempt !== playbackAttemptRef.current) return;
            setRenderWindowIdle(true);
            publishPosition(durationRef.current);
            publishState('ended');
        };
        audio.onerror = () => {
            if (attempt !== playbackAttemptRef.current) return;
            setRenderWindowIdle(true);
            messageRef.current?.('Compatibility audio could not be played.');
            publishState('unavailable');
        };
        try {
            await audio.play();
        } catch (error) {
            if (attempt !== playbackAttemptRef.current) return;
            setRenderWindowIdle(true);
            messageRef.current?.(error instanceof DOMException && error.name === 'NotAllowedError'
                ? 'Playback was blocked. Press Play to try again.'
                : error instanceof Error ? error.message : 'Compatibility audio could not start.');
            publishState(error instanceof DOMException && error.name === 'NotAllowedError' ? 'idle' : 'unavailable');
            return;
        }
        if (attempt !== playbackAttemptRef.current) {
            audio.pause();
            return;
        }
        setFallbackMode(true);
        setRenderWindowIdle(true);
        publishPosition(targetMs);
        messageRef.current?.('Compatibility audio');
        publishState('playing');
    }, [publishPosition, publishState]);

    const playFrom = useCallback(async (targetMs: number, forceRetry = false) => {
        const activeScore = scoreRef.current;
        if (!activeScore?.setSoundFont) {
            setRenderWindowIdle(true);
            messageRef.current?.('Playback is unavailable in this build.');
            publishState('unavailable');
            return;
        }
        const attempt = ++playbackAttemptRef.current;
        setRenderWindowIdle(false);
        publishState('preparing');
        messageRef.current?.('Preparing audio…');
        try {
            const ready = await soundFontManagerRef.current.ensure(activeScore, { forceRetry });
            if (!ready || attempt !== playbackAttemptRef.current) {
                if (!ready && attempt === playbackAttemptRef.current) {
                    setRenderWindowIdle(true);
                    messageRef.current?.('Playback soundfont is unavailable.');
                    publishState('unavailable');
                }
                return;
            }
            if (fallbackAudioRef.current) {
                await playFallbackFrom(activeScore, targetMs, attempt, false);
                return;
            }
            if (!activeScore.synthAudioBatch) {
                await playFallbackFrom(activeScore, targetMs, attempt, true);
                return;
            }
            await cancelSynthStream({ sourcesRef, iteratorRef, generationRef }, { awaitCancel: true });
            if (attempt !== playbackAttemptRef.current) return;
            const audioContext = await ensureAudioContext();
            const iterator = await activeScore.synthAudioBatch(targetMs / 1000, 2) as SynthAudioBatchIterator;
            if (attempt !== playbackAttemptRef.current) {
                await iterator(true).catch(() => {});
                return;
            }
            publishPosition(targetMs);
            messageRef.current?.('');
            await scheduleSynthBatchStream(iterator, audioContext, {
                sourcesRef,
                iteratorRef,
                generationRef,
                debugLabel: 'score-transport',
                renderWindow: DEFAULT_RENDER_WINDOW,
                destination: gainNodeRef.current ?? undefined,
                onClockAnchor: (anchor) => { clockRef.current = anchor; },
                onRenderWindowIdleChange: (idle) => {
                    if (attempt === playbackAttemptRef.current) setRenderWindowIdle(idle);
                },
                onPlayingChange: (playing) => {
                    if (
                        playing
                        && attempt === playbackAttemptRef.current
                        && stateRef.current === 'preparing'
                    ) publishState('playing');
                },
                onEnded: () => {
                    if (attempt !== playbackAttemptRef.current) return;
                    setRenderWindowIdle(true);
                    publishPosition(durationRef.current);
                    publishState('ended');
                },
            });
            if (
                attempt === playbackAttemptRef.current
                && (stateRef.current === 'playing' || stateRef.current === 'paused')
            ) setRenderWindowIdle(true);
        } catch (error) {
            if (attempt !== playbackAttemptRef.current) return;
            if (!fallbackAudioRef.current) {
                try {
                    const fallbackTargetMs = stateRef.current === 'playing'
                        ? positionRef.current
                        : targetMs;
                    clockRef.current = null;
                    publishState('preparing');
                    await cancelSynthStream({ sourcesRef, iteratorRef, generationRef }, { awaitCancel: true });
                    if (attempt !== playbackAttemptRef.current) return;
                    await playFallbackFrom(activeScore, fallbackTargetMs, attempt, true);
                    return;
                } catch (fallbackError) {
                    if (attempt !== playbackAttemptRef.current) return;
                    error = fallbackError;
                }
            }
            setRenderWindowIdle(true);
            messageRef.current?.(error instanceof Error ? error.message : 'Playback could not start.');
            publishState('unavailable');
        }
    }, [ensureAudioContext, playFallbackFrom, publishPosition, publishState]);

    const togglePlayPause = useCallback(async () => {
        const priorState = stateRef.current;
        const pendingStopAttempt = pendingStopAttemptRef.current;
        if (
            pendingStopAttempt !== null
            && pendingStopAttempt === playbackAttemptRef.current
        ) {
            playbackAttemptRef.current += 1;
            pendingStopAttemptRef.current = null;
        }
        if (priorState === 'playing') {
            if (fallbackAudioRef.current) {
                fallbackAudioRef.current.pause();
                publishState('paused');
                return;
            }
            if (audioContextRef.current?.state === 'running') await audioContextRef.current.suspend();
            publishState('paused');
            return;
        }
        if (priorState === 'paused' && iteratorRef.current) {
            if (audioContextRef.current?.state === 'suspended') await audioContextRef.current.resume();
            publishState('playing');
            return;
        }
        if (priorState === 'paused' && fallbackAudioRef.current) {
            try {
                await fallbackAudioRef.current.play();
                publishState('playing');
            } catch (error) {
                messageRef.current?.(error instanceof Error ? error.message : 'Compatibility audio could not resume.');
                publishState('unavailable');
            }
            return;
        }
        const target = priorState === 'ended' ? startRef.current : positionRef.current;
        await playFrom(target, priorState === 'unavailable');
    }, [playFrom, publishState]);

    const seek = useCallback((targetMs: number) => {
        const priorState = stateRef.current;
        const fallbackAudio = fallbackAudioRef.current;
        if (fallbackAudio && fallbackMode) {
            fallbackAudio.currentTime = Math.max(0, targetMs / 1000);
            publishPosition(targetMs);
            if (priorState === 'ended') publishState('idle');
            return;
        }
        if (priorState === 'paused') {
            void stopAt(targetMs, 'paused');
            return;
        }
        const shouldResume = priorState === 'playing';
        void stopAt(targetMs).then((stopped) => {
            if (stopped && shouldResume) void playFrom(targetMs);
        });
    }, [fallbackMode, playFrom, publishPosition, publishState, stopAt]);

    const reset = useCallback((targetMs: number, durationMs = durationRef.current) => {
        playbackAttemptRef.current += 1;
        pendingStopAttemptRef.current = null;
        setRenderWindowIdle(true);
        pauseFallbackAudio();
        releaseFallbackAudio();
        setFallbackMode(false);
        durationRef.current = durationMs;
        startRef.current = targetMs;
        publishPosition(targetMs);
        publishState('idle');
    }, [pauseFallbackAudio, publishPosition, publishState, releaseFallbackAudio]);

    const prefetchSoundFont = useCallback((signal?: AbortSignal) => (
        soundFontManagerRef.current.prefetch(signal)
    ), []);

    const dispose = useCallback(async () => {
        await cancel(true);
        const context = audioContextRef.current;
        const gain = gainNodeRef.current;
        audioContextRef.current = null;
        gainNodeRef.current = null;
        releaseFallbackAudio();
        try { gain?.disconnect(); } catch { /* already disconnected */ }
        if (context && context.state !== 'closed') await context.close().catch(() => {});
    }, [cancel, releaseFallbackAudio]);

    useEffect(() => () => {
        void dispose();
    }, [dispose]);

    useEffect(() => {
        if (state !== 'playing') return;
        let frame = window.requestAnimationFrame(function update() {
            const context = audioContextRef.current;
            const anchor = clockRef.current;
            const fallbackAudio = fallbackAudioRef.current;
            if (fallbackMode && fallbackAudio) {
                publishPosition(fallbackAudio.currentTime * 1000);
            } else if (context && anchor) {
                const scoreTime = scoreTimeAt(anchor, context.currentTime);
                if (scoreTime !== null) publishPosition(scoreTime * 1000);
            }
            frame = window.requestAnimationFrame(update);
        });
        return () => window.cancelAnimationFrame(frame);
    }, [fallbackMode, publishPosition, state]);

    return {
        state,
        stateRef,
        positionMs,
        positionRef,
        renderWindowIdle,
        fallbackMode,
        togglePlayPause,
        stopAt,
        seek,
        reset,
        dispose,
        prefetchSoundFont,
    };
}
