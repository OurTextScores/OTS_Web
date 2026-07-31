import { describe, expect, it, vi } from 'vitest';
import {
    buildCompareReflowPlan,
    type ComparePane,
    type MeasureAlignmentRow,
    type ReflowAlignment,
} from '../components/score-editor/compare/compare-reflow-plan';

const rows = (count: number): MeasureAlignmentRow[] => (
    Array.from({ length: count }, (_, index) => ({
        leftIndex: index,
        rightIndex: index,
        match: true,
    }))
);

const alignment = (leftCount: number, rightCount: number): ReflowAlignment => ({
    rows: rows(Math.max(leftCount, rightCount)),
    leftCount,
    rightCount,
});

/** Marks a distinct index per pane, so a pane mix-up is visible in the output. */
const paneMarker = (markIndex: Record<ComparePane, number>) => (
    (_rows: MeasureAlignmentRow[], pane: ComparePane, count: number) => (
        Array.from({ length: count }, (_, index) => index === markIndex[pane])
    )
);

describe('buildCompareReflowPlan', () => {
    it('sends each pane\'s mismatch breaks to the score that pane displays', () => {
        const buildMismatchBreaks = vi.fn(paneMarker({ left: 0, right: 2 }));

        const asLeft = buildCompareReflowPlan({
            liveBreaks: [false, false, false],
            auxiliaryBreaks: [false, false, false],
            liveIsLeftPane: true,
            alignments: [alignment(3, 3)],
            buildMismatchBreaks,
        });

        // Live sits in the left pane, so it takes the left marker at index 0.
        expect(asLeft.liveReflow).toEqual([true, false, false]);
        expect(asLeft.auxiliaryReflow).toEqual([false, false, true]);
    });

    it('follows the swap: the same inputs invert when the live score is on the right', () => {
        const buildMismatchBreaks = vi.fn(paneMarker({ left: 0, right: 2 }));

        const asRight = buildCompareReflowPlan({
            liveBreaks: [false, false, false],
            auxiliaryBreaks: [false, false, false],
            liveIsLeftPane: false,
            alignments: [alignment(3, 3)],
            buildMismatchBreaks,
        });

        // This is the case the old position-based combination got wrong: it handed the
        // left pane's plan to the live score regardless of which pane displayed it.
        expect(asRight.liveReflow).toEqual([false, false, true]);
        expect(asRight.auxiliaryReflow).toEqual([true, false, false]);
    });

    it('queries mismatch rows for the pane each score is actually shown in', () => {
        const buildMismatchBreaks = vi.fn(paneMarker({ left: 0, right: 1 }));

        buildCompareReflowPlan({
            liveBreaks: [false, false],
            auxiliaryBreaks: [false, false],
            liveIsLeftPane: false,
            alignments: [alignment(2, 2)],
            buildMismatchBreaks,
        });

        const panes = buildMismatchBreaks.mock.calls.map((call) => call[1]);
        expect(panes).toEqual(['right', 'left']);
    });

    it('preserves existing breaks and unions them with mismatch breaks', () => {
        const plan = buildCompareReflowPlan({
            liveBreaks: [true, false, false],
            auxiliaryBreaks: [false, true, false],
            liveIsLeftPane: true,
            alignments: [alignment(3, 3)],
            buildMismatchBreaks: paneMarker({ left: 2, right: 2 }),
        });

        expect(plan.liveReflow).toEqual([true, false, true]);
        expect(plan.auxiliaryReflow).toEqual([false, true, true]);
    });

    it('takes the measure count from the matching pane when a score has no breaks yet', () => {
        const plan = buildCompareReflowPlan({
            liveBreaks: [],
            auxiliaryBreaks: [],
            liveIsLeftPane: false,
            // Deliberately different per pane: a mix-up changes the output length.
            alignments: [alignment(2, 5)],
            buildMismatchBreaks: () => [],
        });

        // Live is on the right, so it gets the right pane's count of 5.
        expect(plan.liveReflow).toHaveLength(5);
        expect(plan.auxiliaryReflow).toHaveLength(2);
    });

    it('prefers a score\'s own break length over the pane count', () => {
        const plan = buildCompareReflowPlan({
            liveBreaks: [false, false, false, false],
            auxiliaryBreaks: [],
            liveIsLeftPane: true,
            alignments: [alignment(2, 7)],
            buildMismatchBreaks: () => [],
        });

        expect(plan.liveReflow).toHaveLength(4);
        expect(plan.auxiliaryReflow).toHaveLength(7);
    });

    it('unions mismatch breaks across every part alignment', () => {
        const perAlignment = [0, 2];
        let call = 0;
        const plan = buildCompareReflowPlan({
            liveBreaks: [false, false, false],
            auxiliaryBreaks: [false, false, false],
            liveIsLeftPane: true,
            alignments: [alignment(3, 3), alignment(3, 3)],
            buildMismatchBreaks: (_rows, pane, count) => {
                // Only vary the live (left) pane; index alternates per alignment.
                const mark = pane === 'left' ? perAlignment[call++ % 2] : -1;
                return Array.from({ length: count }, (_, index) => index === mark);
            },
        });

        expect(plan.liveReflow).toEqual([true, false, true]);
    });

    it('returns empty plans when there is nothing to lay out', () => {
        const plan = buildCompareReflowPlan({
            liveBreaks: [],
            auxiliaryBreaks: [],
            liveIsLeftPane: true,
            alignments: [],
            buildMismatchBreaks: () => [],
        });

        expect(plan.liveReflow).toEqual([]);
        expect(plan.auxiliaryReflow).toEqual([]);
    });
});
