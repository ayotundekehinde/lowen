import type { CategoryId, Intensity } from './types';

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  short: string;
  /** CSS custom property name for the category hue. */
  colorVar: string;
  description: string;
}

export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  technique: {
    id: 'technique',
    label: 'Technique',
    short: 'Tech',
    colorVar: '--color-technique',
    description: 'Hands, timing and control.',
  },
  theory: {
    id: 'theory',
    label: 'Theory',
    short: 'Theory',
    colorVar: '--color-theory',
    description: 'Notes, intervals and harmony.',
  },
  repertoire: {
    id: 'repertoire',
    label: 'Repertoire',
    short: 'Songs',
    colorVar: '--color-repertoire',
    description: 'Learn and refine real songs.',
  },
  creativity: {
    id: 'creativity',
    label: 'Creativity',
    short: 'Create',
    colorVar: '--color-creativity',
    description: 'Write, improvise and explore.',
  },
  'ear-training': {
    id: 'ear-training',
    label: 'Ear Training',
    short: 'Ear',
    colorVar: '--color-ear',
    description: 'Recognise pitch and groove.',
  },
  'loop-practice': {
    id: 'loop-practice',
    label: 'Loop Practice',
    short: 'Loops',
    colorVar: '--color-loop',
    description: 'Lock in over backing loops.',
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export function categoryColor(id: CategoryId): string {
  return `var(${CATEGORIES[id].colorVar})`;
}

export interface IntensityMeta {
  id: Intensity;
  label: string;
  description: string;
  /** BPM multiplier applied to exercise tempos. */
  tempoFactor: number;
}

export const INTENSITIES: Record<Intensity, IntensityMeta> = {
  chill: {
    id: 'chill',
    label: 'Chill',
    description: 'Relaxed tempos, room to breathe.',
    tempoFactor: 0.9,
  },
  normal: {
    id: 'normal',
    label: 'Normal',
    description: 'A balanced, focused workout.',
    tempoFactor: 1,
  },
  push: {
    id: 'push',
    label: 'Push Me',
    description: 'Faster tempos, tighter windows.',
    tempoFactor: 1.12,
  },
};

export const INTENSITY_LIST = Object.values(INTENSITIES);
