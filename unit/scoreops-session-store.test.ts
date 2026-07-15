import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ScoreOpsSessionError,
  clearScoreOpsSessions,
  createScoreOpsSession,
  getScoreOpsSession,
  updateScoreOpsSession,
} from '../lib/music-services/scoreops-session-store';

const ENV_KEYS = [
  'MUSIC_SCOREOPS_SESSION_TTL_MS',
  'MUSIC_SCOREOPS_SESSION_MAX',
  'MUSIC_SCOREOPS_SESSION_CLEANUP_INTERVAL_MS',
  'MUSIC_SCOREOPS_MAX_CONTENT_BYTES',
] as const;

const create = (content: string) =>
  createScoreOpsSession({ content, artifactId: null, revision: 0, metadata: null });

describe('scoreops session store — memory bounds (M2)', () => {
  beforeEach(() => {
    clearScoreOpsSessions();
    for (const key of ENV_KEYS) {
      delete process.env[key];
    }
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-15T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    clearScoreOpsSessions();
    for (const key of ENV_KEYS) {
      delete process.env[key];
    }
  });

  describe('content size cap', () => {
    it('rejects create when content exceeds the byte cap', () => {
      process.env.MUSIC_SCOREOPS_MAX_CONTENT_BYTES = '16';
      try {
        create('x'.repeat(17));
        throw new Error('expected create to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(ScoreOpsSessionError);
        expect((error as ScoreOpsSessionError).code).toBe('content_too_large');
        expect((error as ScoreOpsSessionError).status).toBe(413);
      }
    });

    it('rejects update when content exceeds the byte cap (existing session unchanged)', () => {
      process.env.MUSIC_SCOREOPS_MAX_CONTENT_BYTES = '16';
      const session = create('small');
      expect(() =>
        updateScoreOpsSession(session.scoreSessionId, {
          content: 'y'.repeat(17),
          artifactId: null,
        }),
      ).toThrow(ScoreOpsSessionError);
      // The original content survives the rejected update.
      expect(getScoreOpsSession(session.scoreSessionId)?.content).toBe('small');
    });

    it('allows content at or below the cap', () => {
      process.env.MUSIC_SCOREOPS_MAX_CONTENT_BYTES = '16';
      const session = create('x'.repeat(16));
      expect(getScoreOpsSession(session.scoreSessionId)).not.toBeNull();
    });

    it('cap can be disabled with 0', () => {
      process.env.MUSIC_SCOREOPS_MAX_CONTENT_BYTES = '0';
      expect(() => create('x'.repeat(10_000))).not.toThrow();
    });
  });

  describe('max-session cap with LRU eviction', () => {
    it('never grows past the configured max', () => {
      process.env.MUSIC_SCOREOPS_SESSION_MAX = '3';
      const ids = Array.from({ length: 5 }, (_, i) => create(`content-${i}`).scoreSessionId);
      // First two (oldest, untouched) should have been evicted.
      expect(getScoreOpsSession(ids[0])).toBeNull();
      expect(getScoreOpsSession(ids[1])).toBeNull();
      expect(getScoreOpsSession(ids[2])).not.toBeNull();
      expect(getScoreOpsSession(ids[4])).not.toBeNull();
    });

    it('evicts least-recently-USED, not least-recently-created', () => {
      process.env.MUSIC_SCOREOPS_SESSION_MAX = '3';
      const a = create('a').scoreSessionId;
      const b = create('b').scoreSessionId;
      const c = create('c').scoreSessionId;
      // Touch the oldest (a) so it becomes most-recently-used.
      expect(getScoreOpsSession(a)).not.toBeNull();
      // Adding a 4th should now evict b (the true LRU), not a.
      const d = create('d').scoreSessionId;
      expect(getScoreOpsSession(a)).not.toBeNull();
      expect(getScoreOpsSession(b)).toBeNull();
      expect(getScoreOpsSession(c)).not.toBeNull();
      expect(getScoreOpsSession(d)).not.toBeNull();
    });
  });

  describe('idle TTL eviction', () => {
    it('lazily expires an idle session on read', () => {
      process.env.MUSIC_SCOREOPS_SESSION_TTL_MS = '1000';
      const id = create('a').scoreSessionId;
      vi.advanceTimersByTime(2000);
      expect(getScoreOpsSession(id)).toBeNull();
    });

    it('reading resets the idle clock', () => {
      process.env.MUSIC_SCOREOPS_SESSION_TTL_MS = '1000';
      const id = create('a').scoreSessionId;
      vi.advanceTimersByTime(800);
      expect(getScoreOpsSession(id)).not.toBeNull(); // touch → resets TTL
      vi.advanceTimersByTime(800); // 1600 since create, but only 800 since last access
      expect(getScoreOpsSession(id)).not.toBeNull();
    });

    it('sweeps expired sessions on write once the cleanup interval elapses', () => {
      process.env.MUSIC_SCOREOPS_SESSION_TTL_MS = '1000';
      process.env.MUSIC_SCOREOPS_SESSION_CLEANUP_INTERVAL_MS = '1000';
      const stale = create('stale').scoreSessionId;
      vi.advanceTimersByTime(1500); // past TTL and past cleanup interval
      create('fresh'); // triggers the throttled sweep
      // The stale entry is gone even without anyone reading it.
      expect(getScoreOpsSession(stale)).toBeNull();
    });

    it('TTL can be disabled with 0', () => {
      process.env.MUSIC_SCOREOPS_SESSION_TTL_MS = '0';
      const id = create('a').scoreSessionId;
      vi.advanceTimersByTime(10 * 24 * 60 * 60 * 1000);
      expect(getScoreOpsSession(id)).not.toBeNull();
    });
  });
});
