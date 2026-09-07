import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CategoryBadge } from '@/components/ui/Badge';
import { formatMinutes } from '@/lib/format';
import { CATEGORIES } from '@/lib/categories';
import type { CategoryId, SessionPlan } from '@/lib/types';
import { Check, Star, Trophy, X } from 'lucide-react';

interface SessionSummaryProps {
  plan: SessionPlan;
  completedCount: number;
  minutes: number;
  categories: CategoryId[];
  onSave: (rating: number) => void;
  onDiscard: () => void;
}

export function SessionSummary({
  plan,
  completedCount,
  minutes,
  categories,
  onSave,
  onDiscard,
}: SessionSummaryProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  return (
    <div className="mx-auto max-w-2xl animate-[var(--animate-rise)]">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl border border-line bg-surface text-accent">
          <Trophy size={30} />
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Session complete
        </h1>
        <p className="mt-2 text-ink-muted">
          Nice work. Here's how this one went.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="panel p-4 text-center">
          <div className="font-display text-2xl font-semibold text-ink">
            {formatMinutes(minutes)}
          </div>
          <div className="mt-1 text-xs text-ink-muted">Total time</div>
        </div>
        <div className="panel p-4 text-center">
          <div className="font-display text-2xl font-semibold text-ink">
            {completedCount}
            <span className="text-ink-faint">/{plan.items.length}</span>
          </div>
          <div className="mt-1 text-xs text-ink-muted">Exercises done</div>
        </div>
        <div className="panel col-span-2 p-4 text-center sm:col-span-1">
          <div className="font-display text-2xl font-semibold text-ink capitalize">
            {plan.intensity === 'push' ? 'Push' : plan.intensity}
          </div>
          <div className="mt-1 text-xs text-ink-muted">Intensity</div>
        </div>
      </div>

      <div className="panel mt-3 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Categories practiced
        </p>
        {categories.length ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <CategoryBadge key={c} category={c} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-muted">No exercises completed.</p>
        )}
      </div>

      <div className="panel mt-3 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          How did it feel?
        </p>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = n <= (hovered || rating);
            return (
              <button
                key={n}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                className="focus-ring rounded-lg p-1 transition-transform hover:scale-110"
                aria-label={`Rate ${n} of 5`}
              >
                <Star
                  size={30}
                  className={active ? 'text-accent' : 'text-line-strong'}
                  fill={active ? 'var(--color-accent)' : 'none'}
                />
              </button>
            );
          })}
          {rating > 0 && (
            <span className="ml-2 text-sm text-ink-muted">{rating} / 5</span>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={onDiscard} icon={<X size={16} />}>
          Discard
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => onSave(rating)}
          icon={<Check size={18} />}
          className="sm:min-w-56"
        >
          Save session
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-ink-faint">
        {categories
          .map((c) => CATEGORIES[c].label)
          .slice(0, 3)
          .join(' · ') || 'Come back tomorrow to keep the streak alive'}
      </p>
    </div>
  );
}
