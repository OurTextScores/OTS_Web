/** Types for the TD-05 bridge audit rule engine so consumers need no suppression. */

export type BridgeLayer = 'native' | 'mainThread' | 'worker' | 'typescript';

export type BridgeSources = Record<BridgeLayer, string | null>;

export type BridgeManifest = {
    layers: Record<BridgeLayer, string>;
    syntheticRpcPrefix?: string;
    controlPlaneRpcTargets?: Record<string, string>;
    jsImplementedRpcTargets?: Record<string, string>;
    typescriptOnlyMembers?: Record<string, string>;
};

export type BridgeFailure = {
    rule:
        | 'layer-missing'
        | 'layer-unparseable'
        | 'missing-main-thread'
        | 'missing-worker-proxy'
        | 'unresolved-rpc-target'
        | 'stale-allowlist';
    detail: string;
};

export type BridgeReport = {
    counts: {
        nativeExports: number;
        mainThreadMethods: number;
        workerMethods: number;
        rpcTargets: number;
        scoreMembers: number;
    };
    unproxiedNative: string[];
};

export function analyzeBridge(
    sources: BridgeSources,
    manifest: BridgeManifest,
): { report: BridgeReport | null; failures: BridgeFailure[] };
