import { Button } from '@/components/ui/Button';
import { formatKey, semitonesBetween } from '@/lib/music';
import { KEY_JUMPS } from '@/lib/keyJump';
import type { MusicalKey } from '@/lib/types';
import { RotateCcw } from 'lucide-react';

export function MdCueBar({
  liveKey,
  writtenKey,
  onJump,
  onReset,
  everyBars,
  onEveryBars,
  cue,
}: {
  liveKey: MusicalKey;
  writtenKey: MusicalKey;
  onJump: (semitones: number) => void;
  onReset: () => void;
  everyBars: number;
  onEveryBars: (bars: number) => void;
  cue?: string | null;
}) {
  const offset = semitonesBetween(writtenKey, liveKey);
  const moved = offset !== 0;

  return (
    <div className="panel space-y-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            MD cue
          </p>
          <p className="mt-0.5 text-sm text-ink-muted">
            Numbers stay put. The key jumps.
            {moved
              ? ` Written ${formatKey(writtenKey)} · live ${formatKey(liveKey)}.`
              : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {KEY_JUMPS.map((j) => (
            <Button
              key={j.semitones}
              variant="secondary"
              size="sm"
              onClick={() => onJump(j.semitones)}
              aria-label={j.aria}
            >
              {j.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            icon={<RotateCcw size={14} />}
            disabled={!moved}
          >
            Written key
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-ink-muted">Auto-jump every</span>
        <select
          value={String(everyBars)}
          onChange={(e) => onEveryBars(Number(e.target.value))}
          className="focus-ring rounded-lg border border-line bg-surface px-2 py-1 text-ink"
          aria-label="Auto key jump interval"
        >
          <option value="0">Off</option>
          <option value="8">8 bars (½ step up)</option>
          <option value="16">16 bars (½ step up)</option>
        </select>
      </div>

      {cue && (
        <p className="rounded-xl bg-accent/15 px-3 py-2 text-sm font-medium text-accent">
          {cue}
        </p>
      )}
    </div>
  );
}
