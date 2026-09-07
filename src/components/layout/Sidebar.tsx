import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './nav';
import { Logo } from './Logo';
import { cn } from '@/lib/cn';
import { usePractice } from '@/store/practiceStore';
import { formatMinutes } from '@/lib/format';
import { Flame } from 'lucide-react';

export function Sidebar() {
  const { stats } = usePractice();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-surface/70 px-4 py-6 backdrop-blur-xl lg:flex">
      <div className="px-2">
        <Logo />
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
          Menu
        </p>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-elevated text-ink'
                  : 'text-ink-muted hover:bg-elevated/60 hover:text-ink',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent transition-opacity',
                    isActive ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <Icon size={18} strokeWidth={2} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="panel mt-4 p-4">
        <div className="flex items-center gap-2 text-accent">
          <Flame size={16} />
          <span className="font-display text-xl font-semibold">
            {stats.currentStreakDays}
          </span>
          <span className="text-xs text-ink-muted">day streak</span>
        </div>
        <p className="mt-2 text-xs text-ink-muted">
          {formatMinutes(stats.totalMinutes)} logged all-time
        </p>
      </div>
    </aside>
  );
}
