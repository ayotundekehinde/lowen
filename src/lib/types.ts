/**
 * Core domain model for Lowen.
 *
 * These types describe the shape of every entity in the app. They are kept
 * deliberately free of any UI or storage concerns so the mock data layer in
 * `src/data` can later be swapped for a real API/database without touching the
 * component tree.
 */

export type CategoryId =
  | 'technique'
  | 'theory'
  | 'repertoire'
  | 'creativity'
  | 'ear-training'
  | 'loop-practice';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Intensity = 'chill' | 'normal' | 'push';

/* ------------------------------------------------------------------ *
 * Musical model (number system, keys, progressions)                   *
 *                                                                     *
 * The number system is the transposable core: progressions are stored *
 * as scale degrees (1–7), never as concrete notes, so any progression *
 * can be rendered or transposed into any key at display time.         *
 * ------------------------------------------------------------------ */

/** Scale degree in the number system. */
export type Degree = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Chromatic alteration applied to a degree, e.g. b7 or #4. */
export type Accidental = 'b' | '#';

/** Chord quality. When omitted on a NumberChord, the diatonic quality is used. */
export type ChordQuality =
  | 'maj'
  | 'min'
  | 'dom7'
  | 'maj7'
  | 'min7'
  | 'sus2'
  | 'sus4'
  | 'dim'
  | 'aug'
  | 'add9';

/** A single chord expressed in the number system (key-agnostic). */
export interface NumberChord {
  degree: Degree;
  accidental?: Accidental;
  /** Defaults to the diatonic quality for the degree if omitted. */
  quality?: ChordQuality;
  /** How many bars the chord is held (default 1). Enables vamps. */
  bars?: number;
  /** Slash-chord / inversion bass note as a degree, e.g. 1/3. */
  bassDegree?: Degree;
}

export type ProgressionKind = 'progression' | 'vamp' | 'turnaround';

/** Rhythmic/stylistic feel of a groove. */
export type Feel =
  | 'straight'
  | 'swing'
  | 'shuffle'
  | 'half-time'
  | '6/8'
  | 'triplet'
  | 'afrobeat'
  | 'highlife';

/** A reusable chord progression, stored in the number system. */
export interface ChordProgression {
  id: string;
  name: string;
  kind: ProgressionKind;
  /** The transposable payload — degrees, not notes. */
  chords: NumberChord[];
  timeSignature?: string;
  /** Display default only; not authoritative. */
  suggestedKey?: string;
  style?: string;
  feel?: Feel;
  tags: string[];
}

/** Normalized musical key used for transposition. */
export type PitchClass =
  | 'C'
  | 'Db'
  | 'D'
  | 'Eb'
  | 'E'
  | 'F'
  | 'Gb'
  | 'G'
  | 'Ab'
  | 'A'
  | 'Bb'
  | 'B'
  | 'C#'
  | 'D#'
  | 'F#'
  | 'G#'
  | 'A#';

export interface MusicalKey {
  tonic: PitchClass;
  mode: 'major' | 'minor';
}

/**
 * Finer-grained gospel/bass concepts used to tag exercises (and, later, to
 * filter and generate). Intentionally separate from the 6 top-level categories
 * so the color-coded category taxonomy stays small.
 */
export type ConceptId =
  | 'number-system'
  | 'progressions'
  | 'vamps'
  | 'passing-tones'
  | 'fills'
  | 'groove-pocket'
  | 'playing-changes'
  | 'transposition'
  | 'gospel-grooves';

/** A single practiceable drill drawn on to build sessions. */
export interface Exercise {
  id: string;
  name: string;
  category: CategoryId;
  /** Suggested duration in minutes. */
  durationMin: number;
  instructions: string;
  bpm?: number;
  difficulty: Difficulty;
  tags?: string[];
  /** Gospel/bass concepts this drill develops. */
  concepts?: ConceptId[];
  key?: string;
  progressionId?: string;
  feel?: Feel;
  style?: string;
}

/** A named part of a song the player is learning. */
export interface SongSection {
  id: string;
  name: string;
  /** 0–100 */
  progress: number;
  /** Optional chart for this section (V1.5+ surfaces this in the UI). */
  progressionId?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  key: string;
  bpm: number;
  tuning: string;
  difficulty: Difficulty;
  /** 0–100 overall learning progress. */
  progress: number;
  favorite: boolean;
  sections: SongSection[];
  notes: string;
  /** Ids of loops associated with this song. */
  loopIds: string[];
  /** Ids of chord progressions associated with this song. */
  progressionIds?: string[];
  /** Structured key alongside the display string, for transposition. */
  keyRoot?: MusicalKey;
}

export interface Loop {
  id: string;
  name: string;
  genre: string;
  key: string;
  bpm: number;
  timeSignature: string;
  lengthBars: number;
  difficulty: Difficulty;
  tags: string[];
  favorite: boolean;
  /** Rhythmic feel of the groove. */
  feel?: Feel;
  /** Gospel style, e.g. "Nigerian Gospel" (genre stays for broad grouping). */
  style?: string;
  /** Preferred: reference a shared, reusable progression. */
  progressionId?: string;
  /** Inline progression for one-offs not worth sharing. */
  numberProgression?: NumberChord[];
  /** Structured key alongside the display string, for transposition. */
  keyRoot?: MusicalKey;
}

/** A completed practice session recorded in history. */
export interface PracticeSession {
  id: string;
  /** ISO date string. */
  date: string;
  durationMin: number;
  exercisesCompleted: number;
  exercisesPlanned: number;
  categories: CategoryId[];
  /** 1–5, undefined if not rated. */
  rating?: number;
  focus?: CategoryId[];
  intensity?: Intensity;
}

/** A skill the player is developing, with a mock proficiency level. */
export interface Skill {
  id: string;
  name: string;
  /** 0–100 */
  level: number;
  /** Change over the trailing period, in points. */
  trend: number;
}

/** Aggregate practice statistics. */
export interface Stats {
  currentStreakDays: number;
  bestStreakDays: number;
  totalMinutes: number;
  totalSessions: number;
  /** Per-category minutes, for the distribution chart. */
  minutesByCategory: Record<CategoryId, number>;
  /** Minutes practiced per weekday for the trailing week (Mon–Sun). */
  weeklyMinutes: number[];
}

/** A generative constraint used for loop challenges. */
export interface Challenge {
  id: string;
  prompt: string;
  constraints: string[];
}

/* ------------------------------------------------------------------ *
 * Session-runtime types (used while a session is being played)        *
 * ------------------------------------------------------------------ */

export type PlanItemStatus = 'pending' | 'active' | 'completed' | 'skipped';

/** An exercise placed into a concrete session plan. */
export interface SessionPlanItem {
  id: string;
  exercise: Exercise;
  /** Allotted minutes for this item within the session. */
  durationMin: number;
  status: PlanItemStatus;
}

export interface SessionPlan {
  id: string;
  createdAt: string;
  totalMinutes: number;
  intensity: Intensity;
  focus: CategoryId[];
  items: SessionPlanItem[];
}
