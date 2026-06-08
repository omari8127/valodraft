import type { CoachEntry, PlayerEntry } from "@/types/game";
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
  public simulate(teamA: MatchTeam, teamB: MatchTeam): MatchResult {
    const map = MAPS[Math.floor(Math.random() * MAPS.length)];

    const momentum = new MomentumSystem();
    const overtime = new OvertimeSystem();
    const roundEngine = new RoundEngine();
    const eventGenerator = new EventGenerator();

    let scoreA = 0;
    let scoreB = 0;
    const events: MatchEvent[] = [];
    let round = 0;

    let matchWinner = overtime.checkMatchWinner(scoreA, scoreB);

    // Tracking for MVP
    const mvpPoints: Record<string, number> = {};
    const addMvpPoints = (player: PlayerEntry, points: number) => {
      mvpPoints[player.id] = (mvpPoints[player.id] || 0) + points;
    };

    while (!matchWinner) {
      round++;

      const roundResult = roundEngine.simulateRound(teamA, teamB, map, momentum, round);

      if (roundResult.winner === "A") scoreA++;
      else scoreB++;

      momentum.recordRoundWinner(roundResult.winner);

      matchWinner = overtime.checkMatchWinner(scoreA, scoreB);
      const isMatchPoint = matchWinner !== null;

      const winnerTeam = roundResult.winner === "A" ? teamA : teamB;
      const loserTeam = roundResult.winner === "A" ? teamB : teamA;

      const eventData = eventGenerator.generateRoundEvent(
        winnerTeam,
        loserTeam,
        round,
        roundResult.isClutch,
        isMatchPoint,
      );

      // Simple MVP tracking based on generated events (if their name is in the text)
      winnerTeam.players.forEach((p) => {
        if (eventData.text.includes(p.name)) {
          addMvpPoints(p, eventData.type === "ACE" ? 5 : eventData.type === "CLUTCH" ? 3 : 1);
        }
      });

      events.push({
        round,
        scoreA,
        scoreB,
        text: eventData.text,
        type: eventData.type,
        winner: roundResult.winner,
        probA: roundResult.probA,
        agent: eventData.agent,
        player: eventData.player,
      });
    }

    // Determine MVP from the winning team
    const finalWinnerTeam = matchWinner === "A" ? teamA : teamB;
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
      winner: matchWinner,
      mapName: map.name,
      events,
      teamA,
      teamB,
      mvp,
    };
  }
}

export function simulateMatch(teamA: MatchTeam, teamB: MatchTeam): MatchResult {
  const engine = new MatchEngine();
  return engine.simulate(teamA, teamB);
}
