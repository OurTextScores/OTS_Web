import { expect, test } from 'playwright/test';

test('slur button adds a slur spanning multi-selection', async ({ page }) => {
  await page.goto('/?score=/test_scores/three_notes_cde.musicxml');
  await page.waitForSelector('svg .Note', { timeout: 60_000 });

  const readXml = async (): Promise<string> => {
    return page.evaluate(async () => {
      const score = (window as any).__webmscore;
      if (!score?.saveXml) {
        throw new Error('window.__webmscore.saveXml is not available');
      }
      return score.saveXml();
    });
  };

  const xmlBefore = await readXml();
  expect(xmlBefore.includes('<slur type="start"') || xmlBefore.includes('<slur type="stop"')).toBe(false);

  const notes = page.locator('svg .Note');
  await notes.nth(0).click();
  await page.getByTestId('selection-overlay').waitFor({ timeout: 10_000 });
  await notes.nth(2).click({ modifiers: ['Control'] });

  await page.getByTestId('btn-slur').click();

  await expect
    .poll(async () => {
      const xml = await readXml();
      const hasStart = xml.includes('<slur type="start"');
      const hasStop = xml.includes('<slur type="stop"');
      return hasStart && hasStop;
    }, { timeout: 20_000 })
    .toBe(true);
});

