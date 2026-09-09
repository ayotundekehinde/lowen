import { ListMusic } from 'lucide-react';
import type { SessionContext } from '@/lib/types';

/** Compact musical banner for PlanPreview and SessionRunner. */
export function SessionContextBanner({
  context,
  compact = false,
}: {
  context: SessionContext;
  compact?: boolean;
}) {
  const showNumbers =
    Boolean(context.numbers) &&
    !context.heading.includes(context.numbers ?? '');

  if (compact) {
    return (
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-accent">
          {context.heading}
        </p>
        {showNumbers && (
          <p className="tnum truncate text-sm text-ink-soft">{context.numbers}</p>
        )}
        {context.meta && (
          <p className="truncate text-xs text-ink-muted">{context.meta}</p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl border border-accent/25 bg-accent/10 px-4 py-3">
      <ListMusic size={18} className="mt-0.5 shrink-0 text-accent" />
      <div className="min-w-0">
        <p className="font-display text-sm font-semibold text-ink">
          {context.heading}
        </p>
        {context.focusLabel && (
          <p className="mt-0.5 text-xs text-ink-muted">{context.focusLabel}</p>
        )}
        {showNumbers && (
          <p className="tnum mt-1 text-sm font-medium text-accent">
            {context.numbers}
          </p>
        )}
        {context.meta && (
          <p className="mt-0.5 text-xs text-ink-muted">{context.meta}</p>
        )}
      </div>
    </div>
  );
}
