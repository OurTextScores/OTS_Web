'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { decodeScoreXml, loadWebMscore, type Score } from '@/lib/webmscore-loader';

/**
 * The scanner's view of a page's merged score.
 *
 * Mirrors the backend's `mergedScoreState`, which travels inside the compare
 * regions document because this embed reaches the scanner only through the
 * host's proxy and cannot construct scanner URLs of its own.
 */
export type MergedScoreState = {
    present: boolean;
    sourceEngineId?: string;
    revision: number;
    edited: boolean;
    /** The readings a save must be made against. */
    basisSignature: string;
    recordedBasisSignature?: string;
    /** The readings moved underneath this merge; the reviewer has to decide. */
    stale: boolean;
    /**
     * What has been decided so far, in order.
     *
     * The gutter needs it to know what the merged score currently reads: a
     * control offering to take a bar it already reads that way does nothing,
     * and a control that does nothing is worse than none — a reviewer cannot
     * tell it from one that is merely unavailable.
     */
    decisions?: Array<{
        blockIndex?: number;
        engineId?: string;
        markingsOnly?: 'dynamics' | 'lyrics';
    }>;
    /**
     * Where each merged bar came from, by position.
     *
     * `map[mergedPosition] = sourceMeasureIndex`. A take that inserts or
     * removes bars renumbers everything after it, so any position computed from
     * the engine reading has to be followed through this to stay on the bar it
     * meant.
     */
    measureMap?: number[];
    url: string;
    musicXmlUrl: string;
};

/** What the scanner's merged-score route parses; see its controller. */
const MUSICXML_CONTENT_TYPE = 'application/vnd.recordare.musicxml+xml';

/** A bar-level take, as the scanner's decision route describes the result. */
export type MergedTakeOutcome =
    | { ok: true; state: MergedScoreState; repairs: Array<{ code: string; detail: string }> }
    | { ok: false; error: string; refusals?: Array<{ code: string; detail: string }> };

export type MergedSaveOutcome =
    | { ok: true; state: MergedScoreState }
    | { ok: false; error: string; stale?: boolean };

/**
 * Strip the system breaks the row view imposes.
 *
 * The rows are the *scan's* systems, forced onto whatever document is being
 * shown (see `withForcedSystemBreaks`). That is a way of reading the page, not
 * a property of the score: saving it would push the scanned page's line breaks
 * into the work's own engraving, where nothing asked for them.
 *
 * Note this does not restore the engine's original breaks — reflowing already
 * discarded those. The merged score is saved with no imposed breaks at all and
 * laid out by MuseScore, which is the right default for a score assembled from
 * two readings that broke their lines differently in the first place.
 */
export function withoutSystemBreaks(xml: string): string {
    if (typeof DOMParser === 'undefined') return xml;
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length > 0) return xml;
    for (const part of Array.from(doc.getElementsByTagName('part'))) {
        for (const measure of Array.from(part.children)) {
            if (measure.tagName !== 'measure') continue;
            for (const print of Array.from(measure.getElementsByTagName('print'))) {
                if (print.parentElement !== measure) continue;
                print.removeAttribute('new-system');
                print.removeAttribute('new-page');
                // A <print> that said nothing but "break here" has nothing left
                // to say; one carrying layout is left alone.
                if (print.attributes.length === 0 && print.children.length === 0) {
                    measure.removeChild(print);
                }
            }
        }
    }
    return new XMLSerializer().serializeToString(doc);
}

/**
 * Drop the DTD reference MuseScore writes at the top of an exported score.
 *
 * The scanner refuses any document containing a `<!DOCTYPE`, and that guard is
 * shared with the code that validates what an OMR provider returned — it is an
 * XXE control, not a formatting preference, so it does not get relaxed for our
 * own client. Nothing is lost by dropping it: MusicXML's DOCTYPE is a pointer
 * to a DTD on musicxml.org and carries no content of its own, and the server
 * still refuses anything that arrives with one.
 */
export function withoutDoctype(xml: string): string {
    return xml.replace(/<!DOCTYPE[^>[]*(\[[^\]]*\])?\s*>\s*/i, '');
}

/** Count a part's measures, so an insert or delete can be noticed. */
export function measureCount(xml: string): number {
    if (typeof DOMParser === 'undefined') return 0;
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length > 0) return 0;
    const part = doc.getElementsByTagName('part')[0];
    if (!part) return 0;
    return Array.from(part.children).filter((child) => child.tagName === 'measure').length;
}

type LoadInput = {
    /** Reflowed onto the scan's systems, ready to render as rows. */
    xml: string;
    /** Measure count before reflowing, so a later insert can be detected. */
    baselineMeasures: number;
};

/**
 * Own the merged score as a live, mutable, persistable document.
 *
 * This is the difference S3.5 makes: until now the merged pane was a *view* of
 * whichever engine the reviewer picked, so there was nothing to edit and
 * nothing to keep. Here it is a real webmscore instance with its own identity —
 * mutations run against it, and what is saved is the page's own artifact.
 */
export function useMergedScoreDocument({
    state,
    resolveUrl,
    prepare,
    sourceEngineId,
}: {
    state: MergedScoreState | null;
    resolveUrl: (relative: string) => string;
    /**
     * Turn the raw document into one ready to render as rows — in practice,
     * reflowing it onto the scan's systems. Called with the persisted merged
     * score when there is one, and with null when the reviewer is starting
     * from an engine, because both need the same treatment.
     */
    prepare: (persistedXml: string | null) => LoadInput | null;
    sourceEngineId: string;
}) {
    const [score, setScore] = useState<Score | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dirty, setDirty] = useState(false);
    const [busy, setBusy] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState<MergedScoreState | null>(state);
    const [revision, setRevision] = useState(0);
    const [baselineMeasures, setBaselineMeasures] = useState(0);
    const scoreRef = useRef<Score | null>(null);

    const current = saved ?? state;

    const destroy = useCallback(() => {
        const existing = scoreRef.current;
        scoreRef.current = null;
        try {
            existing?.destroy?.();
        } catch {
            // A score that will not close is not a reason to lose the view.
        }
    }, []);

    useEffect(() => destroy, [destroy]);

    /**
     * Load the merged document: the persisted one if the reviewer has saved,
     * otherwise a fresh copy of the engine they chose to start from.
     */
    const load = useCallback(async () => {
        const persisted = current?.present ? current : null;
        setLoading(true);
        setError(null);
        try {
            let persistedXml: string | null = null;
            if (persisted) {
                const response = await fetch(resolveUrl(persisted.musicXmlUrl), {
                    cache: 'no-store',
                });
                if (!response.ok) {
                    throw new Error(`The saved merged score could not be read (${response.status})`);
                }
                persistedXml = await response.text();
            }
            const input = prepare(persistedXml);
            if (!input) {
                destroy();
                setScore(null);
                return;
            }
            const WebMscore = await loadWebMscore();
            const loaded = await (WebMscore as any).load(
                'xml',
                new TextEncoder().encode(input.xml),
            );
            if (!loaded) throw new Error('The merged score could not be laid out.');
            destroy();
            scoreRef.current = loaded;
            setScore(loaded);
            setBaselineMeasures(input.baselineMeasures);
            setDirty(false);
            setRevision((value) => value + 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    }, [current, destroy, prepare, resolveUrl]);

    /**
     * Run one edit against the merged score.
     *
     * Serialized through `busy` rather than a queue: libmscore is single
     * threaded behind this binding, and two overlapping mutations produce a
     * layout that matches neither.
     */
    const mutate = useCallback(
        async (
            label: string,
            action: (target: Score) => Promise<unknown> | unknown,
            options?: { skipRelayout?: boolean; mutates?: boolean },
        ): Promise<boolean> => {
            const target = scoreRef.current;
            if (!target || busy || saving) return false;
            setBusy(true);
            try {
                await action(target);
                if (!options?.skipRelayout && target.relayout) {
                    await target.relayout();
                }
                if (options?.mutates !== false) setDirty(true);
                setRevision((value) => value + 1);
                return true;
            } catch (err) {
                setError(`Unable to ${label}: ${err instanceof Error ? err.message : String(err)}`);
                return false;
            } finally {
                setBusy(false);
            }
        },
        [busy, saving],
    );

    /** Export what the reviewer sees, minus the row view's imposed breaks. */
    const exportXml = useCallback(async (): Promise<string | null> => {
        const target = scoreRef.current;
        if (!target?.saveXml) return null;
        return withoutDoctype(withoutSystemBreaks(await decodeScoreXml(await target.saveXml())));
    }, []);

    const save = useCallback(
        async (options?: { acceptStale?: boolean }): Promise<MergedSaveOutcome> => {
            if (!current) return { ok: false, error: 'This page cannot carry a merged score.' };
            setSaving(true);
            setError(null);
            try {
                const musicXml = await exportXml();
                if (!musicXml) throw new Error('The merged score could not be exported.');
                // The score is the body, and everything about the save is in
                // the query string. A JSON envelope escapes a whole document
                // into a string field and exceeds the server's default body
                // limit on an ordinary page, which arrives as a 413 the
                // reviewer can do nothing about.
                const query = new URLSearchParams({
                    sourceEngineId,
                    basisSignature: current.basisSignature,
                    revision: String(current.revision),
                    // Hand work is recorded on the artifact because an edited
                    // bar means *both* engines were wrong there, and phase E
                    // must never file that as an engine win.
                    edited: String(dirty || current.edited),
                    acceptStale: String(Boolean(options?.acceptStale)),
                });
                const response = await fetch(`${resolveUrl(current.url)}?${query}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': MUSICXML_CONTENT_TYPE },
                    body: musicXml,
                });
                const body = await response.json().catch(() => null);
                if (!response.ok) {
                    const message =
                        typeof body?.message === 'string'
                            ? body.message
                            : `The merged score could not be saved (${response.status})`;
                    setError(message);
                    return { ok: false, error: message, stale: response.status === 409 };
                }
                const next = { ...current, ...body } as MergedScoreState;
                setSaved(next);
                setDirty(false);
                return { ok: true, state: next };
            } catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                setError(message);
                return { ok: false, error: message };
            } finally {
                setSaving(false);
            }
        },
        [current, dirty, exportXml, resolveUrl, sourceEngineId],
    );

    /**
     * Take one comparison block from one engine into the merged score.
     *
     * The scanner does the splicing: it holds both readings, the alignment and
     * the safety rules, and a decision made anywhere else would be a second
     * implementation of all three. What arrives back is a new revision, so the
     * document is reloaded rather than patched — the merge may have changed
     * length, and guessing how would be the same mistake in a smaller place.
     */
    const take = useCallback(
        async (input: {
            blockIndex: number;
            contentSignature: string;
            engineId: string;
            baseEngineId: string;
            candidateEngineId: string;
            /** Absent takes the bars; present takes only that marking. */
            kind?: 'dynamics' | 'lyrics';
            /**
             * Take the notes even though the readings disagree about the bar's
             * length. Only ever set by a reviewer who has been told why it
             * refused and asked for it anyway.
             */
            acceptDurationChange?: boolean;
        }): Promise<MergedTakeOutcome> => {
            if (!current) return { ok: false, error: 'This page cannot carry a merged score.' };
            setSaving(true);
            setError(null);
            try {
                const path = input.kind
                    ? `${current.url}/decisions/markings`
                    : `${current.url}/decisions`;
                const response = await fetch(resolveUrl(path), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        blockIndex: input.blockIndex,
                        contentSignature: input.contentSignature,
                        engineId: input.engineId,
                        baseEngine: input.baseEngineId,
                        candidateEngine: input.candidateEngineId,
                        revision: current.revision,
                        ...(input.acceptDurationChange ? { acceptDurationChange: true } : {}),
                        ...(input.kind ? { kind: input.kind } : {}),
                    }),
                });
                const body = await response.json().catch(() => null);
                if (!response.ok) {
                    // Refusals are the point of that route, not an error to
                    // flatten: the reviewer is told what about this passage
                    // could not be moved.
                    const message =
                        typeof body?.message === 'string'
                            ? body.message
                            : `That passage could not be taken (${response.status})`;
                    setError(message);
                    return { ok: false, error: message, refusals: body?.refusals };
                }
                const next = { ...current, ...body } as MergedScoreState;
                setSaved(next);
                setDirty(false);
                return { ok: true, state: next, repairs: body?.repairs || [] };
            } catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                setError(message);
                return { ok: false, error: message };
            } finally {
                setSaving(false);
            }
        },
        [current, resolveUrl],
    );

    const discard = useCallback(async (): Promise<MergedSaveOutcome> => {
        if (!current?.present) return { ok: false, error: 'There is no saved merged score.' };
        setSaving(true);
        try {
            const response = await fetch(
                `${resolveUrl(current.url)}?revision=${current.revision}`,
                { method: 'DELETE' },
            );
            const body = await response.json().catch(() => null);
            if (!response.ok) {
                const message =
                    typeof body?.message === 'string'
                        ? body.message
                        : `The merged score could not be discarded (${response.status})`;
                setError(message);
                return { ok: false, error: message };
            }
            const next = { ...current, ...body } as MergedScoreState;
            setSaved(next);
            setDirty(false);
            return { ok: true, state: next };
        } finally {
            setSaving(false);
        }
    }, [current, resolveUrl]);

    return {
        score,
        state: current,
        loading,
        busy,
        saving,
        dirty,
        error,
        /** Rises on every render-affecting change; row views key off it. */
        revision,
        baselineMeasures,
        load,
        mutate,
        exportXml,
        save,
        take,
        discard,
        setError,
    };
}
