import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
    routeCompareKeyboardShortcut,
    useCompareEditing,
    type CompareKeyboardShortcutContext,
} from '../components/score-editor/compare/useCompareEditing';

type Box = { x: number };
type Cursor = { voice: number };

describe('useCompareEditing', () => {
    it('keeps selection and note input owned by score role', () => {
        const { result } = renderHook(() => useCompareEditing<Box, Cursor>());

        act(() => {
            result.current.setSelection('proposal', [{ x: 12 }]);
            result.current.requestNoteInput('proposal', true);
            result.current.commitNoteInput('proposal', true);
            result.current.setNoteInputCursor('proposal', { voice: 2 });
        });

        expect(result.current.state.selectionBoxesByRole).toEqual({
            current: [],
            proposal: [{ x: 12 }],
        });
        expect(result.current.state.noteInputByRole).toEqual({
            current: false,
            proposal: true,
        });
        expect(result.current.state.noteInputCursorByRole.proposal).toEqual({ voice: 2 });

        act(() => result.current.resetRole('proposal'));

        expect(result.current.state.hasSelectionByRole.proposal).toBe(false);
        expect(result.current.state.noteInputByRole.proposal).toBe(false);
        expect(result.current.state.noteInputCursorByRole.proposal).toBeNull();
        expect(result.current.state.noteInputByRole.current).toBe(false);
    });

    it('captures the first baseline and clears manual edits after undo to baseline', () => {
        const { result } = renderHook(() => useCompareEditing<Box, Cursor>());

        act(() => result.current.recordEdit('proposal', '<before/>', '<edit-1/>'));
        act(() => result.current.recordEdit('proposal', '<edit-1/>', '<edit-2/>'));

        expect(result.current.getBaseline('proposal')).toBe('<before/>');
        expect(result.current.state.editedRoles).toEqual(['proposal']);

        act(() => result.current.recordEdit('proposal', '<edit-2/>', '<before/>'));

        expect(result.current.getBaseline('proposal')).toBeNull();
        expect(result.current.state.editedRoles).toEqual([]);
    });

    it('restores a failed feedback cycle and clears a successful one', () => {
        const { result } = renderHook(() => useCompareEditing<Box, Cursor>());

        act(() => result.current.recordEdit('current', '<base/>', '<edited/>'));
        const snapshot = result.current.captureEditCycle();

        act(() => result.current.clearEditCycle());
        expect(result.current.state.editedRoles).toEqual([]);

        act(() => result.current.restoreEditCycle(snapshot));
        expect(result.current.state.editedRoles).toEqual(['current']);
        expect(result.current.getBaseline('current')).toBe('<base/>');

        act(() => result.current.clearEditCycle());
        expect(result.current.getBaseline('current')).toBeNull();
    });
});

const keyboardContext = (
    overrides: Partial<CompareKeyboardShortcutContext> = {},
): CompareKeyboardShortcutContext => ({
    active: true,
    activeRole: 'proposal',
    hasSelection: false,
    noteMode: false,
    mutate: vi.fn(),
    updateInputState: vi.fn(),
    copySelection: vi.fn(),
    pasteSelection: vi.fn(),
    disableNoteInput: vi.fn(),
    toggleNoteInput: vi.fn(),
    setHasSelection: vi.fn(),
    ...overrides,
});

describe('routeCompareKeyboardShortcut', () => {
    it('does not route anything without an explicitly active score role', () => {
        const context = keyboardContext({ active: false, activeRole: null });
        const event = new KeyboardEvent('keydown', { key: 'c', cancelable: true });

        expect(routeCompareKeyboardShortcut(event, context)).toBe(false);
        expect(context.mutate).not.toHaveBeenCalled();
    });

    it('routes pitch entry in note-input mode without a prior selection', () => {
        const context = keyboardContext({ noteMode: true });
        const event = new KeyboardEvent('keydown', { key: 'g', cancelable: true });

        expect(routeCompareKeyboardShortcut(event, context)).toBe(true);
        expect(context.mutate).toHaveBeenCalledWith('add a pitch', 'addPitchByStep', [4, false, false]);
        expect(event.defaultPrevented).toBe(true);
    });

    it('routes clipboard shortcuts and role-owned selection state', () => {
        const context = keyboardContext({ hasSelection: true });

        routeCompareKeyboardShortcut(new KeyboardEvent('keydown', { key: 'c', ctrlKey: true }), context);
        routeCompareKeyboardShortcut(new KeyboardEvent('keydown', { key: 'v', ctrlKey: true }), context);
        routeCompareKeyboardShortcut(new KeyboardEvent('keydown', { key: 'Delete' }), context);

        expect(context.copySelection).toHaveBeenCalledOnce();
        expect(context.pasteSelection).toHaveBeenCalledOnce();
        expect(context.mutate).toHaveBeenLastCalledWith('delete selection', 'deleteSelection');
        expect(context.setHasSelection).toHaveBeenCalledWith('proposal', false);
    });
});
