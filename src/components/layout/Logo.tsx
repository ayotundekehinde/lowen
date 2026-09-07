import { cn } from '@/lib/cn';

/** The Lowen wordmark: a stylised string/fret glyph plus the name. */
export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface">
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
          <rect x="9" y="5" width="2.6" height="22" rx="1.3" fill="var(--color-accent)" />
          <rect x="15" y="5" width="2.6" height="22" rx="1.3" fill="var(--color-ink-faint)" />
          <rect x="21" y="5" width="2.6" height="22" rx="1.3" fill="var(--color-ink-faint)" />
          <circle cx="10.3" cy="21" r="3" fill="var(--color-accent)" />
        </svg>
      </span>
      {!compact && (
        <span className="font-display text-lg font-semibold tracking-tight text-ink">
          Lowen
        </span>
      )}
    </div>
  );
}
