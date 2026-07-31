import { test, expect } from '@playwright/test';

/**
 * Embed Mode Tests
 *
 * Tests the external XML comparison embed mode functionality that allows
 * loading two XML files via URL parameters and displaying only the compare view.
 *
 * Tests use local sample files from public/sample-left.xml and public/sample-right.xml
 */

test.describe('Embed Mode - External XML Comparison', () => {
    // Use local sample files served from public directory
    const baseUrl = 'http://localhost:3000';
    const leftXmlUrl = `${baseUrl}/sample-left.xml`;
    const rightXmlUrl = `${baseUrl}/sample-right.xml`;

    // For mocked external URL tests
    const testXmlLeft = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>Music</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>0</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>
      <note>
        <pitch><step>C</step><octave>4</octave></pitch>
        <duration>4</duration>
        <type>whole</type>
      </note>
    </measure>
  </part>
</score-partwise>`;

    const testXmlRight = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>Music</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>0</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>
      <note>
        <pitch><step>D</step><octave>4</octave></pitch>
        <duration>4</duration>
        <type>whole</type>
      </note>
    </measure>
  </part>
</score-partwise>`;

    test('should detect embed mode when compareLeft and compareRight params are present', async ({ page }) => {
        // Navigate with embed mode parameters using local files
        await page.goto(`/?compareLeft=${encodeURIComponent(leftXmlUrl)}&compareRight=${encodeURIComponent(rightXmlUrl)}`);

        // Wait for loading to complete
        await page.waitForTimeout(3000);

        // Verify compare modal is visible
        await expect(page.getByTestId('checkpoint-compare-modal')).toBeVisible();
    });

    test('should hide toolbar in embed mode', async ({ page }) => {
        await page.goto(`/?compareLeft=${encodeURIComponent(leftXmlUrl)}&compareRight=${encodeURIComponent(rightXmlUrl)}`);
        await page.waitForTimeout(3000);

        // Toolbar should not be visible in embed mode
        const toolbar = page.locator('div').filter({ has: page.getByText('New Score') });
        await expect(toolbar).not.toBeVisible();
    });

    test('should hide checkpoint sidebar in embed mode', async ({ page }) => {
        await page.goto(`/?compareLeft=${encodeURIComponent(leftXmlUrl)}&compareRight=${encodeURIComponent(rightXmlUrl)}`);
        await page.waitForTimeout(3000);

        // Checkpoint sidebar should not be visible
        await expect(page.getByTestId('checkpoint-sidebar')).not.toBeVisible();
    });

    test('should hide save checkpoint buttons in embed mode', async ({ page }) => {
        await page.goto(`/?compareLeft=${encodeURIComponent(leftXmlUrl)}&compareRight=${encodeURIComponent(rightXmlUrl)}`);
        await page.waitForTimeout(3000);

        // Save checkpoint buttons should not be visible
        const saveButtons = page.getByText('💾 Save checkpoint');
        await expect(saveButtons.first()).not.toBeVisible();
    });

    test('should hide overwrite arrows in embed mode', async ({ page }) => {
        await page.goto(`/?compareLeft=${encodeURIComponent(leftXmlUrl)}&compareRight=${encodeURIComponent(rightXmlUrl)}`);
        await page.waitForTimeout(5000);

        // Overwrite arrow buttons should not be visible in embed mode
        const overwriteButtons = page.getByRole('button', { name: /Overwrite/ });
        await expect(overwriteButtons.first()).not.toBeVisible();
    });

    test('should use custom labels from URL parameters', async ({ page }) => {
        await page.goto(`/?compareLeft=${encodeURIComponent(leftXmlUrl)}&compareRight=${encodeURIComponent(rightXmlUrl)}&leftLabel=Version%201&rightLabel=Version%202`);
        await page.waitForTimeout(3000);

        // Custom labels should be visible in the compare view
        await expect(page.getByText('Version 1')).toBeVisible();
        await expect(page.getByText('Version 2')).toBeVisible();
    });

    test('should use default labels when not specified', async ({ page }) => {
        await page.goto(`/?compareLeft=${encodeURIComponent(leftXmlUrl)}&compareRight=${encodeURIComponent(rightXmlUrl)}`);
        await page.waitForTimeout(3000);

        // Default labels should be visible
        await expect(page.getByText('Left')).toBeVisible();
        await expect(page.getByText('Right')).toBeVisible();
    });

    test('should show loading state while fetching external files', async ({ page }) => {
        // Intercept local file requests to add delay
        await page.route(leftXmlUrl, async route => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await route.continue();
        });

        await page.route(rightXmlUrl, async route => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await route.continue();
        });

        await page.goto(`/?compareLeft=${encodeURIComponent(leftXmlUrl)}&compareRight=${encodeURIComponent(rightXmlUrl)}`);

        // Loading indicator should be visible initially
        await expect(page.getByText('Loading comparison...')).toBeVisible({ timeout: 1000 });

        // Wait for loading to complete
        await page.waitForTimeout(3000);

        // Loading should be gone
        await expect(page.getByText('Loading comparison...')).not.toBeVisible();
    });

    test('should handle fetch errors gracefully', async ({ page }) => {
        // Mock a failed request
        await page.route('https://example.com/left.xml', async route => {
            await route.fulfill({ status: 404, body: 'Not Found' });
        });

        await page.route('https://example.com/right.xml', async route => {
            await route.fulfill({ status: 200, contentType: 'application/xml', body: testXmlRight });
        });

        // Listen for alert dialogs
        page.on('dialog', async dialog => {
            expect(dialog.message()).toContain('Failed to load files');
            await dialog.accept();
        });

        await page.goto('/?compareLeft=https://example.com/left.xml&compareRight=https://example.com/right.xml');
        await page.waitForTimeout(2000);
    });

    test('should allow swapping sides in embed mode', async ({ page }) => {
        await page.goto(`/?compareLeft=${encodeURIComponent(leftXmlUrl)}&compareRight=${encodeURIComponent(rightXmlUrl)}&leftLabel=Old&rightLabel=New`);
        await page.waitForTimeout(3000);

        // Initial state
        const leftPane = page.getByTestId('compare-pane-left');
        const rightPane = page.getByTestId('compare-pane-right');

        await expect(leftPane).toBeVisible();
        await expect(rightPane).toBeVisible();

        // Find and click swap button
        const swapButton = page.getByRole('button', { name: /Swap sides/i });
        await swapButton.click();

        await page.waitForTimeout(1000);

        // After swap, labels should be reversed
        // The "Old" label should now be on the right, "New" on the left
        // (This assumes the labels move with the content)
    });

    test('should not activate embed mode with only one URL parameter', async ({ page }) => {
        await page.goto(`/?compareLeft=${encodeURIComponent(leftXmlUrl)}`);
        await page.waitForTimeout(1000);

        // Toolbar should be visible (not embed mode)
        const toolbar = page.locator('div').filter({ has: page.getByText('New Score') });
        await expect(toolbar).toBeVisible();

        // Compare modal should not be visible
        const compareModal = page.getByTestId('checkpoint-compare-modal');
        await expect(compareModal).not.toBeVisible();
    });

    test('should display compare panes with loaded scores', async ({ page }) => {
        await page.goto(`/?compareLeft=${encodeURIComponent(leftXmlUrl)}&compareRight=${encodeURIComponent(rightXmlUrl)}`);
        await page.waitForTimeout(5000);

        // Both panes should be visible
        const leftPane = page.getByTestId('compare-pane-left');
        const rightPane = page.getByTestId('compare-pane-right');

        await expect(leftPane).toBeVisible();
        await expect(rightPane).toBeVisible();

        // Panes should contain SVG elements (rendered scores)
        await expect(leftPane.locator('svg').first()).toBeVisible({ timeout: 10000 });
        await expect(rightPane.locator('svg').first()).toBeVisible({ timeout: 10000 });
    });

    test('should show "Open in Editor" buttons in embed mode', async ({ page }) => {
        await page.goto(`/?compareLeft=${encodeURIComponent(leftXmlUrl)}&compareRight=${encodeURIComponent(rightXmlUrl)}&leftLabel=Left&rightLabel=Right`);
        await page.waitForTimeout(3000);

        // Open in Editor buttons should be visible
        const openInEditorButtons = page.getByRole('button', { name: /Open in Editor/ });
        await expect(openInEditorButtons.first()).toBeVisible();
        await expect(openInEditorButtons.nth(1)).toBeVisible();
    });

    test('should edit either compare pane and route shortcuts to the active score', async ({ page }) => {
        await page.goto(`/?compareLeft=${encodeURIComponent('/sample-left.xml')}&compareRight=${encodeURIComponent('/sample-right.xml')}&leftLabel=Left&rightLabel=Right`);
        await expect(page.getByTestId('compare-pane-left').locator('svg').first()).toBeVisible({ timeout: 30000 });
        await expect(page.getByTestId('compare-pane-right').locator('svg').first()).toBeVisible({ timeout: 30000 });

        await page.getByTestId('btn-compare-activate-left').click();
        await expect(page.getByTestId('btn-compare-activate-left')).toHaveAttribute('aria-pressed', 'true');
        const leftNote = page.getByTestId('compare-pane-left').locator('svg .Note').first();
        let leftNoteBox: Awaited<ReturnType<typeof leftNote.boundingBox>> = null;
        await expect.poll(async () => {
            leftNoteBox = await leftNote.boundingBox();
            return leftNoteBox?.width ?? 0;
        }, {
            timeout: 30000,
        }).toBeGreaterThan(0);
        const renderedLeftNoteBox = leftNoteBox as {
            x: number;
            y: number;
            width: number;
            height: number;
        } | null;
        expect(renderedLeftNoteBox).not.toBeNull();
        if (!renderedLeftNoteBox) {
            throw new Error('Expected the left compare score to render a clickable note.');
        }
        await page.mouse.click(
            renderedLeftNoteBox.x + (renderedLeftNoteBox.width / 2),
            renderedLeftNoteBox.y + (renderedLeftNoteBox.height / 2),
        );
        await expect(page.getByTestId('compare-selection-overlay-left').first()).toBeVisible();
        await expect(page.getByTestId('compare-selection-overlay-right')).toHaveCount(0);
        const selectedNoteCount = () => page.getByTestId('compare-pane-left').locator('svg .Note').evaluateAll(
            (notes) => notes.filter((note) => getComputedStyle(note).fill === 'rgb(0, 101, 191)').length,
        );
        await expect.poll(selectedNoteCount).toBe(1);

        const zoomValue = page.getByTestId('compare-zoom-value-left');
        const wrapper = page.getByTestId('compare-score-wrapper-left');
        const initialZoom = Number.parseInt((await zoomValue.textContent()) ?? '', 10);
        const initialWrapperWidth = (await wrapper.boundingBox())?.width ?? 0;
        await page.getByTestId('btn-compare-zoom-in-left').click();
        await expect(zoomValue).toHaveText(`${initialZoom + 10}%`);
        await expect.poll(async () => (await wrapper.boundingBox())?.width ?? 0).toBeGreaterThan(initialWrapperWidth);
        // Auto-fit remains active for container resizes, but must not overwrite a
        // zoom chosen by the user or rerender away the engine's selected-note color.
        await page.waitForTimeout(750);
        await expect(zoomValue).toHaveText(`${initialZoom + 10}%`);
        await expect.poll(selectedNoteCount).toBe(1);
        await page.getByTestId('btn-compare-add-bar-left').click();

        await page.evaluate(() => {
            window.open = () => null;
        });
        await page.getByRole('button', { name: /Open in Editor/ }).first().click();
        await expect.poll(async () => page.evaluate(
            () => JSON.parse(sessionStorage.getItem('openInEditor') || '{}').xml || '',
        )).toContain('measure number="2"');

        await page.getByTestId('btn-compare-activate-right').click();
        await page.keyboard.press('n');
        await expect(page.getByTestId('btn-compare-note-input-right')).toHaveAttribute('aria-pressed', 'true');
        await expect(page.getByTestId('btn-compare-note-input-left')).toHaveAttribute('aria-pressed', 'false');
        // Note-input pitch entry must not depend on a prior click-selection.
        await page.keyboard.press('c');
        await page.getByRole('button', { name: /Open in Editor/ }).nth(1).click();
        await expect.poll(async () => page.evaluate(() => {
            const xml = JSON.parse(sessionStorage.getItem('openInEditor') || '{}').xml || '';
            return (xml.match(/<note(?:\s|>)/g) || []).length;
        })).toBeGreaterThan(1);

        await page.getByTestId('btn-compare-palettes-right').click();
        await expect(page.getByTestId('floating-palettes')).toBeVisible();
    });

    test('shows and toggles the engine note-input cursor in both compare panes', async ({ page }) => {
        await page.goto(`/?compareLeft=${encodeURIComponent('/sample-left.xml')}&compareRight=${encodeURIComponent('/sample-right.xml')}&leftLabel=Left&rightLabel=Right`);
        await expect(page.getByTestId('compare-pane-left').locator('svg').first()).toBeVisible({ timeout: 30000 });
        await expect(page.getByTestId('compare-pane-right').locator('svg').first()).toBeVisible({ timeout: 30000 });

        const leftButton = page.getByTestId('btn-compare-note-input-left');
        const rightButton = page.getByTestId('btn-compare-note-input-right');
        await expect(leftButton).toBeEnabled();
        await expect(rightButton).toBeEnabled();

        await leftButton.click();
        await expect(leftButton).toHaveAttribute('aria-pressed', 'true');
        await expect(leftButton).toHaveText('Stop input');
        await expect(page.getByTestId('compare-note-input-cursor-left')).toBeVisible();
        await expect(page.getByTestId('compare-note-input-cursor-right')).toHaveCount(0);

        await rightButton.click();
        await expect(rightButton).toHaveAttribute('aria-pressed', 'true');
        await expect(rightButton).toHaveText('Stop input');
        await expect(page.getByTestId('compare-note-input-cursor-left')).toBeVisible();
        await expect(page.getByTestId('compare-note-input-cursor-right')).toBeVisible();

        await leftButton.click();
        await expect(leftButton).toHaveAttribute('aria-pressed', 'false');
        await expect(leftButton).toHaveText('Note input');
        await expect(page.getByTestId('compare-note-input-cursor-left')).toHaveCount(0);
        await expect(page.getByTestId('compare-note-input-cursor-right')).toBeVisible();

        await rightButton.click();
        await expect(rightButton).toHaveAttribute('aria-pressed', 'false');
        await expect(rightButton).toHaveText('Note input');
        await expect(page.getByTestId('compare-note-input-cursor-right')).toHaveCount(0);
    });

    test('queues burst note input without re-editing the first note', async ({ page }) => {
        await page.goto(`/?compareLeft=${encodeURIComponent('/sample-left.xml')}&compareRight=${encodeURIComponent('/sample-right.xml')}&leftLabel=Left&rightLabel=Right`);
        await expect(page.getByTestId('compare-pane-left').locator('svg').first()).toBeVisible({ timeout: 30000 });

        await page.getByTestId('btn-compare-activate-left').click();
        const firstNote = page.getByTestId('compare-pane-left').locator('svg .Note').first();
        let firstNoteBox: Awaited<ReturnType<typeof firstNote.boundingBox>> = null;
        await expect.poll(async () => {
            firstNoteBox = await firstNote.boundingBox();
            return firstNoteBox?.width ?? 0;
        }, { timeout: 30000 }).toBeGreaterThan(0);
        const renderedFirstNoteBox = firstNoteBox as {
            x: number;
            y: number;
            width: number;
            height: number;
        } | null;
        expect(renderedFirstNoteBox).not.toBeNull();
        if (!renderedFirstNoteBox) {
            throw new Error('Expected the left compare score to render a clickable note.');
        }
        await page.mouse.click(
            renderedFirstNoteBox.x + (renderedFirstNoteBox.width / 2),
            renderedFirstNoteBox.y + (renderedFirstNoteBox.height / 2),
        );
        await expect(page.getByTestId('compare-selection-overlay-left').first()).toBeVisible();

        await page.getByTestId('btn-compare-note-input-left').click();
        await expect(page.getByTestId('btn-compare-note-input-left')).toHaveAttribute('aria-pressed', 'true');
        const cursor = page.getByTestId('compare-note-input-cursor-left');
        await expect(cursor).toBeVisible();
        const initialCursorBox = await cursor.boundingBox();
        if (!initialCursorBox) {
            throw new Error('Expected the left compare input cursor to be measurable.');
        }

        // sample-left.xml starts C D E F G A. These keys intentionally arrive as a
        // burst; compare persistence must serialize them rather than dropping F/G.
        const addBarButton = page.getByTestId('btn-compare-add-bar-left');
        await page.keyboard.type('efg');
        await expect(addBarButton).toBeDisabled({ timeout: 15000 });
        await expect(addBarButton).toBeEnabled({ timeout: 30000 });
        await expect.poll(async () => (await cursor.boundingBox())?.x ?? 0, {
            timeout: 30000,
        }).toBeGreaterThan(initialCursorBox.x);

        await page.evaluate(() => {
            window.open = () => null;
        });
        await page.getByRole('button', { name: /Open in Editor/ }).first().click();
        const pitches = await page.evaluate(() => {
            const xml = JSON.parse(sessionStorage.getItem('openInEditor') || '{}').xml || '';
            return [...xml.matchAll(/<step>([A-G])<\/step>/g)].map((m) => m[1]);
        });

        // Each press must land on the next note (C D E F -> E F G F), not repeatedly
        // re-edit the first one (which would instead read G D E F or similar).
        expect(pitches.slice(0, 4)).toEqual(['E', 'F', 'G', 'F']);
    });

    test('follows engine note-input order on a second staff', async ({ page }) => {
        await page.goto(`/?compareLeft=${encodeURIComponent('/test_scores/two_staves_four_bars.musicxml')}&compareRight=${encodeURIComponent('/sample-right.xml')}&leftLabel=Left&rightLabel=Right`);
        const leftPane = page.getByTestId('compare-pane-left');
        const firstCelloNote = leftPane.locator('svg .Note').nth(4);
        await expect(firstCelloNote).toBeVisible({ timeout: 30000 });

        await page.getByTestId('btn-compare-activate-left').click();
        let noteBox: Awaited<ReturnType<typeof firstCelloNote.boundingBox>> = null;
        await expect.poll(async () => {
            noteBox = await firstCelloNote.boundingBox();
            return noteBox?.width ?? 0;
        }, { timeout: 30000 }).toBeGreaterThan(0);
        const renderedNoteBox = noteBox as {
            x: number;
            y: number;
            width: number;
            height: number;
        } | null;
        if (!renderedNoteBox) {
            throw new Error('Expected the first note on the second staff to be clickable.');
        }
        await page.mouse.click(
            renderedNoteBox.x + renderedNoteBox.width / 2,
            renderedNoteBox.y + renderedNoteBox.height / 2,
        );
        await expect(page.getByTestId('compare-selection-overlay-left').first()).toBeVisible();

        await page.getByTestId('btn-compare-note-input-left').click();
        await expect(page.getByTestId('btn-compare-note-input-left')).toHaveAttribute('aria-pressed', 'true');
        await page.keyboard.type('def');

        const addBarButton = page.getByTestId('btn-compare-add-bar-left');
        await expect(addBarButton).toBeDisabled({ timeout: 15000 });
        await expect(addBarButton).toBeEnabled({ timeout: 30000 });

        await page.evaluate(() => {
            window.open = () => null;
        });
        await page.getByRole('button', { name: /Open in Editor/ }).first().click();
        const parts = await page.evaluate(() => {
            const xml = JSON.parse(sessionStorage.getItem('openInEditor') || '{}').xml || '';
            const documentXml = new DOMParser().parseFromString(xml, 'application/xml');
            return Array.from(documentXml.querySelectorAll('part')).map(part => (
                Array.from(part.querySelectorAll(':scope > measure')).map(measure => (
                    Array.from(measure.querySelectorAll(':scope > note > pitch > step'))
                        .map(step => step.textContent ?? '')
                ))
            ));
        });

        expect(parts[0]?.slice(0, 4)).toEqual([['F'], ['A'], ['C'], ['E']]);
        expect(parts[1]?.slice(0, 4)).toEqual([['D'], ['E'], ['F'], ['E']]);
    });

    test('should keep compare labels and score contents on the same side', async ({ page }) => {
        await page.goto(`/?compareLeft=${encodeURIComponent(leftXmlUrl)}&compareRight=${encodeURIComponent(rightXmlUrl)}&leftLabel=Left&rightLabel=Right`);
        await page.waitForTimeout(3000);
        await page.evaluate(() => {
            window.open = () => null;
        });

        const openInEditorButtons = page.getByRole('button', { name: /Open in Editor/ });
        await openInEditorButtons.first().click();
        const leftStored = await page.evaluate(() => JSON.parse(sessionStorage.getItem('openInEditor') || '{}'));
        expect(leftStored.filename).toBe('Left.xml');
        expect(leftStored.xml).toContain('<step>C</step>');

        await openInEditorButtons.nth(1).click();
        const rightStored = await page.evaluate(() => JSON.parse(sessionStorage.getItem('openInEditor') || '{}'));
        expect(rightStored.filename).toBe('Right.xml');
        expect(rightStored.xml).toContain('<step>D</step>');
    });

    test('should open left score in full editor in new tab when clicking "Open in Editor"', async ({ page, context }) => {
        await page.goto(`/?compareLeft=${encodeURIComponent(leftXmlUrl)}&compareRight=${encodeURIComponent(rightXmlUrl)}&leftLabel=Version%201&rightLabel=Version%202`);
        await page.waitForTimeout(3000);

        // Listen for new page (tab) to open
        const pagePromise = context.waitForEvent('page');

        // Click the "Open in Editor" button for the left pane
        const openInEditorButtons = page.getByRole('button', { name: /Open in Editor/ });
        await openInEditorButtons.first().click();

        // Wait for new tab to open
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        await newPage.waitForTimeout(3000);

        // Original page should still show compare view
        const compareModal = page.getByTestId('checkpoint-compare-modal');
        await expect(compareModal).toBeVisible();

        // New tab should show full editor
        const toolbar = newPage.locator('div').filter({ has: newPage.getByText('New Score') });
        await expect(toolbar).toBeVisible();

        // Sidebar should be visible in new tab
        await expect(newPage.getByTestId('checkpoint-sidebar')).toBeVisible();

        // Score should be loaded in new tab
        await expect(newPage.locator('svg').first()).toBeVisible({ timeout: 10000 });

        // Clean up
        await newPage.close();
    });

    test('should open right score in full editor in new tab when clicking "Open in Editor"', async ({ page, context }) => {
        await page.goto(`/?compareLeft=${encodeURIComponent(leftXmlUrl)}&compareRight=${encodeURIComponent(rightXmlUrl)}&leftLabel=Version%201&rightLabel=Version%202`);
        await page.waitForTimeout(3000);

        // Listen for new page (tab) to open
        const pagePromise = context.waitForEvent('page');

        // Click the "Open in Editor" button for the right pane
        const openInEditorButtons = page.getByRole('button', { name: /Open in Editor/ });
        await openInEditorButtons.nth(1).click();

        // Wait for new tab to open
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        await newPage.waitForTimeout(3000);

        // Original page should still show compare view
        const compareModal = page.getByTestId('checkpoint-compare-modal');
        await expect(compareModal).toBeVisible();

        // New tab should show full editor
        const toolbar = newPage.locator('div').filter({ has: newPage.getByText('New Score') });
        await expect(toolbar).toBeVisible();

        // Sidebar should be visible in new tab
        await expect(newPage.getByTestId('checkpoint-sidebar')).toBeVisible();

        // Score should be loaded in new tab
        await expect(newPage.locator('svg').first()).toBeVisible({ timeout: 10000 });

        // Clean up
        await newPage.close();
    });
});
