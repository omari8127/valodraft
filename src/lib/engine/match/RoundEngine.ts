import type { MatchTeam } from "./MatchEngine";
import { calculateTSS, calculateWinProbability } from "./ProbabilityEngine";
import type { MomentumSystem } from "./MomentumSystem";
import type { GameMap } from "@/data/maps";

export interface RoundResult {
  winner: "A" | "B";
  isClutch: boolean;
  probA: number;
}

export class RoundEngine {
  public simulateRound(
    teamA: MatchTeam,
    teamB: MatchTeam,
    map: GameMap,
    momentum: MomentumSystem,
  ): RoundResult {
    const tssA = calculateTSS(teamA, map);
    const tssB = calculateTSS(teamB, map);

    // Apply Momentum
    const bonus = momentum.getBonus();
    let baseProbA = calculateWinProbability(tssA, tssB);

    // Add momentum directly to probability, clamping to valid ranges
    baseProbA += bonus.a - bonus.b;
    baseProbA = Math.min(0.95, Math.max(0.05, baseProbA));

    // Controlled Randomness (-5% to +5%)
    const randomModifier = Math.random() * 0.10 - 0.05;
    const finalProbA = Math.min(0.95, Math.max(0.05, baseProbA + randomModifier));

    // Roll for winner
    const roll = Math.random();
    const winner = roll <= finalProbA ? "A" : "B";

    // Clutch detection:
    // Clutches are extremely rare. High improbability of winning or 3% chance.
    let isClutch = false;
    const winnerProb = winner === "A" ? finalProbA : 1 - finalProbA;
    if (winnerProb < 0.35 || Math.random() < 0.03) {
      isClutch = true;
    }

    return {
      winner,
      isClutch,
      probA: finalProbA,
    };
  }
}
