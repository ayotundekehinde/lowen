/**
 * Pure music-theory helpers for the number system, key parsing, and
 * transposition.
 *
 * Design principle: progressions are stored as scale degrees (see
 * `NumberChord`), never as concrete notes. Rendering a progression means
 * projecting those degrees onto a `MusicalKey`. Transposition is therefore a
 * pure view operation — no stored data ever changes.
 *
 * Every function here is pure and side-effect free so it can be unit tested in
 * isolation (see `music.test.ts`).
 */
import type {
  ChordProgression,
  ChordQuality,
  Degree,
  MusicalKey,
  NumberChord,
  PitchClass,
} from './types';

/** The twelve pitch classes spelled with sharps. */
export const SHARP_NOTES: PitchClass[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

/** The twelve pitch classes spelled with flats. */
export const FLAT_NOTES: PitchClass[] = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
];

/** Every accepted spelling mapped to its chromatic index (0 = C). */
const NOTE_INDEX: Record<string, number> = {
  C: 0,
  'B#': 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  'E#': 5,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
  Cb: 11,
};

/** Major tonics conventionally spelled with flats. */
const FLAT_MAJOR_TONICS = new Set<string>(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb']);
/** Minor tonics conventionally spelled with flats. */
const FLAT_MINOR_TONICS = new Set<string>(['D', 'G', 'C', 'F', 'Bb', 'Eb']);

/** Semitone offset of each major-scale degree from the tonic. */
const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11];
/** Semitone offset of each natural-minor-scale degree from the tonic. */
const NATURAL_MINOR_STEPS = [0, 2, 3, 5, 7, 8, 10];

/** Diatonic triad qualities for the major scale, degrees 1–7. */
const MAJOR_DIATONIC: ChordQuality[] = [
  'maj',
  'min',
  'min',
  'maj',
  'maj',
  'min',
  'dim',
];
/** Diatonic triad qualities for the natural minor scale, degrees 1–7. */
const MINOR_DIATONIC: ChordQuality[] = [
  'min',
  'dim',
  'maj',
  'min',
  'min',
  'maj',
  'maj',
];

const QUALITY_SUFFIX: Record<ChordQuality, string> = {
  maj: '',
  min: 'm',
  dom7: '7',
  maj7: 'maj7',
  min7: 'm7',
  sus2: 'sus2',
  sus4: 'sus4',
  dim: 'dim',
  aug: '+',
  add9: 'add9',
};

function mod12(n: number): number {
  return ((n % 12) + 12) % 12;
}

/** Chromatic index (0–11) of a pitch spelling. Throws on unknown spellings. */
export function pitchClassIndex(pitch: string): number {
  const normalized = pitch.trim();
  const key = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  const idx = NOTE_INDEX[key];
  if (idx == null) {
    throw new Error(`Unknown pitch class: "${pitch}"`);
  }
  return idx;
}

/** Whether a key should render with flats (vs. sharps). */
export function keyUsesFlats(key: MusicalKey): boolean {
  if (key.tonic.includes('b')) return true;
  if (key.tonic.includes('#')) return false;
  return key.mode === 'minor'
    ? FLAT_MINOR_TONICS.has(key.tonic)
    : FLAT_MAJOR_TONICS.has(key.tonic);
}

/** Spell a chromatic index as a pitch class, preferring flats when asked. */
export function spellPitch(index: number, preferFlats: boolean): PitchClass {
  return (preferFlats ? FLAT_NOTES : SHARP_NOTES)[mod12(index)];
}

/**
 * Parse a display key string into a normalized `MusicalKey`.
 * Accepts forms like "D", "Bb", "F# Major", "E Minor", "Am", "Bbm".
 */
export function parseKey(input: string): MusicalKey {
  const trimmed = input.trim();
  const match = trimmed.match(/^([A-Ga-g])([#b]?)/);
  const tonicRaw = match
    ? match[1].toUpperCase() + (match[2] ?? '')
    : 'C';
  const tonic = spellPitch(pitchClassIndex(tonicRaw), tonicRaw.includes('b'));

  const compact = trimmed.replace(/\s+/g, '').toLowerCase();
  const isMinor =
    compact.includes('min') ||
    (/m$/.test(compact) && !compact.includes('maj'));

  return { tonic, mode: isMinor ? 'minor' : 'major' };
}

/** Format a `MusicalKey` back to a display string, e.g. "D Major". */
export function formatKey(key: MusicalKey): string {
  return `${key.tonic} ${key.mode === 'minor' ? 'Minor' : 'Major'}`;
}

/** Diatonic triad quality for a degree in a given mode. */
export function diatonicQuality(
  degree: Degree,
  mode: MusicalKey['mode'],
): ChordQuality {
  const table = mode === 'minor' ? MINOR_DIATONIC : MAJOR_DIATONIC;
  return table[degree - 1];
}

/** Chromatic index of a NumberChord's root within a key. */
function chordRootIndex(key: MusicalKey, chord: NumberChord): number {
  const steps = key.mode === 'minor' ? NATURAL_MINOR_STEPS : MAJOR_STEPS;
  let semis = steps[chord.degree - 1];
  if (chord.accidental === 'b') semis -= 1;
  if (chord.accidental === '#') semis += 1;
  return mod12(pitchClassIndex(key.tonic) + semis);
}

/** The number-system label for a chord, e.g. `5`, `b7`, `4`. */
export function numberLabel(chord: NumberChord): string {
  return `${chord.accidental ?? ''}${chord.degree}`;
}

/** A concrete chord symbol for a NumberChord in a key, e.g. `Bm`, `A7`, `D/F#`. */
export function degreeToChordSymbol(
  key: MusicalKey,
  chord: NumberChord,
): string {
  const preferFlats = keyUsesFlats(key);
  const rootIdx = chordRootIndex(key, chord);
  const root = spellPitch(rootIdx, preferFlats);
  // Borrowed/altered degrees (bVII, bIII, bVI…) are conventionally major, so
  // an accidental without an explicit quality defaults to a major triad rather
  // than the natural degree's diatonic quality.
  const quality =
    chord.quality ??
    (chord.accidental ? 'maj' : diatonicQuality(chord.degree, key.mode));
  let symbol = `${root}${QUALITY_SUFFIX[quality]}`;

  if (chord.bassDegree != null) {
    const bassIdx = chordRootIndex(key, { degree: chord.bassDegree });
    symbol += `/${spellPitch(bassIdx, preferFlats)}`;
  }
  return symbol;
}

export interface RenderedChord {
  numberLabel: string;
  symbol: string;
  bars: number;
}

/** A progression's chords, or a bare chord array. */
type ChordSource = ChordProgression | NumberChord[];

function chordsOf(source: ChordSource): NumberChord[] {
  return Array.isArray(source) ? source : source.chords;
}

/** Render a progression (or chord array) into concrete chords for a key. */
export function renderProgression(
  source: ChordSource,
  key: MusicalKey,
): RenderedChord[] {
  return chordsOf(source).map((chord) => ({
    numberLabel: numberLabel(chord),
    symbol: degreeToChordSymbol(key, chord),
    bars: chord.bars ?? 1,
  }));
}

/** Transpose a key by a number of semitones (positive = up). */
export function transposeKey(key: MusicalKey, semitones: number): MusicalKey {
  const nextIdx = mod12(pitchClassIndex(key.tonic) + semitones);
  return {
    tonic: spellPitch(nextIdx, keyUsesFlats(key)),
    mode: key.mode,
  };
}

/** Signed semitone distance from one key's tonic to another (0–11). */
export function semitonesBetween(from: MusicalKey, to: MusicalKey): number {
  return mod12(pitchClassIndex(to.tonic) - pitchClassIndex(from.tonic));
}

/**
 * Transpose a progression into a target key. Because progressions are stored
 * as degrees, this is simply rendering in the target key — provided as a
 * dedicated function to make intent explicit at call sites.
 */
export function transposeProgression(
  source: ChordSource,
  toKey: MusicalKey,
): RenderedChord[] {
  return renderProgression(source, toKey);
}
