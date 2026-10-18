import { describe, it, expect } from 'vitest';
import type { MusicalKey, NumberChord } from './types';
import { chordRootIndex } from './music';
import {
  beatsLeftInChord,
  chordToneIndex,
  upcomingChord,
  walkNoteForBeat,
} from './walk';

const C: MusicalKey = { tonic: 'C', mode: 'major' };
const ONE_FOUR: NumberChord[] = [{ degree: 1 }, { degree: 4 }];

describe('walkNoteForBeat', () => {
  it('roots only speak on accents', () => {
    const down = walkNoteForBeat(ONE_FOUR, C, 0, 0, '4/4', 'roots');
    const weak = walkNoteForBeat(ONE_FOUR, C, 0, 1, '4/4', 'roots');
    expect(down?.pitchIndex).toBe(chordRootIndex(C, { degree: 1 }));
    expect(down?.landing).toBe(true);
    expect(weak).toBeNull();
  });

  it('walk-up approaches the next chord chromatically on the last beat', () => {
    const last = walkNoteForBeat(ONE_FOUR, C, 0, 3, '4/4', 'walk-up');
    const four = chordRootIndex(C, { degree: 4 });
    expect(last?.landing).toBe(false);
    expect(last?.pitchIndex).toBe(((four - 1) + 12) % 12);
  });

  it('approach also plays the fifth on beat 3 of 4/4', () => {
    const mid = walkNoteForBeat(ONE_FOUR, C, 0, 2, '4/4', 'approach');
    expect(mid?.pitchIndex).toBe(chordToneIndex(C, { degree: 1 }, 5));
  });

  it('6/8 roll lands on the root then the third', () => {
    const vamp: NumberChord[] = [
      { degree: 1, bars: 2 },
      { degree: 4, bars: 2 },
    ];
    const one = walkNoteForBeat(vamp, C, 0, 0, '6/8', 'roll');
    const three = walkNoteForBeat(vamp, C, 0, 1, '6/8', 'roll');
    expect(one?.pitchIndex).toBe(chordRootIndex(C, { degree: 1 }));
    expect(one?.landing).toBe(true);
    expect(three?.pitchIndex).toBe(chordToneIndex(C, { degree: 1 }, 3));
  });

  it('counts beats left in a one-bar chord', () => {
    expect(beatsLeftInChord(ONE_FOUR, 0, 0, '4/4')).toBe(4);
    expect(beatsLeftInChord(ONE_FOUR, 0, 3, '4/4')).toBe(1);
    expect(upcomingChord(ONE_FOUR, 0, 3, '4/4').degree).toBe(4);
  });
});
