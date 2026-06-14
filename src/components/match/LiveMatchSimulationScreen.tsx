import React, { useEffect, useState, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { MatchResult } from "@/lib/engine/match";
import { ProbabilityBar } from "@/components/match/ProbabilityBar";
import { PlayerPanel } from "@/components/match/PlayerPanel";
import { AgentRow } from "@/components/match/AgentRow";
import { useLanguage } from "@/lib/i18n";
import { useProgression } from "@/lib/store/progression";
import { playSfx } from "@/lib/sfx";
import { X, Trophy, Award } from "lucide-react";
import { MAPS } from "@/data/maps";
import { getFlagUrl } from "@/lib/utils";

interface Props {
  matchResult: MatchResult;
  onComplete: () => void;
  nextMatchLabel?: string;
  seriesScoreA?: number;
  seriesScoreB?: number;
  mapIndex?: number;
  totalMaps?: number;
}

type SimSpeed = "NORMAL" | "FAST" | "ULTRA";

export function LiveMatchSimulationScreen({ matchResult, onComplete, nextMatchLabel = "ADVANCES TO NEXT ROUND", seriesScoreA, seriesScoreB, mapIndex, totalMaps }: Props) {
  const { t } = useLanguage();
  const rankedActive = useProgression((s) => s.rankedActive);
  const recordMatchResult = useProgression((s) => s.recordMatchResult);
  const progressionLevel = useProgression((s) => s.level);

  const [simSpeed, setSimSpeed] = useState<SimSpeed>("NORMAL");
  const [matchState, setMatchState] = useState<"PLAYING" | "FINISHED">("PLAYING");
  const [displayedRoundCount, setDisplayedRoundCount] = useState(0);
  const [rewards, setRewards] = useState<{ mmrChange: number; xpChange: number; leveledUp: boolean } | null>(null);

  const rewardKeyRef = useRef<string | null>(null);
  const resultSoundKeyRef = useRef<string | null>(null);
  const lastEventCountRef = useRef(0);

  const isPlayerTeamA = matchResult.teamA?.orgId === "dreamteam";
  const isPlayerTeamB = matchResult.teamB?.orgId === "dreamteam";
  const isPlayerPlaying = isPlayerTeamA || isPlayerTeamB;

  const userWon = isPlayerPlaying
    ? ((matchResult.winner === "A" && isPlayerTeamA) || (matchResult.winner === "B" && isPlayerTeamB))
    : matchResult.winner === "A";

  // Auto-simulate rounds based on Speed Selection
  useEffect(() => {
    if (matchState !== "PLAYING" || !matchResult) return;

    if (simSpeed === "ULTRA") {
      setDisplayedRoundCount(matchResult.events.length);
      setMatchState("FINISHED");
      return;
    }

    if (displayedRoundCount >= matchResult.events.length) {
      setMatchState("FINISHED");
      return;
    }

    const interval = simSpeed === "NORMAL" ? 1000 : 400;

    const timer = setTimeout(() => {
      setDisplayedRoundCount((c) => c + 1);
    }, interval);

    return () => clearTimeout(timer);
  }, [matchState, matchResult, displayedRoundCount, simSpeed]);

  // Trigger round sound effects
  useEffect(() => {
    if (matchState !== "PLAYING" || !matchResult || displayedRoundCount <= 0) return;
    if (displayedRoundCount === lastEventCountRef.current) return;

    const event = matchResult.events[displayedRoundCount - 1];
    if (!event) return;

    const isUserRound = isPlayerPlaying && (
      (event.winner === "A" && isPlayerTeamA) || 
      (event.winner === "B" && isPlayerTeamB)
    );
    const isBigMoment = ["ACE", "CLUTCH", "MAP_POINT", "MATCH_POINT"].includes(event.type);
    
    playSfx(isBigMoment ? "roundBig" : isUserRound ? "roundWin" : "roundLoss");
    lastEventCountRef.current = displayedRoundCount;
  }, [displayedRoundCount, matchState, matchResult, isPlayerPlaying, isPlayerTeamA, isPlayerTeamB]);

  // Trigger MMR & XP rewards and victory/defeat sound on completion
  useEffect(() => {
    if (matchState === "FINISHED" && matchResult) {
      const resultKey = `${matchResult.scoreA}-${matchResult.scoreB}-${matchResult.winner}`;

      if (rewardKeyRef.current !== resultKey) {
        if (isPlayerPlaying) {
          const won = (matchResult.winner === "A" && isPlayerTeamA) || (matchResult.winner === "B" && isPlayerTeamB);
          const res = recordMatchResult(won);
          setRewards(res);
        }
        rewardKeyRef.current = resultKey;
      }

      if (resultSoundKeyRef.current !== resultKey) {
        if (isPlayerPlaying) {
          const won = (matchResult.winner === "A" && isPlayerTeamA) || (matchResult.winner === "B" && isPlayerTeamB);
          playSfx(won ? "victory" : "defeat");
        } else {
          playSfx("victory"); // Spectator victory sfx
        }
        resultSoundKeyRef.current = resultKey;
      }
    }
  }, [matchState, matchResult, isPlayerPlaying, isPlayerTeamA, isPlayerTeamB, recordMatchResult]);

  const displayedEvents = useMemo(() => {
    return matchResult.events.slice(0, displayedRoundCount);
  }, [matchResult, displayedRoundCount]);

  const currentEvent = displayedEvents[displayedEvents.length - 1];

  // Limit events shown in live UI feed
  const isCurrentlyOvertime = displayedRoundCount > 24;
  const MAX_EVENTS = isCurrentlyOvertime ? 14 : 10;
  const recentEvents = useMemo(() => {
    return displayedEvents.slice(-MAX_EVENTS);
  }, [displayedEvents, MAX_EVENTS]);

  const scoreA = currentEvent?.scoreA ?? 0;
  const scoreB = currentEvent?.scoreB ?? 0;

  const currentProbA = currentEvent ? currentEvent.probA : 0.5;

  const simulationProgress = matchResult
    ? Math.min(100, Math.round((displayedRoundCount / Math.max(1, matchResult.events.length)) * 100))
    : 0;

  const winnerTeam = matchResult.winner === "A" ? matchResult.teamA : matchResult.teamB;

  const mapObj = useMemo(() => {
    return MAPS.find(m => m.name.toLowerCase() === matchResult.mapName.toLowerCase());
  }, [matchResult.mapName]);
  const mapImage = mapObj?.image || "/mapas/ascent.png";

  const getInterpolatedStats = (playerName: string) => {
    const finalStats = matchResult.playerStats[playerName];
    if (!finalStats) return { kills: 0, deaths: 0, acs: 0, headshotPct: 0, kast: 0, rating: 1.0 };
    if (matchResult.events.length === 0) return finalStats;
    
    const ratio = displayedRoundCount / matchResult.events.length;
    
    return {
      kills: Math.floor(finalStats.kills * ratio),
      deaths: Math.floor(finalStats.deaths * ratio),
      acs: finalStats.acs,
      headshotPct: finalStats.headshotPct,
      kast: finalStats.kast,
      rating: 1.0 + ((finalStats.rating - 1.0) * ratio),
    };
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 w-full min-h-screen flex flex-col justify-center relative">
      <AnimatePresence>
        {matchState === "FINISHED" && matchResult && (
          <motion.div
            key={`cinema-${matchResult.winner}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`match-cinematic-overlay ${isPlayerPlaying ? (userWon ? "is-victory" : "is-defeat") : "is-victory"}`}
          >
            <motion.div
              initial={{ scale: 0.72, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="match-cinematic-content"
            >
              <div className="text-[11px] font-black uppercase tracking-[0.45em] text-white/55">
                VCT Champions · {matchResult.mapName}
              </div>
              <div className="mt-2 font-display text-6xl sm:text-8xl">
                {isPlayerPlaying ? (userWon ? t("victory") : t("defeat")) : `${winnerTeam.name} WINS`}
              </div>
              <div className="mt-3 font-display text-3xl text-white/85">
                {matchResult.scoreA} : {matchResult.scoreB}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary flex items-center">
          <span className="animate-pulse mr-2">{t("liveLabel") || "LIVE"}</span>
          {t("broadcastLabel") || "BROADCAST"} — MAP {mapIndex !== undefined ? mapIndex + 1 : 1}: {matchResult.mapName.toUpperCase()}
        </div>
        
        {seriesScoreA !== undefined && seriesScoreB !== undefined && (
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#A0A7B8] flex items-center gap-3">
             <span>SERIES SCORE</span>
             <div className="flex items-center gap-1.5 font-display text-xl text-white bg-white/5 px-3 py-1 rounded-sm border border-white/10">
                <span className={seriesScoreA > seriesScoreB ? "text-green-500" : ""}>{seriesScoreA}</span>
                <span className="text-white/30 text-sm">-</span>
                <span className={seriesScoreB > seriesScoreA ? "text-green-500" : ""}>{seriesScoreB}</span>
             </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scoreboard, Prob bar, & Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scoreboard */}
          <div className="clip-corner border border-border bg-surface/80 p-6 backdrop-blur flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex flex-col items-start text-left flex-1">
              <p className="text-xs tracking-widest text-white/40">// TEAM A</p>
              <div className="mt-1 font-display text-2xl md:text-3xl text-white truncate max-w-[200px]" title={matchResult.teamA.name}>
                {matchResult.teamA.name}
              </div>
            </div>

            <div className="text-center px-8 shrink-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">
                {matchState === "FINISHED" ? (t("scoreboardFinalScore") || "FINAL SCORE") : "MR13"}
              </div>
              <div className="flex items-baseline justify-center gap-6 font-display text-7xl">
                <span className={scoreA > scoreB ? "text-green-500" : (scoreA < scoreB ? "text-red-500" : "")}>{scoreA}</span>
                <span className="text-muted-foreground/40 text-4xl">:</span>
                <span className={scoreB > scoreA ? "text-green-500" : (scoreB < scoreA ? "text-red-500" : "")}>{scoreB}</span>
              </div>
            </div>

            <div className="flex flex-col items-end text-right flex-1">
              <p className="text-xs tracking-widest text-white/40">// TEAM B</p>
              <div className="mt-1 font-display text-2xl md:text-3xl text-white truncate max-w-[200px]" title={matchResult.teamB.name}>
                {matchResult.teamB.name}
              </div>
            </div>
          </div>

          {/* Probability Bar */}
          <div className="clip-corner border border-border bg-surface/80 p-4 backdrop-blur">
            <ProbabilityBar probA={currentProbA} />
          </div>

          {/* Player Panel */}
          <div className="clip-corner border border-border bg-surface/80 p-6 backdrop-blur">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4 border-b border-border/40 pb-2">
              {t("matchupOverview") || "MATCHUP OVERVIEW"}
            </div>
            <PlayerPanel teamA={matchResult.teamA} teamB={matchResult.teamB} />
          </div>
        </div>

        {/* Right Column: Live Feed & Speed Controls & Action Buttons */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Speed Controller */}
            <div className="clip-corner border border-border bg-surface/80 p-4 backdrop-blur space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                ⚡ {t("simulationSpeed") || "SIMULATION SPEED"}
              </div>
              <div className="flex gap-2">
                <div className="grid grid-cols-3 w-full bg-background/50 border border-border/40 p-1 clip-corner text-xs font-bold tracking-wider">
                  {(["NORMAL", "FAST", "ULTRA"] as SimSpeed[]).map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setSimSpeed(spd)}
                      className={`py-1.5 text-center cursor-pointer transition-colors ${
                        simSpeed === spd ? "bg-[#ff4655] text-white" : "text-muted-foreground hover:text-foreground hover:bg-surface"
                      }`}
                    >
                      {spd}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Play-by-Play Ticker */}
            <div className="clip-corner border border-border bg-surface/80 p-5 backdrop-blur h-[340px] flex flex-col">
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">
                // {t("playByPlay") || "PLAY BY PLAY"}
              </div>
              <ul className="space-y-2 flex-1 overflow-y-auto pr-2 flex flex-col-reverse feed">
                <AnimatePresence initial={false}>
                  {recentEvents
                    .slice()
                    .reverse()
                    .map((e, i) => {
                      const isWinEvent = e.winner === "A";
                      return (
                        <motion.li
                          key={`${e.round}-${i}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex flex-col gap-0.5 border-l-2 px-2 py-1.5 text-[10px] ${
                            e.type === "ACE" || e.type === "CLUTCH" || e.type === "MAP_POINT" || e.type === "MATCH_POINT"
                              ? (isWinEvent ? "border-green-500/60 bg-green-500/10 text-foreground" : "border-red-500/60 bg-red-500/10 text-foreground")
                              : "border-border/50 text-muted-foreground bg-surface/40"
                          }`}
                        >
                          <div className="flex justify-between items-center text-[9px] uppercase font-bold text-muted-foreground">
                            <span className="flex items-center gap-2">
                              <span className="font-display text-primary">R{e.round}</span>
                              {e.type !== "ROUND" && (
                                <span className={`inline-block clip-tag px-1.5 py-0 ${isWinEvent ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                  {e.type.replace("_", " ")}
                                </span>
                              )}
                              {e.agent && <AgentRow agent={e.agent} />}
                            </span>
                            <span className="font-display">
                              {e.scoreA}:{e.scoreB}
                            </span>
                          </div>
                          <div className="leading-tight text-foreground/90">{e.text}</div>
                        </motion.li>
                      );
                    })}
                </AnimatePresence>
              </ul>
            </div>
          </div>

          {/* Status Indicators / Actions */}
          {matchState === "PLAYING" ? (
            <div className="live-sim-status clip-corner border border-[#ff4655]/40 bg-surface/85 p-5 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff4655]">SIMULATING LIVE</div>
                  <div className="mt-1 font-display text-xl tracking-widest text-foreground">
                    {t("simulating") || "Simulating"}... ({simulationProgress}%)
                  </div>
                </div>
                <div className="h-11 w-11 rounded-full border border-[#ff4655]/50 bg-[#ff4655]/10 grid place-items-center text-[#ff4655] live-orb">⚡</div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full border border-border bg-background/70">
                <div className="h-full bg-[#ff4655] transition-all duration-300" style={{ width: `${simulationProgress}%` }} />
              </div>
              <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Tactics, economy, momentum, and clutch factors in play
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`match-result-panel clip-corner border p-5 backdrop-blur space-y-4 ${
                isPlayerPlaying
                  ? (userWon ? "border-green-500/60 bg-green-500/10" : "border-red-500/60 bg-red-500/10")
                  : "border-[#ff4655]/60 bg-[#ff4655]/10"
              }`}
            >
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Match Result
                </div>
                <div className={`font-display text-4xl ${isPlayerPlaying ? (userWon ? "text-green-500" : "text-red-500") : "text-white"}`}>
                  {isPlayerPlaying ? (userWon ? t("victory") : t("defeat")) : `${winnerTeam.name} Wins`}
                </div>
              </div>

              {/* Rewards UI */}
              {isPlayerPlaying && rewards && (
                <div className="bg-background/60 p-3 rounded border border-border/40 clip-corner text-xs space-y-2">
                  <div className="font-semibold text-slate-300 font-sans">{t("rewardsTitle") || "REWARDS"}</div>
                  <div className="flex gap-4 font-bold font-mono">
                    {rankedActive && (
                      <span className={userWon ? "text-green-400" : "text-red-400"}>
                        MMR {rewards.mmrChange >= 0 ? `+${rewards.mmrChange}` : rewards.mmrChange}
                      </span>
                    )}
                    <span className="text-primary">XP +{rewards.xpChange}</span>
                  </div>

                  {/* Level Up Announcement */}
                  {rewards.leveledUp && (
                    <div className="bg-gold/15 text-gold border border-gold/40 p-2 rounded clip-corner font-bold text-[11px] animate-bounce mt-2 font-sans">
                      🎉 LEVEL UP! You reached Level {progressionLevel}! Unlocked new tournament rosters!
                    </div>
                  )}
                </div>
              )}

              {/* Next button */}
              <button
                onClick={onComplete}
                className={`w-full clip-corner border px-5 py-3.5 font-display text-xl tracking-widest text-white transition cursor-pointer font-bold ${
                  isPlayerPlaying && userWon
                    ? "border-green-500/60 bg-green-500/20 hover:bg-green-500/30"
                    : "border-[#ff4655]/60 bg-[#ff4655]/20 hover:bg-[#ff4655]/30"
                }`}
              >
                {nextMatchLabel}
              </button>
            </motion.div>
          )}
          {/* Map Preview Card */}
          <div className="w-full clip-corner h-16 relative overflow-hidden border border-border/40 group mt-4 shrink-0">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${mapImage})` }}
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-display text-xl tracking-[0.3em] text-white/90 uppercase drop-shadow-md">
                {matchResult.mapName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE STATS TABLE */}
      <div className="w-full mt-6 bg-[#0F1115] border border-[#1A1D24] rounded-[10px] overflow-hidden shadow-lg flex flex-col shrink-0">
        <div className="bg-[#1A1D24] px-4 py-3 flex items-center justify-between border-b border-[#2A2F3A]">
          <div className="font-display tracking-widest text-[#ffd700] uppercase text-sm drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
            LIVE STATISTICS
          </div>
        </div>
        <div className="p-4 flex flex-col gap-6">
          {[
            { team: matchResult.teamA, label: "TEAM A STATS" },
            { team: matchResult.teamB, label: "TEAM B STATS" }
          ].map(({ team, label }) => {
            if (!team || !team.players) return null;
            return (
              <div key={team.name} className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700] pb-1 flex items-center justify-between">
                  <span>{team.name} ({label})</span>
                </div>
                
                <div className="overflow-x-auto border border-[#1A1D24] rounded-[4px] bg-[#0B0D12]">
                  <table className="w-full text-left text-[10px] border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-black/30 border-b border-[#1A1D24] text-[#A0A7B8] uppercase tracking-wider font-bold">
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
                        const sA = getInterpolatedStats(a.name);
                        const sB = getInterpolatedStats(b.name);
                        return sB.kills - sA.kills;
                      }).map(p => {
                        const stats = getInterpolatedStats(p.name);
                        const diff = stats.kills - stats.deaths;
                        const kdColor = diff > 0 ? "text-green-500" : diff < 0 ? "text-red-500" : "text-white/80";
                        const ratingColor = stats.rating >= 1.0 ? "text-green-500" : "text-red-500";
                        
                        return (
                          <tr key={p.name} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-3 py-2 font-bold text-white flex items-center gap-1.5">
                              {p.nationality && (
                                <img src={getFlagUrl(p.nationality)} className="w-[14px] h-[10px] object-cover rounded-[1px] shadow-sm bg-white/10 shrink-0" alt="flag" />
                              )}
                              <span className="truncate">{p.name}</span>
                            </td>
                            <td className="px-3 py-2 text-center font-mono text-white/80">{stats.kills} / {stats.deaths}</td>
                            <td className={`px-3 py-2 text-center font-mono font-bold ${kdColor}`}>
                              {diff > 0 ? `+${diff}` : diff}
                            </td>
                            <td className="px-3 py-2 text-center font-mono font-bold text-white">{displayedRoundCount > 0 ? stats.acs : 0}</td>
                            <td className="px-3 py-2 text-center font-mono font-bold text-white">{displayedRoundCount > 0 ? stats.headshotPct : 0}%</td>
                            <td className="px-3 py-2 text-center font-mono font-bold text-white">{displayedRoundCount > 0 ? stats.kast : 0}%</td>
                            <td className={`px-3 py-2 text-center font-mono font-bold ${ratingColor}`}>{stats.rating.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
