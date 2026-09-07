import { cn } from '@/lib/cn';

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  color?: string; // CSS color
  height?: number;
}

export function ProgressBar({
  value,
  className,
  color = 'var(--color-accent)',
  height = 6,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn('w-full overflow-hidden rounded-full bg-elevated', className)}
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

interface RadialProgressProps {
  value: number; // 0–100
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export function RadialProgress({
  value,
  size = 128,
  stroke = 10,
  color = 'var(--color-accent)',
  trackColor = 'var(--color-elevated)',
  children,
  className,
}: RadialProgressProps) {
  const pct = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div
      className={cn('relative inline-grid place-items-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}
