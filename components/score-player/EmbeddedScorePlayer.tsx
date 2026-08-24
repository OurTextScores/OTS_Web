'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type {
    PlaybackTimeline,
    Positions,
    Score,
} from '@/lib/webmscore-loader';
import { sanitizeEngineSvg } from '@/lib/sanitize-svg';
import { loadScoreFromUrl, requestScoreLayoutProgress } from '@/lib/score-loader';
import {
    occurrenceAtTime,
    occurrenceForMeasure,
    timelineFromPositions,
} from '@/lib/playback/timeline';
import { useScoreTransport } from '@/lib/playback/use-score-transport';
import PlayerControls from './PlayerControls';

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
    const [progressiveHasMorePages, setProgressiveHasMorePages] = useState(false);
    const [pageLoadBusy, setPageLoadBusy] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [follow, setFollow] = useState(initialFollow);
    const [volume, setVolume] = useState(1);
    const [audioMessage, setAudioMessage] = useState('');
    const loadGenerationRef = useRef(0);
    const startMsRef = useRef(0);
    const renderGenerationRef = useRef(0);
    const renderPromiseRef = useRef<Promise<void> | null>(null);
    const renderPromisesRef = useRef(new Set<Promise<void>>());
    const transportController = useScoreTransport({
        score,
        durationMs: timeline?.durationMs ?? 0,
        startMs: startMsRef.current,
        volume,
        onMessage: setAudioMessage,
    });
    const {
        state: transport,
        positionMs,
        positionRef,
        togglePlayPause,
        stopAt,
        seek,
        reset: resetTransport,
        dispose: disposeTransport,
        prefetchSoundFont,
    } = transportController;

    useEffect(() => {
        const stored = Number(window.localStorage.getItem('ots-player-volume'));
        if (Number.isFinite(stored)) setVolume(clamp(stored, 0, 1));
    }, []);

    useEffect(() => {
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
        const ownedRenderPromises = renderPromisesRef.current;
        let loadedScore: Score | null = null;
        setScore(null);
        setSvg('');
        setPositions(null);
        setTimeline(null);
        setProgressiveHasMorePages(false);
        setLoading(true);
        setError('');

        void (async () => {
            try {
                const loadResult = await loadScoreFromUrl(scoreUrl, { signal: controller.signal });
                loadedScore = loadResult.loadedScore;
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
                const availablePages = loadResult.progressivePaging
                    ? loadResult.initialAvailablePages
                    : Number(pageTotal);
                setPageCount(Math.max(1, availablePages || 1));
                setProgressiveHasMorePages(loadResult.progressivePaging && loadResult.progressiveHasMore);
                const requestedStart = Number.isFinite(configuredStartSeconds) ? configuredStartSeconds * 1000 : 0;
                const initialPosition = clamp(requestedStart, 0, nextTimeline.durationMs);
                startMsRef.current = initialPosition;
                resetTransport(initialPosition, nextTimeline.durationMs);
                const initialOccurrence = occurrenceAtTime(nextTimeline, initialPosition);
                const initialPage = initialOccurrence && measurePositions
                    ? measurePositions.elements[initialOccurrence.measureIndex]?.page ?? 0
                    : 0;
                setCurrentPage(clamp(initialPage, 0, Math.max(0, Number(pageTotal) - 1)));

                void prefetchSoundFont(controller.signal).catch(() => null);
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
            const ownedScore = loadedScore;
            renderGenerationRef.current += 1;
            const pendingRenders = [...ownedRenderPromises];
            void Promise.allSettled([disposeTransport(), ...pendingRenders]).finally(() => {
                ownedScore?.destroy();
                if (scoreRef.current === ownedScore) scoreRef.current = null;
            });
        };
    }, [configuredStartSeconds, disposeTransport, prefetchSoundFont, resetTransport, scoreUrl]);

    useEffect(() => {
        if (!score) return;
        const generation = ++renderGenerationRef.current;
        const renderPromise = score.saveSvg(currentPage, true, false)
            .then((rendered) => {
                if (renderGenerationRef.current === generation) setSvg(sanitizeEngineSvg(rendered));
            })
            .catch((renderError) => {
                if (renderGenerationRef.current === generation) {
                    setError(renderError instanceof Error ? renderError.message : 'This score page could not be rendered.');
                }
            });
        renderPromiseRef.current = renderPromise;
        renderPromisesRef.current.add(renderPromise);
        void renderPromise.finally(() => {
            if (renderPromiseRef.current === renderPromise) renderPromiseRef.current = null;
            renderPromisesRef.current.delete(renderPromise);
        });
    }, [currentPage, score]);

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
    const goToNextPage = async () => {
        setFollow(false);
        const nextPage = currentPage + 1;
        if (nextPage < pageCount) {
            setCurrentPage(nextPage);
            return;
        }
        const activeScore = scoreRef.current;
        if (!activeScore || !progressiveHasMorePages || pageLoadBusy) return;
        setPageLoadBusy(true);
        try {
            await (renderPromiseRef.current ?? Promise.resolve());
            if (scoreRef.current !== activeScore) return;
            const progress = await requestScoreLayoutProgress(activeScore, nextPage);
            if (scoreRef.current !== activeScore) return;
            setPageCount(Math.max(pageCount, progress.availablePages));
            setProgressiveHasMorePages(progress.hasMorePages);
            if (progress.targetSatisfied) {
                setCurrentPage(nextPage);
                const nextPositions = await activeScore.measurePositions().catch(() => null);
                if (scoreRef.current === activeScore && nextPositions) setPositions(nextPositions);
            }
        } catch (pageError) {
            setError(pageError instanceof Error ? pageError.message : 'The next score page could not be laid out.');
        } finally {
            setPageLoadBusy(false);
        }
    };

    return (
        <main
            className="ots-score-player flex h-screen min-h-0 flex-col bg-[var(--player-canvas)] text-[var(--player-text)]"
            data-theme={theme || undefined}
            data-testid="embedded-score-player"
        >
            <h1 className="sr-only">{title}</h1>
            <div className="relative min-h-0 flex-1 overflow-auto p-3 sm:p-6">
                {loading && <div className="flex h-full items-center justify-center text-sm text-[var(--player-muted)]" role="status">Loading score…</div>}
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
                currentMeasureNumber={activeOccurrence ? activeOccurrence.measureIndex + 1 : undefined}
                volume={volume}
                currentPage={currentPage}
                pageCount={pageCount}
                hasMorePages={progressiveHasMorePages}
                follow={follow}
                onTogglePlayPause={() => void togglePlayPause()}
                onStop={() => void stopAt(startMsRef.current)}
                onSeek={seek}
                onVolume={setVolume}
                onPreviousPage={() => { setFollow(false); setCurrentPage((page) => Math.max(0, page - 1)); }}
                onNextPage={() => { void goToNextPage(); }}
                onZoomOut={() => setZoom((value) => clamp(value - 0.1, 0.5, 2.5))}
                onFitWidth={() => setZoom(1)}
                onZoomIn={() => setZoom((value) => clamp(value + 0.1, 0.5, 2.5))}
                onToggleFollow={() => setFollow((value) => !value)}
            />
        </main>
    );
}
