#!/usr/bin/env node
// Copy freshly built webmscore artifacts into public/ for Next to serve
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const srcDir = path.join(repoRoot, 'webmscore-fork', 'web-public');
const destDir = path.join(repoRoot, 'public');
const files = ['webmscore.lib.wasm', 'webmscore.lib.data', 'webmscore.lib.mem.wasm'];

function copyFile(name) {
    const src = path.join(srcDir, name);
    const dest = path.join(destDir, name);
    if (!fs.existsSync(src)) {
        throw new Error(`Missing source artifact: ${src}`);
    }
    fs.copyFileSync(src, dest);
    console.log(`[sync-wasm] Copied ${name}`);
}

try {
    files.forEach(copyFile);
    console.log('[sync-wasm] All artifacts copied to public/');
} catch (err) {
    console.error('[sync-wasm] Failed:', err.message);
    process.exit(1);
}
