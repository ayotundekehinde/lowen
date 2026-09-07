import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { MobileTopBar } from './MobileTopBar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <Sidebar />
      <MobileTopBar />
      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-16 lg:pt-10">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
