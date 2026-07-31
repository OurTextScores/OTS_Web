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
