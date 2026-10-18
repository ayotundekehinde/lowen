import { useState } from 'react';
import { KeySelector } from '@/components/music/KeySelector';
import { Button } from '@/components/ui/Button';
import { playBassTone, unlockAudio } from '@/lib/audio';
import { chordRootHz, degreeToChordSymbol, formatKey } from '@/lib/music';
import type { Degree, MusicalKey, NumberChord } from '@/lib/types';
import { Volume2 } from 'lucide-react';

const DEGREES: Degree[] = [1, 2, 3, 4, 5, 6, 7];

function chordFor(degree: Degree): NumberChord {
  return { degree };
}

export function NumberLab() {
  const [key, setKey] = useState<MusicalKey>({ tonic: 'D', mode: 'major' });
  const [heard, setHeard] = useState<Degree | null>(null);
  const [playingAll, setPlayingAll] = useState(false);

  const playDegree = async (degree: Degree) => {
    await unlockAudio();
    playBassTone(chordRootHz(key, chordFor(degree), 2), 0.55);
    setHeard(degree);
  };

  const playScale = async () => {
    await unlockAudio();
    setPlayingAll(true);
    DEGREES.forEach((d, i) => {
      window.setTimeout(() => {
        playBassTone(chordRootHz(key, chordFor(d), 2), 0.38);
        setHeard(d);
        if (i === DEGREES.length - 1) {
          window.setTimeout(() => setPlayingAll(false), 400);
        }
      }, i * 420);
    });
  };

  return (
    <div className="space-y-6">
      <p className="max-w-prose text-sm text-ink-muted">
        Hear the number system in any key. This is how a gospel bassist thinks
        on the bandstand — 1 through 7, not letter names.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-ink-faint">
            Key
          </p>
          <p className="font-display text-lg font-semibold text-ink">
            {formatKey(key)}
          </p>
        </div>
        <KeySelector value={key} onChange={setKey} />
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {DEGREES.map((d) => {
          const chord = chordFor(d);
          const active = heard === d;
          return (
            <button
              key={d}
              onClick={() => void playDegree(d)}
              className={
                'focus-ring panel panel-hover flex flex-col items-center gap-1 px-2 py-4 ' +
                (active ? 'border-accent' : '')
              }
            >
              <span className="tnum font-display text-2xl font-semibold text-accent">
                {d}
              </span>
              <span className="tnum text-xs text-ink-muted">
                {degreeToChordSymbol(key, chord)}
              </span>
            </button>
          );
        })}
      </div>

      <Button
        variant="primary"
        onClick={() => void playScale()}
        disabled={playingAll}
        icon={<Volume2 size={16} />}
      >
        Play 1 through 7
      </Button>
    </div>
  );
}
