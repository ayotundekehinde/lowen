import { Button } from '@/components/ui/Button';
import { CategoryBadge } from '@/components/ui/Badge';
import { categoryColor, INTENSITIES } from '@/lib/categories';
import { formatMinutes } from '@/lib/format';
import type { SessionPlan } from '@/lib/types';
import { Gauge, Play, RefreshCw } from 'lucide-react';

interface PlanPreviewProps {
  plan: SessionPlan;
  onStart: () => void;
  onRegenerate: () => void;
}

export function PlanPreview({ plan, onStart, onRegenerate }: PlanPreviewProps) {
  return (
    <div className="animate-[var(--animate-rise)]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Your session
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
            {formatMinutes(plan.totalMinutes)} · {plan.items.length} exercises
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            {INTENSITIES[plan.intensity].label} intensity
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onRegenerate} icon={<RefreshCw size={15} />}>
            Regenerate
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={onStart}
            icon={<Play size={18} />}
            className="min-w-40"
          >
            Start session
          </Button>
        </div>
      </div>

      <ol className="space-y-3">
        {plan.items.map((item, i) => {
          const color = categoryColor(item.exercise.category);
          return (
            <li key={item.id} className="panel panel-hover flex items-center gap-4 p-4">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-sm font-semibold"
                style={{
                  color,
                  backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
                }}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-ink">{item.exercise.name}</h3>
                  <CategoryBadge category={item.exercise.category} />
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-ink-muted">
                  {item.exercise.instructions}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div className="tnum font-display text-lg font-semibold text-ink">
                  {item.durationMin}
                  <span className="ml-0.5 text-xs font-normal text-ink-muted">min</span>
                </div>
                {item.exercise.bpm != null && (
                  <div className="mt-0.5 flex items-center justify-end gap-1 text-xs text-ink-muted">
                    <Gauge size={12} />
                    <span className="tnum">{item.exercise.bpm}</span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
