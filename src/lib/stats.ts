import type { CategoryId, PracticeSession, Stats } from './types';
import { CATEGORY_LIST } from './categories';

/**
 * Totals accumulated before the tracked history window. Keeps lifetime numbers
 * feeling realistic without needing thousands of mock session records.
 */
export const LIFETIME_BASELINE = {
  minutes: 4120,
  sessions: 96,
  bestStreakDays: 21,
};

function emptyCategoryMap(): Record<CategoryId, number> {
  return CATEGORY_LIST.reduce(
    (acc, c) => {
      acc[c.id] = 0;
      return acc;
    },
    {} as Record<CategoryId, number>,
  );
}

/** Day index Mon=0 … Sun=6. */
function weekdayIndex(d: Date): number {
  return (d.getDay() + 6) % 7;
}

/**
 * Compute the current consecutive-day streak ending today (or yesterday) from a
 * set of sessions.
 */
export function computeStreak(sessions: PracticeSession[]): number {
  if (sessions.length === 0) return 0;
  const days = new Set(
    sessions.map((s) => {
      const d = new Date(s.date);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    }),
  );

  const dayMs = 86400000;
  const today = new Date();
  const start = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).getTime();

  // Allow the streak to count from today or yesterday.
  let cursor = days.has(start) ? start : start - dayMs;
  if (!days.has(cursor)) return 0;

  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor -= dayMs;
  }
  return streak;
}

/** Aggregate a set of sessions into displayable statistics. */
export function computeStats(sessions: PracticeSession[]): Stats {
  const minutesByCategory = emptyCategoryMap();
  const weeklyMinutes = [0, 0, 0, 0, 0, 0, 0];

  const now = new Date();
  const weekStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();

  for (const s of sessions) {
    const perCat = s.categories.length
      ? s.durationMin / s.categories.length
      : 0;
    for (const c of s.categories) {
      minutesByCategory[c] += perCat;
    }

    const d = new Date(s.date);
    const diffDays = Math.round(
      (weekStart - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) /
        86400000,
    );
    if (diffDays >= 0 && diffDays < 7) {
      weeklyMinutes[weekdayIndex(d)] += s.durationMin;
    }
  }

  const trackedMinutes = sessions.reduce((sum, s) => sum + s.durationMin, 0);
  const totalMinutes = trackedMinutes + LIFETIME_BASELINE.minutes;
  const totalSessions = sessions.length + LIFETIME_BASELINE.sessions;
  const currentStreakDays = computeStreak(sessions);

  return {
    currentStreakDays,
    bestStreakDays: Math.max(LIFETIME_BASELINE.bestStreakDays, currentStreakDays),
    totalMinutes,
    totalSessions,
    minutesByCategory,
    weeklyMinutes,
  };
}

/** Average session length in minutes across the tracked window. */
export function averageSessionMinutes(sessions: PracticeSession[]): number {
  if (sessions.length === 0) return 0;
  const total = sessions.reduce((sum, s) => sum + s.durationMin, 0);
  return Math.round(total / sessions.length);
}

/** Minutes practiced this calendar week (Mon–Sun). */
export function weeklyMinutesTotal(stats: Stats): number {
  return stats.weeklyMinutes.reduce((a, b) => a + b, 0);
}
