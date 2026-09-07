/**
 * Barrel for the mock data layer. Everything the UI needs about seed data is
 * re-exported here so components import from a single, swappable module. When a
 * real backend is added, only this layer needs to change.
 */
export { songs, getSong } from './songs';
export { loops, getLoop } from './loops';
export { exercises, getExercise, exercisesByCategory } from './exercises';
export { sessionHistory } from './sessions';
export { skills } from './skills';
