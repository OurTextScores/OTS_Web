import { expect, test } from 'playwright/test';

test('title and composer text can be edited', async ({ page }) => {
  await page.goto('/?score=/test_scores/bach_orig.mscz');
  await page.waitForSelector('svg .Clef', { timeout: 60_000 });

  const readHeader = async (): Promise<{ title: string; composer: string }> => {
    return page.evaluate(async () => {
      const score = (window as any).__webmscore;
      if (!score?.metadata) {
        throw new Error('window.__webmscore.metadata is not available');
      }
      const metadata = await score.metadata();
      return {
        title: typeof metadata?.title === 'string' ? metadata.title : '',
        composer: typeof metadata?.composer === 'string' ? metadata.composer : '',
      };
    });
  };

  const newTitle = 'OTS Title Test';
  const newComposer = 'OTS Composer Test';

  await page.getByTestId('input-title').fill(newTitle);
  await page.getByTestId('btn-set-title').click();
  await expect.poll(async () => (await readHeader()).title, { timeout: 20_000 }).toBe(newTitle);

  await page.getByTestId('input-composer').fill(newComposer);
  await page.getByTestId('btn-set-composer').click();
  await expect.poll(async () => (await readHeader()).composer, { timeout: 20_000 }).toBe(newComposer);
});

