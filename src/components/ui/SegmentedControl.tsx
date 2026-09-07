import { cn } from '@/lib/cn';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  columns?: number;
}

/** A pill-style single-select. Wraps to a grid when `columns` is provided. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  columns,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        'gap-1.5 rounded-2xl border border-line bg-surface p-1.5',
        columns ? 'grid' : 'flex',
        className,
      )}
      style={columns ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : undefined}
      role="tablist"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'focus-ring rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200',
              active
                ? 'bg-elevated text-ink shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset]'
                : 'text-ink-muted hover:text-ink-soft',
            )}
          >
            <span className="block">{opt.label}</span>
            {opt.hint && (
              <span className="mt-0.5 block text-[11px] font-normal text-ink-faint">
                {opt.hint}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
