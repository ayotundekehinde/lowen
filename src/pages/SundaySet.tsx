import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { KeySelector } from '@/components/music/KeySelector';
import { SETLIST_SLOT_LABEL, type SetlistSlot } from '@/data/setlists';
import {
  moveSetItem,
  newSetItem,
  resolveSetItemKey,
  SETLIST_SLOT_LIST,
  withItemKey,
} from '@/lib/setlist';
import { formatKey } from '@/lib/music';
import { usePractice } from '@/store/practiceStore';
import {
  ArrowDown,
  ArrowUp,
  AudioLines,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';

export function SundaySetPage() {
  const navigate = useNavigate();
  const {
    songs,
    sundaySet,
    sundaySetIsCustom,
    saveSundaySet,
    resetSundaySet,
    getSongById,
  } = usePractice();

  const patch = (items: typeof sundaySet.items, title = sundaySet.title) => {
    saveSundaySet({ ...sundaySet, title, items });
  };

  const addSong = () => {
    const used = new Set(sundaySet.items.map((i) => i.songId));
    const next = songs.find((s) => !used.has(s.id)) ?? songs[0];
    if (!next) return;
    const slot: SetlistSlot =
      SETLIST_SLOT_LIST[sundaySet.items.length] ?? 'praise';
    patch([...sundaySet.items, newSetItem(next, slot)]);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="This Sunday"
        title={sundaySetIsCustom ? 'Your set' : sundaySet.title}
        subtitle="Pick the songs, keys, and slots. Home and Bandstand follow this set."
        actions={
          <div className="flex gap-2">
            {sundaySetIsCustom && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetSundaySet}
                icon={<RotateCcw size={14} />}
              >
                This week’s board
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/studio?lab=bandstand')}
              icon={<AudioLines size={14} />}
            >
              Bandstand
            </Button>
          </div>
        }
      />

      {!sundaySetIsCustom && (
        <p className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-muted">
          This is the rotating week board. Change anything and it becomes yours
          — it stays on this device.
        </p>
      )}

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Set title
        </span>
        <input
          value={sundaySet.title}
          onChange={(e) => patch(sundaySet.items, e.target.value)}
          className="focus-ring mt-1 w-full max-w-md rounded-xl border border-line bg-surface px-3 py-2 font-display text-lg text-ink"
        />
      </label>

      <ol className="space-y-3">
        {sundaySet.items.map((item, index) => {
          const song = getSongById(item.songId);
          if (!song) return null;
          const key = resolveSetItemKey(item, song);
          return (
            <li key={item.id} className="panel p-4 sm:p-5">
              <div className="flex flex-wrap items-start gap-3">
                <span className="tnum mt-2 w-6 text-sm text-ink-faint">
                  {index + 1}
                </span>
                <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <label className="block text-xs text-ink-muted">
                    Slot
                    <select
                      value={item.slot}
                      onChange={(e) => {
                        const next = [...sundaySet.items];
                        next[index] = {
                          ...item,
                          slot: e.target.value as SetlistSlot,
                        };
                        patch(next);
                      }}
                      className="focus-ring mt-1 w-full rounded-lg border border-line bg-surface px-2 py-2 text-sm text-ink"
                    >
                      {SETLIST_SLOT_LIST.map((slot) => (
                        <option key={slot} value={slot}>
                          {SETLIST_SLOT_LABEL[slot]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-xs text-ink-muted">
                    Song
                    <select
                      value={item.songId}
                      onChange={(e) => {
                        const nextSong = getSongById(e.target.value);
                        if (!nextSong) return;
                        const next = [...sundaySet.items];
                        next[index] = newSetItem(nextSong, item.slot);
                        next[index] = { ...next[index], id: item.id, note: item.note };
                        patch(next);
                      }}
                      className="focus-ring mt-1 w-full rounded-lg border border-line bg-surface px-2 py-2 text-sm text-ink"
                    >
                      {songs.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="block text-xs text-ink-muted">
                    Key
                    <div className="mt-1 flex items-center gap-2">
                      <KeySelector
                        value={key}
                        onChange={(k) => {
                          const next = [...sundaySet.items];
                          next[index] = withItemKey(item, k);
                          patch(next);
                        }}
                      />
                      <span className="text-ink-faint">{formatKey(key)}</span>
                    </div>
                  </div>
                  <label className="block text-xs text-ink-muted sm:col-span-2 lg:col-span-3">
                    Note
                    <input
                      value={item.note ?? ''}
                      onChange={(e) => {
                        const next = [...sundaySet.items];
                        next[index] = { ...item, note: e.target.value };
                        patch(next);
                      }}
                      placeholder="Walk into the 1 on the turn…"
                      className="focus-ring mt-1 w-full rounded-lg border border-line bg-surface px-2 py-2 text-sm text-ink"
                    />
                  </label>
                </div>
                <div className="flex gap-1 sm:flex-col">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => patch(moveSetItem(sundaySet.items, index, -1))}
                    icon={<ArrowUp size={14} />}
                    aria-label="Move up"
                    disabled={index === 0}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => patch(moveSetItem(sundaySet.items, index, 1))}
                    icon={<ArrowDown size={14} />}
                    aria-label="Move down"
                    disabled={index === sundaySet.items.length - 1}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      patch(sundaySet.items.filter((_, i) => i !== index))
                    }
                    icon={<Trash2 size={14} />}
                    aria-label="Remove"
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <Button variant="secondary" onClick={addSong} icon={<Plus size={16} />}>
        Add a song
      </Button>
    </div>
  );
}
