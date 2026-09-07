import type { MusicalKey, PitchClass } from '@/lib/types';
import { KEY_CHOICES, pitchClassIndex } from '@/lib/music';
import { cn } from '@/lib/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * A small, reusable control for choosing the key a progression is displayed in.
 * It is purely a view control — changing it never mutates progression data.
 *
 * Chevrons step by a semitone; the dropdown jumps directly. The current mode
 * (major/minor) is preserved; only the tonic changes.
 */
export function KeySelector({
  value,
  onChange,
  className,
}: {
  value: MusicalKey;
  onChange: (key: MusicalKey) => void;
  className?: string;
}) {
  const index = pitchClassIndex(value.tonic);
  const suffix = value.mode === 'minor' ? 'm' : '';

  const setIndex = (next: number) => {
    const tonic = KEY_CHOICES[((next % 12) + 12) % 12] as PitchClass;
    onChange({ tonic, mode: value.mode });
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5 rounded-xl border border-line bg-surface p-1',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setIndex(index - 1)}
        className="focus-ring grid h-7 w-7 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-elevated hover:text-ink"
        aria-label="Down a semitone"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="relative">
        <select
          value={KEY_CHOICES[index]}
          onChange={(e) =>
            onChange({ tonic: e.target.value as PitchClass, mode: value.mode })
          }
          className="focus-ring tnum h-7 w-16 cursor-pointer appearance-none rounded-lg bg-transparent text-center text-sm font-semibold text-ink"
          aria-label="Select key"
        >
          {KEY_CHOICES.map((k) => (
            <option key={k} value={k}>
              {k}
              {suffix}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={() => setIndex(index + 1)}
        className="focus-ring grid h-7 w-7 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-elevated hover:text-ink"
        aria-label="Up a semitone"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
