import { useEffect, useState } from 'react';
import { useCountdown } from '@/hooks/useCountdown';
import { useMetronome } from '@/hooks/useMetronome';
import { TimerDial } from './TimerDial';
import { Button } from '@/components/ui/Button';
import { PillarBadge, DifficultyBadge } from '@/components/ui/Badge';
import { pillarColor, PILLARS } from '@/lib/pillars';
import { parseMeter } from '@/lib/metronome';
import { unlockAudio } from '@/lib/audio';
import type { SessionPlanItem } from '@/lib/types';
import {
  Check,
  Pause,
  Play,
  Plus,
  SkipForward,
  Gauge,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface ExercisePlayerProps {
  item: SessionPlanItem;
  index: number;
  total: number;
  onComplete: () => void;
  onSkip: () => void;
}

export function ExercisePlayer({
  item,
  index,
  total,
  onComplete,
  onSkip,
}: ExercisePlayerProps) {
  const seconds = item.durationMin * 60;
  const { exercise } = item;
  const primaryPillar = exercise.pillars[0];
  const color = pillarColor(primaryPillar);

  const timer = useCountdown({
    seconds,
    onComplete,
  });

  const [click, setClick] = useState(true);
  const meter = parseMeter(undefined, exercise.feel);
  const bpm = exercise.bpm ?? 90;
  const { start: startClick, stop: stopClick } = useMetronome({
    bpm,
    meter,
    click,
  });

  useEffect(() => {
    if (timer.running && exercise.bpm != null) {
      void unlockAudio().then(() => startClick());
    } else {
      stopClick();
    }
  }, [timer.running, exercise.bpm, startClick, stopClick]);

  useEffect(() => () => stopClick(), [stopClick]);

  return (
    <div className="animate-[var(--animate-rise)]">
      <div className="mb-4 flex items-center justify-between text-sm text-ink-muted">
        <span className="tnum">
          Exercise {index + 1} / {total}
        </span>
        <span>{PILLARS[primaryPillar].label}</span>
      </div>

      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        {/* Details */}
        <div className="order-2 lg:order-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {exercise.pillars.slice(0, 2).map((p) => (
              <PillarBadge key={p} pillar={p} />
            ))}
            <DifficultyBadge difficulty={exercise.difficulty} />
          </div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {exercise.name}
          </h2>
          <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-ink-soft">
            {exercise.instructions}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {exercise.bpm != null && (
              <div
                className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2"
                style={{ color }}
              >
                <Gauge size={16} />
                <span className="tnum text-sm font-semibold text-ink">
                  {exercise.bpm} BPM
                </span>
                {timer.running && (
                  <span
                    className="ml-1 h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: color,
                      animation: `pulse-ring ${(60 / exercise.bpm).toFixed(3)}s ease-out infinite`,
                    }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => setClick((c) => !c)}
                  className="focus-ring ml-1 rounded-md p-1 text-ink-muted hover:text-ink"
                  aria-label={click ? 'Mute metronome' : 'Enable metronome'}
                >
                  {click ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </button>
              </div>
            )}
            <div className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink-soft">
              <span className="tnum font-semibold text-ink">
                {item.durationMin}
              </span>{' '}
              min planned
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="order-1 flex flex-col items-center gap-6 lg:order-2">
          <TimerDial
            remaining={timer.remaining}
            total={seconds}
            color={color}
            label={timer.running ? 'focus' : 'ready'}
          />
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => timer.addSeconds(60)}
              icon={<Plus size={15} />}
              aria-label="Add one minute"
            >
              1:00
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={timer.toggle}
              icon={timer.running ? <Pause size={18} /> : <Play size={18} />}
              className="min-w-32"
            >
              {timer.running ? 'Pause' : timer.remaining < seconds ? 'Resume' : 'Start'}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onSkip} icon={<SkipForward size={16} />}>
          Skip
        </Button>
        <Button
          variant="primary"
          onClick={onComplete}
          icon={<Check size={18} />}
          className="sm:min-w-48"
          size="lg"
        >
          Complete exercise
        </Button>
      </div>
    </div>
  );
}
