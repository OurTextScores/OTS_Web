import { expect, test } from 'playwright/test';

/**
 * Bar (range) selection geometry and keyboard extension.
 *
 * Two regressions this pins down:
 *
 *  1. A range selection reported one bounding box *per notehead*, so a selected bar
 *     looked like a list selection of its notes with no rectangle around the bar.
 *     Upstream MuseScore computes one rectangle per system spanning the staff range
 *     (src/notation/utilities/scorerangeutilities.cpp, ScoreRangeUtilities::boundingArea);
 *     that is now ported into _getSelectionBoundingBoxes.
 *
 *  2. ensureSelectionInWasm guarded on `selectionBoxes.length > 1` to avoid collapsing
 *     a rich selection back to a point. Once a range became a single rectangle that
 *     guard stopped holding, and the second Shift+Arrow collapsed the range to one
 *     note. The guard now asks the engine via isSelectionRange().
 *
 * Keyboard semantics follow desktop MuseScore's shortcuts.xml exactly:
 * Shift+Arrow = select-next/prev-chord, Ctrl+Shift+Arrow = select-next/prev-measure.
 */

const SCORE = '/?score=/test_scores/four_measures.musicxml';

type Box = { page: number; x: number; y: number; width: number; height: number };

const boxes = (page: import('playwright/test').Page): Promise<Box[]> =>
  page.evaluate(async () => (window as any).__webmscore.getSelectionBoundingBoxes());

const measureRange = (page: import('playwright/test').Page) =>
  page.evaluate(async () => (window as any).__webmscore.selectionMeasureRange());

/**
 * Clicks empty space inside bar 2 (right of its note, left of bar 3's note).
 *
 * Waits on the engine's own range state, not just the overlay: the click round-trips
 * through the worker, and pressing a key before the range lands makes the extension
 * act on a stale selection. Polling only on box count is not enough -- a stale
 * single-element selection also yields one box.
 */
async function selectBar2(page: import('playwright/test').Page) {
  const notes = page.locator('svg .Note');
  const a = await notes.nth(1).boundingBox();
  const b = await notes.nth(2).boundingBox();
  if (!a || !b) throw new Error('notes not laid out');
  await page.mouse.click((a.x + a.width + b.x) / 2, a.y + a.height / 2);
  await expect.poll(async () => await measureRange(page), { timeout: 15_000 })
    .toEqual({ startMeasureIndex: 1, endMeasureIndex: 1 });
  await expect.poll(async () => (await boxes(page)).length, { timeout: 10_000 }).toBe(1);
}

test.beforeEach(async ({ page }) => {
  await page.goto(SCORE);
  await page.waitForSelector('svg .Note', { timeout: 60_000 });
  await expect.poll(async () => (await page.locator('svg .Note').count()), { timeout: 20_000 }).toBe(4);
});

test('a selected bar produces one rectangle spanning the bar, not one per note', async ({ page }) => {
  await selectBar2(page);

  const barBoxes = await boxes(page);
  // One rectangle for the single system, not one per notehead.
  expect(barBoxes).toHaveLength(1);
  expect(await measureRange(page)).toEqual({ startMeasureIndex: 1, endMeasureIndex: 1 });

  // It must be a bar-sized region, not a notehead-sized one. A notehead is a few
  // units wide and shorter than the staff; the bar rectangle spans the full staff
  // height plus padding.
  const [box] = barBoxes;
  expect(box.width).toBeGreaterThan(100);
  expect(box.height).toBeGreaterThan(50);

  // And it should be wider than it is tall for a single bar of one staff.
  expect(box.width).toBeGreaterThan(box.height);
});

test('Ctrl+Shift+Right extends the selection by a whole bar', async ({ page }) => {
  await selectBar2(page);
  const [before] = await boxes(page);

  await page.keyboard.press('Control+Shift+ArrowRight');

  await expect.poll(async () => await measureRange(page), { timeout: 10_000 })
    .toEqual({ startMeasureIndex: 1, endMeasureIndex: 2 });

  const after = await boxes(page);
  expect(after).toHaveLength(1);
  // Still one rectangle, now covering two bars: it grew rightward from the same origin.
  expect(after[0].x).toBeCloseTo(before.x, 1);
  expect(after[0].width).toBeGreaterThan(before.width * 1.5);
});

test('repeated Shift+Right keeps extending instead of collapsing the range', async ({ page }) => {
  await selectBar2(page);

  // Each bar holds a single whole note, so one chord-step is also one bar here.
  await page.keyboard.press('Shift+ArrowRight');
  await expect.poll(async () => await measureRange(page), { timeout: 10_000 })
    .toEqual({ startMeasureIndex: 1, endMeasureIndex: 2 });

  // The regression: this second press used to collapse the range back to bar 2 and
  // render a sliver box, because the single-rectangle range failed the old
  // `selectionBoxes.length > 1` guard and got re-projected from a point.
  await page.keyboard.press('Shift+ArrowRight');
  await expect.poll(async () => await measureRange(page), { timeout: 10_000 })
    .toEqual({ startMeasureIndex: 1, endMeasureIndex: 3 });

  const after = await boxes(page);
  expect(after).toHaveLength(1);
  expect(after[0].width).toBeGreaterThan(100);
});
