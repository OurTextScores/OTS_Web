import {
    articulationOptions,
    clefButtonOptionsDefault,
    dynamicOptions,
    hairpinOptions,
    pedalOptions,
    repeatCountOptions,
    barlineOptions,
    voltaOptions,
    accidentalOptions,
    graceNoteOptions,
    keySignatureButtonOptionsDefault,
    signatureOptionsDefault,
} from './constants';

export const SCORE_PALETTE_DRAG_MIME = 'application/x-ots-score-palette+json';

export type PaletteCategory =
    | 'Clefs'
    | 'Key Signatures'
    | 'Time Signatures'
    | 'Accidentals'
    | 'Grace Notes'
    | 'Dynamics'
    | 'Hairpins'
    | 'Pedals'
    | 'Articulations'
    | 'Fermatas'
    | 'Breaths'
    | 'Ottavas'
    | 'Trills'
    | 'Glissandos'
    | 'Arpeggios'
    | 'Tremolos'
    | 'Noteheads'
    | 'Beams'
    | 'Barlines'
    | 'Voltas'
    | 'Repeats'
    | 'Markers'
    | 'Jumps';

// Discriminates which editor action a palette item performs when applied.
export type PaletteKind =
    | 'clef'
    | 'keysig'
    | 'timesig'
    | 'accidental'
    | 'gracenote'
    | 'dynamic'
    | 'hairpin'
    | 'pedal'
    | 'articulation'
    | 'fermata'
    | 'breath'
    | 'ottava'
    | 'trill'
    | 'glissando'
    | 'arpeggio'
    | 'tremolo'
    | 'notehead'
    | 'beam'
    | 'barline'
    | 'volta'
    | 'repeat-start'
    | 'repeat-end'
    | 'repeat-count'
    | 'marker'
    | 'jump';

export type ScorePaletteItem = {
    label: string;
    symbol: string;
    category: PaletteCategory;
    kind: PaletteKind;
    subtype: number;
    // Extra positional args for actions that need more than a single value (e.g. time signatures).
    args?: number[];
    // Present only for kinds that support drag-and-drop onto the score
    // (the engine's applyDropAtPoint currently covers clefs/dynamics/articulations).
    elementType?: 0 | 1 | 2;
};

type OptionInput = { label: string; value: number; symbol?: string; args?: number[] };

const makePaletteItems = (category: PaletteCategory, kind: PaletteKind, options: ReadonlyArray<OptionInput>): ScorePaletteItem[] =>
    options.map(option => ({
        label: option.label,
        symbol: option.symbol ?? '',
        category,
        kind,
        subtype: option.value,
        ...(option.args ? { args: option.args } : {}),
    }));

// --- Clefs -----------------------------------------------------------------
const clefPaletteGlyph = (clefType: number): string => {
    const codepoints: Record<number, number> = {
        0: 0xE050, 1: 0xE051, 2: 0xE052, 3: 0xE053, 4: 0xE054,
        5: 0xE055, 6: 0xE057, 7: 0xE050,
        20: 0xE062, 21: 0xE063, 22: 0xE064, 23: 0xE065, 24: 0xE066,
        29: 0xE069, 30: 0xE06A,
        31: 0xE06D, 32: 0xE06E, 33: 0xE06D, 34: 0xE06E,
    };
    if (codepoints[clefType]) return String.fromCharCode(codepoints[clefType]);
    if (clefType >= 8 && clefType <= 19) return String.fromCharCode(0xE05C);
    if (clefType >= 20 && clefType <= 28) return String.fromCharCode(0xE062);
    return String.fromCharCode(0xE050);
};

const clefItems: ScorePaletteItem[] = clefButtonOptionsDefault.map(option => ({
    label: `${option.label} clef`,
    symbol: clefPaletteGlyph(option.value),
    category: 'Clefs',
    kind: 'clef',
    subtype: option.value,
    elementType: 0,
}));

// --- Dynamics --------------------------------------------------------------
const dynamicGlyphs: Record<string, string> = {
    p: '', m: '', f: '', r: '', s: '', z: '', n: '',
};
const dynamicSymbolFor = (label: string) => Array.from(label).map(character => dynamicGlyphs[character] ?? character).join('');
const dynamicItems: ScorePaletteItem[] = dynamicOptions.map(option => ({
    label: `${option.label} dynamic`,
    symbol: dynamicSymbolFor(option.label),
    category: 'Dynamics',
    kind: 'dynamic',
    subtype: option.value,
    elementType: 1,
}));

// --- Articulations ---------------------------------------------------------
const articulationGlyphs: Record<string, string> = {
    articStaccatoAbove: '', articTenutoAbove: '', articMarcatoAbove: '', articAccentAbove: '',
};
const articulationItems: ScorePaletteItem[] = articulationOptions.map((option, index) => ({
    label: option.label,
    symbol: articulationGlyphs[option.symbol] ?? '',
    category: 'Articulations',
    kind: 'articulation',
    subtype: index,
    elementType: 2,
}));

// --- Everything else -------------------------------------------------------
const keySignatureItems = makePaletteItems('Key Signatures', 'keysig', keySignatureButtonOptionsDefault.map(option => ({
    label: `${option.label} major`, value: option.fifths,
})));

const timeSignatureItems: ScorePaletteItem[] = signatureOptionsDefault.map(option => ({
    label: option.label,
    symbol: '',
    category: 'Time Signatures',
    kind: 'timesig',
    subtype: option.numerator,
    args: [option.numerator, option.denominator, option.timeSigType],
}));

const accidentalItems = makePaletteItems('Accidentals', 'accidental',
    accidentalOptions.filter(option => option.value !== 0).map(option => ({ label: option.name, value: option.value, symbol: option.symbol })));

const graceNoteItems = makePaletteItems('Grace Notes', 'gracenote', graceNoteOptions.map(option => ({ label: option.label, value: option.value })));

const hairpinItems = makePaletteItems('Hairpins', 'hairpin', hairpinOptions.map(option => ({ label: option.label, value: option.value })));

const pedalItems = makePaletteItems('Pedals', 'pedal', pedalOptions.map(option => ({ label: option.label, value: option.value })));

const fermataItems = makePaletteItems('Fermatas', 'fermata', [
    { label: 'Fermata', value: 0, symbol: '' },
    { label: 'Short fermata', value: 1, symbol: '' },
    { label: 'Long fermata', value: 2, symbol: '' },
    { label: 'Very short fermata', value: 3, symbol: '' },
    { label: 'Very long fermata', value: 4, symbol: '' },
]);

const breathItems = makePaletteItems('Breaths', 'breath', [
    { label: 'Breath mark', value: 0, symbol: '' },
    { label: 'Caesura', value: 5, symbol: '' },
    { label: 'Tick breath mark', value: 1, symbol: '' },
    { label: 'Salzedo breath mark', value: 2, symbol: '' },
    { label: 'Upbow breath mark', value: 3, symbol: '' },
    { label: 'Curved caesura', value: 4, symbol: '' },
    { label: 'Short caesura', value: 6, symbol: '' },
    { label: 'Thick caesura', value: 7, symbol: '' },
    { label: 'Chant caesura', value: 8, symbol: '' },
]);

const ottavaItems = makePaletteItems('Ottavas', 'ottava', [
    { label: '8va', value: 0, symbol: '' },
    { label: '8vb', value: 1, symbol: '' },
    { label: '15ma', value: 2, symbol: '' },
    { label: '15mb', value: 3, symbol: '' },
    { label: '22ma', value: 4, symbol: '' },
    { label: '22mb', value: 5, symbol: '' },
]);

const trillItems = makePaletteItems('Trills', 'trill', [
    { label: 'Trill line', value: 0 },
    { label: 'Up-prall line', value: 1 },
    { label: 'Down-prall line', value: 2 },
    { label: 'Prall-prall line', value: 3 },
]);

const glissandoItems = makePaletteItems('Glissandos', 'glissando', [
    { label: 'Straight glissando', value: 0, symbol: '' },
    { label: 'Wavy glissando', value: 1, symbol: '' },
]);

const arpeggioItems = makePaletteItems('Arpeggios', 'arpeggio', [
    { label: 'Arpeggio', value: 0, symbol: '' },
    { label: 'Arpeggio up', value: 1, symbol: '' },
    { label: 'Arpeggio down', value: 2, symbol: '' },
    { label: 'Arpeggio bracket', value: 3, symbol: '' },
]);

const tremoloItems = makePaletteItems('Tremolos', 'tremolo', [
    { label: 'Eighth-note tremolo', value: 0, symbol: '' },
    { label: '16th-note tremolo', value: 1, symbol: '' },
    { label: '32nd-note tremolo', value: 2, symbol: '' },
    { label: '64th-note tremolo', value: 3, symbol: '' },
    { label: 'Buzz roll', value: 4, symbol: '' },
    { label: 'Two-note eighth tremolo', value: 5, symbol: '' },
    { label: 'Two-note 16th tremolo', value: 6, symbol: '' },
    { label: 'Two-note 32nd tremolo', value: 7, symbol: '' },
    { label: 'Two-note 64th tremolo', value: 8, symbol: '' },
]);

const noteheadItems = makePaletteItems('Noteheads', 'notehead', [
    { label: 'Normal', value: 0, symbol: '' },
    { label: 'Cross', value: 1, symbol: '' },
    { label: 'Diamond', value: 9, symbol: '' },
    { label: 'Triangle', value: 5, symbol: '' },
    { label: 'Slash', value: 15, symbol: '' },
]);

const beamItems = makePaletteItems('Beams', 'beam', [
    { label: 'Auto beam', value: 0 },
    { label: 'Begin beam / break left', value: 2 },
    { label: 'Join beams', value: 6 },
    { label: 'No beam', value: 1 },
    { label: 'Break secondary beam at eighth', value: 3 },
    { label: 'Break secondary beam at 16th', value: 4 },
]);

const barlineItems = makePaletteItems('Barlines', 'barline', barlineOptions.map(option => ({ label: `${option.label} barline`, value: option.value })));

const voltaItems = makePaletteItems('Voltas', 'volta', voltaOptions.map(option => ({ label: option.label, value: option.ending })));

const repeatItems: ScorePaletteItem[] = [
    { label: 'Start repeat', symbol: '', category: 'Repeats', kind: 'repeat-start', subtype: 0 },
    { label: 'End repeat', symbol: '', category: 'Repeats', kind: 'repeat-end', subtype: 0 },
    ...makePaletteItems('Repeats', 'repeat-count', repeatCountOptions.map(option => ({ label: `Repeat ${option.label}`, value: option.count }))),
];

const markerItems = makePaletteItems('Markers', 'marker', [
    { label: 'Segno', value: 0, symbol: '' },
    { label: 'Coda', value: 2, symbol: '' },
    { label: 'Fine', value: 5, symbol: 'Fine' },
    { label: 'To Coda', value: 6, symbol: '' },
    { label: 'Serpent segno', value: 1, symbol: '' },
    { label: 'Square coda', value: 3, symbol: '' },
    { label: 'To Coda symbol', value: 7, symbol: '' },
]);

const jumpItems = makePaletteItems('Jumps', 'jump', [
    { label: 'D.C.', value: 0 },
    { label: 'D.C. al Fine', value: 1 },
    { label: 'D.C. al Coda', value: 2 },
    { label: 'D.S. al Coda', value: 3 },
    { label: 'D.S. al Fine', value: 4 },
    { label: 'D.S.', value: 5 },
    { label: 'D.C. al Double Coda', value: 6 },
    { label: 'D.S. al Double Coda', value: 7 },
    { label: 'Dal Segno Segno', value: 8 },
    { label: 'D.S.S. al Coda', value: 9 },
    { label: 'D.S.S. al Double Coda', value: 10 },
    { label: 'D.S.S. al Fine', value: 11 },
    { label: 'Da Coda', value: 12 },
    { label: 'Da Double Coda', value: 13 },
]);

// Order controls how categories appear in the full palette.
export const scorePaletteItems: ScorePaletteItem[] = [
    ...clefItems,
    ...keySignatureItems,
    ...timeSignatureItems,
    ...accidentalItems,
    ...graceNoteItems,
    ...dynamicItems,
    ...hairpinItems,
    ...pedalItems,
    ...articulationItems,
    ...fermataItems,
    ...breathItems,
    ...ottavaItems,
    ...trillItems,
    ...glissandoItems,
    ...arpeggioItems,
    ...tremoloItems,
    ...noteheadItems,
    ...beamItems,
    ...barlineItems,
    ...voltaItems,
    ...repeatItems,
    ...markerItems,
    ...jumpItems,
];

export const dynamicScorePaletteItem = (label: string, symbol: string, subtype: number): ScorePaletteItem => ({
    label: `${label} dynamic`,
    symbol,
    category: 'Dynamics',
    kind: 'dynamic',
    elementType: 1,
    subtype,
});

export const clefScorePaletteItem = (label: string, subtype: number): ScorePaletteItem => ({
    label: `${label} clef`,
    symbol: clefPaletteGlyph(subtype),
    category: 'Clefs',
    kind: 'clef',
    elementType: 0,
    subtype,
});

export const articulationScorePaletteItem = (label: string, subtype: number): ScorePaletteItem => ({
    label,
    symbol: '',
    category: 'Articulations',
    kind: 'articulation',
    elementType: 2,
    subtype,
});

export const parseScorePaletteItem = (raw: string): ScorePaletteItem | null => {
    try {
        const value = JSON.parse(raw) as Partial<ScorePaletteItem>;
        const match = scorePaletteItems.find(item => item.elementType === value.elementType && item.subtype === value.subtype && value.elementType !== undefined);
        if (match) {
            return match;
        }
        if (value.elementType === 0) {
            const clef = clefButtonOptionsDefault.find(option => option.value === value.subtype);
            if (clef) {
                return clefScorePaletteItem(clef.label, clef.value);
            }
        }
        if (value.elementType === 1) {
            const dynamic = dynamicOptions.find(option => option.value === value.subtype);
            if (dynamic) {
                return dynamicScorePaletteItem(dynamic.label, typeof value.symbol === 'string' ? value.symbol : '', dynamic.value);
            }
        }
        if (value.elementType === 2 && typeof value.subtype === 'number') {
            const articulation = articulationOptions[value.subtype];
            if (articulation) {
                return articulationScorePaletteItem(articulation.label, value.subtype);
            }
        }
        return null;
    } catch {
        return null;
    }
};
