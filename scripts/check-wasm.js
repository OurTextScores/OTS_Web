#!/usr/bin/env node
/*
 * Verify that the required webmscore WASM artifacts are present and non-empty.
 * Usage: node scripts/check-wasm.js
 */

const fs = require('fs');
const path = require('path');

const defaultFiles = [
  'public/webmscore.lib.wasm',
  'public/webmscore.lib.data',
  'public/webmscore.lib.mem.wasm',
];

function checkWasmArtifacts({
  files = defaultFiles,
  cwd = process.cwd(),
  fsModule = fs,
  log = console.log,
  error = console.error,
} = {}) {
  let ok = true;

  files.forEach((f) => {
    const full = path.resolve(cwd, f);
    const exists = fsModule.existsSync(full);
    const size = exists ? fsModule.statSync(full).size : 0;
    if (!exists || size === 0) {
      error(`[wasm-check] MISSING or empty: ${f}`);
      ok = false;
    } else {
      log(`[wasm-check] OK ${f} (${size} bytes)`);
    }
  });

  if (!ok) {
    error(
      '\nMissing webmscore artifacts. Ensure the webmscore build outputs are copied to /public before running dev/build.',
    );
    return false;
  }

  log('\nAll required webmscore artifacts are present.');
  return true;
}

module.exports = {
  defaultFiles,
  checkWasmArtifacts,
};
