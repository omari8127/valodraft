import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GAME_MODES } from "@/data/tournaments";
import { useDraft } from "@/lib/store/draft";
import { useProgression, getRankTier, getRankBadge, type GameDifficulty } from "@/lib/store/progression";
import { useState, useEffect } from "react";
import type { DraftMode, GameModeId } from "@/types/game";
import { useLanguage } from "@/lib/i18n";
import { ShieldAlert, Star } from "lucide-react";

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

  useEffect(() => {
    document.body.removeAttribute("data-theme");
    document.body.classList.remove("bg-champions-particles", "bg-masters-particles");
    localStorage.removeItem("ui-theme");
  }, []);

  // Progression store
  const {
    mmr,
    xp,
    level,
    difficulty,
    setDifficulty,
    resetProgression,
  } = useProgression();

  // Settings local state
  const [selectedPool, setSelectedPool] = useState<GameModeId>("champions");
  const [draftMode, setDraftMode] = useState<DraftMode>("STRICT");
  const [isBlindMode, setIsBlindMode] = useState(false);
  const [teamName, setTeamName] = useState("");

  const handleStart = () => {
    startDraft(selectedPool, draftMode, teamName);
    navigate({ to: "/draft" });
  };

  const rankTier = getRankTier(mmr);
  const rankBadge = getRankBadge(rankTier);
  
  const unlockedYears = [2021, 2022, 2023, 2024, 2025];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Top Header */}
      <div className="mb-8 border-b border-border/40 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">// VCT LOBBY</div>
          <h1 className="mt-1 font-display text-4xl sm:text-5xl">{t("selectGameMode")}</h1>
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
              if (confirm(t("resetProgressionAlert"))) {
                resetProgression();
              }
            }}
            className="text-[10px] text-muted-foreground border border-border bg-surface px-2 py-1 hover:text-primary transition clip-corner ml-2 shrink-0 cursor-pointer"
          >
            {t("reset")}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Step 1: Mode Selection (LEFT: CLASSIC, RIGHT: BLIND) */}
        <section className="space-y-4">
          <h2 className="text-xs text-white/60 tracking-widest uppercase">
            // MODE SELECTION
          </h2>
          <div className="h-px bg-white/10 my-3" />
          <div className="grid gap-4 md:grid-cols-2">
            {/* LEFT CARD: CLASSIC */}
            <button
              onClick={() => setIsBlindMode(false)}
              className={`clip-corner p-6 text-left transition-all duration-200 cursor-pointer relative overflow-hidden group focus:outline-none focus:border-white/70 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.2)] ${
                !isBlindMode
                  ? "border border-white/70 shadow-[0_0_12px_rgba(255,255,255,0.25)] bg-white/[0.03] text-white"
                  : "border border-white/20 hover:border-white/40 hover:bg-white/[0.02]"
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-1">
                // MODE 01
              </div>
              <div className="font-display text-2xl tracking-wide text-white/80">Classic Mode</div>
              <p className="text-xs mt-2 text-white/70 leading-relaxed">Every player's stats are visible during the draft. Build your team.</p>
            </button>

            {/* RIGHT CARD: BLIND */}
            <button
              onClick={() => setIsBlindMode(true)}
              className={`clip-corner p-6 text-left transition-all duration-200 cursor-pointer relative overflow-hidden group focus:outline-none focus:border-white/70 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.2)] ${
                isBlindMode
                  ? "border border-white/70 shadow-[0_0_12px_rgba(255,255,255,0.25)] bg-white/[0.03] text-white"
                  : "border border-white/20 hover:border-white/40 hover:bg-white/[0.02]"
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-1">
                // MODE 02
              </div>
              <div className="font-display text-2xl tracking-wide text-white/80">Blind Mode</div>
              <p className="text-xs mt-2 text-white/70 leading-relaxed">Stats hidden. Only your knowledge of VALORANT history guides your picks.</p>
            </button>
          </div>
        </section>

        {/* Step 1: Select Player Pool (with Hover Glow system) */}
        <section className="space-y-4">
          <h2 className="text-xs text-white/60 tracking-widest uppercase flex items-center gap-1.5">
            <Star className="w-4 h-4 text-white/60" /> 1. {t("selectPlayerPool")}
          </h2>
          <div className="h-px bg-white/10 my-3" />
          <div className="grid gap-3 md:grid-cols-3">
            {GAME_MODES.map((mode, i) => {
              const isSelected = selectedPool === mode.id;
              const baseStyle = isSelected
                ? "border-white/70 shadow-[0_0_12px_rgba(255,255,255,0.25)] bg-white/[0.03] text-white"
                : "border-white/10 bg-transparent hover:border-white/30 hover:bg-white/[0.02]";

              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedPool(mode.id)}
                  className={`clip-corner relative overflow-hidden border p-5 text-left transition-all duration-300 cursor-pointer group focus:outline-none focus:border-white/70 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.2)] ${baseStyle}`}
                >
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                    Pool {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-1 font-display text-xl tracking-wide text-white">
                    VALORANT{" "}
                    <span
                      className={`
                        transition-all duration-300
                        ${
                          mode.id === "champions"
                            ? "group-hover:text-[#D4AF37] group-hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]"
                            : mode.id === "masters"
                            ? "group-hover:text-[#8A2BE2] group-hover:drop-shadow-[0_0_8px_rgba(138,43,226,0.6)]"
                            : "group-hover:text-[#FF4D8D] group-hover:drop-shadow-[0_0_10px_rgba(255,77,141,0.65)]"
                        }
                        ${isSelected
                          ? mode.id === "champions"
                            ? "text-[#D4AF37]"
                            : mode.id === "masters"
                              ? "text-[#8A2BE2]"
                              : "text-[#00E0FF] drop-shadow-[0_0_8px_rgba(0,224,255,0.55)]"
                          : mode.id === "mixed"
                            ? "text-[#00E0FF] drop-shadow-[0_0_6px_rgba(0,224,255,0.35)]"
                            : "text-white"}
                      `}
                    >
                      {mode.id === "champions"
                        ? "CHAMPIONS"
                        : mode.id === "masters"
                        ? "MASTERS"
                        : "ERA"}
                    </span>
                  </h3>
                  <div className="text-xs mt-1 text-white/70">{mode.subtitle}</div>
                  
                  {/* Years Unlocked Indicator */}
                  <div className="mt-3 text-[9px] font-mono text-white/60 flex items-center gap-1">
                    🔓 {t("yearsUnlocked")}: {unlockedYears.join(", ")}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2: Choose Team Composition Style */}
        <section className="space-y-4">
          <h2 className="text-xs text-white/60 tracking-widest uppercase flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-white/60" /> 2. {t("chooseDraftMode")}
          </h2>
          <div className="h-px bg-white/10 my-3" />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                id: "STRICT" as DraftMode,
                diffId: "EASY" as GameDifficulty,
                title: "STANDARD MODE",
                desc: "Balanced rules. Structured and fair drafting.",
                colorBase: "border-[#22c55e]/30",
                colorHover: "hover:border-[#22c55e]/60",
                colorSelected: "border-[#22c55e]",
                shadowSelected: "shadow-[0_0_12px_rgba(34,197,94,0.25)]",
              },
              {
                id: "FLEXIBLE" as DraftMode,
                diffId: "MEDIUM" as GameDifficulty,
                title: "COMPETITIVE MODE",
                desc: "Adaptive drafting. More freedom, higher challenge.",
                colorBase: "border-[#f97316]/30",
                colorHover: "hover:border-[#f97316]/60",
                colorSelected: "border-[#f97316]",
                shadowSelected: "shadow-[0_0_12px_rgba(249,115,22,0.25)]",
              },
              {
                id: "CHAOS" as DraftMode,
                diffId: "HARD" as GameDifficulty,
                title: "CHAOS MODE",
                desc: "No rules. Maximum unpredictability.",
                colorBase: "border-[#ef4444]/30",
                colorHover: "hover:border-[#ef4444]/60",
                colorSelected: "border-[#ef4444]",
                shadowSelected: "shadow-[0_0_12px_rgba(239,68,68,0.25)]",
              },
            ].map((m) => {
              const isSelected = draftMode === m.id && difficulty === m.diffId;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setDraftMode(m.id);
                    setDifficulty(m.diffId);
                  }}
                  className={`clip-corner p-5 text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[140px] focus:outline-none focus:border-white/70 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.2)] ${
                    isSelected
                      ? `${m.colorSelected} ${m.shadowSelected} bg-white/[0.03] text-white`
                      : `${m.colorBase} ${m.colorHover} hover:bg-white/[0.02]`
                  }`}
                >
                  <div className="font-display text-lg text-white/80 tracking-wide">{m.title}</div>
                  <div className="text-xs mt-2 text-white/70 leading-relaxed flex-1">{m.desc}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Team Name Input */}
        <section className="space-y-4">
          <h2 className="text-xs text-white/60 tracking-widest uppercase flex items-center gap-1.5">
            // TEAM NAME
          </h2>
          <div className="h-px bg-white/10 my-3" />
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter your team name..."
            className="w-full bg-surface/40 border border-white/20 p-4 text-white placeholder-white/30 clip-corner focus:outline-none focus:border-white/70 focus:shadow-[0_0_12px_rgba(255,255,255,0.2)] transition-all duration-300"
          />
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
