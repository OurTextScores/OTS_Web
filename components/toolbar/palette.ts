import { articulationOptions, clefButtonOptionsDefault, dynamicOptions } from './constants';

export const SCORE_PALETTE_DRAG_MIME = 'application/x-ots-score-palette+json';

export type ScorePaletteItem = {
    label: string;
    symbol: string;
    elementType: 0 | 1 | 2;
    subtype: number;
};

export const scorePaletteItems: ScorePaletteItem[] = [
    { label: 'Treble clef', symbol: '\uE050', elementType: 0, subtype: 0 },
    { label: 'Bass clef', symbol: '\uE062', elementType: 0, subtype: 20 },
    { label: 'Piano dynamic', symbol: '\uE520', elementType: 1, subtype: 6 },
    { label: 'Forte dynamic', symbol: '\uE522', elementType: 1, subtype: 9 },
    { label: 'Staccato', symbol: '\uE4A2', elementType: 2, subtype: 0 },
    { label: 'Accent', symbol: '\uE4A0', elementType: 2, subtype: 3 },
];

export const dynamicScorePaletteItem = (label: string, symbol: string, subtype: number): ScorePaletteItem => ({
    label: `${label} dynamic`,
    symbol,
    elementType: 1,
    subtype,
});

export const clefScorePaletteItem = (label: string, subtype: number): ScorePaletteItem => ({
    label: `${label} clef`,
    symbol: '',
    elementType: 0,
    subtype,
});

export const articulationScorePaletteItem = (label: string, subtype: number): ScorePaletteItem => ({
    label,
    symbol: '',
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
