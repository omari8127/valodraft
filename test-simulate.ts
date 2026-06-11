import { MatchEngine } from "./src/lib/engine/match/MatchEngine";
import { TEAM_ENTRIES } from "./src/data/generate";
import { teamEntryToMatchTeam } from "./src/lib/engine/bracket";

const engine = new MatchEngine();
const teamA = teamEntryToMatchTeam(TEAM_ENTRIES[0]);
const teamB = teamEntryToMatchTeam(TEAM_ENTRIES[1]);

console.log("Simulating match...");
try {
  const result = engine.simulate(teamA, teamB, "STRICT");
  console.log("Match simulated successfully!", result.scoreA, "-", result.scoreB);
} catch (e) {
  console.error("Match simulation crashed!");
  console.error(e);
}
