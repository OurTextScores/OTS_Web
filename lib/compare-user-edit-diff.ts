import { createTwoFilesPatch } from 'diff';

export type CompareScoreRole = 'current' | 'proposal';

export type CompareUserEditDiff = {
  side: CompareScoreRole;
  label: string;
  diff: string;
};

const DEFAULT_MAX_DIFF_CHARS = 24_000;

/**
 * Produce compact, inspectable feedback for edits made directly in a compare pane.
 * MusicXML exported by libmscore is stable enough for a line diff, and using a small
 * context window avoids sending a second full copy of the score to the model.
 */
export function buildCompareUserEditDiff(
  beforeXml: string,
  afterXml: string,
  label: string,
  maxChars = DEFAULT_MAX_DIFF_CHARS,
): string {
  if (beforeXml === afterXml) {
    return '';
  }
  const safeLabel = label.trim() || 'compare-score';
  const patch = createTwoFilesPatch(
    `${safeLabel}-before.musicxml`,
    `${safeLabel}-after.musicxml`,
    beforeXml,
    afterXml,
    'Before manual edits',
    'After manual edits',
    { context: 2 },
  );
  if (patch.length <= maxChars) {
    return patch;
  }
  return `${patch.slice(0, Math.max(0, maxChars - 80))}\n[Manual edit diff truncated at ${maxChars} characters.]`;
}
