import type { CoachEntry, PlayerEntry } from "@/types/game";
import { computeChemistry } from "./chemistry";

function calculateRoleBalanceScore(players: PlayerEntry[]): number {
  if (players.length === 0) return 0;
  
  const roles = ["DUELIST", "INITIATOR", "CONTROLLER", "SENTINEL", "FLEX"];
  
  // Find maximum matching size using simple backtracking
  function getMaxMatching(playerIndex: number, usedRoles: Set<string>): number {
    if (playerIndex === players.length) {
      return usedRoles.size;
    }
    const p = players[playerIndex];
    const rolesToTry = [p.primaryRole, p.secondaryRole].filter(Boolean);
    
    let best = usedRoles.size;
    for (const r of rolesToTry) {
      if (roles.includes(r) && !usedRoles.has(r)) {
        usedRoles.add(r);
        const res = getMaxMatching(playerIndex + 1, usedRoles);
        if (res > best) best = res;
        usedRoles.delete(r);
      }
    }
    
    // Also try skipping matching for this player (or choosing a duplicate role)
    const resNoMatch = getMaxMatching(playerIndex + 1, usedRoles);
    if (resNoMatch > best) best = resNoMatch;
    
    return best;
  }
  
  const matchCount = getMaxMatching(0, new Set<string>());
  const maxPossible = Math.min(players.length, 5);
  if (maxPossible === 0) return 0;
  return (matchCount / maxPossible) * 100;
}

export function computeTeamOVR(players: PlayerEntry[], coach: CoachEntry | null): number {
  if (players.length === 0) return 0;

  // 1. Average Player Rating (40%)
  const avgPlayerRating = players.reduce((s, p) => s + p.rating, 0) / players.length;

  // 2. Chemistry Score (35%)
  const chemPoints = computeChemistry(players, coach).total;
  const chemScore = Math.min(100, chemPoints); // capped at 100

  // 3. Coach Rating (15%)
  const coachRating = coach ? coach.rating : 60;

  // 4. Role Balance Score (10%)
  const roleBalanceScore = calculateRoleBalanceScore(players);

  // Team Overall = 40% Player Ratings + 35% Chemistry + 15% Coach Rating + 10% Role Balance
  const ovr = (avgPlayerRating * 0.40) + (chemScore * 0.35) + (coachRating * 0.15) + (roleBalanceScore * 0.10);

  return Math.round(ovr * 10) / 10;
}
