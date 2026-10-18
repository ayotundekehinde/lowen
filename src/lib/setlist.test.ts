import { describe, it, expect } from 'vitest';
import type { Song } from './types';
import {
  cloneSundaySet,
  moveSetItem,
  newSetItem,
  resolveSetItemKey,
  withItemKey,
} from './setlist';
import { sundaySetForDate } from '@/data/setlists';

const song: Song = {
  id: 'song-x',
  title: 'X',
  artist: 'A',
  context: 'praise',
  key: 'D Major',
  keyRoot: { tonic: 'D', mode: 'major' },
  bpm: 100,
  tuning: 'Standard (EADG)',
  difficulty: 'beginner',
  progress: 0,
  favorite: false,
  sections: [],
  notes: '',
  loopIds: [],
};

describe('setlist helpers', () => {
  it('prefers the item key over the song key', () => {
    const item = newSetItem(song, 'worship');
    expect(resolveSetItemKey(item, song)).toEqual({ tonic: 'D', mode: 'major' });
    const moved = withItemKey(item, { tonic: 'E', mode: 'major' });
    expect(resolveSetItemKey(moved, song).tonic).toBe('E');
  });

  it('reorders items without dropping any', () => {
    const items = [
      { id: 'a', songId: '1', slot: 'praise' as const },
      { id: 'b', songId: '2', slot: 'worship' as const },
      { id: 'c', songId: '3', slot: 'altar' as const },
    ];
    expect(moveSetItem(items, 0, -1)).toBe(items);
    expect(moveSetItem(items, 0, 1).map((i) => i.id)).toEqual(['b', 'a', 'c']);
  });

  it('clones a catalog set into an editable user copy', () => {
    const seed = sundaySetForDate(new Date('2026-01-05T12:00:00Z'));
    const user = cloneSundaySet(seed);
    expect(user.id.startsWith('user-')).toBe(true);
    expect(user.items).toHaveLength(seed.items.length);
    expect(user.items[0].id).toBeTruthy();
    user.items[0].note = 'changed';
    expect(seed.items[0].note).not.toBe('changed');
  });
});
