'use client';

import React, { useEffect, useRef, useState } from 'react';
import { loadWebMscore, Score, InputFileFormat } from '../lib/webmscore-loader';
import { Toolbar } from './Toolbar';

export default function ScoreEditor() {
    const [score, setScore] = useState<Score | null>(null);
    const [zoom, setZoom] = useState(1.0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Initialize webmscore
        loadWebMscore().then(() => {
            console.log('webmscore initialized');
        }).catch(err => {
            console.error('Failed to initialize webmscore', err);
        });
    }, []);

    const handleFileUpload = async (file: File) => {
        setLoading(true);
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

            // Load score
            // false = doLayout later? No, README says false enables Boost Mode (no layout). We want layout.
            // So we want true (default) for rendering.

            // Actually, let's look at the README again.
            // "const score = await WebMscore.load('mscz', msczdata)" -> implies default is true?
            // Let's try default first.

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

        // Generate SVG
        // The README doesn't explicitly show the generate SVG method, but it says "Generate music sheets in SVG/PNG/PDF format"
        // Usually it's score.save('svg')

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
                    ref={containerRef}
                    className="origin-top-left transition-transform duration-200 ease-out bg-white shadow-lg mx-auto"
                    style={{
                        transform: `scale(${zoom})`,
                        width: 'fit-content'
                    }}
                />
            </div>
        </div>
    );
}
