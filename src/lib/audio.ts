/**
 * Tiny Web Audio engine: metronome clicks and bass-register tones.
 * No samples, no backing tracks — just oscillators unlocked by a user gesture.
 */

let ctx: AudioContext | null = null;

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;
  const AC =
    window.AudioContext ||
    (window as AudioWindow).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  return ctx;
}

export async function unlockAudio(): Promise<void> {
  const c = getAudioContext();
  if (!c) return;
  if (c.state === 'suspended') {
    try {
      await c.resume();
    } catch {
      // Autoplay policy — the next click will retry.
    }
  }
}

export function audioNow(): number {
  return getAudioContext()?.currentTime ?? 0;
}

export function playClick(accent: boolean, time?: number): void {
  const c = getAudioContext();
  if (!c) return;
  const t = time ?? c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(accent ? 1760 : 880, t);
  const peak = accent ? 0.16 : 0.09;
  g.gain.setValueAtTime(peak, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.05);
}

export function playBassTone(
  hz: number,
  duration = 0.42,
  time?: number,
): void {
  const c = getAudioContext();
  if (!c) return;
  const t = time ?? c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  const filter = c.createBiquadFilter();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(Math.max(30, hz), t);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(620, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(filter);
  filter.connect(g);
  g.connect(c.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}
