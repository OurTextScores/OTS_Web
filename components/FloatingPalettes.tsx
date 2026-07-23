'use client';

import React, { useMemo, useRef, useState } from 'react';
import { GripHorizontal, Search, X } from 'lucide-react';
import { SCORE_PALETTE_DRAG_MIME, scorePaletteItems, type ScorePaletteItem } from './toolbar/palette';

interface FloatingPalettesProps {
    disabled?: boolean;
    dragEnabled?: boolean;
    onApply: (item: ScorePaletteItem) => void;
    onClose: () => void;
}

const categories = ['Clefs', 'Dynamics', 'Articulations'] as const;

export function FloatingPalettes({ disabled = false, dragEnabled = false, onApply, onClose }: FloatingPalettesProps) {
    const [query, setQuery] = useState('');
    const [position, setPosition] = useState({ x: 24, y: 110 });
    const dragRef = useRef<{ dx: number; dy: number } | null>(null);
    const normalizedQuery = query.trim().toLowerCase();
    const visibleItems = useMemo(() => scorePaletteItems.filter(item => item.label.toLowerCase().includes(normalizedQuery)), [normalizedQuery]);

    const startMove = (event: React.PointerEvent) => {
        if ((event.target as Element).closest('button')) return;
        dragRef.current = { dx: event.clientX - position.x, dy: event.clientY - position.y };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    return (
        <aside
            data-testid="floating-palettes"
            className="fixed z-[120] flex max-h-[70vh] w-80 flex-col overflow-hidden rounded-lg border border-slate-300 bg-white shadow-2xl"
            style={{ left: position.x, top: position.y }}
        >
            <div
                data-testid="floating-palettes-handle"
                className="flex cursor-move items-center gap-2 border-b border-slate-200 bg-slate-800 px-3 py-2 text-sm font-semibold text-white"
                onPointerDown={startMove}
                onPointerMove={event => {
                    if (!dragRef.current) return;
                    setPosition({
                        x: Math.max(0, event.clientX - dragRef.current.dx),
                        y: Math.max(0, event.clientY - dragRef.current.dy),
                    });
                }}
                onPointerUp={event => {
                    dragRef.current = null;
                    event.currentTarget.releasePointerCapture(event.pointerId);
                }}
            >
                <GripHorizontal size={16} aria-hidden="true" />
                <span className="flex-1">Palettes</span>
                <button type="button" data-testid="btn-close-palettes" onClick={onClose} className="rounded p-0.5 hover:bg-slate-700" aria-label="Close palettes">
                    <X size={15} />
                </button>
            </div>
            <label className="m-3 flex items-center gap-2 rounded border border-slate-300 px-2 py-1.5">
                <Search size={14} className="text-slate-500" aria-hidden="true" />
                <input
                    data-testid="palette-search"
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder="Search palettes"
                    className="min-w-0 flex-1 text-sm outline-none"
                />
            </label>
            <div className="overflow-y-auto px-3 pb-3">
                {categories.map(category => {
                    const items = visibleItems.filter(item => item.category === category);
                    if (!items.length) return null;
                    return (
                        <section key={category} data-testid={`palette-category-${category.toLowerCase()}`} className="mb-4 last:mb-0">
                            <h3 className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{category}</h3>
                            <div className="grid grid-cols-4 gap-1">
                                {items.map(item => (
                                    <button
                                        key={`${item.elementType}-${item.subtype}`}
                                        type="button"
                                        data-testid={`palette-item-${item.elementType}-${item.subtype}`}
                                        draggable={dragEnabled}
                                        disabled={disabled && !dragEnabled}
                                        title={`${item.label}${dragEnabled ? ' — drag onto score' : ''}`}
                                        onClick={() => { if (!disabled) onApply(item); }}
                                        onDragStart={event => {
                                            if (!dragEnabled) {
                                                event.preventDefault();
                                                return;
                                            }
                                            event.dataTransfer.effectAllowed = 'copy';
                                            event.dataTransfer.setData(SCORE_PALETTE_DRAG_MIME, JSON.stringify(item));
                                            event.dataTransfer.setData('text/plain', item.label);
                                        }}
                                        className="flex min-h-12 items-center justify-center rounded border border-slate-200 bg-slate-50 p-1 font-[Leland] text-2xl hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50"
                                    >
                                        {item.symbol || item.label.slice(0, 2)}
                                    </button>
                                ))}
                            </div>
                        </section>
                    );
                })}
                {!visibleItems.length && <p className="py-6 text-center text-sm text-slate-500">No palette items match.</p>}
            </div>
        </aside>
    );
}
