import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { z } from "zod";
import { useDynasty } from "@/lib/store/dynasty";
import type { PlayerEntry } from "@/types/game";
import { PLAYER_BY_ID, COACH_BY_ID, TEAM_ENTRIES } from "@/data/generate";
import { GAME_MODE_BY_ID } from "@/data/tournaments";
import { MAPS, type GameMap } from "@/data/maps";
import { MatchEngine, type MatchTeam, type MatchResult, type SeriesResult } from "@/lib/engine/match";
import { getTop8FromHiddenSimulation, generateDoubleEliminationBracket, processBracketProgression, processNextStage, type BracketMatch } from "@/lib/engine/bracket";
import { PreTournamentScreen } from "@/components/match/PreTournamentScreen";
import { MapVetoScreen } from "@/components/match/MapVetoScreen";
import { LiveMatchSimulationScreen } from "@/components/match/LiveMatchSimulationScreen";
import { playSfx } from "@/lib/sfx";

const searchSchema = z.object({ saveId: z.string().optional() });

export const Route = createFileRoute("/match")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Live Match — Valorant Champions Draft" },
      { name: "description", content: "Live match simulation with play-by-play commentary." },
    ],
  }),
  component: MatchPage,
});

function getTeamOVR(team: MatchTeam | null): number {
  if (!team || !team.players || team.players.length === 0) return 80;
  return Math.round(team.players.reduce((sum, p) => sum + (p.rating || 80), 0) / team.players.length);
}

function simulateBO1Fast(match: BracketMatch, deciderMap: GameMap | null): MatchResult {
  const teamA = match.teamA!;
  const teamB = match.teamB!;
  const ovrA = getTeamOVR(teamA);
  const ovrB = getTeamOVR(teamB);
  
  const probA = ovrA / (ovrA + ovrB);
  const rand = Math.random();
  const winner = rand < probA ? "A" : "B";
  
  const diff = Math.abs(ovrA - ovrB);
  let loserScore = 0;
  
  const closenessRand = Math.random();
  if (diff < 3) {
    loserScore = closenessRand < 0.5 ? 11 : 10;
  } else if (diff < 7) {
    loserScore = closenessRand < 0.5 ? 8 : 7;
  } else {
    loserScore = closenessRand < 0.5 ? 5 : 4;
  }
  
  return {
    scoreA: winner === "A" ? 13 : loserScore,
    scoreB: winner === "B" ? 13 : loserScore,
    winner,
    mapName: deciderMap?.name || "Ascent",
    events: [],
    teamA,
    teamB,
    mvp: null,
    playerStats: {}
  };
}

function MatchPage() {
  const { saveId } = Route.useSearch();
  const save = useDynasty((s) => s.saves.find((x) => x.id === saveId));
  const recordWin = useDynasty((s) => s.recordWin);
  const recordLoss = useDynasty((s) => s.recordLoss);
  const addTrophy = useDynasty((s) => s.addTrophy);

  const playerTeam: MatchTeam | null = useMemo(() => {
    if (!save) return null;
    const players = save.rosterPlayerIds
      .map((id) => {
        const p = PLAYER_BY_ID[id];
        if (!p) return null;
        const form = save.playerForms?.[id] ?? 0;
        const assignedRole = save.roleAssignments?.[id] ?? p.primaryRole;
        return { ...p, form, role: assignedRole, primaryRole: assignedRole };
      })
      .filter(Boolean) as PlayerEntry[];
    const coach = save.coachId ? (COACH_BY_ID[save.coachId] ?? null) : null;
    return { name: save.name || "DRAFT SQUAD", players, coach, orgId: "dreamteam" };
  }, [save]);

  const [playoffBracket, setPlayoffBracket] = useState<BracketMatch[][]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const tournamentForms: Record<string, number> = useMemo(() => {
    const forms: Record<string, number> = {};
    if (!save || playoffBracket.length === 0) return forms;
    const completedMatches = playoffBracket.flat().filter(m => m.result);
    const playerRatings: Record<string, { total: number, count: number }> = {};
    completedMatches.forEach(m => {
      (m.result?.matches || []).forEach(map => {
        if (!map.playerStats) return;
        Object.entries(map.playerStats).forEach(([playerName, stat]) => {
          if (!playerRatings[playerName]) playerRatings[playerName] = { total: 0, count: 0 };
          playerRatings[playerName].total += stat.rating;
          playerRatings[playerName].count++;
        });
      });
    });

    Object.keys(playerRatings).forEach(pName => {
      const p = playerRatings[pName];
      if (p.count === 0) return;
      const avg = p.total / p.count;
      let f = Math.round((avg - 1.0) * 40);
      f = Math.max(-15, Math.min(15, f));
      forms[pName] = f;
    });
    return forms;
  }, [playoffBracket, save]);

  const applyForms = (team: MatchTeam): MatchTeam => ({
    ...team,
    players: (team.players || []).map(p => ({
      ...p,
      form: tournamentForms[p.name] ?? 0
    }))
  });

  const [simulationPhase, setSimulationPhase] = useState<"setup" | "veto" | "live" | "result">("setup");
  const [targetMatch, setTargetMatch] = useState<BracketMatch | null>(null);
  const [liveResult, setLiveResult] = useState<SeriesResult | null>(null);
  const [currentLiveMapIndex, setCurrentLiveMapIndex] = useState(0);

  // Initialize Tournament
  useEffect(() => {
    if (!save || !playerTeam || playoffBracket.length > 0) return;
    const mode = GAME_MODE_BY_ID[save.modeId];
    const pool = TEAM_ENTRIES.filter((t) => mode.tournamentIds.includes(t.tournamentId));
    
    const top8 = getTop8FromHiddenSimulation(playerTeam, pool, save.draftMode ?? "STRICT");
    const bracket = generateDoubleEliminationBracket(top8);
    setPlayoffBracket(bracket);
  }, [save, playerTeam, playoffBracket.length]);

  if (!save || !playerTeam || playoffBracket.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-sm text-muted-foreground">Loading Tournament...</div>
      </div>
    );
  }

  const checkTournamentEnd = (bracket: BracketMatch[][]) => {
    const gfMatch = bracket.flat().find(m => m.id === "gf");
    if (gfMatch && gfMatch.result && !isFinished) {
       if (gfMatch.winner?.name === playerTeam?.name) {
         addTrophy(save.id, "Tournament Champion");
         recordWin(save.id);
         playSfx("champion");
       } else {
         recordLoss(save.id);
         playSfx("defeat");
       }
       setIsFinished(true);
    }
  };

  const handlePlaySimulator = () => {
    if (isFinished || !playerTeam) return;
    playSfx("click");
    
    // Simulate CPU matches in the current stage only (one round at a time)
    const nextBracket = processNextStage(playoffBracket, playerTeam.name, save?.draftMode ?? "STRICT");
    setPlayoffBracket(nextBracket);
    checkTournamentEnd(nextBracket);

    // Find the user's match in the current stage and start veto
    const activeUserMatch = nextBracket.flat().find(m => 
      !m.result && m.teamA && m.teamB && 
      (m.teamA.name === playerTeam.name || m.teamB.name === playerTeam.name)
    );
    
    if (activeUserMatch) {
      setTargetMatch(activeUserMatch);
      setSimulationPhase("veto");
    }
  };

  const handleVetoComplete = (vetoMaps: GameMap[]) => {
    if (!targetMatch) return;
    
    let phase: "EARLY" | "QUARTERFINALS" | "SEMIFINALS" | "FINALS" = "EARLY";
    let isBO5 = false;
    if (targetMatch.bracket === "GRAND") {
      phase = "FINALS";
      isBO5 = true;
    }
    else if (targetMatch.id.includes("sf")) phase = "SEMIFINALS";
    else if (targetMatch.id.includes("qf")) phase = "QUARTERFINALS";

    const engine = new MatchEngine();
    const result = engine.simulateSeries(
      applyForms(targetMatch.teamA!),
      applyForms(targetMatch.teamB!),
      save?.draftMode ?? "STRICT",
      phase,
      vetoMaps,
      isBO5
    );
    setLiveResult(result);
    setCurrentLiveMapIndex(0);
    setSimulationPhase("live");
    playSfx("matchStart");
  };

  const handleMapComplete = () => {
    if (liveResult && currentLiveMapIndex < liveResult.matches.length - 1) {
      setCurrentLiveMapIndex(prev => prev + 1);
    } else {
      handleBracketAdvance(liveResult);
      setSimulationPhase("setup");
    }
  };



  const handleBracketAdvance = (forcedResult: SeriesResult | null) => {
    if (!playerTeam) return;
    let nextBracket = [...playoffBracket];
    
    if (forcedResult && targetMatch) {
      const matchInBracket = nextBracket.flat().find(m => m.id === targetMatch.id);
      if (matchInBracket) {
        matchInBracket.result = forcedResult;
        matchInBracket.winner = forcedResult.winner === "A" ? matchInBracket.teamA : matchInBracket.teamB;
      }
    }
    
    nextBracket = processBracketProgression(nextBracket, playerTeam.name, save?.draftMode ?? "STRICT", false);
    setPlayoffBracket(nextBracket);
    checkTournamentEnd(nextBracket);
  };

  const handleAutoSimulate = () => {
    if (isFinished || !playerTeam) return;
    playSfx("click");
    
    // Simulate only the current stage's CPU matches — does NOT touch the user's match.
    // The user must click PLAY SIMULATOR to play their own match.
    const nextBracket = processNextStage(playoffBracket, playerTeam.name, save?.draftMode ?? "STRICT");
    
    setPlayoffBracket(nextBracket);
    checkTournamentEnd(nextBracket);
  };

  const getNextMatchLabel = () => {
    if (!targetMatch || !liveResult) return "ADVANCES TO NEXT ROUND";
    
    const userWon = (liveResult.winner === "A" && liveResult.teamA.name === playerTeam.name) || 
                    (liveResult.winner === "B" && liveResult.teamB.name === playerTeam.name);

    if (targetMatch.id === "gf") return userWon ? "TOURNAMENT CHAMPION" : "TOURNAMENT FINISHED";
    
    if (!userWon) {
       if (targetMatch.bracket === "UPPER" && targetMatch.nextLoserMatchId) {
          return "DROPS TO LOWER BRACKET";
       }
       return "ELIMINATED";
    }

    if (targetMatch.bracket === "LOWER") {
      return "ADVANCES IN LOWER BRACKET";
    }
    return "ADVANCES IN UPPER BRACKET";
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0D12]">
      {simulationPhase === "setup" && (
        <PreTournamentScreen 
           userTeam={playerTeam} 
           playoffBracket={playoffBracket} 
           onNextMatch={handlePlaySimulator} 
           onAutoSimulate={handleAutoSimulate}
           isFinished={isFinished}
        />
      )}
      
      {simulationPhase === "veto" && targetMatch && targetMatch.teamA && targetMatch.teamB && (
        <MapVetoScreen 
           teamA={applyForms(targetMatch.teamA)}
           teamB={applyForms(targetMatch.teamB)}
           teamA_OVR={getTeamOVR(targetMatch.teamA)}
           teamB_OVR={getTeamOVR(targetMatch.teamB)}
           mapPool={MAPS.filter(m => ["Ascent", "Bind", "Haven", "Split", "Lotus", "Sunset", "Icebox"].includes(m.name))}
           isBO5={targetMatch.bracket === "GRAND"}
           userTeamName={playerTeam.name}
           onVetoComplete={handleVetoComplete}
        />
      )}

      {simulationPhase === "live" && liveResult && liveResult.matches[currentLiveMapIndex] && (
        <LiveMatchSimulationScreen 
           key={`map-${currentLiveMapIndex}`}
           matchResult={liveResult.matches[currentLiveMapIndex]} 
           onComplete={handleMapComplete}
           nextMatchLabel={currentLiveMapIndex < liveResult.matches.length - 1 
             ? `START MAP ${currentLiveMapIndex + 2}: ${liveResult.matches[currentLiveMapIndex + 1]?.mapName}`
             : getNextMatchLabel()}
           seriesScoreA={liveResult.matches.slice(0, currentLiveMapIndex).filter(m => m.winner === "A").length}
           seriesScoreB={liveResult.matches.slice(0, currentLiveMapIndex).filter(m => m.winner === "B").length}
           mapIndex={currentLiveMapIndex}
           totalMaps={liveResult.matches.length}
        />
      )}
    </div>
  );
}
