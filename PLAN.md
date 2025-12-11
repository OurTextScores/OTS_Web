# PHASE 0 — Maintain libmscore (WASM) as the Engraving Backbone

## High-Level Goal

Phase 0 aims to produce a functional, browser-based musical score editor as quickly as possible by using MuseScore’s existing engraving engine (libmscore) compiled to WebAssembly. The intention is to avoid implementing any layout or rendering logic in this phase, allowing rapid iteration on web UI, workflows, collaboration models, and AST handling.

This phase is explicitly designed to unblock product development while deferring all nonessential complexity (layout engines, custom renderers, constraint solvers) to later phases.

**The output should be a working editor where scores load, render, and respond to user input.**

## Core Principle: Reuse Maximum Functionality From libmscore

`libmscore` is MuseScore’s internal engraving engine and score model. When compiled to WASM (via the existing “webmscore” project), it can run entirely in the browser.

Phase 0 deliberately relies heavily on this engine for:
*   Parsing MSCZ/MusicXML input
*   Semantic model creation (MuseScore AST)
*   Layout (spacing, collisions, beaming, slurs, ties)
*   Rendering to SVG

The key design constraint in Phase 0 is:
**Do not re-implement anything that libmscore already provides unless absolutely necessary.**

This allows the editor to ship early in a stable form.

## Primary Capabilities Required in Phase 0

Future phases will gradually replace libmscore, but for Phase 0 the system must be able to:

### 1. Load Scores in the Browser
*   Accept MSCZ (MuseScore compressed scores)
*   Accept MusicXML files
*   Pass raw data to webmscore for parsing
*   **Output:** A MuseScore AST object residing on the WASM side.

### 2. Render the Score to SVG
*   Use webmscore’s built-in APIs for layout → SVG generation
*   Inject resulting SVG into the web framework (React, Vue, Svelte, etc.)
*   This produces a visually correct, fully engraved score without implementing layout code.

### 3. Display the Rendered Score in a Browser UI
*   Wrap the generated SVG in an interactive component
*   Support zoom, pan, scrolling
*   Attach hit-testing overlays or coordinate mapping
*   This is the beginning of the web-native editor UI.

### 4. Enable Note/Element Selection
*   Use either:
    *   SVG event listeners, or
    *   Hit-test queries via webmscore
*   Highlight selected notes, rests, measures, slurs, etc.
*   Selection is the foundation for editing operations.

### 5. Manipulate the Score Through JS→WASM API Calls
This is the critical bridge. You must expose (or wrap) WASM-side functions for:
*   Altering pitches
*   Changing durations
*   Inserting/deleting notes or measures
*   Adding articulations
*   Modifying clefs/time signatures
*   Toggling accidentals, ties, slurs

All of these mutate the internal MuseScore AST stored in WASM memory. Each mutation triggers a:
1.  WASM AST update
2.  Re-layout
3.  Re-render → SVG
4.  UI refresh

### 6. Implement Undo/Redo
High-level requirement:
*   Capture semantic operations (not DOM diffs)
*   Store a linear or branchable history of AST-level intentions
*   Since the renderer re-generates SVG each time, undo/redo is implemented at the model level.

### 7. Handle Semantic Diff/Merge
For multi-user collaboration and version control:
*   Serialize MuseScore AST → JSON-like neutral format (Phase 1 formalizes this)
*   Compute diff between versions
*   Merge changes where possible
*   Phase 0 provides the API skeleton for diff/merge, even if a clean AST format is finalized later.

### 8. Primary Focus: Web Editor UX
Because engraving is fully delegated to WASM, Phase 0 developer effort must concentrate on:
*   UI layout and ergonomics
*   Responsiveness
*   Interactions with SVG
*   Navigation
*   Visual feedback for editing
*   Selection logic
*   File loading/saving
*   Basic toolbars (note duration palette, accidentals, etc.)

This ensures rapid end-to-end functionality.

## Architecture Overview (High-Level)

```mermaid
graph TD
    UI[Web UI (React / Vue / Svelte)] -->|JS-WASM Bridge (API wrappers)| WASM
    WASM[webmscore (WASM)] -->|SVG output| SVGView
    
    subgraph WASM_Container [webmscore (WASM)]
        direction TB
        Engine[MuseScore engine compiled to WebAssembly]
        Parsing[Parsing (MSCZ/MusicXML → AST)]
        Engraving[Full engraving/layout]
        Rendering[SVG rendering]
        AST[Internal AST storage]
    end

    subgraph UI_Container [Web UI]
        SVGView[SVG-based Score View (DOM <svg>, event listeners)]
    end
```

**Key design features:**
*   Rendering is one-way (webmscore → SVG → UI)
*   Editing is command-based (UI → WASM mutation → re-render)
*   Undo/redo uses semantic commands, not diffing SVG
*   All complex music theory/layout logic lives inside WASM

## Technical Constraints and Considerations

### 1. Licensing
*   libmscore is GPL; Phase 0 cannot be shipped as a closed-source browser product if WASM is client-side.
*   Server-only engraving (fallback mode) avoids this, but Phase 0 assumes client-side WASM for fastest development.

### 2. Performance
*   WASM execution is fast enough for full re-layout on each change.
*   SVG injection is cheap because:
    *   SVG is static
    *   Rendering happens only when the AST changes.

### 3. State Management
*   Keep WASM AST as the single source of truth.
*   UI state mirrors selections, cursors, tools, etc.
*   Use a unidirectional data flow model.

### 4. Editor Extensibility
Phase 0 must leave space for:
*   Custom AST
*   Custom layout engine
*   Incremental rendering
*   Future ML modules
*   Multi-user collaboration

The system is designed so that libmscore can be swapped out later without rewriting the UI.

## Deliverables Expected From Phase 0

1.  **Load-and-render pipeline:**
    *   [x] MSCZ or MusicXML → WASM → SVG → UI
2.  **Basic editor UI:**
    *   [ ] Note selection and highlighting
    *   [x] Zoom/pan/scroll
    *   [ ] Basic editing tools (pitch change, duration change)
3.  **AST mutation layer (via WASM bridge):**
    *   [ ] A JS API that issues commands to mutate the score in WASM.
4.  **Undo/redo manager:**
    *   [ ] Command-based
    *   [ ] Replays semantic operations, not SVG diffs
5.  **Diff/merge prototype:**
    *   [ ] Basic abstractions for versioning AST snapshots
6.  **Stable UX foundation:**
    *   [x] Panels, toolbars, keyboard shortcuts (Basic Toolbar implemented)
    *   [x] React/Vue/Svelte state management
    *   [ ] Components for systems, measures, notes
7.  **Documentation of public APIs for Phase 1 integration:**
    *   [ ] AST access layer
    *   [ ] Layout/render triggers
    *   [ ] Selection model
    *   [ ] Mutation commands

## Guiding Principles for Phase 0

*   **Velocity > optimality.** The goal is to produce a functioning editor quickly.
*   **Do not prematurely replace the engraver.** libmscore is used as-is for now.
*   **Keep architecture modular.** All APIs should be designed so that future phases can replace libmscore with a web-native engine.
*   **Focus on UX and workflow correctness.** Rendering can be replaced later; UX cannot.
*   **Don’t over-engineer the AST format yet.** But prepare a clean bridge layer for future abstraction.

## Current Status (WASM fork)
- Custom webmscore fork exposes mutation/undo APIs; app wiring calls them when available.
- WASM glue patched to fix instantiation, provide env imports/exports, and default Qt platform args/ENV to `wasm`; artifacts copied into `public/`.
- Score loads and renders SVG at `/?score=/test_scores/bach_orig.mscz`; UI shows toolbar/zoom.

## Next Steps
1. Rebuild webmscore with platform=`wasm` baked in (remove memory-initializer `offscreen` patch) and automate copying `webmscore.lib.*` artifacts into `public/`.
2. Implement reliable selection/hit-testing (DOM overlay or WASM hit-test) and wire mutations to the selected element; add visual highlight.
3. Add a lightweight regression check in the dev/build flow to verify required wasm/data/mem files are present and loadable.
4. **Next feature to tackle:** stabilize selection persistence (highlight state) across undo/redo and mutations, and document the JS↔WASM selection contract for Phase 0.

## WASM Build / Sync (timed commands)
- Debug rebuild (from `webmscore-fork/web/build.debug`): `/usr/bin/time -v emmake make -j8 webmscore`
- Copy artifacts to web-public → Next: `npm run sync:wasm` (copies `.wasm/.data/.mem.wasm` to `public/`)
- Rebundle worker glue (from `webmscore-fork/web-public`): `/usr/bin/time -v npx rollup -c`

## Selection / Mutation Contract (Phase 0)
- WASM is the source of truth for selection; the DOM overlay is visual only.
- UI calls `selectElementAtPoint(page, x, y)` using the center of the clicked element (page-relative) to set selection in WASM.
- After any mutation/undo/redo + re-render, re-run `selectElementAtPoint` with the last known point to keep WASM state and SVG highlights aligned.
- If the SVG lacks `selected` markers, the overlay falls back to the last known element index.

## Current Status (worker/WASM)
- Signature mismatch crash fixed via full rebuild; debug flags reduced to avoid finalize OOM.
- Mutation/selection APIs exposed in both main-thread and worker builds (`selectElementAtPoint`, delete/pitch/duration, undo/redo, relayout).
- Playwright smoke `scripts/debug-select.js` exercises toolbar mutations end-to-end; selection persists across undo/redo with the reselect hook.

## Wrapper Priorities (available exports to wrap)
1) Selection + core edit: `selectElementAtPoint`, `deleteSelection`, `pitchUp/Down`, `doubleDuration/halfDuration`, `undo/redo`, `relayout`.
2) Render/output: `saveSvg`, `savePng`, `savePdf`, `savePositions`, `saveMetadata`.
3) Score IO: `load`, `saveXml/Mxl/Msc`, `saveMidi`, `saveAudio`, `generateExcerpts`, `addFont`, `init`.
4) Info/housekeeping: `version`, `setLogLevel`, `title`, `npages`, `destroy`.
5) Playback (optional): `synthAudio`, `processSynth`, `processSynthBatch`.


Phase 0.2: Mutation (Fork Strategy)
Goal Description
Enable score modification (mutation) by forking webmscore and exposing the underlying libmscore C++ commands to JavaScript.

Progress (completed)
- Forked webmscore locally and exposed mutation/undo hooks via new C exports (selectElementAtPoint/deleteSelection/pitchUp/pitchDown/doubleDuration/halfDuration/undo/redo/relayout).
- Built the custom WASM artifacts with those bindings and wired the app to use them via `file:./webmscore-fork/web-public`.
- Frontend now calls the optional mutation APIs for selection, pitch, duration, delete, undo/redo; re-renders after each mutation.

User Review Required
IMPORTANT

Build Environment: Building webmscore requires the Emscripten SDK (emcc). I need to verify if this is available or if we need to set it up. Fork Maintenance: We will be maintaining a custom build of webmscore.

Proposed Changes
1. Fork & Setup
Clone webmscore repository (or LibreScore/webmscore).
Verify build prerequisites.
2. Expose C++ APIs
Modify the Emscripten bindings (likely in src/ or mscore/) to expose the following libmscore functions:

Selection: cmdSelectAll, cmdSelectNext, etc. (if not already exposed).
Mutation:
cmdDeleteSelection(): Deletes the currently selected elements.
cmdSetPitch(int pitch): Sets the pitch of the selected note.
cmdAddInterval(int interval): Adds an interval to the selection.
cmdChangeDuration(int duration): Changes duration.
Undo/Redo: cmdUndo(), cmdRedo().
3. Build & Integrate
Compile the forked version to WASM (
webmscore.lib.wasm
, 
webmscore.js
).
Replace the node_modules/webmscore files with our custom build (or link it).

## Phase 0.3: Selection Tracking via SVG Class Markers

### Problem Statement
When pitching up/down a note, the blue selection overlay doesn't follow the note to its new position - it disappears completely. This occurs because the SVG is regenerated after mutations, causing element indices to change and making JavaScript-based selection tracking unreliable.

### Implemented Solution (WASM-side)
Modified the MuseScore SVG generator to add a "selected" class to elements that are currently selected in the score's internal selection state.

**Files Modified:**
1. `/webmscore-fork/src/importexport/imagesexport/internal/svggenerator.h`
   - Added forward declaration for `Score` class
   - Modified `setElement()` signature to accept optional `Score` parameter

2. `/webmscore-fork/src/importexport/imagesexport/internal/svggenerator.cpp`
   - Added includes: `<algorithm>`, `libmscore/score.h`, `libmscore/select.h`
   - Modified `getClass()` function to check selection state and append " selected" to class
   - Added `_score` member to `SvgPaintEngine` class
   - Updated `setElement()` to store both element and score pointers
   - Handles three selection modes: `isRange()`, `isSingle()`, `isList()`
   - Uses `std::find()` for C++17 compatibility (not `vector::contains()`)

3. `/webmscore-fork/src/importexport/imagesexport/internal/svgwriter.cpp`
   - Updated all three `setElement()` call sites to pass score pointer (lines 147, 163, 221)

**Build Process:**
```bash
cd webmscore-fork/web/build.release
make -j8
cd ../../..
npm run sync:wasm  # Copies all WASM artifacts to public/
```

### Current Status
- ✅ WASM builds successfully with selection-checking code
- ✅ SVG elements have proper class attributes (Note, Stem, Beam, etc.)
- ❌ "selected" class is NOT appearing on clicked elements

### Investigation Needed
The "selected" class is not being added to SVG elements despite:
1. The WASM code compiling and running without errors
2. The score loading and rendering correctly
3. Element classes being properly set (verified 320 "Note" elements, 160 "Beam" elements, etc.)

**Possible causes:**
1. Selection state is empty when `getClass()` is called during SVG generation
2. SVG generation happens before selection is registered in MuseScore's internal state
3. The score's `selection()` method returns an empty selection during rendering
4. Timing issue: SVG is cached/rendered before the WASM selection state updates

**Next debugging steps:**
1. Add C++ debug logging to `getClass()` to verify:
   - Whether `score` parameter is non-null
   - What `selection().state()` returns
   - How many elements `selection().elements()` contains
2. Verify that clicking actually updates MuseScore's internal selection before SVG regeneration
3. Check if there's a separate "render with selection" vs "render without selection" code path

### Alternative Approach (if current method fails)
If the selection state is not available during SVG generation, we may need to:
1. Export a separate WASM function to mark elements as selected by ID/index
2. Trigger SVG regeneration after explicitly setting selection markers
3. Or use a completely JavaScript-based approach with overlays (less ideal but more reliable)

Current Next Steps
- Keep tracking the generated `web-public/webmscore.*` artifacts (for install without rebuild); ignore only transient build trees (`web/build.release`, `.cache`).
- Document/re-run `npm run compile` in `web-public` when bindings change.
- Expand mutation surface as needed (e.g., duration set, add interval, select by element id) and expose via C/JS bridge following the same pattern.
- **DEBUG:** Add logging to WASM `getClass()` function to understand why "selected" class isn't being applied
4. Frontend Integration
Update ScoreEditor.tsx to use the new methods.
Add UI controls (Delete button, Undo/Redo buttons).
Verification Plan
Manual Verification
Delete Test: Select a note, press Delete. Verify it disappears.
Undo Test: Press Undo. Verify the note reappears.
Save/Reload: Verify changes persist in the session (AST is updated).
