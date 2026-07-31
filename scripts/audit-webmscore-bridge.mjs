/**
 * TD-05 — webmscore bridge completeness audit.
 *
 * Turns the six-layer checklist in AGENTS.md into a source contract. The failure this
 * exists to catch is a method that compiles but silently does not exist in the app,
 * usually because worker-helper.js or webmscore-loader.ts was forgotten.
 *
 * Deliberately structural, not a substring search: each layer is parsed for real
 * declarations, so a mention in a comment, a JSDoc block, or a test cannot satisfy a
 * requirement. Intentional asymmetry lives in scripts/webmscore-bridge-manifest.json
 * with a written reason per entry.
 *
 * Usage: node scripts/audit-webmscore-bridge.mjs [--json]
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/** Class methods declared at one indent level inside a class body. */
const parseClassMethods = (source) => new Set(
    [...source.matchAll(/^ {4}(?:async\s+)?(?:get\s+|set\s+)?([a-zA-Z_$][\w$]*)\s*\(/gm)]
        .map((match) => match[1])
        .filter((name) => name !== 'constructor'),
);

/** EMSCRIPTEN_KEEPALIVE exports inside the extern "C" block of main.cpp. */
const parseNativeExports = (source) => {
    const blockStart = source.indexOf('extern "C" {');
    if (blockStart < 0) return null;
    return new Set(
        [...source.slice(blockStart).matchAll(
            /EMSCRIPTEN_KEEPALIVE\s*\n\s*[\w:<>\s*&]+?\s+(\w+)\s*\(/g,
        )].map((match) => match[1]),
    );
};

/**
 * Literal RPC target names the worker helper actually dispatches. Matches any
 * receiver, not just `this`: the module-level handshake calls `instance.rpc('ready')`,
 * `instance.rpc('load', ...)` and `instance.rpc('setLogLevel', ...)`.
 */
const parseRpcTargets = (source) => new Set(
    [...source.matchAll(/\.rpc\(\s*'([^']+)'/g)].map((match) => match[1]),
);

/** Member names of the exported Score interface. */
const parseScoreInterface = (source) => {
    const header = /export interface Score\s*\{/.exec(source);
    if (!header) return null;
    let depth = 0;
    let end = -1;
    for (let i = header.index + header[0].length - 1; i < source.length; i += 1) {
        if (source[i] === '{') depth += 1;
        else if (source[i] === '}') {
            depth -= 1;
            if (depth === 0) { end = i; break; }
        }
    }
    if (end < 0) return null;
    const body = source.slice(header.index + header[0].length, end);
    return new Set(
        [...body.matchAll(/^\s{2,4}([a-zA-Z_$][\w$]*)\??\s*[:(]/gm)].map((match) => match[1]),
    );
};

/**
 * Pure rule engine over already-read sources, so the contract can be unit tested with
 * fixtures instead of only end to end against the real fork.
 *
 * @param {{native: string|null, mainThread: string|null, worker: string|null, typescript: string|null}} sources
 * @param {object} manifest
 */
export function analyzeBridge(sources, manifest) {
    const failures = [];
    const fail = (rule, detail) => failures.push({ rule, detail });

    for (const [layer, path] of Object.entries(manifest.layers)) {
        if (sources[layer] == null) fail('layer-missing', `${layer} source not found at ${path}`);
    }
    if (failures.length > 0) return { report: null, failures };

    const native = parseNativeExports(sources.native);
    const mainThread = parseClassMethods(sources.mainThread);
    const workerMethods = parseClassMethods(sources.worker);
    const rpcTargets = parseRpcTargets(sources.worker);
    const scoreMembers = parseScoreInterface(sources.typescript);

    if (!native) fail('layer-unparseable', 'no extern "C" block found in the native layer');
    if (!scoreMembers) fail('layer-unparseable', 'no exported Score interface found in the TypeScript layer');
    if (failures.length > 0) return { report: null, failures };

    const jsImplemented = manifest.jsImplementedRpcTargets || {};
    const controlPlane = manifest.controlPlaneRpcTargets || {};
    const typescriptOnly = manifest.typescriptOnlyMembers || {};
    const syntheticPrefix = manifest.syntheticRpcPrefix || '';

    const resolveNative = (rpcName) => {
        if (native.has(rpcName)) return rpcName;
        if (syntheticPrefix && rpcName.startsWith(syntheticPrefix)) {
            const stripped = rpcName.slice(syntheticPrefix.length);
            if (native.has(stripped)) return stripped;
        }
        return null;
    };

    // Rule 1/2: anything the app is allowed to call must exist on both JS layers.
    for (const member of [...scoreMembers].sort()) {
        if (member in typescriptOnly) continue;
        if (!mainThread.has(member)) {
            fail('missing-main-thread', `Score.${member} has no method in ${manifest.layers.mainThread}`);
        }
        if (!workerMethods.has(member)) {
            fail('missing-worker-proxy', `Score.${member} has no worker method in ${manifest.layers.worker}`);
        }
    }

    // Rule 3: every dispatched RPC name must land somewhere real.
    for (const target of [...rpcTargets].sort()) {
        if (target in controlPlane || target in jsImplemented) continue;
        if (!resolveNative(target)) {
            fail('unresolved-rpc-target', `worker dispatches '${target}' with no native export and no manifest entry`);
        }
    }

    // Rule 4: allowlists must not rot. An entry that is no longer needed hides a real check.
    for (const target of Object.keys(jsImplemented)) {
        if (!rpcTargets.has(target)) {
            fail('stale-allowlist', `jsImplementedRpcTargets.${target} is no longer dispatched; remove it`);
        } else if (resolveNative(target)) {
            fail('stale-allowlist', `jsImplementedRpcTargets.${target} now has a native export; remove it`);
        }
    }
    for (const target of Object.keys(controlPlane)) {
        if (!rpcTargets.has(target)) {
            fail('stale-allowlist', `controlPlaneRpcTargets.${target} is no longer dispatched; remove it`);
        }
    }
    for (const member of Object.keys(typescriptOnly)) {
        if (!scoreMembers.has(member)) {
            fail('stale-allowlist', `typescriptOnlyMembers.${member} is not on the Score interface; remove it`);
        }
    }

    // Informational only: plenty of native exports are internal C helpers with no JS caller.
    const reachableNative = new Set(
        [...rpcTargets].map((target) => resolveNative(target)).filter(Boolean),
    );
    const unproxiedNative = [...native].filter((name) => !reachableNative.has(name)).sort();

    return {
        report: {
            counts: {
                nativeExports: native.size,
                mainThreadMethods: mainThread.size,
                workerMethods: workerMethods.size,
                rpcTargets: rpcTargets.size,
                scoreMembers: scoreMembers.size,
            },
            unproxiedNative,
        },
        failures,
    };
}

function main() {
    // Resolved lazily so importing this module for its rules has no side effects.
    const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
    const jsonOutput = process.argv.includes('--json');
    const manifest = JSON.parse(
        readFileSync(resolve(root, 'scripts/webmscore-bridge-manifest.json'), 'utf8'),
    );
    const read = (relativePath) => {
        try {
            return readFileSync(resolve(root, relativePath), 'utf8');
        } catch {
            return null;
        }
    };

    const sources = Object.fromEntries(
        Object.entries(manifest.layers).map(([layer, path]) => [layer, read(path)]),
    );
    const { report, failures } = analyzeBridge(sources, manifest);

    if (!report) {
        for (const failure of failures) console.error(`[bridge:audit] ${failure.rule}: ${failure.detail}`);
        process.exitCode = 1;
    return;
    }
    const { unproxiedNative } = report;

    if (jsonOutput) {
        console.log(JSON.stringify(report, null, 2));
    } else {
        console.log(`[bridge:audit] native exports: ${report.counts.nativeExports}`);
        console.log(`[bridge:audit] main-thread methods: ${report.counts.mainThreadMethods}`);
        console.log(`[bridge:audit] worker methods: ${report.counts.workerMethods}, rpc targets: ${report.counts.rpcTargets}`);
        console.log(`[bridge:audit] Score interface members: ${report.counts.scoreMembers}`);
        console.log(`[bridge:audit] native exports not reachable from the worker: ${unproxiedNative.length} (informational)`);
        for (const name of unproxiedNative) console.log(`    ${name}`);
    }

    if (failures.length > 0) {
        console.error('[bridge:audit] bridge contract violations:');
        for (const failure of failures) console.error(`  ${failure.rule}: ${failure.detail}`);
        process.exitCode = 1;
    } else {
        console.log('[bridge:audit] all bridge layers consistent.');
    }
}

// Only run the CLI when invoked directly, so tests can import analyzeBridge.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main();
}
