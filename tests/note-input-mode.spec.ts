import { expect, test, type Page } from 'playwright/test';

// Large viewport so staff geometry is comfortably clickable at fit-zoom.
test.use({ viewport: { width: 2400, height: 1600 } });

const countPitches = async (page: Page): Promise<number> => {
  return page.evaluate(async () => {
    const scoreWindow = window as unknown as { __webmscore?: { saveXml?: () => Promise<string> } };
    const score = scoreWindow.__webmscore;
    if (!score?.saveXml) {
      throw new Error('window.__webmscore.saveXml is not available');
    }
    const xml: string = await score.saveXml();
    return (xml.match(/<pitch>/g) ?? []).length;
  });
};

type ExportedNote = { step: string | null; alter: number; octave: number | null; type: string | null };

const readPitchedNotes = async (page: Page): Promise<ExportedNote[]> => {
  return page.evaluate(async () => {
    const scoreWindow = window as unknown as { __webmscore?: { saveXml?: () => Promise<string> } };
    const xml = await scoreWindow.__webmscore?.saveXml?.();
    if (!xml) {
      throw new Error('window.__webmscore.saveXml is not available');
    }
    const documentXml = new DOMParser().parseFromString(xml, 'application/xml');
    return Array.from(documentXml.querySelectorAll('note')).flatMap(note => {
      const pitch = note.querySelector('pitch');
      if (!pitch) {
        return [];
      }
      const octaveValue = Number(pitch.querySelector('octave')?.textContent ?? Number.NaN);
      return [{
        step: pitch.querySelector('step')?.textContent ?? null,
        alter: Number(pitch.querySelector('alter')?.textContent ?? 0),
        octave: Number.isFinite(octaveValue) ? octaveValue : null,
        type: note.querySelector('type')?.textContent ?? null,
      }];
    });
  });
};

const putOneSpatiumAboveFirstNote = async (page: Page): Promise<boolean> => {
  return page.evaluate(async () => {
    const scoreWindow = window as unknown as {
      __webmscore?: {
        getSpatium?: () => Promise<number>;
        putNote?: (pageNumber: number, x: number, y: number) => Promise<boolean>;
      };
    };
    const score = scoreWindow.__webmscore;
    const container = document.querySelector<HTMLElement>('[data-testid="svg-container"]');
    const wrapper = document.querySelector<HTMLElement>('[data-testid="score-wrapper"]');
    const note = document.querySelector<SVGGraphicsElement>('svg .Note');
    if (!score?.getSpatium || !score.putNote || !container || !wrapper || !note) {
      throw new Error('Could not resolve score API or note geometry');
    }
    const scale = new DOMMatrix(getComputedStyle(wrapper).transform).a || 1;
    const containerRect = container.getBoundingClientRect();
    const noteRect = note.getBoundingClientRect();
    const spatium = await score.getSpatium();
    const x = (noteRect.left + noteRect.width / 2 - containerRect.left) / scale;
    const y = (noteRect.top + noteRect.height / 2 - containerRect.top) / scale - spatium;
    return score.putNote(0, x, y);
  });
};

test('note input mode places a note on click and exits with Escape', async ({ page }) => {
  await page.goto('/?score=/test_scores/single_note_c4.musicxml');
  await page.waitForSelector('svg .Note', { timeout: 60_000 });

  await expect.poll(async () => await countPitches(page), { timeout: 20_000 }).toBe(1);

  // Click the note first so the editor is fully interaction-ready.
  await page.locator('svg .Note').first().click();
  await page.getByTestId('selection-overlay').waitFor({ timeout: 10_000 });

  const noteBox = await page.locator('svg .Note').first().boundingBox();
  if (!noteBox) {
    throw new Error('Could not measure note geometry');
  }
  // Same beat, one staff space above C4: places an E4 into the chord.
  // (The notehead is one staff space tall.)
  const placeX = noteBox.x + noteBox.width / 2;
  const placeY = noteBox.y + noteBox.height / 2 - noteBox.height;

  // Enter note input mode via the keyboard shortcut.
  await page.keyboard.press('n');
  await expect(page.getByTestId('btn-note-input')).toHaveAttribute('aria-pressed', 'true');

  // Quarter-note input duration, then click to place a second pitch.
  await page.keyboard.press('5');
  await page.mouse.move(placeX, placeY);
  await expect(page.getByTestId('note-input-shadow')).toBeVisible();
  await page.mouse.click(placeX, placeY);

  await expect.poll(async () => await countPitches(page), { timeout: 20_000 }).toBe(2);
  await expect.poll(async () => {
    const notes = await readPitchedNotes(page);
    return notes.some(note => note.step === 'E' && note.octave === 4 && note.type === 'quarter');
  }, { timeout: 20_000 }).toBe(true);

  // Escape leaves input mode; a subsequent click selects instead of placing.
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('btn-note-input')).toHaveAttribute('aria-pressed', 'false');

  await page.mouse.click(placeX, placeY);
  await page.waitForTimeout(1_000);
  await expect.poll(async () => await countPitches(page), { timeout: 10_000 }).toBe(2);
});

test('toolbar button toggles note input mode', async ({ page }) => {
  await page.goto('/?score=/test_scores/single_note_c4.musicxml');
  await page.waitForSelector('svg .Note', { timeout: 60_000 });
  await page.locator('svg .Note').first().click();
  await page.getByTestId('selection-overlay').waitFor({ timeout: 10_000 });

  const button = page.getByTestId('btn-note-input');
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'false');
});

test('entering input mode from a rest places a note, not another rest', async ({ page }) => {
  await page.goto('/?score=/test_scores/single_note_c4.musicxml');
  await page.waitForSelector('svg .Rest', { timeout: 60_000 });

  const rest = page.locator('svg .Rest').first();
  await rest.click();
  await page.getByTestId('selection-overlay').waitFor({ timeout: 10_000 });
  const before = await countPitches(page);
  await page.keyboard.press('n');
  await expect(page.getByTestId('btn-note-input')).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('5');
  expect(await putOneSpatiumAboveFirstNote(page)).toBe(true);

  await expect.poll(async () => await countPitches(page), { timeout: 20_000 }).toBe(before + 1);
});

test('toolbar duration and accidental configure the next note without editing the selection', async ({ page }) => {
  await page.goto('/?score=/test_scores/single_note_c4.musicxml');
  await page.waitForSelector('svg .Note', { timeout: 60_000 });
  const note = page.locator('svg .Note').first();
  await note.click();
  await page.getByTestId('selection-overlay').waitFor({ timeout: 10_000 });
  await page.keyboard.press('n');
  await page.getByTestId('dropdown-rhythm').click();
  await page.getByTestId('btn-duration-2').click();
  await page.getByTestId('dropdown-accidental').click();
  await page.getByTestId('btn-acc-3').click();

  // Input controls must not mutate the selected C4 before a placement click.
  await expect.poll(async () => await readPitchedNotes(page)).toEqual([
    { step: 'C', alter: 0, octave: 4, type: 'quarter' },
  ]);

  expect(await putOneSpatiumAboveFirstNote(page)).toBe(true);
  await expect.poll(async () => {
    const notes = await readPitchedNotes(page);
    return notes.some(placed => placed.alter === 1 && placed.type === 'half');
  }, { timeout: 20_000 }).toBe(true);
});

test('note input method selector exposes repitch, rhythm, and timewise modes', async ({ page }) => {
  await page.goto('/?score=/test_scores/single_note_c4.musicxml');
  await page.waitForSelector('svg .Note', { timeout: 60_000 });
  await page.locator('svg .Note').first().click();
  await page.getByTestId('selection-overlay').waitFor({ timeout: 10_000 });
  await page.keyboard.press('n');

  const method = page.getByTestId('dropdown-note-input-method');
  await method.click();
  await page.getByTestId('btn-note-input-method-2').click();
  await expect(method).toHaveText('Repitch');

  await method.click();
  await page.getByTestId('btn-note-input-method-3').click();
  await expect(method).toHaveText('Rhythm');

  await method.click();
  await page.getByTestId('btn-note-input-method-6').click();
  await expect(method).toHaveText('Timewise');
});
