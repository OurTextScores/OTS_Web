import { NextResponse } from 'next/server';
import { logApiRouteSummary } from '../../../../../lib/api-route-logging';
import { runMusicOmrTranscribeService } from '../../../../../lib/music-services/omr-service';
import { MusicServiceError } from '../../../../../lib/music-services/errors';
import { applyTraceHeaders, resolveTraceContext } from '../../../../../lib/trace-http';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    const startedAt = Date.now();
    const trace = resolveTraceContext(request);
    let status = 500;
    const tracedJson = (body: unknown, init?: ResponseInit) => {
        const response = NextResponse.json(body, init);
        applyTraceHeaders(response.headers, trace);
        return response;
    };
    try {
        const result = await runMusicOmrTranscribeService(await request.json(), { traceContext: trace });
        status = result.status;
        return tracedJson(result.body, { status: result.status });
    } catch (error) {
        if (error instanceof MusicServiceError) {
            status = error.status;
            return tracedJson({ error: error.message }, { status: error.status });
        }
        const message = error instanceof Error ? error.message : 'OMR transcription error.';
        status = /tools unavailable|timed out|Transcoda Space/i.test(message) ? 503 : 500;
        const details = error && typeof error === 'object' && 'details' in error
            ? (error as { details?: unknown }).details
            : undefined;
        console.error('[music.omr.transcribe] request failed', {
            status,
            message,
            traceId: trace.traceId,
            requestId: trace.requestId,
            details,
        });
        return tracedJson({
            error: {
                message,
                details,
                traceId: trace.traceId,
                requestId: trace.requestId,
            },
        }, { status });
    } finally {
        logApiRouteSummary({
            event: 'music.omr.transcribe.summary',
            route: '/api/music/omr/transcribe',
            method: 'POST',
            status,
            startedAt,
            trace,
        });
    }
}
