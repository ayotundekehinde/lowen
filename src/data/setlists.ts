import type { GospelStyle, MusicalKey } from '@/lib/types';

/** A slot in a Sunday service set. */
export type SetlistSlot =
  | 'opening-praise'
  | 'praise'
  | 'worship'
  | 'altar'
  | 'closing';

export interface SetlistItem {
  id: string;
  songId: string;
  slot: SetlistSlot;
  note?: string;
  /** Service key for this slot; falls back to the song. */
  key?: string;
  keyRoot?: MusicalKey;
}

export interface SundaySet {
  id: string;
  title: string;
  occasion: string;
  /** Gospel context the set leans on. */
  context: GospelStyle;
  items: SetlistItem[];
}

export const SETLIST_SLOT_LABEL: Record<SetlistSlot, string> = {
  'opening-praise': 'Opening praise',
  praise: 'Praise',
  worship: 'Worship',
  altar: 'Altar',
  closing: 'Closing',
};

/**
 * Two rotating Sunday sets built from the repertoire catalog. The Home
 * dashboard picks one by ISO week so the board feels alive without a backend.
 */
export const SUNDAY_SETS: SundaySet[] = [
  {
    id: 'set-praise-sunday',
    title: 'Praise Sunday',
    occasion: 'Sunday service',
    context: 'nigerian-gospel',
    items: [
      {
        id: 'set-praise-igwe',
        songId: 'song-igwe',
        slot: 'opening-praise',
        note: 'Fast 1–4–5. Lock the pocket, survive the key jump.',
      },
      {
        id: 'set-praise-medley',
        songId: 'song-praise-medley',
        slot: 'praise',
        note: 'Chorus lives on 1–4–5–6. Walk into the 1 on the turn.',
      },
      {
        id: 'set-praise-way-maker',
        songId: 'song-way-maker',
        slot: 'worship',
        note: 'Think 1–5–6–4. Hold roots, then open the bridge.',
      },
      {
        id: 'set-praise-ekwueme',
        songId: 'song-ekwueme',
        slot: 'altar',
        note: '6/8. Patient 1–4 vamp, fills only on the turns.',
      },
    ],
  },
  {
    id: 'set-thanksgiving',
    title: 'Thanksgiving Worship',
    occasion: 'Sunday service',
    context: 'worship',
    items: [
      {
        id: 'set-thanks-imela',
        songId: 'song-imela',
        slot: 'opening-praise',
        note: 'Warm root-and-fifth pocket. Leave space for horns.',
      },
      {
        id: 'set-thanks-way-maker',
        songId: 'song-way-maker',
        slot: 'worship',
        note: 'Follow the MD into spontaneous worship at the end.',
      },
      {
        id: 'set-thanks-ekwueme',
        songId: 'song-ekwueme',
        slot: 'altar',
        note: 'Compound 6/8 — dotted quarter, not a 4/4 shuffle.',
      },
      {
        id: 'set-thanks-medley',
        songId: 'song-praise-medley',
        slot: 'closing',
        note: 'Stamina. Stay in numbers when the key jumps.',
      },
    ],
  },
];

/** ISO week number (Mon-start), 1–53. */
export function isoWeekNumber(date: Date = new Date()): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function sundaySetForDate(date: Date = new Date()): SundaySet {
  const week = isoWeekNumber(date);
  return SUNDAY_SETS[week % SUNDAY_SETS.length];
}
