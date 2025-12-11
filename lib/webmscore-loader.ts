import WebMscore from 'webmscore';
import { InputFileFormat, Positions } from 'webmscore/schemas';

export type { InputFileFormat, Positions };

export interface Score {
    destroy: () => void;
    saveSvg: (pageNumber?: number, drawPageBackground?: boolean) => Promise<string>;
    savePdf: () => Promise<Uint8Array>;
    saveMxl?: () => Promise<Uint8Array>;
    saveMsc?: (format?: 'mscz' | 'mscx') => Promise<Uint8Array>;
    saveMidi?: (midiExpandRepeats?: boolean, exportRPNs?: boolean) => Promise<Uint8Array>;
    saveAudio?: (format: 'wav' | 'ogg' | 'flac' | 'mp3') => Promise<Uint8Array>;
    savePng?: (pageNumber?: number, drawPageBackground?: boolean, transparent?: boolean) => Promise<Uint8Array>;
    setSoundFont: (data: Uint8Array) => Promise<void>;
    metadata: () => Promise<Record<string, unknown>>;
    measurePositions: () => Promise<Positions>;
    segmentPositions: () => Promise<Positions>;
    /**
     * Optional mutation/undo surface exposed by custom webmscore builds.
     * These methods may be undefined if the WASM bindings were not compiled with mutation support.
     */
    selectElementAtPoint?: (pageNumber: number, x: number, y: number) => Promise<unknown> | unknown;
    deleteSelection?: () => Promise<unknown> | unknown;
    pitchUp?: () => Promise<unknown> | unknown;
    pitchDown?: () => Promise<unknown> | unknown;
    doubleDuration?: () => Promise<unknown> | unknown;
    halfDuration?: () => Promise<unknown> | unknown;
    toggleDot?: () => Promise<unknown> | unknown;
    toggleDoubleDot?: () => Promise<unknown> | unknown;
    setVoice?: (voiceIndex: number) => Promise<unknown> | unknown;
    undo?: () => Promise<unknown> | unknown;
    redo?: () => Promise<unknown> | unknown;
    relayout?: () => Promise<unknown> | unknown;
    setTimeSignature?: (numerator: number, denominator: number) => Promise<unknown> | unknown;
    setClef?: (clefType: number) => Promise<unknown> | unknown;
    addDynamic?: (dynamicType: number) => Promise<unknown> | unknown;
    addRehearsalMark?: () => Promise<unknown> | unknown;
    addTempoText?: (bpm: number) => Promise<unknown> | unknown;
}

export interface WebMscoreInstance {
    load: (format: InputFileFormat, data: Uint8Array, fonts?: Uint8Array[], doLayout?: boolean) => Promise<Score>;
    ready: Promise<void>;
}

let initialized = false;

export const loadWebMscore = async (): Promise<WebMscoreInstance> => {
    if (initialized) {
        return WebMscore as unknown as WebMscoreInstance;
    }

    await WebMscore.ready;
    initialized = true;
    return WebMscore as unknown as WebMscoreInstance;
};
