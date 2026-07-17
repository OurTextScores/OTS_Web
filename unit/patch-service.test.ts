import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => ({
  getScoreArtifact: vi.fn(),
  summarizeScoreArtifact: vi.fn((artifact: { id: string; format: string }) => ({
    id: artifact.id,
    format: artifact.format,
  })),
}));

vi.mock('../lib/score-artifacts', () => ({
  getScoreArtifact: mocked.getScoreArtifact,
  summarizeScoreArtifact: mocked.summarizeScoreArtifact,
}));

import {
  applyMusicXmlPatch,
  generateApplyVerifiedPatch,
  parseMusicXmlPatch,
  runMusicPatchService,
} from '../lib/music-services/patch-service';

const BASE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  <part-list><score-part id="P1"><part-name>Music</part-name></score-part></part-list>
  <part id="P1"><measure number="1"><note><rest/><duration>1</duration><type>quarter</type></note></measure></part>
</score-partwise>`;

const validPatchText = (annotations?: unknown[]) => JSON.stringify({
  format: 'musicxml-patch@1',
  ops: [{
    op: 'setText',
    path: '/score-partwise/part[@id="P1"]/measure[@number="1"]/note/duration',
    value: '2',
  }],
  ...(annotations ? { annotations } : {}),
});

const PATCH_ENV_KEYS = [
  'MUSIC_PATCH_MAX_ATTEMPTS',
  'MUSIC_PATCH_TRANSPORT_RETRIES',
  'MUSIC_PATCH_BUDGET_MS',
  'MUSIC_AI_REQUEST_TIMEOUT_MS',
  'MUSIC_PATCH_TRANSPORT_RETRY_DELAY_MS',
  'MUSIC_PATCH_MAX_CONTENT_BYTES',
  'MUSIC_PATCH_MAX_PROMPT_CHARS',
  'MUSIC_PATCH_MAX_IMAGE_BYTES',
  'MUSIC_PATCH_MAX_PDF_BYTES',
  'MUSIC_PATCH_MAX_CANDIDATE_CHARS',
  'MUSIC_PATCH_MAX_OUTPUT_BYTES',
  'ALLOW_SERVER_LLM_KEYS',
];

describe('runMusicPatchService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.OPENAI_API_KEY;
    delete process.env.ALLOW_SERVER_LLM_KEYS;
  });

  afterEach(() => {
    PATCH_ENV_KEYS.forEach((key) => delete process.env[key]);
    vi.restoreAllMocks();
  });

  it('returns 400 when prompt is missing', async () => {
    const result = await runMusicPatchService({
      content: '<score-partwise version="4.0"></score-partwise>',
    });
    expect(result.status).toBe(400);
    expect(result.body).toMatchObject({
      error: 'Missing prompt for music patch generation.',
    });
  });

  it('returns dry-run response without calling OpenAI', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const result = await runMusicPatchService({
      prompt: 'Change key signature to G major',
      content: '<score-partwise version="4.0"></score-partwise>',
      dryRun: true,
      model: 'gpt-5.5',
    });

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      ready: false,
      request: {
        model: 'gpt-5.5',
      },
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns 400 when no API key is provided for non-dry-run requests', async () => {
    const result = await runMusicPatchService({
      prompt: 'Remove CLEAN VERSION text',
      content: '<score-partwise version="4.0"></score-partwise>',
    });
    expect(result.status).toBe(400);
    expect(result.body).toMatchObject({
      error: 'Missing OpenAI API key for music patch generation.',
    });
  });

  it('does not use a server API key unless server credential fallback is enabled', async () => {
    process.env.OPENAI_API_KEY = 'sk-server';
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const result = await runMusicPatchService({
      prompt: 'Remove CLEAN VERSION text',
      content: '<score-partwise version="4.0"></score-partwise>',
    });

    expect(result.status).toBe(400);
    expect(result.body).toMatchObject({
      error: 'Missing OpenAI API key for music patch generation.',
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects non-MusicXML and malformed MusicXML before calling a provider', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const nonMusicXml = await runMusicPatchService({
      prompt: 'Change it.',
      content: '<html></html>',
      apiKey: 'sk-test',
    });
    const malformedMusicXml = await runMusicPatchService({
      prompt: 'Change it.',
      content: '<score-partwise><part></score-partwise>',
      apiKey: 'sk-test',
    });

    expect(nonMusicXml.status).toBe(400);
    expect(nonMusicXml.body).toMatchObject({
      error: {
        code: 'invalid_request',
        message: 'Input does not look like MusicXML, ABC, or **kern.',
      },
    });
    expect(malformedMusicXml.status).toBe(400);
    expect(malformedMusicXml.body).toMatchObject({ error: 'Base MusicXML is not valid XML.' });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects oversized attachments before calling a provider', async () => {
    process.env.MUSIC_PATCH_MAX_IMAGE_BYTES = '1000';
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const result = await runMusicPatchService({
      prompt: 'Change it.',
      content: BASE_XML,
      apiKey: 'sk-test',
      image: {
        mediaType: 'image/png',
        base64: Buffer.alloc(1001).toString('base64'),
      },
    });

    expect(result.status).toBe(413);
    expect(result.body).toMatchObject({ error: 'Image attachment exceeds the 1000 byte limit.' });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns 422 when model response is not a patch payload', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        output: [{ type: 'message', content: [{ text: '{"oops":true}' }] }],
      }),
    } as Response);

    const result = await runMusicPatchService({
      prompt: 'Fix beaming in measure 29',
      content: '<score-partwise version="4.0"></score-partwise>',
      apiKey: 'sk-test',
    });

    expect(fetchSpy).toHaveBeenCalledTimes(3);
    expect(result.status).toBe(422);
    expect(result.body).toMatchObject({
      error: 'Model response is not a musicxml-patch@1 payload.',
      verification: {
        level: 'patch_apply',
        attempts: 3,
        llmCalls: 3,
      },
    });
  });

  it('returns parsed patch for successful OpenAI responses output', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        output: [{
          type: 'message',
          content: [{
            text: validPatchText(),
          }],
        }],
      }),
    } as Response);

    const result = await runMusicPatchService({
      prompt: 'Change key signature to G major',
      content: BASE_XML,
      apiKey: 'sk-test',
      model: 'gpt-5.5',
    });

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      mode: 'openai-responses',
      model: 'gpt-5.5',
      patch: {
        format: 'musicxml-patch@1',
        ops: [
          {
            op: 'setText',
            path: '/score-partwise/part[@id="P1"]/measure[@number="1"]/note/duration',
            value: '2',
          },
        ],
      },
      proposedXml: expect.stringContaining('<duration>2</duration>'),
      verification: {
        level: 'patch_apply',
        attempts: 1,
        llmCalls: 1,
      },
    });
  });
});

describe('generateApplyVerifiedPatch', () => {
  afterEach(() => {
    PATCH_ENV_KEYS.forEach((key) => delete process.env[key]);
  });

  it('includes the failed candidate and exact XPath error when repairing', async () => {
    const prompts: string[] = [];
    const badCandidate = JSON.stringify({
      format: 'musicxml-patch@1',
      ops: [{ op: 'setText', path: '/score-partwise/part[@id="P9"]', value: 'bad' }],
    });
    const responses = [badCandidate, validPatchText()];
    const result = await generateApplyVerifiedPatch({
      provider: 'openai',
      apiKey: 'sk-test',
      model: 'gpt-4.1',
      baseXml: BASE_XML,
      promptText: 'Fix the duration.',
      maxTokens: null,
      requestText: async (args) => {
        args.onRequest?.();
        prompts.push(args.promptText);
        return responses.shift() || '';
      },
    });

    expect(result.ok).toBe(true);
    expect(result.verification).toMatchObject({ attempts: 2, llmCalls: 2 });
    expect(prompts[1]).toContain(badCandidate);
    expect(prompts[1]).toContain('Patch op 1 failed: XPath "/score-partwise/part[@id=\"P9\"]" matched 0 nodes.');
  });

  it('repairs malformed JSON and preserves annotations from the successful candidate', async () => {
    const annotations = [{ partIndex: 0, measure: 1, comment: 'Lengthened the rest.' }];
    const responses = ['not json', validPatchText(annotations)];
    const result = await generateApplyVerifiedPatch({
      provider: 'openai',
      apiKey: 'sk-test',
      model: 'gpt-4.1',
      baseXml: BASE_XML,
      promptText: 'Fix the duration.',
      maxTokens: null,
      requestText: async (args) => {
        args.onRequest?.();
        return responses.shift() || '';
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.annotations).toEqual(annotations);
      expect(result.proposedXml).toContain('<duration>2</duration>');
    }
  });

  it('returns a bounded 422 after the configured candidate attempts', async () => {
    process.env.MUSIC_PATCH_MAX_ATTEMPTS = '2';
    const requestText = vi.fn(async (args: Parameters<NonNullable<Parameters<typeof generateApplyVerifiedPatch>[0]['requestText']>>[0]) => {
      args.onRequest?.();
      return 'not json';
    });
    const result = await generateApplyVerifiedPatch({
      provider: 'openai',
      apiKey: 'sk-test',
      model: 'gpt-4.1',
      baseXml: BASE_XML,
      promptText: 'Fix the duration.',
      maxTokens: null,
      requestText,
    });

    expect(result).toMatchObject({
      ok: false,
      status: 422,
      verification: { attempts: 2, llmCalls: 2 },
    });
    expect(requestText).toHaveBeenCalledTimes(2);
  });

  it('counts a transport retry as a second LLM call but one candidate attempt', async () => {
    process.env.MUSIC_PATCH_TRANSPORT_RETRY_DELAY_MS = '0';
    let call = 0;
    const result = await generateApplyVerifiedPatch({
      provider: 'openai',
      apiKey: 'sk-test',
      model: 'gpt-4.1',
      baseXml: BASE_XML,
      promptText: 'Fix the duration.',
      maxTokens: null,
      requestText: async (args) => {
        args.onRequest?.();
        call += 1;
        if (call === 1) {
          throw new Error('temporary provider failure');
        }
        return validPatchText();
      },
    });

    expect(result.ok).toBe(true);
    expect(result.verification).toMatchObject({ attempts: 1, llmCalls: 2 });
  });

  it('aborts an in-flight provider request at the configured deadline', async () => {
    process.env.MUSIC_PATCH_BUDGET_MS = '20';
    process.env.MUSIC_AI_REQUEST_TIMEOUT_MS = '20';
    process.env.MUSIC_PATCH_TRANSPORT_RETRIES = '0';
    const result = await generateApplyVerifiedPatch({
      provider: 'openai',
      apiKey: 'sk-test',
      model: 'gpt-4.1',
      baseXml: BASE_XML,
      promptText: 'Fix the duration.',
      maxTokens: null,
      requestText: (args) => new Promise((_, reject) => {
        args.onRequest?.();
        args.signal?.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
      }),
    });

    expect(result).toMatchObject({
      ok: false,
      status: 504,
      verification: { attempts: 0, llmCalls: 1 },
    });
  });

  it('forwards image and PDF attachments to the provider request', async () => {
    const requestText = vi.fn(async (args: Parameters<NonNullable<Parameters<typeof generateApplyVerifiedPatch>[0]['requestText']>>[0]) => {
      args.onRequest?.();
      return validPatchText();
    });
    await generateApplyVerifiedPatch({
      provider: 'openai',
      apiKey: 'sk-test',
      model: 'gpt-4.1',
      baseXml: BASE_XML,
      promptText: 'Fix the duration.',
      maxTokens: null,
      image: { mediaType: 'image/png', base64: 'aW1hZ2U=' },
      pdf: { mediaType: 'application/pdf', base64: 'cGRm', filename: 'score.pdf' },
      requestText,
    });

    expect(requestText).toHaveBeenCalledWith(expect.objectContaining({
      image: { mediaType: 'image/png', base64: 'aW1hZ2U=' },
      pdf: { mediaType: 'application/pdf', base64: 'cGRm', filename: 'score.pdf' },
      signal: expect.any(AbortSignal),
    }));
  });
});

describe('applyMusicXmlPatch', () => {
  it('rejects every operation when its XPath matches multiple nodes', async () => {
    const multiNoteXml = BASE_XML.replace(
      '</measure>',
      '<note><rest/><duration>1</duration><type>quarter</type></note></measure>',
    );

    for (const op of ['setText', 'setAttr', 'delete'] as const) {
      const result = await applyMusicXmlPatch(multiNoteXml, {
        format: 'musicxml-patch@1',
        ops: [{
          op,
          path: '/score-partwise/part[@id="P1"]/measure[@number="1"]/note',
          ...(op === 'setText' ? { value: 'changed' } : {}),
          ...(op === 'setAttr' ? { name: 'color', value: '#000000' } : {}),
        }],
      });

      expect(result.xml).toBe('');
      expect(result.error).toContain('matched 2 nodes');
    }
  });

  it('creates missing measure attributes chain for clef setText targets', async () => {
    const baseXml = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1"><part-name>Music</part-name></score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>1</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>F</sign><line>4</line></clef>
      </attributes>
      <note><pitch><step>C</step><octave>3</octave></pitch><duration>1</duration><type>quarter</type></note>
    </measure>
    <measure number="2">
      <note><pitch><step>D</step><octave>3</octave></pitch><duration>1</duration><type>quarter</type></note>
    </measure>
  </part>
</score-partwise>`;

    const patch = {
      format: 'musicxml-patch@1' as const,
      ops: [
        {
          op: 'setText' as const,
          path: '/score-partwise/part[@id="P1"]/measure[@number="2"]/attributes/clef/sign',
          value: 'G',
        },
        {
          op: 'setText' as const,
          path: '/score-partwise/part[@id="P1"]/measure[@number="2"]/attributes/clef/line',
          value: '2',
        },
      ],
    };

    const result = await applyMusicXmlPatch(baseXml, patch);

    expect(result.error).toBe('');
    expect(result.xml).toContain('<measure number="1">');
    expect(result.xml).toContain('<fifths>1</fifths>');
    expect(result.xml).toMatch(
      /<measure number="2">[\s\S]*?<attributes><clef><sign>G<\/sign><line>2<\/line><\/clef><\/attributes>/,
    );
  });
});

describe('parseMusicXmlPatch', () => {
  it('rejects replace values with multiple top-level elements', () => {
    const payload = JSON.stringify({
      format: 'musicxml-patch@1',
      ops: [
        {
          op: 'replace',
          path: '/score-partwise/part[@id="P1"]/measure[@number="1"]/note[1]',
          value: '<note><pitch><step>C</step><octave>4</octave></pitch></note><backup><duration>1</duration></backup>',
        },
      ],
    });
    const parsed = parseMusicXmlPatch(payload);
    expect(parsed.patch).toBeNull();
    expect(parsed.error).toContain('expected exactly one');
  });

  it('rejects replace values with top-level text', () => {
    const payload = JSON.stringify({
      format: 'musicxml-patch@1',
      ops: [
        {
          op: 'replace',
          path: '/score-partwise/part[@id="P1"]/measure[@number="1"]/note[1]',
          value: 'text<note><pitch><step>C</step><octave>4</octave></pitch></note>',
        },
      ],
    });
    const parsed = parseMusicXmlPatch(payload);
    expect(parsed.patch).toBeNull();
    expect(parsed.error).toContain('top-level text');
  });

  it('rejects setText values that contain XML markup', () => {
    const payload = JSON.stringify({
      format: 'musicxml-patch@1',
      ops: [
        {
          op: 'setText',
          path: '/score-partwise/part[@id="P1"]/measure[@number="39"]/attributes',
          value: '<clef><sign>G</sign><line>2</line></clef>',
        },
      ],
    });
    const parsed = parseMusicXmlPatch(payload);
    expect(parsed.patch).toBeNull();
    expect(parsed.error).toContain('setText value appears to contain XML');
  });
});
