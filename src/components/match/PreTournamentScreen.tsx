import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import type { BracketMatch } from "@/lib/engine/bracket";
import type { MatchTeam } from "@/lib/engine/match";
import { Trophy, Star, ChevronDown, ChevronRight, Swords, X, Target, FastForward, Globe, RotateCcw } from "lucide-react";
import { getFlagUrl } from "@/lib/utils";
import { PlayoffBracket } from "@/components/match/PlayoffBracket";
import { LiveStandingsTable } from "@/components/match/LiveStandingsTable";
import { ORG_BY_ID } from "@/data/regions";

const MatchRow = React.memo(({ m, picked, onPick, userTeamName }: { m: BracketMatch, picked?: string, onPick: (id: string, name: string) => void, userTeamName?: string }) => {
  if (!m.teamA || !m.teamB) return null;
  const isTeamAUser = m.teamA.name === userTeamName;
  const isTeamBUser = m.teamB.name === userTeamName;
  return (
    <div className="bg-[#0B0D12] rounded-md p-1.5 flex items-stretch text-[11px] h-12 relative group hover:shadow-[0_0_15px_rgba(255,215,0,0.05)] transition-shadow border border-[#1A1D24]">
       <button 
         onClick={() => onPick(m.id, m.teamA!.name)}
         className={`flex-1 flex items-center justify-center font-bold rounded-sm transition-all duration-300 cursor-pointer ${picked === m.teamA.name ? "bg-white/10 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]" : "text-[#A0A7B8] hover:text-white hover:bg-white/5"} ${isTeamAUser ? "outline outline-1 outline-[#ffd700] bg-[#ffd700]/10 text-white font-black shadow-[0_0_8px_rgba(255,215,0,0.3)]" : ""}`}
       >
         {m.teamA.orgId && ORG_BY_ID[m.teamA.orgId]?.logo && (
            <img src={ORG_BY_ID[m.teamA.orgId].logo} alt={m.teamA.name} className="w-5 h-5 object-contain mr-2" />
         )}
         <span className="truncate px-2">{m.teamA.name}</span>
       </button>
       <div className="w-8 flex items-center justify-center text-[9px] font-black tracking-widest text-[#A0A7B8]/40 z-10 pointer-events-none">VS</div>
       <button 
         onClick={() => onPick(m.id, m.teamB!.name)}
         className={`flex-1 flex items-center justify-center font-bold rounded-sm transition-all duration-300 cursor-pointer ${picked === m.teamB.name ? "bg-white/10 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]" : "text-[#A0A7B8] hover:text-white hover:bg-white/5"} ${isTeamBUser ? "outline outline-1 outline-[#ffd700] bg-[#ffd700]/10 text-white font-black shadow-[0_0_8px_rgba(255,215,0,0.3)]" : ""}`}
       >
         <span className="truncate px-2">{m.teamB.name}</span>
         {m.teamB.orgId && ORG_BY_ID[m.teamB.orgId]?.logo && (
            <img src={ORG_BY_ID[m.teamB.orgId].logo} alt={m.teamB.name} className="w-5 h-5 object-contain ml-2" />
         )}
       </button>
    </div>
  );
});

const getIglPlayer = (players: any[]) => {
  if (!players || players.length === 0) return null;
  const maxIgl = Math.max(...players.map(x => x.iglRating || 0));
  return [...players]
    .filter(x => (x.iglRating || 0) === maxIgl)
    .sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name))[0];
};

const DetailedPlayerCard = React.memo(({ player, isIgl }: { player: any; isIgl?: boolean }) => {
  const nat = (player.nationality || "").toLowerCase();
  const flagUrl = getFlagUrl(nat);
  
  return (
    <div className="flex items-center gap-3 bg-gradient-to-br from-[#111318] to-[#0a0c10] border border-[#1e222b] p-3 rounded-[8px] hover:border-[#ffd700]/50 transition-all min-w-0 shadow-[0_4px_12px_rgba(0,0,0,0.5)] relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-[#1e222b] group-hover:bg-[#ffd700] transition-colors" />
      
      <div className="w-10 h-10 rounded bg-[#1A1D24] flex items-center justify-center shrink-0 overflow-hidden border border-[#2A2F3A]">
        <img 
          src={player.image || "/jugadores/nopic.png"} 
          alt={player.name} 
          className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all"
          onError={(e) => { e.currentTarget.src = "/jugadores/nopic.png"; }}
        />
      </div>
      
      <div className="flex-1 min-w-0 overflow-hidden pr-2 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          {nat && <img src={flagUrl} className="w-3.5 h-2.5 rounded-[2px] object-cover" alt="flag" />}
          <div className="font-bold text-xs truncate text-white leading-none mt-0.5">{player.name}</div>
        </div>
        <div className="text-[9px] text-[#A0A7B8] uppercase tracking-widest truncate font-medium flex gap-1.5 items-center">
          <span className="text-[#ffd700]">{isIgl ? `IGL • ${player.primaryRole}` : player.primaryRole}</span>
          {player.roles && player.roles.length > 1 && (
            <>
               <span className="text-white/20">•</span>
               <span>{player.roles.filter((r: string) => r !== player.primaryRole).join(", ")}</span>
            </>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center shrink-0 border-l border-[#1e222b] pl-3 ml-1">
        <div className="text-[8px] text-[#A0A7B8] uppercase tracking-widest font-bold mb-0.5">OVR</div>
        <div className="font-display text-2xl text-white leading-none">
          {player.rating}
        </div>
      </div>
    </div>
  );
});

const MatchStatsCard = ({ match }: { match: BracketMatch }) => {
  const [activeTab, setActiveTab] = React.useState<number | "ALL">("ALL");

  if (!match.result) return null;
  const result = match.result;

  const currentStats = activeTab === "ALL" ? result : result.matches[activeTab];
  if (!currentStats) return null;

  return (
    <div className="p-4 border-t border-[#1A1D24] bg-[#0a0c10] space-y-4 shadow-inner">
      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-[#1A1D24] pb-2 overflow-x-auto custom-scrollbar">
        <button 
          onClick={() => setActiveTab("ALL")}
          className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 transition-all shrink-0 ${activeTab === "ALL" ? "bg-[#ffd700] text-black rounded-sm" : "text-[#A0A7B8] hover:text-white"}`}
        >
          ALL STATS
        </button>
        {result.matches.map((m, idx) => (
          <button 
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 transition-all shrink-0 ${activeTab === idx ? "bg-white text-black rounded-sm" : "text-[#A0A7B8] hover:text-white"}`}
          >
            MAP {idx + 1}: {m.mapName}
          </button>
        ))}
      </div>

      <div className="text-center font-display tracking-widest text-white text-[13px] uppercase">
        {activeTab === "ALL" 
          ? `FINAL SERIES SCORE: ${result.teamA.name} ${result.scoreA} - ${result.scoreB} ${result.teamB.name}` 
          : `MAP SCORE: ${currentStats.teamA.name} ${currentStats.scoreA} - ${currentStats.scoreB} ${currentStats.teamB.name}`
        }
      </div>

      {[
        { team: currentStats.teamA!, label: "TEAM A STATS" },
        { team: currentStats.teamB!, label: "TEAM B STATS" }
      ].map(({ team, label }) => (
        <div key={team.name} className="space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#ffd700] pb-1 flex items-center justify-between">
            <span>{team.name} ({label})</span>
            {currentStats.mvp?.name && team.players.some(p => p.name === currentStats.mvp?.name) && (
              <span className="text-[#ffd700] flex items-center gap-1 text-[10px]"><Trophy className="w-3 h-3" /> MVP IN TEAM</span>
            )}
          </div>
          
          <div className="overflow-x-auto border border-[#1A1D24] rounded-[4px] bg-[#0B0D12]">
            <table className="w-full text-left text-[12px] border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-black/30 border-b border-[#1A1D24] text-[#A0A7B8] uppercase tracking-wider font-bold text-[10px]">
                  <th className="px-3 py-2">Player</th>
                  <th className="px-3 py-2 text-center">K / D</th>
                  <th className="px-3 py-2 text-center">+/-</th>
                  <th className="px-3 py-2 text-center">ACS</th>
                  <th className="px-3 py-2 text-center">HS%</th>
                  <th className="px-3 py-2 text-center">KAST</th>
                  <th className="px-3 py-2 text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1D24]">
                {[...team.players].sort((a, b) => {
                  const statsA = currentStats.playerStats[a.name] || { kills: 0 };
                  const statsB = currentStats.playerStats[b.name] || { kills: 0 };
                  return statsB.kills - statsA.kills;
                }).map(p => {
                  const stats = currentStats.playerStats[p.name] || { kills: 0, deaths: 0, acs: 0, headshotPct: 0, kast: 0, rating: 1.0 };
                  const diff = stats.kills - stats.deaths;
                  
                  const kdColor = diff > 0 ? "text-green-500" : diff < 0 ? "text-red-500" : "text-white/80";
                  const ratingColor = stats.rating >= 1.0 ? "text-green-500" : "text-red-500";
                  const isMvp = currentStats.mvp?.name === p.name;
                  
                  return (
                    <tr key={p.name} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-3 py-2 font-bold text-white flex items-center gap-1.5">
                        {isMvp && <Star className="w-3.5 h-3.5 text-[#ffd700] fill-[#ffd700] shrink-0" />}
                        {p.nationality && (
                          <img src={getFlagUrl(p.nationality)} className="w-[14px] h-[10px] object-cover rounded-[1px] shadow-sm bg-white/10 shrink-0" alt="flag" />
                        )}
                        <span className="truncate">{p.name}</span>
                      </td>
                      <td className="px-3 py-2 text-center font-mono text-white/80">{stats.kills} / {stats.deaths}</td>
                      <td className={`px-3 py-2 text-center font-mono font-bold ${kdColor}`}>
                        {diff > 0 ? `+${diff}` : diff}
                      </td>
                      <td className="px-3 py-2 text-center font-mono font-bold text-white">{stats.acs}</td>
                      <td className="px-3 py-2 text-center font-mono font-bold text-white">{stats.headshotPct}%</td>
                      <td className="px-3 py-2 text-center font-mono font-bold text-white">{stats.kast}%</td>
                      <td className={`px-3 py-2 text-center font-mono font-bold ${ratingColor}`}>{stats.rating.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

interface Props {
  userTeam: MatchTeam;
  playoffBracket: BracketMatch[][];
  onNextMatch: () => void;
  onAutoSimulate: () => void;
  isFinished: boolean;
}

export function PreTournamentScreen({ userTeam, playoffBracket, onNextMatch, onAutoSimulate, isFinished }: Props) {
  const [userPicks, setUserPicks] = useState<Record<string, string>>({});
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  const handlePick = useCallback((matchId: string, teamName: string) => {
    setUserPicks(prev => ({ ...prev, [matchId]: teamName }));
  }, []);

  const handleAutoPick = useCallback(() => {
    const picks: Record<string, string> = { ...userPicks };
    for (const m of playoffBracket.flat()) {
      if (m.teamA && m.teamB && !m.result && !picks[m.id]) {
        picks[m.id] = Math.random() > 0.5 ? m.teamA.name : m.teamB.name;
      }
    }
    setUserPicks(picks);
  }, [playoffBracket, userPicks]);

  // Detect user elimination (2 losses in DE = eliminated) before GF is decided
  const isUserEliminated = !isFinished && (() => {
    const losses = playoffBracket.flat().filter(m =>
      m.result && m.winner &&
      (m.teamA?.name === userTeam.name || m.teamB?.name === userTeam.name) &&
      m.winner.name !== userTeam.name
    ).length;
    return losses >= 2;
  })();

  const showPlayAgain = isFinished || isUserEliminated;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto w-full max-w-[1300px] px-4 py-8 sm:px-6 flex flex-col min-h-[calc(100vh-80px)]"
    >
      <div className="flex flex-col flex-1 gap-5">
        
        {/* Header */}
        <div className="flex justify-between items-end shrink-0 mb-2">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">Tournament Setup</h1>
            <div className="flex items-center gap-2 mt-1">
               <Globe className="w-3.5 h-3.5 text-[#ffd700]" />
               <p className="text-[#A0A7B8] tracking-widest text-[10px] sm:text-[11px] font-bold uppercase">Double Elimination Format</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             {showPlayAgain ? (
               /* Tournament over or eliminated — show JUGAR DE NUEVO */
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
               >
                 <Link
                   to="/play"
                   className="flex items-center gap-2.5 bg-gradient-to-r from-[#ff4655] to-[#c8162a] text-white font-display text-sm sm:text-base tracking-widest px-8 py-3 hover:brightness-110 hover:scale-105 shadow-[0_0_20px_rgba(255,70,85,0.45)] transition-all cursor-pointer rounded-[4px]"
                 >
                   <RotateCcw className="w-4 h-4" /> JUGAR DE NUEVO
                 </Link>
               </motion.div>
             ) : (
               <>
                 <button 
                   onClick={onAutoSimulate}
                   disabled={isFinished}
                   className="bg-[#0F1115] border border-[#1A1D24] text-white font-display text-sm sm:text-base tracking-widest px-6 py-3 flex items-center justify-center gap-2 hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    <FastForward className="w-4 h-4" /> SIMULATE ROUND
                 </button>
                 <button 
                   onClick={onNextMatch}
                   disabled={isFinished}
                   className="bg-[#ffd700] text-black font-display text-sm sm:text-base tracking-widest px-8 py-3 flex items-center justify-center gap-2 hover:brightness-110 hover:scale-105 shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    ▶ PLAY SIMULATOR
                 </button>
               </>
             )}
          </div>
        </div>

        {/* EXPLICIT PICK'EMS SECTION */}
        <div className="w-full bg-[#0F1115] border border-[#1A1D24] rounded-[10px] overflow-hidden flex flex-col shadow-lg shrink-0">
          <div className="p-3 px-4 border-b border-[#1A1D24] flex justify-between items-center bg-[#2A2F3A]/20">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#ffd700] flex items-center gap-2">
              🎯 PICK'EM: APUESTA POR LOS GANADORES DE LAS OTRAS SERIES Y SUMA PUNTOS
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAutoPick}
                className="text-[9px] font-black tracking-widest uppercase border border-[#2A2F3A] text-[#A0A7B8] px-3 py-1 hover:text-white hover:bg-white/10 transition-all cursor-pointer rounded-sm"
              >
                AUTO PICK
              </button>
            </div>
          </div>
          
          <div className="flex flex-col bg-[#111318]">
            {playoffBracket.flat().filter(m => m.teamA && m.teamB && !m.result).map(m => {
              const pickedA = userPicks[m.id] === m.teamA?.name;
              const pickedB = userPicks[m.id] === m.teamB?.name;
              const orgA = ORG_BY_ID[m.teamA?.orgId || ""];
              const orgB = ORG_BY_ID[m.teamB?.orgId || ""];
              
              return (
                <div key={`pickem-${m.id}`} className="flex items-stretch justify-between border-b border-[#1A1D24] min-h-[48px] bg-[#111318]">
                  
                  {/* LEFT: TEAM A */}
                  <div className={`flex items-center gap-3 w-[35%] pl-4 sm:pl-6 py-2 transition-all ${pickedA ? "opacity-100" : pickedB ? "opacity-40" : "opacity-100"}`}>
                     {orgA?.logo ? <img src={orgA.logo} className="w-5 h-5 object-contain" alt="org" /> : <div className="w-5 h-5 bg-white/10 rounded-sm" />}
                     <img src={getFlagUrl(orgA?.region)} className="w-4 h-3 object-cover rounded-sm shadow-sm opacity-90" alt="flag" />
                     <span className={`font-bold text-xs sm:text-sm truncate ${pickedA ? "text-white" : "text-[#A0A7B8]"}`}>{m.teamA?.name}</span>
                  </div>
                  
                  {/* MIDDLE: ROUND & ABBREVIATIONS BUTTONS */}
                  <div className="flex flex-col items-center justify-center gap-1 w-[30%] py-1.5 border-l border-r border-[#1A1D24]/50 bg-black/20">
                     <div className="text-[8px] font-black tracking-[0.2em] text-[#A0A7B8] uppercase">{m.roundLabel}</div>
                     <div className="flex items-center gap-2">
                       <button
                         onClick={() => handlePick(m.id, m.teamA!.name)}
                         className={`px-3 py-0.5 text-[9px] font-black uppercase rounded-[3px] cursor-pointer transition-all border
                           ${pickedA ? "bg-[#111318] text-[#ffd700] border-[#ffd700] shadow-[0_0_10px_rgba(255,215,0,0.15)]" : "bg-[#1A1D24] text-[#A0A7B8] border-[#2A2F3A] hover:border-[#ffd700]/40"}`}
                       >
                         {orgA?.shortName || m.teamA?.name.substring(0,3).toUpperCase()}
                       </button>
                       <button
                         onClick={() => handlePick(m.id, m.teamB!.name)}
                         className={`px-3 py-0.5 text-[9px] font-black uppercase rounded-[3px] cursor-pointer transition-all border
                           ${pickedB ? "bg-[#111318] text-[#ffd700] border-[#ffd700] shadow-[0_0_10px_rgba(255,215,0,0.15)]" : "bg-[#1A1D24] text-[#A0A7B8] border-[#2A2F3A] hover:border-[#ffd700]/40"}`}
                       >
                         {orgB?.shortName || m.teamB?.name.substring(0,3).toUpperCase()}
                       </button>
                     </div>
                  </div>
                  
                  {/* RIGHT: TEAM B & SCORE */}
                  <div className="flex items-stretch justify-end w-[35%]">
                     <div className={`flex-1 flex items-center justify-end gap-3 transition-all py-2 pr-4 ${pickedB ? "opacity-100" : pickedA ? "opacity-40" : "opacity-100"}`}>
                       <span className={`font-bold text-xs sm:text-sm text-right truncate ${pickedB ? "text-white" : "text-[#A0A7B8]"}`}>{m.teamB?.name}</span>
                       <img src={getFlagUrl(orgB?.region)} className="w-4 h-3 object-cover rounded-sm shadow-sm opacity-90" alt="flag" />
                       {orgB?.logo ? <img src={orgB.logo} className="w-5 h-5 object-contain" alt="org" /> : <div className="w-5 h-5 bg-white/10 rounded-sm" />}
                     </div>
                     
                     {/* Score box */}
                     <div className="flex items-center justify-center border-l border-[#1A1D24]/50 w-16 bg-black/40">
                       <div className="font-mono text-xs font-bold text-[#A0A7B8] tracking-widest opacity-50">
                         {playoffBracket.flat().filter(match => match.result && match.winner?.name === m.teamA?.name).length}-{playoffBracket.flat().filter(match => match.result && match.winner?.name === m.teamB?.name).length}
                       </div>
                     </div>
                  </div>
                  
                </div>
              );
            })}
            
            {playoffBracket.flat().filter(m => m.teamA && m.teamB && !m.result).length === 0 && (
              <div className="text-center text-[#A0A7B8] text-[11px] py-4 uppercase tracking-widest font-bold">
                No active predictions available
              </div>
            )}
          </div>
        </div>

        {/* SECTION 1: BRACKET */}
        <div className="w-full bg-[#0B0D12] border border-[#1A1D24] rounded-[10px] overflow-hidden relative flex flex-col shadow-lg shrink-0" style={{ height: 640 }}>
          <div className="p-3 px-4 border-b border-[#1A1D24] flex justify-between items-center bg-[#0F1115] shrink-0 z-10 relative">
            <div className="text-[11px] font-bold uppercase tracking-widest text-white flex items-center gap-2">
              DOUBLE ELIMINATION BRACKET
            </div>
          </div>
          <div className="flex-1 relative overflow-hidden bg-transparent flex items-center justify-center p-0">
            <PlayoffBracket
              bracket={playoffBracket}
              userPicks={userPicks}
              onPick={handlePick}
              userTeamName={userTeam.name}
            />
          </div>
        </div>

        {/* SECTION 3 & 4: STANDINGS & MATCH HISTORY */}
        <div className="flex flex-col gap-5 w-full shrink-0">
          <div className="w-full">
            <LiveStandingsTable bracket={playoffBracket} />
          </div>
          
          <div className="w-full bg-[#0F1115] border border-[#1A1D24] rounded-[10px] overflow-hidden shadow-lg flex flex-col shrink-0">
            <div className="p-3 px-4 border-b border-[#1A1D24] flex justify-between items-center bg-[#0F1115]">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#ffd700] flex items-center gap-2">
                MATCH HISTORY
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {playoffBracket.flat().filter(m => m.result).length === 0 ? (
                <div className="text-center text-[#A0A7B8] text-[11px] py-4 uppercase tracking-widest font-bold">0-0 (NO MATCHES PLAYED)</div>
              ) : (
                playoffBracket.flat().filter(m => m.result).map((m, idx) => {
                  const winner = m.winner?.name === m.teamA?.name ? m.teamA : m.teamB;
                  const loser = m.winner?.name === m.teamA?.name ? m.teamB : m.teamA;
                  const scoreWinner = Math.max(m.result!.scoreA, m.result!.scoreB);
                  const scoreLoser = Math.min(m.result!.scoreA, m.result!.scoreB);
                  const isExpanded = expandedMatchId === m.id;
                  
                  return (
                    <div key={m.id} className="flex flex-col bg-[#0B0D12] border border-[#1A1D24] rounded overflow-hidden shrink-0">
                      <div 
                        onClick={() => setExpandedMatchId(isExpanded ? null : m.id)}
                        className="flex items-center justify-between hover:border-white/20 transition-all p-2.5 px-4 text-[12px] cursor-pointer hover:bg-white/[0.02] min-h-[42px]"
                      >
                        <div className="flex-1 font-bold text-white truncate">{winner?.name}</div>
                        <div className="font-mono font-black px-4 shrink-0 flex items-center gap-1.5 text-[13px]">
                          <span className="text-green-500 text-[14px]">{scoreWinner}</span>
                          <span className="text-[#A0A7B8]/40">-</span>
                          <span className="text-red-500 text-[14px]">{scoreLoser}</span>
                        </div>
                        <div className="flex-1 font-bold text-[#A0A7B8] text-right truncate">{loser?.name}</div>
                      </div>
                      {isExpanded && <MatchStatsCard match={m} />}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM PLAYER BAR */}
      <div className="mt-5 shrink-0 w-full bg-[#0F1115] border border-[#1A1D24] rounded-[10px] flex flex-col lg:flex-row items-stretch min-h-[80px] shadow-lg overflow-hidden p-3 gap-2">
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 w-full">
          {userTeam.players.map(p => {
            const isIgl = p.id === getIglPlayer(userTeam.players)?.id;
            return <DetailedPlayerCard key={p.id || p.name} player={p} isIgl={isIgl} />;
          })}
        </div>
        {userTeam.coach && (
          <div className="hidden lg:flex items-center gap-3 bg-[#0B0D12] border border-[#1A1D24] p-2 rounded-[6px] w-48 shrink-0">
            <div className="w-8 h-8 rounded bg-[#1A1D24] flex items-center justify-center text-sm font-display text-white shrink-0">
              {userTeam.coach.name.substring(0,2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[11px] truncate leading-none mb-1 text-white">{userTeam.coach.name}</div>
              <div className="text-[9px] text-[#A0A7B8] uppercase tracking-widest truncate">COACH</div>
            </div>
          </div>
        )}
      </div>

    </motion.div>
  );
}
