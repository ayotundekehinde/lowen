import type { GospelStyle } from './types';

/**
 * The gospel/Nigerian musical contexts Lowen is built around. These are typed
 * — every song, loop, progression and (where relevant) exercise carries one —
 * so context can shape content and session bias, not just decorate a card.
 */
export interface GospelStyleMeta {
  id: GospelStyle;
  label: string;
  short: string;
  description: string;
}

export const GOSPEL_STYLES: Record<GospelStyle, GospelStyleMeta> = {
  'nigerian-gospel': {
    id: 'nigerian-gospel',
    label: 'Nigerian Gospel',
    short: 'Naija Gospel',
    description: 'High-energy praise rooted in the Nigerian church.',
  },
  'afro-gospel': {
    id: 'afro-gospel',
    label: 'Afro-Gospel',
    short: 'Afro-Gospel',
    description: 'Gospel over Afrobeat/highlife-flavoured grooves.',
  },
  praise: {
    id: 'praise',
    label: 'Praise',
    short: 'Praise',
    description: 'Up-tempo, celebratory praise sets.',
  },
  worship: {
    id: 'worship',
    label: 'Worship',
    short: 'Worship',
    description: 'Spacious, dynamic worship and spontaneous flow.',
  },
  highlife: {
    id: 'highlife',
    label: 'Highlife',
    short: 'Highlife',
    description: 'Classic West-African highlife bounce.',
  },
  afrobeats: {
    id: 'afrobeats',
    label: 'Afrobeats',
    short: 'Afrobeats',
    description: 'Modern Afrobeats pocket and syncopation.',
  },
  'contemporary-gospel': {
    id: 'contemporary-gospel',
    label: 'Contemporary Gospel',
    short: 'Contemp.',
    description: 'Modern gospel harmony and production.',
  },
  'rnb-neo-soul': {
    id: 'rnb-neo-soul',
    label: 'R&B / Neo-Soul',
    short: 'Neo-Soul',
    description: 'Laid-back neo-soul feel that crosses into gospel.',
  },
  'slow-gospel': {
    id: 'slow-gospel',
    label: 'Slow Gospel',
    short: 'Slow',
    description: 'Ballad-tempo gospel and altar moments.',
  },
  'gospel-6-8': {
    id: 'gospel-6-8',
    label: '6/8 Gospel',
    short: '6/8',
    description: 'Compound-time gospel with a rolling triplet feel.',
  },
};

export const GOSPEL_STYLE_LIST = Object.values(GOSPEL_STYLES);

/** Human-readable label for a gospel style. */
export function styleLabel(style: GospelStyle): string {
  return GOSPEL_STYLES[style].label;
}
