import { describe, it, expect } from 'vitest';
import { applyKeyJump, jumpCueLabel, shouldJumpOnBar } from './keyJump';

describe('key jumps', () => {
  it('moves a half step without changing mode', () => {
    expect(applyKeyJump({ tonic: 'D', mode: 'major' }, 1)).toEqual({
      tonic: 'Eb',
      mode: 'major',
    });
    expect(applyKeyJump({ tonic: 'F', mode: 'major' }, -2)).toEqual({
      tonic: 'Eb',
      mode: 'major',
    });
  });

  it('never auto-jumps on bar 0', () => {
    expect(shouldJumpOnBar(0, 8)).toBe(false);
    expect(shouldJumpOnBar(8, 8)).toBe(true);
    expect(shouldJumpOnBar(7, 8)).toBe(false);
    expect(shouldJumpOnBar(16, 0)).toBe(false);
  });

  it('names the MD cue', () => {
    expect(jumpCueLabel(1, { tonic: 'E', mode: 'major' })).toBe(
      'MD: up a ½ step — now E Major',
    );
  });
});
