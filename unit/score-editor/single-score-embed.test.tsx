import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { setupScoreEditorTest, testGlobals } from './test-harness';

const mocked = vi.hoisted(() => ({
    loadWebMscore: vi.fn(),
    loadWebMscoreInProcess: vi.fn(),
}));
const mockedNavigation = vi.hoisted(() => ({ useSearchParams: vi.fn() }));

vi.mock('next/navigation', () => ({ useSearchParams: mockedNavigation.useSearchParams }));
vi.mock('../../lib/webmscore-loader', () => ({
    loadWebMscore: mocked.loadWebMscore,
    loadWebMscoreInProcess: mocked.loadWebMscoreInProcess,
}));

import ScoreEditor from '../../components/ScoreEditor';

/**
 * `?score=<url>&embed=1` — one score, no chrome.
 *
 * The other two embed modes exist to serve a review and each needs a second
 * identifier (a right-hand score, or a change review), so neither could express
 * "just show me this score". A host page wanting an inline preview had no way
 * to ask for one, which is why the work page kept a second renderer around to
 * do it instead.
 */
describe('ScoreEditor: single-score embed mode', () => {
    const { params } = setupScoreEditorTest(mocked, mockedNavigation);

    const xml = '<score-partwise><part-list/><part id="P1"><measure number="1"/></part></score-partwise>';

    const makeScore = () => ({
        destroy: vi.fn(),
        saveSvg: vi.fn(async () => '<svg><g class="Note"></g></svg>'),
        savePdf: vi.fn(async () => new Uint8Array([1])),
        setSoundFont: vi.fn(async () => {}),
        metadata: vi.fn(async () => ({ parts: [{ name: 'Music' }] })),
        measurePositions: vi.fn(async () => ({
            elements: [{ id: 0, x: 0, y: 0, sx: 100, sy: 40, page: 0 }],
            events: [],
            pageSize: { width: 100, height: 40 },
        })),
        segmentPositions: vi.fn(async () => ({})),
        npages: vi.fn(async () => 1),
    });

    const renderWith = async (values: Record<string, string>) => {
        const score = makeScore();
        mocked.loadWebMscore.mockResolvedValue({
            ready: Promise.resolve(),
            load: vi.fn(async () => score),
        });
        testGlobals.fetch = vi.fn(async () => ({
            ok: true,
            text: async () => xml,
            arrayBuffer: async () => new TextEncoder().encode(xml).buffer,
        }));
        params.score = '/canonical.xml';
        params.values = values;
        const view = render(<ScoreEditor />);
        await waitFor(() => expect(score.saveSvg).toHaveBeenCalled());
        return { ...view, score };
    };

    /** Only the toolbar carries this; it is hidden in every embed mode. */
    const toolbarMarker = 'Drag to reorder. Right-click to snap right.';

    it('hides the editor chrome when a host asks for a preview', async () => {
        const { unmount } = await renderWith({ embed: '1' });
        expect(screen.queryAllByTitle(toolbarMarker)).toHaveLength(0);
        unmount();
    });

    it('keeps the chrome for a plain ?score= launch', async () => {
        // `?score=` is also how the full editor is opened from elsewhere in the
        // product, so embedding has to be asked for rather than implied.
        const { unmount } = await renderWith({});
        await waitFor(() =>
            expect(screen.queryAllByTitle(toolbarMarker).length).toBeGreaterThan(0),
        );
        unmount();
    });

    it('ignores the flag without a score to show', async () => {
        params.score = null;
        params.values = { embed: '1' };
        mocked.loadWebMscore.mockResolvedValue({
            ready: Promise.resolve(),
            load: vi.fn(async () => makeScore()),
        });
        const { unmount } = render(<ScoreEditor />);
        await waitFor(() =>
            expect(screen.queryAllByTitle(toolbarMarker).length).toBeGreaterThan(0),
        );
        unmount();
    });
});
