import type { Song } from '@/lib/types';

/**
 * Repertoire a Nigerian/Gospel bassist is likely learning for service. Keys and
 * tempos are practical practice references (churches transpose freely) — the
 * point is to learn each song by section and connect it to its number-system
 * changes, not to be a definitive chart.
 */
export const songs: Song[] = [
  {
    id: 'song-way-maker',
    title: 'Way Maker',
    artist: 'Sinach',
    context: 'contemporary-gospel',
    key: 'E Major',
    keyRoot: { tonic: 'E', mode: 'major' },
    bpm: 68,
    tuning: 'Standard (EADG)',
    difficulty: 'beginner',
    progress: 72,
    favorite: true,
    notes:
      'Think 1–5–6–4 the whole way through and let it breathe. Hold roots under the verse, then open up into the bridge build. Follow the MD on the spontaneous worship at the end.',
    loopIds: ['loop-praise-1451', 'loop-sunday-turn'],
    progressionIds: ['prog-1564', 'prog-turn-1-6-2-5'],
    sections: [
      { id: 'song-way-maker-verse', name: 'Verse', progress: 85, progressionId: 'prog-1564' },
      { id: 'song-way-maker-chorus', name: 'Chorus', progress: 80, progressionId: 'prog-1564' },
      { id: 'song-way-maker-bridge', name: 'Bridge', progress: 55, progressionId: 'prog-turn-1-6-2-5' },
      { id: 'song-way-maker-worship', name: 'Spontaneous Worship', progress: 40 },
    ],
  },
  {
    id: 'song-ekwueme',
    title: 'Ekwueme',
    artist: 'Prospa Ochimana',
    context: 'gospel-6-8',
    key: 'Bb Major',
    keyRoot: { tonic: 'Bb', mode: 'major' },
    bpm: 66,
    tuning: 'Standard (EADG)',
    difficulty: 'intermediate',
    progress: 48,
    favorite: true,
    notes:
      'Compound 6/8 — feel the rolling triplet pulse under the roots. Keep the 1–4 vamp patient and dynamic, and save the fills for the section turns.',
    loopIds: ['loop-worship-6-8'],
    progressionIds: ['prog-worship-1-4', 'prog-6-8-1-5-6-4'],
    sections: [
      { id: 'song-ekwueme-intro', name: 'Intro Vamp', progress: 60, progressionId: 'prog-worship-1-4' },
      { id: 'song-ekwueme-verse', name: 'Verse', progress: 50, progressionId: 'prog-6-8-1-5-6-4' },
      { id: 'song-ekwueme-chorus', name: 'Chorus', progress: 45, progressionId: 'prog-6-8-1-5-6-4' },
      { id: 'song-ekwueme-worship', name: 'Worship', progress: 30, progressionId: 'prog-worship-1-4' },
    ],
  },
  {
    id: 'song-imela',
    title: 'Imela',
    artist: 'Nathaniel Bassey',
    context: 'nigerian-gospel',
    key: 'A Major',
    keyRoot: { tonic: 'A', mode: 'major' },
    bpm: 72,
    tuning: 'Standard (EADG)',
    difficulty: 'intermediate',
    progress: 55,
    favorite: false,
    notes:
      'Thanksgiving worship. Lock a warm root-and-fifth pocket, then walk gracefully into the 1 at the top of each cycle. Leave space — let the horns and keys speak.',
    loopIds: ['loop-naija-praise', 'loop-walkup-drills'],
    progressionIds: ['prog-1564', 'prog-walkup-4-1'],
    sections: [
      { id: 'song-imela-verse', name: 'Verse', progress: 65, progressionId: 'prog-1564' },
      { id: 'song-imela-chorus', name: 'Chorus', progress: 60, progressionId: 'prog-1564' },
      { id: 'song-imela-turn', name: 'Turnaround', progress: 40, progressionId: 'prog-walkup-4-1' },
    ],
  },
  {
    id: 'song-igwe',
    title: 'Igwe',
    artist: 'Midnight Crew',
    context: 'nigerian-gospel',
    key: 'C Major',
    keyRoot: { tonic: 'C', mode: 'major' },
    bpm: 132,
    tuning: 'Standard (EADG)',
    difficulty: 'advanced',
    progress: 38,
    favorite: true,
    notes:
      'Fast Naija praise. Drive the 1–4–5 with a tight pocket and clean muting, and nail the walk-ups without rushing. Think numbers so you can survive a key jump mid-praise.',
    loopIds: ['loop-praise-1451', 'loop-afro-highlife'],
    progressionIds: ['prog-1451', 'prog-highlife-1-4-5'],
    sections: [
      { id: 'song-igwe-intro', name: 'Intro', progress: 50, progressionId: 'prog-1451' },
      { id: 'song-igwe-praise', name: 'Praise', progress: 40, progressionId: 'prog-1451' },
      { id: 'song-igwe-vamp', name: 'Praise Vamp', progress: 30, progressionId: 'prog-highlife-1-4-5' },
    ],
  },
  {
    id: 'song-praise-medley',
    title: 'Praise Medley',
    artist: 'Praise Set (practice)',
    context: 'afro-gospel',
    key: 'D Major',
    keyRoot: { tonic: 'D', mode: 'major' },
    bpm: 116,
    tuning: 'Standard (EADG)',
    difficulty: 'intermediate',
    progress: 34,
    favorite: false,
    notes:
      'A practice medley for building praise-set stamina. Stay in numbers so you can follow the MD when the key jumps, ride the 1–5–6–4, and keep the passing tones into the 1 tasteful.',
    loopIds: ['loop-naija-praise', 'loop-afrobeats-praise'],
    progressionIds: ['prog-1564', 'prog-praise-4-5-1'],
    sections: [
      { id: 'song-praise-medley-intro', name: 'Intro', progress: 60, progressionId: 'prog-walkup-4-1' },
      { id: 'song-praise-medley-praise', name: 'Praise', progress: 40, progressionId: 'prog-1564' },
      { id: 'song-praise-medley-turn', name: 'Turnaround', progress: 25, progressionId: 'prog-praise-4-5-1' },
      { id: 'song-praise-medley-worship', name: 'Worship', progress: 20, progressionId: 'prog-worship-1-4' },
    ],
  },
];

export function getSong(id: string): Song | undefined {
  return songs.find((s) => s.id === id);
}
