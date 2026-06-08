import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDraft, canPickPlayer, getAIRecPlayer } from "@/lib/store/draft";
import type { CoachEntry, PlayerEntry, TeamEntry, DraftMode, SlotRole } from "@/types/game";
import { RosterPanel } from "@/components/RosterPanel";
import { ChemistryPanel } from "@/components/ChemistryPanel";
import { TeamRoll } from "@/components/TeamRoll";
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
            <span className={`font-semibold ${stats.controllers >= 2 ? "text-primary" : "text-foreground"}`}>
              {stats.controllers}{draftMode === "STRICT" ? "/1" : ""}
            </span>
          </div>
          <div className="flex justify-between border-b border-border/30 pb-1">
            <span className="text-muted-foreground">Initiators:</span>
            <span className="font-semibold text-foreground">
              {stats.initiators}{draftMode === "STRICT" ? "/1" : ""}
            </span>
          </div>
          <div className="flex justify-between border-b border-border/30 pb-1">
            <span className="text-muted-foreground">Sentinels:</span>
            <span className="font-semibold text-foreground">
              {stats.sentinels}{draftMode === "STRICT" ? "/1" : ""}
            </span>
          </div>
        </div>
      </div>

      {isUnbalanced && players.length > 0 && draftMode !== "CHAOS" && (
        <div className="border border-red-500/30 bg-red-500/10 p-3 rounded clip-corner">
          <div className="text-[10px] font-bold uppercase text-red-500 tracking-wider flex items-center gap-1">
            {t("compWarningTitle")}
          </div>
          <div className="text-[10px] text-muted-foreground/90 mt-1 leading-normal">
            {t("compWarningDesc")}
          </div>
        </div>
      )}
    </div>
  );
}

function DraftPage() {
  const navigate = useNavigate();
  const state = useDraft();
  const { t } = useLanguage();
  const [rollSession, setRollSession] = useState(0);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);

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

  function pickPlayerFromTeam(player: PlayerEntry, team: TeamEntry) {
    state.pickPlayer(player, team);
    setRollSession((n) => n + 1);
  }
  function pickCoachFromTeam(coach: CoachEntry, team: TeamEntry) {
    state.pickCoach(coach, team);
    setRollSession((n) => n + 1);
  }

  function finishAndGoMatch() {
    const forms: Record<string, number> = {};
    draftedPlayers.forEach((p) => {
      if (p.form !== undefined) {
        forms[p.id] = p.form;
      }
    });

    const save = {
      id: `dyn-${Date.now()}`,
      name: `Roster ${new Date().toLocaleDateString()}`,
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
      draftMode: state.draftMode,
    };
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
        {/* Top Header */}
        <div className="mb-6 flex items-center justify-between border-b border-border/40 pb-4">
          <div>
            <h1 className="font-display text-xl sm:text-3xl leading-none">{t("draftChallenge")}</h1>
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary mt-1">
              VCT CHAMPIONS DRAFT ({state.draftMode} MODE)
            </div>
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
                {/* SINERGIA DE REGIÓN */}
                <div>
                  <p className="font-medium text-blue-400 mb-1">🌍 SINERGIA DE REGIÓN</p>
                  <p>
                    Premia tener jugadores de la misma liga competitiva principal (LEC, LCK, LPL, LCS, Wildcards).
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li>• 3+ jugadores: +2.5 puntos OVR.</li>
                    <li>• 5+ jugadores: +6.5 puntos OVR.</li>
                  </ul>
                </div>

                {/* SINERGIA DE FRANQUICIA */}
                <div>
                  <p className="font-medium text-cyan-400 mb-1">🛡️ SINERGIA DE FRANQUICIA</p>
                  <p>
                    Premia la afinidad por haber defendido el mismo escudo en una etapa de su carrera.
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li>• 2 jugadores: +2.5 puntos OVR.</li>
                    <li>• 3 jugadores: +5.0 puntos OVR.</li>
                    <li>• 4+ jugadores: +8.0 puntos OVR.</li>
                  </ul>
                </div>

                {/* QUÍMICA PERFECTA */}
                <div>
                  <p className="font-medium text-purple-400 mb-1">⏳ QUÍMICA PERFECTA</p>
                  <p>
                    Se activa si tienes jugadores que compartieron exactamente el mismo año y equipo de competición histórica (e.g. Fnatic 2018).
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li>• 2 jugadores: +2.5 puntos OVR.</li>
                    <li>• 3 jugadores: +5.0 puntos OVR.</li>
                    <li>• 4 jugadores: +8.0 puntos OVR.</li>
                    <li>• 5 jugadores: +10.0 puntos OVR.</li>
                  </ul>
                </div>

                {/* SINERGIAS DE CAMPEÓN */}
                <div>
                  <p className="font-medium text-orange-400 mb-1">🔥 SINERGIAS DE CAMPEÓN</p>
                  <p>
                    Bono especial por campeones insignia, sin contar equipo real, región competitiva ni año.
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li>• Parejas de lore: Xayah/Rakan, Lucian/Senna, Yasuo/Yone, Garen/Lux, Kayle/Morgana.</li>
                    <li>• Facciones de lore: Ionia, Freljord, Vacío, Piltover/Zaun, Noxus, Shurima, Darkin, Yordles y Shadow Isles.</li>
                    <li>• Estilo de combate: Engage, Dive, Poke, Pick, Wombo Combo, CC Chain, Protect the Carry, Scaling, Frontline + Backline y daño equilibrado.</li>
                    <li>• El bonus de campeones tiene límite para no sustituir la química de roster.</li>
                  </ul>
                </div>

                {/* COACH */}
                <div>
                  <p className="font-medium text-pink-400 mb-1">🧠 ESTILO DE ENTRENADOR (COACH)</p>
                  <p>
                    El entrenador aporta bonos según su filosofía y tus elecciones:
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li>• Tácticos (Draft/Notebook): +2.5 base, +1.5 extra si completas el equipo.</li>
                    <li>• Agresivos: Potencian con +1.5 por cada campeón creador de jugadas agresivas (Lee Sin, Elise, LeBlanc, Zed, etc.).</li>
                    <li>• Disciplinados (Macro): Multiplican la sinergia de equipo existente por un 40% (máx +3).</li>
                  </ul>
                </div>

                {/* CÁLCULO OVR */}
                <div>
                  <p className="font-medium text-yellow-400 mb-1">📊 CÁLCULO DE VALORACIÓN GENERAL (OVR)</p>
                  <p>
                    Media real de tus 6 miembros (5 jugadores + 1 coach) suplementada por tus bonus de sinergias totales (peso de 0.45x para que tus decisiones estrategas importen).
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN RESPONSIVE LAYOUT */}
        <div className="flex flex-col md:grid md:grid-cols-[2fr_1fr] gap-6 max-w-[1200px] mx-auto">
          {/* LEFT COLUMN */}
          <div className="contents md:flex md:flex-col md:gap-6">
            {/* TOP ROW: OVR & CHEMISTRY */}
            <div className="order-1 md:order-none grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
              {/* OVR CARD */}
              <div className="clip-corner border border-border bg-surface/70 p-5 flex flex-col justify-between backdrop-blur">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Team OVR
                  </div>
                  <div className="font-display text-5xl text-primary flex items-baseline gap-1">
                    {ovr}
                    <span className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      / 100 OVR
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-foreground/90">
                    <Flame className="w-4 h-4 text-primary fill-primary" />
                    Chemistry Total: +{chemistry.total} pts
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="clip-corner bg-background/80 border border-border px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    SQUAD
                  </span>
                </div>
              </div>

              {/* CHEMISTRY CARD */}
              <div className="order-2 md:order-none h-full">
                <ChemistryPanel chemistry={chemistry} ovr={ovr} />
              </div>
            </div>

            {/* SPIN / ROLL SECTION */}
            <div className="order-3 md:order-none w-full">
              {!isDone && !state.rollResultTeam && !state.isRolling && (
                <div className="clip-corner border border-border bg-surface/70 p-6 md:p-8 text-center backdrop-blur">
                  <div className="font-display text-xl md:text-2xl font-bold">{t("readyNextRoll")}</div>
                  <p className="mt-1.5 md:mt-2 text-xs md:text-sm text-muted-foreground font-sans">
                    {t("rollInfoText")}{" "}
                    <span className="font-bold text-primary">{currentSlot.role}</span>.
                  </p>
                  <button
                    onClick={state.startRoll}
                    className="clip-corner mt-4 md:mt-6 inline-flex items-center gap-3 bg-primary px-6 md:px-8 py-3 md:py-4 font-display text-base md:text-lg tracking-widest text-primary-foreground transition hover:brightness-110 cursor-pointer font-bold w-full justify-center md:w-auto"
                  >
                    {t("rollBtn")} {currentSlot.role}
                  </button>
                </div>
              )}

              {state.isRolling && state.rollSelectedTeam && !state.rollResultTeam && (
                <div className="w-full overflow-hidden">
                  <TeamRoll
                    key={rollSession}
                    pool={state.pool}
                    locked={state.lockedTeamEntryIds}
                    lockedRoles={[]}
                    role={currentSlot.role}
                    selectedTeam={state.rollSelectedTeam}
                    onComplete={onRollComplete}
                  />
                </div>
              )}

              {isDone && (
                <div className="clip-corner border border-primary/60 bg-surface/70 p-6 md:p-8 text-center backdrop-blur">
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

            {/* PLAYER GRID (CONDITIONAL) */}
            {state.rollResultTeam && (
              <div className="order-5 md:order-none w-full">
                <TeamExpansion
                  team={state.rollResultTeam}
                  role={currentSlot.role}
                  draftedPlayers={draftedPlayers}
                  coach={drafted_coach}
                  currentOVR={ovr}
                  onPickPlayer={(p) => {
                    pickPlayerFromTeam(p, state.rollResultTeam!);
                  }}
                  onPickCoach={(c) => {
                    pickCoachFromTeam(c, state.rollResultTeam!);
                  }}
                  onHoverRole={setHoveredRole}
                />
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="contents md:flex md:flex-col md:gap-6">
            <div className="order-4 md:order-none w-full clip-corner border border-border bg-surface/70 p-5 backdrop-blur">
              <div className="mb-4">
                <div className="font-display text-xl font-bold uppercase tracking-wider">Current Roster</div>
                <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Your definitive roster of 5 competitive positions and your Coach. Slots lock as they are completed.
                </div>
              </div>
              <RosterPanel roster={state.roster} currentIdx={state.currentSlotIdx} hoveredRole={hoveredRole} />
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

function TeamExpansion({
  team,
  role,
  draftedPlayers,
  coach,
  currentOVR,
  onPickPlayer,
  onPickCoach,
  onHoverRole,
}: {
  team: TeamEntry;
  role: string;
  draftedPlayers: PlayerEntry[];
  coach: CoachEntry | null;
  currentOVR: number;
  onPickPlayer: (p: PlayerEntry) => void;
  onPickCoach: (c: CoachEntry) => void;
  onHoverRole?: (role: string | null) => void;
}) {
  const org = ORG_BY_ID[team.orgId];
  const state = useDraft();
  const progression = useProgression();
  const { t } = useLanguage();
  const [rerollShake, setRerollShake] = useState(false);

  // Retrieve AI recommendation player
  const aiRec = getAIRecPlayer(team, state.roster, state.draftMode, progression.difficulty);

  const handleAIPick = () => {
    if (!aiRec) return;
    if ("role" in aiRec) {
      onPickPlayer(aiRec as PlayerEntry);
    } else {
      onPickCoach(aiRec as CoachEntry);
    }
  };

  const handleReroll = () => {
    if (state.rerollsLeft <= 0 || state.isRolling) return;
    setRerollShake(true);
    setTimeout(() => {
      setRerollShake(false);
      state.rerollCurrentTeam();
    }, 400);
  };

  // Helper to get lock reason feedback in local language
  const getLockReason = (p: PlayerEntry) => {
    if (state.roster.slots.some((s) => s.playerId === p.id)) {
      return t("lockAlreadySelected");
    }
    if (state.draftMode === "STRICT") {
      if (role === "FLEX") {
        return t("lockFlexStrict");
      }
      if (p.primaryRole !== role) {
        return t("lockStrictRole");
      }
    }
    return t("unavailable");
  };

  // Synergy Preview details generator
  const getSynergyPreview = (p: PlayerEntry) => {
    const sameOrg = draftedPlayers.filter((dp) => dp.orgId === p.orgId);
    const sameReg = draftedPlayers.filter((dp) => dp.region === p.region);
    const sameNat = draftedPlayers.filter((dp) => dp.nationality === p.nationality);

    const lines: string[] = [];
    if (sameOrg.length > 0) {
      lines.push(`+${sameOrg.length * 4} Same Org (${sameOrg.map((x) => x.name).join(", ")})`);
    }
    if (sameReg.length > 0) {
      lines.push(`+${sameReg.length * 2} Same Region (${p.region})`);
    }
    if (sameNat.length > 0) {
      lines.push(`+${sameNat.length * 1} Same Nationality (${p.nationality})`);
    }
    if (coach) {
      if (coach.orgId === p.orgId) {
        lines.push(`+3 Coach Org (${coach.name})`);
      } else if (coach.region === p.region) {
        lines.push(`+3 Coach Region (${p.region})`);
      }
    }

    // Prospective OVR difference computation
    const tempPlayers = [...draftedPlayers, p];
    const prospectiveOVR = computeTeamOVR(tempPlayers, coach, state.draftMode);
    const diff = prospectiveOVR - currentOVR;
    const diffStr = diff >= 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`;

    return {
      lines,
      prospectiveOVR,
      diffStr,
    };
  };

  // UX CARD FILTERING: Show all players, we will pass isDisabled to PlayerCard
  const visiblePlayers = useMemo(() => {
    if (role === "COACH") return [];
    return team.players;
  }, [team.players, role]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`clip-corner border border-primary/60 bg-surface/70 p-4 sm:p-6 backdrop-blur transition-all ${rerollShake ? "animate-card-shake" : ""
        }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            // {team.displayName} — {t("chooseMemberText")}
          </div>
          <div className="mt-0.5 font-display text-xl sm:text-2xl">
            {org?.region} · {team.year} · <span className="text-gold">OVR {team.avgRating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Auto-Pick */}
          {aiRec && !state.isRolling && (
            <button
              onClick={handleAIPick}
              className="clip-corner flex items-center gap-1.5 border border-gold bg-gold/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-gold hover:bg-gold hover:text-background transition cursor-pointer"
            >
              🤖 AI Auto-Pick
            </button>
          )}
        </div>
      </div>

      {/* Grid of Selectable Players / Coach */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {role !== "COACH" && visiblePlayers.map((p) => {
          const isAiRec = aiRec?.id === p.id;
          const synergy = getSynergyPreview(p);
          const isDisabled = !canPickPlayer(p, state.roster, role as SlotRole, state.draftMode);
          const lockReason = getLockReason(p);

          return (
            <Tooltip key={p.id}>
              <TooltipTrigger asChild>
                <div className="transition-all duration-200 opacity-100">
                  <PlayerCard
                    entity={p}
                    mini
                    isAiRec={isAiRec}
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
                  {/* Stats & Form Info */}
                  <div className="flex justify-between items-baseline border-b border-slate-700/50 pb-1">
                    <span className="font-bold text-sm text-gold">{p.name}</span>
                    <span className="text-[10px] text-slate-300">
                      {p.primaryRole} {p.secondaryRole ? `(or ${p.secondaryRole})` : ""}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400">
                    <div>Nation: <span className="text-slate-200">{p.nationality}</span></div>
                    <div>Region: <span className="text-slate-200">{p.region}</span></div>
                  </div>

                  {/* Form Modifier Display */}
                  <div className="flex items-center justify-between text-[10px] border-t border-b border-slate-700/30 py-1 font-mono">
                    <span>Dynamic Form:</span>
                    <span
                      className={`font-bold px-1 py-0.2 rounded ${(p.form ?? 0) > 0
                          ? "text-green-400 bg-green-400/10"
                          : (p.form ?? 0) < 0
                            ? "text-red-400 bg-red-400/10"
                            : "text-slate-400 bg-slate-400/10"
                        }`}
                    >
                      {(p.form ?? 0) >= 0 ? `+${p.form ?? 0}` : p.form}
                    </span>
                  </div>

                  {/* Synergy Preview */}
                  {!isDisabled && synergy && (
                    <div className="space-y-1 text-[10px]">
                      <div className="font-semibold text-gold">Synergies active:</div>
                      {synergy.lines.length === 0 ? (
                        <div className="text-slate-500 italic">None yet</div>
                      ) : (
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5 pl-1">
                          {synergy.lines.map((line, idx) => (
                            <li key={idx}>{line}</li>
                          ))}
                        </ul>
                      )}
                      <div className="pt-1.5 border-t border-slate-700/40 text-gold font-bold flex justify-between">
                        <span>Team OVR change:</span>
                        <span className="text-white">
                          {currentOVR.toFixed(1)} → {synergy.prospectiveOVR.toFixed(1)} ({synergy.diffStr})
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Disabled Reason */}
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

        {/* Coach Render (Only enabled if current draft slot role is COACH) */}
        {role === "COACH" && (() => {
          const isAiRec = aiRec?.id === team.coach.id;
          return (
            <Tooltip key={team.coach.id}>
              <TooltipTrigger asChild>
                <div className="transition-all duration-200 opacity-100">
                  <PlayerCard
                    entity={team.coach}
                    isCoach
                    mini
                    isAiRec={isAiRec}
                    onClick={() => onPickCoach(team.coach)}
                    onMouseEnter={() => onHoverRole?.("COACH")}
                    onMouseLeave={() => onHoverRole?.(null)}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-slate-900 border border-slate-700/60 p-3 shadow-xl text-white clip-corner leading-relaxed z-[100]">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-baseline border-b border-slate-700/50 pb-1">
                    <span className="font-bold text-sm text-gold">{team.coach.name}</span>
                    <span className="text-[10px] text-slate-300 font-bold uppercase">COACH</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-normal mt-1">
                    Adds coach synergies: +3 synergy score for each player matching coach team ({team.coach.orgId}) or region ({team.coach.region}).
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })()}
      </div>

      {state.draftMode === "STRICT" && (
        <div className="reroll-container mt-6 flex justify-center">
          <button
            onClick={handleReroll}
            disabled={state.rerollsLeft <= 0 || state.isRolling}
            className={`clip-corner flex items-center gap-2 border px-6 py-3 text-sm font-bold uppercase tracking-wider transition ${state.rerollsLeft <= 0 || state.isRolling
                ? "border-muted-foreground/30 bg-muted/5 text-muted-foreground cursor-not-allowed"
                : "border-primary bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer"
              }`}
          >
            <RefreshCw className={`w-4 h-4 ${state.isRolling ? "animate-spin" : ""}`} />
            {t("rerollBtn")} ({t("rerollsCounter")}: {state.rerollsLeft}/3)
          </button>
        </div>
      )}

      <p className="mt-4 text-center text-[10px] text-muted-foreground font-sans">
        {t("draftLocksRosterText")}{" "}
        <span className="text-primary font-bold">
          {team.displayName}
        </span>
        .
      </p>
    </motion.div>
  );
}
