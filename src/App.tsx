import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { PracticeProvider } from '@/store/practiceStore';
import { AppShell } from '@/components/layout/AppShell';
import { Home } from '@/pages/Home';
import { Practice } from '@/pages/Practice';
import { Library } from '@/pages/Library';
import { SongDetail } from '@/pages/SongDetail';
import { LoopDetail } from '@/pages/LoopDetail';
import { Progress } from '@/pages/Progress';
import { NotFound } from '@/pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <PracticeProvider>
      <ScrollToTop />
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library/song/:songId" element={<SongDetail />} />
          <Route path="/library/loop/:loopId" element={<LoopDetail />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppShell>
    </PracticeProvider>
  );
}
