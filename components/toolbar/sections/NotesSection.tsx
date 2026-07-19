import React from 'react';
import { Button } from '../../ui/Button';
import { DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenu } from '../../ui/DropdownMenu';
import { ToolbarSectionProps } from '../types';
import { graceNoteOptions } from '../constants';
import { Music2, PenLine, Speech, Spline } from 'lucide-react';

export const NotesSection: React.FC<ToolbarSectionProps> = ({
    onAddGraceNote,
    onSetVoice,
    onAddSlur,
    onAddTie,
    onToggleNoteInput,
    noteInputActive,
    noteInputMethod,
    onSetNoteInputMethod,
    mutationsEnabled,
    selectionActive,
}) => {
    const mutationDisabled = !mutationsEnabled;

    return (
        <>
            <Button
                data-testid="btn-note-input"
                onClick={onToggleNoteInput}
                disabled={mutationDisabled || !onToggleNoteInput}
                variant={noteInputActive ? 'primary' : 'outline'}
                size="sm"
                className="shadow-sm"
                title="Note input mode (N) — click in the staff to place notes"
                aria-label="Toggle note input mode"
                aria-pressed={Boolean(noteInputActive)}
            >
                <PenLine size={14} className="mr-2" />
                Input
            </Button>

            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        data-testid="dropdown-note-input-method"
                        variant="outline"
                        size="sm"
                        disabled={mutationDisabled || !noteInputActive || !onSetNoteInputMethod}
                        className="shadow-sm"
                        title="Choose how note input changes the score"
                    >
                        {noteInputMethod === 2
                            ? 'Repitch'
                            : noteInputMethod === 3
                                ? 'Rhythm'
                                : noteInputMethod === 6
                                    ? 'Timewise'
                                    : 'Step-time'}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {[
                        { label: 'Step-time', value: 1 },
                        { label: 'Repitch', value: 2 },
                        { label: 'Rhythm', value: 3 },
                        { label: 'Timewise (insert)', value: 6 },
                    ].map(option => (
                        <DropdownMenuItem
                            key={option.value}
                            data-testid={`btn-note-input-method-${option.value}`}
                            onSelect={() => onSetNoteInputMethod?.(option.value)}
                        >
                            {option.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button data-testid="dropdown-grace-notes" variant="outline" size="sm" disabled={mutationDisabled} className="shadow-sm">
                        <Music2 size={14} className="mr-2" />
                        Grace Notes
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {graceNoteOptions.map(opt => (
                        <DropdownMenuItem key={opt.value} data-testid={opt.testId} disabled={mutationDisabled || !selectionActive || !onAddGraceNote} onSelect={() => onAddGraceNote?.(opt.value)}>
                            {opt.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button data-testid="dropdown-voice" variant="outline" size="sm" disabled={mutationDisabled} className="shadow-sm">
                        <Speech size={14} className="mr-2" />
                        Voice
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {[1, 2, 3, 4].map(v => (
                        <DropdownMenuItem key={v} data-testid={`btn-voice-${v}`} disabled={mutationDisabled || !onSetVoice} onSelect={() => onSetVoice?.(v - 1)}>
                            Voice {v}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button data-testid="dropdown-slur-tie" variant="outline" size="sm" disabled={mutationDisabled || !selectionActive} className="shadow-sm">
                        <Spline size={14} className="mr-2" />
                        Slur/Tie
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem data-testid="btn-slur" disabled={mutationDisabled || !selectionActive || !onAddSlur} onSelect={() => onAddSlur?.()}>Slur</DropdownMenuItem>
                    <DropdownMenuItem data-testid="btn-tie" disabled={mutationDisabled || !selectionActive || !onAddTie} onSelect={() => onAddTie?.()}>Tie</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
