import { createHash } from 'node:crypto';

import { expect, test } from '@playwright/test';
import { computeMusicXmlIdentityHashServer } from '../lib/musicxml-identity-server';

const scoreHash = (xml: string) => `sha256:${createHash('sha256').update(xml, 'utf8').digest('hex')}`;

async function openScoreOpsProposal(
  page: import('@playwright/test').Page,
  options: { stale?: boolean; serializationDrift?: boolean } = {},
) {
  const sessionId = options.stale
    ? 'proposal-stale-session'
    : options.serializationDrift
      ? 'proposal-serialization-session'
      : 'proposal-apply-session';
  let baseXml = '';
  let syncCount = 0;
  let lastSyncedXml = '';

  await page.route('**/api/music/scoreops/session/open', async (route) => {
    const request = route.request().postDataJSON();
    baseXml = typeof request.content === 'string' ? request.content : '';
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ scoreSessionId: sessionId, revision: 0 }),
    });
  });
  await page.route('**/api/music/scoreops/sync', async (route) => {
    const request = route.request().postDataJSON();
    syncCount += 1;
    lastSyncedXml = typeof request.content === 'string' ? request.content : '';
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ scoreSessionId: sessionId, newRevision: syncCount }),
    });
  });
  await page.route('**/api/music/agent', async (route) => {
    const request = route.request().postDataJSON();
    const requestBaseXml = typeof request.toolInput.scoreops.content === 'string'
      ? request.toolInput.scoreops.content
      : baseXml;
    const proposalBaseXml = options.serializationDrift
      ? requestBaseXml.replace('<score-partwise', '<!-- serialization drift -->\n<score-partwise')
      : requestBaseXml;
    expect(proposalBaseXml).toContain('<score-partwise');
    if (options.serializationDrift) {
      expect(proposalBaseXml).not.toBe(requestBaseXml);
    }
    const proposedXml = proposalBaseXml.replace(
      /<fifths>\s*0\s*<\/fifths>/,
      '<fifths>1</fifths>',
    );
    expect(proposedXml).not.toBe(proposalBaseXml);
    const baseContentHash = scoreHash(proposalBaseXml);
    const baseIdentityHash = computeMusicXmlIdentityHashServer(proposalBaseXml);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        mode: 'fallback',
        selectedTool: 'music.scoreops',
        toolOk: true,
        response: 'Score operations prepared as a verified proposal.',
        result: {
          ok: true,
          execution: {
            proposal: {
              sourceTool: 'music.scoreops',
              baseXml: proposalBaseXml,
              proposedXml,
              baseScoreSessionId: sessionId,
              baseRevision: 0,
              baseContentHash,
              expectedCurrentContentHash: options.stale
                ? `sha256:${'0'.repeat(64)}`
                : baseContentHash,
              baseIdentityHash,
              expectedCurrentIdentityHash: options.stale
                ? `xmlid-v1:${'0'.repeat(64)}`
                : baseIdentityHash,
              verification: { level: 'tool_execution' },
            },
          },
        },
      }),
    });
  });

  await page.goto('/?score=/test_scores/three_notes_cde.musicxml', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('svg .Note', { timeout: 60_000 });
  const openSidebar = page.getByRole('button', { name: 'Open MusicXML sidebar' });
  if (await openSidebar.isVisible()) {
    await openSidebar.click();
  }
  await page.getByTestId('tab-ai').click();
  await page.getByRole('button', { name: 'Agent' }).click();
  await page.getByPlaceholder('Describe what you want the agent to do.').fill('Change the key signature to G major.');
  const syncCountBeforeAgent = syncCount;
  await page.getByRole('button', { name: 'Send to Agent' }).click();
  await page.getByTestId('checkpoint-compare-modal').waitFor({ timeout: 30_000 });
  await expect.poll(async () => (
    await page.getByTestId('compare-left-highlight').count()
    + await page.getByTestId('compare-right-highlight').count()
  ), { timeout: 30_000 }).toBeGreaterThan(0);

  return {
    getLastSyncedXml: () => lastSyncedXml,
    getSyncCount: () => syncCount,
    syncCountBeforeAgent,
  };
}

test('Music Agent proposal does not mutate until Apply All', async ({ page }) => {
  const state = await openScoreOpsProposal(page);
  expect(state.getSyncCount()).toBe(state.syncCountBeforeAgent);

  await page.getByRole('button', { name: 'Apply All AI Changes' }).click();

  await expect.poll(state.getSyncCount, { timeout: 30_000 }).toBeGreaterThan(state.syncCountBeforeAgent);
  expect(state.getLastSyncedXml()).toContain('<fifths>1</fifths>');
});

test('Music Agent proposal survives identity-equivalent serialization drift', async ({ page }) => {
  const state = await openScoreOpsProposal(page, { serializationDrift: true });

  await page.getByRole('button', { name: 'Apply All AI Changes' }).click();

  await expect.poll(state.getSyncCount, { timeout: 30_000 }).toBeGreaterThan(state.syncCountBeforeAgent);
  expect(state.getLastSyncedXml()).toContain('<fifths>1</fifths>');
});

test('Music Agent proposal blocks Apply All when the expected hash is stale', async ({ page }) => {
  const state = await openScoreOpsProposal(page, { stale: true });

  await page.getByRole('button', { name: 'Apply All AI Changes' }).click();

  await expect(page.getByTestId('checkpoint-compare-modal').getByRole('alert')).toContainText(
    'The score changed after this proposal was generated. Regenerate or rebase the proposal before applying it.',
  );
  expect(state.getSyncCount()).toBe(state.syncCountBeforeAgent);
});

test('Music Agent proposal blocks a partial Apply when the expected hash is stale', async ({ page }) => {
  const state = await openScoreOpsProposal(page, { stale: true });

  await page.getByRole('button', { name: 'Apply', exact: true }).click();

  await expect(page.getByTestId('checkpoint-compare-modal').getByRole('alert')).toContainText(
    'The score changed after this proposal was generated. Regenerate or rebase the proposal before applying it.',
  );
  expect(state.getSyncCount()).toBe(state.syncCountBeforeAgent);
});
