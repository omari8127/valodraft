import React, { useMemo } from "react";
import { motion } from "framer-motion";
import type { BracketMatch } from "@/lib/engine/bracket";
import { Check, Star } from "lucide-react";
import { ORG_BY_ID } from "@/data/regions";

interface PlayoffBracketProps {
  bracket: BracketMatch[][];
  userPicks?: Record<string, string>;
  onPick?: (matchId: string, teamName: string) => void;
  userTeamName?: string;
}

const TeamRow = ({ team, isWinner, isPicked, canPick, onPick, isUserTeam }: any) => {
  const org = team ? ORG_BY_ID[team.orgId || ""] : null;
  const logo = org?.logo || team?.logo || null;

  let rowClass = "flex items-center gap-2 px-2 h-[30px] transition-all relative overflow-hidden ";
  let textClass = "flex-1 text-[11px] font-bold truncate z-20 ";

  if (isUserTeam) {
    rowClass += "bg-[#1a180b] ";
    textClass += "text-[#ffd700]";
  } else if (!team) {
    textClass += "text-[#5e6678] italic font-medium";
  } else {
    textClass += "text-[#A0A7B8]";
  }

  let borderClass = "";
  if (isUserTeam) borderClass = "border border-[#ffd700] absolute inset-0 rounded-[4px] z-10 pointer-events-none";

  return (
    <div 
      className={rowClass + (canPick ? " hover:bg-white/5 cursor-pointer" : " cursor-default")}
      onClick={canPick ? onPick : undefined}
    >
      {borderClass && <div className={borderClass}></div>}
      
      {logo ? (
        <img src={logo} className="w-[14px] h-[14px] object-contain z-20" alt="logo" />
      ) : (
        <div className="w-[14px] h-[14px] z-20" />
      )}
      
      <div className={textClass}>
        {team ? team.name : "TBD"}
      </div>

      <div className="z-20 shrink-0">
        {isWinner && <Star className="w-3 h-3 text-[#ffd700] fill-[#ffd700]" />}
        {!isWinner && isPicked && <Check className="w-3 h-3 text-green-500" />}
      </div>
    </div>
  );
};

const MatchNode = React.memo(({ match, x, y, userPicks, onPick, userTeamName }: any) => {
  const isPickable = !match.result && match.teamA && match.teamB && onPick;
  const pickedTeam = userPicks?.[match.id];

  const isWinnerA = !!(match.winner && match.teamA && match.winner.name === match.teamA.name);
  const isWinnerB = !!(match.winner && match.teamB && match.winner.name === match.teamB.name);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`absolute flex flex-col rounded-[6px] border border-[#1A1D24] shadow-sm p-0.5 gap-[1px] ${match.id === "gf" ? "bg-[#0B0D12]/75 backdrop-blur-xs" : "bg-[#0B0D12]"}`}
      style={{ left: x, top: y, width: 200, height: 65 }}
    >
      <TeamRow 
        team={match.teamA} 
        isWinner={isWinnerA} 
        isPicked={pickedTeam === match.teamA?.name}
        canPick={isPickable}
        onPick={() => isPickable && match.teamA && onPick(match.id, match.teamA.name)}
        isUserTeam={match.teamA?.name === userTeamName}
      />
      <div className="absolute left-0 right-0 top-[32px] h-px bg-[#1A1D24]"></div>
      <TeamRow 
        team={match.teamB} 
        isWinner={isWinnerB} 
        isPicked={pickedTeam === match.teamB?.name}
        canPick={isPickable}
        onPick={() => isPickable && match.teamB && onPick(match.id, match.teamB.name)}
        isUserTeam={match.teamB?.name === userTeamName}
      />
    </motion.div>
  );
});

export function PlayoffBracket({ bracket, userPicks, onPick, userTeamName }: PlayoffBracketProps) {
  const allMatches = useMemo(() => bracket.flat(), [bracket]);
  const getMatch = (id: string) => allMatches.find(m => m.id === id);

  const ubQf1 = getMatch("ub-qf-1"); const ubQf2 = getMatch("ub-qf-2");
  const ubQf3 = getMatch("ub-qf-3"); const ubQf4 = getMatch("ub-qf-4");
  const ubSf1 = getMatch("ub-sf-1"); const ubSf2 = getMatch("ub-sf-2");
  const ubF = getMatch("ub-f");
  
  const lbR1_1 = getMatch("lb-r1-1"); const lbR1_2 = getMatch("lb-r1-2");
  const lbR2_1 = getMatch("lb-r2-1"); const lbR2_2 = getMatch("lb-r2-2");
  const lbR3 = getMatch("lb-sf"); const lbF = getMatch("lb-f");
  const gf = getMatch("gf");

  const activeClass = "stroke-green-400 stroke-[2px] filter drop-shadow-[0_0_2px_rgba(74,222,128,0.5)]";
  const inactiveClass = "stroke-[#5e6678]/80 stroke-[1.5px]";
  
  const pathActive = (fromMatch: BracketMatch | undefined, toMatch: BracketMatch | undefined) => {
    if (!fromMatch || !toMatch) return false;
    return !!fromMatch.winner && (toMatch.teamA?.name === fromMatch.winner.name || toMatch.teamB?.name === fromMatch.winner.name);
  };

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-transparent relative">
      {/* BACKGROUND OVERLAY LAYER */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: "linear-gradient(rgba(11, 13, 18, 0.45), rgba(11, 13, 18, 0.45)), url('/val_bracket_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0
        }}
      />
      <div style={{ width: 1000, height: 520, position: 'relative', zIndex: 1 }}>
        <div 
          className="absolute top-0 left-0 rounded-[8px] overflow-hidden" 
          style={{ 
            width: 1250, 
            height: 650, 
            transform: 'scale(0.8)', 
            transformOrigin: 'top left',
            padding: 0
          }}
        >
          <div className="relative w-full h-full" style={{ zIndex: 1 }}>
          
          {/* COLUMN HEADERS */}
          <div className="absolute top-[18px] left-[0px] text-[10px] font-black text-[#A0A7B8] tracking-widest uppercase">UB QUARTERFINALS</div>
          <div className="absolute top-[18px] left-[250px] text-[10px] font-black text-[#A0A7B8] tracking-widest uppercase">UB SEMIFINALS</div>
          <div className="absolute top-[18px] left-[500px] text-[10px] font-black text-[#A0A7B8] tracking-widest uppercase">UPPER FINAL</div>
          <div className="absolute top-[205px] left-[970px] w-[200px] text-center text-[10px] font-black text-[#ffd700] tracking-widest uppercase">GRAND FINAL</div>
          
          <div className="absolute top-[415px] left-[0px] text-[10px] font-black text-[#8A95A5] tracking-widest uppercase">LOWER BRACKET</div>
          <div className="absolute top-[445px] left-[0px] text-[10px] font-black text-[#A0A7B8] tracking-widest uppercase">LB ROUND 1</div>
          <div className="absolute top-[445px] left-[250px] text-[10px] font-black text-[#A0A7B8] tracking-widest uppercase">LB ROUND 2</div>
          <div className="absolute top-[445px] left-[500px] text-[10px] font-black text-[#A0A7B8] tracking-widest uppercase">LOWER SEMIFINAL</div>
          <div className="absolute top-[445px] left-[750px] text-[10px] font-black text-[#A0A7B8] tracking-widest uppercase">LOWER FINAL</div>

          {/* HORIZONTAL DASHED LINE */}
          <div className="absolute left-[120px] right-0 border-t border-[#1A1D24] border-dashed" style={{ top: 420 }}></div>

          {/* SVG CONNECTING LINES */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none fill-none" style={{ zIndex: 0 }}>
            <path d="M 200 72 L 225 72 L 225 117 L 250 117" className={pathActive(ubQf1, ubSf1) ? activeClass : inactiveClass} />
            <path d="M 200 162 L 225 162 L 225 117 L 250 117" className={pathActive(ubQf2, ubSf1) ? activeClass : inactiveClass} />
            <path d="M 200 282 L 225 282 L 225 327 L 250 327" className={pathActive(ubQf3, ubSf2) ? activeClass : inactiveClass} />
            <path d="M 200 372 L 225 372 L 225 327 L 250 327" className={pathActive(ubQf4, ubSf2) ? activeClass : inactiveClass} />
            <path d="M 450 117 L 475 117 L 475 222 L 500 222" className={pathActive(ubSf1, ubF) ? activeClass : inactiveClass} />
            <path d="M 450 327 L 475 327 L 475 222 L 500 222" className={pathActive(ubSf2, ubF) ? activeClass : inactiveClass} />
            <path d="M 700 222 L 940 222 L 940 362 L 970 362" className={pathActive(ubF, gf) ? activeClass : inactiveClass} />
            
            <path d="M 200 512 L 250 512" className={pathActive(lbR1_1, lbR2_1) ? activeClass : inactiveClass} />
            <path d="M 200 602 L 250 602" className={pathActive(lbR1_2, lbR2_2) ? activeClass : inactiveClass} />
            <path d="M 450 512 L 475 512 L 475 557 L 500 557" className={pathActive(lbR2_1, lbR3) ? activeClass : inactiveClass} />
            <path d="M 450 602 L 475 602 L 475 557 L 500 557" className={pathActive(lbR2_2, lbR3) ? activeClass : inactiveClass} />
            <path d="M 700 557 L 725 557 L 725 557 L 750 557" className={pathActive(lbR3, lbF) ? activeClass : inactiveClass} />
            <path d="M 950 557 L 960 557 L 960 362 L 970 362" className={pathActive(lbF, gf) ? activeClass : inactiveClass} />
          </svg>

          {/* UPPER BRACKET NODES */}
          {ubQf1 && <MatchNode match={ubQf1} x={0} y={40} userPicks={userPicks} onPick={onPick} userTeamName={userTeamName} />}
          {ubQf2 && <MatchNode match={ubQf2} x={0} y={130} userPicks={userPicks} onPick={onPick} userTeamName={userTeamName} />}
          {ubQf3 && <MatchNode match={ubQf3} x={0} y={250} userPicks={userPicks} onPick={onPick} userTeamName={userTeamName} />}
          {ubQf4 && <MatchNode match={ubQf4} x={0} y={340} userPicks={userPicks} onPick={onPick} userTeamName={userTeamName} />}
          {ubSf1 && <MatchNode match={ubSf1} x={250} y={85} userPicks={userPicks} onPick={onPick} userTeamName={userTeamName} />}
          {ubSf2 && <MatchNode match={ubSf2} x={250} y={295} userPicks={userPicks} onPick={onPick} userTeamName={userTeamName} />}
          {ubF && <MatchNode match={ubF} x={500} y={190} userPicks={userPicks} onPick={onPick} userTeamName={userTeamName} />}

          {/* LOWER BRACKET NODES */}
          {lbR1_1 && <MatchNode match={lbR1_1} x={0} y={480} userPicks={userPicks} onPick={onPick} userTeamName={userTeamName} />}
          {lbR1_2 && <MatchNode match={lbR1_2} x={0} y={570} userPicks={userPicks} onPick={onPick} userTeamName={userTeamName} />}
          {lbR2_1 && <MatchNode match={lbR2_1} x={250} y={480} userPicks={userPicks} onPick={onPick} userTeamName={userTeamName} />}
          {lbR2_2 && <MatchNode match={lbR2_2} x={250} y={570} userPicks={userPicks} onPick={onPick} userTeamName={userTeamName} />}
          {lbR3 && <MatchNode match={lbR3} x={500} y={525} userPicks={userPicks} onPick={onPick} userTeamName={userTeamName} />}
          {lbF && <MatchNode match={lbF} x={750} y={525} userPicks={userPicks} onPick={onPick} userTeamName={userTeamName} />}

          {/* GRAND FINAL NODE */}
          {gf && (
            <div className="absolute inset-0 pointer-events-none" style={{ transform: 'translate(80px, 12px)' }}>
              <div className="pointer-events-auto">
                <MatchNode match={gf} x={970} y={330} userPicks={userPicks} onPick={onPick} userTeamName={userTeamName} />
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
