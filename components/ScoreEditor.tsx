'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadWebMscore, Score, InputFileFormat, Positions } from '../lib/webmscore-loader';
import { Toolbar } from './Toolbar';

export default function ScoreEditor() {
    const searchParams = useSearchParams();
    const [score, setScore] = useState<Score | null>(null);
    const [zoom, setZoom] = useState(1.0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [positions, setPositions] = useState<Positions | null>(null);
    const [selectedElement, setSelectedElement] = useState<{ x: number, y: number, w: number, h: number } | null>(null);

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
    }, [searchParams]);

    const handleUrlLoad = async (url: string) => {
        setLoading(true);
        setSelectedElement(null);
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

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.1, 3.0));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.1, 0.5));
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
            if (element.classList && (element.classList.contains('Note') || element.classList.contains('Rest'))) {
                found = true;
                break;
            }
            element = element.parentElement;
        }

        if (found && element) {
            // Get bounding box relative to the viewport
            const rect = element.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            // Calculate relative position accounting for zoom
            // The container is scaled, so we need to be careful.
            // Actually, if we just want to overlay a box *inside* the scaled container,
            // we can use the element's offset relative to the container?
            // SVG elements don't have offsetLeft/Top.

            // Let's calculate relative to the container's top-left
            const x = (rect.left - containerRect.left) / zoom;
            const y = (rect.top - containerRect.top) / zoom;
            const w = rect.width / zoom;
            const h = rect.height / zoom;

            console.log('Selected:', element.tagName, element.getAttribute('class'));
            setSelectedElement({ x, y, w, h });
        } else {
            setSelectedElement(null);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Toolbar
                onFileUpload={handleFileUpload}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                zoomLevel={zoom}
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
