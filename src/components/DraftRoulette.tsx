import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { playSfx, unlockSfx } from "@/lib/sfx";
import { useDraft, canPickPlayer, getAIRecPlayer } from "@/lib/store/draft";
import { ORG_BY_ID } from "@/data/regions";
import { TOURNAMENT_BY_ID } from "@/data/tournaments";
import { PLAYER_BY_ID } from "@/data/generate";
import { useProgression } from "@/lib/store/progression";
import { computeTeamOVR } from "@/lib/engine/ovr";
import { RefreshCw, RadioTower, ScanLine, Sparkles } from "lucide-react";
import { PlayerCard } from "./PlayerCard";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { Region, TeamEntry, PlayerEntry, CoachEntry, SlotRole } from "@/types/game";

const REGION_SHORT: Record<Region, string> = {
  AMERICAS: "AM",
  EMEA: "EM",
  PACIFIC: "PC",
  CHINA: "CN",
};

const ROLE_LABEL_ES: Record<string, string> = {
  DUELIST: "DUELISTA",
  INITIATOR: "INICIADOR",
  CONTROLLER: "CONTROLADOR",
  SENTINEL: "CENTINELA",
  FLEX: "FLEX",
  COACH: "COACH",
};

const REGION_ACCENTS: Record<Region, { solid: string; soft: string; glow: string; text: string }> = {
  AMERICAS: { solid: "#ff9652", soft: "rgba(255, 150, 82, 0.14)", glow: "rgba(255, 150, 82, 0.38)", text: "#ffc49a" },
  EMEA: { solid: "#64e6ff", soft: "rgba(100, 230, 255, 0.14)", glow: "rgba(100, 230, 255, 0.34)", text: "#b8f7ff" },
  PACIFIC: { solid: "#b7ff39", soft: "rgba(183, 255, 57, 0.13)", glow: "rgba(183, 255, 57, 0.34)", text: "#e3ff9c" },
  CHINA: { solid: "#ff5ba4", soft: "rgba(255, 91, 164, 0.14)", glow: "rgba(255, 91, 164, 0.36)", text: "#ffb0d2" },
};

const TEAM_ACCENTS: Record<string, { solid: string; soft: string; glow: string; text: string }> = {
  sentinels: { solid: "#FF3B3B", soft: "rgba(255, 59, 59, 0.14)", glow: "rgba(255, 59, 59, 0.4)", text: "#FF3B3B" },
  nrg: { solid: "#FF8C42", soft: "rgba(255, 140, 66, 0.14)", glow: "rgba(255, 140, 66, 0.4)", text: "#FF8C42" },
  fnatic: { solid: "#FF8C42", soft: "rgba(255, 140, 66, 0.14)", glow: "rgba(255, 140, 66, 0.4)", text: "#FF8C42" },
  drx: { solid: "#3B82F6", soft: "rgba(59, 130, 246, 0.14)", glow: "rgba(59, 130, 246, 0.4)", text: "#3B82F6" },
  prx: { solid: "#FF4DA6", soft: "rgba(255, 77, 166, 0.14)", glow: "rgba(255, 77, 166, 0.4)", text: "#FF4DA6" },
  heretics: { solid: "#FFD700", soft: "rgba(255, 215, 0, 0.14)", glow: "rgba(255, 215, 0, 0.4)", text: "#FFD700" },
  mibr: { solid: "#22C55E", soft: "rgba(34, 197, 94, 0.14)", glow: "rgba(34, 197, 94, 0.4)", text: "#22C55E" },
  giantx: { solid: "#3B82F6", soft: "rgba(59, 130, 246, 0.14)", glow: "rgba(59, 130, 246, 0.4)", text: "#3B82F6" },
  g2: { solid: "#FFFFFF", soft: "rgba(255, 255, 255, 0.14)", glow: "rgba(255, 255, 255, 0.4)", text: "#FFFFFF" },
  tl: { solid: "#2F6BFF", soft: "rgba(47, 107, 255, 0.14)", glow: "rgba(47, 107, 255, 0.4)", text: "#2F6BFF" },
  t1: { solid: "#FF3B3B", soft: "rgba(255, 59, 59, 0.14)", glow: "rgba(255, 59, 59, 0.4)", text: "#FF3B3B" },
  rrq: { solid: "#FF3B3B", soft: "rgba(255, 59, 59, 0.14)", glow: "rgba(255, 59, 59, 0.4)", text: "#FF3B3B" },
  blg: { solid: "#3B82F6", soft: "rgba(59, 130, 246, 0.14)", glow: "rgba(59, 130, 246, 0.4)", text: "#3B82F6" },
  edg: { solid: "#3B82F6", soft: "rgba(59, 130, 246, 0.14)", glow: "rgba(59, 130, 246, 0.4)", text: "#3B82F6" },
  xlg: { solid: "#3B82F6", soft: "rgba(59, 130, 246, 0.14)", glow: "rgba(59, 130, 246, 0.4)", text: "#3B82F6" },
  drg: { solid: "#3B82F6", soft: "rgba(59, 130, 246, 0.14)", glow: "rgba(59, 130, 246, 0.4)", text: "#3B82F6" },
  kru: { solid: "#FF4DA6", soft: "rgba(255, 77, 166, 0.14)", glow: "rgba(255, 77, 166, 0.4)", text: "#FF4DA6" },
  vitality: { solid: "#FFD600", soft: "rgba(255, 214, 0, 0.14)", glow: "rgba(255, 214, 0, 0.4)", text: "#FFD600" },
  talon: { solid: "#22C55E", soft: "rgba(34, 197, 94, 0.14)", glow: "rgba(34, 197, 94, 0.4)", text: "#22C55E" },
  fut: { solid: "#FF3B3B", soft: "rgba(255, 59, 59, 0.14)", glow: "rgba(255, 59, 59, 0.4)", text: "#FF3B3B" },
  trace: { solid: "#FF3B3B", soft: "rgba(255, 59, 59, 0.14)", glow: "rgba(255, 59, 59, 0.4)", text: "#FF3B3B" },
  leviatan: { solid: "#8B5CF6", soft: "rgba(139, 92, 246, 0.14)", glow: "rgba(139, 92, 246, 0.4)", text: "#8B5CF6" },
  geng: { solid: "#FF3B3B", soft: "rgba(255, 59, 59, 0.14)", glow: "rgba(255, 59, 59, 0.4)", text: "#FF3B3B" },
  loud: { solid: "#22C55E", soft: "rgba(34, 197, 94, 0.14)", glow: "rgba(34, 197, 94, 0.4)", text: "#22C55E" },
  eg: { solid: "#3B82F6", soft: "rgba(59, 130, 246, 0.14)", glow: "rgba(59, 130, 246, 0.4)", text: "#3B82F6" },
  navi: { solid: "#FFD600", soft: "rgba(255, 214, 0, 0.14)", glow: "rgba(255, 214, 0, 0.4)", text: "#FFD600" },
  xset: { solid: "#FFFFFF", soft: "rgba(255, 255, 255, 0.14)", glow: "rgba(255, 255, 255, 0.4)", text: "#FFFFFF" },
  "100t": { solid: "#FF3B3B", soft: "rgba(255, 59, 59, 0.14)", glow: "rgba(255, 59, 59, 0.4)", text: "#FF3B3B" },
  optic: { solid: "#22C55E", soft: "rgba(34, 197, 94, 0.14)", glow: "rgba(34, 197, 94, 0.4)", text: "#22C55E" },
  fpx: { solid: "#8B5CF6", soft: "rgba(139, 92, 246, 0.14)", glow: "rgba(139, 92, 246, 0.4)", text: "#8B5CF6" },
  zeta: { solid: "#FFD600", soft: "rgba(255, 214, 0, 0.14)", glow: "rgba(255, 214, 0, 0.4)", text: "#FFD600" },
  guild: { solid: "#3B82F6", soft: "rgba(59, 130, 246, 0.14)", glow: "rgba(59, 130, 246, 0.4)", text: "#3B82F6" },
  vs: { solid: "#3B82F6", soft: "rgba(59, 130, 246, 0.14)", glow: "rgba(59, 130, 246, 0.4)", text: "#3B82F6" },
  crazy: { solid: "#3B82F6", soft: "rgba(59, 130, 246, 0.14)", glow: "rgba(59, 130, 246, 0.4)", text: "#3B82F6" },
  acend: { solid: "#3B82F6", soft: "rgba(59, 130, 246, 0.14)", glow: "rgba(59, 130, 246, 0.4)", text: "#3B82F6" },
  envy: { solid: "#3B82F6", soft: "rgba(59, 130, 246, 0.14)", glow: "rgba(59, 130, 246, 0.4)", text: "#3B82F6" },
  x10: { solid: "#3B82F6", soft: "rgba(59, 130, 246, 0.14)", glow: "rgba(59, 130, 246, 0.4)", text: "#3B82F6" },
  keyd: { solid: "#3B82F6", soft: "rgba(59, 130, 246, 0.14)", glow: "rgba(59, 130, 246, 0.4)", text: "#3B82F6" },
  liberty: { solid: "#FF8C42", soft: "rgba(255, 140, 66, 0.14)", glow: "rgba(255, 140, 66, 0.4)", text: "#FF8C42" },
  vikings: { solid: "#FF3B3B", soft: "rgba(255, 59, 59, 0.14)", glow: "rgba(255, 59, 59, 0.4)", text: "#FF3B3B" },
  secret: { solid: "#FF3B3B", soft: "rgba(255, 59, 59, 0.14)", glow: "rgba(255, 59, 59, 0.4)", text: "#FF3B3B" },
  fullsense: { solid: "#FF3B3B", soft: "rgba(255, 59, 59, 0.14)", glow: "rgba(255, 59, 59, 0.4)", text: "#FF3B3B" },
  c9: { solid: "#3B82F6", soft: "rgba(59, 130, 246, 0.14)", glow: "rgba(59, 130, 246, 0.4)", text: "#3B82F6" },
  furia: { solid: "#FFFFFF", soft: "rgba(255, 255, 255, 0.14)", glow: "rgba(255, 255, 255, 0.4)", text: "#FFFFFF" },
  sharks: { solid: "#3B82F6", soft: "rgba(59, 130, 246, 0.14)", glow: "rgba(59, 130, 246, 0.4)", text: "#3B82F6" },
  gambit: { solid: "#FFD600", soft: "rgba(255, 214, 0, 0.14)", glow: "rgba(255, 214, 0, 0.4)", text: "#FFD600" },
  smb: { solid: "#3B82F6", soft: "rgba(59, 130, 246, 0.14)", glow: "rgba(59, 130, 246, 0.4)", text: "#3B82F6" },
  wolves: { solid: "#6B7280", soft: "rgba(107, 114, 128, 0.14)", glow: "rgba(107, 114, 128, 0.4)", text: "#6B7280" },
  karmine: { solid: "#3B82F6", soft: "rgba(59, 130, 246, 0.14)", glow: "rgba(59, 130, 246, 0.4)", text: "#3B82F6" },
};

function teamAccentStyle(orgId?: string | null, region?: Region): CSSProperties {
  const accent = (orgId && TEAM_ACCENTS[orgId]) || REGION_ACCENTS[region ?? "AMERICAS"];
  return {
    ["--team-accent" as string]: accent.solid,
    ["--team-accent-soft" as string]: accent.soft,
    ["--team-accent-glow" as string]: accent.glow,
    ["--team-accent-text" as string]: accent.text,
  };
}

function getTeamMeta(team: TeamEntry) {
  return {
    org: ORG_BY_ID[team.orgId],
    tournament: TOURNAMENT_BY_ID[team.tournamentId],
  };
}

function buildVisualFeed(pool: TeamEntry[], selectedTeam: TeamEntry, length = 96): TeamEntry[] {
  const visualPool = pool.filter((team) => team.id !== selectedTeam.id);
  const safePool = visualPool.length > 0 ? visualPool : pool.length > 0 ? pool : [selectedTeam];
  return Array.from({ length }, () => safePool[Math.floor(Math.random() * safePool.length)] ?? selectedTeam);
}

interface DraftRouletteProps {
  role: string;
  draftedPlayers: PlayerEntry[];
  coach: CoachEntry | null;
  currentOVR: number;
  onPickPlayer: (p: PlayerEntry) => void;
  onPickCoach: (c: CoachEntry) => void;
  selectedPickId: string | null;
  onHoverRole?: (role: string | null) => void;
}

export function DraftRoulette({
  role,
  draftedPlayers,
  coach,
  currentOVR,
  onPickPlayer,
  onPickCoach,
  selectedPickId,
  onHoverRole,
}: DraftRouletteProps) {
  const state = useDraft();
  const { t } = useLanguage();
  
  // Phase mapping based on global state
  // "idle" -> !state.isRolling && !state.rollResultTeam
  // "rolling" -> state.isRolling
  // "result" -> !state.isRolling && state.rollResultTeam !== null
  const isIdle = !state.isRolling && !state.rollResultTeam;
  const isRolling = state.isRolling;
  const isResult = !state.isRolling && !!state.rollResultTeam;

  const [previewIndex, setPreviewIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [rerollShake, setRerollShake] = useState(false);

  const duration = 5600;

  // Visual feed logic for rolling phase
  const feedRef = useRef<TeamEntry[]>([]);
  if (feedRef.current.length === 0 && state.rollSelectedTeam) {
    const available = state.pool.filter((team) => {
      if (state.lockedTeamEntryIds.has(team.id)) return false;
      if (role === "COACH") return true;
      return team.players.some((player) => {
        if (state.draftMode !== "STRICT" || role === "FLEX") return true;
        return player.primaryRole === role;
      });
    });
    feedRef.current = buildVisualFeed(available.length > 0 ? available : state.pool, state.rollSelectedTeam);
  }

  // Effect to handle rolling animation timing
  useEffect(() => {
    if (!state.isRolling) {
      setProgress(0);
      return;
    }

    let previewTimer: number | undefined;
    let progressFrame: number | undefined;
    const startedAt = window.performance.now();
    let tickDelay = 48;

    const updateProgress = () => {
      const elapsed = window.performance.now() - startedAt;
      setProgress(Math.min(99, Math.round((elapsed / duration) * 100)));
      if (elapsed < duration) {
        progressFrame = window.requestAnimationFrame(updateProgress);
      }
    };

    const advancePreview = () => {
      const elapsed = window.performance.now() - startedAt;
      if (elapsed >= duration - 420) return;

      setPreviewIndex((value) => value + 1);
      playSfx("rollTick");

      const ratio = Math.min(1, elapsed / duration);
      tickDelay = 48 + Math.pow(ratio, 2.65) * 245;
      previewTimer = window.setTimeout(advancePreview, tickDelay);
    };

    progressFrame = window.requestAnimationFrame(updateProgress);
    previewTimer = window.setTimeout(advancePreview, tickDelay);

    const completeTimer = window.setTimeout(() => {
      playSfx("teamReveal");
      state.finishRoll();
    }, duration);

    return () => {
      if (previewTimer !== undefined) window.clearTimeout(previewTimer);
      if (progressFrame !== undefined) window.cancelAnimationFrame(progressFrame);
      window.clearTimeout(completeTimer);
    };
  }, [state.isRolling, duration]);

  // Determine which team to display in the persistent card
  let activeTeam: TeamEntry | null = null;
  if (isRolling && state.rollSelectedTeam) {
    activeTeam = feedRef.current[previewIndex % feedRef.current.length] ?? state.rollSelectedTeam;
  } else if (isResult && state.rollResultTeam) {
    activeTeam = state.rollResultTeam;
  }

  const { org, tournament } = activeTeam ? getTeamMeta(activeTeam) : { org: null, tournament: null };
  const region = org?.region ?? activeTeam?.region ?? "AMERICAS";

  const handleStartRoll = () => {
    unlockSfx();
    playSfx("rollStart");
    state.startRoll();
  };

  const handleReroll = () => {
    if (state.rerollsLeft <= 0 || state.isRolling) return;
    unlockSfx();
    playSfx("reroll");
    setRerollShake(true);
    setTimeout(() => {
      setRerollShake(false);
      state.rerollCurrentTeam();
    }, 400);
  };

  // AI Auto Pick Logic
  const aiRec = useMemo(() => {
    if (!state.rollResultTeam) return null;
    const diff = useProgression.getState().difficulty;
    return getAIRecPlayer(state.rollResultTeam, state.roster, state.draftMode, diff);
  }, [state.rollResultTeam, state.roster, state.draftMode]);

  const handleAIPick = () => {
    if (!aiRec || !state.rollResultTeam) return;
    const isCoachType = (entity: any): entity is CoachEntry => "orgId" in entity && !("primaryRole" in entity);
    if (isCoachType(aiRec)) {
      onPickCoach(aiRec);
    } else {
      onPickPlayer(aiRec);
    }
  };

  const getLockReason = (p: PlayerEntry) => {
    const normalizedName = p.name.toLowerCase().trim();
    const alreadySelected = state.roster.slots.some((s) => {
      if (!s.playerId) return false;
      const drafted = s.playerWithForm ?? PLAYER_BY_ID[s.playerId];
      return drafted?.name.toLowerCase().trim() === normalizedName;
    });
    if (alreadySelected) return t("lockAlreadySelected");
    if (state.draftMode === "STRICT") {
      if (role === "FLEX") return t("lockFlexStrict");
      if (p.primaryRole !== role) return t("lockStrictRole");
    }
    return t("unavailable");
  };

  const getSynergyPreview = (p: PlayerEntry) => {
    const sameOrg = draftedPlayers.filter((dp) => dp.orgId === p.orgId);
    const sameReg = draftedPlayers.filter((dp) => dp.region === p.region);
    const sameNat = draftedPlayers.filter((dp) => dp.nationality === p.nationality);

    const lines: string[] = [];
    if (sameOrg.length > 0) lines.push(`+${sameOrg.length * 4} Same Org (${sameOrg.map((x) => x.name).join(", ")})`);
    if (sameReg.length > 0) lines.push(`+${sameReg.length * 2} Same Region (${p.region})`);
    if (sameNat.length > 0) lines.push(`+${sameNat.length * 1} Same Nationality (${p.nationality})`);
    if (coach) {
      if (coach.orgId === p.orgId) lines.push(`+3 Coach Org (${coach.name})`);
      else if (coach.region === p.region) lines.push(`+3 Coach Region (${p.region})`);
    }

    const tempPlayers = [...draftedPlayers, p];
    const prospectiveOVR = computeTeamOVR(tempPlayers, coach, state.draftMode);
    const diff = prospectiveOVR - currentOVR;
    const diffStr = diff >= 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`;

    return { lines, prospectiveOVR, diffStr };
  };

  return (
    <div className={`draft-roulette-container flex flex-col items-center justify-center w-full mt-2 py-2 gap-2 transition-all ${rerollShake ? "animate-card-shake" : ""}`}>
      {/* 1. PERSISTENT HERO CARD */}
      <div 
        className="team-selection-hero clip-corner border px-7 py-6 w-full bg-gradient-to-br from-[#0B1320] to-[#050914] shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        style={{ ...teamAccentStyle(org?.id, region), borderColor: "var(--team-accent)", boxShadow: "0 0 15px var(--team-accent-glow)" }}
      >
        <div className="flex flex-col gap-3">
          
          {/* Status Header */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {isIdle ? (
                  <span className="clip-tag px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.25em] bg-gray-500/20 text-gray-400">
                    IDLE
                  </span>
                ) : (
                  <>
                    <span className="clip-tag px-2.5 py-1 text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: "var(--team-accent-soft)", color: "var(--team-accent-text)", borderColor: "var(--team-accent-glow)", borderWidth: 1 }}>
                      {region}
                    </span>
                    <span className="clip-tag border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest" style={{ borderColor: "var(--team-accent-glow)", backgroundColor: "var(--team-accent-soft)", color: "var(--team-accent)" }}>
                      {isRolling ? "Analizando pool global..." : "¡Equipo obtenido!"}
                    </span>
                  </>
                )}
              </div>
              
              {/* Spinner / OVR Right side */}
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em]">
                {isIdle ? (
                  <span className="text-muted-foreground">Esperando comando</span>
                ) : isRolling ? (
                  <>
                    <RadioTower className="h-3.5 w-3.5" style={{ color: REGION_ACCENTS[region].solid }} />
                    <span className="animate-pulse" style={{ color: REGION_ACCENTS[region].solid }}>
                      Transmisión en vivo
                    </span>
                  </>
                ) : (
                  <span className="text-[12px] px-3 py-1 border" style={{ color: "var(--team-accent)", backgroundColor: "var(--team-accent-soft)", borderColor: "var(--team-accent-glow)" }}>
                    OVR {activeTeam?.avgRating}
                  </span>
                )}
              </div>
            </div>

            {/* Team Name Display */}
            <div className="relative mt-3 min-h-[3rem] overflow-hidden flex flex-col items-center justify-center">
              {isIdle ? (
                <div className="font-display text-[28px] mb-1.5 leading-none text-foreground text-opacity-50 text-center">
                  {t("rollBtn")} {role}
                </div>
              ) : (
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={`${isRolling ? previewIndex : activeTeam?.id}`}
                    initial={{ opacity: 0, y: isRolling ? 10 : 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: isRolling ? -10 : 0 }}
                    transition={{ duration: isRolling ? 0.08 : 0.3 }}
                    className="font-display text-[28px] mb-1.5 leading-none text-foreground text-center"
                  >
                    {activeTeam?.displayName}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Subtitle / Progress */}
            <div className="min-h-[1.5rem] flex items-center justify-center text-[13px] opacity-70 font-medium uppercase tracking-widest text-muted-foreground">
              {isIdle ? (
                <span className="text-center">Presiona Roll para iniciar</span>
              ) : isRolling ? (
                <div className="flex items-center justify-center gap-2 w-full">
                  <ScanLine className="h-3.5 w-3.5 animate-pulse" style={{ color: "var(--team-accent)" }} />
                  <span className="truncate">Analizando estadísticas... {progress}%</span>
                  <div className="w-32 h-1 overflow-hidden rounded-full border border-border/70 bg-[#0B1320]">
                    <motion.div className="h-full" style={{ backgroundColor: "var(--team-accent)" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.12 }} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 w-full">
                  <span className="text-white/80 font-bold text-center">{tournament?.name ?? activeTeam?.tournamentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. ACTION BAR (Centered directly below roulette) */}
      <div className="flex flex-col items-center justify-center my-1">
        {isIdle ? (
          <button
            onClick={handleStartRoll}
            className="clip-corner mt-2 inline-flex items-center gap-3 bg-primary px-8 py-4 font-display text-lg tracking-widest text-primary-foreground transition hover:brightness-110 cursor-pointer font-bold w-full justify-center md:w-auto"
          >
            {t("rollBtn")} {role}
          </button>
        ) : (
          state.draftMode === "STRICT" && (
            <button
              onClick={handleReroll}
              disabled={state.rerollsLeft <= 0 || isRolling}
              className={`clip-corner flex items-center justify-center gap-2 px-8 py-3 font-display text-lg font-bold uppercase tracking-widest transition-all
                ${state.rerollsLeft > 0 && !isRolling ? "bg-[#FFC700] text-[#0A0E13] hover:bg-[#FFD740] cursor-pointer shadow-[0_0_15px_rgba(255,199,0,0.4)]" : "bg-white/5 text-white/30 cursor-not-allowed border border-white/10"}
              `}
            >
              <RefreshCw className={`h-5 w-5 ${isRolling ? "animate-spin" : ""}`} />
              REROLL ({state.rerollsLeft}/3)
            </button>
          )
        )}
      </div>

      {/* 3. PLAYERS SECTION (Appears ONLY when phase === "result") */}
      <AnimatePresence>
        {isResult && activeTeam && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="clip-corner border border-white/5 bg-[#0a0e14] p-4 w-full"
          >
            <div className="mb-4">
              <h3 className="font-display text-xl text-white tracking-wide">JUGADORES DISPONIBLES</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 players-grid">
              {[...activeTeam.players, activeTeam.coach].map((entity) => {
                const isCoachType = (e: any): e is CoachEntry => "orgId" in e && !("primaryRole" in e);
                const isCoach = isCoachType(entity);

                if (isCoach) {
                  const coachEntity = entity as CoachEntry;
                  const isAiRec = aiRec?.id === coachEntity.id;
                  const isDisabled = role !== "COACH";
                  return (
                    <Tooltip key={coachEntity.id}>
                      <TooltipTrigger asChild>
                        <div className={`transition-all duration-200 ${isDisabled ? 'opacity-60 grayscale pointer-events-none' : 'opacity-100'}`}>
                          <PlayerCard
                            entity={coachEntity}
                            isCoach
                            draft
                            isAiRec={isAiRec}
                            isSelected={selectedPickId === coachEntity.id}
                            isDisabled={isDisabled}
                            onClick={() => onPickCoach(coachEntity)}
                            onMouseEnter={() => onHoverRole?.("COACH")}
                            onMouseLeave={() => onHoverRole?.(null)}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs bg-slate-900 border border-slate-700/60 p-3 shadow-xl text-white clip-corner leading-relaxed z-[100]">
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between items-baseline border-b border-slate-700/50 pb-1">
                            <span className="font-bold text-sm text-gold">{coachEntity.name}</span>
                            <span className="text-[10px] text-slate-300 font-bold uppercase">COACH</span>
                          </div>
                          <p className="text-[10px] text-slate-300 leading-normal mt-1">
                            Adds coach synergies: +3 synergy score for each player matching coach team ({coachEntity.orgId}) or region ({coachEntity.region}).
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                const p = entity as PlayerEntry;
                const isAiRec = aiRec?.id === p.id;
                const synergy = getSynergyPreview(p);
                const isDisabled = role === "COACH" || !canPickPlayer(p, state.roster, role as SlotRole, state.draftMode);
                const lockReason = role === "COACH" ? "Drafting Coach slot" : getLockReason(p);

                return (
                  <Tooltip key={p.id}>
                    <TooltipTrigger asChild>
                      <div className="transition-all duration-200 opacity-100">
                        <PlayerCard
                          entity={p}
                          draft
                          isAiRec={isAiRec}
                          isSelected={selectedPickId === p.id}
                          isDisabled={isDisabled}
                          onClick={() => {
                            if (!isDisabled) onPickPlayer(p);
                          }}
                          onMouseEnter={() => onHoverRole?.(p.primaryRole)}
                          onMouseLeave={() => onHoverRole?.(null)}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-slate-900 border border-slate-700/60 p-3 shadow-xl text-white clip-corner leading-relaxed z-[100]">
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-baseline border-b border-slate-700/50 pb-1">
                          <span className="font-bold text-sm text-gold">{p.name}</span>
                          <span className="text-[10px] text-slate-300">{p.primaryRole} {p.secondaryRole ? `(or ${p.secondaryRole})` : ""}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400">
                          <div>Nation: <span className="text-slate-200">{p.nationality}</span></div>
                          <div>Region: <span className="text-slate-200">{p.region}</span></div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] border-t border-b border-slate-700/30 py-1 font-mono">
                          <span>Dynamic Form:</span>
                          <span className={`font-bold px-1 py-0.2 rounded ${(p.form ?? 0) > 0 ? "text-green-400 bg-green-400/10" : (p.form ?? 0) < 0 ? "text-red-400 bg-red-400/10" : "text-slate-400 bg-slate-400/10"}`}>
                            {(p.form ?? 0) >= 0 ? `+${p.form ?? 0}` : p.form}
                          </span>
                        </div>
                        {!isDisabled && synergy && (
                          <div className="space-y-1 text-[10px]">
                            <div className="font-semibold text-gold">Synergies active:</div>
                            {synergy.lines.length === 0 ? (
                              <div className="text-slate-500 italic">None yet</div>
                            ) : (
                              <ul className="list-disc list-inside text-slate-300 space-y-0.5 pl-1">
                                {synergy.lines.map((line, idx) => <li key={idx}>{line}</li>)}
                              </ul>
                            )}
                            <div className="pt-1.5 border-t border-slate-700/40 text-gold font-bold flex justify-between">
                              <span>Team OVR change:</span>
                              <span className="text-white">{currentOVR.toFixed(1)} → {synergy.prospectiveOVR.toFixed(1)} ({synergy.diffStr})</span>
                            </div>
                          </div>
                        )}
                        {isDisabled && (
                          <div className="mt-2 border-t border-red-500/40 pt-1.5 space-y-1 text-[10px]">
                            <div className="font-bold text-red-400">RESTRICTED</div>
                            <div className="text-red-300/90 leading-tight">{lockReason}</div>
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
