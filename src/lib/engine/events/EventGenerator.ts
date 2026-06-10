import type { MatchTeam } from "../match/MatchEngine";
import type { EventType } from "./EventTemplates";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export class EventGenerator {
  private pickPlayer(team: MatchTeam, preferRole?: "DUELIST" | "SENTINEL" | "INITIATOR" | "CONTROLLER") {
    let pool = team.players;
    if (preferRole) {
      const rolePool = team.players.filter((p) => p.role === preferRole);
      if (rolePool.length > 0 && Math.random() < 0.7) pool = rolePool;
    }
    pool.sort((a, b) => b.rating - a.rating);
    const skew = (preferRole as string) === "MULTI_KILL_ROLE" ? 2.5 : 1.8;
    const index = Math.floor(Math.pow(Math.random(), skew) * pool.length);
    const player = pool[index] || team.players[0];
    const agent = player?.mostPlayedAgents?.[0] ? capitalize(player.mostPlayedAgents[0]) : "Agente";
    return { player, agent };
  }

  public generateRoundEvent(
    winnerTeam: MatchTeam,
    loserTeam: MatchTeam,
    round: number,
    isClutch: boolean,
    isMatchPoint: boolean,
    roundType: "CLEAN" | "TRADE_HEAVY" | "ECO_UPSET" | "CLUTCH" | "DOMINANT" | "CHAOS_UPSET"
  ): { type: EventType; text: string; agent?: string; player?: string } {
    
    let eventType: EventType = "ROUND";
    let eventPlayer = "";
    let eventAgent = "";
    let actionDesc = "";

    if (isMatchPoint) {
      eventType = "MATCH_POINT";
      const { player, agent } = this.pickPlayer(winnerTeam);
      eventPlayer = player.name;
      eventAgent = agent;
      actionDesc = `Match point secured by ${player.name}`;
    } else if (roundType === "CLUTCH") {
      eventType = "CLUTCH";
      const { player, agent } = this.pickPlayer(winnerTeam, "SENTINEL");
      eventPlayer = player.name;
      eventAgent = agent;
      const clutchType = Math.random() > 0.5 ? "1v2" : "1v3";
      actionDesc = `insane ${clutchType} clutch by ${player.name}`;
    } else if (roundType === "ECO_UPSET") {
      eventType = "THRIFTY";
      const { player, agent } = this.pickPlayer(winnerTeam);
      eventPlayer = player.name;
      eventAgent = agent;
      actionDesc = `eco win, crucial opener by ${player.name}`;
    } else if (roundType === "DOMINANT") {
      eventType = "FLAWLESS";
      const { player, agent } = this.pickPlayer(winnerTeam, "DUELIST");
      eventPlayer = player.name;
      eventAgent = agent;
      actionDesc = Math.random() > 0.8 ? `ACE by ${player.name}` : `flawless execute, 3K by ${player.name}`;
      if (actionDesc.includes("ACE")) eventType = "ACE";
    } else if (roundType === "CHAOS_UPSET") {
      eventType = "ROUND";
      const { player, agent } = this.pickPlayer(winnerTeam, "FLEX" as any);
      eventPlayer = player.name;
      eventAgent = agent;
      actionDesc = `chaotic scramble, ${player.name} survives the trade war`;
    } else {
      eventType = "ROUND";
      const { player, agent } = this.pickPlayer(winnerTeam);
      eventPlayer = player.name;
      eventAgent = agent;
      actionDesc = Math.random() > 0.5 ? `clean post-plant from ${player.name}` : `heavy trades, ${player.name} secures the site`;
    }

    const text = `${winnerTeam.name} wins round (${actionDesc})`;

    return { type: eventType, text, agent: eventAgent, player: eventPlayer };
  }
}
