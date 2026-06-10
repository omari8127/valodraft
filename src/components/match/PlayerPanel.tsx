import type { MatchTeam } from "@/lib/engine/match/MatchEngine";
import { AgentRow } from "./AgentRow";

interface Props {
  teamA: MatchTeam;
  teamB: MatchTeam;
}

const order = ["DUELIST", "INITIATOR", "CONTROLLER", "SENTINEL", "FLEX", "COACH"];

function sortPlayers(team: MatchTeam) {
  return [...team.players].sort((a, b) => order.indexOf(a.role) - order.indexOf(b.role));
}

export function PlayerPanel({ teamA, teamB }: Props) {
  const sortedA = sortPlayers(teamA);
  const sortedB = sortPlayers(teamB);

  return (
    <div className="w-full mt-4">
      <div className="flex flex-col gap-2 w-full">
        {sortedA.map((pA, idx) => {
          const pB = sortedB[idx];
          if (!pB) return null;

          return (
            <div
              key={idx}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-border/40 pb-2"
            >
              <div className="flex items-center gap-3 justify-end text-right">
                <div className="flex flex-col items-end">
                  <span className="font-display text-lg truncate max-w-[140px]">{pA.name}</span>
                  <span className="text-[10px] text-muted-foreground font-bold">{pA.rating} OVR</span>
                </div>
              </div>

              <div className="text-[10px] font-bold uppercase tracking-widest text-primary w-20 text-center">
                {pA.role}
              </div>

              <div className="flex items-center gap-3 justify-start text-left">
                <div className="flex flex-col items-start">
                  <span className="font-display text-lg truncate max-w-[140px]">{pB.name}</span>
                  <span className="text-[10px] text-muted-foreground font-bold">{pB.rating} OVR</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="agent-vs-strip mt-5 clip-corner border border-border/60 bg-background/60 px-3 py-2.5">
        <div className="agent-vs-group justify-start">
          {sortedA.map((player) => (
            <div key={`left-${player.id}`} className="agent-vs-card" title={`${player.name} · ${player.agent ?? "Agent"}`}>
              <AgentRow agent={player.agent} compact />
              <span className="agent-vs-role">{player.role.slice(0, 3)}</span>
            </div>
          ))}
        </div>
        <div className="agent-vs-center">VS</div>
        <div className="agent-vs-group justify-end">
          {sortedB.map((player) => (
            <div key={`right-${player.id}`} className="agent-vs-card" title={`${player.name} · ${player.agent ?? "Agent"}`}>
              <AgentRow agent={player.agent} compact />
              <span className="agent-vs-role">{player.role.slice(0, 3)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
