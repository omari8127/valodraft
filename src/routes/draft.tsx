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
  const [activeTab, setActiveTab] = useState<"spin" | "roster">("spin");
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

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
          <div className="clip-corner bg-surface border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
            Roster:{" "}
            <span className="font-display text-base text-gold">
              {draftedPlayers.length + (drafted_coach ? 1 : 0)}/{state.roster.slots.length}
            </span>
          </div>
        </div>

        {/* Mobile view (< lg) */}
        <div className="block lg:hidden space-y-6">
          {/* OVR and Chemistry Card */}
          <div className="clip-corner border border-border bg-surface/70 p-4 flex justify-between items-center backdrop-blur">
            <div>
              <div className="font-display text-5xl text-gold flex items-baseline gap-1">
                {ovr}
                <span className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  / 99 OVR
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-foreground/90">
                <Flame className="w-4 h-4 text-primary fill-primary" />
                Chemistry: +{chemistry.total} pts
              </div>
            </div>
            <div className="clip-corner bg-background/80 border border-border px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              SQUAD
            </div>
          </div>

          {/* Composition Ratios */}
          <RosterCompositionStats players={draftedPlayers} draftMode={state.draftMode} />

          {/* TABS */}
          <div className="grid grid-cols-2 border border-border bg-surface/40 p-1 clip-corner">
            <button
              onClick={() => setActiveTab("spin")}
              className={`clip-corner py-3 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "spin"
                  ? "bg-gold text-background shadow-md animate-none"
                  : "text-foreground hover:bg-surface-2"
              }`}
            >
              🎰 SPIN DE CAMPEONES
            </button>
            <button
              onClick={() => setActiveTab("roster")}
              className={`clip-corner py-3 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "roster"
                  ? "bg-gold text-background shadow-md"
                  : "text-foreground hover:bg-surface-2"
              }`}
            >
              Roster ({draftedPlayers.length + (drafted_coach ? 1 : 0)}/{state.roster.slots.length}) 🛡️
            </button>
          </div>

          {/* Tab contents */}
          <div className="space-y-6">
            {activeTab === "spin" ? (
              <>
                {!isDone && !state.rollResultTeam && !state.isRolling && (
                  <div className="clip-corner border border-border bg-surface/70 p-6 text-center backdrop-blur">
                    <div className="font-display text-xl font-bold">{t("readyNextRoll")}</div>
                    <p className="mt-1.5 text-xs text-muted-foreground font-sans">
                      {t("rollInfoText")}{" "}
                      <span className="font-bold text-primary">{currentSlot.role}</span>.
                    </p>
                    <button
                      onClick={state.startRoll}
                      className="clip-corner mt-4 inline-flex items-center gap-3 bg-primary px-6 py-3 font-display text-base tracking-widest text-primary-foreground transition hover:brightness-110 cursor-pointer font-bold"
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

                {state.rollResultTeam && (
                  <TeamExpansion
                    team={state.rollResultTeam}
                    role={currentSlot.role}
                    draftedPlayers={draftedPlayers}
                    coach={drafted_coach}
                    currentOVR={ovr}
                    onPickPlayer={(p) => {
                      pickPlayerFromTeam(p, state.rollResultTeam!);
                      setActiveTab("spin");
                    }}
                    onPickCoach={(c) => {
                      pickCoachFromTeam(c, state.rollResultTeam!);
                      setActiveTab("spin");
                    }}
                    onHoverRole={setHoveredRole}
                  />
                )}

                {isDone && (
                  <div className="clip-corner border border-primary/60 bg-surface/70 p-6 text-center backdrop-blur">
                    <div className="font-display text-2xl text-primary font-bold">{t("rosterLocked")}</div>
                    <p className="mt-1.5 text-xs text-muted-foreground font-sans">
                      {t("rosterReadyText")}
                    </p>
                    <div className="mt-5 flex flex-col gap-2.5">
                      <button
                        onClick={finishAndGoMatch}
                        className="clip-corner bg-primary w-full py-4 font-display text-lg tracking-widest text-primary-foreground transition hover:brightness-110 cursor-pointer font-bold"
                      >
                        {t("playMatch")}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <RosterPanel roster={state.roster} currentIdx={state.currentSlotIdx} hoveredRole={hoveredRole} />
            )}
          </div>
        </div>

        {/* Desktop view (>= lg) */}
        <div className="hidden lg:block">
          {/* Roster row */}
          <RosterPanel roster={state.roster} currentIdx={state.currentSlotIdx} hoveredRole={hoveredRole} />

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6 min-w-0">
              {!isDone && !state.rollResultTeam && !state.isRolling && (
                <div className="clip-corner border border-border bg-surface/70 p-8 text-center backdrop-blur">
                  <div className="font-display text-2xl font-bold">{t("readyNextRoll")}</div>
                  <p className="mt-2 text-sm text-muted-foreground font-sans">
                    {t("rollInfoText")}{" "}
                    <span className="font-bold text-primary">{currentSlot.role}</span>.
                  </p>
                  <button
                    onClick={state.startRoll}
                    className="clip-corner mt-6 inline-flex items-center gap-3 bg-primary px-8 py-4 font-display text-lg tracking-widest text-primary-foreground transition hover:brightness-110 cursor-pointer font-bold"
                  >
                    {t("rollBtn")} {currentSlot.role}
                  </button>
                </div>
              )}

              {state.isRolling && state.rollSelectedTeam && !state.rollResultTeam && (
                <TeamRoll
                  pool={state.pool}
                  locked={state.lockedTeamEntryIds}
                  lockedRoles={[]}
                  role={currentSlot.role}
                  selectedTeam={state.rollSelectedTeam}
                  onComplete={onRollComplete}
                />
              )}

              {state.rollResultTeam && (
                <TeamExpansion
                  team={state.rollResultTeam}
                  role={currentSlot.role}
                  draftedPlayers={draftedPlayers}
                  coach={drafted_coach}
                  currentOVR={ovr}
                  onPickPlayer={(p) => pickPlayerFromTeam(p, state.rollResultTeam!)}
                  onPickCoach={(c) => pickCoachFromTeam(c, state.rollResultTeam!)}
                  onHoverRole={setHoveredRole}
                />
              )}

              {isDone && (
                <div className="clip-corner border border-primary/60 bg-surface/70 p-8 text-center backdrop-blur">
                  <div className="font-display text-3xl text-primary font-bold">{t("rosterLocked")}</div>
                  <p className="mt-2 text-sm text-muted-foreground font-sans">
                    {t("rosterReadyText")}
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={finishAndGoMatch}
                      className="clip-corner bg-primary px-10 py-5 font-display text-xl tracking-widest text-primary-foreground transition hover:brightness-110 cursor-pointer w-full max-w-sm font-bold"
                    >
                      {t("playMatch")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <ChemistryPanel chemistry={chemistry} ovr={ovr} />
              <RosterCompositionStats players={draftedPlayers} draftMode={state.draftMode} />

              <div className="clip-corner border border-border bg-surface/60 p-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {t("draftOrderLabel")}
                </div>
                <ol className="mt-2 space-y-1">
                  {state.roster.slots.map((s, i) => (
                    <li
                      key={i}
                      className={`flex items-center justify-between text-xs ${
                        i === state.currentSlotIdx
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
            </aside>
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
      className={`clip-corner border border-primary/60 bg-surface/70 p-4 sm:p-6 backdrop-blur transition-all ${
        rerollShake ? "animate-card-shake" : ""
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
                      className={`font-bold px-1 py-0.2 rounded ${
                        (p.form ?? 0) > 0
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
            className={`clip-corner flex items-center gap-2 border px-6 py-3 text-sm font-bold uppercase tracking-wider transition ${
              state.rerollsLeft <= 0 || state.isRolling
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
