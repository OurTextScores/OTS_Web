import { describe, expect, it } from 'vitest';

import { computeMusicXmlIdentityHashServer } from '../lib/musicxml-identity-server';
import { computeScoreHash } from '../lib/music-services/scoreops-session-store';
import {
  evaluateProposalLineage,
  parseProposalSessionContext,
  type ProposalPreviousCycle,
} from '../lib/music-services/proposal-session-context';

const BASE_XML = '<score-partwise version="4.0"><part-list/><part id="P1"><measure number="1"/></part></score-partwise>';
const PROPOSED_XML = '<score-partwise version="4.0"><part-list/><part id="P1"><measure number="1"><note/></measure></part></score-partwise>';
const OTHER_XML = '<score-partwise version="4.0"><part-list/><part id="P1"><measure number="2"/></part></score-partwise>';

const VALID_PATCH = {
  format: 'musicxml-patch@1',
  ops: [{ op: 'setText', path: '/score-partwise/part/measure/note/duration', value: '2' }],
};

const validPreviousCycle = (overrides: Record<string, unknown> = {}) => ({
  cycle: 1,
  baseContentHash: computeScoreHash(BASE_XML),
  baseIdentityHash: computeMusicXmlIdentityHashServer(BASE_XML),
  proposedContentHash: computeScoreHash(PROPOSED_XML),
  proposedIdentityHash: computeMusicXmlIdentityHashServer(PROPOSED_XML),
  patch: VALID_PATCH,
  annotations: [{ part: 1, measure: 3, comment: 'Raised the third.' }],
  ...overrides,
});

const validInput = (overrides: Record<string, unknown> = {}) => ({
  id: 'sess-abc.123',
  cycle: 1,
  originalInstruction: 'Transpose the melody up a third.',
  previousCycle: validPreviousCycle(),
  constraints: [
    { cycle: 1, kind: 'rejected', partIndex: 0, measureRange: '3-4', text: '' },
    { cycle: 1, kind: 'note', partIndex: null, measureRange: null, text: 'Keep dynamics gentle.' },
  ],
  ...overrides,
});

describe('parseProposalSessionContext', () => {
  it('returns null context when absent', () => {
    const result = parseProposalSessionContext(undefined, { iteration: 0 });
    expect(result).toMatchObject({ context: null, flags: { provided: false, lineage: 'none' } });
  });

  it('parses a valid context with previous cycle and constraints', () => {
    const result = parseProposalSessionContext(validInput(), { iteration: 0 });
    if (!('context' in result) || !result.context) {
      throw new Error(`expected context, got ${JSON.stringify(result)}`);
    }
    expect(result.context.id).toBe('sess-abc.123');
    expect(result.context.cycle).toBe(1);
    expect(result.context.originalInstruction).toContain('Transpose');
    expect(result.context.previousCycle?.patchJson).toContain('musicxml-patch@1');
    expect(result.context.previousCycle?.annotations).toEqual([
      { partIndex: 0, measure: 3, comment: 'Raised the third.' },
    ]);
    expect(result.context.constraints).toHaveLength(2);
    expect(result.flags.truncated).toEqual([]);
  });

  it.each([
    ['bad id', validInput({ id: 'bad id with spaces' }), 'id'],
    ['cycle zero', validInput({ cycle: 0 }), 'cycle'],
    ['cycle/iteration mismatch', validInput({ cycle: 3 }), 'iteration'],
    ['previousCycle cycle mismatch', validInput({ previousCycle: validPreviousCycle({ cycle: 2 }) }), 'previousCycle.cycle'],
    ['previousCycle missing hashes', validInput({ previousCycle: validPreviousCycle({ baseContentHash: 'nope' }) }), 'hashes'],
    ['previousCycle bad patch', validInput({ previousCycle: validPreviousCycle({ patch: { format: 'other' } }) }), 'patch'],
    ['constraints not array', validInput({ constraints: 'nope' }), 'constraints'],
    ['constraint bad kind', validInput({ constraints: [{ cycle: 1, kind: 'weird', text: 'x' }] }), 'kind'],
    ['constraint future cycle', validInput({ constraints: [{ cycle: 5, kind: 'note', text: 'x' }] }), 'cycle'],
  ])('rejects structural violation: %s', (_label, input, errorFragment) => {
    const result = parseProposalSessionContext(input, { iteration: 0 });
    expect('error' in result && result.error).toContain(errorFragment);
  });

  it('truncates oversized instruction deterministically and flags it', () => {
    const result = parseProposalSessionContext(
      validInput({ originalInstruction: 'x'.repeat(10_000) }),
      { iteration: 0 },
    );
    if (!('context' in result) || !result.context) {
      throw new Error('expected context');
    }
    expect(result.context.originalInstruction).toHaveLength(4_000);
    expect(result.flags.truncated).toContain('originalInstruction');
  });

  it('omits an oversized previous patch instead of truncating its JSON', () => {
    const hugePatch = {
      format: 'musicxml-patch@1',
      ops: Array.from({ length: 2_000 }, (_, i) => ({
        op: 'setText',
        path: `/score-partwise/part/measure[@number='${i}']/note/duration`,
        value: 'x'.repeat(60),
      })),
    };
    const result = parseProposalSessionContext(
      validInput({ previousCycle: validPreviousCycle({ patch: hugePatch }) }),
      { iteration: 0 },
    );
    if (!('context' in result) || !result.context) {
      throw new Error('expected context');
    }
    expect(result.context.previousCycle?.patchJson).toBe('');
    expect(result.flags.truncated).toContain('previousPatch');
  });

  it('keeps the most recent constraints when over the cap', () => {
    const constraints = Array.from({ length: 200 }, (_, i) => ({
      cycle: 1 + Math.floor(i / 100),
      kind: 'note',
      partIndex: null,
      measureRange: null,
      text: `constraint ${i}`,
    }));
    const result = parseProposalSessionContext(
      validInput({ cycle: 2, previousCycle: validPreviousCycle({ cycle: 2 }), constraints }),
      { iteration: 1 },
    );
    if (!('context' in result) || !result.context) {
      throw new Error('expected context');
    }
    expect(result.context.constraints).toHaveLength(120);
    expect(result.context.constraints.at(-1)?.text).toBe('constraint 199');
    expect(result.context.constraints[0]?.text).toBe('constraint 80');
    expect(result.flags.truncated).toContain('constraints');
  });

  it('sanitizes control characters and drops empty constraints', () => {
    const result = parseProposalSessionContext(
      validInput({
        originalInstruction: 'line\u0000one\u0007 two',
        constraints: [{ cycle: 1, kind: 'note', partIndex: null, measureRange: null, text: '\u0000 \u0007 ' }],
      }),
      { iteration: 0 },
    );
    if (!('context' in result) || !result.context) {
      throw new Error('expected context');
    }
    expect(result.context.originalInstruction).toBe('line one two');
    expect(result.context.constraints).toHaveLength(0);
  });
});

describe('evaluateProposalLineage', () => {
  const previousCycle = (overrides: Partial<ProposalPreviousCycle> = {}): ProposalPreviousCycle => ({
    cycle: 1,
    baseContentHash: computeScoreHash(BASE_XML),
    baseIdentityHash: computeMusicXmlIdentityHashServer(BASE_XML),
    proposedContentHash: computeScoreHash(PROPOSED_XML),
    proposedIdentityHash: computeMusicXmlIdentityHashServer(PROPOSED_XML),
    expectedCurrentContentHash: null,
    expectedCurrentIdentityHash: null,
    patchJson: '',
    annotations: [],
    ...overrides,
  });

  it('returns none without a previous cycle', () => {
    expect(evaluateProposalLineage(BASE_XML, null)).toBe('none');
  });

  it('verifies when current equals the previous base (nothing applied)', () => {
    expect(evaluateProposalLineage(BASE_XML, previousCycle())).toBe('verified');
  });

  it('verifies when current equals the previous proposal (all applied)', () => {
    expect(evaluateProposalLineage(PROPOSED_XML, previousCycle())).toBe('verified');
  });

  it('verifies a partial-apply state via the expected-current hash', () => {
    expect(evaluateProposalLineage(OTHER_XML, previousCycle({
      expectedCurrentContentHash: computeScoreHash(OTHER_XML),
    }))).toBe('verified');
  });

  it('verifies via identity hash when raw bytes drifted', () => {
    const reserialized = `${BASE_XML}\n`;
    expect(computeScoreHash(reserialized)).not.toBe(computeScoreHash(BASE_XML));
    expect(evaluateProposalLineage(reserialized, previousCycle())).toBe('verified');
  });

  it('reports mismatch when no hash matches', () => {
    expect(evaluateProposalLineage(OTHER_XML, previousCycle())).toBe('mismatch');
  });

  it('reports mismatch for unparseable current XML instead of throwing', () => {
    expect(evaluateProposalLineage('<score-partwise><unclosed>', previousCycle())).toBe('mismatch');
  });
});
