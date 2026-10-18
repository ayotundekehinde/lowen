import { Link } from 'react-router-dom';
import { ProgressionView } from '@/components/music/ProgressionView';
import { Button } from '@/components/ui/Button';
import { PillarBadge, Tag } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/Progress';
import { GOSPEL_STYLES } from '@/lib/styles';
import type { ResolvedSection } from '@/lib/relations';
import { Music4, Repeat } from 'lucide-react';

export function SectionCard({
  resolved,
  onPractice,
}: {
  resolved: ResolvedSection;
  onPractice: (resolved: ResolvedSection) => void;
}) {
  const { section, progression, loop, key, keyLabel, context, pillars } =
    resolved;
  const styleLabel = GOSPEL_STYLES[context].label;

  return (
    <article className="panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">
            {section.name}
          </h3>
          <p className="mt-0.5 text-sm text-ink-muted">
            {keyLabel} · {styleLabel}
          </p>
        </div>
        <span className="tnum text-sm text-ink-muted">{section.progress}%</span>
      </div>

      <div className="mt-3">
        <ProgressBar
          value={section.progress}
          color={
            section.progress >= 85
              ? 'var(--color-good)'
              : 'var(--color-accent)'
          }
        />
      </div>

      {progression && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[11px] uppercase tracking-wider text-ink-faint">
              Progression
            </p>
            <Link
              to={`/library/progression/${progression.id}`}
              className="text-[11px] font-medium text-ink-muted underline-offset-2 hover:text-ink hover:underline"
            >
              {progression.kind}
            </Link>
          </div>
          <ProgressionView chords={progression.chords} musicKey={key} />
        </div>
      )}

      {loop && (
        <div className="mt-4 rounded-xl border border-line bg-surface p-3">
          <p className="text-[11px] uppercase tracking-wider text-ink-faint">
            Loop
          </p>
          <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
            <Link
              to={`/library/loop/${loop.id}`}
              className="font-medium text-ink hover:text-accent"
            >
              {loop.name}
            </Link>
            <span className="tnum text-sm text-ink-muted">
              {loop.bpm} BPM · {loop.timeSignature}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Tag>{GOSPEL_STYLES[loop.context].label}</Tag>
            {loop.feel && <Tag>{loop.feel}</Tag>}
          </div>
        </div>
      )}

      {pillars.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {pillars.map((p) => (
            <PillarBadge key={p} pillar={p} withDot={false} />
          ))}
        </div>
      )}

      {progression && (
        <Button
          variant="primary"
          size="sm"
          className="mt-4 w-full tracking-wide"
          onClick={() => onPractice(resolved)}
          icon={loop ? <Repeat size={15} /> : <Music4 size={15} />}
        >
          PRACTICE THIS SECTION
        </Button>
      )}
    </article>
  );
}
