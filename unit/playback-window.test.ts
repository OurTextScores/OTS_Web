import { describe, it, expect } from 'vitest';
import {
    DEFAULT_RENDER_WINDOW,
    maxBufferedChunks,
    renderWindowDelayMs,
    type RenderWindow,
} from '@/lib/playback-window';

const WINDOW: RenderWindow = { horizonSeconds: 20, lowWaterSeconds: 10 };

describe('renderWindowDelayMs', () => {
    it('pulls immediately while inside the horizon', () => {
        expect(renderWindowDelayMs(0, WINDOW)).toBe(0);
        expect(renderWindowDelayMs(10, WINDOW)).toBe(0);
        expect(renderWindowDelayMs(20, WINDOW)).toBe(0);
    });

    it('idles down to the low-water mark once past the horizon', () => {
        // 25s buffered, drain to 10s => wait 15s.
        expect(renderWindowDelayMs(25, WINDOW)).toBe(15_000);
        expect(renderWindowDelayMs(21, WINDOW)).toBe(11_000);
    });

    it('refills in batches rather than waking per chunk', () => {
        // Crossing the horizon by a hair must still idle down to low water, or the
        // loop busy-waits: one wake per chunk is what the window exists to avoid.
        expect(renderWindowDelayMs(20.001, WINDOW)).toBeGreaterThan(9_000);
    });

    it('keeps pulling when the clock reading is unusable', () => {
        // A NaN/Infinity reading means no usable clock yet; stalling playback on a
        // bad measurement would be worse than rendering ahead.
        expect(renderWindowDelayMs(Number.NaN, WINDOW)).toBe(0);
        expect(renderWindowDelayMs(Number.POSITIVE_INFINITY, WINDOW)).toBe(0);
    });

    it('never returns a negative delay', () => {
        expect(renderWindowDelayMs(-5, WINDOW)).toBe(0);
    });

    it('tolerates a low-water mark above the horizon', () => {
        const inverted: RenderWindow = { horizonSeconds: 5, lowWaterSeconds: 50 };
        // Clamped to the horizon, so it still makes progress instead of idling forever.
        expect(renderWindowDelayMs(10, inverted)).toBe(5_000);
    });

    it('degrades to unthrottled when the horizon is zero', () => {
        const zero: RenderWindow = { horizonSeconds: 0, lowWaterSeconds: 0 };
        expect(renderWindowDelayMs(0, zero)).toBe(0);
        expect(renderWindowDelayMs(30, zero)).toBe(30_000);
    });
});

describe('memory bound', () => {
    it('holds a bounded number of chunks regardless of score length', () => {
        const held = maxBufferedChunks(DEFAULT_RENDER_WINDOW, 44100, 512);

        // The unbounded loop scheduled the whole score: faure.mscz is 1339s, which is
        // ~115k chunks and ~450MB of AudioBuffers held at once. The window caps it.
        const faureChunks = Math.ceil((1339.2 * 44100) / 512);
        expect(faureChunks).toBeGreaterThan(100_000);

        expect(held).toBeLessThan(2_000);
        const heldMb = (held * 512 * 2 * 4) / 1048576;
        expect(heldMb).toBeLessThan(10);
    });

    it('scales with the horizon, so Phase 5 can raise it deliberately', () => {
        const small = maxBufferedChunks({ horizonSeconds: 10, lowWaterSeconds: 5 }, 44100, 512);
        const large = maxBufferedChunks({ horizonSeconds: 40, lowWaterSeconds: 20 }, 44100, 512);
        expect(large).toBeCloseTo(small * 4, -1);
    });
});
