import { afterEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => ({
  runDiffFeedbackService: vi.fn(),
}));

vi.mock('../lib/music-services/diff-feedback-service', () => ({
  runDiffFeedbackService: mocked.runDiffFeedbackService,
}));

import { POST } from '../app/api/music/diff/feedback/route';

describe('POST /api/music/diff/feedback', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns service response body and status', async () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    mocked.runDiffFeedbackService.mockResolvedValue({
      status: 200,
      body: {
        iteration: 3,
        patch: { format: 'musicxml-patch@1', ops: [] },
        proposedXml: '<score-partwise/>',
        verification: {
          level: 'patch_apply',
          attempts: 2,
          llmCalls: 2,
          effort: 'efficient',
          budget: { maxAttempts: 1, budgetMs: 60_000, requestTimeoutMs: 45_000 },
        },
      },
    });

    const response = await POST(new Request('http://localhost/api/music/diff/feedback', {
      method: 'POST',
      body: JSON.stringify({ scoreSessionId: 'sess_1', baseRevision: 1, blocks: [] }),
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      iteration: 3,
      patch: { format: 'musicxml-patch@1', ops: [] },
    });
    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('"editEffort":"efficient"'));
    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('"requestBudgetMs":60000'));
    infoSpy.mockRestore();
  });

  it('propagates service errors', async () => {
    mocked.runDiffFeedbackService.mockResolvedValue({
      status: 400,
      body: { error: 'blocks must be an array.' },
    });

    const response = await POST(new Request('http://localhost/api/music/diff/feedback', {
      method: 'POST',
      body: JSON.stringify({}),
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: 'blocks must be an array.',
    });
  });
});
