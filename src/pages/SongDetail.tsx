import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { RadialProgress } from '@/components/ui/Progress';
import { DifficultyBadge } from '@/components/ui/Badge';
import { LoopCard } from '@/components/loops/LoopCard';
import { ChallengeOverlay } from '@/components/loops/ChallengeOverlay';
import { ProgressionCard } from '@/components/music/ProgressionView';
import { SectionCard } from '@/components/library/SectionCard';
import {
  generateSession,
  generateProgressionSession,
  generateSectionSession,
} from '@/lib/sessionGenerator';
import { parseKey } from '@/lib/music';
import { GOSPEL_STYLES } from '@/lib/styles';
import { SESSION_PRESETS } from '@/lib/pillars';
import { buildSessionContext } from '@/lib/sessionContext';
import type { Loop, MusicalKey } from '@/lib/types';
import type { ResolvedSection } from '@/lib/relations';
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
    resolveSongSection,
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

  const resolvedSections = song.sections.map((section) =>
    resolveSongSection(song, section),
  );

  const styleLabel = GOSPEL_STYLES[song.context].label;
  const songKey = song.keyRoot ?? parseKey(song.key);

  const practiceSong = () => {
    setActivePlan(
      generateSession(exercises, {
        totalMinutes: 30,
        weights: SESSION_PRESETS.song.weights,
        preferContext: song.context,
        context: buildSessionContext({
          song,
          key: songKey,
          context: song.context,
        }),
      }),
    );
    navigate('/practice');
  };

  const practiceWithLoop = () => {
    const first = associatedLoops[0];
    const progression = first?.progressionId
      ? getProgressionById(first.progressionId)
      : undefined;
    if (first && progression) {
      setActivePlan(
        generateProgressionSession(exercises, {
          progression,
          key: first.keyRoot ?? parseKey(first.key),
          song,
          loop: first,
        }),
      );
    } else {
      setActivePlan(
        generateSession(exercises, {
          totalMinutes: 30,
          weights: SESSION_PRESETS.groove.weights,
          preferContext: song.context,
          context: buildSessionContext({
            song,
            loop: first,
            key: songKey,
            context: song.context,
          }),
        }),
      );
    }
    navigate('/practice');
  };

  const practiceSection = (resolved: ResolvedSection) => {
    setActivePlan(
      generateSectionSession(exercises, {
        song: resolved.song,
        section: resolved.section,
        progression: resolved.progression,
        loop: resolved.loop,
        key: resolved.key,
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
        eyebrow={styleLabel}
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
            <Meta
              label="Level"
              value={<DifficultyBadge difficulty={song.difficulty} />}
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-ink">
            Sections
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Practice each part the way you'd rehearse it for service.
          </p>
          <div className="mt-5 grid gap-4">
            {resolvedSections.map((resolved) => (
              <SectionCard
                key={resolved.section.id}
                resolved={resolved}
                onPractice={practiceSection}
              />
            ))}
          </div>
        </div>
      </div>

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

      <section className="panel p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            Practice notes
          </h2>
          {notesDirty && (
            <Button
              variant="secondary"
              size="sm"
              onClick={saveNotes}
              icon={<Save size={14} />}
            >
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
                musicKey={songKey}
                keySelector
                onPractice={(key: MusicalKey) => {
                  setActivePlan(
                    generateProgressionSession(exercises, {
                      progression: prog,
                      key,
                      song,
                    }),
                  );
                  navigate('/practice');
                }}
              />
            ))}
          </div>
        </section>
      )}

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
                onPractice={() => {
                  const progression = loop.progressionId
                    ? getProgressionById(loop.progressionId)
                    : undefined;
                  if (progression) {
                    setActivePlan(
                      generateProgressionSession(exercises, {
                        progression,
                        key: loop.keyRoot ?? parseKey(loop.key),
                        song,
                        loop,
                      }),
                    );
                  } else {
                    practiceWithLoop();
                  }
                  navigate('/practice');
                }}
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
  value: ReactNode;
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
