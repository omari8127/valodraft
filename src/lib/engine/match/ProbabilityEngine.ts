import type { MatchTeam } from "./MatchEngine";
import { computeChemistry } from "../chemistry";
import type { GameMap } from "@/data/maps";
import type { PlayerEntry, DraftMode } from "@/types/game";
import { useProgression } from "../../store/progression";

/**
 * Greedily maps 5 players to the 5 role slots: DUELIST, INITIATOR, CONTROLLER, SENTINEL, FLEX.
 */
export function assignPlayersToSlots(players: PlayerEntry[]): Record<string, PlayerEntry> {
  const slots: Record<string, PlayerEntry> = {};
  const unassigned = [...players];

  // 1. Assign primary role matches first
  for (const role of ["DUELIST", "INITIATOR", "CONTROLLER", "SENTINEL"]) {
    const idx = unassigned.findIndex((p) => p.primaryRole === role);
    if (idx !== -1) {
      slots[role] = unassigned.splice(idx, 1)[0];
    }
  }

  // 2. Assign remaining players to FLEX and empty slots
  const roles = ["DUELIST", "INITIATOR", "CONTROLLER", "SENTINEL", "FLEX"];
  for (const role of roles) {
    if (!slots[role] && unassigned.length > 0) {
      slots[role] = unassigned.shift()!;
    }
  }

  return slots;
}

export function calculateTSS(
  team: MatchTeam,
  map: GameMap,
  isDefense: boolean,
  mode: DraftMode = "STRICT"
): number {
  const activeMeta = useProgression.getState().activeMeta;

  // 1. Map players to role slots
  const slots = assignPlayersToSlots(team.players);

  // 2. Base weights
  let duelistWeight = 0.25;
  let initiatorWeight = 0.20;
  let controllerWeight = 0.20;
  let sentinelWeight = 0.20;
  let flexWeight = 0.15;

  // 3. Meta adjustments to weights (only applicable if NOT Chaos mode)
  if (mode !== "CHAOS") {
    if (activeMeta === "Duelist Meta") {
      duelistWeight += 0.05;
      flexWeight -= 0.05;
    } else if (activeMeta === "Utility Meta") {
      initiatorWeight += 0.025;
      controllerWeight += 0.025;
      flexWeight -= 0.05;
    }
  }

  // 4. Calculate weighted player rating including form
  let weightedRatingSum = 0;

  if (slots["DUELIST"]) {
    let rating = slots["DUELIST"].rating + (slots["DUELIST"].form ?? 0);
    if (mode !== "CHAOS" && activeMeta === "Duelist Meta") {
      rating *= 1.05;
    }
    weightedRatingSum += rating * duelistWeight;
  }

  if (slots["INITIATOR"]) {
    let rating = slots["INITIATOR"].rating + (slots["INITIATOR"].form ?? 0);
    if (mode !== "CHAOS" && activeMeta === "Utility Meta") {
      rating += 3;
    }
    weightedRatingSum += rating * initiatorWeight;
  }

  if (slots["CONTROLLER"]) {
    let rating = slots["CONTROLLER"].rating + (slots["CONTROLLER"].form ?? 0);
    if (mode !== "CHAOS" && activeMeta === "Utility Meta") {
      rating += 3;
    }
    weightedRatingSum += rating * controllerWeight;
  }

  if (slots["SENTINEL"]) {
    let rating = slots["SENTINEL"].rating + (slots["SENTINEL"].form ?? 0);
    if (mode !== "CHAOS" && activeMeta === "Sentinel Meta" && isDefense) {
      rating += 5; // Defensive Sentinel Meta boost
    }
    weightedRatingSum += rating * sentinelWeight;
  }

  if (slots["FLEX"]) {
    const rating = slots["FLEX"].rating + (slots["FLEX"].form ?? 0);
    weightedRatingSum += rating * flexWeight;
  }

  // If no players are assigned (fallback), use average rating
  if (weightedRatingSum === 0 && team.players.length > 0) {
    weightedRatingSum = team.players.reduce((sum, p) => sum + p.rating + (p.form ?? 0), 0) / team.players.length;
  }

  // 5. Apply Chemistry Multiplier
  const chemistryTotal = computeChemistry(team.players, team.coach).total;
  const chemMultiplier = 1 + (chemistryTotal * 0.0015);

  // 6. Apply Role Imbalance Penalty Multiplier
  let penaltyMultiplier = 1.0;

  if (mode === "CHAOS") {
    // Chaos Mode flat penalty multiplier
    penaltyMultiplier = 0.3;
  } else {
    const controllers = team.players.filter((p) => p.primaryRole === "CONTROLLER").length;
    const sentinels = team.players.filter((p) => p.primaryRole === "SENTINEL").length;
    const initiators = team.players.filter((p) => p.primaryRole === "INITIATOR").length;
    const duelists = team.players.filter((p) => p.primaryRole === "DUELIST").length;

    if (controllers === 0) penaltyMultiplier *= 0.85;
    if (sentinels === 0) penaltyMultiplier *= 0.90;
    if (initiators === 0) penaltyMultiplier *= 0.90;

    if (duelists > 1) {
      const extra = duelists - 1;
      penaltyMultiplier *= (1.0 - (extra * 0.08));
    }
  }

  // 7. Apply Map Bonus
  let mapBonus = 0;
  if (map.bonusRole && team.players.some((p) => p.primaryRole === map.bonusRole)) {
    mapBonus = (map.bonusPct ?? 0) * 10;
  }

  // TSS
  return (weightedRatingSum + mapBonus) * chemMultiplier * penaltyMultiplier;
}

export function calculateWinProbability(tssA: number, tssB: number): number {
  const diff = tssA - tssB;
  const p = 1 / (1 + Math.exp(-0.15 * diff));
  return Math.min(0.95, Math.max(0.05, p));
}
