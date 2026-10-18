import { useEffect, useMemo, useRef } from 'react';
import { WaveBars } from '@/components/loops/WaveBars';
import { Button } from '@/components/ui/Button';
import { useMetronome } from '@/hooks/useMetronome';
import { playBassTone, unlockAudio } from '@/lib/audio';
import { chordIndexAtBar, clickIntervalSec, type Meter } from '@/lib/metronome';
import { pitchToHz } from '@/lib/music';
import { midiOf, walkNoteForBeat, type WalkStyle } from '@/lib/walk';
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
  walkStyle?: WalkStyle;
  onChordIndex?: (index: number) => void;
  /** Fired on every downbeat with the bar index (0-based). */
  onBar?: (bar: number) => void;
  extra?: React.ReactNode;
}

/**
 * Shared play/pause transport: metronome click, walking bass, waveform,
 * and beat lamps.
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
  walkStyle = 'roots',
  onChordIndex,
  onBar,
  extra,
}: GrooveTransportProps) {
  const cycle = lengthBars ?? 4;
  const chordsRef = useRef(chords);
  const keyRef = useRef(musicKey);
  const bassRef = useRef(bass);
  const walkRef = useRef(walkStyle);
  const bpmRef = useRef(bpm);
  const meterRef = useRef(meter);
  const cycleRef = useRef(cycle);
  const prevMidiRef = useRef<number | null>(null);
  const onChordRef = useRef(onChordIndex);
  const onBarRef = useRef(onBar);

  chordsRef.current = chords;
  keyRef.current = musicKey;
  bassRef.current = bass;
  walkRef.current = walkStyle;
  bpmRef.current = bpm;
  meterRef.current = meter;
  cycleRef.current = cycle;
  onChordRef.current = onChordIndex;
  onBarRef.current = onBar;

  const { beat, start, stop } = useMetronome({
    bpm,
    meter,
    click,
    onBeat: ({ bar, beat: beatNow, isDownbeat, time }) => {
      const currentChords = chordsRef.current;
      const currentKey = keyRef.current;
      const meterNow = meterRef.current;
      if (currentChords.length && currentKey) {
        const idx = chordIndexAtBar(
          currentChords,
          bar % cycleRef.current,
        );
        onChordRef.current?.(idx);
        if (bassRef.current) {
          const step = walkNoteForBeat(
            currentChords,
            currentKey,
            bar,
            beatNow,
            meterNow,
            walkRef.current,
            prevMidiRef.current,
          );
          if (step) {
            const dur = clickIntervalSec(bpmRef.current, meterNow) * 0.82;
            playBassTone(pitchToHz(step.pitchIndex, step.octave), dur, time);
            prevMidiRef.current = midiOf(step.pitchIndex, step.octave);
          }
        }
      }
      if (isDownbeat) onBarRef.current?.(bar);
    },
  });

  useEffect(() => {
    if (!playing) {
      stop();
      onChordIndex?.(0);
      prevMidiRef.current = null;
      return;
    }
    prevMidiRef.current = null;
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
