import { cn } from '@/lib/cn';
import { categoryColor, CATEGORIES } from '@/lib/categories';
import type { CategoryId, Difficulty } from '@/lib/types';

export function CategoryBadge({
  category,
  className,
  withDot = true,
}: {
  category: CategoryId;
  className?: string;
  withDot?: boolean;
}) {
  const color = categoryColor(category);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide',
        className,
      )}
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
      }}
    >
      {withDot && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      {CATEGORIES[category].label}
    </span>
  );
}

export function CategoryDot({ category }: { category: CategoryId }) {
  return (
    <span
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
      style={{ backgroundColor: categoryColor(category) }}
    />
  );
}

const difficultyStyles: Record<Difficulty, string> = {
  beginner: 'text-good bg-good/12',
  intermediate: 'text-accent bg-accent/12',
  advanced: 'text-danger bg-danger/12',
};

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: Difficulty;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize',
        difficultyStyles[difficulty],
        className,
      )}
    >
      {difficulty}
    </span>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-line bg-surface px-2 py-0.5 text-[11px] text-ink-muted">
      {children}
    </span>
  );
}
