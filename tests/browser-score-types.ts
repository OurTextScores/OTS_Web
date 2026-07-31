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
};

export type BrowserScoreWindow = typeof window & {
  __webmscore?: BrowserScoreHandle;
};
