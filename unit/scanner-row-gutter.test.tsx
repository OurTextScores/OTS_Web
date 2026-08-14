import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => ({ loadWebMscore: vi.fn() }));

vi.mock('../lib/webmscore-loader', async (importOriginal) => ({
    ...(await importOriginal<typeof import('../lib/webmscore-loader')>()),
    loadWebMscore: mocked.loadWebMscore,
}));

import {
    engravedRowWindow,
    focusedMeasureIndexes,
    lineStartsInMerge,
    placeUnderMerged,
    ScannerSystemRows,
    type ScannerRowRegion,
    type ScannerSystem,
} from '../components/score-editor/compare/ScannerSystemRows';

/**
 * The gutter is where a reviewer decides. Two of its rules are not cosmetic:
 * the arrow says where the bar goes, and a difference with no proven place on
 * the scan has no control at all.
 */

const XML =
    '<?xml version="1.0"?><score-partwise><part-list><score-part id="P1"/></part-list>' +
    '<part id="P1"><measure number="1"><note/></measure></part></score-partwise>';

const REGIONS_URL =
    'https://host/api/proxy/scanner/jobs/job-1/pages/1/comparison/regions?baseEngine=homr';

const systems: ScannerSystem[] = [
    { systemIndex: 0, leftMeasureIndexes: [0], rightMeasureIndexes: [0] },
];

const croppedSystems: ScannerSystem[] = [
    { systemIndex: 0, leftMeasureIndexes: [0], rightMeasureIndexes: [0], cropUrl: 'systems/0/crop' },
    { systemIndex: 1, leftMeasureIndexes: [1], rightMeasureIndexes: [1], cropUrl: 'systems/1/crop' },
];

const grounded: ScannerRowRegion = {
    blockIndex: 0,
    leftMeasureIndexes: [0],
    rightMeasureIndexes: [0],
    differenceClasses: ['notation'],
    grounded: true,
    contentSignature: 'scanner-block-content-v2:abc',
};

const ungrounded: ScannerRowRegion = {
    blockIndex: 1,
    leftMeasureIndexes: [0],
    rightMeasureIndexes: [0],
    differenceClasses: ['notation'],
    grounded: false,
};

function renderRows(
    regions: ScannerRowRegion[],
    calls: any[],
    options: {
        systems?: ScannerSystem[];
        onlyBlockIndex?: number;
        sourceEngineId?: string;
        decisions?: Array<{ blockIndex?: number; engineId?: string; markingsOnly?: 'dynamics' | 'lyrics' }>;
        measureMap?: number[];
    } = {},
) {
    const score = {
        saveSvg: vi.fn(async () => '<svg><g/></svg>'),
        measurePositions: vi.fn(async () => ({
            // Five bars across the page, so a row can be narrowed to some of them.
            elements: [0, 1, 2, 3, 4].map((index) => ({
                id: index,
                x: index * 100,
                y: 0,
                sx: 100,
                sy: 40,
                page: 0,
            })),
            events: [],
            pageSize: { width: 500, height: 40 },
        })),
        // Four rhythmic positions across the one measure above.
        // Four rhythmic positions inside the first measure above.
        segmentPositions: vi.fn(async () => ({
            elements: [0, 1, 2, 3].map((index) => ({
                id: index,
                x: index * 25,
                y: 5,
                sx: 8,
                sy: 30,
                page: 0,
            })),
            events: [],
            pageSize: { width: 500, height: 40 },
        })),
        saveXml: vi.fn(async () => new TextEncoder().encode(XML)),
        relayout: vi.fn(async () => undefined),
        destroy: vi.fn(),
    };
    mocked.loadWebMscore.mockResolvedValue({ load: vi.fn(async () => score) } as any);
    vi.stubGlobal(
        'fetch',
        vi.fn(async (input: any, init?: RequestInit) => {
            calls.push({ url: String(input), method: init?.method || 'GET', body: init?.body });
            return init?.method === 'POST'
                ? new Response(JSON.stringify({ present: true, revision: 2, repairs: [] }), {
                      status: 200,
                  })
                : new Response(XML, { status: 200 });
        }),
    );

    return render(
        <ScannerSystemRows
            systems={options.systems || systems}
            onlyBlockIndex={options.onlyBlockIndex}
            regions={regions}
            leftXml={XML}
            rightXml={XML}
            leftLabel="HOMR"
            rightLabel="Transcoda"
            leftEngineId="homr"
            rightEngineId="transcoda"
            merged={{
                present: true,
                sourceEngineId: options.sourceEngineId ?? 'transcoda',
                decisions: options.decisions,
                measureMap: options.measureMap,
                revision: 1,
                edited: false,
                basisSignature: 'basis',
                stale: false,
                url: '../merged',
                musicXmlUrl: '../merged/musicxml?revision=1',
            }}
            resolveUrl={(relative) => new URL(relative, REGIONS_URL).toString()}
        />,
    );
}

describe('the system pane', () => {
    beforeEach(() => {
        mocked.loadWebMscore.mockReset();
        vi.unstubAllGlobals();
    });

    it('scales the drawing to its own box, not to a container above it', async () => {
        // The pane used to be handed the scroll container's `clientWidth`,
        // which counts that container's padding and knows nothing about the row
        // card's — so every pane was scaled ~58px wider than the box it had to
        // fit in and the music ran off a clipped edge. Measuring itself cannot
        // drift from the layout however much padding is added above.
        const observed: Element[] = [];
        vi.stubGlobal(
            'ResizeObserver',
            class {
                constructor(private readonly callback: () => void) {}
                observe(node: Element) {
                    observed.push(node);
                    this.callback();
                }
                disconnect() {}
            },
        );
        const calls: any[] = [];
        renderRows([grounded], calls);

        await screen.findByTestId('btn-take-down-0');
        // The pane itself — the element the drawing lands in — is observed, not
        // only the scroll container it happens to sit inside.
        const panes = observed.filter(
            (node) =>
                node.className.includes('overflow-clip') && node.className.includes('w-full'),
        );
        expect(panes.length).toBeGreaterThan(0);
    });
});

describe('choosing the bars a pane draws', () => {
    it('keeps one bar of context either side of the difference', () => {
        // A barline join is part of what a reviewer is judging: whether a bar
        // was split, and whether the bar after it still starts where it should.
        expect(focusedMeasureIndexes([0, 1, 2, 3, 4], [2])).toEqual([1, 2, 3]);
        expect(focusedMeasureIndexes([0, 1, 2, 3, 4], [0])).toEqual([0, 1]);
        expect(focusedMeasureIndexes([0, 1, 2, 3, 4], [4])).toEqual([3, 4]);
    });

    it('joins two differences on one line rather than showing each alone', () => {
        expect(focusedMeasureIndexes([0, 1, 2, 3, 4], [1, 3])).toEqual([0, 1, 2, 3, 4]);
    });

    it('keeps the whole line for a side with nothing in the difference', () => {
        // The empty half of an insertion or a removal. There is nothing there
        // to narrow to, and what that side is missing can only be judged
        // against what it has instead.
        expect(focusedMeasureIndexes([0, 1, 2, 3], [])).toEqual([0, 1, 2, 3]);
    });
});

describe('a merged line that would not fit on one system', () => {
    const box = (left: number, top: number) => ({ left, top, width: 100, height: 40 });
    // Five bars imposed as one line, engraved as four then one.
    const split = {
        measures: [box(0, 0), box(100, 0), box(200, 0), box(300, 0), box(0, 120)],
    } as any;

    it('drops the bars that spilled onto a second system', () => {
        // Neither page width nor staff size fixes the spill — quartering the
        // staff left a Klengel line split in exactly the same place — so the
        // pane shows one engraved row rather than pretending the line is whole.
        expect(engravedRowWindow(split, [0, 1, 2, 3, 4], [])).toEqual([0, 1, 2, 3]);
    });

    it('drops from the front instead when the difference is in the spill', () => {
        // The reader is here to judge a difference; a window that leaves it off
        // screen is no use however tidy it looks.
        expect(engravedRowWindow(split, [0, 1, 2, 3, 4], [4])).toEqual([4]);
    });

    it('keeps the row holding all of the difference when one does', () => {
        expect(engravedRowWindow(split, [0, 1, 2, 3, 4], [1, 2])).toEqual([0, 1, 2, 3]);
        // Spanning the break, the row holding the first of them wins.
        expect(engravedRowWindow(split, [0, 1, 2, 3, 4], [3, 4])).toEqual([0, 1, 2, 3]);
    });

    it('leaves a line that fits exactly as it is', () => {
        const whole = { measures: [box(0, 0), box(100, 0), box(200, 0)] } as any;
        expect(engravedRowWindow(whole, [0, 1, 2], [1])).toEqual([0, 1, 2]);
    });
});

describe('holding the merged line still', () => {
    it('follows a line start through a take that changed the bar count', () => {
        // The starts are positions in the engine reading. A take that inserts
        // or removes bars renumbers everything after it, so breaking at the old
        // number puts a different bar at the head of the line — the line
        // reflowing under a reader who did not ask it to.
        //
        // One bar inserted before the reading's bar 2, so that bar is now the
        // merge's bar 3.
        expect(lineStartsInMerge([0, 2, 4], [0, 1, -1, 2, 3, 4])).toEqual([0, 3, 5]);
    });

    it('drops a line whose first bar a decision removed', () => {
        // Breaking at whatever now sits at that number would begin the line in
        // the wrong place; one line too few is the smaller lie.
        expect(lineStartsInMerge([0, 2, 4], [0, 1, 4])).toEqual([0, 2]);
    });

    it('leaves the starts alone before there is a merged document', () => {
        // Until one is saved the merged score *is* the reading, so its bars are
        // already numbered the way the starts expect.
        expect(lineStartsInMerge([0, 2, 4], undefined)).toEqual([0, 2, 4]);
    });
});

describe('placing a reading under the merged line', () => {
    // A merged line of four equal bars across a 400px pane: 100px a bar.
    const merged = {
        svg: '',
        segments: [],
        width: 400,
        pageHeight: 100,
        renderScale: 1,
        measures: [0, 1, 2, 3].map((index) => ({
            left: index * 100,
            width: 100,
            top: 0,
            height: 40,
        })),
    };

    it("draws at the merged score's scale, over the bars it would replace", () => {
        // Forced to fill the pane, two contested bars of a twelve-bar line blew
        // up to the full width and sat nowhere near the merged bars they
        // replace. Handed the box its counterpart occupies, a reading is drawn
        // at that size, in that place — so the reader compares by looking up and
        // down a column rather than across two differently-zoomed pictures.
        expect(placeUnderMerged(merged as any, [0, 1, 2, 3], [1, 2], 400)).toEqual({
            left: 100,
            width: 200,
        });
        // The last bar of the line sits at the right-hand end of the pane.
        expect(placeUnderMerged(merged as any, [0, 1, 2, 3], [3], 400)).toEqual({
            left: 300,
            width: 100,
        });
    });

    it('gives no box when there is nothing to line up against', () => {
        // The merged score does not draw this line, or the bars are not in it.
        // The pane then fills its own width, as it did before there was
        // anything to align to.
        expect(placeUnderMerged(null, [0, 1], [0], 400)).toBeNull();
        expect(placeUnderMerged(merged as any, [], [0], 400)).toBeNull();
        expect(placeUnderMerged(merged as any, [0, 1, 2, 3], [9], 400)).toBeNull();
    });
});

describe('the difference navigator', () => {
    beforeEach(() => {
        mocked.loadWebMscore.mockReset();
        vi.unstubAllGlobals();
    });

    const twoDifferences: ScannerRowRegion[] = [
        {
            ...grounded,
            blockIndex: 0,
            leftMeasureIndexes: [0],
            rightMeasureIndexes: [0],
            leftMeasureLabel: 'bar 1',
            rightMeasureLabel: 'bar 1',
            cropBoxes: [{ systemIndex: 0, left: 0.25, top: 0, width: 0.5, height: 1 }],
        },
        {
            ...grounded,
            blockIndex: 1,
            leftMeasureIndexes: [1],
            rightMeasureIndexes: [1],
            differenceClasses: ['measure-removed'],
            leftMeasureLabel: 'bar 2',
            rightMeasureLabel: '',
            contentSignature: 'scanner-block-content-v2:def',
        },
    ];

    it('names the difference under review and moves to the next one', async () => {
        // This used to be a card outside the editor: a list of blocks, a
        // cropped scrap of scan, and the editor below — three places to look at
        // one difference. The title says which one it is, and the arrows move.
        const calls: any[] = [];
        renderRows(twoDifferences, calls, {
            systems: croppedSystems,
            onlyBlockIndex: 0,
        });

        expect(await screen.findByTestId('difference-title')).toHaveTextContent(
            'Difference 1 of 2',
        );
        expect(screen.getByText(/HOMR: bar 1/)).toBeInTheDocument();
        // Nothing to go back to from the first.
        expect(screen.getByTestId('btn-previous-difference')).toBeDisabled();

        await userEvent.click(screen.getByTestId('btn-next-difference'));

        expect(screen.getByTestId('difference-title')).toHaveTextContent('Difference 2 of 2');
        // A side with no matching bar says so rather than showing an empty gap.
        expect(screen.getByText(/Transcoda: no matching bar/)).toBeInTheDocument();
        expect(screen.getByTestId('btn-next-difference')).toBeDisabled();
    });

    it('narrows the engine panes to the contested bars, and nothing else', async () => {
        // A system is up to a dozen bars and a difference is usually one or two
        // of them. Spending the width on music both readings agree about
        // shrinks the bars in question to the point where comparing a beam
        // means leaning at the screen. The scan and the merged score keep their
        // whole line: one is the context the judgement rests on, the other is
        // the thing being built.
        const calls: any[] = [];
        const wideSystems: ScannerSystem[] = [
            {
                systemIndex: 0,
                leftMeasureIndexes: [0, 1, 2, 3, 4],
                rightMeasureIndexes: [0, 1, 2, 3, 4],
            },
        ];
        renderRows(
            [
                {
                    ...grounded,
                    blockIndex: 0,
                    leftMeasureIndexes: [2],
                    rightMeasureIndexes: [2],
                },
            ],
            calls,
            { systems: wideSystems, onlyBlockIndex: 0 },
        );

        await screen.findByTestId('btn-take-down-0');
        expect(
            screen.getAllByTestId('pane-measures').map((node) => node.textContent),
        ).toEqual(['1,2,3', '1,2,3']);
    });

    it('boxes the difference on the scan it came from', async () => {
        // The crop is the system, not a cut-out of the bars: the reader keeps
        // the line for context and the box says which part of it is in question.
        const calls: any[] = [];
        renderRows(twoDifferences, calls, {
            systems: croppedSystems,
            onlyBlockIndex: 0,
        });

        // Once above the first reading and once below the second, so each
        // reading has the page it was read from next to it.
        const boxes = await screen.findAllByTestId('scan-difference-box');
        expect(boxes).toHaveLength(2);
        expect(boxes[0]).toHaveStyle({ left: '25%', width: '50%' });
    });

    it('says a scan crop is stale rather than showing a broken image', async () => {
        // The crop is signature-bound and the server refuses it once the job
        // moves on. An <img> cannot read that refusal, so it has to be said.
        const calls: any[] = [];
        renderRows(twoDifferences, calls, {
            systems: croppedSystems,
            onlyBlockIndex: 0,
        });

        const crop = await screen.findByAltText('Scan of system 1');
        fireEvent.error(crop);

        // Both copies go: it is one crop, shown twice.
        const alerts = await screen.findAllByRole('alert');
        expect(alerts[0]).toHaveTextContent(/This scan crop is no longer current/);
        expect(screen.queryByAltText('Scan of system 1')).toBeNull();
        expect(screen.queryByAltText('Scan of system 1, repeated')).toBeNull();
    });
});

describe('the row gutter', () => {
    beforeEach(() => {
        mocked.loadWebMscore.mockReset();
        vi.unstubAllGlobals();
    });

    it('marks the events that did not match, not the whole bar', async () => {
        // A block names bars, and a bar is a coarse thing to point at. The
        // scanner aligns the two readings event by event, so the row can put
        // the mark on the note rather than around it.
        const calls: any[] = [];
        renderRows(
            [
                {
                    ...grounded,
                    symbolDifferences: [
                        {
                            leftMeasureIndex: 0,
                            rightMeasureIndex: 0,
                            leftEventIndexes: [2],
                            rightEventIndexes: [2],
                            leftEventCount: 4,
                            rightEventCount: 4,
                        },
                    ],
                },
            ],
            calls,
        );

        await screen.findByTestId('btn-take-down-0');
        // One per pane that renders: both readings and the merged score.
        expect(await screen.findAllByTestId('symbol-highlight')).not.toHaveLength(0);
    });

    it('marks nothing when this drawing counts events differently', async () => {
        // The analysis counts events; the drawing knows where positions sit,
        // and nothing connects them but the ordering. When the totals disagree
        // the two are not counting the same thing, and a confident box on the
        // wrong note is worse than the bar-level mark the row already carries.
        const calls: any[] = [];
        renderRows(
            [
                {
                    ...grounded,
                    symbolDifferences: [
                        {
                            leftMeasureIndex: 0,
                            rightMeasureIndex: 0,
                            leftEventIndexes: [2],
                            rightEventIndexes: [2],
                            leftEventCount: 9,
                            rightEventCount: 9,
                        },
                    ],
                },
            ],
            calls,
        );

        await screen.findByTestId('btn-take-down-0');
        expect(screen.queryAllByTestId('symbol-highlight')).toHaveLength(0);
    });

    it('points each arrow at the merged score between them', async () => {
        const calls: any[] = [];
        renderRows([grounded], calls, { sourceEngineId: 'transcoda' });

        // Down from the reading above, up from the reading below.
        expect((await screen.findByTestId('btn-take-down-0')).textContent).toContain('↓');
        expect(screen.getByTestId('btn-take-up-0').textContent).toContain('↑');
    });

    it('offers nothing for a difference with no proven place on the scan', async () => {
        // §7's rule, now taken literally: a decision without evidence is not
        // offered at all. It used to be drawn disabled, which is offering it
        // and then refusing — and a disabled control cannot be told apart from
        // one that is merely unavailable just now.
        const calls: any[] = [];
        renderRows([grounded, ungrounded], calls);

        await screen.findByTestId('btn-take-down-0');
        expect(screen.queryByTestId('btn-take-down-1')).toBeNull();
    });

    it('says which reading the merged bar already follows, and leaves it there', async () => {
        // Removing it made the pair asymmetric: after taking a bar from one
        // reading there was no control to take it back, so a decision could not
        // be undone from where it was made. Left in and disabled, it is also
        // the only thing on screen saying what the merged bar currently reads.
        const calls: any[] = [];
        renderRows([grounded], calls, { sourceEngineId: 'homr' });

        const already = await screen.findByTestId('btn-take-down-0');
        expect(already).toBeDisabled();
        expect(already).toHaveAttribute('title', expect.stringContaining('already reads'));
        // The other side is the one that would change something.
        expect(screen.getByTestId('btn-take-up-0')).toBeEnabled();
    });

    it('turns the pair around once a decision has moved that bar', async () => {
        const calls: any[] = [];
        renderRows([grounded], calls, {
            sourceEngineId: 'homr',
            decisions: [{ blockIndex: 0, engineId: 'transcoda' }],
        });

        // The merged score now reads this block from Transcoda, so taking it
        // back from HOMR is the undo — and it is enabled.
        expect(await screen.findByTestId('btn-take-down-0')).toBeEnabled();
        expect(screen.getByTestId('btn-take-up-0')).toBeDisabled();
    });

    it('does not count a marking take as moving the notes', async () => {
        const calls: any[] = [];
        renderRows([grounded], calls, {
            sourceEngineId: 'homr',
            decisions: [{ blockIndex: 0, engineId: 'transcoda', markingsOnly: 'dynamics' }],
        });

        await screen.findByTestId('btn-take-up-0');
        expect(screen.getByTestId('btn-take-down-0')).toBeDisabled();
    });

    it('shows what a take would replace while the pointer is on it', async () => {
        // Hover is a question — "which bars is this one?" — and the panes are
        // the only place it can be answered without words.
        const calls: any[] = [];
        renderRows([grounded], calls, { sourceEngineId: 'transcoda' });

        const take = await screen.findByTestId('btn-take-down-0');
        expect(screen.queryAllByTestId('take-preview')).toHaveLength(0);

        fireEvent.mouseEnter(take);
        expect(screen.getAllByTestId('take-preview').length).toBeGreaterThan(0);

        fireEvent.mouseLeave(take);
        expect(screen.queryAllByTestId('take-preview')).toHaveLength(0);
    });

    it('sends the decision to the scanner with the engine it takes from', async () => {
        const calls: any[] = [];
        renderRows([grounded], calls, { sourceEngineId: 'homr' });
        const user = userEvent.setup();

        await user.click(await screen.findByTestId('btn-take-up-0'));

        await waitFor(() => expect(calls.some((call) => call.method === 'POST')).toBe(true));
        const post = calls.find((call) => call.method === 'POST');
        const body = JSON.parse(String(post.body));
        // The lower gutter takes from the reading below it.
        expect(body).toMatchObject({
            blockIndex: 0,
            engineId: 'transcoda',
            contentSignature: 'scanner-block-content-v2:abc',
            revision: 1,
        });
    });

    it('says what a removal is, so a reviewer is not surprised by it', async () => {
        // A block one reading has no bars for removes them rather than replacing
        // them, and the count changes. Saying "take" alone would understate it.
        const calls: any[] = [];
        renderRows([{ ...grounded, rightMeasureIndexes: [] }], calls, { sourceEngineId: 'homr' });

        const up = await screen.findByTestId('btn-take-up-0');
        expect(up.textContent).toContain('remove');
    });

    it('offers dynamics and lyrics separately, and only where they exist', async () => {
        // Separate because they are separate judgements: a reviewer may trust
        // one engine's dynamics and the other's words. Gated on availability
        // because a control that would take nothing is worse than none — and a
        // difference class says the readings *disagree* about dynamics, not
        // which of them has any.
        const calls: any[] = [];
        renderRows(
            [
                {
                    ...grounded,
                    leftMarkings: { dynamics: true, lyrics: false },
                    rightMarkings: { dynamics: false, lyrics: true },
                },
            ],
            calls,
        );

        await screen.findByTestId('btn-take-down-0');
        // HOMR above has dynamics but no lyrics.
        expect(screen.getByTestId('btn-take-down-dynamics-0')).toBeInTheDocument();
        expect(screen.queryByTestId('btn-take-down-lyrics-0')).not.toBeInTheDocument();
    });

    it('offers no marking control when neither reading has any', async () => {
        const calls: any[] = [];
        renderRows([grounded], calls);

        await screen.findByTestId('btn-take-down-0');
        expect(screen.queryByTestId('btn-take-down-dynamics-0')).not.toBeInTheDocument();
        expect(screen.queryByTestId('btn-take-up-lyrics-0')).not.toBeInTheDocument();
    });

    it('offers to take the notes anyway when the lengths are what refused it', async () => {
        // "These readings are different lengths" is a fact about arithmetic;
        // whether the notes are better is a judgement only someone looking at
        // the scan can make. So the refusal is stated, and beside it the offer
        // to do it anyway — a different act from pressing take, recorded as one.
        const calls: any[] = [];
        vi.stubGlobal(
            'fetch',
            vi.fn(async (input: any, init?: RequestInit) => {
                calls.push({ url: String(input), method: init?.method || 'GET', body: init?.body });
                if (init?.method !== 'POST') return new Response(XML, { status: 200 });
                const sent = JSON.parse(String(init.body));
                return sent.acceptDurationChange
                    ? new Response(JSON.stringify({ present: true, revision: 3, repairs: [] }), {
                          status: 200,
                      })
                    : new Response(
                          JSON.stringify({
                              message:
                                  'This passage cannot be taken from that reading: The two readings of this passage are different lengths.',
                          }),
                          { status: 409 },
                      );
            }),
        );
        const score = {
            saveSvg: vi.fn(async () => '<svg><g/></svg>'),
            measurePositions: vi.fn(async () => ({
                elements: [{ id: 0, x: 0, y: 0, sx: 100, sy: 40, page: 0 }],
                events: [],
                pageSize: { width: 100, height: 40 },
            })),
            segmentPositions: vi.fn(async () => ({ elements: [], events: [], pageSize: { width: 100, height: 40 } })),
            saveXml: vi.fn(async () => new TextEncoder().encode(XML)),
            relayout: vi.fn(async () => undefined),
            destroy: vi.fn(),
        };
        mocked.loadWebMscore.mockResolvedValue({ load: vi.fn(async () => score) } as any);
        render(
            <ScannerSystemRows
                systems={systems}
                onlyBlockIndex={0}
                regions={[grounded]}
                leftXml={XML}
                rightXml={XML}
                leftLabel="HOMR"
                rightLabel="Transcoda"
                leftEngineId="homr"
                rightEngineId="transcoda"
                merged={{
                    present: true,
                    sourceEngineId: 'homr',
                    revision: 1,
                    edited: false,
                    basisSignature: 'basis',
                    stale: false,
                    url: '../merged',
                    musicXmlUrl: '../merged/musicxml?revision=1',
                }}
                resolveUrl={(relative) => new URL(relative, REGIONS_URL).toString()}
            />,
        );

        await userEvent.click(await screen.findByTestId('btn-take-up-0'));
        // Said beside the button that was pressed, not at the top of a view
        // thousands of pixels tall, where a refusal reads as a dead button.
        await waitFor(() => expect(screen.getByTestId('take-outcome')).toBeInTheDocument());
        expect(screen.getByTestId('take-outcome').textContent).toContain('different lengths');
        expect(screen.getByTestId('btn-take-anyway')).toBeInTheDocument();

        await userEvent.click(screen.getByTestId('btn-take-anyway'));
        await waitFor(() =>
            expect(
                calls.some(
                    (call) =>
                        call.method === 'POST' &&
                        JSON.parse(String(call.body)).acceptDurationChange === true,
                ),
            ).toBe(true),
        );
    });

    it('does not offer it for a refusal that is not about length', async () => {
        const calls: any[] = [];
        renderRows([grounded], calls, { sourceEngineId: 'homr' });
        await screen.findByTestId('btn-take-up-0');
        expect(screen.queryByTestId('btn-take-anyway')).toBeNull();
    });

    it('sends a marking take to its own route, naming the kind', async () => {
        const calls: any[] = [];
        renderRows(
            [{ ...grounded, rightMarkings: { dynamics: true, lyrics: false } }],
            calls,
            { sourceEngineId: 'homr' },
        );
        const user = userEvent.setup();

        await user.click(await screen.findByTestId('btn-take-up-dynamics-0'));

        await waitFor(() => expect(calls.some((call) => call.method === 'POST')).toBe(true));
        const post = calls.find((call) => call.method === 'POST');
        expect(new URL(post.url).pathname).toContain('/merged/decisions/markings');
        expect(JSON.parse(String(post.body))).toMatchObject({
            blockIndex: 0,
            engineId: 'transcoda',
            kind: 'dynamics',
        });
    });
});
