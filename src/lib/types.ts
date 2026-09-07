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
}

/** A named part of a song the player is learning. */
export interface SongSection {
  id: string;
  name: string;
  /** 0–100 */
  progress: number;
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
