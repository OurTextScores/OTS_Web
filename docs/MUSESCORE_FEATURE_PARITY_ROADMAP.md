# MuseScore → OTS_WebEditor Feature Parity Roadmap

**Date:** 2026-07-02
**Compared against:** upstream MuseScore master (4.6.0 dev, `jhlusko/musescore`) and the MuseScore 4.x desktop feature set.
**Companion docs:** `docs/WASM_MUSESCORE4_UPGRADE.md` (file-format upgrade path), `docs/SECURITY_CORRECTNESS_FINDINGS.md` (issues found during this survey).

---

## 1. Where We Are Today

The web editor is further along than a casual comparison suggests. The webmscore fork (MuseScore 4.00 engine) exposes **~135 `EMSCRIPTEN_KEEPALIVE` exports** in `webmscore-fork/web/main.cpp`, and the app already covers:

| Area | Status |
|---|---|
| Load MSCZ / MSCX / MusicXML / MXL (incl. 4.x container detection) | ✅ |
| SVG render, zoom/pan, progressive page layout for large scores | ✅ |
| Click selection (element, measure, text; mode-aware `selectElementAtPointWithMode`) | ✅ |
| Rubber-band (lasso-style) drag **selection** in JS | ✅ (JS-side rect + WASM reselect) |
| Keyboard editing: pitch up/down, octave transpose, durations 1–8, dot, accidentals, ties, rests, note letters C–B, arrow navigation, shift-extend, delete, undo/redo, copy/paste | ✅ |
| Note/rest mutation: `addPitchByStep`, `addNoteFromRest`, `enterRest`, voices, tuplets, grace notes, flip stem | ✅ |
| Text: title/subtitle/composer/lyricist, staff/system/tempo/rehearsal/expression/fingering/sticking/lyrics/figured bass/harmony (chord symbols), `setSelectedText` | ✅ |
| Lines & marks: slur, tie, hairpin, pedal (incl. sostenuto/una corda, split), volta, dynamics, articulations | ✅ |
| Structure: insert/remove measures, pickup measure, barlines, repeats + repeat count, line/page breaks, clefs (35 types), key/time signatures, transpose dialog | ✅ |
| Parts: `appendPart` (incl. by MusicXML id), `removePart`, `generateExcerpts`, per-part visibility | ✅ |
| Playback: synth to WAV, measure-range and selection playback, soundfont CDN | ✅ |
| Export: MSCZ, MusicXML/MXL, MIDI, PDF, PNG, SVG, audio, positions | ✅ |
| Undo/redo (engine-level `startCmd`/`endCmd` on every mutation) | ✅ |
| Beyond desktop MuseScore: XML diff/compare view, checkpoints, AI patch flows, MMA/harmony analysis, OMR | ✅ (web-native surplus) |

The biggest structural difference from desktop MuseScore is **interaction depth**: MuseScore's canvas is a live editing surface (drag, grips, drop, in-place text, note-input cursor), while the web editor is currently *select-then-press-a-button*. Closing that gap is where the value is — starting, as requested, with click-and-drag note editing.

---

## 2. Priority 0 — Direct Manipulation (the interaction core)

### 2.1 Click-and-drag note editing ⭐ *highest value, do first*

**Good news: the hard part already exists in the fork's engine.** MuseScore 4.00's engraving layer ships complete drag semantics, compiled into our WASM but never exposed:

- `Note::startDrag / drag / endDrag` — `webmscore-fork/src/engraving/libmscore/note.cpp:2806`
  - Vertical drag → `EditMode_ChangePitch` (with correct tpc/accidental handling, tied-note propagation)
  - Horizontal drag → `EditMode_AddSpacing` (leading space)
- `EngravingItem::startDrag / drag / endDrag` — generic offset dragging for *any* element (dynamics, text, articulations…) — `engravingitem.cpp:2068`
- `NoteEditData` snapshots `PITCH/TPC1/TPC2/FRET/STRING` for clean undo.

**Upstream reference implementation** (what the desktop wraps around those primitives): `NotationInteraction::startDrag / drag / doEndDrag` in `MuseScore/src/notation/internal/notationinteraction.cpp:1063–1246`. Key behaviors to replicate: build `ElementGroup`s from the selection (`EngravingItem::getDragGroup`), maintain one `EditData` across the gesture (`pos`, `delta`, `evtDelta`, `moveDelta`, modifiers), constrain axis (`DragMode::OnlyX/OnlyY`), wrap the whole gesture in one undoable command.

**Proposed WASM API** (three exports, gesture-scoped):

```
bool  beginElementDrag(scorePtr, page, x, y, excerptId)   // hit-test; if a draggable element is at point,
                                                          // startCmd() + startDrag() on its drag group
bool  updateElementDrag(scorePtr, x, y, modifiers, dragMode) // fill EditData deltas, call group->drag(ed), relayout
bool  endElementDrag(scorePtr, commit)                    // group->endDrag(ed); endCmd() or rollback()
```

Follow the established 6-layer bridge chain from `AGENTS.md`:
`web/main.cpp` → `web-public/src/index.js` → `web-public/src/worker-helper.js` → `lib/webmscore-loader.ts` → `components/ScoreEditor.tsx` (→ toolbar if needed).

**Frontend wiring.** `handleScorePointerDown` (`components/ScoreEditor.tsx:12347`) currently always starts a rubber-band selection. Change to:

1. On pointer-down, hit-test (cheap WASM call or reuse existing selection boxes). If the point is on a **note or draggable element** → element-drag mode; else → existing lasso mode. (This mirrors desktop behavior: empty-canvas drag = lasso, element drag = move.)
2. During element drag, past the existing 4px threshold: call `updateElementDrag` throttled to `requestAnimationFrame`, re-render the affected page.
3. On pointer-up: `endElementDrag(commit=true)`; Escape or pointer-cancel: `endElementDrag(commit=false)` (engine rollback keeps undo stack clean).

**Performance strategy (the real risk).** Desktop repaints incrementally; we re-serialize a full SVG page per frame. Recommended phasing:

- **MVP (ghost-drag):** on drag, draw a JS overlay "ghost" notehead that snaps to staff lines/spaces (staff geometry derivable from the note's selection box + `spatium`), show the target pitch in a tooltip, and on release make **one** WASM call (`updateElementDrag` + `endElementDrag`, or even just existing `pitchUp/pitchDown` × N). One relayout per gesture. This ships drag-to-repitch quickly with perfect fidelity on commit.
- **v2 (live engine drag):** call `updateElementDrag` per animation frame and re-render only the current page (`layoutUntilPage` already exists). Measure; large scores may need `saveSvg` region variants or a raster preview page.
- **v3:** generic element offset drag (dynamics, text, hairpin segments) using the same three exports — the engine side is already generic.

**Effort:** MVP ~1 week; live drag +1–2 weeks. **Files:** the 6-layer chain above; no engine-source changes required for notes.

### 2.2 Note-input mode with click-to-place ("N" mode)

`setNoteEntryMode` / `setNoteEntryMethod` / `setInputDurationType` / `setInputAccidentalType` / `toggleInputDot` are **already exported but unused by the app** (`grep noteEntry components/ScoreEditor.tsx` → only the type union). Desktop MuseScore's core loop — press N, shadow note follows cursor, click places a note, input cursor advances — is absent.

- Wire a note-input toolbar toggle + `N` shortcut to `setNoteEntryMode(true)`.
- Click in a staff during input → place note at position (needs a small export: `putNote(page, x, y)` wrapping `Score::putNote`, which exists in the 4.00 engine).
- Shadow-note preview can start as a JS overlay (same staff-snapping math as drag MVP); the engine's `ShadowNote` element can come later.
- Repitch / rhythm / insert methods are selectable via the already-exported `setNoteEntryMethod`.

**Effort:** ~1–2 weeks. Pairs naturally with 2.1 (shares the staff-coordinate snapping code).

### 2.3 Grip editing for spanners (slurs, hairpins, lines)

Desktop double-click/edit mode shows grips; dragging a grip reshapes the slur or extends the hairpin (`editDrag` per element; upstream `NotationInteraction` grip plumbing at the same reference site). Engine support (`EngravingItem::gripsCount/gripsPositions/editDrag`) is in the fork.

- Exports: `startEditElement()`, `gripCount()/gripPositions()` (JSON), `dragGrip(idx, dx, dy)`, `endEditElement(commit)`.
- UI: render grip squares as overlay; reuse the pointer state machine from 2.1.

**Effort:** ~2 weeks. Do after 2.1 so the gesture plumbing exists.

### 2.4 Drag-and-drop apply (palette-style)

Dropping an element onto a target (clef onto measure, dynamic onto note) is `EngravingItem::drop(EditData)` in the engine. A single export `applyDropAtPoint(page, x, y, elementType, subtype)` unlocks palette-like interactions without building the full palette system. **Effort:** ~1 week for a useful subset.

---

## 3. Priority 1 — Editing breadth (bridge + toolbar gaps)

Missing from the WASM bridge entirely (verified by grep of `main.cpp` exports); each is mostly a thin `startCmd`/apply/`endCmd` wrapper like the ~30 existing "add*" exports:

| Feature | Engine support in fork | Est. |
|---|---|---|
| Ottava lines (8va/8vb/15ma…) | ✅ `Ottava` | S |
| Glissando / slides | ✅ | S |
| Trill + ornament lines, ornament articulations | ✅ | S |
| Arpeggio / strum | ✅ | S |
| Tremolo (single/double) | ✅ | S |
| Breath / caesura | ✅ | S |
| Fermata (element, not articulation, in 4.x) | ✅ | S |
| Jumps & markers (D.C., D.S., Segno, Coda, Fine) | ✅ | S |
| Fret diagrams | ✅ (reader recently fixed) | M |
| Notehead schemes/groups | ✅ | S |
| Beam controls (join/break/feather) | ✅ | M |
| Ambitus, measure repeats, multi-measure rests toggle | ✅ | M |
| Explode/implode, regroup rhythms, resequence rehearsal marks (tools menu) | partial | M |

Also in this tier:

- **In-place text editing.** `setSelectedText` replaces a whole string via dialog; desktop edits text on-canvas with cursor/formatting. A pragmatic web approach: absolutely-positioned HTML `contenteditable` overlay on the text element's bbox, committed through `setSelectedText` (later: rich formatting via `TextBase` editing exports). **M**
- **Properties / Inspector panel.** Desktop's inspector is per-element property editing. One generic pair of exports — `getElementProperties()` → JSON of `Pid` values for the selection, `setElementProperty(pid, value)` — unlocks offsets, visibility, color, small-note, stem direction, etc., with a React panel on top. High leverage. **M–L**
- **Selection filter** (exclude voices/element types from range selections) — engine `SelectionFilter` exists. **S–M**
- **Palettes UI** (searchable, categorized) — pure frontend once 2.4 exists; can be data-driven from a JSON manifest instead of porting the QML palette module. **L**

---

## 4. Priority 2 — Format fidelity (extends `WASM_MUSESCORE4_UPGRADE.md`)

Status check against that doc's recommendations:

- ✅ `<harmonyInfo>` reader backported (`harmony.cpp:358`).
- ✅ MSCZ vs MXL container detection fixed (commit `54efae7a`).
- ⏳ `MSCVERSION` still `400` (`mscore.h:32`); 4.7 files load only because `ignoreVersionError=true`, and unknown tags are **silently dropped** — an editing round-trip through the web editor can lose newer-format data.

Recommended next steps, in order:

1. **Corpus test harness:** collect 4.1/4.2/4.4/4.6/4.7 sample scores; automated load → save → reload → SVG-diff. This converts "silently drops unknown tags" into a measurable list.
2. **Backport high-frequency readers** revealed by the corpus (known 4.1–4.7 format changes: dynamics/expression split, `<capo>`, harp pedal diagrams, guitar bends 4.2 model, ornament intervals, tie/laissez-vibrer changes, system-lock/`<SystemLocks>` in 4.6).
3. **Write-side versioning decision:** either keep writing 4.00 format (safe with current engine) and document it, or bump targeted writers with readers.
4. **Option B resync note:** upstream master now carries **real Qt6/Emscripten WASM plumbing** (`OS_IS_WASM`/`CC_IS_EMSCRIPTEN` branches in `src/app/CMakeLists.txt`, `src/wasmtest/`). A resync to a 4.6.x tag is likely cheaper today than the 3–6-week estimate in the upgrade doc assumed, and would erase the whole backport treadmill. Worth a 2–3 day build spike before investing further in step 2 beyond the top few readers.

---

## 5. Priority 3 — Playback & workflow depth

| Feature | Notes | Est. |
|---|---|---|
| Mixer (per-part volume/pan/mute/solo) | Engine synth is already per-score; needs channel-level exports + panel UI | M |
| Metronome, count-in | Synthesize click track in JS against `savePositions` timing data (already exported) — no engine change | S–M |
| Loop playback / play from selection | `selectionPlaybackStartTime` + measure-range synth already exist; UI work | S |
| Swing playback | Engine style setting; export a style setter | S |
| Continuous/single-page view | `getLayoutMode`/`setLayoutMode` already exported — likely just UI | S |
| Timeline / navigator panel | Frontend over `measureRangeForPage` + positions data | M |
| Parts (excerpt) tabs UI | Excerpt exports exist (`excerptId` threads through every call already); needs tabbed UI | M |
| Image capture (export selection as PNG/SVG) | `getSelectionBoundingBoxes` + crop of existing exports | S |
| Style dialog (engraving style presets) | Generic style get/set export + curated UI subset | M–L |
| Album/plugins/VST/Muse Sounds | Out of scope for WASM parity | — |

---

## 6. Suggested Sequence (quarters are indicative)

1. **Now:** 2.1 drag-to-repitch MVP (ghost drag) → immediately the most visible parity win.
2. **Next 4–6 weeks:** 2.2 note-input mode; 2.1 v2 live drag; format corpus harness (§4.1).
3. **Following:** 2.3 grips, 2.4 drop API + minimal palette; P1 bridge gap batch (ottava/gliss/trill/tremolo/arpeggio/fermata/jumps are each small).
4. **Then:** Inspector panel (§3), selection filter; Option B resync spike (§4.4) to decide backport-vs-resync.
5. **Ongoing:** P3 playback/workflow items as product pull dictates.

**Cross-cutting guardrails:** keep every new mutation inside `startCmd`/`endCmd` (undo integrity — already the codebase convention); add a Playwright interaction test per gesture (pointer-event simulation over the SVG); update all 6 bridge layers per `AGENTS.md` checklist for every new export.
