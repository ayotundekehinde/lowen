import type {
  ChordProgression,
  GospelStyle,
  Loop,
  MusicalKey,
  PillarId,
  SessionContext,
  Song,
  SongSection,
} from './types';
import { formatKey, numbersLine } from './music';
import { GOSPEL_STYLES } from './styles';
import { PILLARS } from './pillars';

export interface BuildSessionContextInput {
  progression?: ChordProgression;
  key?: MusicalKey;
  keyLabel?: string;
  song?: Song;
  section?: SongSection;
  loop?: Loop;
  context?: GospelStyle;
  pillars?: PillarId[];
  styleLabel?: string;
}

function unique(values: Array<string | undefined>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    if (!value || seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return out;
}

export function formatSessionMeta(
  keyLabel: string | undefined,
  styles: Array<string | undefined>,
): string | undefined {
  const parts = unique([keyLabel, ...styles]);
  return parts.length ? parts.join(' · ') : undefined;
}

/**
 * Build the musical session banner. Language follows what is being practiced:
 * a song section, a vamp, or a standalone progression.
 */
export function buildSessionContext({
  progression,
  key,
  keyLabel,
  song,
  section,
  loop,
  context,
  pillars,
  styleLabel,
}: BuildSessionContextInput): SessionContext {
  const numbers = progression ? numbersLine(progression.chords) : undefined;
  const resolvedContext =
    context ?? section?.context ?? song?.context ?? progression?.context ?? loop?.context;
  const songStyle = song ? GOSPEL_STYLES[song.context].label : undefined;
  const sectionStyle = section?.context
    ? GOSPEL_STYLES[section.context].label
    : undefined;
  const progressionStyle = progression?.context
    ? GOSPEL_STYLES[progression.context].label
    : undefined;
  const loopStyle = loop ? GOSPEL_STYLES[loop.context].label : undefined;
  const primaryStyle =
    styleLabel ??
    sectionStyle ??
    songStyle ??
    (resolvedContext ? GOSPEL_STYLES[resolvedContext].label : undefined) ??
    progressionStyle ??
    loopStyle;

  const resolvedKeyLabel = keyLabel ?? (key ? formatKey(key) : undefined);
  const meta = formatSessionMeta(resolvedKeyLabel, [
    songStyle,
    sectionStyle && sectionStyle !== songStyle ? sectionStyle : undefined,
    !song && !section ? primaryStyle : undefined,
  ]);

  const resolvedPillars = pillars ?? section?.pillars ?? progression?.pillars;
  const focusLabel = resolvedPillars?.[0]
    ? `Practice focus: ${PILLARS[resolvedPillars[0]].label}`
    : undefined;

  let heading: string;
  if (section) {
    heading = `Preparing: ${section.name}`;
  } else if (progression?.kind === 'vamp') {
    heading = 'Vamp Practice';
  } else if (numbers) {
    heading = `Practicing: ${numbers}`;
  } else if (loop) {
    heading = `Preparing: ${loop.name}`;
  } else if (song) {
    heading = `Preparing: ${song.title}`;
  } else {
    heading = 'Practice session';
  }

  const label = unique([heading, numbers, meta]).join(' · ');

  return {
    heading,
    numbers,
    meta,
    focusLabel,
    label,
    songId: song?.id,
    songTitle: song?.title,
    sectionId: section?.id,
    sectionName: section?.name,
    progressionId: progression?.id,
    loopId: loop?.id,
    loopName: loop?.name,
    key: resolvedKeyLabel,
    style: primaryStyle,
    context: resolvedContext,
    kind: progression?.kind,
    pillars: resolvedPillars,
  };
}
