import React, { useEffect } from "react";
import type { BracketMatch } from "@/lib/engine/bracket";
import type { MatchTeam } from "@/lib/engine/match/MatchEngine";
import { ROUND_LABEL } from "@/lib/engine/bracket";
import { Trophy } from "lucide-react";

interface BracketSimulationProps {
  bracket: BracketMatch[][];
  playerTeam: MatchTeam;
  eliminatedRoundIdx: number; // The index of the round where the player was eliminated
}

export function BracketSimulation({ bracket, playerTeam, eliminatedRoundIdx }: BracketSimulationProps) {
  // We want to show at most the last 3 rounds: Quarters, Semis, Finals
  // Or all rounds if bracket length is <= 3
  const visibleRoundsCount = Math.min(3, bracket.length);
  const startIdx = bracket.length - visibleRoundsCount;
  const visibleBracket = bracket.slice(startIdx);
  
  const championMatch = bracket[bracket.length - 1][0];
  const champion = championMatch?.winner;
  
  // Automatically scroll to a better viewing position
  useEffect(() => {
    const el = document.querySelector(".bracket-container");
    if (el) {
      el.scrollLeft = el.scrollWidth / 4;
    }
  }, []);

  return (
    <div className="bracket-wrapper w-full mt-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-display font-bold uppercase tracking-widest text-primary mb-2">
          Tournament Bracket Simulation
        </h2>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">
          How the rest of the tournament played out
        </p>
      </div>

      <div className="bracket-container">
        <div className="bracket-inner">
        {visibleBracket.map((roundMatches, idx) => {
          const originalRoundIdx = startIdx + idx;
          const stageLabel = ROUND_LABEL(originalRoundIdx + 1, bracket.length);
          
          return (
            <div key={originalRoundIdx} className="flex flex-col min-w-[260px] snap-center">
              <div className="text-center text-xs font-bold text-muted-foreground mb-6 uppercase tracking-widest border-b border-border/30 pb-2">
                {stageLabel}
              </div>
              
              <div className="flex flex-col justify-around flex-1 gap-6">
                {roundMatches.map((m) => {
                  if (!m.teamA || !m.teamB || !m.result) return null;
                  
                  const isPlayerA = m.teamA.name === playerTeam.name;
                  const isPlayerB = m.teamB.name === playerTeam.name;
                  const isUserMatch = isPlayerA || isPlayerB;
                  const isEliminationMatch = isUserMatch && originalRoundIdx === eliminatedRoundIdx;
                  
                  const winnerA = m.winner === m.teamA;
                  const winnerB = m.winner === m.teamB;

                  return (
                    <div key={m.id} className="relative group">
                      {isEliminationMatch && (
                        <div className="absolute -top-6 left-0 right-0 text-center">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                            You were eliminated here
                          </span>
                        </div>
                      )}
                      
                      <div className={`
                        flex flex-col text-sm border 
                        ${isEliminationMatch ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-border/40'}
                        bg-background/80 overflow-hidden
                      `}>
                        {/* Team A */}
                        <div className={`flex justify-between items-center px-4 py-2 border-b border-border/20 ${winnerA ? 'bg-primary/5' : 'opacity-60'}`}>
                          <span className={`font-bold truncate pr-2 ${winnerA ? 'text-primary drop-shadow-[0_0_5px_rgba(var(--primary),0.5)]' : 'text-muted-foreground'}`}>
                            {m.teamA.name}
                          </span>
                          <span className={`font-display text-lg ${winnerA ? 'text-white' : 'text-white/40'}`}>
                            {m.result.scoreA}
                          </span>
                        </div>
                        
                        {/* Team B */}
                        <div className={`flex justify-between items-center px-4 py-2 ${winnerB ? 'bg-primary/5' : 'opacity-60'}`}>
                          <span className={`font-bold truncate pr-2 ${winnerB ? 'text-primary drop-shadow-[0_0_5px_rgba(var(--primary),0.5)]' : 'text-muted-foreground'}`}>
                            {m.teamB.name}
                          </span>
                          <span className={`font-display text-lg ${winnerB ? 'text-white' : 'text-white/40'}`}>
                            {m.result.scoreB}
                          </span>
                        </div>
                      </div>
                      
                      {/* Connection Lines (Desktop only) */}
                      {idx < visibleBracket.length - 1 && (
                        <div className="hidden md:block absolute top-1/2 -right-4 w-4 h-[1px] bg-border/50"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Champion Block */}
        <div className="flex flex-col min-w-[240px] snap-center justify-center pl-4 md:pl-8 border-t border-border/20 md:border-t-0 md:border-l border-border/40 pt-8 md:pt-0">
          <div className="text-center">
            <Trophy className="w-12 h-12 text-gold mx-auto mb-4 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]" />
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">
              Tournament Champion
            </div>
            {champion ? (
              <div className="font-display text-3xl text-gold mb-2 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">
                {champion.name}
              </div>
            ) : (
              <div className="text-muted-foreground">TBD</div>
            )}
            {championMatch?.result?.mvp && (
              <div className="text-xs text-white/60 uppercase tracking-widest mt-4">
                Finals MVP: <span className="font-bold text-white">{championMatch.result.mvp.name}</span>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
