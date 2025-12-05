'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadWebMscore, Score, InputFileFormat } from '../lib/webmscore-loader';
import { Toolbar } from './Toolbar';

type MutationMethods = Pick<Score, 'selectElementAtPoint' | 'deleteSelection' | 'pitchUp' | 'pitchDown' | 'doubleDuration' | 'halfDuration' | 'undo' | 'redo' | 'relayout'>;

const hasMutationApi = (score: Score | null): score is Score & MutationMethods => {
    if (!score) {
        return false;
    }

    const candidate = score as Record<string, unknown>;
    return Boolean(
        candidate.deleteSelection
        || candidate.undo
        || candidate.redo
        || candidate.pitchUp
        || candidate.pitchDown
        || candidate.doubleDuration
        || candidate.halfDuration
    );
};

export default function ScoreEditor() {
    const searchParams = useSearchParams();
    const [score, setScore] = useState<Score | null>(null);
    const [zoom, setZoom] = useState(1.0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [selectedElement, setSelectedElement] = useState<{ x: number, y: number, w: number, h: number } | null>(null);
    const [selectedPoint, setSelectedPoint] = useState<{ page: number, x: number, y: number } | null>(null);
    const [mutationEnabled, setMutationEnabled] = useState(false);

    useEffect(() => {
        // Initialize webmscore
        loadWebMscore().then(() => {
            console.log('webmscore initialized');

            // Auto-load if query param exists
            const scoreUrl = searchParams.get('score');
            if (scoreUrl) {
                handleUrlLoad(scoreUrl);
            }
        }).catch(err => {
            console.error('Failed to initialize webmscore', err);
        });
        // We intentionally avoid re-running when helper functions change; the query param controls this effect.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const handleUrlLoad = async (url: string) => {
        setLoading(true);
        setSelectedElement(null);
        setMutationEnabled(false);
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch score');
            const buffer = await response.arrayBuffer();
            const data = new Uint8Array(buffer);
            const WebMscore = await loadWebMscore();

            // Guess format
            let format: InputFileFormat = 'mscz';
            if (url.endsWith('.xml') || url.endsWith('.musicxml')) {
                format = 'musicxml';
            }

            if (score) {
                score.destroy();
            }

            const loadedScore = await WebMscore.load(format, data);
            setScore(loadedScore);
            const mutationsAvailable = hasMutationApi(loadedScore);
            if (!mutationsAvailable) {
                console.warn('Mutation APIs not detected on loaded score; enabling toolbar anyway.');
            }
            setMutationEnabled(true);
            await renderScore(loadedScore);

            // segmentPositions causes a crash in this version of webmscore/emscripten environment
            // We will use DOM-based hit testing on the SVG elements instead.

        } catch (err) {
            console.error('Error auto-loading file:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        setLoading(true);
        setSelectedElement(null);
        setMutationEnabled(false);
        try {
            const buffer = await file.arrayBuffer();
            const data = new Uint8Array(buffer);
            const WebMscore = await loadWebMscore();

            // Determine format based on extension
            const name = file.name.toLowerCase();
            let format: InputFileFormat = 'mscz';
            if (name.endsWith('.xml') || name.endsWith('.musicxml')) {
                format = 'musicxml';
            }

            // But wait, we need to destroy previous score if exists
            if (score) {
                score.destroy();
            }

            // Re-load with default layout
            const loadedScore = await WebMscore.load(format, data);
            setScore(loadedScore);
            const mutationsAvailable = hasMutationApi(loadedScore);
            if (!mutationsAvailable) {
                console.warn('Mutation APIs not detected on loaded score; enabling toolbar anyway.');
            }
            setMutationEnabled(true);

            await renderScore(loadedScore);

        } catch (err) {
            console.error('Error loading file:', err);
            alert('Failed to load score. See console for details.');
        } finally {
            setLoading(false);
        }
    };

    const renderScore = async (currentScore: Score) => {
        if (!currentScore || !containerRef.current) return;

        try {
            const svgData = await currentScore.saveSvg(0, true); // Page 0, with background
            if (svgData) {
                containerRef.current.innerHTML = svgData;
            }
        } catch (err) {
            console.error('Error rendering score:', err);
        }
    };

    const ensureSelectionInWasm = async () => {
        if (!score || !score.selectElementAtPoint || !selectedPoint) {
            return;
        }

        try {
            const { page, x, y } = selectedPoint;
            await score.selectElementAtPoint(page, x, y);
        } catch (err) {
            console.warn('Re-select in WASM failed; continuing anyway', err);
        }
    };

    const requireMutation = (methodName: keyof MutationMethods) => {
        const fn = score && (score as MutationMethods)[methodName];
        if (!fn) {
            console.warn(`Mutation binding "${methodName}" is missing on Score instance.`);
            alert(`This build of webmscore does not expose "${methodName}".`);
            return null;
        }
        return fn;
    };

    const performMutation = async (label: string, action?: (() => Promise<unknown> | unknown)) => {
        if (!score) {
            console.warn(`Mutation "${label}" requested but no score is loaded.`);
            return;
        }
        if (!action) {
            console.warn(`Mutation "${label}" requested but binding is missing on Score instance.`);
            return;
        }

        try {
            await action();
            await renderScore(score);
        } catch (err) {
            console.error(`Mutation "${label}" failed:`, err);
            alert(`Unable to ${label}. Check the console for details.`);
        }
    };

    const handleDeleteSelection = () => performMutation('delete selection', async () => {
        await ensureSelectionInWasm();
        const del = requireMutation('deleteSelection');
        if (!del) return;
        const result = await del.call(score);
        setSelectedElement(null);
        setSelectedPoint(null);
        return result;
    });
    const handleUndo = () => performMutation('undo', score?.undo?.bind(score));
    const handleRedo = () => performMutation('redo', score?.redo?.bind(score));
    const handlePitchUp = () => performMutation('raise pitch', async () => {
        await ensureSelectionInWasm();
        const fn = requireMutation('pitchUp');
        if (!fn) return;
        return fn.call(score);
    });
    const handlePitchDown = () => performMutation('lower pitch', async () => {
        await ensureSelectionInWasm();
        const fn = requireMutation('pitchDown');
        if (!fn) return;
        return fn.call(score);
    });
    const handleDurationLonger = () => performMutation('lengthen duration', async () => {
        await ensureSelectionInWasm();
        const fn = requireMutation('doubleDuration');
        if (!fn) return;
        return fn.call(score);
    });
    const handleDurationShorter = () => performMutation('shorten duration', async () => {
        await ensureSelectionInWasm();
        const fn = requireMutation('halfDuration');
        if (!fn) return;
        return fn.call(score);
    });

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.1, 3.0));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.1, 0.5));
    };

    const extractPageIndex = (element: Element | null): number | null => {
        let current: Element | null = element;
        while (current && current !== containerRef.current) {
            const dataPage = (current as HTMLElement).dataset?.page;
            if (dataPage && !Number.isNaN(Number(dataPage))) {
                const parsed = Number(dataPage);
                return parsed >= 0 ? parsed : null;
            }

            const idAttr = current.getAttribute('id');
            if (idAttr) {
                const match = idAttr.match(/page-?(\d+)/i);
                if (match) {
                    const parsed = Number(match[1]);
                    return Number.isNaN(parsed) ? null : Math.max(parsed - 1, 0);
                }
            }
            current = current.parentElement;
        }
        return null;
    };

    const handleScoreClick = (e: React.MouseEvent) => {
        if (!containerRef.current) return;

        // DOM-based hit testing
        const target = e.target as SVGElement;

        // Check if we clicked on a Note or Rest (or other interesting elements)
        // webmscore SVG classes: Note, Rest, Chord, etc.
        // Often the target is a <path> or <g> with the class.

        // Traverse up to find a relevant class if needed
        let element: Element | null = target;
        let found = false;

        while (element && element !== containerRef.current) {
            if (element.classList && (element.classList.contains('Note') || element.classList.contains('Rest') || element.classList.contains('Chord'))) {
                found = true;
                break;
            }
            element = element.parentElement;
        }

        // Fall back to the clicked element for bounding box if we didn't find a known class
        const targetElement = (found && element) ? element : target;
        const rect = targetElement.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        const x = (rect.left - containerRect.left) / zoom;
        const y = (rect.top - containerRect.top) / zoom;
        const w = rect.width / zoom;
        const h = rect.height / zoom;

        if (w > 0 && h > 0) {
            const pageIndex = extractPageIndex(targetElement) ?? 0;
            // Use center of the box for selection to reduce edge misses
            const centerX = x + w / 2;
            const centerY = y + h / 2;

            setSelectedElement({ x, y, w, h });
            score?.selectElementAtPoint?.(pageIndex, centerX, centerY).catch(err => {
                console.warn('selectElementAtPoint not available or failed:', err);
                setSelectedElement(null);
                setSelectedPoint(null);
            });
            setSelectedPoint({ page: pageIndex, x: centerX, y: centerY });
        } else {
            setSelectedElement(null);
            setSelectedPoint(null);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Toolbar
                onFileUpload={handleFileUpload}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                zoomLevel={zoom}
                onDeleteSelection={handleDeleteSelection}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onPitchUp={handlePitchUp}
                onPitchDown={handlePitchDown}
                onDurationLonger={handleDurationLonger}
                onDurationShorter={handleDurationShorter}
                mutationsEnabled={mutationEnabled}
                selectionActive={Boolean(selectedElement)}
            />

            <div className="flex-1 overflow-auto bg-gray-50 p-8">
                {loading && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-xl text-gray-500">Loading score...</div>
                    </div>
                )}

                {!loading && !score && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-xl text-gray-400">No score loaded. Open a file to begin.</div>
                    </div>
                )}

                <div
                    className="relative origin-top-left transition-transform duration-200 ease-out bg-white shadow-lg mx-auto"
                    style={{
                        transform: `scale(${zoom})`,
                        width: 'fit-content'
                    }}
                    onClick={handleScoreClick}
                >
                    <div ref={containerRef} />

                    {selectedElement && (
                        <div
                            className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-30 pointer-events-none"
                            style={{
                                left: selectedElement.x,
                                top: selectedElement.y,
                                width: selectedElement.w,
                                height: selectedElement.h
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
