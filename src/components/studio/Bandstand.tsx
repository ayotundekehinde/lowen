import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressionView } from '@/components/music/ProgressionView';
import { GrooveTransport } from './GrooveTransport';
import { WalkStyleControl } from './WalkStyleControl';
import { MdCueBar } from './MdCueBar';
import { Button } from '@/components/ui/Button';
import { SETLIST_SLOT_LABEL } from '@/data/setlists';
import { parseMeter } from '@/lib/metronome';
import { formatKey } from '@/lib/music';
import { applyKeyJump, jumpCueLabel, shouldJumpOnBar } from '@/lib/keyJump';
import { resolveSetItemKey } from '@/lib/setlist';
import { generateSectionSession } from '@/lib/sessionGenerator';
import { GOSPEL_STYLES } from '@/lib/styles';
import type { WalkStyle } from '@/lib/walk';
import type { MusicalKey } from '@/lib/types';
import { usePractice } from '@/store/practiceStore';
import { ChevronLeft, ChevronRight, Dumbbell, ListMusic } from 'lucide-react';
import { cn } from '@/lib/cn';

export function Bandstand() {
  const navigate = useNavigate();
  const {
    songs,
    getSongById,
    resolveSongSection,
    exercises,
    setActivePlan,
    sundaySet,
  } = usePractice();

  const setSongs = sundaySet.items
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
  const [walkStyle, setWalkStyle] = useState<WalkStyle>('walk-up');
  const [everyBars, setEveryBars] = useState(0);
  const [cue, setCue] = useState<string | null>(null);

  const song = catalog[songIndex] ?? catalog[0];
  const section = song?.sections[sectionIndex] ?? song?.sections[0];
  const resolved = song && section ? resolveSongSection(song, section) : null;
  const setItem = setSongs[songIndex]?.item;
  const writtenKey: MusicalKey =
    setItem && song
      ? resolveSetItemKey(setItem, song)
      : (resolved?.key ?? { tonic: 'C', mode: 'major' });

  const writtenTonic = writtenKey.tonic;
  const writtenMode = writtenKey.mode;
  const [liveKey, setLiveKey] = useState<MusicalKey>(writtenKey);
  useEffect(() => {
    setLiveKey({ tonic: writtenTonic, mode: writtenMode });
    setCue(null);
  }, [writtenTonic, writtenMode, songIndex, sectionIndex]);

  const chords = resolved?.progression?.chords ?? [];
  const meter = parseMeter(
    resolved?.loop?.timeSignature ?? resolved?.progression?.timeSignature,
    resolved?.loop?.feel ?? resolved?.progression?.feel,
  );
  const bpm = resolved?.loop?.bpm ?? song?.bpm ?? 90;

  useEffect(() => {
    setWalkStyle(meter === '6/8' ? 'roll' : 'walk-up');
  }, [meter, songIndex, sectionIndex]);

  if (!song || !section) {
    return <p className="text-ink-muted">No songs on the stand tonight.</p>;
  }

  const slot = setItem?.slot;
  const jump = (semitones: number) => {
    setLiveKey((k) => {
      const next = applyKeyJump(k, semitones);
      setCue(jumpCueLabel(semitones, next));
      return next;
    });
  };

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
        key: liveKey,
        totalMinutes: 20,
        mode: 'service',
      }),
    );
    navigate('/practice');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-prose text-sm text-ink-muted">
          Walk this Sunday’s set section by section. Click, walking bass,
          numbers — and survive the key jump.
        </p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/sunday')}
          icon={<ListMusic size={14} />}
        >
          Edit set
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {catalog.map((s, i) => (
          <button
            key={setSongs[i]?.item.id ?? s.id}
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
              {song.artist} · {formatKey(liveKey)} · {bpm} BPM
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
            musicKey={liveKey}
            activeIndex={playing ? activeIndex : undefined}
          />
        )}
      </div>

      <MdCueBar
        liveKey={liveKey}
        writtenKey={writtenKey}
        onJump={jump}
        onReset={() => {
          setLiveKey(writtenKey);
          setCue(null);
        }}
        everyBars={everyBars}
        onEveryBars={setEveryBars}
        cue={cue}
      />

      <WalkStyleControl value={walkStyle} onChange={setWalkStyle} />

      <GrooveTransport
        bpm={bpm}
        meter={meter}
        chords={chords}
        musicKey={liveKey}
        playing={playing}
        onPlayingChange={setPlaying}
        click={click}
        onClickChange={setClick}
        bass={bass}
        onBassChange={setBass}
        walkStyle={walkStyle}
        onChordIndex={setActiveIndex}
        onBar={(bar) => {
          if (shouldJumpOnBar(bar, everyBars)) jump(1);
        }}
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
