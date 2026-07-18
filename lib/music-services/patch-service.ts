import {
  DEFAULT_MODEL_BY_PROVIDER,
  type AiProvider,
  type RequestAiTextDirectArgs,
  type TextImageAttachment,
  type TextPdfAttachment,
  requestAiTextDirect,
} from '../ai-provider-adapters';
import { allowServerCredentialFallback } from '../api-access-control';
import { extractPatchAnnotations, PATCH_ANNOTATIONS_INSTRUCTION } from '../patch-annotations';
import { summarizeScoreArtifact } from '../score-artifacts';
import { type TraceContext } from '../trace-http';
import { asRecord, looksLikeMusicXml, resolvedScoreSnapshot, resolveScoreContent } from './common';

type PatchServiceResult = {
  status: number;
  body: Record<string, unknown>;
};

export type MusicXmlPatchOp = {
  op: 'replace' | 'setText' | 'setAttr' | 'insertBefore' | 'insertAfter' | 'delete';
  path: string;
  value?: string;
  name?: string;
};

export type MusicXmlPatch = {
  format: 'musicxml-patch@1';
  ops: MusicXmlPatchOp[];
};

const AI_PATCH_SYSTEM_PROMPT = 'You are a MusicXML editor. Return only a single JSON object (musicxml-patch@1) — the patch and an optional "annotations" array. No markdown or prose outside the JSON.';
const AI_PATCH_REQUEST_RETRY_DELAY_MS = 600;

const DEFAULT_PATCH_MAX_ATTEMPTS = 3;
const DEFAULT_PATCH_TRANSPORT_RETRIES = 1;
const DEFAULT_PATCH_BUDGET_MS = 120_000;
const DEFAULT_AI_REQUEST_TIMEOUT_MS = 60_000;
const DEFAULT_PATCH_MAX_CONTENT_BYTES = 10 * 1024 * 1024;
const DEFAULT_PATCH_MAX_PROMPT_CHARS = 12 * 1024 * 1024;
const DEFAULT_PATCH_MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const DEFAULT_PATCH_MAX_PDF_BYTES = 15 * 1024 * 1024;
const DEFAULT_PATCH_MAX_CANDIDATE_CHARS = 200_000;
const DEFAULT_PATCH_MAX_OUTPUT_BYTES = 15 * 1024 * 1024;
const MAX_PATCH_ATTEMPTS = 8;
const MAX_PATCH_TRANSPORT_RETRIES = 3;
const MAX_PATCH_BUDGET_MS = 10 * 60_000;

type XmlDomBindings = {
  DOMParser: new () => DOMParser;
  XMLSerializer: new () => XMLSerializer;
  XPathResult: typeof XPathResult;
  Node: typeof Node;
};

const OPENAI_COMPATIBLE_PROVIDER_SET = new Set<AiProvider>(['openai', 'grok', 'deepseek', 'kimi']);

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const resolveProvider = (value: unknown): AiProvider => {
  if (typeof value !== 'string') {
    return 'openai';
  }
  const normalized = value.trim().toLowerCase();
  if (
    normalized === 'openai'
    || normalized === 'anthropic'
    || normalized === 'gemini'
    || normalized === 'grok'
    || normalized === 'deepseek'
    || normalized === 'kimi'
  ) {
    return normalized;
  }
  return 'openai';
};

const resolveApiKeyForProvider = (provider: AiProvider, explicitApiKey: string) => {
  if (explicitApiKey.trim()) {
    return explicitApiKey.trim();
  }
  if (!allowServerCredentialFallback()) {
    return '';
  }
  if (provider === 'openai') {
    return (process.env.OPENAI_API_KEY || '').trim();
  }
  if (provider === 'anthropic') {
    return (process.env.ANTHROPIC_API_KEY || '').trim();
  }
  if (provider === 'gemini') {
    return (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  }
  if (provider === 'grok') {
    return (process.env.GROK_API_KEY || process.env.OPENAI_API_KEY || '').trim();
  }
  if (provider === 'deepseek') {
    return (process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || '').trim();
  }
  if (provider === 'kimi') {
    return (process.env.KIMI_API_KEY || process.env.OPENAI_API_KEY || '').trim();
  }
  return '';
};

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error || ''));

export const extractJsonFromResponse = (responseText: string) => {
  const fenced = responseText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    return fenced[1].trim();
  }
  return responseText.trim();
};

const buildPromptWithSections = (prompt: string, sections: Array<{ title: string; content: string }>) => {
  const trimmedPrompt = prompt.trim();
  const contextSections = sections
    .map((section) => ({
      title: section.title.trim(),
      content: section.content.trim(),
    }))
    .filter((section) => Boolean(section.title) && Boolean(section.content));
  if (!contextSections.length) {
    return trimmedPrompt;
  }
  const contextText = contextSections
    .map((section, index) => `[Context ${index + 1}] ${section.title}\n${section.content}`)
    .join('\n\n');
  if (!trimmedPrompt) {
    return contextText;
  }
  return `${trimmedPrompt}\n\n${contextText}`;
};

const buildAiPatchPrompt = (prompt: string, xml: string) => {
  const patchSpec = `Return ONLY valid JSON in the following format:
{
  "format": "musicxml-patch@1",
  "ops": [
    { "op": "replace", "path": "/score-partwise/part[@id='P1']/measure[@number='1']/note[1]", "value": "<note>...</note>" },
    { "op": "setText", "path": "/score-partwise/part[@id='P1']/measure[@number='1']/note[1]/duration", "value": "2" },
    { "op": "setAttr", "path": "/score-partwise/part[@id='P1']/measure[@number='1']/note[1]", "name": "default-x", "value": "123.45" },
    { "op": "insertAfter", "path": "/score-partwise/part[@id='P1']/measure[@number='1']/note[1]", "value": "<note>...</note>" },
    { "op": "delete", "path": "/score-partwise/part[@id='P1']/measure[@number='1']/note[2]" }
  ]
}
Use ONLY these ops: replace, setText, setAttr, insertBefore, insertAfter, delete.
Each XPath must match exactly one node.
Each replace/insertBefore/insertAfter value must contain exactly one XML element.
If you need to add multiple sibling elements, use multiple ops (for example: replace one node, then insertAfter additional nodes).

${PATCH_ANNOTATIONS_INSTRUCTION}`;

  return buildPromptWithSections(prompt, xml.trim()
    ? [{ title: 'Current MusicXML', content: xml }, { title: 'Patch Format Requirements', content: patchSpec }]
    : [{ title: 'Patch Format Requirements', content: patchSpec }]);
};

export const parseMusicXmlPatch = (text: string) => {
  if (!text.trim()) {
    return { patch: null as MusicXmlPatch | null, error: 'AI response is empty.' };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { patch: null, error: 'AI response is not valid JSON.' };
  }
  const root = asRecord(parsed);
  const maybePatch = asRecord(root?.patch);
  const payload = maybePatch || root;
  if (!payload || payload.format !== 'musicxml-patch@1' || !Array.isArray(payload.ops)) {
    return { patch: null, error: 'Model response is not a musicxml-patch@1 payload.' };
  }
  const ops: MusicXmlPatchOp[] = [];
  const allowedOps = new Set(['replace', 'setText', 'setAttr', 'insertBefore', 'insertAfter', 'delete']);
  const analyzeXmlFragmentShape = (value: string) => {
    const tokenPattern = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<![^>]*>|<\/?[^>]+?>|[^<]+/g;
    const tokens = value.match(tokenPattern) || [];
    let depth = 0;
    let topLevelElementCount = 0;
    let hasTopLevelText = false;
    let unbalancedTags = false;
    for (const token of tokens) {
      if (!token) {
        continue;
      }
      if (token.startsWith('<!--') || token.startsWith('<?') || (token.startsWith('<!') && !token.startsWith('<![CDATA['))) {
        continue;
      }
      if (token.startsWith('<![CDATA[')) {
        if (depth === 0 && token.replace(/^<!\[CDATA\[|\]\]>$/g, '').trim()) {
          hasTopLevelText = true;
        }
        continue;
      }
      if (token.startsWith('</')) {
        if (depth === 0) {
          unbalancedTags = true;
          continue;
        }
        depth -= 1;
        continue;
      }
      if (token.startsWith('<')) {
        const isSelfClosing = /\/>\s*$/.test(token);
        if (depth === 0) {
          topLevelElementCount += 1;
        }
        if (!isSelfClosing) {
          depth += 1;
        }
        continue;
      }
      if (depth === 0 && token.trim()) {
        hasTopLevelText = true;
      }
    }
    if (depth !== 0) {
      unbalancedTags = true;
    }
    return { topLevelElementCount, hasTopLevelText, unbalancedTags };
  };
  for (let i = 0; i < payload.ops.length; i += 1) {
    const op = asRecord(payload.ops[i]);
    if (!op) {
      return { patch: null, error: `Patch op ${i + 1} is not an object.` };
    }
    const opName = typeof op.op === 'string' ? op.op.trim() : '';
    if (!allowedOps.has(opName)) {
      return { patch: null, error: `Patch op ${i + 1} has unsupported op "${opName}".` };
    }
    const path = typeof op.path === 'string' ? op.path.trim() : '';
    if (!path) {
      return { patch: null, error: `Patch op ${i + 1} is missing a valid path.` };
    }
    const nextOp: MusicXmlPatchOp = { op: opName as MusicXmlPatchOp['op'], path };
    if (opName === 'setText' || opName === 'replace' || opName === 'insertBefore' || opName === 'insertAfter') {
      if (typeof op.value !== 'string') {
        return { patch: null, error: `Patch op ${i + 1} requires a string value.` };
      }
      if (opName === 'setText' && /[<>]/.test(op.value)) {
        return {
          patch: null,
          error: `Patch op ${i + 1} setText value appears to contain XML. Use replace/insert ops for element changes.`,
        };
      }
      if (opName === 'replace' || opName === 'insertBefore' || opName === 'insertAfter') {
        const shape = analyzeXmlFragmentShape(op.value);
        if (shape.unbalancedTags) {
          return { patch: null, error: `Patch op ${i + 1} ${opName} value has unbalanced XML tags.` };
        }
        if (shape.hasTopLevelText) {
          return { patch: null, error: `Patch op ${i + 1} ${opName} value has top-level text; it must contain exactly one XML element.` };
        }
        if (shape.topLevelElementCount !== 1) {
          return {
            patch: null,
            error: `Patch op ${i + 1} ${opName} value has ${shape.topLevelElementCount} top-level elements; expected exactly one. Use multiple ops for sibling elements.`,
          };
        }
      }
      nextOp.value = op.value;
    }
    if (opName === 'setAttr') {
      if (typeof op.name !== 'string' || !op.name.trim()) {
        return { patch: null, error: `Patch op ${i + 1} requires an attribute name.` };
      }
      if (typeof op.value !== 'string') {
        return { patch: null, error: `Patch op ${i + 1} requires a string value.` };
      }
      nextOp.name = op.name;
      nextOp.value = op.value;
    }
    ops.push(nextOp);
  }
  return { patch: { format: 'musicxml-patch@1', ops }, annotations: extractPatchAnnotations(parsed), error: '' };
};

async function getXmlDomBindings(): Promise<XmlDomBindings | null> {
  if (
    typeof DOMParser !== 'undefined'
    && typeof XMLSerializer !== 'undefined'
    && typeof XPathResult !== 'undefined'
    && typeof Node !== 'undefined'
  ) {
    return {
      DOMParser,
      XMLSerializer,
      XPathResult,
      Node,
    };
  }

  try {
    const { JSDOM } = await import('jsdom');
    const dom = new JSDOM('', { contentType: 'text/html' });
    return {
      DOMParser: dom.window.DOMParser,
      XMLSerializer: dom.window.XMLSerializer,
      XPathResult: dom.window.XPathResult,
      Node: dom.window.Node,
    };
  } catch {
    return null;
  }
}

export async function applyMusicXmlPatch(baseXml: string, patch: MusicXmlPatch) {
  if (!baseXml.trim()) {
    return { xml: '', error: 'Base MusicXML is empty.' };
  }
  const bindings = await getXmlDomBindings();
  if (!bindings) {
    return { xml: '', error: 'XML parsing is unavailable in this environment.' };
  }

  const parser = new bindings.DOMParser();
  const doc = parser.parseFromString(baseXml, 'application/xml');
  const parserError = doc.querySelector?.('parsererror');
  if (parserError) {
    return { xml: '', error: 'Base MusicXML is not valid XML.' };
  }

  const resolver = doc.createNSResolver(doc.documentElement);
  const parseFragment = (value: string) => {
    const fragmentDoc = parser.parseFromString(`<wrapper>${value}</wrapper>`, 'application/xml');
    const fragmentError = fragmentDoc.querySelector?.('parsererror');
    if (fragmentError) {
      return { node: null as Node | null, error: 'Patch value is not valid XML.' };
    }
    const wrapper = fragmentDoc.documentElement;
    const elementChildren = Array.from(wrapper.childNodes).filter((node) => node.nodeType === bindings.Node.ELEMENT_NODE);
    const textChildren = Array.from(wrapper.childNodes).filter(
      (node) => node.nodeType === bindings.Node.TEXT_NODE && (node.textContent ?? '').trim(),
    );
    if (elementChildren.length !== 1 || textChildren.length > 0) {
      return { node: null, error: 'Patch value must contain exactly one element.' };
    }
    const imported = doc.importNode(elementChildren[0], true);
    return { node: imported, error: '' };
  };
  const resolveNodes = (path: string) => {
    try {
      const result = doc.evaluate(path, doc, resolver, bindings.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (result.snapshotLength < 1) {
        return { nodes: [] as Node[], error: `XPath "${path}" matched 0 nodes.` };
      }
      const nodes: Node[] = [];
      for (let i = 0; i < result.snapshotLength; i += 1) {
        const node = result.snapshotItem(i);
        if (node) {
          nodes.push(node);
        }
      }
      return { nodes, error: '' };
    } catch {
      return { nodes: [] as Node[], error: `XPath "${path}" could not be evaluated.` };
    }
  };

  const tryEnsureSetTextTarget = (path: string) => {
    // Allow conservative auto-creation for common MusicXML attribute edits
    // (e.g. setting clef/key/time in a measure that does not yet have <attributes>).
    if (!path.includes('/attributes/')) {
      return { nodes: [] as Node[], created: false };
    }
    const segments = path.split('/').filter(Boolean);
    if (segments.length < 2) {
      return { nodes: [] as Node[], created: false };
    }
    for (let prefixLength = segments.length - 1; prefixLength >= 1; prefixLength -= 1) {
      const prefixPath = `/${segments.slice(0, prefixLength).join('/')}`;
      const prefixResult = resolveNodes(prefixPath);
      if (prefixResult.error || prefixResult.nodes.length !== 1) {
        continue;
      }
      const rootNode = prefixResult.nodes[0];
      if (
        rootNode.nodeType !== bindings.Node.ELEMENT_NODE
        && rootNode.nodeType !== bindings.Node.DOCUMENT_NODE
      ) {
        continue;
      }

      const missingSegments = segments.slice(prefixLength);
      if (missingSegments.length === 0) {
        continue;
      }
      // We only create plain element names (no predicates/index expressions).
      if (!missingSegments.every((segment) => /^[A-Za-z_][\w.-]*$/.test(segment))) {
        continue;
      }

      let current: Node = rootNode;
      for (const segment of missingSegments) {
        const nextNode = doc.createElement(segment);
        if (
          current.nodeType === bindings.Node.ELEMENT_NODE
          && (current as Element).tagName === 'measure'
          && segment === 'attributes'
        ) {
          const firstElementChild = Array.from(current.childNodes).find(
            (child) => child.nodeType === bindings.Node.ELEMENT_NODE,
          );
          if (firstElementChild) {
            current.insertBefore(nextNode, firstElementChild);
          } else {
            current.appendChild(nextNode);
          }
        } else {
          current.appendChild(nextNode);
        }
        current = nextNode;
      }
      return { nodes: [current], created: true };
    }
    return { nodes: [] as Node[], created: false };
  };

  for (let i = 0; i < patch.ops.length; i += 1) {
    const op = patch.ops[i];
    let { nodes, error } = resolveNodes(op.path);
    if ((error || nodes.length === 0) && op.op === 'setText') {
      const ensured = tryEnsureSetTextTarget(op.path);
      if (ensured.created) {
        nodes = ensured.nodes;
        error = '';
      }
    }
    if (error || nodes.length === 0) {
      return { xml: '', error: `Patch op ${i + 1} failed: ${error || 'Target not found.'}` };
    }
    if (nodes.length !== 1) {
      return { xml: '', error: `Patch op ${i + 1} failed: XPath "${op.path}" matched ${nodes.length} nodes.` };
    }
    const node = nodes[0];
    if (op.op === 'setText') {
      node.textContent = op.value ?? '';
      continue;
    }
    if (op.op === 'setAttr') {
      if (node.nodeType !== bindings.Node.ELEMENT_NODE) {
        return { xml: '', error: `Patch op ${i + 1} targets a non-element node.` };
      }
      (node as Element).setAttribute(op.name ?? '', op.value ?? '');
      continue;
    }
    if (op.op === 'delete') {
      if (!node.parentNode) {
        return { xml: '', error: `Patch op ${i + 1} target has no parent.` };
      }
      node.parentNode.removeChild(node);
      continue;
    }
    const fragment = parseFragment(op.value ?? '');
    if (fragment.error || !fragment.node) {
      return { xml: '', error: `Patch op ${i + 1} failed: ${fragment.error || 'Invalid value.'}` };
    }
    if (!node.parentNode) {
      return { xml: '', error: `Patch op ${i + 1} target has no parent.` };
    }
    if (op.op === 'replace') {
      node.parentNode.replaceChild(fragment.node, node);
      continue;
    }
    if (op.op === 'insertBefore') {
      node.parentNode.insertBefore(fragment.node, node);
      continue;
    }
    if (op.op === 'insertAfter') {
      node.parentNode.insertBefore(fragment.node, node.nextSibling);
      continue;
    }
  }

  const serializer = new bindings.XMLSerializer();
  return { xml: serializer.serializeToString(doc), error: '' };
}

export type PatchApplyVerification = {
  level: 'patch_apply';
  attempts: number;
  llmCalls: number;
  elapsedMs: number;
};

export type PatchAttemptFailure = {
  attempt: number;
  category: 'parse' | 'apply' | 'output_size';
  error: string;
};

export type GenerateApplyVerifiedPatchArgs = {
  provider: AiProvider;
  apiKey: string;
  model: string;
  baseXml: string;
  promptText: string;
  maxTokens: number | null;
  temperature?: number | null;
  image?: TextImageAttachment | null;
  pdf?: TextPdfAttachment | null;
  signal?: AbortSignal;
  requestText?: (args: RequestAiTextDirectArgs) => Promise<string>;
};

export type GenerateApplyVerifiedPatchResult = {
  ok: true;
  patch: MusicXmlPatch;
  annotations: ReturnType<typeof extractPatchAnnotations>;
  proposedXml: string;
  verification: PatchApplyVerification;
} | {
  ok: false;
  status: 422 | 502 | 504;
  error: string;
  failures: PatchAttemptFailure[];
  verification: PatchApplyVerification;
};

const readClampedEnvInteger = (name: string, fallback: number, minimum: number, maximum: number) => {
  const value = Number(process.env[name]);
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(maximum, Math.max(minimum, Math.floor(value)));
};

const byteLength = (value: string) => new TextEncoder().encode(value).byteLength;

const estimateBase64Bytes = (value: string) => {
  const normalized = value.replace(/^data:[^,]*,/, '').replace(/\s+/g, '');
  if (!normalized) {
    return 0;
  }
  const padding = normalized.endsWith('==') ? 2 : normalized.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((normalized.length * 3) / 4) - padding);
};

const boundCandidate = (value: string, maximum: number) => {
  if (value.length <= maximum) {
    return value;
  }
  return `${value.slice(0, maximum)}\n[Previous candidate truncated at ${maximum} characters.]`;
};

const buildRepairContext = (candidate: string, failure: string, maximumCandidateChars: number) => [
  'PATCH REPAIR REQUIRED:',
  'The previous candidate did not apply to the supplied base MusicXML.',
  '',
  'PREVIOUS CANDIDATE:',
  boundCandidate(candidate, maximumCandidateChars),
  '',
  'EXACT PARSE/APPLY ERROR:',
  failure,
  '',
  'Return the full corrected musicxml-patch@1 JSON object only. Do not return a partial diff, markdown, or commentary.',
].join('\n');

const isRetryableTransportError = (error: unknown) => {
  const message = errorMessage(error).toLowerCase();
  return !(
    message.includes('missing api')
    || message.includes('invalid api')
    || message.includes('unauthorized')
    || message.includes('forbidden')
    || message.includes('unsupported')
    || message.includes('not supported')
    || message.includes('not confirmed')
    || message.includes('invalid request')
    || message.includes('content policy')
  );
};

const verificationFor = (startedAt: number, attempts: number, llmCalls: number): PatchApplyVerification => ({
  level: 'patch_apply',
  attempts,
  llmCalls,
  elapsedMs: Math.max(0, Date.now() - startedAt),
});

export async function generateApplyVerifiedPatch(
  args: GenerateApplyVerifiedPatchArgs,
): Promise<GenerateApplyVerifiedPatchResult> {
  const startedAt = Date.now();
  const maximumAttempts = readClampedEnvInteger('MUSIC_PATCH_MAX_ATTEMPTS', DEFAULT_PATCH_MAX_ATTEMPTS, 1, MAX_PATCH_ATTEMPTS);
  const transportRetries = readClampedEnvInteger(
    'MUSIC_PATCH_TRANSPORT_RETRIES',
    DEFAULT_PATCH_TRANSPORT_RETRIES,
    0,
    MAX_PATCH_TRANSPORT_RETRIES,
  );
  const budgetMs = readClampedEnvInteger('MUSIC_PATCH_BUDGET_MS', DEFAULT_PATCH_BUDGET_MS, 1, MAX_PATCH_BUDGET_MS);
  const requestTimeoutMs = readClampedEnvInteger(
    'MUSIC_AI_REQUEST_TIMEOUT_MS',
    DEFAULT_AI_REQUEST_TIMEOUT_MS,
    1,
    MAX_PATCH_BUDGET_MS,
  );
  const transportRetryDelayMs = readClampedEnvInteger(
    'MUSIC_PATCH_TRANSPORT_RETRY_DELAY_MS',
    AI_PATCH_REQUEST_RETRY_DELAY_MS,
    0,
    10_000,
  );
  const maximumCandidateChars = readClampedEnvInteger(
    'MUSIC_PATCH_MAX_CANDIDATE_CHARS',
    DEFAULT_PATCH_MAX_CANDIDATE_CHARS,
    1_000,
    5_000_000,
  );
  const maximumOutputBytes = readClampedEnvInteger(
    'MUSIC_PATCH_MAX_OUTPUT_BYTES',
    DEFAULT_PATCH_MAX_OUTPUT_BYTES,
    1_000,
    50 * 1024 * 1024,
  );
  const deadlineAt = startedAt + budgetMs;
  const requestText = args.requestText ?? requestAiTextDirect;
  const failures: PatchAttemptFailure[] = [];
  let attempts = 0;
  let llmCalls = 0;
  let previousCandidate = '';
  let previousError = '';

  const requestCandidate = async (promptText: string) => {
    let lastError: unknown = null;
    for (let transportAttempt = 0; transportAttempt <= transportRetries; transportAttempt += 1) {
      const remainingMs = deadlineAt - Date.now();
      if (remainingMs <= 0 || args.signal?.aborted) {
        return { text: '', error: 'Music patch generation exceeded its request budget.', status: 504 as const };
      }

      const controller = new AbortController();
      let timedOut = false;
      const abortFromParent = () => controller.abort(args.signal?.reason);
      args.signal?.addEventListener('abort', abortFromParent, { once: true });
      const timeout = setTimeout(() => {
        timedOut = true;
        controller.abort(new Error('AI provider request timed out.'));
      }, Math.min(remainingMs, requestTimeoutMs));
      let observedProviderCalls = 0;
      try {
        const text = await requestText({
          provider: args.provider,
          apiKey: args.apiKey,
          model: args.model,
          promptText,
          systemPrompt: AI_PATCH_SYSTEM_PROMPT,
          maxTokens: args.maxTokens,
          temperature: args.temperature,
          image: args.image,
          pdf: args.pdf,
          signal: controller.signal,
          onRequest: () => {
            observedProviderCalls += 1;
            llmCalls += 1;
          },
        });
        if (observedProviderCalls === 0) {
          llmCalls += 1;
        }
        return { text, error: '', status: 200 as const };
      } catch (error) {
        if (observedProviderCalls === 0) {
          llmCalls += 1;
        }
        lastError = error;
        const deadlineExpired = Date.now() >= deadlineAt || args.signal?.aborted;
        if (deadlineExpired) {
          return { text: '', error: 'Music patch generation exceeded its request budget.', status: 504 as const };
        }
        const canRetry = transportAttempt < transportRetries && (timedOut || isRetryableTransportError(error));
        if (!canRetry) {
          return {
            text: '',
            error: timedOut ? 'AI provider request timed out.' : 'AI provider request failed.',
            status: timedOut ? 504 as const : 502 as const,
          };
        }
        await sleep(Math.min(transportRetryDelayMs, Math.max(0, deadlineAt - Date.now())));
      } finally {
        clearTimeout(timeout);
        args.signal?.removeEventListener('abort', abortFromParent);
      }
    }
    return {
      text: '',
      error: lastError ? 'AI provider request failed.' : 'Music patch generation failed.',
      status: 502 as const,
    };
  };

  while (attempts < maximumAttempts) {
    const repairContext = attempts === 0
      ? ''
      : buildRepairContext(previousCandidate, previousError, maximumCandidateChars);
    const candidatePrompt = [args.promptText.trim(), repairContext].filter(Boolean).join('\n\n');
    const response = await requestCandidate(candidatePrompt);
    if (response.status !== 200) {
      return {
        ok: false,
        status: response.status,
        error: response.error,
        failures,
        verification: verificationFor(startedAt, attempts, llmCalls),
      };
    }

    attempts += 1;
    const rawText = response.text;
    const extracted = extractJsonFromResponse(rawText);
    const parsed = parseMusicXmlPatch(extracted);
    if (parsed.error || !parsed.patch) {
      previousCandidate = rawText;
      previousError = parsed.error || 'Model response is not a musicxml-patch@1 payload.';
      failures.push({ attempt: attempts, category: 'parse', error: previousError });
      continue;
    }

    const applied = await applyMusicXmlPatch(args.baseXml, parsed.patch);
    if (applied.error || !applied.xml.trim()) {
      previousCandidate = extracted;
      previousError = applied.error || 'Patch application returned empty MusicXML.';
      failures.push({ attempt: attempts, category: 'apply', error: previousError });
      continue;
    }
    if (byteLength(applied.xml) > maximumOutputBytes) {
      previousCandidate = extracted;
      previousError = `Applied MusicXML exceeds the ${maximumOutputBytes} byte output limit.`;
      failures.push({ attempt: attempts, category: 'output_size', error: previousError });
      continue;
    }

    return {
      ok: true,
      patch: parsed.patch,
      annotations: parsed.annotations ?? [],
      proposedXml: applied.xml,
      verification: verificationFor(startedAt, attempts, llmCalls),
    };
  }

  return {
    ok: false,
    status: 422,
    error: previousError || 'No apply-verified MusicXML patch was produced.',
    failures,
    verification: verificationFor(startedAt, attempts, llmCalls),
  };
}

export async function runMusicPatchService(
  body: unknown,
  options?: { traceContext?: TraceContext; signal?: AbortSignal },
): Promise<PatchServiceResult> {
  const data = asRecord(body);
  const prompt = typeof data?.prompt === 'string' ? data.prompt.trim() : '';
  const promptText = typeof data?.promptText === 'string' ? data.promptText.trim() : '';
  const provider = resolveProvider(data?.provider);
  const model = typeof data?.model === 'string' && data.model.trim()
    ? data.model.trim()
    : (DEFAULT_MODEL_BY_PROVIDER[provider] || DEFAULT_MODEL_BY_PROVIDER.openai);
  const maxTokensValue = Number(data?.maxTokens ?? data?.max_tokens);
  const maxTokens = Number.isFinite(maxTokensValue) && maxTokensValue > 0 ? maxTokensValue : null;
  const temperatureValue = Number(data?.temperature);
  const temperature = data?.temperature != null && Number.isFinite(temperatureValue) ? temperatureValue : null;
  const dryRun = Boolean(data?.dryRun || data?.dry_run);
  const apiKeyInput = (typeof data?.apiKey === 'string' ? data.apiKey : (typeof data?.api_key === 'string' ? data.api_key : '')).trim();

  if (!prompt && !promptText) {
    return {
      status: 400,
      body: { error: 'Missing prompt for music patch generation.' },
    };
  }

  if (dryRun) {
    return {
      status: 200,
      body: {
        ready: false,
        message: 'Dry run only. Provide dryRun=false to execute.',
        request: {
          provider,
          model,
          hasPrompt: Boolean(prompt || promptText),
          maxTokens,
        },
      },
    };
  }

  const resolution = await resolveScoreContent(body);
  if (resolution.error) {
    return resolution.error as PatchServiceResult;
  }

  const { xml, artifact: resolutionArtifact, session } = resolution;
  const maximumContentBytes = readClampedEnvInteger(
    'MUSIC_PATCH_MAX_CONTENT_BYTES',
    DEFAULT_PATCH_MAX_CONTENT_BYTES,
    1_000,
    50 * 1024 * 1024,
  );
  const maximumPromptChars = readClampedEnvInteger(
    'MUSIC_PATCH_MAX_PROMPT_CHARS',
    DEFAULT_PATCH_MAX_PROMPT_CHARS,
    1_000,
    50 * 1024 * 1024,
  );
  const maximumImageBytes = readClampedEnvInteger(
    'MUSIC_PATCH_MAX_IMAGE_BYTES',
    DEFAULT_PATCH_MAX_IMAGE_BYTES,
    1_000,
    50 * 1024 * 1024,
  );
  const maximumPdfBytes = readClampedEnvInteger(
    'MUSIC_PATCH_MAX_PDF_BYTES',
    DEFAULT_PATCH_MAX_PDF_BYTES,
    1_000,
    50 * 1024 * 1024,
  );
  if (!looksLikeMusicXml(xml) || !/<score-(?:partwise|timewise)\b/i.test(xml)) {
    return {
      status: 400,
      body: { error: 'Base content must be MusicXML.' },
    };
  }
  if (byteLength(xml) > maximumContentBytes) {
    return {
      status: 413,
      body: { error: `Base MusicXML exceeds the ${maximumContentBytes} byte limit.` },
    };
  }
  const baseValidation = await applyMusicXmlPatch(xml, { format: 'musicxml-patch@1', ops: [] });
  if (baseValidation.error || !baseValidation.xml.trim()) {
    return {
      status: 400,
      body: { error: baseValidation.error || 'Base MusicXML is not well-formed.' },
    };
  }

  const parseAttachment = <T extends TextImageAttachment | TextPdfAttachment>(
    value: unknown,
    label: 'Image' | 'PDF',
    maximumBytes: number,
  ): { attachment: T | null; error?: PatchServiceResult } => {
    if (value == null) {
      return { attachment: null };
    }
    const record = asRecord(value);
    const mediaType = typeof record?.mediaType === 'string' ? record.mediaType.trim() : '';
    const base64 = typeof record?.base64 === 'string' ? record.base64.trim() : '';
    if (!mediaType || !base64) {
      return {
        attachment: null,
        error: { status: 400, body: { error: `${label} attachment requires mediaType and base64.` } },
      };
    }
    const size = estimateBase64Bytes(base64);
    if (size > maximumBytes) {
      return {
        attachment: null,
        error: { status: 413, body: { error: `${label} attachment exceeds the ${maximumBytes} byte limit.` } },
      };
    }
    return {
      attachment: {
        mediaType,
        base64,
        ...(label === 'PDF' && typeof record?.filename === 'string' && record.filename.trim()
          ? { filename: record.filename.trim().slice(0, 255) }
          : {}),
      } as T,
    };
  };
  const parsedImage = parseAttachment<TextImageAttachment>(data?.image, 'Image', maximumImageBytes);
  if (parsedImage.error) {
    return parsedImage.error;
  }
  const parsedPdf = parseAttachment<TextPdfAttachment>(data?.pdf, 'PDF', maximumPdfBytes);
  if (parsedPdf.error) {
    return parsedPdf.error;
  }

  const apiKey = resolveApiKeyForProvider(provider, apiKeyInput);
  if (!apiKey) {
    const providerLabel = provider === 'openai'
      ? 'OpenAI'
      : provider.charAt(0).toUpperCase() + provider.slice(1);
    return {
      status: 400,
      body: { error: `Missing ${providerLabel} API key for music patch generation.` },
    };
  }

  try {
    const builtPromptText = promptText || buildAiPatchPrompt(prompt, xml);
    if (builtPromptText.length > maximumPromptChars) {
      return {
        status: 413,
        body: { error: `Patch prompt exceeds the ${maximumPromptChars} character limit.` },
      };
    }
    const generated = await generateApplyVerifiedPatch({
      provider,
      apiKey,
      model,
      baseXml: xml,
      promptText: builtPromptText,
      maxTokens,
      temperature,
      image: parsedImage.attachment,
      pdf: parsedPdf.attachment,
      signal: options?.signal,
    });
    if (!generated.ok) {
      return {
        status: generated.status,
        body: {
          error: generated.error,
          verification: generated.verification,
          failures: generated.failures,
        },
      };
    }

    return {
      status: 200,
      body: {
        mode: provider === 'openai' || OPENAI_COMPATIBLE_PROVIDER_SET.has(provider)
          ? 'openai-responses'
          : `${provider}-direct`,
        provider,
        model,
        scoreSessionId: session?.scoreSessionId ?? null,
        revision: session?.revision ?? null,
        inputArtifactId: resolutionArtifact?.id || null,
        inputArtifact: resolutionArtifact ? summarizeScoreArtifact(resolutionArtifact) : null,
        patch: generated.patch,
        annotations: generated.annotations,
        proposedXml: generated.proposedXml,
        resolvedBase: resolvedScoreSnapshot(resolution),
        verification: generated.verification,
      },
    };
  } catch (error) {
    console.error('[patch-service] Request failed.', {
      provider,
      model,
      error: error instanceof Error ? error.name : 'unknown_error',
    });
    return {
      status: 502,
      body: { error: 'Internal patch service error.' },
    };
  }
}
