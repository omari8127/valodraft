import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useDraft,
  canPickPlayer,
  getAIRecPlayer,
  canPlacePlayerInSlot,
  canPlaceCoachInSlot,
} from "@/lib/store/draft";
import type { CoachEntry, PlayerEntry, TeamEntry, DraftMode, SlotRole, Region } from "@/types/game";
import { RosterPanel } from "@/components/RosterPanel";
import { ChemistryPanel } from "@/components/ChemistryPanel";
import { DraftRoulette } from "@/components/DraftRoulette";
import { PlayerCard } from "@/components/PlayerCard";
import { PLAYER_BY_ID, COACH_BY_ID } from "@/data/generate";
import { computeChemistry } from "@/lib/engine/chemistry";
import { computeTeamOVR } from "@/lib/engine/ovr";
import { ORG_BY_ID } from "@/data/regions";
import { TOURNAMENT_BY_ID } from "@/data/tournaments";
import { useDynasty } from "@/lib/store/dynasty";
import { computeCompositionStats } from "@/lib/engine/roleBalance";
import { useProgression } from "@/lib/store/progression";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useLanguage } from "@/lib/i18n";
import { playSfx, unlockSfx } from "@/lib/sfx";
import { Flame, ShieldAlert, Award, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/draft")({
  head: () => ({
    meta: [
      { title: "Draft — Valorant Champions Draft" },
      {
        name: "description",
        content: "Roll teams, lock in your roster, and chase the perfect chemistry.",
      },
    ],
  }),
  component: DraftPage,
});

function RosterCompositionStats({
  players,
  draftMode,
}: {
  players: PlayerEntry[];
  draftMode: DraftMode;
}) {
  const stats = computeCompositionStats(players);
  const { t } = useLanguage();
  const isUnbalanced = stats.sentinels === 0 || stats.controllers === 0 || stats.initiators === 0;

  return (
    <div className="clip-corner border border-border bg-surface/70 p-4 backdrop-blur space-y-4">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
          {t("compRatios")} ({draftMode})
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div className="flex justify-between border-b border-border/30 pb-1">
            <span className="text-muted-foreground">Duelists:</span>
            <span className={`font-semibold ${stats.duelists >= 2 ? "text-primary" : "text-foreground"}`}>
              {stats.duelists}{draftMode === "STRICT" ? "/1" : ""}
            </span>
          </div>
          <div className="flex justify-between border-b border-border/30 pb-1">
            <span className="text-muted-foreground">Controllers:</span>
            <span className={`font-semibold ${stats.controllers >= 2 ? "text-primary" : stats.controllers === 0 ? "text-red-400" : "text-foreground"}`}>
              {stats.controllers}{draftMode === "STRICT" ? "/1" : ""} {stats.controllers === 0 && "⚠ MISSING"}
            </span>
          </div>
          <div className="flex justify-between border-b border-border/30 pb-1">
            <span className="text-muted-foreground">Initiators:</span>
            <span className={`font-semibold ${stats.initiators === 0 ? "text-red-400" : "text-foreground"}`}>
              {stats.initiators}{draftMode === "STRICT" ? "/1" : ""} {stats.initiators === 0 && "⚠ MISSING"}
            </span>
          </div>
          <div className="flex justify-between border-b border-border/30 pb-1">
            <span className="text-muted-foreground">Sentinels:</span>
            <span className={`font-semibold ${stats.sentinels === 0 ? "text-red-400" : "text-foreground"}`}>
              {stats.sentinels}{draftMode === "STRICT" ? "/1" : ""} {stats.sentinels === 0 && "⚠ MISSING"}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}


const ROLE_LABEL_ES: Record<SlotRole, string> = {
  DUELIST: "Duelista",
  INITIATOR: "Iniciador",
  CONTROLLER: "Controlador",
  SENTINEL: "Centinela",
  FLEX: "Flex",
  COACH: "Coach",
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
    glow: "rgba(255, 150, 82, 0.32)",
    text: "#ffc49a",
  },
  EMEA: {
    solid: "#64e6ff",
    soft: "rgba(100, 230, 255, 0.14)",
    glow: "rgba(100, 230, 255, 0.32)",
    text: "#b8f7ff",
  },
  PACIFIC: {
    solid: "#b7ff39",
    soft: "rgba(183, 255, 57, 0.13)",
    glow: "rgba(183, 255, 57, 0.32)",
    text: "#e3ff9c",
  },
  CHINA: {
    solid: "#ff5ba4",
    soft: "rgba(255, 91, 164, 0.14)",
    glow: "rgba(255, 91, 164, 0.34)",
    text: "#ffb0d2",
  },
};

function regionAccentStyle(region?: Region): CSSProperties {
  const accent = REGION_ACCENTS[region ?? "AMERICAS"];
  return {
    ["--team-accent" as string]: accent.solid,
    ["--team-accent-soft" as string]: accent.soft,
    ["--team-accent-glow" as string]: accent.glow,
    ["--team-accent-text" as string]: accent.text,
  };
}

function isFlexiblePlayer(player?: PlayerEntry | null): boolean {
  return player?.primaryRole === "FLEX";
}

type PendingPick =
  | { type: "player"; player: PlayerEntry; team: TeamEntry }
  | { type: "coach"; coach: CoachEntry; team: TeamEntry };

function DraftPage() {
  const navigate = useNavigate();
  const state = useDraft();
  const { t } = useLanguage();
  const [rollSession, setRollSession] = useState(0);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [pendingPick, setPendingPick] = useState<PendingPick | null>(null);

  const currentSlot = state.roster.slots[state.currentSlotIdx];
  const isDone = state.currentSlotIdx >= state.roster.slots.length;

  // Set Champions vs Masters dynamic theme sets on mount
  useEffect(() => {
    if (!state.modeId) return;
    const isChampions = state.modeId === "champions" || state.modeId.startsWith("champions-");
    const isMasters = state.modeId === "masters" || state.modeId.startsWith("masters-");
    const themeName = isChampions ? "champions" : isMasters ? "masters" : "default";

    document.body.setAttribute("data-theme", themeName);

    // Abstract energy background class
    const bgClass = isChampions ? "bg-champions-particles" : isMasters ? "bg-masters-particles" : "";
    document.body.classList.remove("bg-champions-particles", "bg-masters-particles");
    if (bgClass) {
      document.body.classList.add(bgClass);
    }

    localStorage.setItem("ui-theme", themeName);
  }, [state.modeId]);

  useEffect(() => {
    setPendingPick(null);
  }, [state.rollResultTeam?.id, state.currentSlotIdx]);

  // Compute live OVR/chem using playerWithForm to preserve dynamic form
  const draftedPlayers: PlayerEntry[] = state.roster.slots
    .filter((s) => s.role !== "COACH" && s.playerId)
    .map((s) => s.playerWithForm ?? PLAYER_BY_ID[s.playerId!])
    .filter(Boolean);
  const coachSlot = state.roster.slots.find((s) => s.role === "COACH");
  const drafted_coach: CoachEntry | null = coachSlot?.coachId
    ? COACH_BY_ID[coachSlot.coachId]
    : null;

  const chemistry = useMemo(
    () => computeChemistry(draftedPlayers, drafted_coach),
    [draftedPlayers, drafted_coach],
  );
  const ovr = useMemo(
    () => computeTeamOVR(draftedPlayers, drafted_coach, state.draftMode),
    [draftedPlayers, drafted_coach, state.draftMode],
  );

  const pendingIsFlexPlayer = pendingPick?.type === "player" && isFlexiblePlayer(pendingPick.player);
  const pendingCompatibleSlots = useMemo(() => {
    if (!pendingPick) return [];

    return state.roster.slots
      .map((slot, index) => ({ slot, index }))
      .filter(({ index }) =>
        pendingPick.type === "player"
          ? canPlacePlayerInSlot(pendingPick.player, state.roster, index, state.draftMode)
          : canPlaceCoachInSlot(pendingPick.coach, state.roster, index),
      );
  }, [pendingPick, state.roster, state.draftMode]);

  // Redirect to /play if no mode selected
  if (!state.modeId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-sm text-muted-foreground">No active draft.</div>
        <Link
          to="/play"
          className="clip-corner mt-4 inline-block bg-primary px-5 py-2.5 font-display text-sm tracking-widest text-primary-foreground"
        >
          {t("play")}
        </Link>
      </div>
    );
  }

  function onRollComplete() {
    state.finishRoll();
  }

  function selectPlayerFromTeam(player: PlayerEntry, team: TeamEntry) {
    unlockSfx();
    playSfx("select");
    setPendingPick({ type: "player", player, team });
  }
  function selectCoachFromTeam(coach: CoachEntry, team: TeamEntry) {
    unlockSfx();
    playSfx("select");
    setPendingPick({ type: "coach", coach, team });
  }
  function placePendingPick(slotIndex: number) {
    if (!pendingPick) return;
    unlockSfx();
    playSfx("place");
    if (pendingPick.type === "player") {
      state.pickPlayer(pendingPick.player, pendingPick.team, slotIndex);
    } else {
      state.pickCoach(pendingPick.coach, pendingPick.team, slotIndex);
    }
    setPendingPick(null);
    setRollSession((n) => n + 1);
  }

  function finishAndGoMatch() {
    const forms: Record<string, number> = {};
    const roleAssignments: Record<string, PlayerEntry["primaryRole"]> = {};
    draftedPlayers.forEach((p) => {
      if (p.form !== undefined) {
        forms[p.id] = p.form;
      }
      roleAssignments[p.id] = p.primaryRole;
    });

    const save = {
      id: `dyn-${Date.now()}`,
      name: state.teamName,
      createdAt: Date.now(),
      modeId: state.modeId!,
      rosterPlayerIds: draftedPlayers.map((p) => p.id),
      coachId: drafted_coach?.id ?? null,
      teamOVR: ovr,
      chemistry: chemistry.total,
      trophies: [],
      wins: 0,
      losses: 0,
      playerForms: forms,
      roleAssignments,
      draftMode: state.draftMode,
    };
    unlockSfx();
    playSfx("matchStart");
    useDynasty.getState().addSave(save);
    navigate({ to: "/match", search: { saveId: save.id } });
  }

  return (
    <TooltipProvider delayDuration={0}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6"
      >
        {/* Top Controls */}
        <div className="mb-6 flex flex-row items-center justify-between border-b border-border/40 pb-4 gap-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            VCT CHAMPIONS DRAFT ({state.draftMode} MODE)
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowRules(prev => !prev)}
              className="hidden sm:flex items-center gap-2 text-xs tracking-wide border border-white/10 px-3 py-1.5 rounded-md transition-all duration-200 hover:border-white/30 hover:bg-white/5 cursor-pointer text-white"
            >
              {showRules ? "OCULTAR GUÍA" : "VER REGLAS DE QUÍMICA"}
            </button>
            <div className="clip-corner bg-surface border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
              Roster:{" "}
              <span className="font-display text-base text-gold">
                {draftedPlayers.length + (drafted_coach ? 1 : 0)}/{state.roster.slots.length}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Toggle Alternative */}
        <div className="flex sm:hidden justify-end mb-4">
          <button
            onClick={() => setShowRules(prev => !prev)}
            className="flex items-center gap-2 text-xs tracking-wide border border-white/10 px-3 py-1.5 rounded-md transition-all duration-200 hover:border-white/30 hover:bg-white/5 cursor-pointer text-white w-full justify-center"
          >
            {showRules ? "OCULTAR GUÍA" : "VER REGLAS DE QUÍMICA"}
          </button>
        </div>

        {/* RULES PANEL (ANIMATED DROPDOWN) */}
        <AnimatePresence>
          {showRules && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 border border-white/10 rounded-xl p-6 bg-[#0B1320]/80 backdrop-blur-sm mb-6 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold tracking-wide text-white/90">
                  LIBRO DE REGLAS DE QUÍMICA Y SINERGIAS
                </h3>
                <button
                  onClick={() => setShowRules(false)}
                  className="text-xs text-white/40 hover:text-white/70 cursor-pointer"
                >
                  × CERRAR
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-xs text-white/70 leading-relaxed">
                <div>
                  <p className="font-medium text-cyan-400 mb-1">🤝 JUGADOR × JUGADOR</p>
                  <p>
                    La química ahora se calcula por conexiones reales entre los jugadores que ya elegiste.
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li>• Misma organización histórica: +4 por pareja.</li>
                    <li>• Misma región competitiva: +2 por pareja.</li>
                    <li>• Misma nacionalidad: +1 por pareja.</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-purple-400 mb-1">🏆 ROSTER HISTÓRICO</p>
                  <p>
                    Si armas una base que realmente jugó junta en el mismo torneo, el sistema la premia mejor.
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li>• Misma org + mismo torneo entre todos: bonus de equipo completo.</li>
                    <li>• El panel de química muestra el detalle para que sepas por qué sube.</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-pink-400 mb-1">🧠 COACH</p>
                  <p>
                    El coach ya no es solo decoración: suma cuando encaja con tu núcleo de jugadores.
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li>• Coach de la misma organización: +3 por jugador.</li>
                    <li>• Coach de la misma región: +3 si no coincide la organización.</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-emerald-400 mb-1">🎯 POSICIONES</p>
                  <p>
                    Ahora primero eliges al jugador y después confirmas en qué slot colocarlo, como en el ejemplo.
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li>• En CHAOS y FLEXIBLE puedes colocarlo en cualquier slot libre de jugador.</li>
                    <li>• En STRICT solo se iluminan las posiciones compatibles.</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-yellow-400 mb-1">⚡ CHAOS MODE</p>
                  <p>
                    En Chaos los roles ya no castigan el OVR ni el cálculo de partida. Puedes armar equipos raros sin perder por composición.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-blue-400 mb-1">📊 OVR FINAL</p>
                  <p>
                    El OVR combina rating real, forma dinámica y la química total. La química funciona como multiplicador suave para que tus decisiones importen sin romper el balance.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* MAIN RESPONSIVE LAYOUT */}
        <div className="flex flex-col md:grid md:grid-cols-[2fr_1fr] gap-6 max-w-[1300px] mx-auto">
          {/* LEFT COLUMN */}
          <div className="contents md:flex md:flex-col md:gap-6">
            {/* OVR & CHEMISTRY ROW */}
            <div className="flex flex-col sm:grid sm:grid-cols-[1fr_2fr] gap-6">
              {/* OVR CARD */}
              <div className="clip-corner border border-border bg-surface/70 p-4 flex flex-col justify-between backdrop-blur min-h-[110px]">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Team OVR
                  </div>
                  <div className="font-display text-4xl text-primary flex items-baseline gap-1">
                    {ovr}
                    <span className="font-sans text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                      / 100 OVR
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-foreground/90">
                    <Flame className="w-3 h-3 text-primary fill-primary" />
                    Chemistry Total: +{chemistry.total} pts
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <span className="clip-corner bg-background/80 border border-border px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    SQUAD
                  </span>
                </div>
              </div>

              {/* CHEMISTRY CARD */}
              <div className="h-full">
                <ChemistryPanel chemistry={chemistry} ovr={ovr} />
              </div>
            </div>

            {/* MAIN CONTENT ROW (SPIN / TEAM / GRID) */}
            <div className="order-5 md:order-none w-full">
              {!isDone ? (
                <div className="w-full mt-6">
                  <DraftRoulette
                    role={currentSlot.role}
                    draftedPlayers={draftedPlayers}
                    coach={drafted_coach}
                    currentOVR={ovr}
                    onPickPlayer={(p) => {
                      if (state.rollResultTeam) selectPlayerFromTeam(p, state.rollResultTeam);
                    }}
                    onPickCoach={(c) => {
                      if (state.rollResultTeam) selectCoachFromTeam(c, state.rollResultTeam);
                    }}
                    selectedPickId={pendingPick?.type === "player" ? pendingPick.player.id : pendingPick?.type === "coach" ? pendingPick.coach.id : null}
                    onHoverRole={setHoveredRole}
                  />
                </div>
              ) : (
                <div className="clip-corner border border-primary/60 bg-surface/70 p-6 md:p-8 text-center backdrop-blur mt-6">
                  <div className="font-display text-2xl md:text-3xl text-primary font-bold">{t("rosterLocked")}</div>
                  <p className="mt-1.5 md:mt-2 text-xs md:text-sm text-muted-foreground font-sans">
                    {t("rosterReadyText")}
                  </p>
                  <div className="mt-5 md:mt-6 flex flex-wrap justify-center gap-2.5 md:gap-3">
                    <button
                      onClick={finishAndGoMatch}
                      className="clip-corner bg-primary w-full md:w-auto md:min-w-[200px] py-4 md:py-5 font-display text-lg md:text-xl tracking-widest text-primary-foreground transition hover:brightness-110 cursor-pointer font-bold"
                    >
                      {t("playMatch")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">
            <div className="order-4 md:order-none w-full clip-corner border border-border bg-surface/70 p-5 backdrop-blur">
              <div className="mb-4">
                <div className="font-display text-xl font-bold uppercase tracking-wider">Current Roster</div>
                <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Your definitive roster of 5 competitive positions and your Coach. Slots lock as they are completed.
                </div>
              </div>
              <RosterPanel
                roster={state.roster}
                currentIdx={state.currentSlotIdx}
                hoveredRole={hoveredRole}
                pendingPlayer={pendingPick?.type === "player" ? pendingPick.player : null}
                pendingCoach={pendingPick?.type === "coach" ? pendingPick.coach : null}
                draftMode={state.draftMode}
                onSelectSlot={placePendingPick}
              />
            </div>

            <div className="order-6 md:order-none space-y-4 w-full">
              <RosterCompositionStats players={draftedPlayers} draftMode={state.draftMode} />

              <div className="clip-corner border border-border bg-surface/60 p-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {t("draftOrderLabel")}
                </div>
                <ol className="mt-2 space-y-1">
                  {state.roster.slots.map((s, i) => (
                    <li
                      key={i}
                      className={`flex items-center justify-between text-xs ${i === state.currentSlotIdx
                        ? "text-primary font-bold"
                        : i < state.currentSlotIdx
                          ? "text-muted-foreground line-through opacity-60"
                          : "text-foreground/80"
                        }`}
                    >
                      <span>
                        {String(i + 1).padStart(2, "0")} · {s.role}
                      </span>
                      {i === state.currentSlotIdx && <span>← NOW</span>}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
