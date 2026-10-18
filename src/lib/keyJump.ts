import type { MusicalKey, PitchClass } from './types';
import { formatKey, KEY_CHOICES, pitchClassIndex, transposeKey } from './music';

/** Typical MD cues — half or whole step, up or down. */
export const KEY_JUMPS = [
  { semitones: 1, label: '↑ ½', aria: 'Up a half step' },
  { semitones: 2, label: '↑ 1', aria: 'Up a whole step' },
  { semitones: -1, label: '↓ ½', aria: 'Down a half step' },
  { semitones: -2, label: '↓ 1', aria: 'Down a whole step' },
] as const;

export function applyKeyJump(key: MusicalKey, semitones: number): MusicalKey {
  const next = transposeKey(key, semitones);
  return {
    tonic: KEY_CHOICES[pitchClassIndex(next.tonic)] as PitchClass,
    mode: next.mode,
  };
}

/** Fire on the downbeat of bar N, 2N, … — never bar 0. */
export function shouldJumpOnBar(bar: number, everyBars: number): boolean {
  if (everyBars <= 0 || bar <= 0) return false;
  return bar % everyBars === 0;
}

export function jumpCueLabel(semitones: number, to: MusicalKey): string {
  const dir = semitones > 0 ? 'up' : 'down';
  const size = Math.abs(semitones) === 1 ? 'a ½ step' : 'a whole step';
  return `MD: ${dir} ${size} — now ${formatKey(to)}`;
}
