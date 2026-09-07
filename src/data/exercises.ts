import type { Exercise, PillarId } from '@/lib/types';

/**
 * The drill pool the session generator draws from. Every drill is concrete and
 * gospel-facing, classified by the learning pillars it develops (first = primary)
 * and, where style-specific, tagged with its gospel context. Transferable
 * technique is included but kept deliberately in the minority.
 */
export const exercises: Exercise[] = [
  // ── Groove & Pocket ─────────────────────────────────────────
  {
    id: 'ex-pocket-6-8',
    name: '6/8 gospel pocket',
    pillars: ['groove-pocket'],
    durationMin: 10,
    instructions:
      'Over the 6/8 worship vamp, hold the root and lock the rolling triplet pulse with the kick. Feel beats 1 and 4; keep everything patient and even.',
    bpm: 66,
    difficulty: 'beginner',
    context: 'gospel-6-8',
    feel: '6/8',
    progressionId: 'prog-worship-1-4',
    tags: ['pocket', '6/8'],
  },
  {
    id: 'ex-pocket-praise',
    name: 'Laid-back praise pocket',
    pillars: ['groove-pocket', 'playing-changes'],
    durationMin: 10,
    instructions:
      'Ride the 1–5–6–4 with roots on the downbeats. Sit right in the centre of the beat, mute cleanly, and leave a little space before each chord change.',
    bpm: 112,
    difficulty: 'intermediate',
    context: 'nigerian-gospel',
    feel: 'straight',
    progressionId: 'prog-1564',
    tags: ['pocket', 'praise'],
  },
  {
    id: 'ex-pocket-ghost',
    name: 'Ghost notes for clarity',
    pillars: ['groove-pocket', 'technique'],
    durationMin: 8,
    instructions:
      'Play a root-fifth figure and add muted ghost notes on the "e" and "a". Keep the real notes strong and the ghosts felt-not-heard so the groove stays clean.',
    bpm: 108,
    difficulty: 'intermediate',
    context: 'afrobeats',
    feel: 'syncopated',
    tags: ['ghost notes', 'groove'],
  },
  {
    id: 'ex-pocket-highlife',
    name: 'Highlife bounce',
    pillars: ['groove-pocket'],
    durationMin: 10,
    instructions:
      'Over the highlife groove, anchor the 1 and 5 and let the line bounce with the guitar. Prioritise feel and buoyancy over note count.',
    bpm: 116,
    difficulty: 'intermediate',
    context: 'highlife',
    feel: 'syncopated',
    progressionId: 'prog-highlife-1-4-5',
    tags: ['highlife', 'bounce'],
  },

  // ── Number System ───────────────────────────────────────────
  {
    id: 'ex-num-1564-keys',
    name: 'Roots of 1 5 6 4 in three keys',
    pillars: ['number-system', 'chord-movement'],
    durationMin: 10,
    instructions:
      'Play the roots of 1 → 5 → 6 → 4 in D, then G, then Bb — thinking in numbers, not note names, the whole time. Say each number on the downbeat.',
    difficulty: 'beginner',
    progressionId: 'prog-1564',
    tags: ['numbers', 'roots', 'transposition'],
  },
  {
    id: 'ex-num-1451-roots-fifths',
    name: '1 4 5 1 with roots and fifths',
    pillars: ['number-system'],
    durationMin: 8,
    instructions:
      'Play 1 → 4 → 5 → 1 using only the root and 5th of each chord. Keep the 5th above the root, then try dropping it below for a fuller sound.',
    difficulty: 'beginner',
    progressionId: 'prog-1451',
    tags: ['numbers', 'root-fifth'],
  },
  {
    id: 'ex-num-6251-chart',
    name: 'Number chart: 6 2 5 1',
    pillars: ['number-system', 'playing-changes'],
    durationMin: 10,
    instructions:
      'Walk the roots of a 6 → 2 → 5 → 1 turnaround. Say each number out loud on the downbeat so the shape sticks in any key.',
    difficulty: 'intermediate',
    progressionId: 'prog-6251',
    tags: ['numbers', 'turnaround'],
  },
  {
    id: 'ex-num-call',
    name: 'Call the numbers cold',
    pillars: ['number-system', 'ear-training'],
    durationMin: 8,
    instructions:
      'Have someone (or a loop) play a progression and call the number of each chord — 1, 6, 4, 5 — before you play a note. Then join in on roots.',
    difficulty: 'intermediate',
    tags: ['numbers', 'listening'],
  },

  // ── Chord Movement ──────────────────────────────────────────
  {
    id: 'ex-chord-251-thirds',
    name: 'Play 2 5 1 targeting 3rds',
    pillars: ['chord-movement', 'playing-changes'],
    durationMin: 10,
    instructions:
      'Over a 2 → 5 → 1, land on the 3rd of each chord on beat 1 so the movement sings. Then switch to landing on the 7th and hear the difference.',
    bpm: 92,
    difficulty: 'intermediate',
    context: 'contemporary-gospel',
    feel: 'swing',
    progressionId: 'prog-251',
    tags: ['chord tones', 'changes'],
  },
  {
    id: 'ex-chord-1625',
    name: 'Smooth 1 6 2 5 movement',
    pillars: ['chord-movement'],
    durationMin: 8,
    instructions:
      'Play a 1 → 6 → 2 → 5 back-to-the-top turnaround, moving by the smallest distance between roots. Aim for a line that feels inevitable.',
    difficulty: 'intermediate',
    progressionId: 'prog-turn-1-6-2-5',
    tags: ['turnaround', 'voice leading'],
  },

  // ── Vamps ───────────────────────────────────────────────────
  {
    id: 'ex-vamp-worship',
    name: 'Worship vamp dynamics (1–4)',
    pillars: ['vamps', 'groove-pocket'],
    durationMin: 12,
    instructions:
      'Vamp on 1 and 4 in 6/8. Build from a whole-note root to a busier fill over eight bars, then bring it all the way back down. Serve the moment.',
    bpm: 66,
    difficulty: 'beginner',
    context: 'worship',
    feel: '6/8',
    progressionId: 'prog-worship-1-4',
    tags: ['vamp', 'dynamics'],
  },
  {
    id: 'ex-vamp-praise',
    name: 'Praise vamp on 1 5 6 4',
    pillars: ['vamps', 'passing-notes'],
    durationMin: 10,
    instructions:
      'Ride the 1–5–6–4 as a praise vamp. Keep it locked for four cycles, then add one tasteful passing tone into each new chord.',
    bpm: 120,
    difficulty: 'intermediate',
    context: 'praise',
    feel: 'straight',
    progressionId: 'prog-1564',
    tags: ['vamp', 'praise'],
  },

  // ── Passing Notes ───────────────────────────────────────────
  {
    id: 'ex-pass-walkup',
    name: 'Walk-up into the 1',
    pillars: ['passing-notes', 'transitions'],
    durationMin: 10,
    instructions:
      'Connect the 4 back to the 1 with a diatonic then a chromatic walk-up. Place the passing tones on the "and" so the 1 lands strong on the downbeat.',
    bpm: 100,
    difficulty: 'intermediate',
    context: 'nigerian-gospel',
    feel: 'straight',
    progressionId: 'prog-walkup-4-1',
    tags: ['walk-up', 'into the 1'],
  },
  {
    id: 'ex-pass-chromatic-4-5',
    name: 'Chromatic passing 4 to 5',
    pillars: ['passing-notes'],
    durationMin: 8,
    instructions:
      'Move from the 4 to the 5 using the b5/#4 as a chromatic passing tone. Keep it smooth and in time — one clean approach note, not a scramble.',
    difficulty: 'intermediate',
    context: 'contemporary-gospel',
    tags: ['chromatic', 'approach'],
  },
  {
    id: 'ex-pass-diatonic-and',
    name: "Diatonic passing on the 'and'",
    pillars: ['passing-notes', 'groove-pocket'],
    durationMin: 8,
    instructions:
      'Hold roots for a bar each, then fill the last "and" with a single diatonic passing tone that leads into the next root. Never crowd the pocket.',
    difficulty: 'beginner',
    tags: ['passing tones', 'taste'],
  },

  // ── Fills ───────────────────────────────────────────────────
  {
    id: 'ex-fill-turnaround',
    name: 'Turnaround fill into the top',
    pillars: ['fills', 'transitions'],
    durationMin: 8,
    instructions:
      'On the last two bars of a cycle, play a short fill that sets up beat 1 of the next section. Keep it under a bar and always resolve to the 1.',
    bpm: 92,
    difficulty: 'intermediate',
    context: 'contemporary-gospel',
    feel: 'swing',
    progressionId: 'prog-6251',
    tags: ['fill', 'set-up'],
  },
  {
    id: 'ex-fill-6-8',
    name: 'End-of-section fill in 6/8',
    pillars: ['fills'],
    durationMin: 8,
    instructions:
      'In 6/8, play a rolling triplet fill on the last bar of the phrase. Land clean on the downbeat and get straight back into the pocket.',
    difficulty: 'intermediate',
    context: 'gospel-6-8',
    feel: '6/8',
    tags: ['fill', '6/8'],
  },

  // ── Transitions ─────────────────────────────────────────────
  {
    id: 'ex-trans-verse-chorus',
    name: 'Verse-to-chorus transition',
    pillars: ['transitions', 'fills'],
    durationMin: 8,
    instructions:
      'Practise the two bars that hand off from verse to chorus: build energy, drop a short fill, and change your note density as the section opens up.',
    difficulty: 'intermediate',
    tags: ['transition', 'sections'],
  },
  {
    id: 'ex-trans-key-up',
    name: 'Modulate up a whole step',
    pillars: ['transitions', 'number-system'],
    durationMin: 10,
    instructions:
      'Take a 1–5–6–4 and lift it up a whole step on the MD’s cue. Think in numbers so the shape is identical — only the starting root moves.',
    difficulty: 'advanced',
    progressionId: 'prog-1564',
    tags: ['modulation', 'transposition'],
  },
  {
    id: 'ex-trans-double-half',
    name: 'Drop into worship',
    pillars: ['transitions', 'groove-pocket'],
    durationMin: 8,
    instructions:
      'Move from an up-tempo praise feel into a half-time worship feel without dropping the pulse. Thin out the line and let the space grow.',
    difficulty: 'intermediate',
    context: 'worship',
    feel: 'half-time',
    tags: ['feel change', 'dynamics'],
  },

  // ── Playing Changes ─────────────────────────────────────────
  {
    id: 'ex-changes-6251',
    name: 'Play the 6 2 5 1 changes',
    pillars: ['playing-changes', 'chord-movement'],
    durationMin: 12,
    instructions:
      'Play the changes over the Sunday Turnaround. Outline each chord with root, 5th and 3rd, then add a chromatic approach into the 1.',
    bpm: 88,
    difficulty: 'advanced',
    context: 'contemporary-gospel',
    feel: 'swing',
    progressionId: 'prog-6251',
    tags: ['changes', 'turnaround'],
  },
  {
    id: 'ex-changes-follow-md',
    name: 'Follow the MD through a vamp',
    pillars: ['playing-changes', 'ear-training'],
    durationMin: 10,
    instructions:
      'Over an open 1–4 worship vamp, react in real time to direction changes — a lift to the 5, a drop back to the 1 — without a chart. Watch and listen.',
    difficulty: 'advanced',
    context: 'worship',
    feel: '6/8',
    progressionId: 'prog-worship-1-4',
    tags: ['spontaneous', 'listening'],
  },

  // ── Ear Training ────────────────────────────────────────────
  {
    id: 'ex-ear-movement',
    name: 'Identify chord movement by ear',
    pillars: ['ear-training', 'chord-movement'],
    durationMin: 10,
    instructions:
      'Loop a progression and name the movement by ear — is that a 6, a 4, a 5? Confirm on the bass only after you have committed to an answer.',
    difficulty: 'intermediate',
    tags: ['listening', 'numbers'],
  },
  {
    id: 'ex-ear-4-vs-5',
    name: 'Hear the 4 vs the 5',
    pillars: ['ear-training', 'number-system'],
    durationMin: 8,
    instructions:
      'The two most common gospel moves. Have a chord played and instantly call whether it went to the 4 or the 5, then check. Speed it up over time.',
    difficulty: 'beginner',
    tags: ['listening', 'intervals'],
  },
  {
    id: 'ex-ear-turnaround',
    name: 'Recognise the turnaround',
    pillars: ['ear-training'],
    durationMin: 8,
    instructions:
      'Listen for the moment a section resets. Learn to hear a 2–5–1 or 6–2–5–1 coming so you are early to the 1, not late.',
    difficulty: 'intermediate',
    tags: ['listening', 'form'],
  },

  // ── Technique (transferable, minority) ──────────────────────
  {
    id: 'ex-tech-alternate',
    name: 'Alternate plucking, even & clean',
    pillars: ['technique'],
    durationMin: 8,
    instructions:
      'Strict alternating i–m across a one-octave major scale. Every note equal in volume and length — the foundation for a clean gospel pocket.',
    bpm: 90,
    difficulty: 'beginner',
    tags: ['fingerstyle', 'timing'],
  },
  {
    id: 'ex-tech-muting',
    name: 'Left-hand muting for clarity',
    pillars: ['technique', 'groove-pocket'],
    durationMin: 8,
    instructions:
      'Play a repeating root–octave figure and mute every note cleanly with the fretting hand before the next attack. No ringing tails in the pocket.',
    bpm: 84,
    difficulty: 'intermediate',
    tags: ['muting', 'control'],
  },

  // ── Repertoire ──────────────────────────────────────────────
  {
    id: 'ex-rep-worship-section',
    name: "Learn a song's worship section",
    pillars: ['repertoire', 'playing-changes'],
    durationMin: 15,
    instructions:
      'Take one worship section from your set and learn it by its numbers. Play it through slowly, then at tempo, following the changes without a chart.',
    difficulty: 'intermediate',
    tags: ['song', 'sections'],
  },
  {
    id: 'ex-rep-vamp-section',
    name: 'Drill the praise/vamp section',
    pillars: ['repertoire', 'vamps'],
    durationMin: 12,
    instructions:
      'Isolate the praise or vamp section of a song and build stamina: keep it locked and dynamic for a full four minutes, as you would in service.',
    difficulty: 'intermediate',
    tags: ['song', 'stamina'],
  },
];

export function getExercise(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}

export function exercisesByPillar(pillar: PillarId): Exercise[] {
  return exercises.filter((e) => e.pillars.includes(pillar));
}
