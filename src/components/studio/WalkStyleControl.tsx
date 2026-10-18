import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { WALK_STYLES, type WalkStyle } from '@/lib/walk';

export function WalkStyleControl({
  value,
  onChange,
}: {
  value: WalkStyle;
  onChange: (style: WalkStyle) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
        Bass line
      </p>
      <SegmentedControl
        columns={4}
        value={value}
        onChange={onChange}
        options={WALK_STYLES.map((s) => ({
          value: s.id,
          label: s.label,
          hint: s.hint,
        }))}
      />
    </div>
  );
}
