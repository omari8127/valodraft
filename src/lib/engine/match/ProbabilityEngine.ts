import type { MatchTeam } from "./MatchEngine";
import { computeTeamOVR } from "../ovr";
import type { GameMap } from "@/data/maps";

export function calculateTSS(team: MatchTeam, map: GameMap): number {
  // Team Strength Score (TSS) starts with the Team OVR
  const ovr = computeTeamOVR(team.players, team.coach);

  // Apply map-specific role bonus (+% probability shift, converted to equivalent OVR points)
  let mapBonus = 0;
  if (map.bonusRole && team.players.some((p) => p.role === map.bonusRole)) {
    // Map bonusPct is typically 3-5% (e.g. 0.05). Since 1 OVR is ~3.6% probability, we convert it.
    mapBonus = (map.bonusPct ?? 0) * 10; 
  }

  return ovr + mapBonus;
}

export function calculateWinProbability(tssA: number, tssB: number): number {
  // P = 1 / (1 + e^(-0.15 * (TSS_A - TSS_B)))
  // Under this formula:
  // - 95 vs 90 OVR difference (+5) gives 68% vs 32%
  // - 100 vs 90 OVR difference (+10) gives 82% vs 18%
  // - 110 vs 90 OVR difference (+20) gives 95% vs 5% (capped)
  const diff = tssA - tssB;
  const p = 1 / (1 + Math.exp(-0.15 * diff));

  // Clamp between 5% and 95% to always allow underdogs a chance to win
  return Math.min(0.95, Math.max(0.05, p));
}
