import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 max-w-xl text-sm text-ink-muted">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
