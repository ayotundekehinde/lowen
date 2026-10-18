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
import { sundaySetForDate, SETLIST_SLOT_LABEL } from '@/data/setlists';
import { sessionForWeakest, weakestPillars } from '@/lib/recommend';
import { GOSPEL_STYLES } from '@/lib/styles';
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
  AudioLines,
  Ear,
} from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const {
    stats,
    sessions,
    averageSessionMin,
    exercises,
    setActivePlan,
    getSongById,
  } = usePractice();

  const recommended = useMemo(
    () => recommendedSession(exercises),
    [exercises],
  );

  const sunday = useMemo(() => sundaySetForDate(), []);
  const sundaySongs = sunday.items
    .map((item) => ({ item, song: getSongById(item.songId) }))
    .filter((row) => row.song);

  const weak = useMemo(
    () => weakestPillars(stats.minutesByPillar, 3),
    [stats],
  );

  const startRecommended = () => {
    setActivePlan(recommended);
    navigate('/practice');
  };

  const startWeakest = () => {
    setActivePlan(sessionForWeakest(exercises, stats));
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
        title="Ready for Sunday?"
        subtitle="A set, a click, and the numbers. Practice what you’ll actually play."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6">
          <div className="panel relative overflow-hidden p-6 sm:p-8">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-[0.07] blur-2xl"
              style={{ background: 'var(--color-accent)' }}
            />
            <div className="flex items-center gap-2 text-accent">
              <Sparkles size={16} />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                Today’s session
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
                  Daily Practice
                </h2>
                <p className="mt-1 text-ink-muted">
                  {formatMinutes(recommended.totalMinutes)} ·{' '}
                  {recommended.items.length} exercises · balanced for service
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

          <section className="panel p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  This Sunday
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-ink">
                  {sunday.title}
                </h2>
                <p className="text-sm text-ink-muted">
                  {sunday.occasion} · {GOSPEL_STYLES[sunday.context].label}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/studio?lab=bandstand')}
                icon={<AudioLines size={14} />}
              >
                Bandstand
              </Button>
            </div>
            <ol className="divide-y divide-line rounded-xl border border-line">
              {sundaySongs.map(({ item, song }, i) => (
                <li key={item.songId}>
                  <button
                    onClick={() => navigate(`/library/song/${song!.id}`)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-elevated/60"
                  >
                    <span className="tnum w-5 text-xs text-ink-faint">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {song!.title}
                      </p>
                      <p className="truncate text-xs text-ink-muted">
                        {SETLIST_SLOT_LABEL[item.slot]}
                        {item.note ? ` · ${item.note}` : ''}
                      </p>
                    </div>
                    <span className="tnum shrink-0 text-xs text-ink-faint">
                      {song!.key} · {song!.bpm}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </section>
        </section>

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

          <div className="panel p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Needs attention
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Least time this stretch — lean here before service.
            </p>
            <ul className="mt-3 space-y-2">
              {weak.map((id) => (
                <li key={id} className="flex items-center gap-2 text-sm">
                  <PillarDot pillar={id} />
                  <span className="text-ink">{PILLARS[id].label}</span>
                </li>
              ))}
            </ul>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={startWeakest}
              icon={<Play size={14} />}
            >
              Practice the weak spots
            </Button>
          </div>
        </section>
      </div>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">
          Quick start
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
          <QuickStartButton
            icon={<Ear size={20} />}
            label="Ear Lab"
            color={pillarColor('ear-training')}
            onClick={() => navigate('/studio?lab=ear')}
          />
        </div>
      </section>

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
