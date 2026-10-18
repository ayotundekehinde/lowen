/**
 * Core domain model for Lowen.
 *
 * These types describe the shape of every entity in the app. They are kept
 * deliberately free of any UI or storage concerns so the mock data layer in
 * `src/data` can later be swapped for a real API/database without touching the
 * component tree.
 */

/**
 * The eleven learning pillars — the canonical, first-class taxonomy that every
 * exercise, session focus and progress statistic is classified against. This is
 * the single learning classification in Lowen (it replaces the old, generic
 * `CategoryId` and the parallel `ConceptId`).
 */
export type PillarId =
  | 'groove-pocket'
  | 'number-system'
  | 'chord-movement'
  | 'vamps'
  | 'passing-notes'
  | 'fills'
  | 'transitions'
  | 'playing-changes'
  | 'ear-training'
  | 'technique'
  | 'repertoire';

/**
 * The musical worlds a Nigerian/Gospel bassist plays in. These are typed
 * contexts — not free-text tags — so they can drive content, filtering and
 * session bias rather than acting as cosmetic labels.
 */
export type GospelStyle =
  | 'nigerian-gospel'
  | 'afro-gospel'
  | 'praise'
  | 'worship'
  | 'highlife'
  | 'afrobeats'
  | 'contemporary-gospel'
  | 'rnb-neo-soul'
  | 'slow-gospel'
  | 'gospel-6-8';

/** Alias: a musical context is expressed as a gospel style. */
export type MusicalContext = GospelStyle;

/** Relative emphasis per pillar, used to weight session generation. */
export type PillarWeights = Partial<Record<PillarId, number>>;

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * How a session is approached — musical preparation language, not fitness
 * framing. Each mode gently scales suggested tempos.
 */
export type SessionMode = 'warm-up' | 'rehearse' | 'service';

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

/**
 * Rhythmic feel of a groove — strictly how the time is subdivided/placed, never
 * a genre or style (those live in {@link GospelStyle}).
 */
export type Feel =
  | 'straight'
  | 'swing'
  | 'shuffle'
  | 'half-time'
  | 'triplet'
  | '6/8'
  | 'syncopated';

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
  /** The gospel context this progression belongs to. */
  context?: GospelStyle;
  feel?: Feel;
  tags: string[];
  /** Pillars this progression is especially useful for practicing. */
  pillars?: PillarId[];
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

/** A single practiceable drill drawn on to build sessions. */
export interface Exercise {
  id: string;
  name: string;
  /**
   * The learning pillars this drill develops. The first entry is the primary
   * pillar (used for colour/label); additional pillars let one drill serve
   * multiple areas and power the weighted session generator.
   */
  pillars: PillarId[];
  /** Suggested duration in minutes. */
  durationMin: number;
  instructions: string;
  bpm?: number;
  difficulty: Difficulty;
  tags?: string[];
  /** The gospel context this drill belongs to, when style-specific. */
  context?: GospelStyle;
  key?: string;
  progressionId?: string;
  feel?: Feel;
}

/** A named part of a song the player is learning. */
export interface SongSection {
  id: string;
  name: string;
  /** 0–100 */
  progress: number;
  /** Shared chart for this section. */
  progressionId?: string;
  /** Shared loop for grooving this section. */
  loopId?: string;
  /** Section-specific gospel context; falls back to the song. */
  context?: GospelStyle;
  /** Display key when this section is in a different key from the song. */
  key?: string;
  /** Structured key alongside the display string. */
  keyRoot?: MusicalKey;
  /** Pillars this section is especially useful for practicing. */
  pillars?: PillarId[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  /** The gospel context this song belongs to. */
  context: GospelStyle;
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
  /** The gospel context this loop belongs to. */
  context: GospelStyle;
  key: string;
  bpm: number;
  timeSignature: string;
  lengthBars: number;
  difficulty: Difficulty;
  tags: string[];
  favorite: boolean;
  /** Rhythmic feel of the groove. */
  feel?: Feel;
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
  /** Pillars touched in this session. */
  pillars: PillarId[];
  /** 1–5, undefined if not rated. */
  rating?: number;
  focus?: PillarId[];
  mode?: SessionMode;
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
  /** Per-pillar minutes, for the distribution chart. */
  minutesByPillar: Record<PillarId, number>;
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

/**
 * Optional musical context attached to a session, e.g. when a session is
 * launched from a progression or loop via "Practice This". Purely informational
 * — it lets the preview and runner show what the session is built around.
 */
export interface SessionContext {
  /**
   * Primary heading shown in the preview/runner.
   * e.g. "Preparing: Chorus", "Vamp Practice", "Practicing: 6 → 2 → 5 → 1".
   */
  heading: string;
  /** Number-system line, e.g. "1 → 4 → 5 → 6". */
  numbers?: string;
  /** Compact musical meta, e.g. "D Major · Nigerian Gospel · Praise". */
  meta?: string;
  /** Optional focus line, e.g. "Practice focus: Groove & Pocket". */
  focusLabel?: string;
  /**
   * Fallback single-line label (heading + numbers + meta) for compact surfaces.
   */
  label: string;
  songId?: string;
  songTitle?: string;
  sectionId?: string;
  sectionName?: string;
  progressionId?: string;
  loopId?: string;
  loopName?: string;
  /** Display key, e.g. "D Major". */
  key?: string;
  /** Human-readable style label, e.g. "Nigerian Gospel". */
  style?: string;
  context?: GospelStyle;
  kind?: ProgressionKind;
  pillars?: PillarId[];
}

export interface SessionPlan {
  id: string;
  createdAt: string;
  totalMinutes: number;
  mode: SessionMode;
  focus: PillarId[];
  items: SessionPlanItem[];
  context?: SessionContext;
}
