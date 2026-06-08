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

  startDraft: (modeId: GameModeId, draftMode: DraftMode) => void;
  startRoll: () => void;
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
 * MUST use unique ID, never name matching.
 */
export function canPickPlayer(
  player: PlayerEntry,
  team: Roster,
  slot: SlotRole,
  mode: DraftMode
): boolean {
  // Check if player is already drafted
  if (team.slots.some((s) => s.playerId === player.id)) {
    return false;
  }

  if (mode === "OPEN") {
    if (slot === "COACH") return false;
    return true; // No restrictions in OPEN mode
  }

  // In STRICT mode:
  if (slot === "COACH") {
    return false;
  }

  if (slot === "FLEX") {
    // FLEX can be any role
    return true;
  }

  // Block duplicate roles (except FLEX slot logic)
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
    // Bad draft logic: ignores synergy, completely random
    return Math.random() * 100;
  }

  const currentSlot = roster.slots.find((s) => !s.playerId && !s.coachId);
  if (!currentSlot) return 0;

  // Create a prospective roster with this player added
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
    // Optimal drafting: Maximizes chemistry + roles (Team OVR)
    const prospectiveOVR = computeTeamOVR(tempRosterPlayers, coach);
    return prospectiveOVR;
  }

  // MEDIUM: Balanced picks
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

  startDraft: (modeId, draftMode) => {
    const level = useProgression.getState().level;
    const unlockedYears = getUnlockedYears(level);
    const slots = getSlotsForMode();
    set({
      modeId,
      draftMode,
      pool: poolForMode(modeId, unlockedYears),
      lockedTeamEntryIds: new Set(),
      roster: emptyRoster(slots),
      currentSlotIdx: 0,
      isRolling: false,
      rollSelectedTeam: null,
      rollResultTeam: null,
    });
  },

  startRoll: () => {
    const { pool, lockedTeamEntryIds, roster, currentSlotIdx, draftMode } = get();
    const currentRole = roster.slots[currentSlotIdx]?.role;
    if (!currentRole) return;

    // Filter teams that have at least one pickable player or coach
    const available = pool.filter((t) => {
      if (lockedTeamEntryIds.has(t.id)) return false;
      if (currentRole === "COACH") {
        return !roster.slots.some((s) => s.role === "COACH" && s.coachId);
      }
      return t.players.some((p) => canPickPlayer(p, roster, currentRole, draftMode));
    });

    if (available.length === 0) return;

    const difficulty = useProgression.getState().difficulty;

    // Calculate AI weights for each available team
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
    // Assign random form modifier (-2 to +2) dynamically to all players in this team per draft
    const playersWithForm = winner.players.map((p) => ({
      ...p,
      form: Math.floor(Math.random() * 5) - 2, // -2 to +2 range
    }));
    const winnerWithForm = {
      ...winner,
      players: playersWithForm,
    };

    console.log("[Roll] Selected team:", winnerWithForm.displayName, "| ID:", winnerWithForm.id);
    set({ isRolling: true, rollSelectedTeam: winnerWithForm, rollResultTeam: null });
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
    }),
}));
