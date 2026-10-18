import type { Degree, MusicalKey, NumberChord } from './types';
import { chordRootIndex } from './music';
import {
  beatsPerBar,
  chordIndexAtBar,
  isAccentBeat,
  type Meter,
} from './metronome';

export type WalkStyle = 'roots' | 'walk-up' | 'approach' | 'roll';

export const WALK_STYLES: { id: WalkStyle; label: string; hint: string }[] = [
  { id: 'roots', label: 'Roots', hint: 'pocket' },
  { id: 'walk-up', label: 'Walk-up', hint: 'into the 1' },
  { id: 'approach', label: 'Approach', hint: 'chromatic' },
  { id: 'roll', label: '6/8 roll', hint: '1–3–5' },
];

export interface WalkNote {
  pitchIndex: number;
  octave: number;
  landing: boolean;
}

function mod12(n: number): number {
  return ((n % 12) + 12) % 12;
}

function wrapDegree(degree: number): Degree {
  return (((((degree - 1) % 7) + 7) % 7) + 1) as Degree;
}

/** Key-diatonic chord tone from a number-system chord (1, 3, 5, 6, 7). */
export function chordToneIndex(
  key: MusicalKey,
  chord: NumberChord,
  tone: 1 | 3 | 5 | 6 | 7,
): number {
  const steps =
    tone === 1 ? 0 : tone === 3 ? 2 : tone === 5 ? 4 : tone === 6 ? 5 : 6;
  return chordRootIndex(key, {
    degree: wrapDegree(chord.degree + steps),
    accidental: tone === 1 ? chord.accidental : undefined,
  });
}

export function midiOf(pitchIndex: number, octave: number): number {
  return (octave + 1) * 12 + mod12(pitchIndex);
}

/** Keep the line in bass range and close to the previous note. */
export function nearestBassOctave(
  pitchIndex: number,
  prevMidi: number | null,
): number {
  const idx = mod12(pitchIndex);
  if (prevMidi == null) return 2;
  let bestOct = 2;
  let bestDist = Infinity;
  for (const oct of [1, 2, 3]) {
    const midi = midiOf(idx, oct);
    if (midi < 28 || midi > 55) continue;
    const dist = Math.abs(midi - prevMidi);
    if (dist < bestDist) {
      bestDist = dist;
      bestOct = oct;
    }
  }
  return bestOct;
}

/** Beats remaining in this chord, including the current beat. */
export function beatsLeftInChord(
  chords: NumberChord[],
  bar: number,
  beat: number,
  meter: Meter,
): number {
  if (chords.length === 0) return 1;
  const perBar = beatsPerBar(meter);
  const cur = chordIndexAtBar(chords, bar);
  let b = bar;
  let bt = beat;
  let left = 0;
  while (left < 48 && chordIndexAtBar(chords, b) === cur) {
    left += 1;
    bt += 1;
    if (bt >= perBar) {
      bt = 0;
      b += 1;
    }
  }
  return Math.max(1, left);
}

export function upcomingChord(
  chords: NumberChord[],
  bar: number,
  beat: number,
  meter: Meter,
): NumberChord {
  const perBar = beatsPerBar(meter);
  const left = beatsLeftInChord(chords, bar, beat, meter);
  let b = bar;
  let bt = beat;
  for (let i = 0; i < left; i++) {
    bt += 1;
    if (bt >= perBar) {
      bt = 0;
      b += 1;
    }
  }
  return chords[chordIndexAtBar(chords, b)];
}

function place(
  pitchIndex: number,
  prevMidi: number | null,
  landing: boolean,
  octaveBump = 0,
): WalkNote {
  const oct = Math.min(
    3,
    nearestBassOctave(pitchIndex, prevMidi) + octaveBump,
  );
  return { pitchIndex: mod12(pitchIndex), octave: oct, landing };
}

/**
 * One bass note (or silence) for a beat.
 * - roots: downbeats / 6/8 accents only
 * - approach: chromatic below the next chord on the last beat
 * - walk-up: walk into the next chord over the last few beats
 * - roll: 1–3–5–6–5–3 in 6/8 (or a 1–3–5–1 arpeggio in 4/4)
 */
export function walkNoteForBeat(
  chords: NumberChord[],
  key: MusicalKey,
  bar: number,
  beat: number,
  meter: Meter,
  style: WalkStyle,
  prevMidi: number | null = null,
): WalkNote | null {
  if (chords.length === 0) return null;
  const chord = chords[chordIndexAtBar(chords, bar)];
  const next = upcomingChord(chords, bar, beat, meter);
  const target = chordRootIndex(key, next);
  const root = chordRootIndex(key, chord);
  const left = beatsLeftInChord(chords, bar, beat, meter);

  if (style === 'roots') {
    if (!isAccentBeat(beat, meter)) return null;
    return place(root, prevMidi, true);
  }

  if (style === 'approach') {
    if (left === 1) return place(mod12(target - 1), prevMidi, false);
    if (isAccentBeat(beat, meter)) return place(root, prevMidi, true);
    if (meter === '4/4' && beat === 2) {
      return place(chordToneIndex(key, chord, 5), prevMidi, false);
    }
    return null;
  }

  if (style === 'roll') {
    if (left === 1) return place(mod12(target - 1), prevMidi, false);
    if (meter === '6/8') {
      const pattern: Array<1 | 3 | 5 | 6> = [1, 3, 5, 6, 5, 3];
      const tone = pattern[beat] ?? 1;
      return place(
        chordToneIndex(key, chord, tone),
        prevMidi,
        beat === 0,
        beat === 3 ? 1 : 0,
      );
    }
    const tones: Array<1 | 3 | 5> = [1, 3, 5, 1];
    return place(
      chordToneIndex(key, chord, tones[beat] ?? 1),
      prevMidi,
      beat === 0,
    );
  }

  if (left === 1) return place(mod12(target - 1), prevMidi, false);
  if (left === 2) return place(mod12(target - 2), prevMidi, false);
  if (left === 3) return place(chordToneIndex(key, chord, 5), prevMidi, false);
  if (beat === 0 || isAccentBeat(beat, meter)) {
    return place(root, prevMidi, true);
  }
  if (meter === '4/4' && beat === 2) {
    return place(chordToneIndex(key, chord, 5), prevMidi, false);
  }
  if (meter === '6/8' && beat === 2) {
    return place(chordToneIndex(key, chord, 3), prevMidi, false);
  }
  return place(chordToneIndex(key, chord, 5), prevMidi, false);
}
