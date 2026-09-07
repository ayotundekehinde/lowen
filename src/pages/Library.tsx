import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { SongCard } from '@/components/library/SongCard';
import { LoopCard } from '@/components/loops/LoopCard';
import { ChallengeOverlay } from '@/components/loops/ChallengeOverlay';
import { cn } from '@/lib/cn';
import { generateSession } from '@/lib/sessionGenerator';
import type { Difficulty, Loop } from '@/lib/types';
import { usePractice } from '@/store/practiceStore';
import { Heart, Search, X } from 'lucide-react';

type Tab = 'all' | 'songs' | 'loops';

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'songs', label: 'Songs' },
  { id: 'loops', label: 'Loops' },
];

const DIFFICULTIES: (Difficulty | 'all')[] = [
  'all',
  'beginner',
  'intermediate',
  'advanced',
];

export function Library() {
  const navigate = useNavigate();
  const { songs, loops, setActivePlan } = usePractice();

  const [tab, setTab] = useState<Tab>('all');
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [challengeLoop, setChallengeLoop] = useState<Loop | null>(null);

  const q = query.trim().toLowerCase();

  const filteredSongs = useMemo(
    () =>
      songs.filter((s) => {
        if (favoritesOnly && !s.favorite) return false;
        if (difficulty !== 'all' && s.difficulty !== difficulty) return false;
        if (!q) return true;
        return [s.title, s.artist, s.genre, s.key]
          .join(' ')
          .toLowerCase()
          .includes(q);
      }),
    [songs, favoritesOnly, difficulty, q],
  );

  const filteredLoops = useMemo(
    () =>
      loops.filter((l) => {
        if (favoritesOnly && !l.favorite) return false;
        if (difficulty !== 'all' && l.difficulty !== difficulty) return false;
        if (!q) return true;
        return [l.name, l.genre, l.key, ...l.tags]
          .join(' ')
          .toLowerCase()
          .includes(q);
      }),
    [loops, favoritesOnly, difficulty, q],
  );

  const practiceLoop = (_loop: Loop) => {
    setActivePlan(
      generateSession({ totalMinutes: 30, focus: ['loop-practice'] }),
    );
    navigate('/practice');
  };

  const showSongs = tab === 'all' || tab === 'songs';
  const showLoops = tab === 'all' || tab === 'loops';
  const totalResults =
    (showSongs ? filteredSongs.length : 0) +
    (showLoops ? filteredLoops.length : 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Library"
        title="Songs & Loops"
        subtitle="Everything you're learning and grooving over, in one place."
      />

      {/* Tabs */}
      <div className="flex w-full max-w-sm gap-1 rounded-2xl border border-line bg-surface p-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'focus-ring flex-1 rounded-xl px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-all',
              tab === t.id
                ? 'bg-elevated text-ink'
                : 'text-ink-muted hover:text-ink-soft',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, artist, genre, tag…"
            className="focus-ring h-11 w-full rounded-xl border border-line bg-surface pl-10 pr-9 text-sm text-ink placeholder:text-ink-faint"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as Difficulty | 'all')
            }
            className="focus-ring h-11 rounded-xl border border-line bg-surface px-3 text-sm capitalize text-ink-soft"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d === 'all' ? 'All levels' : d}
              </option>
            ))}
          </select>

          <button
            onClick={() => setFavoritesOnly((v) => !v)}
            className={cn(
              'focus-ring flex h-11 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-colors',
              favoritesOnly
                ? 'border-transparent bg-accent/15 text-accent'
                : 'border-line text-ink-muted hover:text-ink',
            )}
            aria-pressed={favoritesOnly}
          >
            <Heart
              size={16}
              fill={favoritesOnly ? 'var(--color-accent)' : 'none'}
            />
            <span className="hidden sm:inline">Favorites</span>
          </button>
        </div>
      </div>

      {totalResults === 0 && (
        <div className="panel grid place-items-center px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            Nothing found
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            Try a different search or clear your filters.
          </p>
        </div>
      )}

      {/* Songs */}
      {showSongs && filteredSongs.length > 0 && (
        <section>
          {tab === 'all' && (
            <SectionHeading title="Songs" count={filteredSongs.length} />
          )}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredSongs.map((s) => (
              <SongCard key={s.id} song={s} />
            ))}
          </div>
        </section>
      )}

      {/* Loops */}
      {showLoops && filteredLoops.length > 0 && (
        <section>
          {tab === 'all' && (
            <SectionHeading title="Loops" count={filteredLoops.length} />
          )}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredLoops.map((l) => (
              <LoopCard
                key={l.id}
                loop={l}
                onPractice={practiceLoop}
                onChallenge={setChallengeLoop}
              />
            ))}
          </div>
        </section>
      )}

      {challengeLoop && (
        <ChallengeOverlay
          loop={challengeLoop}
          onClose={() => setChallengeLoop(null)}
        />
      )}
    </div>
  );
}

function SectionHeading({ title, count }: { title: string; count: number }) {
  return (
    <div className="mb-4 mt-2 flex items-center gap-3">
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      <span className="tnum rounded-full bg-elevated px-2 py-0.5 text-xs text-ink-muted">
        {count}
      </span>
    </div>
  );
}
