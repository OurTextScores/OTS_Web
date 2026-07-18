import { NextResponse } from 'next/server';
import { requireSensitiveApiAccess } from '../../../../../lib/api-access-control';
import { logApiRouteSummary } from '../../../../../lib/api-route-logging';
import { runDeepEditService } from '../../../../../lib/music-services/deep-edit-service';
import { applyTraceHeaders, resolveTraceContext } from '../../../../../lib/trace-http';

export const runtime = 'nodejs';

const asRecord = (value: unknown): Record<string, unknown> | null => (
  value && typeof value === 'object' ? value as Record<string, unknown> : null
);

export async function POST(request: Request) {
  const startedAt = Date.now();
  const trace = resolveTraceContext(request);
  let status = 500;
  let summaryExtra: Record<string, unknown> = {};
  try {
    const access = requireSensitiveApiAccess({
      request,
      trace,
      route: '/api/music/patch/deep',
      allowUnauthenticatedEnvVar: 'ALLOW_UNAUTHENTICATED_LLM_PROXY',
    });
    if (!access.ok) {
      status = access.response.status;
      return access.response;
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      status = 400;
      const response = NextResponse.json({ error: 'Request body must be valid JSON.' }, { status });
      applyTraceHeaders(response.headers, trace);
      return response;
    }
    const data = asRecord(body);
    summaryExtra = {
      provider: typeof data?.provider === 'string' ? data.provider.slice(0, 32) : null,
      model: typeof data?.model === 'string' ? data.model.slice(0, 128) : null,
    };
    if (typeof data?.content !== 'string' || !data.content.trim()) {
      status = 400;
      const response = NextResponse.json({ error: 'Base MusicXML content is required.' }, { status });
      applyTraceHeaders(response.headers, trace);
      return response;
    }

    const result = await runDeepEditService(body, {
      traceContext: trace,
      signal: request.signal,
    });
    status = result.status;
    const deepEdit = asRecord(result.body.deepEdit);
    const counters = asRecord(deepEdit?.counters);
    const proposal = asRecord(result.body.proposal);
    const verification = asRecord(proposal?.verification);
    summaryExtra = {
      ...summaryExtra,
      errorCategory: typeof result.body.errorCategory === 'string' ? result.body.errorCategory : null,
      finalizedCandidateId: typeof deepEdit?.finalizedCandidateId === 'string' ? deepEdit.finalizedCandidateId : null,
      candidateCount: Array.isArray(deepEdit?.candidates) ? deepEdit.candidates.length : null,
      verificationLevel: typeof verification?.level === 'string' ? verification.level : null,
      llmCalls: typeof counters?.llmCalls === 'number' ? counters.llmCalls : null,
      toolCalls: typeof counters?.toolCalls === 'number' ? counters.toolCalls : null,
      renders: typeof counters?.renders === 'number' ? counters.renders : null,
      deepElapsedMs: typeof deepEdit?.elapsedMs === 'number' ? deepEdit.elapsedMs : null,
    };
    const response = NextResponse.json(result.body, { status });
    applyTraceHeaders(response.headers, trace);
    return response;
  } finally {
    logApiRouteSummary({
      event: 'music.patch.deep.summary',
      route: '/api/music/patch/deep',
      method: 'POST',
      status,
      startedAt,
      trace,
      extra: summaryExtra,
    });
  }
}
