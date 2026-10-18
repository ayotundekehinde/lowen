import { useCallback, useEffect, useRef, useState } from 'react';
import { audioNow, playClick, unlockAudio } from '@/lib/audio';
import {
  beatsPerBar,
  clickIntervalSec,
  isAccentBeat,
  type BeatInfo,
  type Meter,
} from '@/lib/metronome';

interface UseMetronomeOptions {
  bpm: number;
  meter: Meter;
  /** Play the click. Bass tones are the caller’s job. */
  click?: boolean;
  onBeat?: (info: BeatInfo) => void;
}

interface Metronome {
  running: boolean;
  beat: number;
  bar: number;
  start: () => void;
  stop: () => void;
  toggle: () => void;
}

const LOOKAHEAD_SEC = 0.12;
const TICK_MS = 25;

/**
 * Look-ahead click scheduler. BPM/meter changes take effect on the next
 * scheduled beat so the grid doesn’t jump mid-bar.
 */
export function useMetronome({
  bpm,
  meter,
  click = true,
  onBeat,
}: UseMetronomeOptions): Metronome {
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState(0);
  const [bar, setBar] = useState(0);

  const bpmRef = useRef(bpm);
  const meterRef = useRef(meter);
  const clickRef = useRef(click);
  const onBeatRef = useRef(onBeat);
  const runningRef = useRef(false);
  const nextTimeRef = useRef(0);
  const beatRef = useRef(0);
  const barRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const uiTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  bpmRef.current = bpm;
  meterRef.current = meter;
  clickRef.current = click;
  onBeatRef.current = onBeat;

  const clearUiTimers = () => {
    for (const t of uiTimers.current) clearTimeout(t);
    uiTimers.current = [];
  };

  const stopLoop = useCallback(() => {
    if (timerRef.current != null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    clearUiTimers();
  }, []);

  const schedule = useCallback(() => {
    const now = audioNow();
    const meterNow = meterRef.current;
    const perBar = beatsPerBar(meterNow);
    const interval = clickIntervalSec(bpmRef.current, meterNow);

    while (nextTimeRef.current < now + LOOKAHEAD_SEC) {
      const t = nextTimeRef.current;
      const beatNow = beatRef.current;
      const barNow = barRef.current;
      const accent = isAccentBeat(beatNow, meterNow);
      if (clickRef.current) playClick(accent, t);

      const delay = Math.max(0, (t - now) * 1000);
      const handle = setTimeout(() => {
        if (!runningRef.current) return;
        setBeat(beatNow);
        setBar(barNow);
        onBeatRef.current?.({
          beat: beatNow,
          bar: barNow,
          accent,
          isDownbeat: beatNow === 0,
        });
      }, delay);
      uiTimers.current.push(handle);

      nextTimeRef.current += interval;
      beatRef.current += 1;
      if (beatRef.current >= perBar) {
        beatRef.current = 0;
        barRef.current += 1;
      }
    }
  }, []);

  useEffect(() => {
    if (!running) {
      stopLoop();
      return;
    }
    runningRef.current = true;
    void unlockAudio().then(() => {
      if (!runningRef.current) return;
      beatRef.current = 0;
      barRef.current = 0;
      setBeat(0);
      setBar(0);
      nextTimeRef.current = audioNow() + 0.06;
      schedule();
      timerRef.current = setInterval(schedule, TICK_MS);
    });
    return () => {
      runningRef.current = false;
      stopLoop();
    };
  }, [running, schedule, stopLoop]);

  const start = useCallback(() => setRunning(true), []);
  const stop = useCallback(() => {
    runningRef.current = false;
    setRunning(false);
    setBeat(0);
    setBar(0);
  }, []);
  const toggle = useCallback(() => {
    setRunning((r) => !r);
  }, []);

  return { running, beat, bar, start, stop, toggle };
}
