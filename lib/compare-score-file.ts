import { detectScoreInputFormat } from './public-score-url';
import {
    loadWebMscore,
    loadWebMscoreInProcess,
    type Score,
} from './webmscore-loader';

const decodeSavedXml = async (value: unknown): Promise<string> => {
    if (typeof value === 'string') {
        return value;
    }
    if (value instanceof Uint8Array) {
        return new TextDecoder().decode(value);
    }
    if (value instanceof ArrayBuffer) {
        return new TextDecoder().decode(new Uint8Array(value));
    }
    if (ArrayBuffer.isView(value)) {
        return new TextDecoder().decode(
            new Uint8Array(value.buffer, value.byteOffset, value.byteLength),
        );
    }
    if (value instanceof Blob) {
        return value.text();
    }
    throw new Error('The score engine returned an unsupported MusicXML payload.');
};

/** Load any editor-supported score file and return a MusicXML snapshot for comparison. */
export async function loadCompareScoreMusicXml(file: File): Promise<string> {
    const data = new Uint8Array(await file.arrayBuffer());
    const format = detectScoreInputFormat(file.name, data);

    if (format === 'musicxml' || format === 'xml') {
        const xml = new TextDecoder().decode(data);
        if (!xml.trim()) {
            throw new Error(`${file.name} is empty.`);
        }
        return xml;
    }

    let loadedScore: Score | null = null;
    try {
        try {
            const webMscore = await loadWebMscore();
            loadedScore = await webMscore.load(format, data.slice(), [], false);
        } catch (workerError) {
            console.warn('Worker score conversion failed, retrying in-process.', workerError);
            const webMscore = await loadWebMscoreInProcess();
            loadedScore = await webMscore.load(format, data.slice(), [], false);
        }

        if (!loadedScore.saveXml) {
            throw new Error('This score engine cannot convert the selected file to MusicXML.');
        }
        const xml = await decodeSavedXml(await loadedScore.saveXml());
        if (!xml.trim()) {
            throw new Error(`Could not read MusicXML from ${file.name}.`);
        }
        return xml;
    } finally {
        loadedScore?.destroy();
    }
}
