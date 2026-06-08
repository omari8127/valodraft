import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useDynasty } from "@/lib/store/dynasty";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Valorant Champions Draft" },
      { name: "description", content: "Configure audio, graphics, and gameplay settings." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [sfx, setSfx] = useState(80);
  const [music, setMusic] = useState(60);
  const [shake, setShake] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const wipe = () => {
    if (confirm("Erase all dynasties? This cannot be undone.")) {
      useDynasty.setState({ saves: [] });
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
        // Settings
      </div>
      <h1 className="mt-1 font-display text-4xl sm:text-5xl">Configuration</h1>

      <div className="mt-8 space-y-6">
        <Section title="Audio">
          <Slider label="SFX volume" value={sfx} onChange={setSfx} />
          <Slider label="Music volume" value={music} onChange={setMusic} />
        </Section>
        <Section title="Graphics">
          <Toggle label="Screen shake" value={shake} onChange={setShake} />
          <Toggle label="Reduced motion" value={reducedMotion} onChange={setReducedMotion} />
        </Section>
        <Section title="Data">
          <button
            onClick={wipe}
            className="clip-corner border border-destructive/50 bg-destructive/10 px-5 py-2.5 font-display text-sm tracking-widest text-destructive transition hover:bg-destructive/20"
          >
            Wipe all save data
          </button>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="clip-corner border border-border bg-surface/70 p-5 backdrop-blur">
      <div className="text-[10px] font-bold uppercase tracking-widest text-gold">{title}</div>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="flex items-center gap-4">
      <span className="w-32 text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-[color:var(--color-primary)]"
      />
      <span className="w-10 text-right font-display text-lg text-primary">{value}</span>
    </label>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (b: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-6 w-12 rounded-full border transition ${
          value ? "border-primary bg-primary/30" : "border-border bg-surface"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-primary transition-all ${
            value ? "left-6" : "left-0.5 bg-muted-foreground"
          }`}
        />
      </button>
    </label>
  );
}
