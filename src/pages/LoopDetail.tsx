import { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { DifficultyBadge, Tag } from '@/components/ui/Badge';
import { ProgressionView } from '@/components/music/ProgressionView';
import { GrooveTransport } from '@/components/studio/GrooveTransport';
import { WalkStyleControl } from '@/components/studio/WalkStyleControl';
import { ChallengeOverlay } from '@/components/loops/ChallengeOverlay';
import type { WalkStyle } from '@/lib/walk';
import { parseKey, formatKey } from '@/lib/music';
import { parseMeter } from '@/lib/metronome';
import { GOSPEL_STYLES } from '@/lib/styles';
import { SESSION_PRESETS } from '@/lib/pillars';
import { buildSessionContext } from '@/lib/sessionContext';
import {
  generateProgressionSession,
  generateSession,
} from '@/lib/sessionGenerator';
import type { ChordProgression, MusicalKey } from '@/lib/types';
import { usePractice } from '@/store/practiceStore';
import {
  ArrowLeft,
  Dumbbell,
  Heart,
  Shuffle,
} from 'lucide-react';

export function LoopDetail() {
  const { loopId } = useParams();
  const navigate = useNavigate();
  const {
    getLoopById,
    getProgressionById,
    exercises,
    setActivePlan,
    toggleLoopFavorite,
  } = usePractice();

  const loop = loopId ? getLoopById(loopId) : undefined;

  const canonicalKey: MusicalKey = useMemo(
    () => loop?.keyRoot ?? parseKey(loop?.key ?? 'C Major'),
    [loop],
  );
  const [previewKey, setPreviewKey] = useState<MusicalKey>(canonicalKey);
  const [playing, setPlaying] = useState(false);
  const [click, setClick] = useState(true);
  const [bass, setBass] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [walkStyle, setWalkStyle] = useState<WalkStyle>(
    loop?.timeSignature === '6/8' || loop?.feel === '6/8' ? 'roll' : 'walk-up',
  );
  const [showChallenge, setShowChallenge] = useState(false);

  if (!loop) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-xl text-ink">Loop not found</p>
        <Link to="/library" className="mt-4 inline-block">
          <Button variant="secondary">Back to Library</Button>
        </Link>
      </div>
    );
  }

  const progression: ChordProgression | undefined = loop.progressionId
    ? getProgressionById(loop.progressionId)
    : loop.numberProgression
      ? {
          id: `inline-${loop.id}`,
          name: loop.name,
          kind: 'progression',
          chords: loop.numberProgression,
          tags: [],
        }
      : undefined;

  const isPreview = formatKey(previewKey) !== formatKey(canonicalKey);

  const styleLabel = GOSPEL_STYLES[loop.context].label;

  const practiceThis = () => {
    if (progression) {
      setActivePlan(
        generateProgressionSession(exercises, {
          progression,
          key: previewKey,
          loop,
          styleLabel,
        }),
      );
    } else {
      setActivePlan(
        generateSession(exercises, {
          totalMinutes: 30,
          weights: SESSION_PRESETS.groove.weights,
          preferContext: loop.context,
          context: buildSessionContext({
            loop,
            key: previewKey,
            styleLabel,
          }),
        }),
      );
    }
    navigate('/practice');
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
        title={loop.name}
        subtitle={
          loop.feel ? (
            <span className="capitalize">{loop.feel} feel</span>
          ) : undefined
        }
        actions={
          <button
            onClick={() => toggleLoopFavorite(loop.id)}
            className="focus-ring grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface text-ink-muted transition-colors hover:text-accent"
            aria-label={loop.favorite ? 'Unfavorite' : 'Favorite'}
          >
            <Heart
              size={18}
              className={loop.favorite ? 'text-accent' : ''}
              fill={loop.favorite ? 'var(--color-accent)' : 'none'}
            />
          </button>
        }
      />

      <WalkStyleControl value={walkStyle} onChange={setWalkStyle} />

      <GrooveTransport
        bpm={loop.bpm}
        meter={parseMeter(loop.timeSignature, loop.feel)}
        chords={progression?.chords}
        musicKey={previewKey}
        lengthBars={loop.lengthBars}
        playing={playing}
        onPlayingChange={setPlaying}
        click={click}
        onClickChange={setClick}
        bass={bass}
        onBassChange={setBass}
        walkStyle={walkStyle}
        onChordIndex={setActiveIndex}
      />

      {/* Musical facts */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Fact label="Style" value={styleLabel} />
        <Fact label="Key" value={loop.key} hint="canonical" />
        <Fact label="BPM" value={`${loop.bpm}`} />
        <Fact label="Meter" value={loop.timeSignature} />
      </div>

      {/* Progression with key selector */}
      {progression && (
        <section className="panel p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-ink">
              Progression
            </h2>
            {isPreview && (
              <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-medium text-accent">
                Previewing in {formatKey(previewKey)} · stored key stays{' '}
                {loop.key}
              </span>
            )}
          </div>
          <p className="mb-4 text-sm text-ink-muted">
            Try the same shape in another key — this only changes what you see,
            not the loop's stored key.
          </p>
          <ProgressionView
            chords={progression.chords}
            musicKey={previewKey}
            keySelector
            onKeyChange={setPreviewKey}
            activeIndex={playing ? activeIndex : undefined}
          />
          {isPreview && (
            <button
              onClick={() => setPreviewKey(canonicalKey)}
              className="mt-4 text-xs font-medium text-ink-muted underline-offset-2 hover:text-ink hover:underline"
            >
              Reset to {loop.key}
            </button>
          )}
        </section>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="primary"
          size="lg"
          className="flex-1 tracking-wide"
          onClick={practiceThis}
          icon={<Dumbbell size={18} />}
        >
          PRACTICE THIS
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={() => setShowChallenge(true)}
          icon={<Shuffle size={18} />}
        >
          Challenge
        </Button>
      </div>

      {/* Tags */}
      {loop.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <DifficultyBadge difficulty={loop.difficulty} />
          {loop.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      )}

      {showChallenge && (
        <ChallengeOverlay loop={loop} onClose={() => setShowChallenge(false)} />
      )}
    </div>
  );
}

function Fact({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="panel p-4">
      <div className="text-[11px] uppercase tracking-wider text-ink-faint">
        {label}
      </div>
      <div className="mt-1 font-display text-lg font-semibold text-ink">
        {value}
      </div>
      {hint && <div className="text-[11px] text-ink-faint">{hint}</div>}
    </div>
  );
}
