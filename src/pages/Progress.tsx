import { useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressBar } from '@/components/ui/Progress';
import { CategoryBadge } from '@/components/ui/Badge';
import { CATEGORIES, CATEGORY_LIST, categoryColor } from '@/lib/categories';
import { formatMinutes, relativeDay } from '@/lib/format';
import { usePractice } from '@/store/practiceStore';
import {
  Clock,
  Flame,
  ListChecks,
  Timer,
  TrendingUp,
  Star,
} from 'lucide-react';

export function Progress() {
  const { stats, sessions, skills, averageSessionMin } = usePractice();

  const distribution = useMemo(() => {
    const entries = CATEGORY_LIST.map((c) => ({
      category: c.id,
      minutes: Math.round(stats.minutesByCategory[c.id]),
    }));
    const max = Math.max(1, ...entries.map((e) => e.minutes));
    const total = entries.reduce((sum, e) => sum + e.minutes, 0) || 1;
    return { entries, max, total };
  }, [stats]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Progress"
        title="Your practice, measured"
        subtitle="Trends, distribution and skill growth from your recent sessions."
      />

      {/* Statistics */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total time"
          value={<span className="tnum">{formatMinutes(stats.totalMinutes)}</span>}
          hint="all-time"
          icon={<Clock size={16} />}
        />
        <StatCard
          label="Sessions"
          value={<span className="tnum">{stats.totalSessions}</span>}
          hint="completed"
          icon={<ListChecks size={16} />}
          accent="var(--color-theory)"
        />
        <StatCard
          label="Avg session"
          value={<span className="tnum">{averageSessionMin}m</span>}
          icon={<Timer size={16} />}
          accent="var(--color-repertoire)"
        />
        <StatCard
          label="Streak"
          value={
            <span className="tnum">
              {stats.currentStreakDays}
              <span className="ml-1 text-base font-normal text-ink-muted">
                / {stats.bestStreakDays}
              </span>
            </span>
          }
          hint="current / best"
          icon={<Flame size={16} />}
          accent="var(--color-technique)"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Distribution */}
        <section className="panel p-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Practice distribution
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Where your time has gone recently.
          </p>
          <div className="mt-5 space-y-4">
            {distribution.entries.map(({ category, minutes }) => {
              const pct = Math.round(
                (minutes / distribution.total) * 100,
              );
              return (
                <div key={category}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-ink-soft">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: categoryColor(category) }}
                      />
                      {CATEGORIES[category].label}
                    </span>
                    <span className="tnum text-ink-muted">
                      {formatMinutes(minutes)}
                      <span className="ml-1.5 text-ink-faint">{pct}%</span>
                    </span>
                  </div>
                  <ProgressBar
                    value={(minutes / distribution.max) * 100}
                    color={categoryColor(category)}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Skills */}
        <section className="panel p-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Skill overview
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Mock proficiency across core bass skills.
          </p>
          <div className="mt-5 space-y-4">
            {skills.map((skill) => (
              <div key={skill.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink-soft">{skill.name}</span>
                  <span className="flex items-center gap-2">
                    <span className="tnum text-ink">{skill.level}</span>
                    {skill.trend > 0 && (
                      <span className="tnum flex items-center gap-0.5 text-xs text-good">
                        <TrendingUp size={12} />+{skill.trend}
                      </span>
                    )}
                  </span>
                </div>
                <ProgressBar value={skill.level} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent sessions */}
      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">
          Recent sessions
        </h2>
        <div className="panel divide-y divide-line overflow-hidden">
          {sessions.slice(0, 8).map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4"
            >
              <div className="w-24 shrink-0">
                <div className="text-sm font-medium text-ink">
                  {relativeDay(s.date)}
                </div>
                <div className="tnum text-xs text-ink-muted">
                  {formatMinutes(s.durationMin)}
                </div>
              </div>

              <div className="flex flex-1 flex-wrap gap-1.5">
                {s.categories.map((c) => (
                  <CategoryBadge key={c} category={c} withDot={false} />
                ))}
              </div>

              <div className="flex shrink-0 items-center gap-4 text-sm text-ink-muted">
                <span className="tnum">
                  {s.exercisesCompleted}/{s.exercisesPlanned}
                </span>
                {s.rating != null && (
                  <span className="flex items-center gap-1 text-accent">
                    <Star size={13} fill="var(--color-accent)" />
                    <span className="tnum">{s.rating}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-ink-muted">
              No sessions yet. Complete your first practice to see it here.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
