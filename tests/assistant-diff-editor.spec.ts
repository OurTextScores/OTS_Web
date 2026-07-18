import { createHash } from 'node:crypto';

import { expect, test, type Route } from '@playwright/test';
import { computeMusicXmlIdentityHashServer } from '../lib/musicxml-identity-server';
import { applyMusicXmlPatch, type MusicXmlPatch } from '../lib/music-services/patch-service';

const OPENAI_MODELS_RESPONSE = {
  models: ['gpt-test-model'],
};

const SCORE_SESSION_ID = 'sess_assistant_diff_test';
const scoreHash = (xml: string) => `sha256:${createHash('sha256').update(xml, 'utf8').digest('hex')}`;

const PATCH_RESPONSE: {
  patch: MusicXmlPatch;
  annotations: unknown[];
  verification: {
    level: 'patch_apply';
    attempts: number;
    llmCalls: number;
    elapsedMs: number;
  };
} = {
  patch: {
    format: 'musicxml-patch@1',
    ops: [
      {
        op: 'setText',
        path: '/score-partwise/part[@id="P1"]/measure[@number="1"]/note[1]/pitch/step',
        value: 'G',
      },
    ],
  },
  annotations: [],
  verification: {
    level: 'patch_apply',
    attempts: 1,
    llmCalls: 1,
    elapsedMs: 5,
  },
};

const buildThreeNotesXml = (firstStep: string) => `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>Music</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key>
          <fifths>0</fifths>
        </key>
        <time>
          <beats>4</beats>
          <beat-type>4</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>
      <note>
        <pitch>
          <step>${firstStep}</step>
          <octave>4</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
      <note>
        <pitch>
          <step>D</step>
          <octave>4</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
      <note>
        <pitch>
          <step>E</step>
          <octave>4</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
    </measure>
  </part>
</score-partwise>`;

const fulfillPatchFromRequestBase = async (route: Route) => {
  const request = route.request().postDataJSON();
  const baseXml = String(request?.content || '');
  const applied = await applyMusicXmlPatch(baseXml, PATCH_RESPONSE.patch);
  expect(applied.error).toBeFalsy();
  expect(applied.xml).toContain('<step>G</step>');
  const baseContentHash = scoreHash(baseXml);
  const baseIdentityHash = computeMusicXmlIdentityHashServer(baseXml);
  await route.fulfill({
    status: 200,
    body: JSON.stringify({
      ...PATCH_RESPONSE,
      proposedXml: applied.xml,
      proposal: {
        sourceTool: 'music.patch',
        baseXml,
        proposedXml: applied.xml,
        baseScoreSessionId: null,
        baseRevision: null,
        baseContentHash,
        expectedCurrentContentHash: baseContentHash,
        baseIdentityHash,
        expectedCurrentIdentityHash: baseIdentityHash,
        verification: PATCH_RESPONSE.verification,
      },
    }),
  });
};

const buildDiffFeedbackResponse = (step: string, iteration: number) => ({
  scoreSessionId: SCORE_SESSION_ID,
  baseRevision: iteration,
  iteration,
  patch: {
    format: 'musicxml-patch@1',
    ops: [
      {
        op: 'setText',
        path: '/score-partwise/part[@id="P1"]/measure[@number="1"]/note[1]/pitch/step',
        value: step,
      },
    ],
  },
  proposedXml: buildThreeNotesXml(step),
  verification: {
    level: 'patch_apply',
    attempts: 1,
    llmCalls: 1,
    elapsedMs: 5,
  },
  feedbackPrompt: `PATCH REVISION FEEDBACK (iteration ${Math.max(0, iteration - 1)})`,
});

const countHighlights = async (page: Parameters<typeof test>[0]['page']) => (
  await page.getByTestId('compare-left-highlight').count()
  + await page.getByTestId('compare-right-highlight').count()
);

const waitForDiffReviewReady = async (page: Parameters<typeof test>[0]['page']) => {
  await page.getByTestId('checkpoint-compare-modal').waitFor({ timeout: 20_000 });
  await expect(page.getByText('Aligning measures...')).toHaveCount(0, { timeout: 20_000 });
};

const openAssistantProposalCompare = async (page: Parameters<typeof test>[0]['page']) => {
  await page.goto('/?score=/test_scores/three_notes_cde.musicxml');
  await page.waitForSelector('svg .Note', { timeout: 60_000 });

  await page.getByTestId('btn-xml-toggle').click();
  await page.getByTestId('tab-ai').click();
  await page.getByPlaceholder('Enter model name').fill('gpt-test-model');
  await page.getByPlaceholder('Paste your key').fill('test-key');
  await page.getByPlaceholder('Describe the change you want in the MusicXML.').fill('Change the first note to G.');
  await page.getByRole('button', { name: 'Generate Patch' }).click();

  await waitForDiffReviewReady(page);
  await expect(page.getByText('Current vs Assistant Proposal')).toBeVisible();
  await expect(page.getByTestId('compare-pane-right').getByText('Loading checkpoint score...')).toHaveCount(0, { timeout: 20_000 });
};

test.describe('Assistant diff editor flow', () => {
  test.beforeEach(async ({ page }) => {
    let revision = 0;
    await page.route('**/api/llm/openai/models', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify(OPENAI_MODELS_RESPONSE) });
    });
    await page.route('**/api/music/scoreops/session/open', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ scoreSessionId: SCORE_SESSION_ID, revision }),
      });
    });
    await page.route('**/api/music/scoreops/sync', async (route) => {
      revision += 1;
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ scoreSessionId: SCORE_SESSION_ID, newRevision: revision }),
      });
    });
  });

  test('patch generation opens compare modal and supports accept-all', async ({ page }) => {
    let patchRequest: Record<string, unknown> | null = null;
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));
    await page.route('**/api/music/patch', async (route) => {
      patchRequest = route.request().postDataJSON();
      const baseXml = String(patchRequest?.content || '');
      const proposalBaseXml = baseXml.replace('<score-partwise', '<!-- server serialization -->\n<score-partwise');
      const proposedXml = proposalBaseXml.replace(/<step>\s*C\s*<\/step>/, '<step>G</step>');
      const baseContentHash = scoreHash(proposalBaseXml);
      const baseIdentityHash = computeMusicXmlIdentityHashServer(proposalBaseXml);
      expect(proposedXml).not.toBe(proposalBaseXml);
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          ...PATCH_RESPONSE,
          proposedXml,
          proposal: {
            sourceTool: 'music.patch',
            baseXml: proposalBaseXml,
            proposedXml,
            baseScoreSessionId: null,
            baseRevision: null,
            baseContentHash,
            expectedCurrentContentHash: baseContentHash,
            baseIdentityHash,
            expectedCurrentIdentityHash: baseIdentityHash,
            verification: PATCH_RESPONSE.verification,
          },
        }),
      });
    });

    await openAssistantProposalCompare(page);

    expect(patchRequest).toMatchObject({
      provider: 'openai',
      model: 'gpt-test-model',
      apiKey: 'test-key',
    });
    expect(String(patchRequest?.content)).toContain('<score-partwise');
    expect(String(patchRequest?.promptText)).toContain('Change the first note to G.');

    await expect.poll(async () => (
      await page.getByTestId('compare-left-highlight').count()
      + await page.getByTestId('compare-right-highlight').count()
    ), { timeout: 20_000 }).toBeGreaterThan(0);

    await page.getByRole('button', { name: 'Apply All AI Changes' }).click();

    await expect.poll(async () => (
      await page.getByTestId('compare-left-highlight').count()
      + await page.getByTestId('compare-right-highlight').count()
    ), { timeout: 20_000 }).toBe(0);
    const savedXml = await page.evaluate(async () => {
      const score = (window as typeof window & { __webmscore?: { saveXml?: () => Promise<unknown> } }).__webmscore;
      const data = await score?.saveXml?.();
      if (typeof data === 'string') {
        return data;
      }
      if (data instanceof Uint8Array) {
        return new TextDecoder().decode(data);
      }
      return '';
    });
    expect(savedXml).toContain('<step>G</step>');
    expect(pageErrors).toEqual([]);
  });

  test('invalid patch response shows error and does not open compare modal', async ({ page }) => {
    await page.route('**/api/music/patch', async (route) => {
      await route.fulfill({
        status: 422,
        body: JSON.stringify({ error: 'AI response is not valid JSON.' }),
      });
    });

    await page.goto('/?score=/test_scores/three_notes_cde.musicxml');
    await page.waitForSelector('svg .Note', { timeout: 60_000 });

    await page.getByTestId('btn-xml-toggle').click();
    await page.getByTestId('tab-ai').click();
    await page.getByPlaceholder('Enter model name').fill('gpt-test-model');
    await page.getByPlaceholder('Paste your key').fill('test-key');
    await page.getByPlaceholder('Describe the change you want in the MusicXML.').fill('Change the first note to G.');
    await page.getByRole('button', { name: 'Generate Patch' }).click();

    await expect(page.getByText('AI response is not valid JSON.').first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('checkpoint-compare-modal')).toHaveCount(0);
  });

  test('missing verified patch endpoint does not fall back to a direct LLM proxy', async ({ page }) => {
    let genericLlmCalls = 0;
    await page.route('**/api/music/patch', async (route) => {
      await route.fulfill({ status: 404, body: '{}' });
    });
    await page.route('**/api/llm/openai', async (route) => {
      genericLlmCalls += 1;
      await route.fulfill({ status: 200, body: JSON.stringify({ text: 'unverified' }) });
    });

    await page.goto('/?score=/test_scores/three_notes_cde.musicxml');
    await page.waitForSelector('svg .Note', { timeout: 60_000 });
    await page.getByTestId('btn-xml-toggle').click();
    await page.getByTestId('tab-ai').click();
    await page.getByPlaceholder('Enter model name').fill('gpt-test-model');
    await page.getByPlaceholder('Paste your key').fill('test-key');
    await page.getByPlaceholder('Describe the change you want in the MusicXML.').fill('Change the first note to G.');
    await page.getByRole('button', { name: 'Generate Patch' }).click();

    await expect(page.getByText('Patch request failed: 404').first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('checkpoint-compare-modal')).toHaveCount(0);
    expect(genericLlmCalls).toBe(0);
  });

  test('per-block apply applies the reviewed block immediately', async ({ page }) => {
    await page.route('**/api/music/patch', fulfillPatchFromRequestBase);

    await openAssistantProposalCompare(page);
    await expect.poll(() => countHighlights(page), { timeout: 20_000 }).toBeGreaterThan(0);

    const applyButton = page.getByRole('button', { name: 'Apply', exact: true }).first();
    await applyButton.click();

    await expect.poll(() => countHighlights(page), { timeout: 20_000 }).toBe(0);
  });

  test('per-block reject marks block and leaves score unchanged', async ({ page }) => {
    await page.route('**/api/music/patch', fulfillPatchFromRequestBase);

    await openAssistantProposalCompare(page);
    const before = await countHighlights(page);
    expect(before).toBeGreaterThan(0);

    await page.getByRole('button', { name: 'Reject' }).first().dispatchEvent('click');
    await expect(page.getByRole('button', { name: /Send Feedback \(1 rejection\)/ })).toBeVisible();
    await expect.poll(() => countHighlights(page), { timeout: 15_000 }).toBeGreaterThan(0);
  });

  test('per-block comment reveals input and stores text', async ({ page }) => {
    await page.route('**/api/music/patch', fulfillPatchFromRequestBase);

    await openAssistantProposalCompare(page);

    await page.getByRole('button', { name: 'Comment' }).first().click();
    const blockComment = page.getByPlaceholder('Describe the revision needed...').first();
    await expect(blockComment).toBeVisible();
    await blockComment.fill('Keep the rhythm, but make this legato.');
    await page.getByRole('button', { name: 'Enter' }).first().click();
    await expect(page.getByText('Comment attached').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Send Feedback \(1 comment\)/ })).toBeVisible();
  });

  test('send feedback closes diff while request is running and reopens with new proposal', async ({ page }) => {
    let feedbackCalls = 0;
    let lastFeedbackPayload: any = null;
    let releaseFeedback: (() => void) | null = null;
    const feedbackPaused = new Promise<void>((resolve) => {
      releaseFeedback = resolve;
    });

    await page.route('**/api/music/patch', fulfillPatchFromRequestBase);
    await page.route('**/api/music/diff/feedback', async (route) => {
      feedbackCalls += 1;
      lastFeedbackPayload = route.request().postDataJSON();
      await feedbackPaused;
      await route.fulfill({
        status: 200,
        body: JSON.stringify(buildDiffFeedbackResponse('A', 1)),
      });
    });

    await openAssistantProposalCompare(page);
    await page.getByRole('button', { name: 'Comment' }).first().click();
    await page.getByPlaceholder('Describe the revision needed...').first().fill('Please use A instead.');
    await page.getByRole('button', { name: 'Enter' }).first().click();
    await page.getByRole('button', { name: /Send Feedback/ }).first().click();

    await expect(page.getByTestId('checkpoint-compare-modal')).toHaveCount(0, { timeout: 5_000 });
    await expect(page.getByTestId('ai-diff-feedback-working')).toBeVisible({ timeout: 5_000 });
    releaseFeedback?.();
    await expect.poll(() => feedbackCalls, { timeout: 20_000 }).toBe(1);
    expect(lastFeedbackPayload?.blocks?.[0]?.status).toBe('comment');
    expect(lastFeedbackPayload?.blocks?.[0]?.comment).toContain('use A');
    await waitForDiffReviewReady(page);
    await expect(page.getByTestId('ai-diff-feedback-working')).toHaveCount(0);
    await expect(page.getByText('Iteration 2 review')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByPlaceholder('Describe the revision needed...')).toHaveCount(0);
  });

  test('global comment is sent in diff feedback request', async ({ page }) => {
    let capturedGlobalComment = '';

    await page.route('**/api/music/patch', fulfillPatchFromRequestBase);
    await page.route('**/api/music/diff/feedback', async (route) => {
      const payload = route.request().postDataJSON();
      capturedGlobalComment = String(payload.globalComment || '');
      await route.fulfill({
        status: 200,
        body: JSON.stringify(buildDiffFeedbackResponse('B', 1)),
      });
    });

    await openAssistantProposalCompare(page);
    await page.getByRole('button', { name: 'Comment' }).first().click();
    await page.getByPlaceholder('Describe the revision needed...').first().fill('Please adjust this phrase.');
    await page.getByRole('button', { name: 'Enter' }).first().click();
    await page.getByPlaceholder('Overall feedback for the next revision...').fill('Overall dynamics are too aggressive.');
    await page.getByRole('button', { name: /Send Feedback/ }).first().click();

    await expect.poll(() => capturedGlobalComment, { timeout: 20_000 }).toContain('dynamics are too aggressive');
  });

  test('diff feedback request carries iteration and advances review state', async ({ page }) => {
    let callCount = 0;
    const requests: any[] = [];

    await page.route('**/api/music/patch', fulfillPatchFromRequestBase);
    await page.route('**/api/music/diff/feedback', async (route) => {
      callCount += 1;
      requests.push(route.request().postDataJSON());
      const step = callCount === 1 ? 'A' : 'B';
      await route.fulfill({
        status: 200,
        body: JSON.stringify(buildDiffFeedbackResponse(step, callCount)),
      });
    });

    await openAssistantProposalCompare(page);

    await page.getByRole('button', { name: 'Comment' }).first().click();
    await page.getByPlaceholder('Describe the revision needed...').first().fill('Round 1: use A.');
    await page.getByRole('button', { name: 'Enter' }).first().click();
    await page.getByRole('button', { name: /Send Feedback/ }).first().click();

    await expect.poll(() => callCount, { timeout: 20_000 }).toBe(1);
    await waitForDiffReviewReady(page);
    await expect(page.getByText('Iteration 2 review')).toBeVisible({ timeout: 20_000 });
    expect(requests[0]?.iteration).toBe(0);
  });
});
