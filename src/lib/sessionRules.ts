import type {
  GospelStyle,
  PillarId,
  PillarWeights,
  ProgressionKind,
} from './types';
import { SESSION_PRESETS } from './pillars';

/**
 * Reusable pillar-weight maps for musical context and progression kind.
 * Session generation merges these instead of branching on dozens of special
 * cases — a praise vamp and a praise section both pick up the praise weights.
 */
export const CONTEXT_WEIGHTS: Record<GospelStyle, PillarWeights> = {
  praise: {
    'groove-pocket': 2,
    vamps: 2,
    'passing-notes': 1,
    fills: 1,
    transitions: 1,
  },
  worship: {
    'groove-pocket': 2,
    'chord-movement': 2,
    'playing-changes': 2,
    transitions: 2,
    'ear-training': 1,
  },
  'gospel-6-8': {
    'groove-pocket': 3,
    'playing-changes': 2,
    'ear-training': 2,
    'chord-movement': 2,
  },
  'nigerian-gospel': {
    'groove-pocket': 2,
    vamps: 2,
    'passing-notes': 1,
    fills: 1,
    'number-system': 1,
  },
  'afro-gospel': {
    'groove-pocket': 2,
    'playing-changes': 2,
    'passing-notes': 1,
  },
  highlife: {
    'groove-pocket': 3,
    'playing-changes': 2,
    'passing-notes': 1,
  },
  afrobeats: {
    'groove-pocket': 3,
    'playing-changes': 1,
    fills: 1,
  },
  'contemporary-gospel': {
    'chord-movement': 2,
    'number-system': 2,
    'playing-changes': 2,
    'passing-notes': 1,
  },
  'slow-gospel': {
    'groove-pocket': 2,
    'chord-movement': 2,
    'ear-training': 1,
    transitions: 1,
  },
  'rnb-neo-soul': {
    'groove-pocket': 2,
    'playing-changes': 2,
    'passing-notes': 1,
  },
};

export const KIND_WEIGHTS: Record<ProgressionKind, PillarWeights> = {
  vamp: {
    vamps: 3,
    'groove-pocket': 2,
    'passing-notes': 1,
    fills: 1,
  },
  turnaround: {
    'passing-notes': 2,
    'chord-movement': 2,
    fills: 1,
    transitions: 1,
  },
  progression: {
    'chord-movement': 2,
    'number-system': 2,
    'playing-changes': 1,
  },
};

export function mergeWeights(...maps: Array<PillarWeights | undefined>): PillarWeights {
  const out: PillarWeights = {};
  for (const map of maps) {
    if (!map) continue;
    for (const key of Object.keys(map) as PillarId[]) {
      const value = map[key];
      if (value && value > 0) {
        out[key] = (out[key] ?? 0) + value;
      }
    }
  }
  return out;
}

export function weightsFromPillars(
  pillars: PillarId[],
  amount = 2,
): PillarWeights {
  return Object.fromEntries(pillars.map((p) => [p, amount])) as PillarWeights;
}

export interface PracticeWeightInput {
  /** Caller-supplied weights (Home presets, Practice focus, etc.). */
  weights?: PillarWeights;
  focus?: PillarId[];
  context?: GospelStyle;
  kind?: ProgressionKind;
  sectionPillars?: PillarId[];
}

/**
 * Resolve the pillar weights for a session. Explicit weights or focus form the
 * base; kind, gospel context and section pillars are layered on top so a
 * praise chorus and a worship vamp bias differently without one-off branches.
 */
export function resolvePracticeWeights({
  weights,
  focus,
  context,
  kind,
  sectionPillars,
}: PracticeWeightInput): PillarWeights {
  const hasWeights = Boolean(weights && Object.keys(weights).length > 0);
  const hasFocus = Boolean(focus && focus.length > 0);
  const hasMusical =
    Boolean(kind) ||
    Boolean(context) ||
    Boolean(sectionPillars && sectionPillars.length > 0);

  const base = hasWeights
    ? weights
    : hasFocus
      ? weightsFromPillars(focus!, 1)
      : hasMusical
        ? {}
        : SESSION_PRESETS.daily.weights;

  return mergeWeights(
    base,
    kind ? KIND_WEIGHTS[kind] : undefined,
    context ? CONTEXT_WEIGHTS[context] : undefined,
    sectionPillars?.length ? weightsFromPillars(sectionPillars, 2) : undefined,
  );
}
