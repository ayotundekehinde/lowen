import { useMemo, useState } from 'react';
import { ExercisePlayer } from './ExercisePlayer';
import { SessionSummary } from './SessionSummary';
import { SessionContextBanner } from './SessionContextBanner';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { pillarColor } from '@/lib/pillars';
import { formatMinutes } from '@/lib/format';
import type { PillarId, PlanItemStatus, PracticeSession, SessionPlan } from '@/lib/types';
import { usePractice } from '@/store/practiceStore';
import { Check, SkipForward, X } from 'lucide-react';

interface SessionRunnerProps {
  plan: SessionPlan;
  onExit: () => void;
}

let savedCounter = 0;

export function SessionRunner({ plan, onExit }: SessionRunnerProps) {
  const { recordSession } = usePractice();
  const [statuses, setStatuses] = useState<PlanItemStatus[]>(
    plan.items.map((_, i) => (i === 0 ? 'active' : 'pending')),
  );
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<'running' | 'summary'>('running');

  const advance = (status: 'completed' | 'skipped') => {
    setStatuses((prev) => {
      const next = [...prev];
      next[current] = status;
      if (current + 1 < next.length) next[current + 1] = 'active';
      return next;
    });
    if (current + 1 < plan.items.length) {
      setCurrent((c) => c + 1);
    } else {
      setPhase('summary');
    }
  };

  const completedItems = useMemo(
    () => plan.items.filter((_, i) => statuses[i] === 'completed'),
    [plan.items, statuses],
  );

  const summaryData = useMemo(() => {
    const minutes = completedItems.reduce((sum, it) => sum + it.durationMin, 0);
    const pillars = Array.from(
      new Set(completedItems.flatMap((it) => it.exercise.pillars)),
    ) as PillarId[];
    return { minutes, pillars };
  }, [completedItems]);

  const handleSave = (rating: number) => {
    savedCounter += 1;
    const session: PracticeSession = {
      id: `sess-live-${Date.now()}-${savedCounter}`,
      date: new Date().toISOString(),
      durationMin: summaryData.minutes || plan.totalMinutes,
      exercisesCompleted: completedItems.length,
      exercisesPlanned: plan.items.length,
      pillars: summaryData.pillars,
      rating: rating || undefined,
      focus: plan.focus,
      mode: plan.mode,
    };
    recordSession(session);
    onExit();
  };

  if (phase === 'summary') {
    return (
      <SessionSummary
        plan={plan}
        completedCount={completedItems.length}
        minutes={summaryData.minutes}
        pillars={summaryData.pillars}
        onSave={handleSave}
        onDiscard={onExit}
      />
    );
  }

  return (
    <div>
      {/* Session header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Live session
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {formatMinutes(plan.totalMinutes)} · {plan.items.length} exercises
          </p>
          {plan.context && (
            <div className="mt-1">
              <SessionContextBanner context={plan.context} compact />
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={onExit} icon={<X size={15} />}>
          End
        </Button>
      </div>

      {/* Step rail */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
        {plan.items.map((it, i) => {
          const status = statuses[i];
          const color = pillarColor(it.exercise.pillars[0]);
          const done = status === 'completed';
          const skipped = status === 'skipped';
          return (
            <div
              key={it.id}
              className={cn(
                'flex min-w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors',
                status === 'active'
                  ? 'border-line-strong bg-elevated text-ink'
                  : 'border-line text-ink-muted',
              )}
            >
              <span
                className="grid h-4 w-4 place-items-center rounded-full text-[9px]"
                style={{
                  backgroundColor: done
                    ? color
                    : `color-mix(in srgb, ${color} 20%, transparent)`,
                  color: done ? '#000' : color,
                }}
              >
                {done ? (
                  <Check size={10} strokeWidth={3} />
                ) : skipped ? (
                  <SkipForward size={9} />
                ) : (
                  i + 1
                )}
              </span>
              <span className="whitespace-nowrap">{it.exercise.name}</span>
            </div>
          );
        })}
      </div>

      <div className="panel p-6 sm:p-8">
        <ExercisePlayer
          key={plan.items[current].id}
          item={plan.items[current]}
          index={current}
          total={plan.items.length}
          onComplete={() => advance('completed')}
          onSkip={() => advance('skipped')}
        />
      </div>
    </div>
  );
}
