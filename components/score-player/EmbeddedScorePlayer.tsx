'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type {
    PlaybackTimeline,
    Positions,
    Score,
    SynthAudioBatchIterator,
} from '@/lib/webmscore-loader';
import { loadWebMscore } from '@/lib/webmscore-loader';
import { sanitizeEngineSvg } from '@/lib/sanitize-svg';
import { detectScoreInputFormat, resolvePublicScoreUrl } from '@/lib/public-score-url';
import { DEFAULT_RENDER_WINDOW } from '@/lib/playback-window';
import { SoundFontManager } from '@/lib/playback/soundfont-manager';
import {
    cancelSynthStream,
    scheduleSynthBatchStream,
} from '@/lib/playback/stream-scheduler';
import {
    occurrenceAtTime,
    occurrenceForMeasure,
    timelineFromPositions,
} from '@/lib/playback/timeline';
import {
    clampScorePosition,
    scoreTimeAt,
    type TransportClockAnchor,
} from '@/lib/playback/transport-clock';
import PlayerControls from './PlayerControls';

type TransportKind = 'idle' | 'preparing' | 'playing' | 'paused' | 'ended' | 'unavailable';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function EmbeddedScorePlayer() {
    const searchParams = useSearchParams();
    const scoreUrl = searchParams.get('score') ?? '';
    const configuredStartSeconds = Number(searchParams.get('start') ?? 0);
    const initialFollow = searchParams.get('follow') !== '0';
    const theme = ['light', 'dark'].includes(searchParams.get('theme') ?? '')
        ? searchParams.get('theme')!
        : '';

    const [score, setScore] = useState<Score | null>(null);
    const scoreRef = useRef<Score | null>(null);
    const [svg, setSvg] = useState('');
    const [positions, setPositions] = useState<Positions | null>(null);
    const [timeline, setTimeline] = useState<PlaybackTimeline | null>(null);
    const [title, setTitle] = useState('Score playback');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(1);
    const [zoom, setZoom] = useState(1);
    const [follow, setFollow] = useState(initialFollow);
    const [transport, setTransport] = useState<TransportKind>('idle');
    const transportRef = useRef<TransportKind>('idle');
    const [positionMs, setPositionMs] = useState(0);
    const positionRef = useRef(0);
    const [volume, setVolume] = useState(1);
    const [audioMessage, setAudioMessage] = useState('');

    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const sourcesRef = useRef<AudioBufferSourceNode[]>([]);
    const iteratorRef = useRef<SynthAudioBatchIterator | null>(null);
    const loadGenerationRef = useRef(0);
    const playbackAttemptRef = useRef(0);
    const streamGenerationRef = useRef(0);
    const clockRef = useRef<TransportClockAnchor | null>(null);
    const soundFontManagerRef = useRef<SoundFontManager<Score> | null>(null);
    if (!soundFontManagerRef.current) soundFontManagerRef.current = new SoundFontManager<Score>();
    const startMsRef = useRef(0);
    const renderGenerationRef = useRef(0);

    const setTransportState = useCallback((next: TransportKind) => {
        transportRef.current = next;
        setTransport(next);
    }, []);
    const publishPosition = useCallback((next: number) => {
        const duration = timeline?.durationMs ?? 0;
        const clamped = clampScorePosition(next, duration);
        positionRef.current = clamped;
        setPositionMs(clamped);
    }, [timeline?.durationMs]);

    useEffect(() => {
        const stored = Number(window.localStorage.getItem('ots-player-volume'));
        if (Number.isFinite(stored)) setVolume(clamp(stored, 0, 1));
    }, []);

    useEffect(() => {
        if (gainNodeRef.current) gainNodeRef.current.gain.value = volume;
        window.localStorage.setItem('ots-player-volume', String(volume));
    }, [volume]);

    useEffect(() => {
        if (!scoreUrl) {
            setLoading(false);
            setError('No score URL was provided.');
            return;
        }
        const controller = new AbortController();
        const generation = ++loadGenerationRef.current;
        let loadedScore: Score | null = null;
        setScore(null);
        setSvg('');
        setPositions(null);
        setTimeline(null);
        setLoading(true);
        setError('');

        void (async () => {
            try {
                const webMscore = await loadWebMscore();
                const response = await fetch(resolvePublicScoreUrl(scoreUrl), { signal: controller.signal });
                if (!response.ok) throw new Error(`The score could not be fetched (${response.status}).`);
                const bytes = new Uint8Array(await response.arrayBuffer());
                const format = detectScoreInputFormat(scoreUrl, bytes);
                loadedScore = await webMscore.load(format, bytes);
                if (controller.signal.aborted || loadGenerationRef.current !== generation) {
                    loadedScore.destroy();
                    loadedScore = null;
                    return;
                }

                scoreRef.current = loadedScore;
                setScore(loadedScore);
                const [metadata, pageTotal, measurePositions] = await Promise.all([
                    loadedScore.metadata().catch(() => ({})),
                    loadedScore.npages
                        ? Promise.resolve(loadedScore.npages()).catch(() => 1)
                        : Promise.resolve(1),
                    loadedScore.measurePositions().catch(() => null),
                ]);
                if (controller.signal.aborted || loadGenerationRef.current !== generation) return;

                const metadataRecord = metadata as Record<string, unknown>;
                if (typeof metadataRecord.title === 'string' && metadataRecord.title.trim()) {
                    setTitle(metadataRecord.title.trim());
                }
                const metadataDurationMs = typeof metadataRecord.duration === 'number'
                    ? Math.max(0, metadataRecord.duration * 1000)
                    : 0;
                const nativeTimeline = loadedScore.playbackTimeline
                    ? await Promise.resolve(loadedScore.playbackTimeline()).catch(() => null)
                    : null;
                const nextTimeline = nativeTimeline ?? timelineFromPositions(measurePositions, metadataDurationMs);
                setPositions(measurePositions);
                setTimeline(nextTimeline);
                setPageCount(Math.max(1, Number(pageTotal) || 1));
                const requestedStart = Number.isFinite(configuredStartSeconds) ? configuredStartSeconds * 1000 : 0;
                const initialPosition = clamp(requestedStart, 0, nextTimeline.durationMs);
                startMsRef.current = initialPosition;
                positionRef.current = initialPosition;
                setPositionMs(initialPosition);
                const initialOccurrence = occurrenceAtTime(nextTimeline, initialPosition);
                const initialPage = initialOccurrence && measurePositions
                    ? measurePositions.elements[initialOccurrence.measureIndex]?.page ?? 0
                    : 0;
                setCurrentPage(clamp(initialPage, 0, Math.max(0, Number(pageTotal) - 1)));

                void soundFontManagerRef.current?.prefetch(controller.signal).catch(() => null);
                setLoading(false);
            } catch (loadError) {
                if (controller.signal.aborted) return;
                setError(loadError instanceof Error ? loadError.message : 'The score could not be loaded.');
                setLoading(false);
                loadedScore?.destroy();
                loadedScore = null;
            }
        })();

        return () => {
            controller.abort();
            loadGenerationRef.current += 1;
            playbackAttemptRef.current += 1;
            const ownedScore = loadedScore;
            const ownedAudioContext = audioContextRef.current;
            const ownedGainNode = gainNodeRef.current;
            audioContextRef.current = null;
            gainNodeRef.current = null;
            void cancelSynthStream({
                sourcesRef,
                iteratorRef,
                generationRef: streamGenerationRef,
            }, { awaitCancel: true }).finally(() => {
                ownedGainNode?.disconnect();
                if (ownedAudioContext && ownedAudioContext.state !== 'closed') {
                    void ownedAudioContext.close();
                }
                ownedScore?.destroy();
                if (scoreRef.current === ownedScore) scoreRef.current = null;
            });
        };
    }, [configuredStartSeconds, scoreUrl]);

    useEffect(() => {
        if (!score) return;
        const generation = ++renderGenerationRef.current;
        void score.saveSvg(currentPage, true, false)
            .then((rendered) => {
                if (renderGenerationRef.current === generation) setSvg(sanitizeEngineSvg(rendered));
            })
            .catch((renderError) => {
                if (renderGenerationRef.current === generation) {
                    setError(renderError instanceof Error ? renderError.message : 'This score page could not be rendered.');
                }
            });
    }, [currentPage, score]);

    const ensureAudioContext = useCallback(async () => {
        const audioContext = audioContextRef.current ?? new AudioContext({ sampleRate: 44100 });
        audioContextRef.current = audioContext;
        if (!gainNodeRef.current) {
            const gain = audioContext.createGain();
            gain.gain.value = volume;
            gain.connect(audioContext.destination);
            gainNodeRef.current = gain;
        }
        if (audioContext.state === 'suspended') await audioContext.resume();
        return audioContext;
    }, [volume]);

    const ensureSoundFont = useCallback(async () => {
        const activeScore = scoreRef.current;
        if (!activeScore?.setSoundFont) return false;
        setAudioMessage('Preparing audio…');
        const ready = await soundFontManagerRef.current?.ensure(activeScore, {
            forceRetry: transportRef.current === 'unavailable',
        }) ?? false;
        if (!ready) return false;
        setAudioMessage('');
        return true;
    }, []);

    const stopAt = useCallback(async (targetMs: number, nextState: TransportKind = 'idle') => {
        playbackAttemptRef.current += 1;
        await cancelSynthStream({
            sourcesRef,
            iteratorRef,
            generationRef: streamGenerationRef,
        }, { awaitCancel: true });
        clockRef.current = null;
        publishPosition(targetMs);
        setTransportState(nextState);
    }, [publishPosition, setTransportState]);

    const playFrom = useCallback(async (targetMs: number) => {
        const activeScore = scoreRef.current;
        if (!activeScore?.synthAudioBatch) {
            setAudioMessage('Streamed playback is unavailable in this build.');
            setTransportState('unavailable');
            return;
        }
        const attempt = ++playbackAttemptRef.current;
        setTransportState('preparing');
        setAudioMessage('Preparing audio…');
        try {
            const ready = await ensureSoundFont();
            if (!ready || attempt !== playbackAttemptRef.current) {
                if (!ready && attempt === playbackAttemptRef.current) {
                    setAudioMessage('Playback soundfont is unavailable.');
                    setTransportState('unavailable');
                }
                return;
            }
            await cancelSynthStream({
                sourcesRef,
                iteratorRef,
                generationRef: streamGenerationRef,
            }, { awaitCancel: true });
            if (attempt !== playbackAttemptRef.current) return;
            const audioContext = await ensureAudioContext();
            const iterator = await activeScore.synthAudioBatch(targetMs / 1000, 2) as SynthAudioBatchIterator;
            if (attempt !== playbackAttemptRef.current) {
                await iterator(true).catch(() => {});
                return;
            }
            publishPosition(targetMs);
            setAudioMessage('');
            await scheduleSynthBatchStream(iterator, audioContext, {
                sourcesRef,
                iteratorRef,
                generationRef: streamGenerationRef,
                debugLabel: 'embedded-player',
                renderWindow: DEFAULT_RENDER_WINDOW,
                destination: gainNodeRef.current ?? undefined,
                onClockAnchor: (anchor) => { clockRef.current = anchor; },
                onPlayingChange: (playing) => {
                    if (playing) setTransportState('playing');
                },
                onPausedChange: (paused) => {
                    if (paused) setTransportState('paused');
                },
                onEnded: () => {
                    publishPosition(timeline?.durationMs ?? positionRef.current);
                    setTransportState('ended');
                },
            });
        } catch (playError) {
            if (attempt !== playbackAttemptRef.current) return;
            setAudioMessage(playError instanceof Error ? playError.message : 'Playback could not start.');
            setTransportState('unavailable');
        }
    }, [ensureAudioContext, ensureSoundFont, publishPosition, setTransportState, timeline?.durationMs]);

    const togglePlayPause = useCallback(async () => {
        if (transportRef.current === 'playing') {
            const context = audioContextRef.current;
            if (context?.state === 'running') await context.suspend();
            setTransportState('paused');
            return;
        }
        if (transportRef.current === 'paused') {
            const context = audioContextRef.current;
            if (context?.state === 'suspended') await context.resume();
            setTransportState('playing');
            return;
        }
        const target = transportRef.current === 'ended' ? startMsRef.current : positionRef.current;
        void playFrom(target);
    }, [playFrom, setTransportState]);

    const seek = useCallback((targetMs: number) => {
        const wasActive = transportRef.current === 'playing' || transportRef.current === 'paused';
        void stopAt(targetMs).then(() => {
            if (wasActive) void playFrom(targetMs);
        });
    }, [playFrom, stopAt]);

    useEffect(() => {
        if (transport !== 'playing') return;
        let frame = 0;
        const update = () => {
            const context = audioContextRef.current;
            const anchor = clockRef.current;
            if (context && anchor) {
                const scoreTime = scoreTimeAt(anchor, context.currentTime);
                if (scoreTime !== null) publishPosition(scoreTime * 1000);
            }
            frame = window.requestAnimationFrame(update);
        };
        frame = window.requestAnimationFrame(update);
        return () => window.cancelAnimationFrame(frame);
    }, [publishPosition, transport]);

    const activeOccurrence = useMemo(() => occurrenceAtTime(timeline, positionMs), [positionMs, timeline]);
    const activeMeasure = activeOccurrence && positions
        ? positions.elements[activeOccurrence.measureIndex] ?? null
        : null;

    useEffect(() => {
        if (!follow || !activeMeasure || activeMeasure.page === currentPage) return;
        setCurrentPage(clamp(activeMeasure.page, 0, pageCount - 1));
    }, [activeMeasure, currentPage, follow, pageCount]);

    const visibleMeasures = useMemo(
        () => positions?.elements.filter((element) => element.page === currentPage) ?? [],
        [currentPage, positions],
    );

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === ' ' && !(event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement)) {
                event.preventDefault();
                void togglePlayPause();
            } else if (event.key === 'Home') {
                event.preventDefault();
                void stopAt(startMsRef.current);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [stopAt, togglePlayPause]);

    const pageSize = positions?.pageSize;
    const rootTheme = theme === 'dark' ? 'dark bg-slate-950' : theme === 'light' ? 'bg-slate-100' : 'bg-slate-100 dark:bg-slate-950';

    return (
        <main className={`flex h-screen min-h-0 flex-col text-slate-900 dark:text-slate-100 ${rootTheme}`} data-testid="embedded-score-player">
            <h1 className="sr-only">{title}</h1>
            <div className="relative min-h-0 flex-1 overflow-auto p-3 sm:p-6">
                {loading && <div className="flex h-full items-center justify-center text-sm text-slate-600" role="status">Loading score…</div>}
                {error && <div className="mx-auto mt-10 max-w-xl rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800" role="alert">{error}</div>}
                {!loading && !error && (
                    <div className="mx-auto origin-top" style={{ width: `${zoom * 100}%`, maxWidth: zoom <= 1 ? '100%' : 'none' }}>
                        <div className="relative mx-auto w-fit max-w-full overflow-hidden bg-white shadow-lg">
                            <div className="[&_svg]:block [&_svg]:h-auto [&_svg]:max-w-full" data-testid="player-svg" dangerouslySetInnerHTML={{ __html: svg }} />
                            {pageSize && (
                                <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${pageSize.width} ${pageSize.height}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                                    {visibleMeasures.map((measure) => (
                                        <rect
                                            key={measure.id}
                                            x={measure.x}
                                            y={measure.y}
                                            width={measure.width ?? measure.sx}
                                            height={measure.height ?? measure.sy}
                                            fill="transparent"
                                            pointerEvents="all"
                                            className="cursor-pointer"
                                            onClick={() => {
                                                const occurrence = occurrenceForMeasure(timeline, measure.id, positionRef.current);
                                                if (occurrence) seek(occurrence.startMs);
                                            }}
                                        />
                                    ))}
                                    {activeMeasure?.page === currentPage && (
                                        <g pointerEvents="none">
                                            <rect x={activeMeasure.x} y={activeMeasure.y} width={activeMeasure.width ?? activeMeasure.sx} height={activeMeasure.height ?? activeMeasure.sy} fill="rgb(8 145 178 / 0.13)" stroke="rgb(8 145 178 / 0.8)" strokeWidth="2" />
                                            <line x1={activeMeasure.x} y1={activeMeasure.y} x2={activeMeasure.x} y2={activeMeasure.y + (activeMeasure.height ?? activeMeasure.sy)} stroke="rgb(8 145 178)" strokeWidth="4" />
                                        </g>
                                    )}
                                </svg>
                            )}
                        </div>
                    </div>
                )}
                {audioMessage && <div className="pointer-events-none sticky bottom-2 mx-auto mt-2 w-fit rounded-full bg-slate-900/85 px-3 py-1 text-xs text-white" role={transport === 'unavailable' ? 'alert' : 'status'}>{audioMessage}</div>}
            </div>
            <PlayerControls
                state={transport}
                disabled={loading || Boolean(error) || !score}
                positionMs={positionMs}
                durationMs={timeline?.durationMs ?? 0}
                volume={volume}
                currentPage={currentPage}
                pageCount={pageCount}
                follow={follow}
                onTogglePlayPause={() => void togglePlayPause()}
                onStop={() => void stopAt(startMsRef.current)}
                onSeek={seek}
                onVolume={setVolume}
                onPreviousPage={() => { setFollow(false); setCurrentPage((page) => Math.max(0, page - 1)); }}
                onNextPage={() => { setFollow(false); setCurrentPage((page) => Math.min(pageCount - 1, page + 1)); }}
                onZoomOut={() => setZoom((value) => clamp(value - 0.1, 0.5, 2.5))}
                onFitWidth={() => setZoom(1)}
                onZoomIn={() => setZoom((value) => clamp(value + 0.1, 0.5, 2.5))}
                onToggleFollow={() => setFollow((value) => !value)}
            />
        </main>
    );
}
