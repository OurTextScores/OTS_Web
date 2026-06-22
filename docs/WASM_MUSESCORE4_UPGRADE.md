# MuseScore 4.x WASM Upgrade Assessment

## Executive Summary

**Critical Finding**: The `webmscore-fork` is **already based on MuseScore 4.00**, not MuseScore 3.x. The problem is not upgrading from 3.x to 4.x — it is that the fork is pinned at **4.00** and has not tracked the format changes introduced in MuseScore 4.1, 4.2, and 4.7 (e.g. `<harmonyInfo>` replacing `<root>`/`<name>` for chord symbols, newer `<fretDiagram>` structure, newer MSCZ container layout).

The lightest viable fix is **backporting the newer format readers** from upstream MuseScore into the existing 4.00 base, rather than a full engine upgrade.

---

## 1. Current Base Version

| Constant | Value | File |
|---|---|---|
| `MSCVERSION` | 400 | `src/engraving/libmscore/mscore.h` |
| `MSC_VERSION` | `"4.00"` | same |

The format-version routing in `src/engraving/rw/scorereader.cpp`:
- v ≤ 114 → `compat::Read114`
- v ≤ 207 → `compat::Read206`
- v < 400 → `compat::Read302`
- v ≥ 400 → `Read400::read400()`

Files saved by MuseScore 4.70 carry version `"4.70"` → integer 470. The WASM already detects this (`mscVersion() > MSCVERSION`) and returns a `FileTooNew` error. So the reader never runs — **we cannot even attempt to load them**.

---

## 2. Known Format Gaps (4.00 vs. 4.7x)

### Chord symbols (`Harmony`)
MuseScore 4.1+ restructured how chord symbols are serialized. The current `harmony.cpp` reader handles flat `<root>` / `<name>` tags; files written by newer MuseScore use `<harmonyInfo>` with nested `<root>` and `<name>` children. `<harmonyInfo>` is silently skipped as unknown, so chord names load as empty.

### Fret diagrams (`FretDiagram`)
The `<fretDiagram>` inner element (new format) co-exists with a `<Harmony>` sibling in files from MuseScore 4.x. A separate bug in `read()` (the `haveReadNew` early-skip) can cause the Harmony to be dropped when it appears after `<fretDiagram>`. (Partially addressed in the fret.cpp fix already applied — but `<harmonyInfo>` inside Harmony still isn't read.)

### MSCZ container (MuseScore 4.x)
MuseScore 4.x MSCZ zips contain `META-INF/container.xml` (same as MXL), which previously caused misdetection as MusicXML. This was fixed in commit `54efae7a` by checking for a `.mscx` entry first.

### Version gate
`ignoreVersionError=true` is passed in `loadMsczOrMscx`, so the Read400 parser *attempts* to read 4.70 files despite the version mismatch. Unknown tags are skipped silently, which is why basic rendering works but newer-format elements (harmony, etc.) are blank.

---

## 3. WASM Build Complexity

The web build compiles a small, self-contained slice of the MuseScore codebase:

```
web/CMakeLists.txt
  → framework/global, framework/draw
  → engraving (layout + libmscore + rw)
  → mpe, importexport/musicxml, /guitarpro, /midi, /imagesexport
  → web/audio  (Emscripten audio synthesis)
```

It uses Qt5 15.2 (WebAssembly port) with only `QWasmIntegrationPlugin` (offscreen rendering, no QWidget). The WASM binary is ~9 MB. The Emscripten toolchain and CMake structure are modern and well-understood after recent fixes.

**MuseScore 4.x has no official WASM target.** The WASM build is maintained in this fork. There is no upstream to pull a pre-built WASM from.

---

## 4. Approaches

### Option A — Backport format readers (recommended for now)

Surgically update `src/engraving/libmscore/harmony.cpp`, `fret.cpp`, and related readers to understand the newer tag names, while keeping the 4.00 engine base.

Also raise or remove the `MSCVERSION` gate so 4.7x files proceed through Read400 (which already skips unknown tags gracefully) rather than hitting the `FileTooNew` hard error.

**Effort**: 1–2 weeks  
**Risk**: Low — isolated to the rw/libmscore layer, no build system or Qt changes  
**Covers**: Chord symbols, fret diagram chord names, basic 4.7x score loading  
**Does not cover**: Elements that changed structurally between 4.00 and 4.7x beyond what Read400 can silently skip

### Option B — Resync fork to a newer MuseScore 4.x tag

Merge a specific upstream MuseScore tag (e.g. 4.4 or 4.6) into the fork, resolving CMake/Qt/platform conflicts and validating the WASM build.

**Effort**: 3–6 weeks  
**Risk**: Medium — MuseScore's desktop-specific dependencies and Qt module changes may require significant porting work; WASM binary size and boot time may increase  
**Covers**: All format changes through the chosen upstream tag  
**Does not cover**: Formats added after that tag (e.g. 4.7x if syncing to 4.4)

### Option C — Full upgrade to latest MuseScore + Qt6

Track current upstream HEAD, migrate to Qt6 WebAssembly.

**Effort**: 2–3 months  
**Risk**: High — Qt6 WASM support is still evolving; many desktop-only modules would need stubs  
**Covers**: Everything  
**Not recommended** unless there is a strong reason to target Qt6

---

## 5. Recommended Path

**Short term (now)**: Option A.

1. Add `<harmonyInfo>` handling to `Harmony::read()` — map `<root>` and `<name>` from inside it, same semantics as before.
2. Review what else 4.1–4.7x changed in the format (compare upstream MuseScore release notes / changelog against files that fail to render).
3. Raise `MSCVERSION` to 470 (or to the actual max version of a file that passes visual inspection after read), so those files get a best-effort render rather than a hard error.

**Medium term**: Option B — pick a stable MuseScore 4.x tag and do a careful resync, validating all export paths (SVG, PDF, MIDI, MusicXML) against a test corpus.

---

## 6. Key Files

| File | Relevance |
|---|---|
| `src/engraving/libmscore/mscore.h` | `MSCVERSION` gate — controls what version triggers `FileTooNew` |
| `src/engraving/libmscore/harmony.cpp` | Chord symbol reader — needs `<harmonyInfo>` support |
| `src/engraving/libmscore/fret.cpp` | Fret diagram reader — `haveReadNew` skip bug + harmony child |
| `src/engraving/rw/read400.cpp` | Top-level 4.x reader — entry point for format-level changes |
| `src/engraving/rw/scorereader.cpp` | Version routing — where `MSCVERSION` gate is enforced |
| `web/main.cpp` | WASM API surface — `loadMsczOrMscx`, `FileTooNew` handling |
| `web/CMakeLists.txt` | Build — Qt5 WASM plugin linking |
