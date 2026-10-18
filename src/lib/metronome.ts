import type { Feel, NumberChord } from './types';
import { progressionBarCount } from './music';

/** Supported click meters. 6/8 is felt as six eighths with accents on 1 and 4. */
export type Meter = '4/4' | '6/8';

export interface BeatInfo {
  /** 0-indexed beat within the bar. */
  beat: number;
  /** 0-indexed bar since the transport started. */
  bar: number;
  accent: boolean;
  isDownbeat: boolean;
  /** AudioContext time this beat is scheduled for. */
  time: number;
}

export function parseMeter(
  timeSignature?: string,
  feel?: Feel,
): Meter {
  if (feel === '6/8' || timeSignature === '6/8') return '6/8';
  return '4/4';
}

export function beatsPerBar(meter: Meter): number {
  return meter === '6/8' ? 6 : 4;
}

/**
 * Seconds between clicks.
 * 4/4: BPM is the quarter note.
 * 6/8: BPM is the dotted-quarter pulse, subdivided into three eighths so the
 * click can accent 1 and 4 of the six-eighth bar.
 */
export function clickIntervalSec(bpm: number, meter: Meter): number {
  const safe = Math.max(20, Math.min(240, bpm));
  if (meter === '6/8') return 60 / (safe * 3);
  return 60 / safe;
}

export function isAccentBeat(beat: number, meter: Meter): boolean {
  if (meter === '6/8') return beat === 0 || beat === 3;
  return beat === 0;
}

export function chordIndexAtBar(
  chords: NumberChord[],
  bar: number,
): number {
  if (chords.length === 0) return 0;
  const total = progressionBarCount(chords) || 1;
  let pos = ((bar % total) + total) % total;
  for (let i = 0; i < chords.length; i++) {
    const width = chords[i].bars ?? 1;
    if (pos < width) return i;
    pos -= width;
  }
  return 0;
}

export function tapTempoBpm(timestamps: number[]): number | null {
  if (timestamps.length < 2) return null;
  const recent = timestamps.slice(-6);
  const intervals: number[] = [];
  for (let i = 1; i < recent.length; i++) {
    intervals.push(recent[i] - recent[i - 1]);
  }
  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  if (avg <= 0) return null;
  return Math.round(Math.max(40, Math.min(220, 60000 / avg)));
}
