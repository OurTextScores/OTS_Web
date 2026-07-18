import { describe, expect, it } from 'vitest';

import {
  computeClientScoreHash,
  verifyAiProposalCurrentContent,
} from '../lib/ai-edit-proposal-client';

describe('AI edit proposal content guard', () => {
  it('rejects apply when the live score changed after proposal generation', async () => {
    const baseXml = '<score-partwise><measure number="1"/></score-partwise>';
    const expectedCurrentContentHash = await computeClientScoreHash(baseXml);

    const check = await verifyAiProposalCurrentContent({
      expectedCurrentContentHash,
      baseXml,
      currentXml: '<score-partwise><measure number="1"><note/></measure></score-partwise>',
    });

    expect(check).toMatchObject({
      ok: false,
      expectedCurrentContentHash,
    });
    expect(check.actualCurrentContentHash).not.toBe(expectedCurrentContentHash);
  });

  it('advances the expected hash after a partial apply', async () => {
    const baseXml = '<score-partwise><measure number="1"/><measure number="2"/></score-partwise>';
    const afterFirstApply = '<score-partwise><measure number="1"><note/></measure><measure number="2"/></score-partwise>';
    const initialHash = await computeClientScoreHash(baseXml);

    expect(await verifyAiProposalCurrentContent({
      expectedCurrentContentHash: initialHash,
      baseXml,
      currentXml: baseXml,
    })).toMatchObject({ ok: true });

    const advancedHash = await computeClientScoreHash(afterFirstApply);
    expect(await verifyAiProposalCurrentContent({
      expectedCurrentContentHash: advancedHash,
      baseXml,
      currentXml: afterFirstApply,
    })).toMatchObject({ ok: true });
    expect(await verifyAiProposalCurrentContent({
      expectedCurrentContentHash: initialHash,
      baseXml,
      currentXml: afterFirstApply,
    })).toMatchObject({ ok: false });
  });
});
