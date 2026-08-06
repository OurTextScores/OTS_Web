/**
 * Reconciles the two coordinate systems that meet in compare reflow.
 *
 * Compare carries two independent orientations and they are easy to confuse:
 *
 *   - **pane** — `left` / `right`, i.e. where something is on screen. Measure
 *     alignments are pane-oriented: they are computed from the pane-oriented
 *     `compareLeftXml` / `compareRightXml`.
 *   - **score identity** — `live` / `auxiliary`. Line breaks are score-oriented:
 *     they are read from, and written back to, specific `Score` instances.
 *
 * Which pane holds the live score depends on the compare mode, so the two are not
 * interchangeable. Combining them by position applies one pane's line-break plan to
 * the other pane's score whenever the live score maps to the right pane. This module
 * exists so that mapping is explicit and testable rather than implied by variable
 * names — two separate defects in this area came from a `left`-named value that
 * actually held live-keyed data.
 */
export type MeasureAlignmentRow = {
    leftIndex: number | null;
    rightIndex: number | null;
    match: boolean;
};

export type ReflowAlignment = {
    rows: MeasureAlignmentRow[];
    leftCount: number;
    rightCount: number;
};

export type ComparePane = 'left' | 'right';

export type CompareReflowPlanInput = {
    /** Existing line breaks read from the live score. */
    liveBreaks: boolean[];
    /** Existing line breaks read from the auxiliary score. */
    auxiliaryBreaks: boolean[];
    /** True when the live score is displayed in the left pane. */
    liveIsLeftPane: boolean;
    /** Pane-oriented alignments. */
    alignments: ReflowAlignment[];
    /** Pane-oriented mismatch break builder. */
    buildMismatchBreaks: (
        rows: MeasureAlignmentRow[],
        pane: ComparePane,
        measureCount: number,
    ) => boolean[];
};

export type CompareReflowPlan = {
    /** Line breaks to apply to the live score. */
    liveReflow: boolean[];
    /** Line breaks to apply to the auxiliary score. */
    auxiliaryReflow: boolean[];
};


/** Which system a measure landed in, by measure index. Undefined when not laid out. */
export type SystemOfMeasure = (measureIndex: number) => number | undefined;

/**
 * Measure indices to break at so both panes wrap at the same alignment rows.
 *
 * `LayoutMode::SYSTEM` honours explicit breaks but still wraps a system when it runs out of
 * width, and the two scores have different content widths — an overfull bar in one wraps
 * where the other does not — so the panes drift apart between block boundaries.
 *
 * Taking the union of both panes' natural wrap points converges in a single pass: every
 * resulting segment ends at the earlier of the two wraps, so it is no longer than a segment
 * that already fitted on either side, and a shorter system cannot overflow. That also makes
 * the result viewport-independent in the way a fixed bars-per-system rule is not — it is
 * derived from where the panes actually wrapped at the current width.
 */
export function buildResyncBreaks(
    rows: MeasureAlignmentRow[],
    leftSystemOf: SystemOfMeasure,
    rightSystemOf: SystemOfMeasure,
): { left: number[]; right: number[] } {
    const left: number[] = [];
    const right: number[] = [];

    const wrapsBetween = (
        systemOf: SystemOfMeasure,
        current: number | null,
        next: number | null,
    ) => {
        if (current === null || next === null) {
            return false;
        }
        const currentSystem = systemOf(current);
        const nextSystem = systemOf(next);
        if (currentSystem === undefined || nextSystem === undefined) {
            return false;
        }
        return currentSystem !== nextSystem;
    };

    for (let index = 0; index < rows.length - 1; index += 1) {
        const row = rows[index];
        const nextRow = rows[index + 1];
        const wraps = wrapsBetween(leftSystemOf, row.leftIndex, nextRow.leftIndex)
            || wrapsBetween(rightSystemOf, row.rightIndex, nextRow.rightIndex);
        if (!wraps) {
            continue;
        }
        // Break on both panes at this row, so the next row starts a system in each.
        if (row.leftIndex !== null) {
            left.push(row.leftIndex);
        }
        if (row.rightIndex !== null) {
            right.push(row.rightIndex);
        }
    }

    return { left, right };
}

export function buildCompareReflowPlan({
    liveBreaks,
    auxiliaryBreaks,
    liveIsLeftPane,
    alignments,
    buildMismatchBreaks,
}: CompareReflowPlanInput): CompareReflowPlan {
    const livePane: ComparePane = liveIsLeftPane ? 'left' : 'right';
    const auxiliaryPane: ComparePane = liveIsLeftPane ? 'right' : 'left';

    const paneCount = (pane: ComparePane) => Math.max(
        0,
        ...alignments.map((alignment) => (
            pane === 'left' ? alignment.leftCount : alignment.rightCount
        )),
    );

    const planFor = (pane: ComparePane, breaks: boolean[]) => {
        // The measure count must come from the same pane as the mismatch rows; taking
        // it from the other pane silently truncates or over-extends the plan.
        const count = breaks.length || paneCount(pane);
        const normalized = Array.from({ length: count }, (_, index) => Boolean(breaks[index]));
        const mismatch = Array.from({ length: count }, () => false);
        alignments.forEach((alignment) => {
            buildMismatchBreaks(alignment.rows, pane, count).forEach((value, index) => {
                if (value) {
                    mismatch[index] = true;
                }
            });
        });
        return normalized.map((value, index) => value || mismatch[index]);
    };

    return {
        liveReflow: planFor(livePane, liveBreaks),
        auxiliaryReflow: planFor(auxiliaryPane, auxiliaryBreaks),
    };
}
