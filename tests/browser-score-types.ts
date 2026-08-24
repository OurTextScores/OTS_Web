export type BrowserScoreMetadata = {
  title?: unknown;
  subtitle?: unknown;
  composer?: unknown;
  parts?: Array<{ isVisible?: unknown }>;
};

export type BrowserScoreHandle = {
  saveXml?: () => Promise<string>;
  saveMsc?: (format: 'mscx' | 'mscz') => Promise<Uint8Array>;
  metadata?: () => Promise<BrowserScoreMetadata>;
  subtitle?: () => Promise<string>;
  getKeySignature?: () => Promise<number> | number;
  addNoteFromRest?: (...args: unknown[]) => Promise<unknown>;
  listInstrumentTemplates?: (...args: unknown[]) => Promise<unknown>;
  playbackTimeline?: () => Promise<{
    schemaVersion: 1;
    durationMs: number;
    renderDurationMs: number;
    occurrences: Array<{
      occurrenceIndex: number;
      measureIndex: number;
      startMs: number;
      endMs: number;
    }>;
  } | null>;
};

export type BrowserScoreWindow = typeof window & {
  __webmscore?: BrowserScoreHandle;
};
