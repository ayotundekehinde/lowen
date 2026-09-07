import { Link } from 'react-router-dom';
import { ProgressBar } from '@/components/ui/Progress';
import { ProgressionView } from '@/components/music/ProgressionView';
import { DifficultyBadge } from '@/components/ui/Badge';
import { parseKey } from '@/lib/music';
import { GOSPEL_STYLES } from '@/lib/styles';
import type { Song } from '@/lib/types';
import { usePractice } from '@/store/practiceStore';
import { Heart, ChevronRight } from 'lucide-react';

export function SongCard({ song }: { song: Song }) {
  const { toggleSongFavorite, getProgressionById } = usePractice();

  const primaryProgression = song.progressionIds?.length
    ? getProgressionById(song.progressionIds[0])
    : undefined;

  return (
    <Link
      to={`/library/song/${song.id}`}
      className="panel panel-hover group flex flex-col p-5 focus-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold text-ink">
            {song.title}
          </h3>
          <p className="mt-0.5 truncate text-sm text-ink-muted">
            {song.artist}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSongFavorite(song.id);
          }}
          className="focus-ring rounded-lg p-1.5 text-ink-muted transition-colors hover:text-accent"
          aria-label={song.favorite ? 'Unfavorite' : 'Favorite'}
        >
          <Heart
            size={18}
            className={song.favorite ? 'text-accent' : ''}
            fill={song.favorite ? 'var(--color-accent)' : 'none'}
          />
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-ink-faint">
            Key
          </dt>
          <dd className="tnum mt-0.5 font-medium text-ink">{song.key}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-ink-faint">
            Tempo
          </dt>
          <dd className="tnum mt-0.5 font-medium text-ink">{song.bpm} BPM</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-ink-faint">
            Style
          </dt>
          <dd className="mt-0.5 truncate font-medium text-ink">
            {GOSPEL_STYLES[song.context].label}
          </dd>
        </div>
      </dl>

      {primaryProgression && (
        <div className="mt-4">
          <p className="mb-2 text-[11px] uppercase tracking-wider text-ink-faint">
            Progression
          </p>
          <ProgressionView
            chords={primaryProgression.chords}
            musicKey={song.keyRoot ?? parseKey(song.key)}
          />
        </div>
      )}

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-ink-muted">Progress</span>
          <span className="tnum font-medium text-ink">{song.progress}%</span>
        </div>
        <ProgressBar value={song.progress} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <DifficultyBadge difficulty={song.difficulty} />
        <span className="flex items-center gap-1 text-xs font-medium text-ink-muted transition-colors group-hover:text-ink">
          Open
          <ChevronRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
