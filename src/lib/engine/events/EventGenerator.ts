import type { MatchTeam } from "../match/MatchEngine";
import { NarrativeEngine } from "./NarrativeEngine";
import type { EventType, EventPhase } from "./EventTemplates";

// Capitalize the first letter of a string
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export class EventGenerator {
  private narrative = new NarrativeEngine();

  // Helper to pick a player from a team based on role logic
  private pickPlayer(
    team: MatchTeam,
    preferRole?: "DUELIST" | "SENTINEL" | "INITIATOR" | "CONTROLLER",
  ) {
    let pool = team.players;
    if (preferRole) {
      const rolePool = team.players.filter((p) => p.role === preferRole);
      if (rolePool.length > 0 && Math.random() < 0.7) {
        pool = rolePool; // 70% chance to respect role preference
      }
    }
    // Weight by rating. Exponentiate to skew heavily towards high OVR.
    pool.sort((a, b) => b.rating - a.rating);
    const skew = (preferRole as string) === "MULTI_KILL_ROLE" ? 2.5 : 1.8; // Higher skew for multi-kills
    const index = Math.floor(Math.pow(Math.random(), skew) * pool.length);
    const player = pool[index];
    const agent = player.mostPlayedAgents?.[0]
      ? capitalize(player.mostPlayedAgents[0])
      : "su Agente";
    return { player, agent };
  }

  public generateRoundEvent(
    winnerTeam: MatchTeam,
    loserTeam: MatchTeam,
    round: number,
    isClutch: boolean,
    isMatchPoint: boolean,
  ): { type: EventType; text: string; agent?: string; player?: string } {
    let phase: "EARLY" | "MID" | "LATE" | "FINISH" = "EARLY";
    if (round > 4 && round < 10) phase = "MID";
    if (round >= 10) phase = "LATE";

    let eventType: EventType = "ROUND";
    let text = "";
    let eventPlayer = "";
    let eventAgent = "";

    // Specific Override Events
    if (isMatchPoint) {
      eventType = "MATCH_POINT";
      const { player, agent } = this.pickPlayer(winnerTeam);
      eventPlayer = player.name;
      eventAgent = agent;
      text = this.narrative.getLine("FINISH", {
        player: player.name,
        team: winnerTeam.name,
        agent,
      });
    } else if (isClutch) {
      // Clutches are rare and favor sentinels and controllers
      eventType = "CLUTCH";
      const { player, agent } = this.pickPlayer(winnerTeam, "SENTINEL");
      eventPlayer = player.name;
      eventAgent = agent;
      text = this.narrative.getLine("CLUTCH", {
        player: player.name,
        team: winnerTeam.name,
        agent,
      });
    } else if (Math.random() < 0.05) {
      // 5% chance of an ACE
      eventType = "ACE";
      const { player, agent } = this.pickPlayer(winnerTeam, "DUELIST");
      eventPlayer = player.name;
      eventAgent = agent;
      text = this.narrative.getLine("ACE", { player: player.name, team: winnerTeam.name, agent });
    } else {
      // Pick standard events based on RNG
      const rng = Math.random();
      // Add slight randomness to events (±5% variance factored in through Math.random() thresholds)
      if (rng < 0.25) {
        eventType = "MULTI_KILL";
        const { player, agent } = this.pickPlayer(winnerTeam, "DUELIST" as any); // use high skew internally
        eventPlayer = player.name;
        eventAgent = agent;
        text = this.narrative.getLine("MULTI_KILL", { player: player.name, team: winnerTeam.name, agent });
      } else if (rng < 0.40) {
        eventType = "KILL";
        const { player, agent } = this.pickPlayer(winnerTeam);
        eventPlayer = player.name;
        eventAgent = agent;
        text = this.narrative.getLine("KILL", { player: player.name, team: winnerTeam.name, agent });
      } else if (rng < 0.65) {
        eventType = "SPIKE_PLANT";
        const { player, agent } = this.pickPlayer(winnerTeam, "INITIATOR");
        eventPlayer = player.name;
        eventAgent = agent;
        text = this.narrative.getLine("SPIKE_PLANT", { player: player.name, team: winnerTeam.name, agent });
      } else if (rng < 0.85) {
        eventType = "SPIKE_DEFUSE";
        const { player, agent } = this.pickPlayer(winnerTeam, "CONTROLLER");
        eventPlayer = player.name;
        eventAgent = agent;
        text = this.narrative.getLine("SPIKE_DEFUSE", { player: player.name, team: winnerTeam.name, agent });
      } else {
        const preferRole = phase === "EARLY" ? "DUELIST" : phase === "MID" ? "CONTROLLER" : "INITIATOR";
        const preferRoleType = preferRole as "DUELIST" | "SENTINEL" | "INITIATOR" | "CONTROLLER";
        const { player, agent } = this.pickPlayer(winnerTeam, preferRoleType);
        eventPlayer = player.name;
        eventAgent = agent;
        text = this.narrative.getLine(phase, { player: player.name, team: winnerTeam.name, agent });
      }
    }

    return { type: eventType, text, agent: eventAgent, player: eventPlayer };
  }
}
