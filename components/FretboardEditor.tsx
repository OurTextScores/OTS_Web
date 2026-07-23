'use client';

import React from 'react';
import type { FretDiagramData } from '../lib/webmscore-loader';

interface FretboardEditorProps {
    data: FretDiagramData;
    disabled?: boolean;
    onChange: (data: FretDiagramData) => void;
}

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

export function FretboardEditor({ data, disabled = false, onChange }: FretboardEditorProps) {
    const resize = (nextStrings: number, nextFrets: number) => {
        const strings = clamp(nextStrings, 4, 12);
        const frets = clamp(nextFrets, 1, 12);
        onChange({
            ...data,
            strings,
            frets,
            dots: data.dots.filter(dot => dot.string < strings && dot.fret <= frets),
            markers: data.markers.filter(marker => marker.string < strings),
            barres: data.barres.filter(barre => barre.startString < strings && barre.fret <= frets),
        });
    };

    const cycleMarker = (string: number) => {
        const current = data.markers.find(marker => marker.string === string)?.type ?? 0;
        const next = (current + 1) % 3;
        onChange({
            ...data,
            dots: next ? data.dots.filter(dot => dot.string !== string) : data.dots,
            markers: [
                ...data.markers.filter(marker => marker.string !== string),
                ...(next ? [{ string, type: next }] : []),
            ],
        });
    };

    const toggleDot = (string: number, fret: number) => {
        const exists = data.dots.some(dot => dot.string === string && dot.fret === fret);
        onChange({
            ...data,
            markers: exists ? data.markers : data.markers.filter(marker => marker.string !== string),
            dots: exists
                ? data.dots.filter(dot => dot.string !== string || dot.fret !== fret)
                : [...data.dots, { string, fret, type: 0 }],
        });
    };

    return (
        <section data-testid="fretboard-editor" className="border-t border-slate-200 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-700">Fretboard</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                <label>
                    <span className="mb-1 block">Strings</span>
                    <input
                        data-testid="fretboard-strings"
                        type="number"
                        min={4}
                        max={12}
                        value={data.strings}
                        disabled={disabled}
                        onChange={event => resize(Number(event.target.value), data.frets)}
                        className="w-full rounded border border-slate-300 px-2 py-1"
                    />
                </label>
                <label>
                    <span className="mb-1 block">Frets</span>
                    <input
                        data-testid="fretboard-frets"
                        type="number"
                        min={1}
                        max={12}
                        value={data.frets}
                        disabled={disabled}
                        onChange={event => resize(data.strings, Number(event.target.value))}
                        className="w-full rounded border border-slate-300 px-2 py-1"
                    />
                </label>
                <label>
                    <span className="mb-1 block">First fret</span>
                    <input
                        data-testid="fretboard-offset"
                        type="number"
                        min={0}
                        max={20}
                        value={data.fretOffset}
                        disabled={disabled}
                        onChange={event => onChange({ ...data, fretOffset: clamp(Number(event.target.value), 0, 20) })}
                        className="w-full rounded border border-slate-300 px-2 py-1"
                    />
                </label>
                <label className="flex items-end gap-2 pb-1">
                    <input
                        data-testid="fretboard-show-nut"
                        type="checkbox"
                        checked={data.showNut}
                        disabled={disabled}
                        onChange={event => onChange({ ...data, showNut: event.target.checked })}
                    />
                    Show nut
                </label>
            </div>
            <div className="mt-3 overflow-x-auto pb-1">
                <div className="inline-grid gap-1" style={{ gridTemplateColumns: `1.5rem repeat(${data.strings}, 1.75rem)` }}>
                    <span />
                    {Array.from({ length: data.strings }, (_, string) => {
                        const marker = data.markers.find(item => item.string === string)?.type ?? 0;
                        return (
                            <button
                                key={`marker-${string}`}
                                data-testid={`fretboard-marker-${string}`}
                                type="button"
                                disabled={disabled}
                                onClick={() => cycleMarker(string)}
                                title="Cycle open, muted, and unmarked"
                                className="h-7 rounded border border-slate-300 bg-white text-xs font-bold hover:bg-blue-50"
                            >
                                {marker === 1 ? '○' : marker === 2 ? '×' : '·'}
                            </button>
                        );
                    })}
                    {Array.from({ length: data.frets }, (_, index) => index + 1).flatMap(fret => [
                        <span key={`label-${fret}`} className="flex h-7 items-center justify-center text-[10px] text-slate-500">{fret + data.fretOffset}</span>,
                        ...Array.from({ length: data.strings }, (_, string) => {
                            const active = data.dots.some(dot => dot.string === string && dot.fret === fret);
                            return (
                                <button
                                    key={`${string}-${fret}`}
                                    data-testid={`fretboard-cell-${string}-${fret}`}
                                    type="button"
                                    disabled={disabled}
                                    aria-pressed={active}
                                    onClick={() => toggleDot(string, fret)}
                                    className={`h-7 rounded-sm border text-sm ${active ? 'border-blue-700 bg-blue-600 text-white' : 'border-slate-300 bg-slate-50 hover:bg-blue-50'}`}
                                >
                                    {active ? '●' : ''}
                                </button>
                            );
                        }),
                    ])}
                </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-500">Top row cycles unmarked → open → muted. Click a fret cell to toggle a dot.</p>
        </section>
    );
}
