import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw, RadioTower, ScanLine, Sparkles, Zap } from "lucide-react";
import type { Region, SlotRole, TeamEntry } from "@/types/game";
import { ORG_BY_ID } from "@/data/regions";
import { TOURNAMENT_BY_ID } from "@/data/tournaments";
import { useDraft } from "@/lib/store/draft";
import { playSfx, unlockSfx } from "@/lib/sfx";

interface Props {
  /** All teams in the mode pool */
  pool: TeamEntry[];
  /** Teams already locked (used) in this draft */
  locked: Set<string>;
  /** Roles already locked in this draft */
  lockedRoles: SlotRole[];
  /** Current draft slot role (used only to filter decoy cards) */
  role: SlotRole;
  /** The real winner, selected before the animation starts. It is hidden until the final reveal. */
  selectedTeam: TeamEntry;
  onComplete: () => void;
  duration?: number;
}

const ROLE_LABEL_ES: Record<SlotRole, string> = {
  DUELIST: "DUELISTA",
  INITIATOR: "INICIADOR",
  CONTROLLER: "CONTROLADOR",
  SENTINEL: "CENTINELA",
  FLEX: "FLEX",
  COACH: "COACH",
};

const REGION_SHORT: Record<Region, string> = {
  AMERICAS: "AM",
  EMEA: "EM",
  PACIFIC: "PC",
  CHINA: "CN",
};

const REGION_ACCENTS: Record<Region, { solid: string; soft: string; glow: string; text: string }> = {
  AMERICAS: {
    solid: "#ff9652",
    soft: "rgba(255, 150, 82, 0.14)",
    glow: "rgba(255, 150, 82, 0.38)",
    text: "#ffc49a",
  },
  EMEA: {
    solid: "#64e6ff",
    soft: "rgba(100, 230, 255, 0.14)",
    glow: "rgba(100, 230, 255, 0.34)",
    text: "#b8f7ff",
  },
  PACIFIC: {
    solid: "#b7ff39",
    soft: "rgba(183, 255, 57, 0.13)",
    glow: "rgba(183, 255, 57, 0.34)",
    text: "#e3ff9c",
  },
  CHINA: {
    solid: "#ff5ba4",
    soft: "rgba(255, 91, 164, 0.14)",
    glow: "rgba(255, 91, 164, 0.36)",
    text: "#ffb0d2",
  },
};

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

function accentStyle(region?: Region): CSSProperties {
  const accent = REGION_ACCENTS[region ?? "AMERICAS"];
  return {
    ["--roulette-accent" as string]: accent.solid,
    ["--roulette-accent-soft" as string]: accent.soft,
    ["--roulette-accent-glow" as string]: accent.glow,
    ["--roulette-accent-text" as string]: accent.text,
  };
}

export function TeamRoll({ pool, locked, lockedRoles, role, selectedTeam, onComplete, duration = 5600 }: Props) {
  const [phase, setPhase] = useState<"spinning" | "reveal" | "done">("spinning");
  const [previewIndex, setPreviewIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const available = useMemo(() => {
    void lockedRoles;
    return pool.filter((team) => {
      if (locked.has(team.id)) return false;
      if (role === "COACH") return true;
      return team.players.some((player) => {
        const draftMode = useDraft.getState().draftMode;
        if (draftMode !== "STRICT" || role === "FLEX") return true;
        return player.primaryRole === role;
      });
    });
  }, [pool, locked, lockedRoles, role]);

  const [visualFeed, setVisualFeed] = useState<TeamEntry[]>([]);
  
  useEffect(() => {
    if (visualFeed.length === 0) {
      setVisualFeed(buildVisualFeed(available.length > 0 ? available : pool, selectedTeam));
    }
  }, [available, pool, selectedTeam, visualFeed.length]);

  const feed = visualFeed.length > 0 ? visualFeed : [selectedTeam];
  const previewTeam = feed[previewIndex % feed.length] ?? selectedTeam;
  const activeTeam = phase === "spinning" ? previewTeam : selectedTeam;
  const { org: activeOrg, tournament: activeTournament } = getTeamMeta(activeTeam);
  const { org: selectedOrg, tournament: selectedTournament } = getTeamMeta(selectedTeam);
  const region = activeOrg?.region ?? activeTeam.region;
  const selectedRegion = selectedOrg?.region ?? selectedTeam.region;

  useEffect(() => {
    unlockSfx();
    playSfx("rollStart");

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

    const revealTimer = window.setTimeout(() => {
      if (previewTimer !== undefined) window.clearTimeout(previewTimer);
      if (progressFrame !== undefined) window.cancelAnimationFrame(progressFrame);
      setProgress(100);
      setPhase("reveal");
      playSfx("teamReveal");
    }, duration);

    const completeTimer = window.setTimeout(() => {
      setPhase("done");
      onComplete();
    }, duration + 1050);

    return () => {
      if (previewTimer !== undefined) window.clearTimeout(previewTimer);
      if (progressFrame !== undefined) window.cancelAnimationFrame(progressFrame);
      window.clearTimeout(revealTimer);
      window.clearTimeout(completeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <AnimatePresence>
        {phase === "reveal" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.72, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute inset-0 z-20 bg-gold/25"
          />
        )}
      </AnimatePresence>

      <div className="roll-cinematic-card roulette-stage clip-corner relative overflow-hidden border border-border bg-surface/80 p-6 backdrop-blur">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="roll-cinematic-sweep" />
          <div className="roulette-scan-grid" />
        </div>

        <div className="relative z-10 mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-background/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-gold shadow-[0_0_18px_rgba(212,175,55,0.12)]">
            <RefreshCw className={`h-3.5 w-3.5 ${phase === "spinning" ? "animate-spin" : ""}`} />
            {phase === "spinning" ? "Girando ruleta..." : "¡Equipo obtenido!"}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
            <RadioTower className="h-3.5 w-3.5" style={{ color: REGION_ACCENTS[region ?? "AMERICAS"].solid }} />
            <span className={phase === "spinning" ? "animate-pulse" : "text-gold"}>
              {phase === "spinning" ? "Transmisión en vivo" : "Señal bloqueada"}
            </span>
          </div>
        </div>

        <div className="relative z-10 text-center">
          <p className="text-sm text-muted-foreground">
            {phase === "spinning" ? "Analizando pool global y preparando selección para" : "Selección confirmada para"}{" "}
            <span className="font-black text-primary">{ROLE_LABEL_ES[role]}</span>
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            style={accentStyle(region)}
            className={`roulette-lock-card roulette-lock-card--solo mx-auto mt-5 max-w-2xl ${phase === "spinning" ? "is-scanning" : "is-revealed"}`}
          >
            <div className="roulette-diamond roulette-diamond-top" />
            <div className="roulette-diamond roulette-diamond-bottom" />

            <div className="flex flex-wrap items-center justify-center gap-2">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={`${activeTeam.id}-${phase}-region-short`}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: phase === "spinning" ? 0.08 : 0.18 }}
                  className="clip-tag region-code-chip px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.25em]"
                >
                  {REGION_SHORT[region ?? "AMERICAS"]}
                </motion.span>
              </AnimatePresence>
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={`${activeTeam.id}-${phase}-region-name`}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: phase === "spinning" ? 0.08 : 0.18 }}
                  className="clip-tag region-name-chip px-2.5 py-1 text-[10px] font-black uppercase tracking-widest"
                >
                  {region ?? "AMERICAS"}
                </motion.span>
              </AnimatePresence>
              <span className="clip-tag border border-gold/50 bg-gold/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-gold">
                {phase === "spinning" ? "Buscando señal" : "Resultado final"}
              </span>
            </div>

            <div className="relative mt-4 min-h-[2.8rem] overflow-hidden sm:min-h-[3.35rem]">
              <motion.div
                key={phase === "spinning" ? "rolling-phase" : `result-${selectedTeam.id}`}
                initial={phase === "reveal" ? { opacity: 0, y: 18 } : false}
                animate={{ opacity: 1, y: 0, letterSpacing: "0em" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="roulette-live-name font-display text-3xl text-foreground drop-shadow sm:text-5xl"
              >
                {activeTeam.displayName}
              </motion.div>
            </div>

            <div className="mt-2 min-h-[0.875rem] overflow-hidden text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground">
              <motion.div
                key={phase === "spinning" ? "rolling-phase-tour" : `result-${selectedTeam.id}-tour`}
                initial={phase === "reveal" ? { opacity: 0, y: 6 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
              >
                {activeTournament?.shortName ?? "VALORANT ERA"} · {activeTournament?.year ?? ""}
              </motion.div>
            </div>

            <div className="mx-auto mt-5 h-1.5 max-w-xs overflow-hidden rounded-full border border-border/70 bg-background/80">
              <motion.div
                className="h-full roulette-progress-bar"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.12, ease: "linear" }}
              />
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-semibold text-muted-foreground">
              {phase === "spinning" ? <ScanLine className="h-3.5 w-3.5 animate-pulse" style={{ color: REGION_ACCENTS[region ?? "AMERICAS"].solid }} /> : <Sparkles className="h-3.5 w-3.5 text-gold" />}
              <span>{phase === "spinning" ? `Analizando estadísticas... ${progress}%` : "Listo. Abriendo roster disponible..."}</span>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {phase !== "spinning" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              style={accentStyle(selectedRegion)}
              className="roulette-result-inline relative z-10 mt-5 flex flex-col items-center justify-center gap-3 border-t border-gold/35 pt-4 text-center sm:flex-row sm:justify-between sm:text-left"
            >
              <div>
                <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-widest text-gold sm:justify-start">
                  <Zap className="h-3.5 w-3.5" /> Selección revelada
                </div>
                <div className="font-display text-3xl">{selectedTeam.displayName}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                  {selectedRegion} · {selectedTournament?.shortName ?? "VALORANT ERA"} {selectedTournament?.year ?? ""}
                </div>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">OVR</div>
                <div className="font-display text-5xl" style={{ color: REGION_ACCENTS[selectedRegion ?? "AMERICAS"].solid }}>{selectedTeam.avgRating}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
