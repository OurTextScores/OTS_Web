import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

type TestMock = ReturnType<typeof vi.fn>;

type ScoreEditorTestGlobals = {
  alert: unknown;
  fetch: unknown;
  URL: {
    createObjectURL: unknown;
    revokeObjectURL: unknown;
  };
  Audio: unknown;
  AudioContext: unknown;
};

const testGlobals = globalThis as unknown as ScoreEditorTestGlobals;
const originalTestGlobals = {
  alert: testGlobals.alert,
  fetch: testGlobals.fetch,
  createObjectURL: testGlobals.URL.createObjectURL,
  revokeObjectURL: testGlobals.URL.revokeObjectURL,
  Audio: testGlobals.Audio,
  AudioContext: testGlobals.AudioContext,
};

const mocked = vi.hoisted(() => ({
  loadWebMscore: vi.fn(),
  loadWebMscoreInProcess: vi.fn(),
}));

const mockedNavigation = vi.hoisted(() => ({
  useSearchParams: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: mockedNavigation.useSearchParams,
}));

vi.mock('../lib/webmscore-loader', () => ({
  loadWebMscore: mocked.loadWebMscore,
  loadWebMscoreInProcess: mocked.loadWebMscoreInProcess,
}));

import ScoreEditor, {
  buildPartLocalizedChangeReviewBarHighlights,
  buildPartLocalizedChangeReviewHighlights,
  scoreLoadErrorMessage,
  sortChangeReviewRegionsByMeasure,
} from '../components/ScoreEditor';

describe('scoreLoadErrorMessage', () => {
  it('surfaces the newer MuseScore format guidance without the WASM prefix', () => {
    expect(scoreLoadErrorMessage(new Error(
      'WebMscore Err[2007] This score was saved in a newer MuseScore format that this editor does not support yet. Export the score as MusicXML in MuseScore, then load the MusicXML file here.',
    ))).toBe(
      'This score was saved in a newer MuseScore format that this editor does not support yet. Export the score as MusicXML in MuseScore, then load the MusicXML file here.',
    );
  });

  it('keeps the generic user message for unrelated parser failures', () => {
    expect(scoreLoadErrorMessage(new Error('WebMscore Err[2004] Bad format'))).toBe(
      'Failed to load score. See console for details.',
    );
  });
});

describe('sortChangeReviewRegionsByMeasure', () => {
  it('orders change review cards by measure, then part', () => {
    const region = (label: string, partIndex: number, headMeasureIndex: number) => ({
      anchorId: `${partIndex}-${headMeasureIndex}`,
      partId: `${partIndex}`,
      partIndex,
      side: 'head' as const,
      changeType: 'modified' as const,
      headMeasureIndex,
      label,
      summary: '',
      commentable: true,
      regionHash: '',
    });

    const sorted = sortChangeReviewRegionsByMeasure([
      region('Violin 1 m18', 0, 17),
      region('Viola m14', 2, 13),
      region('Violin 2 m4', 1, 3),
      region('Viola m11', 2, 10),
      region('Violin 1 m14', 0, 13),
    ]);

    expect(sorted.map(({ label }) => label)).toEqual([
      'Violin 2 m4',
      'Viola m11',
      'Violin 1 m14',
      'Viola m14',
      'Violin 1 m18',
    ]);
  });
});

describe('buildPartLocalizedChangeReviewHighlights', () => {
  it('limits each changed measure highlight to its affected part', () => {
    const positions = {
      elements: [{ id: 7, x: 10, y: 100, sx: 80, sy: 200, page: 0 }],
      events: [],
      pageSize: { width: 1000, height: 1200 },
    };
    const region = {
      anchorId: 'viola-m1',
      partId: 'viola',
      partIndex: 2,
      side: 'head' as const,
      changeType: 'modified' as const,
      baseMeasureIndex: 0,
      headMeasureIndex: 0,
      label: 'Viola m1',
      summary: '',
      commentable: true,
      regionHash: '',
    };

    expect(buildPartLocalizedChangeReviewHighlights(positions, [region], 'head', 0.5, 4)).toEqual([
      expect.objectContaining({
        left: 5,
        top: 100,
        width: 40,
        height: 25,
      }),
    ]);
  });
});

describe('buildPartLocalizedChangeReviewBarHighlights', () => {
  it('keeps threaded bar highlights distinct by side and part', () => {
    const positions = {
      elements: [{ id: 7, x: 10, y: 100, sx: 80, sy: 200, page: 0 }],
      events: [],
      pageSize: { width: 1000, height: 1200 },
    };
    const bar = (anchorId: string, side: 'base' | 'head', partIndex: number) => ({
      kind: 'score_bar' as const,
      anchorId,
      revisionId: `rev-${side}`,
      side,
      partId: `part-${partIndex}`,
      partIndex,
      measureIndex: 0,
      measureNumber: '1',
      measureHash: `${side}-${partIndex}`,
      label: `${side} part ${partIndex}`,
      hasThread: true,
      commentable: true,
    });

    const highlights = buildPartLocalizedChangeReviewBarHighlights(
      positions,
      [bar('base-violin', 'base', 0), bar('base-cello', 'base', 3), bar('head-cello', 'head', 3)],
      'base',
      0.5,
      4,
    );

    expect(highlights).toEqual([
      expect.objectContaining({ id: 'base-violin-base', top: 50, height: 25 }),
      expect.objectContaining({ id: 'base-cello-base', top: 125, height: 25 }),
    ]);
  });
});

describe('ScoreEditor', () => {
  const suppressConsole = () => {
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  };

  let scoreParamValue: string | null = null;
  let searchParamValues: Record<string, string> = {};

  const searchParams = {
    get: (key: string) => (
      key === 'score'
        ? scoreParamValue
        : searchParamValues[key] ?? null
    ),
  };

  const boundingRect: DOMRect = {
    x: 0,
    y: 0,
    width: 100,
    height: 40,
    top: 0,
    left: 0,
    right: 100,
    bottom: 40,
    toJSON: () => ({}),
  };

  let rectSpy: ReturnType<typeof vi.spyOn> | undefined;

  beforeAll(() => {
    suppressConsole();
  });

  beforeEach(() => {
    scoreParamValue = null;
    searchParamValues = {};
    mocked.loadWebMscore.mockReset();
    mocked.loadWebMscoreInProcess.mockReset();
    mocked.loadWebMscoreInProcess.mockImplementation(() => mocked.loadWebMscore());
    mockedNavigation.useSearchParams.mockReturnValue(searchParams);

    rectSpy = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(boundingRect);
    testGlobals.alert = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    testGlobals.alert = originalTestGlobals.alert;
    testGlobals.fetch = originalTestGlobals.fetch;
    testGlobals.URL.createObjectURL = originalTestGlobals.createObjectURL;
    testGlobals.URL.revokeObjectURL = originalTestGlobals.revokeObjectURL;
    testGlobals.Audio = originalTestGlobals.Audio;
    testGlobals.AudioContext = originalTestGlobals.AudioContext;
    suppressConsole();
  });

  it('loads a score from file upload, supports selection, and applies clef', async () => {
    const user = userEvent.setup();

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg><g class="Note"></g></svg>'),
      savePdf: vi.fn(async () => new Uint8Array([1])),
      setSoundFont: vi.fn(async () => {}),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
      selectElementAtPoint: vi.fn(async () => true),
      setClef: vi.fn(async () => true),
      relayout: vi.fn(async () => true),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    }));

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1, 2, 3])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);

    await waitFor(() => expect(webmscore.load).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByTestId('svg-container').querySelector('svg')).toBeTruthy());

    const note = screen.getByTestId('svg-container').querySelector('.Note');
    expect(note).toBeTruthy();
    fireEvent.click(note!);

    await screen.findByTestId('selection-overlay');

    await user.click(screen.getByTestId('dropdown-clef'));
    await user.click(await screen.findByTestId('btn-clef-0'));

    await waitFor(() => expect(score.setClef).toHaveBeenCalledWith(0));
    expect(score.relayout).toHaveBeenCalled();
    expect(score.selectElementAtPoint.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('highlights a compare selection and retires its score safely during an in-flight edit', async () => {
    const user = userEvent.setup();
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="3.1">
  <part-list><score-part id="P1"><part-name>Music</part-name></score-part></part-list>
  <part id="P1"><measure number="1"><note><rest/><duration>4</duration><type>whole</type></note></measure></part>
</score-partwise>`;
    let resolveInsert!: (value: boolean) => void;
    const insertPending = new Promise<boolean>((resolve) => {
      resolveInsert = resolve;
    });
    let resolveNoteEntryDisable!: (value: boolean) => void;
    const noteEntryDisablePending = new Promise<boolean>((resolve) => {
      resolveNoteEntryDisable = resolve;
    });
    const makeScore = () => ({
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg width="100" height="40"></svg>'),
      saveXml: vi.fn(async () => new TextEncoder().encode(xml)),
      setSoundFont: vi.fn(async () => {}),
      setNoteEntryMode: vi.fn(async () => true),
      metadata: vi.fn(async () => ({ parts: [{ name: 'Music' }] })),
      measurePositions: vi.fn(async () => ({
        elements: [{ id: 0, x: 0, y: 0, sx: 100, sy: 40, page: 0 }],
        events: [],
        pageSize: { width: 100, height: 40 },
      })),
      segmentPositions: vi.fn(async () => ({})),
      npages: vi.fn(async () => 1),
      relayout: vi.fn(async () => true),
      selectElementAtPointWithMode: vi.fn(async () => true),
      getSelectionBoundingBoxes: vi.fn(async () => [{
        page: 0,
        x: 12,
        y: 8,
        width: 18,
        height: 14,
      }]),
    });
    const mainScore = makeScore();
    const auxiliaryScore = {
      ...makeScore(),
      insertMeasures: vi.fn(() => insertPending),
      setNoteEntryMode: vi.fn((enabled: boolean) => (
        enabled ? Promise.resolve(true) : noteEntryDisablePending
      )),
    };
    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn()
        .mockResolvedValueOnce(mainScore)
        .mockResolvedValueOnce(auxiliaryScore),
    };

    searchParamValues = {
      compareLeft: '/left.musicxml',
      compareRight: '/right.musicxml',
    };
    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/left.musicxml') || url.endsWith('/right.musicxml')) {
        return {
          ok: true,
          text: async () => xml,
          arrayBuffer: async () => new TextEncoder().encode(xml).buffer,
        };
      }
      return {
        ok: false,
        text: async () => '',
        arrayBuffer: async () => new ArrayBuffer(0),
      };
    });

    const { unmount } = render(<ScoreEditor />);
    await waitFor(() => expect(auxiliaryScore.saveSvg).toHaveBeenCalled());
    const leftPane = await screen.findByTestId('compare-pane-left');
    const selectionSurface = leftPane.querySelector('[title^="Click to select this score"]');
    expect(selectionSurface).toBeTruthy();
    fireEvent.click(selectionSurface!, { clientX: 30, clientY: 20 });
    await waitFor(() => expect(auxiliaryScore.selectElementAtPointWithMode).toHaveBeenCalledWith(
      0,
      expect.any(Number),
      expect.any(Number),
      0,
    ));
    await waitFor(() => expect(screen.getByTestId('compare-selection-overlay-left')).toHaveStyle({
      left: '12px',
      top: '8px',
      width: '18px',
      height: '14px',
    }));
    auxiliaryScore.getSelectionBoundingBoxes.mockResolvedValueOnce([]);
    fireEvent.click(selectionSurface!, { clientX: 30, clientY: 20, ctrlKey: true });
    await waitFor(() => expect(auxiliaryScore.selectElementAtPointWithMode).toHaveBeenLastCalledWith(
      0,
      expect.any(Number),
      expect.any(Number),
      2,
    ));
    await waitFor(() => expect(screen.queryByTestId('compare-selection-overlay-left')).not.toBeInTheDocument());
    expect(auxiliaryScore.saveSvg.mock.calls.every((call: unknown[]) => call[2] === true)).toBe(true);

    await user.click(await screen.findByTestId('btn-compare-add-bar-left'));
    await waitFor(() => expect(auxiliaryScore.insertMeasures).toHaveBeenCalledWith(1, 3));

    unmount();
    expect(auxiliaryScore.destroy).not.toHaveBeenCalled();

    resolveInsert(true);
    await waitFor(() => expect(auxiliaryScore.setNoteEntryMode).toHaveBeenLastCalledWith(false));
    expect(auxiliaryScore.destroy).not.toHaveBeenCalled();

    resolveNoteEntryDisable(true);
    await waitFor(() => expect(auxiliaryScore.destroy).toHaveBeenCalledOnce());
    expect(auxiliaryScore.setNoteEntryMode.mock.invocationCallOrder.at(-1))
      .toBeLessThan(auxiliaryScore.destroy.mock.invocationCallOrder[0]);
  });

  it('does not start compare audio after close cancels soundfont setup', async () => {
    const user = userEvent.setup();
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="3.1">
  <part-list><score-part id="P1"><part-name>Music</part-name></score-part></part-list>
  <part id="P1"><measure number="1"><note><rest/><duration>4</duration><type>whole</type></note></measure></part>
</score-partwise>`;
    let releaseAuxiliarySoundFont!: () => void;
    const auxiliarySoundFontPending = new Promise<void>((resolve) => {
      releaseAuxiliarySoundFont = resolve;
    });
    const commonScoreMethods = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg width="100" height="40"></svg>'),
      saveXml: vi.fn(async () => new TextEncoder().encode(xml)),
      metadata: vi.fn(async () => ({ parts: [{ name: 'Music' }] })),
      measurePositions: vi.fn(async () => ({
        elements: [{ id: 0, x: 0, y: 0, sx: 100, sy: 40, page: 0 }],
        events: [],
        pageSize: { width: 100, height: 40 },
      })),
      segmentPositions: vi.fn(async () => ({})),
      npages: vi.fn(async () => 1),
      setNoteEntryMode: vi.fn(async () => true),
    };
    const mainScore = {
      ...commonScoreMethods,
      destroy: vi.fn(),
      setSoundFont: vi.fn(async () => {}),
    };
    const auxiliaryScore = {
      ...commonScoreMethods,
      destroy: vi.fn(),
      setSoundFont: vi.fn(() => auxiliarySoundFontPending),
      synthAudioBatch: vi.fn(async () => vi.fn(async () => [])),
    };

    searchParamValues = {
      compareLeft: '/left.musicxml',
      compareRight: '/right.musicxml',
    };
    mocked.loadWebMscore.mockResolvedValue({
      ready: Promise.resolve(),
      load: vi.fn()
        .mockResolvedValueOnce(mainScore)
        .mockResolvedValueOnce(auxiliaryScore),
    });
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/left.musicxml') || url.endsWith('/right.musicxml')) {
        return {
          ok: true,
          text: async () => xml,
          arrayBuffer: async () => new TextEncoder().encode(xml).buffer,
        };
      }
      if (url.includes('/soundfonts/')) {
        return {
          ok: true,
          text: async () => '',
          arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
        };
      }
      return {
        ok: false,
        text: async () => '',
        arrayBuffer: async () => new ArrayBuffer(0),
      };
    }));

    const { unmount } = render(<ScoreEditor />);
    await waitFor(() => expect(auxiliaryScore.saveSvg).toHaveBeenCalled());
    await user.click(await screen.findByTestId('btn-compare-play-left'));
    await waitFor(() => expect(auxiliaryScore.setSoundFont).toHaveBeenCalledOnce());

    unmount();
    releaseAuxiliarySoundFont();

    await waitFor(() => expect(auxiliaryScore.destroy).toHaveBeenCalledOnce());
    expect(auxiliaryScore.synthAudioBatch).not.toHaveBeenCalled();
  });

  it('ignores compare mutations before activation and routes shortcuts to the displayed score', async () => {
    const user = userEvent.setup();
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="3.1">
  <part-list><score-part id="P1"><part-name>Music</part-name></score-part></part-list>
  <part id="P1"><measure number="1"><note><rest/><duration>4</duration><type>whole</type></note></measure></part>
</score-partwise>`;
    const makeScore = () => ({
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg width="100" height="40"></svg>'),
      saveXml: vi.fn(async () => new TextEncoder().encode(xml)),
      setSoundFont: vi.fn(async () => {}),
      setNoteEntryMode: vi.fn(async () => true),
      metadata: vi.fn(async () => ({ parts: [{ name: 'Music' }] })),
      measurePositions: vi.fn(async () => ({
        elements: [{ id: 0, x: 0, y: 0, sx: 100, sy: 40, page: 0 }],
        events: [],
        pageSize: { width: 100, height: 40 },
      })),
      segmentPositions: vi.fn(async () => ({})),
      npages: vi.fn(async () => 1),
      relayout: vi.fn(async () => true),
      selectAll: vi.fn(async () => true),
      pitchUp: vi.fn(async () => true),
      getSelectionBoundingBoxes: vi.fn(async () => [{
        page: 0,
        x: 12,
        y: 8,
        width: 18,
        height: 14,
      }]),
    });
    const mainScore = makeScore();
    const auxiliaryScore = makeScore();
    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn()
        .mockResolvedValueOnce(mainScore)
        .mockResolvedValueOnce(auxiliaryScore),
    };

    searchParamValues = {
      compareLeft: '/left.musicxml',
      compareRight: '/right.musicxml',
    };
    mocked.loadWebMscore.mockResolvedValue(webmscore);
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/left.musicxml') || url.endsWith('/right.musicxml')) {
        return {
          ok: true,
          text: async () => xml,
          arrayBuffer: async () => new TextEncoder().encode(xml).buffer,
        };
      }
      return {
        ok: false,
        text: async () => '',
        arrayBuffer: async () => new ArrayBuffer(0),
      };
    }));

    render(<ScoreEditor />);
    await waitFor(() => expect(auxiliaryScore.saveSvg).toHaveBeenCalled());

    fireEvent.keyDown(window, { key: 'a', ctrlKey: true });
    fireEvent.keyDown(window, { key: 'ArrowUp' });
    expect(auxiliaryScore.selectAll).not.toHaveBeenCalled();
    expect(auxiliaryScore.pitchUp).not.toHaveBeenCalled();
    expect(mainScore.selectAll).not.toHaveBeenCalled();
    expect(mainScore.pitchUp).not.toHaveBeenCalled();

    await user.click(screen.getByTestId('btn-compare-activate-left'));
    fireEvent.keyDown(window, { key: 'a', ctrlKey: true });
    await waitFor(() => expect(auxiliaryScore.selectAll).toHaveBeenCalledOnce());
    fireEvent.keyDown(window, { key: 'ArrowUp' });
    await waitFor(() => expect(auxiliaryScore.pitchUp).toHaveBeenCalledOnce());
    expect(mainScore.selectAll).not.toHaveBeenCalled();
    expect(mainScore.pitchUp).not.toHaveBeenCalled();

    await user.click(screen.getByTestId('btn-compare-activate-right'));
    fireEvent.keyDown(window, { key: 'a', ctrlKey: true });
    await waitFor(() => expect(mainScore.selectAll).toHaveBeenCalledOnce());
    fireEvent.keyDown(window, { key: 'ArrowUp' });
    await waitFor(() => expect(mainScore.pitchUp).toHaveBeenCalledOnce());
    expect(auxiliaryScore.selectAll).toHaveBeenCalledOnce();
    expect(auxiliaryScore.pitchUp).toHaveBeenCalledOnce();
  });

  it('detects .mxl uploads and loads them with mxl format', async () => {
    const user = userEvent.setup();
    const largeData = new Uint8Array((2 * 1024 * 1024) + 8);

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg></svg>'),
      savePdf: vi.fn(async () => new Uint8Array([1])),
      setSoundFont: vi.fn(async () => {}),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
      npages: vi.fn(async () => 1),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    }));

    render(<ScoreEditor />);

    const file = new File([largeData], 'beethoven.mxl', {
      type: 'application/vnd.recordare.musicxml',
    });
    await user.upload(screen.getByTestId('open-score-input'), file);

    await waitFor(() => expect(webmscore.load).toHaveBeenCalled());
    expect(webmscore.load).toHaveBeenNthCalledWith(1, 'mxl', expect.any(Uint8Array), [], false);
  });

  it('detects .mscz uploads and starts with deferred load', async () => {
    const user = userEvent.setup();
    const largeData = new Uint8Array((2 * 1024 * 1024) + 256);
    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg></svg>'),
      savePdf: vi.fn(async () => new Uint8Array([1])),
      setSoundFont: vi.fn(async () => {}),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
      npages: vi.fn(async () => 1),
    };
    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    }));

    render(<ScoreEditor />);

    const file = new File([largeData], 'beethoven.mscz', {
      type: 'application/octet-stream',
    });
    await user.upload(screen.getByTestId('open-score-input'), file);

    await waitFor(() => expect(webmscore.load).toHaveBeenCalled());
    expect(webmscore.load).toHaveBeenNthCalledWith(1, 'mscz', expect.any(Uint8Array), [], false);
  });

  it('progressively lays out the next page when navigating large .musicxml scores', async () => {
    const user = userEvent.setup();
    const largeData = new Uint8Array((2 * 1024 * 1024) + 8);
    let pages = 1;

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async (pageIndex?: number) => `<svg><text>page-${pageIndex ?? 0}</text></svg>`),
      savePdf: vi.fn(async () => new Uint8Array([1])),
      savePng: vi.fn(async () => new Uint8Array([2])),
      setSoundFont: vi.fn(async () => {}),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
      layoutUntilPage: vi.fn(async (targetPage: number) => {
        if (targetPage === 0) {
          pages = 1;
          return true;
        }
        if (targetPage === 1) {
          pages = 2;
          return true;
        }
        return false;
      }),
      npages: vi.fn(async () => pages),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    }));

    render(<ScoreEditor />);

    const file = new File([largeData], 'beethoven.musicxml', { type: 'application/xml' });
    await user.upload(screen.getByTestId('open-score-input'), file);

    await waitFor(() => expect(webmscore.load).toHaveBeenNthCalledWith(1, 'musicxml', expect.any(Uint8Array), [], false));
    await waitFor(() => expect(score.layoutUntilPage).toHaveBeenCalledWith(0));
    await waitFor(() => expect(screen.getByTestId('page-indicator').textContent).toContain('Page 1 of 1+'));

    await user.click(screen.getByText('Next'));

    await waitFor(() => expect(score.layoutUntilPage).toHaveBeenCalledWith(1));
    await waitFor(() => expect(screen.getByTestId('page-indicator').textContent).toContain('Page 2 of 2+'));
    await waitFor(() => expect(score.saveSvg).toHaveBeenCalledWith(1, true, true));

    await user.click(screen.getByTestId('dropdown-export'));
    await user.click(await screen.findByTestId('btn-export-png'));
    await expect(screen.findByTestId('png-export-page-input')).resolves.toHaveValue(2);
    await user.click(await screen.findByTestId('btn-confirm-export-png'));
    await waitFor(() => expect(score.savePng).toHaveBeenCalledWith(1, true, true));
  });

  it('alerts when score load fails', async () => {
    const user = userEvent.setup();

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => {
        throw new Error('boom');
      }),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    }));

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'bad.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);

    await waitFor(() =>
      expect(testGlobals.alert).toHaveBeenCalledWith('Failed to load score. See console for details.'),
    );
  });

  it('loads default soundfont and enables WAV export when audio is available', async () => {
    const user = userEvent.setup();

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg><g class="Note"></g></svg>'),
      savePdf: vi.fn(async () => new Uint8Array([1])),
      saveAudio: vi.fn(async () => new Uint8Array([0])),
      setSoundFont: vi.fn(async () => {}),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: true,
      arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
    }));

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);

    await waitFor(() => expect(score.setSoundFont).toHaveBeenCalled());
    await user.click(screen.getByTestId('dropdown-export'));
    await waitFor(() => expect(screen.getByTestId('btn-export-audio')).toBeEnabled());
  });

  it('invokes mutation and export handlers from the toolbar', async () => {
    const user = userEvent.setup();

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg><g class="Note"></g></svg>'),
      savePdf: vi.fn(async () => new Uint8Array([1])),
      setSoundFont: vi.fn(async () => {}),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
      relayout: vi.fn(async () => true),
      selectElementAtPoint: vi.fn(async () => true),
      pitchUp: vi.fn(async () => true),
      transpose: vi.fn(async () => true),
      setAccidental: vi.fn(async () => true),
      doubleDuration: vi.fn(async () => true),
      toggleDot: vi.fn(async () => true),
      changeSelectedElementsVoice: vi.fn(async () => true),
      addDynamic: vi.fn(async () => true),
      setTimeSignature: vi.fn(async () => true),
      setKeySignature: vi.fn(async () => true),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    }));

    testGlobals.URL.createObjectURL = vi.fn(() => 'blob:mock');
    testGlobals.URL.revokeObjectURL = vi.fn();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);

    await waitFor(() => expect(screen.getByTestId('svg-container').querySelector('svg')).toBeTruthy());

    const note = screen.getByTestId('svg-container').querySelector('.Note');
    expect(note).toBeTruthy();
    fireEvent.click(note!);
    await screen.findByTestId('selection-overlay');

    await user.click(screen.getByTestId('btn-pitch-up'));
    await user.click(screen.getByTestId('btn-transpose-12'));
    await user.click(screen.getByTestId('btn-duration-longer'));
    await user.click(screen.getByTestId('dropdown-rhythm'));
    await user.click(await screen.findByTestId('btn-dot'));
    await user.click(screen.getByTestId('dropdown-voice'));
    await user.click(await screen.findByTestId('btn-voice-2'));
    await user.click(screen.getByTestId('dropdown-accidental'));
    await user.click(await screen.findByTestId('btn-acc-3'));
    await user.click(screen.getByTestId('dropdown-markings'));
    await user.click(await screen.findByTestId('btn-dynamic-6'));
    await user.click(screen.getByTestId('dropdown-signature'));
    await user.click(await screen.findByTestId('btn-timesig-4-4'));
    await user.click(screen.getByTestId('dropdown-key'));
    await user.click(await screen.findByTestId('btn-keysig-0'));

    await waitFor(() => expect(score.pitchUp).toHaveBeenCalled());
    await waitFor(() => expect(score.transpose).toHaveBeenCalledWith(1, 0, 0, 25, true, true, true));
    await waitFor(() => expect(score.setAccidental).toHaveBeenCalledWith(3));
    await waitFor(() => expect(score.doubleDuration).toHaveBeenCalled());
    await waitFor(() => expect(score.toggleDot).toHaveBeenCalled());
    await waitFor(() => expect(score.changeSelectedElementsVoice).toHaveBeenCalledWith(1));
    await waitFor(() => expect(score.addDynamic).toHaveBeenCalledWith(6));
    await waitFor(() => expect(score.setTimeSignature).toHaveBeenCalledWith(4, 4));
    await waitFor(() => expect(score.setKeySignature).toHaveBeenCalledWith(0));

    await user.click(screen.getByTestId('dropdown-export'));
    await user.click(await screen.findByTestId('btn-export-svg'));
    await waitFor(() => expect(score.saveSvg).toHaveBeenCalled());
    await waitFor(() => expect(testGlobals.URL.createObjectURL).toHaveBeenCalled());
  }, 15000);

  it('auto-loads a score from the URL query param', async () => {
    scoreParamValue = '/test_scores/demo.musicxml';

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg></svg>'),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async (url: string) => {
      expect(url).toBe('/test_scores/demo.musicxml');
      return {
        ok: true,
        arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
      };
    });

    render(<ScoreEditor />);

    await waitFor(() => expect(webmscore.load).toHaveBeenCalled());
    expect(webmscore.load).toHaveBeenCalledWith('musicxml', expect.any(Uint8Array));
    await waitFor(() => expect(screen.getByTestId('svg-container').querySelector('svg')).toBeTruthy());
  });

  it('adds tempo text at the start of the score without requiring a selection', async () => {
    const user = userEvent.setup();

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg><g class="Note"></g></svg>'),
      relayout: vi.fn(async () => true),
      addTempoText: vi.fn(async () => true),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    }));

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);

    await waitFor(() => expect(screen.getByTestId('svg-container').querySelector('svg')).toBeTruthy());
    expect(screen.queryByTestId('selection-overlay')).not.toBeInTheDocument();

    const tempoInput = screen.getByTestId('input-tempo-bpm');
    await user.clear(tempoInput);
    await user.type(tempoInput, '96');
    await user.click(screen.getByTestId('btn-tempo-apply'));

    await waitFor(() => expect(score.addTempoText).toHaveBeenCalledWith(96));
  });

  it('zooms in/out and clamps zoom limits', async () => {
    const user = userEvent.setup();
    render(<ScoreEditor />);

    const wrapper = screen.getByTestId('score-wrapper');
    expect(wrapper).toHaveStyle({ transform: 'scale(1)' });

    for (let i = 0; i < 20; i++) {
      await user.click(screen.getByTestId('btn-zoom-out'));
    }
    expect(wrapper).toHaveStyle({ transform: 'scale(0.01)' });

    for (let i = 0; i < 50; i++) {
      await user.click(screen.getByTestId('btn-zoom-in'));
    }
    expect(wrapper).toHaveStyle({ transform: 'scale(1)' });
  }, 10000);

  it('exports PDF/PNG/MXL/MSCZ/MSCX/MusicXML/ABC/MIDI via Score methods', async () => {
    const user = userEvent.setup();

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg><g class="Note"></g></svg>'),
      savePdf: vi.fn(async () => new Uint8Array([1])),
      savePng: vi.fn(async () => new Uint8Array([2])),
      saveMxl: vi.fn(async () => new Uint8Array([3])),
      saveMsc: vi.fn(async () => new Uint8Array([4])),
      saveXml: vi.fn(async () => new TextEncoder().encode('<score-partwise version="3.1"><part-list/><part id="P1"><measure number="1"/></part></score-partwise>')),
      saveMidi: vi.fn(async () => new Uint8Array([5])),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
      if (url.includes('/api/music/convert')) {
        return {
          ok: true,
          headers: new Headers(),
          json: async () => ({ content: 'X:1\nM:4/4\nK:C\nC D E F|' }),
          arrayBuffer: async () => new ArrayBuffer(0),
        };
      }
      return {
        ok: false,
        headers: new Headers(),
        json: async () => ({}),
        arrayBuffer: async () => new ArrayBuffer(0),
      };
    });

    testGlobals.URL.createObjectURL = vi.fn(() => 'blob:mock');
    testGlobals.URL.revokeObjectURL = vi.fn();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);

    await waitFor(() => expect(screen.getByTestId('svg-container').querySelector('svg')).toBeTruthy());

    await user.click(screen.getByTestId('dropdown-export'));
    await user.click(await screen.findByTestId('btn-export-pdf'));
    await user.click(screen.getByTestId('dropdown-export'));
    await user.click(await screen.findByTestId('btn-export-png'));
    await expect(screen.findByTestId('png-export-page-input')).resolves.toHaveValue(1);
    await user.click(await screen.findByTestId('btn-confirm-export-png'));
    await user.click(screen.getByTestId('dropdown-export'));
    await user.click(await screen.findByTestId('btn-export-mxl'));
    await user.click(screen.getByTestId('dropdown-export'));
    await user.click(await screen.findByTestId('btn-export-mscz'));
    await user.click(screen.getByTestId('dropdown-export'));
    await user.click(await screen.findByTestId('btn-export-mscx'));
    await user.click(screen.getByTestId('dropdown-export'));
    await user.click(await screen.findByTestId('btn-export-musicxml'));
    await user.click(screen.getByTestId('dropdown-export'));
    await user.click(await screen.findByTestId('btn-export-abc'));
    await user.click(screen.getByTestId('dropdown-export'));
    await user.click(await screen.findByTestId('btn-export-midi'));

    await waitFor(() => expect(score.savePdf).toHaveBeenCalled());
    await waitFor(() => expect(score.savePng).toHaveBeenCalledWith(0, true, true));
    await waitFor(() => expect(score.saveMxl).toHaveBeenCalled());
    await waitFor(() => expect(score.saveMsc).toHaveBeenCalledWith('mscz'));
    await waitFor(() => expect(score.saveMsc).toHaveBeenCalledWith('mscx'));
    await waitFor(() => expect(score.saveXml).toHaveBeenCalled());
    await waitFor(() => expect(score.saveMidi).toHaveBeenCalledWith(true, true));
    await waitFor(() => expect(testGlobals.URL.createObjectURL).toHaveBeenCalled());
    await waitFor(() => expect(testGlobals.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/music/convert'),
      expect.any(Object),
    ));
  }, 10000);

  it('supports note respelling keyboard shortcuts', async () => {
    const user = userEvent.setup();

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg><g class="Note"></g></svg>'),
      relayout: vi.fn(async () => true),
      selectElementAtPoint: vi.fn(async () => true),
      addPitchByStep: vi.fn(async () => true),
      setAccidental: vi.fn(async () => true),
      setDurationType: vi.fn(async () => true),
      toggleDot: vi.fn(async () => true),
      enterRest: vi.fn(async () => true),
      addTie: vi.fn(async () => true),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    }));

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);

    await waitFor(() => expect(screen.getByTestId('svg-container').querySelector('svg')).toBeTruthy());

    const note = screen.getByTestId('svg-container').querySelector('.Note');
    expect(note).toBeTruthy();
    fireEvent.click(note!);
    await screen.findByTestId('selection-overlay');

    fireEvent.keyDown(window, { key: '1' });
    await waitFor(() => expect(score.setDurationType).toHaveBeenCalledWith(8));

    fireEvent.keyDown(window, { key: '.' });
    await waitFor(() => expect(score.toggleDot).toHaveBeenCalled());

    fireEvent.keyDown(window, { key: '+' });
    await waitFor(() => expect(score.setAccidental).toHaveBeenCalledWith(3));

    fireEvent.keyDown(window, { key: '-' });
    await waitFor(() => expect(score.setAccidental).toHaveBeenCalledWith(1));

    fireEvent.keyDown(window, { key: '=' });
    await waitFor(() => expect(score.setAccidental).toHaveBeenCalledWith(2));

    fireEvent.keyDown(window, { key: 'c' });
    await waitFor(() => expect(score.addPitchByStep).toHaveBeenCalledWith(0, false, false));

    fireEvent.keyDown(window, { key: '0' });
    await waitFor(() => expect(score.enterRest).toHaveBeenCalled());

    fireEvent.keyDown(window, { key: 'T' });
    await waitFor(() => expect(score.addTie).toHaveBeenCalled());
  });

  it('shows and advances the engine note-input cursor without a prior UI selection', async () => {
    const user = userEvent.setup();
    let cursorX = 14;
    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg width="200" height="100"><g class="Rest selected"></g></svg>'),
      setNoteEntryMode: vi.fn(async () => true),
      getNoteInputCursorRect: vi.fn(async () => ({
        page: 0,
        x: cursorX,
        y: 20,
        width: 18,
        height: 48,
        voice: 0,
      })),
      getSpatium: vi.fn(async () => 10),
      addPitchByStep: vi.fn(async () => {
        cursorX = 46;
        return true;
      }),
      relayout: vi.fn(async () => true),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
    };
    mocked.loadWebMscore.mockResolvedValue({
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    });
    testGlobals.fetch = vi.fn(async () => ({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    }));

    render(<ScoreEditor />);
    const file = new File([new Uint8Array([1])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);
    await waitFor(() => expect(screen.getByTestId('svg-container').querySelector('svg')).toBeTruthy());

    fireEvent.keyDown(window, { key: 'n' });
    await waitFor(() => expect(screen.getByTestId('note-input-cursor')).toHaveStyle({
      left: '14px',
      top: '20px',
      width: '18px',
      height: '48px',
      borderLeft: '3px solid #0065BF',
    }));

    fireEvent.keyDown(window, { key: 'c' });
    await waitFor(() => expect(score.addPitchByStep).toHaveBeenCalledWith(0, false, false));
    await waitFor(() => expect(screen.getByTestId('note-input-cursor')).toHaveStyle({
      left: '46px',
    }));

    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByTestId('note-input-cursor')).not.toBeInTheDocument());
    expect(score.setNoteEntryMode).toHaveBeenLastCalledWith(false);
  });

  it('advances selection with left/right arrows', async () => {
    const user = userEvent.setup();

    let selectedIndex: number | null = null;
    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => {
        const firstSelected = selectedIndex === 0 ? ' selected' : '';
        const secondSelected = selectedIndex === 1 ? ' selected' : '';
        return `<svg><g class="Note note-1${firstSelected}"></g><g class="Note note-2${secondSelected}"></g></svg>`;
      }),
      selectElementAtPoint: vi.fn(async (_page: number, x: number) => {
        selectedIndex = x > 100 ? 1 : 0;
        return true;
      }),
      selectNextChord: vi.fn(async () => {
        selectedIndex = selectedIndex === null ? 0 : Math.min(1, selectedIndex + 1);
        return true;
      }),
      selectPrevChord: vi.fn(async () => {
        selectedIndex = selectedIndex === null ? 0 : Math.max(0, selectedIndex - 1);
        return true;
      }),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    rectSpy?.mockImplementation(function (this: Element) {
      const classes = this.getAttribute?.('class') || '';
      if (classes.includes('note-2')) {
        return {
          ...boundingRect,
          left: 120,
          right: 220,
        } as DOMRect;
      }
      if (classes.includes('note-1')) {
        return {
          ...boundingRect,
          left: 0,
          right: 100,
        } as DOMRect;
      }
      return boundingRect;
    });

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    }));

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);
    await waitFor(() => expect(screen.getByTestId('svg-container').querySelector('svg')).toBeTruthy());

    const notes = screen.getByTestId('svg-container').querySelectorAll('.Note');
    expect(notes.length).toBe(2);
    fireEvent.click(notes[0]!);
    await screen.findByTestId('selection-overlay');

    await waitFor(() => expect(screen.getByTestId('selection-overlay')).toHaveStyle({ left: '0px' }));

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    await waitFor(() => expect(screen.getByTestId('selection-overlay')).toHaveStyle({ left: '120px' }));
    expect(score.selectNextChord).toHaveBeenCalled();

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    await waitFor(() => expect(screen.getByTestId('selection-overlay')).toHaveStyle({ left: '0px' }));
    expect(score.selectPrevChord).toHaveBeenCalled();
  });

  it('alerts when optional export bindings are missing', async () => {
    const user = userEvent.setup();

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg></svg>'),
      savePdf: vi.fn(async () => new Uint8Array([1])),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    }));

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);

    await waitFor(() => expect(screen.getByTestId('svg-container').querySelector('svg')).toBeTruthy());

    await user.click(screen.getByTestId('dropdown-export'));
    await user.click(await screen.findByTestId('btn-export-mxl'));
    expect(testGlobals.alert).toHaveBeenCalledWith('MXL export is not available in this build.');

    await user.click(screen.getByTestId('dropdown-export'));
    await user.click(await screen.findByTestId('btn-export-mscz'));
    expect(testGlobals.alert).toHaveBeenCalledWith('MSCZ export is not available in this build.');

    await user.click(screen.getByTestId('dropdown-export'));
    await user.click(await screen.findByTestId('btn-export-mscx'));
    expect(testGlobals.alert).toHaveBeenCalledWith('MSCX export is not available in this build.');

    await user.click(screen.getByTestId('dropdown-export'));
    await user.click(await screen.findByTestId('btn-export-musicxml'));
    expect(testGlobals.alert).toHaveBeenCalledWith('MusicXML export is not available in this build.');

    await user.click(screen.getByTestId('dropdown-export'));
    await user.click(await screen.findByTestId('btn-export-abc'));
    expect(testGlobals.alert).toHaveBeenCalledWith('ABC export is not available in this build.');

    await user.click(screen.getByTestId('dropdown-export'));
    await user.click(await screen.findByTestId('btn-export-midi'));
    expect(testGlobals.alert).toHaveBeenCalledWith('MIDI export is not available in this build.');
  });

  it.skip('plays audio from WAV once and replays from cached URL', async () => {
    const user = userEvent.setup();

    const saveAudioDeferred: { resolve?: (value: Uint8Array) => void } = {};
    const saveAudio = vi.fn(
      () =>
        new Promise<Uint8Array>((resolve) => {
          saveAudioDeferred.resolve = resolve;
        }),
    );

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg></svg>'),
      saveAudio,
      setSoundFont: vi.fn(async () => {}),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: true,
      arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
    }));

    testGlobals.URL.createObjectURL = vi.fn(() => 'blob:audio');
    testGlobals.URL.revokeObjectURL = vi.fn();

    const createdAudios: MockAudio[] = [];
    class MockAudio {
      src = '';
      currentTime = 0;
      onended: (() => void) | null = null;
      pause = vi.fn();
      play = vi.fn(async () => {});

      constructor(url: string) {
        this.src = url;
        createdAudios.push(this);
      }
    }
    testGlobals.Audio = MockAudio;

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);

    await waitFor(() => expect(score.setSoundFont).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByTestId('btn-play')).toBeEnabled());

    await user.click(screen.getByTestId('btn-play'));
    await waitFor(() => expect(screen.getByTestId('btn-play')).toHaveTextContent('Working…'));

    saveAudioDeferred.resolve?.(new Uint8Array([0]));

    await waitFor(() => expect(screen.getByTestId('btn-play')).toHaveTextContent('Replay'));
    expect(saveAudio).toHaveBeenCalledTimes(1);
    expect(createdAudios.length).toBeGreaterThanOrEqual(1);

    await user.click(screen.getByTestId('btn-play'));
    await waitFor(() => expect(screen.getByTestId('btn-play')).toHaveTextContent('Replay'));
    expect(saveAudio).toHaveBeenCalledTimes(1);
    expect(testGlobals.URL.createObjectURL).toHaveBeenCalledTimes(1);

    await user.click(screen.getByTestId('btn-stop'));
    await waitFor(() => expect(screen.getByTestId('btn-play')).toHaveTextContent('Play'));
    expect(createdAudios.at(-1)?.pause).toHaveBeenCalled();
  });

  it.skip('streams playback when synthAudioBatch is available and cancels on stop', async () => {
    const user = userEvent.setup();

    const floatChunk = new Float32Array(512);
    const chunkBytes = new Uint8Array(floatChunk.buffer);

    let batchesReturned = 0;
    const batchFn = vi.fn(async (cancel?: boolean) => {
      if (cancel) return [];
      if (batchesReturned > 0) return [];
      batchesReturned++;
      return [
        {
          chunk: chunkBytes,
          startTime: 0,
          done: true,
        },
      ];
    });

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg></svg>'),
      saveAudio: vi.fn(async () => new Uint8Array([0])),
      setSoundFont: vi.fn(async () => {}),
      synthAudioBatch: vi.fn(async () => batchFn),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: true,
      arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
    }));

    type MockAudioSource = {
      buffer: AudioBuffer | null;
      connect: TestMock;
      start: TestMock;
      stop: TestMock;
      onended: (() => void) | null;
    };
    const createdSources: MockAudioSource[] = [];
    const resumeAudioContext = vi.fn(async () => {});
    class MockAudioContext {
      state: 'running' | 'suspended' = 'suspended';
      currentTime = 0;
      sampleRate = 44100;
      destination = {};

      resume = vi.fn(async () => {
        this.state = 'running';
        await resumeAudioContext();
      });

      createBuffer = vi.fn(() => ({
        copyToChannel: vi.fn(),
      }));

      createBufferSource = vi.fn(() => {
        const source = {
          buffer: null,
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
          onended: null,
        };
        createdSources.push(source as MockAudioSource);
        return source;
      });
    }

    testGlobals.AudioContext = MockAudioContext;

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);

    await waitFor(() => expect(score.setSoundFont).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByTestId('btn-play')).toBeEnabled());

    await user.click(screen.getByTestId('btn-play'));
    await waitFor(() => expect(screen.getByTestId('btn-play')).toHaveTextContent('Replay'));

    expect(score.synthAudioBatch).toHaveBeenCalled();
    expect(score.saveAudio).not.toHaveBeenCalled();
    expect(resumeAudioContext).toHaveBeenCalled();
    expect(createdSources.length).toBeGreaterThan(0);

    await user.click(screen.getByTestId('btn-stop'));
    await waitFor(() => expect(screen.getByTestId('btn-play')).toHaveTextContent('Play'));
    expect(batchFn).toHaveBeenCalledWith(true);
    expect(createdSources[0].stop).toHaveBeenCalled();
  });

  it('plays transport from selection when the dedicated streaming binding is available', async () => {
    const user = userEvent.setup();

    const floatChunk = new Float32Array(512);
    const chunkBytes = new Uint8Array(floatChunk.buffer);
    const fromSelectionBatchFn = vi.fn(async (cancel?: boolean) => {
      if (cancel) return [];
      return [
        {
          chunk: chunkBytes,
          startTime: 0,
          done: true,
        },
      ];
    });

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg><g class="Note"></g></svg>'),
      saveAudio: vi.fn(async () => new Uint8Array([0])),
      setSoundFont: vi.fn(async () => {}),
      synthAudioBatchFromSelection: vi.fn(async (startTick?: number) => {
        void startTick;
        return fromSelectionBatchFn;
      }),
      selectElementAtPoint: vi.fn(async () => true),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: true,
      arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
    }));

    class MockAudioContext {
      state: 'running' | 'suspended' = 'suspended';
      currentTime = 0;
      sampleRate = 44100;
      destination = {};
      resume = vi.fn(async () => {
        this.state = 'running';
      });
      createBuffer = vi.fn(() => ({
        copyToChannel: vi.fn(),
      }));
      createBufferSource = vi.fn(() => ({
        buffer: null,
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        onended: null,
      }));
    }
    testGlobals.AudioContext = MockAudioContext;

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);
    await waitFor(() => expect(score.setSoundFont).toHaveBeenCalled());

    const note = screen.getByTestId('svg-container').querySelector('.Note');
    expect(note).toBeTruthy();
    fireEvent.click(note!);
    await screen.findByTestId('selection-overlay');

    await user.click(screen.getByTestId('btn-play-from-selection'));
    await waitFor(() => expect(score.synthAudioBatchFromSelection).toHaveBeenCalled());
    expect(score.synthAudioBatchFromSelection.mock.calls[0]?.[0]).toEqual(expect.any(Number));
    expect(score.saveAudio).not.toHaveBeenCalled();
  });

  it('triggers isolated preview audio on selection and note mutation', async () => {
    const user = userEvent.setup();

    const floatChunk = new Float32Array(512);
    const chunkBytes = new Uint8Array(floatChunk.buffer);
    const previewBatchFn = vi.fn(async (cancel?: boolean) => {
      if (cancel) return [];
      return [
        {
          chunk: chunkBytes,
          startTime: 0,
          endTime: 0.5,
          done: true,
        },
      ];
    });

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg><g class="Note"></g></svg>'),
      saveAudio: vi.fn(async () => new Uint8Array([0])),
      setSoundFont: vi.fn(async () => {}),
      selectElementAtPoint: vi.fn(async () => true),
      addPitchByStep: vi.fn(async () => true),
      relayout: vi.fn(async () => true),
      synthSelectionPreviewBatch: vi.fn(async () => previewBatchFn),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: true,
      arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
    }));

    class MockAudioContext {
      state: 'running' | 'suspended' = 'suspended';
      currentTime = 0;
      sampleRate = 44100;
      destination = {};
      resume = vi.fn(async () => {
        this.state = 'running';
      });
      createBuffer = vi.fn(() => ({
        copyToChannel: vi.fn(),
      }));
      createBufferSource = vi.fn(() => ({
        buffer: null,
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        onended: null,
      }));
    }
    testGlobals.AudioContext = MockAudioContext;

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);
    await waitFor(() => expect(score.setSoundFont).toHaveBeenCalled());

    const note = screen.getByTestId('svg-container').querySelector('.Note');
    expect(note).toBeTruthy();
    fireEvent.click(note!);
    await screen.findByTestId('selection-overlay');

    await waitFor(() => expect(score.synthSelectionPreviewBatch).toHaveBeenCalled());

    fireEvent.keyDown(window, { key: 'c' });
    await waitFor(() => expect(score.addPitchByStep).toHaveBeenCalledWith(0, false, false));
    await waitFor(() => expect(score.synthSelectionPreviewBatch.mock.calls.length).toBeGreaterThanOrEqual(2));
  });

  it('extracts page index from SVG ancestry and clears selection on invalid boxes', async () => {
    const user = userEvent.setup();

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg><g id="page-2"><g class="Note"><path id="inner"/></g></g></svg>'),
      selectElementAtPoint: vi.fn(async () => true),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    }));

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);

    await waitFor(() => expect(screen.getByTestId('svg-container').querySelector('svg')).toBeTruthy());

    const inner = screen.getByTestId('svg-container').querySelector('#inner');
    expect(inner).toBeTruthy();
    fireEvent.click(inner!);

    await waitFor(() => expect(score.selectElementAtPoint).toHaveBeenCalledWith(1, expect.any(Number), expect.any(Number)));

    await screen.findByTestId('selection-overlay');

    rectSpy?.mockReturnValue({
      ...boundingRect,
      width: 0,
      height: 0,
      right: 0,
      bottom: 0,
    } as DOMRect);

    fireEvent.click(inner!);
    await waitFor(() => expect(screen.queryByTestId('selection-overlay')).not.toBeInTheDocument());
  });

  it.skip('clears selection when clicking blank space and allows re-selecting notes', async () => {
    const user = userEvent.setup();

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg><g class="Note"></g></svg>'),
      selectElementAtPoint: vi.fn(async () => true),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    }));

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);
    await waitFor(() => expect(screen.getByTestId('svg-container').querySelector('svg')).toBeTruthy());

    const svg = screen.getByTestId('svg-container').querySelector('svg');
    expect(svg).toBeTruthy();

    const note = screen.getByTestId('svg-container').querySelector('.Note');
    expect(note).toBeTruthy();

    fireEvent.click(note!);
    await screen.findByTestId('selection-overlay');
    expect(score.selectElementAtPoint).toHaveBeenCalledTimes(1);

    fireEvent.click(svg!);

    await waitFor(() => expect(screen.queryByTestId('selection-overlay')).not.toBeInTheDocument());
    expect(score.selectElementAtPoint).toHaveBeenCalledTimes(1);

    fireEvent.click(note!);
    await screen.findByTestId('selection-overlay');
    expect(score.selectElementAtPoint).toHaveBeenCalledTimes(2);
  });

  it('refreshes selection overlay after mutation using SVG selection classes', async () => {
    const user = userEvent.setup();

    const score = {
      destroy: vi.fn(),
      saveSvg: vi
        .fn()
        .mockResolvedValueOnce('<svg><g class="Note"></g></svg>')
        .mockResolvedValueOnce('<svg><g class="Note selected"></g></svg>'),
      relayout: vi.fn(async () => true),
      selectElementAtPoint: vi.fn(async () => true),
      pitchUp: vi.fn(async () => true),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    rectSpy?.mockImplementation(function (this: Element) {
      const classes = this.getAttribute?.('class') || '';
      if (classes.includes('selected')) {
        return {
          ...boundingRect,
          left: 20,
          top: 30,
          right: 70,
          bottom: 90,
          width: 50,
          height: 60,
        } as DOMRect;
      }
      return boundingRect;
    });

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    }));

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);
    await waitFor(() => expect(screen.getByTestId('svg-container').querySelector('svg')).toBeTruthy());

    const note = screen.getByTestId('svg-container').querySelector('.Note');
    expect(note).toBeTruthy();
    fireEvent.click(note!);
    await screen.findByTestId('selection-overlay');

    expect(screen.getByTestId('selection-overlay')).toHaveStyle({ left: '0px', top: '0px' });

    await user.click(screen.getByTestId('btn-pitch-up'));

    await waitFor(() => expect(screen.getByTestId('selection-overlay')).toHaveStyle({ left: '20px', top: '30px' }));
    expect(score.pitchUp).toHaveBeenCalled();
  });

  it('alerts when a mutation binding is missing', async () => {
    const user = userEvent.setup();

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg><g class="Note"></g></svg>'),
      selectElementAtPoint: vi.fn(async () => true),
      relayout: vi.fn(async () => true),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    }));

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);

    await waitFor(() => expect(screen.getByTestId('svg-container').querySelector('svg')).toBeTruthy());

    const note = screen.getByTestId('svg-container').querySelector('.Note');
    expect(note).toBeTruthy();
    fireEvent.click(note!);
    await screen.findByTestId('selection-overlay');

    await user.click(screen.getByTestId('dropdown-rhythm'));
    await user.click(await screen.findByTestId('btn-double-dot'));
    expect(testGlobals.alert).toHaveBeenCalledWith('This build of webmscore does not expose "toggleDoubleDot".');
  });

  it('clears selection on delete even when the binding is missing', async () => {
    const user = userEvent.setup();

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg><g class="Note"></g></svg>'),
      selectElementAtPoint: vi.fn(async () => true),
      relayout: vi.fn(async () => true),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
    };

    const webmscore = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    testGlobals.fetch = vi.fn(async () => ({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    }));

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);

    await waitFor(() => expect(screen.getByTestId('svg-container').querySelector('svg')).toBeTruthy());

    const note = screen.getByTestId('svg-container').querySelector('.Note');
    expect(note).toBeTruthy();
    fireEvent.click(note!);
    await screen.findByTestId('selection-overlay');

    await user.click(screen.getByTestId('btn-delete'));
    await waitFor(() => expect(screen.queryByTestId('selection-overlay')).not.toBeInTheDocument());
    expect(testGlobals.alert).toHaveBeenCalledWith('This build of webmscore does not expose "deleteSelection".');
  });

  it('new score dialog shows pickup checkbox and reveals inputs when checked', async () => {
    const user = userEvent.setup();

    const score = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg></svg>'),
      savePdf: vi.fn(async () => new Uint8Array([1])),
      setSoundFont: vi.fn(async () => {}),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
    };

    const webmscore = {
      load: vi.fn(async () => score),
      ready: Promise.resolve(),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);

    render(<ScoreEditor />);

    // Open new score dialog
    const newScoreButton = screen.getByText('New Score');
    await user.click(newScoreButton);

    await waitFor(() => expect(screen.getByTestId('new-score-modal')).toBeInTheDocument());

    // Verify pickup checkbox exists
    const checkbox = screen.getByTestId('new-score-pickup-checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    // Pickup numerator/denominator should not be visible yet
    expect(screen.queryByTestId('new-score-pickup-numerator')).not.toBeInTheDocument();
    expect(screen.queryByTestId('new-score-pickup-denominator')).not.toBeInTheDocument();

    // Check the checkbox
    await user.click(checkbox);

    // Now pickup inputs should be visible
    await waitFor(() => {
      expect(screen.getByTestId('new-score-pickup-numerator')).toBeInTheDocument();
      expect(screen.getByTestId('new-score-pickup-denominator')).toBeInTheDocument();
    });
  });
});
