import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => ({
  loadWebMscore: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: () => null,
  }),
}));

vi.mock('../lib/webmscore-loader', () => ({
  loadWebMscore: mocked.loadWebMscore,
}));

import ScoreEditor from '../components/ScoreEditor';

describe('ScoreEditor', () => {
  const boundingRect = {
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

  beforeEach(() => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(boundingRect as any);
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    (globalThis as any).alert = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads a score from file upload, supports selection, and applies clef', async () => {
    const user = userEvent.setup();

    const score: any = {
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

    const webmscore: any = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    (globalThis as any).fetch = vi.fn(async () => ({
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

    await user.click(screen.getByTestId('btn-clef-0'));

    await waitFor(() => expect(score.setClef).toHaveBeenCalledWith(0));
    expect(score.relayout).toHaveBeenCalled();
    expect(score.selectElementAtPoint.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('alerts when score load fails', async () => {
    const user = userEvent.setup();

    const webmscore: any = {
      ready: Promise.resolve(),
      load: vi.fn(async () => {
        throw new Error('boom');
      }),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    (globalThis as any).fetch = vi.fn(async () => ({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    }));

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'bad.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);

    await waitFor(() =>
      expect((globalThis as any).alert).toHaveBeenCalledWith('Failed to load score. See console for details.'),
    );
  });

  it('loads default soundfont and enables WAV export when audio is available', async () => {
    const user = userEvent.setup();

    const score: any = {
      destroy: vi.fn(),
      saveSvg: vi.fn(async () => '<svg><g class="Note"></g></svg>'),
      savePdf: vi.fn(async () => new Uint8Array([1])),
      saveAudio: vi.fn(async () => new Uint8Array([0])),
      setSoundFont: vi.fn(async () => {}),
      metadata: vi.fn(async () => ({})),
      measurePositions: vi.fn(async () => ({})),
      segmentPositions: vi.fn(async () => ({})),
    };

    const webmscore: any = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    (globalThis as any).fetch = vi.fn(async () => ({
      ok: true,
      arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
    }));

    render(<ScoreEditor />);

    const file = new File([new Uint8Array([1])], 'demo.mscz', { type: 'application/octet-stream' });
    await user.upload(screen.getByTestId('open-score-input'), file);

    await waitFor(() => expect(score.setSoundFont).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByTestId('btn-export-audio')).toBeEnabled());
  });

  it('invokes mutation and export handlers from the toolbar', async () => {
    const user = userEvent.setup();

    const score: any = {
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
      doubleDuration: vi.fn(async () => true),
      toggleDot: vi.fn(async () => true),
      setVoice: vi.fn(async () => true),
      addDynamic: vi.fn(async () => true),
      setTimeSignature: vi.fn(async () => true),
    };

    const webmscore: any = {
      ready: Promise.resolve(),
      load: vi.fn(async () => score),
    };

    mocked.loadWebMscore.mockResolvedValue(webmscore);
    (globalThis as any).fetch = vi.fn(async () => ({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    }));

    (globalThis as any).URL.createObjectURL = vi.fn(() => 'blob:mock');
    (globalThis as any).URL.revokeObjectURL = vi.fn();
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
    await user.click(screen.getByTestId('btn-duration-longer'));
    await user.click(screen.getByTestId('btn-dot'));
    await user.click(screen.getByTestId('btn-voice-2'));
    await user.click(screen.getByTestId('btn-dynamic-6'));
    await user.click(screen.getByTestId('btn-timesig-3-4'));

    await waitFor(() => expect(score.pitchUp).toHaveBeenCalled());
    await waitFor(() => expect(score.doubleDuration).toHaveBeenCalled());
    await waitFor(() => expect(score.toggleDot).toHaveBeenCalled());
    await waitFor(() => expect(score.setVoice).toHaveBeenCalledWith(1));
    await waitFor(() => expect(score.addDynamic).toHaveBeenCalledWith(6));
    await waitFor(() => expect(score.setTimeSignature).toHaveBeenCalledWith(3, 4));

    await user.click(screen.getByTestId('btn-export-svg'));
    await waitFor(() => expect(score.saveSvg).toHaveBeenCalled());
    await waitFor(() => expect((globalThis as any).URL.createObjectURL).toHaveBeenCalled());
  });
});
