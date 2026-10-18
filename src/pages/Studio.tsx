import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { VampLab } from '@/components/studio/VampLab';
import { NumberLab } from '@/components/studio/NumberLab';
import { EarLab } from '@/components/studio/EarLab';
import { Bandstand } from '@/components/studio/Bandstand';
import { MetronomeLab } from '@/components/studio/MetronomeLab';
import { cn } from '@/lib/cn';
import {
  AudioLines,
  Ear,
  Hash,
  Repeat,
  Timer,
} from 'lucide-react';

const LABS = [
  { id: 'vamp', label: 'Vamp Lab', icon: Repeat },
  { id: 'numbers', label: 'Number Lab', icon: Hash },
  { id: 'ear', label: 'Ear Lab', icon: Ear },
  { id: 'bandstand', label: 'Bandstand', icon: AudioLines },
  { id: 'metronome', label: 'Metronome', icon: Timer },
] as const;

type LabId = (typeof LABS)[number]['id'];

function isLabId(value: string | null): value is LabId {
  return LABS.some((l) => l.id === value);
}

export function Studio() {
  const [params, setParams] = useSearchParams();
  const lab: LabId = isLabId(params.get('lab')) ? params.get('lab') as LabId : 'vamp';

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Studio"
        title="The practice desk"
        subtitle="Click, numbers, vamps and the Sunday set — the tools a gospel bassist actually uses."
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {LABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setParams(id === 'vamp' ? {} : { lab: id })}
            className={cn(
              'focus-ring inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium',
              lab === id
                ? 'border-accent bg-accent/15 text-ink'
                : 'border-line text-ink-muted hover:text-ink',
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {lab === 'vamp' && <VampLab />}
      {lab === 'numbers' && <NumberLab />}
      {lab === 'ear' && <EarLab />}
      {lab === 'bandstand' && <Bandstand />}
      {lab === 'metronome' && <MetronomeLab />}
    </div>
  );
}
