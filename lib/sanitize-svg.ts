/**
 * Defense-in-depth sanitizer for SVG produced by the WASM engine before it is written to the
 * DOM via `innerHTML` (finding M3). The engine renders arbitrary attacker-supplied score XML,
 * so a single escaping bug anywhere in its text→SVG path could otherwise become stored XSS.
 *
 * We strip the active-content vectors that survive an `innerHTML` insertion: `<script>` and
 * `<foreignObject>` elements, inline event handlers (`on*=`), and `javascript:` URLs. Note
 * that `<script>` inserted via `innerHTML` does not execute per the HTML spec, but event
 * handlers on elements that fire asynchronously (e.g. `<image href=x onerror=...>`) DO — those
 * are the real risk, so removing them is the point.
 *
 * Fast path: engine output normally contains none of these, so a cheap regex pre-check lets
 * the common render path skip parsing entirely.
 */

const SUSPICIOUS_SVG = /<\s*(script|foreignObject)\b|\son\w+\s*=|javascript:/i;

const DANGEROUS_ELEMENTS = new Set(['script', 'foreignobject']);

/** Regex fallback used when no DOM parser is available or parsing fails. Best-effort. */
function scrubWithRegex(svg: string): string {
  return svg
    .replace(/<\s*script\b[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/<\s*foreignObject\b[\s\S]*?<\s*\/\s*foreignObject\s*>/gi, '')
    .replace(/<\s*(?:script|foreignObject)\b[^>]*\/\s*>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/\s(?:xlink:href|href)\s*=\s*"\s*javascript:[^"]*"/gi, '')
    .replace(/\s(?:xlink:href|href)\s*=\s*'\s*javascript:[^']*'/gi, '');
}

export function sanitizeEngineSvg(svg: string): string {
  if (!svg || !SUSPICIOUS_SVG.test(svg)) {
    return svg;
  }

  if (typeof DOMParser === 'undefined' || typeof XMLSerializer === 'undefined') {
    return scrubWithRegex(svg);
  }

  try {
    const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
    if (doc.getElementsByTagName('parsererror').length > 0) {
      return scrubWithRegex(svg);
    }

    const root = doc.documentElement;
    for (const el of [root, ...Array.from(root.querySelectorAll('*'))]) {
      const tag = el.localName?.toLowerCase();
      if (tag && DANGEROUS_ELEMENTS.has(tag)) {
        el.parentNode?.removeChild(el);
        continue;
      }
      for (const attr of Array.from(el.attributes)) {
        const name = attr.name.toLowerCase();
        const value = attr.value.trim().toLowerCase();
        if (name.startsWith('on')) {
          el.removeAttribute(attr.name);
        } else if ((name === 'href' || name.endsWith(':href')) && value.startsWith('javascript:')) {
          el.removeAttribute(attr.name);
        }
      }
    }

    return new XMLSerializer().serializeToString(root);
  } catch {
    return scrubWithRegex(svg);
  }
}
