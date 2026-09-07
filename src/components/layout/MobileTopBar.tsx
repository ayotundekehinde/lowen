import { Logo } from './Logo';
import { usePractice } from '@/store/practiceStore';
import { Flame } from 'lucide-react';

export function MobileTopBar() {
  const { stats } = usePractice();
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-surface/80 px-4 py-3 backdrop-blur-xl lg:hidden">
      <Logo />
      <div className="flex items-center gap-1.5 rounded-full border border-line bg-elevated px-3 py-1.5 text-sm">
        <Flame size={15} className="text-accent" />
        <span className="font-display font-semibold text-ink">
          {stats.currentStreakDays}
        </span>
      </div>
    </header>
  );
}
