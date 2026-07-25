/**
 * Render-ahead windowing for streamed synth playback.
 *
 * See docs/private/MUSE_SOUNDS_INTEGRATION_ROADMAP.md, Phase 2.
 *
 * The synth stream pulls rendered chunks from WASM and schedules each one as an
 * AudioBufferSourceNode. Without a bound it pulls as fast as the engine resolves,
 * so the *entire* score is rendered and scheduled before much of it has played:
 * faure.mscz (22 minutes) means ~115k source nodes and ~450 MB of AudioBuffers
 * held at once, with the render loop competing with the main thread throughout.
 *
 * Bounding it is what makes playback independent of score length. The window keeps
 * rendering a fixed distance ahead of the playhead and idles once it gets there,
 * which is also the precondition for Phase 5: a lookahead scheduler needs a horizon
 * at least as long as its longest forward dependency, and that horizon has to be one
 * number someone can raise.
 */

export interface RenderWindow {
    /** Stop pulling once scheduled audio reaches this far ahead of the playhead. */
    horizonSeconds: number;
    /** Resume pulling once it falls back to this. */
    lowWaterSeconds: number;
}

/**
 * Default horizon for transport playback. Twenty seconds is far enough that a
 * stall in the render loop is inaudible, and short enough that a long score costs
 * a bounded ~7 MB of buffers rather than hundreds.
 *
 * Phase 5 will need to raise `horizonSeconds` to cover phrase-level lookahead;
 * that is why this is a named constant and not a literal in the stream loop.
 */
export const DEFAULT_RENDER_WINDOW: RenderWindow = {
    horizonSeconds: 20,
    lowWaterSeconds: 10,
};

/**
 * How long to idle before pulling the next batch.
 *
 * @param aheadSeconds how far scheduled audio currently extends beyond the playhead
 * @returns milliseconds to wait; 0 means pull immediately
 */
export function renderWindowDelayMs(aheadSeconds: number, window: RenderWindow = DEFAULT_RENDER_WINDOW): number {
    if (!Number.isFinite(aheadSeconds)) {
        // A non-finite reading means the caller has no usable clock yet. Keep
        // pulling rather than stalling playback on a bad measurement.
        return 0;
    }

    const horizon = Math.max(0, window.horizonSeconds);
    const lowWater = Math.min(Math.max(0, window.lowWaterSeconds), horizon);

    if (aheadSeconds <= horizon) {
        return 0;
    }

    // Idle until the buffer drains to the low-water mark, so we refill in batches
    // rather than waking on every chunk.
    return Math.max(0, (aheadSeconds - lowWater) * 1000);
}

/**
 * Upper bound on simultaneously held audio buffers for a given window, used to
 * document and test the memory guarantee.
 */
export function maxBufferedChunks(window: RenderWindow, sampleRate: number, framesPerChunk: number): number {
    return Math.ceil((window.horizonSeconds * sampleRate) / framesPerChunk);
}
