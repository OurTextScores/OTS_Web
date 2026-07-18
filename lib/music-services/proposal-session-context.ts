import { extractPatchAnnotations, type PatchAnnotation } from '../patch-annotations';
import { computeMusicXmlIdentityHashServer } from '../musicxml-identity-server';
import { computeScoreHash } from './scoreops-session-store';
import { asRecord } from './common';

// Client-owned continuity context for one proposal session (design §6). The client is the
// continuity owner; this module only validates shape, applies deterministic bounds, and
// verifies lineage. Context influences prompt quality, never authorization.

export type ProposalSessionConstraint = {
  cycle: number;
  kind: 'rejected' | 'note';
  partIndex: number | null;
  measureRange: string | null;
  text: string;
};

export type ProposalPreviousCycle = {
  cycle: number;
  baseContentHash: string;
  baseIdentityHash: string | null;
  proposedContentHash: string;
  proposedIdentityHash: string | null;
  expectedCurrentContentHash: string | null;
  expectedCurrentIdentityHash: string | null;
  patchJson: string;
  annotations: PatchAnnotation[];
};

export type ProposalSessionContext = {
  id: string;
  originalInstruction: string;
  cycle: number;
  previousCycle: ProposalPreviousCycle | null;
  constraints: ProposalSessionConstraint[];
};

export type ProposalContextFlags = {
  provided: boolean;
  lineage: 'verified' | 'mismatch' | 'none';
  previousCycleDropped: boolean;
  truncated: string[];
};

export const PROPOSAL_SESSION_ID_PATTERN = /^[A-Za-z0-9._:-]{1,64}$/;
const RAW_HASH_PATTERN = /^sha256:[0-9a-f]{64}$/;
const IDENTITY_HASH_PATTERN = /^xmlid-v\d+:[0-9a-f]{64}$/;
const CONSTRAINT_KINDS = new Set(['rejected', 'note']);

const DEFAULT_INSTRUCTION_MAX_CHARS = 4_000;
const DEFAULT_PREVIOUS_PATCH_MAX_CHARS = 60_000;
const DEFAULT_ANNOTATIONS_MAX = 50;
const DEFAULT_ANNOTATION_COMMENT_MAX_CHARS = 500;
const DEFAULT_CONSTRAINTS_MAX = 120;
const DEFAULT_CONSTRAINT_TEXT_MAX_CHARS = 300;
const HARD_CONSTRAINTS_INPUT_MAX = 500;

const readClampedEnvInteger = (name: string, fallback: number, minimum: number, maximum: number) => {
  const value = Number(process.env[name]);
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(maximum, Math.max(minimum, Math.floor(value)));
};

const sanitizeText = (value: string, maxChars: number) => (
  value
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, " ")
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxChars)
);

const readOptionalHash = (value: unknown, pattern: RegExp): string | null => (
  typeof value === 'string' && pattern.test(value.trim()) ? value.trim() : null
);

export type ParseProposalSessionContextResult =
  | { context: null; flags: ProposalContextFlags }
  | { context: ProposalSessionContext; flags: ProposalContextFlags }
  | { error: string };

const emptyFlags = (): ProposalContextFlags => ({
  provided: false,
  lineage: 'none',
  previousCycleDropped: false,
  truncated: [],
});

/**
 * Validate and bound the client-supplied `proposalSession` request field.
 * Structural violations return `{ error }` (the route maps them to 400).
 * Oversized text is truncated deterministically and reported in `flags.truncated`.
 */
export function parseProposalSessionContext(
  value: unknown,
  args: { iteration: number },
): ParseProposalSessionContextResult {
  if (value == null) {
    return { context: null, flags: emptyFlags() };
  }
  const record = asRecord(value);
  if (!record) {
    return { error: 'proposalSession must be an object.' };
  }
  const id = typeof record.id === 'string' ? record.id.trim() : '';
  if (!PROPOSAL_SESSION_ID_PATTERN.test(id)) {
    return { error: 'proposalSession.id is invalid.' };
  }
  const cycle = Number(record.cycle);
  if (!Number.isInteger(cycle) || cycle < 1) {
    return { error: 'proposalSession.cycle must be a positive integer.' };
  }
  if (cycle !== args.iteration + 1) {
    return { error: 'proposalSession.cycle does not match the request iteration.' };
  }

  const flags = emptyFlags();
  flags.provided = true;
  const truncated = new Set<string>();

  const instructionMaxChars = readClampedEnvInteger(
    'MUSIC_FEEDBACK_INSTRUCTION_MAX_CHARS',
    DEFAULT_INSTRUCTION_MAX_CHARS,
    100,
    100_000,
  );
  const rawInstruction = typeof record.originalInstruction === 'string' ? record.originalInstruction : '';
  const originalInstruction = sanitizeText(rawInstruction, instructionMaxChars);
  if (sanitizeText(rawInstruction, Number.MAX_SAFE_INTEGER).length > originalInstruction.length) {
    truncated.add('originalInstruction');
  }

  let previousCycle: ProposalPreviousCycle | null = null;
  if (record.previousCycle != null) {
    const prev = asRecord(record.previousCycle);
    if (!prev) {
      return { error: 'proposalSession.previousCycle must be an object.' };
    }
    const prevCycle = Number(prev.cycle);
    if (!Number.isInteger(prevCycle) || prevCycle !== cycle) {
      return { error: 'proposalSession.previousCycle.cycle must equal proposalSession.cycle.' };
    }
    const baseContentHash = readOptionalHash(prev.baseContentHash, RAW_HASH_PATTERN);
    const proposedContentHash = readOptionalHash(prev.proposedContentHash, RAW_HASH_PATTERN);
    if (!baseContentHash || !proposedContentHash) {
      return { error: 'proposalSession.previousCycle requires valid base and proposed content hashes.' };
    }

    const previousPatchMaxChars = readClampedEnvInteger(
      'MUSIC_FEEDBACK_PREVIOUS_PATCH_MAX_CHARS',
      DEFAULT_PREVIOUS_PATCH_MAX_CHARS,
      1_000,
      5_000_000,
    );
    let patchJson = '';
    if (prev.patch != null) {
      const patchRecord = asRecord(prev.patch);
      if (
        !patchRecord
        || patchRecord.format !== 'musicxml-patch@1'
        || !Array.isArray(patchRecord.ops)
      ) {
        return { error: 'proposalSession.previousCycle.patch must be a musicxml-patch@1 object.' };
      }
      const serialized = JSON.stringify({ format: patchRecord.format, ops: patchRecord.ops });
      if (serialized.length > previousPatchMaxChars) {
        // A truncated JSON patch would mislead the model; omit it entirely instead.
        truncated.add('previousPatch');
      } else {
        patchJson = serialized;
      }
    }

    const annotationsMax = readClampedEnvInteger(
      'MUSIC_FEEDBACK_PRIOR_ANNOTATIONS_MAX',
      DEFAULT_ANNOTATIONS_MAX,
      1,
      500,
    );
    const allAnnotations = extractPatchAnnotations({ annotations: prev.annotations })
      .map((annotation) => ({
        ...annotation,
        comment: sanitizeText(annotation.comment, DEFAULT_ANNOTATION_COMMENT_MAX_CHARS),
      }))
      .filter((annotation) => annotation.comment);
    if (allAnnotations.length > annotationsMax) {
      truncated.add('previousAnnotations');
    }
    const annotations = allAnnotations.slice(0, annotationsMax);

    previousCycle = {
      cycle: prevCycle,
      baseContentHash,
      baseIdentityHash: readOptionalHash(prev.baseIdentityHash, IDENTITY_HASH_PATTERN),
      proposedContentHash,
      proposedIdentityHash: readOptionalHash(prev.proposedIdentityHash, IDENTITY_HASH_PATTERN),
      expectedCurrentContentHash: readOptionalHash(prev.expectedCurrentContentHash, RAW_HASH_PATTERN),
      expectedCurrentIdentityHash: readOptionalHash(prev.expectedCurrentIdentityHash, IDENTITY_HASH_PATTERN),
      patchJson,
      annotations,
    };
  }

  let constraints: ProposalSessionConstraint[] = [];
  if (record.constraints != null) {
    if (!Array.isArray(record.constraints)) {
      return { error: 'proposalSession.constraints must be an array.' };
    }
    if (record.constraints.length > HARD_CONSTRAINTS_INPUT_MAX) {
      return { error: `proposalSession.constraints exceeds ${HARD_CONSTRAINTS_INPUT_MAX} entries.` };
    }
    const constraintTextMaxChars = readClampedEnvInteger(
      'MUSIC_FEEDBACK_CONSTRAINT_TEXT_MAX_CHARS',
      DEFAULT_CONSTRAINT_TEXT_MAX_CHARS,
      50,
      5_000,
    );
    for (let i = 0; i < record.constraints.length; i += 1) {
      const entry = asRecord(record.constraints[i]);
      if (!entry) {
        return { error: `proposalSession.constraints[${i}] must be an object.` };
      }
      const constraintCycle = Number(entry.cycle);
      const kind = typeof entry.kind === 'string' ? entry.kind : '';
      if (!Number.isInteger(constraintCycle) || constraintCycle < 1 || constraintCycle > cycle) {
        return { error: `proposalSession.constraints[${i}].cycle is out of range.` };
      }
      if (!CONSTRAINT_KINDS.has(kind)) {
        return { error: `proposalSession.constraints[${i}].kind is invalid.` };
      }
      const partIndexValue = Number(entry.partIndex);
      const partIndex = Number.isInteger(partIndexValue) && partIndexValue >= 0 ? partIndexValue : null;
      const measureRange = typeof entry.measureRange === 'string'
        ? sanitizeText(entry.measureRange, 128)
        : '';
      const text = typeof entry.text === 'string' ? sanitizeText(entry.text, constraintTextMaxChars) : '';
      if (!text && !measureRange) {
        continue;
      }
      constraints.push({
        cycle: constraintCycle,
        kind: kind as 'rejected' | 'note',
        partIndex,
        measureRange: measureRange || null,
        text,
      });
    }
    const constraintsMax = readClampedEnvInteger(
      'MUSIC_FEEDBACK_CONSTRAINTS_MAX',
      DEFAULT_CONSTRAINTS_MAX,
      10,
      HARD_CONSTRAINTS_INPUT_MAX,
    );
    if (constraints.length > constraintsMax) {
      // Keep the most recent constraints: later cycles carry the freshest user intent.
      constraints = constraints.slice(constraints.length - constraintsMax);
      truncated.add('constraints');
    }
  }

  flags.truncated = [...truncated].sort();
  return {
    context: {
      id,
      originalInstruction,
      cycle,
      previousCycle,
      constraints,
    },
    flags,
  };
}

/**
 * Lineage check for the previous cycle against the authoritative current XML.
 * Legitimate states: current equals the previous base (nothing applied), the previous
 * proposal (all applied), or the client's tracked partial-Apply expectation. A mismatch of
 * every raw and identity hash means an unrelated edit occurred; the caller drops the
 * previous-cycle context (design decision: degrade, flag, never block).
 */
export function evaluateProposalLineage(
  currentXml: string,
  previousCycle: ProposalPreviousCycle | null,
): 'verified' | 'mismatch' | 'none' {
  if (!previousCycle) {
    return 'none';
  }
  const rawCandidates = [
    previousCycle.expectedCurrentContentHash,
    previousCycle.proposedContentHash,
    previousCycle.baseContentHash,
  ].filter((hash): hash is string => Boolean(hash));
  const currentRawHash = computeScoreHash(currentXml);
  if (rawCandidates.includes(currentRawHash)) {
    return 'verified';
  }
  const identityCandidates = [
    previousCycle.expectedCurrentIdentityHash,
    previousCycle.proposedIdentityHash,
    previousCycle.baseIdentityHash,
  ].filter((hash): hash is string => Boolean(hash));
  if (identityCandidates.length) {
    try {
      const currentIdentityHash = computeMusicXmlIdentityHashServer(currentXml);
      if (identityCandidates.includes(currentIdentityHash)) {
        return 'verified';
      }
    } catch {
      // Unparseable current XML cannot confirm lineage; fall through to mismatch.
    }
  }
  return 'mismatch';
}
