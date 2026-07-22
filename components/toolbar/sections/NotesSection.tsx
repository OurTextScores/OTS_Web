import React from 'react';
import { Button } from '../../ui/Button';
import { DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenu, DropdownMenuLabel } from '../../ui/DropdownMenu';
import { ToolbarSectionProps } from '../types';
import { graceNoteOptions } from '../constants';
import { Music2, PenLine, Speech, Spline, Waves } from 'lucide-react';
import styles from './NotesSection.module.css';

const graceNoteGlyphs: Record<number, string> = {
    1: '\uE560',
    2: '\uE562',
    8: '\uE1D9',
    16: '\uE1DB',
    32: '\uE1D7',
    64: '\uE1D9',
    128: '\uE1DB',
};

const ottavaOptions = [
    { label: '8va', value: 0, symbol: '\uE511', common: true },
    { label: '8vb', value: 1, symbol: '\uE51C', common: true },
    { label: '15ma', value: 2, symbol: '\uE515', common: true },
    { label: '15mb', value: 3, symbol: '\uE51D', common: true },
    { label: '22ma', value: 4, symbol: '\uE518', common: false },
    { label: '22mb', value: 5, symbol: '\uE51E', common: false },
] as const;

const trillOptions = [
    { label: 'Trill line', value: 0 },
    { label: 'Up-prall line', value: 1 },
    { label: 'Down-prall line', value: 2 },
    { label: 'Prall-prall line', value: 3 },
] as const;

const glissandoOptions = [
    { label: 'Straight glissando', value: 0, symbol: '\uE585' },
    { label: 'Wavy glissando', value: 1, symbol: '\uEAAF' },
] as const;

export const NotesSection: React.FC<ToolbarSectionProps> = ({
    onAddGraceNote,
    onSetVoice,
    onAddSlur,
    onAddTie,
    onAddOttava,
    onAddTrill,
    onAddGlissando,
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
                        <DropdownMenuItem key={opt.value} data-testid={opt.testId} className="min-h-10 gap-3" disabled={mutationDisabled || !selectionActive || !onAddGraceNote} onSelect={() => onAddGraceNote?.(opt.value)}>
                            <span data-testid={`grace-symbol-${opt.value}`} className={styles.graceNoteSymbol} aria-hidden="true">
                                {graceNoteGlyphs[opt.value]}
                            </span>
                            <span>{opt.label}</span>
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

            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button data-testid="dropdown-lines" variant="outline" size="sm" disabled={mutationDisabled || !selectionActive} className="shadow-sm">
                        <Waves size={14} className="mr-2" />
                        Lines
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent data-testid="lines-menu" className="max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-y-auto">
                    <DropdownMenuLabel>Ottava — Common</DropdownMenuLabel>
                    {ottavaOptions.filter(option => option.common).map(option => (
                        <DropdownMenuItem key={option.value} data-testid={`btn-ottava-${option.value}`} className="min-h-10 gap-3" disabled={!onAddOttava} onSelect={() => onAddOttava?.(option.value)}>
                            <span data-testid={`ottava-symbol-${option.value}`} className={styles.lineSymbol} aria-hidden="true">{option.symbol}</span>
                            <span>{option.label}</span>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuLabel>Ottava — Other</DropdownMenuLabel>
                    {ottavaOptions.filter(option => !option.common).map(option => (
                        <DropdownMenuItem key={option.value} data-testid={`btn-ottava-${option.value}`} className="min-h-10 gap-3" disabled={!onAddOttava} onSelect={() => onAddOttava?.(option.value)}>
                            <span data-testid={`ottava-symbol-${option.value}`} className={styles.lineSymbol} aria-hidden="true">{option.symbol}</span>
                            <span>{option.label}</span>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuLabel>Trills</DropdownMenuLabel>
                    {trillOptions.map(option => (
                        <DropdownMenuItem key={option.value} data-testid={`btn-trill-${option.value}`} className="min-h-10 gap-3" disabled={!onAddTrill} onSelect={() => onAddTrill?.(option.value)}>
                            <span data-testid={`trill-symbol-${option.value}`} className={styles.lineSymbol} aria-hidden="true">{'\uE566\uEAA4'}</span>
                            <span>{option.label}</span>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuLabel>Glissandos</DropdownMenuLabel>
                    {glissandoOptions.map(option => (
                        <DropdownMenuItem key={option.value} data-testid={`btn-glissando-${option.value}`} className="min-h-10 gap-3" disabled={!onAddGlissando} onSelect={() => onAddGlissando?.(option.value)}>
                            <span data-testid={`glissando-symbol-${option.value}`} className={styles.lineSymbol} aria-hidden="true">{option.symbol}</span>
                            <span>{option.label}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
