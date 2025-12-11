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
    exportsEnabled?: boolean;
    pngAvailable?: boolean;
    audioAvailable?: boolean;
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
    exportsEnabled = false,
    pngAvailable = false,
    audioAvailable = false
}) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileUpload(file);
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
                        disabled={mutationDisabled || !onPitchDown}
                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Pitch ↓
                    </button>
                    <button
                        type="button"
                        onClick={onPitchUp}
                        disabled={mutationDisabled || !onPitchUp}
                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Pitch ↑
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={onDurationShorter}
                        disabled={mutationDisabled || !onDurationShorter}
                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Shorter
                    </button>
                    <button
                        type="button"
                        onClick={onDurationLonger}
                        disabled={mutationDisabled || !onDurationLonger}
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
                    disabled={!exportsEnabled || !onExportAudio || !audioAvailable}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    WAV
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
        </div>
    );
};
