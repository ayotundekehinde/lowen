import type { Exercise, PillarId, PillarWeights, SessionPlan, Stats } from './types';
import { PILLAR_LIST } from './pillars';
import { generateSession } from './sessionGenerator';

/**
 * Pillars with the least recorded time — the ones to point a bassist toward
 * before Sunday. Stable order when minutes tie.
 */
export function weakestPillars(
  minutesByPillar: Stats['minutesByPillar'],
  n = 3,
): PillarId[] {
  const ranked = [...PILLAR_LIST].sort((a, b) => {
    const diff = minutesByPillar[a.id] - minutesByPillar[b.id];
    return diff !== 0 ? diff : a.id.localeCompare(b.id);
  });
  return ranked.slice(0, n).map((p) => p.id);
}

export function weightsForPillars(pillars: PillarId[]): PillarWeights {
  const weights: PillarWeights = {};
  pillars.forEach((id, i) => {
    weights[id] = Math.max(1, 4 - i);
  });
  return weights;
}

/** A 30-minute session biased toward the weakest pillars in the stats. */
export function sessionForWeakest(
  pool: Exercise[],
  stats: Stats,
): SessionPlan {
  const focus = weakestPillars(stats.minutesByPillar, 3);
  return generateSession(pool, {
    totalMinutes: 30,
    weights: weightsForPillars(focus),
    focus,
    mode: 'rehearse',
  });
}
