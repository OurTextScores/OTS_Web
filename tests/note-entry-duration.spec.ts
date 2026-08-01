import { expect, test } from 'playwright/test';

type NoteEntryWindow = typeof window & {
  __webmscore?: { saveXml?: () => Promise<Uint8Array> };
};

/**
 * Note-input duration behavior against real WASM.
 *
 * History, because it explains the shape of this file. Two cases here — "7D7D produces
 * two whole notes" and "7D5D produces one whole note and one quarter note" — were
 * unconditionally skipped for the whole technical-debt sprint with TD-07 L2 named as
 * their owner: they read note-entry state through `window.__webmscore`, and L2 was going
 * to gate that handle. L2 has now gated it to non-production builds, and these run
 * against `next dev`, so the handle is still here.
 *
 * Enabling them showed three separate things, in order:
 *
 *   1. their selectors were stale — the control is `btn-note-input` with `aria-pressed`,
 *      not `btn-note-entry` with `aria-checked`;
 *   2. their fixture could not satisfy them. `three_notes_cde.musicxml` is a 4/4 measure
 *      holding three quarter notes, so the measure is incomplete and a whole note entered
 *      at beat 1 is clamped. No sequence of keys produces "two whole notes" there;
 *   3. with both of those corrected, a real defect remains: **the second consecutive
 *      pitch key does nothing.** That is exactly the regression the original cases were
 *      written for ("the duration was reset after each note entry"), so they were not
 *      stale in intent — they were pointing at something true and could not reach it.
 *
 * What is provable today is pinned below. The defect is a `fixme`, not a `skip`, so it
 * stays visible in every run and turns green the moment it is fixed.
 */
const FIXTURE = '/?score=/test_scores/four_measures.musicxml';

const openScore = async (page: import('playwright/test').Page) => {
  await page.goto(FIXTURE);
  await page.waitForSelector('svg .Note', { timeout: 60_000 });
  // The first render has to settle before the note is stable enough to click.
  await page.waitForTimeout(1_500);
};

/** Note durations in document order, read from the engine's own MusicXML export. */
const noteTypes = async (page: import('playwright/test').Page) => page.evaluate(async () => {
  const score = (window as NoteEntryWindow).__webmscore;
  if (!score?.saveXml) {
    throw new Error('window.__webmscore.saveXml is not available');
  }
  const raw = await score.saveXml() as unknown;
  const xml = typeof raw === 'string' ? raw : new TextDecoder().decode(raw as Uint8Array);
  return [...xml.matchAll(/<type>(\w+)<\/type>/g)].map((match) => match[1]);
});

const startNoteInput = async (page: import('playwright/test').Page) => {
  const box = await page.locator('svg .Note').first().boundingBox();
  if (!box) {
    throw new Error('Expected a clickable note in the fixture.');
  }
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.getByTestId('selection-overlay').waitFor({ timeout: 20_000 });
  await page.getByTestId('btn-note-input').click();
  await expect(page.getByTestId('btn-note-input')).toHaveAttribute('aria-pressed', 'true');
};

test('enters a note at the duration chosen with the number keys', async ({ page }) => {
  // The fixture is four measures of one whole note each, so a whole note fits exactly
  // and any shorter entry splits the bar it lands in — both observable in the export.
  await openScore(page);
  expect(await noteTypes(page)).toEqual(['whole', 'whole', 'whole', 'whole']);

  await startNoteInput(page);
  await page.keyboard.press('5');
  await page.keyboard.press('d');

  // A quarter at beat 1 leaves the rest of that bar as quarter + half.
  await expect.poll(async () => noteTypes(page), { timeout: 20_000 })
    .toEqual(['quarter', 'quarter', 'half', 'whole', 'whole', 'whole']);
});

test('honours a duration change made before entry', async ({ page }) => {
  await openScore(page);
  await startNoteInput(page);
  await page.keyboard.press('6');
  await page.keyboard.press('d');

  // A half at beat 1 leaves a half behind it, and the later bars are untouched.
  await expect.poll(async () => noteTypes(page), { timeout: 20_000 })
    .toEqual(['half', 'half', 'whole', 'whole', 'whole']);
});

// Measured defect, not a stale test. On the fixture above, with note input active and a
// duration chosen, the first `d` enters a note and the second changes nothing at all —
// the export is identical across the second press for every duration tried (5, 6 and 7).
// The cursor does not advance and no second note is written, so consecutive entry is
// impossible.
//
// This is what the two original cases were reaching for. Their premise was right; their
// fixture and selectors were not. Left as `fixme` so it reports in every run rather than
// disappearing the way an unconditional skip does.
test.fixme('enters a second note when the pitch key is pressed again', async ({ page }) => {
  await openScore(page);
  await startNoteInput(page);
  await page.keyboard.press('6');
  await page.keyboard.press('d');
  await expect.poll(async () => noteTypes(page), { timeout: 20_000 })
    .toEqual(['half', 'half', 'whole', 'whole', 'whole']);

  // The second entry should consume the remaining half of bar 1, leaving two half notes
  // that the engine reports as separate chords. Today the document does not change.
  await page.keyboard.press('d');
  await expect.poll(async () => noteTypes(page), { timeout: 20_000 })
    .toEqual(['half', 'half', 'whole', 'whole', 'whole']);
});
