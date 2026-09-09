import { describe, it, expect } from 'vitest';
import type { MusicalKey, NumberChord } from './types';
import {
  parseKey,
  formatKey,
  diatonicQuality,
  degreeToChordSymbol,
  renderProgression,
  transposeKey,
  transposeProgression,
  semitonesBetween,
  pitchClassIndex,
  spellPitch,
  numbersLine,
  progressionBarCount,
} from './music';
import { chordProgressions } from '@/data/progressions';

const D_MAJOR: MusicalKey = { tonic: 'D', mode: 'major' };
const BB_MAJOR: MusicalKey = { tonic: 'Bb', mode: 'major' };
const A_MINOR: MusicalKey = { tonic: 'A', mode: 'minor' };

// The canonical gospel progression: 1 → 5 → 6 → 4
const ONE_FIVE_SIX_FOUR: NumberChord[] = [
  { degree: 1 },
  { degree: 5 },
  { degree: 6 },
  { degree: 4 },
];

describe('parseKey', () => {
  it('parses a bare major tonic', () => {
    expect(parseKey('D')).toEqual({ tonic: 'D', mode: 'major' });
  });

  it('parses explicit minor', () => {
    expect(parseKey('E Minor')).toEqual({ tonic: 'E', mode: 'minor' });
  });

  it('parses shorthand minor (Am)', () => {
    expect(parseKey('Am')).toEqual({ tonic: 'A', mode: 'minor' });
  });

  it('keeps flat spelling for flat tonics', () => {
    expect(parseKey('Bb')).toEqual({ tonic: 'Bb', mode: 'major' });
    expect(parseKey('Bbm')).toEqual({ tonic: 'Bb', mode: 'minor' });
  });

  it('parses sharp tonics with explicit major', () => {
    expect(parseKey('F# Major')).toEqual({ tonic: 'F#', mode: 'major' });
  });

  it('is not fooled by "Major" containing no minor', () => {
    expect(parseKey('D Major').mode).toBe('major');
  });
});

describe('formatKey', () => {
  it('round-trips through parseKey', () => {
    expect(formatKey(parseKey('Eb Minor'))).toBe('Eb Minor');
    expect(formatKey({ tonic: 'D', mode: 'major' })).toBe('D Major');
  });
});

describe('pitch helpers', () => {
  it('maps enharmonics to the same index', () => {
    expect(pitchClassIndex('C#')).toBe(pitchClassIndex('Db'));
    expect(pitchClassIndex('E#')).toBe(pitchClassIndex('F'));
  });

  it('spells with flats or sharps as requested', () => {
    expect(spellPitch(1, true)).toBe('Db');
    expect(spellPitch(1, false)).toBe('C#');
    expect(spellPitch(14, true)).toBe('D'); // wraps via mod 12
  });
});

describe('diatonicQuality', () => {
  it('follows the major scale', () => {
    expect(diatonicQuality(1, 'major')).toBe('maj');
    expect(diatonicQuality(2, 'major')).toBe('min');
    expect(diatonicQuality(6, 'major')).toBe('min');
    expect(diatonicQuality(7, 'major')).toBe('dim');
  });

  it('follows the natural minor scale', () => {
    expect(diatonicQuality(1, 'minor')).toBe('min');
    expect(diatonicQuality(3, 'minor')).toBe('maj');
  });
});

describe('degreeToChordSymbol', () => {
  it('renders 1 5 6 4 in D major', () => {
    expect(degreeToChordSymbol(D_MAJOR, { degree: 1 })).toBe('D');
    expect(degreeToChordSymbol(D_MAJOR, { degree: 5 })).toBe('A');
    expect(degreeToChordSymbol(D_MAJOR, { degree: 6 })).toBe('Bm');
    expect(degreeToChordSymbol(D_MAJOR, { degree: 4 })).toBe('G');
  });

  it('renders 1 4 5 6 in Bb major with flat spelling', () => {
    expect(degreeToChordSymbol(BB_MAJOR, { degree: 1 })).toBe('Bb');
    expect(degreeToChordSymbol(BB_MAJOR, { degree: 4 })).toBe('Eb');
    expect(degreeToChordSymbol(BB_MAJOR, { degree: 5 })).toBe('F');
    expect(degreeToChordSymbol(BB_MAJOR, { degree: 6 })).toBe('Gm');
  });

  it('honours explicit qualities and accidentals', () => {
    expect(degreeToChordSymbol(D_MAJOR, { degree: 5, quality: 'dom7' })).toBe(
      'A7',
    );
    // b7 in D = C major triad
    expect(degreeToChordSymbol(D_MAJOR, { degree: 7, accidental: 'b' })).toBe(
      'C',
    );
  });

  it('renders slash chords from a bass degree', () => {
    expect(degreeToChordSymbol(D_MAJOR, { degree: 1, bassDegree: 3 })).toBe(
      'D/F#',
    );
  });

  it('renders minor-key diatonic chords', () => {
    expect(degreeToChordSymbol(A_MINOR, { degree: 1 })).toBe('Am');
    expect(degreeToChordSymbol(A_MINOR, { degree: 3 })).toBe('C');
  });
});

describe('renderProgression', () => {
  it('produces number labels and symbols together', () => {
    const rendered = renderProgression(ONE_FIVE_SIX_FOUR, D_MAJOR);
    expect(rendered.map((c) => c.numberLabel)).toEqual(['1', '5', '6', '4']);
    expect(rendered.map((c) => c.symbol)).toEqual(['D', 'A', 'Bm', 'G']);
  });

  it('defaults bars to 1 and respects explicit bars', () => {
    const rendered = renderProgression(
      [{ degree: 1, bars: 2 }, { degree: 4 }],
      D_MAJOR,
    );
    expect(rendered.map((c) => c.bars)).toEqual([2, 1]);
  });
});

describe('transposition', () => {
  it('transposes a key up by semitones', () => {
    expect(transposeKey(D_MAJOR, 2)).toEqual({ tonic: 'E', mode: 'major' });
    expect(transposeKey({ tonic: 'B', mode: 'major' }, 1)).toEqual({
      tonic: 'C',
      mode: 'major',
    });
  });

  it('measures semitone distance between keys', () => {
    expect(semitonesBetween(D_MAJOR, { tonic: 'E', mode: 'major' })).toBe(2);
    expect(semitonesBetween(D_MAJOR, { tonic: 'C', mode: 'major' })).toBe(10);
  });

  it('transposes a progression by re-rendering in a new key', () => {
    const inD = transposeProgression(ONE_FIVE_SIX_FOUR, D_MAJOR);
    const inBb = transposeProgression(ONE_FIVE_SIX_FOUR, BB_MAJOR);
    // Same degrees, different concrete chords.
    expect(inD.map((c) => c.numberLabel)).toEqual(
      inBb.map((c) => c.numberLabel),
    );
    expect(inD.map((c) => c.symbol)).toEqual(['D', 'A', 'Bm', 'G']);
    expect(inBb.map((c) => c.symbol)).toEqual(['Bb', 'F', 'Gm', 'Eb']);
  });
});

describe('numbersLine and bars', () => {
  it('joins degrees with arrows', () => {
    expect(numbersLine(ONE_FIVE_SIX_FOUR)).toBe('1 → 5 → 6 → 4');
  });

  it('counts bars, defaulting each chord to 1', () => {
    expect(progressionBarCount(ONE_FIVE_SIX_FOUR)).toBe(4);
    expect(
      progressionBarCount([
        { degree: 1, bars: 2 },
        { degree: 4, bars: 2 },
      ]),
    ).toBe(4);
  });
});

describe('canonical data is not mutated by preview/transposition', () => {
  it('leaves stored progressions unchanged after rendering in another key', () => {
    const snapshot = JSON.stringify(chordProgressions);
    for (const p of chordProgressions) {
      renderProgression(p, D_MAJOR);
      renderProgression(p, BB_MAJOR);
      transposeProgression(p, A_MINOR);
    }
    expect(JSON.stringify(chordProgressions)).toBe(snapshot);
  });

  it('does not mutate chord arrays when rendering', () => {
    const chords = ONE_FIVE_SIX_FOUR.map((c) => ({ ...c }));
    const before = JSON.stringify(chords);
    renderProgression(chords, D_MAJOR);
    renderProgression(chords, BB_MAJOR);
    expect(JSON.stringify(chords)).toBe(before);
  });
});
