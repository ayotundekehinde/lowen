import {
  createContext,
  useContext,
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
  chordProgressions as seedProgressions,
  exercises as seedExercises,
  loops as seedLoops,
  sessionHistory as seedSessions,
  skills as seedSkills,
  songs as seedSongs,
} from '@/data';

/**
 * In-memory application store.
 *
 * This is intentionally a thin React context wrapping local state seeded from
 * the mock data layer. It is the single place that holds mutable app state, so
 * swapping it for a real client (React Query, a backend, etc.) later means
 * changing only this file — components consume the `usePractice` hook.
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

  /** The session currently queued to be played, if any. */
  activePlan: SessionPlan | null;
  setActivePlan: (plan: SessionPlan | null) => void;

  recordSession: (session: PracticeSession) => void;
  toggleSongFavorite: (songId: string) => void;
  toggleLoopFavorite: (loopId: string) => void;
  updateSongNotes: (songId: string, notes: string) => void;

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

export function PracticeProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<Song[]>(seedSongs);
  const [loops, setLoops] = useState<Loop[]>(seedLoops);
  const [exercises] = useState<Exercise[]>(seedExercises);
  const [progressions] = useState<ChordProgression[]>(seedProgressions);
  const [skills] = useState<Skill[]>(seedSkills);
  const [sessions, setSessions] = useState<PracticeSession[]>(seedSessions);
  const [activePlan, setActivePlan] = useState<SessionPlan | null>(null);

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
