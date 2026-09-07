import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WaveBars } from './WaveBars';
import { ProgressionView } from '@/components/music/ProgressionView';
import { Button } from '@/components/ui/Button';
import { DifficultyBadge, Tag } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import { parseKey } from '@/lib/music';
import type { Loop } from '@/lib/types';
import { usePractice } from '@/store/practiceStore';
import { Dumbbell, Heart, Pause, Play, Shuffle } from 'lucide-react';

interface LoopCardProps {
  loop: Loop;
  onPractice: (loop: Loop) => void;
  onChallenge: (loop: Loop) => void;
}

export function LoopCard({ loop, onPractice, onChallenge }: LoopCardProps) {
  const { toggleLoopFavorite, getProgressionById } = usePractice();
  const [playing, setPlaying] = useState(false);

  const progression = loop.progressionId
    ? getProgressionById(loop.progressionId)
    : undefined;
  const chords = progression?.chords ?? loop.numberProgression;
  const musicKey = loop.keyRoot ?? parseKey(loop.key);

  return (
    <div className="panel panel-hover flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/library/loop/${loop.id}`}
            className="focus-ring block truncate font-display text-lg font-semibold text-ink transition-colors hover:text-accent"
          >
            {loop.name}
          </Link>
          <p className="mt-0.5 truncate text-sm text-ink-muted">
            {loop.style ?? loop.genre}
            {loop.feel ? ` · ${loop.feel}` : ''}
          </p>
        </div>
        <button
          onClick={() => toggleLoopFavorite(loop.id)}
          className="focus-ring rounded-lg p-1.5 text-ink-muted transition-colors hover:text-accent"
          aria-label={loop.favorite ? 'Unfavorite' : 'Favorite'}
        >
          <Heart
            size={18}
            className={loop.favorite ? 'text-accent' : ''}
            fill={loop.favorite ? 'var(--color-accent)' : 'none'}
          />
        </button>
      </div>

      {/* Transport */}
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
        <button
          onClick={() => setPlaying((p) => !p)}
          className={cn(
            'grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors focus-ring',
            playing
              ? 'bg-accent text-black'
              : 'bg-elevated text-ink hover:bg-hover',
          )}
          aria-label={playing ? 'Pause loop' : 'Play loop'}
        >
          {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <WaveBars playing={playing} className="h-8 flex-1" />
        <span className="tnum shrink-0 text-xs text-ink-muted">
          {loop.lengthBars} bars
        </span>
      </div>

      {/* Meta grid */}
      <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <MetaItem label="Key" value={loop.key} />
        <MetaItem label="Tempo" value={`${loop.bpm} BPM`} />
        <MetaItem label="Meter" value={loop.timeSignature} />
      </dl>

      {/* Number-system progression */}
      {chords && chords.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[11px] uppercase tracking-wider text-ink-faint">
            Progression
          </p>
          <ProgressionView chords={chords} musicKey={musicKey} />
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <DifficultyBadge difficulty={loop.difficulty} />
        {loop.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      <div className="mt-5 flex gap-2 border-t border-line pt-4">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => onPractice(loop)}
          icon={<Dumbbell size={15} />}
        >
          Practice
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => onChallenge(loop)}
          icon={<Shuffle size={15} />}
        >
          Challenge
        </Button>
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-ink-faint">
        {label}
      </dt>
      <dd className="tnum mt-0.5 font-medium text-ink">{value}</dd>
    </div>
  );
}
