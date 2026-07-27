import { expect, test } from 'playwright/test';

/**
 * The input/button pair this suite used to drive (input-title, input-subtitle,
 * btn-set-title, btn-set-subtitle) was removed from ScoreSection at some point
 * without the tests being updated or deleted -- see
 * docs/private/SELECTION_WORK_HANDOFF.md open item #3. The underlying mutations
 * (score.setTitleText/setSubtitleText) were never touched; ExpressionSection's
 * Text > Score Header menu now drives them via onOpenHeaderEditor, which prompts
 * for the new text pre-filled with the current value (the same promptForText
 * helper every other Text-menu entry uses). This exercises that path instead.
 */
test('the subtitle prompt is pre-filled from metadata', async ({ page }) => {
  await page.goto('/?score=/test_scores/bach_orig.mscz');
  await page.waitForSelector('svg .Clef', { timeout: 60_000 });

  let promptDefault = '';
  page.once('dialog', dialog => {
    promptDefault = dialog.defaultValue();
    return dialog.dismiss();
  });
  await page.getByTestId('dropdown-text').click();
  await page.getByTestId('btn-text-subtitle').click();

  await expect.poll(() => promptDefault, { timeout: 20_000 }).toContain('Bach: Cello Suite');
});

test('title and subtitle persist after save and reload', async ({ page }) => {
  await page.goto('/?score=/test_scores/bach_orig.mscz');
  await page.waitForSelector('svg .Clef', { timeout: 60_000 });

  const readHeader = async (): Promise<{ title: string; subtitle: string }> => {
    return page.evaluate(async () => {
      const score = (window as any).__webmscore;
      if (!score?.metadata) {
        throw new Error('window.__webmscore.metadata is not available');
      }
      const metadata = await score.metadata();
      const subtitle =
        typeof score?.subtitle === 'function'
          ? await score.subtitle()
          : (typeof metadata?.subtitle === 'string' ? metadata.subtitle : '');
      return {
        title: typeof metadata?.title === 'string' ? metadata.title : '',
        subtitle,
      };
    });
  };

  const newTitle = 'OTS Title Reload';
  const newSubtitle = 'OTS Subtitle Reload';

  page.once('dialog', dialog => dialog.accept(newTitle));
  await page.getByTestId('dropdown-text').click();
  await page.getByTestId('btn-text-title').click();

  page.once('dialog', dialog => dialog.accept(newSubtitle));
  await page.getByTestId('dropdown-text').click();
  await page.getByTestId('btn-text-subtitle').click();

  await expect.poll(async () => (await readHeader()).title, { timeout: 20_000 })
    .toBe(newTitle);
  await expect.poll(async () => (await readHeader()).subtitle, { timeout: 20_000 })
    .toBe(newSubtitle);

  const exportedXml = await page.evaluate(async () => {
    const score = (window as any).__webmscore;
    if (!score?.saveMsc) {
      throw new Error('window.__webmscore.saveMsc is not available');
    }
    const data = await score.saveMsc('mscx');
    return new TextDecoder().decode(data);
  });
  const exportedMscz = await page.evaluate(async () => {
    const score = (window as any).__webmscore;
    if (!score?.saveMsc) {
      throw new Error('window.__webmscore.saveMsc is not available');
    }
    const data = await score.saveMsc('mscz');
    return Array.from(data);
  });

  expect(exportedXml).toContain(newTitle);
  expect(exportedXml).toContain(newSubtitle);

  await page.getByTestId('open-score-input').setInputFiles({
    name: 'reloaded.mscz',
    mimeType: 'application/vnd.musescore.mscz',
    buffer: Buffer.from(exportedMscz as number[]),
  });

  await page.waitForSelector('svg .Clef', { timeout: 60_000 });
  // The loader aborts and restarts once notes first appear (see
  // docs/private/SELECTION_WORK_HANDOFF.md §4); a worker call that lands during that
  // restart can throw ("table index out of bounds") instead of returning a stale
  // value, which a bare expect.poll doesn't recover from the way it does a mismatch.
  // Let the restart settle before reading through the worker.
  await page.waitForTimeout(1000);
  await expect.poll(async () => (await readHeader()).title, { timeout: 20_000 })
    .toBe(newTitle);
  await expect.poll(async () => (await readHeader()).subtitle, { timeout: 20_000 })
    .toBe(newSubtitle);
});
