import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => ({
  runMusicPatchService: vi.fn(),
}));

vi.mock('../lib/music-services/patch-service', () => ({
  runMusicPatchService: mocked.runMusicPatchService,
}));

import { POST } from '../app/api/music/patch/route';

describe('POST /api/music/patch', () => {
  const priorAllowProxy = process.env.ALLOW_UNAUTHENTICATED_LLM_PROXY;
  const priorAppToken = process.env.OTS_API_AUTH_TOKEN;

  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.ALLOW_UNAUTHENTICATED_LLM_PROXY;
    delete process.env.OTS_API_AUTH_TOKEN;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (priorAllowProxy === undefined) {
      delete process.env.ALLOW_UNAUTHENTICATED_LLM_PROXY;
    } else {
      process.env.ALLOW_UNAUTHENTICATED_LLM_PROXY = priorAllowProxy;
    }
    if (priorAppToken === undefined) {
      delete process.env.OTS_API_AUTH_TOKEN;
    } else {
      process.env.OTS_API_AUTH_TOKEN = priorAppToken;
    }
  });

  it('blocks calls when no app token or explicit public opt-in is configured', async () => {
    const response = await POST(new Request('http://localhost/api/music/patch', {
      method: 'POST',
      body: JSON.stringify({ content: '<score-partwise/>' }),
    }));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      code: 'api_auth_not_configured',
    });
    expect(mocked.runMusicPatchService).not.toHaveBeenCalled();
  });

  it('rejects invalid JSON and missing MusicXML before calling the service', async () => {
    process.env.ALLOW_UNAUTHENTICATED_LLM_PROXY = '1';

    const invalidJson = await POST(new Request('http://localhost/api/music/patch', {
      method: 'POST',
      body: '{',
    }));
    const missingContent = await POST(new Request('http://localhost/api/music/patch', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'transpose' }),
    }));

    expect(invalidJson.status).toBe(400);
    await expect(invalidJson.json()).resolves.toMatchObject({
      error: 'Request body must be valid JSON.',
    });
    expect(missingContent.status).toBe(400);
    await expect(missingContent.json()).resolves.toMatchObject({
      error: 'Base MusicXML content is required.',
    });
    expect(mocked.runMusicPatchService).not.toHaveBeenCalled();
  });

  it('forwards authenticated requests, cancellation, and verification metadata', async () => {
    process.env.OTS_API_AUTH_TOKEN = 'app-token';
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    mocked.runMusicPatchService.mockResolvedValue({
      status: 200,
      body: {
        patch: { format: 'musicxml-patch@1', ops: [] },
        annotations: [],
        proposedXml: '<score-partwise/>',
        verification: {
          level: 'patch_apply',
          attempts: 1,
          llmCalls: 1,
          elapsedMs: 12,
          effort: 'balanced',
          budget: { maxAttempts: 3, budgetMs: 120_000, requestTimeoutMs: 60_000 },
        },
      },
    });
    const controller = new AbortController();
    const response = await POST(new Request('http://localhost/api/music/patch', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-ots-api-token': 'app-token',
        'x-request-id': 'req-patch-1',
      },
      body: JSON.stringify({ content: '<score-partwise/>', prompt: 'No changes.' }),
      signal: controller.signal,
    }));

    expect(response.status).toBe(200);
    expect(response.headers.get('x-request-id')).toBe('req-patch-1');
    await expect(response.json()).resolves.toMatchObject({
      proposedXml: '<score-partwise/>',
      verification: {
        level: 'patch_apply',
        attempts: 1,
        llmCalls: 1,
      },
    });
    expect(mocked.runMusicPatchService).toHaveBeenCalledWith(
      expect.objectContaining({ content: '<score-partwise/>', prompt: 'No changes.' }),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
        traceContext: expect.objectContaining({ requestId: 'req-patch-1' }),
      }),
    );
    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('"editEffort":"balanced"'));
    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('"requestBudgetMs":120000'));
    infoSpy.mockRestore();
    const serviceOptions = mocked.runMusicPatchService.mock.calls[0][1];
    expect(serviceOptions.signal.aborted).toBe(false);
  });
});
