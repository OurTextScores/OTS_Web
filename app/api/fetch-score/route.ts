import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const ALLOWED_HOSTS = new Set([
    'drive.google.com',
    'drive.usercontent.google.com',
]);

function isAllowedUrl(raw: string): boolean {
    try {
        const url = new URL(raw);
        return url.protocol === 'https:' && ALLOWED_HOSTS.has(url.hostname);
    } catch {
        return false;
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('url');

    if (!target || !isAllowedUrl(target)) {
        return NextResponse.json({ error: 'Invalid or disallowed URL' }, { status: 400 });
    }

    let upstream: Response;
    try {
        upstream = await fetch(target, {
            redirect: 'follow',
            headers: { 'User-Agent': 'Mozilla/5.0' },
        });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch upstream URL' }, { status: 502 });
    }

    if (!upstream.ok) {
        return NextResponse.json(
            { error: `Upstream returned ${upstream.status}` },
            { status: upstream.status },
        );
    }

    const body = await upstream.arrayBuffer();
    const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';

    return new Response(body, {
        status: 200,
        headers: { 'Content-Type': contentType },
    });
}
