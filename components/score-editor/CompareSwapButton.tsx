type CompareSwapButtonProps = {
    busy: boolean;
    onSwap: () => void;
};

export function CompareSwapButton({ busy, onSwap }: CompareSwapButtonProps) {
    return (
        <div className="flex flex-none justify-center">
            <button
                type="button"
                data-testid="btn-compare-swap-sides"
                onClick={onSwap}
                disabled={busy}
                className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                aria-label="Swap sides"
            >
                ⇄ Swap sides
            </button>
        </div>
    );
}
