import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { PillarDot } from '@/components/ui/Badge';
import { PILLARS, pillarColor, SESSION_PRESETS } from '@/lib/pillars';
import type { SessionPresetId } from '@/lib/pillars';
import { generateSession, recommendedSession } from '@/lib/sessionGenerator';
import { formatMinutes } from '@/lib/format';
import { usePractice } from '@/store/practiceStore';
import {
  Play,
  Flame,
  Clock,
  ListChecks,
  Timer,
  Repeat,
  ListMusic,
  Hash,
  Music4,
  Activity,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const { stats, sessions, averageSessionMin, exercises, setActivePlan } =
    usePractice();

  const recommended = useMemo(
    () => recommendedSession(exercises),
    [exercises],
  );

  const startRecommended = () => {
    setActivePlan(recommended);
    navigate('/practice');
  };

  const quickStart = (preset: SessionPresetId, minutes: number) => {
    setActivePlan(
      generateSession(exercises, {
        totalMinutes: minutes,
        weights: SESSION_PRESETS[preset].weights,
      }),
    );
    navigate('/practice');
  };

  const greeting = getGreeting();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={greeting}
        title="What should you practice today?"
        subtitle="Your session is ready. Jump straight in, or pick a quick start below."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recommended session */}
        <section className="lg:col-span-2">
          <div className="panel relative overflow-hidden p-6 sm:p-8">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-[0.07] blur-2xl"
              style={{ background: 'var(--color-accent)' }}
            />
            <div className="flex items-center gap-2 text-accent">
              <Sparkles size={16} />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                Recommended session
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
                  Daily Practice
                </h2>
                <p className="mt-1 text-ink-muted">
                  {formatMinutes(recommended.totalMinutes)} ·{' '}
                  {recommended.items.length} exercises · balanced focus
                </p>
              </div>
            </div>

            <ul className="mt-6 space-y-2.5">
              {recommended.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3"
                >
                  <PillarDot pillar={item.exercise.pillars[0]} />
                  <span className="text-sm font-medium text-ink-soft">
                    {PILLARS[item.exercise.pillars[0]].label}
                  </span>
                  <span className="mx-2 hidden h-px flex-1 bg-line sm:block" />
                  <span className="truncate text-sm text-ink-muted">
                    {item.exercise.name}
                  </span>
                  <span className="tnum ml-auto shrink-0 text-sm font-semibold text-ink sm:ml-0">
                    {item.durationMin} min
                  </span>
                </li>
              ))}
            </ul>

            <Button
              variant="primary"
              size="lg"
              block
              onClick={startRecommended}
              icon={<Play size={20} />}
              className="mt-6 text-base font-semibold tracking-wide"
            >
              START SESSION
            </Button>
          </div>
        </section>

        {/* Weekly stats */}
        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-ink">
            This week
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Streak"
              value={
                <span className="tnum">
                  {stats.currentStreakDays}
                  <span className="ml-1 text-base font-normal text-ink-muted">
                    days
                  </span>
                </span>
              }
              icon={<Flame size={16} />}
            />
            <StatCard
              label="Practiced"
              value={<span className="tnum">{formatMinutes(stats.totalMinutes)}</span>}
              hint="all-time"
              icon={<Clock size={16} />}
              accent={pillarColor('chord-movement')}
            />
            <StatCard
              label="Sessions"
              value={<span className="tnum">{stats.totalSessions}</span>}
              icon={<ListChecks size={16} />}
              accent={pillarColor('ear-training')}
            />
            <StatCard
              label="Avg length"
              value={<span className="tnum">{averageSessionMin}m</span>}
              icon={<Timer size={16} />}
              accent={pillarColor('repertoire')}
            />
          </div>
          <WeekBars />
        </section>
      </div>

      {/* Quick start */}
      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">
          Quick start
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <QuickStartButton
            icon={<Repeat size={20} />}
            label="Practice a Vamp"
            color={pillarColor('vamps')}
            onClick={() => quickStart('vamp', 30)}
          />
          <QuickStartButton
            icon={<ListMusic size={20} />}
            label="Practice a Progression"
            color={pillarColor('chord-movement')}
            onClick={() => quickStart('progression', 30)}
          />
          <QuickStartButton
            icon={<Hash size={20} />}
            label="Number System"
            color={pillarColor('number-system')}
            onClick={() => quickStart('number-system', 30)}
          />
          <QuickStartButton
            icon={<Music4 size={20} />}
            label="Practice a Song"
            color={pillarColor('repertoire')}
            onClick={() => quickStart('song', 30)}
          />
          <QuickStartButton
            icon={<Activity size={20} />}
            label="Groove & Pocket"
            color={pillarColor('groove-pocket')}
            onClick={() => quickStart('groove', 30)}
          />
        </div>
      </section>

      {/* Recent activity teaser */}
      {sessions.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">
              Recent activity
            </h2>
            <button
              onClick={() => navigate('/progress')}
              className="flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-ink"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="panel divide-y divide-line">
            {sessions.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="flex -space-x-1">
                  {s.pillars.slice(0, 4).map((p) => (
                    <span
                      key={p}
                      className="h-2.5 w-2.5 rounded-full ring-2 ring-panel"
                      style={{ backgroundColor: pillarColor(p) }}
                    />
                  ))}
                </div>
                <span className="text-sm text-ink-soft">
                  {formatMinutes(s.durationMin)} session
                </span>
                <span className="ml-auto text-sm text-ink-muted">
                  {s.exercisesCompleted} exercises
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function QuickStartButton({
  icon,
  label,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="panel panel-hover group flex flex-col items-start gap-3 p-4 text-left focus-ring"
    >
      <span
        className="grid h-11 w-11 place-items-center rounded-xl transition-transform group-hover:scale-105"
        style={{
          color,
          backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
        }}
      >
        {icon}
      </span>
      <span className="text-sm font-medium leading-snug text-ink">{label}</span>
    </button>
  );
}

/** Small weekly practice bar chart for the sidebar column. */
function WeekBars() {
  const { stats } = usePractice();
  const max = Math.max(60, ...stats.weeklyMinutes);
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <div className="panel p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
        Weekly activity
      </p>
      <div className="flex items-stretch justify-between gap-2" style={{ height: 72 }}>
        {stats.weeklyMinutes.map((m, i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-md bg-accent/80 transition-[height] duration-500"
                style={{
                  height: `${Math.max(4, (m / max) * 100)}%`,
                  opacity: m === 0 ? 0.2 : 1,
                }}
                title={`${m} min`}
              />
            </div>
            <span className="text-[10px] text-ink-faint">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
