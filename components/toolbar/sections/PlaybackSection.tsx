import React from 'react';
import { Button } from '../../ui/Button';
import { ToolbarSectionProps } from '../types';
import { Play, Square } from 'lucide-react';

export const PlaybackSection: React.FC<ToolbarSectionProps> = ({
    onPlayAudio,
    onPlayCurrentPageAudio,
    onPlayFromSelectionAudio,
    onStopAudio,
    audioAvailable,
    audioBusy,
    isPlaying,
    selectionActive,
}) => {
    return (
        <>
            <Button
                data-testid="btn-play"
                onClick={onPlayAudio}
                disabled={!audioAvailable || !onPlayAudio || audioBusy || isPlaying}
                variant="primary"
                size="sm"
                className="shadow-sm"
                title="Play (full transport)"
            >
                <Play size={14} className="mr-2" />
                {isPlaying ? 'Playing…' : 'Play'}
            </Button>
            <Button
                data-testid="btn-play-current-page"
                onClick={onPlayCurrentPageAudio}
                disabled={!audioAvailable || !onPlayCurrentPageAudio || audioBusy}
                variant="primary"
                size="sm"
                className="shadow-sm bg-green-600 hover:bg-green-700 border-green-600"
            >
                <Play size={14} className="mr-2" />
                {audioBusy ? 'Working…' : 'Play Page'}
            </Button>
            <Button
                data-testid="btn-play-from-selection"
                onClick={onPlayFromSelectionAudio}
                disabled={!audioAvailable || !onPlayFromSelectionAudio || !selectionActive || audioBusy}
                variant="outline"
                size="sm"
                className="shadow-sm"
            >
                <Play size={14} className="mr-2" />
                Play From Selection
            </Button>
            <Button
                data-testid="btn-stop"
                onClick={onStopAudio}
                disabled={!audioAvailable || !onStopAudio}
                variant="outline"
                size="sm"
                className="shadow-sm"
                title="Stop"
            >
                <Square size={14} className="mr-2" />
                Stop
            </Button>
        </>
    );
};
