import { Link } from 'react-router-dom';
import { ProgressionView } from '@/components/music/ProgressionView';
import { PillarBadge } from '@/components/ui/Badge';
import { parseKey, progressionBarCount } from '@/lib/music';
import { GOSPEL_STYLES } from '@/lib/styles';
import type { ChordProgression } from '@/lib/types';

export function ProgressionLibraryCard({
  progression,
}: {
  progression: ChordProgression;
}) {
  const musicKey = parseKey(progression.suggestedKey ?? 'C Major');
  const bars = progressionBarCount(progression.chords);

  return (
    <Link
      to={`/library/progression/${progression.id}`}
      className="panel panel-hover group flex flex-col p-5 focus-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold text-ink">
            {progression.name}
          </h3>
          <p className="mt-0.5 text-sm capitalize text-ink-muted">
            {progression.kind}
            {progression.context
              ? ` · ${GOSPEL_STYLES[progression.context].label}`
              : ''}
          </p>
        </div>
        {progression.feel && (
          <span className="shrink-0 rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] capitalize text-ink-soft">
            {progression.feel}
          </span>
        )}
      </div>

      <div className="mt-4">
        <ProgressionView chords={progression.chords} musicKey={musicKey} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-ink-faint">
            Key
          </dt>
          <dd className="tnum mt-0.5 font-medium text-ink">
            {progression.suggestedKey ?? '—'}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-ink-faint">
            Bars
          </dt>
          <dd className="tnum mt-0.5 font-medium text-ink">{bars}</dd>
        </div>
      </dl>

      {progression.pillars && progression.pillars.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {progression.pillars.slice(0, 3).map((p) => (
            <PillarBadge key={p} pillar={p} withDot={false} />
          ))}
        </div>
      )}
    </Link>
  );
}
