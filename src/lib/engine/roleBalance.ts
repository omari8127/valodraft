import type { PlayerEntry } from "@/types/game";

/**
 * Calculates a score from 0 to 100 based on coverage of the 5 roles:
 * DUELIST, INITIATOR, CONTROLLER, SENTINEL, FLEX.
 * Uses backtracking to find a matching between players and roles.
 */
export function calculateRoleBalanceScore(players: PlayerEntry[]): number {
  if (players.length === 0) return 0;
  
  const roles = ["DUELIST", "INITIATOR", "CONTROLLER", "SENTINEL", "FLEX"];
  
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
    
    const resNoMatch = getMaxMatching(playerIndex + 1, usedRoles);
    if (resNoMatch > best) best = resNoMatch;
    
    return best;
  }
  
  const matchCount = getMaxMatching(0, new Set<string>());
  const maxPossible = Math.min(players.length, 5);
  if (maxPossible === 0) return 0;
  return (matchCount / maxPossible) * 100;
}

export interface CompositionStats {
  duelists: number;
  controllers: number;
  initiators: number;
  sentinels: number;
  teamChemistry: number;
  penaltyPct: number; // Cumulative percentage penalty
  warnings: string[];
}

export function computeCompositionStats(players: PlayerEntry[]): CompositionStats {
  const duelists = players.filter(p => p.primaryRole === "DUELIST").length;
  const controllers = players.filter(p => p.primaryRole === "CONTROLLER").length;
  const initiators = players.filter(p => p.primaryRole === "INITIATOR").length;
  const sentinels = players.filter(p => p.primaryRole === "SENTINEL").length;

  let teamChemistry = 0;
  let penaltyMultiplier = 1.0;
  const warnings: string[] = [];

  // 1. Sentinels Penalty (-10%)
  if (sentinels === 0) {
    penaltyMultiplier *= 0.90;
    warnings.push("No Sentinel → weaker defense (-10% OVR)");
  }

  // 2. Controllers Penalty (-15%)
  if (controllers === 0) {
    penaltyMultiplier *= 0.85;
    warnings.push("No Controller → poor map control (-15% OVR)");
  }

  // 3. Initiators Penalty (-10%)
  if (initiators === 0) {
    penaltyMultiplier *= 0.90;
    warnings.push("No Initiator → weak executes (-10% OVR)");
  }

  // 4. Duplicate Duelist Penalty (-8% per extra)
  if (duelists > 1) {
    const extra = duelists - 1;
    penaltyMultiplier *= (1.0 - (extra * 0.08));
    warnings.push(`Duplicate Duelists → duplicate role penalty (-${extra * 8}% OVR)`);
  }

  // Calculate cumulative deduction percentage
  const penaltyPct = Math.round((1.0 - penaltyMultiplier) * 100);

  // Role Balance Chemistry Bonus (+10)
  const hasAllRoles = calculateRoleBalanceScore(players) === 100;
  if (hasAllRoles) {
    teamChemistry += 10;
  }

  return {
    duelists,
    controllers,
    initiators,
    sentinels,
    teamChemistry,
    penaltyPct,
    warnings,
  };
}
