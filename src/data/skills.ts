import type { Skill } from '@/lib/types';

/** Mock proficiency snapshot for the skill overview. */
export const skills: Skill[] = [
  { id: 'skill-fingerstyle', name: 'Fingerstyle', level: 78, trend: 4 },
  { id: 'skill-slap', name: 'Slap', level: 52, trend: 6 },
  { id: 'skill-muting', name: 'Muting', level: 70, trend: 3 },
  { id: 'skill-scales', name: 'Scales', level: 64, trend: 2 },
  { id: 'skill-arpeggios', name: 'Arpeggios', level: 58, trend: 5 },
  { id: 'skill-fretboard', name: 'Fretboard', level: 61, trend: 3 },
  { id: 'skill-improv', name: 'Improvisation', level: 44, trend: 7 },
];
