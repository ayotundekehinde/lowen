import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCountdownOptions {
  /** Total seconds to count down from. */
  seconds: number;
  autoStart?: boolean;
  onComplete?: () => void;
}

interface Countdown {
  remaining: number;
  running: boolean;
  finished: boolean;
  start: () => void;
  pause: () => void;
  toggle: () => void;
  reset: (seconds?: number) => void;
  addSeconds: (delta: number) => void;
}

/**
 * A self-contained countdown timer. Uses timestamp math (not tick counting) so
 * it stays accurate even if the tab is throttled.
 */
export function useCountdown({
  seconds,
  autoStart = false,
  onComplete,
}: UseCountdownOptions): Countdown {
  const [total, setTotal] = useState(seconds);
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(autoStart);

  const deadlineRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const stopLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!running) return;

    deadlineRef.current = Date.now() + remaining * 1000;

    const tick = () => {
      if (deadlineRef.current == null) return;
      const secsLeft = Math.max(0, (deadlineRef.current - Date.now()) / 1000);
      setRemaining(secsLeft);
      if (secsLeft <= 0) {
        setRunning(false);
        stopLoop();
        onCompleteRef.current?.();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return stopLoop;
    // We deliberately restart the loop only when `running` toggles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const toggle = useCallback(() => setRunning((r) => !r), []);

  const reset = useCallback(
    (next?: number) => {
      const value = next ?? total;
      setRunning(false);
      setTotal(value);
      setRemaining(value);
      deadlineRef.current = null;
    },
    [total],
  );

  const addSeconds = useCallback((delta: number) => {
    setRemaining((r) => Math.max(0, r + delta));
    if (deadlineRef.current != null) {
      deadlineRef.current += delta * 1000;
    }
  }, []);

  return {
    remaining: Math.ceil(remaining),
    running,
    finished: remaining <= 0,
    start,
    pause,
    toggle,
    reset,
    addSeconds,
  };
}
