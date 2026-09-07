/**
 * Barrel for the mock data layer. Everything the UI needs about seed data is
 * re-exported here so components import from a single, swappable module. When a
 * real backend is added, only this layer needs to change.
 *
 * Note: components should read *mutable* app state through the PracticeProvider
 * store (`usePractice`), not from these seed arrays directly. These exports are
 * the seed/source data and pure lookup helpers used to build the store.
 */
export { songs, getSong } from './songs';
export { loops, getLoop } from './loops';
export { exercises, getExercise, exercisesByCategory } from './exercises';
export { chordProgressions, getProgression } from './progressions';
export { sessionHistory } from './sessions';
export { skills } from './skills';
