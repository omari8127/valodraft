import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { useDynasty } from "@/lib/store/dynasty";
import { PLAYER_BY_ID, COACH_BY_ID, TEAM_ENTRIES } from "@/data/generate";
import { GAME_MODE_BY_ID } from "@/data/tournaments";
import { MatchEngine, type MatchEvent, type MatchTeam, type MatchResult } from "@/lib/engine/match";
import { generateBracket, simulateRound, ROUND_LABEL, type BracketMatch } from "@/lib/engine/bracket";
import { ORG_BY_ID } from "@/data/regions";
import { ProbabilityBar } from "@/components/match/ProbabilityBar";
import { PlayerPanel } from "@/components/match/PlayerPanel";
import { AgentRow } from "@/components/match/AgentRow";

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

function MatchPage() {
  const navigate = useNavigate();
  const { saveId } = Route.useSearch();
  const save = useDynasty((s) => s.saves.find((x) => x.id === saveId));
  const recordWin = useDynasty((s) => s.recordWin);
  const recordLoss = useDynasty((s) => s.recordLoss);
  const addTrophy = useDynasty((s) => s.addTrophy);

  const playerTeam: MatchTeam | null = useMemo(() => {
    if (!save) return null;
    const players = save.rosterPlayerIds.map((id) => PLAYER_BY_ID[id]).filter(Boolean);
    const coach = save.coachId ? (COACH_BY_ID[save.coachId] ?? null) : null;
    return { name: "DRAFT SQUAD", players, coach };
  }, [save]);

  const initialBracket = useMemo(() => {
    if (!save || !playerTeam) return null;
    const mode = GAME_MODE_BY_ID[save.modeId];
    const pool = TEAM_ENTRIES.filter((t) => mode.tournamentIds.includes(t.tournamentId));
    return generateBracket(playerTeam, pool);
  }, [save, playerTeam]);

  const [bracket, setBracket] = useState<BracketMatch[][] | null>(initialBracket);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);

  type MatchState = "IDLE" | "READY" | "PLAYING" | "FINISHED" | "ELIMINATED" | "ADVANCING";
  const [matchState, setMatchState] = useState<MatchState>("READY");

  // Match State
  const [currentMatchResult, setCurrentMatchResult] = useState<MatchResult | null>(null);
  const [displayedRoundCount, setDisplayedRoundCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  if (!save || !playerTeam || !bracket) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-sm text-muted-foreground">No active match.</div>
        <Link
          to="/play"
          className="clip-corner mt-4 inline-block bg-primary px-5 py-2.5 font-display text-sm tracking-widest text-primary-foreground"
        >
          New draft
        </Link>
      </div>
    );
  }

  const totalRounds = bracket.length;
  const currentBracketRound = bracket[currentRoundIdx];
  const allDone = bracket[totalRounds - 1]?.[0]?.winner;
  const isChampion = allDone === playerTeam;
  
  // Find player's match in this round
  const userMatch = currentBracketRound?.find(m => m.teamA === playerTeam || m.teamB === playerTeam);
  const isEliminated = !isChampion && !userMatch && currentRoundIdx > 0;

  // Initialize the match if it hasn't started
  if (userMatch && !userMatch.result && !currentMatchResult && userMatch.teamA && userMatch.teamB) {
    const engine = new MatchEngine();
    const result = engine.simulate(userMatch.teamA, userMatch.teamB);
    setCurrentMatchResult(result);
    setDisplayedRoundCount(0);
  }

  // Auto-simulate rounds when PLAYING
  useEffect(() => {
    if (matchState !== "PLAYING" || !currentMatchResult) return;

    const totalEvents = currentMatchResult.events.length;
    const isOvertimeMatch = totalEvents > 24;
    const MATCH_DURATION = isOvertimeMatch ? 15000 : 10000;
    const delayPerEvent = MATCH_DURATION / totalEvents;

    intervalRef.current = setInterval(() => {
      setDisplayedRoundCount(prev => {
        const next = prev + 1;
        if (next >= totalEvents) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setMatchState("FINISHED");
        }
        return next;
      });
    }, delayPerEvent);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [matchState, currentMatchResult]);

  const handlePlayMatch = () => {
    setMatchState("PLAYING");
  };

  const handleNextGame = () => {
    if (!currentMatchResult || !userMatch) return;

    setMatchState("ADVANCING");

    // Save result into the bracket
    userMatch.result = currentMatchResult;
    userMatch.winner = currentMatchResult.winner === "A" ? userMatch.teamA : userMatch.teamB;
    
    // Simulate the rest of the matches in this round
    const nextBracket = simulateRound(bracket, currentRoundIdx);
    setBracket(nextBracket);
    
    // Reset match state
    setCurrentMatchResult(null);
    setDisplayedRoundCount(0);
    
    if (currentRoundIdx + 1 < nextBracket.length) {
      setCurrentRoundIdx(currentRoundIdx + 1);
      setMatchState("READY");
    } else {
      // Tournament Done
      if (userMatch.winner === playerTeam) {
        recordWin(save.id);
        addTrophy(save.id, "Tournament Champion");
      }
    }
  };

  const handleLoss = () => {
    recordLoss(save.id);
    navigate({ to: "/play" });
  };

  if (isChampion) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-6xl text-gold mb-4">🏆 CHAMPIONS 🏆</h1>
        <p className="text-muted-foreground mb-8">You have conquered the tournament!</p>
        <Link
          to="/play"
          className="clip-corner mt-4 inline-block bg-primary px-8 py-4 font-display text-xl tracking-widest text-primary-foreground transition hover:brightness-110"
        >
          NEW DRAFT
        </Link>
      </div>
    );
  }

  if (isEliminated || matchState === "ELIMINATED") {
    // Collect stats for post-loss screen
    const matchesPlayed = bracket.flat().filter(m => (m.teamA === playerTeam || m.teamB === playerTeam) && m.result);
    const totalWins = matchesPlayed.filter(m => m.winner === playerTeam).length;

    const placementMap = ["TOP 16", "TOP 8", "TOP 4", "2ND PLACE"];
    const placement = placementMap[currentRoundIdx] || "UNRANKED";

    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-5xl sm:text-6xl text-destructive mb-4">
          ELIMINATED — {placement}
        </h1>
        <p className="text-muted-foreground mb-8">Your run ends here. Better luck next time.</p>
        
        <div className="clip-corner border border-border bg-surface/70 p-6 mb-8 text-left">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 border-b border-border/40 pb-2">
            Tournament Run
          </div>
          <div className="space-y-4">
            <div className="run-summary">
              <div>WINS: {totalWins}</div>
              <div>PLACEMENT: {placement}</div>
            </div>
            <div>
              <span className="text-muted-foreground block mb-2">Match History:</span>
              <ul className="space-y-2">
                {matchesPlayed.map((m, i) => {
                  const opp = m.teamA === playerTeam ? m.teamB : m.teamA;
                  const scoreUser = m.teamA === playerTeam ? m.result?.scoreA : m.result?.scoreB;
                  const scoreOpp = m.teamA === playerTeam ? m.result?.scoreB : m.result?.scoreA;
                  return (
                    <li key={i} className="flex justify-between text-sm bg-background/50 px-3 py-2">
                      <span>vs {opp?.name}</span>
                      <span className={m.winner === playerTeam ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                        {scoreUser} - {scoreOpp}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={handleLoss}
          className="clip-corner mt-4 inline-block border border-border bg-surface px-8 py-4 font-display text-xl tracking-widest transition hover:border-primary"
        >
          NEW DRAFT
        </button>
      </div>
    );
  }

  if (!userMatch || !userMatch.teamA || !userMatch.teamB) {
    return <div>Loading match...</div>;
  }

  const opponentTeam = userMatch.teamA === playerTeam ? userMatch.teamB : userMatch.teamA;
  const isPlayerTeamA = userMatch.teamA === playerTeam;

  const displayedEvents = currentMatchResult?.events.slice(0, displayedRoundCount) || [];
  const current = displayedEvents[displayedEvents.length - 1];
  
  // To limit the events shown in the UI feed:
  const isCurrentlyOvertime = displayedRoundCount > 24;
  const MAX_EVENTS = isCurrentlyOvertime ? 14 : 10;
  const recentEvents = displayedEvents.slice(-MAX_EVENTS);
  
  // To keep playerTeam on the left in UI, we map scores correctly
  const scoreUser = isPlayerTeamA ? (current?.scoreA ?? 0) : (current?.scoreB ?? 0);
  const scoreOpponent = isPlayerTeamA ? (current?.scoreB ?? 0) : (current?.scoreA ?? 0);
  
  // Prob is mapped to Player team
  const currentProbA = current ? (isPlayerTeamA ? current.probA : 1 - current.probA) : 0.5;

  const isMatchFinished = currentMatchResult && displayedRoundCount >= currentMatchResult.events.length;
  const userWon = isMatchFinished && ((currentMatchResult.winner === "A" && isPlayerTeamA) || (currentMatchResult.winner === "B" && !isPlayerTeamA));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary flex items-center">
          <span className="animate-pulse mr-2">🔴 LIVE</span>
          VCT Broadcast — {ROUND_LABEL(currentRoundIdx + 1, totalRounds)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Match Status & Player Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scoreboard */}
          <div className="clip-corner border border-border bg-surface/80 p-6 backdrop-blur flex items-center justify-between">
            <TeamCard label={playerTeam.name} subtitle="Your team" side="left" />
            <div className="text-center px-8">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">
                {isMatchFinished ? "FINAL SCORE" : "MR13"}
              </div>
              <div className="flex items-baseline justify-center gap-6 font-display text-7xl">
                <span className={scoreUser > scoreOpponent ? "text-green-500" : (scoreUser < scoreOpponent ? "text-red-500" : "")}>{scoreUser}</span>
                <span className="text-muted-foreground/40 text-4xl">:</span>
                <span className={scoreOpponent > scoreUser ? "text-green-500" : (scoreOpponent < scoreUser ? "text-red-500" : "")}>{scoreOpponent}</span>
              </div>
            </div>
            <TeamCard
              label={opponentTeam.name}
              subtitle={`${ORG_BY_ID[opponentTeam.players[0]?.orgId ?? ""]?.region ?? ""}`}
              side="right"
            />
          </div>

          {/* Probability Bar */}
          <div className="clip-corner border border-border bg-surface/80 p-4 backdrop-blur">
            <ProbabilityBar probA={currentProbA} />
          </div>

          {/* Player Panel */}
          <div className="clip-corner border border-border bg-surface/80 p-6 backdrop-blur">
             <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4 border-b border-border/40 pb-2">
                Matchup Overview
             </div>
             <PlayerPanel teamA={playerTeam} teamB={opponentTeam} />
          </div>
        </div>

        {/* Right Column: Live Feed & End Match */}
        <div className="space-y-6">
          <div className="clip-corner border border-border bg-surface/80 p-5 backdrop-blur h-[420px] flex flex-col">
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">
              // Play-by-play Feed
            </div>
            <ul className="space-y-2 flex-1 overflow-y-auto pr-2 flex flex-col-reverse feed">
              <AnimatePresence initial={false}>
                {recentEvents
                  .slice()
                  .reverse()
                  .map((e, i) => {
                    const isWinEvent = (e.winner === "A" && isPlayerTeamA) || (e.winner === "B" && !isPlayerTeamA);
                    return (
                      <motion.li
                        key={`${e.round}-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex flex-col gap-1 border-l-2 px-3 py-2 text-sm ${
                          e.type === "ACE" || e.type === "CLUTCH" || e.type === "MAP_POINT" || e.type === "MATCH_POINT"
                            ? (isWinEvent ? "border-green-500/60 bg-green-500/10 text-foreground" : "border-red-500/60 bg-red-500/10 text-foreground")
                            : "border-border/50 text-muted-foreground bg-surface/40"
                        }`}
                      >
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground">
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
                            {isPlayerTeamA ? e.scoreA : e.scoreB}:{isPlayerTeamA ? e.scoreB : e.scoreA}
                          </span>
                        </div>
                        <div className="text-sm leading-snug text-foreground/90">{e.text}</div>
                      </motion.li>
                    );
                  })}
              </AnimatePresence>
            </ul>
          </div>

          {matchState === "READY" ? (
            <button
              onClick={handlePlayMatch}
              className="w-full clip-corner bg-primary px-6 py-4 font-display text-2xl tracking-widest text-primary-foreground transition hover:brightness-110 cursor-pointer animate-pulse"
            >
              PLAY MATCH
            </button>
          ) : matchState === "PLAYING" ? (
            <button
              disabled
              className="w-full clip-corner bg-surface border border-border px-6 py-4 font-display text-lg tracking-widest text-muted-foreground cursor-not-allowed"
            >
              SIMULATING...
            </button>
          ) : matchState === "FINISHED" ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`clip-corner border p-6 backdrop-blur ${
                  userWon
                    ? "border-green-500/60 bg-green-500/10"
                    : "border-red-500/60 bg-red-500/10"
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Match result
                </div>
                <div
                  className={`mt-1 font-display text-4xl ${
                    userWon ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {userWon ? "VICTORY" : "DEFEAT"}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {userWon ? (
                    <button
                      onClick={handleNextGame}
                      className="w-full clip-corner border border-gold/60 bg-gold/20 px-5 py-4 font-display text-xl tracking-widest text-gold transition hover:bg-gold/30 cursor-pointer"
                    >
                      NEXT GAME
                    </button>
                  ) : (
                    <button
                      onClick={() => setMatchState("ELIMINATED")}
                      className="w-full clip-corner border border-border bg-surface px-5 py-4 font-display text-xl tracking-widest transition hover:border-primary cursor-pointer"
                    >
                      CONTINUE
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TeamCard({
  label,
  subtitle,
  side,
}: {
  label: string;
  subtitle: string;
  side: "left" | "right";
}) {
  return (
    <div className={`flex flex-col ${side === "right" ? "items-end text-right" : "items-start"}`}>
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
        {side === "left" ? "// HOME" : "// AWAY"}
      </div>
      <div className="mt-1 font-display text-3xl max-w-[180px] truncate" title={label}>{label}</div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{subtitle}</div>
    </div>
  );
}
