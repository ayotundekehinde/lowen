import { describe, it, expect } from 'vitest';
import { songs } from '@/data/songs';
import { loops } from '@/data/loops';
import { chordProgressions } from '@/data/progressions';
import {
  filterProgressions,
  getSectionLoop,
  getSectionProgression,
  resolveSection,
} from './relations';

const praiseMedley = songs.find((s) => s.id === 'song-praise-medley')!;
const chorus = praiseMedley.sections.find((s) => s.name === 'Chorus')!;

describe('section → progression lookup', () => {
  it('resolves a section to its shared progression', () => {
    const progression = getSectionProgression(chorus, chordProgressions);
    expect(progression?.id).toBe('prog-1456');
    expect(progression?.chords.map((c) => c.degree)).toEqual([1, 4, 5, 6]);
  });
});

describe('section → loop lookup', () => {
  it('resolves a section to its shared loop', () => {
    const loop = getSectionLoop(chorus, loops);
    expect(loop?.id).toBe('loop-naija-chorus');
    expect(loop?.bpm).toBe(104);
    expect(loop?.progressionId).toBe('prog-1456');
  });
});

describe('resolveSection', () => {
  it('wires Song → Section → Progression → Loop with key, context and pillars', () => {
    const resolved = resolveSection(
      praiseMedley,
      chorus,
      chordProgressions,
      loops,
    );
    expect(resolved.progression?.id).toBe('prog-1456');
    expect(resolved.loop?.name).toBe('Nigerian Gospel Praise');
    expect(resolved.keyLabel).toBe('D Major');
    expect(resolved.context).toBe('praise');
    expect(resolved.pillars).toEqual([
      'groove-pocket',
      'number-system',
      'chord-movement',
      'passing-notes',
    ]);
  });

  it('falls back to the song context and key when the section omits them', () => {
    const intro = praiseMedley.sections.find((s) => s.name === 'Intro')!;
    const resolved = resolveSection(
      praiseMedley,
      intro,
      chordProgressions,
      loops,
    );
    expect(resolved.context).toBe('nigerian-gospel');
    expect(resolved.keyLabel).toBe('D Major');
    expect(resolved.loop?.id).toBe('loop-walkup-drills');
    expect(resolved.progression?.id).toBe('prog-walkup-4-1');
  });
});

describe('progression filtering', () => {
  it('filters by kind', () => {
    const vamps = filterProgressions(chordProgressions, { kind: 'vamp' });
    expect(vamps.length).toBeGreaterThan(0);
    expect(vamps.every((p) => p.kind === 'vamp')).toBe(true);
  });

  it('filters by gospel context', () => {
    const worship = filterProgressions(chordProgressions, {
      context: 'worship',
    });
    expect(worship.every((p) => p.context === 'worship')).toBe(true);
  });

  it('filters by pillar', () => {
    const vamps = filterProgressions(chordProgressions, { pillar: 'vamps' });
    expect(vamps.every((p) => p.pillars?.includes('vamps'))).toBe(true);
  });

  it('searches by name and numbers', () => {
    const hits = filterProgressions(chordProgressions, { query: '1 4 5 6' });
    expect(hits.some((p) => p.id === 'prog-1456')).toBe(true);
  });
});

describe('shared progression IDs', () => {
  it('keeps song sections and loops on the same chart', () => {
    expect(chorus.progressionId).toBe('prog-1456');
    const loop = getSectionLoop(chorus, loops)!;
    expect(loop.progressionId).toBe(chorus.progressionId);
  });
});
