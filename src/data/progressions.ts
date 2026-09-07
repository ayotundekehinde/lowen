import type { ChordProgression } from '@/lib/types';

/**
 * A curated set of progressions common in Nigerian gospel, Afro-gospel, praise
 * and worship. Stored in the number system (degrees, not notes) so they can be
 * rendered or transposed into any key.
 */
export const chordProgressions: ChordProgression[] = [
  {
    id: 'prog-1564',
    name: '1 5 6 4',
    kind: 'progression',
    chords: [
      { degree: 1 },
      { degree: 5 },
      { degree: 6 },
      { degree: 4 },
    ],
    timeSignature: '4/4',
    suggestedKey: 'D Major',
    style: 'Contemporary Gospel',
    feel: 'straight',
    tags: ['praise', 'anthemic', 'four-chord'],
  },
  {
    id: 'prog-6251',
    name: '6 2 5 1',
    kind: 'turnaround',
    chords: [
      { degree: 6, quality: 'min7' },
      { degree: 2, quality: 'min7' },
      { degree: 5, quality: 'dom7' },
      { degree: 1, quality: 'maj7' },
    ],
    timeSignature: '4/4',
    suggestedKey: 'Bb Major',
    style: 'Gospel',
    feel: 'swing',
    tags: ['turnaround', 'ii-v', 'jazz-gospel'],
  },
  {
    id: 'prog-251',
    name: '2 5 1',
    kind: 'turnaround',
    chords: [
      { degree: 2, quality: 'min7' },
      { degree: 5, quality: 'dom7' },
      { degree: 1, quality: 'maj7' },
    ],
    timeSignature: '4/4',
    suggestedKey: 'F Major',
    style: 'Gospel',
    feel: 'swing',
    tags: ['turnaround', 'ii-v-i'],
  },
  {
    id: 'prog-worship-1-4',
    name: '1 4 (worship vamp)',
    kind: 'vamp',
    chords: [
      { degree: 1, bars: 2 },
      { degree: 4, bars: 2 },
    ],
    timeSignature: '4/4',
    suggestedKey: 'A Major',
    style: 'Worship',
    feel: '6/8',
    tags: ['vamp', 'meditative', 'spontaneous'],
  },
  {
    id: 'prog-afro-1-2-3',
    name: '1 2 3 (Afro climb)',
    kind: 'progression',
    chords: [
      { degree: 1 },
      { degree: 2, quality: 'min' },
      { degree: 3, quality: 'min' },
      { degree: 4 },
    ],
    timeSignature: '4/4',
    suggestedKey: 'C Major',
    style: 'Afro-Gospel',
    feel: 'afrobeat',
    tags: ['afro', 'ascending', 'highlife'],
  },
  {
    id: 'prog-praise-4-5-1',
    name: '4 5 1 (praise cadence)',
    kind: 'turnaround',
    chords: [
      { degree: 4 },
      { degree: 5 },
      { degree: 6, quality: 'min' },
      { degree: 1, bassDegree: 3 },
    ],
    timeSignature: '4/4',
    suggestedKey: 'G Major',
    style: 'Nigerian Gospel',
    feel: 'straight',
    tags: ['praise', 'cadence', 'inversions'],
  },
];

export function getProgression(id: string): ChordProgression | undefined {
  return chordProgressions.find((p) => p.id === id);
}
