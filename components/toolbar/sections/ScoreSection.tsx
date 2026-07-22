import React, { useState, useMemo } from 'react';
import { Button } from '../../ui/Button';
import { DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenu, DropdownMenuLabel } from '../../ui/DropdownMenu';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../ui/Select';
import { ToolbarSectionProps } from '../types';
import { keySignatureButtonOptionsDefault, clefButtonOptionsDefault, barlineOptions, repeatCountOptions, voltaOptions } from '../constants';
import { clefScorePaletteItem, SCORE_PALETTE_DRAG_MIME } from '../palette';
import { Guitar, Repeat } from 'lucide-react';
import { ClefIcon, KeySignatureIcon } from '../CustomIcons';
import styles from './ScoreSection.module.css';

const commonClefValues = new Set([0, 20, 10, 11]);

const markerOptions = [
    { label: 'Segno', value: 0, symbol: '\uE047', common: true },
    { label: 'Coda', value: 2, symbol: '\uE048', common: true },
    { label: 'Fine', value: 5, symbol: 'Fine', common: true },
    { label: 'To Coda', value: 6, symbol: '\uE048', common: true },
    { label: 'Serpent segno', value: 1, symbol: '\uE04A', common: false },
    { label: 'Square coda', value: 3, symbol: '\uE049', common: false },
    { label: 'To Coda symbol', value: 7, symbol: '\uE048', common: false },
] as const;

const jumpOptions = [
    { label: 'D.C.', value: 0, common: true },
    { label: 'D.C. al Fine', value: 1, common: true },
    { label: 'D.C. al Coda', value: 2, common: true },
    { label: 'D.S. al Coda', value: 3, common: true },
    { label: 'D.S. al Fine', value: 4, common: true },
    { label: 'D.S.', value: 5, common: true },
    { label: 'D.C. al Double Coda', value: 6, common: false },
    { label: 'D.S. al Double Coda', value: 7, common: false },
    { label: 'Dal Segno Segno', value: 8, common: false },
    { label: 'D.S.S. al Coda', value: 9, common: false },
    { label: 'D.S.S. al Double Coda', value: 10, common: false },
    { label: 'D.S.S. al Fine', value: 11, common: false },
    { label: 'Da Coda', value: 12, common: false },
    { label: 'Da Double Coda', value: 13, common: false },
] as const;

const clefSymbol = (clefType: number): string => {
    const exactGlyphs: Record<number, string> = {
        0: '\uE050', 1: '\uE051', 2: '\uE052', 3: '\uE053', 4: '\uE054',
        5: '\uE055', 6: '\uE057', 7: '\uE050',
        20: '\uE062', 21: '\uE063', 22: '\uE064', 23: '\uE065', 24: '\uE066',
        29: '\uE069', 30: '\uE06A',
        31: '\uE06D', 32: '\uE06E', 33: '\uE06D', 34: '\uE06E',
    };
    if (exactGlyphs[clefType]) {
        return exactGlyphs[clefType];
    }
    if (clefType >= 8 && clefType <= 19) {
        return '\uE05C';
    }
    if (clefType >= 20 && clefType <= 28) {
        return '\uE062';
    }
    return '\uE050';
};

export const ScoreSection: React.FC<ToolbarSectionProps> = ({
    instrumentGroups = [],
    parts = [],
    onAddPart,
    onRemovePart,
    onTogglePartVisible,
    onSetKeySignature,
    keySignatureOptions,
    onSetClef,
    clefOptions,
    onToggleRepeatStart,
    onToggleRepeatEnd,
    onSetRepeatCount,
    onSetBarLineType,
    onAddVolta,
    onAddMarker,
    onAddJump,
    exportsEnabled,
    mutationsEnabled,
    paletteDropEnabled,
    selectionActive,
}) => {
    const [selectedInstrumentId, setSelectedInstrumentId] = useState('');

    const mutationDisabled = !mutationsEnabled;
    const instrumentsDisabled = !exportsEnabled;

    const instrumentOptions = instrumentGroups.flatMap(group =>
        group.instruments.map(instrument => ({
            ...instrument,
            groupName: instrument.groupName ?? group.name,
            groupId: instrument.groupId ?? group.id
        }))
    );

    const commonInstrumentPreferences = useMemo(() => ([
        { key: 'piano', ids: ['piano'] },
        { key: 'violin', ids: ['violin'] },
        { key: 'viola', ids: ['viola'] },
        { key: 'cello', ids: ['violoncello', 'cello'] },
        { key: 'double-bass', ids: ['double-bass', 'contrabass'], label: 'Double Bass' },
        { key: 'flute', ids: ['flute'] },
        { key: 'oboe', ids: ['oboe'] },
        { key: 'clarinet', ids: ['clarinet'], label: 'Clarinet' },
        { key: 'bassoon', ids: ['bassoon'] },
        { key: 'trumpet', ids: ['trumpet'], label: 'Trumpet' },
        { key: 'horn', ids: ['horn'] },
        { key: 'trombone', ids: ['trombone'] },
        { key: 'tuba', ids: ['tuba'] },
        { key: 'alto-saxophone', ids: ['alto-saxophone'] },
        { key: 'tenor-saxophone', ids: ['tenor-saxophone'] },
        { key: 'bass-guitar', ids: ['bass-guitar'] },
        { key: 'guitar', ids: ['guitar-nylon', 'guitar-steel'] },
        { key: 'voice', ids: ['voice'] },
        { key: 'drumset', ids: ['drumset'] },
    ]), []);

    const commonInstruments = useMemo(() => {
        const results: { instrument: (typeof instrumentOptions)[number]; label: string }[] = [];
        const used = new Set<string>();
        for (const pref of commonInstrumentPreferences) {
            const found = pref.ids
                .map((id) => instrumentOptions.find((instrument) => instrument.id === id))
                .find(Boolean);
            if (found && !used.has(found.id)) {
                used.add(found.id);
                results.push({ instrument: found, label: pref.label ?? found.name });
            }
        }
        return results;
    }, [commonInstrumentPreferences, instrumentOptions]);

    const hasInstrumentTemplates = instrumentOptions.length > 0;
    const instrumentIdToAdd = selectedInstrumentId || (hasInstrumentTemplates ? instrumentOptions[0].id : '');

    const keySignatureButtonOptions = keySignatureOptions ?? keySignatureButtonOptionsDefault;
    const clefButtonOptions = clefOptions ?? clefButtonOptionsDefault;
    const commonClefOptions = clefButtonOptions.filter(option => commonClefValues.has(option.value));
    const otherClefOptions = clefButtonOptions.filter(option => !commonClefValues.has(option.value));

    const renderClefOption = (opt: (typeof clefButtonOptions)[number]) => {
        const canClickApply = !mutationDisabled && Boolean(onSetClef);
        const canDragApply = !mutationDisabled && Boolean(paletteDropEnabled);
        return (
            <DropdownMenuItem
                key={opt.value}
                data-testid={`btn-clef-${opt.value}`}
                disabled={!canClickApply && !canDragApply}
                draggable={canDragApply}
                className={canDragApply ? 'min-h-12 cursor-grab gap-3 py-2 active:cursor-grabbing' : 'min-h-12 gap-3 py-2'}
                title={canClickApply && canDragApply ? `Click to apply ${opt.label}; drag to place it` : canDragApply ? `Drag ${opt.label} onto a measure` : `Click to apply ${opt.label}`}
                onSelect={(event) => {
                    if (!canClickApply) {
                        event.preventDefault();
                        return;
                    }
                    onSetClef?.(opt.value);
                }}
                onDragStart={(event) => {
                    if (!canDragApply) {
                        event.preventDefault();
                        return;
                    }
                    event.stopPropagation();
                    event.dataTransfer.effectAllowed = 'copy';
                    const item = clefScorePaletteItem(opt.label, opt.value);
                    event.dataTransfer.setData(SCORE_PALETTE_DRAG_MIME, JSON.stringify(item));
                    event.dataTransfer.setData('text/plain', item.label);
                }}
            >
                <span data-testid={`clef-symbol-${opt.value}`} className={styles.clefSymbol} aria-hidden="true">
                    {clefSymbol(opt.value)}
                </span>
                <span>{opt.label}</span>
            </DropdownMenuItem>
        );
    };

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button data-testid="dropdown-instruments" variant="outline" size="sm" disabled={instrumentsDisabled} className="shadow-sm">
                        <Guitar size={14} className="mr-2" />
                        Instruments
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Add</DropdownMenuLabel>
                    {hasInstrumentTemplates ? (
                        <>
                            <Select value={instrumentIdToAdd} onValueChange={(value) => setSelectedInstrumentId(value)} disabled={mutationDisabled}>
                                <SelectTrigger data-testid="select-instrument-add" className="w-full">
                                    <SelectValue placeholder="Select instrument" />
                                </SelectTrigger>
                                <SelectContent>
                                    {commonInstruments.length > 0 && (
                                        <SelectGroup>
                                            <SelectLabel>Common</SelectLabel>
                                            {commonInstruments.map((entry, index) => (
                                                <SelectItem key={`common-${entry.instrument.id}-${index}`} value={entry.instrument.id}>
                                                    {entry.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    )}
                                    {instrumentGroups.map(group => (
                                        <SelectGroup key={group.id}>
                                            <SelectLabel>{group.name}</SelectLabel>
                                            {group.instruments.map(instrument => (
                                                <SelectItem key={instrument.id} value={instrument.id}>
                                                    {instrument.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                            <DropdownMenuItem
                                disabled={mutationDisabled || !onAddPart || !instrumentIdToAdd}
                                onSelect={() => { if (instrumentIdToAdd && onAddPart) onAddPart(instrumentIdToAdd); }}
                            >
                                Add Instrument
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <div className="px-2 py-1 text-sm text-slate-600">Instrument list unavailable.</div>
                    )}

                    <DropdownMenuLabel>On Score</DropdownMenuLabel>
                    {parts.length ? (
                        parts.map(part => (
                            <div key={`${part.index}-${part.instrumentId}`} className="flex items-center gap-3">
                                <span className="flex-1 truncate text-sm text-slate-800">{part.name || part.instrumentName || part.instrumentId}</span>
                                <DropdownMenuItem data-testid={`btn-part-visible-${part.index}`} disabled={mutationDisabled || !onTogglePartVisible} onSelect={() => onTogglePartVisible?.(part.index, !part.isVisible)}>
                                    {part.isVisible ? 'Hide' : 'Show'}
                                </DropdownMenuItem>
                                <DropdownMenuItem data-testid={`btn-part-remove-${part.index}`} disabled={mutationDisabled || !onRemovePart} onSelect={() => {
                                    if (!onRemovePart) return;
                                    const label = part.name || part.instrumentName || 'this part';
                                    if (typeof window === 'undefined' || window.confirm(`Remove ${label}?`)) onRemovePart(part.index);
                                }}>
                                    Remove
                                </DropdownMenuItem>
                            </div>
                        ))
                    ) : (
                        <div className="px-2 py-1 text-sm text-slate-600">No parts loaded.</div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button data-testid="dropdown-key" variant="outline" size="sm" disabled={mutationDisabled || !onSetKeySignature} className="shadow-sm">
                        <KeySignatureIcon size={14} className="mr-2" />
                        Key
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Major</DropdownMenuLabel>
                    {keySignatureButtonOptions.map(opt => (
                        <DropdownMenuItem key={opt.fifths} data-testid={`btn-keysig-${opt.fifths}`} disabled={mutationDisabled || !onSetKeySignature} onSelect={() => onSetKeySignature?.(opt.fifths)}>
                            {opt.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button data-testid="dropdown-clef" variant="outline" size="sm" disabled={mutationDisabled || (!onSetClef && !paletteDropEnabled)} className="shadow-sm">
                        <ClefIcon size={14} className="mr-2" />
                        Clef
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent data-testid="clef-menu" className={styles.clefMenu}>
                    <DropdownMenuLabel>Common</DropdownMenuLabel>
                    {commonClefOptions.map(renderClefOption)}
                    <DropdownMenuLabel>Other</DropdownMenuLabel>
                    {otherClefOptions.map(renderClefOption)}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button data-testid="dropdown-repeats" variant="outline" size="sm" disabled={mutationDisabled || !selectionActive} className="shadow-sm">
                        <Repeat size={14} className="mr-2" />
                        Repeats & Navigation
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent data-testid="repeats-navigation-menu" className={styles.navigationMenu}>
                    <DropdownMenuLabel>Repeats</DropdownMenuLabel>
                    <DropdownMenuItem data-testid="btn-repeat-start" disabled={mutationDisabled || !selectionActive || !onToggleRepeatStart} onSelect={() => onToggleRepeatStart?.()}>Start Repeat</DropdownMenuItem>
                    <DropdownMenuItem data-testid="btn-repeat-end" disabled={mutationDisabled || !selectionActive || !onToggleRepeatEnd} onSelect={() => onToggleRepeatEnd?.()}>End Repeat</DropdownMenuItem>
                    <DropdownMenuLabel>Repeat Count</DropdownMenuLabel>
                    {repeatCountOptions.map(opt => (
                        <DropdownMenuItem key={opt.count} data-testid={`btn-repeat-count-${opt.count}`} disabled={mutationDisabled || !selectionActive || !onSetRepeatCount} onSelect={() => onSetRepeatCount?.(opt.count)}>
                            {opt.label}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuLabel>Barlines</DropdownMenuLabel>
                    {barlineOptions.map(opt => (
                        <DropdownMenuItem key={opt.value} data-testid={`btn-barline-${opt.value}`} disabled={mutationDisabled || !selectionActive || !onSetBarLineType} onSelect={() => onSetBarLineType?.(opt.value)}>
                            {opt.label}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuLabel>Voltas</DropdownMenuLabel>
                    {voltaOptions.map(opt => (
                        <DropdownMenuItem key={opt.ending} data-testid={`btn-volta-${opt.ending}`} disabled={mutationDisabled || !selectionActive || !onAddVolta} onSelect={() => onAddVolta?.(opt.ending)}>
                            {opt.label}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuLabel>Markers — Common</DropdownMenuLabel>
                    {markerOptions.filter(option => option.common).map(option => (
                        <DropdownMenuItem key={option.value} data-testid={`btn-marker-${option.value}`} className="min-h-10 gap-3" disabled={mutationDisabled || !selectionActive || !onAddMarker} onSelect={() => onAddMarker?.(option.value)}>
                            <span data-testid={`marker-symbol-${option.value}`} className={styles.markerSymbol} aria-hidden="true">{option.symbol}</span>
                            <span>{option.label}</span>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuLabel>Markers — Other</DropdownMenuLabel>
                    {markerOptions.filter(option => !option.common).map(option => (
                        <DropdownMenuItem key={option.value} data-testid={`btn-marker-${option.value}`} className="min-h-10 gap-3" disabled={mutationDisabled || !selectionActive || !onAddMarker} onSelect={() => onAddMarker?.(option.value)}>
                            <span data-testid={`marker-symbol-${option.value}`} className={styles.markerSymbol} aria-hidden="true">{option.symbol}</span>
                            <span>{option.label}</span>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuLabel>Jumps — Common</DropdownMenuLabel>
                    {jumpOptions.filter(option => option.common).map(option => (
                        <DropdownMenuItem key={option.value} data-testid={`btn-jump-${option.value}`} disabled={mutationDisabled || !selectionActive || !onAddJump} onSelect={() => onAddJump?.(option.value)}>
                            {option.label}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuLabel>Jumps — Other</DropdownMenuLabel>
                    {jumpOptions.filter(option => !option.common).map(option => (
                        <DropdownMenuItem key={option.value} data-testid={`btn-jump-${option.value}`} disabled={mutationDisabled || !selectionActive || !onAddJump} onSelect={() => onAddJump?.(option.value)}>
                            {option.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
