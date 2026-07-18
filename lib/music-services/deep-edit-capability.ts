import { randomUUID } from 'node:crypto';
import type { MusicXmlPatch } from './patch-service';

// Phase 3 containment object (design §7). One instance per deep-edit request owns the
// base snapshot, every candidate, and every budget counter. Candidate ids are minted
// here and validated here; sandbox tools never resolve model-supplied ids against any
// wider namespace (sessions, artifacts, files).

export type DeepEditVerificationLevel = 'patch_apply' | 'tool_execution' | 'engine_load' | 'render';

export const DEEP_EDIT_LEVEL_RANK: Record<DeepEditVerificationLevel, number> = {
  tool_execution: 0,
  patch_apply: 1,
  engine_load: 2,
  render: 3,
};

export type DeepEditScore = {
  kind: string;
  value: number | string;
  detail?: string;
};

export type DeepEditCandidate = {
  id: string;
  parentId: string | null;
  xml: string;
  createdByTool: 'apply_patch' | 'scoreops';
  patch?: MusicXmlPatch;
  verification: DeepEditVerificationLevel;
  engineError?: string;
  scores: DeepEditScore[];
};

export type DeepEditBudgets = {
  maxLlmCalls: number;
  maxToolCalls: number;
  maxCandidates: number;
  maxRenders: number;
  budgetMs: number;
  maxCandidateBytes: number;
  maxTotalBytes: number;
};

export type DeepEditCounters = {
  llmCalls: number;
  toolCalls: number;
  renders: number;
  candidateBytes: number;
};

export type DeepEditChargeResult =
  | { ok: true }
  | { ok: false; reason: 'llm_calls' | 'tool_calls' | 'renders' | 'deadline' };

export type DeepEditMintResult =
  | { ok: true; candidate: DeepEditCandidate }
  | { ok: false; reason: 'candidate_limit' | 'candidate_bytes' | 'total_bytes' };

export const DEEP_EDIT_BASE_ID = 'base';

const CANDIDATE_ID_PATTERN = /^cand-[0-9]+$/;

const byteLength = (value: string) => Buffer.byteLength(value, 'utf8');

export class DeepEditCapability {
  readonly requestId: string;
  readonly baseXml: string;
  readonly budgets: DeepEditBudgets;
  readonly counters: DeepEditCounters;
  readonly deadlineAt: number;

  private readonly candidates = new Map<string, DeepEditCandidate>();
  private readonly controller = new AbortController();
  private readonly deadlineTimer: ReturnType<typeof setTimeout>;
  private readonly parentAbortListener: (() => void) | null = null;
  private readonly parentSignal: AbortSignal | null;
  private nextCandidateNumber = 1;
  private strongestAttempted: DeepEditVerificationLevel = 'tool_execution';

  constructor(args: { baseXml: string; budgets: DeepEditBudgets; parentSignal?: AbortSignal }) {
    this.requestId = randomUUID();
    this.baseXml = args.baseXml;
    this.budgets = args.budgets;
    this.counters = { llmCalls: 0, toolCalls: 0, renders: 0, candidateBytes: 0 };
    this.deadlineAt = Date.now() + args.budgets.budgetMs;
    this.deadlineTimer = setTimeout(() => {
      this.controller.abort(new Error('Deep edit exceeded its request budget.'));
    }, args.budgets.budgetMs);
    this.parentSignal = args.parentSignal ?? null;
    if (this.parentSignal) {
      const listener = () => this.controller.abort(this.parentSignal?.reason);
      if (this.parentSignal.aborted) {
        listener();
      } else {
        this.parentSignal.addEventListener('abort', listener, { once: true });
        this.parentAbortListener = listener;
      }
    }
  }

  get signal(): AbortSignal {
    return this.controller.signal;
  }

  remainingMs(): number {
    return Math.max(0, this.deadlineAt - Date.now());
  }

  expired(): boolean {
    return this.signal.aborted || this.remainingMs() <= 0;
  }

  chargeLlmCall(): DeepEditChargeResult {
    if (this.expired()) {
      return { ok: false, reason: 'deadline' };
    }
    if (this.counters.llmCalls >= this.budgets.maxLlmCalls) {
      return { ok: false, reason: 'llm_calls' };
    }
    this.counters.llmCalls += 1;
    return { ok: true };
  }

  chargeToolCall(): DeepEditChargeResult {
    if (this.expired()) {
      return { ok: false, reason: 'deadline' };
    }
    if (this.counters.toolCalls >= this.budgets.maxToolCalls) {
      return { ok: false, reason: 'tool_calls' };
    }
    this.counters.toolCalls += 1;
    return { ok: true };
  }

  chargeRender(): DeepEditChargeResult {
    if (this.expired()) {
      return { ok: false, reason: 'deadline' };
    }
    if (this.counters.renders >= this.budgets.maxRenders) {
      return { ok: false, reason: 'renders' };
    }
    this.counters.renders += 1;
    return { ok: true };
  }

  /** Valid ids for tool arguments: the base snapshot or a capability-minted candidate. */
  isValidSourceId(id: string): boolean {
    return id === DEEP_EDIT_BASE_ID || (CANDIDATE_ID_PATTERN.test(id) && this.candidates.has(id));
  }

  resolveXml(id: string): string | null {
    if (id === DEEP_EDIT_BASE_ID) {
      return this.baseXml;
    }
    return this.candidates.get(id)?.xml ?? null;
  }

  getCandidate(id: string): DeepEditCandidate | null {
    return this.candidates.get(id) ?? null;
  }

  mintCandidate(args: {
    parentId: string;
    xml: string;
    createdByTool: DeepEditCandidate['createdByTool'];
    patch?: MusicXmlPatch;
    verification: Extract<DeepEditVerificationLevel, 'patch_apply' | 'tool_execution'>;
  }): DeepEditMintResult {
    if (this.candidates.size >= this.budgets.maxCandidates) {
      return { ok: false, reason: 'candidate_limit' };
    }
    const bytes = byteLength(args.xml);
    if (bytes > this.budgets.maxCandidateBytes) {
      return { ok: false, reason: 'candidate_bytes' };
    }
    if (this.counters.candidateBytes + bytes > this.budgets.maxTotalBytes) {
      return { ok: false, reason: 'total_bytes' };
    }
    const candidate: DeepEditCandidate = {
      id: `cand-${this.nextCandidateNumber}`,
      parentId: args.parentId,
      xml: args.xml,
      createdByTool: args.createdByTool,
      ...(args.patch ? { patch: args.patch } : {}),
      verification: args.verification,
      scores: [],
    };
    this.nextCandidateNumber += 1;
    this.candidates.set(candidate.id, candidate);
    this.counters.candidateBytes += bytes;
    this.recordAttemptedLevel(args.verification);
    return { ok: true, candidate };
  }

  recordVerification(candidateId: string, level: DeepEditVerificationLevel, engineError?: string): void {
    const candidate = this.candidates.get(candidateId);
    if (!candidate) {
      return;
    }
    if (engineError !== undefined) {
      candidate.engineError = engineError.slice(0, 2_000);
      return;
    }
    if (DEEP_EDIT_LEVEL_RANK[level] > DEEP_EDIT_LEVEL_RANK[candidate.verification]) {
      candidate.verification = level;
    }
    delete candidate.engineError;
    this.recordAttemptedLevel(level);
  }

  recordScore(candidateId: string, score: DeepEditScore): boolean {
    const candidate = this.candidates.get(candidateId);
    if (!candidate) {
      return false;
    }
    if (candidate.scores.length >= 20) {
      return false;
    }
    candidate.scores.push({
      kind: score.kind.slice(0, 64),
      value: typeof score.value === 'string' ? score.value.slice(0, 200) : score.value,
      ...(score.detail ? { detail: score.detail.slice(0, 500) } : {}),
    });
    return true;
  }

  /**
   * Record that a verification level was exercised in this run, whether or not it
   * succeeded. The finalize gate holds every winner to the strongest attempted level, so
   * a failed engine check on one candidate still raises the bar for all of them.
   */
  noteAttemptedLevel(level: DeepEditVerificationLevel): void {
    this.recordAttemptedLevel(level);
  }

  /** Strongest verification level attempted on any candidate during this run. */
  strongestAttemptedLevel(): DeepEditVerificationLevel {
    return this.strongestAttempted;
  }

  candidateCount(): number {
    return this.candidates.size;
  }

  auditCandidates(): Array<{
    id: string;
    parentId: string | null;
    createdByTool: string;
    verification: DeepEditVerificationLevel;
    engineError?: string;
    scores: DeepEditScore[];
  }> {
    return [...this.candidates.values()].map((candidate) => ({
      id: candidate.id,
      parentId: candidate.parentId,
      createdByTool: candidate.createdByTool,
      verification: candidate.verification,
      ...(candidate.engineError ? { engineError: candidate.engineError } : {}),
      scores: candidate.scores,
    }));
  }

  dispose(): void {
    clearTimeout(this.deadlineTimer);
    if (this.parentSignal && this.parentAbortListener) {
      this.parentSignal.removeEventListener('abort', this.parentAbortListener);
    }
    if (!this.controller.signal.aborted) {
      this.controller.abort(new Error('Deep edit request completed.'));
    }
  }

  private recordAttemptedLevel(level: DeepEditVerificationLevel): void {
    if (DEEP_EDIT_LEVEL_RANK[level] > DEEP_EDIT_LEVEL_RANK[this.strongestAttempted]) {
      this.strongestAttempted = level;
    }
  }
}
