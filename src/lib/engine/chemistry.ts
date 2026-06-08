import type { ChemistryBreakdown, CoachEntry, PlayerEntry } from "@/types/game";
import { calculateRoleBalanceScore } from "./roleBalance";

export function computeChemistry(
  players: PlayerEntry[],
  coach: CoachEntry | null,
): ChemistryBreakdown {
  let organization = 0;
  let region = 0;
  let nationality = 0;

  // 1. Pairwise player bonuses
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const pA = players[i];
      const pB = players[j];

      if (pA.orgId && pB.orgId && pA.orgId === pB.orgId) {
        organization += 3;
      }
      if (pA.region && pB.region && pA.region === pB.region) {
        region += 2;
      }
      if (pA.nationality && pB.nationality && pA.nationality === pB.nationality) {
        nationality += 1;
      }
    }
  }

  // 2. Coach bonuses
  let coachOrg = 0;
  let coachRegion = 0;
  if (coach) {
    for (const p of players) {
      if (coach.orgId && p.orgId && coach.orgId === p.orgId) {
        coachOrg += 2;
      }
      if (coach.region && p.region && coach.region === p.region) {
        coachRegion += 1;
      }
    }
  }

  // 3. Full Historical Team bonus (+10)
  // All 5 players and the coach are from the same organization, year and tournament
  let fullOrg = 0;
  if (coach && players.length === 5) {
    const firstPlayerOrg = players[0].orgId;
    const firstPlayerTour = players[0].tournamentId;
    
    const allPlayersMatch = players.every(
      p => p.orgId === firstPlayerOrg && p.tournamentId === firstPlayerTour
    );
    const coachMatches = coach.orgId === firstPlayerOrg && coach.tournamentId === firstPlayerTour;
    
    if (allPlayersMatch && coachMatches) {
      fullOrg = 10;
    }
  }

  // 4. Role Balance Diversity bonus (+10 if team covers all 5 roles)
  const hasAllRoles = calculateRoleBalanceScore(players) === 100;
  const roleBalance = hasAllRoles ? 10 : 0;

  const total = organization + region + nationality + coachOrg + coachRegion + fullOrg + roleBalance;

  return {
    organization,
    region,
    nationality,
    coachOrg,
    coachRegion,
    fullOrg,
    roleBalance,
    total,
  };
}
