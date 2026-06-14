import React, { useMemo } from "react";
import type { BracketMatch } from "@/lib/engine/bracket";
import { ChevronUp, ChevronDown, Minus, Trophy, Star } from "lucide-react";
import { ORG_BY_ID } from "@/data/regions";

interface Props {
  bracket: BracketMatch[][];
}

interface TeamStanding {
  name: string;
  wins: number;
  losses: number;
  mapDiff: number;
  status: "CHAMPION" | "FINALIST" | "UPPER" | "LOWER" | "ELIMINATED";
  trend: "UP" | "DOWN" | "STABLE";
  orgId?: string;
}

export function LiveStandingsTable({ bracket }: Props) {
  const standings = useMemo(() => {
    const allMatches = bracket.flat();
    const teamsMap = new Map<string, TeamStanding>();

    // 1. Extract teams
    allMatches.forEach(m => {
      if (m.teamA && !teamsMap.has(m.teamA.name)) {
        teamsMap.set(m.teamA.name, { name: m.teamA.name, wins: 0, losses: 0, mapDiff: 0, status: "UPPER", trend: "STABLE", orgId: m.teamA.orgId });
      }
      if (m.teamB && !teamsMap.has(m.teamB.name)) {
        teamsMap.set(m.teamB.name, { name: m.teamB.name, wins: 0, losses: 0, mapDiff: 0, status: "UPPER", trend: "STABLE", orgId: m.teamB.orgId });
      }
    });

    // 2. Compute records
    allMatches.forEach(m => {
      if (m.result && m.winner) {
        const winnerName = m.winner.name;
        const loserName = m.teamA?.name === winnerName ? m.teamB?.name : m.teamA?.name;
        
        const diff = Math.abs((m.result?.scoreA || 0) - (m.result?.scoreB || 0));

        if (winnerName && teamsMap.has(winnerName)) {
          const t = teamsMap.get(winnerName)!;
          t.wins += 1;
          t.mapDiff += diff;
          t.trend = "UP";
        }
        
        if (loserName && teamsMap.has(loserName)) {
          const t = teamsMap.get(loserName)!;
          t.losses += 1;
          t.mapDiff -= diff;
          t.trend = "DOWN";
        }
      }
    });

    // 3. Compute Status
    const gf = allMatches.find(m => m.id === "gf");
    
    // Evaluate eliminated
    teamsMap.forEach(team => {
       if (gf?.result && gf.winner?.name === team.name) {
         team.status = "CHAMPION";
       } else if (gf?.result && (gf.teamA?.name === team.name || gf.teamB?.name === team.name)) {
         team.status = "FINALIST";
       } else if (team.losses >= 2) {
         team.status = "ELIMINATED";
       } else if (team.losses === 1) {
         team.status = "LOWER";
       } else {
         team.status = "UPPER";
       }
    });

    // 4. Sort
    const list = Array.from(teamsMap.values());
    list.sort((a, b) => {
       // Eliminated always at the bottom
       if (a.status === "ELIMINATED" && b.status !== "ELIMINATED") return 1;
       if (a.status !== "ELIMINATED" && b.status === "ELIMINATED") return -1;
       
       // Champions / Finalists top
       if (a.status === "CHAMPION") return -1;
       if (b.status === "CHAMPION") return 1;

       // Wins desc
       if (b.wins !== a.wins) return b.wins - a.wins;
       // Map Diff desc
       if (b.mapDiff !== a.mapDiff) return b.mapDiff - a.mapDiff;
       // Losses asc (fewer losses is better)
       return a.losses - b.losses;
    });

    return list;
  }, [bracket]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "CHAMPION": return "text-[#ffd700] bg-[#ffd700]/10 border-[#ffd700]/50 shadow-[0_0_15px_rgba(255,215,0,0.3)]";
      case "FINALIST": return "text-[#ffd700]/80 bg-[#ffd700]/5 border-[#ffd700]/30";
      case "UPPER": return "text-white bg-white/10 border-white/20";
      case "LOWER": return "text-[#ff4655] bg-[#ff4655]/10 border-[#ff4655]/30";
      case "ELIMINATED": return "text-red-500/50 bg-red-500/5 border-red-500/10";
      default: return "text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
     switch(status) {
       case "CHAMPION": return <><Trophy className="w-3 h-3"/> CHAMPION</>;
       case "FINALIST": return <><Star className="w-3 h-3"/> FINALIST</>;
       case "UPPER": return "🔼 UPPER BRACKET";
       case "LOWER": return "🔽 LOWER BRACKET";
       case "ELIMINATED": return "❌ ELIMINATED";
       default: return status;
     }
  };

  if (standings.length === 0) return null;

  return (
    <div className="w-full bg-[#0B0D12] border border-[#1A1D24] rounded-[10px] overflow-hidden shadow-lg flex flex-col shrink-0">
      <div className="p-3 px-4 border-b border-[#1A1D24] flex justify-between items-center bg-[#0F1115]">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#ff4655] flex items-center gap-2">
          STANDINGS — TOURNAMENT LIVE
        </div>
        <div className="text-[9px] uppercase tracking-widest text-[#A0A7B8] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ff4655] animate-pulse shadow-[0_0_8px_rgba(255,70,85,0.8)]"></span>
          Updating during simulation
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12px] whitespace-nowrap">
          <thead className="bg-[#0F1115]/50 border-b border-[#1A1D24] text-[#A0A7B8] uppercase tracking-widest">
            <tr>
              <th className="px-4 py-2 w-10 text-center font-bold text-[11px]">\#</th>
              <th className="px-4 py-2 font-bold text-[11px]">Team</th>
              <th className="px-4 py-2 font-bold text-center text-[11px]">Record</th>
              <th className="px-4 py-2 font-bold text-center text-[11px]">Map Diff</th>
              <th className="px-4 py-2 font-bold text-[11px]">Status</th>
              <th className="px-4 py-2 w-16 text-center font-bold text-[11px]">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A1D24]">
            {standings.map((team, idx) => {
              const isEliminated = team.status === "ELIMINATED";
              const isChampion = team.status === "CHAMPION";
              const isTop3 = idx < 3 && !isEliminated;
              const isUserTeam = team.orgId === "dreamteam";

              return (
                <tr 
                  key={team.name} 
                  className={`group transition-colors ${isEliminated ? 'opacity-30 bg-black/60' : 'hover:bg-white/5'} ${isChampion ? 'bg-gradient-to-r from-[#ffd700]/10 to-transparent border-l-2 border-[#ffd700]' : ''} ${isTop3 && !isChampion ? 'bg-white/[0.02] shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]' : ''} ${isUserTeam ? 'outline outline-2 outline-[#ffd700] outline-offset-[-2px] bg-[#ffd700]/10 font-extrabold shadow-[0_0_12px_rgba(255,215,0,0.2)]' : ''}`}
                >
                  <td className="px-4 py-2.5 text-center font-bold text-[13px] text-[#A0A7B8]">{idx + 1}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      {/* Logo: no border/outline, clean */}
                      <div className={`w-6 h-6 shrink-0 flex items-center justify-center overflow-hidden ${isChampion ? 'drop-shadow-[0_0_4px_rgba(255,215,0,0.5)]' : ''}`}>
                        {team.orgId && ORG_BY_ID[team.orgId]?.logo ? (
                          <img src={ORG_BY_ID[team.orgId].logo} alt={team.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className={`text-[7px] uppercase font-bold ${isChampion ? 'text-[#ffd700]/80' : 'text-[#A0A7B8]/50'}`}>—</span>
                        )}
                      </div>
                      <span className={`font-bold text-[13px] ${isEliminated ? 'text-[#A0A7B8]/50' : isChampion ? 'text-[#ffd700] drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]' : 'text-white'}`}>{team.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`font-mono font-bold text-[13px] ${isEliminated ? 'text-[#A0A7B8]/50' : 'text-white'}`}>{team.wins}-{team.losses}</span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`font-mono font-bold text-[13px] ${team.mapDiff > 0 ? 'text-green-400' : team.mapDiff < 0 ? 'text-red-400' : 'text-[#A0A7B8]'}`}>
                      {team.mapDiff > 0 ? `+${team.mapDiff}` : team.mapDiff}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border text-[9px] font-bold tracking-widest uppercase ${getStatusColor(team.status)}`}>
                      {getStatusLabel(team.status)}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <div className="flex justify-center">
                       {team.trend === "UP" && <ChevronUp className="w-4 h-4 text-green-400" />}
                       {team.trend === "DOWN" && <ChevronDown className="w-4 h-4 text-red-400" />}
                       {team.trend === "STABLE" && <Minus className="w-4 h-4 text-[#A0A7B8]" />}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
