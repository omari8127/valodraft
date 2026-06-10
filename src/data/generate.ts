import type { CoachEntry, PlayerEntry, TeamEntry } from "@/types/game";
import { ORG_BY_ID } from "./regions";
import { TOURNAMENT_ATTENDANCE, TOURNAMENT_BY_ID } from "./tournaments";
import { REAL_ROSTERS } from "./realRosters";
import { AGENTS_BY_ROLE } from "./agents";

function seededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 1000) / 1000;
}

const TEAM_ENTRIES: TeamEntry[] = [];
const PLAYER_ENTRIES: PlayerEntry[] = [];
const COACH_ENTRIES: CoachEntry[] = [];

for (const [tournamentId, orgIds] of Object.entries(TOURNAMENT_ATTENDANCE)) {
  for (const orgId of orgIds) {
    const org = ORG_BY_ID[orgId];
    if (!org) {
      console.warn(`Org not found: ${orgId}`);
      continue;
    }

    const tour = TOURNAMENT_BY_ID[tournamentId];
    const year = tour?.year ?? 2025;
    const teamId = `${orgId}_${year}`;

    if (TEAM_ENTRIES.some(t => t.id === teamId)) {
      continue; // skip duplicate
    }

    const realRoster = REAL_ROSTERS[tournamentId]?.[orgId];
    if (!realRoster) {
      throw new Error(`Real roster not found for tournament ${tournamentId} and org ${orgId}`);
    }

    const players: PlayerEntry[] = realRoster.players.map((rp, index) => {
      // 1. Resolve role (primaryRole)
      const resolvedRole = rp.primaryRole;

      // 2. Pick 2 deterministic agents matching their role
      let availableAgents =
        AGENTS_BY_ROLE[
          resolvedRole === "FLEX" ? "INITIATOR" : (resolvedRole as keyof typeof AGENTS_BY_ROLE)
        ] || AGENTS_BY_ROLE.DUELIST;
      
      const seedValue = seededRandom(rp.name + tournamentId);
      const agentCount = availableAgents.length;
      const index1 = Math.floor(seedValue * agentCount);
      const index2 = Math.floor(((seedValue * 13) % 1) * agentCount);
      
      const mostPlayedAgents = [
        availableAgents[index1],
        availableAgents[index2 !== index1 ? index2 : (index1 + 1) % agentCount]
      ].filter(Boolean);
      const agent = mostPlayedAgents[0] || "jett";

      const safeName = rp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      return {
        id: `${orgId}-${tournamentId}-${safeName || "player"}-${index}`,
        name: rp.name,
        orgId,
        tournamentId,
        role: resolvedRole, // backward compatibility
        primaryRole: rp.primaryRole,
        secondaryRole: rp.secondaryRole,
        rating: rp.rating,
        region: org.region,
        nationality: rp.nationality,
        mostPlayedAgents,
        agent,
      };
    });

    const coach: CoachEntry = {
      id: `${orgId}-${tournamentId}-coach`,
      name: realRoster.coach.name,
      orgId,
      tournamentId,
      rating: realRoster.coach.rating,
      region: org.region,
    };

    const avg = players.reduce((s, p) => s + p.rating, 0) / 5;
    const teamEntry: TeamEntry = {
      id: teamId,
      orgId,
      tournamentId,
      name: org.name,
      year: year,
      displayName: `${org.name} ${year}`.trim(),
      region: org.region,
      players,
      coach,
      avgRating: Math.round(avg),
    };
    TEAM_ENTRIES.push(teamEntry);
    PLAYER_ENTRIES.push(...players);
    COACH_ENTRIES.push(coach);
  }
}

export { TEAM_ENTRIES, PLAYER_ENTRIES, COACH_ENTRIES };

export const TEAM_ENTRY_BY_ID: Record<string, TeamEntry> = Object.fromEntries(
  TEAM_ENTRIES.map((t) => [t.id, t]),
);
export const PLAYER_BY_ID: Record<string, PlayerEntry> = Object.fromEntries(
  PLAYER_ENTRIES.map((p) => [p.id, p]),
);
export const COACH_BY_ID: Record<string, CoachEntry> = Object.fromEntries(
  COACH_ENTRIES.map((c) => [c.id, c]),
);
