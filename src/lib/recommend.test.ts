import { describe, it, expect } from 'vitest';
import { PILLAR_LIST } from './pillars';
import { weakestPillars, weightsForPillars } from './recommend';
import type { PillarId } from './types';

function minutes(
  overrides: Partial<Record<PillarId, number>>,
): Record<PillarId, number> {
  const base = Object.fromEntries(PILLAR_LIST.map((p) => [p.id, 40])) as Record<
    PillarId,
    number
  >;
  return { ...base, ...overrides };
}

describe('recommend', () => {
  it('ranks pillars with the least time first', () => {
    const weak = weakestPillars(
      minutes({ fills: 2, transitions: 5, vamps: 8, 'groove-pocket': 90 }),
      3,
    );
    expect(weak[0]).toBe('fills');
    expect(weak[1]).toBe('transitions');
    expect(weak[2]).toBe('vamps');
  });

  it('breaks ties by pillar id so the list is stable', () => {
    const even = minutes(
      Object.fromEntries(PILLAR_LIST.map((p) => [p.id, 0])) as Partial<
        Record<PillarId, number>
      >,
    );
    expect(weakestPillars(even, 2)).toEqual(
      [...PILLAR_LIST].map((p) => p.id).sort().slice(0, 2),
    );
  });

  it('weights the weakest pillar heaviest', () => {
    expect(weightsForPillars(['fills', 'vamps', 'ear-training'])).toEqual({
      fills: 4,
      vamps: 3,
      'ear-training': 2,
    });
  });
});
