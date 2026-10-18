import type { MusicalKey, Song } from './types';
import { formatKey, parseKey } from './music';
import type { SetlistItem, SetlistSlot, SundaySet } from '@/data/setlists';
import { SETLIST_SLOT_LABEL } from '@/data/setlists';

export const SETLIST_SLOT_LIST = Object.keys(
  SETLIST_SLOT_LABEL,
) as SetlistSlot[];

export function resolveSetItemKey(item: SetlistItem, song: Song): MusicalKey {
  return (
    item.keyRoot ??
    (item.key ? parseKey(item.key) : undefined) ??
    song.keyRoot ??
    parseKey(song.key)
  );
}

export function withItemKey(item: SetlistItem, key: MusicalKey): SetlistItem {
  return { ...item, keyRoot: key, key: formatKey(key) };
}

export function ensureItemIds(set: SundaySet): SundaySet {
  return {
    ...set,
    items: set.items.map((item, i) => ({
      ...item,
      id: item.id || `${item.songId}-${item.slot}-${i}`,
    })),
  };
}

/** Snapshot a catalog set into an editable user copy. */
export function cloneSundaySet(set: SundaySet): SundaySet {
  const tagged = ensureItemIds(set);
  return {
    ...tagged,
    id: tagged.id.startsWith('user-') ? tagged.id : `user-${tagged.id}`,
    items: tagged.items.map((item) => ({ ...item })),
  };
}

export function moveSetItem(
  items: SetlistItem[],
  index: number,
  dir: -1 | 1,
): SetlistItem[] {
  const next = [...items];
  const target = index + dir;
  if (target < 0 || target >= next.length) return items;
  const tmp = next[index];
  next[index] = next[target];
  next[target] = tmp;
  return next;
}

export function newSetItem(song: Song, slot: SetlistSlot = 'praise'): SetlistItem {
  const key = song.keyRoot ?? parseKey(song.key);
  return {
    id: `item-${song.id}-${Date.now().toString(36)}`,
    songId: song.id,
    slot,
    key: formatKey(key),
    keyRoot: key,
  };
}

export function isSundaySet(value: unknown): value is SundaySet {
  if (!value || typeof value !== 'object') return false;
  const set = value as SundaySet;
  return typeof set.id === 'string' && Array.isArray(set.items);
}
