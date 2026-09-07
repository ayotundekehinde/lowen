import { RadialProgress } from '@/components/ui/Progress';
import { formatClock } from '@/lib/format';

interface TimerDialProps {
  remaining: number;
  total: number;
  color?: string;
  size?: number;
  label?: string;
}

export function TimerDial({
  remaining,
  total,
  color = 'var(--color-accent)',
  size = 220,
  label,
}: TimerDialProps) {
  const pct = total > 0 ? (remaining / total) * 100 : 0;
  return (
    <RadialProgress value={pct} size={size} stroke={12} color={color}>
      <div className="text-center">
        <div className="tnum font-display text-4xl font-semibold text-ink sm:text-5xl">
          {formatClock(remaining)}
        </div>
        {label && (
          <div className="mt-1 text-xs uppercase tracking-widest text-ink-muted">
            {label}
          </div>
        )}
      </div>
    </RadialProgress>
  );
}
