import React from 'react';

interface ToolbarProps {
    onFileUpload: (file: File) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    zoomLevel: number;
    onDeleteSelection?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    onPitchUp?: () => void;
    onPitchDown?: () => void;
    onDurationLonger?: () => void;
    onDurationShorter?: () => void;
    mutationsEnabled?: boolean;
    selectionActive?: boolean;
    onExportSvg?: () => void;
    onExportPdf?: () => void;
    onExportPng?: () => void;
    onExportMxl?: () => void;
    onExportMscz?: () => void;
    onExportMidi?: () => void;
    onExportAudio?: () => void;
    onSoundFontUpload?: (file: File) => void;
    exportsEnabled?: boolean;
    pngAvailable?: boolean;
    audioAvailable?: boolean;
    onPlayAudio?: () => void;
    onStopAudio?: () => void;
    isPlaying?: boolean;
    audioBusy?: boolean;
    onSetTimeSignature44?: () => void;
    onSetTimeSignature34?: () => void;
    onSetClefTreble?: () => void;
    onSetClefBass?: () => void;
    onToggleDot?: () => void;
    onToggleDoubleDot?: () => void;
    onSetVoice?: (voiceIndex: number) => void;
    onAddDynamic?: (dynamicType: number) => void;
    onAddRehearsalMark?: () => void;
    onAddTempoText?: (bpm: number) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    onFileUpload,
    onZoomIn,
    onZoomOut,
    zoomLevel,
    onDeleteSelection,
    onUndo,
    onRedo,
    onPitchUp,
    onPitchDown,
    onDurationLonger,
    onDurationShorter,
    mutationsEnabled = false,
    selectionActive = false,
    onExportSvg,
    onExportPdf,
    onExportPng,
    onExportMxl,
    onExportMscz,
    onExportMidi,
    onExportAudio,
    onSoundFontUpload,
    exportsEnabled = false,
    pngAvailable = false,
    audioAvailable = false,
    onPlayAudio,
    onStopAudio,
    isPlaying = false,
    audioBusy = false,
    onSetTimeSignature44,
    onSetTimeSignature34,
    onSetClefTreble,
    onSetClefBass,
    onToggleDot,
    onToggleDoubleDot,
    onSetVoice,
    onAddDynamic,
    onAddRehearsalMark,
    onAddTempoText
}) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    };
    const handleSoundFontChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && onSoundFontUpload) {
            onSoundFontUpload(file);
        }
    };

    const mutationDisabled = !mutationsEnabled;

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-100 border-b border-gray-300">
            <div className="flex items-center space-x-4">
                <label className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
                    Open Score
                    <input
                        type="file"
                        accept=".mscz,.xml,.musicxml"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
                <label className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer hover:bg-indigo-700">
                    Load SoundFont
                    <input
                        type="file"
                        accept=".sf2,.sf3"
                        onChange={handleSoundFontChange}
                        className="hidden"
                    />
                </label>
            </div>

            <div className="flex items-center flex-wrap gap-2 text-sm">
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={onDeleteSelection}
                        disabled={mutationDisabled || !onDeleteSelection || !selectionActive}
                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Delete
                    </button>
                    <button
                        type="button"
                        onClick={onUndo}
                        disabled={mutationDisabled || !onUndo}
                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Undo
                    </button>
                    <button
                        type="button"
                        onClick={onRedo}
                        disabled={mutationDisabled || !onRedo}
                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Redo
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={onPitchDown}
                        disabled={mutationDisabled || !onPitchDown || !selectionActive}
                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Pitch ↓
                    </button>
                    <button
                        type="button"
                        onClick={onPitchUp}
                        disabled={mutationDisabled || !onPitchUp || !selectionActive}
                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Pitch ↑
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={onDurationShorter}
                        disabled={mutationDisabled || !onDurationShorter || !selectionActive}
                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Shorter
                    </button>
                    <button
                        type="button"
                        onClick={onDurationLonger}
                        disabled={mutationDisabled || !onDurationLonger || !selectionActive}
                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Longer
                    </button>
                </div>
            </div>

            <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Export:</span>
                <button
                    type="button"
                    onClick={onExportSvg}
                    disabled={!exportsEnabled || !onExportSvg}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    SVG
                </button>
                <button
                    type="button"
                    onClick={onExportPdf}
                    disabled={!exportsEnabled || !onExportPdf}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    PDF
                </button>
                <button
                    type="button"
                    onClick={onExportPng}
                    disabled={!exportsEnabled || !onExportPng || !pngAvailable}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    PNG
                </button>
                <button
                    type="button"
                    onClick={onExportMxl}
                    disabled={!exportsEnabled || !onExportMxl}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    MXL
                </button>
                <button
                    type="button"
                    onClick={onExportMscz}
                    disabled={!exportsEnabled || !onExportMscz}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    MSCZ
                </button>
                <button
                    type="button"
                    onClick={onExportMidi}
                    disabled={!exportsEnabled || !onExportMidi}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    MIDI
                </button>
                <button
                    type="button"
                    onClick={onExportAudio}
                    disabled={!exportsEnabled || !onExportAudio || !audioAvailable || audioBusy}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {audioBusy ? 'Exporting…' : 'WAV'}
                </button>
            </div>

            <div className="flex items-center space-x-2 text-sm">
                <button
                    type="button"
                    onClick={onZoomOut}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                >
                    -
                </button>
                <span className="w-16 text-center">{(zoomLevel * 100).toFixed(0)}%</span>
                <button
                    onClick={onZoomIn}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                >
                    +
                </button>
            </div>

            <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Playback:</span>
                <button
                    type="button"
                    onClick={onPlayAudio}
                    disabled={!audioAvailable || !onPlayAudio || audioBusy}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {audioBusy ? 'Working…' : isPlaying ? 'Replay' : 'Play'}
                </button>
                <button
                    type="button"
                    onClick={onStopAudio}
                    disabled={!audioAvailable || !onStopAudio || audioBusy}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Stop
                </button>
            </div>

            <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Signature:</span>
                <button
                    type="button"
                    onClick={onSetTimeSignature44}
                    disabled={mutationDisabled || !onSetTimeSignature44}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    4/4
                </button>
                <button
                    type="button"
                    onClick={onSetTimeSignature34}
                    disabled={mutationDisabled || !onSetTimeSignature34}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    3/4
                </button>
                <button
                    type="button"
                    onClick={onSetClefTreble}
                    disabled={mutationDisabled || !onSetClefTreble}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Treble
                </button>
                <button
                    type="button"
                    onClick={onSetClefBass}
                    disabled={mutationDisabled || !onSetClefBass}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Bass
                </button>
            </div>

            <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Rhythm/Voice:</span>
                <button
                    type="button"
                    onClick={onToggleDot}
                    disabled={mutationDisabled || !selectionActive || !onToggleDot}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Dot
                </button>
                <button
                    type="button"
                    onClick={onToggleDoubleDot}
                    disabled={mutationDisabled || !selectionActive || !onToggleDoubleDot}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Double Dot
                </button>
                {[1, 2, 3, 4].map(v => (
                    <button
                        key={v}
                        type="button"
                        onClick={() => onSetVoice?.(v - 1)}
                        disabled={mutationDisabled || !onSetVoice}
                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Voice {v}
                    </button>
                ))}
            </div>

            <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Markings:</span>
                <button
                    type="button"
                    onClick={() => onAddDynamic?.(0 /* DynamicType::P */)}
                    disabled={mutationDisabled || !selectionActive || !onAddDynamic}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Dynamic (p)
                </button>
                <button
                    type="button"
                    onClick={onAddRehearsalMark}
                    disabled={mutationDisabled || !selectionActive || !onAddRehearsalMark}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Rehearsal
                </button>
                <button
                    type="button"
                    onClick={() => onAddTempoText?.(120)}
                    disabled={mutationDisabled || !selectionActive || !onAddTempoText}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Tempo 120
                </button>
            </div>
        </div>
    );
};
