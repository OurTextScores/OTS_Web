import { expect, test } from '@playwright/test';
import type { BrowserScoreWindow } from './browser-score-types';

test('native timeline expands pickup, repeats, endings, and tempo changes', async ({ page }) => {
  await page.goto('/?score=/test_scores/playback_timeline.musicxml');
  await page.waitForSelector('svg .Note', { timeout: 60_000 });
  await page.waitForFunction(
    () => Boolean((window as BrowserScoreWindow).__webmscore?.playbackTimeline),
    undefined,
    { timeout: 20_000 },
  );

  const timeline = await page.evaluate(async () => {
    const score = (window as BrowserScoreWindow).__webmscore;
    if (!score?.playbackTimeline) {
      throw new Error('window.__webmscore.playbackTimeline is not available');
    }
    return score.playbackTimeline();
  });

  expect(timeline).not.toBeNull();
  expect(timeline?.schemaVersion).toBe(1);
  expect(timeline?.durationMs).toBe(17_000);
  expect(timeline?.renderDurationMs).toBe(20_000);
  expect(timeline?.occurrences.map((occurrence) => occurrence.measureIndex)).toEqual([
    0, // one-beat pickup; not repeated
    1, 2, // first pass and first ending
    1, 3, // repeated body and second ending
    4,
  ]);
  expect(timeline?.occurrences.map(({ startMs, endMs }) => [startMs, endMs])).toEqual([
    [0, 1_000],
    [1_000, 5_000],
    [5_000, 9_000],
    [9_000, 13_000],
    [13_000, 15_000], // tempo changes from quarter=60 to quarter=120
    [15_000, 17_000],
  ]);
});
