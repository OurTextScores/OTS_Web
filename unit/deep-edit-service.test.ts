import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => ({
  loadWebMscoreInProcess: vi.fn(),
  renderMusicSnapshot: vi.fn(),
  updateScoreOpsSession: vi.fn(),
  createScoreOpsSession: vi.fn(),
  createScoreArtifact: vi.fn(),
}));

vi.mock('../lib/webmscore-loader', () => ({
  loadWebMscoreInProcess: mocked.loadWebMscoreInProcess,
}));

vi.mock('../lib/music-conversion', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  renderMusicSnapshot: mocked.renderMusicSnapshot,
}));

vi.mock('../lib/score-artifacts', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createScoreArtifact: mocked.createScoreArtifact,
}));

vi.mock('../lib/music-services/scoreops-session-store', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  updateScoreOpsSession: mocked.updateScoreOpsSession,
  createScoreOpsSession: mocked.createScoreOpsSession,
}));

import {
  runDeepEditService,
  summarizeMeasureDifferences,
  type DeepEditDriver,
} from '../lib/music-services/deep-edit-service';
import { resolveDeepEditBudgets } from '../lib/music-services/deep-edit-service';
import type { DeepEditBudgets } from '../lib/music-services/deep-edit-capability';

const BASE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  <part-list><score-part id="P1"><part-name>Piano</part-name></score-part></part-list>
  <part id="P1">
    <measure number="1">
      <note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration></note>
    </measure>
  </part>
</score-partwise>`;

const VALID_PATCH = {
  format: 'musicxml-patch@1',
  ops: [{
    op: 'setText',
    path: '/score-partwise/part[@id="P1"]/measure[@number="1"]/note[1]/pitch/step',
    value: 'G',
  }],
};

const budgets = (overrides: Partial<DeepEditBudgets> = {}): DeepEditBudgets => ({
  ...resolveDeepEditBudgets(),
  ...overrides,
});

const request = (overrides: Record<string, unknown> = {}) => ({
  prompt: 'Change the first note to G.',
  content: BASE_XML,
  provider: 'openai',
  model: 'gpt-test-model',
  apiKey: 'sk-test',
  ...overrides,
});

const engineLoadOk = () => {
  mocked.loadWebMscoreInProcess.mockResolvedValue({
    load: vi.fn().mockResolvedValue({ destroy: vi.fn() }),
  });
};

describe('runDeepEditService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ships an engine-verified patch candidate and never touches user stores', async () => {
    engineLoadOk();
    const driver: DeepEditDriver = async ({ executeTool }) => {
      const applied = await executeTool('sandbox_apply_patch', { baseCandidateId: 'base', patch: VALID_PATCH });
      expect(applied.ok).toBe(true);
      const checked = await executeTool('sandbox_engine_check', { candidateId: applied.candidateId });
      expect(checked.ok).toBe(true);
      return { candidateId: String(applied.candidateId), rationale: 'Only candidate; engine verified.' };
    };

    const result = await runDeepEditService(request(), { driveAgent: driver });

    expect(result.status).toBe(200);
    expect(result.body.proposal).toMatchObject({
      sourceTool: 'music.deep_edit',
      baseXml: BASE_XML,
      verification: { level: 'engine_load' },
    });
    expect(String((result.body.proposal as Record<string, unknown>).proposedXml)).toContain('<step>G</step>');
    expect(result.body.patch).toMatchObject({ format: 'musicxml-patch@1' });
    expect(String(result.body.proposalSessionId)).toMatch(/^[0-9a-f-]{36}$/);
    expect(String(result.body.continuityToken)).toMatch(/^pct-v1:/);
    expect(result.body.cycle).toBe(1);
    const audit = result.body.deepEdit as Record<string, any>;
    expect(audit.finalizedCandidateId).toBe('cand-1');
    expect(audit.counters.toolCalls).toBe(2);
    expect(JSON.stringify(audit.candidates)).not.toContain('<score-partwise');

    expect(mocked.updateScoreOpsSession).not.toHaveBeenCalled();
    expect(mocked.createScoreOpsSession).not.toHaveBeenCalled();
    expect(mocked.createScoreArtifact).not.toHaveBeenCalled();
  });

  it('gates an unchecked finalized candidate by running the missing check itself', async () => {
    engineLoadOk();
    const driver: DeepEditDriver = async ({ executeTool }) => {
      const first = await executeTool('sandbox_apply_patch', { baseCandidateId: 'base', patch: VALID_PATCH });
      const checked = await executeTool('sandbox_engine_check', { candidateId: first.candidateId });
      expect(checked.ok).toBe(true);
      // Second candidate is finalized WITHOUT its own engine check.
      const second = await executeTool('sandbox_apply_patch', { baseCandidateId: 'base', patch: VALID_PATCH });
      return { candidateId: String(second.candidateId), rationale: 'Prefer the second attempt.' };
    };

    const result = await runDeepEditService(request(), { driveAgent: driver });

    expect(result.status).toBe(200);
    expect((result.body.proposal as Record<string, any>).verification.level).toBe('engine_load');
    const audit = result.body.deepEdit as Record<string, any>;
    // 3 model tool calls + 1 gate-run engine check.
    expect(audit.counters.toolCalls).toBe(4);
  });

  it('fails the gate when the finalized candidate cannot load in the engine', async () => {
    mocked.loadWebMscoreInProcess.mockResolvedValue({
      load: vi.fn().mockRejectedValue(new Error('corrupt beam group')),
    });
    const driver: DeepEditDriver = async ({ executeTool }) => {
      const first = await executeTool('sandbox_apply_patch', { baseCandidateId: 'base', patch: VALID_PATCH });
      const checked = await executeTool('sandbox_engine_check', { candidateId: first.candidateId });
      expect(checked.ok).toBe(false);
      return { candidateId: String(first.candidateId), rationale: 'Trying anyway.' };
    };

    const result = await runDeepEditService(request(), { driveAgent: driver });

    expect(result.status).toBe(422);
    expect(result.body.errorCategory).toBe('gate_failed');
    expect(String(result.body.error)).toContain('engine');
    const audit = result.body.deepEdit as Record<string, any>;
    expect(audit.candidates[0].engineError).toContain('corrupt beam group');
  });

  it('requires engine verification for scoreops-born candidates even when never attempted', async () => {
    engineLoadOk();
    const driver: DeepEditDriver = async ({ executeTool }) => {
      const created = await executeTool('sandbox_scoreops', {
        baseCandidateId: 'base',
        ops: [{ op: 'set_metadata_text', field: 'title', value: 'Deep Edit Title' }],
      });
      expect(created.ok).toBe(true);
      return { candidateId: String(created.candidateId), rationale: 'Edited via ScoreOps.' };
    };

    const result = await runDeepEditService(request(), { driveAgent: driver });

    expect(result.status).toBe(200);
    expect((result.body.proposal as Record<string, any>).verification.level).toBe('engine_load');
    expect(mocked.loadWebMscoreInProcess).toHaveBeenCalled();
  });

  it('rejects model-supplied ids that are not capability-minted candidates', async () => {
    const driver: DeepEditDriver = async ({ executeTool }) => {
      const bySession = await executeTool('sandbox_engine_check', { candidateId: 'sess_live_user_score' });
      expect(bySession.ok).toBe(false);
      expect(String(bySession.error)).toContain('not a live candidate id');
      const byPath = await executeTool('sandbox_measure_diff', { candidateId: '../artifacts/x' });
      expect(byPath.ok).toBe(false);
      return null;
    };

    const result = await runDeepEditService(request(), { driveAgent: driver });
    expect(result.status).toBe(422);
    expect(result.body.errorCategory).toBe('no_finalize');
  });

  it('stops the loop deterministically at the tool-call budget', async () => {
    const driver: DeepEditDriver = async ({ executeTool }) => {
      let lastBudgetError = '';
      for (let i = 0; i < 10; i += 1) {
        const outcome = await executeTool('sandbox_apply_patch', { baseCandidateId: 'base', patch: VALID_PATCH });
        if (!outcome.ok && typeof outcome.budget === 'string') {
          lastBudgetError = String(outcome.budget);
          break;
        }
      }
      expect(lastBudgetError).toBe('tool_calls');
      return null;
    };

    const result = await runDeepEditService(request(), {
      driveAgent: driver,
      budgets: budgets({ maxToolCalls: 3, maxCandidates: 8 }),
    });

    expect(result.status).toBe(422);
    expect(result.body.errorCategory).toBe('budget_exhausted');
    const audit = result.body.deepEdit as Record<string, any>;
    expect(audit.counters.toolCalls).toBe(3);
  });

  it('reports budget_exhausted when gating the winner would exceed the budget', async () => {
    engineLoadOk();
    const driver: DeepEditDriver = async ({ executeTool }) => {
      const first = await executeTool('sandbox_apply_patch', { baseCandidateId: 'base', patch: VALID_PATCH });
      await executeTool('sandbox_engine_check', { candidateId: first.candidateId });
      const second = await executeTool('sandbox_apply_patch', { baseCandidateId: 'base', patch: VALID_PATCH });
      return { candidateId: String(second.candidateId), rationale: 'Second, ungated.' };
    };

    const result = await runDeepEditService(request(), {
      driveAgent: driver,
      // Exactly enough for the three driver calls; the gate's engine check cannot charge.
      budgets: budgets({ maxToolCalls: 3 }),
    });

    expect(result.status).toBe(422);
    expect(result.body.errorCategory).toBe('budget_exhausted');
  });

  it('counts renders separately and upgrades the winner to render level', async () => {
    engineLoadOk();
    mocked.renderMusicSnapshot.mockResolvedValue({ buffer: Buffer.from([1, 2, 3]), mimeType: 'image/png' });
    const driver: DeepEditDriver = async ({ executeTool }) => {
      const applied = await executeTool('sandbox_apply_patch', { baseCandidateId: 'base', patch: VALID_PATCH });
      const rendered = await executeTool('sandbox_render', { candidateId: applied.candidateId });
      expect(rendered.ok).toBe(true);
      const again = await executeTool('sandbox_render', { candidateId: applied.candidateId });
      expect(again).toMatchObject({ ok: false, budget: 'renders' });
      return { candidateId: String(applied.candidateId), rationale: 'Render-verified.' };
    };

    const result = await runDeepEditService(request(), {
      driveAgent: driver,
      budgets: budgets({ maxRenders: 1 }),
    });

    expect(result.status).toBe(200);
    expect((result.body.proposal as Record<string, any>).verification.level).toBe('render');
    const audit = result.body.deepEdit as Record<string, any>;
    expect(audit.counters.renders).toBe(1);
  });

  it('returns typed request errors before any loop work', async () => {
    const driver = vi.fn();
    const missingInstruction = await runDeepEditService(request({ prompt: '' }), { driveAgent: driver });
    expect(missingInstruction.status).toBe(400);
    const badProvider = await runDeepEditService(request({ provider: 'gemini' }), { driveAgent: driver });
    expect(badProvider.status).toBe(400);
    expect(String(badProvider.body.error)).toContain('OpenAI and Anthropic');
    const withImage = await runDeepEditService(request({ image: { mediaType: 'image/png', base64: 'aa' } }), { driveAgent: driver });
    expect(withImage.status).toBe(400);
    const notXml = await runDeepEditService(request({ content: 'not xml' }), { driveAgent: driver });
    expect(notXml.status).toBe(400);
    expect(driver).not.toHaveBeenCalled();
  });

  it('maps a provider failure in the loop to a 502 with audit', async () => {
    const driver: DeepEditDriver = async () => {
      throw new Error('upstream 500');
    };
    const result = await runDeepEditService(request(), { driveAgent: driver });
    expect(result.status).toBe(502);
    expect(result.body.errorCategory).toBe('provider');
    expect(result.body.deepEdit).toBeTruthy();
  });
});

describe('summarizeMeasureDifferences', () => {
  it('reports changed, added, and removed measures compactly', () => {
    const left = '<part id="P1"><measure number="1"><note>a</note></measure><measure number="2"><note>b</note></measure></part>';
    const right = '<part id="P1"><measure number="1"><note>a</note></measure><measure number="2"><note>B</note></measure><measure number="3"><note>c</note></measure></part>';
    expect(summarizeMeasureDifferences(left, right)).toMatchObject({
      changedMeasures: ['P1:2'],
      addedMeasures: ['P1:3'],
      removedMeasures: [],
      changedCount: 1,
      addedCount: 1,
      removedCount: 0,
    });
  });
});
