import { useRef, useState } from 'react';
import { GrooveTransport } from './GrooveTransport';
import { BpmControl } from './BpmControl';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Button } from '@/components/ui/Button';
import { tapTempoBpm, type Meter } from '@/lib/metronome';
import { Timer } from 'lucide-react';

export function MetronomeLab() {
  const [bpm, setBpm] = useState(100);
  const [meter, setMeter] = useState<Meter>('4/4');
  const [playing, setPlaying] = useState(false);
  const [click, setClick] = useState(true);
  const taps = useRef<number[]>([]);

  const tap = () => {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 4000), now];
    const next = tapTempoBpm(taps.current);
    if (next) setBpm(next);
  };

  return (
    <div className="space-y-6">
      <p className="max-w-prose text-sm text-ink-muted">
        A click that speaks church: 4/4 for praise, 6/8 for worship. In 6/8 the
        BPM is the dotted-quarter pulse, with accents on 1 and 4.
      </p>

      <SegmentedControl
        columns={2}
        value={meter}
        onChange={setMeter}
        options={[
          { value: '4/4', label: '4/4', hint: 'quarter = BPM' },
          { value: '6/8', label: '6/8', hint: 'dotted quarter = BPM' },
        ]}
      />

      <BpmControl value={bpm} onChange={setBpm} />

      <Button variant="secondary" onClick={tap} icon={<Timer size={16} />}>
        Tap tempo
      </Button>

      <GrooveTransport
        bpm={bpm}
        meter={meter}
        playing={playing}
        onPlayingChange={setPlaying}
        click={click}
        onClickChange={setClick}
        bass={false}
      />
    </div>
  );
}
