import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressionView } from '@/components/music/ProgressionView';
import { GrooveTransport } from './GrooveTransport';
import { BpmControl } from './BpmControl';
import { Button } from '@/components/ui/Button';
import { KeySelector } from '@/components/music/KeySelector';
import { parseKey, formatKey } from '@/lib/music';
import { parseMeter } from '@/lib/metronome';
import { GOSPEL_STYLES } from '@/lib/styles';
import { generateProgressionSession } from '@/lib/sessionGenerator';
import { usePractice } from '@/store/practiceStore';
import type { ChordProgression, MusicalKey } from '@/lib/types';
import { Dumbbell } from 'lucide-react';
import { cn } from '@/lib/cn';

function isVampChart(p: ChordProgression): boolean {
  return (
    p.kind === 'vamp' ||
    p.tags.includes('vamp') ||
    Boolean(p.pillars?.includes('vamps'))
  );
}

export function VampLab() {
  const navigate = useNavigate();
  const { progressions, exercises, setActivePlan } = usePractice();
  const vamps = useMemo(
    () => progressions.filter(isVampChart),
    [progressions],
  );
  const charts = vamps.length ? vamps : progressions;

  const [selectedId, setSelectedId] = useState(charts[0]?.id);
  const selected = charts.find((p) => p.id === selectedId) ?? charts[0];
  const [key, setKey] = useState<MusicalKey>(
    parseKey(selected?.suggestedKey ?? 'A Major'),
  );
  const [bpm, setBpm] = useState(72);
  const [playing, setPlaying] = useState(false);
  const [click, setClick] = useState(true);
  const [bass, setBass] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!selected) {
    return <p className="text-ink-muted">No vamps in the catalog yet.</p>;
  }

  const meter = parseMeter(selected.timeSignature, selected.feel);
  const style = selected.context
    ? GOSPEL_STYLES[selected.context].label
    : 'Gospel';

  const pick = (p: ChordProgression) => {
    setPlaying(false);
    setSelectedId(p.id);
    setKey(parseKey(p.suggestedKey ?? 'C Major'));
    setBpm(p.feel === '6/8' ? 66 : 96);
    setActiveIndex(0);
  };

  const practice = () => {
    setPlaying(false);
    setActivePlan(
      generateProgressionSession(exercises, {
        progression: selected,
        key,
        styleLabel: style,
        totalMinutes: 25,
      }),
    );
    navigate('/practice');
  };

  return (
    <div className="space-y-6">
      <p className="max-w-prose text-sm text-ink-muted">
        Ride a worship or praise vamp with a click and bass roots. Change key
        the way an MD would — the numbers stay put.
      </p>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {charts.map((p) => (
          <button
            key={p.id}
            onClick={() => pick(p)}
            className={cn(
              'focus-ring shrink-0 rounded-full border px-3 py-1.5 text-sm',
              p.id === selected.id
                ? 'border-accent bg-accent/15 text-ink'
                : 'border-line text-ink-muted hover:text-ink',
            )}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="panel p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-semibold text-ink">
              {selected.name}
            </h3>
            <p className="mt-0.5 text-sm text-ink-muted">
              {style}
              {selected.feel ? ` · ${selected.feel}` : ''} · {formatKey(key)}
            </p>
          </div>
          <KeySelector value={key} onChange={setKey} />
        </div>
        <ProgressionView
          chords={selected.chords}
          musicKey={key}
          activeIndex={playing ? activeIndex : undefined}
        />
      </div>

      <BpmControl value={bpm} onChange={setBpm} />

      <GrooveTransport
        bpm={bpm}
        meter={meter}
        chords={selected.chords}
        musicKey={key}
        playing={playing}
        onPlayingChange={setPlaying}
        click={click}
        onClickChange={setClick}
        bass={bass}
        onBassChange={setBass}
        onChordIndex={setActiveIndex}
      />

      <Button
        variant="primary"
        size="lg"
        onClick={practice}
        icon={<Dumbbell size={18} />}
      >
        Practice this vamp
      </Button>
    </div>
  );
}
