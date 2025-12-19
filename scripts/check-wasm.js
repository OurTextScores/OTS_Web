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

const GIT_LFS_POINTER_PREFIX = 'version https://git-lfs.github.com/spec/v1';
const WASM_MAGIC = Buffer.from([0x00, 0x61, 0x73, 0x6d]); // "\0asm"

function readHead(fsModule, fullPath, bytes = 256) {
  const fd = fsModule.openSync(fullPath, 'r');
  try {
    const buf = Buffer.alloc(bytes);
    const read = fsModule.readSync(fd, buf, 0, bytes, 0);
    return buf.subarray(0, read);
  } finally {
    fsModule.closeSync(fd);
  }
}

function isGitLfsPointer(headBuf) {
  return headBuf.toString('utf8').startsWith(GIT_LFS_POINTER_PREFIX);
}

function hasWasmMagic(headBuf) {
  return headBuf.length >= 4 && headBuf.subarray(0, 4).equals(WASM_MAGIC);
}

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
      return;
    }

    let headBuf = Buffer.alloc(0);
    try {
      headBuf = readHead(fsModule, full);
    } catch (e) {
      error(`[wasm-check] Failed to read ${f}: ${e?.message ?? String(e)}`);
      ok = false;
      return;
    }

    if (isGitLfsPointer(headBuf)) {
      error(`[wasm-check] ${f} looks like a Git LFS pointer (not the real binary).`);
      ok = false;
      return;
    }

    if (f.endsWith('.wasm') && f.includes('webmscore.lib.wasm') && !hasWasmMagic(headBuf)) {
      error(`[wasm-check] ${f} is not a valid WASM binary (bad magic number).`);
      ok = false;
      return;
    }

    log(`[wasm-check] OK ${f} (${size} bytes)`);
  });

  if (!ok) {
    error(
      [
        '',
        'webmscore artifacts are missing/invalid.',
        '',
        'If you cloned this repo with Git LFS disabled (or downloaded a ZIP), fetch LFS objects:',
        '  git lfs install',
        '  git lfs pull',
        '',
        'If you rebuilt webmscore, re-sync artifacts:',
        '  npm run sync:wasm',
      ].join('\n'),
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
