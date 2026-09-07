import type {
  CategoryId,
  ChordProgression,
  Exercise,
  Intensity,
  MusicalKey,
  SessionContext,
  SessionPlan,
  SessionPlanItem,
} from './types';
import { INTENSITIES } from './categories';
import { formatKey, numberLabel } from './music';

/** Concepts we favour when a session is built around a progression. */
const PROGRESSION_CONCEPTS = new Set([
  'number-system',
  'progressions',
  'playing-changes',
  'passing-tones',
]);

let idCounter = 0;
function uid(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * The default focus mix used for the "recommended" session on Home and when the
 * user does not narrow the focus themselves. Ordered as a sensible warm-up →
 * cool-down arc.
 */
const DEFAULT_FOCUS: CategoryId[] = [
  'technique',
  'theory',
  'loop-practice',
  'repertoire',
];

export interface GenerateOptions {
  totalMinutes: number;
  focus?: CategoryId[];
  intensity?: Intensity;
  /** Bias exercise selection toward this progression / number-system work. */
  preferProgressionId?: string;
  /** Informational musical context carried onto the plan. */
  context?: SessionContext;
}

/**
 * Order a category's exercises so that, when a progression is being practiced,
 * exercises tied to that progression (or to progression concepts) come first.
 * Randomised within each tier to keep sessions varied.
 */
function rankPool(
  pool: Exercise[],
  preferProgressionId?: string,
): Exercise[] {
  if (!preferProgressionId) return shuffle(pool);
  const preferred: Exercise[] = [];
  const rest: Exercise[] = [];
  for (const e of pool) {
    const matches =
      e.progressionId === preferProgressionId ||
      (e.concepts?.some((c) => PROGRESSION_CONCEPTS.has(c)) ?? false);
    (matches ? preferred : rest).push(e);
  }
  return [...shuffle(preferred), ...shuffle(rest)];
}

function applyTempo(exercise: Exercise, intensity: Intensity): Exercise {
  if (exercise.bpm == null) return exercise;
  const factor = INTENSITIES[intensity].tempoFactor;
  return { ...exercise, bpm: Math.round(exercise.bpm * factor) };
}

/**
 * Build a concrete practice plan from a duration, a set of focus categories and
 * an intensity. Exercises are drawn from the supplied `pool` (injected by the
 * caller, typically from the store) — this module has no dependency on the mock
 * data layer. One exercise is picked per focus slot, then durations are
 * distributed to fill the requested total.
 */
export function generateSession(
  pool: Exercise[],
  options: GenerateOptions,
): SessionPlan {
  const { totalMinutes } = options;
  const intensity: Intensity = options.intensity ?? 'normal';
  const focus =
    options.focus && options.focus.length > 0 ? options.focus : DEFAULT_FOCUS;

  // Decide how many exercises fit: roughly one per 12–15 minutes, bounded to the
  // number of distinct focus categories available.
  const targetCount = Math.max(2, Math.min(6, Math.round(totalMinutes / 12)));

  // Round-robin through the focus categories, picking a not-yet-used exercise
  // from each, cycling until we hit the target count.
  const picked: Exercise[] = [];
  const usedIds = new Set<string>();
  const pools = new Map<CategoryId, Exercise[]>();

  let slot = 0;
  let safety = 0;
  while (picked.length < targetCount && safety < targetCount * 6) {
    safety += 1;
    const category = focus[slot % focus.length];
    slot += 1;

    if (!pools.has(category)) {
      pools.set(
        category,
        rankPool(
          pool.filter((e) => e.category === category),
          options.preferProgressionId,
        ),
      );
    }
    const categoryPool = pools.get(category)!;
    const next = categoryPool.find((e) => !usedIds.has(e.id));
    if (next) {
      usedIds.add(next.id);
      picked.push(next);
    }
    // If a category is exhausted we simply move on to the next slot.
    if (slot % focus.length === 0 && picked.length === usedIds.size) {
      // continue looping
    }
  }

  // Fallback: if focus categories couldn't fill the target, top up from anything.
  if (picked.length < 2) {
    for (const e of shuffle(pool)) {
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
      exercise: applyTempo(exercise, intensity),
      durationMin: Math.max(1, share),
      status: 'pending',
    };
  });

  return {
    id: uid('plan'),
    createdAt: new Date().toISOString(),
    totalMinutes,
    intensity,
    focus,
    items,
    context: options.context,
  };
}

export interface ProgressionSessionOptions {
  progression: ChordProgression;
  key: MusicalKey;
  focus?: CategoryId[];
  totalMinutes?: number;
  intensity?: Intensity;
  style?: string;
}

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
    focus,
    totalMinutes = 30,
    intensity = 'normal',
    style,
  }: ProgressionSessionOptions,
): SessionPlan {
  const numbers = progression.chords.map(numberLabel).join(' → ');
  const context: SessionContext = {
    label: `${numbers} · ${formatKey(key)}`,
    progressionId: progression.id,
    key: formatKey(key),
    style: style ?? progression.style,
  };

  return generateSession(pool, {
    totalMinutes,
    intensity,
    focus: focus ?? ['loop-practice', 'theory'],
    preferProgressionId: progression.id,
    context,
  });
}

/** The recommended daily session shown on the Home dashboard. */
export function recommendedSession(pool: Exercise[]): SessionPlan {
  return generateSession(pool, {
    totalMinutes: 50,
    focus: DEFAULT_FOCUS,
    intensity: 'normal',
  });
}
