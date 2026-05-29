import { describe, expect, it } from 'vitest';
import { appendMusicXmlMeasures, appendMusicXmlParts } from '../lib/musicxml-append-parts';

const BASE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  <part-list>
    <score-part id="P1">
      <part-name>Lead</part-name>
      <score-instrument id="P1-I1"><instrument-name>Piano</instrument-name></score-instrument>
      <midi-instrument id="P1-I1"><midi-channel>1</midi-channel></midi-instrument>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <note>
        <pitch><step>C</step><octave>4</octave></pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
    </measure>
  </part>
</score-partwise>`;

const SOURCE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  <part-list>
    <score-part id="P1">
      <part-name>Accompaniment</part-name>
      <score-instrument id="P1-I1"><instrument-name>Bass</instrument-name></score-instrument>
      <midi-instrument id="P1-I1"><midi-channel>2</midi-channel></midi-instrument>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <note>
        <instrument id="P1-I1" />
        <pitch><step>G</step><octave>2</octave></pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
    </measure>
  </part>
</score-partwise>`;

describe('appendMusicXmlParts', () => {
  it('appends generated parts and remaps colliding part/instrument ids', () => {
    const result = appendMusicXmlParts(BASE_XML, SOURCE_XML);

    expect(result.appendedPartCount).toBe(1);
    expect(result.partIdMap).toEqual({ P1: 'P2' });
    expect(result.xml).toContain('<score-part id="P2">');
    expect(result.xml).toContain('<part id="P2">');
    expect(result.xml).toContain('id="P2-I1"');
    expect(result.xml).toContain('<instrument id="P2-I1"/>');
  });

  it('creates a target part-list when missing', () => {
    const noPartListTarget = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  <part id="P1">
    <measure number="1" />
  </part>
</score-partwise>`;

    const result = appendMusicXmlParts(noPartListTarget, SOURCE_XML);
    expect(result.warnings.some((warning) => warning.includes('created one'))).toBe(true);
    expect(result.xml).toContain('<part-list>');
    expect(result.xml).toContain('<score-part id="P2">');
  });

  it('throws when source has no parts', () => {
    const noParts = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  <part-list />
</score-partwise>`;

    expect(() => appendMusicXmlParts(BASE_XML, noParts)).toThrow(/does not contain any <part>/i);
  });
});

describe('appendMusicXmlMeasures', () => {
  it('appends generated measures to existing parts instead of creating new parts', () => {
    const result = appendMusicXmlMeasures(BASE_XML, SOURCE_XML);

    expect(result.appendedMeasureCount).toBe(1);
    expect(result.targetPartIds).toEqual(['P1']);
    expect(result.xml).not.toContain('<score-part id="P2">');
    expect(result.xml).not.toContain('<part id="P2">');
    expect(result.xml).toContain('<measure number="2">');
    expect(result.xml).toContain('<print new-page="yes"/>');
    expect(result.xml).toContain('<step>G</step>');
  });

  it('maps generated parts onto target parts by index and ignores extras', () => {
    const sourceTwoParts = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  <part-list>
    <score-part id="P1"><part-name>First</part-name></score-part>
    <score-part id="P2"><part-name>Second</part-name></score-part>
  </part-list>
  <part id="P1"><measure number="1"><note><rest/><duration>1</duration></note></measure></part>
  <part id="P2"><measure number="1"><note><rest/><duration>1</duration></note></measure></part>
</score-partwise>`;

    const result = appendMusicXmlMeasures(BASE_XML, sourceTwoParts);

    expect(result.appendedMeasureCount).toBe(1);
    expect(result.warnings.join('\n')).toMatch(/extra generated parts were ignored/i);
    expect(result.xml).not.toContain('<part id="P2">');
  });
});
