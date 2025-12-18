#!/usr/bin/env node
// Copy freshly built webmscore artifacts into public/ for Next to serve
const fs = require('fs');
const path = require('path');

const defaultFiles = ['webmscore.lib.wasm', 'webmscore.lib.data', 'webmscore.lib.mem.wasm'];

function syncWasmArtifacts({
  repoRoot = process.env.OTS_WEB_REPO_ROOT || path.join(__dirname, '..'),
  srcDir = path.join(repoRoot, 'webmscore-fork', 'web-public'),
  destDir = path.join(repoRoot, 'public'),
  files = defaultFiles,
  fsModule = fs,
  log = console.log,
} = {}) {
  function copyFile(name) {
    const src = path.join(srcDir, name);
    const dest = path.join(destDir, name);
    if (!fsModule.existsSync(src)) {
      throw new Error(`Missing source artifact: ${src}`);
    }
    fsModule.copyFileSync(src, dest);
    log(`[sync-wasm] Copied ${name}`);
  }

  files.forEach(copyFile);
  log('[sync-wasm] All artifacts copied to public/');
  return true;
}

module.exports = {
  defaultFiles,
  syncWasmArtifacts,
};
