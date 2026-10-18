import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressionView } from '@/components/music/ProgressionView';
import { GrooveTransport } from './GrooveTransport';
import { Button } from '@/components/ui/Button';
import { sundaySetForDate, SETLIST_SLOT_LABEL } from '@/data/setlists';
import { parseMeter } from '@/lib/metronome';
import { formatKey } from '@/lib/music';
import { generateSectionSession } from '@/lib/sessionGenerator';
import { GOSPEL_STYLES } from '@/lib/styles';
import { usePractice } from '@/store/practiceStore';
import { ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/cn';

export function Bandstand() {
  const navigate = useNavigate();
  const {
    songs,
    getSongById,
    resolveSongSection,
    exercises,
    setActivePlan,
  } = usePractice();
  const set = useMemo(() => sundaySetForDate(), []);
  const setSongs = set.items
    .map((item) => ({ item, song: getSongById(item.songId) }))
    .filter((x): x is typeof x & { song: NonNullable<typeof x.song> } =>
      Boolean(x.song),
    );

  const catalog = setSongs.length
    ? setSongs.map((x) => x.song)
    : songs.slice(0, 4);

  const [songIndex, setSongIndex] = useState(0);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [click, setClick] = useState(true);
  const [bass, setBass] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const song = catalog[songIndex] ?? catalog[0];
  const section = song?.sections[sectionIndex] ?? song?.sections[0];
  const resolved = song && section ? resolveSongSection(song, section) : null;
  const key = resolved?.key ?? { tonic: 'C' as const, mode: 'major' as const };
  const chords = resolved?.progression?.chords ?? [];
  const meter = parseMeter(
    resolved?.loop?.timeSignature ?? resolved?.progression?.timeSignature,
    resolved?.loop?.feel ?? resolved?.progression?.feel,
  );
  const bpm = resolved?.loop?.bpm ?? song?.bpm ?? 90;

  if (!song || !section) {
    return <p className="text-ink-muted">No songs on the stand tonight.</p>;
  }

  const slot = setSongs[songIndex]?.item.slot;
  const stepSong = (dir: number) => {
    setPlaying(false);
    setSongIndex((i) => (i + dir + catalog.length) % catalog.length);
    setSectionIndex(0);
  };
  const stepSection = (dir: number) => {
    setPlaying(false);
    setSectionIndex(
      (i) => (i + dir + song.sections.length) % song.sections.length,
    );
  };

  const practice = () => {
    setPlaying(false);
    setActivePlan(
      generateSectionSession(exercises, {
        song,
        section,
        progression: resolved?.progression,
        loop: resolved?.loop,
        key,
        totalMinutes: 20,
        mode: 'service',
      }),
    );
    navigate('/practice');
  };

  return (
    <div className="space-y-6">
      <p className="max-w-prose text-sm text-ink-muted">
        Walk the Sunday set section by section — click, roots, numbers — the
        way you would on the bandstand.
      </p>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {catalog.map((s, i) => (
          <button
            key={s.id}
            onClick={() => {
              setPlaying(false);
              setSongIndex(i);
              setSectionIndex(0);
            }}
            className={cn(
              'focus-ring shrink-0 rounded-full border px-3 py-1.5 text-sm',
              i === songIndex
                ? 'border-accent bg-accent/15 text-ink'
                : 'border-line text-ink-muted hover:text-ink',
            )}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="panel p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {slot ? SETLIST_SLOT_LABEL[slot] : GOSPEL_STYLES[song.context].label}
        </p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl font-semibold text-ink">
              {song.title}
            </h3>
            <p className="text-sm text-ink-muted">
              {song.artist} · {formatKey(key)} · {bpm} BPM
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => stepSong(-1)}
              icon={<ChevronLeft size={16} />}
              aria-label="Previous song"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => stepSong(1)}
              icon={<ChevronRight size={16} />}
              aria-label="Next song"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {song.sections.map((sec, i) => (
            <button
              key={sec.id}
              onClick={() => {
                setPlaying(false);
                setSectionIndex(i);
              }}
              className={cn(
                'focus-ring rounded-xl border px-3 py-2 text-sm',
                i === sectionIndex
                  ? 'border-accent bg-accent/10 text-ink'
                  : 'border-line text-ink-muted hover:text-ink',
              )}
            >
              {sec.name}
            </button>
          ))}
        </div>

        {chords.length > 0 && (
          <ProgressionView
            className="mt-5"
            chords={chords}
            musicKey={key}
            activeIndex={playing ? activeIndex : undefined}
          />
        )}
      </div>

      <GrooveTransport
        bpm={bpm}
        meter={meter}
        chords={chords}
        musicKey={key}
        playing={playing}
        onPlayingChange={setPlaying}
        click={click}
        onClickChange={setClick}
        bass={bass}
        onBassChange={setBass}
        onChordIndex={setActiveIndex}
        extra={
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => stepSection(-1)}>
              Prev section
            </Button>
            <Button variant="ghost" size="sm" onClick={() => stepSection(1)}>
              Next section
            </Button>
          </div>
        }
      />

      <Button
        variant="primary"
        size="lg"
        onClick={practice}
        icon={<Dumbbell size={18} />}
      >
        Practice this section
      </Button>
    </div>
  );
}
