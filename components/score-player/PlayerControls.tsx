'use client';

import { useRef, useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Minus,
    Pause,
    Play,
    Plus,
    RotateCcw,
    ScanLine,
    Volume2,
} from 'lucide-react';
import { formatPlaybackTime } from '@/lib/playback/timeline';

type Props = {
    state: 'idle' | 'preparing' | 'playing' | 'paused' | 'ended' | 'unavailable';
    disabled?: boolean;
    positionMs: number;
    durationMs: number;
    volume: number;
    currentPage: number;
    pageCount: number;
    follow: boolean;
    onTogglePlayPause: () => void;
    onStop: () => void;
    onSeek: (positionMs: number) => void;
    onVolume: (volume: number) => void;
    onPreviousPage: () => void;
    onNextPage: () => void;
    onZoomOut: () => void;
    onFitWidth: () => void;
    onZoomIn: () => void;
    onToggleFollow: () => void;
};

const controlClass = 'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700';

export default function PlayerControls(props: Props) {
    const [scrubbing, setScrubbing] = useState(false);
    const [draftPosition, setDraftPosition] = useState(props.positionMs);
    const scrubbingRef = useRef(false);

    const commitSeek = (position = draftPosition) => {
        scrubbingRef.current = false;
        setScrubbing(false);
        setDraftPosition(position);
        props.onSeek(position);
    };
    const showPause = props.state === 'playing';
    const playLabel = props.state === 'ended'
        ? 'Replay'
        : props.state === 'unavailable'
            ? 'Retry playback'
            : showPause ? 'Pause' : 'Play';
    const transportDisabled = Boolean(props.disabled) || props.state === 'preparing';
    const displayedPosition = scrubbing ? draftPosition : props.positionMs;

    return (
        <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 px-3 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
            <div className="mx-auto flex max-w-6xl items-center gap-2">
                <button type="button" className={controlClass} onClick={props.onStop} disabled={transportDisabled || props.positionMs <= 0} title="Stop and rewind" aria-label="Stop and rewind">
                    <RotateCcw size={18} aria-hidden="true" />
                </button>
                <button type="button" data-testid="player-play" className={`${controlClass} border-cyan-600 bg-cyan-600 text-white hover:bg-cyan-700 dark:border-cyan-500 dark:bg-cyan-500 dark:text-slate-950`} onClick={props.onTogglePlayPause} disabled={transportDisabled} title={playLabel} aria-label={playLabel}>
                    {showPause ? <Pause size={20} aria-hidden="true" /> : <Play size={20} aria-hidden="true" />}
                </button>
                <span className="w-12 shrink-0 text-right font-mono text-xs tabular-nums text-slate-600 dark:text-slate-300">
                    {formatPlaybackTime(displayedPosition)}
                </span>
                <input
                    data-testid="player-seek"
                    className="min-w-0 flex-1 accent-cyan-600"
                    type="range"
                    min={0}
                    max={Math.max(0, props.durationMs)}
                    step={100}
                    value={Math.min(displayedPosition, Math.max(0, props.durationMs))}
                    disabled={Boolean(props.disabled) || props.durationMs <= 0 || props.state === 'preparing'}
                    aria-label="Playback position"
                    aria-valuetext={`${formatPlaybackTime(displayedPosition)} of ${formatPlaybackTime(props.durationMs)}`}
                    onPointerDown={() => {
                        scrubbingRef.current = true;
                        setDraftPosition(props.positionMs);
                        setScrubbing(true);
                    }}
                    onChange={(event) => {
                        const value = Number(event.currentTarget.value);
                        setDraftPosition(value);
                        if (!scrubbingRef.current) props.onSeek(value);
                    }}
                    onPointerUp={(event) => commitSeek(Number(event.currentTarget.value))}
                    onPointerCancel={(event) => commitSeek(Number(event.currentTarget.value))}
                />
                <span className="w-12 shrink-0 font-mono text-xs tabular-nums text-slate-600 dark:text-slate-300">
                    {formatPlaybackTime(props.durationMs)}
                </span>
                <label className="hidden items-center gap-1 text-slate-600 dark:text-slate-300 sm:flex" title="Volume">
                    <Volume2 size={17} aria-hidden="true" />
                    <input aria-label="Volume" className="w-20 accent-cyan-600" type="range" min={0} max={1} step={0.05} value={props.volume} onChange={(event) => props.onVolume(Number(event.currentTarget.value))} />
                </label>
            </div>

            <div className="mx-auto mt-2 flex max-w-6xl items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1">
                    <button type="button" className={controlClass} onClick={props.onPreviousPage} disabled={props.currentPage <= 0} title="Previous page" aria-label="Previous page"><ChevronLeft size={18} aria-hidden="true" /></button>
                    <span className="min-w-20 text-center tabular-nums" aria-live="polite">Page {props.currentPage + 1} of {props.pageCount}</span>
                    <button type="button" className={controlClass} onClick={props.onNextPage} disabled={props.currentPage >= props.pageCount - 1} title="Next page" aria-label="Next page"><ChevronRight size={18} aria-hidden="true" /></button>
                </div>
                <div className="flex items-center gap-1">
                    <button type="button" className={controlClass} onClick={props.onZoomOut} title="Zoom out" aria-label="Zoom out"><Minus size={17} aria-hidden="true" /></button>
                    <button type="button" className={controlClass} onClick={props.onFitWidth} title="Fit width" aria-label="Fit width"><ScanLine size={17} aria-hidden="true" /></button>
                    <button type="button" className={controlClass} onClick={props.onZoomIn} title="Zoom in" aria-label="Zoom in"><Plus size={17} aria-hidden="true" /></button>
                    <button type="button" className={`${controlClass} ${props.follow ? 'border-cyan-600 text-cyan-700 dark:border-cyan-400 dark:text-cyan-300' : ''}`} onClick={props.onToggleFollow} title={`Follow score ${props.follow ? 'on' : 'off'}`} aria-label="Follow score" aria-pressed={props.follow}>
                        <span className="font-semibold">Follow</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
