import WebMscore from 'webmscore';
import { InputFileFormat } from 'webmscore/schemas';

export type { InputFileFormat };

export interface Score {
    destroy: () => void;
    saveSvg: (pageNumber?: number, drawPageBackground?: boolean) => Promise<string>;
    savePdf: () => Promise<Uint8Array>;
    setSoundFont: (data: Uint8Array) => Promise<void>;
    metadata: () => Promise<any>;
}

export interface WebMscoreInstance {
    load: (format: InputFileFormat, data: Uint8Array, fonts?: any[], doLayout?: boolean) => Promise<Score>;
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
