import { useCallback, useRef, useState } from 'react';
import type { CompareScoreRole } from '@/lib/compare-user-edit-diff';

type RoleRecord<T> = Record<CompareScoreRole, T>;

export type CompareKeyboardMutationMethod =
    | 'addPitchByStep'
    | 'addSlur'
    | 'addTie'
    | 'deleteSelection'
    | 'enterRest'
    | 'extendSelectionNextChord'
    | 'extendSelectionNextMeasure'
    | 'extendSelectionPrevChord'
    | 'extendSelectionPrevMeasure'
    | 'extendSelectionStaffAbove'
    | 'extendSelectionStaffBelow'
    | 'pitchDown'
    | 'pitchUp'
    | 'redo'
    | 'selectAll'
    | 'selectNextChord'
    | 'selectPrevChord'
    | 'setAccidental'
    | 'setDurationType'
    | 'toggleDot'
    | 'transpose'
    | 'undo';

export type CompareInputStateMethod =
    | 'setInputAccidentalType'
    | 'setInputDurationType'
    | 'toggleInputDot';

export type CompareKeyboardShortcutContext = {
    active: boolean;
    activeRole: CompareScoreRole | null;
    hasSelection: boolean;
    noteMode: boolean;
    mutate: (
        label: string,
        methodName: CompareKeyboardMutationMethod,
        args?: unknown[],
        skipRelayout?: boolean,
    ) => void;
    updateInputState: (methodName: CompareInputStateMethod, args?: unknown[]) => void;
    copySelection: () => void;
    pasteSelection: () => void;
    disableNoteInput: () => void;
    toggleNoteInput: () => void;
    setHasSelection: (role: CompareScoreRole, selected: boolean) => void;
};

const durationTypeByKey: Record<string, number> = {
    '1': 8,
    '2': 7,
    '3': 6,
    '4': 5,
    '5': 4,
    '6': 3,
    '7': 2,
    '8': 1,
};

const noteStepByKey: Record<string, number> = {
    c: 0,
    d: 1,
    e: 2,
    f: 3,
    g: 4,
    a: 5,
    b: 6,
};

export function routeCompareKeyboardShortcut(
    event: KeyboardEvent,
    context: CompareKeyboardShortcutContext,
) {
    if (!context.active || !context.activeRole) {
        return false;
    }
    const rawKey = event.key;
    const key = rawKey.toLowerCase();
    const isMod = event.ctrlKey || event.metaKey;

    if (isMod) {
        if (key === 'z') {
            event.preventDefault();
            context.mutate(event.shiftKey ? 'redo' : 'undo', event.shiftKey ? 'redo' : 'undo');
            return true;
        }
        if (key === 'y') {
            event.preventDefault();
            context.mutate('redo', 'redo');
            return true;
        }
        if (key === 'a') {
            event.preventDefault();
            context.mutate('select all', 'selectAll', [], true);
            context.setHasSelection(context.activeRole, true);
            return true;
        }
        if (key === 'c') {
            event.preventDefault();
            context.copySelection();
            return true;
        }
        if (key === 'v') {
            event.preventDefault();
            context.pasteSelection();
            return true;
        }
    }

    if (key === 'escape' && context.noteMode) {
        event.preventDefault();
        context.disableNoteInput();
        return true;
    }
    if (!isMod && key === 'n' && !event.altKey && !event.shiftKey) {
        event.preventDefault();
        context.toggleNoteInput();
        return true;
    }
    if (context.noteMode && rawKey in durationTypeByKey) {
        event.preventDefault();
        context.updateInputState('setInputDurationType', [durationTypeByKey[rawKey]]);
        return true;
    }
    if (context.noteMode && rawKey === '.') {
        event.preventDefault();
        context.updateInputState('toggleInputDot');
        return true;
    }
    if (context.noteMode && (rawKey === '+' || rawKey === '-' || rawKey === '=')) {
        event.preventDefault();
        context.updateInputState('setInputAccidentalType', [rawKey === '+' ? 3 : rawKey === '-' ? 1 : 2]);
        return true;
    }
    if (context.noteMode && rawKey === '0') {
        event.preventDefault();
        context.mutate('enter a rest', 'enterRest');
        return true;
    }
    if (context.noteMode && !isMod && !event.altKey && key in noteStepByKey) {
        event.preventDefault();
        context.mutate('add a pitch', 'addPitchByStep', [noteStepByKey[key], event.shiftKey, false]);
        return true;
    }
    if (!context.hasSelection) {
        return false;
    }
    if (rawKey in durationTypeByKey) {
        event.preventDefault();
        context.mutate('set duration', 'setDurationType', [durationTypeByKey[rawKey]]);
        return true;
    }
    if (rawKey === '0') {
        event.preventDefault();
        context.mutate('enter a rest', 'enterRest');
        return true;
    }
    if (rawKey === '.') {
        event.preventDefault();
        context.mutate('toggle dot', 'toggleDot');
        return true;
    }
    if (rawKey === '+' || rawKey === '-' || rawKey === '=') {
        event.preventDefault();
        context.mutate('set accidental', 'setAccidental', [rawKey === '+' ? 3 : rawKey === '-' ? 1 : 2]);
        return true;
    }
    if (rawKey === 'T') {
        event.preventDefault();
        context.mutate('add a tie', 'addTie');
        return true;
    }
    if (!event.altKey && key === 's' && !event.shiftKey && !context.noteMode) {
        event.preventDefault();
        context.mutate('add a slur', 'addSlur');
        return true;
    }
    if (!isMod && !event.altKey && key in noteStepByKey) {
        event.preventDefault();
        context.mutate('add a pitch', 'addPitchByStep', [noteStepByKey[key], event.shiftKey, false]);
        return true;
    }
    if (key === 'arrowup' || key === 'arrowdown') {
        event.preventDefault();
        if (event.shiftKey) {
            context.mutate(
                `extend selection ${key === 'arrowup' ? 'up' : 'down'}`,
                key === 'arrowup' ? 'extendSelectionStaffAbove' : 'extendSelectionStaffBelow',
                [],
                true,
            );
        } else if (isMod) {
            context.mutate('transpose an octave', 'transpose', [key === 'arrowup' ? 12 : -12]);
        } else {
            context.mutate(key === 'arrowup' ? 'raise pitch' : 'lower pitch', key === 'arrowup' ? 'pitchUp' : 'pitchDown');
        }
        return true;
    }
    if (key === 'arrowleft' || key === 'arrowright') {
        event.preventDefault();
        const forward = key === 'arrowright';
        const methodName = event.shiftKey
            ? (isMod
                ? (forward ? 'extendSelectionNextMeasure' : 'extendSelectionPrevMeasure')
                : (forward ? 'extendSelectionNextChord' : 'extendSelectionPrevChord'))
            : (forward ? 'selectNextChord' : 'selectPrevChord');
        context.mutate('move compare selection', methodName, [], true);
        return true;
    }
    if (key === 'delete' || key === 'backspace') {
        event.preventDefault();
        context.mutate('delete selection', 'deleteSelection');
        context.setHasSelection(context.activeRole, false);
        return true;
    }
    return false;
}

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
