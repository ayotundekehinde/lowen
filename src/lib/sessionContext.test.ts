import { describe, it, expect } from 'vitest';
import { chordProgressions } from '@/data/progressions';
import { songs } from '@/data/songs';
import { loops } from '@/data/loops';
import { parseKey } from './music';
import { buildSessionContext } from './sessionContext';
import { resolveSection } from './relations';

const praiseMedley = songs.find((s) => s.id === 'song-praise-medley')!;
const chorus = praiseMedley.sections.find((s) => s.name === 'Chorus')!;
const vamp = chordProgressions.find((p) => p.id === 'prog-worship-1-4')!;
const turn = chordProgressions.find((p) => p.id === 'prog-6251')!;

describe('buildSessionContext', () => {
  it('describes a song section as Preparing: with numbers and meta', () => {
    const resolved = resolveSection(
      praiseMedley,
      chorus,
      chordProgressions,
      loops,
    );
    const ctx = buildSessionContext({
      song: praiseMedley,
      section: chorus,
      progression: resolved.progression,
      loop: resolved.loop,
      key: resolved.key,
      context: resolved.context,
      pillars: resolved.pillars,
    });

    expect(ctx.heading).toBe('Preparing: Chorus');
    expect(ctx.numbers).toBe('1 → 4 → 5 → 6');
    expect(ctx.meta).toBe('D Major · Nigerian Gospel · Praise');
    expect(ctx.focusLabel).toBe('Practice focus: Groove & Pocket');
    expect(ctx.songId).toBe('song-praise-medley');
    expect(ctx.sectionId).toBe(chorus.id);
    expect(ctx.progressionId).toBe('prog-1456');
    expect(ctx.loopId).toBe('loop-naija-chorus');
  });

  it('describes a standalone progression as Practicing: numbers', () => {
    const ctx = buildSessionContext({
      progression: turn,
      key: parseKey('F Major'),
      context: 'worship',
    });
    expect(ctx.heading).toBe('Practicing: 6 → 2 → 5 → 1');
    expect(ctx.meta).toContain('F Major');
    expect(ctx.meta).toContain('Worship');
  });

  it('describes a vamp as Vamp Practice', () => {
    const ctx = buildSessionContext({
      progression: vamp,
      key: parseKey('E Major'),
      styleLabel: 'Nigerian Gospel Praise',
    });
    expect(ctx.heading).toBe('Vamp Practice');
    expect(ctx.numbers).toBe('1 → 4');
    expect(ctx.meta).toBe('E Major · Nigerian Gospel Praise');
  });
});
