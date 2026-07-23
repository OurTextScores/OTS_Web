import { articulationOptions, clefButtonOptionsDefault, dynamicOptions } from './constants';

export const SCORE_PALETTE_DRAG_MIME = 'application/x-ots-score-palette+json';

export type ScorePaletteItem = {
    label: string;
    symbol: string;
    category: 'Clefs' | 'Dynamics' | 'Articulations';
    elementType: 0 | 1 | 2;
    subtype: number;
};

export const scorePaletteItems: ScorePaletteItem[] = [
    { label: 'Treble clef', symbol: '\uE050', category: 'Clefs', elementType: 0, subtype: 0 },
    { label: 'Bass clef', symbol: '\uE062', category: 'Clefs', elementType: 0, subtype: 20 },
    { label: 'Alto clef', symbol: '\uE05C', category: 'Clefs', elementType: 0, subtype: 10 },
    { label: 'Tenor clef', symbol: '\uE05C', category: 'Clefs', elementType: 0, subtype: 11 },
    { label: 'Piano dynamic', symbol: '\uE520', category: 'Dynamics', elementType: 1, subtype: 6 },
    { label: 'Mezzo piano dynamic', symbol: '\uE521\uE520', category: 'Dynamics', elementType: 1, subtype: 7 },
    { label: 'Mezzo forte dynamic', symbol: '\uE521\uE522', category: 'Dynamics', elementType: 1, subtype: 8 },
    { label: 'Forte dynamic', symbol: '\uE522', category: 'Dynamics', elementType: 1, subtype: 9 },
    { label: 'Pianissimo dynamic', symbol: '\uE520\uE520', category: 'Dynamics', elementType: 1, subtype: 5 },
    { label: 'Fortissimo dynamic', symbol: '\uE522\uE522', category: 'Dynamics', elementType: 1, subtype: 10 },
    { label: 'Sforzando dynamic', symbol: '\uE524\uE522\uE525', category: 'Dynamics', elementType: 1, subtype: 18 },
    { label: 'Staccato', symbol: '\uE4A2', category: 'Articulations', elementType: 2, subtype: 0 },
    { label: 'Tenuto', symbol: '\uE4A4', category: 'Articulations', elementType: 2, subtype: 1 },
    { label: 'Marcato', symbol: '\uE4AC', category: 'Articulations', elementType: 2, subtype: 2 },
    { label: 'Accent', symbol: '\uE4A0', category: 'Articulations', elementType: 2, subtype: 3 },
];

export const dynamicScorePaletteItem = (label: string, symbol: string, subtype: number): ScorePaletteItem => ({
    label: `${label} dynamic`,
    symbol,
    category: 'Dynamics',
    elementType: 1,
    subtype,
});

export const clefScorePaletteItem = (label: string, subtype: number): ScorePaletteItem => ({
    label: `${label} clef`,
    symbol: '',
    category: 'Clefs',
    elementType: 0,
    subtype,
});

export const articulationScorePaletteItem = (label: string, subtype: number): ScorePaletteItem => ({
    label,
    symbol: '',
    category: 'Articulations',
    elementType: 2,
    subtype,
});

export const parseScorePaletteItem = (raw: string): ScorePaletteItem | null => {
    try {
        const value = JSON.parse(raw) as Partial<ScorePaletteItem>;
        const match = scorePaletteItems.find(item => item.elementType === value.elementType && item.subtype === value.subtype);
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
