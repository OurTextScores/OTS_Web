import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/dynamic', () => ({
  default: (_importer: unknown, options: any) => {
    // Call loading renderer so it's covered by tests.
    options?.loading?.();

    const Mock = () => <div data-testid="dynamic-score-editor" />;
    return Mock;
  },
}));

import Home from '../app/page';

describe('Home page', () => {
  it('renders the editor shell', () => {
    render(<Home />);
    expect(screen.getByTestId('dynamic-score-editor')).toBeInTheDocument();
  });
});
