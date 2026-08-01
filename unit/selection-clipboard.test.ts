import { describe, expect, it, vi } from 'vitest';
import { copySelectionToClipboard, readSelectionPayload } from '../lib/selection-clipboard';

describe('readSelectionPayload', () => {
    it('issues both reads before awaiting either', async () => {
        // The ordering this module exists for. Awaiting the type before requesting the
        // data lets the user's next click reach the engine in between, and the copy then
        // describes one selection with the bytes of another.
        const order: string[] = [];
        const getType = vi.fn(() => {
            order.push('type:issued');
            return Promise.resolve('application/musescore/stafflist');
        });
        const getData = vi.fn(() => {
            order.push('data:issued');
            return Promise.resolve(new Uint8Array([1, 2, 3]));
        });

        await readSelectionPayload(getType, getData);

        expect(order).toEqual(['type:issued', 'data:issued']);
    });

    it('detaches the bytes from the engine buffer', async () => {
        const engineHeap = new Uint8Array([1, 2, 3, 4]);
        const payload = await readSelectionPayload(
            () => 'application/musescore/symbol',
            () => engineHeap,
        );

        expect(payload?.data).toEqual(engineHeap);
        // A retained view would paste whatever later reused that region.
        expect(payload?.data).not.toBe(engineHeap);
        engineHeap.fill(0);
        expect(Array.from(payload!.data)).toEqual([1, 2, 3, 4]);
    });

    it('reports nothing for an empty selection', async () => {
        expect(await readSelectionPayload(() => '', () => new Uint8Array([1]))).toBeNull();
        expect(await readSelectionPayload(() => 'x', () => new Uint8Array())).toBeNull();
    });
});

describe('copySelectionToClipboard', () => {
    const payloadReaders = () => ({
        getType: vi.fn(() => Promise.resolve('application/musescore/stafflist')),
        getData: vi.fn(() => Promise.resolve(new Uint8Array([9, 9]))),
    });

    it('stores what the engine already has, without projecting the UI selection', async () => {
        const { getType, getData } = payloadReaders();
        const ensureSelection = vi.fn(async () => {});
        const store = vi.fn();

        expect(await copySelectionToClipboard({ getType, getData, ensureSelection, store })).toBe(true);
        expect(store).toHaveBeenCalledWith({
            mimeType: 'application/musescore/stafflist',
            data: new Uint8Array([9, 9]),
        });
        // Projecting would collapse a range the engine is already holding.
        expect(ensureSelection).not.toHaveBeenCalled();
    });

    it('projects the UI selection and retries only when the engine has nothing', async () => {
        let selected = false;
        const ensureSelection = vi.fn(async () => { selected = true; });
        const store = vi.fn();

        const ok = await copySelectionToClipboard({
            getType: () => (selected ? 'application/musescore/symbol' : ''),
            getData: () => new Uint8Array([7]),
            ensureSelection,
            store,
        });

        expect(ok).toBe(true);
        expect(ensureSelection).toHaveBeenCalledTimes(1);
        expect(store).toHaveBeenCalledWith({
            mimeType: 'application/musescore/symbol',
            data: new Uint8Array([7]),
        });
    });

    it('stores nothing when there is still no selection after projecting', async () => {
        const store = vi.fn();

        const ok = await copySelectionToClipboard({
            getType: () => '',
            getData: () => new Uint8Array([1]),
            ensureSelection: async () => {},
            store,
        });

        expect(ok).toBe(false);
        expect(store).not.toHaveBeenCalled();
    });

    it('reports failure when the build lacks the bindings', async () => {
        const store = vi.fn();

        expect(await copySelectionToClipboard({
            getType: null,
            getData: null,
            ensureSelection: async () => {},
            store,
        })).toBe(false);
        expect(store).not.toHaveBeenCalled();
    });
});
