import type {
  ChordProgression,
  Exercise,
  GospelStyle,
  Loop,
  MusicalKey,
  PillarId,
  PillarWeights,
  ProgressionKind,
  SessionContext,
  SessionMode,
  SessionPlan,
  SessionPlanItem,
  Song,
  SongSection,
} from './types';
import { SESSION_MODES, SESSION_PRESETS } from './pillars';
import { resolvePracticeWeights } from './sessionRules';
import { buildSessionContext } from './sessionContext';

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
  /** Explicit pillar weighting (from a preset); layered with kind/context. */
  weights?: PillarWeights;
  mode?: SessionMode;
  /** Bias exercise selection toward this progression / number-system work. */
  preferProgressionId?: string;
  /** Bias exercise selection toward this gospel context. */
  preferContext?: GospelStyle;
  /** Progression kind — layered into pillar weights (vamp, turnaround, …). */
  kind?: ProgressionKind;
  /** Extra pillar emphasis from a song section. */
  sectionPillars?: PillarId[];
  /** Informational musical context carried onto the plan. */
  context?: SessionContext;
}

/**
 * Score an exercise against the current musical request. Higher is a better
 * match: exact progression first, then gospel context, then related pillars.
 */
export function scoreExercise(
  exercise: Exercise,
  options: Pick<GenerateOptions, 'preferProgressionId' | 'preferContext'>,
): number {
  let s = 0;
  if (
    options.preferProgressionId &&
    exercise.progressionId === options.preferProgressionId
  ) {
    s += 100;
  }
  if (options.preferContext && exercise.context === options.preferContext) {
    s += 10;
  }
  if (
    options.preferProgressionId &&
    exercise.pillars.some((p) => PROGRESSION_PILLARS.has(p))
  ) {
    s += 5;
  }
  return s;
}

/**
 * Order a pool so preferred progression/context work comes first. Ties break
 * by id so selection is deterministic (no random shuffle).
 */
export function rankPool(
  pool: Exercise[],
  options: Pick<GenerateOptions, 'preferProgressionId' | 'preferContext'>,
): Exercise[] {
  return [...pool].sort((a, b) => {
    const diff = scoreExercise(b, options) - scoreExercise(a, options);
    return diff !== 0 ? diff : a.id.localeCompare(b.id);
  });
}

function applyTempo(exercise: Exercise, mode: SessionMode): Exercise {
  if (exercise.bpm == null) return exercise;
  const factor = SESSION_MODES[mode].tempoFactor;
  return { ...exercise, bpm: Math.round(exercise.bpm * factor) };
}

/**
 * Turn a weight map into a concrete, ordered list of pillar "slots". Uses a
 * deterministic proportional pick (highest weight-per-use wins, ties broken by
 * declaration order) so heavier pillars appear more often and interleave.
 */
export function weightedPillarOrder(
  weights: PillarWeights,
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
      const score = (weights[p] ?? 0) / (1 + (used[p] ?? 0));
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
 * Build a concrete practice plan. The generator draws from the supplied `pool`
 * using a single pillar-weighting model: kind, gospel context and section
 * pillars are merged with any explicit weights, then one not-yet-used exercise
 * is chosen per slot, biased toward any preferred progression/context.
 */
export function generateSession(
  pool: Exercise[],
  options: GenerateOptions,
): SessionPlan {
  const { totalMinutes } = options;
  const mode: SessionMode = options.mode ?? 'rehearse';

  const targetCount = Math.max(2, Math.min(6, Math.round(totalMinutes / 12)));
  const weights = resolvePracticeWeights({
    weights: options.weights,
    focus: options.focus,
    context: options.preferContext,
    kind: options.kind,
    sectionPillars: options.sectionPillars,
  });
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

  if (picked.length < targetCount) {
    for (const e of rankPool(pool, options)) {
      if (picked.length >= targetCount) break;
      if (!usedIds.has(e.id)) {
        usedIds.add(e.id);
        picked.push(e);
      }
    }
  }

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
  styleLabel?: string;
  song?: Song;
  section?: SongSection;
  loop?: Loop;
  pillars?: PillarId[];
  context?: GospelStyle;
}

/**
 * Build a session around a specific progression in a specific key. Kind and
 * gospel context are merged into the pillar weights; the musical banner is
 * built from whatever song/section/loop was supplied.
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
    song,
    section,
    loop,
    pillars,
    context,
  }: ProgressionSessionOptions,
): SessionPlan {
  const resolvedContext =
    context ?? section?.context ?? song?.context ?? progression.context ?? loop?.context;
  const resolvedPillars =
    pillars ?? section?.pillars ?? progression.pillars;

  return generateSession(pool, {
    totalMinutes,
    mode,
    weights,
    kind: progression.kind,
    preferProgressionId: progression.id,
    preferContext: resolvedContext,
    sectionPillars: resolvedPillars,
    context: buildSessionContext({
      progression,
      key,
      song,
      section,
      loop,
      context: resolvedContext,
      pillars: resolvedPillars,
      styleLabel,
    }),
  });
}

export interface SectionSessionOptions {
  song: Song;
  section: SongSection;
  progression?: ChordProgression;
  loop?: Loop;
  key: MusicalKey;
  totalMinutes?: number;
  mode?: SessionMode;
}

/**
 * Build a session from a song section, carrying the full
 * Song → Section → Progression → Loop chain into the existing practice flow.
 */
export function generateSectionSession(
  pool: Exercise[],
  {
    song,
    section,
    progression,
    loop,
    key,
    totalMinutes = 30,
    mode = 'rehearse',
  }: SectionSessionOptions,
): SessionPlan {
  if (progression) {
    return generateProgressionSession(pool, {
      progression,
      key,
      song,
      section,
      loop,
      totalMinutes,
      mode,
    });
  }

  const resolvedContext = section.context ?? song.context;
  return generateSession(pool, {
    totalMinutes,
    mode,
    weights: SESSION_PRESETS.song.weights,
    preferContext: resolvedContext,
    sectionPillars: section.pillars,
    context: buildSessionContext({
      song,
      section,
      loop,
      key,
      context: resolvedContext,
      pillars: section.pillars,
    }),
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
