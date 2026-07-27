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
 * Shift+Arrow = select-next/prev-chord, Ctrl+Shift+Arrow = select-next/prev-measure,
 * Shift+Up/Down = select-staff-above/below (what makes a range span staves).
 */

const SCORE = "/?score=/test_scores/four_measures.musicxml";

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
/**
 * Clicks empty space between two noteheads until the engine reports a range there.
 *
 * The click is retried rather than merely polled for its result: the score can still
 * be re-booting when the notes first appear in the DOM (the loader aborts and
 * restarts), and a click in that window lands on nothing at all -- selectionMeasureRange
 * then reports null forever, because no selection was ever initiated. Re-selecting the
 * same bar is idempotent, so this absorbs boot timing without papering over a wrong
 * selection: the assertion on the resulting range is unchanged.
 *
 * `leftNote`/`rightNote` are indices into `svg .Note`; the click lands between them, at
 * the left note's vertical centre. Clicking a notehead itself would take the element
 * branch rather than the measure one.
 */
/**
 * Notes in reading order (top-to-bottom staff row, then left-to-right within the
 * row), independent of their DOM/SVG order.
 *
 * The engine redraws the SVG with highlightSelection=true after any element click,
 * and the just-selected note is promoted to the end of that markup for z-stacking.
 * `svg .Note >> nth(i)` is therefore only a stable proxy for "the i-th note in the
 * piece" until the first note-level click; after that its DOM position no longer
 * matches score position. Sorting by geometry instead of DOM order keeps `leftNote`/
 * `rightNote` indices meaningful across a selection change.
 */
async function orderedNoteBoxes(page: import('playwright/test').Page) {
  const notes = page.locator('svg .Note');
  const count = await notes.count();
  const raw: { x: number, y: number, width: number, height: number }[] = [];
  for (let i = 0; i < count; i++) {
    const box = await notes.nth(i).boundingBox();
    if (box) raw.push(box);
  }
  const byY = [...raw].sort((a, b) => a.y - b.y);
  const rows: (typeof raw)[] = [];
  for (const box of byY) {
    const row = rows.at(-1);
    const rowRef = row?.[0];
    if (row && rowRef && Math.abs(box.y - rowRef.y) < rowRef.height * 1.5) {
      row.push(box);
    } else {
      rows.push([box]);
    }
  }
  return rows.flatMap(row => [...row].sort((a, b) => a.x - b.x));
}

async function selectBarBetween(
  page: import('playwright/test').Page,
  leftNote: number,
  rightNote: number,
  expected: { startMeasureIndex: number; endMeasureIndex: number },
) {
  await expect.poll(async () => {
    const ordered = await orderedNoteBoxes(page);
    const a = ordered[leftNote];
    const b = ordered[rightNote];
    if (!a || !b) return null;
    await page.mouse.click((a.x + a.width + b.x) / 2, a.y + a.height / 2);
    await page.waitForTimeout(400);
    return await measureRange(page);
  }, { timeout: 30_000, intervals: [500, 1000, 1000, 2000] }).toEqual(expected);

  await expect.poll(async () => (await boxes(page)).length, { timeout: 30_000 }).toBe(1);
}

const selectBar2 = (page: import('playwright/test').Page) =>
  selectBarBetween(page, 1, 2, { startMeasureIndex: 1, endMeasureIndex: 1 });

test.beforeEach(async ({ page }) => {
  await page.goto(SCORE);
  await page.waitForSelector('svg .Note', { timeout: 60_000 });
  await expect.poll(async () => (await page.locator('svg .Note').count()), { timeout: 30_000 }).toBe(4);
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

// Root cause (see docs/private/SELECTION_WORK_HANDOFF.md §3 for the original
// diagnosis): a stale scheduled overlay refresh from a *previous* element click could
// fire after a later bar click had already set the correct selection.
// refreshSelectionFromSvg schedules refreshSelectionOverlay via a double-RAF, guarded
// by selectionOverlayGenerationRef -- but the measure/bar-click path never bumped that
// ref, so the stale callback still matched and ran. It scraped the DOM for
// .selected/.note-selected markers, found none (backend-highlighted range selections
// don't add those classes), fell back to the old note index, failed to resolve a box,
// and wiped selectionBoxes/selectedElement entirely. Fixed by bumping
// selectionOverlayGenerationRef at the very start of every click, invalidating any
// refresh scheduled by an earlier click before it can clobber a newer selection.
test('a bar stays selectable, with its rectangle, after a note has been clicked', async ({ page }) => {
  // Reported repro: the first empty-space click selects the bar, but once a note has
  // been clicked, later empty-space clicks either highlight the noteheads with no bar
  // rectangle or appear to select nothing.
  const overlay = page.getByTestId('selection-overlay');
  const overlayWidth = async () => (await overlay.first().boundingBox())?.width ?? 0;

  await selectBar2(page);
  await expect(overlay).toHaveCount(1);
  const barWidth = await overlayWidth();

  // Select a single note; its rectangle must be far smaller than a bar's.
  // Raw mouse click rather than locator.click(): the bar overlay sits over the notes
  // and Playwright's actionability check never settles, even though the overlay is
  // pointer-events:none.
  const note0 = await page.locator('svg .Note').first().boundingBox();
  expect(note0).not.toBeNull();
  if (!note0) return;
  await page.mouse.click(note0.x + note0.width / 2, note0.y + note0.height / 2);
  await expect.poll(async () => await page.evaluate(async () =>
    (window as any).__webmscore.isSelectionRange()), { timeout: 30_000 }).toBe(false);
  const noteWidth = await overlayWidth();
  expect(noteWidth).toBeLessThan(barWidth / 2);

  // Back to the bar: the rectangle must return, at bar size.
  await selectBar2(page);
  await expect(overlay).toHaveCount(1);
  expect(await overlayWidth()).toBeCloseTo(barWidth, 0);
});

test('Ctrl+Shift+Right extends the selection by a whole bar', async ({ page }) => {
  await selectBar2(page);
  const [before] = await boxes(page);

  await page.keyboard.press('Control+Shift+ArrowRight');

  await expect.poll(async () => await measureRange(page), { timeout: 30_000 })
    .toEqual({ startMeasureIndex: 1, endMeasureIndex: 2 });

  const after = await boxes(page);
  expect(after).toHaveLength(1);
  // Still one rectangle, now covering two bars: it grew rightward from the same origin.
  expect(after[0].x).toBeCloseTo(before.x, 1);
  expect(after[0].width).toBeGreaterThan(before.width * 1.5);
});

test('Shift+Down extends the rectangle across staves', async ({ page }) => {
  // Two-staff fixture; the single-staff one cannot exercise this at all.
  await page.goto('/?score=/test_scores/two_staves_four_bars.musicxml');
  await page.waitForSelector('svg .Note', { timeout: 60_000 });
  await expect.poll(async () => await page.locator('svg .Note').count(), { timeout: 30_000 }).toBe(8);

  // Bar 2 of the top staff. Notes 0-3 are the upper staff, 4-7 the lower one.
  await selectBarBetween(page, 1, 2, { startMeasureIndex: 1, endMeasureIndex: 1 });

  const [oneStaff] = await boxes(page);

  // Desktop MuseScore: Shift+Down extends the range to the staff below. Before this
  // was bound it fell through to the pitch handlers and transposed the note instead.
  await page.keyboard.press('Shift+ArrowDown');

  await expect.poll(async () => (await boxes(page))[0]?.height, { timeout: 30_000 })
    .toBeGreaterThan(oneStaff.height * 1.5);

  const twoStaff = (await boxes(page))[0];
  // Still one rectangle for the system, now tall enough to cover both staves and the
  // gap between them, and horizontally unchanged.
  expect(await boxes(page)).toHaveLength(1);
  expect(twoStaff.x).toBeCloseTo(oneStaff.x, 1);
  expect(twoStaff.width).toBeCloseTo(oneStaff.width, 1);
  expect(twoStaff.y).toBeCloseTo(oneStaff.y, 1);
});

test('Shift+Click on another bar extends the range instead of replacing it', async ({ page }) => {
  await selectBar2(page);
  const [before] = await boxes(page);

  // Empty space inside bar 3: right of bar 3's note, left of bar 4's. Clicking a
  // notehead would take the element branch instead of the measure one.
  const notes = page.locator('svg .Note');
  const b3 = await notes.nth(2).boundingBox();
  const b4 = await notes.nth(3).boundingBox();
  expect(b3).not.toBeNull();
  expect(b4).not.toBeNull();
  if (!b3 || !b4) return;
  await page.keyboard.down('Shift');
  await page.mouse.click((b3.x + b3.width + b4.x) / 2, b3.y + b3.height / 2);
  await page.keyboard.up('Shift');

  // Upstream maps Shift+Click to SelectType::RANGE, so the selection should now run
  // from bar 2 through bar 3 rather than jumping to bar 3 alone.
  await expect.poll(async () => await measureRange(page), { timeout: 30_000 })
    .toEqual({ startMeasureIndex: 1, endMeasureIndex: 2 });

  const after = await boxes(page);
  expect(after).toHaveLength(1);
  expect(after[0].x).toBeCloseTo(before.x, 1);
  expect(after[0].width).toBeGreaterThan(before.width * 1.5);
});

test('Shift+Click on a lower staff widens the rectangle across staves', async ({ page }) => {
  await page.goto('/?score=/test_scores/two_staves_four_bars.musicxml');
  await page.waitForSelector('svg .Note', { timeout: 60_000 });
  await expect.poll(async () => await page.locator('svg .Note').count(), { timeout: 30_000 }).toBe(8);

  // Bar 2 of the top staff. Notes 0-3 are the upper staff, 4-7 the lower one.
  await selectBarBetween(page, 1, 2, { startMeasureIndex: 1, endMeasureIndex: 1 });
  const [oneStaff] = await boxes(page);

  const notes = page.locator('svg .Note');
  const lower = await notes.nth(5).boundingBox();
  const lowerNext = await notes.nth(6).boundingBox();
  expect(lower).not.toBeNull();
  expect(lowerNext).not.toBeNull();
  if (!lower || !lowerNext) return;

  await page.keyboard.down('Shift');
  await page.mouse.click((lower.x + lower.width + lowerNext.x) / 2, lower.y + lower.height / 2);
  await page.keyboard.up('Shift');

  await expect.poll(async () => (await boxes(page))[0]?.height, { timeout: 30_000 })
    .toBeGreaterThan(oneStaff.height * 1.5);

  const twoStaff = (await boxes(page))[0];
  expect(await boxes(page)).toHaveLength(1);
  expect(twoStaff.y).toBeCloseTo(oneStaff.y, 1);
});

// KNOWN FAILING, ~50% of runs. Not a flaky test -- a flaky product: bar selection
// races once other selection state exists. The engine's bounding boxes and
// refreshSelectionFromSvg's `.selected` scrape are two independent sources of
// selectionBoxes, and the empty-click path deliberately skips the SVG refresh while
// other call sites do not. Re-enable (drop .fixme) once that is resolved; the
// assertions themselves are correct and did catch the isSelectionRange regression.
test('repeated Shift+Right keeps extending instead of collapsing the range', async ({ page }) => {
  await selectBar2(page);

  // Each bar holds a single whole note, so one chord-step is also one bar here.
  await page.keyboard.press('Shift+ArrowRight');
  await expect.poll(async () => await measureRange(page), { timeout: 30_000 })
    .toEqual({ startMeasureIndex: 1, endMeasureIndex: 2 });

  // The regression: this second press used to collapse the range back to bar 2 and
  // render a sliver box, because the single-rectangle range failed the old
  // `selectionBoxes.length > 1` guard and got re-projected from a point.
  await page.keyboard.press('Shift+ArrowRight');
  await expect.poll(async () => await measureRange(page), { timeout: 30_000 })
    .toEqual({ startMeasureIndex: 1, endMeasureIndex: 3 });

  const after = await boxes(page);
  expect(after).toHaveLength(1);
  expect(after[0].width).toBeGreaterThan(100);
});
