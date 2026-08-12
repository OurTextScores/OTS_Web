'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { loadWebMscore, type Positions, type Score } from '@/lib/webmscore-loader';

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

type RenderedSide = {
    svg: string;
    /** Pixel bounds per measure index, at RENDER_WIDTH. */
    measures: Array<{ top: number; height: number } | undefined>;
    width: number;
};

function measureBounds(positions: Positions | null, scale: number) {
    if (!positions?.elements?.length) return [];
    const pageHeight = positions.pageSize?.height ?? 0;
    return positions.elements.map((element) => {
        const rawHeight =
            typeof element.sy === 'number' ? element.sy : ((element as any).height ?? 0);
        // Endless layout still reports per-page coordinates, so a later page's
        // measures would otherwise stack on top of the first.
        const needsPageOffset =
            pageHeight > 0 && element.page > 0 && element.y + rawHeight <= pageHeight * 1.2;
        const top = (element.y + (needsPageOffset ? element.page * pageHeight : 0)) * scale;
        return { top, height: rawHeight * scale };
    });
}

/**
 * Draw the engine's page at exactly `RENDER_WIDTH`.
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

async function renderSide(xml: string, startIndexes: number[]): Promise<RenderedSide | null> {
    const WebMscore = await loadWebMscore();
    const reflowed = withForcedSystemBreaks(xml, startIndexes);
    let score: Score | null = null;
    try {
        score = await (WebMscore as any).load('xml', new TextEncoder().encode(reflowed));
        if (!score) return null;
        const svg = await score.saveSvg(0, true, false);
        const positions = await score.measurePositions();
        const pageWidth = positions?.pageSize?.width || 0;
        const scale = pageWidth > 0 ? RENDER_WIDTH / pageWidth : 1;
        return {
            svg: svgAtRenderWidth(svg),
            measures: measureBounds(positions, scale),
            width: RENDER_WIDTH,
        };
    } finally {
        try {
            (score as any)?.destroy?.();
        } catch {
            // A score that will not close is not a reason to lose the rows.
        }
    }
}

function SystemPane({
    rendered,
    measureIndexes,
    label,
}: {
    rendered: RenderedSide | null;
    measureIndexes: number[];
    label: string;
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
        .filter((box): box is { top: number; height: number } => Boolean(box));
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
        (box): box is { top: number; height: number } =>
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
    return (
        <div
            className="relative overflow-hidden rounded border border-gray-200 bg-white"
            style={{ height: Math.max(1, bottom - top) }}
        >
            <div
                className="absolute left-0"
                style={{ top: -top, width: rendered.width }}
                // The SVG comes from the engine build, not from user input.
                dangerouslySetInnerHTML={{ __html: rendered.svg }}
            />
        </div>
    );
}

/**
 * The page, one scanned system at a time: the scan, then each engine's reading
 * of it. Read-only — no decisions are offered here (design §8, S1).
 */
export function ScannerSystemRows({
    systems,
    regions,
    leftXml,
    rightXml,
    leftLabel,
    rightLabel,
    resolveUrl,
}: {
    systems: ScannerSystem[];
    regions: ScannerRowRegion[];
    leftXml: string;
    rightXml: string;
    leftLabel: string;
    rightLabel: string;
    resolveUrl: (relative: string) => string;
}) {
    const [left, setLeft] = useState<RenderedSide | null>(null);
    const [right, setRight] = useState<RenderedSide | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const rowRefs = useRef<Array<HTMLDivElement | null>>([]);

    const leftStarts = useMemo(
        () => systems.map((system) => system.leftMeasureIndexes[0]).filter((n) => n !== undefined),
        [systems],
    );
    const rightStarts = useMemo(
        () => systems.map((system) => system.rightMeasureIndexes[0]).filter((n) => n !== undefined),
        [systems],
    );

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

    const differingRows = differencesBySystem.reduce(
        (total, entries) => total + (entries.length > 0 ? 1 : 0),
        0,
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

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-gray-600">
                <span>
                    {systems.length} system{systems.length === 1 ? '' : 's'} from the scan
                    {differingRows > 0 ? `, ${differingRows} with differences` : ', none differing'}
                </span>
                {busy && <span aria-live="polite">Laying out both readings…</span>}
                {error && (
                    <span className="text-red-700" role="alert">
                        {error}
                    </span>
                )}
            </div>

            {systems.map((system, rowIndex) => {
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

                        <div className="space-y-2">
                            <div>
                                <div className="mb-1 text-[11px] uppercase tracking-wide text-gray-500">
                                    {leftLabel}
                                </div>
                                <SystemPane
                                    rendered={left}
                                    measureIndexes={system.leftMeasureIndexes}
                                    label={leftLabel}
                                />
                            </div>
                            <div>
                                <div className="mb-1 text-[11px] uppercase tracking-wide text-gray-500">
                                    {rightLabel}
                                </div>
                                <SystemPane
                                    rendered={right}
                                    measureIndexes={system.rightMeasureIndexes}
                                    label={rightLabel}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
