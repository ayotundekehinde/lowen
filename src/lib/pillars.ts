import type { PillarId, PillarWeights, SessionMode } from './types';

/**
 * The eleven learning pillars — Lowen's single, first-class learning taxonomy,
 * tailored to how a Nigerian/Gospel bassist actually develops. Every exercise,
 * session focus and progress statistic is classified against these.
 */
export interface PillarMeta {
  id: PillarId;
  label: string;
  short: string;
  /** CSS custom property name for the pillar hue. */
  colorVar: string;
  description: string;
}

export const PILLARS: Record<PillarId, PillarMeta> = {
  'groove-pocket': {
    id: 'groove-pocket',
    label: 'Groove & Pocket',
    short: 'Groove',
    colorVar: '--color-pillar-groove-pocket',
    description: 'Sit in the pocket and lock with the drummer.',
  },
  'number-system': {
    id: 'number-system',
    label: 'Number System',
    short: 'Numbers',
    colorVar: '--color-pillar-number-system',
    description: 'Think in 1–7 so any key is home.',
  },
  'chord-movement': {
    id: 'chord-movement',
    label: 'Chord Movement',
    short: 'Changes',
    colorVar: '--color-pillar-chord-movement',
    description: 'Hear and shape how chords move.',
  },
  vamps: {
    id: 'vamps',
    label: 'Vamps',
    short: 'Vamps',
    colorVar: '--color-pillar-vamps',
    description: 'Build and ride worship/praise vamps.',
  },
  'passing-notes': {
    id: 'passing-notes',
    label: 'Passing Notes',
    short: 'Passing',
    colorVar: '--color-pillar-passing-notes',
    description: 'Connect the chords with walk-ups and approaches.',
  },
  fills: {
    id: 'fills',
    label: 'Fills',
    short: 'Fills',
    colorVar: '--color-pillar-fills',
    description: 'Tasteful fills that set up the next section.',
  },
  transitions: {
    id: 'transitions',
    label: 'Transitions',
    short: 'Moves',
    colorVar: '--color-pillar-transitions',
    description: 'Move cleanly between sections and keys.',
  },
  'playing-changes': {
    id: 'playing-changes',
    label: 'Playing Changes',
    short: 'Playing',
    colorVar: '--color-pillar-playing-changes',
    description: 'Follow the changes live and on the spot.',
  },
  'ear-training': {
    id: 'ear-training',
    label: 'Ear Training',
    short: 'Ear',
    colorVar: '--color-pillar-ear-training',
    description: 'Hear the numbers and the movement.',
  },
  technique: {
    id: 'technique',
    label: 'Technique',
    short: 'Tech',
    colorVar: '--color-pillar-technique',
    description: 'Hands, timing and control that serve the music.',
  },
  repertoire: {
    id: 'repertoire',
    label: 'Repertoire',
    short: 'Songs',
    colorVar: '--color-pillar-repertoire',
    description: 'Learn songs by section, ready for service.',
  },
};

export const PILLAR_LIST = Object.values(PILLARS);

export function pillarColor(id: PillarId): string {
  return `var(${PILLARS[id].colorVar})`;
}

/**
 * Session modes replace fitness-style intensity with musical preparation
 * language. Each mode nudges the suggested tempos: warming up sits back,
 * preparing for service pushes to performance tempo.
 */
export interface SessionModeMeta {
  id: SessionMode;
  label: string;
  description: string;
  /** BPM multiplier applied to exercise tempos. */
  tempoFactor: number;
}

export const SESSION_MODES: Record<SessionMode, SessionModeMeta> = {
  'warm-up': {
    id: 'warm-up',
    label: 'Warm Up',
    description: 'Ease in at relaxed tempos.',
    tempoFactor: 0.9,
  },
  rehearse: {
    id: 'rehearse',
    label: 'Rehearse',
    description: 'Work it at a steady, focused tempo.',
    tempoFactor: 1,
  },
  service: {
    id: 'service',
    label: 'Prepare for Service',
    description: 'Lock it in at performance tempo.',
    tempoFactor: 1.08,
  },
};

export const SESSION_MODE_LIST = Object.values(SESSION_MODES);

/**
 * Named session presets expressed as pillar weights. A single, reusable
 * weighting model powers the generator — Home quick-starts and section/service
 * preparation all resolve to one of these weight maps rather than bespoke code.
 */
export type SessionPresetId =
  | 'daily'
  | 'vamp'
  | 'progression'
  | 'number-system'
  | 'song'
  | 'groove'
  | 'worship-prep'
  | 'praise-prep';

export interface SessionPreset {
  id: SessionPresetId;
  label: string;
  weights: PillarWeights;
}

export const SESSION_PRESETS: Record<SessionPresetId, SessionPreset> = {
  daily: {
    id: 'daily',
    label: 'Daily Practice',
    weights: {
      'groove-pocket': 3,
      'number-system': 2,
      'chord-movement': 2,
      vamps: 1,
      'passing-notes': 1,
      transitions: 1,
      'playing-changes': 1,
      'ear-training': 1,
      repertoire: 1,
      technique: 1,
    },
  },
  vamp: {
    id: 'vamp',
    label: 'Vamp Practice',
    weights: { vamps: 3, 'groove-pocket': 2, 'passing-notes': 1 },
  },
  progression: {
    id: 'progression',
    label: 'Progression Practice',
    weights: { 'chord-movement': 3, 'number-system': 2, 'playing-changes': 1 },
  },
  'number-system': {
    id: 'number-system',
    label: 'Number System',
    weights: { 'number-system': 3, 'chord-movement': 2, 'ear-training': 1 },
  },
  song: {
    id: 'song',
    label: 'Song Practice',
    weights: { repertoire: 3, 'playing-changes': 2, transitions: 1 },
  },
  groove: {
    id: 'groove',
    label: 'Groove & Pocket',
    weights: { 'groove-pocket': 3, 'playing-changes': 1 },
  },
  'worship-prep': {
    id: 'worship-prep',
    label: 'Prepare for Worship',
    weights: {
      'groove-pocket': 2,
      'chord-movement': 2,
      transitions: 2,
      'passing-notes': 1,
    },
  },
  'praise-prep': {
    id: 'praise-prep',
    label: 'Prepare for Praise',
    weights: {
      'groove-pocket': 2,
      vamps: 2,
      'passing-notes': 1,
      fills: 1,
    },
  },
};
