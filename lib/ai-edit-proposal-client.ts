export type AiProposalHashCheck = {
  ok: boolean;
  expectedCurrentContentHash: string;
  actualCurrentContentHash: string;
};

export async function computeClientScoreHash(content: string): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('This browser cannot verify the proposal against the current score.');
  }
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(content));
  const hex = Array.from(
    new Uint8Array(digest),
    (byte) => byte.toString(16).padStart(2, '0'),
  ).join('');
  return `sha256:${hex}`;
}

export async function verifyAiProposalCurrentContent(input: {
  expectedCurrentContentHash: string | null;
  baseXml: string;
  currentXml: string;
}): Promise<AiProposalHashCheck> {
  const expectedCurrentContentHash = input.expectedCurrentContentHash
    || await computeClientScoreHash(input.baseXml);
  const actualCurrentContentHash = await computeClientScoreHash(input.currentXml);
  return {
    ok: actualCurrentContentHash === expectedCurrentContentHash,
    expectedCurrentContentHash,
    actualCurrentContentHash,
  };
}
