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
    /**
     * Which events inside each bar are unmatched, so the reader is pointed at
     * the note rather than at the bar containing it.
     */
    symbolDifferences?: ScannerSymbolDifference[];
    /** How a reader would name the bars this covers, per side. */
    leftMeasureLabel?: string;
    rightMeasureLabel?: string;
    /** Where it sits inside its system's scan crop, as fractions of that crop. */
    cropBoxes?: Array<{
        systemIndex: number;
        left: number;
        top: number;
        width: number;
        height: number;
    }>;
};

export type ScannerSymbolDifference = {
    leftMeasureIndex: number;
    rightMeasureIndex: number;
    leftEventIndexes: number[];
    rightEventIndexes: number[];
    /** Totals, so a mismatched idea of "an event" can be detected, not trusted. */
    leftEventCount: number;
    rightEventCount: number;
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
/**
 * Where a line starts in the merged document, given where it started in the
 * reading the merge was built from.
 *
 * `map[mergedPosition] = sourceMeasureIndex`, so following a start is a lookup
 * by value. A start whose bar is gone — removed by an earlier decision — drops
 * out rather than breaking at whatever now sits at that number: one line too
 * few is a smaller lie than a line that begins in the wrong place.
 */
export function lineStartsInMerge(
    starts: readonly number[],
    map: readonly number[] | undefined,
): number[] {
    if (!map) return [...starts];
    return starts.map((start) => map.indexOf(start)).filter((position) => position >= 0);
}

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
    /**
     * Every rhythmic position in the drawing, left to right, at RENDER_WIDTH.
     *
     * Kept flat and unattributed because a segment does not say which bar it
     * belongs to; the bar it falls inside decides that, and only at the point
     * of use, where the measure box is already in hand.
     */
    segments: MeasureBox[];
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



/**
 * Where a reading's bars belong under the merged score's line.
 *
 * The merged pane draws its whole line across the pane, which fixes a scale and
 * an origin for the row. An engine pane showing only the contested bars should
 * appear at that same scale, over the merged bars it would replace — so the
 * reader compares by looking up and down a column rather than across two
 * differently-zoomed pictures of the same music.
 *
 * Null when there is nothing to line up against: the merged score does not draw
 * this line, or the bars in question are not in it. The pane then fills its own
 * width, which is what it did before there was anything to align to.
 */
export function placeUnderMerged(
    merged: RenderedSide | null,
    mergedIndexes: readonly number[],
    ownIndexes: readonly number[],
    paneWidth: number,
): { left: number; width: number } | null {
    if (!merged || paneWidth <= 0 || mergedIndexes.length === 0 || ownIndexes.length === 0) {
        return null;
    }
    const boxesFor = (indexes: readonly number[]) =>
        indexes
            .map((index) => merged.measures[index])
            .filter((box): box is MeasureBox => Boolean(box));
    const lineBoxes = boxesFor(mergedIndexes);
    const targetBoxes = boxesFor(ownIndexes);
    if (lineBoxes.length === 0 || targetBoxes.length === 0) return null;

    const lineLeft = Math.min(...lineBoxes.map((box) => box.left));
    const lineRight = Math.max(...lineBoxes.map((box) => box.left + box.width));
    const lineWidth = Math.max(1, lineRight - lineLeft);
    const scale = paneWidth / lineWidth;

    const targetLeft = Math.min(...targetBoxes.map((box) => box.left));
    const targetRight = Math.max(...targetBoxes.map((box) => box.left + box.width));
    return {
        left: (targetLeft - lineLeft) * scale,
        width: Math.max(1, (targetRight - targetLeft) * scale),
    };
}

/**
 * Where the unmatched events of one bar are drawn.
 *
 * The analysis counts events in a bar; this rendering knows where each
 * rhythmic position sits. Nothing connects them but the ordering, so the count
 * is checked first: if this drawing has a different number of positions in the
 * bar than the analysis found events, the two are not counting the same thing
 * and no box is returned. The row then stays marked at bar level, which is
 * true, rather than pointing confidently at the wrong note.
 */
function eventBoxes(
    rendered: RenderedSide | null,
    measureIndex: number,
    eventIndexes: readonly number[],
    eventCount: number,
): MeasureBox[] {
    const measure = rendered?.measures[measureIndex];
    if (!rendered || !measure || eventIndexes.length === 0) return [];
    const inside = rendered.segments
        .filter(
            (segment) =>
                segment.left >= measure.left - 1 &&
                segment.left < measure.left + measure.width &&
                segment.top + segment.height > measure.top &&
                segment.top < measure.top + measure.height,
        )
        .sort((left, right) => left.left - right.left);
    if (inside.length !== eventCount) {
        // Worth saying out loud rather than silently falling back: if this ever
        // fires on every bar of a page, the two sides have stopped counting the
        // same thing and symbol highlighting is off everywhere.
        console.debug(
            '[scanner-rows] symbol highlight skipped: measure',
            measureIndex,
            'has',
            inside.length,
            'drawn positions against',
            eventCount,
            'analysed events',
        );
        return [];
    }
    return eventIndexes.map((index) => inside[index]).filter(Boolean);
}


/**
 * The bars a pane should actually draw for one row.
 *
 * A system is up to a dozen bars and a difference is usually one or two of
 * them, so drawing the whole line spends most of the width on music both
 * readings agree about — and shrinks the bars in question to the point where
 * comparing a beam or an accidental means leaning at the screen. Narrowing to
 * the difference makes them as large as the pane allows.
 *
 * Only the two engine panes narrow. The scan is the context the whole
 * judgement rests on, and the merged score is the thing being built, which a
 * reviewer needs to see as a line rather than as a fragment of one.
 *
 * One bar of context either side, because a barline join is part of what a
 * reviewer is judging: whether a bar was split, and whether the bar after it
 * still starts where it should.
 *
 * A side with no bars in the difference — the empty half of an insertion or a
 * removal — keeps its whole line. There is nothing there to narrow to, and what
 * that side is *missing* can only be judged against what it has instead.
 */
export function focusedMeasureIndexes(
    systemIndexes: readonly number[],
    differenceIndexes: readonly number[],
    context = 1,
): number[] {
    if (differenceIndexes.length === 0) return [...systemIndexes];
    const wanted = new Set<number>();
    const ordered = [...systemIndexes].sort((left, right) => left - right);
    for (const index of differenceIndexes) {
        const position = ordered.indexOf(index);
        if (position < 0) {
            wanted.add(index);
            continue;
        }
        for (
            let step = Math.max(0, position - context);
            step <= Math.min(ordered.length - 1, position + context);
            step += 1
        ) {
            wanted.add(ordered[step]);
        }
    }
    const focused = ordered.filter((index) => wanted.has(index));
    return focused.length > 0 ? focused : [...systemIndexes];
}

/**
 * The bars of a line that were actually engraved on one row of it.
 *
 * A forced break starts a system; it does not stop the engine adding its own
 * when the bars do not fit the page. The merged pane is the only one that draws
 * a whole line, so it is the only one that can overflow, and the row then shows
 * the spilled bar underneath the line it belongs to — one line of music drawn
 * as two.
 *
 * Neither page width nor staff size fixes it. Measured on Klengel: quartering
 * the staff left the line split in exactly the same place, which is what says
 * this is not about how much fits.
 *
 * So the pane shows one engraved row rather than pretending the line is whole.
 * Which row is decided by the bars under review: the reader is here to judge a
 * difference, and a window that leaves it off screen is no use however tidy it
 * looks. Without a difference to hold onto, the first row wins, which is the
 * line as it reads.
 */
export function engravedRowWindow(
    rendered: RenderedSide | null,
    measureIndexes: readonly number[],
    contested: readonly number[] = [],
): number[] {
    if (!rendered || measureIndexes.length === 0) return [...measureIndexes];
    const placed = measureIndexes
        .map((index) => ({ index, box: rendered.measures[index] }))
        .filter((entry): entry is { index: number; box: MeasureBox } => Boolean(entry.box));
    if (placed.length === 0) return [...measureIndexes];

    const staff = Math.max(1, Math.min(...placed.map((entry) => entry.box.height)));
    const rows: Array<{ top: number; indexes: number[] }> = [];
    for (const entry of [...placed].sort((left, right) => left.box.top - right.box.top)) {
        const row = rows[rows.length - 1];
        // Half a staff apart is more than engraving jitter and less than a
        // system's spacing, so it separates rows without splitting one.
        if (row && entry.box.top - row.top <= staff / 2) row.indexes.push(entry.index);
        else rows.push({ top: entry.box.top, indexes: [entry.index] });
    }
    if (rows.length <= 1) return [...measureIndexes];

    const wanted = new Set(contested);
    const holdsAll = rows.find((row) => [...wanted].every((index) => row.indexes.includes(index)));
    const holdsSome = rows.find((row) => row.indexes.some((index) => wanted.has(index)));
    const chosen = holdsAll ?? holdsSome ?? rows[0];
    return [...chosen.indexes].sort((left, right) => left - right);
}

/** Draw an already-loaded score; used for the merged document, which is live. */
async function renderScoreSide(score: Score): Promise<RenderedSide | null> {
    const svg = await score.saveSvg(0, true, false);
    const positions = await score.measurePositions();
    // Rhythmic positions, for pointing at a note rather than at the bar around
    // it. Optional: a build without it loses symbol highlighting and nothing
    // else, so it must not cost the rows their rendering.
    const segments = await (async () => {
        try {
            return await score.segmentPositions();
        } catch {
            return null;
        }
    })();
    const pageWidth = positions?.pageSize?.width || 0;
    const renderScale = pageWidth > 0 ? RENDER_WIDTH / pageWidth : 1;
    return {
        svg: svgAtRenderWidth(svg),
        measures: measureBounds(positions, renderScale),
        segments: measureBounds(segments, renderScale).filter(
            (box): box is MeasureBox => Boolean(box),
        ),
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
    /** Where the drawing starts inside the pane, in pane pixels. */
    offsetX: number;
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
    onStop,
    highlights,
    preview,
    place,
}: {
    rendered: RenderedSide | null;
    measureIndexes: number[];
    label: string;
    paneWidth: number;
    tone?: 'merged';
    /** Playback state for this pane, when the workspace supplies a transport. */
    transport?: CompareTransportState;
    onTogglePlay?: () => void;
    onStop?: () => void;
    /** Unmatched events, in the same RENDER_WIDTH pixels as the drawing. */
    highlights?: MeasureBox[];
    /** Whole bars a hovered control is pointing at, in the same pixels. */
    preview?: MeasureBox[];
    /**
     * Where in the pane this reading's bars should be drawn, in pane pixels.
     *
     * Absent means "fill the pane", which is right for the merged score: it is
     * the line, so it gets the width. An engine pane showing two contested bars
     * of a twelve-bar line would otherwise blow them up to the full width and
     * put them nowhere near the merged bars they replace — so it is handed the
     * box its counterpart occupies, and draws at that size, in that place.
     */
    place?: { left: number; width: number } | null;
    /**
     * Score-space coordinates of a click, for the one pane that is editable.
     * Absent on engine panes, which is what makes them read-only: there is no
     * path from a click to a mutation at all, rather than a disabled one.
     */
    onPointMutate?: (point: { page: number; x: number; y: number }) => void;
}) {
    /**
     * The pane measures itself rather than trusting a width from above.
     *
     * It used to be handed the scroll container's `clientWidth`, which includes
     * that container's padding and knows nothing about the row card's — so
     * every pane was scaled about 58px wider than the box it had to fit in, and
     * the music ran off the right edge of a clipped row. Measuring the element
     * the drawing actually lands in cannot drift from the layout, whatever
     * padding is added between here and the top.
     */
    const [measuredWidth, setMeasuredWidth] = useState(0);
    const observed = useRef<ResizeObserver | null>(null);
    // A callback ref rather than an effect: a pane that first renders "no
    // measure here" and only later gets a layout attaches its node long after
    // mount, and an effect with an empty dependency list would never see it.
    const attachPane = useCallback((node: HTMLDivElement | null) => {
        observed.current?.disconnect();
        observed.current = null;
        if (!node || typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(() => setMeasuredWidth(node.clientWidth));
        observer.observe(node);
        observed.current = observer;
        setMeasuredWidth(node.clientWidth);
    }, []);
    // The passed width is only a first-frame estimate, until the observer runs.
    const usableWidth = measuredWidth || paneWidth;

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
    // Fill the pane, or fit the box a counterpart pane says to sit in.
    const targetWidth = place && place.width > 0 ? place.width : usableWidth;
    const scale = targetWidth > 0 ? targetWidth / bandWidth : 1;
    const offsetX = place ? place.left : 0;
    const geometry: PaneGeometry = { left, top, scale, offsetX };
    const playing = Boolean(transport?.isPlaying) && !transport?.isPaused;

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
        const renderX =
            (event.clientX - rect.left - geometry.offsetX) / geometry.scale + geometry.left;
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
            ref={attachPane}
            /*
             * `overflow-clip`, not `overflow-hidden`.
             *
             * The drawing inside is a whole page scaled up so that one system's
             * band fills this box, so most of it is outside — that is the point.
             * But `hidden` makes this a scroll container, and the browser counts
             * the transformed content it clips toward the scrollable area of the
             * editor canvas above: a horizontal scrollbar appeared across the
             * whole editor, dragged to 1441px, and revealed nothing, because
             * there was nothing there. `clip` clips without becoming scrollable
             * and without contributing, which is what was meant both times.
             */
            className={`relative w-full overflow-clip rounded border bg-white ${
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
            {/* What this pane was asked to draw, and where, so a test can read it. */}
            <span
                className="hidden"
                data-testid="pane-measures"
                data-place-left={place ? Math.round(place.left) : ''}
                data-place-width={place ? Math.round(place.width) : ''}
            >
                {measureIndexes.join(',')}
            </span>
            <div
                className="absolute left-0 top-0 origin-top-left"
                style={{
                    width: rendered.width,
                    transform: `translate(${offsetX}px, 0) scale(${scale}) translate(${-left}px, ${-top}px)`,
                }}
                // The SVG comes from the engine build, not from user input.
                dangerouslySetInnerHTML={{ __html: rendered.svg }}
            />
            {/*
                What a hovered control would take, or land on.

                Over the music, not under it: the engraving is an opaque SVG, so
                underneath is invisible. A whole bar of wash would sit on top of
                exactly what a reviewer is reading to decide, so the fill is
                faint and the edge does the work.
            */}
            {(preview || []).length > 0 && (
                <div
                    className="pointer-events-none absolute left-0 top-0 origin-top-left"
                    style={{
                        width: rendered.width,
                        transform: `translate(${offsetX}px, 0) scale(${scale}) translate(${-left}px, ${-top}px)`,
                    }}
                >
                    {(preview || []).map((box, index) => (
                        <div
                            key={`preview-${box.left}-${index}`}
                            data-testid="take-preview"
                            className="absolute rounded bg-cyan-400/10 ring-2 ring-cyan-500/70"
                            style={{
                                left: box.left,
                                top: box.top - 4,
                                width: box.width,
                                height: box.height + 8,
                            }}
                        />
                    ))}
                </div>
            )}
            {/*
                Painted in the same transformed frame as the music, so a box
                stays on its note under any pane width. Behind nothing: it is a
                wash rather than an outline because an outline at this scale
                reads as a notation mark of its own.
            */}
            {(highlights || []).length > 0 && (
                <div
                    className="pointer-events-none absolute left-0 top-0 origin-top-left"
                    style={{
                        width: rendered.width,
                        transform: `translate(${offsetX}px, 0) scale(${scale}) translate(${-left}px, ${-top}px)`,
                    }}
                >
                    {(highlights || []).map((box, index) => (
                        <div
                            key={`${box.left}-${box.top}-${index}`}
                            data-testid="symbol-highlight"
                            className="absolute rounded-sm bg-amber-300/40 ring-1 ring-amber-500/70"
                            style={{
                                left: box.left - 2,
                                top: box.top - 2,
                                width: Math.max(6, box.width) + 4,
                                height: box.height + 4,
                            }}
                        />
                    ))}
                </div>
            )}
            {onTogglePlay && (
                /*
                    Playback is read-only, so it costs the engine panes nothing
                    — and a wrong pitch or a dropped beat announces itself in a
                    second of audio, which is often faster than reading for it.

                    Left, with the label and the clef, rather than off in the
                    right margin: the controls belong to the reading they play,
                    and the eye is already at that end of the row.
                */
                <div className="absolute left-1 top-1 flex gap-1">
                    <button
                        type="button"
                        onClick={(event) => {
                            // The merged pane turns a click into an edit; playing
                            // it must not also place a note.
                            event.stopPropagation();
                            onTogglePlay();
                        }}
                        disabled={transport?.isBusy}
                        aria-label={`${playing ? 'Pause' : 'Play'} ${label}`}
                        className="rounded border border-gray-400 bg-white px-1.5 py-0.5 text-[11px] leading-none text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                        {transport?.isBusy ? '…' : playing ? '❚❚' : '▶'}
                    </button>
                    {/*
                        Stop is not pause: it gives the row back its silence and
                        puts the next play at the top of the passage. Only shown
                        once there is something to stop, so a row at rest carries
                        one control rather than two.
                    */}
                    {onStop && (transport?.isPlaying || transport?.isPaused) && (
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                onStop();
                            }}
                            aria-label={`Stop ${label}`}
                            className="rounded border border-gray-400 bg-white px-1.5 py-0.5 text-[11px] leading-none text-gray-800 shadow-sm hover:bg-gray-50"
                        >
                            ■
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}


/**
 * Which reading the merged score currently takes a block's notes from.
 *
 * It starts as a copy of one engine's reading, so every block reads from that
 * engine until a decision moves it. A marking take does not move it: taking
 * dynamics leaves the notes where they were, and the record says so.
 */
export function mergedReadsBlockFrom(
    blockIndex: number,
    sourceEngineId: string,
    decisions: MergedScoreState['decisions'],
): string {
    let current = sourceEngineId;
    for (const decision of decisions || []) {
        if (decision.blockIndex !== blockIndex || decision.markingsOnly) continue;
        if (decision.engineId) current = decision.engineId;
    }
    return current;
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
    readsFrom,
    onPreview,
    onTake,
    busy,
}: {
    direction: 'down' | 'up';
    label: string;
    regions: ScannerRowRegion[];
    engineId?: string;
    /** Which engine the merged score currently reads a block's notes from. */
    readsFrom: (blockIndex: number) => string;
    /**
     * What the control under the pointer would change, or null on the way out.
     *
     * Hovering is how a reviewer asks "which bars is this one?" without
     * pressing it, and the answer is two spans: what would be copied, and what
     * it would land on. Saying it in the panes is the only place it can be
     * said without words.
     */
    onPreview: (region: ScannerRowRegion | null) => void;
    onTake: (
        region: ScannerRowRegion,
        engineId: string,
        kind?: 'dynamics' | 'lyrics',
    ) => void;
    busy: boolean;
}) {
    if (regions.length === 0 || !engineId) return null;
    return (
        <div className="flex flex-wrap items-center gap-1 py-0.5 text-[11px] text-gray-700">
            <span className="mr-1 uppercase tracking-wide text-gray-500">
                take from {label}
            </span>
            {regions.map((region) => {
                /*
                    Offered only when pressing it would change something.

                    Two ways it would not. A block whose place on the scan could
                    not be proven cannot be decided at all (§7), and used to be
                    drawn disabled — offered and then refused, which is what §7
                    says not to do. And a block the merged score already reads
                    from this engine has nothing to take: the server refuses it
                    with "the merged score already reads this passage the way
                    that engine does", and a control whose only outcome is that
                    message is worse than no control, because a reviewer cannot
                    tell it from one that is merely unavailable.
                */
                if (!region.contentSignature) return null;
                if (readsFrom(region.blockIndex) === engineId) return null;
                const decidable = true;
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
                            onMouseEnter={() => onPreview(region)}
                            onMouseLeave={() => onPreview(null)}
                            onFocus={() => onPreview(region)}
                            onBlur={() => onPreview(null)}
                            className="rounded border border-cyan-600 bg-white px-1.5 py-0.5 font-semibold text-cyan-800 shadow-sm hover:bg-cyan-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cyan-600 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-50 disabled:font-normal disabled:text-gray-400 disabled:shadow-none"
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
                                onMouseEnter={() => onPreview(region)}
                                onMouseLeave={() => onPreview(null)}
                                onFocus={() => onPreview(region)}
                                onBlur={() => onPreview(null)}
                                className="rounded border border-cyan-300 bg-white px-1 py-0.5 text-cyan-800 hover:bg-cyan-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cyan-600 disabled:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400"
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
                                onMouseEnter={() => onPreview(region)}
                                onMouseLeave={() => onPreview(null)}
                                onFocus={() => onPreview(region)}
                                onBlur={() => onPreview(null)}
                                className="rounded border border-cyan-300 bg-white px-1 py-0.5 text-cyan-800 hover:bg-cyan-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cyan-600 disabled:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400"
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
            /*
             * Follow the line starts through the merge before imposing them.
             *
             * They are positions in the engine reading, and a take that inserts
             * or removes bars renumbers everything after it — so bar 8 of the
             * reading may be bar 9 of the merge. Breaking at the old number
             * puts a different bar at the head of the line, which is the line
             * reflowing under a reader who did not ask it to. Only the
             * persisted document needs this; before there is one, the merged
             * score *is* the reading.
             */
            const starts = lineStartsInMerge(
                mergeStarts as number[],
                persistedXml ? mergedState?.measureMap : undefined,
            );
            return {
                xml: withForcedSystemBreaks(source, starts),
                baselineMeasures: measureCount(source),
            };
        },
        [mergeSourceXml, mergeStarts, mergedState?.measureMap],
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
     * The differences a reader can actually be taken to, in page order.
     *
     * Ordered by the system they appear on rather than by block index, because
     * the reader is walking down a page, and a list that jumps back up it is
     * not a walk. Only differences that landed on a system are here: one whose
     * place on the scan could not be proven has no row to show.
     */
    const navigableBlocks = useMemo(() => {
        const seen = new Map<number, number>();
        differencesBySystem.forEach((entries, rowIndex) => {
            for (const region of entries) {
                if (!seen.has(region.blockIndex)) seen.set(region.blockIndex, rowIndex);
            }
        });
        return [...seen.entries()]
            .sort((left, right) => left[1] - right[1] || left[0] - right[0])
            .map(([blockIndex, rowIndex]) => ({ blockIndex, rowIndex }));
    }, [differencesBySystem]);

    // The host names the difference to open; moving between them is this
    // view's own business, because everything a reader needs to move — the
    // rows, the scan, the readings — is already here.
    const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | undefined>(onlyBlockIndex);
    const [staleCrops, setStaleCrops] = useState<Set<number>>(new Set());
    // The difference the pointer is over, if any. Hover is a question — "which
    // bars is this one?" — and this is what answers it.
    const [previewRegion, setPreviewRegion] = useState<ScannerRowRegion | null>(null);
    useEffect(() => setSelectedBlockIndex(onlyBlockIndex), [onlyBlockIndex]);
    const selectedPosition = navigableBlocks.findIndex(
        (entry) => entry.blockIndex === selectedBlockIndex,
    );
    const selectedRegion = regions.find((region) => region.blockIndex === selectedBlockIndex);
    const goToDifference = (position: number) => {
        const target = navigableBlocks[position];
        if (!target) return;
        setSelectedBlockIndex(target.blockIndex);
        rowRefs.current[target.rowIndex]?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    };

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
        if (selectedBlockIndex === undefined) return rows;
        return rows.filter(({ index }) =>
            differencesBySystem[index].some((region) => region.blockIndex === selectedBlockIndex),
        );
    }, [differencesBySystem, selectedBlockIndex, systems]);

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
            onStop: () => void transport.stopSideAudio(side),
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

    const readsFrom = useCallback(
        (blockIndex: number) =>
            mergedReadsBlockFrom(blockIndex, mergedEngineId, merged.state?.decisions),
        [mergedEngineId, merged.state?.decisions],
    );


    /**
     * The scan of one system, with the difference under review boxed on it.
     *
     * Rendered twice per row — above the first reading and below the second —
     * so each reading has the page it was read from next to it.
     */
    const scanCrop = (system: ScannerSystem, rowIndex: number, position: 'above' | 'below' = 'above') => {
        if (!system.cropUrl) return null;
        if (staleCrops.has(system.systemIndex)) {
            return (
                /*
                    A crop is signature-bound and the server refuses it once the
                    job moves on. An `<img>` cannot read that refusal, so it has
                    to be said here — a broken image would look like a bug in the
                    page rather than a scan that has been superseded.
                */
                <p
                    role="alert"
                    className={`rounded border border-amber-400 bg-amber-50 px-2 py-1 text-[11px] text-amber-900 ${
                        position === 'above' ? 'mb-2' : 'mt-2'
                    }`}
                >
                    This scan crop is no longer current. Reload the page to compare against the
                    readings as they stand now.
                </p>
            );
        }
        return (
            <div className={`relative ${position === 'above' ? 'mb-2' : 'mt-2'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={resolveUrl(system.cropUrl)}
                    alt={`Scan of system ${rowIndex + 1}${position === 'below' ? ', repeated' : ''}`}
                    onError={() =>
                        setStaleCrops((current) => new Set(current).add(system.systemIndex))
                    }
                    className="w-full rounded border border-gray-200 bg-white object-contain"
                />
                {/*
                    The bars in question, boxed on the scan they came from.
                    Fractions of this crop, so the box holds wherever the image
                    is scaled to — the scan's own pixel size never reaches here.
                */}
                {(selectedRegion?.cropBoxes || [])
                    .filter((box) => box.systemIndex === system.systemIndex)
                    .map((box, boxIndex) => (
                        <div
                            key={`${box.left}-${boxIndex}`}
                            data-testid="scan-difference-box"
                            className="pointer-events-none absolute rounded-sm border-2 border-amber-500 bg-amber-300/15"
                            style={{
                                left: `${box.left * 100}%`,
                                top: `${box.top * 100}%`,
                                width: `${box.width * 100}%`,
                                height: `${box.height * 100}%`,
                            }}
                        />
                    ))}
            </div>
        );
    };

    const canSave = Boolean(merged.state && mergedEngineId);

    return (
        /*
            No scroll container of its own.

            The rows live in an iframe sized by the host, and a scrollable box
            inside a fixed-height frame gives a reader two scrollbars and the
            shorter of two viewports. Growing to fit instead lets the host size
            the frame to the content and the page scroll it, which is the only
            way this gets the window's full height.
        */
        <div ref={paneRef} className="flex flex-col gap-3 p-4">
            {/*
                The difference under review, named and navigated here.

                This used to be a card outside the editor: a list of blocks on
                the left, a cropped scrap of the scan on the right, and the
                editor below. Three places to look at one difference, and the
                crop was the same system the editor already draws — just cut out
                and shown again, smaller. Now the title says which difference it
                is, the arrows move to the next one, and the scan keeps its
                system with a box drawn on the bars in question.
            */}
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-gray-600">
                {selectedBlockIndex === undefined || navigableBlocks.length === 0 ? (
                    <span>
                        {`${systems.length} system${systems.length === 1 ? '' : 's'} from the scan${
                            differingRows > 0
                                ? `, ${differingRows} with differences`
                                : ', none differing'
                        }`}
                    </span>
                ) : (
                    <span className="flex flex-wrap items-baseline gap-2">
                        <button
                            type="button"
                            disabled={selectedPosition <= 0}
                            onClick={() => goToDifference(selectedPosition - 1)}
                            data-testid="btn-previous-difference"
                            className="rounded border border-gray-400 bg-white px-2 py-0.5 text-gray-800 hover:bg-gray-50 disabled:border-gray-300 disabled:text-gray-400"
                        >
                            ← previous
                        </button>
                        <button
                            type="button"
                            disabled={
                                selectedPosition < 0 || selectedPosition >= navigableBlocks.length - 1
                            }
                            onClick={() => goToDifference(selectedPosition + 1)}
                            data-testid="btn-next-difference"
                            className="rounded border border-gray-400 bg-white px-2 py-0.5 text-gray-800 hover:bg-gray-50 disabled:border-gray-300 disabled:text-gray-400"
                        >
                            next →
                        </button>
                        <span className="font-medium text-gray-800" data-testid="difference-title">
                            Difference {Math.max(selectedPosition, 0) + 1} of{' '}
                            {navigableBlocks.length}
                        </span>
                        <span>
                            {(selectedRegion?.differenceClasses || [])
                                .map((name) => DIFFERENCE_LABELS[name] || name)
                                .join(', ')}
                        </span>
                        <span className="text-gray-500">
                            {leftLabel}: {selectedRegion?.leftMeasureLabel || 'no matching bar'} ·{' '}
                            {rightLabel}: {selectedRegion?.rightMeasureLabel || 'no matching bar'}
                        </span>
                    </span>
                )}
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
                                    ? 'border-cyan-700 bg-cyan-600 font-semibold text-white shadow-sm'
                                    : 'border-gray-400 bg-white text-gray-800 hover:bg-gray-50'
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
                                ? 'border-cyan-700 bg-cyan-600 font-semibold text-white shadow-sm'
                                : 'border-gray-400 bg-white text-gray-800 hover:bg-gray-50'
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
                            className="rounded border border-gray-400 bg-white px-2 py-1 text-gray-800 hover:bg-gray-50 disabled:opacity-50"
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
                // Every unmatched event on this row, from every difference that
                // touches it. The merged pane inherits the highlights of
                // whichever reading it was started from — it *is* that reading
                // until a decision changes it, so marking it differently would
                // be claiming a difference that has not happened yet.
                const symbols = differences.flatMap((region) => region.symbolDifferences || []);
                // What this row is about: the selected difference when there is
                // one, and otherwise everything differing on the line.
                const focusRegions =
                    selectedRegion && differences.some((r) => r.blockIndex === selectedRegion.blockIndex)
                        ? [selectedRegion]
                        : differences;
                /*
                    The engine panes narrow; the scan and the merged score do
                    not. The two readings are what is being compared, so their
                    width should go to the bars in question — but the scan is
                    the context the whole judgement rests on, and the merged
                    score is the thing being built, which a reviewer needs to
                    see as a line rather than as a fragment of one.
                */
                const focusIndexes = (side: 'left' | 'right') =>
                    focusedMeasureIndexes(
                        side === 'left' ? system.leftMeasureIndexes : system.rightMeasureIndexes,
                        focusRegions.flatMap((region) =>
                            side === 'left'
                                ? region.leftMeasureIndexes
                                : region.rightMeasureIndexes,
                        ),
                    );
                const leftFocus = focusIndexes('left');
                const rightFocus = focusIndexes('right');
                // What the merged pane can actually show of this line, and the
                // bars under review decide which part when it cannot show all.
                const mergedWindow = engravedRowWindow(
                    mergedRender,
                    mergedIndexes(system),
                    focusRegions.flatMap((region) =>
                        mergeSource === 'left'
                            ? region.leftMeasureIndexes
                            : region.rightMeasureIndexes,
                    ),
                );
                // Hovering a take shows both halves of what it would do: the
                // bars it would copy, in the reading they come from, and the
                // bars they would land on, in the merged score.
                const previewBoxes = (
                    rendered: RenderedSide | null,
                    measureIndexes: readonly number[],
                ): MeasureBox[] =>
                    !previewRegion || !rendered
                        ? []
                        : measureIndexes
                              .map((index) => rendered.measures[index])
                              .filter((box): box is MeasureBox => Boolean(box));
                // Each engine pane sits over the merged bars it would replace,
                // at the merged score's own scale. The merged score's bars are
                // the ones its own reading contributed, so the indexes to line
                // up against are that side's.
                // Both engine panes get the same box: the span the merged score
                // devotes to the bars in question. Each still draws its own
                // bars — one reading may have three where the other has two —
                // and they occupy the same column, which is the comparison.
                const enginePlace = placeUnderMerged(
                    mergedRender,
                    // The bars the merged pane is drawing, not the ones the line
                    // nominally holds: the engine panes sit over what is on
                    // screen, and a window that dropped a bar moved everything.
                    mergedWindow,
                    mergeSource === 'left' ? leftFocus : rightFocus,
                    paneWidth,
                );
                const leftPlace = enginePlace;
                const rightPlace = enginePlace;
                const leftPreview = previewBoxes(left, previewRegion?.leftMeasureIndexes || []);
                const rightPreview = previewBoxes(right, previewRegion?.rightMeasureIndexes || []);
                const mergedPreview = previewBoxes(
                    mergedRender,
                    (mergeSource === 'left'
                        ? previewRegion?.leftMeasureIndexes
                        : previewRegion?.rightMeasureIndexes) || [],
                );
                const droppedFromLine = mergedIndexes(system).length - mergedWindow.length;
                const highlightsFor = (
                    rendered: RenderedSide | null,
                    pick: (difference: ScannerSymbolDifference) => {
                        measureIndex: number;
                        indexes: number[];
                        count: number;
                    },
                ) =>
                    symbols.flatMap((difference) => {
                        const { measureIndex, indexes, count } = pick(difference);
                        return eventBoxes(rendered, measureIndex, indexes, count);
                    });
                const leftHighlights = highlightsFor(left, (difference) => ({
                    measureIndex: difference.leftMeasureIndex,
                    indexes: difference.leftEventIndexes,
                    count: difference.leftEventCount,
                }));
                const rightHighlights = highlightsFor(right, (difference) => ({
                    measureIndex: difference.rightMeasureIndex,
                    indexes: difference.rightEventIndexes,
                    count: difference.rightEventCount,
                }));
                const mergedHighlights = highlightsFor(mergedRender, (difference) =>
                    mergeSource === 'left'
                        ? {
                              measureIndex: difference.leftMeasureIndex,
                              indexes: difference.leftEventIndexes,
                              count: difference.leftEventCount,
                          }
                        : {
                              measureIndex: difference.rightMeasureIndex,
                              indexes: difference.rightEventIndexes,
                              count: difference.rightEventCount,
                          },
                );
                return (
                    <div
                        key={system.systemIndex}
                        ref={(node) => {
                            rowRefs.current[rowIndex] = node;
                        }}
                        /*
                            A row that contains a difference gets a marked edge,
                            not a wash. Tinting the whole card said "different"
                            about the five agreeing staves in it as loudly as
                            about the one bar that differs, and the gutter below
                            already names exactly which bar that is.
                        */
                        className={`rounded-lg border p-3 ${
                            differences.length > 0
                                ? 'border-gray-200 border-l-4 border-l-amber-400'
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

                        </div>

                        {scanCrop(system, rowIndex)}

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
                                    highlights={leftHighlights}
                                    preview={leftPreview}
                                    place={leftPlace}
                                    measureIndexes={leftFocus}
                                    label={leftLabel}
                                    paneWidth={paneWidth}
                                    {...paneTransport('left', leftFocus)}
                                />
                            </div>
                            <Gutter
                                readsFrom={readsFrom}
                                onPreview={setPreviewRegion}
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
                                    {droppedFromLine > 0 && (
                                        <span
                                            className="normal-case tracking-normal text-gray-500"
                                            data-testid="merged-line-trimmed"
                                        >
                                            not showing {droppedFromLine} bar
                                            {droppedFromLine === 1 ? '' : 's'} that did not fit on
                                            one system
                                        </span>
                                    )}
                                    <span className="normal-case tracking-normal text-gray-500">
                                        {merged.dirty
                                            ? `started from ${mergedLabel}, edited here`
                                            : `every bar inherited from ${mergedLabel}`}
                                    </span>
                                </div>
                                <SystemPane
                                    rendered={mergedRender}
                                    highlights={mergedHighlights}
                                    preview={mergedPreview}
                                    measureIndexes={mergedWindow}
                                    label="The merged score"
                                    paneWidth={paneWidth}
                                    tone="merged"
                                    onPointMutate={handleMergedPoint}
                                    {...paneTransport('middle', mergedWindow)}
                                />
                            </div>
                            <Gutter
                                readsFrom={readsFrom}
                                onPreview={setPreviewRegion}
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
                                    highlights={rightHighlights}
                                    preview={rightPreview}
                                    place={rightPlace}
                                    measureIndexes={rightFocus}
                                    label={rightLabel}
                                    paneWidth={paneWidth}
                                    {...paneTransport('right', rightFocus)}
                                />
                            </div>
                            {/*
                                The scan again, under the second reading.

                                One copy at the top of the row put the scan
                                beside the first reading and three panes away
                                from the second, so comparing the lower reading
                                against the page meant carrying a line of music
                                in your head past two other staves. It is the
                                same image, and images are cheap next to that.
                            */}
                            {scanCrop(system, rowIndex, 'below')}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
