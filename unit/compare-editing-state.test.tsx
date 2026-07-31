import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useCompareEditing } from '../components/score-editor/compare/useCompareEditing';

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
