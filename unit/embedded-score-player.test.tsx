import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    search: new URLSearchParams({ score: '/score.musicxml', follow: '0' }),
    loadScoreFromUrl: vi.fn(),
    requestScoreLayoutProgress: vi.fn(),
    transport: {
        state: 'idle',
        positionMs: 0,
        positionRef: { current: 0 },
        renderWindowIdle: false,
        togglePlayPause: vi.fn(),
        stopAt: vi.fn(),
        seek: vi.fn(),
        reset: vi.fn(),
        dispose: vi.fn(async () => {}),
        prefetchSoundFont: vi.fn(async () => null),
    },
}));

vi.mock('next/navigation', () => ({ useSearchParams: () => mocks.search }));
vi.mock('@/lib/score-loader', () => ({
    loadScoreFromUrl: mocks.loadScoreFromUrl,
    requestScoreLayoutProgress: mocks.requestScoreLayoutProgress,
}));
vi.mock('@/lib/playback/use-score-transport', () => ({
    useScoreTransport: () => mocks.transport,
}));

import EmbeddedScorePlayer from '@/components/score-player/EmbeddedScorePlayer';

const positions = {
    elements: [
        { id: 0, x: 0, y: 0, sx: 100, sy: 40, page: 0 },
        { id: 1, x: 0, y: 0, sx: 100, sy: 40, page: 1 },
    ],
    events: [],
    pageSize: { width: 100, height: 40 },
};

const makeScore = () => ({
    destroy: vi.fn(),
    metadata: vi.fn(async () => ({ title: 'Test score', duration: 2 })),
    npages: vi.fn(async () => 1),
    measurePositions: vi.fn(async () => positions),
    playbackTimeline: vi.fn(async () => ({
        schemaVersion: 1 as const,
        durationMs: 2_000,
        renderDurationMs: 5_000,
        occurrences: [
            { occurrenceIndex: 0, measureIndex: 0, startMs: 0, endMs: 1_000 },
            { occurrenceIndex: 1, measureIndex: 1, startMs: 1_000, endMs: 2_000 },
        ],
    })),
    saveSvg: vi.fn(async (page: number) => `<svg data-page="${page}"></svg>`),
});

describe('EmbeddedScorePlayer progressive pages', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.search = new URLSearchParams({ score: '/score.musicxml', follow: '0' });
        mocks.transport.state = 'idle';
        mocks.transport.positionMs = 0;
        mocks.transport.positionRef.current = 0;
        mocks.transport.renderWindowIdle = true;
        const score = makeScore();
        mocks.loadScoreFromUrl.mockResolvedValue({
            loadedScore: score,
            progressivePaging: true,
            progressiveHasMore: true,
            initialAvailablePages: 1,
            engineMode: 'worker',
            format: 'musicxml',
            data: new Uint8Array([1]),
        });
    });

    it('queues layout during playback, shows status, then runs in the render-ahead idle window', async () => {
        mocks.transport.state = 'playing';
        mocks.transport.renderWindowIdle = false;
        mocks.requestScoreLayoutProgress.mockResolvedValue({
            targetPage: 1,
            targetSatisfied: true,
            availablePages: 2,
            totalMeasures: 2,
            laidOutMeasures: 2,
            loadedUntilTick: 960,
            hasMorePages: false,
            isComplete: true,
        });
        const view = render(<EmbeddedScorePlayer />);
        await screen.findByTestId('player-svg');

        fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
        expect(screen.getByRole('status', { name: '' })).toHaveTextContent('Preparing next page…');
        expect(mocks.requestScoreLayoutProgress).not.toHaveBeenCalled();

        mocks.transport.renderWindowIdle = true;
        view.rerender(<EmbeddedScorePlayer />);
        await waitFor(() => expect(mocks.requestScoreLayoutProgress).toHaveBeenCalledOnce());
        await waitFor(() => expect(screen.getByText('Page 2 of 2')).toBeInTheDocument());
    });

    it('keeps the last rendered score visible when progressive layout fails', async () => {
        mocks.requestScoreLayoutProgress.mockRejectedValue(new Error('Layout timed out'));
        render(<EmbeddedScorePlayer />);
        await waitFor(() => expect(screen.getByTestId('player-svg').innerHTML).toContain('data-page="0"'));

        fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
        await screen.findByText('Layout timed out');

        expect(screen.getByTestId('player-svg')).toBeVisible();
        expect(screen.getByTestId('player-play')).toBeEnabled();
    });

    it('extends progressive layout when follow reaches the last known measure', async () => {
        mocks.search = new URLSearchParams({ score: '/score.musicxml' });
        mocks.transport.positionMs = 1_500;
        mocks.transport.positionRef.current = 1_500;
        const score = makeScore();
        vi.mocked(score.measurePositions)
            .mockResolvedValueOnce({ ...positions, elements: positions.elements.slice(0, 1) })
            .mockResolvedValue(positions);
        mocks.loadScoreFromUrl.mockResolvedValue({
            loadedScore: score,
            progressivePaging: true,
            progressiveHasMore: true,
            initialAvailablePages: 1,
            engineMode: 'worker',
            format: 'musicxml',
            data: new Uint8Array([1]),
        });
        mocks.requestScoreLayoutProgress.mockResolvedValue({
            targetPage: 1,
            targetSatisfied: true,
            availablePages: 2,
            totalMeasures: 2,
            laidOutMeasures: 2,
            loadedUntilTick: 960,
            hasMorePages: false,
            isComplete: true,
        });

        render(<EmbeddedScorePlayer />);

        await waitFor(() => expect(mocks.requestScoreLayoutProgress).toHaveBeenCalledWith(score, 1));
        await waitFor(() => expect(screen.getByText('Page 2 of 2')).toBeInTheDocument());
    });

    it('restores the last readable page when rendering a newly laid-out page fails', async () => {
        const score = makeScore();
        vi.mocked(score.saveSvg).mockImplementation(async (page: number) => {
            if (page === 1) throw new Error('Page render failed');
            return '<svg data-page="0"></svg>';
        });
        mocks.loadScoreFromUrl.mockResolvedValue({
            loadedScore: score,
            progressivePaging: true,
            progressiveHasMore: true,
            initialAvailablePages: 1,
            engineMode: 'worker',
            format: 'musicxml',
            data: new Uint8Array([1]),
        });
        mocks.requestScoreLayoutProgress.mockResolvedValue({
            targetPage: 1,
            targetSatisfied: true,
            availablePages: 2,
            totalMeasures: 2,
            laidOutMeasures: 2,
            loadedUntilTick: 960,
            hasMorePages: false,
            isComplete: true,
        });
        render(<EmbeddedScorePlayer />);
        await waitFor(() => expect(screen.getByTestId('player-svg').innerHTML).toContain('data-page="0"'));

        fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
        await screen.findByText('Page render failed');

        await waitFor(() => expect(screen.getByText('Page 1 of 2')).toBeInTheDocument());
        expect(screen.getByTestId('player-svg').innerHTML).toContain('data-page="0"');
        expect(screen.getByTestId('player-play')).toBeEnabled();
    });
});
