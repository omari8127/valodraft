import * as fs from "fs";
import { REAL_ROSTERS } from "./src/data/realRosters";

const playerRoles: Record<string, Record<string, number>> = {};

for (const [tournamentId, teams] of Object.entries(REAL_ROSTERS)) {
  for (const [teamId, roster] of Object.entries(teams)) {
    for (const player of roster.players) {
      if (!playerRoles[player.name]) {
        playerRoles[player.name] = {};
      }
      playerRoles[player.name][player.role] = (playerRoles[player.name][player.role] || 0) + 1;
    }
  }
}

const sortedPlayers = Object.entries(playerRoles).map(([name, roles]) => {
  const sorted = Object.entries(roles).sort((a, b) => b[1] - a[1]);
  return {
    name,
    primaryRole: sorted[0][0],
    roles: sorted.map(([r, count]) => `${r}(${count})`).join(", "),
  };
}).sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync("players-list.json", JSON.stringify(sortedPlayers, null, 2));
console.log("Wrote players-list.json successfully");

