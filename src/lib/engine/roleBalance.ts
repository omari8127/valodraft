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

export interface CompositionStats {
  duelists: number;
  controllers: number;
  initiators: number;
  sentinels: number;
  defense: number;
  siteHold: number;
  mapControl: number;
  utility: number;
  teamChemistry: number;
  penalty: number;
  warnings: string[];
}

export function computeCompositionStats(players: PlayerEntry[]): CompositionStats {
  const duelists = players.filter(p => p.primaryRole === "DUELIST").length;
  const controllers = players.filter(p => p.primaryRole === "CONTROLLER").length;
  const initiators = players.filter(p => p.primaryRole === "INITIATOR").length;
  const sentinels = players.filter(p => p.primaryRole === "SENTINEL").length;

  let defense = 100;
  let siteHold = 100;
  let mapControl = 100;
  let utility = 100;
  let teamChemistry = 0;
  let penalty = 0;
  const warnings: string[] = [];

  // 1. Sentinels Penalty
  if (sentinels === 0) {
    defense -= 20;
    siteHold -= 25;
    penalty += 15;
    warnings.push("No Sentinel → weaker defense (-15 TSS)");
  }

  // 2. Controllers Penalty
  if (controllers === 0) {
    mapControl -= 20;
    penalty += 12;
    warnings.push("No Controller → poor map control (-12 TSS)");
  }

  // 3. Initiators Penalty
  if (initiators === 0) {
    utility -= 15;
    penalty += 10;
    warnings.push("No Initiator → weak executes (-10 TSS)");
  }

  // 4. Role Balance Bonus
  const hasAllRoles = calculateRoleBalanceScore(players) === 100;
  if (hasAllRoles) {
    teamChemistry += 10;
  }

  return {
    duelists,
    controllers,
    initiators,
    sentinels,
    defense,
    siteHold,
    mapControl,
    utility,
    teamChemistry,
    penalty,
    warnings,
  };
}
