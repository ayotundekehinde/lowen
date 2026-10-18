import { useEffect, useMemo } from 'react';
import { WaveBars } from '@/components/loops/WaveBars';
import { Button } from '@/components/ui/Button';
import { useMetronome } from '@/hooks/useMetronome';
import { playBassTone, unlockAudio } from '@/lib/audio';
import { chordIndexAtBar, type Meter } from '@/lib/metronome';
import { chordRootHz } from '@/lib/music';
import type { MusicalKey, NumberChord } from '@/lib/types';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

interface GrooveTransportProps {
  bpm: number;
  meter: Meter;
  chords?: NumberChord[];
  musicKey?: MusicalKey;
  lengthBars?: number;
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
  click?: boolean;
  onClickChange?: (click: boolean) => void;
  bass?: boolean;
  onBassChange?: (bass: boolean) => void;
  onChordIndex?: (index: number) => void;
  extra?: React.ReactNode;
}

/**
 * Shared play/pause transport: metronome click, optional bass roots on chord
 * changes, waveform, and beat lamps.
 */
export function GrooveTransport({
  bpm,
  meter,
  chords = [],
  musicKey,
  lengthBars,
  playing,
  onPlayingChange,
  click = true,
  onClickChange,
  bass = true,
  onBassChange,
  onChordIndex,
  extra,
}: GrooveTransportProps) {
  const cycle = lengthBars ?? 4;
  const { beat, start, stop } = useMetronome({
    bpm,
    meter,
    click,
    onBeat: ({ bar, isDownbeat, accent }) => {
      if (chords.length === 0 || !musicKey) return;
      const idx = chordIndexAtBar(chords, bar % cycle);
      onChordIndex?.(idx);
      if (bass && (isDownbeat || (meter === '6/8' && accent))) {
        playBassTone(chordRootHz(musicKey, chords[idx]));
      }
    },
  });

  useEffect(() => {
    if (!playing) {
      stop();
      onChordIndex?.(0);
      return;
    }
    start();
    return () => stop();
  }, [playing, start, stop, onChordIndex]);

  const beatCount = meter === '6/8' ? 6 : 4;
  const lamps = useMemo(
    () => Array.from({ length: beatCount }, (_, i) => i),
    [beatCount],
  );

  const toggle = async () => {
    await unlockAudio();
    onPlayingChange(!playing);
  };

  return (
    <div className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
      <button
        onClick={() => void toggle()}
        className={
          'grid h-12 w-12 shrink-0 place-items-center rounded-full transition-colors focus-ring ' +
          (playing ? 'bg-accent text-black' : 'bg-elevated text-ink hover:bg-hover')
        }
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
      </button>

      <WaveBars playing={playing} bars={28} className="h-10 flex-1" />

      <div className="flex items-center gap-1.5">
        {lamps.map((i) => {
          const on = playing && beat === i;
          const accent = i === 0 || (meter === '6/8' && i === 3);
          return (
            <span
              key={i}
              className="h-2 w-2 rounded-full transition-all"
              style={{
                backgroundColor: on
                  ? 'var(--color-accent)'
                  : accent
                    ? 'var(--color-line-strong)'
                    : 'var(--color-line)',
                transform: on ? 'scale(1.35)' : 'scale(1)',
              }}
            />
          );
        })}
      </div>

      <span className="tnum shrink-0 text-sm text-ink-muted">
        {bpm} · {meter}
      </span>

      <div className="flex items-center gap-1">
        {onClickChange && (
          <Button
            variant={click ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onClickChange(!click)}
            icon={click ? <Volume2 size={14} /> : <VolumeX size={14} />}
            aria-label={click ? 'Mute click' : 'Enable click'}
          >
            Click
          </Button>
        )}
        {onBassChange && (
          <Button
            variant={bass ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onBassChange(!bass)}
          >
            Bass
          </Button>
        )}
        {extra}
      </div>
    </div>
  );
}
