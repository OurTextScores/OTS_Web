'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { loadWebMscore, type Positions, type Score } from '@/lib/webmscore-loader';
import { routeCompareKeyboardShortcut } from './compare-keyboard-policy';
import type { CompareSide, CompareTransportState } from './compare-types';
import type { CompareTransport } from './useCompareTransport';
import {
    measureCount,
    useMergedScoreDocument,
    type MergedScoreState,
} from './useMergedScoreDocument';

/**
 * The scan's systems, with each engine's measures and a crop of the source page.
 * `cropUrl` is relative to the regions document it came from.
 */
export type ScannerSystem = {
    systemIndex: number;
    cropUrl?: string;
    leftMeasureIndexes: number[];
    rightMeasureIndexes: number[];
};

export type ScannerRowRegion = {
    blockIndex: number;
    leftMeasureIndexes: number[];
    rightMeasureIndexes: number[];
    differenceClasses?: string[];
    grounded?: boolean;
    /**
     * Required to decide this block, and withheld by the scanner for any block
     * whose place on the scan could not be proven — so an ungrounded decision
     * cannot be expressed rather than merely being discouraged.
     */
    contentSignature?: string;
    /**
     * What each side actually has to give. A difference class says the two
     * readings disagree about dynamics; it does not say which one has any, and
     * a control offering to take dynamics from a bar with none is worse than no
     * control at all.
     */
    leftMarkings?: { dynamics: boolean; lyrics: boolean };
    rightMarkings?: { dynamics: boolean; lyrics: boolean };
};

const DIFFERENCE_LABELS: Record<string, string> = {
    notation: 'notes or rhythm',
    voice: 'voices',
    staff: 'staff assignment',
    attributes: 'clef, key, time or divisions',
    lyrics: 'lyrics',
    dynamics: 'dynamics',
    directions: 'directions',
    notations: 'slurs, ties or other notation',
    'measure-added': 'only in the second reading',
    'measure-removed': 'only in the first reading',
};

/** Width each engine's score is rendered at before being clipped into rows. */
const RENDER_WIDTH = 1400;

/**
 * Force this engine's line breaks onto the scan's system boundaries.
 *
 * The rows are the scanned page's systems, not either engine's — they break
 * differently, and the question being reviewed is what the page says. Measured
 * before being relied on: MuseScore honoured every forced break on both
 * engines, and forcing fewer measures per line than an engine would choose
 * stretches rather than crowds. See the design's §2.1.
 */
export function withForcedSystemBreaks(xml: string, startMeasureIndexes: number[]): string {
    if (typeof DOMParser === 'undefined' || startMeasureIndexes.length === 0) return xml;
    const starts = new Set(startMeasureIndexes.filter((index) => index > 0));
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length > 0) return xml;
    for (const part of Array.from(doc.getElementsByTagName('part'))) {
        Array.from(part.children)
            .filter((child) => child.tagName === 'measure')
            .forEach((measure, index) => {
                // Whatever the engine wanted is discarded: the scan decides.
                Array.from(measure.getElementsByTagName('print')).forEach((node) =>
                    node.parentElement === measure ? measure.removeChild(node) : undefined,
                );
                if (!starts.has(index)) return;
                const print = doc.createElement('print');
                print.setAttribute('new-system', 'yes');
                measure.insertBefore(print, measure.firstChild);
            });
    }
    return new XMLSerializer().serializeToString(doc);
}

type MeasureBox = { left: number; width: number; top: number; height: number };

type RenderedSide = {
    svg: string;
    /** Pixel bounds per measure index, at RENDER_WIDTH. */
    measures: Array<MeasureBox | undefined>;
    width: number;
    /** Page height in the same scaled pixels, so a click can find its page. */
    pageHeight: number;
    /** RENDER_WIDTH / pageWidth: undoes the scaling to reach score coordinates. */
    renderScale: number;
};

function measureBounds(positions: Positions | null, scale: number): Array<MeasureBox | undefined> {
    if (!positions?.elements?.length) return [];
    const pageHeight = positions.pageSize?.height ?? 0;
    return positions.elements.map((element) => {
        const rawHeight =
            typeof element.sy === 'number' ? element.sy : ((element as any).height ?? 0);
        const rawWidth =
            typeof element.sx === 'number' ? element.sx : ((element as any).width ?? 0);
        // Endless layout still reports per-page coordinates, so a later page's
        // measures would otherwise stack on top of the first.
        const needsPageOffset =
            pageHeight > 0 && element.page > 0 && element.y + rawHeight <= pageHeight * 1.2;
        const top = (element.y + (needsPageOffset ? element.page * pageHeight : 0)) * scale;
        return { left: element.x * scale, width: rawWidth * scale, top, height: rawHeight * scale };
    });
}

/**
 * Draw the score's page at exactly `RENDER_WIDTH`.
 *
 * The measure coordinates below are scaled by `RENDER_WIDTH / pageWidth`, so
 * unless the SVG is drawn at that same width the clip windows point at the
 * wrong part of the page — which renders every row blank, since the systems sit
 * outside the visible band.
 */
function svgAtRenderWidth(svg: string): string {
    return svg.replace(/<svg\b[^>]*>/, (tag) => {
        const withoutSize = tag
            .replace(/\swidth="[^"]*"/i, '')
            .replace(/\sheight="[^"]*"/i, '')
            .replace(/\spreserveAspectRatio="[^"]*"/i, '');
        return withoutSize.replace(
            /^<svg/,
            `<svg width="${RENDER_WIDTH}" preserveAspectRatio="xMinYMin meet"`,
        );
    });
}

/** Draw an already-loaded score; used for the merged document, which is live. */
async function renderScoreSide(score: Score): Promise<RenderedSide | null> {
    const svg = await score.saveSvg(0, true, false);
    const positions = await score.measurePositions();
    const pageWidth = positions?.pageSize?.width || 0;
    const renderScale = pageWidth > 0 ? RENDER_WIDTH / pageWidth : 1;
    return {
        svg: svgAtRenderWidth(svg),
        measures: measureBounds(positions, renderScale),
        width: RENDER_WIDTH,
        pageHeight: (positions?.pageSize?.height ?? 0) * renderScale,
        renderScale,
    };
}

/** Draw an engine reading. Its score is transient: engine panes are evidence. */
async function renderSide(xml: string, startIndexes: number[]): Promise<RenderedSide | null> {
    const WebMscore = await loadWebMscore();
    const reflowed = withForcedSystemBreaks(xml, startIndexes);
    let score: Score | null = null;
    try {
        score = await (WebMscore as any).load('xml', new TextEncoder().encode(reflowed));
        if (!score) return null;
        return await renderScoreSide(score);
    } finally {
        try {
            (score as any)?.destroy?.();
        } catch {
            // A score that will not close is not a reason to lose the rows.
        }
    }
}

type PaneGeometry = {
    /** Left edge of the system's music, in RENDER_WIDTH pixels. */
    left: number;
    top: number;
    scale: number;
};

function SystemPane({
    rendered,
    measureIndexes,
    label,
    paneWidth,
    tone,
    onPointMutate,
    transport,
    onTogglePlay,
}: {
    rendered: RenderedSide | null;
    measureIndexes: number[];
    label: string;
    paneWidth: number;
    tone?: 'merged';
    /** Playback state for this pane, when the workspace supplies a transport. */
    transport?: CompareTransportState;
    onTogglePlay?: () => void;
    /**
     * Score-space coordinates of a click, for the one pane that is editable.
     * Absent on engine panes, which is what makes them read-only: there is no
     * path from a click to a mutation at all, rather than a disabled one.
     */
    onPointMutate?: (point: { page: number; x: number; y: number }) => void;
}) {
    if (measureIndexes.length === 0) {
        return (
            <div className="flex min-h-16 items-center rounded border border-dashed border-gray-300 px-3 text-xs text-gray-500">
                {label} has no measure here.
            </div>
        );
    }
    const boxes = measureIndexes
        .map((index) => rendered?.measures[index])
        .filter((box): box is MeasureBox => Boolean(box));
    if (!rendered || boxes.length === 0) {
        return (
            <div className="flex min-h-16 items-center rounded border border-dashed border-gray-300 px-3 text-xs text-gray-500">
                {label} could not be laid out for this system.
            </div>
        );
    }
    const rawTop = Math.min(...boxes.map((box) => box.top));
    const rawBottom = Math.max(...boxes.map((box) => box.top + box.height));

    // A measure's reported box is the staff, and music leaves it: stems, ledger
    // lines and beams sit above and below. Clipping to the box alone slices the
    // notes off, so the band is padded — but only as far as the halfway point to
    // whatever is rendered next, so a row never shows part of its neighbour.
    const others = rendered.measures.filter(
        (box): box is MeasureBox =>
            Boolean(box) && (box!.top + box!.height <= rawTop || box!.top >= rawBottom),
    );
    const nearestAbove = others
        .filter((box) => box.top + box.height <= rawTop)
        .reduce((closest, box) => Math.max(closest, box.top + box.height), -Infinity);
    const nearestBelow = others
        .filter((box) => box.top >= rawBottom)
        .reduce((closest, box) => Math.min(closest, box.top), Infinity);
    const wanted = (rawBottom - rawTop) * 0.7;
    const top = Math.max(
        0,
        rawTop - (Number.isFinite(nearestAbove) ? Math.min(wanted, (rawTop - nearestAbove) / 2) : wanted),
    );
    const bottom =
        rawBottom +
        (Number.isFinite(nearestBelow) ? Math.min(wanted, (nearestBelow - rawBottom) / 2) : wanted);

    // Clip horizontally to the music, not the page. An engraved page carries
    // margins the scan crop above does not, so without this the reading sits
    // narrower than the scan it is being compared against and the bars do not
    // line up with the image. Scaling that band to the pane puts both on the
    // same horizontal axis.
    const left = Math.min(...boxes.map((box) => box.left));
    const right = Math.max(...boxes.map((box) => box.left + box.width));
    const bandWidth = Math.max(1, right - left);
    const scale = paneWidth > 0 ? paneWidth / bandWidth : 1;
    const geometry: PaneGeometry = { left, top, scale };

    /**
     * Undo everything the pane did to the drawing, to reach score coordinates.
     *
     * The pane shows a clipped, scaled window onto one long endless-layout
     * page, so a click has to be walked back through the pane scale, the clip
     * offset, the render scale, and finally the page stacking that
     * `measureBounds` folded into `top`.
     */
    const toScorePoint = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!rendered) return null;
        const rect = event.currentTarget.getBoundingClientRect();
        const renderX = (event.clientX - rect.left) / geometry.scale + geometry.left;
        const renderY = (event.clientY - rect.top) / geometry.scale + geometry.top;
        const page =
            rendered.pageHeight > 0 ? Math.floor(renderY / rendered.pageHeight) : 0;
        const pageY = renderY - page * rendered.pageHeight;
        return {
            page,
            x: renderX / rendered.renderScale,
            y: pageY / rendered.renderScale,
        };
    };

    return (
        <div
            className={`relative overflow-hidden rounded border bg-white ${
                tone === 'merged' ? 'border-cyan-300 ring-1 ring-cyan-200' : 'border-gray-200'
            } ${onPointMutate ? 'cursor-crosshair' : ''}`}
            style={{ height: Math.max(1, (bottom - top) * scale) }}
            onClick={
                onPointMutate
                    ? (event) => {
                          const point = toScorePoint(event);
                          if (point) onPointMutate(point);
                      }
                    : undefined
            }
            data-testid={tone === 'merged' ? 'merged-system-pane' : undefined}
        >
            <div
                className="absolute left-0 top-0 origin-top-left"
                style={{
                    width: rendered.width,
                    transform: `scale(${scale}) translate(${-left}px, ${-top}px)`,
                }}
                // The SVG comes from the engine build, not from user input.
                dangerouslySetInnerHTML={{ __html: rendered.svg }}
            />
            {onTogglePlay && (
                /*
                    Playback is read-only, so it costs the engine panes nothing
                    — and a wrong pitch or a dropped beat announces itself in a
                    second of audio, which is often faster than reading for it.
                */
                <button
                    type="button"
                    onClick={(event) => {
                        // The merged pane turns a click into an edit; playing it
                        // must not also place a note.
                        event.stopPropagation();
                        onTogglePlay();
                    }}
                    disabled={transport?.isBusy}
                    aria-label={`${transport?.isPlaying && !transport?.isPaused ? 'Pause' : 'Play'} ${label}`}
                    className="absolute right-1 top-1 rounded border border-gray-300 bg-white/90 px-1.5 py-0.5 text-[11px] leading-none shadow-sm hover:bg-white disabled:opacity-50"
                >
                    {transport?.isBusy
                        ? '…'
                        : transport?.isPlaying && !transport?.isPaused
                          ? '❚❚'
                          : '▶'}
                </button>
            )}
        </div>
    );
}

/**
 * The decision surface: one control per difference in this row, on the side it
 * would come from.
 *
 * The arrow points at the merged score, because that is where the bar goes —
 * "take from above" reading downward is the whole reason the merged pane sits
 * in the middle rather than beside the two readings.
 *
 * A difference whose place on the scan could not be proven arrives with no
 * signature, and there is no control for it at all. That is the scanner's rule
 * made visible: a decision without evidence is not offered, rather than offered
 * and refused (design §7).
 */
function Gutter({
    direction,
    label,
    regions,
    engineId,
    onTake,
    busy,
}: {
    direction: 'down' | 'up';
    label: string;
    regions: ScannerRowRegion[];
    engineId?: string;
    onTake: (
        region: ScannerRowRegion,
        engineId: string,
        kind?: 'dynamics' | 'lyrics',
    ) => void;
    busy: boolean;
}) {
    if (regions.length === 0 || !engineId) return null;
    return (
        <div className="flex flex-wrap items-center gap-1 py-0.5 text-[11px] text-gray-600">
            <span className="mr-1 uppercase tracking-wide text-gray-400">
                take from {label}
            </span>
            {regions.map((region) => {
                const decidable = Boolean(region.contentSignature);
                const from = direction === 'down' ? region.leftMarkings : region.rightMarkings;
                const bars =
                    (direction === 'down' ? region.leftMeasureIndexes : region.rightMeasureIndexes)
                        .length;
                const arrow = direction === 'down' ? '↓' : '↑';
                return (
                    <span key={region.blockIndex} className="flex items-center gap-0.5">
                        <button
                            type="button"
                            data-testid={`btn-take-${direction}-${region.blockIndex}`}
                            disabled={!decidable || busy}
                            title={
                                decidable
                                    ? `Take difference ${region.blockIndex + 1} from ${label}`
                                    : 'This difference has no verified place on the scan, so it cannot be decided'
                            }
                            onClick={() => onTake(region, engineId)}
                            className="rounded border border-gray-300 bg-white px-1.5 py-0.5 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {arrow} {region.blockIndex + 1}
                            {bars === 0 ? ' (remove)' : bars > 1 ? ` (${bars} bars)` : ''}
                        </button>
                        {/*
                            Only when this side has any. Dynamics and lyrics are
                            separate judgements — a reviewer may trust one
                            engine's dynamics and the other's words — and an
                            engine that read neither offers neither.
                        */}
                        {decidable && from?.dynamics && (
                            <button
                                type="button"
                                data-testid={`btn-take-${direction}-dynamics-${region.blockIndex}`}
                                disabled={busy}
                                title={`Take only the dynamics of difference ${region.blockIndex + 1} from ${label}, leaving the notes`}
                                onClick={() => onTake(region, engineId, 'dynamics')}
                                className="rounded border border-gray-200 bg-white px-1 py-0.5 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                            >
                                {arrow} dynamics
                            </button>
                        )}
                        {decidable && from?.lyrics && (
                            <button
                                type="button"
                                data-testid={`btn-take-${direction}-lyrics-${region.blockIndex}`}
                                disabled={busy}
                                title={`Take only the lyrics of difference ${region.blockIndex + 1} from ${label}, leaving the notes`}
                                onClick={() => onTake(region, engineId, 'lyrics')}
                                className="rounded border border-gray-200 bg-white px-1 py-0.5 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                            >
                                {arrow} lyrics
                            </button>
                        )}
                    </span>
                );
            })}
        </div>
    );
}

/**
 * The page, one scanned system at a time: the scan, then each engine's reading
 * of it, with the reviewer's merged score between them.
 *
 * The engine panes are evidence and stay read-only — an edited HOMR pane is no
 * longer a record of what HOMR produced, which destroys both the provenance the
 * signature model protects and the training signal phase E depends on. The
 * merged pane is where a correction goes (design §3.1).
 */
export function ScannerSystemRows({
    systems,
    regions,
    leftXml,
    rightXml,
    leftLabel,
    rightLabel,
    leftEngineId,
    rightEngineId,
    merged: mergedState,
    onlyBlockIndex,
    transport,
    onMergedScoreChange,
    resolveUrl,
}: {
    systems: ScannerSystem[];
    regions: ScannerRowRegion[];
    leftXml: string;
    rightXml: string;
    leftLabel: string;
    rightLabel: string;
    leftEngineId?: string;
    rightEngineId?: string;
    merged?: MergedScoreState | null;
    /**
     * Render only the systems one difference falls in.
     *
     * The reviewer clicked that difference; the agreeing lines below it answer
     * a question nobody asked.
     */
    onlyBlockIndex?: number;
    /**
     * Playback for all three panes, owned by the workspace so there is one
     * transport rather than a second competing one. Absent in tests that do not
     * exercise audio.
     */
    transport?: CompareTransport;
    /**
     * The merged score is owned here — this is where it is edited — but the
     * transport lives with the workspace, so it has to be reported upward.
     */
    onMergedScoreChange?: (score: Score | null) => void;
    resolveUrl: (relative: string) => string;
}) {
    const [left, setLeft] = useState<RenderedSide | null>(null);
    const [right, setRight] = useState<RenderedSide | null>(null);
    const [mergedRender, setMergedRender] = useState<RenderedSide | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [noteInput, setNoteInput] = useState(false);
    const [hasSelection, setHasSelection] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);
    const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
    const paneRef = useRef<HTMLDivElement>(null);
    const [paneWidth, setPaneWidth] = useState(0);

    /**
     * Which engine the merged score starts from, wholesale.
     *
     * Not an empty document: a page where one engine is almost right would then
     * cost a decision per bar. Starting from a chosen engine makes "this is a
     * Transcoda page" the ordinary entry point rather than a special action, and
     * per-bar decisions override it from S3 onward.
     */
    const [mergeSource, setMergeSource] = useState<'left' | 'right'>(
        mergedState?.sourceEngineId && mergedState.sourceEngineId === rightEngineId
            ? 'right'
            : 'left',
    );

    const leftStarts = useMemo(
        () => systems.map((system) => system.leftMeasureIndexes[0]).filter((n) => n !== undefined),
        [systems],
    );
    const rightStarts = useMemo(
        () => systems.map((system) => system.rightMeasureIndexes[0]).filter((n) => n !== undefined),
        [systems],
    );

    const mergeStarts = mergeSource === 'left' ? leftStarts : rightStarts;
    const mergeSourceXml = mergeSource === 'left' ? leftXml : rightXml;
    const mergedLabel = mergeSource === 'left' ? leftLabel : rightLabel;
    const mergedEngineId = (mergeSource === 'left' ? leftEngineId : rightEngineId) || '';

    /**
     * Reflow whatever the merged document is onto the scan's systems.
     *
     * The persisted score is saved without imposed breaks, so it needs exactly
     * the same treatment an engine reading does — the rows are a way of reading
     * the page, not a property of any of the three documents.
     */
    const prepare = useCallback(
        (persistedXml: string | null) => {
            const source = persistedXml ?? mergeSourceXml;
            if (!source) return null;
            return {
                xml: withForcedSystemBreaks(source, mergeStarts as number[]),
                baselineMeasures: measureCount(source),
            };
        },
        [mergeSourceXml, mergeStarts],
    );

    const merged = useMergedScoreDocument({
        state: mergedState ?? null,
        resolveUrl,
        prepare,
        sourceEngineId: mergedEngineId,
    });

    const {
        load: loadMerged,
        mutate: mutateMerged,
        score: mergedScore,
        revision: mergedRevision,
    } = merged;

    useEffect(() => {
        if (!leftXml || !rightXml || systems.length === 0) return;
        let cancelled = false;
        setBusy(true);
        setError(null);
        void (async () => {
            try {
                const [renderedLeft, renderedRight] = await Promise.all([
                    renderSide(leftXml, leftStarts as number[]),
                    renderSide(rightXml, rightStarts as number[]),
                ]);
                if (cancelled) return;
                setLeft(renderedLeft);
                setRight(renderedRight);
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : String(err));
            } finally {
                if (!cancelled) setBusy(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [leftXml, rightXml, systems.length, leftStarts, rightStarts]);

    // The merged document is loaded once per source choice; switching engines
    // wholesale is a reload, which is exactly what "starts from" means.
    useEffect(() => {
        if (!mergeSourceXml || systems.length === 0) return;
        void loadMerged();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mergeSourceXml, systems.length, mergeSource]);

    useEffect(() => {
        onMergedScoreChange?.(mergedScore);
    }, [mergedScore, onMergedScoreChange]);

    // Re-render the merged rows after every edit.
    useEffect(() => {
        if (!mergedScore) {
            setMergedRender(null);
            return;
        }
        let cancelled = false;
        void (async () => {
            try {
                const rendered = await renderScoreSide(mergedScore);
                if (!cancelled) setMergedRender(rendered);
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : String(err));
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [mergedScore, mergedRevision]);

    // The gutter is the only index: which differences fall in each system.
    const differencesBySystem = useMemo(() => {
        return systems.map((system) => {
            const left = new Set(system.leftMeasureIndexes);
            const right = new Set(system.rightMeasureIndexes);
            return regions.filter(
                (region) =>
                    region.leftMeasureIndexes.some((index) => left.has(index)) ||
                    region.rightMeasureIndexes.some((index) => right.has(index)),
            );
        });
    }, [systems, regions]);

    /**
     * The systems this view actually shows.
     *
     * Scoped to one difference when the host asked for one — and if that
     * difference has no system at all, which happens when its place on the scan
     * could not be proven, the result is empty and says so rather than silently
     * showing the whole page instead.
     */
    const visibleRows = useMemo(() => {
        const rows = systems.map((system, index) => ({ system, index }));
        if (onlyBlockIndex === undefined) return rows;
        return rows.filter(({ index }) =>
            differencesBySystem[index].some((region) => region.blockIndex === onlyBlockIndex),
        );
    }, [differencesBySystem, onlyBlockIndex, systems]);

    const differingRows = differencesBySystem.reduce(
        (total, entries) => total + (entries.length > 0 ? 1 : 0),
        0,
    );

    useEffect(() => {
        const node = paneRef.current;
        if (!node || typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(() => setPaneWidth(node.clientWidth));
        observer.observe(node);
        setPaneWidth(node.clientWidth);
        return () => observer.disconnect();
    }, []);

    /**
     * Playback for one pane of one row, over that row's measures only.
     *
     * A button on system 7 that started the reading from bar one would answer a
     * question nobody asked — the reviewer is deciding whether *this line*
     * sounds right.
     */
    const paneTransport = (side: CompareSide, measureIndexes: number[]) => {
        if (!transport || measureIndexes.length === 0) return {};
        const range = {
            startMeasureIndex: Math.min(...measureIndexes),
            endMeasureIndex: Math.max(...measureIndexes),
        };
        return {
            transport: transport.states[side],
            onTogglePlay: () => void transport.toggleSidePlayPause(side, range),
        };
    };

    const mergedIndexes = (system: ScannerSystem) =>
        mergeSource === 'left' ? system.leftMeasureIndexes : system.rightMeasureIndexes;

    /** A click in the merged pane either places a note or selects what is there. */
    const handleMergedPoint = useCallback(
        (point: { page: number; x: number; y: number }) => {
            void mutateMerged(
                noteInput ? 'place a note' : 'select that bar',
                async (target) => {
                    if (noteInput && target.putNote) {
                        await target.putNote(point.page, point.x, point.y, false, false);
                        return;
                    }
                    if (target.selectElementAtPoint) {
                        await target.selectElementAtPoint(point.page, point.x, point.y);
                    } else if (target.selectMeasureAtPoint) {
                        await target.selectMeasureAtPoint(point.page, point.x, point.y);
                    }
                    setHasSelection(true);
                },
                // Selecting changes nothing about the document, so it must not
                // mark the merge edited — an untouched merge saved after a stray
                // click would otherwise be filed as hand-corrected.
                { mutates: noteInput, skipRelayout: !noteInput },
            );
        },
        [mutateMerged, noteInput],
    );

    const toggleNoteInput = useCallback(() => {
        const next = !noteInput;
        void mutateMerged(
            next ? 'start note input' : 'stop note input',
            async (target) => {
                await target.setNoteEntryMode?.(next);
                setNoteInput(next);
            },
            { mutates: false, skipRelayout: true },
        );
    }, [mutateMerged, noteInput]);

    // Keyboard editing, routed through the same policy the other comparators
    // use. Only the merged score is reachable from it.
    useEffect(() => {
        if (!mergedScore) return;
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
            routeCompareKeyboardShortcut(event, {
                active: true,
                activeRole: 'merged',
                hasSelection,
                noteMode: noteInput,
                mutate: (label, methodName, args, skipRelayout) => {
                    void mutateMerged(
                        label,
                        async (score) => {
                            const method = (score as any)[methodName];
                            if (typeof method === 'function') await method.apply(score, args || []);
                        },
                        { skipRelayout },
                    );
                },
                updateInputState: (methodName, args) => {
                    void mutateMerged(
                        'change note input',
                        async (score) => {
                            const method = (score as any)[methodName];
                            if (typeof method === 'function') await method.apply(score, args || []);
                        },
                        { mutates: false, skipRelayout: true },
                    );
                },
                copySelection: () => undefined,
                pasteSelection: () => undefined,
                disableNoteInput: () => {
                    if (noteInput) toggleNoteInput();
                },
                toggleNoteInput,
                setHasSelection: (_role, selected) => setHasSelection(selected),
            });
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [hasSelection, mergedScore, mutateMerged, noteInput, toggleNoteInput]);

    const takeBlock = useCallback(
        (region: ScannerRowRegion, engineId: string, kind?: 'dynamics' | 'lyrics') => {
            if (!region.contentSignature || !leftEngineId || !rightEngineId) return;
            void merged
                .take({
                    blockIndex: region.blockIndex,
                    contentSignature: region.contentSignature,
                    engineId,
                    baseEngineId: leftEngineId,
                    candidateEngineId: rightEngineId,
                    kind,
                })
                .then((outcome) => {
                    if (!outcome.ok) {
                        setNotice(outcome.error);
                        return;
                    }
                    const repaired = outcome.repairs.length
                        ? ` ${outcome.repairs.map((repair) => repair.detail).join(' ')}`
                        : '';
                    setNotice(
                        `Took ${kind ? `the ${kind} of ` : ''}difference ${
                            region.blockIndex + 1
                        } from ${engineId === leftEngineId ? leftLabel : rightLabel}.${repaired}`,
                    );
                    // The merge may have changed length, so it is reloaded
                    // rather than patched.
                    void loadMerged();
                });
        },
        [leftEngineId, leftLabel, loadMerged, merged, rightEngineId, rightLabel],
    );

    const save = useCallback(
        async (acceptStale = false) => {
            const outcome = await merged.save({ acceptStale });
            setNotice(
                outcome.ok
                    ? `Saved. This merged score is now what page assembly uses.`
                    : outcome.error,
            );
        },
        [merged],
    );

    const step = (direction: 1 | -1, from: number) => {
        for (
            let index = from + direction;
            index >= 0 && index < systems.length;
            index += direction
        ) {
            if (differencesBySystem[index].length > 0) {
                rowRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
        }
    };

    const canSave = Boolean(merged.state && mergedEngineId);

    return (
        <div ref={paneRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-gray-600">
                <span>
                    {onlyBlockIndex === undefined
                        ? `${systems.length} system${systems.length === 1 ? '' : 's'} from the scan${
                              differingRows > 0
                                  ? `, ${differingRows} with differences`
                                  : ', none differing'
                          }`
                        : `Difference ${onlyBlockIndex + 1}, on ${visibleRows.length} system${
                              visibleRows.length === 1 ? '' : 's'
                          } of the scan`}
                </span>
                {(busy || merged.loading) && <span aria-live="polite">Laying out the readings…</span>}
                {(error || merged.error) && (
                    <span className="text-red-700" role="alert">
                        {error || merged.error}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-2 rounded-lg border border-cyan-200 bg-cyan-50/50 px-3 py-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-gray-700">Merged score starts from</span>
                    {(['left', 'right'] as const).map((side) => (
                        <button
                            key={side}
                            type="button"
                            aria-pressed={mergeSource === side}
                            onClick={() => setMergeSource(side)}
                            className={`rounded border px-2 py-1 ${
                                mergeSource === side
                                    ? 'border-cyan-500 bg-white font-semibold text-cyan-900'
                                    : 'border-gray-300 hover:bg-white'
                            }`}
                        >
                            {side === 'left' ? leftLabel : rightLabel}
                        </button>
                    ))}
                    <span className="text-gray-600">
                        Neither engine is the score. Only the merged pane can be edited; the engine
                        panes are the evidence it is judged against.
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={toggleNoteInput}
                        aria-pressed={noteInput}
                        disabled={!mergedScore || merged.busy}
                        data-testid="btn-merged-note-input"
                        className={`rounded border px-2 py-1 disabled:opacity-50 ${
                            noteInput
                                ? 'border-cyan-500 bg-white font-semibold text-cyan-900'
                                : 'border-gray-300 hover:bg-white'
                        }`}
                    >
                        {noteInput ? 'Note input on' : 'Note input'}
                    </button>
                    <button
                        type="button"
                        onClick={() => void save()}
                        disabled={!canSave || merged.saving || merged.busy}
                        data-testid="btn-merged-save"
                        className="rounded border border-cyan-500 bg-white px-2 py-1 font-semibold text-cyan-900 disabled:opacity-50"
                    >
                        {merged.saving ? 'Saving…' : 'Save merged score'}
                    </button>
                    {merged.state?.present && (
                        <button
                            type="button"
                            onClick={() => {
                                void merged.discard().then((outcome) => {
                                    setNotice(
                                        outcome.ok
                                            ? 'Discarded. This page is back to its engine readings.'
                                            : outcome.error,
                                    );
                                });
                            }}
                            disabled={merged.saving}
                            className="rounded border border-gray-300 px-2 py-1 hover:bg-white disabled:opacity-50"
                        >
                            Discard merged score
                        </button>
                    )}
                    <span className="text-gray-600" data-testid="merged-status">
                        {merged.dirty
                            ? 'Unsaved changes'
                            : merged.state?.present
                              ? `Saved, revision ${merged.state.revision}${merged.state.edited ? ', hand-corrected' : ''}`
                              : 'Not saved yet'}
                    </span>
                </div>

                {merged.state?.stale && (
                    <div
                        className="rounded border border-amber-400 bg-amber-50 px-2 py-1 text-amber-900"
                        role="alert"
                    >
                        An engine has re-read this page since this merge was saved. Nothing has been
                        thrown away, but the merge answers readings that no longer exist and is not
                        being used for assembly. Review it, then{' '}
                        <button
                            type="button"
                            onClick={() => void save(true)}
                            className="underline"
                            data-testid="btn-merged-accept-stale"
                        >
                            save it against the new readings
                        </button>
                        , or discard it.
                    </div>
                )}

                {notice && <div className="text-gray-700">{notice}</div>}
            </div>

            {onlyBlockIndex !== undefined && visibleRows.length === 0 && (
                <p className="rounded border border-dashed border-gray-300 px-3 py-2 text-xs text-gray-500">
                    This difference has no verified place on the scan, so there is no line to show
                    it on.
                </p>
            )}

            {visibleRows.map(({ system, index: rowIndex }) => {
                const differences = differencesBySystem[rowIndex];
                const classes = [
                    ...new Set(differences.flatMap((region) => region.differenceClasses || [])),
                ];
                return (
                    <div
                        key={system.systemIndex}
                        ref={(node) => {
                            rowRefs.current[rowIndex] = node;
                        }}
                        className={`rounded-lg border p-3 ${
                            differences.length > 0
                                ? 'border-amber-300 bg-amber-50/40'
                                : 'border-gray-200'
                        }`}
                    >
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="font-medium text-gray-700">
                                System {rowIndex + 1} of {systems.length}
                            </span>
                            <span className="text-gray-600">
                                {differences.length === 0
                                    ? 'readings agree'
                                    : classes
                                          .map((name) => DIFFERENCE_LABELS[name] || name)
                                          .join(', ')}
                            </span>
                            {differences.length > 0 && (
                                <span className="flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => step(-1, rowIndex)}
                                        className="rounded border border-gray-300 px-2 py-0.5 hover:bg-gray-50"
                                    >
                                        ← previous
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => step(1, rowIndex)}
                                        className="rounded border border-gray-300 px-2 py-0.5 hover:bg-gray-50"
                                    >
                                        next →
                                    </button>
                                </span>
                            )}
                        </div>

                        {system.cropUrl && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={resolveUrl(system.cropUrl)}
                                alt={`Scan of system ${rowIndex + 1}`}
                                className="mb-2 w-full rounded border border-gray-200 bg-white object-contain"
                            />
                        )}

                        {/*
                            Reading, merge, reading, with a gutter between each
                            pane and the merged score — so "take from above" and
                            "take from below" read the way a three-way merge
                            does, and the arrow points where the bar will go.
                        */}
                        <div className="space-y-2">
                            <div>
                                <div className="mb-1 text-[11px] uppercase tracking-wide text-gray-500">
                                    {leftLabel}
                                </div>
                                <SystemPane
                                    rendered={left}
                                    measureIndexes={system.leftMeasureIndexes}
                                    label={leftLabel}
                                    paneWidth={paneWidth}
                                    {...paneTransport('left', system.leftMeasureIndexes)}
                                />
                            </div>
                            <Gutter
                                direction="down"
                                label={leftLabel}
                                regions={differences}
                                engineId={leftEngineId}
                                onTake={takeBlock}
                                busy={merged.saving}
                            />
                            <div>
                                <div className="mb-1 flex items-baseline gap-2 text-[11px] uppercase tracking-wide text-cyan-800">
                                    <span className="font-semibold">Merged</span>
                                    <span className="normal-case tracking-normal text-gray-500">
                                        {merged.dirty
                                            ? `started from ${mergedLabel}, edited here`
                                            : `every bar inherited from ${mergedLabel}`}
                                    </span>
                                </div>
                                <SystemPane
                                    rendered={mergedRender}
                                    measureIndexes={mergedIndexes(system)}
                                    label="The merged score"
                                    paneWidth={paneWidth}
                                    tone="merged"
                                    onPointMutate={handleMergedPoint}
                                    {...paneTransport('middle', mergedIndexes(system))}
                                />
                            </div>
                            <Gutter
                                direction="up"
                                label={rightLabel}
                                regions={differences}
                                engineId={rightEngineId}
                                onTake={takeBlock}
                                busy={merged.saving}
                            />
                            <div>
                                <div className="mb-1 text-[11px] uppercase tracking-wide text-gray-500">
                                    {rightLabel}
                                </div>
                                <SystemPane
                                    rendered={right}
                                    measureIndexes={system.rightMeasureIndexes}
                                    label={rightLabel}
                                    paneWidth={paneWidth}
                                    {...paneTransport('right', system.rightMeasureIndexes)}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
