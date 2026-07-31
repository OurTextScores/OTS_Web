import { act, renderHook, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { Score, SynthAudioBatchIterator } from '../lib/webmscore-loader';
import {
    useCompareTransport,
    type CompareSide,
    type CompareStreamTarget,
} from '../components/score-editor/compare/useCompareTransport';

const deferred = <T,>() => {
    let resolve!: (value: T | PromiseLike<T>) => void;
    const promise = new Promise<T>((nextResolve) => {
        resolve = nextResolve;
    });
    return { promise, resolve };
};

const makeScore = () => {
    const iterator = vi.fn(async () => undefined) as unknown as SynthAudioBatchIterator;
    const synthAudioBatch = vi.fn(async () => iterator);
    const score = { synthAudioBatch } as unknown as Score;
    return { iterator, score, synthAudioBatch };
};

const renderTransport = (
    scores: { left: Score | null; right: Score | null },
    ensureSoundFontLoaded: (score: Score, options: { forceRetry: boolean }) => Promise<boolean>,
) => {
    const audioContextRef = createRef<AudioContext | null>();
    audioContextRef.current = null;
    const stopMainAudio = vi.fn(async () => {});
    const stopStream = vi.fn(async () => {});
    const playStream = vi.fn(async (
        _iterator: SynthAudioBatchIterator,
        target: CompareStreamTarget,
    ) => {
        target.setIsPlaying(true);
        target.setIsPaused(false);
    });
    const reportUnavailable = vi.fn();
    const reportMissingSoundFont = vi.fn();
    const reportPlaybackError = vi.fn<(side: CompareSide, error: unknown) => void>();
    const dependencies = {
        audioContextRef,
        batchSize: 2,
        ensureSoundFontLoaded,
        stopMainAudio,
        stopStream,
        playStream,
        reportUnavailable,
        reportMissingSoundFont,
        reportPlaybackError,
    };
    const hook = renderHook(
        ({ nextScores }) => useCompareTransport({ scores: nextScores, ...dependencies }),
        { initialProps: { nextScores: scores } },
    );
    return { ...hook, ...dependencies };
};

describe('useCompareTransport', () => {
    it('does not start hidden audio when stopped during soundfont setup', async () => {
        const soundFont = deferred<boolean>();
        const left = makeScore();
        const transport = renderTransport(
            { left: left.score, right: null },
            vi.fn(() => soundFont.promise),
        );

        let play!: Promise<void>;
        await act(async () => {
            play = transport.result.current.playSideAudio('left');
            await Promise.resolve();
        });
        await act(async () => transport.result.current.stopSideAudio('left', { awaitCancel: true }));
        soundFont.resolve(true);
        await act(async () => play);

        expect(left.synthAudioBatch).not.toHaveBeenCalled();
        expect(transport.playStream).not.toHaveBeenCalled();
        expect(transport.result.current.left.isPlaying).toBe(false);
        expect(transport.result.current.left.isBusy).toBe(false);
    });

    it('invalidates setup when the displayed score identity changes', async () => {
        const soundFont = deferred<boolean>();
        const original = makeScore();
        const replacement = makeScore();
        const transport = renderTransport(
            { left: original.score, right: null },
            vi.fn(() => soundFont.promise),
        );

        let play!: Promise<void>;
        await act(async () => {
            play = transport.result.current.playSideAudio('left');
            await Promise.resolve();
        });
        transport.rerender({ nextScores: { left: replacement.score, right: null } });
        await waitFor(() => expect(transport.stopStream).toHaveBeenCalledOnce());
        soundFont.resolve(true);
        await act(async () => play);

        expect(original.synthAudioBatch).not.toHaveBeenCalled();
        expect(replacement.synthAudioBatch).not.toHaveBeenCalled();
        expect(transport.playStream).not.toHaveBeenCalled();
    });

    it('stops the main and opposite transports before starting a side', async () => {
        const left = makeScore();
        const right = makeScore();
        const transport = renderTransport(
            { left: left.score, right: right.score },
            vi.fn(async () => true),
        );

        await act(async () => transport.result.current.playSideAudio('left'));
        expect(transport.result.current.left.isPlaying).toBe(true);

        await act(async () => transport.result.current.playSideAudio('right'));

        expect(transport.stopMainAudio).toHaveBeenCalledTimes(2);
        expect(transport.stopStream).toHaveBeenCalledTimes(2);
        expect(transport.result.current.left.isPlaying).toBe(false);
        expect(transport.result.current.right.isPlaying).toBe(true);
    });
});
