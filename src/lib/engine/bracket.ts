import type { TeamEntry, DraftMode } from "@/types/game";
import { simulateMatch, simulateSeries, type MatchResult, type SeriesResult, type MatchTeam, MatchEngine } from "./match";

export interface BracketMatch {
  id: string;
  stage: number;
  bracket: "UPPER" | "LOWER" | "GRAND";
  roundLabel: string;
  nextWinnerMatchId?: string;
  nextWinnerSlot?: "teamA" | "teamB";
  nextLoserMatchId?: string;
  nextLoserSlot?: "teamA" | "teamB";
  teamA: MatchTeam | null;
  teamB: MatchTeam | null;
  result: SeriesResult | null;
  winner: MatchTeam | null;
}

export function teamEntryToMatchTeam(entry: TeamEntry): MatchTeam {
  const playersWithForm = entry.players.map((p) => ({
    ...p,
    form: p.form !== undefined ? p.form : Math.floor(Math.random() * 5) - 2,
  }));
  return {
    name: entry.displayName,
    players: playersWithForm,
    coach: entry.coach,
    orgId: entry.orgId,
  };
}

export function getDeduplicatedPool(pool: TeamEntry[]): TeamEntry[] {
  const orgMap = new Map<string, TeamEntry>();
  for (const team of pool) {
    const existing = orgMap.get(team.orgId);
    if (!existing) {
      orgMap.set(team.orgId, team);
    } else {
      if (team.year > existing.year) {
        orgMap.set(team.orgId, team);
      } else if (team.year === existing.year) {
        if (team.avgRating > existing.avgRating) {
          orgMap.set(team.orgId, team);
        }
      }
    }
  }
  return Array.from(orgMap.values());
}

/**
 * Simulates a hidden 16-team tournament and returns the top 8 teams.
 */
export function getTop8FromHiddenSimulation(userTeam: MatchTeam, pool: TeamEntry[], mode: DraftMode = "STRICT"): MatchTeam[] {
  const deduped = getDeduplicatedPool(pool);
  const aiTeams = deduped.map(teamEntryToMatchTeam).sort(() => Math.random() - 0.5);
  
  // Select 15 random AI teams to compete with the user team (total 16 participants)
  const selectedAi = aiTeams.slice(0, 15);
  const participants = [userTeam, ...selectedAi];
  
  // To simulate, we just use their average player rating + slight randomness
  // since it's a hidden simulation
  const teamStrength = participants.map(team => {
    let base = 0;
    if (team.players && team.players.length > 0) {
      base = team.players.reduce((sum, p) => sum + (p.rating || 80), 0) / team.players.length;
    }
    // Boost user team slightly to ensure they mostly make top 8, but not guaranteed
    const isUser = team.name === userTeam.name;
    const score = base + (Math.random() * 10 - 5) + (isUser ? 5 : 0);
    return { team, score };
  });

  // Sort so that the user's team is guaranteed to be at index 0 (and thus always in the top 8),
  // while sorting the other teams by simulated strength desc
  teamStrength.sort((a, b) => {
    if (a.team.name === userTeam.name) return -1;
    if (b.team.name === userTeam.name) return 1;
    return b.score - a.score;
  });
  return teamStrength.slice(0, 8).map(t => t.team);
}

/**
 * Generates an 8-Team Double Elimination Bracket
 * Grouped into 6 sequential stages.
 */
export function generateDoubleEliminationBracket(top8: MatchTeam[]): BracketMatch[][] {
  // Stage 1: UB QF
  const ubQf1: BracketMatch = { id: "ub-qf-1", stage: 1, bracket: "UPPER", roundLabel: "UB Quarterfinal 1", nextWinnerMatchId: "ub-sf-1", nextWinnerSlot: "teamA", nextLoserMatchId: "lb-r1-1", nextLoserSlot: "teamA", teamA: top8[0] ?? null, teamB: top8[7] ?? null, result: null, winner: null };
  const ubQf2: BracketMatch = { id: "ub-qf-2", stage: 1, bracket: "UPPER", roundLabel: "UB Quarterfinal 2", nextWinnerMatchId: "ub-sf-1", nextWinnerSlot: "teamB", nextLoserMatchId: "lb-r1-1", nextLoserSlot: "teamB", teamA: top8[3] ?? null, teamB: top8[4] ?? null, result: null, winner: null };
  const ubQf3: BracketMatch = { id: "ub-qf-3", stage: 1, bracket: "UPPER", roundLabel: "UB Quarterfinal 3", nextWinnerMatchId: "ub-sf-2", nextWinnerSlot: "teamA", nextLoserMatchId: "lb-r1-2", nextLoserSlot: "teamA", teamA: top8[2] ?? null, teamB: top8[5] ?? null, result: null, winner: null };
  const ubQf4: BracketMatch = { id: "ub-qf-4", stage: 1, bracket: "UPPER", roundLabel: "UB Quarterfinal 4", nextWinnerMatchId: "ub-sf-2", nextWinnerSlot: "teamB", nextLoserMatchId: "lb-r1-2", nextLoserSlot: "teamB", teamA: top8[1] ?? null, teamB: top8[6] ?? null, result: null, winner: null };

  // Stage 2: UB SF & LB R1
  const ubSf1: BracketMatch = { id: "ub-sf-1", stage: 2, bracket: "UPPER", roundLabel: "UB Semifinal 1", nextWinnerMatchId: "ub-f", nextWinnerSlot: "teamA", nextLoserMatchId: "lb-r2-1", nextLoserSlot: "teamB", teamA: null, teamB: null, result: null, winner: null };
  const ubSf2: BracketMatch = { id: "ub-sf-2", stage: 2, bracket: "UPPER", roundLabel: "UB Semifinal 2", nextWinnerMatchId: "ub-f", nextWinnerSlot: "teamB", nextLoserMatchId: "lb-r2-2", nextLoserSlot: "teamB", teamA: null, teamB: null, result: null, winner: null };
  const lbR1_1: BracketMatch = { id: "lb-r1-1", stage: 2, bracket: "LOWER", roundLabel: "LB Round 1", nextWinnerMatchId: "lb-r2-1", nextWinnerSlot: "teamA", teamA: null, teamB: null, result: null, winner: null };
  const lbR1_2: BracketMatch = { id: "lb-r1-2", stage: 2, bracket: "LOWER", roundLabel: "LB Round 1", nextWinnerMatchId: "lb-r2-2", nextWinnerSlot: "teamA", teamA: null, teamB: null, result: null, winner: null };

  // Stage 3: UB F & LB R2
  const ubF: BracketMatch = { id: "ub-f", stage: 3, bracket: "UPPER", roundLabel: "Upper Final", nextWinnerMatchId: "gf", nextWinnerSlot: "teamA", nextLoserMatchId: "lb-f", nextLoserSlot: "teamB", teamA: null, teamB: null, result: null, winner: null };
  const lbR2_1: BracketMatch = { id: "lb-r2-1", stage: 3, bracket: "LOWER", roundLabel: "LB Round 2", nextWinnerMatchId: "lb-sf", nextWinnerSlot: "teamA", teamA: null, teamB: null, result: null, winner: null };
  const lbR2_2: BracketMatch = { id: "lb-r2-2", stage: 3, bracket: "LOWER", roundLabel: "LB Round 2", nextWinnerMatchId: "lb-sf", nextWinnerSlot: "teamB", teamA: null, teamB: null, result: null, winner: null };

  // Stage 4: LB SF
  const lbSf: BracketMatch = { id: "lb-sf", stage: 4, bracket: "LOWER", roundLabel: "Lower Semifinal", nextWinnerMatchId: "lb-f", nextWinnerSlot: "teamA", teamA: null, teamB: null, result: null, winner: null };

  // Stage 5: LB F
  const lbF: BracketMatch = { id: "lb-f", stage: 5, bracket: "LOWER", roundLabel: "Lower Final", nextWinnerMatchId: "gf", nextWinnerSlot: "teamB", teamA: null, teamB: null, result: null, winner: null };

  // Stage 6: GF
  const gf: BracketMatch = { id: "gf", stage: 6, bracket: "GRAND", roundLabel: "Grand Final", teamA: null, teamB: null, result: null, winner: null };

  return [
    [ubQf1, ubQf2, ubQf3, ubQf4],
    [ubSf1, ubSf2, lbR1_1, lbR1_2],
    [ubF, lbR2_1, lbR2_2],
    [lbSf],
    [lbF],
    [gf]
  ];
}

export function advanceWinner(match: BracketMatch, getMatch: (id: string) => BracketMatch | undefined) {
  if (!match.winner || !match.nextWinnerMatchId || !match.nextWinnerSlot) return;
  
  const nextMatch = getMatch(match.nextWinnerMatchId);
  if (!nextMatch) return;
  
  // Strict Validation: Ensure slot is empty and team is not duplicated
  if (!nextMatch[match.nextWinnerSlot] && nextMatch.teamA?.name !== match.winner.name && nextMatch.teamB?.name !== match.winner.name) {
    nextMatch[match.nextWinnerSlot] = match.winner;
  }
}

export function advanceLoser(match: BracketMatch, getMatch: (id: string) => BracketMatch | undefined) {
  if (!match.result || !match.winner || !match.nextLoserMatchId || !match.nextLoserSlot) return;
  
  const loser = match.winner.name === match.teamA?.name ? match.teamB : match.teamA;
  if (!loser) return;

  const nextMatch = getMatch(match.nextLoserMatchId);
  if (!nextMatch) return;

  // Strict Validation: Ensure slot is empty and team is not duplicated
  if (!nextMatch[match.nextLoserSlot] && nextMatch.teamA?.name !== loser.name && nextMatch.teamB?.name !== loser.name) {
    nextMatch[match.nextLoserSlot] = loser;
  }
}

export function simulateSingleMatch(match: BracketMatch, mode: import("@/types/game").DraftMode, getMatch: (id: string) => BracketMatch | undefined) {
  if (!match.teamA || !match.teamB || match.result) return;
  
  let phase: "EARLY" | "QUARTERFINALS" | "SEMIFINALS" | "FINALS" = "EARLY";
  let isBO5 = false;
  if (match.bracket === "GRAND") {
    phase = "FINALS";
    isBO5 = true;
  }
  else if (match.id.includes("sf")) phase = "SEMIFINALS";
  else if (match.id.includes("qf")) phase = "QUARTERFINALS";
  
  const result = simulateSeries(match.teamA, match.teamB, mode, phase, [], isBO5);
  match.result = result;
  match.winner = result.winner === "A" ? match.teamA : match.teamB;
  
  advanceWinner(match, getMatch);
  advanceLoser(match, getMatch);
}

/**
 * Iterates through the entire bracket graph. Simulates any ready CPU matches.
 * Stops at User matches. Propagates all winners and losers accurately.
 */
export function processBracketProgression(bracketStages: BracketMatch[][], userTeamName: string, mode: import("@/types/game").DraftMode, simulateCPU: boolean = true): BracketMatch[][] {
  const nextStages = bracketStages.map((stage) => stage.map((m) => ({ ...m })));
  const flatMatches = nextStages.flat();
  const getMatch = (id: string) => flatMatches.find(m => m.id === id);

  let progressed = false;
  do {
    progressed = false;
    for (const match of flatMatches) {
      if (match.result) {
        // If it already has a result, ensure its progression is applied (safe due to strict validation)
        advanceWinner(match, getMatch);
        advanceLoser(match, getMatch);
      } else if (match.teamA && match.teamB) {
        // Match is ready to be played
        const isUserMatch = match.teamA.name === userTeamName || match.teamB.name === userTeamName;
        if (!isUserMatch && simulateCPU) {
          // It's a CPU vs CPU match, simulate it immediately!
          simulateSingleMatch(match, mode, getMatch);
          progressed = true; // State changed, run graph loop again
        }
      }
    }
  } while (progressed);

  return nextStages;
}

/**
 * Processes exactly ONE stage (round) of the bracket per call.
 * - Re-applies all existing winner/loser propagations for consistency.
 * - Finds the earliest stage with matches that are ready (both teams, no result).
 * - Simulates only CPU matches in that ONE stage.
 * - Does NOT cascade into subsequent stages — this prevents CPU teams
 *   from advancing multiple rounds ahead of the user.
 */
export function processNextStage(
  bracketStages: BracketMatch[][],
  userTeamName: string,
  mode: import("@/types/game").DraftMode
): BracketMatch[][] {
  const nextStages = bracketStages.map((stage) => stage.map((m) => ({ ...m })));
  const flatMatches = nextStages.flat();
  const getMatch = (id: string) => flatMatches.find((m) => m.id === id);

  // Re-apply all existing result propagations to ensure bracket is consistent
  for (const match of flatMatches) {
    if (match.result) {
      advanceWinner(match, getMatch);
      advanceLoser(match, getMatch);
    }
  }

  // Find the earliest stage with ready matches (both teams assigned, no result)
  for (const stage of nextStages) {
    const readyMatches = stage.filter((m) => !m.result && m.teamA && m.teamB);
    if (readyMatches.length > 0) {
      // Simulate only CPU matches in this stage — skip the user's match
      for (const match of readyMatches) {
        const isUserMatch =
          match.teamA!.name === userTeamName || match.teamB!.name === userTeamName;
        if (!isUserMatch) {
          simulateSingleMatch(match, mode, getMatch);
        }
      }
      break; // Stop — only ONE stage per call
    }
  }

  return nextStages;
}

export function ROUND_LABEL(stageIdx: number, bracketStages: BracketMatch[][]): string {
  const stage = bracketStages[stageIdx];
  if (!stage || stage.length === 0) return `Stage ${stageIdx + 1}`;
  
  if (stage.length === 1 && stage[0].id === "gf") return "Grand Final";
  if (stage.length === 1 && stage[0].id === "lb-f") return "Lower Final";
  if (stage.length === 1 && stage[0].id === "lb-sf") return "Lower Semifinal";
  if (stage.length === 3) return "Upper Final / LB R2";
  if (stage.length === 4 && stage.some(m => m.id.includes("ub-sf"))) return "Upper Semifinals / LB R1";
  if (stage.length === 4 && stage.some(m => m.id.includes("ub-qf"))) return "Upper Quarterfinals";

  return `Stage ${stageIdx + 1}`;
}
