import type { InputFileFormat } from './webmscore-loader';

const GOOGLE_DRIVE_HOSTS = new Set([
  'drive.google.com',
  'drive.usercontent.google.com',
]);

const GOOGLE_DRIVE_FILE_ID = /^[A-Za-z0-9_-]+$/;

function getGoogleDriveFileId(url: URL): string | null {
  if (!GOOGLE_DRIVE_HOSTS.has(url.hostname.toLowerCase())) {
    return null;
  }

  const pathMatch = url.pathname.match(/^\/file\/d\/([^/]+)/);
  const candidate = pathMatch?.[1] || url.searchParams.get('id');
  return candidate && GOOGLE_DRIVE_FILE_ID.test(candidate) ? candidate : null;
}

export function isGoogleDriveScoreUrl(source: string): boolean {
  try {
    return Boolean(getGoogleDriveFileId(new URL(source)));
  } catch {
    return false;
  }
}

/** Converts a copied public Google Drive share URL into a CORS-enabled file download URL. */
export function resolvePublicScoreUrl(source: string): string {
  try {
    const url = new URL(source);
    const driveFileId = getGoogleDriveFileId(url);
    if (!driveFileId) {
      return source;
    }

    const downloadUrl = new URL('https://drive.usercontent.google.com/download');
    downloadUrl.searchParams.set('id', driveFileId);
    downloadUrl.searchParams.set('export', 'download');
    return downloadUrl.toString();
  } catch {
    // Relative URLs are valid score sources and should pass through unchanged.
    return source;
  }
}

function containsAscii(data: Uint8Array, value: string): boolean {
  if (data.byteLength < value.length) {
    return false;
  }
  const needle = new TextEncoder().encode(value.toLowerCase());
  for (let index = 0; index <= data.byteLength - needle.length; index += 1) {
    let matches = true;
    for (let offset = 0; offset < needle.length; offset += 1) {
      const byte = data[index + offset];
      const lowerByte = byte >= 65 && byte <= 90 ? byte + 32 : byte;
      if (lowerByte !== needle[offset]) {
        matches = false;
        break;
      }
    }
    if (matches) {
      return true;
    }
  }
  return false;
}

/** Detects extensionless downloads (including Google Drive files) from their contents. */
export function detectScoreInputFormat(source: string, data?: Uint8Array): InputFileFormat {
  const normalized = source.toLowerCase().split('#')[0].split('?')[0];
  if (normalized.endsWith('.xml') || normalized.endsWith('.musicxml')) {
    return 'musicxml';
  }
  if (normalized.endsWith('.mxl')) {
    return 'mxl';
  }
  if (normalized.endsWith('.mscx')) {
    return 'mscx';
  }

  if (data?.byteLength) {
    const isZip = data[0] === 0x50 && data[1] === 0x4b;
    if (isZip && containsAscii(data, 'META-INF/container.xml')) {
      return 'mxl';
    }
    if (isZip) {
      return 'mscz';
    }

    const prefix = new TextDecoder().decode(data.subarray(0, Math.min(data.byteLength, 4096))).toLowerCase();
    if (prefix.includes('<musescore')) {
      return 'mscx';
    }
    if (prefix.includes('<score-partwise') || prefix.includes('<score-timewise')) {
      return 'musicxml';
    }
  }

  return 'mscz';
}

/** Builds a clean editor URL at the current deployment path without hard-coding its origin. */
export function buildScoreEditorShareUrl(
  scoreSource: string,
  currentHref: string,
  configuredEditorUrl?: string,
): string {
  const editorUrl = new URL(configuredEditorUrl?.trim() || currentHref);
  editorUrl.search = '';
  editorUrl.hash = '';
  editorUrl.searchParams.set('score', scoreSource);
  return editorUrl.toString();
}
