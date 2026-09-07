import type { Challenge, Loop } from './types';

let counter = 0;
function uid(): string {
  counter += 1;
  return `chal-${Date.now().toString(36)}-${counter}`;
}

const PROMPTS = [
  'Create a 4-bar bassline using only 3 notes.',
  'Improvise a groove and never repeat the same rhythm twice.',
  'Build a line that lands on the root only on beat 1.',
  'Write a walking line that uses a chromatic approach into every chord.',
  'Make it groove using nothing but the low E and A strings.',
  'Compose a 2-bar hook, then vary it for 2 bars.',
];

const CONSTRAINT_POOL = [
  'Use the {key} pentatonic scale.',
  'Add at least two ghost notes per bar.',
  'Leave beat 3 empty in every bar.',
  'Stay in first position (frets 1–5).',
  'Slide into at least one note per bar.',
  'Keep everything under an octave range.',
  'Accent the "and" of beat 2.',
  'End every phrase on the 5th.',
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
 * Generate a short, musical creativity challenge tailored to a loop. Constraint
 * templates referencing `{key}` are filled with the loop's key.
 */
export function generateChallenge(loop?: Loop): Challenge {
  const prompt = pick(PROMPTS, 1)[0];
  const key = loop?.key ?? 'E minor';
  const constraints = pick(CONSTRAINT_POOL, 2).map((c) =>
    c.replace('{key}', key),
  );
  return { id: uid(), prompt, constraints };
}
