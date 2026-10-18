import { describe, it, expect } from 'vitest';
import { generateChallenge } from './challenges';
import type { Loop } from './types';

const loop: Loop = {
  id: 'loop-test',
  name: 'Test',
  context: 'nigerian-gospel',
  key: 'Bb Major',
  bpm: 104,
  timeSignature: '4/4',
  lengthBars: 4,
  difficulty: 'intermediate',
  tags: [],
  favorite: false,
};

describe('generateChallenge', () => {
  it('returns a gospel prompt with two filled constraints', () => {
    const c = generateChallenge(loop);
    expect(c.prompt.length).toBeGreaterThan(10);
    expect(c.constraints).toHaveLength(2);
    expect(c.constraints.every((line) => line.length > 0)).toBe(true);
  });
});
