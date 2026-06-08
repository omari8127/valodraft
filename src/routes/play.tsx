import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GAME_MODES } from "@/data/tournaments";
import { useDraft } from "@/lib/store/draft";
import { motion } from "framer-motion";
import { useState } from "react";
import type { CompositionMode, PresetType, GameModeId } from "@/types/game";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Select Settings — Valorant Champions Draft" },
      { name: "description", content: "Configure your pool and team composition rules." },
    ],
  }),
  component: PlayPage,
});

function PlayPage() {
  const navigate = useNavigate();
  const startDraft = useDraft((s) => s.startDraft);
  const { t } = useLanguage();

  // Settings state
  const [selectedPool, setSelectedPool] = useState<GameModeId>("champions");
  const [compositionMode, setCompositionMode] = useState<CompositionMode>("STRICT");
  const [presetType, setPresetType] = useState<PresetType>("STANDARD");

  const handleStart = () => {
    startDraft(selectedPool, compositionMode, compositionMode === "PRESET" ? presetType : null);
    navigate({ to: "/draft" });
  };

  const PRESETS: Array<{ id: PresetType; label: string; desc: string }> = [
    { id: "STANDARD", label: "Standard", desc: "1 Duelist · 1 Initiator · 1 Controller · 1 Sentinel · 1 Flex" },
    { id: "DOUBLE_DUELIST", label: "Double Duelist", desc: "2 Duelists · 1 Initiator · 1 Controller · 1 Sentinel" },
    { id: "DOUBLE_CONTROLLER", label: "Double Controller", desc: "1 Duelist · 1 Initiator · 2 Controllers · 1 Sentinel" },
    { id: "DOUBLE_INITIATOR", label: "Double Initiator", desc: "1 Duelist · 2 Initiators · 1 Controller · 1 Sentinel" },
    { id: "NO_SENTINEL", label: "No Sentinel", desc: "1 Duelist · 1 Initiator · 1 Controller · 2 Flex" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 border-b border-border/40 pb-4">
        <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">// Configuration</div>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl">{t("selectGameMode")}</h1>
      </div>

      <div className="space-y-8">
        {/* Step 1: Select Game Pool */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            1. Select Player Pool
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {GAME_MODES.map((mode, i) => (
              <button
                key={mode.id}
                onClick={() => setSelectedPool(mode.id)}
                className={`clip-corner relative overflow-hidden border p-5 text-left transition cursor-pointer ${
                  selectedPool === mode.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-surface/50 text-muted-foreground hover:border-primary/50 hover:bg-surface/75"
                }`}
              >
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
                  Pool {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-1 font-display text-xl text-foreground">{mode.name}</div>
                <div className="text-xs mt-1 text-muted-foreground">{mode.subtitle}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2: Composition Mode */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            2. Choose Team Composition Style
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                id: "STRICT" as CompositionMode,
                title: t("strict"),
                desc: "Balanced competitive layout (exactly 1 of each role, plus 1 Flex).",
              },
              {
                id: "PRESET" as CompositionMode,
                title: t("preset"),
                desc: "Choose from classic tournament metas (e.g. Double Duelist, Double Controller).",
              },
              {
                id: "CUSTOM" as CompositionMode,
                title: t("custom"),
                desc: "Draft any role you want. Freedom, but max 2 Duelists / 2 Controllers.",
              },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setCompositionMode(m.id)}
                className={`clip-corner p-5 text-left border transition cursor-pointer ${
                  compositionMode === m.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-surface/50 hover:border-primary/50"
                }`}
              >
                <div className="font-display text-lg tracking-wider text-foreground">{m.title}</div>
                <div className="text-xs mt-1 text-muted-foreground leading-normal">{m.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Step 3: Presets Selector (if PRESET chosen) */}
        {compositionMode === "PRESET" && (
          <motion.section
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 border-l-2 border-primary/45 pl-4"
          >
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Select Preset Composition
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPresetType(p.id)}
                  className={`clip-corner p-4 text-left border transition cursor-pointer text-xs ${
                    presetType === p.id
                      ? "border-gold bg-gold/10 text-foreground font-semibold"
                      : "border-border/60 bg-surface/30 text-muted-foreground hover:border-gold/50"
                  }`}
                >
                  <div className="font-display text-sm text-foreground tracking-wide uppercase">
                    {p.label}
                  </div>
                  <div className="mt-1 text-[10px] text-muted-foreground">{p.desc}</div>
                </button>
              ))}
            </div>
          </motion.section>
        )}

        {/* Start Button */}
        <div className="pt-4 border-t border-border/40 flex justify-end">
          <button
            onClick={handleStart}
            className="clip-corner group relative inline-flex items-center gap-3 bg-primary px-10 py-5 font-display text-xl tracking-widest text-primary-foreground transition hover:brightness-110 cursor-pointer w-full sm:w-auto justify-center"
          >
            <span className="relative font-bold">{t("startDraft")}</span>
            <span className="block h-2.5 w-2.5 bg-primary-foreground/80" />
          </button>
        </div>
      </div>
    </div>
  );
}
