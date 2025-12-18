import React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--mock-geist-sans' }),
  Geist_Mono: () => ({ variable: '--mock-geist-mono' }),
}));

import RootLayout from '../app/layout';

describe('RootLayout', () => {
  it('renders children', () => {
    const child = <div>child</div>;
    const tree: any = RootLayout({ children: child });

    expect(tree.type).toBe('html');
    expect(tree.props.lang).toBe('en');
    expect(tree.props.suppressHydrationWarning).toBe(true);

    const body: any = tree.props.children;
    expect(body.type).toBe('body');
    expect(body.props.children).toBe(child);
  });
});
