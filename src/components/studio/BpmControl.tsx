import { cn } from '@/lib/cn';
import { Minus, Plus } from 'lucide-react';

export function BpmControl({
  value,
  onChange,
  min = 40,
  max = 180,
  className,
}: {
  value: number;
  onChange: (bpm: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  const clamp = (n: number) => Math.max(min, Math.min(max, Math.round(n)));

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <button
        type="button"
        className="focus-ring grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-ink-muted hover:text-ink"
        onClick={() => onChange(clamp(value - 2))}
        aria-label="Slower"
      >
        <Minus size={16} />
      </button>
      <div className="min-w-20 text-center">
        <div className="tnum font-display text-2xl font-semibold text-ink">
          {value}
        </div>
        <div className="text-[11px] uppercase tracking-wider text-ink-faint">
          BPM
        </div>
      </div>
      <button
        type="button"
        className="focus-ring grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-ink-muted hover:text-ink"
        onClick={() => onChange(clamp(value + 2))}
        aria-label="Faster"
      >
        <Plus size={16} />
      </button>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-line accent-[var(--color-accent)]"
        aria-label="Tempo"
      />
    </div>
  );
}
