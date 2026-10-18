import { describe, it, expect } from 'vitest';
import {
  beatsPerBar,
  chordIndexAtBar,
  clickIntervalSec,
  isAccentBeat,
  parseMeter,
  tapTempoBpm,
} from './metronome';

describe('metronome math', () => {
  it('treats 6/8 as six eighths with accents on 1 and 4', () => {
    expect(parseMeter('6/8')).toBe('6/8');
    expect(parseMeter('4/4', '6/8')).toBe('6/8');
    expect(beatsPerBar('6/8')).toBe(6);
    expect(isAccentBeat(0, '6/8')).toBe(true);
    expect(isAccentBeat(3, '6/8')).toBe(true);
    expect(isAccentBeat(1, '6/8')).toBe(false);
    expect(isAccentBeat(0, '4/4')).toBe(true);
    expect(isAccentBeat(1, '4/4')).toBe(false);
  });

  it('uses dotted-quarter BPM for 6/8 click spacing', () => {
    expect(clickIntervalSec(60, '4/4')).toBeCloseTo(1);
    // 60 dotted quarters/min → 180 eighths/min → 1/3 s
    expect(clickIntervalSec(60, '6/8')).toBeCloseTo(1 / 3);
  });

  it('walks a vamp across bars using chord widths', () => {
    const vamp = [
      { degree: 1 as const, bars: 2 },
      { degree: 4 as const, bars: 2 },
    ];
    expect(chordIndexAtBar(vamp, 0)).toBe(0);
    expect(chordIndexAtBar(vamp, 1)).toBe(0);
    expect(chordIndexAtBar(vamp, 2)).toBe(1);
    expect(chordIndexAtBar(vamp, 3)).toBe(1);
    expect(chordIndexAtBar(vamp, 4)).toBe(0);
  });

  it('derives tap tempo from timestamp gaps', () => {
    expect(tapTempoBpm([0])).toBeNull();
    expect(tapTempoBpm([0, 500, 1000, 1500])).toBe(120);
  });
});
