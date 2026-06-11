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
import { playSfx, unlockSfx } from "@/lib/sfx";
import { BracketSimulation } from "@/components/match/BracketSimulation";
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
  errorComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-display text-red-500 mb-4">Simulation Crashed</h1>
      <p className="text-muted-foreground mb-8">An error occurred during the simulation. Please try again.</p>
      <Link to="/play" className="clip-corner bg-primary px-6 py-3 text-primary-foreground font-display tracking-widest">RETURN HOME</Link>
    </div>
  ),
});

type SimSpeed = "NORMAL" | "FAST" | "ULTRA";

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
        const assignedRole = save.roleAssignments?.[id] ?? p.primaryRole;
        return { ...p, form, role: assignedRole, primaryRole: assignedRole };
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

  const [bracket, setBracket] = useState<BracketMatch[][] | null>(null);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);

  useEffect(() => {
    if (!save || !playerTeam || bracket) return;
    const mode = GAME_MODE_BY_ID[save.modeId];
    const pool = TEAM_ENTRIES.filter((t) => mode.tournamentIds.includes(t.tournamentId));
    setBracket(generateBracket(playerTeam, pool));
  }, [save, playerTeam, bracket]);

  type MatchState = "IDLE" | "READY" | "PLAYING" | "FINISHED" | "ELIMINATED" | "ADVANCING";
  const [matchState, setMatchState] = useState<MatchState>("READY");

  // Match State
  const [currentMatchResult, setCurrentMatchResult] = useState<MatchResult | null>(null);
  const [displayedRoundCount, setDisplayedRoundCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastEventCountRef = useRef(0);
  const rewardKeyRef = useRef<string | null>(null);
  const resultSoundKeyRef = useRef<string | null>(null);
  const championSoundPlayedRef = useRef(false);

  const maps = [
    { name: "Ascent", image: "/maps/ascent.png" },
    { name: "Bind", image: "/maps/bind.png" },
    { name: "Haven", image: "/maps/haven.png" },
    { name: "Split", image: "/maps/split.png" },
    { name: "Lotus", image: "/maps/lotus.png" }
  ];

  const [isHomeAttack, setIsHomeAttack] = useState(true);
  const [map, setMap] = useState(maps[0]);

  useEffect(() => {
    setIsHomeAttack(Math.random() > 0.5);
    setMap(maps[Math.floor(Math.random() * maps.length)]);
  }, [currentRoundIdx]);

  const homeSide = isHomeAttack ? "ATTACK" : "DEFENSE";
  const awaySide = isHomeAttack ? "DEFENSE" : "ATTACK";

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

  // Safe Rendering Guard
  if (!playerTeam.players || playerTeam.players.length === 0) {
    return null;
  }

  const totalRounds = bracket.length;
  const currentBracketRound = bracket[currentRoundIdx];
  const allDone = bracket[totalRounds - 1]?.[0]?.winner;
  const isChampion = allDone?.name === playerTeam.name;

  const userMatch = currentBracketRound?.find(m => m.teamA?.name === playerTeam.name || m.teamB?.name === playerTeam.name);
  const isEliminated = !isChampion && !userMatch && currentRoundIdx > 0;

  const opponentTeam = userMatch?.teamA?.name === playerTeam.name ? userMatch?.teamB : userMatch?.teamA;
  const isPlayerTeamA = userMatch?.teamA?.name === playerTeam.name;

  // Initialize match using the saved draftMode context
  useEffect(() => {
    if (userMatch && !userMatch.result && !currentMatchResult && userMatch.teamA && userMatch.teamB && save) {
      const engine = new MatchEngine();
      const result = engine.simulate(userMatch.teamA, userMatch.teamB, save.draftMode ?? "STRICT");
      setCurrentMatchResult(result);
      setDisplayedRoundCount(0);
    }
  }, [userMatch, currentMatchResult, save]);

  // Auto-simulate rounds based on Speed Selection
  useEffect(() => {
    if (matchState !== "PLAYING" || !currentMatchResult) return;
    
    // ULTRA speed resolves the match instantly
    if (simSpeed === "ULTRA") {
      setDisplayedRoundCount(currentMatchResult.events.length);
      setMatchState("FINISHED");
      return;
    }

    if (displayedRoundCount >= currentMatchResult.events.length) {
      setMatchState("FINISHED");
      return;
    }

    const interval = simSpeed === "NORMAL" ? 1000 : 400; // FAST = ~2x NORMAL

    const timer = setTimeout(() => {
      setDisplayedRoundCount((c) => c + 1);
    }, interval);

    return () => clearTimeout(timer);
  }, [matchState, currentMatchResult, displayedRoundCount, simSpeed]);

  useEffect(() => {
    if (isChampion && !championSoundPlayedRef.current) {
      championSoundPlayedRef.current = true;
      playSfx("champion");
    }
  }, [isChampion]);

  useEffect(() => {
    if (matchState !== "PLAYING" || !currentMatchResult || displayedRoundCount <= 0) return;
    if (displayedRoundCount === lastEventCountRef.current) return;

    const event = currentMatchResult.events[displayedRoundCount - 1];
    if (!event) return;

    const isUserRound = (event.winner === "A" && isPlayerTeamA) || (event.winner === "B" && !isPlayerTeamA);
    const isBigMoment = ["ACE", "CLUTCH", "MAP_POINT", "MATCH_POINT"].includes(event.type);
    playSfx(isBigMoment ? "roundBig" : isUserRound ? "roundWin" : "roundLoss");
    lastEventCountRef.current = displayedRoundCount;
  }, [displayedRoundCount, matchState, currentMatchResult, isPlayerTeamA]);

  // Trigger MMR & XP rewards on match completion
  useEffect(() => {
    if (matchState === "FINISHED" && currentMatchResult) {
      const won = (currentMatchResult.winner === "A" && isPlayerTeamA) || (currentMatchResult.winner === "B" && !isPlayerTeamA);
      const resultKey = `${currentRoundIdx}-${currentMatchResult.scoreA}-${currentMatchResult.scoreB}-${currentMatchResult.winner}`;

      if (rewardKeyRef.current !== resultKey) {
        const res = recordMatchResult(won);
        setRewards(res);
        rewardKeyRef.current = resultKey;
      }

      if (resultSoundKeyRef.current !== resultKey) {
        playSfx(won ? "victory" : "defeat");
        resultSoundKeyRef.current = resultKey;
      }
    }
  }, [matchState, currentMatchResult, isPlayerTeamA, recordMatchResult, currentRoundIdx]);

  const handlePlayMatch = () => {
    unlockSfx();
    playSfx("matchStart");
    lastEventCountRef.current = 0;
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
    lastEventCountRef.current = 0;
    rewardKeyRef.current = null;
    resultSoundKeyRef.current = null;

    if (currentRoundIdx + 1 < nextBracket.length) {
      setCurrentRoundIdx(currentRoundIdx + 1);
      setMatchState("READY");
    } else {
      // Tournament Done
      if (userMatch.winner?.name === playerTeam.name) {
        recordWin(save.id);
        addTrophy(save.id, "Tournament Champion");
      }
    }
  };

  const handleLoss = () => {
    playSfx("click");
    recordLoss(save.id);
    navigate({ to: "/play" });
  };

  if (isChampion) {
    return (
      <div className="champion-screen mx-auto max-w-3xl px-4 py-20 text-center">
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

  if (matchState === "ELIMINATED" && bracket) {
    const totalWins = bracket.flat().filter(m => m.winner?.name === playerTeam.name).length;
    const roundsReached = bracket.findIndex(r => r.some(m => m.teamA?.name === playerTeam.name || m.teamB?.name === playerTeam.name));
    const isWinner = bracket[bracket.length - 1][0]?.winner?.name === playerTeam.name;
    const placement = isWinner ? "CHAMPIONS" : ROUND_LABEL(roundsReached + 1, bracket.length).toUpperCase();

    // The user lost, but we simulate the rest of the bracket completely for realistic results
    let finalBracket = [...bracket];
    for (let r = currentRoundIdx; r < finalBracket.length; r++) {
       finalBracket = simulateRound(finalBracket, r, save?.draftMode ?? "STRICT");
    }

    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-2">
          // TOURNAMENT RUN ENDED
        </div>
        <h1 className="font-display text-5xl sm:text-6xl text-destructive mb-4">
          ELIMINATED — {placement}
        </h1>
        <p className="text-muted-foreground mb-8">Your run ends here. Better luck next time.</p>

        {rewards && (
          <div className="clip-corner border border-red-500 bg-red-500/10 p-5 mb-8 text-center w-full max-w-sm mx-auto">
            <div className="font-display text-lg text-red-400 uppercase tracking-wider">{t("rewardsTitle")}</div>
            <div className="mt-2 flex justify-center gap-6 font-bold text-sm">
              {rankedActive && (
                <span className="text-red-400">MMR {rewards.mmrChange >= 0 ? `+${rewards.mmrChange}` : rewards.mmrChange}</span>
              )}
              <span className="text-slate-300">XP +{rewards.xpChange}</span>
            </div>
          </div>
        )}

        <BracketSimulation 
          bracket={finalBracket} 
          playerTeam={playerTeam} 
          eliminatedRoundIdx={roundsReached} 
        />

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
  const simulationProgress = currentMatchResult
    ? Math.min(100, Math.round((displayedRoundCount / Math.max(1, currentMatchResult.events.length)) * 100))
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <AnimatePresence>
        {matchState === "FINISHED" && currentMatchResult && (
          <motion.div
            key={`cinema-${currentRoundIdx}-${currentMatchResult.winner}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`match-cinematic-overlay ${userWon ? "is-victory" : "is-defeat"}`}
          >
            <motion.div
              initial={{ scale: 0.72, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="match-cinematic-content"
            >
              <div className="text-[11px] font-black uppercase tracking-[0.45em] text-white/55">
                {ROUND_LABEL(currentRoundIdx + 1, totalRounds)} · {map.name}
              </div>
              <div className="mt-2 font-display text-6xl sm:text-8xl">
                {userWon ? t("victory") : t("defeat")}
              </div>
              <div className="mt-3 font-display text-3xl text-white/85">
                {scoreUser} : {scoreOpponent}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          {playerTeam.name.length + opponentTeam.name.length > 25 ? (
            <div className="clip-corner border border-border bg-surface/80 p-6 backdrop-blur flex flex-col items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">
                  {isMatchFinished ? t("scoreboardFinalScore") : "MR13"}
                </div>
                <div className="flex items-baseline justify-center gap-6 font-display text-7xl">
                  <span className={scoreUser > scoreOpponent ? "text-green-500" : (scoreUser < scoreOpponent ? "text-red-500" : "")}>{scoreUser}</span>
                  <span className="text-muted-foreground/40 text-4xl">:</span>
                  <span className={scoreOpponent > scoreUser ? "text-green-500" : (scoreOpponent < scoreUser ? "text-red-500" : "")}>{scoreOpponent}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 w-full">
                <TeamCard label={playerTeam.name} subtitle="Your team" side="center" sideLabel={homeSide} />
                <div className="h-px w-1/3 bg-border/50"></div>
                <TeamCard
                  label={opponentTeam.name}
                  subtitle={`${(opponentTeam as any).rosterName || opponentTeam.name} • ${(opponentTeam as any).year || new Date().getFullYear()} • ${(opponentTeam as any).tournamentId || "VCT Champions"}`}
                  side="center"
                  sideLabel={awaySide}
                />
              </div>
            </div>
          ) : (
            <div className="clip-corner border border-border bg-surface/80 p-6 backdrop-blur flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <TeamCard label={playerTeam.name} subtitle="Your team" side="left" sideLabel={homeSide} />
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
                subtitle={`${(opponentTeam as any).rosterName || opponentTeam.name} • ${(opponentTeam as any).year || new Date().getFullYear()} • ${(opponentTeam as any).tournamentId || "VCT Champions"}`}
                side="right"
                sideLabel={awaySide}
              />
            </div>
          )}

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
          {/* Speed Controller (NORMAL, FAST, ULTRA) */}
          <div className="clip-corner border border-border bg-surface/80 p-4 backdrop-blur space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              ⚡ {t("simulationSpeed")}
            </div>
            <div className="flex gap-2">
              <div className="grid grid-cols-3 w-full bg-background/50 border border-border/40 p-1 clip-corner text-xs font-bold tracking-wider">
                {(["NORMAL", "FAST", "ULTRA"] as SimSpeed[]).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSimSpeed(spd)}
                    className={`py-1.5 text-center cursor-pointer transition-colors ${
                      simSpeed === spd ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-surface"
                    }`}
                  >
                    {spd}
                  </button>
                ))}
              </div>
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

              <div className="w-full clip-corner h-16 relative overflow-hidden border border-border/40 group">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${map.image})` }}
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="font-display text-xl tracking-[0.3em] text-white/90 uppercase drop-shadow-md">
                    {map.name}
                  </span>
                </div>
              </div>
            </div>
          ) : matchState === "PLAYING" ? (
            <div className="live-sim-status clip-corner border border-primary/40 bg-surface/85 p-5 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Partida en vivo</div>
                  <div className="mt-1 font-display text-xl tracking-widest text-foreground">
                    {t("simulating")}... ({simulationProgress}%)
                  </div>
                </div>
                <div className="h-11 w-11 rounded-full border border-gold/50 bg-gold/10 grid place-items-center text-gold live-orb">⚡</div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full border border-border bg-background/70">
                <div className="h-full bg-gold transition-all duration-300" style={{ width: `${simulationProgress}%` }} />
              </div>
              <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Selección, economía, momentum y clutch factor en proceso
              </div>
            </div>
          ) : matchState === "FINISHED" ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`match-result-panel clip-corner border p-5 backdrop-blur space-y-4 ${
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
                    onClick={() => {
                      playSfx("click");
                      setShowReplayModal(true);
                    }}
                    className="w-full clip-corner border border-primary/60 bg-primary/5 hover:bg-primary/15 text-primary py-3 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    📝 {t("viewReplayLogs")}
                  </button>

                  {userWon ? (
                    <button
                      onClick={() => {
                        playSfx("select");
                        handleNextGame();
                      }}
                      className="w-full clip-corner border border-gold/60 bg-gold/20 px-5 py-3.5 font-display text-xl tracking-widest text-gold transition hover:bg-gold/30 cursor-pointer font-bold"
                    >
                      {t("nextGame")}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        playSfx("click");
                        setMatchState("ELIMINATED");
                      }}
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
                  onClick={() => {
                    playSfx("click");
                    setShowReplayModal(false);
                  }}
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
                  onClick={() => {
                    playSfx("click");
                    setShowReplayModal(false);
                  }}
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
  sideLabel,
}: {
  label: string;
  subtitle: string;
  side: "left" | "right" | "center";
  sideLabel: string;
}) {
  return (
    <div className={`flex flex-col ${side === "right" ? "items-end text-right" : side === "center" ? "items-center text-center" : "items-start text-left"}`}>
      <p className={`text-xs tracking-widest text-white/40`}>
        // {sideLabel}
      </p>
      <div className="mt-1 font-display text-2xl md:text-3xl w-auto min-w-0 flex-1 whitespace-nowrap overflow-hidden text-ellipsis md:overflow-visible md:text-clip" title={label}>
        {label}
      </div>
      <p className="text-xs text-white/60 mt-1 uppercase tracking-widest">{subtitle}</p>
    </div>
  );
}
