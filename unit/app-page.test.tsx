import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/dynamic', () => ({
  default: () => {
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

