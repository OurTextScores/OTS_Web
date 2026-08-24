import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PlayerControls from '@/components/score-player/PlayerControls';

const props = (overrides: Partial<React.ComponentProps<typeof PlayerControls>> = {}) => ({
    state: 'idle' as const,
    positionMs: 1_000,
    durationMs: 10_000,
    volume: 1,
    currentPage: 0,
    pageCount: 2,
    follow: true,
    onTogglePlayPause: vi.fn(),
    onStop: vi.fn(),
    onSeek: vi.fn(),
    onVolume: vi.fn(),
    onPreviousPage: vi.fn(),
    onNextPage: vi.fn(),
    onZoomOut: vi.fn(),
    onFitWidth: vi.fn(),
    onZoomIn: vi.fn(),
    onToggleFollow: vi.fn(),
    ...overrides,
});

describe('PlayerControls', () => {
    it('commits pointer scrubbing once at the final position', () => {
        const values = props();
        render(<PlayerControls {...values} />);
        const seek = screen.getByTestId('player-seek');

        fireEvent.pointerDown(seek);
        fireEvent.change(seek, { target: { value: '4300' } });
        expect(values.onSeek).not.toHaveBeenCalled();
        fireEvent.pointerUp(seek, { target: { value: '4300' } });

        expect(values.onSeek).toHaveBeenCalledOnce();
        expect(values.onSeek).toHaveBeenCalledWith(4_300);
    });

    it('offers retry after an audio failure', () => {
        const values = props({ state: 'unavailable' });
        render(<PlayerControls {...values} />);
        const retry = screen.getByRole('button', { name: 'Retry playback' });

        expect(retry).toBeEnabled();
        fireEvent.click(retry);
        expect(values.onTogglePlayPause).toHaveBeenCalledOnce();
    });

    it('disables transport while the document is unavailable', () => {
        render(<PlayerControls {...props({ disabled: true })} />);
        expect(screen.getByTestId('player-play')).toBeDisabled();
        expect(screen.getByTestId('player-seek')).toBeDisabled();
    });
});
