import { useCallback, useRef, useState } from 'react';
import type { CompareScoreRole } from '@/lib/compare-user-edit-diff';

type RoleRecord<T> = Record<CompareScoreRole, T>;

export type CompareEditCycleSnapshot = {
    baselines: RoleRecord<string | null>;
    editedRoles: CompareScoreRole[];
};

const emptyRoleRecord = <T,>(value: T): RoleRecord<T> => ({
    current: value,
    proposal: value,
});

export function useCompareEditing<TSelection, TCursor>() {
    const [busy, setBusy] = useState(false);
    const busyRef = useRef(false);
    const [editedRoles, setEditedRoles] = useState<CompareScoreRole[]>([]);
    const baselinesRef = useRef<RoleRecord<string | null>>(emptyRoleRecord(null));
    const [noteInputByRole, setNoteInputByRole] = useState<RoleRecord<boolean>>(emptyRoleRecord(false));
    const noteInputByRoleRef = useRef<RoleRecord<boolean>>(emptyRoleRecord(false));
    const noteInputDesiredByRoleRef = useRef<RoleRecord<boolean>>(emptyRoleRecord(false));
    const [noteInputCursorByRole, setNoteInputCursorByRole] = useState<RoleRecord<TCursor | null>>(emptyRoleRecord(null));
    const [hasSelectionByRole, setHasSelectionByRole] = useState<RoleRecord<boolean>>(emptyRoleRecord(false));
    const [selectionBoxesByRole, setSelectionBoxesByRole] = useState<RoleRecord<TSelection[]>>(emptyRoleRecord([]));

    const beginBusy = useCallback(() => {
        busyRef.current = true;
        setBusy(true);
    }, []);

    const endBusy = useCallback(() => {
        busyRef.current = false;
        setBusy(false);
    }, []);

    const isBusy = useCallback(() => busyRef.current, []);

    const recordEdit = useCallback((role: CompareScoreRole, beforeXml: string, afterXml: string) => {
        const baseline = baselinesRef.current[role] ?? beforeXml;
        if (afterXml === baseline) {
            baselinesRef.current = { ...baselinesRef.current, [role]: null };
            setEditedRoles((previous) => previous.filter((entry) => entry !== role));
            return;
        }
        baselinesRef.current = { ...baselinesRef.current, [role]: baseline };
        setEditedRoles((previous) => previous.includes(role) ? previous : [...previous, role]);
    }, []);

    const getBaseline = useCallback(
        (role: CompareScoreRole) => baselinesRef.current[role],
        [],
    );

    const captureEditCycle = useCallback((): CompareEditCycleSnapshot => ({
        baselines: { ...baselinesRef.current },
        editedRoles: [...editedRoles],
    }), [editedRoles]);

    const clearEditCycle = useCallback(() => {
        baselinesRef.current = emptyRoleRecord(null);
        setEditedRoles([]);
    }, []);

    const restoreEditCycle = useCallback((snapshot: CompareEditCycleSnapshot) => {
        baselinesRef.current = { ...snapshot.baselines };
        setEditedRoles([...snapshot.editedRoles]);
    }, []);

    const requestNoteInput = useCallback((role: CompareScoreRole, enabled: boolean) => {
        noteInputDesiredByRoleRef.current = {
            ...noteInputDesiredByRoleRef.current,
            [role]: enabled,
        };
    }, []);

    const commitNoteInput = useCallback((role: CompareScoreRole, enabled: boolean) => {
        noteInputByRoleRef.current = { ...noteInputByRoleRef.current, [role]: enabled };
        noteInputDesiredByRoleRef.current = {
            ...noteInputDesiredByRoleRef.current,
            [role]: enabled,
        };
        setNoteInputByRole(noteInputByRoleRef.current);
        if (!enabled) {
            setNoteInputCursorByRole((previous) => ({ ...previous, [role]: null }));
        }
    }, []);

    const rollbackNoteInputRequest = useCallback((role: CompareScoreRole) => {
        noteInputDesiredByRoleRef.current = {
            ...noteInputDesiredByRoleRef.current,
            [role]: noteInputByRoleRef.current[role],
        };
    }, []);

    const isNoteInputCommitted = useCallback(
        (role: CompareScoreRole) => noteInputByRoleRef.current[role],
        [],
    );

    const isNoteInputDesired = useCallback(
        (role: CompareScoreRole) => noteInputDesiredByRoleRef.current[role],
        [],
    );

    const setNoteInputCursor = useCallback((role: CompareScoreRole, cursor: TCursor | null) => {
        setNoteInputCursorByRole((previous) => ({ ...previous, [role]: cursor }));
    }, []);

    const setSelection = useCallback((
        role: CompareScoreRole,
        boxes: TSelection[],
        selected = boxes.length > 0,
    ) => {
        setSelectionBoxesByRole((previous) => ({ ...previous, [role]: boxes }));
        setHasSelectionByRole((previous) => ({ ...previous, [role]: selected }));
    }, []);

    const setHasSelection = useCallback((role: CompareScoreRole, selected: boolean) => {
        setHasSelectionByRole((previous) => ({ ...previous, [role]: selected }));
    }, []);

    const resetRole = useCallback((role: CompareScoreRole) => {
        noteInputByRoleRef.current = { ...noteInputByRoleRef.current, [role]: false };
        noteInputDesiredByRoleRef.current = { ...noteInputDesiredByRoleRef.current, [role]: false };
        setNoteInputByRole(noteInputByRoleRef.current);
        setNoteInputCursorByRole((previous) => ({ ...previous, [role]: null }));
        setSelectionBoxesByRole((previous) => ({ ...previous, [role]: [] }));
        setHasSelectionByRole((previous) => ({ ...previous, [role]: false }));
    }, []);

    const resetAll = useCallback(() => {
        busyRef.current = false;
        setBusy(false);
        baselinesRef.current = emptyRoleRecord(null);
        setEditedRoles([]);
        noteInputByRoleRef.current = emptyRoleRecord(false);
        noteInputDesiredByRoleRef.current = emptyRoleRecord(false);
        setNoteInputByRole(emptyRoleRecord(false));
        setNoteInputCursorByRole(emptyRoleRecord(null));
        setHasSelectionByRole(emptyRoleRecord(false));
        setSelectionBoxesByRole(emptyRoleRecord([]));
    }, []);

    return {
        state: {
            busy,
            editedRoles,
            noteInputByRole,
            noteInputCursorByRole,
            hasSelectionByRole,
            selectionBoxesByRole,
        },
        beginBusy,
        captureEditCycle,
        clearEditCycle,
        commitNoteInput,
        endBusy,
        getBaseline,
        isBusy,
        isNoteInputCommitted,
        isNoteInputDesired,
        recordEdit,
        requestNoteInput,
        resetAll,
        resetRole,
        restoreEditCycle,
        rollbackNoteInputRequest,
        setHasSelection,
        setNoteInputCursor,
        setSelection,
    };
}
