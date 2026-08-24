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

    test('exchanges versioned messages only with the configured parent origin', async ({ page }) => {
        await page.route('**/player-host.html', (route) => route.fulfill({
            contentType: 'text/html',
            body: `<!doctype html><title>Player host</title>
                <iframe id="player" title="Hosted score player"></iframe>
                <script>
                    window.__playerEvents = [];
                    window.addEventListener('message', event => window.__playerEvents.push(event.data));
                    document.querySelector('#player').src = '/?score=%2Ftest_scores%2Fbach_orig.mscz&embed=player&playerId=hosted&parentOrigin=' + encodeURIComponent(location.origin);
                </script>`,
        }));
        await page.goto('/player-host.html');

        const iframe = page.getByTitle('Hosted score player').contentFrame();
        await expect(iframe.getByTestId('player-seek')).toBeEnabled({ timeout: 30_000 });
        await expect.poll(() => page.evaluate(() => (
            window as typeof window & { __playerEvents: Array<{ event?: string }> }
        ).__playerEvents.some((event) => event.event === 'ready'))).toBe(true);

        const duration = Number(await iframe.getByTestId('player-seek').getAttribute('max'));
        const target = Math.min(500, duration);
        await iframe.locator('body').evaluate((_, value) => {
            window.dispatchEvent(new MessageEvent('message', {
                origin: 'https://untrusted.example',
                source: window.parent,
                data: {
                    type: 'ots-player:command',
                    version: 1,
                    playerId: 'hosted',
                    command: 'seek',
                    value,
                },
            }));
        }, target);
        await expect(iframe.getByTestId('player-seek')).toHaveValue('0');

        const origin = new URL(page.url()).origin;
        await iframe.locator('body').evaluate((_, payload) => {
            window.dispatchEvent(new MessageEvent('message', {
                origin: payload.origin,
                source: window.parent,
                data: {
                    type: 'ots-player:command',
                    version: 1,
                    playerId: 'hosted',
                    command: 'seek',
                    value: payload.target,
                },
            }));
        }, { origin, target });
        await expect(iframe.getByTestId('player-seek')).toHaveValue(String(target));

        const eventPayload = await page.evaluate(() => JSON.stringify((
            window as typeof window & { __playerEvents: unknown[] }
        ).__playerEvents));
        expect(eventPayload).not.toContain('bach_orig.mscz');
    });
});
