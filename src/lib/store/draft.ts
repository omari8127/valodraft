import { create } from "zustand";
import type {
  CoachEntry,
  GameModeId,
  PlayerEntry,
  PlayerRole,
  Roster,
  RosterSlot,
  SlotRole,
  TeamEntry,
  CompositionMode,
  PresetType,
} from "@/types/game";
import { TEAM_ENTRIES, PLAYER_BY_ID, COACH_BY_ID } from "@/data/generate";
import { GAME_MODE_BY_ID } from "@/data/tournaments";

interface DraftState {
  modeId: GameModeId | null;
  compositionMode: CompositionMode;
  presetType: PresetType | null;
  pool: TeamEntry[]; // current mode's entries minus locked
  lockedTeamEntryIds: Set<string>;
  lockedRoles: SlotRole[]; // Legacy sync
  roster: Roster;
  currentSlotIdx: number;
  isRolling: boolean;
  rollSelectedTeam: TeamEntry | null;
  rollResultTeam: TeamEntry | null;

  startDraft: (
    modeId: GameModeId,
    compositionMode: CompositionMode,
    presetType: PresetType | null
  ) => void;
  startRoll: () => void;
  finishRoll: () => void;
  pickPlayer: (player: PlayerEntry, team: TeamEntry) => void;
  pickCoach: (coach: CoachEntry, team: TeamEntry) => void;
  reset: () => void;
}

function emptyRoster(slots: RosterSlot[]): Roster {
  return { slots };
}

export function getSlotsForComposition(
  compositionMode: CompositionMode,
  presetType: PresetType | null
): RosterSlot[] {
  let playerRoles: SlotRole[] = [];
  if (compositionMode === "STRICT") {
    playerRoles = ["DUELIST", "INITIATOR", "CONTROLLER", "SENTINEL", "FLEX"];
  } else if (compositionMode === "PRESET") {
    switch (presetType) {
      case "DOUBLE_DUELIST":
        playerRoles = ["DUELIST", "DUELIST", "INITIATOR", "CONTROLLER", "SENTINEL"];
        break;
      case "DOUBLE_CONTROLLER":
        playerRoles = ["DUELIST", "INITIATOR", "CONTROLLER", "CONTROLLER", "SENTINEL"];
        break;
      case "DOUBLE_INITIATOR":
        playerRoles = ["DUELIST", "INITIATOR", "INITIATOR", "CONTROLLER", "SENTINEL"];
        break;
      case "NO_SENTINEL":
        playerRoles = ["DUELIST", "INITIATOR", "CONTROLLER", "FLEX", "FLEX"];
        break;
      case "STANDARD":
      default:
        playerRoles = ["DUELIST", "INITIATOR", "CONTROLLER", "SENTINEL", "FLEX"];
        break;
    }
  } else {
    // CUSTOM mode
    playerRoles = ["FLEX", "FLEX", "FLEX", "FLEX", "FLEX"];
  }
  return ([...playerRoles, "COACH"] as SlotRole[]).map((role) => ({
    role,
    playerId: null,
    teamEntryId: null,
  }));
}

export function canPickPlayer(
  player: PlayerEntry,
  roster: Roster,
  compositionMode: CompositionMode,
  presetType: PresetType | null
): boolean {
  // Check if player is already drafted
  if (roster.slots.some((s) => s.playerId === player.id)) {
    return false;
  }

  const draftedPlayers = roster.slots
    .filter((s) => s.playerId)
    .map((s) => PLAYER_BY_ID[s.playerId!])
    .filter(Boolean);

  if (compositionMode === "CUSTOM") {
    // Limits: Max 2 Duelists, Max 2 Controllers
    if (player.primaryRole === "DUELIST") {
      const duelistsCount = draftedPlayers.filter((p) => p.primaryRole === "DUELIST").length;
      if (duelistsCount >= 2) return false;
    }
    if (player.primaryRole === "CONTROLLER") {
      const controllersCount = draftedPlayers.filter((p) => p.primaryRole === "CONTROLLER").length;
      if (controllersCount >= 2) return false;
    }
    // Must have an empty player slot
    return roster.slots.some((s) => s.role !== "COACH" && !s.playerId);
  }

  // STRICT or PRESET modes:
  // Find if there is an empty slot that can accommodate this player
  const emptySlots = roster.slots.filter((s) => s.role !== "COACH" && !s.playerId);
  const canFit = emptySlots.some(
    (s) =>
      s.role === player.primaryRole ||
      (player.secondaryRole && s.role === player.secondaryRole) ||
      s.role === "FLEX"
  );

  return canFit;
}

export function calculateAIPickWeight(p: PlayerEntry, roster: Roster): number {
  const draftedPlayers = roster.slots
    .filter((s) => s.playerId)
    .map((s) => PLAYER_BY_ID[s.playerId!])
    .filter(Boolean);

  const round = draftedPlayers.length + 1; // 1 to 5

  const OVR = p.rating;

  // Role fit priority calculation
  let roleFit = 0;
  const hasSentinel = draftedPlayers.some((dp) => dp.primaryRole === "SENTINEL");
  const hasController = draftedPlayers.some((dp) => dp.primaryRole === "CONTROLLER");
  const hasInitiator = draftedPlayers.some((dp) => dp.primaryRole === "INITIATOR");

  if (!hasSentinel && p.primaryRole === "SENTINEL") {
    roleFit += 30;
  }
  if (!hasController && p.primaryRole === "CONTROLLER") {
    roleFit += 25;
  }
  if (!hasInitiator && p.primaryRole === "INITIATOR") {
    roleFit += 20;
  }

  // Advanced AI Decision logic: EARLY vs MID vs LATE DRAFT
  let priority = 0;
  if (round <= 2) {
    priority = OVR * 0.8 + roleFit * 0.2;
  } else if (round <= 4) {
    priority = OVR * 0.6 + roleFit * 0.4;
  } else {
    // round >= 5
    priority = OVR * 0.4 + roleFit * 0.6;
  }

  return priority;
}

export function getAIRecPlayer(
  team: TeamEntry,
  roster: Roster,
  compositionMode: CompositionMode,
  presetType: PresetType | null
): PlayerEntry | CoachEntry | null {
  const currentSlot = roster.slots.find((s) => !s.playerId && !s.coachId);
  if (currentSlot?.role === "COACH") {
    return team.coach;
  }

  const pickablePlayers = team.players.filter((p) =>
    canPickPlayer(p, roster, compositionMode, presetType)
  );
  if (pickablePlayers.length === 0) return null;

  let bestPlayer = pickablePlayers[0];
  let maxWeight = -1;
  for (const p of pickablePlayers) {
    const weight = calculateAIPickWeight(p, roster);
    if (weight > maxWeight) {
      maxWeight = weight;
      bestPlayer = p;
    }
  }
  return bestPlayer;
}

export function poolForMode(modeId: GameModeId): TeamEntry[] {
  const mode = GAME_MODE_BY_ID[modeId];
  if (!mode) return [];
  const set = new Set(mode.tournamentIds);
  return TEAM_ENTRIES.filter((t) => set.has(t.tournamentId));
}

export const useDraft = create<DraftState>((set, get) => ({
  modeId: null,
  compositionMode: "STRICT",
  presetType: null,
  pool: [],
  lockedTeamEntryIds: new Set(),
  lockedRoles: [],
  roster: emptyRoster([]),
  currentSlotIdx: 0,
  isRolling: false,
  rollSelectedTeam: null,
  rollResultTeam: null,

  startDraft: (modeId, compositionMode, presetType) => {
    const slots = getSlotsForComposition(compositionMode, presetType);
    set({
      modeId,
      compositionMode,
      presetType,
      pool: poolForMode(modeId),
      lockedTeamEntryIds: new Set(),
      lockedRoles: [],
      roster: emptyRoster(slots),
      currentSlotIdx: 0,
      isRolling: false,
      rollSelectedTeam: null,
      rollResultTeam: null,
    });
  },

  startRoll: () => {
    const { pool, lockedTeamEntryIds, roster, currentSlotIdx, compositionMode, presetType } = get();
    const currentRole = roster.slots[currentSlotIdx]?.role;
    if (!currentRole) return;

    // Filter teams that have at least one pickable player
    const available = pool.filter((t) => {
      if (lockedTeamEntryIds.has(t.id)) return false;
      if (currentRole === "COACH") {
        return !roster.slots.some((s) => s.role === "COACH" && s.coachId);
      }
      return t.players.some((p) => canPickPlayer(p, roster, compositionMode, presetType));
    });

    if (available.length === 0) return;

    // Calculate AI-based weights for each available team
    const teamWeights = available.map((team) => {
      const pickablePlayers = team.players.filter((p) =>
        canPickPlayer(p, roster, compositionMode, presetType)
      );
      if (pickablePlayers.length === 0) return 0.1;
      const maxPlayerWeight = Math.max(...pickablePlayers.map((p) => calculateAIPickWeight(p, roster)));
      return maxPlayerWeight;
    });

    // Select team using weighted random selection
    const totalWeight = teamWeights.reduce((s, w) => s + w, 0);
    let rng = Math.random() * totalWeight;
    let selectedIdx = 0;
    for (let i = 0; i < available.length; i++) {
      rng -= teamWeights[i];
      if (rng <= 0) {
        selectedIdx = i;
        break;
      }
    }

    const winner = available[selectedIdx];
    console.log("[Roll] Selected team:", winner.orgId, winner.tournamentId, "| id:", winner.id);
    set({ isRolling: true, rollSelectedTeam: winner, rollResultTeam: null });
  },

  finishRoll: () => {
    const { rollSelectedTeam } = get();
    set({ isRolling: false, rollResultTeam: rollSelectedTeam });
  },

  pickPlayer: (player, team) => {
    const { roster, lockedTeamEntryIds, compositionMode, presetType } = get();

    // Find the correct target slot using composition rules
    let targetIdx = -1;
    if (compositionMode === "CUSTOM") {
      targetIdx = roster.slots.findIndex((s) => s.role !== "COACH" && !s.playerId);
    } else {
      // Find empty slot with player's primary role
      targetIdx = roster.slots.findIndex(
        (s) => s.role === player.primaryRole && !s.playerId && !s.coachId
      );
      // Fallback: secondary role
      if (targetIdx === -1 && player.secondaryRole) {
        targetIdx = roster.slots.findIndex(
          (s) => s.role === player.secondaryRole && !s.playerId && !s.coachId
        );
      }
      // Fallback: FLEX
      if (targetIdx === -1) {
        targetIdx = roster.slots.findIndex((s) => s.role === "FLEX" && !s.playerId && !s.coachId);
      }
    }

    if (targetIdx === -1) return;

    const newSlots = roster.slots.map((s, i) =>
      i === targetIdx ? { ...s, playerId: player.id, teamEntryId: team.id } : s
    );

    const newLocked = new Set(lockedTeamEntryIds);
    newLocked.add(team.id);

    // Update legacy lockedRoles
    const { lockedRoles } = get();
    const newLockedRoles = [...lockedRoles];
    if (!newLockedRoles.includes(player.primaryRole)) {
      newLockedRoles.push(player.primaryRole);
    }

    const nextSlotIdx = newSlots.findIndex((s) => !s.playerId && !s.coachId);

    set({
      roster: { slots: newSlots },
      lockedTeamEntryIds: newLocked,
      lockedRoles: newLockedRoles,
      currentSlotIdx: nextSlotIdx === -1 ? roster.slots.length : nextSlotIdx,
      rollResultTeam: null,
    });
  },

  pickCoach: (coach, team) => {
    const { roster, lockedTeamEntryIds } = get();

    const targetIdx = roster.slots.findIndex((s) => s.role === "COACH" && !s.coachId);
    if (targetIdx === -1) return;

    const newSlots = roster.slots.map((s, i) =>
      i === targetIdx ? { ...s, playerId: null, coachId: coach.id, teamEntryId: team.id } : s
    );

    const newLocked = new Set(lockedTeamEntryIds);
    newLocked.add(team.id);

    const { lockedRoles } = get();
    const newLockedRoles = [...lockedRoles];
    if (!newLockedRoles.includes("COACH")) {
      newLockedRoles.push("COACH");
    }

    const nextSlotIdx = newSlots.findIndex((s) => !s.playerId && !s.coachId);

    set({
      roster: { slots: newSlots },
      lockedTeamEntryIds: newLocked,
      lockedRoles: newLockedRoles,
      currentSlotIdx: nextSlotIdx === -1 ? roster.slots.length : nextSlotIdx,
      rollResultTeam: null,
    });
  },

  reset: () =>
    set({
      modeId: null,
      compositionMode: "STRICT",
      presetType: null,
      pool: [],
      lockedTeamEntryIds: new Set(),
      lockedRoles: [],
      roster: emptyRoster([]),
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
    if (locked.has(t.id)) return false;
    if (role === "COACH") return !lockedRoles.includes("COACH");
    return t.players.some(
      (p) =>
        (p.primaryRole === (role as PlayerRole) || p.secondaryRole === (role as PlayerRole)) &&
        !lockedRoles.includes(p.primaryRole)
    );
  });
}
