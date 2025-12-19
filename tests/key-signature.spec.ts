import { expect, test } from 'playwright/test';

test('key signature can change and revert', async ({ page }) => {
  await page.goto('/?score=/test_scores/bach_orig.mscz');
  await page.waitForSelector('svg .Clef', { timeout: 60_000 });

  const readKeySignature = async (): Promise<number> => {
    return page.evaluate(async () => {
      const score = (window as any).__webmscore;
      if (!score?.getKeySignature) {
        throw new Error('window.__webmscore.getKeySignature is not available');
      }
      return Number(await score.getKeySignature());
    });
  };

  const initial = await readKeySignature();
  const alternate = initial === 0 ? 1 : 0;

  await page.getByTestId(`btn-keysig-${alternate}`).click();
  await expect.poll(async () => await readKeySignature(), { timeout: 20_000 }).toBe(alternate);

  await page.getByTestId(`btn-keysig-${initial}`).click();
  await expect.poll(async () => await readKeySignature(), { timeout: 20_000 }).toBe(initial);
});
