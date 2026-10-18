import { describe, it, expect } from 'vitest';
import {
  answersMatch,
  applyEarResult,
  EMPTY_EAR_LAB,
  nextEarQuestion,
} from './earLab';

describe('ear lab', () => {
  it('deals a single degree or a two-degree movement', () => {
    const degree = nextEarQuestion('degree', () => 0);
    expect(degree.degrees).toHaveLength(1);
    expect(degree.degrees[0]).toBe(1);

    const pair = nextEarQuestion('pair', () => 0);
    expect(pair.degrees).toHaveLength(2);
    expect(pair.degrees[0]).not.toBe(pair.degrees[1]);
  });

  it('scores guesses and tracks streak', () => {
    expect(answersMatch([1, 5], [1, 5])).toBe(true);
    expect(answersMatch([1], [5])).toBe(false);
    const hit = applyEarResult(EMPTY_EAR_LAB, true);
    expect(hit).toEqual({
      correct: 1,
      attempted: 1,
      streak: 1,
      bestStreak: 1,
    });
    const miss = applyEarResult(hit, false);
    expect(miss.streak).toBe(0);
    expect(miss.bestStreak).toBe(1);
    expect(miss.correct).toBe(1);
    expect(miss.attempted).toBe(2);
  });
});
