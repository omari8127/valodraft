import type { MatchTeam } from "./MatchEngine";
import { calculateTSS, calculateWinProbability } from "./ProbabilityEngine";
import type { MomentumSystem } from "./MomentumSystem";
import type { GameMap } from "@/data/maps";
import type { DraftMode } from "@/types/game";

export interface RoundResult {
  winner: "A" | "B";
  isClutch: boolean;
  baseProbA: number;
  roundType: "CLEAN" | "TRADE_HEAVY" | "ECO_UPSET" | "CLUTCH" | "DOMINANT" | "CHAOS_UPSET";
  clutchMagnitude?: number;
}

export interface SimulateRoundParams {
  teamA: MatchTeam;
  teamB: MatchTeam;
  map: GameMap;
  isTeamADefense: boolean;
  mode: DraftMode;
  momentum: MomentumSystem;
  scoreA: number;
  scoreB: number;
  stage?: "EARLY" | "QUARTERFINALS" | "SEMIFINALS" | "FINALS";
}

export class RoundEngine {
  public simulateRound({
    teamA,
    teamB,
    map,
    isTeamADefense,
    mode,
    momentum,
    scoreA,
    scoreB,
    stage = "EARLY"
  }: SimulateRoundParams): RoundResult {
    const isTeamBDefense = !isTeamADefense;

    // --- PLAYER VARIANCE ---
    const applyVariance = (team: MatchTeam) => {
      const idx = Math.floor(Math.random() * team.players.length);
      const originalForm = team.players[idx].form ?? 0;
      team.players[idx].form = originalForm + (Math.random() * 10 - 5);
      return () => { team.players[idx].form = originalForm; };
    };

    const cleanupA = applyVariance(teamA);
    const cleanupB = applyVariance(teamB);

    const tssA = calculateTSS(teamA, map, isTeamADefense, mode);
    const tssB = calculateTSS(teamB, map, isTeamBDefense, mode);

    cleanupA();
    cleanupB();

    let baseProbA = calculateWinProbability(tssA, tssB);

    // --- SEED PROTECTION ---
    // In early rounds only, grant a hidden boost to the massive favorite to prevent broken brackets
    if (stage === "EARLY") {
      const diff = tssA - tssB;
      if (diff > 15) baseProbA += 0.04;
      else if (diff < -15) baseProbA -= 0.04;
    }

    // --- ECONOMY DEPTH ---
    // Simplified logic: losing badly forces you into an eco/force state
    let economyPenaltyA = 0;
    let economyPenaltyB = 0;
    const isEcoA = scoreB - scoreA >= 4 && Math.random() < 0.6;
    const isEcoB = scoreA - scoreB >= 4 && Math.random() < 0.6;
    
    if (isEcoA) economyPenaltyA = -0.12; // Eco disadvantage
    if (isEcoB) economyPenaltyB = -0.12;

    const isForceA = !isEcoA && scoreB - scoreA >= 2 && Math.random() < 0.4;
    const isForceB = !isEcoB && scoreA - scoreB >= 2 && Math.random() < 0.4;

    if (isForceA) economyPenaltyA = -0.08;
    if (isForceB) economyPenaltyB = -0.08;

    baseProbA += economyPenaltyA - economyPenaltyB;

    // --- MOMENTUM & SNOWBALL ---
    const bonus = momentum.getBonus();
    baseProbA += bonus.a - bonus.b;

    // Anti-snowball / Comeback
    if (scoreA - scoreB >= 6) baseProbA -= 0.05; // Complacency
    if (scoreB - scoreA >= 6) baseProbA += 0.05;
    if (scoreB - scoreA >= 5) baseProbA += 0.06; // Desperation Comeback
    if (scoreA - scoreB >= 5) baseProbA -= 0.06;

    // --- STAGE-BASED VARIANCE ---
    let variance = 0.12;
    if (stage === "QUARTERFINALS") variance = 0.09;
    else if (stage === "SEMIFINALS") variance = 0.07;
    else if (stage === "FINALS") variance = 0.04;

    let finalProbA = baseProbA + (Math.random() * variance * 2 - variance);

    // --- PRESSURE SYSTEM ---
    if (stage === "SEMIFINALS" || stage === "FINALS") {
      const tssDiff = Math.abs(tssA - tssB);
      const pressurePenalty = Math.min(0.08, Math.max(0, (tssDiff / 100) * 0.08));
      if (tssA < tssB) finalProbA -= pressurePenalty;
      else finalProbA += pressurePenalty;
    }

    // --- CHAOS SYSTEM ---
    let chaosChance = 0.08;
    if (stage === "QUARTERFINALS") chaosChance = 0.06;
    else if (stage === "SEMIFINALS") chaosChance = 0.05;
    else if (stage === "FINALS") chaosChance = 0.035;

    let isChaos = false;
    if (Math.random() < chaosChance) {
      isChaos = true;
      finalProbA += (Math.random() > 0.5 ? 0.3 : -0.3);
    }

    // Strict clamping
    finalProbA = Math.min(0.85, Math.max(0.15, finalProbA));

    // Finals Lock Tightening
    if (stage === "FINALS") {
      finalProbA = finalProbA + (baseProbA - finalProbA) * 0.35;
    }

    const finalRoll = Math.random();
    const winner = finalRoll <= finalProbA ? "A" : "B";
    const winnerProb = winner === "A" ? finalProbA : 1 - finalProbA;

    // --- OUTCOME GENERATION ---
    let roundType: RoundResult["roundType"] = "TRADE_HEAVY";
    let isClutch = false;
    let clutchMagnitude = 0;

    if (isChaos && winnerProb < 0.4) {
      roundType = "CHAOS_UPSET";
    } else if ((winner === "A" && isEcoA) || (winner === "B" && isEcoB)) {
      // Eco cap upset chance: 25%.
      // Check if they won the roll against odds.
      if (Math.random() < 0.25) {
        roundType = "ECO_UPSET";
      }
    } else if (winnerProb < 0.40 && Math.random() < 0.45) {
      // Pressure penalty lowers clutch chance for weaker team
      let clutchChance = 1.0;
      if ((stage === "SEMIFINALS" || stage === "FINALS") && ((winner === "A" && tssA < tssB) || (winner === "B" && tssB < tssA))) {
        clutchChance = 0.7; // 30% reduction in clutch capability due to pressure
      }

      if (Math.random() < clutchChance) {
        isClutch = true;
        roundType = "CLUTCH";
        clutchMagnitude = Math.floor(Math.random() * 3) + 1; // 1v1 to 1v3
      }
    } else if (winnerProb > 0.7 && Math.random() < 0.6) {
      roundType = "DOMINANT";
    } else if (Math.random() < 0.4) {
      roundType = "CLEAN";
    }

    return {
      winner,
      isClutch,
      baseProbA: Math.min(0.8, Math.max(0.2, baseProbA)), // UI Bar uses the pre-variance base
      roundType,
      clutchMagnitude
    };
  }
}
