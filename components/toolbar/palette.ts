import { articulationOptions, clefButtonOptionsDefault, dynamicOptions } from './constants';

export const SCORE_PALETTE_DRAG_MIME = 'application/x-ots-score-palette+json';

export type PaletteCategory =
    | 'Clefs'
    | 'Dynamics'
    | 'Articulations'
    | 'Ottavas'
    | 'Fermatas'
    | 'Breaths'
    | 'Tremolos'
    | 'Markers'
    | 'Jumps';

// Discriminates which editor action a palette item performs when applied.
export type PaletteKind =
    | 'clef'
    | 'dynamic'
    | 'articulation'
    | 'ottava'
    | 'fermata'
    | 'breath'
    | 'tremolo'
    | 'marker'
    | 'jump';

export type ScorePaletteItem = {
    label: string;
    symbol: string;
    category: PaletteCategory;
    kind: PaletteKind;
    subtype: number;
    // Present only for kinds that support drag-and-drop onto the score
    // (the engine's applyDropAtPoint currently covers clefs/dynamics/articulations).
    elementType?: 0 | 1 | 2;
};

// SMuFL glyph for a clef type (mirrors the dropdown's clef rendering).
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

// Every clef, generated from the shared clef list, for the full Clef palette.
const clefPaletteItems: ScorePaletteItem[] = clefButtonOptionsDefault.map(option => ({
    label: `${option.label} clef`,
    symbol: clefPaletteGlyph(option.value),
    category: 'Clefs',
    kind: 'clef',
    subtype: option.value,
    elementType: 0,
}));

const dynamicPaletteItems: ScorePaletteItem[] = [
    { label: 'Piano dynamic', symbol: '', subtype: 6 },
    { label: 'Mezzo piano dynamic', symbol: '', subtype: 7 },
    { label: 'Mezzo forte dynamic', symbol: '', subtype: 8 },
    { label: 'Forte dynamic', symbol: '', subtype: 9 },
    { label: 'Pianissimo dynamic', symbol: '', subtype: 5 },
    { label: 'Fortissimo dynamic', symbol: '', subtype: 10 },
    { label: 'Sforzando dynamic', symbol: '', subtype: 18 },
].map(item => ({ ...item, category: 'Dynamics', kind: 'dynamic', elementType: 1 }));

const articulationPaletteItems: ScorePaletteItem[] = [
    { label: 'Staccato', symbol: '', subtype: 0 },
    { label: 'Tenuto', symbol: '', subtype: 1 },
    { label: 'Marcato', symbol: '', subtype: 2 },
    { label: 'Accent', symbol: '', subtype: 3 },
].map(item => ({ ...item, category: 'Articulations', kind: 'articulation', elementType: 2 }));

// Click-to-apply categories (no drag/drop support in the engine yet).
const makePaletteItems = (
    category: PaletteCategory,
    kind: PaletteKind,
    options: ReadonlyArray<{ label: string; value: number; symbol?: string }>,
): ScorePaletteItem[] => options.map(option => ({
    label: option.label,
    symbol: option.symbol ?? '',
    category,
    kind,
    subtype: option.value,
}));

const ottavaPaletteItems = makePaletteItems('Ottavas', 'ottava', [
    { label: '8va', value: 0, symbol: '' },
    { label: '8vb', value: 1, symbol: '' },
    { label: '15ma', value: 2, symbol: '' },
    { label: '15mb', value: 3, symbol: '' },
    { label: '22ma', value: 4, symbol: '' },
    { label: '22mb', value: 5, symbol: '' },
]);

const fermataPaletteItems = makePaletteItems('Fermatas', 'fermata', [
    { label: 'Fermata', value: 0, symbol: '' },
    { label: 'Short fermata', value: 1, symbol: '' },
    { label: 'Long fermata', value: 2, symbol: '' },
    { label: 'Very short fermata', value: 3, symbol: '' },
    { label: 'Very long fermata', value: 4, symbol: '' },
]);

const breathPaletteItems = makePaletteItems('Breaths', 'breath', [
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

const tremoloPaletteItems = makePaletteItems('Tremolos', 'tremolo', [
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

const markerPaletteItems = makePaletteItems('Markers', 'marker', [
    { label: 'Segno', value: 0, symbol: '' },
    { label: 'Coda', value: 2, symbol: '' },
    { label: 'Fine', value: 5, symbol: 'Fine' },
    { label: 'To Coda', value: 6, symbol: '' },
    { label: 'Serpent segno', value: 1, symbol: '' },
    { label: 'Square coda', value: 3, symbol: '' },
    { label: 'To Coda symbol', value: 7, symbol: '' },
]);

const jumpPaletteItems = makePaletteItems('Jumps', 'jump', [
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

export const scorePaletteItems: ScorePaletteItem[] = [
    ...clefPaletteItems,
    ...dynamicPaletteItems,
    ...articulationPaletteItems,
    ...ottavaPaletteItems,
    ...fermataPaletteItems,
    ...breathPaletteItems,
    ...tremoloPaletteItems,
    ...markerPaletteItems,
    ...jumpPaletteItems,
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
