import type { CoachEntry, PlayerEntry, DraftMode } from "@/types/game";
import { MAPS } from "@/data/maps";
import { MomentumSystem } from "./MomentumSystem";
import { OvertimeSystem } from "./OvertimeSystem";
import { RoundEngine } from "./RoundEngine";
import { EventGenerator } from "../events/EventGenerator";
import type { EventType } from "../events/EventTemplates";

export interface MatchTeam {
  name: string;
  players: PlayerEntry[];
  coach: CoachEntry | null;
}

export interface MatchEvent {
  round: number;
  scoreA: number;
  scoreB: number;
  text: string;
  type: EventType;
  winner: "A" | "B";
  probA: number; // Probability team A had to win this round (for UI bar)
  agent?: string;
  player?: string;
}

export interface MatchResult {
  scoreA: number;
  scoreB: number;
  winner: "A" | "B";
  mapName: string;
  events: MatchEvent[];
  teamA: MatchTeam;
  teamB: MatchTeam;
  mvp: PlayerEntry | null;
}

export class MatchEngine {
  public simulate(teamA: MatchTeam, teamB: MatchTeam, mode: DraftMode = "STRICT", stage: "EARLY" | "QUARTERFINALS" | "SEMIFINALS" | "FINALS" = "EARLY"): MatchResult {
    const map = MAPS[Math.floor(Math.random() * MAPS.length)];

    const momentum = new MomentumSystem();
    const overtime = new OvertimeSystem();
    const roundEngine = new RoundEngine();
    const eventGenerator = new EventGenerator();

    let scoreA = 0;
    let scoreB = 0;
    const events: MatchEvent[] = [];
    let round = 0;

    // Track mvp points
    const mvpPoints: Record<string, number> = {};

    while (true) {
      round++;
      const isOvertime = scoreA >= 12 && scoreB >= 12;

      let matchWinner: "A" | "B" | null = null;
      if (!isOvertime) {
        if (scoreA === 13) matchWinner = "A";
        else if (scoreB === 13) matchWinner = "B";
      } else {
        matchWinner = overtime.checkMatchWinner(scoreA, scoreB);
      }

      if (matchWinner) {
        break;
      }

      const isTeamADefense = (round <= 12) || (isOvertime && round % 2 !== 0);

      // --- NEW ROUND ENGINE RESOLUTION ---
      const roundResult = roundEngine.simulateRound({
        teamA,
        teamB,
        map,
        isTeamADefense,
        mode,
        momentum,
        scoreA,
        scoreB,
        stage
      });

      const winner = roundResult.winner;
      if (winner === "A") scoreA++;
      else scoreB++;

      momentum.recordRoundWinner(winner);

      const winningTeam = winner === "A" ? teamA : teamB;
      const loserTeam = winner === "A" ? teamB : teamA;
      const isMatchPoint = matchWinner !== null;

      const eventData = eventGenerator.generateRoundEvent(
        winningTeam,
        loserTeam,
        round,
        roundResult.isClutch,
        isMatchPoint,
        roundResult.roundType as any
      );

      // Accumulate MVP points based on the "importance" of the round type
      if (eventData.player) {
        let pts = 1; // Base point for getting mentioned
        if (roundResult.roundType === "CLUTCH") pts += 3;
        else if (roundResult.roundType === "TRADE_HEAVY") pts += 2;
        else if (roundResult.roundType === "CHAOS_UPSET") pts += 4;
        
        // Add clutch magnitude
        if (roundResult.clutchMagnitude) pts += roundResult.clutchMagnitude;
        
        mvpPoints[eventData.player] = (mvpPoints[eventData.player] || 0) + pts;
      }

      events.push({
        round,
        scoreA,
        scoreB,
        text: eventData.text,
        type: eventData.type,
        winner,
        probA: roundResult.baseProbA,
        agent: eventData.agent,
        player: eventData.player,
      });
    }

    // Determine MVP from the winning team
    const finalWinnerTeam = scoreA > scoreB ? teamA : teamB;
    let mvp: PlayerEntry | null = null;
    let highestPts = -1;
    finalWinnerTeam.players.forEach((p) => {
      // Add base rating to points so better players generally have a higher floor
      const total = (mvpPoints[p.id] || 0) * 10 + p.rating;
      if (total > highestPts) {
        highestPts = total;
        mvp = p;
      }
    });

    return {
      scoreA,
      scoreB,
      winner: scoreA > scoreB ? "A" : "B",
      mapName: map.name,
      events,
      teamA,
      teamB,
      mvp,
    };
  }
}

export function simulateMatch(teamA: MatchTeam, teamB: MatchTeam, mode: DraftMode = "STRICT", stage: "EARLY" | "QUARTERFINALS" | "SEMIFINALS" | "FINALS" = "EARLY"): MatchResult {
  const engine = new MatchEngine();
  return engine.simulate(teamA, teamB, mode, stage);
}
