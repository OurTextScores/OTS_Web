import type { ResolvedScoreSnapshot } from './common';

export type AiEditProposal = {
  sourceTool: string;
  baseXml: string;
  proposedXml: string;
  baseScoreSessionId: string | null;
  baseRevision: number | null;
  baseContentHash: string;
  expectedCurrentContentHash: string;
  verification: {
    level: 'patch_apply' | 'tool_execution';
    attempts?: number;
    llmCalls?: number;
  };
};

type BuildAiEditProposalArgs = {
  sourceTool: string;
  base: ResolvedScoreSnapshot;
  proposedXml: string;
  verification?: unknown;
};

const asRecord = (value: unknown): Record<string, unknown> | null => (
  value && typeof value === 'object' ? value as Record<string, unknown> : null
);

export function buildAiEditProposal(
  args: BuildAiEditProposalArgs,
): AiEditProposal | null {
  if (!args.proposedXml.trim() || !args.base.xml.trim() || !args.base.contentHash.trim()) {
    return null;
  }

  const verificationInput = asRecord(args.verification);
  const verificationLevel = verificationInput?.level === 'patch_apply'
    ? 'patch_apply'
    : 'tool_execution';

  return {
    sourceTool: args.sourceTool,
    baseXml: args.base.xml,
    proposedXml: args.proposedXml,
    baseScoreSessionId: args.base.scoreSessionId,
    baseRevision: args.base.revision,
    baseContentHash: args.base.contentHash,
    expectedCurrentContentHash: args.base.contentHash,
    verification: {
      level: verificationLevel,
      ...(typeof verificationInput?.attempts === 'number' ? { attempts: verificationInput.attempts } : {}),
      ...(typeof verificationInput?.llmCalls === 'number' ? { llmCalls: verificationInput.llmCalls } : {}),
    },
  };
}
