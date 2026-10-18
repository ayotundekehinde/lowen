import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { PillarBadge, Tag } from '@/components/ui/Badge';
import { ProgressionView } from '@/components/music/ProgressionView';
import { parseKey, formatKey, progressionBarCount } from '@/lib/music';
import { generateProgressionSession } from '@/lib/sessionGenerator';
import { GOSPEL_STYLES } from '@/lib/styles';
import type { MusicalKey } from '@/lib/types';
import { usePractice } from '@/store/practiceStore';
import { ArrowLeft, Dumbbell } from 'lucide-react';

export function ProgressionDetail() {
  const { progressionId } = useParams();
  const navigate = useNavigate();
  const {
    getProgressionById,
    exercises,
    setActivePlan,
    loopsForProgression,
    songsForProgression,
  } = usePractice();

  const progression = progressionId
    ? getProgressionById(progressionId)
    : undefined;

  const canonicalKey: MusicalKey = useMemo(
    () => parseKey(progression?.suggestedKey ?? 'C Major'),
    [progression],
  );
  const [previewKey, setPreviewKey] = useState<MusicalKey>(canonicalKey);

  useEffect(() => {
    setPreviewKey(canonicalKey);
  }, [canonicalKey]);

  if (!progression) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-xl text-ink">Progression not found</p>
        <Link to="/library" className="mt-4 inline-block">
          <Button variant="secondary">Back to Library</Button>
        </Link>
      </div>
    );
  }

  const isPreview = formatKey(previewKey) !== formatKey(canonicalKey);
  const bars = progressionBarCount(progression.chords);
  const styleLabel = progression.context
    ? GOSPEL_STYLES[progression.context].label
    : undefined;
  const relatedLoops = loopsForProgression(progression.id);
  const relatedSongs = songsForProgression(progression.id);

  const practiceThis = () => {
    setActivePlan(
      generateProgressionSession(exercises, {
        progression,
        key: previewKey,
        styleLabel,
      }),
    );
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
        eyebrow={progression.kind}
        title={progression.name}
        subtitle={
          styleLabel ? (
            <span>
              {styleLabel}
              {progression.feel ? ` · ${progression.feel}` : ''}
            </span>
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Fact label="Kind" value={progression.kind} />
        <Fact label="Style" value={styleLabel ?? '—'} />
        <Fact
          label="Key"
          value={progression.suggestedKey ?? formatKey(canonicalKey)}
          hint="recommended"
        />
        <Fact label="Bars" value={String(bars)} />
      </div>

      <section className="panel p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-ink">
            Number-system chart
          </h2>
          {isPreview && (
            <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-medium text-accent">
              Previewing in {formatKey(previewKey)} · stored key stays{' '}
              {progression.suggestedKey ?? formatKey(canonicalKey)}
            </span>
          )}
        </div>
        <p className="mb-4 text-sm text-ink-muted">
          Try the same shape in another key — this only changes what you see,
          not the stored progression.
        </p>
        <ProgressionView
          chords={progression.chords}
          musicKey={previewKey}
          keySelector
          onKeyChange={setPreviewKey}
        />
        {isPreview && (
          <button
            onClick={() => setPreviewKey(canonicalKey)}
            className="mt-4 text-xs font-medium text-ink-muted underline-offset-2 hover:text-ink hover:underline"
          >
            Reset to {progression.suggestedKey ?? formatKey(canonicalKey)}
          </button>
        )}
      </section>

      {progression.pillars && progression.pillars.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {progression.pillars.map((p) => (
            <PillarBadge key={p} pillar={p} />
          ))}
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        className="w-full tracking-wide sm:w-auto"
        onClick={practiceThis}
        icon={<Dumbbell size={18} />}
      >
        PRACTICE THIS
      </Button>

      {relatedSongs.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-ink">
            Used in songs
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedSongs.map((s) => (
              <Link key={s.id} to={`/library/song/${s.id}`}>
                <Tag>{s.title}</Tag>
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedLoops.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-ink">
            Practice loops
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedLoops.map((l) => (
              <Link key={l.id} to={`/library/loop/${l.id}`}>
                <Tag>
                  {l.name} · {l.bpm} BPM
                </Tag>
              </Link>
            ))}
          </div>
        </section>
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
      <div className="mt-1 font-display text-lg font-semibold capitalize text-ink">
        {value}
      </div>
      {hint && <div className="text-[11px] text-ink-faint">{hint}</div>}
    </div>
  );
}
