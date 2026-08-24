import { describe, expect, it, vi } from 'vitest';
import type { MutableRefObject } from 'react';
import type { SynthAudioBatchIterator } from '@/lib/webmscore-loader';
import {
    cancelSynthStream,
    scheduleSynthBatchStream,
    stopSynthStream,
} from '@/lib/playback/stream-scheduler';

const ref = <T,>(current: T) => ({ current }) as MutableRefObject<T>;

describe('stream scheduler', () => {
    it('anchors score time, schedules PCM, and releases the final source', async () => {
        const copiedChannels: number[] = [];
        const source = {
            buffer: null,
            connect: vi.fn(),
            disconnect: vi.fn(),
            start: vi.fn(),
            stop: vi.fn(),
            onended: null as (() => void) | null,
        };
        const destination = {} as AudioNode;
        const audioContext = {
            currentTime: 10,
            sampleRate: 44_100,
            destination,
            createBuffer: vi.fn(() => ({
                copyToChannel: (_values: Float32Array, channel: number) => copiedChannels.push(channel),
            })),
            createBufferSource: vi.fn(() => source),
        } as unknown as AudioContext;
        const floats = new Float32Array(1_024);
        const iterator = vi.fn(async () => [{
            chunk: new Uint8Array(floats.buffer),
            startTime: 2,
            endTime: 2 + (512 / 44_100),
            done: true,
        }]) as SynthAudioBatchIterator;
        const sourcesRef = ref<AudioBufferSourceNode[]>([]);
        const iteratorRef = ref<SynthAudioBatchIterator | null>(null);
        const generationRef = ref(0);
        const onClockAnchor = vi.fn();
        const onEnded = vi.fn();

        await scheduleSynthBatchStream(iterator, audioContext, {
            sourcesRef,
            iteratorRef,
            generationRef,
            debugLabel: 'embedded-player',
            destination,
            onClockAnchor,
            onEnded,
        });

        expect(copiedChannels).toEqual([0, 1]);
        expect(source.connect).toHaveBeenCalledWith(destination);
        expect(source.start).toHaveBeenCalledWith(10.015);
        expect(onClockAnchor).toHaveBeenCalledWith({ contextTime: 10.015, scoreTimeSeconds: 2 });
        expect(sourcesRef.current).toHaveLength(1);

        source.onended?.();
        expect(source.disconnect).toHaveBeenCalledOnce();
        expect(sourcesRef.current).toEqual([]);
        expect(iteratorRef.current).toBeNull();
        expect(onEnded).toHaveBeenCalledOnce();
    });

    it('stops and disconnects sources before awaiting iterator cancellation', async () => {
        let finishCancellation!: () => void;
        const cancellation = new Promise<void>((resolve) => { finishCancellation = resolve; });
        const iterator = vi.fn(async (cancel?: boolean) => {
            if (cancel) await cancellation;
            return [];
        }) as SynthAudioBatchIterator;
        const source = {
            stop: vi.fn(),
            disconnect: vi.fn(),
        } as unknown as AudioBufferSourceNode;
        const sourcesRef = ref([source]);
        const iteratorRef = ref<SynthAudioBatchIterator | null>(iterator);

        const stopped = stopSynthStream(sourcesRef, iteratorRef, { awaitCancel: true });
        await Promise.resolve();

        expect(source.stop).toHaveBeenCalledOnce();
        expect(source.disconnect).toHaveBeenCalledOnce();
        expect(sourcesRef.current).toEqual([]);
        expect(iteratorRef.current).toBeNull();
        finishCancellation();
        await stopped;
        expect(iterator).toHaveBeenCalledWith(true);
    });

    it('invalidates stream ownership before awaiting cancellation', async () => {
        let finishCancellation!: () => void;
        const cancellation = new Promise<void>((resolve) => { finishCancellation = resolve; });
        const iterator = vi.fn(async (cancel?: boolean) => {
            if (cancel) await cancellation;
            return [];
        }) as SynthAudioBatchIterator;
        const target = {
            sourcesRef: ref<AudioBufferSourceNode[]>([]),
            iteratorRef: ref<SynthAudioBatchIterator | null>(iterator),
            generationRef: ref(7),
        };

        const stopped = cancelSynthStream(target, { awaitCancel: true });
        expect(target.generationRef.current).toBe(8);
        expect(target.iteratorRef.current).toBeNull();

        finishCancellation();
        await stopped;
    });
});
