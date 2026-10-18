import type {
  ChordProgression,
  GospelStyle,
  Loop,
  MusicalKey,
  PillarId,
  ProgressionKind,
  Song,
  SongSection,
} from './types';
import { parseKey } from './music';
import { GOSPEL_STYLES } from './styles';
import { PILLARS } from './pillars';

/**
 * A song section resolved against the shared progression and loop catalogs.
 * Lookups go through these helpers (or the store selectors that wrap them) so
 * the Song → Section → Progression → Loop chain stays in one place.
 */
export interface ResolvedSection {
  song: Song;
  section: SongSection;
  progression?: ChordProgression;
  loop?: Loop;
  key: MusicalKey;
  keyLabel: string;
  context: GospelStyle;
  pillars: PillarId[];
}

export function getSectionProgression(
  section: SongSection,
  progressions: ChordProgression[],
): ChordProgression | undefined {
  if (!section.progressionId) return undefined;
  return progressions.find((p) => p.id === section.progressionId);
}

export function getSectionLoop(
  section: SongSection,
  loops: Loop[],
): Loop | undefined {
  if (!section.loopId) return undefined;
  return loops.find((l) => l.id === section.loopId);
}

export function resolveSectionKey(song: Song, section: SongSection): MusicalKey {
  return (
    section.keyRoot ??
    (section.key ? parseKey(section.key) : undefined) ??
    song.keyRoot ??
    parseKey(song.key)
  );
}

export function resolveSectionKeyLabel(
  song: Song,
  section: SongSection,
): string {
  return section.key ?? song.key;
}

export function resolveSectionContext(
  song: Song,
  section: SongSection,
): GospelStyle {
  return section.context ?? song.context;
}

export function resolveSectionPillars(
  section: SongSection,
  progression?: ChordProgression,
): PillarId[] {
  if (section.pillars?.length) return section.pillars;
  if (progression?.pillars?.length) return progression.pillars;
  return ['repertoire', 'playing-changes'];
}

export function resolveSection(
  song: Song,
  section: SongSection,
  progressions: ChordProgression[],
  loops: Loop[],
): ResolvedSection {
  const progression = getSectionProgression(section, progressions);
  const loop = getSectionLoop(section, loops);
  return {
    song,
    section,
    progression,
    loop,
    key: resolveSectionKey(song, section),
    keyLabel: resolveSectionKeyLabel(song, section),
    context: resolveSectionContext(song, section),
    pillars: resolveSectionPillars(section, progression),
  };
}

export function getLoopsByProgressionId(
  loops: Loop[],
  progressionId: string,
): Loop[] {
  return loops.filter((l) => l.progressionId === progressionId);
}

export function getSongsByProgressionId(
  songs: Song[],
  progressionId: string,
): Song[] {
  return songs.filter(
    (s) =>
      s.progressionIds?.includes(progressionId) ||
      s.sections.some((sec) => sec.progressionId === progressionId),
  );
}

export interface ProgressionFilter {
  query?: string;
  pillar?: PillarId | 'all';
  context?: GospelStyle | 'all';
  kind?: ProgressionKind | 'all';
}

/** Filter progressions by search, pillar, gospel context and kind. */
export function filterProgressions(
  progressions: ChordProgression[],
  { query, pillar, context, kind }: ProgressionFilter,
): ChordProgression[] {
  const q = query?.trim().toLowerCase() ?? '';
  return progressions.filter((p) => {
    if (kind && kind !== 'all' && p.kind !== kind) return false;
    if (context && context !== 'all' && p.context !== context) return false;
    if (pillar && pillar !== 'all' && !p.pillars?.includes(pillar)) return false;
    if (!q) return true;
    const haystack = [
      p.name,
      p.kind,
      p.suggestedKey ?? '',
      p.feel ?? '',
      p.context ? GOSPEL_STYLES[p.context].label : '',
      ...(p.tags ?? []),
      ...(p.pillars ?? []).map((id) => PILLARS[id].label),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}
