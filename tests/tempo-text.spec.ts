import { expect, test } from 'playwright/test';

test('tempo button inserts visible tempo at start', async ({ page }) => {
  await page.goto('/?score=/test_scores/bach_orig.mscz');
  await page.waitForSelector('svg .Clef', { timeout: 60_000 });

  const hasTempo120 = async (): Promise<boolean> => {
    return page.evaluate(async () => {
      const score = (window as any).__webmscore;
      if (!score?.saveMsc) {
        throw new Error('window.__webmscore.saveMsc is not available');
      }
      const bytes: Uint8Array = await score.saveMsc('mscx');
      const xml = new TextDecoder().decode(bytes);
      return xml.includes('<sym>metNoteQuarterUp</sym> = 120');
    });
  };

  expect(await hasTempo120()).toBe(false);

  await page.getByTestId('btn-tempo-120').click();

  await expect.poll(async () => await hasTempo120(), { timeout: 20_000 }).toBe(true);
});

