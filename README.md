# Lowen

A personal practice companion for bass players. Lowen helps you decide what to
practice, runs structured practice sessions with a timer, organizes your songs
and practice loops, and tracks your progress.

This is a **frontend-first prototype**. All data is local/mock — there is no
authentication, backend, or database. The data layer is deliberately isolated so
it can be swapped for a real API later without touching the UI.

## Tech stack

- **React 18** + **TypeScript**
- **Vite 5**
- **Tailwind CSS v4** (CSS-first design tokens via `@theme`)
- `react-router-dom` for routing, `lucide-react` for icons

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run lint     # eslint
npm run preview  # preview the production build
```

## Features

- **Home** — a dashboard that answers "what should I practice today?": a
  recommended session with a prominent `START SESSION`, weekly stats, a weekly
  activity chart, and quick-start actions.
- **Practice** — a session builder (duration / focus / intensity) that generates
  a plan from the exercise library, then a live runner with a functional
  countdown timer, per-exercise cards, and an end-of-session summary you can rate
  and save.
- **Library** — songs and loops with `All / Songs / Loops` tabs, search, and
  difficulty/favorite filters. Song detail pages show overall and per-section
  progress, editable notes, and associated loops. Loops include a mock transport
  and generated creativity challenges.
- **Progress** — practice statistics, per-category time distribution, a mock
  skill overview, and recent sessions.

## Project structure

```
src/
  lib/          Domain types, category/intensity config, formatting,
                stats math, the session generator, and challenge generator.
  data/          Mock songs, loops, exercises, sessions, and skills.
                 This is the single swappable data layer.
  store/         In-memory PracticeProvider context — the one place that
                 holds mutable app state (swap this for a real client later).
  hooks/         useCountdown — a timestamp-accurate countdown timer.
  components/
    ui/          Reusable primitives (Button, Progress, Badge, StatCard, …).
    layout/      App shell, responsive sidebar / bottom nav, page header.
    session/     Session runner, exercise player, timer dial, summary, preview.
    library/     Song card.
    loops/       Loop card, waveform placeholder, challenge overlay.
  pages/         Home, Practice, Library, SongDetail, Progress, NotFound.
```

## Notes & intentional limitations

- **Audio is mocked.** Play buttons drive an animated waveform/equalizer
  placeholder; no real audio files or processing are wired in yet.
- **State is in-memory.** Completed sessions, favorites, and notes reset on
  reload. Persistence and a backend are intentionally out of scope for this
  first version.

## Roadmap (deliberately not built yet)

Authentication, payments, AI APIs, real audio processing, a cloud database, and
social features are all future work. The structure above is designed to make
adding them straightforward.
