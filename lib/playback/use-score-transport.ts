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
    const generationRef = useRef(0);
    const clockRef = useRef<TransportClockAnchor | null>(null);
    const soundFontManagerRef = useRef(options.soundFontManager ?? new SoundFontManager<Score>());

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
    }, [options.volume]);

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
        playbackAttemptRef.current += 1;
        await cancelSynthStream({ sourcesRef, iteratorRef, generationRef }, { awaitCancel });
        clockRef.current = null;
    }, []);

    const stopAt = useCallback(async (
        targetMs: number,
        nextState: ScoreTransportState = 'idle',
    ) => {
        await cancel(true);
        publishPosition(targetMs);
        publishState(nextState);
    }, [cancel, publishPosition, publishState]);

    const playFrom = useCallback(async (targetMs: number, forceRetry = false) => {
        const activeScore = scoreRef.current;
        if (!activeScore?.synthAudioBatch) {
            messageRef.current?.('Streamed playback is unavailable in this build.');
            publishState('unavailable');
            return;
        }
        const attempt = ++playbackAttemptRef.current;
        publishState('preparing');
        messageRef.current?.('Preparing audio…');
        try {
            const ready = await soundFontManagerRef.current.ensure(activeScore, { forceRetry });
            if (!ready || attempt !== playbackAttemptRef.current) {
                if (!ready && attempt === playbackAttemptRef.current) {
                    messageRef.current?.('Playback soundfont is unavailable.');
                    publishState('unavailable');
                }
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
                onPlayingChange: (playing) => {
                    if (
                        playing
                        && attempt === playbackAttemptRef.current
                        && stateRef.current === 'preparing'
                    ) publishState('playing');
                },
                onEnded: () => {
                    if (attempt !== playbackAttemptRef.current) return;
                    publishPosition(durationRef.current);
                    publishState('ended');
                },
            });
        } catch (error) {
            if (attempt !== playbackAttemptRef.current) return;
            messageRef.current?.(error instanceof Error ? error.message : 'Playback could not start.');
            publishState('unavailable');
        }
    }, [ensureAudioContext, publishPosition, publishState]);

    const togglePlayPause = useCallback(async () => {
        const priorState = stateRef.current;
        if (priorState === 'playing') {
            if (audioContextRef.current?.state === 'running') await audioContextRef.current.suspend();
            publishState('paused');
            return;
        }
        if (priorState === 'paused' && iteratorRef.current) {
            if (audioContextRef.current?.state === 'suspended') await audioContextRef.current.resume();
            publishState('playing');
            return;
        }
        const target = priorState === 'ended' ? startRef.current : positionRef.current;
        await playFrom(target, priorState === 'unavailable');
    }, [playFrom, publishState]);

    const seek = useCallback((targetMs: number) => {
        const priorState = stateRef.current;
        if (priorState === 'paused') {
            void stopAt(targetMs, 'paused');
            return;
        }
        const shouldResume = priorState === 'playing';
        void stopAt(targetMs).then(() => {
            if (shouldResume) void playFrom(targetMs);
        });
    }, [playFrom, stopAt]);

    const reset = useCallback((targetMs: number, durationMs = durationRef.current) => {
        durationRef.current = durationMs;
        startRef.current = targetMs;
        publishPosition(targetMs);
        publishState('idle');
    }, [publishPosition, publishState]);

    const prefetchSoundFont = useCallback((signal?: AbortSignal) => (
        soundFontManagerRef.current.prefetch(signal)
    ), []);

    const dispose = useCallback(async () => {
        await cancel(true);
        const context = audioContextRef.current;
        const gain = gainNodeRef.current;
        audioContextRef.current = null;
        gainNodeRef.current = null;
        try { gain?.disconnect(); } catch { /* already disconnected */ }
        if (context && context.state !== 'closed') await context.close().catch(() => {});
    }, [cancel]);

    useEffect(() => () => {
        void dispose();
    }, [dispose]);

    useEffect(() => {
        if (state !== 'playing') return;
        let frame = window.requestAnimationFrame(function update() {
            const context = audioContextRef.current;
            const anchor = clockRef.current;
            if (context && anchor) {
                const scoreTime = scoreTimeAt(anchor, context.currentTime);
                if (scoreTime !== null) publishPosition(scoreTime * 1000);
            }
            frame = window.requestAnimationFrame(update);
        });
        return () => window.cancelAnimationFrame(frame);
    }, [publishPosition, state]);

    return {
        state,
        stateRef,
        positionMs,
        positionRef,
        togglePlayPause,
        stopAt,
        seek,
        reset,
        dispose,
        prefetchSoundFont,
    };
}
