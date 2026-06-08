import type { ChemistryBreakdown, CoachEntry, PlayerEntry } from "@/types/game";
import { calculateRoleBalanceScore } from "./roleBalance";

export function computeChemistry(
  players: PlayerEntry[],
  coach: CoachEntry | null,
): ChemistryBreakdown {
  let organization = 0;
  let region = 0;
  let nationality = 0;

  // 1. Pairwise player bonuses (+4 Same Org, +2 Same Region, +1 Nationality)
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const pA = players[i];
      const pB = players[j];

      if (pA.orgId && pB.orgId && pA.orgId === pB.orgId) {
        organization += 4;
      }
      if (pA.region && pB.region && pA.region === pB.region) {
        region += 2;
      }
      if (pA.nationality && pB.nationality && pA.nationality === pB.nationality) {
        nationality += 1;
      }
    }
  }

  // 2. Coach bonuses (+3 for matching coach org OR coach region)
  let coachOrg = 0;
  let coachRegion = 0;
  if (coach) {
    for (const p of players) {
      if (coach.orgId && p.orgId && coach.orgId === p.orgId) {
        coachOrg += 3;
      } else if (coach.region && p.region && coach.region === p.region) {
        // Only add region bonus if team org doesn't match to avoid double dipping
        coachRegion += 3;
      }
    }
  }

  // 3. Full Historical Team bonus (+5)
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
      fullOrg = 5;
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
