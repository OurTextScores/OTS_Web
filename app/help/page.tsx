import Link from 'next/link';
import type { Metadata } from 'next';
import { shortcutEntries } from '../../components/toolbar/constants';

export const metadata: Metadata = {
    title: 'Help · OurTextScores Editor',
    description: 'How to edit scores in the OurTextScores web editor: the canvas, toolbar, Inspector, palettes, playback, and keyboard shortcuts.',
};

type Item = { term: string; detail: string };
type Section = { id: string; title: string; blurb: string; items: Item[] };

const sections: Section[] = [
    {
        id: 'canvas',
        title: 'The score canvas',
        blurb: 'Editing happens directly on the page — select something, then act on it with the toolbar, the Inspector, or the keyboard.',
        items: [
            { term: 'Select', detail: 'Click a note, rest, or element. Drag on empty space to rubber-band a range; click a measure to select it.' },
            { term: 'Drag to repitch', detail: 'Drag a selected notehead up or down to change its pitch. A preview follows the cursor — release to commit, Escape to cancel.' },
            { term: 'Note input', detail: 'Toggle note-input mode (the pencil, or press N) and click in a staff to place notes at the chosen duration.' },
            { term: 'Grips', detail: 'Double-click a slur, hairpin, or line to show its grips, then drag a grip to reshape or extend it.' },
            { term: 'Edit text in place', detail: 'Double-click a text element to edit it on the page. The editor stays at 100% regardless of zoom. Ctrl/Cmd + Enter saves, Escape cancels.' },
        ],
    },
    {
        id: 'notes',
        title: 'Notes, lines & chord marks',
        blurb: 'Durations, grace notes, voices, and the spanner and chord-mark menus live in the Notes row.',
        items: [
            { term: 'Lines', detail: 'Ottava (8va/8vb/15ma…), trill lines, and glissandos, applied across the selected note range. Created lines expose grips immediately.' },
            { term: 'Chord', detail: 'Arpeggios and single- or two-note tremolos. A two-note tremolo needs exactly two equal-duration chords in one voice.' },
            { term: 'Accidentals', detail: 'Sharp, flat, natural, double sharp, and double flat, drawn with notation-font glyphs. Applies to the selection or the note-input cursor.' },
        ],
    },
    {
        id: 'expression',
        title: 'Expression & articulations',
        blurb: 'Dynamics, hairpins, articulations, fermatas, breaths, pedals, and score text.',
        items: [
            { term: 'Articulations', detail: 'Staccato, tenuto, marcato, accent, and more, plus fermatas and breaths/caesuras grouped as Common and Other.' },
            { term: 'Dynamics & hairpins', detail: 'Insert dynamic marks and crescendo/diminuendo hairpins across the selection.' },
            { term: 'Pedal', detail: 'Pedal line and text variants, including sostenuto, una corda, and pedal change.' },
            { term: 'Text', detail: 'Title, staff, system, tempo, rehearsal, expression, fingering, sticking, lyrics, figured bass, and chord symbols.' },
        ],
    },
    {
        id: 'structure',
        title: 'Score structure & navigation',
        blurb: 'Instruments, key, clef, repeats, and playback navigation marks.',
        items: [
            { term: 'Key & Clef', detail: 'Set the key signature or clef, both drawn with notation-font glyphs. Clefs can also be dragged onto a measure.' },
            { term: 'Repeats', detail: 'Start/end repeats, repeat counts, barline types, and voltas.' },
            { term: 'Navigation', detail: 'Markers (segno, coda, fine, to coda) and jumps (D.C., D.S., and their al Fine/Coda variants). Defaults carry real playback targets, not just text.' },
            { term: 'Instruments & parts', detail: 'Add instruments, remove parts, and toggle per-part visibility.' },
        ],
    },
    {
        id: 'measures',
        title: 'Measures',
        blurb: 'Add, remove, and reshape bars.',
        items: [
            { term: 'Add / pickup bars', detail: 'Insert measures at the beginning, after the selection, or at the end, and add a pickup (anacrusis) measure.' },
            { term: 'Measure repeat & multi-bar rests', detail: 'Turn empty bars into 1-, 2-, or 4-bar repeats, and toggle multi-measure rests (see below).' },
            { term: 'Delete bars', detail: '“Delete Selected Bars” removes the measures in the selection; “Delete Trailing Empty Bars” trims empty measures from the end.' },
        ],
    },
    {
        id: 'panels',
        title: 'Side panels',
        blurb: 'All side panels live on the right edge. When collapsed they share one narrow strip of stacked, binder-style tabs — click a tab to open that panel, or use the Panels button in the View toolbar to hide them all and maximise the score.',
        items: [
            { term: 'Inspector', detail: 'Edits properties of the selection: visible, color, placement, horizontal/vertical offset (staff spaces), small, stem direction, and line style. Shows only the properties that apply, reports “Mixed” for a disagreeing multi-selection, and each change is a single undo step.' },
            { term: 'Fretboard editor', detail: 'Part of the Inspector: when a fret diagram is selected it shows a fret grid — set strings/frets, click a cell to toggle a fingering, and cycle the top row for open/muted strings.' },
            { term: 'MusicXML', detail: 'A live MusicXML editor for the score. Edit the XML and Apply, or Reload to pull the latest from the score.' },
            { term: 'AI Tools', detail: 'The Assistant, NotaGen, Transcoda, Chordify, Harmony, and MMA tools, each on its own tab.' },
            { term: 'History', detail: 'Local checkpoints and score versions. Save a checkpoint, then Restore, Compare, Rename, or Delete it.' },
        ],
    },
    {
        id: 'tools',
        title: 'Specialized & bulk tools',
        blurb: 'Fret diagrams, ambitus, and range operations, plus the floating palettes.',
        items: [
            { term: 'Fret diagrams & ambitus', detail: 'Add a fret diagram to a chord and edit it in the Inspector, or add an ambitus to a staff.' },
            { term: 'Explode / implode', detail: 'Explode spreads a range across staves; implode collapses it back.' },
            { term: 'Regroup & resequence', detail: 'Regroup rhythms in a range, or resequence rehearsal marks into order.' },
            { term: 'Palettes', detail: 'Open the floating, searchable palettes to browse elements by category and click to apply them to the selection.' },
        ],
    },
    {
        id: 'playback',
        title: 'Playback & export',
        blurb: 'Hear the score and get it out of the editor.',
        items: [
            { term: 'Playback', detail: 'Play the whole score or just the selection; navigation marks and repeats are followed during playback.' },
            { term: 'Export', detail: 'Save to MSCZ, MusicXML/MXL, MIDI, PDF, PNG, SVG, or audio.' },
        ],
    },
];

const tocEntries = [...sections.map(s => ({ id: s.id, title: s.title })), { id: 'shortcuts', title: 'Keyboard shortcuts' }];

function renderKbd(label: string) {
    // Split "Undo: Ctrl/Cmd + Z" into a term and its key chips.
    const [term, keys] = label.includes(':') ? [label.slice(0, label.indexOf(':')), label.slice(label.indexOf(':') + 1)] : [label, ''];
    const chips = keys.split(/\s*\+\s*/).map(s => s.trim()).filter(Boolean);
    return (
        <div className="flex flex-col gap-1.5 rounded-lg border border-slate-200 bg-white p-3">
            <span className="text-sm font-medium text-slate-800">{term}</span>
            <span className="flex flex-wrap gap-1">
                {chips.map((chip, i) => (
                    <kbd key={i} className="rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600 shadow-sm">{chip}</kbd>
                ))}
            </span>
        </div>
    );
}

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* Hero */}
            <header className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
                <div className="mx-auto flex max-w-5xl items-start justify-between gap-6 px-6 py-10">
                    <div>
                        <div className="mb-2 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">Editor guide</div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">OurTextScores Help</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                            A click-then-act editor: select something on the page, then apply a change from the toolbar, the Inspector,
                            or the keyboard. Every change is a single undoable step.
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="shrink-0 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        ← Back to editor
                    </Link>
                </div>
            </header>

            <div className="mx-auto flex max-w-5xl gap-10 px-6 py-10">
                {/* Sticky sidebar TOC */}
                <aside className="hidden shrink-0 lg:block" style={{ width: 208 }}>
                    <nav aria-label="Contents" className="sticky top-8">
                        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">On this page</div>
                        <ul className="space-y-1 border-l border-slate-200">
                            {tocEntries.map(entry => (
                                <li key={entry.id}>
                                    <a
                                        href={`#${entry.id}`}
                                        className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-sm text-slate-600 transition hover:border-blue-500 hover:text-blue-700"
                                    >
                                        {entry.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* Main content */}
                <main className="min-w-0 flex-1 space-y-12">
                    {sections.map((section, index) => (
                        <section key={section.id} id={section.id} className="scroll-mt-8">
                            <div className="mb-3 flex items-center gap-3">
                                <span style={{ width: 28, height: 28 }} className="flex shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{index + 1}</span>
                                <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
                            </div>
                            <p className="mb-5 text-sm leading-6 text-slate-600">{section.blurb}</p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {section.items.map(item => (
                                    <div key={item.term} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow">
                                        <div className="text-sm font-semibold text-slate-900">{item.term}</div>
                                        <p className="mt-1.5 text-sm leading-6 text-slate-600">{item.detail}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}

                    <section id="shortcuts" className="scroll-mt-8">
                        <div className="mb-3 flex items-center gap-3">
                            <span style={{ width: 28, height: 28 }} className="flex shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">⌘</span>
                            <h2 className="text-xl font-semibold text-slate-900">Keyboard shortcuts</h2>
                        </div>
                        <p className="mb-5 text-sm leading-6 text-slate-600">Also available under the toolbar’s Shortcuts button.</p>
                        <div className="grid gap-2.5 sm:grid-cols-2">
                            {shortcutEntries.map(entry => (
                                <div key={entry.label} title={entry.title}>{renderKbd(entry.label)}</div>
                            ))}
                        </div>
                    </section>

                    <footer className="border-t border-slate-200 pt-6 text-xs text-slate-400">
                        OurTextScores editor · built on the MuseScore 4 engine.
                    </footer>
                </main>
            </div>
        </div>
    );
}
