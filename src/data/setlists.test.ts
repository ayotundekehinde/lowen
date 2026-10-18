import { describe, it, expect } from 'vitest';
import { songs } from './songs';
import { isoWeekNumber, sundaySetForDate, SUNDAY_SETS } from './setlists';

describe('sunday sets', () => {
  it('only references songs that exist in the catalog', () => {
    const ids = new Set(songs.map((s) => s.id));
    for (const set of SUNDAY_SETS) {
      expect(set.items.length).toBeGreaterThan(0);
      const itemIds = new Set<string>();
      for (const item of set.items) {
        expect(ids.has(item.songId)).toBe(true);
        expect(item.id).toBeTruthy();
        expect(itemIds.has(item.id)).toBe(false);
        itemIds.add(item.id);
      }
    }
  });

  it('rotates the board by ISO week', () => {
    const a = sundaySetForDate(new Date('2026-01-05T12:00:00Z'));
    const b = sundaySetForDate(new Date('2026-01-12T12:00:00Z'));
    expect(a.id).not.toBe(b.id);
    expect(isoWeekNumber(new Date('2026-01-05T12:00:00Z'))).toBeGreaterThan(0);
  });
});
