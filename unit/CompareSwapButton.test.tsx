import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CompareSwapButton } from '../components/score-editor/CompareSwapButton';

describe('CompareSwapButton', () => {
  it('exposes an accessible swap action and disables it while compare work is busy', async () => {
    const user = userEvent.setup();
    const onSwap = vi.fn();
    const { rerender } = render(<CompareSwapButton busy={false} onSwap={onSwap} />);

    const button = screen.getByRole('button', { name: 'Swap sides' });
    await user.click(button);
    expect(onSwap).toHaveBeenCalledOnce();

    rerender(<CompareSwapButton busy onSwap={onSwap} />);
    expect(button).toBeDisabled();
  });
});
