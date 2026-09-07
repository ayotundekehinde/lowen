import type {
  ChordProgression,
  Exercise,
  GospelStyle,
  MusicalKey,
  PillarId,
  PillarWeights,
  SessionContext,
  SessionMode,
  SessionPlan,
  SessionPlanItem,
} from './types';
import { SESSION_MODES, SESSION_PRESETS } from './pillars';
import { GOSPEL_STYLES } from './styles';
import { formatKey, numberLabel } from './music';

/**
 * Pillars we lean on when a session is built around a specific progression —
 * the number-system / changes side of playing, where drilling a chart pays off.
 */
const PROGRESSION_PILLARS = new Set<PillarId>([
  'number-system',
  'chord-movement',
  'playing-changes',
  'passing-notes',
]);

let idCounter = 0;
function uid(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

export interface GenerateOptions {
  totalMinutes: number;
  /** Pillars to draw from. Equal weight unless `weights` is provided. */
  focus?: PillarId[];
  /** Explicit pillar weighting (from a preset); overrides `focus` weighting. */
  weights?: PillarWeights;
  mode?: SessionMode;
  /** Bias exercise selection toward this progression / number-system work. */
  preferProgressionId?: string;
  /** Bias exercise selection toward this gospel context. */
  preferContext?: GospelStyle;
  /** Informational musical context carried onto the plan. */
  context?: SessionContext;
}

/**
 * Resolve the effective pillar weighting for a request. Explicit weights win;
 * otherwise an equal-weighted focus; otherwise the balanced daily mix.
 */
function resolveWeights(options: GenerateOptions): Record<PillarId, number> {
  if (options.weights && Object.keys(options.weights).length > 0) {
    return options.weights as Record<PillarId, number>;
  }
  if (options.focus && options.focus.length > 0) {
    return Object.fromEntries(options.focus.map((p) => [p, 1])) as Record<
      PillarId,
      number
    >;
  }
  return SESSION_PRESETS.daily.weights as Record<PillarId, number>;
}

/**
 * Turn a weight map into a concrete, ordered list of pillar "slots". Uses a
 * deterministic proportional pick (highest weight-per-use wins, ties broken by
 * declaration order) so heavier pillars appear more often and interleave.
 */
function weightedPillarOrder(
  weights: Record<PillarId, number>,
  count: number,
): PillarId[] {
  const pillars = (Object.keys(weights) as PillarId[]).filter(
    (p) => (weights[p] ?? 0) > 0,
  );
  if (pillars.length === 0) return [];

  const used: Partial<Record<PillarId, number>> = {};
  const order: PillarId[] = [];
  for (let i = 0; i < count; i++) {
    let best = pillars[0];
    let bestScore = -Infinity;
    for (const p of pillars) {
      const score = weights[p] / (1 + (used[p] ?? 0));
      if (score > bestScore) {
        bestScore = score;
        best = p;
      }
    }
    used[best] = (used[best] ?? 0) + 1;
    order.push(best);
  }
  return order;
}

/**
 * Order a pool so that, when a progression or context is preferred, exercises
 * tied to it float to the top. Randomised within each tier to keep sessions
 * varied while staying deterministic in their bias.
 */
function rankPool(pool: Exercise[], options: GenerateOptions): Exercise[] {
  const { preferProgressionId, preferContext } = options;
  const score = (e: Exercise): number => {
    let s = 0;
    if (preferProgressionId && e.progressionId === preferProgressionId) s += 100;
    if (preferContext && e.context === preferContext) s += 10;
    if (preferProgressionId && e.pillars.some((p) => PROGRESSION_PILLARS.has(p)))
      s += 5;
    return s;
  };
  return pool
    .map((e) => ({ e, s: score(e), r: Math.random() }))
    .sort((a, b) => b.s - a.s || a.r - b.r)
    .map((x) => x.e);
}

function applyTempo(exercise: Exercise, mode: SessionMode): Exercise {
  if (exercise.bpm == null) return exercise;
  const factor = SESSION_MODES[mode].tempoFactor;
  return { ...exercise, bpm: Math.round(exercise.bpm * factor) };
}

/**
 * Build a concrete practice plan. The generator draws from the supplied `pool`
 * (injected by the caller — this module has no dependency on the mock data
 * layer) using a single pillar-weighting model: a weight map is expanded into
 * ordered pillar slots, and one not-yet-used exercise is chosen per slot from
 * the exercises that develop that pillar, biased toward any preferred
 * progression/context. Durations are then distributed to fill the total.
 */
export function generateSession(
  pool: Exercise[],
  options: GenerateOptions,
): SessionPlan {
  const { totalMinutes } = options;
  const mode: SessionMode = options.mode ?? 'rehearse';

  const targetCount = Math.max(2, Math.min(6, Math.round(totalMinutes / 12)));
  const weights = resolveWeights(options);
  const order = weightedPillarOrder(weights, targetCount);

  const picked: Exercise[] = [];
  const usedIds = new Set<string>();
  const rankedByPillar = new Map<PillarId, Exercise[]>();

  const poolFor = (pillar: PillarId): Exercise[] => {
    if (!rankedByPillar.has(pillar)) {
      rankedByPillar.set(
        pillar,
        rankPool(
          pool.filter((e) => e.pillars.includes(pillar)),
          options,
        ),
      );
    }
    return rankedByPillar.get(pillar)!;
  };

  for (const pillar of order) {
    const next = poolFor(pillar).find((e) => !usedIds.has(e.id));
    if (next) {
      usedIds.add(next.id);
      picked.push(next);
    }
  }

  // Top up from anything if pillars couldn't fill the target (e.g. sparse pool).
  if (picked.length < targetCount) {
    for (const e of rankPool(pool, options)) {
      if (picked.length >= targetCount) break;
      if (!usedIds.has(e.id)) {
        usedIds.add(e.id);
        picked.push(e);
      }
    }
  }

  // Distribute time: start from each exercise's suggested duration, then scale
  // proportionally to match the requested total (rounded to whole minutes).
  const suggested = picked.map((e) => e.durationMin);
  const suggestedTotal = suggested.reduce((a, b) => a + b, 0) || 1;
  let remaining = totalMinutes;
  const items: SessionPlanItem[] = picked.map((exercise, i) => {
    const isLast = i === picked.length - 1;
    const share = isLast
      ? remaining
      : Math.max(3, Math.round((suggested[i] / suggestedTotal) * totalMinutes));
    remaining -= share;
    return {
      id: uid('item'),
      exercise: applyTempo(exercise, mode),
      durationMin: Math.max(1, share),
      status: 'pending',
    };
  });

  // Report the pillars actually practiced (primary pillar of each pick).
  const focus = Array.from(new Set(picked.map((e) => e.pillars[0])));

  return {
    id: uid('plan'),
    createdAt: new Date().toISOString(),
    totalMinutes,
    mode,
    focus: focus.length ? focus : (options.focus ?? []),
    items,
    context: options.context,
  };
}

export interface ProgressionSessionOptions {
  progression: ChordProgression;
  key: MusicalKey;
  weights?: PillarWeights;
  totalMinutes?: number;
  mode?: SessionMode;
  /** Display style label for the session banner. */
  styleLabel?: string;
}

/** Default weighting for a progression-focused session. */
const PROGRESSION_WEIGHTS: PillarWeights = {
  'chord-movement': 3,
  'number-system': 2,
  'playing-changes': 2,
  'passing-notes': 1,
};

/**
 * Build a session around a specific progression in a specific key, reusing the
 * standard session infrastructure. Attaches the progression as session context
 * and biases exercise selection toward number-system / changes work.
 */
export function generateProgressionSession(
  pool: Exercise[],
  {
    progression,
    key,
    weights,
    totalMinutes = 30,
    mode = 'rehearse',
    styleLabel,
  }: ProgressionSessionOptions,
): SessionPlan {
  const numbers = progression.chords.map(numberLabel).join(' → ');
  const style =
    styleLabel ??
    (progression.context ? GOSPEL_STYLES[progression.context].label : undefined);
  const context: SessionContext = {
    label: `${numbers} · ${formatKey(key)}`,
    progressionId: progression.id,
    key: formatKey(key),
    style,
  };

  return generateSession(pool, {
    totalMinutes,
    mode,
    weights: weights ?? PROGRESSION_WEIGHTS,
    preferProgressionId: progression.id,
    preferContext: progression.context,
    context,
  });
}

/** The recommended daily session shown on the Home dashboard. */
export function recommendedSession(pool: Exercise[]): SessionPlan {
  return generateSession(pool, {
    totalMinutes: 50,
    weights: SESSION_PRESETS.daily.weights,
    mode: 'rehearse',
  });
}
