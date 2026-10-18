import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { SongCard } from '@/components/library/SongCard';
import { LoopCard } from '@/components/loops/LoopCard';
import { ProgressionLibraryCard } from '@/components/library/ProgressionLibraryCard';
import { ChallengeOverlay } from '@/components/loops/ChallengeOverlay';
import { cn } from '@/lib/cn';
import {
  generateProgressionSession,
  generateSession,
} from '@/lib/sessionGenerator';
import { SESSION_PRESETS, PILLAR_LIST } from '@/lib/pillars';
import { GOSPEL_STYLES, GOSPEL_STYLE_LIST } from '@/lib/styles';
import { parseKey } from '@/lib/music';
import { filterProgressions } from '@/lib/relations';
import { buildSessionContext } from '@/lib/sessionContext';
import type {
  Difficulty,
  GospelStyle,
  Loop,
  PillarId,
  ProgressionKind,
} from '@/lib/types';
import { usePractice } from '@/store/practiceStore';
import { Heart, Search, X } from 'lucide-react';

type Tab = 'all' | 'songs' | 'loops' | 'progressions';

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'songs', label: 'Songs' },
  { id: 'loops', label: 'Loops' },
  { id: 'progressions', label: 'Progressions' },
];

const DIFFICULTIES: (Difficulty | 'all')[] = [
  'all',
  'beginner',
  'intermediate',
  'advanced',
];

const KINDS: (ProgressionKind | 'all')[] = [
  'all',
  'progression',
  'vamp',
  'turnaround',
];

export function Library() {
  const navigate = useNavigate();
  const { songs, loops, progressions, exercises, setActivePlan, getProgressionById } =
    usePractice();

  const [tab, setTab] = useState<Tab>('all');
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [challengeLoop, setChallengeLoop] = useState<Loop | null>(null);
  const [pillar, setPillar] = useState<PillarId | 'all'>('all');
  const [style, setStyle] = useState<GospelStyle | 'all'>('all');
  const [kind, setKind] = useState<ProgressionKind | 'all'>('all');

  const q = query.trim().toLowerCase();
  const progressionTab = tab === 'progressions';

  const filteredSongs = useMemo(
    () =>
      songs.filter((s) => {
        if (favoritesOnly && !s.favorite) return false;
        if (difficulty !== 'all' && s.difficulty !== difficulty) return false;
        if (!q) return true;
        return [s.title, s.artist, GOSPEL_STYLES[s.context].label, s.key]
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
        return [l.name, GOSPEL_STYLES[l.context].label, l.key, ...l.tags]
          .join(' ')
          .toLowerCase()
          .includes(q);
      }),
    [loops, favoritesOnly, difficulty, q],
  );

  const filteredProgressions = useMemo(
    () =>
      filterProgressions(progressions, {
        query: q,
        pillar: progressionTab ? pillar : 'all',
        context: progressionTab ? style : 'all',
        kind: progressionTab ? kind : 'all',
      }),
    [progressions, q, pillar, style, kind, progressionTab],
  );

  const practiceLoop = (loop: Loop) => {
    const progression = loop.progressionId
      ? getProgressionById(loop.progressionId)
      : undefined;
    const key = loop.keyRoot ?? parseKey(loop.key);
    if (progression) {
      setActivePlan(
        generateProgressionSession(exercises, {
          progression,
          key,
          loop,
        }),
      );
    } else {
      setActivePlan(
        generateSession(exercises, {
          totalMinutes: 30,
          weights: SESSION_PRESETS.groove.weights,
          preferContext: loop.context,
          context: buildSessionContext({ loop, key }),
        }),
      );
    }
    navigate('/practice');
  };

  const showSongs = tab === 'all' || tab === 'songs';
  const showLoops = tab === 'all' || tab === 'loops';
  const showProgressions = tab === 'all' || tab === 'progressions';
  const totalResults =
    (showSongs ? filteredSongs.length : 0) +
    (showLoops ? filteredLoops.length : 0) +
    (showProgressions ? filteredProgressions.length : 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Library"
        title="Songs, Loops & Progressions"
        subtitle="The material you rehearse for service — charts, grooves, and songs in one place."
      />

      <div className="flex w-full max-w-xl gap-1 rounded-2xl border border-line bg-surface p-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'focus-ring flex-1 rounded-xl px-2 py-2 text-xs font-semibold uppercase tracking-wide transition-all sm:px-4 sm:text-sm',
              tab === t.id
                ? 'bg-elevated text-ink'
                : 'text-ink-muted hover:text-ink-soft',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, artist, style, numbers…"
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

        {progressionTab ? (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={kind}
              onChange={(e) =>
                setKind(e.target.value as ProgressionKind | 'all')
              }
              className="focus-ring h-11 rounded-xl border border-line bg-surface px-3 text-sm capitalize text-ink-soft"
            >
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k === 'all' ? 'All kinds' : k}
                </option>
              ))}
            </select>
            <select
              value={style}
              onChange={(e) =>
                setStyle(e.target.value as GospelStyle | 'all')
              }
              className="focus-ring h-11 rounded-xl border border-line bg-surface px-3 text-sm text-ink-soft"
            >
              <option value="all">All styles</option>
              {GOSPEL_STYLE_LIST.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              value={pillar}
              onChange={(e) => setPillar(e.target.value as PillarId | 'all')}
              className="focus-ring h-11 rounded-xl border border-line bg-surface px-3 text-sm text-ink-soft"
            >
              <option value="all">All pillars</option>
              {PILLAR_LIST.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
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
        )}
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

      {showProgressions && filteredProgressions.length > 0 && (
        <section>
          {tab === 'all' && (
            <SectionHeading
              title="Progressions"
              count={filteredProgressions.length}
            />
          )}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProgressions.map((p) => (
              <ProgressionLibraryCard key={p.id} progression={p} />
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
