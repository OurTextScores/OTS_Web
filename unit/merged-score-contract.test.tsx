import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => ({ loadWebMscore: vi.fn() }));

vi.mock('../lib/webmscore-loader', async (importOriginal) => ({
    ...(await importOriginal<typeof import('../lib/webmscore-loader')>()),
    loadWebMscore: mocked.loadWebMscore,
}));

import {
    useMergedScoreDocument,
    type MergedScoreState,
} from '../components/score-editor/compare/useMergedScoreDocument';

/**
 * The contract between the embed and the scanner, exercised without a browser,
 * a database, or WASM.
 *
 * Every bug this file covers was found the expensive way — a full embed build,
 * a Docker image rebuild and a Playwright sign-in, to learn that a fetch used
 * the wrong path. None of them needed any of that: they are all questions about
 * what request this hook makes and what it does with the answer.
 */

const XML =
    '<?xml version="1.0"?><score-partwise><part-list><score-part id="P1"/></part-list>' +
    '<part id="P1"><measure number="1"><note/></measure></part></score-partwise>';

/** What MuseScore actually exports: the same score behind a DTD reference. */
const EXPORTED =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" ' +
    '"http://www.musicxml.org/dtds/partwise.dtd">\n' +
    '<score-partwise><part-list><score-part id="P1"/></part-list>' +
    '<part id="P1"><measure number="1"><note/></measure></part></score-partwise>';

/** Where the regions document lives; every relative URL resolves against it. */
const REGIONS_URL =
    'https://host/api/proxy/scanner/jobs/job-1/pages/1/comparison/regions?baseEngine=homr';

const resolveUrl = (relative: string) => new URL(relative, REGIONS_URL).toString();

const state = (overrides: Partial<MergedScoreState> = {}): MergedScoreState => ({
    present: false,
    revision: 0,
    edited: false,
    basisSignature: 'scanner-merged-basis-v1:abc',
    stale: false,
    url: '../merged',
    musicXmlUrl: '../merged/musicxml?revision=0',
    ...overrides,
});

/**
 * A score that returns its XML the way the real engine does across a realm
 * boundary: a typed array whose prototype is not this realm's `Uint8Array`.
 */
function fakeScore(xml = EXPORTED) {
    const bytes = new TextEncoder().encode(xml);
    return {
        saveXml: vi.fn(async () => bytes),
        relayout: vi.fn(async () => undefined),
        destroy: vi.fn(),
        setNoteEntryMode: vi.fn(async () => undefined),
    };
}

describe('the merged score contract', () => {
    let calls: Array<{ url: string; method: string; body?: unknown; headers?: any }>;

    beforeEach(() => {
        calls = [];
        mocked.loadWebMscore.mockReset();
        mocked.loadWebMscore.mockResolvedValue({ load: vi.fn(async () => fakeScore()) } as any);
    });

    afterEach(() => vi.unstubAllGlobals());

    const stubFetch = (responder: (url: string, init?: RequestInit) => Response) => {
        vi.stubGlobal(
            'fetch',
            vi.fn(async (input: any, init?: RequestInit) => {
                const url = String(input);
                calls.push({ url, method: init?.method || 'GET', body: init?.body, headers: init?.headers });
                return responder(url, init);
            }),
        );
    };

    const render = (initial: MergedScoreState) =>
        renderHook(() =>
            useMergedScoreDocument({
                state: initial,
                resolveUrl,
                prepare: (persisted) => ({
                    xml: persisted ?? XML,
                    baselineMeasures: 1,
                }),
                sourceEngineId: 'homr',
            }),
        );

    it('reads the saved score from the page, not from under comparison/', async () => {
        // The regions document sits at `…/pages/1/comparison/regions`, so a
        // bare `merged/musicxml` resolves under `comparison/` — a route that
        // does not exist. The only symptom was a 404 inside the embed.
        stubFetch(() => new Response(XML, { status: 200 }));
        const { result } = render(state({ present: true, revision: 3 }));
        await act(async () => {
            await result.current.load();
        });

        expect(new URL(calls[0].url).pathname).toBe(
            '/api/proxy/scanner/jobs/job-1/pages/1/merged/musicxml',
        );
        await waitFor(() => expect(result.current.score).not.toBeNull());
        expect(result.current.error).toBeNull();
    });

    it('sends the score as a document body, not escaped into JSON', async () => {
        // A JSON envelope both inflates the payload and exceeds the server's
        // default 100 kB body limit on an ordinary page, which reaches the
        // reviewer as a 413 they can do nothing about.
        stubFetch(() => new Response(JSON.stringify({ present: true, revision: 1 }), { status: 200 }));
        const { result } = render(state({ present: false, revision: 0 }));
        await act(async () => {
            await result.current.load();
        });
        await act(async () => {
            await result.current.save();
        });

        const put = calls.find((call) => call.method === 'PUT');
        expect(put).toBeDefined();
        expect((put!.headers as any)['Content-Type']).toBe(
            'application/vnd.recordare.musicxml+xml',
        );
        expect(typeof put!.body).toBe('string');
        expect(put!.body).toContain('<score-partwise');
        // Nothing is wrapped: the body is the score itself.
        expect(() => JSON.parse(String(put!.body))).toThrow();
        // The scanner refuses any document carrying a DOCTYPE — an XXE control
        // it shares with provider-output validation. Sending MuseScore's export
        // unaltered made every save fail as "not usable MusicXML".
        expect(put!.body).not.toMatch(/<!DOCTYPE/i);

        const query = new URL(put!.url).searchParams;
        expect(query.get('sourceEngineId')).toBe('homr');
        expect(query.get('basisSignature')).toBe('scanner-merged-basis-v1:abc');
        expect(query.get('revision')).toBe('0');
    });

    it('decodes what the engine returns across a realm boundary', async () => {
        // `saveXml` hands back bytes from the WASM realm, where
        // `value instanceof Uint8Array` is false. Decoding them naively threw
        // "parameter 1 is not of type 'ArrayBuffer'" and the save silently
        // did nothing.
        stubFetch(() => new Response(JSON.stringify({ present: true, revision: 1 }), { status: 200 }));
        const { result } = render(state());
        await act(async () => {
            await result.current.load();
        });
        await act(async () => {
            const outcome = await result.current.save();
            expect(outcome.ok).toBe(true);
        });
        expect(result.current.error).toBeNull();
    });

    it('surfaces a refusal instead of pretending the save worked', async () => {
        stubFetch((url, init) =>
            init?.method === 'PUT'
                ? new Response(
                      JSON.stringify({
                          message: 'The engine readings changed since this merge was made',
                      }),
                      { status: 409 },
                  )
                : new Response(XML, { status: 200 }),
        );
        const { result } = render(state({ present: true, revision: 2 }));
        await act(async () => {
            await result.current.load();
        });
        await act(async () => {
            const outcome = await result.current.save();
            expect(outcome).toMatchObject({ ok: false, stale: true });
        });
        expect(result.current.error).toMatch(/readings changed/);
        // The reviewer still holds the only copy of their work.
        expect(result.current.dirty).toBe(false);
    });

    it('carries the reviewer\'s acceptance when they save against new readings', async () => {
        stubFetch(() => new Response(JSON.stringify({ present: true, revision: 3 }), { status: 200 }));
        const { result } = render(state({ present: true, revision: 2, stale: true }));
        await act(async () => {
            await result.current.load();
        });
        await act(async () => {
            await result.current.save({ acceptStale: true });
        });
        const put = calls.find((call) => call.method === 'PUT');
        expect(new URL(put!.url).searchParams.get('acceptStale')).toBe('true');
    });

    it('reports an edit, and keeps reporting it after a save', async () => {
        // An edited bar means both engines were wrong there. Once that is true
        // of a page it stays true, or phase E files hand work as an engine win.
        stubFetch(() =>
            new Response(JSON.stringify({ present: true, revision: 1, edited: true }), { status: 200 }),
        );
        const { result } = render(state());
        await act(async () => {
            await result.current.load();
        });
        await act(async () => {
            await result.current.mutate('edit', async () => undefined);
        });
        expect(result.current.dirty).toBe(true);

        await act(async () => {
            await result.current.save();
        });
        expect(new URL(calls.find((c) => c.method === 'PUT')!.url).searchParams.get('edited')).toBe(
            'true',
        );
        expect(result.current.dirty).toBe(false);
        expect(result.current.state?.edited).toBe(true);
    });

    it('does not call a selection an edit', async () => {
        // Selecting a bar changes nothing about the document. Counting it as an
        // edit would file an untouched merge as hand-corrected after a stray
        // click.
        stubFetch(() => new Response(XML, { status: 200 }));
        const { result } = render(state());
        await act(async () => {
            await result.current.load();
        });
        await act(async () => {
            await result.current.mutate('select', async () => undefined, { mutates: false });
        });
        expect(result.current.dirty).toBe(false);
    });

    it('discards through the same page-level route, quoting the revision', async () => {
        stubFetch((url) =>
            url.includes('musicxml')
                ? new Response(XML, { status: 200 })
                : new Response(JSON.stringify({ present: false, revision: 0 }), { status: 200 }),
        );
        const { result } = render(state({ present: true, revision: 4 }));
        await act(async () => {
            await result.current.discard();
        });
        const del = calls.find((call) => call.method === 'DELETE')!;
        expect(new URL(del.url).pathname).toBe('/api/proxy/scanner/jobs/job-1/pages/1/merged');
        expect(new URL(del.url).searchParams.get('revision')).toBe('4');
        expect(result.current.state?.present).toBe(false);
    });

    it('says so when the saved score cannot be read, rather than showing an engine', async () => {
        stubFetch(() => new Response('nope', { status: 404 }));
        const { result } = render(state({ present: true, revision: 1 }));
        await act(async () => {
            await result.current.load();
        });
        expect(result.current.error).toMatch(/could not be read \(404\)/);
        expect(result.current.score).toBeNull();
    });

    it('asks the scanner to splice, rather than splicing here', async () => {
        // The scanner holds both readings, the alignment and the safety rules.
        // A decision made in the browser would be a second implementation of
        // all three, and the one that disagreed would be this one.
        stubFetch((url, init) =>
            init?.method === 'POST'
                ? new Response(JSON.stringify({ present: true, revision: 5, repairs: [] }), {
                      status: 200,
                  })
                : new Response(XML, { status: 200 }),
        );
        const { result } = render(state({ present: true, revision: 4 }));
        await act(async () => {
            await result.current.load();
        });
        await act(async () => {
            const outcome = await result.current.take({
                blockIndex: 2,
                contentSignature: 'scanner-block-content-v2:abc',
                engineId: 'transcoda',
                baseEngineId: 'homr',
                candidateEngineId: 'transcoda',
            });
            expect(outcome.ok).toBe(true);
        });

        const post = calls.find((call) => call.method === 'POST')!;
        expect(new URL(post.url).pathname).toBe(
            '/api/proxy/scanner/jobs/job-1/pages/1/merged/decisions',
        );
        const body = JSON.parse(String(post.body));
        expect(body).toMatchObject({
            blockIndex: 2,
            contentSignature: 'scanner-block-content-v2:abc',
            engineId: 'transcoda',
            baseEngine: 'homr',
            candidateEngine: 'transcoda',
            // The revision it was decided against, so a second tab cannot
            // overwrite the first.
            revision: 4,
        });
        expect(result.current.state?.revision).toBe(5);
    });

    it('surfaces a refusal with its reasons instead of a bare failure', async () => {
        // Refusals are the point of that route: the reviewer is told what about
        // this passage could not be moved.
        stubFetch((url, init) =>
            init?.method === 'POST'
                ? new Response(
                      JSON.stringify({
                          message: 'This passage cannot be taken from that reading',
                          refusals: [
                              { code: 'tie-crosses-boundary', detail: 'A tie runs out of it.' },
                          ],
                      }),
                      { status: 409 },
                  )
                : new Response(XML, { status: 200 }),
        );
        const { result } = render(state({ present: true, revision: 1 }));
        await act(async () => {
            await result.current.load();
        });
        await act(async () => {
            const outcome = await result.current.take({
                blockIndex: 0,
                contentSignature: 'sig',
                engineId: 'transcoda',
                baseEngineId: 'homr',
                candidateEngineId: 'transcoda',
            });
            expect(outcome).toMatchObject({ ok: false });
            if (!outcome.ok) {
                expect(outcome.refusals?.[0].code).toBe('tie-crosses-boundary');
            }
        });
        expect(result.current.error).toMatch(/cannot be taken/);
        // The merged score is untouched, so nothing has to be undone.
        expect(result.current.state?.revision).toBe(1);
    });
});
