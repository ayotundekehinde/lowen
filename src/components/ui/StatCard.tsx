import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  accent?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = 'var(--color-accent)',
  className,
}: StatCardProps) {
  return (
    <div className={cn('panel panel-hover p-4 sm:p-5', className)}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">
          {label}
        </span>
        {icon && (
          <span
            className="grid h-8 w-8 place-items-center rounded-lg"
            style={{
              color: accent,
              backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)`,
            }}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-ink-muted">{hint}</div>}
    </div>
  );
}
