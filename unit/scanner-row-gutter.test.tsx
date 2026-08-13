import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => ({ loadWebMscore: vi.fn() }));

vi.mock('../lib/webmscore-loader', async (importOriginal) => ({
    ...(await importOriginal<typeof import('../lib/webmscore-loader')>()),
    loadWebMscore: mocked.loadWebMscore,
}));

import {
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

function renderRows(regions: ScannerRowRegion[], calls: any[]) {
    const score = {
        saveSvg: vi.fn(async () => '<svg><g/></svg>'),
        measurePositions: vi.fn(async () => ({
            elements: [{ id: 0, x: 0, y: 0, sx: 100, sy: 40, page: 0 }],
            events: [],
            pageSize: { width: 100, height: 40 },
        })),
        // Four rhythmic positions across the one measure above.
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
            pageSize: { width: 100, height: 40 },
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
            systems={systems}
            regions={regions}
            leftXml={XML}
            rightXml={XML}
            leftLabel="HOMR"
            rightLabel="Transcoda"
            leftEngineId="homr"
            rightEngineId="transcoda"
            merged={{
                present: true,
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

    it('offers a control on each side, pointing at the merged score', async () => {
        const calls: any[] = [];
        renderRows([grounded], calls);

        expect(await screen.findByTestId('btn-take-down-0')).toBeInTheDocument();
        expect(screen.getByTestId('btn-take-up-0')).toBeInTheDocument();
        // Down from the reading above, up from the reading below.
        expect(screen.getByTestId('btn-take-down-0').textContent).toContain('↓');
        expect(screen.getByTestId('btn-take-up-0').textContent).toContain('↑');
    });

    it('offers nothing for a difference with no proven place on the scan', async () => {
        // §7's rule made visible: a decision without evidence is not offered,
        // rather than offered and then refused.
        const calls: any[] = [];
        renderRows([grounded, ungrounded], calls);

        await screen.findByTestId('btn-take-down-0');
        expect(screen.getByTestId('btn-take-down-1')).toBeDisabled();
        expect(screen.getByTestId('btn-take-down-1')).toHaveAttribute(
            'title',
            expect.stringContaining('no verified place'),
        );
    });

    it('sends the decision to the scanner with the engine it takes from', async () => {
        const calls: any[] = [];
        renderRows([grounded], calls);
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
        renderRows([{ ...grounded, rightMeasureIndexes: [] }], calls);

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
        // Transcoda below has lyrics but no dynamics.
        expect(screen.queryByTestId('btn-take-up-dynamics-0')).not.toBeInTheDocument();
        expect(screen.getByTestId('btn-take-up-lyrics-0')).toBeInTheDocument();
    });

    it('offers no marking control when neither reading has any', async () => {
        const calls: any[] = [];
        renderRows([grounded], calls);

        await screen.findByTestId('btn-take-down-0');
        expect(screen.queryByTestId('btn-take-down-dynamics-0')).not.toBeInTheDocument();
        expect(screen.queryByTestId('btn-take-up-lyrics-0')).not.toBeInTheDocument();
    });

    it('sends a marking take to its own route, naming the kind', async () => {
        const calls: any[] = [];
        renderRows(
            [{ ...grounded, rightMarkings: { dynamics: true, lyrics: false } }],
            calls,
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
