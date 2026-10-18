import type { Degree } from './types';
import { EMPTY_EAR_LAB, type EarLabStats as StoredEarLab } from './storage';

export type EarQuestionKind = 'degree' | 'pair';

export interface EarQuestion {
  kind: EarQuestionKind;
  /** Scale degrees the player should hear, in order. */
  degrees: Degree[];
}

const DIATONIC: Degree[] = [1, 2, 3, 4, 5, 6, 7];

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

/**
 * Next ear-lab prompt. `kind` of `pair` plays two degrees (a movement);
 * otherwise a single number.
 */
export function nextEarQuestion(
  kind: EarQuestionKind,
  rng: () => number = Math.random,
): EarQuestion {
  if (kind === 'pair') {
    const a = pick(DIATONIC, rng);
    let b = pick(DIATONIC, rng);
    if (b === a) b = (((a % 7) + 1) as Degree);
    return { kind, degrees: [a, b] };
  }
  return { kind: 'degree', degrees: [pick(DIATONIC, rng)] };
}

export function answersMatch(guess: Degree[], expected: Degree[]): boolean {
  if (guess.length !== expected.length) return false;
  return guess.every((g, i) => g === expected[i]);
}

export function applyEarResult(
  stats: StoredEarLab,
  correct: boolean,
): StoredEarLab {
  const streak = correct ? stats.streak + 1 : 0;
  return {
    correct: stats.correct + (correct ? 1 : 0),
    attempted: stats.attempted + 1,
    streak,
    bestStreak: Math.max(stats.bestStreak, streak),
  };
}

export { EMPTY_EAR_LAB };
export type { StoredEarLab as EarLabRecord };
