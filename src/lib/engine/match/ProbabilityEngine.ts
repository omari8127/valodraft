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
  // 1. Team OVR (0-100)
  let ovrTotal = 0;
  if (team.players.length > 0) {
    ovrTotal = team.players.reduce((sum, p) => sum + p.rating + (p.form ?? 0), 0) / team.players.length;
  }
  const teamOVR = Math.min(100, Math.max(0, ovrTotal));

  // 2. Chemistry (0-100)
  // Compute chemistry usually returns a score around 20-80. We clamp to 100.
  const chemistryRaw = computeChemistry(team.players, team.coach).total;
  const chemistry = Math.min(100, Math.max(0, chemistryRaw * 1.25)); // Slightly inflate to match 100 scale

  // 3. Role Balance
  // Replaced by specific win probability penalties evaluated per team
  let roleBalance = 100;

  // 4. Map Pool / Affinity (0-100)
  let mapPool = 50; // Base neutral
  // @ts-ignore
  if (map.bonusRole && team.players.some((p) => p.primaryRole === map.bonusRole)) {
    mapPool += 30; // Strong affinity
  }
  const activeMeta = useProgression.getState().activeMeta;
  if (mode !== "CHAOS") {
    if (activeMeta === "Duelist Meta" && team.players.some(p => p.primaryRole === "DUELIST")) mapPool += 10;
    if (activeMeta === "Sentinel Meta" && isDefense && team.players.some(p => p.primaryRole === "SENTINEL")) mapPool += 15;
    if (activeMeta === "Utility Meta" && team.players.some(p => p.primaryRole === "INITIATOR" || p.primaryRole === "CONTROLLER")) mapPool += 10;
  }
  mapPool = Math.min(100, Math.max(0, mapPool));

  // 5. Final TSS Calculation
  // TSS = (TeamOVR * 0.5) + (Chemistry * 0.15) + (RoleBalance * 0.2) + (MapPool * 0.15)
  const tss = (teamOVR * 0.5) + (chemistry * 0.15) + (roleBalance * 0.2) + (mapPool * 0.15);

  return Math.min(100, Math.max(0, tss));
}

export function calculateWinProbability(tssA: number, tssB: number): number {
  const diff = tssA - tssB;
  
  // baseProb = 0.5 + (diff / 100) * 0.6
  let baseProb = 0.5 + (diff / 100) * 0.6;
  
  // Clamp: 0.2 <= baseProb <= 0.8
  baseProb = Math.min(0.8, Math.max(0.2, baseProb));

  if (isNaN(baseProb)) {
    console.error("NaN detected in probability", { tssA, tssB });
    baseProb = 0.5;
  }
  
  return baseProb;
}

export function evaluateTeamRoles(team: MatchTeam) {
  let highestIGL = 0;
  let secondHighestIGL = 0;
  
  let controllerScore = 0;
  let entryScore = 0;
  let sentinelScore = 0;
  let duelistCount = 0;

  for (const p of team.players) {
    if (!p) continue;
    
    const igl = p.iglRating || 0;
    if (igl > highestIGL) {
      secondHighestIGL = highestIGL;
      highestIGL = igl;
    } else if (igl > secondHighestIGL) {
      secondHighestIGL = igl;
    }

    const isPrimary = (role: string) => p.primaryRole === role ? 1.0 : 0;
    const isSecondary = (role: string) => p.secondaryRole === role ? 0.6 : 0;

    controllerScore += isPrimary("CONTROLLER") + isSecondary("CONTROLLER") + (p.primaryRole === "INITIATOR" ? 0.3 : 0);
    entryScore += isPrimary("DUELIST") + isSecondary("DUELIST") + (p.primaryRole === "FLEX" ? 0.3 : 0);
    sentinelScore += isPrimary("SENTINEL") + isSecondary("SENTINEL") + (p.primaryRole === "CONTROLLER" ? 0.3 : 0);
    if (p.primaryRole === "DUELIST") duelistCount++;
  }

  const iglImpact = highestIGL + (secondHighestIGL * 0.25);
  const hasIGL = iglImpact >= 75;
  const hasController = controllerScore >= 0.75;
  const hasEntry = entryScore >= 0.75;
  const hasSentinel = sentinelScore >= 0.75;

  let winProbPenalty = 0;
  let consistencyPenalty = 0;

  if (!hasIGL) { winProbPenalty -= 0.15; consistencyPenalty -= 0.15; }
  if (!hasController) winProbPenalty -= 0.13;
  if (!hasEntry && !hasSentinel) winProbPenalty -= 0.08;
  else if (!hasEntry || !hasSentinel) winProbPenalty -= 0.05;

  if (duelistCount === 3) winProbPenalty -= 0.03;
  if (duelistCount >= 4) winProbPenalty -= 0.06;

  return { hasIGL, hasController, hasEntry, hasSentinel, iglImpact, winProbPenalty, consistencyPenalty, controllerScore, entryScore, sentinelScore };
}
