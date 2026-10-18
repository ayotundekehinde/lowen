import { useCallback, useState } from 'react';
import { KeySelector } from '@/components/music/KeySelector';
import { Button } from '@/components/ui/Button';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { playBassTone, unlockAudio } from '@/lib/audio';
import {
  answersMatch,
  nextEarQuestion,
  type EarQuestion,
  type EarQuestionKind,
} from '@/lib/earLab';
import { chordRootHz, formatKey } from '@/lib/music';
import { usePractice } from '@/store/practiceStore';
import type { Degree, MusicalKey, NumberChord } from '@/lib/types';
import { Ear, RotateCcw } from 'lucide-react';

const DEGREES: Degree[] = [1, 2, 3, 4, 5, 6, 7];

function playDegrees(key: MusicalKey, degrees: Degree[]) {
  degrees.forEach((d, i) => {
    const chord: NumberChord = { degree: d };
    window.setTimeout(() => {
      playBassTone(chordRootHz(key, chord, 2), 0.5);
    }, i * 520);
  });
}

export function EarLab() {
  const { earLab, recordEarGuess } = usePractice();
  const [key, setKey] = useState<MusicalKey>({ tonic: 'C', mode: 'major' });
  const [kind, setKind] = useState<EarQuestionKind>('degree');
  const [question, setQuestion] = useState<EarQuestion | null>(null);
  const [guess, setGuess] = useState<Degree[]>([]);
  const [feedback, setFeedback] = useState<'right' | 'wrong' | null>(null);
  const [revealed, setRevealed] = useState(false);

  const deal = useCallback(
    async (nextKind = kind) => {
      await unlockAudio();
      const q = nextEarQuestion(nextKind);
      setQuestion(q);
      setGuess([]);
      setFeedback(null);
      setRevealed(false);
      playDegrees(key, q.degrees);
    },
    [kind, key],
  );

  const replay = async () => {
    if (!question) return;
    await unlockAudio();
    playDegrees(key, question.degrees);
  };

  const pick = (d: Degree) => {
    if (!question || feedback) return;
    const next = [...guess, d].slice(-question.degrees.length);
    setGuess(next);
    if (next.length === question.degrees.length) {
      const ok = answersMatch(next, question.degrees);
      setFeedback(ok ? 'right' : 'wrong');
      recordEarGuess(ok);
    }
  };

  const accuracy =
    earLab.attempted === 0
      ? null
      : Math.round((earLab.correct / earLab.attempted) * 100);

  return (
    <div className="space-y-6">
      <p className="max-w-prose text-sm text-ink-muted">
        Hear a number — or a movement — and name it. This is the same skill as
        catching the MD when the key jumps mid-praise.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Correct" value={String(earLab.correct)} />
        <Stat
          label="Accuracy"
          value={accuracy == null ? '—' : `${accuracy}%`}
        />
        <Stat
          label="Streak"
          value={`${earLab.streak}`}
          hint={`best ${earLab.bestStreak}`}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl
          value={kind}
          onChange={(v) => {
            setKind(v);
            setQuestion(null);
            setGuess([]);
            setFeedback(null);
          }}
          options={[
            { value: 'degree', label: 'One number' },
            { value: 'pair', label: 'Movement' },
          ]}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-ink-muted">{formatKey(key)}</span>
          <KeySelector value={key} onChange={setKey} />
        </div>
      </div>

      <div className="panel p-6 text-center">
        {!question ? (
          <Button
            variant="primary"
            size="lg"
            onClick={() => void deal()}
            icon={<Ear size={18} />}
          >
            Hear the first number
          </Button>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {kind === 'pair' ? 'Which two numbers?' : 'Which number?'}
            </p>
            <p className="tnum font-display text-3xl font-semibold text-ink">
              {guess.length
                ? guess.join(' → ')
                : kind === 'pair'
                  ? '? → ?'
                  : '?'}
            </p>
            {feedback && (
              <p
                className={
                  feedback === 'right' ? 'text-good' : 'text-danger'
                }
              >
                {feedback === 'right'
                  ? 'In the pocket.'
                  : `It was ${question.degrees.join(' → ')}.`}
              </p>
            )}
            {revealed && !feedback && (
              <p className="text-ink-muted">
                Answer: {question.degrees.join(' → ')}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="secondary" onClick={() => void replay()}>
                Hear it again
              </Button>
              <Button
                variant="ghost"
                onClick={() => setRevealed(true)}
                icon={<RotateCcw size={14} />}
              >
                Reveal
              </Button>
              <Button variant="primary" onClick={() => void deal()}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {DEGREES.map((d) => (
          <button
            key={d}
            onClick={() => pick(d)}
            disabled={!question || Boolean(feedback)}
            className="focus-ring panel panel-hover py-3 font-display text-xl font-semibold text-accent disabled:opacity-40"
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="panel p-4">
      <p className="text-[11px] uppercase tracking-wider text-ink-faint">
        {label}
      </p>
      <p className="tnum mt-1 font-display text-2xl font-semibold text-ink">
        {value}
      </p>
      {hint && <p className="text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}
