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
  orgId?: string;
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

export interface PlayerMatchStats {
  kills: number;
  deaths: number;
  adr: number;
  kast: number;
  rating: number;
  acs: number;
  headshotPct: number;
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
  playerStats: Record<string, PlayerMatchStats>; // Key is player name
}

export interface SeriesResult {
  scoreA: number; // Series score (e.g. 2 or 3)
  scoreB: number;
  winner: "A" | "B";
  teamA: MatchTeam;
  teamB: MatchTeam;
  matches: MatchResult[];
  playerStats: Record<string, PlayerMatchStats>; // Aggregated stats
  mvp: PlayerEntry | null;
}

export class MatchEngine {
  public simulate(teamA: MatchTeam, teamB: MatchTeam, mode: DraftMode = "STRICT", stage: "EARLY" | "QUARTERFINALS" | "SEMIFINALS" | "FINALS" = "EARLY", forcedMap: import("@/data/maps").GameMap | null = null): MatchResult {
    if (!teamA || !teamB || !teamA.players || !teamB.players) {
      console.error("Invalid teams or missing players in simulation", { teamA, teamB });
      return {
        scoreA: 13,
        scoreB: 0,
        winner: "A",
        mapName: "Ascent",
        events: [{ round: 1, scoreA: 13, scoreB: 0, text: "Forfeit due to missing or corrupted data.", type: "ROUND", winner: "A", probA: 1 }],
        teamA: teamA || { name: "Team A", players: [], coach: null },
        teamB: teamB || { name: "Team B", players: [], coach: null },
        mvp: null,
        playerStats: {}
      };
    }

    console.log("SIMULATION START", { teamA: teamA.name, teamB: teamB.name, stage });

    const map = forcedMap || MAPS[Math.floor(Math.random() * MAPS.length)];

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
      if (eventData && eventData.player) {
        let pts = 1; // Base point for getting mentioned
        if (roundResult.roundType === "CLUTCH") pts += 3;
        else if (roundResult.roundType === "TRADE_HEAVY") pts += 2;
        else if (roundResult.roundType === "CHAOS_UPSET") pts += 4;
        
        // Add clutch magnitude
        if (roundResult.clutchMagnitude) pts += roundResult.clutchMagnitude;
        
        const playerKey = eventData.player;
        mvpPoints[playerKey] = (mvpPoints[playerKey] || 0) + pts;
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
    
    if (finalWinnerTeam && finalWinnerTeam.players) {
      finalWinnerTeam.players.forEach((p) => {
        if (!p || !p.name) return;
        // eventData.player is the player name, so we use p.name here instead of p.id
        const total = (mvpPoints[p.name] || 0) * 10 + (p.rating || 0);
        if (total > highestPts) {
          highestPts = total;
          mvp = p;
        }
      });
    }

    const playerStats: Record<string, PlayerMatchStats> = {};
    const totalRounds = scoreA + scoreB;
    
    [...teamA.players, ...teamB.players].forEach(p => {
      if (!p || !p.name) return;
      const isWinner = (scoreA > scoreB && teamA.players.includes(p)) || (scoreB > scoreA && teamB.players.includes(p));
      const basePoints = (mvpPoints[p.name] || 0);
      
      const formMod = p.form || 0;
      
      // Calculate K/D based on their MVP points + base rating
      const performanceMultiplier = (p.rating / 100) * (isWinner ? 1.05 : 0.95) * (1 + (formMod * 0.05));
      
      // Target KPR (Kills Per Round) in Valorant usually ranges from 0.5 to 1.0. 
      let targetKillsPerRound = 0.6 + ((performanceMultiplier - 0.8) * 0.7) + (basePoints * 0.02);
      
      let kills = Math.floor(totalRounds * targetKillsPerRound);
      let deaths = Math.floor(totalRounds * (1.05 - (performanceMultiplier * 0.4)));
      
      // Add small randomness
      kills = Math.max(0, kills + (Math.floor(Math.random() * 5) - 2));
      deaths = Math.max(0, deaths + (Math.floor(Math.random() * 5) - 2));
      
      // Cap at reasonable limits for realism
      if (kills > totalRounds * 1.2) kills = Math.floor(totalRounds * 1.2);
      if (deaths > totalRounds) deaths = totalRounds - Math.floor(Math.random() * 3);
      if (deaths === 0) deaths = 1;
      
      const adr = Math.floor(100 + ((kills - deaths) * 1.5) + (Math.random() * 20));
      const kast = Math.floor(65 + (performanceMultiplier * 15) + (Math.random() * 10));
      const rating = parseFloat((0.85 + ((kills / deaths) * 0.25) + (basePoints * 0.015)).toFixed(2));
      const acs = Math.floor(adr * 1.4 + Math.floor(Math.random() * 15));
      const headshotPct = Math.min(50, Math.max(5, Math.floor(15 + (performanceMultiplier * 10) + (Math.random() * 8))));
      
      playerStats[p.name] = { 
        kills, 
        deaths, 
        adr, 
        kast: Math.min(100, kast), 
        rating,
        acs,
        headshotPct
      };
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
      playerStats,
    };
  }

  public simulateSeries(teamA: MatchTeam, teamB: MatchTeam, mode: DraftMode = "STRICT", stage: "EARLY" | "QUARTERFINALS" | "SEMIFINALS" | "FINALS" = "EARLY", maps: import("@/data/maps").GameMap[] = [], isBO5: boolean = false): SeriesResult {
    const targetWins = isBO5 ? 3 : 2;
    let seriesScoreA = 0;
    let seriesScoreB = 0;
    const matches: MatchResult[] = [];
    
    for (let i = 0; i < (isBO5 ? 5 : 3); i++) {
      if (seriesScoreA === targetWins || seriesScoreB === targetWins) break;
      const map = maps[i] || null;
      const match = this.simulate(teamA, teamB, mode, stage, map);
      matches.push(match);
      if (match.winner === "A") seriesScoreA++;
      else seriesScoreB++;
    }

    // Aggregate stats
    const aggregatedStats: Record<string, PlayerMatchStats> = {};
    const totalRounds = matches.reduce((sum, m) => sum + m.scoreA + m.scoreB, 0);

    [...teamA.players, ...teamB.players].forEach(p => {
      if (!p || !p.name) return;
      let kills = 0, deaths = 0, adrSum = 0, kastSum = 0, ratingSum = 0, acsSum = 0, hsSum = 0;
      let mapsPlayed = 0;

      matches.forEach(m => {
        const s = m.playerStats[p.name];
        if (s) {
          kills += s.kills;
          deaths += s.deaths;
          adrSum += s.adr;
          kastSum += s.kast;
          ratingSum += s.rating;
          acsSum += s.acs;
          hsSum += s.headshotPct;
          mapsPlayed++;
        }
      });

      if (mapsPlayed > 0) {
        aggregatedStats[p.name] = {
          kills,
          deaths,
          adr: Math.floor(adrSum / mapsPlayed),
          kast: Math.floor(kastSum / mapsPlayed),
          rating: parseFloat((ratingSum / mapsPlayed).toFixed(2)),
          acs: Math.floor(acsSum / mapsPlayed),
          headshotPct: Math.floor(hsSum / mapsPlayed)
        };
      }
    });

    // Find MVP from winning team
    const winnerTeam = seriesScoreA > seriesScoreB ? teamA : teamB;
    let mvp: PlayerEntry | null = null;
    let highestRating = -1;
    winnerTeam.players.forEach(p => {
      if (!p || !p.name) return;
      const stat = aggregatedStats[p.name];
      if (stat && stat.rating > highestRating) {
        highestRating = stat.rating;
        mvp = p;
      }
    });

    return {
      scoreA: seriesScoreA,
      scoreB: seriesScoreB,
      winner: seriesScoreA > seriesScoreB ? "A" : "B",
      teamA,
      teamB,
      matches,
      playerStats: aggregatedStats,
      mvp
    };
  }
}

export function simulateMatch(teamA: MatchTeam, teamB: MatchTeam, mode: DraftMode = "STRICT", stage: "EARLY" | "QUARTERFINALS" | "SEMIFINALS" | "FINALS" = "EARLY"): MatchResult {
  const engine = new MatchEngine();
  try {
    return engine.simulate(teamA, teamB, mode, stage);
  } catch (e) {
    console.error("SIMULATION ERROR:", e);
    throw e;
  }
}

export function simulateSeries(teamA: MatchTeam, teamB: MatchTeam, mode: DraftMode = "STRICT", stage: "EARLY" | "QUARTERFINALS" | "SEMIFINALS" | "FINALS" = "EARLY", maps: import("@/data/maps").GameMap[] = [], isBO5: boolean = false): SeriesResult {
  const engine = new MatchEngine();
  return engine.simulateSeries(teamA, teamB, mode, stage, maps, isBO5);
}
