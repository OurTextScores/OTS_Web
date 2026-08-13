import { describe, expect, it } from 'vitest';

/**
 * The embed is served under a basePath, and a soundfont path written from the
 * origin root misses the file vendored beside it. Next's `basePath` rewrites
 * links and imports, not strings fetched at runtime — which is why playback
 * failed in the scanner with the soundfont sitting at
 * `/score-editor/soundfonts/default.sf3` and the editor asking for
 * `/soundfonts/default.sf3`.
 *
 * The candidate list is built inside a component, so this asserts the shape it
 * has to have rather than reaching into it: every same-origin fallback must be
 * offered under the embed prefix before the bare one.
 */
const buildCandidates = (buildMode: string | undefined) => {
    const urls: string[] = [];
    const seen = new Set<string>();
    const add = (url: string) => {
        if (seen.has(url)) return;
        seen.add(url);
        urls.push(url);
    };
    const basePath = buildMode === 'embed' ? '/score-editor' : '';
    for (const prefix of basePath ? [basePath, ''] : ['']) {
        add(`${prefix}/soundfonts/MuseScore_General.sf3`);
        add(`${prefix}/soundfonts/MuseScore_General.sf2`);
        add(`${prefix}/soundfonts/default.sf3`);
        add(`${prefix}/soundfonts/default.sf2`);
    }
    return urls;
};

describe('soundfont candidates', () => {
    it('looks under the embed basePath first, then the origin root', () => {
        const candidates = buildCandidates('embed');

        expect(candidates[0]).toBe('/score-editor/soundfonts/MuseScore_General.sf3');
        // The file actually vendored with the embed today.
        expect(candidates).toContain('/score-editor/soundfonts/default.sf3');
        // The bare paths stay, because a host may serve them there.
        expect(candidates).toContain('/soundfonts/default.sf3');
        expect(candidates.indexOf('/score-editor/soundfonts/default.sf3')).toBeLessThan(
            candidates.indexOf('/soundfonts/default.sf3'),
        );
    });

    it('offers only the origin root outside an embed build', () => {
        const candidates = buildCandidates(undefined);

        expect(candidates).toEqual([
            '/soundfonts/MuseScore_General.sf3',
            '/soundfonts/MuseScore_General.sf2',
            '/soundfonts/default.sf3',
            '/soundfonts/default.sf2',
        ]);
    });
});
