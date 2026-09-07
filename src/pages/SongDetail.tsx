import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { ProgressBar, RadialProgress } from '@/components/ui/Progress';
import { DifficultyBadge } from '@/components/ui/Badge';
import { LoopCard } from '@/components/loops/LoopCard';
import { ChallengeOverlay } from '@/components/loops/ChallengeOverlay';
import { ProgressionCard } from '@/components/music/ProgressionView';
import {
  generateSession,
  generateProgressionSession,
} from '@/lib/sessionGenerator';
import { parseKey } from '@/lib/music';
import type { Loop, MusicalKey } from '@/lib/types';
import { usePractice } from '@/store/practiceStore';
import {
  ArrowLeft,
  Dumbbell,
  Heart,
  ListMusic,
  Music4,
  Repeat,
  Save,
} from 'lucide-react';

export function SongDetail() {
  const { songId } = useParams();
  const navigate = useNavigate();
  const {
    getSongById,
    getLoopById,
    getProgressionById,
    exercises,
    setActivePlan,
    toggleSongFavorite,
    updateSongNotes,
  } = usePractice();

  const song = songId ? getSongById(songId) : undefined;
  const [notes, setNotes] = useState(song?.notes ?? '');
  const [notesDirty, setNotesDirty] = useState(false);
  const [challengeLoop, setChallengeLoop] = useState<Loop | null>(null);

  if (!song) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-xl text-ink">Song not found</p>
        <Link to="/library" className="mt-4 inline-block">
          <Button variant="secondary">Back to Library</Button>
        </Link>
      </div>
    );
  }

  const associatedLoops = song.loopIds
    .map((id) => getLoopById(id))
    .filter((l): l is Loop => Boolean(l));

  const associatedProgressions = (song.progressionIds ?? [])
    .map((id) => getProgressionById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const practiceSong = () => {
    setActivePlan(
      generateSession(exercises, { totalMinutes: 30, focus: ['repertoire'] }),
    );
    navigate('/practice');
  };

  const practiceWithLoop = () => {
    setActivePlan(
      generateSession(exercises, {
        totalMinutes: 30,
        focus: ['loop-practice'],
      }),
    );
    navigate('/practice');
  };

  const saveNotes = () => {
    updateSongNotes(song.id, notes);
    setNotesDirty(false);
  };

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate('/library')}
        className="flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} /> Library
      </button>

      <PageHeader
        eyebrow={song.genre}
        title={song.title}
        subtitle={
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-ink-soft">{song.artist}</span>
          </span>
        }
        actions={
          <button
            onClick={() => toggleSongFavorite(song.id)}
            className="focus-ring grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface text-ink-muted transition-colors hover:text-accent"
            aria-label={song.favorite ? 'Unfavorite' : 'Favorite'}
          >
            <Heart
              size={18}
              className={song.favorite ? 'text-accent' : ''}
              fill={song.favorite ? 'var(--color-accent)' : 'none'}
            />
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Overall progress + meta */}
        <div className="panel flex flex-col items-center p-6 text-center">
          <RadialProgress value={song.progress} size={150}>
            <div>
              <div className="tnum font-display text-3xl font-semibold text-ink">
                {song.progress}%
              </div>
              <div className="text-xs uppercase tracking-widest text-ink-muted">
                learned
              </div>
            </div>
          </RadialProgress>
          <div className="mt-6 grid w-full grid-cols-2 gap-x-4 gap-y-3 text-left">
            <Meta label="Key" value={song.key} />
            <Meta label="Tempo" value={`${song.bpm} BPM`} />
            <Meta label="Tuning" value={song.tuning} />
            <Meta label="Level" value={<DifficultyBadge difficulty={song.difficulty} />} />
          </div>
        </div>

        {/* Sections */}
        <div className="panel p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-ink">
            Sections
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Track your progress part by part.
          </p>
          <div className="mt-5 space-y-4">
            {song.sections.map((section) => (
              <div key={section.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">{section.name}</span>
                  <span className="tnum text-ink-muted">{section.progress}%</span>
                </div>
                <ProgressBar
                  value={section.progress}
                  color={
                    section.progress >= 85
                      ? 'var(--color-good)'
                      : 'var(--color-accent)'
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={practiceSong}
          icon={<Music4 size={18} />}
        >
          Practice Song
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={practiceWithLoop}
          disabled={associatedLoops.length === 0}
          icon={<Repeat size={18} />}
        >
          Practice With Loop
        </Button>
      </div>

      {/* Notes */}
      <section className="panel p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            Practice notes
          </h2>
          {notesDirty && (
            <Button variant="secondary" size="sm" onClick={saveNotes} icon={<Save size={14} />}>
              Save
            </Button>
          )}
        </div>
        <textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setNotesDirty(true);
          }}
          rows={4}
          placeholder="Jot down fingerings, trouble spots, target tempos…"
          className="focus-ring w-full resize-y rounded-xl border border-line bg-surface p-4 text-sm leading-relaxed text-ink-soft placeholder:text-ink-faint"
        />
      </section>

      {/* Associated chord progressions */}
      {associatedProgressions.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <ListMusic size={18} className="text-accent" />
            <h2 className="font-display text-lg font-semibold text-ink">
              Chord progressions
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {associatedProgressions.map((prog) => (
              <ProgressionCard
                key={prog.id}
                progression={prog}
                musicKey={song.keyRoot ?? parseKey(song.key)}
                keySelector
                onPractice={(key: MusicalKey) => {
                  setActivePlan(
                    generateProgressionSession(exercises, {
                      progression: prog,
                      key,
                      focus: ['repertoire', 'theory'],
                      style: song.genre,
                    }),
                  );
                  navigate('/practice');
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Associated loops */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Dumbbell size={18} className="text-accent" />
          <h2 className="font-display text-lg font-semibold text-ink">
            Practice loops
          </h2>
        </div>
        {associatedLoops.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {associatedLoops.map((loop) => (
              <LoopCard
                key={loop.id}
                loop={loop}
                onPractice={practiceWithLoop}
                onChallenge={setChallengeLoop}
              />
            ))}
          </div>
        ) : (
          <div className="panel px-6 py-10 text-center text-sm text-ink-muted">
            No loops linked to this song yet.
          </div>
        )}
      </section>

      {challengeLoop && (
        <ChallengeOverlay
          loop={challengeLoop}
          onClose={() => setChallengeLoop(null)}
        />
      )}
    </div>
  );
}

function Meta({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-ink-faint">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}
