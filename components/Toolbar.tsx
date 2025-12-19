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
	onSetTimeSignature?: (numerator: number, denominator: number) => void;
	timeSignatureOptions?: { label: string; numerator: number; denominator: number }[];
	onSetTimeSignature44?: () => void; // legacy
	onSetTimeSignature34?: () => void; // legacy
	onSetKeySignature?: (fifths: number) => void;
	keySignatureOptions?: { label: string; fifths: number }[];
	onSetClef?: (clefType: number) => void;
	clefOptions?: { label: string; value: number }[];
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
	onSetTimeSignature,
	timeSignatureOptions,
	onSetTimeSignature44,
	onSetTimeSignature34,
	onSetKeySignature,
	keySignatureOptions,
	onSetClef,
	clefOptions,
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
	const signatureOptions = timeSignatureOptions ?? [
		{ label: '4/4', numerator: 4, denominator: 4 },
		{ label: '3/4', numerator: 3, denominator: 4 },
		{ label: '2/4', numerator: 2, denominator: 4 },
        { label: '2/2', numerator: 2, denominator: 2 },
        { label: '6/8', numerator: 6, denominator: 8 },
        { label: '3/8', numerator: 3, denominator: 8 },
        { label: '9/8', numerator: 9, denominator: 8 },
        { label: '12/8', numerator: 12, denominator: 8 },
        { label: '5/4', numerator: 5, denominator: 4 },
		{ label: '7/8', numerator: 7, denominator: 8 },
	];

	const keySignatureButtonOptions = keySignatureOptions ?? [
		{ label: 'Cb', fifths: -7 },
		{ label: 'Gb', fifths: -6 },
		{ label: 'Db', fifths: -5 },
		{ label: 'Ab', fifths: -4 },
		{ label: 'Eb', fifths: -3 },
		{ label: 'Bb', fifths: -2 },
		{ label: 'F', fifths: -1 },
		{ label: 'C', fifths: 0 },
		{ label: 'G', fifths: 1 },
		{ label: 'D', fifths: 2 },
		{ label: 'A', fifths: 3 },
		{ label: 'E', fifths: 4 },
		{ label: 'B', fifths: 5 },
		{ label: 'F#', fifths: 6 },
		{ label: 'C#', fifths: 7 },
	];

	const clefButtonOptions = clefOptions ?? [
		{ label: 'Treble', value: 0 },          // ClefType::G
		{ label: 'French Violin', value: 7 },   // ClefType::G_1
		{ label: 'Treble 15mb', value: 1 },     // ClefType::G15_MB
        { label: 'Treble 8vb', value: 2 },      // ClefType::G8_VB
        { label: 'Treble 8va', value: 3 },      // ClefType::G8_VA
        { label: 'Treble 15ma', value: 4 },     // ClefType::G15_MA
        { label: 'Treble 8vb (O)', value: 5 },  // ClefType::G8_VB_O
        { label: 'Treble 8vb (P)', value: 6 },  // ClefType::G8_VB_P
        { label: 'Soprano', value: 8 },         // ClefType::C1
        { label: 'Mezzo', value: 9 },           // ClefType::C2
        { label: 'Alto', value: 10 },           // ClefType::C3
        { label: 'Tenor', value: 11 },          // ClefType::C4
        { label: 'Baritone', value: 12 },       // ClefType::C5
        { label: 'C (19c)', value: 13 },        // ClefType::C_19C
        { label: 'C1 (F18c)', value: 14 },      // ClefType::C1_F18C
        { label: 'C3 (F18c)', value: 15 },      // ClefType::C3_F18C
        { label: 'C4 (F18c)', value: 16 },      // ClefType::C4_F18C
        { label: 'C1 (F20c)', value: 17 },      // ClefType::C1_F20C
        { label: 'C3 (F20c)', value: 18 },      // ClefType::C3_F20C
        { label: 'C4 (F20c)', value: 19 },      // ClefType::C4_F20C
        { label: 'Bass', value: 20 },           // ClefType::F
        { label: 'Bass 15mb', value: 21 },      // ClefType::F15_MB
        { label: 'Bass 8vb', value: 22 },       // ClefType::F8_VB
        { label: 'Bass 8va', value: 23 },       // ClefType::F_8VA
        { label: 'Bass 15ma', value: 24 },      // ClefType::F_15MA
        { label: 'F (B)', value: 25 },          // ClefType::F_B
        { label: 'F (C)', value: 26 },          // ClefType::F_C
        { label: 'F (F18c)', value: 27 },       // ClefType::F_F18C
        { label: 'F (19c)', value: 28 },        // ClefType::F_19C
        { label: 'Perc', value: 29 },           // ClefType::PERC
        { label: 'Perc 2', value: 30 },         // ClefType::PERC2
        { label: 'TAB', value: 31 },            // ClefType::TAB
        { label: 'TAB4', value: 32 },           // ClefType::TAB4
        { label: 'TAB Serif', value: 33 },      // ClefType::TAB_SERIF
        { label: 'TAB4 Serif', value: 34 },     // ClefType::TAB4_SERIF
    ];

    const dynamicOptions = [
        { label: 'pppppp', value: 1 }, // DynamicType::PPPPPP
        { label: 'ppppp', value: 2 },  // DynamicType::PPPPP
        { label: 'pppp', value: 3 },   // DynamicType::PPPP
        { label: 'ppp', value: 4 },    // DynamicType::PPP
        { label: 'pp', value: 5 },     // DynamicType::PP
        { label: 'p', value: 6 },      // DynamicType::P
        { label: 'mp', value: 7 },     // DynamicType::MP
        { label: 'mf', value: 8 },     // DynamicType::MF
        { label: 'f', value: 9 },      // DynamicType::F
        { label: 'ff', value: 10 },    // DynamicType::FF
        { label: 'fff', value: 11 },   // DynamicType::FFF
        { label: 'ffff', value: 12 },  // DynamicType::FFFF
        { label: 'fffff', value: 13 }, // DynamicType::FFFFF
        { label: 'ffffff', value: 14 }, // DynamicType::FFFFFF
        { label: 'fp', value: 15 },    // DynamicType::FP
        { label: 'pf', value: 16 },    // DynamicType::PF
        { label: 'sf', value: 17 },    // DynamicType::SF
        { label: 'sfz', value: 18 },   // DynamicType::SFZ
        { label: 'sff', value: 19 },   // DynamicType::SFF
        { label: 'sffz', value: 20 },  // DynamicType::SFFZ
        { label: 'sfp', value: 21 },   // DynamicType::SFP
        { label: 'sfpp', value: 22 },  // DynamicType::SFPP
        { label: 'rfz', value: 23 },   // DynamicType::RFZ
        { label: 'rf', value: 24 },    // DynamicType::RF
        { label: 'fz', value: 25 },    // DynamicType::FZ
        { label: 'm', value: 26 },     // DynamicType::M
        { label: 'r', value: 27 },     // DynamicType::R
        { label: 's', value: 28 },     // DynamicType::S
        { label: 'z', value: 29 },     // DynamicType::Z
        { label: 'n', value: 30 },     // DynamicType::N
    ];

    const resolveTimeSigHandler = (opt: { label: string; numerator: number; denominator: number }) => {
        if (onSetTimeSignature) {
            return () => onSetTimeSignature(opt.numerator, opt.denominator);
        }
        if (opt.label === '4/4') return onSetTimeSignature44;
        if (opt.label === '3/4') return onSetTimeSignature34;
        return undefined;
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-100 border-b border-gray-300">
	            <div className="flex items-center space-x-4">
	                <label className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
	                    Open Score
	                    <input
	                        data-testid="open-score-input"
	                        type="file"
	                        accept=".mscz,.xml,.musicxml"
	                        onChange={handleFileChange}
	                        className="hidden"
	                    />
	                </label>
	                <label className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer hover:bg-indigo-700">
	                    Load SoundFont
	                    <input
	                        data-testid="soundfont-input"
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
	                        data-testid="btn-delete"
	                        type="button"
	                        onClick={onDeleteSelection}
	                        disabled={mutationDisabled || !onDeleteSelection || !selectionActive}
	                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                    >
	                        Delete
	                    </button>
	                    <button
	                        data-testid="btn-undo"
	                        type="button"
	                        onClick={onUndo}
	                        disabled={mutationDisabled || !onUndo}
	                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                    >
	                        Undo
	                    </button>
	                    <button
	                        data-testid="btn-redo"
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
	                        data-testid="btn-pitch-down"
	                        type="button"
	                        onClick={onPitchDown}
	                        disabled={mutationDisabled || !onPitchDown || !selectionActive}
	                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                    >
	                        Pitch ↓
	                    </button>
	                    <button
	                        data-testid="btn-pitch-up"
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
	                        data-testid="btn-duration-shorter"
	                        type="button"
	                        onClick={onDurationShorter}
	                        disabled={mutationDisabled || !onDurationShorter || !selectionActive}
	                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                    >
	                        Shorter
	                    </button>
	                    <button
	                        data-testid="btn-duration-longer"
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
	                    data-testid="btn-export-svg"
	                    type="button"
	                    onClick={onExportSvg}
	                    disabled={!exportsEnabled || !onExportSvg}
	                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                >
	                    SVG
	                </button>
	                <button
	                    data-testid="btn-export-pdf"
	                    type="button"
	                    onClick={onExportPdf}
	                    disabled={!exportsEnabled || !onExportPdf}
	                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                >
	                    PDF
	                </button>
	                <button
	                    data-testid="btn-export-png"
	                    type="button"
	                    onClick={onExportPng}
	                    disabled={!exportsEnabled || !onExportPng || !pngAvailable}
	                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                >
	                    PNG
	                </button>
	                <button
	                    data-testid="btn-export-mxl"
	                    type="button"
	                    onClick={onExportMxl}
	                    disabled={!exportsEnabled || !onExportMxl}
	                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                >
	                    MXL
	                </button>
	                <button
	                    data-testid="btn-export-mscz"
	                    type="button"
	                    onClick={onExportMscz}
	                    disabled={!exportsEnabled || !onExportMscz}
	                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                >
	                    MSCZ
	                </button>
	                <button
	                    data-testid="btn-export-midi"
	                    type="button"
	                    onClick={onExportMidi}
	                    disabled={!exportsEnabled || !onExportMidi}
	                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                >
	                    MIDI
	                </button>
	                <button
	                    data-testid="btn-export-audio"
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
	                    data-testid="btn-zoom-out"
	                    type="button"
	                    onClick={onZoomOut}
	                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
	                >
	                    -
	                </button>
	                <span className="w-16 text-center">{(zoomLevel * 100).toFixed(0)}%</span>
	                <button
	                    data-testid="btn-zoom-in"
	                    onClick={onZoomIn}
	                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
	                >
	                    +
	                </button>
	            </div>

	            <div className="flex items-center space-x-2 text-sm">
	                <span className="text-gray-600">Playback:</span>
	                <button
	                    data-testid="btn-play"
	                    type="button"
	                    onClick={onPlayAudio}
	                    disabled={!audioAvailable || !onPlayAudio || audioBusy}
	                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                >
	                    {audioBusy ? 'Working…' : isPlaying ? 'Replay' : 'Play'}
	                </button>
	                <button
	                    data-testid="btn-stop"
	                    type="button"
	                    onClick={onStopAudio}
	                    disabled={!audioAvailable || !onStopAudio || audioBusy}
	                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                >
	                    Stop
	                </button>
	            </div>

		            <div className="flex flex-wrap items-center gap-2 text-sm">
		                <span className="text-gray-600">Signature:</span>
		                {signatureOptions.map(opt => {
		                    const handler = resolveTimeSigHandler(opt);
		                    return (
	                        <button
	                            key={opt.label}
	                            data-testid={`btn-timesig-${opt.numerator}-${opt.denominator}`}
	                            type="button"
	                            onClick={handler}
	                            disabled={mutationDisabled || !handler}
	                            className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                        >
                            {opt.label}
                        </button>
                    );
		                })}
		            </div>

		            <div className="flex flex-wrap items-center gap-2 text-sm">
		                <span className="text-gray-600">Key:</span>
		                {keySignatureButtonOptions.map(opt => (
		                    <button
		                        key={opt.fifths}
		                        data-testid={`btn-keysig-${opt.fifths}`}
		                        type="button"
		                        onClick={() => onSetKeySignature?.(opt.fifths)}
		                        disabled={mutationDisabled || !onSetKeySignature}
		                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
		                    >
		                        {opt.label}
		                    </button>
		                ))}
		            </div>

		            <div className="flex flex-wrap items-center gap-2 text-sm">
		                <span className="text-gray-600">Clef:</span>
		                {clefButtonOptions.map(opt => (
		                    <button
	                        key={opt.value}
	                        data-testid={`btn-clef-${opt.value}`}
	                        type="button"
	                        onClick={() => onSetClef?.(opt.value)}
	                        disabled={mutationDisabled || !onSetClef}
	                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                    >
                        {opt.label}
                    </button>
                ))}
            </div>

	            <div className="flex items-center space-x-2 text-sm">
	                <span className="text-gray-600">Rhythm/Voice:</span>
	                <button
	                    data-testid="btn-dot"
	                    type="button"
	                    onClick={onToggleDot}
	                    disabled={mutationDisabled || !selectionActive || !onToggleDot}
	                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                >
	                    Dot
	                </button>
	                <button
	                    data-testid="btn-double-dot"
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
	                        data-testid={`btn-voice-${v}`}
	                        type="button"
	                        onClick={() => onSetVoice?.(v - 1)}
	                        disabled={mutationDisabled || !onSetVoice}
	                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                    >
                        Voice {v}
                    </button>
                ))}
            </div>

	            <div className="flex flex-wrap items-center gap-2 text-sm">
	                <span className="text-gray-600">Markings:</span>
	                {dynamicOptions.map(opt => (
	                    <button
	                        key={opt.label}
	                        data-testid={`btn-dynamic-${opt.value}`}
	                        type="button"
	                        onClick={() => onAddDynamic?.(opt.value)}
	                        disabled={mutationDisabled || !selectionActive || !onAddDynamic}
	                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                    >
	                        {opt.label}
	                    </button>
	                ))}
	                <button
	                    data-testid="btn-rehearsal"
	                    type="button"
	                    onClick={onAddRehearsalMark}
	                    disabled={mutationDisabled || !selectionActive || !onAddRehearsalMark}
	                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                >
	                    Rehearsal
	                </button>
	                <button
	                    data-testid="btn-tempo-120"
	                    type="button"
	                    onClick={() => onAddTempoText?.(120)}
	                    disabled={mutationDisabled || !onAddTempoText}
	                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
	                >
	                    Tempo 120
	                </button>
            </div>
        </div>
    );
};
