import { expect, test } from 'playwright/test';

test('clef can toggle and revert', async ({ page }) => {
  await page.goto('/?score=/test_scores/bach_orig.mscz');
  await page.waitForSelector('svg .Clef', { timeout: 60_000 });

  const readConcertClefTypes = async (): Promise<string[]> => {
    return page.evaluate(async () => {
      const score = (window as any).__webmscore;
      if (!score?.saveMsc) {
        throw new Error('window.__webmscore.saveMsc is not available');
      }
      const bytes: Uint8Array = await score.saveMsc('mscx');
      const xml = new TextDecoder().decode(bytes);
      return Array.from(xml.matchAll(/<concertClefType>([^<]+)<\/concertClefType>/g)).map(
        (match) => match[1],
      );
    });
  };

  const initial = await readConcertClefTypes();
  expect(initial[0]).toBeTruthy();

  await page.getByRole('button', { name: 'Treble' }).click();
  await expect.poll(async () => (await readConcertClefTypes())[0]).toBe('G');

  await page.getByRole('button', { name: 'Bass' }).click();
  await expect.poll(async () => (await readConcertClefTypes())[0]).toBe(initial[0]);
});
