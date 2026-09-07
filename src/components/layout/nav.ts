import { Home, Dumbbell, Library, LineChart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/practice', label: 'Practice', icon: Dumbbell },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/progress', label: 'Progress', icon: LineChart },
];
