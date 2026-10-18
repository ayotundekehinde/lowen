# Lowen

A gospel bass practice studio for Nigerian and church bassists. Lowen is built
around how this music is actually played: the number system, vamps, praise and
worship contexts, and getting a song ready for Sunday.

There is no account, no backend, and no AI. Your sessions, favorites, notes and
ear-lab score live in this browser (`localStorage`). Reloading the page keeps
the desk.

## Tech stack

- **React 18** + **TypeScript**
- **Vite 5**
- **Tailwind CSS v4**
- `react-router-dom`, `lucide-react`
- Web Audio metronome and bass tones (oscillators — no sample packs)

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint
npm run test
npm run preview
```

## What you can do

- **Home** — “Ready for Sunday?” A daily session, this week’s rotating Sunday
  set, and a nudge toward the pillars you’ve practiced least.
- **Practice** — Build a session by length, pillar, and mode (warm up /
  rehearse / prepare for service). The runner has a real countdown and a
  metronome click on timed drills.
- **Studio**
  - **Vamp Lab** — ride a worship/praise vamp with click + bass roots
  - **Number Lab** — hear 1–7 in any key
  - **Ear Lab** — name the number (or the movement)
  - **Bandstand** — walk the Sunday set section by section
  - **Metronome** — 4/4 and 6/8 (dotted-quarter pulse, accents on 1 and 4)
- **Library** — songs, loops and number-system progressions. Play a loop and
  you’ll hear the click and the roots, not a silent waveform. Challenges are
  gospel-language prompts (vamps, walk-ups, pocket).
- **Progress** — streak, minutes, and time by pillar. New sessions persist.

The learning taxonomy is eleven **pillars** (groove, numbers, vamps, fills,
transitions, …). Musical worlds are typed **gospel styles** (Nigerian Gospel,
6/8 worship, highlife, …), not free-text tags.

## Project structure

```
src/
  lib/          Types, pillars, styles, number-system math, session generator,
                metronome math, Web Audio, local persistence, ear lab, recs.
  data/         Seed songs, loops, progressions, exercises, Sunday sets.
  store/        PracticeProvider — hydrates from seeds + localStorage.
  hooks/        useCountdown, useMetronome.
  components/
    studio/     Vamp / Number / Ear / Bandstand / Metronome labs + transport.
    session/    Runner, exercise player (with click), preview, summary.
    music/      Progression view, key selector.
    layout/     App shell, sidebar, mobile nav.
  pages/        Home, Practice, Studio, Library, Progress, detail pages.
```

## Notes

- Audio is a click and bass-register oscillator tones, unlocked by a tap. There
  are no full backing tracks.
- Seed catalog data is versioned in git. Your history is local to the browser.
- Auth, payments, cloud sync, and social features are out of scope.
