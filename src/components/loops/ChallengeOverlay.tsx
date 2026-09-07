import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { WaveBars } from './WaveBars';
import { TimerDial } from '@/components/session/TimerDial';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Badge';
import { useCountdown } from '@/hooks/useCountdown';
import { generateChallenge } from '@/lib/challenges';
import type { Challenge, Loop } from '@/lib/types';
import { Pause, Play, RefreshCw, Sparkles, X } from 'lucide-react';

interface ChallengeOverlayProps {
  loop: Loop;
  onClose: () => void;
}

const CHALLENGE_SECONDS = 5 * 60;

export function ChallengeOverlay({ loop, onClose }: ChallengeOverlayProps) {
  const [challenge, setChallenge] = useState<Challenge>(() =>
    generateChallenge(loop),
  );
  const [playing, setPlaying] = useState(false);
  const timer = useCountdown({ seconds: CHALLENGE_SECONDS });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6 animate-[var(--animate-fade-in)]">
      <div
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-line bg-panel shadow-2xl sm:rounded-3xl"
        role="dialog"
        aria-modal="true"
        aria-label="Loop challenge"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles size={18} />
            <span className="font-display text-sm font-semibold uppercase tracking-wider">
              Loop Challenge
            </span>
          </div>
          <button
            onClick={onClose}
            className="focus-ring rounded-lg p-1.5 text-ink-muted hover:text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-6">
          {/* Loop context */}
          <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
            <button
              onClick={() => setPlaying((p) => !p)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-elevated text-ink hover:bg-hover focus-ring"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{loop.name}</p>
              <p className="tnum text-xs text-ink-muted">
                {loop.key} · {loop.bpm} BPM · {loop.timeSignature}
              </p>
            </div>
            <WaveBars playing={playing} bars={12} className="h-7 w-20" />
          </div>

          {/* The challenge */}
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Your challenge
            </p>
            <p className="mt-2 font-display text-2xl font-semibold leading-snug text-ink">
              {challenge.prompt}
            </p>
            <ul className="mt-4 space-y-2">
              {challenge.constraints.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-ink-soft">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Tag>{loop.genre}</Tag>
            </div>
          </div>

          {/* Timer */}
          <div className="mt-6 flex flex-col items-center gap-4 border-t border-line pt-6">
            <TimerDial
              remaining={timer.remaining}
              total={CHALLENGE_SECONDS}
              size={150}
              label={timer.running ? 'go' : 'set'}
            />
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => setChallenge(generateChallenge(loop))}
                icon={<RefreshCw size={15} />}
              >
                New challenge
              </Button>
              <Button
                variant="primary"
                onClick={timer.toggle}
                icon={timer.running ? <Pause size={16} /> : <Play size={16} />}
                className="min-w-28"
              >
                {timer.running ? 'Pause' : 'Start'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
