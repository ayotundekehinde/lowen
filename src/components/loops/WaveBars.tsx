import { cn } from '@/lib/cn';

interface WaveBarsProps {
  playing: boolean;
  bars?: number;
  className?: string;
  color?: string;
  /** Static heights used when not playing, keeps a consistent silhouette. */
  seed?: number[];
}

const DEFAULT_SEED = [
  0.4, 0.7, 0.5, 0.9, 0.6, 0.35, 0.8, 0.55, 0.7, 0.45, 0.85, 0.5, 0.65, 0.3,
  0.75, 0.5,
];

/**
 * A lightweight faux-waveform / equalizer. Purely decorative — it fakes audio
 * playback until real audio files are wired in.
 */
export function WaveBars({
  playing,
  bars = 16,
  className,
  color = 'var(--color-accent)',
  seed = DEFAULT_SEED,
}: WaveBarsProps) {
  return (
    <div className={cn('flex items-end gap-[3px]', className)} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => {
        const base = seed[i % seed.length];
        return (
          <span
            key={i}
            className="w-[3px] rounded-full"
            style={{
              height: `${Math.round(base * 100)}%`,
              backgroundColor: color,
              opacity: playing ? 0.9 : 0.35,
              transformOrigin: 'bottom',
              animation: playing
                ? `wave 0.9s ease-in-out ${(i % 6) * 0.08}s infinite alternate`
                : 'none',
            }}
          />
        );
      })}
    </div>
  );
}
