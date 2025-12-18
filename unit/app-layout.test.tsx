import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--mock-geist-sans' }),
  Geist_Mono: () => ({ variable: '--mock-geist-mono' }),
}));

import RootLayout from '../app/layout';

describe('RootLayout', () => {
  it('renders children', () => {
    render(
      <RootLayout>
        <div>child</div>
      </RootLayout>,
    );

    expect(screen.getByText('child')).toBeInTheDocument();
  });
});

