import type { Skill } from '@/lib/types';

/**
 * Mock proficiency snapshot for the skill overview — framed as the competencies
 * a Nigerian/Gospel bassist actually develops, not generic bass skills.
 */
export const skills: Skill[] = [
  { id: 'skill-number-system', name: 'Number System Fluency', level: 68, trend: 6 },
  { id: 'skill-chord-movement', name: 'Chord Movement', level: 61, trend: 4 },
  { id: 'skill-gospel-pocket', name: 'Gospel Pocket', level: 74, trend: 3 },
  { id: 'skill-vamp-building', name: 'Vamp Building', level: 52, trend: 5 },
  { id: 'skill-passing-notes', name: 'Passing Notes', level: 57, trend: 4 },
  { id: 'skill-gospel-fills', name: 'Gospel Fills', level: 46, trend: 6 },
  { id: 'skill-transitions', name: 'Section Transitions', level: 50, trend: 5 },
  { id: 'skill-playing-changes', name: 'Playing Changes', level: 55, trend: 7 },
  { id: 'skill-6-8-feel', name: '6/8 Feel', level: 48, trend: 5 },
  { id: 'skill-playing-by-ear', name: 'Playing by Ear', level: 44, trend: 6 },
  { id: 'skill-key-transposition', name: 'Key Transposition', level: 42, trend: 8 },
];
