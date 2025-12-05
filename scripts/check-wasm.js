#!/usr/bin/env node
/*
 * Verify that the required webmscore WASM artifacts are present and non-empty.
 * Usage: node scripts/check-wasm.js
 */

const fs = require('fs');
const path = require('path');

const files = [
  'public/webmscore.lib.wasm',
  'public/webmscore.lib.data',
  'public/webmscore.lib.mem.wasm',
];

let ok = true;

files.forEach((f) => {
  const full = path.resolve(f);
  const exists = fs.existsSync(full);
  const size = exists ? fs.statSync(full).size : 0;
  if (!exists || size === 0) {
    console.error(`[wasm-check] MISSING or empty: ${f}`);
    ok = false;
  } else {
    console.log(`[wasm-check] OK ${f} (${size} bytes)`);
  }
});

if (!ok) {
  console.error('\nMissing webmscore artifacts. Ensure the webmscore build outputs are copied to /public before running dev/build.');
  process.exit(1);
}

console.log('\nAll required webmscore artifacts are present.');
