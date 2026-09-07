import { useMemo } from 'react';
import type { ChordProgression, MusicalKey, NumberChord } from '@/lib/types';
import { parseKey, renderProgression, formatKey } from '@/lib/music';
import { cn } from '@/lib/cn';

/**
 * Renders a progression as a row of number-system degrees with the concrete
 * chord symbols below each — the two views side by side. The rendering key can
 * be overridden (this is what a transposition control will drive later).
 */
export function ProgressionView({
  chords,
  musicKey,
  className,
}: {
  chords: NumberChord[];
  musicKey: MusicalKey;
  className?: string;
}) {
  const rendered = useMemo(
    () => renderProgression(chords, musicKey),
    [chords, musicKey],
  );

  return (
    <div className={cn('flex flex-wrap items-stretch gap-2', className)}>
      {rendered.map((c, i) => (
        <div
          key={i}
          className="flex min-w-14 flex-col items-center rounded-lg border border-line bg-surface px-3 py-2"
        >
          <span className="tnum font-display text-lg font-semibold leading-none text-accent">
            {c.numberLabel}
          </span>
          <span className="tnum mt-1 text-xs text-ink-soft">{c.symbol}</span>
          {c.bars > 1 && (
            <span className="mt-1 text-[10px] text-ink-faint">
              {c.bars} bars
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/** A titled panel presenting a progression with its metadata. */
export function ProgressionCard({
  progression,
  musicKey,
}: {
  progression: ChordProgression;
  musicKey?: MusicalKey;
}) {
  const key =
    musicKey ?? parseKey(progression.suggestedKey ?? 'C Major');

  return (
    <div className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-semibold text-ink">
            {progression.name}
          </h3>
          <p className="mt-0.5 text-xs capitalize text-ink-muted">
            {progression.kind}
            {progression.style ? ` · ${progression.style}` : ''} ·{' '}
            {formatKey(key)}
          </p>
        </div>
        {progression.feel && (
          <span className="rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] capitalize text-ink-soft">
            {progression.feel}
          </span>
        )}
      </div>
      <ProgressionView
        chords={progression.chords}
        musicKey={key}
        className="mt-4"
      />
    </div>
  );
}
