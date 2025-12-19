import { expect, test } from 'playwright/test';

test('pitch up preserves multi-selection across repeated edits', async ({ page }) => {
  await page.goto('/?score=/test_scores/three_notes_cde.musicxml');
  await page.waitForSelector('svg .Note', { timeout: 60_000 });

  const readPitches = async (): Promise<string[]> => {
    return page.evaluate(async () => {
      const score = (window as any).__webmscore;
      if (!score?.saveXml) {
        throw new Error('window.__webmscore.saveXml is not available');
      }
      const xml: string = await score.saveXml();
      const matches = Array.from(
        xml.matchAll(
          /<pitch>[\s\S]*?<step>([A-G])<\/step>[\s\S]*?(?:<alter>(-?\d+)<\/alter>[\s\S]*?)?<octave>(\d+)<\/octave>[\s\S]*?<\/pitch>/g,
        ),
      );
      return matches.map((m) => `${m[1]}${Number(m[2] ?? 0) || ''}${m[3]}`);
    });
  };

  await expect.poll(async () => await readPitches(), { timeout: 20_000 }).toEqual(['C4', 'D4', 'E4']);

  const notes = page.locator('svg .Note');
  await notes.nth(0).click();
  await page.getByTestId('selection-overlay').waitFor({ timeout: 10_000 });
  await notes.nth(2).click({ modifiers: ['Control'] });

  await page.getByTestId('btn-pitch-up').click();
  await expect.poll(async () => await readPitches(), { timeout: 20_000 }).toEqual(['C14', 'D4', 'F4']);

  await page.getByTestId('btn-pitch-up').click();
  await expect.poll(async () => await readPitches(), { timeout: 20_000 }).toEqual(['D4', 'D4', 'F14']);
});

