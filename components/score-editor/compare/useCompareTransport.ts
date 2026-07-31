import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type MutableRefObject,
} from 'react';
import type { Score, SynthAudioBatchIterator } from '@/lib/webmscore-loader';

export type CompareSide = 'left' | 'right';

export type CompareTransportState = {
    isPlaying: boolean;
    isPaused: boolean;
    isBusy: boolean;
};

export type CompareStreamTarget = {
    sourcesRef: MutableRefObject<AudioBufferSourceNode[]>;
    iteratorRef: MutableRefObject<SynthAudioBatchIterator | null>;
    generationRef: MutableRefObject<number>;
    setIsPlaying: (value: boolean) => void;
    setIsPaused: (value: boolean) => void;
    debugLabel: string;
};

type CompareTransportOptions = {
    scores: Record<CompareSide, Score | null>;
    audioContextRef: MutableRefObject<AudioContext | null>;
    batchSize: number;
    ensureSoundFontLoaded: (
        score: Score,
        options: { forceRetry: boolean },
    ) => Promise<boolean>;
    stopMainAudio: () => Promise<void>;
    stopStream: (
        sourcesRef: MutableRefObject<AudioBufferSourceNode[]>,
        iteratorRef: MutableRefObject<SynthAudioBatchIterator | null>,
        options?: { awaitCancel?: boolean },
    ) => Promise<void>;
    playStream: (
        iterator: SynthAudioBatchIterator,
        target: CompareStreamTarget,
    ) => Promise<void>;
    reportUnavailable: () => void;
    reportMissingSoundFont: () => void;
    reportPlaybackError: (side: CompareSide, error: unknown) => void;
};

export function useCompareTransport(options: CompareTransportOptions) {
    const optionsRef = useRef(options);
    useLayoutEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const [leftIsPlaying, setLeftIsPlayingState] = useState(false);
    const [leftIsPaused, setLeftIsPausedState] = useState(false);
    const [leftIsBusy, setLeftIsBusy] = useState(false);
    const [rightIsPlaying, setRightIsPlayingState] = useState(false);
    const [rightIsPaused, setRightIsPausedState] = useState(false);
    const [rightIsBusy, setRightIsBusy] = useState(false);
    const leftIsPlayingRef = useRef(false);
    const leftIsPausedRef = useRef(false);
    const rightIsPlayingRef = useRef(false);
    const rightIsPausedRef = useRef(false);
    const leftSourcesRef = useRef<AudioBufferSourceNode[]>([]);
    const leftIteratorRef = useRef<SynthAudioBatchIterator | null>(null);
    const leftGenerationRef = useRef(0);
    const rightSourcesRef = useRef<AudioBufferSourceNode[]>([]);
    const rightIteratorRef = useRef<SynthAudioBatchIterator | null>(null);
    const rightGenerationRef = useRef(0);

    const setLeftIsPlaying = useCallback((value: boolean) => {
        leftIsPlayingRef.current = value;
        setLeftIsPlayingState(value);
    }, []);
    const setLeftIsPaused = useCallback((value: boolean) => {
        leftIsPausedRef.current = value;
        setLeftIsPausedState(value);
    }, []);
    const setRightIsPlaying = useCallback((value: boolean) => {
        rightIsPlayingRef.current = value;
        setRightIsPlayingState(value);
    }, []);
    const setRightIsPaused = useCallback((value: boolean) => {
        rightIsPausedRef.current = value;
        setRightIsPausedState(value);
    }, []);

    const getSideTransport = useCallback((side: CompareSide) => (side === 'left' ? {
        isPlayingRef: leftIsPlayingRef,
        isPausedRef: leftIsPausedRef,
        setIsPlaying: setLeftIsPlaying,
        setIsPaused: setLeftIsPaused,
        setIsBusy: setLeftIsBusy,
        sourcesRef: leftSourcesRef,
        iteratorRef: leftIteratorRef,
        generationRef: leftGenerationRef,
    } : {
        isPlayingRef: rightIsPlayingRef,
        isPausedRef: rightIsPausedRef,
        setIsPlaying: setRightIsPlaying,
        setIsPaused: setRightIsPaused,
        setIsBusy: setRightIsBusy,
        sourcesRef: rightSourcesRef,
        iteratorRef: rightIteratorRef,
        generationRef: rightGenerationRef,
    }), [setLeftIsPaused, setLeftIsPlaying, setRightIsPaused, setRightIsPlaying]);

    const stopSideAudio = useCallback(async (
        side: CompareSide,
        stopOptions?: { awaitCancel?: boolean },
    ) => {
        const transport = getSideTransport(side);
        transport.generationRef.current += 1;
        await optionsRef.current.stopStream(
            transport.sourcesRef,
            transport.iteratorRef,
            stopOptions,
        );
        transport.setIsPlaying(false);
        transport.setIsPaused(false);
        transport.setIsBusy(false);
    }, [getSideTransport]);

    const pauseSideAudio = useCallback(async (side: CompareSide) => {
        const audioContext = optionsRef.current.audioContextRef.current;
        if (audioContext?.state === 'running') {
            await audioContext.suspend();
        }
        getSideTransport(side).setIsPaused(true);
    }, [getSideTransport]);

    const resumeSideAudio = useCallback(async (side: CompareSide) => {
        const audioContext = optionsRef.current.audioContextRef.current;
        if (audioContext?.state === 'suspended') {
            await audioContext.resume();
        }
        getSideTransport(side).setIsPaused(false);
    }, [getSideTransport]);

    const playSideAudio = useCallback(async (side: CompareSide) => {
        const transport = getSideTransport(side);
        const targetScore = optionsRef.current.scores[side];
        if (!targetScore?.synthAudioBatch) {
            optionsRef.current.reportUnavailable();
            return;
        }

        // Claim the attempt before soundfont and iterator setup so close, replacement,
        // or a newer play request can invalidate it before any audio starts.
        const generation = ++transport.generationRef.current;
        const isCurrent = () => transport.generationRef.current === generation;
        try {
            transport.setIsBusy(true);
            const soundFontReady = await optionsRef.current.ensureSoundFontLoaded(
                targetScore,
                { forceRetry: true },
            );
            if (!isCurrent()) {
                return;
            }
            if (!soundFontReady) {
                optionsRef.current.reportMissingSoundFont();
                return;
            }

            await optionsRef.current.stopMainAudio();
            if (!isCurrent()) {
                return;
            }
            const otherSide = side === 'left' ? 'right' : 'left';
            await stopSideAudio(otherSide, { awaitCancel: true });
            if (!isCurrent()) {
                return;
            }

            const iterator = await targetScore.synthAudioBatch(
                0,
                optionsRef.current.batchSize,
            ) as SynthAudioBatchIterator;
            if (!isCurrent()) {
                await Promise.resolve(iterator(true)).catch(() => {});
                return;
            }
            await optionsRef.current.playStream(iterator, {
                sourcesRef: transport.sourcesRef,
                iteratorRef: transport.iteratorRef,
                generationRef: transport.generationRef,
                setIsPlaying: transport.setIsPlaying,
                setIsPaused: transport.setIsPaused,
                debugLabel: `compare-${side}`,
            });
        } catch (error) {
            if (isCurrent()) {
                optionsRef.current.reportPlaybackError(side, error);
                await stopSideAudio(side, { awaitCancel: true });
            }
        } finally {
            transport.setIsBusy(false);
        }
    }, [getSideTransport, stopSideAudio]);

    const toggleSidePlayPause = useCallback(async (side: CompareSide) => {
        const transport = getSideTransport(side);
        if (transport.isPlayingRef.current && !transport.isPausedRef.current) {
            await pauseSideAudio(side);
            return;
        }
        if (transport.isPausedRef.current) {
            await resumeSideAudio(side);
            return;
        }
        await playSideAudio(side);
    }, [getSideTransport, pauseSideAudio, playSideAudio, resumeSideAudio]);

    const previousLeftScoreRef = useRef<Score | null>(null);
    const previousRightScoreRef = useRef<Score | null>(null);
    useEffect(() => {
        if (previousLeftScoreRef.current && previousLeftScoreRef.current !== options.scores.left) {
            void stopSideAudio('left');
        }
        previousLeftScoreRef.current = options.scores.left;
    }, [options.scores.left, stopSideAudio]);
    useEffect(() => {
        if (previousRightScoreRef.current && previousRightScoreRef.current !== options.scores.right) {
            void stopSideAudio('right');
        }
        previousRightScoreRef.current = options.scores.right;
    }, [options.scores.right, stopSideAudio]);

    return {
        left: {
            isPlaying: leftIsPlaying,
            isPaused: leftIsPaused,
            isBusy: leftIsBusy,
        } satisfies CompareTransportState,
        right: {
            isPlaying: rightIsPlaying,
            isPaused: rightIsPaused,
            isBusy: rightIsBusy,
        } satisfies CompareTransportState,
        playSideAudio,
        stopSideAudio,
        toggleSidePlayPause,
    };
}
