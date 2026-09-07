import type { Exercise } from '@/lib/types';

/**
 * A pool of practiceable drills. The session generator draws from this pool,
 * so keep a healthy spread across every category and difficulty.
 */
export const exercises: Exercise[] = [
  // ── Technique ────────────────────────────────────────────────
  {
    id: 'ex-tech-1',
    name: 'Alternate plucking',
    category: 'technique',
    durationMin: 10,
    instructions:
      'Play a one-octave G major scale using strict alternating i–m fingers. Keep every note even in volume and length. Watch for raked strings.',
    bpm: 90,
    difficulty: 'beginner',
    tags: ['fingerstyle', 'timing'],
  },
  {
    id: 'ex-tech-2',
    name: 'Left-hand muting drill',
    category: 'technique',
    durationMin: 8,
    instructions:
      'Play a repeating root–octave figure and mute every note cleanly with the fretting hand before the next attack. No ringing tails.',
    bpm: 80,
    difficulty: 'intermediate',
    tags: ['muting', 'control'],
  },
  {
    id: 'ex-tech-3',
    name: 'Slap & pop octaves',
    category: 'technique',
    durationMin: 12,
    instructions:
      'Thumb slap the root, pop the octave. Loop across A, D and G roots. Keep the wrist loose and the pops consistent.',
    bpm: 95,
    difficulty: 'advanced',
    tags: ['slap', 'octaves'],
  },
  {
    id: 'ex-tech-4',
    name: 'Spider walk',
    category: 'technique',
    durationMin: 10,
    instructions:
      '1-2-3-4 chromatic permutations across all four strings. One finger per fret. Prioritise clean transitions over speed.',
    bpm: 70,
    difficulty: 'beginner',
    tags: ['dexterity', 'warmup'],
  },
  {
    id: 'ex-tech-5',
    name: 'Ghost note grooves',
    category: 'technique',
    durationMin: 10,
    instructions:
      'Play a simple root-fifth groove and insert muted ghost notes on the "e" and "a" of each beat. Feel the 16th-note grid.',
    bpm: 100,
    difficulty: 'intermediate',
    tags: ['ghost notes', 'groove'],
  },

  // ── Theory ───────────────────────────────────────────────────
  {
    id: 'ex-theory-1',
    name: 'Find minor 3rds',
    category: 'theory',
    durationMin: 10,
    instructions:
      'Pick a random root and locate its minor 3rd in three different fretboard positions. Say the note name out loud each time.',
    difficulty: 'beginner',
    tags: ['intervals', 'fretboard'],
  },
  {
    id: 'ex-theory-2',
    name: 'Circle of fifths roots',
    category: 'theory',
    durationMin: 10,
    instructions:
      'Play root notes around the full circle of fifths, ascending then descending, without looking at the fretboard.',
    difficulty: 'intermediate',
    tags: ['harmony', 'roots'],
  },
  {
    id: 'ex-theory-3',
    name: 'Mode spelling',
    category: 'theory',
    durationMin: 12,
    instructions:
      'Choose a key and play all seven modes from a single root. Note which degree colours each mode (b3, b7, #4...).',
    difficulty: 'advanced',
    tags: ['modes', 'scales'],
  },
  {
    id: 'ex-theory-4',
    name: 'Chord tone targeting',
    category: 'theory',
    durationMin: 10,
    instructions:
      'Over a ii–V–I, land on the 3rd of each chord on beat 1. Then try landing on the 7th.',
    difficulty: 'intermediate',
    tags: ['chord tones', 'harmony'],
  },

  // ── Repertoire ───────────────────────────────────────────────
  {
    id: 'ex-rep-1',
    name: 'Chorus of Dean Town',
    category: 'repertoire',
    durationMin: 15,
    instructions:
      'Work the chorus of Dean Town at a reduced tempo. Focus on the 16th-note consistency and the muted articulation.',
    bpm: 100,
    difficulty: 'advanced',
    tags: ['vulfpeck', 'funk'],
  },
  {
    id: 'ex-rep-2',
    name: 'Sir Duke line',
    category: 'repertoire',
    durationMin: 15,
    instructions:
      'Isolate the famous unison line. Practise it hands-separate first, then bring it up to tempo in four-bar chunks.',
    bpm: 120,
    difficulty: 'advanced',
    tags: ['stevie wonder', 'motown'],
  },
  {
    id: 'ex-rep-3',
    name: 'Come Down verse groove',
    category: 'repertoire',
    durationMin: 12,
    instructions:
      'Lock the verse groove in the pocket. Emphasise the laid-back feel and the space between notes.',
    bpm: 98,
    difficulty: 'intermediate',
    tags: ['anderson paak', 'pocket'],
  },

  // ── Creativity ───────────────────────────────────────────────
  {
    id: 'ex-cre-1',
    name: 'Two-chord vamp writing',
    category: 'creativity',
    durationMin: 12,
    instructions:
      'Over a two-chord vamp, write a four-bar bassline you actually like. Record it and iterate twice.',
    difficulty: 'beginner',
    tags: ['writing', 'groove'],
  },
  {
    id: 'ex-cre-2',
    name: 'Call & response solo',
    category: 'creativity',
    durationMin: 10,
    instructions:
      'Improvise using a call-and-response structure: a two-bar idea, then a two-bar answer. Keep it musical, not busy.',
    difficulty: 'intermediate',
    tags: ['improvisation', 'phrasing'],
  },
  {
    id: 'ex-cre-3',
    name: 'Rhythmic displacement',
    category: 'creativity',
    durationMin: 10,
    instructions:
      'Take a simple riff and shift it by an 8th note. Explore how the same notes feel against the click when displaced.',
    difficulty: 'advanced',
    tags: ['rhythm', 'exploration'],
  },

  // ── Ear training ─────────────────────────────────────────────
  {
    id: 'ex-ear-1',
    name: 'Interval singing',
    category: 'ear-training',
    durationMin: 10,
    instructions:
      'Play a root, sing a target interval, then check it on the bass. Cycle through 3rds, 4ths, 5ths and 7ths.',
    difficulty: 'beginner',
    tags: ['intervals', 'pitch'],
  },
  {
    id: 'ex-ear-2',
    name: 'Transcribe 4 bars',
    category: 'ear-training',
    durationMin: 15,
    instructions:
      'Pick any four bars of a favourite bassline and transcribe them by ear — no tabs. Verify slowly against the record.',
    difficulty: 'advanced',
    tags: ['transcription', 'listening'],
  },
  {
    id: 'ex-ear-3',
    name: 'Groove matching',
    category: 'ear-training',
    durationMin: 8,
    instructions:
      'Loop a two-bar groove, then reproduce its rhythm on a single note purely by feel before adding pitches.',
    bpm: 92,
    difficulty: 'intermediate',
    tags: ['rhythm', 'feel'],
  },

  // ── Loop practice ────────────────────────────────────────────
  {
    id: 'ex-loop-1',
    name: 'Funk Groove in E minor',
    category: 'loop-practice',
    durationMin: 15,
    instructions:
      'Play over the Funk Groove 07 loop. Lock the 16ths, add tasteful ghost notes, and leave space on beat 3.',
    bpm: 105,
    difficulty: 'intermediate',
    tags: ['funk', 'ghost notes'],
  },
  {
    id: 'ex-loop-2',
    name: 'Neo-soul pocket',
    category: 'loop-practice',
    durationMin: 12,
    instructions:
      'Sit behind the beat over the neo-soul loop. Prioritise feel and dynamics over note count.',
    bpm: 82,
    difficulty: 'intermediate',
    tags: ['neo-soul', 'pocket'],
  },
  {
    id: 'ex-loop-3',
    name: 'Walking over changes',
    category: 'loop-practice',
    durationMin: 15,
    instructions:
      'Walk quarter notes over the jazz blues loop. Target chord tones on strong beats and use chromatic approaches.',
    bpm: 120,
    difficulty: 'advanced',
    tags: ['jazz', 'walking'],
  },

  // ── Gospel / Afro-gospel focused drills ─────────────────────
  {
    id: 'ex-gospel-numbers',
    name: 'Number-system roots',
    category: 'theory',
    durationMin: 10,
    instructions:
      'Call out 1 5 6 4 and play the roots without thinking of note names. Then transpose the same numbers to two new keys.',
    difficulty: 'beginner',
    concepts: ['number-system', 'transposition'],
    progressionId: 'prog-1564',
    style: 'Contemporary Gospel',
    tags: ['numbers', 'roots'],
  },
  {
    id: 'ex-gospel-passing',
    name: 'Walk-ups into the 1',
    category: 'technique',
    durationMin: 10,
    instructions:
      'Over the praise loop, connect the 4 back to the 1 with a chromatic or diatonic walk-up. Keep the passing tones on the "and".',
    bpm: 112,
    difficulty: 'intermediate',
    concepts: ['passing-tones', 'playing-changes', 'gospel-grooves'],
    progressionId: 'prog-1564',
    style: 'Nigerian Gospel',
    feel: 'straight',
    tags: ['walk-up', 'passing tones'],
  },
  {
    id: 'ex-gospel-vamp',
    name: 'Worship vamp dynamics',
    category: 'creativity',
    durationMin: 12,
    instructions:
      'Vamp on 1 and 4 in 6/8. Build from a whole-note root to a busier fill over eight bars, then bring it back down.',
    bpm: 68,
    difficulty: 'beginner',
    concepts: ['vamps', 'fills', 'groove-pocket'],
    progressionId: 'prog-worship-1-4',
    style: 'Worship',
    feel: '6/8',
    tags: ['vamp', 'dynamics'],
  },
  {
    id: 'ex-gospel-251',
    name: 'Play the 2-5-1 turnaround',
    category: 'loop-practice',
    durationMin: 12,
    instructions:
      'Play the changes over the Sunday Turnaround loop. Target the 3rd of each chord, then add a chromatic approach into the 1.',
    bpm: 88,
    difficulty: 'advanced',
    concepts: ['playing-changes', 'progressions', 'passing-tones'],
    progressionId: 'prog-6251',
    style: 'Gospel',
    feel: 'swing',
    tags: ['turnaround', 'changes'],
  },

  // ── Number-system drills ────────────────────────────────────
  {
    id: 'ex-numbers-1564-keys',
    name: 'Roots of 1 5 6 4 in three keys',
    category: 'theory',
    durationMin: 10,
    instructions:
      'Play the roots of 1 → 5 → 6 → 4 in D, then move it to G, then to Bb — thinking in numbers, not note names, the whole time.',
    difficulty: 'beginner',
    concepts: ['number-system', 'transposition', 'progressions'],
    progressionId: 'prog-1564',
    tags: ['numbers', 'roots', 'transposition'],
  },
  {
    id: 'ex-numbers-1451-roots-fifths',
    name: '1 4 5 1 with roots and fifths',
    category: 'theory',
    durationMin: 8,
    instructions:
      'Play 1 → 4 → 5 → 1 using only the root and the 5th of each chord. Keep the 5ths above the root, then try dropping them below.',
    difficulty: 'beginner',
    concepts: ['number-system', 'progressions'],
    tags: ['numbers', 'root-fifth'],
  },
  {
    id: 'ex-numbers-6251',
    name: 'Number chart: 6 2 5 1',
    category: 'theory',
    durationMin: 10,
    instructions:
      'Walk the roots of a 6 → 2 → 5 → 1 turnaround. Say each number out loud on the downbeat so the shape sticks in any key.',
    difficulty: 'intermediate',
    concepts: ['number-system', 'progressions', 'playing-changes'],
    progressionId: 'prog-6251',
    tags: ['numbers', 'turnaround'],
  },
  {
    id: 'ex-numbers-identify',
    name: 'Identify the numbers by ear',
    category: 'ear-training',
    durationMin: 10,
    instructions:
      'Loop a progression and call out the number of each chord as it changes — 1, 6, 4, 5 — before you play a single note.',
    difficulty: 'intermediate',
    concepts: ['number-system', 'progressions'],
    tags: ['numbers', 'listening'],
  },
];

export function getExercise(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}

export function exercisesByCategory(category: Exercise['category']): Exercise[] {
  return exercises.filter((e) => e.category === category);
}
