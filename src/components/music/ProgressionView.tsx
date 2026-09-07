import { useMemo, useState } from 'react';
import type { ChordProgression, MusicalKey, NumberChord } from '@/lib/types';
import { parseKey, renderProgression, formatKey } from '@/lib/music';
import { KeySelector } from './KeySelector';
import { Button } from '@/components/ui/Button';
import { Dumbbell } from 'lucide-react';

interface ProgressionViewProps {
  chords: NumberChord[];
  /** The key to render in. In uncontrolled selector mode this is the initial key. */
  musicKey: MusicalKey;
  className?: string;
  /** Show a KEY label + interactive KeySelector above the chords. */
  keySelector?: boolean;
  /**
   * When provided, the selector is controlled by the parent. When omitted and
   * `keySelector` is on, the component manages its own key state internally.
   */
  onKeyChange?: (key: MusicalKey) => void;
}

/**
 * Renders a progression as a row of number-system degrees with the concrete
 * chord symbols beneath each. Optionally shows the current key and an
 * interactive key selector — changing the key only affects display, never the
 * underlying progression data.
 */
export function ProgressionView({
  chords,
  musicKey,
  className,
  keySelector = false,
  onKeyChange,
}: ProgressionViewProps) {
  const [internalKey, setInternalKey] = useState(musicKey);
  const controlled = onKeyChange != null;
  // Without a selector we always render at the key the parent passes.
  const activeKey = keySelector
    ? controlled
      ? musicKey
      : internalKey
    : musicKey;
  const setKey = controlled ? onKeyChange : setInternalKey;

  const rendered = useMemo(
    () => renderProgression(chords, activeKey),
    [chords, activeKey],
  );

  return (
    <div className={className}>
      {keySelector && (
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] uppercase tracking-wider text-ink-faint">
              Key
            </span>
            <span className="font-display text-sm font-semibold text-ink">
              {formatKey(activeKey)}
            </span>
          </div>
          <KeySelector value={activeKey} onChange={setKey} />
        </div>
      )}

      <div className="flex flex-wrap items-stretch gap-2">
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
    </div>
  );
}

interface ProgressionCardProps {
  progression: ChordProgression;
  musicKey?: MusicalKey;
  /** Enable the interactive key selector. */
  keySelector?: boolean;
  /** When provided, renders a "Practice this" action using the active key. */
  onPractice?: (key: MusicalKey) => void;
}

/** A titled panel presenting a progression with its metadata and (optionally)
 * an interactive key selector and a "Practice this" action. */
export function ProgressionCard({
  progression,
  musicKey,
  keySelector = false,
  onPractice,
}: ProgressionCardProps) {
  const initialKey =
    musicKey ?? parseKey(progression.suggestedKey ?? 'C Major');
  // The card owns the key so the subtitle, chords and practice action stay in
  // sync when the selector is used.
  const [activeKey, setActiveKey] = useState(initialKey);

  return (
    <div className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-semibold text-ink">
            {progression.name}
          </h3>
          <p className="mt-0.5 text-xs capitalize text-ink-muted">
            {progression.kind}
            {progression.style ? ` · ${progression.style}` : ''}
            {!keySelector ? ` · ${formatKey(activeKey)}` : ''}
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
        musicKey={activeKey}
        keySelector={keySelector}
        onKeyChange={keySelector ? setActiveKey : undefined}
        className="mt-4"
      />

      {onPractice && (
        <div className="mt-4 flex justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPractice(activeKey)}
            icon={<Dumbbell size={15} />}
          >
            Practice this
          </Button>
        </div>
      )}
    </div>
  );
}
