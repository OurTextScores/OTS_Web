import { expect, test } from '@playwright/test';

test.describe('embedded score player', () => {
    test('loads a score with a native playback timeline', async ({ page }) => {
        await page.goto('/?score=%2Ftest_scores%2Fbach_orig.mscz&embed=player');

        await expect(page.getByTestId('embedded-score-player')).toBeVisible();
        await expect(page.getByTestId('player-svg').locator('svg')).toBeVisible({ timeout: 30_000 });
        await expect(page.getByTestId('player-seek')).toBeEnabled();

        const duration = await page.getByTestId('player-seek').getAttribute('max');
        expect(Number(duration)).toBeGreaterThan(0);
        await expect(page.getByText(/^Page 1 of /)).toBeVisible();
    });

    test('keeps embed=1 as a player compatibility alias', async ({ page }) => {
        await page.goto('/?score=%2Ftest_scores%2Fbach_orig.mscz&embed=1');
        await expect(page.getByTestId('embedded-score-player')).toBeVisible();
    });
});
