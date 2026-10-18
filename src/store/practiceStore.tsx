import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  ChordProgression,
  Exercise,
  Loop,
  PracticeSession,
  SessionPlan,
  Skill,
  Song,
  SongSection,
  Stats,
} from '@/lib/types';
import {
  getLoopsByProgressionId,
  getSongsByProgressionId,
  resolveSection,
  type ResolvedSection,
} from '@/lib/relations';
import {
  averageSessionMinutes,
  computeStats,
  weeklyMinutesTotal,
} from '@/lib/stats';
import {
  applyLoopOverrides,
  applySongOverrides,
  EMPTY_EAR_LAB,
  loadPersisted,
  loopOverridesFrom,
  mergeSessions,
  savePersisted,
  songOverridesFrom,
  userSessionsOnly,
  type EarLabStats,
} from '@/lib/storage';
import { applyEarResult } from '@/lib/earLab';
import {
  chordProgressions as seedProgressions,
  exercises as seedExercises,
  loops as seedLoops,
  sessionHistory as seedSessions,
  skills as seedSkills,
  songs as seedSongs,
} from '@/data';

const SEED_SESSION_IDS = new Set(seedSessions.map((s) => s.id));

/**
 * Application store. Seed data hydrates from `src/data`; sessions, favorites,
 * notes and ear-lab stats persist in localStorage so a reload keeps the desk.
 */
interface PracticeStore {
  songs: Song[];
  loops: Loop[];
  exercises: Exercise[];
  progressions: ChordProgression[];
  skills: Skill[];
  sessions: PracticeSession[];
  stats: Stats;
  averageSessionMin: number;
  weekMinutes: number;
  earLab: EarLabStats;

  /** The session currently queued to be played, if any. */
  activePlan: SessionPlan | null;
  setActivePlan: (plan: SessionPlan | null) => void;

  recordSession: (session: PracticeSession) => void;
  toggleSongFavorite: (songId: string) => void;
  toggleLoopFavorite: (loopId: string) => void;
  updateSongNotes: (songId: string, notes: string) => void;
  recordEarGuess: (correct: boolean) => void;

  /** Selectors that read the store's *mutable* copies (single source of truth). */
  getSongById: (id: string) => Song | undefined;
  getLoopById: (id: string) => Loop | undefined;
  getProgressionById: (id: string) => ChordProgression | undefined;
  resolveSongSection: (
    song: Song,
    section: SongSection,
  ) => ResolvedSection;
  loopsForProgression: (progressionId: string) => Loop[];
  songsForProgression: (progressionId: string) => Song[];
}

const PracticeContext = createContext<PracticeStore | null>(null);

function hydrate() {
  const persisted = loadPersisted();
  return {
    songs: applySongOverrides(seedSongs, persisted.songOverrides),
    loops: applyLoopOverrides(seedLoops, persisted.loopOverrides),
    sessions: mergeSessions(seedSessions, persisted.sessions),
    earLab: persisted.earLab,
  };
}

export function PracticeProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(() => hydrate(), []);
  const [songs, setSongs] = useState<Song[]>(initial.songs);
  const [loops, setLoops] = useState<Loop[]>(initial.loops);
  const [exercises] = useState<Exercise[]>(seedExercises);
  const [progressions] = useState<ChordProgression[]>(seedProgressions);
  const [skills] = useState<Skill[]>(seedSkills);
  const [sessions, setSessions] = useState<PracticeSession[]>(initial.sessions);
  const [earLab, setEarLab] = useState<EarLabStats>(
    initial.earLab ?? EMPTY_EAR_LAB,
  );
  const [activePlan, setActivePlan] = useState<SessionPlan | null>(null);

  useEffect(() => {
    savePersisted({
      version: 1,
      sessions: userSessionsOnly(sessions, SEED_SESSION_IDS),
      songOverrides: songOverridesFrom(songs, seedSongs),
      loopOverrides: loopOverridesFrom(loops, seedLoops),
      earLab,
    });
  }, [sessions, songs, loops, earLab]);

  const stats = useMemo(() => computeStats(sessions), [sessions]);
  const averageSessionMin = useMemo(
    () => averageSessionMinutes(sessions),
    [sessions],
  );
  const weekMinutes = useMemo(() => weeklyMinutesTotal(stats), [stats]);

  const value = useMemo<PracticeStore>(
    () => ({
      songs,
      loops,
      exercises,
      progressions,
      skills,
      sessions,
      stats,
      averageSessionMin,
      weekMinutes,
      earLab,
      activePlan,
      setActivePlan,
      getSongById: (id) => songs.find((s) => s.id === id),
      getLoopById: (id) => loops.find((l) => l.id === id),
      getProgressionById: (id) => progressions.find((p) => p.id === id),
      resolveSongSection: (song, section) =>
        resolveSection(song, section, progressions, loops),
      loopsForProgression: (progressionId) =>
        getLoopsByProgressionId(loops, progressionId),
      songsForProgression: (progressionId) =>
        getSongsByProgressionId(songs, progressionId),
      recordSession: (session) =>
        setSessions((prev) => [session, ...prev]),
      toggleSongFavorite: (songId) =>
        setSongs((prev) =>
          prev.map((s) =>
            s.id === songId ? { ...s, favorite: !s.favorite } : s,
          ),
        ),
      toggleLoopFavorite: (loopId) =>
        setLoops((prev) =>
          prev.map((l) =>
            l.id === loopId ? { ...l, favorite: !l.favorite } : l,
          ),
        ),
      updateSongNotes: (songId, notes) =>
        setSongs((prev) =>
          prev.map((s) => (s.id === songId ? { ...s, notes } : s)),
        ),
      recordEarGuess: (correct) =>
        setEarLab((prev) => applyEarResult(prev, correct)),
    }),
    [
      songs,
      loops,
      exercises,
      progressions,
      skills,
      sessions,
      stats,
      averageSessionMin,
      weekMinutes,
      earLab,
      activePlan,
    ],
  );

  return (
    <PracticeContext.Provider value={value}>
      {children}
    </PracticeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePractice(): PracticeStore {
  const ctx = useContext(PracticeContext);
  if (!ctx) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return ctx;
}
