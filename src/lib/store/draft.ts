import { create } from "zustand";
import type {
  CoachEntry,
  GameModeId,
  PlayerEntry,
  PlayerRole,
  Roster,
  SlotRole,
  TeamEntry,
} from "@/types/game";
import { DRAFT_ORDER } from "@/types/game";
import { TEAM_ENTRIES } from "@/data/generate";
import { GAME_MODE_BY_ID, TOURNAMENT_BY_ID } from "@/data/tournaments";

interface DraftState {
  modeId: GameModeId | null;
  pool: TeamEntry[]; // current mode's entries minus locked
  lockedTeamEntryIds: Set<string>;
  lockedRoles: SlotRole[];
  roster: Roster;
  currentSlotIdx: number;
  isRolling: boolean;
  /** The team randomly selected at the moment Roll is clicked — single source of truth */
  rollSelectedTeam: TeamEntry | null;
  rollResultTeam: TeamEntry | null;

  startDraft: (modeId: GameModeId) => void;
  startRoll: () => void;
  finishRoll: () => void;
  pickPlayer: (player: PlayerEntry, team: TeamEntry) => void;
  pickCoach: (coach: CoachEntry, team: TeamEntry) => void;
  reset: () => void;
}

function emptyRoster(): Roster {
  return {
    slots: DRAFT_ORDER.map((role) => ({ role, playerId: null, teamEntryId: null })),
  };
}

export function poolForMode(modeId: GameModeId): TeamEntry[] {
  const mode = GAME_MODE_BY_ID[modeId];
  if (!mode) return [];
  const set = new Set(mode.tournamentIds);
  return TEAM_ENTRIES.filter((t) => set.has(t.tournamentId));
}

export const useDraft = create<DraftState>((set, get) => ({
  modeId: null,
  pool: [],
  lockedTeamEntryIds: new Set(),
  lockedRoles: [],
  roster: emptyRoster(),
  currentSlotIdx: 0,
  isRolling: false,
  rollSelectedTeam: null,
  rollResultTeam: null,

  startDraft: (modeId) =>
    set({
      modeId,
      pool: poolForMode(modeId),
      lockedTeamEntryIds: new Set(),
      lockedRoles: [],
      roster: emptyRoster(),
      currentSlotIdx: 0,
      isRolling: false,
      rollSelectedTeam: null,
      rollResultTeam: null,
    }),

  startRoll: () => {
    const { pool, lockedTeamEntryIds, roster, currentSlotIdx, lockedRoles } = get();
    const currentRole = roster.slots[currentSlotIdx]?.role;
    // Pick ONE random team RIGHT NOW from the live authoritative state
    const available = availableTeamsForRole(pool, lockedTeamEntryIds, currentRole ?? "DUELIST", lockedRoles);
    if (available.length === 0) return;
    const winner = available[Math.floor(Math.random() * available.length)];
    console.log("[Roll] Selected team:", winner.orgId, winner.tournamentId, "| id:", winner.id);
    set({ isRolling: true, rollSelectedTeam: winner, rollResultTeam: null });
  },

  // Animation is done — move rollSelectedTeam → rollResultTeam (no new random pick)
  finishRoll: () => {
    const { rollSelectedTeam } = get();
    console.log(
      "[Roll] Finishing roll with:",
      rollSelectedTeam?.orgId,
      rollSelectedTeam?.tournamentId,
    );
    set({ isRolling: false, rollResultTeam: rollSelectedTeam });
  },

  pickPlayer: (player, team) => {
    const { roster, lockedTeamEntryIds } = get();

    // Find slot with player.primaryRole that is empty
    let targetIdx = roster.slots.findIndex(
      (s) => s.role === player.primaryRole && !s.playerId && !s.coachId,
    );
    // If not found, check if slot with player.secondaryRole is empty
    if (targetIdx === -1 && player.secondaryRole) {
      targetIdx = roster.slots.findIndex(
        (s) => s.role === player.secondaryRole && !s.playerId && !s.coachId,
      );
    }
    // If not found, check if "FLEX" slot is empty
    if (targetIdx === -1) {
      targetIdx = roster.slots.findIndex((s) => s.role === "FLEX" && !s.playerId && !s.coachId);
    }

    if (targetIdx === -1) return; // Ignore if no matching empty slot exists

    const newSlots = roster.slots.map((s, i) =>
      i === targetIdx ? { ...s, playerId: player.id, teamEntryId: team.id } : s,
    );

    const newLocked = new Set(lockedTeamEntryIds);
    newLocked.add(team.id);

    const { lockedRoles } = get();
    const newLockedRoles = [...lockedRoles];
    if (!newLockedRoles.includes(player.primaryRole)) {
      newLockedRoles.push(player.primaryRole);
    }

    // Next slot is the first empty slot
    const nextSlotIdx = newSlots.findIndex((s) => !s.playerId && !s.coachId);

    set({
      roster: { slots: newSlots },
      lockedTeamEntryIds: newLocked,
      lockedRoles: newLockedRoles,
      currentSlotIdx: nextSlotIdx === -1 ? DRAFT_ORDER.length : nextSlotIdx,
      rollResultTeam: null,
    });
  },

  pickCoach: (coach, team) => {
    const { roster, lockedTeamEntryIds } = get();

    const targetIdx = roster.slots.findIndex((s) => s.role === "COACH" && !s.coachId);

    if (targetIdx === -1) return; // Ignore if coach slot is already filled

    const newSlots = roster.slots.map((s, i) =>
      i === targetIdx ? { ...s, playerId: null, coachId: coach.id, teamEntryId: team.id } : s,
    );

    const newLocked = new Set(lockedTeamEntryIds);
    newLocked.add(team.id);

    const { lockedRoles } = get();
    const newLockedRoles = [...lockedRoles];
    if (!newLockedRoles.includes("COACH")) {
      newLockedRoles.push("COACH");
    }

    // Next slot is the first empty slot
    const nextSlotIdx = newSlots.findIndex((s) => !s.playerId && !s.coachId);

    set({
      roster: { slots: newSlots },
      lockedTeamEntryIds: newLocked,
      lockedRoles: newLockedRoles,
      currentSlotIdx: nextSlotIdx === -1 ? DRAFT_ORDER.length : nextSlotIdx,
      rollResultTeam: null,
    });
  },

  reset: () =>
    set({
      modeId: null,
      pool: [],
      lockedTeamEntryIds: new Set(),
      lockedRoles: [],
      roster: emptyRoster(),
      currentSlotIdx: 0,
      isRolling: false,
      rollSelectedTeam: null,
      rollResultTeam: null,
    }),
}));

export function availableTeamsForRole(
  pool: TeamEntry[],
  locked: Set<string>,
  role: SlotRole,
  lockedRoles: SlotRole[]
): TeamEntry[] {
  return pool.filter((t) => {
    // 1. Strict Team Lock (team.id -> org-tournament)
    if (locked.has(t.id)) return false;

    // 2. Role Requirement
    if (role === "COACH") {
      return !lockedRoles.includes("COACH");
    }
    
    // Check if the team has at least one player whose primary or secondary role matches the current drafting role,
    // AND that player's primaryRole is not already locked.
    return t.players.some(
      (p) =>
        (p.primaryRole === (role as PlayerRole) || p.secondaryRole === (role as PlayerRole)) &&
        !lockedRoles.includes(p.primaryRole)
    );
  });
}
