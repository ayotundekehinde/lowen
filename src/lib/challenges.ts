import type { Challenge, Loop } from './types';

let counter = 0;
function uid(): string {
  counter += 1;
  return `chal-${Date.now().toString(36)}-${counter}`;
}

const PROMPTS = [
  'Ride a 1–4 worship vamp for four bars, then fill into the next section.',
  'Walk 4 → 5 → 1 without rushing the pocket — numbers out loud.',
  'Lock the praise chorus using only roots and fifths.',
  'Play the numbers while you groove. If you lose the 1, you lost the chart.',
  'Leave space on beat 4 so the MD can cue the lift.',
  'Ghost-note the Afro-gospel bounce, then land the 1 clean.',
  'Hold the 6/8 dotted-quarter pulse — don’t turn it into 4/4.',
  'Build for eight bars on the vamp, then drop to half the density.',
];

const CONSTRAINT_POOL = [
  'Stay on the {key} 1, 4 and 5.',
  'Accent 1 and the “and” of 2 like a Naija praise pocket.',
  'In 6/8, feel the dotted quarter — don’t rush the 4.',
  'No fills until bar 4 of the cycle.',
  'Approach every new chord from a half-step below.',
  'Keep everything under an octave. Let the keys take the top.',
  'Mute between notes so the kick has room.',
  'Call the numbers (1, 5, 6, 4) as you play them.',
];

function pick<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

/**
 * Generate a short, musical creativity challenge tailored to a gospel loop.
 * Constraint templates referencing `{key}` are filled with the loop's key.
 */
export function generateChallenge(loop?: Loop): Challenge {
  const prompt = pick(PROMPTS, 1)[0];
  const key = loop?.key ?? 'D Major';
  const constraints = pick(CONSTRAINT_POOL, 2).map((c) =>
    c.replace('{key}', key),
  );
  return { id: uid(), prompt, constraints };
}
