import { cn } from '@/lib/cn';

interface ChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
}

export function Chip({ active, onClick, children, color }: ChipProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'focus-ring inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.98]',
        active
          ? 'border-transparent text-ink'
          : 'border-line text-ink-muted hover:border-line-strong hover:text-ink-soft',
      )}
      style={
        active && color
          ? { backgroundColor: `color-mix(in srgb, ${color} 18%, transparent)` }
          : undefined
      }
    >
      {color && (
        <span
          className="h-2 w-2 rounded-full transition-colors"
          style={{ backgroundColor: active ? color : 'var(--color-line-strong)' }}
        />
      )}
      {children}
    </button>
  );
}
