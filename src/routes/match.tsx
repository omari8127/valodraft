import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { useDynasty } from "@/lib/store/dynasty";
import type { PlayerEntry, DraftMode } from "@/types/game";
import { PLAYER_BY_ID, COACH_BY_ID, TEAM_ENTRIES } from "@/data/generate";
import { GAME_MODE_BY_ID } from "@/data/tournaments";
import { MatchEngine, type MatchEvent, type MatchTeam, type MatchResult } from "@/lib/engine/match";
import { generateBracket, simulateRound, ROUND_LABEL, type BracketMatch } from "@/lib/engine/bracket";
import { ORG_BY_ID } from "@/data/regions";
import { ProbabilityBar } from "@/components/match/ProbabilityBar";
import { PlayerPanel } from "@/components/match/PlayerPanel";
import { AgentRow } from "@/components/match/AgentRow";
import { computeCompositionStats } from "@/lib/engine/roleBalance";
import { useLanguage } from "@/lib/i18n";
import { useProgression } from "@/lib/store/progression";
import { Award, Flame, X, Trophy } from "lucide-react";

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

type SimSpeed = "SLOW" | "NORMAL" | "FAST" | "ULTRA";

function MatchPage() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { saveId } = Route.useSearch();
  const save = useDynasty((s) => s.saves.find((x) => x.id === saveId));
  const recordWin = useDynasty((s) => s.recordWin);
  const recordLoss = useDynasty((s) => s.recordLoss);
  const addTrophy = useDynasty((s) => s.addTrophy);

  // Progression Store Actions
  const recordMatchResult = useProgression((s) => s.recordMatchResult);
  const rankedActive = useProgression((s) => s.rankedActive);

  // Simulation Speed State
  const [simSpeed, setSimSpeed] = useState<SimSpeed>("NORMAL");

  // Rewards state
  const [rewards, setRewards] = useState<{ mmrChange: number; xpChange: number; leveledUp: boolean } | null>(null);
  const [showReplayModal, setShowReplayModal] = useState(false);

  const playerTeam: MatchTeam | null = useMemo(() => {
    if (!save) return null;
    const players = save.rosterPlayerIds
      .map((id) => {
        const p = PLAYER_BY_ID[id];
        if (!p) return null;
        const form = save.playerForms?.[id] ?? 0;
        return { ...p, form };
      })
      .filter(Boolean) as PlayerEntry[];
    const coach = save.coachId ? (COACH_BY_ID[save.coachId] ?? null) : null;
    return { name: "DRAFT SQUAD", players, coach };
  }, [save]);

  // Apply theme dynamically to persist theme during match
  useEffect(() => {
    const savedTheme = localStorage.getItem("ui-theme");
    if (savedTheme) {
      document.body.setAttribute("data-theme", savedTheme);
      const bgClass = savedTheme === "champions" ? "bg-champions-particles" : savedTheme === "masters" ? "bg-masters-particles" : "";
      document.body.classList.remove("bg-champions-particles", "bg-masters-particles");
      if (bgClass) {
        document.body.classList.add(bgClass);
      }
    }
  }, []);

  const compStats = useMemo(() => {
    if (!playerTeam) return null;
    return computeCompositionStats(playerTeam.players);
  }, [playerTeam]);

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
          {t("newDraft")}
        </Link>
      </div>
    );
  }

  const totalRounds = bracket.length;
  const currentBracketRound = bracket[currentRoundIdx];
  const allDone = bracket[totalRounds - 1]?.[0]?.winner;
  const isChampion = allDone === playerTeam;

  const userMatch = currentBracketRound?.find(m => m.teamA === playerTeam || m.teamB === playerTeam);
  const isEliminated = !isChampion && !userMatch && currentRoundIdx > 0;

  const opponentTeam = userMatch?.teamA === playerTeam ? userMatch?.teamB : userMatch?.teamA;
  const isPlayerTeamA = userMatch?.teamA === playerTeam;

  // Initialize match using the saved draftMode context
  if (userMatch && !userMatch.result && !currentMatchResult && userMatch.teamA && userMatch.teamB) {
    const engine = new MatchEngine();
    const result = engine.simulate(userMatch.teamA, userMatch.teamB, save.draftMode ?? "STRICT");
    setCurrentMatchResult(result);
    setDisplayedRoundCount(0);
  }

  // Auto-simulate rounds based on Speed Selection
  useEffect(() => {
    if (matchState !== "PLAYING" || !currentMatchResult) return;

    if (simSpeed === "ULTRA") {
      // ULTRA Speed: skip interval timer and resolve instantly
      setDisplayedRoundCount(currentMatchResult.events.length);
      setMatchState("FINISHED");
      return;
    }

    const delayMs = simSpeed === "SLOW" ? 1200 : simSpeed === "FAST" ? 250 : 600;

    intervalRef.current = setInterval(() => {
      setDisplayedRoundCount((prev) => {
        const next = prev + 1;
        if (next >= currentMatchResult.events.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setMatchState("FINISHED");
        }
        return next;
      });
    }, delayMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [matchState, currentMatchResult, simSpeed]);

  // Trigger MMR & XP rewards on match completion
  useEffect(() => {
    if (matchState === "FINISHED" && currentMatchResult) {
      const won = (currentMatchResult.winner === "A" && isPlayerTeamA) || (currentMatchResult.winner === "B" && !isPlayerTeamA);
      const res = recordMatchResult(won);
      setRewards(res);
    }
  }, [matchState, currentMatchResult, isPlayerTeamA, recordMatchResult]);

  const handlePlayMatch = () => {
    setMatchState("PLAYING");
  };

  const handleNextGame = () => {
    if (!currentMatchResult || !userMatch) return;

    setMatchState("ADVANCING");

    // Save result into the bracket
    userMatch.result = currentMatchResult;
    userMatch.winner = currentMatchResult.winner === "A" ? userMatch.teamA : userMatch.teamB;

    // Simulate the rest of the matches in this round using the saved draftMode rules
    const nextBracket = simulateRound(bracket, currentRoundIdx, save.draftMode ?? "STRICT");
    setBracket(nextBracket);

    // Reset match state
    setCurrentMatchResult(null);
    setRewards(null);
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
        <h1 className="font-display text-6xl text-gold mb-4 flex justify-center items-center gap-2">
          <Trophy className="w-14 h-14 text-gold" /> CHAMPIONS 🏆
        </h1>
        <p className="text-muted-foreground mb-8">You have conquered the tournament!</p>
        <Link
          to="/play"
          className="clip-corner mt-4 inline-block bg-primary px-8 py-4 font-display text-xl tracking-widest text-primary-foreground transition hover:brightness-110"
        >
          {t("newDraft")}
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

        {rewards && (
          <div className="clip-corner border border-red-500 bg-red-500/10 p-5 mb-6 text-center w-full max-w-sm mx-auto">
            <div className="font-display text-lg text-red-400 uppercase tracking-wider">{t("rewardsTitle")}</div>
            <div className="mt-2 flex justify-center gap-6 font-bold text-sm">
              {rankedActive && (
                <span className="text-red-400">MMR {rewards.mmrChange >= 0 ? `+${rewards.mmrChange}` : rewards.mmrChange}</span>
              )}
              <span className="text-slate-300">XP +{rewards.xpChange}</span>
            </div>
          </div>
        )}

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
          className="clip-corner mt-4 inline-block border border-border bg-surface px-8 py-4 font-display text-xl tracking-widest transition hover:border-primary cursor-pointer"
        >
          {t("newDraft")}
        </button>
      </div>
    );
  }

  if (!userMatch || !userMatch.teamA || !userMatch.teamB || !opponentTeam) {
    return <div>Loading match...</div>;
  }

  const displayedEvents = currentMatchResult?.events.slice(0, displayedRoundCount) || [];
  const current = displayedEvents[displayedEvents.length - 1];

  // Limit events shown in live UI feed
  const isCurrentlyOvertime = displayedRoundCount > 24;
  const MAX_EVENTS = isCurrentlyOvertime ? 14 : 10;
  const recentEvents = displayedEvents.slice(-MAX_EVENTS);

  const scoreUser = isPlayerTeamA ? (current?.scoreA ?? 0) : (current?.scoreB ?? 0);
  const scoreOpponent = isPlayerTeamA ? (current?.scoreB ?? 0) : (current?.scoreA ?? 0);

  const currentProbA = current ? (isPlayerTeamA ? current.probA : 1 - current.probA) : 0.5;

  const isMatchFinished = currentMatchResult && displayedRoundCount >= currentMatchResult.events.length;
  const userWon = isMatchFinished && ((currentMatchResult.winner === "A" && isPlayerTeamA) || (currentMatchResult.winner === "B" && !isPlayerTeamA));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary flex items-center">
          <span className="animate-pulse mr-2">{t("liveLabel")}</span>
          {t("broadcastLabel")} — {ROUND_LABEL(currentRoundIdx + 1, totalRounds)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scoreboard, Prob bar, & Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scoreboard */}
          <div className="clip-corner border border-border bg-surface/80 p-6 backdrop-blur flex items-center justify-between">
            <TeamCard label={playerTeam.name} subtitle="Your team" side="left" />
            <div className="text-center px-8">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">
                {isMatchFinished ? t("scoreboardFinalScore") : "MR13"}
              </div>
              <div className="flex items-baseline justify-center gap-6 font-display text-7xl">
                <span className={scoreUser > scoreOpponent ? "text-green-500" : (scoreUser < scoreOpponent ? "text-red-500" : "")}>{scoreUser}</span>
                <span className="text-muted-foreground/40 text-4xl">:</span>
                <span className={scoreOpponent > scoreUser ? "text-green-500" : (scoreOpponent < scoreUser ? "text-red-500" : "")}>{scoreOpponent}</span>
              </div>
            </div>
            <TeamCard
              label={opponentTeam.name}
              subtitle="AWAY OPPONENT"
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
                {t("matchupOverview")}
             </div>
             <PlayerPanel teamA={playerTeam} teamB={opponentTeam} />
          </div>
        </div>

        {/* Right Column: Live Feed & Speed Controls & Action Buttons */}
        <div className="space-y-6">
          {/* Speed Controller (SLOW, NORMAL, FAST, ULTRA) */}
          <div className="clip-corner border border-border bg-surface/80 p-4 backdrop-blur space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              ⚡ {t("simulationSpeed")}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(["SLOW", "NORMAL", "FAST", "ULTRA"] as SimSpeed[]).map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSimSpeed(sp)}
                  className={`py-2 text-[9px] font-bold uppercase tracking-wide border transition clip-corner cursor-pointer ${
                    simSpeed === sp
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/60 bg-background/25 text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          <div className="clip-corner border border-border bg-surface/80 p-5 backdrop-blur h-[340px] flex flex-col">
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">
              // {t("playByPlay")}
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
            <div className="space-y-4">
              {compStats && compStats.warnings.length > 0 && save.draftMode !== "CHAOS" && (
                <div className="clip-corner border border-amber-500/40 bg-amber-500/10 p-4 text-left backdrop-blur">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2 flex items-center gap-1.5">
                    <span>⚠️ COMPOSITION WARNING</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-muted-foreground font-sans">
                    {compStats.warnings.map((warn, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span>{warn}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={handlePlayMatch}
                className="w-full clip-corner bg-primary px-6 py-4 font-display text-2xl tracking-widest text-primary-foreground transition hover:brightness-110 cursor-pointer animate-pulse font-bold"
              >
                {t("playMatch")}
              </button>
            </div>
          ) : matchState === "PLAYING" ? (
            <button
              disabled
              className="w-full clip-corner bg-surface border border-border px-6 py-4 font-display text-lg tracking-widest text-muted-foreground cursor-not-allowed"
            >
              {t("simulating")}
            </button>
          ) : matchState === "FINISHED" ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`clip-corner border p-5 backdrop-blur space-y-4 ${
                  userWon
                    ? "border-green-500/60 bg-green-500/10"
                    : "border-red-500/60 bg-red-500/10"
                }`}
              >
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Match result
                  </div>
                  <div
                    className={`font-display text-4xl ${
                      userWon ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {userWon ? t("victory") : t("defeat")}
                  </div>
                </div>

                {/* Rewards UI */}
                {rewards && (
                  <div className="bg-background/60 p-3 rounded border border-border/40 clip-corner text-xs space-y-2">
                    <div className="font-semibold text-slate-300 font-sans">{t("rewardsTitle")}</div>
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
                        🎉 LEVEL UP! You reached Level {useProgression.getState().level}! Unlocked year {2020 + useProgression.getState().level} rosters!
                      </div>
                    )}
                  </div>
                )}

                {/* Logs & Next buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setShowReplayModal(true)}
                    className="w-full clip-corner border border-primary/60 bg-primary/5 hover:bg-primary/15 text-primary py-3 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    📝 {t("viewReplayLogs")}
                  </button>

                  {userWon ? (
                    <button
                      onClick={handleNextGame}
                      className="w-full clip-corner border border-gold/60 bg-gold/20 px-5 py-3.5 font-display text-xl tracking-widest text-gold transition hover:bg-gold/30 cursor-pointer font-bold"
                    >
                      {t("nextGame")}
                    </button>
                  ) : (
                    <button
                      onClick={() => setMatchState("ELIMINATED")}
                      className="w-full clip-corner border border-border bg-surface px-5 py-3.5 font-display text-xl tracking-widest transition hover:border-primary cursor-pointer font-bold"
                    >
                      {t("continueBtn")}
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>
      </div>

      {/* DETAILED ROUND REPLAY LOGS MODAL */}
      <AnimatePresence>
        {showReplayModal && currentMatchResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="clip-corner border border-border bg-surface w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-border/50 flex justify-between items-center bg-background/50">
                <div>
                  <h3 className="font-display text-lg text-primary flex items-center gap-1.5 uppercase tracking-wide">
                    📝 {t("replayLogsHeader")}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-sans">
                    {playerTeam.name} vs {opponentTeam.name} · Map: {currentMatchResult.mapName}
                  </p>
                </div>
                <button
                  onClick={() => setShowReplayModal(false)}
                  className="p-1 text-muted-foreground hover:text-white border border-border/50 bg-background/30 rounded clip-corner transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/25">
                {currentMatchResult.events.map((e) => {
                  const isWinEvent = (e.winner === "A" && isPlayerTeamA) || (e.winner === "B" && !isPlayerTeamA);
                  return (
                    <div
                      key={e.round}
                      className={`border-l-4 p-3 bg-background/40 flex flex-col gap-1 rounded text-sm transition ${
                        isWinEvent
                          ? "border-green-500 bg-green-500/5 hover:bg-green-500/10"
                          : "border-red-500 bg-red-500/5 hover:bg-red-500/10"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase">
                        <span className="flex items-center gap-2">
                          <span className="text-primary font-display">Round {e.round}</span>
                          {e.type !== "ROUND" && (
                            <span
                              className={`px-1.5 py-0.2 rounded text-[8px] tracking-wide font-mono ${
                                isWinEvent
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {e.type.replace("_", " ")}
                            </span>
                          )}
                          {e.agent && <AgentRow agent={e.agent} />}
                        </span>
                        <span className="font-mono text-foreground/80">
                          Score: {isPlayerTeamA ? e.scoreA : e.scoreB} - {isPlayerTeamA ? e.scoreB : e.scoreA}
                        </span>
                      </div>
                      <p className="text-foreground/90 font-sans text-xs leading-relaxed mt-0.5">
                        {e.text}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border/50 flex justify-end bg-background/50">
                <button
                  onClick={() => setShowReplayModal(false)}
                  className="clip-corner border border-border bg-background hover:bg-surface px-6 py-2.5 text-xs font-bold uppercase transition cursor-pointer"
                >
                  {t("closeLogs")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
      <div className="mt-1 font-display text-3xl max-w-[200px] truncate" title={label}>{label}</div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{subtitle}</div>
    </div>
  );
}
