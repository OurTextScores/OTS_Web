/**
 * Reads the engine's current selection as a clipboard payload.
 *
 * The ordering here is the whole point. `selectionMimeType()` and `selectionMimeData()`
 * are separate round-trips to the worker, and both must be *issued* before the caller
 * yields for anything else: the worker handles them in order, so they then describe the
 * selection as it was when the user pressed Ctrl+C. Awaiting anything first -- projecting
 * the UI selection into the engine, or even just the type before requesting the data --
 * lets the user's next click reach the engine in between, and the copy captures whatever
 * is selected by then. That produced a torn pair in practice: the mime of a two-note range
 * with the byte count of the single note clicked afterwards, which the engine accepts and
 * a later paste silently discards.
 */
export type SelectionClipboardPayload = {
    mimeType: string;
    data: Uint8Array;
};

export type SelectionReader = () => Promise<string> | string;
export type SelectionDataReader = () => Promise<Uint8Array> | Uint8Array;

export async function readSelectionPayload(
    getType: SelectionReader,
    getData: SelectionDataReader,
): Promise<SelectionClipboardPayload | null> {
    const mimeType = await getType();
    const data = await getData();
    if (!mimeType || !data || data.length === 0) {
        return null;
    }
    // Detach from the engine's buffer before it is stored: `selectionMimeData()` hands
    // back a view into the WASM heap, which the next operation can reuse or free.
    return {
        mimeType,
        data: data instanceof Uint8Array ? data.slice() : new Uint8Array(data),
    };
}

/**
 * Reads the current selection and stores it, projecting the UI selection into the engine
 * only if the engine reports nothing selected. Returns whether anything was stored.
 */
export async function copySelectionToClipboard(options: {
    getType: SelectionReader | null;
    getData: SelectionDataReader | null;
    ensureSelection: () => Promise<void>;
    store: (payload: SelectionClipboardPayload) => void;
}): Promise<boolean> {
    const { getType, getData, ensureSelection, store } = options;
    if (!getType || !getData) {
        return false;
    }
    let payload = await readSelectionPayload(getType, getData);
    if (!payload) {
        await ensureSelection();
        payload = await readSelectionPayload(getType, getData);
    }
    if (!payload) {
        return false;
    }
    store(payload);
    return true;
}
