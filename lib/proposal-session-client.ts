import type { PatchAnnotation } from './patch-annotations';

// Client-side owner of one proposal session (design §6): the original instruction, the
// previous visible cycle, and cumulative constraints, carried across Send Feedback cycles
// and sent to the server as bounded context. Cleared when the proposal workflow closes or
// a fresh AI request begins.

export type ProposalConstraint = {
  cycle: number;
  kind: 'rejected' | 'note';
  partIndex: number | null;
  measureRange: string | null;
  text: string;
};

export type ClientProposalPreviousCycle = {
  cycle: number;
  baseContentHash: string;
  baseIdentityHash: string | null;
  proposedContentHash: string;
  proposedIdentityHash: string | null;
  patch: unknown | null;
  annotations: PatchAnnotation[];
};

export type ClientProposalSession = {
  id: string;
  originalInstruction: string;
  includeChat: boolean;
  cycle: number;
  previousCycle: ClientProposalPreviousCycle | null;
  constraints: ProposalConstraint[];
};

export type ProposalHashSource = {
  baseContentHash?: unknown;
  baseIdentityHash?: unknown;
  proposedContentHash?: unknown;
  proposedIdentityHash?: unknown;
} | null | undefined;

const CONSTRAINTS_MAX = 120;

const readHash = (value: unknown): string | null => (
  typeof value === 'string' && value.trim() ? value.trim() : null
);

const fallbackSessionId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

const buildPreviousCycle = (
  cycle: number,
  proposal: ProposalHashSource,
  patch: unknown | null,
  annotations: PatchAnnotation[],
): ClientProposalPreviousCycle | null => {
  const baseContentHash = readHash(proposal?.baseContentHash);
  const proposedContentHash = readHash(proposal?.proposedContentHash);
  if (!baseContentHash || !proposedContentHash) {
    return null;
  }
  return {
    cycle,
    baseContentHash,
    baseIdentityHash: readHash(proposal?.baseIdentityHash),
    proposedContentHash,
    proposedIdentityHash: readHash(proposal?.proposedIdentityHash),
    patch: patch ?? null,
    annotations,
  };
};

export function createClientProposalSession(args: {
  id?: string | null;
  originalInstruction: string;
  includeChat: boolean;
  proposal?: ProposalHashSource;
  patch?: unknown | null;
  annotations?: PatchAnnotation[];
}): ClientProposalSession {
  return {
    id: (typeof args.id === 'string' && args.id.trim()) ? args.id.trim() : fallbackSessionId(),
    originalInstruction: args.originalInstruction,
    includeChat: args.includeChat,
    cycle: 1,
    previousCycle: buildPreviousCycle(1, args.proposal, args.patch ?? null, args.annotations ?? []),
    constraints: [],
  };
}

export type SentFeedbackBlock = {
  partIndex: number;
  measureRange: string;
  status: string;
  comment?: string;
};

/**
 * Fold one cycle of user feedback into the cumulative constraint list. Rejections become
 * standing constraints; a later decision on the same block (any non-rejected status)
 * reverses the earlier rejection. Global notes accumulate as 'note' constraints.
 */
export function accumulateProposalConstraints(
  existing: ProposalConstraint[],
  revisedCycle: number,
  sentBlocks: SentFeedbackBlock[],
  globalComment: string,
): ProposalConstraint[] {
  const blockKey = (partIndex: number | null, measureRange: string | null) => (
    `${partIndex ?? 'x'}:${measureRange ?? ''}`
  );
  const reversedKeys = new Set(
    sentBlocks
      .filter((block) => block.status !== 'rejected')
      .map((block) => blockKey(block.partIndex, block.measureRange)),
  );
  const next = existing.filter((constraint) => (
    constraint.kind !== 'rejected' || !reversedKeys.has(blockKey(constraint.partIndex, constraint.measureRange))
  ));
  const knownRejectedKeys = new Set(
    next
      .filter((constraint) => constraint.kind === 'rejected')
      .map((constraint) => blockKey(constraint.partIndex, constraint.measureRange)),
  );
  for (const block of sentBlocks) {
    if (block.status !== 'rejected') {
      continue;
    }
    const key = blockKey(block.partIndex, block.measureRange);
    if (knownRejectedKeys.has(key)) {
      continue;
    }
    knownRejectedKeys.add(key);
    next.push({
      cycle: revisedCycle,
      kind: 'rejected',
      partIndex: block.partIndex,
      measureRange: block.measureRange,
      text: '',
    });
  }
  const note = globalComment.trim();
  if (note && !next.some((constraint) => constraint.kind === 'note' && constraint.text === note)) {
    next.push({
      cycle: revisedCycle,
      kind: 'note',
      partIndex: null,
      measureRange: null,
      text: note,
    });
  }
  return next.length > CONSTRAINTS_MAX ? next.slice(next.length - CONSTRAINTS_MAX) : next;
}

export function advanceClientProposalSession(session: ClientProposalSession, args: {
  responseId?: unknown;
  newCycle?: unknown;
  proposal?: ProposalHashSource;
  patch?: unknown | null;
  annotations?: PatchAnnotation[];
  sentBlocks: SentFeedbackBlock[];
  sentGlobalComment: string;
}): ClientProposalSession {
  const revisedCycle = session.cycle;
  const newCycle = typeof args.newCycle === 'number' && Number.isInteger(args.newCycle) && args.newCycle > session.cycle
    ? args.newCycle
    : session.cycle + 1;
  return {
    ...session,
    id: (typeof args.responseId === 'string' && args.responseId.trim()) ? args.responseId.trim() : session.id,
    cycle: newCycle,
    previousCycle: buildPreviousCycle(newCycle, args.proposal, args.patch ?? null, args.annotations ?? []),
    constraints: accumulateProposalConstraints(
      session.constraints,
      revisedCycle,
      args.sentBlocks,
      args.sentGlobalComment,
    ),
  };
}

/**
 * Shape the request field for /api/music/diff/feedback. The expected-current hashes come
 * from the compare Apply gate, which advances them after each user-authorized partial
 * Apply — they describe the legitimate partial-Apply state the server should verify
 * lineage against.
 */
export function buildProposalSessionRequestPayload(
  session: ClientProposalSession,
  expectedCurrent: { contentHash: string | null; identityHash: string | null },
): Record<string, unknown> {
  return {
    id: session.id,
    cycle: session.cycle,
    originalInstruction: session.originalInstruction,
    ...(session.previousCycle ? {
      previousCycle: {
        cycle: session.cycle,
        baseContentHash: session.previousCycle.baseContentHash,
        baseIdentityHash: session.previousCycle.baseIdentityHash,
        proposedContentHash: session.previousCycle.proposedContentHash,
        proposedIdentityHash: session.previousCycle.proposedIdentityHash,
        expectedCurrentContentHash: expectedCurrent.contentHash,
        expectedCurrentIdentityHash: expectedCurrent.identityHash,
        patch: session.previousCycle.patch,
        annotations: session.previousCycle.annotations,
      },
    } : {}),
    constraints: session.constraints,
  };
}
