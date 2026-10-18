import { describe, it, expect } from 'vitest';
import { exercises } from '@/data/exercises';
import { songs } from '@/data/songs';
import { loops } from '@/data/loops';
import { chordProgressions } from '@/data/progressions';
import { parseKey } from './music';
import { resolveSection } from './relations';
import {
  generateSession,
  generateProgressionSession,
  generateSectionSession,
  scoreExercise,
  rankPool,
} from './sessionGenerator';
import type { Exercise } from './types';

const praiseMedley = songs.find((s) => s.id === 'song-praise-medley')!;
const chorus = praiseMedley.sections.find((s) => s.name === 'Chorus')!;
const prog1456 = chordProgressions.find((p) => p.id === 'prog-1456')!;
const vamp = chordProgressions.find((p) => p.id === 'prog-worship-1-4')!;

const fixturePool: Exercise[] = [
  {
    id: 'a-groove',
    name: 'Groove A',
    pillars: ['groove-pocket'],
    durationMin: 8,
    instructions: 'pocket',
    difficulty: 'beginner',
    context: 'praise',
    progressionId: 'prog-1456',
  },
  {
    id: 'b-numbers',
    name: 'Numbers B',
    pillars: ['number-system', 'chord-movement'],
    durationMin: 8,
    instructions: 'numbers',
    difficulty: 'beginner',
    progressionId: 'prog-1456',
  },
  {
    id: 'c-unrelated',
    name: 'Unrelated C',
    pillars: ['technique'],
    durationMin: 8,
    instructions: 'tech',
    difficulty: 'beginner',
    context: 'highlife',
  },
  {
    id: 'd-vamp',
    name: 'Vamp D',
    pillars: ['vamps', 'groove-pocket'],
    durationMin: 8,
    instructions: 'vamp',
    difficulty: 'beginner',
    context: 'worship',
    progressionId: 'prog-worship-1-4',
  },
];

describe('pillar-aware session selection', () => {
  it('picks number-system and chord-movement drills for a number-system session', () => {
    const plan = generateSession(exercises, {
      totalMinutes: 30,
      focus: ['number-system', 'chord-movement'],
    });
    const pillars = plan.items.flatMap((i) => i.exercise.pillars);
    expect(pillars.some((p) => p === 'number-system')).toBe(true);
    expect(pillars.some((p) => p === 'chord-movement')).toBe(true);
  });
});

describe('context-aware session selection', () => {
  it('ranks the matching progression ahead of unrelated drills', () => {
    const ranked = rankPool(fixturePool, {
      preferProgressionId: 'prog-1456',
      preferContext: 'praise',
    });
    expect(ranked[0].progressionId).toBe('prog-1456');
    expect(
      scoreExercise(ranked[0], {
        preferProgressionId: 'prog-1456',
        preferContext: 'praise',
      }),
    ).toBeGreaterThan(
      scoreExercise(ranked[ranked.length - 1], {
        preferProgressionId: 'prog-1456',
        preferContext: 'praise',
      }),
    );
  });

  it('a praise section session prefers drills on that section’s progression', () => {
    const resolved = resolveSection(
      praiseMedley,
      chorus,
      chordProgressions,
      loops,
    );
    const plan = generateSectionSession(fixturePool, {
      song: praiseMedley,
      section: chorus,
      progression: resolved.progression,
      loop: resolved.loop,
      key: resolved.key,
    });
    expect(plan.items.some((i) => i.exercise.progressionId === 'prog-1456')).toBe(
      true,
    );
    expect(plan.context?.heading).toBe('Preparing: Chorus');
    expect(plan.context?.numbers).toBe('1 → 4 → 5 → 6');
  });

  it('a worship / 6/8 vamp session carries vamp context', () => {
    const plan = generateProgressionSession(fixturePool, {
      progression: vamp,
      key: parseKey('A Major'),
    });
    expect(plan.context?.heading).toBe('Vamp Practice');
    expect(plan.context?.kind).toBe('vamp');
    expect(plan.items.some((i) => i.exercise.id === 'd-vamp')).toBe(true);
  });
});

describe('progression session context', () => {
  it('records key, numbers and progression id without mutating the chart', () => {
    const snapshot = JSON.stringify(prog1456);
    const plan = generateProgressionSession(exercises, {
      progression: prog1456,
      key: parseKey('G Major'),
    });
    expect(plan.context?.progressionId).toBe('prog-1456');
    expect(plan.context?.key).toBe('G Major');
    expect(plan.context?.numbers).toBe('1 → 4 → 5 → 6');
    expect(JSON.stringify(prog1456)).toBe(snapshot);
  });
});
