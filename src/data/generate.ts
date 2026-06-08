import type { CoachEntry, PlayerEntry, TeamEntry } from "@/types/game";
import { ORG_BY_ID } from "./regions";
import { TOURNAMENT_ATTENDANCE } from "./tournaments";
import { REAL_ROSTERS } from "./realRosters";
import { AGENTS_BY_ROLE } from "./agents";

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

    const realRoster = REAL_ROSTERS[tournamentId]?.[orgId];
    if (!realRoster) {
      throw new Error(`Real roster not found for tournament ${tournamentId} and org ${orgId}`);
    }

    const players: PlayerEntry[] = realRoster.players.map((rp) => {
      // 1. Resolve role (primaryRole)
      const resolvedRole = rp.primaryRole;

      // 2. Pick 2 random agents matching their role
      let availableAgents =
        AGENTS_BY_ROLE[
          resolvedRole === "FLEX" ? "INITIATOR" : (resolvedRole as keyof typeof AGENTS_BY_ROLE)
        ] || AGENTS_BY_ROLE.DUELIST;
      availableAgents = [...availableAgents].sort(() => Math.random() - 0.5);
      const mostPlayedAgents = availableAgents.slice(0, 2);
      const agent = mostPlayedAgents[0] || "jett";

      return {
        id: `${orgId}-${tournamentId}-${resolvedRole.toLowerCase()}`,
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
      id: `${orgId}-${tournamentId}`,
      orgId,
      tournamentId,
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
