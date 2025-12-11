## Current Status
- The worker `RuntimeError: function signature mismatch` crash is resolved after a full rebuild of the forked WASM + glue.
- Debug build OOM during `wasm-emscripten-finalize` was fixed by reducing debug flags in `webmscore-fork/web/CMakeLists.txt` (`-g2` plus assertions/stack checks).
- Mutation/selection APIs are now exposed consistently in both non-worker and worker builds:
  - `selectElementAtPoint(pageNumber, x, y)`
  - `deleteSelection()`
  - `pitchUp()`, `pitchDown()`
  - `doubleDuration()`, `halfDuration()`
  - `undo()`, `redo()`
  - `relayout()`
- `scripts/debug-select.js` Playwright smoke script exercises selection + toolbar mutations end-to-end.

## Timed Rebuild / Sync
1. Debug rebuild (from `webmscore-fork/web/build.debug`):
   - `/usr/bin/time -v emmake make -j8 webmscore`
2. Copy artifacts into `webmscore-fork/web-public/` and then sync into Next:
   - `npm run sync:wasm`
3. Rebundle worker glue (from `webmscore-fork/web-public`):
   - `/usr/bin/time -v npx rollup -c`

## Remaining Work
1. Produce fresh release artifacts (`make release`) with `-platform wasm` baked in, then re-sync to `public/`.
2. Harden selection/hit-testing for multi-page scores and confirm coordinate mapping under zoom/pan.
3. Decide whether to keep the WASM debug logging in release builds.
4. Optional: add simple assertions to `scripts/debug-select.js` so regressions fail fast.
