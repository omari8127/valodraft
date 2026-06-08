import { create } from "zustand";
import type {
  CoachEntry,
  GameModeId,
  PlayerEntry,
  Roster,
  RosterSlot,
  SlotRole,
  TeamEntry,
  DraftMode,
} from "@/types/game";
import { TEAM_ENTRIES, PLAYER_BY_ID, COACH_BY_ID } from "@/data/generate";
import { GAME_MODE_BY_ID } from "@/data/tournaments";
import { useProgression, getUnlockedYears, type GameDifficulty } from "./progression";
import { computeTeamOVR } from "../engine/ovr";

interface DraftState {
  modeId: GameModeId | null;
  draftMode: DraftMode;
  pool: TeamEntry[]; // current mode's entries filtered by level/unlocked years
  lockedTeamEntryIds: Set<string>;
  roster: Roster;
  currentSlotIdx: number;
  isRolling: boolean;
  rollSelectedTeam: TeamEntry | null;
  rollResultTeam: TeamEntry | null;
  rerollsLeft: number; // 3 max in STRICT mode
  baseRollRating: number | null; // Tracks the OVR of the first roll in a slot for balance checks

  startDraft: (modeId: GameModeId, draftMode: DraftMode) => void;
  startRoll: () => void;
  rerollCurrentTeam: () => void;
  finishRoll: () => void;
  pickPlayer: (player: PlayerEntry, team: TeamEntry) => void;
  pickCoach: (coach: CoachEntry, team: TeamEntry) => void;
  reset: () => void;
}

function emptyRoster(slots: RosterSlot[]): Roster {
  return { slots };
}

export function getSlotsForMode(): RosterSlot[] {
  const roles: SlotRole[] = ["DUELIST", "INITIATOR", "CONTROLLER", "SENTINEL", "FLEX", "COACH"];
  return roles.map((role) => ({
    role,
    playerId: null,
    teamEntryId: null,
  }));
}

/**
 * Strict validation function for drafting players.
 * Enforces missing Initiator locks on STRICT mode FLEX slots.
 */
export function canPickPlayer(
  player: PlayerEntry,
  team: Roster,
  slot: SlotRole,
  mode: DraftMode
): boolean {
  // Normalize player name for global uniqueness check (e.g. "Derke" from FNATIC 2021 vs FNATIC 2022)
  const normalizedName = player.name.toLowerCase().trim();
  const isDuplicatePlayer = team.slots.some((s) => {
    if (!s.playerId) return false;
    const draftedPlayer = PLAYER_BY_ID[s.playerId];
    return draftedPlayer && draftedPlayer.name.toLowerCase().trim() === normalizedName;
  });

  if (isDuplicatePlayer) {
    return false;
  }

  if (mode !== "STRICT") {
    if (slot === "COACH") return false;
    return true; // No restrictions in FLEXIBLE and CHAOS modes
  }

  // In STRICT mode:
  if (slot === "COACH") {
    return false;
  }

  if (slot === "FLEX") {
    // Retrieve currently drafted players
    const draftedPlayers = team.slots
      .filter((s) => s.playerId)
      .map((s) => PLAYER_BY_ID[s.playerId!])
      .filter(Boolean);

    const hasInitiator = draftedPlayers.some((p) => p.primaryRole === "INITIATOR");

    // 1. Missing Initiator Safeguard: If team lacks Initiator, FLEX slot can ONLY select Initiators.
    if (!hasInitiator) {
      return player.primaryRole === "INITIATOR";
    }

    // 2. Dual Duelist Check: FLEX slot allows Duelist only if exactly one Duelist already exists.
    const duelistCount = draftedPlayers.filter((p) => p.primaryRole === "DUELIST").length;
    return (
      player.primaryRole === "INITIATOR" ||
      (player.primaryRole === "DUELIST" && duelistCount === 1)
    );
  }

  // Non-FLEX slots require their matching roles
  return player.primaryRole === slot;
}

export function calculateAIPickWeight(
  p: PlayerEntry,
  team: TeamEntry,
  roster: Roster,
  difficulty: GameDifficulty,
  draftMode: DraftMode
): number {
  if (difficulty === "EASY") {
    return Math.random() * 100;
  }

  const currentSlot = roster.slots.find((s) => !s.playerId && !s.coachId);
  if (!currentSlot) return 0;

  const targetIdx = roster.slots.findIndex((s) => s.role === currentSlot.role && !s.playerId);
  if (targetIdx === -1) return 0;

  const tempSlots = roster.slots.map((s, idx) =>
    idx === targetIdx ? { ...s, playerId: p.id, playerWithForm: p } : s
  );
  const tempRosterPlayers = tempSlots
    .filter((s) => s.role !== "COACH" && s.playerId)
    .map((s) => s.playerWithForm ?? PLAYER_BY_ID[s.playerId!])
    .filter(Boolean);

  const coachSlot = roster.slots.find((s) => s.role === "COACH");
  const coach = coachSlot?.coachId ? COACH_BY_ID[coachSlot.coachId] : null;

  if (difficulty === "HARD") {
    const prospectiveOVR = computeTeamOVR(tempRosterPlayers, coach, draftMode);
    return prospectiveOVR;
  }

  // MEDIUM
  const baseOvr = p.rating + (p.form ?? 0);
  let roleFit = 0;
  const draftedPlayers = roster.slots
    .filter((s) => s.playerId)
    .map((s) => s.playerWithForm ?? PLAYER_BY_ID[s.playerId!])
    .filter(Boolean);

  const hasSentinel = draftedPlayers.some((dp) => dp.primaryRole === "SENTINEL");
  const hasController = draftedPlayers.some((dp) => dp.primaryRole === "CONTROLLER");
  const hasInitiator = draftedPlayers.some((dp) => dp.primaryRole === "INITIATOR");

  if (!hasSentinel && p.primaryRole === "SENTINEL") roleFit += 15;
  if (!hasController && p.primaryRole === "CONTROLLER") roleFit += 15;
  if (!hasInitiator && p.primaryRole === "INITIATOR") roleFit += 10;

  return baseOvr + roleFit;
}

export function getAIRecPlayer(
  team: TeamEntry,
  roster: Roster,
  draftMode: DraftMode,
  difficulty: GameDifficulty
): PlayerEntry | CoachEntry | null {
  const currentSlot = roster.slots.find((s) => !s.playerId && !s.coachId);
  if (!currentSlot) return null;

  if (currentSlot.role === "COACH") {
    return team.coach;
  }

  const pickablePlayers = team.players.filter((p) =>
    canPickPlayer(p, roster, currentSlot.role, draftMode)
  );
  if (pickablePlayers.length === 0) return null;

  let bestPlayer = pickablePlayers[0];
  let maxWeight = -Infinity;
  for (const p of pickablePlayers) {
    const weight = calculateAIPickWeight(p, team, roster, difficulty, draftMode);
    if (weight > maxWeight) {
      maxWeight = weight;
      bestPlayer = p;
    }
  }
  return bestPlayer;
}

export function poolForMode(modeId: GameModeId, unlockedYears: number[]): TeamEntry[] {
  const mode = GAME_MODE_BY_ID[modeId];
  if (!mode) return [];
  const set = new Set(mode.tournamentIds);
  return TEAM_ENTRIES.filter(
    (t) => set.has(t.tournamentId) && unlockedYears.includes(t.year)
  );
}

export const useDraft = create<DraftState>((set, get) => ({
  modeId: null,
  draftMode: "STRICT",
  pool: [],
  lockedTeamEntryIds: new Set(),
  roster: emptyRoster([]),
  currentSlotIdx: 0,
  isRolling: false,
  rollSelectedTeam: null,
  rollResultTeam: null,
  rerollsLeft: 3,
  baseRollRating: null,

  startDraft: (modeId, draftMode) => {
    const isRanked = useProgression.getState().rankedActive;
    // Classic mode -> all years unlocked; Ranked mode -> unlocked based on level
    const years = isRanked ? getUnlockedYears(useProgression.getState().level) : [2021, 2022, 2023, 2024, 2025];
    const slots = getSlotsForMode();
    set({
      modeId,
      draftMode,
      pool: poolForMode(modeId, years),
      lockedTeamEntryIds: new Set(),
      roster: emptyRoster(slots),
      currentSlotIdx: 0,
      isRolling: false,
      rollSelectedTeam: null,
      rollResultTeam: null,
      rerollsLeft: 3,
      baseRollRating: null,
    });
  },

  startRoll: () => {
    const { pool, lockedTeamEntryIds, roster, currentSlotIdx, draftMode } = get();
    const currentRole = roster.slots[currentSlotIdx]?.role;
    if (!currentRole) return;

    // Reset base roll rating for a new slot roll
    set({ baseRollRating: null });

    const available = pool.filter((t) => {
      if (lockedTeamEntryIds.has(t.id)) return false;
      if (currentRole === "COACH") {
        return !roster.slots.some((s) => s.role === "COACH" && s.coachId);
      }
      return t.players.some((p) => canPickPlayer(p, roster, currentRole, draftMode));
    });

    if (available.length === 0) return;

    const difficulty = useProgression.getState().difficulty;

    // Calculate AI weights
    const teamWeights = available.map((team) => {
      if (currentRole === "COACH") return 1.0;
      const pickablePlayers = team.players.filter((p) =>
        canPickPlayer(p, roster, currentRole, draftMode)
      );
      if (pickablePlayers.length === 0) return 0.1;
      const maxPlayerWeight = Math.max(
        ...pickablePlayers.map((p) => calculateAIPickWeight(p, team, roster, difficulty, draftMode))
      );
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
    const playersWithForm = winner.players.map((p) => ({
      ...p,
      form: Math.floor(Math.random() * 5) - 2, // -2 to +2 range
    }));
    const winnerWithForm = {
      ...winner,
      players: playersWithForm,
    };

    console.log("[Roll] Selected team:", winnerWithForm.displayName, "| OVR:", winnerWithForm.avgRating);
    set({
      isRolling: true,
      rollSelectedTeam: winnerWithForm,
      rollResultTeam: null,
      baseRollRating: winnerWithForm.avgRating, // Store initial roll rating for balanced reroll filter
    });
  },

  rerollCurrentTeam: () => {
    const { pool, lockedTeamEntryIds, roster, currentSlotIdx, draftMode, rerollsLeft, baseRollRating } = get();
    if (rerollsLeft <= 0 || draftMode !== "STRICT") return;

    const currentRole = roster.slots[currentSlotIdx]?.role;
    if (!currentRole) return;

    const available = pool.filter((t) => {
      if (lockedTeamEntryIds.has(t.id)) return false;
      if (currentRole === "COACH") {
        return !roster.slots.some((s) => s.role === "COACH" && s.coachId);
      }
      return t.players.some((p) => canPickPlayer(p, roster, currentRole, draftMode));
    });

    if (available.length === 0) return;

    // Reroll System Balance Safeguard: Filter teams to be within +/- 4 OVR of the first rolled team
    let filteredAvailable = available;
    if (baseRollRating !== null) {
      filteredAvailable = available.filter(
        (t) => Math.abs(t.avgRating - baseRollRating) <= 4
      );
      if (filteredAvailable.length === 0) {
        filteredAvailable = available; // Fallback to prevent soft-locks
      }
    }

    const difficulty = useProgression.getState().difficulty;

    // Calculate weights for filtered pool
    const teamWeights = filteredAvailable.map((team) => {
      if (currentRole === "COACH") return 1.0;
      const pickablePlayers = team.players.filter((p) =>
        canPickPlayer(p, roster, currentRole, draftMode)
      );
      if (pickablePlayers.length === 0) return 0.1;
      return Math.max(
        ...pickablePlayers.map((p) => calculateAIPickWeight(p, team, roster, difficulty, draftMode))
      );
    });

    const totalWeight = teamWeights.reduce((s, w) => s + w, 0);
    let rng = Math.random() * totalWeight;
    let selectedIdx = 0;
    for (let i = 0; i < filteredAvailable.length; i++) {
      rng -= teamWeights[i];
      if (rng <= 0) {
        selectedIdx = i;
        break;
      }
    }

    const winner = filteredAvailable[selectedIdx];
    const playersWithForm = winner.players.map((p) => ({
      ...p,
      form: Math.floor(Math.random() * 5) - 2,
    }));
    const winnerWithForm = {
      ...winner,
      players: playersWithForm,
    };

    console.log("[Reroll] New selected team:", winnerWithForm.displayName, "| OVR:", winnerWithForm.avgRating);
    set({
      isRolling: true, // Trigger spin animation delay
      rollSelectedTeam: winnerWithForm,
      rollResultTeam: null,
      rerollsLeft: rerollsLeft - 1,
    });
  },

  finishRoll: () => {
    const { rollSelectedTeam } = get();
    set({ isRolling: false, rollResultTeam: rollSelectedTeam });
  },

  pickPlayer: (player, team) => {
    const { roster, lockedTeamEntryIds, currentSlotIdx } = get();
    if (currentSlotIdx >= roster.slots.length) return;

    const newSlots = roster.slots.map((s, i) =>
      i === currentSlotIdx
        ? { ...s, playerId: player.id, teamEntryId: team.id, playerWithForm: player }
        : s
    );

    const newLocked = new Set(lockedTeamEntryIds);
    newLocked.add(team.id);

    const nextSlotIdx = newSlots.findIndex((s) => !s.playerId && !s.coachId);

    set({
      roster: { slots: newSlots },
      lockedTeamEntryIds: newLocked,
      currentSlotIdx: nextSlotIdx === -1 ? roster.slots.length : nextSlotIdx,
      rollResultTeam: null,
      baseRollRating: null, // Clear for next roll
    });
  },

  pickCoach: (coach, team) => {
    const { roster, lockedTeamEntryIds, currentSlotIdx } = get();
    if (currentSlotIdx >= roster.slots.length) return;

    const newSlots = roster.slots.map((s, i) =>
      i === currentSlotIdx
        ? { ...s, playerId: null, coachId: coach.id, teamEntryId: team.id }
        : s
    );

    const newLocked = new Set(lockedTeamEntryIds);
    newLocked.add(team.id);

    const nextSlotIdx = newSlots.findIndex((s) => !s.playerId && !s.coachId);

    set({
      roster: { slots: newSlots },
      lockedTeamEntryIds: newLocked,
      currentSlotIdx: nextSlotIdx === -1 ? roster.slots.length : nextSlotIdx,
      rollResultTeam: null,
      baseRollRating: null, // Clear for next roll
    });
  },

  reset: () =>
    set({
      modeId: null,
      draftMode: "STRICT",
      pool: [],
      lockedTeamEntryIds: new Set(),
      roster: emptyRoster([]),
      currentSlotIdx: 0,
      isRolling: false,
      rollSelectedTeam: null,
      rollResultTeam: null,
      rerollsLeft: 3,
      baseRollRating: null,
    }),
}));
