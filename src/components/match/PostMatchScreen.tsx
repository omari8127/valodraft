import React, { useMemo } from "react";
import { motion } from "framer-motion";
import type { MatchResult } from "@/lib/engine/match/MatchEngine";
import { Trophy, ArrowRight } from "lucide-react";

interface Props {
  result: MatchResult;
  onContinue: () => void;
  teamA_OVR: number;
  teamB_OVR: number;
}

const StatRow = React.memo(({ p, stats, isLeft }: any) => {
  if (!stats) return null;
  return (
    <div className={`flex items-center text-xs px-2 py-1.5 border-b border-border/20 ${isLeft ? 'flex-row' : 'flex-row-reverse'} hover:bg-white/5`}>
      <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-[8px] font-bold mx-2 shrink-0">
        {p.name.substring(0, 2).toUpperCase()}
      </div>
      <div className={`flex-1 font-bold truncate ${isLeft ? 'text-left' : 'text-right'}`}>{p.name}</div>
      <div className="flex gap-3 font-mono text-[10px] text-muted-foreground w-36 justify-between">
        <span className="w-8 text-center text-white/80">{stats.kills}/{stats.deaths}</span>
        <span className="w-8 text-center">{stats.adr}</span>
        <span className="w-8 text-center">{stats.kast}%</span>
        <span className={`w-8 text-center font-bold ${stats.rating >= 1.0 ? 'text-primary' : ''}`}>{stats.rating.toFixed(2)}</span>
      </div>
    </div>
  );
});

export function PostMatchScreen({ result, onContinue, teamA_OVR, teamB_OVR }: Props) {
  const { teamA, teamB, scoreA, scoreB, mapName, mvp, playerStats } = result;
  
  const analysis = useMemo(() => {
    let text = "";
    const isUpset = (scoreA > scoreB && teamB_OVR > teamA_OVR + 3) || (scoreB > scoreA && teamA_OVR > teamB_OVR + 3);
    const expected = (scoreA > scoreB && teamA_OVR > teamB_OVR) || (scoreB > scoreA && teamB_OVR > teamA_OVR);
    
    if (isUpset) text += "A massive upset as the underdogs outmaneuvered their heavily favored opponents. ";
    else if (expected) text += "A clinical, expected victory from the favorites. ";
    else text += "A closely contested battle between evenly matched rosters. ";

    if (mvp && playerStats[mvp.name]) {
      const ms = playerStats[mvp.name];
      text += `${mvp.name} took over the server with ${ms.kills} kills and ${ms.adr} ADR. `;
    }

    text += `The veto onto ${mapName} clearly favored the winning side's composition.`;
    return text;
  }, [scoreA, scoreB, teamA_OVR, teamB_OVR, mvp, playerStats, mapName]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-5xl px-4 py-8 flex flex-col min-h-[calc(100vh-80px)]"
    >
      {/* HEADER & SUBHEADER */}
      <div className="text-center mb-8 flex flex-col items-center">
         <div className="flex items-center justify-center gap-6 mb-2 w-full max-w-2xl mx-auto border-b border-border/30 pb-6">
            <div className="flex-1 flex items-center justify-end gap-3 text-right">
               <div className="font-display text-3xl text-white uppercase truncate">{teamA.name}</div>
               <div className="w-10 h-10 bg-white/10 flex items-center justify-center font-bold text-xs clip-corner shrink-0 text-white/50">{teamA.name.substring(0,3).toUpperCase()}</div>
            </div>
            
            <div className="font-display text-6xl tracking-widest text-primary shrink-0 px-4">
              {scoreA} <span className="text-white/20 px-2">—</span> {scoreB}
            </div>
            
            <div className="flex-1 flex items-center justify-start gap-3 text-left">
               <div className="w-10 h-10 bg-white/10 flex items-center justify-center font-bold text-xs clip-corner shrink-0 text-white/50">{teamB.name.substring(0,3).toUpperCase()}</div>
               <div className="font-display text-3xl text-white uppercase truncate">{teamB.name}</div>
            </div>
         </div>
         
         <div className="flex flex-col items-center">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">MATCH RESULT</div>
            <div className="text-sm font-bold tracking-widest text-muted-foreground uppercase">{mapName} (DECIDER)</div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
        {/* MVP CARD (LEFT) */}
        {mvp && playerStats[mvp.name] && (
          <div className="md:col-span-4 clip-corner border border-primary/50 bg-primary/10 backdrop-blur p-5 shadow-[0_0_30px_rgba(var(--color-primary),0.15)] flex flex-col justify-center items-center text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
             
             <Trophy className="w-8 h-8 text-primary mb-3" />
             <div className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">MATCH MVP</div>
             
             <div className="w-20 h-20 rounded-full bg-surface border-2 border-primary/50 flex items-center justify-center text-3xl font-display text-white mb-3 shadow-[inset_0_0_20px_rgba(var(--primary),0.3)]">
               {mvp.name.substring(0, 2).toUpperCase()}
             </div>
             
             <div className="font-display text-4xl text-white mb-4">{mvp.name}</div>
             
             <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-left w-full px-4 border-t border-primary/20 pt-4">
                <div>
                  <div className="text-[8px] uppercase tracking-widest text-muted-foreground">K/D</div>
                  <div className="font-mono font-bold text-white text-sm">{playerStats[mvp.name].kills}/{playerStats[mvp.name].deaths}</div>
                </div>
                <div>
                  <div className="text-[8px] uppercase tracking-widest text-muted-foreground">ADR</div>
                  <div className="font-mono font-bold text-white text-sm">{playerStats[mvp.name].adr}</div>
                </div>
                <div>
                  <div className="text-[8px] uppercase tracking-widest text-muted-foreground">KAST</div>
                  <div className="font-mono font-bold text-white text-sm">{playerStats[mvp.name].kast}%</div>
                </div>
                <div>
                  <div className="text-[8px] uppercase tracking-widest text-muted-foreground">RATING</div>
                  <div className="font-mono font-bold text-primary text-sm">{playerStats[mvp.name].rating.toFixed(2)}</div>
                </div>
             </div>
          </div>
        )}

        {/* STATS TABLE (RIGHT) */}
        <div className="md:col-span-8 flex flex-col gap-4">
           
           <div className="clip-corner border border-border bg-surface/40 p-4">
             <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 text-center border-b border-white/5 pb-2">Analysis</div>
             <div className="text-xs text-white/70 leading-relaxed italic border-l-2 border-primary/50 pl-3">
               "{analysis}"
             </div>
           </div>
           
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 flex-1">
              {/* TEAM A STATS */}
              <div className="border border-border/50 bg-black/40 flex flex-col p-2">
                 <div className="text-[9px] font-bold uppercase tracking-widest text-white/50 text-center mb-2">{teamA.name}</div>
                 <div className="flex text-[8px] uppercase tracking-widest text-muted-foreground px-2 pb-1 border-b border-white/5 mb-1">
                    <div className="w-10"></div>
                    <div className="flex-1">PLAYER</div>
                    <div className="flex gap-3 w-36 justify-between">
                       <span className="w-8 text-center">K/D</span>
                       <span className="w-8 text-center">ADR</span>
                       <span className="w-8 text-center">KST</span>
                       <span className="w-8 text-center">RTG</span>
                    </div>
                 </div>
                 <div className="flex-1 space-y-0.5">
                   {teamA.players.map(p => (
                     <StatRow key={p.name} p={p} stats={playerStats[p.name]} isLeft={true} />
                   ))}
                 </div>
              </div>

              {/* TEAM B STATS */}
              <div className="border border-border/50 bg-black/40 flex flex-col p-2">
                 <div className="text-[9px] font-bold uppercase tracking-widest text-white/50 text-center mb-2">{teamB.name}</div>
                 <div className="flex text-[8px] uppercase tracking-widest text-muted-foreground px-2 pb-1 border-b border-white/5 mb-1 flex-row-reverse">
                    <div className="w-10"></div>
                    <div className="flex-1 text-right">PLAYER</div>
                    <div className="flex gap-3 w-36 justify-between flex-row-reverse">
                       <span className="w-8 text-center">RTG</span>
                       <span className="w-8 text-center">KST</span>
                       <span className="w-8 text-center">ADR</span>
                       <span className="w-8 text-center">K/D</span>
                    </div>
                 </div>
                 <div className="flex-1 space-y-0.5">
                   {teamB.players.map(p => (
                     <StatRow key={p.name} p={p} stats={playerStats[p.name]} isLeft={false} />
                   ))}
                 </div>
              </div>
           </div>

        </div>
      </div>

      <div className="flex justify-center mt-auto">
        <button 
          onClick={onContinue}
          className="group relative clip-corner bg-primary text-primary-foreground font-display text-2xl tracking-widest px-12 py-5 flex items-center justify-center gap-3 overflow-hidden shadow-[0_0_30px_rgba(var(--color-primary),0.2)] hover:shadow-[0_0_40px_rgba(var(--color-primary),0.4)] transition-all duration-300 cursor-pointer"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <span className="relative z-10">CONTINUE</span>
          <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </motion.div>
  );
}
