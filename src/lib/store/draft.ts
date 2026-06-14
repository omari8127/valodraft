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
import { evaluateTeamRoles } from "../engine/match/ProbabilityEngine";

interface DraftState {
  modeId: GameModeId | null;
  draftMode: DraftMode;
  teamName: string;
  pool: TeamEntry[]; // current mode's entries filtered by level/unlocked years
  lockedTeamEntryIds: Set<string>;
  roster: Roster;
  currentSlotIdx: number;
  isRolling: boolean;
  rollSelectedTeam: TeamEntry | null;
  rollResultTeam: TeamEntry | null;
  rerollsLeft: number; // 3 max in STRICT mode
  baseRollRating: number | null; // Tracks the OVR of the first roll in a slot for balance checks

  startDraft: (modeId: GameModeId, draftMode: DraftMode, teamName?: string) => void;
  startRoll: () => void;
  rerollCurrentTeam: () => void;
  finishRoll: () => void;
  pickPlayer: (player: PlayerEntry, team: TeamEntry, slotIndex?: number) => void;
  pickCoach: (coach: CoachEntry, team: TeamEntry, slotIndex?: number) => void;
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
    const draftedPlayer = s.playerWithForm ?? PLAYER_BY_ID[s.playerId];
    return draftedPlayer && draftedPlayer.name.toLowerCase().trim() === normalizedName;
  });

  if (isDuplicatePlayer) {
    return false;
  }

  if (slot === "COACH") return false;

  // No restrictions in STANDARD mode
  return true;
}

export function canPlacePlayerInSlot(
  player: PlayerEntry,
  roster: Roster,
  slotIndex: number,
  mode: DraftMode
): boolean {
  const slot = roster.slots[slotIndex];
  if (!slot || slot.playerId || slot.coachId || slot.role === "COACH") return false;
  return canPickPlayer(player, roster, slot.role, mode);
}

export function canPlaceCoachInSlot(
  coach: CoachEntry,
  roster: Roster,
  slotIndex: number
): boolean {
  const slot = roster.slots[slotIndex];
  if (!coach || !slot || slot.playerId || slot.coachId || slot.role !== "COACH") return false;
  return !roster.slots.some((s) => s.coachId === coach.id);
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

  // MEDIUM & STANDARD DRAFT BALANCE
  const draftedPlayers = roster.slots
    .filter((s) => s.playerId)
    .map((s) => s.playerWithForm ?? PLAYER_BY_ID[s.playerId!])
    .filter(Boolean);

  const currentTeamRoles = evaluateTeamRoles({ players: draftedPlayers } as any);

  let criticalRoleFit = 0;
  let roleFit = 0;

  if (!currentTeamRoles.hasIGL) {
    if ((p.iglRating || 0) >= 75) criticalRoleFit += 10;
    else if ((p.iglRating || 0) >= 65) criticalRoleFit += 6;
  }
  if (!currentTeamRoles.hasController) {
    if (p.primaryRole === "CONTROLLER") criticalRoleFit += 10;
    else if (p.secondaryRole === "CONTROLLER") criticalRoleFit += 6;
    else if (p.primaryRole === "INITIATOR") criticalRoleFit += 3;
  }

  if (!currentTeamRoles.hasEntry) {
    if (p.primaryRole === "DUELIST") roleFit += 10;
    else if (p.secondaryRole === "DUELIST") roleFit += 6;
    else if (p.primaryRole === "FLEX") roleFit += 3;
  }
  if (!currentTeamRoles.hasSentinel) {
    if (p.primaryRole === "SENTINEL") roleFit += 10;
    else if (p.secondaryRole === "SENTINEL") roleFit += 6;
    else if (p.primaryRole === "CONTROLLER") roleFit += 3;
  }

  const ovr = p.rating + (p.form ?? 0);
  const randomFactor = Math.random() * 10;

  return (criticalRoleFit * 1.4) + (roleFit * 1.2) + (ovr * 1.0) + (randomFactor * 0.9);
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
  teamName: "Dream TEAM",
  pool: [],
  lockedTeamEntryIds: new Set(),
  roster: emptyRoster([]),
  currentSlotIdx: 0,
  isRolling: false,
  rollSelectedTeam: null,
  rollResultTeam: null,
  rerollsLeft: 3,
  baseRollRating: null,

  startDraft: (modeId, draftMode, teamName) => {
    const isRanked = useProgression.getState().rankedActive;
    // Classic mode -> all years unlocked; Ranked mode -> unlocked based on level
    const years = isRanked ? getUnlockedYears(useProgression.getState().level) : [2021, 2022, 2023, 2024, 2025];
    const slots = getSlotsForMode();
    set({
      modeId,
      draftMode,
      teamName: teamName?.trim() || "Dream TEAM",
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

  pickPlayer: (player, team, slotIndex) => {
    const { roster, lockedTeamEntryIds, currentSlotIdx, draftMode } = get();
    if (currentSlotIdx >= roster.slots.length) return;

    const targetSlotIdx = typeof slotIndex === "number" ? slotIndex : currentSlotIdx;
    if (!canPlacePlayerInSlot(player, roster, targetSlotIdx, draftMode)) return;

    const targetSlot = roster.slots[targetSlotIdx];
    const canAdaptToSlot =
      targetSlot?.role !== "COACH" &&
      targetSlot?.role !== "FLEX" &&
      player.primaryRole === "FLEX";
    const playerForSlot: PlayerEntry = canAdaptToSlot
      ? {
          ...player,
          role: targetSlot.role as any,
          primaryRole: targetSlot.role as any,
        }
      : player;

    const newSlots = roster.slots.map((s, i) =>
      i === targetSlotIdx
        ? { ...s, playerId: player.id, coachId: null, teamEntryId: team.id, playerWithForm: playerForSlot }
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

  pickCoach: (coach, team, slotIndex) => {
    const { roster, lockedTeamEntryIds, currentSlotIdx } = get();
    if (currentSlotIdx >= roster.slots.length) return;

    const targetSlotIdx = typeof slotIndex === "number" ? slotIndex : currentSlotIdx;
    if (!canPlaceCoachInSlot(coach, roster, targetSlotIdx)) return;

    const newSlots = roster.slots.map((s, i) =>
      i === targetSlotIdx
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
      teamName: "Dream TEAM",
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
