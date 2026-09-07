import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { PlanPreview } from '@/components/session/PlanPreview';
import { SessionRunner } from '@/components/session/SessionRunner';
import {
  PILLAR_LIST,
  SESSION_MODE_LIST,
  pillarColor,
} from '@/lib/pillars';
import { generateSession } from '@/lib/sessionGenerator';
import type { PillarId, SessionMode, SessionPlan } from '@/lib/types';
import { usePractice } from '@/store/practiceStore';
import { Sparkles } from 'lucide-react';

type Phase = 'setup' | 'preview' | 'running';

const DURATIONS = [15, 30, 45, 60] as const;

export function Practice() {
  const { activePlan, setActivePlan, exercises } = usePractice();

  const [phase, setPhase] = useState<Phase>('setup');
  const [plan, setPlan] = useState<SessionPlan | null>(null);

  const [duration, setDuration] = useState<number>(30);
  const [focus, setFocus] = useState<PillarId[]>([]);
  const [mode, setMode] = useState<SessionMode>('rehearse');

  // Consume a plan handed over from Home (Start Session / Quick Start).
  useEffect(() => {
    if (activePlan) {
      setPlan(activePlan);
      setPhase('running');
      setActivePlan(null);
    }
    // Only run when a plan arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePlan]);

  const toggleFocus = (id: PillarId) =>
    setFocus((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );

  const build = () => {
    setPlan(
      generateSession(exercises, {
        totalMinutes: duration,
        focus,
        mode,
      }),
    );
    setPhase('preview');
  };

  const reset = () => {
    setPlan(null);
    setPhase('setup');
  };

  if (phase === 'running' && plan) {
    return <SessionRunner plan={plan} onExit={reset} />;
  }

  if (phase === 'preview' && plan) {
    return (
      <div>
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={reset}>
            ← Back to setup
          </Button>
        </div>
        <PlanPreview
          plan={plan}
          onStart={() => setPhase('running')}
          onRegenerate={build}
        />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Practice"
        title="Design your session"
        subtitle="Pick a length, choose the pillars to work on, and set how you're playing it. We'll assemble a focused session from your drill library."
      />

      {/* Duration */}
      <section>
        <SectionLabel index="01" title="Duration" />
        <SegmentedControl
          columns={4}
          value={String(duration)}
          onChange={(v) => setDuration(Number(v))}
          options={DURATIONS.map((d) => ({
            value: String(d),
            label: `${d}`,
            hint: 'minutes',
          }))}
        />
      </section>

      {/* Pillars */}
      <section>
        <SectionLabel
          index="02"
          title="Pillars"
          hint={focus.length ? `${focus.length} selected` : 'All pillars'}
        />
        <div className="flex flex-wrap gap-2">
          {PILLAR_LIST.map((pillar) => (
            <Chip
              key={pillar.id}
              active={focus.includes(pillar.id)}
              onClick={() => toggleFocus(pillar.id)}
              color={pillarColor(pillar.id)}
            >
              {pillar.label}
            </Chip>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          Leave everything unselected for a balanced, well-rounded session.
        </p>
      </section>

      {/* Mode */}
      <section>
        <SectionLabel index="03" title="How you're playing it" />
        <SegmentedControl
          columns={3}
          value={mode}
          onChange={(v) => setMode(v)}
          options={SESSION_MODE_LIST.map((m) => ({
            value: m.id,
            label: m.label,
            hint: m.description,
          }))}
        />
      </section>

      <div className="sticky bottom-24 z-10 lg:static">
        <Button
          variant="primary"
          size="lg"
          block
          onClick={build}
          icon={<Sparkles size={18} />}
        >
          Build session
        </Button>
      </div>
    </div>
  );
}

function SectionLabel({
  index,
  title,
  hint,
}: {
  index: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-baseline gap-2.5">
        <span className="tnum text-xs font-semibold text-accent">{index}</span>
        <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      </div>
      {hint && <span className="text-xs text-ink-muted">{hint}</span>}
    </div>
  );
}
