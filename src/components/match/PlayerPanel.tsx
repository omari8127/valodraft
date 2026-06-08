import type { MatchTeam } from "@/lib/engine/match/MatchEngine";
import { AgentRow } from "./AgentRow";

interface Props {
  teamA: MatchTeam;
  teamB: MatchTeam;
}

export function PlayerPanel({ teamA, teamB }: Props) {
  // Assuming teams are sorted or structured similarly by role.
  // Let's sort them by role standard DRAFT_ORDER to match them up.
  const order = ["DUELIST", "INITIATOR", "CONTROLLER", "SENTINEL", "FLEX", "COACH"];

  const sortedA = [...teamA.players].sort((a, b) => order.indexOf(a.role) - order.indexOf(b.role));
  const sortedB = [...teamB.players].sort((a, b) => order.indexOf(a.role) - order.indexOf(b.role));

  return (
    <div className="flex flex-col gap-2 w-full mt-4">
      {sortedA.map((pA, idx) => {
        const pB = sortedB[idx];
        if (!pB) return null;

        return (
          <div
            key={idx}
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-border/40 pb-2"
          >
            {/* Team A Player */}
            <div className="flex items-center gap-3 justify-end text-right">
              <div className="flex flex-col items-end">
                <span className="font-display text-sm truncate max-w-[120px]">{pA.name}</span>
                <span className="text-[10px] text-muted-foreground font-bold">{pA.rating} OVR</span>
              </div>
              <AgentRow agent={pA.agent} />
            </div>

            {/* Role / VS */}
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary w-20 text-center">
              {pA.role}
            </div>

            {/* Team B Player */}
            <div className="flex items-center gap-3 justify-start text-left">
              <AgentRow agent={pB.agent} />
              <div className="flex flex-col items-start">
                <span className="font-display text-sm truncate max-w-[120px]">{pB.name}</span>
                <span className="text-[10px] text-muted-foreground font-bold">{pB.rating} OVR</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
