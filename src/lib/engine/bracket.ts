import type { TeamEntry } from "@/types/game";
import { simulateMatch, type MatchResult, type MatchTeam } from "./match";
import { ORG_BY_ID } from "@/data/regions";
import { TOURNAMENT_BY_ID } from "@/data/tournaments";

export interface BracketMatch {
  id: string;
  round: number;
  teamA: MatchTeam | null;
  teamB: MatchTeam | null;
  result: MatchResult | null;
  winner: MatchTeam | null;
}

export function teamEntryToMatchTeam(entry: TeamEntry): MatchTeam {
  // Randomize form modifier (-2 to +2) for opponent players per tournament draft
  const playersWithForm = entry.players.map((p) => ({
    ...p,
    form: p.form !== undefined ? p.form : Math.floor(Math.random() * 5) - 2,
  }));

  return {
    name: entry.displayName, // Always use full displayName (e.g. "Sentinels 2025")
    players: playersWithForm,
    coach: entry.coach,
  };
}

function powerOfTwo(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

export function generateBracket(userTeam: MatchTeam, pool: TeamEntry[]): BracketMatch[][] {
  const all: MatchTeam[] = [userTeam, ...pool.map(teamEntryToMatchTeam)];
  // Cap to power of two between 8 and 32
  const target = Math.min(16, powerOfTwo(all.length) / 2 || 8);
  const shuffled = [...all].sort(() => Math.random() - 0.5).slice(0, target);
  if (!shuffled.includes(userTeam)) shuffled[0] = userTeam;
  const rounds: BracketMatch[][] = [];
  let currentTeams = shuffled;
  let roundNum = 1;
  while (currentTeams.length > 1) {
    const matches: BracketMatch[] = [];
    for (let i = 0; i < currentTeams.length; i += 2) {
      matches.push({
        id: `r${roundNum}-m${i / 2}`,
        round: roundNum,
        teamA: currentTeams[i] ?? null,
        teamB: currentTeams[i + 1] ?? null,
        result: null,
        winner: null,
      });
    }
    rounds.push(matches);
    currentTeams = matches.map(() => null as unknown as MatchTeam);
    roundNum++;
  }
  return rounds;
}

export function simulateRound(rounds: BracketMatch[][], roundIdx: number, mode: import("@/types/game").DraftMode = "STRICT"): BracketMatch[][] {
  const next = rounds.map((r) => r.map((m) => ({ ...m })));
  const round = next[roundIdx];
  for (const m of round) {
    if (!m.teamA || !m.teamB) continue;
    if (m.result) continue;
    const result = simulateMatch(m.teamA, m.teamB, mode);
    m.result = result;
    m.winner = result.winner === "A" ? m.teamA : m.teamB;
  }
  // Populate next round
  if (next[roundIdx + 1]) {
    for (let i = 0; i < round.length; i += 2) {
      const target = next[roundIdx + 1][i / 2];
      if (target) {
        target.teamA = round[i]?.winner ?? null;
        target.teamB = round[i + 1]?.winner ?? null;
      }
    }
  }
  return next;
}

export function ROUND_LABEL(roundNum: number, totalRounds: number): string {
  const fromEnd = totalRounds - roundNum;
  if (fromEnd === 0) return "Grand Final";
  if (fromEnd === 1) return "Semifinals";
  if (fromEnd === 2) return "Quarterfinals";
  if (fromEnd === 3) return "Round of 16";
  if (fromEnd === 4) return "Round of 32";
  return `Round ${roundNum}`;
}
