import { describe, it, expect } from 'vitest';
import {
  CONTEXT_WEIGHTS,
  KIND_WEIGHTS,
  mergeWeights,
  resolvePracticeWeights,
} from './sessionRules';

describe('mergeWeights', () => {
  it('adds overlapping pillars', () => {
    expect(
      mergeWeights(
        { 'groove-pocket': 2, vamps: 1 },
        { 'groove-pocket': 1, fills: 1 },
      ),
    ).toEqual({ 'groove-pocket': 3, vamps: 1, fills: 1 });
  });
});

describe('resolvePracticeWeights', () => {
  it('prioritizes number-system + chord-movement for a number-system focus', () => {
    const w = resolvePracticeWeights({
      focus: ['number-system', 'chord-movement'],
    });
    expect(w['number-system']).toBeGreaterThan(0);
    expect(w['chord-movement']).toBeGreaterThan(0);
  });

  it('layers vamp kind weights', () => {
    const w = resolvePracticeWeights({ kind: 'vamp' });
    expect(w.vamps).toBeGreaterThanOrEqual(KIND_WEIGHTS.vamp.vamps!);
    expect(w['groove-pocket']).toBeGreaterThan(0);
    expect(w['passing-notes']).toBeGreaterThan(0);
    expect(w.fills).toBeGreaterThan(0);
  });

  it('layers praise context: groove, vamps, passing notes, fills, transitions', () => {
    const w = resolvePracticeWeights({ context: 'praise' });
    const praise = CONTEXT_WEIGHTS.praise;
    expect(w['groove-pocket']).toBe(praise['groove-pocket']);
    expect(w.vamps).toBe(praise.vamps);
    expect(w['passing-notes']).toBe(praise['passing-notes']);
    expect(w.fills).toBe(praise.fills);
    expect(w.transitions).toBe(praise.transitions);
  });

  it('layers worship context: groove, chord movement, playing changes, transitions, ear', () => {
    const w = resolvePracticeWeights({ context: 'worship' });
    expect(w['groove-pocket']).toBeGreaterThan(0);
    expect(w['chord-movement']).toBeGreaterThan(0);
    expect(w['playing-changes']).toBeGreaterThan(0);
    expect(w.transitions).toBeGreaterThan(0);
    expect(w['ear-training']).toBeGreaterThan(0);
  });

  it('layers 6/8 gospel: groove, playing changes, ear, chord movement', () => {
    const w = resolvePracticeWeights({ context: 'gospel-6-8' });
    expect(w['groove-pocket']).toBeGreaterThan(0);
    expect(w['playing-changes']).toBeGreaterThan(0);
    expect(w['ear-training']).toBeGreaterThan(0);
    expect(w['chord-movement']).toBeGreaterThan(0);
  });

  it('merges section pillars on top of kind and context', () => {
    const w = resolvePracticeWeights({
      kind: 'progression',
      context: 'praise',
      sectionPillars: ['groove-pocket', 'number-system'],
    });
    expect(w['groove-pocket']).toBeGreaterThan(
      (KIND_WEIGHTS.progression['groove-pocket'] ?? 0) +
        (CONTEXT_WEIGHTS.praise['groove-pocket'] ?? 0),
    );
    expect(w['number-system']).toBeGreaterThan(
      KIND_WEIGHTS.progression['number-system'] ?? 0,
    );
  });
});
