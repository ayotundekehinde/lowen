import { describe, it, expect } from 'vitest';
import type { Loop, PracticeSession, Song } from './types';
import {
  applyLoopOverrides,
  applySongOverrides,
  emptyPersisted,
  loadPersisted,
  loopOverridesFrom,
  mergeSessions,
  savePersisted,
  songOverridesFrom,
  STORAGE_KEY,
  userSessionsOnly,
  type KeyValueStore,
} from './storage';

function mem(): KeyValueStore & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => {
      data.set(k, v);
    },
    removeItem: (k) => {
      data.delete(k);
    },
  };
}

const song = (partial: Partial<Song> & { id: string }): Song => ({
  title: 'Song',
  artist: 'Artist',
  context: 'praise',
  key: 'D Major',
  bpm: 100,
  tuning: 'Standard (EADG)',
  difficulty: 'beginner',
  progress: 0,
  favorite: false,
  sections: [],
  notes: '',
  loopIds: [],
  ...partial,
});

const loop = (partial: Partial<Loop> & { id: string }): Loop => ({
  name: 'Loop',
  context: 'praise',
  key: 'D Major',
  bpm: 100,
  timeSignature: '4/4',
  lengthBars: 4,
  difficulty: 'beginner',
  tags: [],
  favorite: false,
  ...partial,
});

describe('storage', () => {
  it('round-trips persisted state through a key-value store', () => {
    const store = mem();
    const state = emptyPersisted();
    state.sessions = [
      {
        id: 'sess-live-1',
        date: '2026-10-01T00:00:00.000Z',
        durationMin: 20,
        exercisesCompleted: 2,
        exercisesPlanned: 2,
        pillars: ['vamps'],
      },
    ];
    state.songOverrides = { 'song-a': { favorite: true } };
    savePersisted(state, store);
    expect(store.data.has(STORAGE_KEY)).toBe(true);
    const loaded = loadPersisted(store);
    expect(loaded.sessions).toHaveLength(1);
    expect(loaded.songOverrides['song-a']?.favorite).toBe(true);
    expect(loaded.sundaySet).toBeNull();
  });

  it('survives corrupt JSON', () => {
    const store = mem();
    store.setItem(STORAGE_KEY, '{not json');
    expect(loadPersisted(store).sessions).toEqual([]);
  });

  it('applies and diffs song/loop overrides without mutating seeds', () => {
    const seeds = [song({ id: 'a', favorite: false, notes: 'old' })];
    const next = applySongOverrides(seeds, {
      a: { favorite: true, notes: 'new' },
    });
    expect(seeds[0].favorite).toBe(false);
    expect(next[0].favorite).toBe(true);
    expect(next[0].notes).toBe('new');
    expect(songOverridesFrom(next, seeds)).toEqual({
      a: { favorite: true, notes: 'new' },
    });

    const loopSeeds = [loop({ id: 'l', favorite: true })];
    const loops = applyLoopOverrides(loopSeeds, { l: { favorite: false } });
    expect(loopOverridesFrom(loops, loopSeeds)).toEqual({
      l: { favorite: false },
    });
  });

  it('merges user sessions in front of seeds and drops colliding ids', () => {
    const seeds: PracticeSession[] = [
      {
        id: 'sess-1',
        date: '2026-10-02T00:00:00.000Z',
        durationMin: 10,
        exercisesCompleted: 1,
        exercisesPlanned: 1,
        pillars: ['groove-pocket'],
      },
    ];
    const extra: PracticeSession[] = [
      {
        id: 'sess-1',
        date: '2026-10-03T00:00:00.000Z',
        durationMin: 99,
        exercisesCompleted: 1,
        exercisesPlanned: 1,
        pillars: ['vamps'],
      },
      {
        id: 'sess-live-9',
        date: '2026-10-04T00:00:00.000Z',
        durationMin: 15,
        exercisesCompleted: 1,
        exercisesPlanned: 1,
        pillars: ['ear-training'],
      },
    ];
    const merged = mergeSessions(seeds, extra);
    expect(merged[0].id).toBe('sess-live-9');
    expect(merged.some((s) => s.durationMin === 99)).toBe(false);
    expect(userSessionsOnly(merged, new Set(['sess-1'])).map((s) => s.id)).toEqual(
      ['sess-live-9'],
    );
  });
});
