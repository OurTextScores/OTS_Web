import { computeScoreHash } from './scoreops-session-store';
import { resolveScoreContent } from './common';

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
  source: unknown;
  proposedXml: string;
  verification?: unknown;
};

const asRecord = (value: unknown): Record<string, unknown> | null => (
  value && typeof value === 'object' ? value as Record<string, unknown> : null
);

export async function buildAiEditProposal(
  args: BuildAiEditProposalArgs,
): Promise<AiEditProposal | null> {
  if (!args.proposedXml.trim()) {
    return null;
  }
  const resolution = await resolveScoreContent(args.source);
  if (resolution.error || !resolution.xml.trim()) {
    return null;
  }

  const verificationInput = asRecord(args.verification);
  const verificationLevel = verificationInput?.level === 'patch_apply'
    ? 'patch_apply'
    : 'tool_execution';
  const baseContentHash = resolution.session?.contentHash ?? computeScoreHash(resolution.xml);

  return {
    sourceTool: args.sourceTool,
    baseXml: resolution.xml,
    proposedXml: args.proposedXml,
    baseScoreSessionId: resolution.session?.scoreSessionId ?? null,
    baseRevision: resolution.session?.revision ?? null,
    baseContentHash,
    expectedCurrentContentHash: baseContentHash,
    verification: {
      level: verificationLevel,
      ...(typeof verificationInput?.attempts === 'number' ? { attempts: verificationInput.attempts } : {}),
      ...(typeof verificationInput?.llmCalls === 'number' ? { llmCalls: verificationInput.llmCalls } : {}),
    },
  };
}
