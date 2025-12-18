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
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [mutationEnabled, setMutationEnabled] = useState(false);
    const [soundFontLoaded, setSoundFontLoaded] = useState(false);
    const [triedSoundFont, setTriedSoundFont] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioBusy, setAudioBusy] = useState(false);
    const audioUrlRef = useRef<string | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const audioSourcesRef = useRef<AudioBufferSourceNode[]>([]);
    const streamIteratorRef = useRef<((cancel?: boolean) => Promise<any>) | null>(null);

    const exposeScoreToWindow = (s: Score | null) => {
        // Handy for Playwright/debug sessions to poke at WASM bindings directly
        if (typeof window !== 'undefined') {
            (window as any).__webmscore = s;
        }
    };

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
        setLoading(true);
        setSelectedElement(null);
        setSelectedIndex(null);
        setMutationEnabled(false);
        setSoundFontLoaded(false);
        setTriedSoundFont(false);
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
            exposeScoreToWindow(loadedScore);
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
        setLoading(true);
        setSelectedElement(null);
        setSelectedIndex(null);
        setMutationEnabled(false);
        setSoundFontLoaded(false);
        setTriedSoundFont(false);
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
            exposeScoreToWindow(loadedScore);
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
            // Attempt to load default soundfont once per score render (sf3 preferred, sf2 fallback)
            if (!triedSoundFont && currentScore.setSoundFont) {
                const candidates = ['/soundfonts/default.sf3', '/soundfonts/default.sf2'];
                for (const url of candidates) {
                    try {
                        const res = await fetch(url);
                        if (res.ok) {
                            const buf = new Uint8Array(await res.arrayBuffer());
                            await currentScore.setSoundFont(buf);
                            setSoundFontLoaded(true);
                            break;
                        }
                    } catch (sfErr) {
                        console.warn('Soundfont load failed for', url, sfErr);
                    }
                }
                setTriedSoundFont(true);
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

    const refreshSelectionOverlay = (fallbackIndex?: number | null, fallbackPoint?: { page: number, x: number, y: number } | null) => {
        console.log('[refreshSelectionOverlay] Called with fallbackIndex:', fallbackIndex, 'fallbackPoint:', fallbackPoint);
        if (!containerRef.current) {
            console.log('[refreshSelectionOverlay] No containerRef, returning');
            return;
        }

        const useIndex = fallbackIndex !== undefined ? fallbackIndex : selectedIndex;
        const usePoint = fallbackPoint !== undefined ? fallbackPoint : selectedPoint;
        console.log('[refreshSelectionOverlay] useIndex:', useIndex, 'usePoint:', usePoint);

        const containerRect = containerRef.current.getBoundingClientRect();
        const selectors = ['.selected', '.note-selected', '.ms-selection'];
        const candidates: Element[] = selectors
            .flatMap(sel => Array.from(containerRef.current!.querySelectorAll(sel)));

        console.log('[refreshSelectionOverlay] candidates.length:', candidates.length);

        let el: Element | null = null;
        if (candidates.length > 0) {
            // If we have selection markers in the SVG, prefer those over historical position
            // This handles cases where the element moved (e.g., pitch change)
            if (usePoint) {
                const targetPage = usePoint.page ?? 0;
                // Filter to same page first
                const samePage = candidates.filter(cand => {
                    const page = extractPageIndex(cand) ?? 0;
                    return page === targetPage;
                });

                // If we have candidates on the same page, use the first one
                // (MuseScore typically only has one selected element)
                if (samePage.length > 0) {
                    el = samePage[0];
                } else if (candidates.length > 0) {
                    // Fallback to any selected element
                    el = candidates[0];
                }
            } else {
                el = candidates[0];
            }
        } else if (useIndex !== null) {
            // Fallback: use index if selection markers are missing in SVG
            console.log('[refreshSelectionOverlay] Using index fallback');
            const allAndSome = Array.from(containerRef.current.querySelectorAll('.Note, .Rest, .Chord'));
            console.log('[refreshSelectionOverlay] Found', allAndSome.length, 'Note/Rest/Chord elements');
            if (allAndSome[useIndex]) {
                el = allAndSome[useIndex];
                console.log('[refreshSelectionOverlay] Selected element at index', useIndex);
            } else {
                console.log('[refreshSelectionOverlay] No element at index', useIndex);
            }
        }

        console.log('[refreshSelectionOverlay] el:', el);
        if (!el) {
            // No element found, keep previous selection visible
            console.log('[refreshSelectionOverlay] No element found, returning');
            return;
        }

        const rect = el.getBoundingClientRect();
        const x = (rect.left - containerRect.left) / zoom;
        const y = (rect.top - containerRect.top) / zoom;
        const w = rect.width / zoom;
        const h = rect.height / zoom;

        console.log('[refreshSelectionOverlay] Computed position:', { x, y, w, h });

        if (w > 0 && h > 0) {
            console.log('[refreshSelectionOverlay] Setting selectedElement');
            setSelectedElement({ x, y, w, h });
            const centerX = x + w / 2;
            const centerY = y + h / 2;
            setSelectedPoint({ page: extractPageIndex(el) ?? 0, x: centerX, y: centerY });
            // Update the index to match the found element
            const allElements = Array.from(containerRef.current.querySelectorAll('.Note, .Rest, .Chord'));
            const newIndex = allElements.indexOf(el);
            if (newIndex >= 0) {
                setSelectedIndex(newIndex);
            }
            console.log('[refreshSelectionOverlay] Done updating selection');
        } else {
            console.log('[refreshSelectionOverlay] Invalid dimensions, not updating');
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

    const performMutation = async (label: string, action?: (() => Promise<unknown> | unknown), options?: { clearSelection?: boolean }) => {
        if (!score) {
            console.warn(`Mutation "${label}" requested but no score is loaded.`);
            return;
        }
        if (!action) {
            console.warn(`Mutation "${label}" requested but binding is missing on Score instance.`);
            return;
        }

        // Preserve selection state before mutation for use in fallback
        const preservedIndex = selectedIndex;
        const preservedPoint = selectedPoint;

        try {
            console.debug(`Mutation "${label}" start`);
            const result = await action();
            console.debug(`Mutation "${label}" result:`, result);
            if (result === false) {
                console.warn(`Mutation "${label}" returned false (no-op).`);
            }

            // Clear selection if requested (e.g., for delete operations)
            if (options?.clearSelection) {
                setSelectedElement(null);
                setSelectedPoint(null);
                setSelectedIndex(null);
            }

            if (score.relayout) {
                try {
                    await score.relayout();
                } catch (relayoutErr) {
                    console.warn('Relayout after mutation failed:', relayoutErr);
                }
            }
            await renderScore(score);

            // Re-establish selection inside WASM if we had a previously known point.
            if (preservedPoint && score.selectElementAtPoint) {
                try {
                    await score.selectElementAtPoint(preservedPoint.page, preservedPoint.x, preservedPoint.y);
                } catch (reselectErr) {
                    console.warn('Re-select in WASM after mutation failed; continuing with overlay fallback', reselectErr);
                }
            }

            // If selection wasn't cleared, restore preserved state for fallback
            if (!options?.clearSelection) {
                if (preservedIndex !== null && selectedIndex === null) {
                    setSelectedIndex(preservedIndex);
                }
                if (preservedPoint && !selectedPoint) {
                    setSelectedPoint(preservedPoint);
                }
            }

            // Schedule overlay refresh after the DOM has had time to update
            // Use a double-RAF to ensure the DOM is fully parsed and rendered
            // Pass preserved values to handle async state updates
            console.log('[performMutation] Scheduling refresh with preservedIndex:', preservedIndex, 'preservedPoint:', preservedPoint);
            if (typeof window !== 'undefined') {
                window.requestAnimationFrame(() => {
                    console.log('[performMutation] RAF 1');
                    window.requestAnimationFrame(() => {
                        console.log('[performMutation] RAF 2, calling refreshSelectionOverlay');
                        refreshSelectionOverlay(preservedIndex, preservedPoint);
                    });
                });
            } else {
                refreshSelectionOverlay(preservedIndex, preservedPoint);
            }
        } catch (err) {
            console.error(`Mutation "${label}" failed:`, err);
            alert(`Unable to ${label}. Check the console for details.`);
        }
    };

    const scheduleSelectionOverlayRefresh = (fallbackIndex?: number | null, fallbackPoint?: { page: number, x: number, y: number } | null) => {
        // Use a double-RAF to ensure the new SVG is fully parsed and has layout boxes.
        if (typeof window === 'undefined') {
            refreshSelectionOverlay(fallbackIndex, fallbackPoint);
            return;
        }

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                refreshSelectionOverlay(fallbackIndex, fallbackPoint);
            });
        });
    };

    const handleDeleteSelection = () => performMutation('delete selection', async () => {
        await ensureSelectionInWasm();
        const del = requireMutation('deleteSelection');
        if (!del) return;
        return await del.call(score);
    }, { clearSelection: true });
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

    const handleToggleDot = () => performMutation('toggle dot', async () => {
        await ensureSelectionInWasm();
        const fn = requireMutation('toggleDot');
        if (!fn) return;
        return fn.call(score);
    });

    const handleToggleDoubleDot = () => performMutation('toggle double dot', async () => {
        await ensureSelectionInWasm();
        const fn = requireMutation('toggleDoubleDot');
        if (!fn) return;
        return fn.call(score);
    });

    const handleSetVoice = (voiceIndex: number) => performMutation(`set voice ${voiceIndex + 1}`, async () => {
        await ensureSelectionInWasm();
        const fn = requireMutation('setVoice');
        if (!fn) return;
        return fn.call(score, voiceIndex);
    });

    const handleAddDynamic = (dynamicType: number) => performMutation('add dynamic', async () => {
        await ensureSelectionInWasm();
        const fn = requireMutation('addDynamic');
        if (!fn) return;
        return fn.call(score, dynamicType);
    });

    const handleAddRehearsalMark = () => performMutation('add rehearsal mark', async () => {
        await ensureSelectionInWasm();
        const fn = requireMutation('addRehearsalMark');
        if (!fn) return;
        return fn.call(score);
    });

    const handleAddTempoText = (bpm: number) => performMutation('add tempo text', async () => {
        await ensureSelectionInWasm();
        const fn = requireMutation('addTempoText');
        if (!fn) return;
        return fn.call(score, bpm);
    });

    const handleSetTimeSignature = async (num: number, den: number) => {
        if (!score || !score.setTimeSignature) return;
        const preservedIndex = selectedIndex;
        const preservedPoint = selectedPoint;
        setAudioBusy(true);
        try {
            await score.setTimeSignature(num, den);
            if (score.relayout) {
                await score.relayout();
            }
            await renderScore(score);
            scheduleSelectionOverlayRefresh(preservedIndex, preservedPoint);
        } catch (err) {
            console.error('Failed to set time signature', err);
            alert('Unable to set time signature. See console for details.');
        } finally {
            setAudioBusy(false);
        }
    };

    const handleSetClef = async (clefType: number) => {
        if (!score || !score.setClef) return;
        const preservedIndex = selectedIndex;
        const preservedPoint = selectedPoint;
        setAudioBusy(true);
        try {
            await ensureSelectionInWasm();
            await score.setClef(clefType);
            if (score.relayout) {
                await score.relayout();
            }
            await renderScore(score);
            scheduleSelectionOverlayRefresh(preservedIndex, preservedPoint);
        } catch (err) {
            console.error('Failed to set clef', err);
            alert('Unable to set clef. See console for details.');
        } finally {
            setAudioBusy(false);
        }
    };

    const downloadBlob = (data: BlobPart, filename: string, mime: string) => {
        const blob = new Blob([data], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportSvg = async () => {
        if (!score) return;
        try {
            const svg = await score.saveSvg(0, true);
            downloadBlob(svg, 'score.svg', 'image/svg+xml');
        } catch (err) {
            console.error('Failed to export SVG', err);
            alert('Unable to export SVG. See console for details.');
        }
    };

    const handleExportPdf = async () => {
        if (!score) return;
        try {
            const pdf = await score.savePdf();
            downloadBlob(pdf, 'score.pdf', 'application/pdf');
        } catch (err) {
            console.error('Failed to export PDF', err);
            alert('Unable to export PDF. See console for details.');
        }
    };

    const handleExportPng = async () => {
        if (!score || !score.savePng) {
            alert('PNG export is not available in this build.');
            return;
        }
        try {
            const png = await score.savePng(0, true, true);
            downloadBlob(png, 'score.png', 'image/png');
        } catch (err) {
            console.error('Failed to export PNG', err);
            alert('Unable to export PNG. See console for details.');
        }
    };

    const handleExportMxl = async () => {
        if (!score || !score.saveMxl) {
            alert('MXL export is not available in this build.');
            return;
        }
        try {
            const mxl = await score.saveMxl();
            downloadBlob(mxl, 'score.mxl', 'application/vnd.recordare.musicxml');
        } catch (err) {
            console.error('Failed to export MXL', err);
            alert('Unable to export MXL. See console for details.');
        }
    };

    const handleExportMscz = async () => {
        if (!score || !score.saveMsc) {
            alert('MSCZ export is not available in this build.');
            return;
        }
        try {
            const mscz = await score.saveMsc('mscz');
            downloadBlob(mscz, 'score.mscz', 'application/vnd.musescore.mscz');
        } catch (err) {
            console.error('Failed to export MSCZ', err);
            alert('Unable to export MSCZ. See console for details.');
        }
    };

    const handleExportMidi = async () => {
        if (!score || !score.saveMidi) {
            alert('MIDI export is not available in this build.');
            return;
        }
        try {
            const midi = await score.saveMidi(true, true);
            downloadBlob(midi, 'score.mid', 'audio/midi');
        } catch (err) {
            console.error('Failed to export MIDI', err);
            alert('Unable to export MIDI. See console for details.');
        }
    };

    const handleExportAudio = async () => {
        if (!score || !score.saveAudio) {
            alert('Audio export is not available in this build.');
            return;
        }
        if (!soundFontLoaded) {
            alert('Load a soundfont (.sf2/.sf3) before exporting audio. Place it at /public/soundfonts/default.sf3 for auto-load.');
            return;
        }
        try {
            setAudioBusy(true);
            const wav = await score.saveAudio('wav');
            downloadBlob(wav, 'score.wav', 'audio/wav');
        } catch (err) {
            console.error('Failed to export audio', err);
            alert('Unable to export audio. See console for details.');
        } finally {
            setAudioBusy(false);
        }
    };

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        audioSourcesRef.current.forEach(src => {
            try {
                src.stop();
            } catch (_) {
                // ignore
            }
        });
        audioSourcesRef.current = [];
        const iter = streamIteratorRef.current;
        if (iter) {
            iter(true).catch(() => { /* ignore */ });
            streamIteratorRef.current = null;
        }
        setIsPlaying(false);
    };

    const playFromUrl = async (url: string) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => setIsPlaying(false);
        await audio.play();
        setIsPlaying(true);
    };

    const handlePlayAudio = async () => {
        if (!score || !score.saveAudio) {
            alert('Audio playback is not available in this build.');
            return;
        }
        if (!soundFontLoaded) {
            alert('Load a soundfont (.sf2/.sf3) before playback. Place it at /public/soundfonts/default.sf3 for auto-load.');
            return;
        }
        try {
            setAudioBusy(true);
            stopAudio();

            // Prefer streaming via synthAudioBatch if available
            const useStreaming = typeof (score as any).synthAudioBatch === 'function';
            let streamed = false;
            if (useStreaming) {
                try {
                    const audioCtx = audioCtxRef.current || new AudioContext({ sampleRate: 44100 });
                    audioCtxRef.current = audioCtx;
                    if (audioCtx.state === 'suspended') {
                        await audioCtx.resume();
                    }
                    const batchFn = await (score as any).synthAudioBatch(0, 16);
                    streamIteratorRef.current = batchFn;
                    const baseTime = audioCtx.currentTime + 0.05;
                    let lastSource: AudioBufferSourceNode | null = null;
                    // Stream chunks until done
                    while (true) {
                        const batch = await batchFn(false);
                        if (!Array.isArray(batch) || batch.length === 0) {
                            break;
                        }
                        let hitDone = false;
                        for (const res of batch) {
                            if (!res) continue;
                            if (res.done) {
                                hitDone = true;
                            }
                            const floats = new Float32Array(res.chunk.buffer, res.chunk.byteOffset, res.chunk.byteLength / 4);
                            const framesPerChannel = 512; // from synthAudio docs
                            let channels = Math.floor(floats.length / framesPerChannel);
                            if (!Number.isInteger(channels) || channels < 1) channels = 1;
                            if (channels > 2) channels = 2; // cap to stereo
                            const buffer = audioCtx.createBuffer(channels, framesPerChannel, audioCtx.sampleRate);
                            for (let ch = 0; ch < channels; ch++) {
                                const start = ch * framesPerChannel;
                                const slice = floats.subarray(start, start + framesPerChannel);
                                buffer.copyToChannel(slice, ch);
                            }
                            const source = audioCtx.createBufferSource();
                            source.buffer = buffer;
                            source.connect(audioCtx.destination);
                            const startTime = baseTime + res.startTime;
                            source.start(startTime);
                            audioSourcesRef.current.push(source);
                            lastSource = source;
                            if (hitDone) break;
                        }
                        if (hitDone) break;
                    }
                    if (lastSource) {
                        lastSource.onended = () => {
                            setIsPlaying(false);
                            audioSourcesRef.current = [];
                            streamIteratorRef.current = null;
                        };
                    }
                    setIsPlaying(true);
                    streamed = true;
                } catch (streamErr) {
                    console.warn('Streaming playback failed; falling back to WAV', streamErr);
                    stopAudio();
                }
            }
            if (!streamed) {
                // Fallback to full WAV generation
                if (audioUrlRef.current) {
                    await playFromUrl(audioUrlRef.current);
                } else {
                    const wav = await score.saveAudio('wav');
                    const blob = new Blob([wav], { type: 'audio/wav' });
                    const url = URL.createObjectURL(blob);
                    audioUrlRef.current = url;
                    await playFromUrl(url);
                }
            }
        } catch (err) {
            console.error('Failed to play audio', err);
            alert('Unable to play audio. See console for details.');
            stopAudio();
        } finally {
            setAudioBusy(false);
        }
    };

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
        // Note: containerRef.current is a div that contains the SVG, so we need to traverse
        // up through the SVG structure to find Note/Rest/Chord elements
        let element: Element | null = target;
        let found = false;

        while (element) {
            // Check using both classList and getAttribute for SVG compatibility
            const classes = element.getAttribute('class') || '';
            const hasNoteClass = classes.split(/\s+/).some(c => c === 'Note' || c === 'Rest' || c === 'Chord');

            if (hasNoteClass) {
                found = true;
                break;
            }
            // Stop if we've reached containerRef or gone past it
            if (element === containerRef.current || element.parentElement === null) {
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

            // Find the index by looking for Note/Rest/Chord elements
            // If we found a specific element, use it; otherwise search from target
            const allElements = Array.from(containerRef.current.querySelectorAll('.Note, .Rest, .Chord'));
            let index = -1;

            if (found && element) {
                // We found a Note/Rest/Chord element, try to find its index
                index = allElements.indexOf(element);
            }

            // If still not found, try targetElement
            if (index < 0) {
                index = allElements.indexOf(targetElement);
            }

            // If still not found, try to find closest parent that's in the list
            if (index < 0 && targetElement) {
                let current: Element | null = targetElement;
                while (current && current !== containerRef.current) {
                    index = allElements.indexOf(current);
                    if (index >= 0) break;
                    current = current.parentElement;
                }
            }

            setSelectedIndex(index >= 0 ? index : null);
            setSelectedPoint({ page: pageIndex, x: centerX, y: centerY });
        } else {
            setSelectedElement(null);
            setSelectedPoint(null);
            setSelectedIndex(null);
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
                onExportSvg={handleExportSvg}
                onExportPdf={handleExportPdf}
                onExportPng={handleExportPng}
                onExportMxl={handleExportMxl}
                onExportMscz={handleExportMscz}
                onExportMidi={handleExportMidi}
                onExportAudio={handleExportAudio}
                onPlayAudio={handlePlayAudio}
                onStopAudio={stopAudio}
                isPlaying={isPlaying}
                audioBusy={audioBusy}
                exportsEnabled={Boolean(score)}
                pngAvailable={Boolean(score?.savePng)}
                audioAvailable={Boolean(score?.saveAudio) && soundFontLoaded}
                onSetTimeSignature={handleSetTimeSignature}
                onSetClef={handleSetClef}
                onToggleDot={handleToggleDot}
                onToggleDoubleDot={handleToggleDoubleDot}
                onSetVoice={handleSetVoice}
                onAddDynamic={handleAddDynamic}
                onAddRehearsalMark={handleAddRehearsalMark}
                onAddTempoText={handleAddTempoText}
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
	                data-testid="score-wrapper"
	                style={{
	                    transform: `scale(${zoom})`,
	                    width: 'fit-content'
	                }}
	                onClick={handleScoreClick}
	            >
	                <div ref={containerRef} data-testid="svg-container" />

	                {selectedElement && (
	                    <div
	                        data-testid="selection-overlay"
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
