import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDraft } from "@/lib/store/draft";
import { DRAFT_ORDER } from "@/types/game";
import type { CoachEntry, PlayerEntry, TeamEntry } from "@/types/game";
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
import { Flame } from "lucide-react";

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

function DraftPage() {
  const navigate = useNavigate();
  const state = useDraft();
  const [rollSession, setRollSession] = useState(0);
  const [activeTab, setActiveTab] = useState<"spin" | "roster">("spin");
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  const currentSlot = state.roster.slots[state.currentSlotIdx];
  const isDone = state.currentSlotIdx >= DRAFT_ORDER.length;

  // Compute live OVR/chem
  const draftedPlayers: PlayerEntry[] = state.roster.slots
    .filter((s) => s.role !== "COACH" && s.playerId)
    .map((s) => PLAYER_BY_ID[s.playerId!])
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
    () => computeTeamOVR(draftedPlayers, drafted_coach),
    [draftedPlayers, drafted_coach],
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
          Pick a mode
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
    // Save dynasty
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
    };
    useDynasty.getState().addSave(save);
    navigate({ to: "/match", search: { saveId: save.id } });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Top Header */}
      <div className="mb-6 flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h1 className="font-display text-xl sm:text-3xl leading-none">WORLDS CHALLENGE</h1>
          <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary mt-1">
            DRAFTEANDO LEYENDAS
          </div>
        </div>
        <div className="clip-corner bg-surface border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
          Alineación:{" "}
          <span className="font-display text-base text-gold">
            {draftedPlayers.length + (drafted_coach ? 1 : 0)}/6
          </span>
        </div>
      </div>

      {/* Mobile view (< lg) */}
      <div className="block lg:hidden space-y-6">
        {/* 1. OVR and Chemistry Card */}
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
              Química Total: +{chemistry.total} pts
            </div>
          </div>
          <div className="clip-corner bg-background/80 border border-border px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            SQUAD
          </div>
        </div>

        {/* 2. BONUS DE SINERGIAS */}
        <div className="clip-corner border border-border bg-surface/70 p-5 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
              <span className="text-gold">⭐</span> BONUS DE SINERGIAS
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-background/50 border border-border px-2.5 py-1 rounded">
              ℹ️ VER REGLAS DE QUÍMICA
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "MISMA REGIÓN", value: chemistry.region, sub: "+2 por par" },
              { label: "MISMO ROSTER", value: chemistry.organization, sub: "+3 por par" },
              { label: "MISMA NACIONALIDAD", value: chemistry.nationality, sub: "+1 por par" },
              { label: "EQUIPO HISTÓRICO", value: chemistry.fullOrg, sub: "+10 completo" },
              {
                label: "COACH BONUS",
                value: chemistry.coachOrg + chemistry.coachRegion,
                sub: "+2 Org / +1 Reg",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="clip-corner border border-border/60 bg-background/40 p-3 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                    {item.label}
                  </div>
                  <div className="mt-2 font-display text-2xl text-gold">+{item.value}</div>
                </div>
                <div className="mt-1 text-[8px] font-medium uppercase tracking-widest text-muted-foreground/60">
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. TABS (Spin de campeones | Mi Roster) */}
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
                ? "bg-gold text-background shadow-md animate-none"
                : "text-foreground hover:bg-surface-2"
            }`}
          >
            Mi Roster ({draftedPlayers.length + (drafted_coach ? 1 : 0)}/6) 🛡️
          </button>
        </div>

        {/* 4. Tab contents */}
        <div className="space-y-6">
          {activeTab === "spin" ? (
            <>
              {!isDone && !state.rollResultTeam && !state.isRolling && (
                <div className="clip-corner border border-border bg-surface/70 p-6 text-center backdrop-blur">
                  <div className="font-display text-xl">Ready for the next roll</div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    A random team from your active pool will be selected for{" "}
                    <span className="font-bold text-primary">{currentSlot.role}</span>.
                  </p>
                  <button
                    onClick={state.startRoll}
                    className="clip-corner mt-4 inline-flex items-center gap-3 bg-primary px-6 py-3 font-display text-base tracking-widest text-primary-foreground transition hover:brightness-110 cursor-pointer"
                  >
                    ROLL {currentSlot.role}
                  </button>
                </div>
              )}

              {state.isRolling && state.rollSelectedTeam && !state.rollResultTeam && (
                <div className="w-full overflow-hidden">
                  <TeamRoll
                    key={rollSession}
                    pool={state.pool}
                    locked={state.lockedTeamEntryIds}
                    lockedRoles={state.lockedRoles}
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
                  <div className="font-display text-2xl text-primary">ROSTER LOCKED</div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Your team is ready. Test them against the field.
                  </p>
                  <div className="mt-5 flex flex-col gap-2.5">
                    <button
                      onClick={finishAndGoMatch}
                      className="clip-corner bg-primary w-full py-4 font-display text-lg tracking-widest text-primary-foreground transition hover:brightness-110 cursor-pointer"
                    >
                      PLAY MATCH
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
                <div className="font-display text-2xl">Ready for the next roll</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  A random team from your active pool will be selected for{" "}
                  <span className="font-bold text-primary">{currentSlot.role}</span>.
                </p>
                <button
                  onClick={state.startRoll}
                  className="clip-corner mt-6 inline-flex items-center gap-3 bg-primary px-8 py-4 font-display text-lg tracking-widest text-primary-foreground transition hover:brightness-110 cursor-pointer"
                >
                  ROLL {currentSlot.role}
                </button>
              </div>
            )}

            {state.isRolling && state.rollSelectedTeam && !state.rollResultTeam && (
              <TeamRoll
                pool={state.pool}
                locked={state.lockedTeamEntryIds}
                lockedRoles={state.lockedRoles}
                role={currentSlot.role}
                selectedTeam={state.rollSelectedTeam}
                onComplete={onRollComplete}
              />
            )}

            {state.rollResultTeam && (
              <TeamExpansion
                team={state.rollResultTeam}
                role={currentSlot.role}
                onPickPlayer={(p) => pickPlayerFromTeam(p, state.rollResultTeam!)}
                onPickCoach={(c) => pickCoachFromTeam(c, state.rollResultTeam!)}
                onHoverRole={setHoveredRole}
              />
            )}

            {isDone && (
              <div className="clip-corner border border-primary/60 bg-surface/70 p-8 text-center backdrop-blur">
                <div className="font-display text-3xl text-primary">ROSTER LOCKED</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your team is ready. Test them against the field.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={finishAndGoMatch}
                    className="clip-corner bg-primary px-10 py-5 font-display text-xl tracking-widest text-primary-foreground transition hover:brightness-110 cursor-pointer w-full max-w-sm"
                  >
                    PLAY MATCH
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <ChemistryPanel chemistry={chemistry} ovr={ovr} />
            <div className="clip-corner border border-border bg-surface/60 p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Draft order
              </div>
              <ol className="mt-2 space-y-1">
                {DRAFT_ORDER.map((r, i) => (
                  <li
                    key={r}
                    className={`flex items-center justify-between text-xs ${
                      i === state.currentSlotIdx
                        ? "text-primary"
                        : i < state.currentSlotIdx
                          ? "text-muted-foreground line-through"
                          : "text-foreground/80"
                    }`}
                  >
                    <span>
                      {String(i + 1).padStart(2, "0")} · {r}
                    </span>
                    {i === state.currentSlotIdx && <span>← NOW</span>}
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function TeamExpansion({
  team,
  role,
  onPickPlayer,
  onPickCoach,
  onHoverRole,
}: {
  team: TeamEntry;
  role: (typeof DRAFT_ORDER)[number];
  onPickPlayer: (p: PlayerEntry) => void;
  onPickCoach: (c: CoachEntry) => void;
  onHoverRole?: (role: string | null) => void;
}) {
  const org = ORG_BY_ID[team.orgId];
  const tour = TOURNAMENT_BY_ID[team.tournamentId];
  const state = useDraft();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="clip-corner border border-primary/60 bg-surface/70 p-4 sm:p-6 backdrop-blur"
    >
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            // {org?.name} {tour?.shortName} — Elige un miembro
          </div>
          <div className="mt-0.5 font-display text-xl sm:text-2xl">
            {org?.region} · {tour?.year} · <span className="text-gold">OVR {team.avgRating}</span>
          </div>
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hidden sm:block">
          Slot: <span className="text-primary">{role}</span>
        </div>
      </div>

      {/* All 6 members in a 3-col mini grid */}
      <div className="grid grid-cols-3 gap-2">
        {team.players.map((p) => {
          const disabled = state.lockedRoles.includes(p.role);
          return (
            <div
              key={p.id}
              className={disabled ? "opacity-30 pointer-events-none select-none" : ""}
            >
              <PlayerCard
                entity={p}
                mini
                onClick={disabled ? undefined : () => onPickPlayer(p)}
                onMouseEnter={() => onHoverRole?.(p.role)}
                onMouseLeave={() => onHoverRole?.(null)}
              />
            </div>
          );
        })}
        {(() => {
          const disabled = state.lockedRoles.includes("COACH");
          return (
            <div
              key={team.coach.id}
              className={disabled ? "opacity-30 pointer-events-none select-none" : ""}
            >
              <PlayerCard
                entity={team.coach}
                isCoach
                mini
                onClick={disabled ? undefined : () => onPickCoach(team.coach)}
                onMouseEnter={() => onHoverRole?.("COACH")}
                onMouseLeave={() => onHoverRole?.(null)}
              />
            </div>
          );
        })()}
      </div>

      <p className="mt-3 text-[10px] text-muted-foreground">
        Elige cualquiera — se bloqueará el roster completo de{" "}
        <span className="text-primary font-bold">
          {org?.shortName} {tour?.shortName}
        </span>
        .
      </p>
    </motion.div>
  );
}
