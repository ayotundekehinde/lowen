import type { Loop, PracticeSession, Song } from './types';

export const STORAGE_KEY = 'lowen:v1';

export interface SongOverride {
  favorite?: boolean;
  notes?: string;
}

export interface LoopOverride {
  favorite?: boolean;
}

export interface EarLabStats {
  correct: number;
  attempted: number;
  streak: number;
  bestStreak: number;
}

export interface PersistedState {
  version: 1;
  sessions: PracticeSession[];
  songOverrides: Record<string, SongOverride>;
  loopOverrides: Record<string, LoopOverride>;
  earLab: EarLabStats;
}

export const EMPTY_EAR_LAB: EarLabStats = {
  correct: 0,
  attempted: 0,
  streak: 0,
  bestStreak: 0,
};

export function emptyPersisted(): PersistedState {
  return {
    version: 1,
    sessions: [],
    songOverrides: {},
    loopOverrides: {},
    earLab: { ...EMPTY_EAR_LAB },
  };
}

export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function browserStore(): KeyValueStore | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadPersisted(
  store: KeyValueStore | null = browserStore(),
): PersistedState {
  if (!store) return emptyPersisted();
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return emptyPersisted();
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      version: 1,
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      songOverrides: parsed.songOverrides ?? {},
      loopOverrides: parsed.loopOverrides ?? {},
      earLab: {
        ...EMPTY_EAR_LAB,
        ...(parsed.earLab ?? {}),
      },
    };
  } catch {
    return emptyPersisted();
  }
}

export function savePersisted(
  state: PersistedState,
  store: KeyValueStore | null = browserStore(),
): void {
  if (!store) return;
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota / private-mode — practice still works in-memory.
  }
}

export function applySongOverrides(
  seeds: Song[],
  overrides: Record<string, SongOverride>,
): Song[] {
  return seeds.map((song) => {
    const o = overrides[song.id];
    if (!o) return song;
    return {
      ...song,
      favorite: o.favorite ?? song.favorite,
      notes: o.notes ?? song.notes,
    };
  });
}

export function applyLoopOverrides(
  seeds: Loop[],
  overrides: Record<string, LoopOverride>,
): Loop[] {
  return seeds.map((loop) => {
    const o = overrides[loop.id];
    if (!o) return loop;
    return {
      ...loop,
      favorite: o.favorite ?? loop.favorite,
    };
  });
}

export function songOverridesFrom(
  songs: Song[],
  seeds: Song[],
): Record<string, SongOverride> {
  const seedById = new Map(seeds.map((s) => [s.id, s]));
  const out: Record<string, SongOverride> = {};
  for (const song of songs) {
    const seed = seedById.get(song.id);
    if (!seed) continue;
    const o: SongOverride = {};
    if (song.favorite !== seed.favorite) o.favorite = song.favorite;
    if (song.notes !== seed.notes) o.notes = song.notes;
    if (Object.keys(o).length) out[song.id] = o;
  }
  return out;
}

export function loopOverridesFrom(
  loops: Loop[],
  seeds: Loop[],
): Record<string, LoopOverride> {
  const seedById = new Map(seeds.map((l) => [l.id, l]));
  const out: Record<string, LoopOverride> = {};
  for (const loop of loops) {
    const seed = seedById.get(loop.id);
    if (!seed) continue;
    if (loop.favorite !== seed.favorite) {
      out[loop.id] = { favorite: loop.favorite };
    }
  }
  return out;
}

/**
 * User-recorded sessions sit in front of seed history. Seed ids win if a
 * persisted row collides with a catalog session.
 */
export function mergeSessions(
  seeds: PracticeSession[],
  extra: PracticeSession[],
): PracticeSession[] {
  const seedIds = new Set(seeds.map((s) => s.id));
  const extras = extra.filter((s) => !seedIds.has(s.id));
  return [...extras, ...seeds].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function userSessionsOnly(
  sessions: PracticeSession[],
  seedIds: Set<string>,
): PracticeSession[] {
  return sessions.filter((s) => !seedIds.has(s.id));
}
