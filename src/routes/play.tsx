import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GAME_MODES } from "@/data/tournaments";
import { useDraft } from "@/lib/store/draft";
import { useProgression, getRankTier, getRankBadge, getUnlockedYears, type GameDifficulty } from "@/lib/store/progression";
import { motion } from "framer-motion";
import { useState } from "react";
import type { DraftMode, GameModeId } from "@/types/game";
import { useLanguage } from "@/lib/i18n";
import { Flame, ShieldAlert, Award, Star, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Lobby — Valorant Champions Draft" },
      { name: "description", content: "Configure your pool, difficulty, patch meta, and game mode." },
    ],
  }),
  component: PlayPage,
});

function PlayPage() {
  const navigate = useNavigate();
  const startDraft = useDraft((s) => s.startDraft);
  const { t, lang } = useLanguage();

  // Progression store
  const {
    mmr,
    xp,
    level,
    difficulty,
    rankedActive,
    activeMeta,
    setDifficulty,
    setRankedActive,
    cycleMeta,
    resetProgression,
  } = useProgression();

  // Settings local state
  const [selectedPool, setSelectedPool] = useState<GameModeId>("champions");
  const [draftMode, setDraftMode] = useState<DraftMode>("STRICT");

  const handleStart = () => {
    startDraft(selectedPool, draftMode);
    navigate({ to: "/draft" });
  };

  const rankTier = getRankTier(mmr);
  const rankBadge = getRankBadge(rankTier);
  const unlockedYears = getUnlockedYears(level);

  // Meta patch description helper
  const getMetaDesc = (meta: string) => {
    switch (meta) {
      case "Duelist Meta":
        return lang === "ES"
          ? "Los Duelistas ganan +5% de impacto en la simulación de partidas."
          : "Duelists gain +5% impact in match simulation.";
      case "Sentinel Meta":
        return lang === "ES"
          ? "Los Sentinels aumentan la probabilidad de ganar rondas en defensa."
          : "Sentinels increase defensive round win chance.";
      case "Utility Meta":
        return lang === "ES"
          ? "Los Iniciadores y Controladores reciben un boost de rendimiento."
          : "Initiators + Controllers gain a performance boost.";
      default:
        return lang === "ES"
          ? "Meta balanceado. Sin bonificaciones de rol adicionales."
          : "Balanced meta. No additional role boosts.";
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Top Header */}
      <div className="mb-8 border-b border-border/40 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">// Game Setup</div>
          <h1 className="mt-1 font-display text-4xl sm:text-5xl">Draft Simulator</h1>
        </div>

        {/* User Progression Ranks Card */}
        <div className="clip-corner border border-border bg-surface/80 p-4 flex items-center gap-4 backdrop-blur w-full md:w-auto">
          <div className="text-4xl shrink-0 select-none">{rankBadge}</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg text-gold leading-none">{rankTier}</span>
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-px rounded font-bold uppercase">
                MMR {mmr}
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground/80 shrink-0">LVL {level}</span>
              <div className="h-2 w-28 bg-background rounded-full overflow-hidden shrink-0 border border-border/40">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(xp / 300) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-mono shrink-0">{xp}/300 XP</span>
            </div>
          </div>
          <button
            onClick={() => {
              if (confirm(lang === "ES" ? "¿Restablecer progreso?" : "Reset progression?")) {
                resetProgression();
              }
            }}
            className="text-[10px] text-muted-foreground border border-border bg-surface px-2 py-1 hover:text-primary transition clip-corner ml-2 shrink-0 cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Step 1: Ranked Toggle & Difficulty */}
          <section className="space-y-4 clip-corner border border-border bg-surface/40 p-5 backdrop-blur">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
              <Award className="w-4 h-4" /> 1. Mode & Difficulty
            </h2>
            
            {/* Ranked vs Classic Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-background/50 p-1 rounded border border-border/40 clip-corner">
              <button
                onClick={() => setRankedActive(true)}
                className={`py-3 text-xs font-bold uppercase tracking-wider transition clip-corner cursor-pointer ${
                  rankedActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-surface"
                }`}
              >
                🏆 Ranked
              </button>
              <button
                onClick={() => setRankedActive(false)}
                className={`py-3 text-xs font-bold uppercase tracking-wider transition clip-corner cursor-pointer ${
                  !rankedActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-surface"
                }`}
              >
                🎮 Classic
              </button>
            </div>

            <div className="text-xs text-muted-foreground leading-relaxed">
              {rankedActive ? (
                <span className="text-gold font-semibold">
                  ✓ Ranked Active: Earn or lose MMR (+25/-20) based on match outcomes. Advance your tier to Radiant!
                </span>
              ) : (
                <span>
                  ✓ Classic Active: Casual draft. MMR is not affected, but you still earn XP (+100 for wins, +40 for losses).
                </span>
              )}
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-2 pt-2 border-t border-border/30">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">AI Draft Difficulty</div>
              <div className="grid grid-cols-3 gap-2">
                {(["EASY", "MEDIUM", "HARD"] as GameDifficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 text-xs font-bold uppercase tracking-wide border transition clip-corner cursor-pointer ${
                      difficulty === diff
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/60 bg-background/20 text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-muted-foreground leading-normal mt-1">
                {difficulty === "EASY" && "Easy: AI draft picks are completely random and ignore role synergy."}
                {difficulty === "MEDIUM" && "Medium: AI uses balanced picks prioritizing both base OVR and missing roles."}
                {difficulty === "HARD" && "Hard: AI optimally drafts to maximize both chemistry, role weights, and total Team OVR."}
              </div>
            </div>
          </section>

          {/* Step 2: Patch Meta System */}
          <section className="space-y-4 clip-corner border border-border bg-surface/40 p-5 backdrop-blur flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5 mb-3">
                <Flame className="w-4 h-4 text-primary fill-primary" /> Active Patch Meta
              </h2>
              
              <div className="bg-background/80 border border-gold/45 p-4 rounded clip-corner relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gold/15 text-gold text-[8px] font-bold uppercase px-2 py-0.5 rounded-bl clip-corner">
                  LIVE PATCH
                </div>
                <div className="font-display text-xl text-gold uppercase tracking-wider">{activeMeta}</div>
                <p className="mt-1 text-xs text-foreground/90 leading-relaxed">
                  {getMetaDesc(activeMeta)}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/30 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Change the meta for the next draft:</span>
              <button
                onClick={cycleMeta}
                className="clip-corner flex items-center gap-1.5 border border-primary bg-primary/5 hover:bg-primary/15 text-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Cycle Meta
              </button>
            </div>
          </section>
        </div>

        {/* Step 3: Select Player Pool */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Star className="w-4 h-4 text-muted-foreground" /> 2. Select Player Pool
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
                
                {/* Years Unlocked Indicator */}
                <div className="mt-3 text-[9px] font-mono text-gold flex items-center gap-1">
                  🔓 Years Unlocked: {unlockedYears.join(", ")}
                </div>
              </button>
            ))}
          </div>
          <div className="text-[10px] text-muted-foreground leading-normal">
            ℹ Leveling up unlocks more eras! level 1: 2021 | level 2: 2022 | level 3: 2023 | level 4: 2024 | level 5: 2025. Unlocked years are automatically filtered in the player draft pool.
          </div>
        </section>

        {/* Step 4: Choose Team Composition Style */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" /> 3. Choose Draft Rule Mode
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                id: "STRICT" as DraftMode,
                title: "STRICT MODE",
                desc: "No duplicate player roles allowed (except in the FLEX slot). Each player's primary role must match the draft slot (Duelist, Initiator, Controller, Sentinel). Strict competitive balance.",
              },
              {
                id: "OPEN" as DraftMode,
                title: "OPEN MODE",
                desc: "No restrictions. You can pick any player role for any slot (e.g. 5 Duelists). Perfect for experimenting or going for pure OVR rating.",
              },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setDraftMode(m.id)}
                className={`clip-corner p-5 text-left border transition cursor-pointer ${
                  draftMode === m.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-surface/50 hover:border-primary/50"
                }`}
              >
                <div className="font-display text-lg tracking-wider text-foreground">{m.title}</div>
                <div className="text-xs mt-1.5 text-muted-foreground leading-relaxed">{m.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Start Button */}
        <div className="pt-4 border-t border-border/40 flex justify-end">
          <button
            onClick={handleStart}
            className="clip-corner group relative inline-flex items-center gap-3 bg-primary px-12 py-5 font-display text-xl tracking-widest text-primary-foreground transition hover:brightness-110 cursor-pointer w-full sm:w-auto justify-center"
          >
            <span className="relative font-bold">{t("startDraft")}</span>
            <span className="block h-2.5 w-2.5 bg-primary-foreground/80" />
          </button>
        </div>
      </div>
    </div>
  );
}
