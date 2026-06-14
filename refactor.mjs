import fs from 'fs';
import path from 'path';

const matchTsxPath = path.resolve('src/routes/match.tsx');
let matchContent = fs.readFileSync(matchTsxPath, 'utf8');

// 1. Imports
matchContent = matchContent.replace(
  /import \{ generateInitialSwissState.*?\} from "@\/lib\/engine\/bracket";/g,
  `import { getTop8FromHiddenSimulation, generateDoubleEliminationBracket, simulateBracketStage, ROUND_LABEL, type BracketMatch } from "@/lib/engine/bracket";`
);

// 2. Remove Swiss states and change init
matchContent = matchContent.replace(
  /const \[swissState, setSwissState\] = useState<SwissTeamState\[\]>\(\[\]\);\s*const \[swissMatches, setSwissMatches\] = useState<BracketMatch\[\]>\(\[\]\);\s*const \[playoffBracket, setPlayoffBracket\] = useState<BracketMatch\[\]\[\]>\(\[\]\);\s*const \[tournamentPhase, setTournamentPhase\] = useState<"SWISS" \| "PLAYOFFS">("SWISS");/g,
  `const [playoffBracket, setPlayoffBracket] = useState<BracketMatch[][]>([]);
  const [tournamentPhase, setTournamentPhase] = useState<"PRE_TOURNAMENT" | "PLAYOFFS">("PRE_TOURNAMENT");`
);

// 3. Init effect
matchContent = matchContent.replace(
  /useEffect\(\(\) => \{\s*if \(!save \|\| !playerTeam \|\| swissState\.length > 0\) return;\s*const mode = GAME_MODE_BY_ID\[save\.modeId\];\s*const pool = TEAM_ENTRIES\.filter\(\(t\) => mode\.tournamentIds\.includes\(t\.tournamentId\)\);\s*const initialSwiss = generateInitialSwissState.*?setSwissMatches\(r1\);\s*\}, \[save, playerTeam, swissState\.length\]\);/s,
  `useEffect(() => {
    if (!save || !playerTeam || playoffBracket.length > 0) return;
    const mode = GAME_MODE_BY_ID[save.modeId];
    const pool = TEAM_ENTRIES.filter((t) => mode.tournamentIds.includes(t.tournamentId));
    
    const top8 = getTop8FromHiddenSimulation(playerTeam, pool, save.draftMode ?? "STRICT");
    const bracket = generateDoubleEliminationBracket(top8);
    setPlayoffBracket(bracket);
  }, [save, playerTeam, playoffBracket.length]);`
);

// 4. Dependencies
matchContent = matchContent.replace(
  /const isChampion = !!\(tournamentPhase === "PLAYOFFS" && playoffBracket\[playoffBracket\.length - 1\]\?\.\[0\]\?\.winner\?\.name === playerTeam\?\.name\);.*?const isPlayerTeamA = userMatch\?\.teamA\?\.name === playerTeam\?\.name;/s,
  `const isChampion = !!(tournamentPhase === "PLAYOFFS" && playoffBracket[5]?.[0]?.winner?.name === playerTeam?.name);

  const userMatch = tournamentPhase === "PLAYOFFS" 
    ? playoffBracket[currentRoundIdx]?.find(m => m.teamA?.name === playerTeam?.name || m.teamB?.name === playerTeam?.name)
    : undefined;
    
  const flatFuture = playoffBracket.slice(currentRoundIdx).flat();
  const isEliminated = tournamentPhase === "PLAYOFFS" && !isChampion && !flatFuture.some(m => m.teamA?.name === playerTeam?.name || m.teamB?.name === playerTeam?.name);

  const opponentTeam = userMatch?.teamA?.name === playerTeam?.name ? userMatch?.teamB : userMatch?.teamA;
  const isPlayerTeamA = userMatch?.teamA?.name === playerTeam?.name;

  // Auto-forward stages if user is waiting
  useEffect(() => {
    if (tournamentPhase === "PLAYOFFS" && !userMatch && !isEliminated && !isChampion && currentRoundIdx < playoffBracket.length) {
      const nextBracket = simulateBracketStage(playoffBracket, currentRoundIdx, save?.draftMode ?? "STRICT");
      setPlayoffBracket(nextBracket);
      setCurrentRoundIdx(r => r + 1);
    }
  }, [tournamentPhase, userMatch, isEliminated, isChampion, currentRoundIdx, playoffBracket, save]);`
);

// 5. handleNextGame
matchContent = matchContent.replace(
  /const handleNextGame = \(\) => \{.*?resultSoundKeyRef\.current = null;\s*\};/s,
  `const handleNextGame = () => {
    if (!currentMatchResult || !userMatch) return;

    setMatchState("ADVANCING");

    userMatch.result = currentMatchResult;
    userMatch.winner = currentMatchResult.winner === "A" ? userMatch.teamA : userMatch.teamB;

    if (save && currentMatchResult) {
      const ratings = { ...(save.teamProgression?.mapRatings || {}) };
      if (userMatch.winner?.name === playerTeam.name) {
        ratings[currentMatchResult.mapName] = (ratings[currentMatchResult.mapName] || 0) + 0.5;
      } else {
        ratings[currentMatchResult.mapName] = (ratings[currentMatchResult.mapName] || 0) - 0.2;
      }
      useDynasty.getState().updateProgression(save.id, ratings);
    }

    const nextBracket = simulateBracketStage(playoffBracket, currentRoundIdx, save?.draftMode ?? "STRICT");
    setPlayoffBracket(nextBracket);

    if (currentRoundIdx + 1 < nextBracket.length) {
      setCurrentRoundIdx(currentRoundIdx + 1);
      setMapPool(getRandomMapPool(7));
      setMatchState("VETO");
    } else {
      if (userMatch.winner?.name === playerTeam.name) {
        recordWin(save.id);
        addTrophy(save.id, "Tournament Champion");
      }
    }

    setCurrentMatchResult(null);
    setRewards(null);
    setDisplayedRoundCount(0);
    lastEventCountRef.current = 0;
    rewardKeyRef.current = null;
    resultSoundKeyRef.current = null;
  };`
);

// 6. PreTournamentScreen render
matchContent = matchContent.replace(
  /if \(matchState === "PRE_TOURNAMENT"\) \{.*?onStartTournament=\{handlePlayMatch\}.*?\/>\s*\);\s*\}/s,
  `if (matchState === "PRE_TOURNAMENT" && tournamentPhase === "PRE_TOURNAMENT") {
    return (
      <PreTournamentScreen 
        userTeam={playerTeam} 
        playoffBracket={playoffBracket}
        onStartTournament={() => {
           playSfx("click");
           setTournamentPhase("PLAYOFFS");
           setMapPool(getRandomMapPool(7));
           setMatchState("VETO");
        }} 
      />
    );
  }`
);

// 7. ELIMINATED Render
matchContent = matchContent.replace(
  /if \(matchState === "ELIMINATED"\) \{.*?\}\s*const totalWins =.*?<BracketSimulation\s*bracket=\{finalBracket\}\s*playerTeam=\{playerTeam\}\s*eliminatedRoundIdx=\{.*?\}\s*\/>.*?<\/div>\s*\);\s*\}/s,
  `if (isEliminated || matchState === "ELIMINATED") {
    let finalBracket = [...playoffBracket];
    for (let r = currentRoundIdx; r < finalBracket.length; r++) {
       finalBracket = simulateBracketStage(finalBracket, r, save?.draftMode ?? "STRICT");
    }

    const placement = ROUND_LABEL(currentRoundIdx, finalBracket).toUpperCase();

    return (
      <div className="mx-auto max-w-[1800px] px-4 py-16 sm:px-6 text-center flex flex-col items-center">
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
              <span className="text-slate-300">XP +{rewards.xpChange}</span>
            </div>
          </div>
        )}

        <div className="w-full overflow-hidden mt-8 mb-8 border border-border/40 clip-corner bg-surface/50 backdrop-blur">
           <PlayoffBracket bracket={finalBracket} />
        </div>

        <button
          onClick={handleLoss}
          className="clip-corner mt-4 inline-block border border-border bg-surface px-8 py-4 font-display text-xl tracking-widest transition hover:border-primary cursor-pointer"
        >
          {t("newDraft")}
        </button>
      </div>
    );
  }`
);

// 8. Early return loading fixes
matchContent = matchContent.replace(
  /if \(!save \|\| !playerTeam \|\| swissState\.length === 0\) \{/g,
  `if (!save || !playerTeam || playoffBracket.length === 0) {`
);

matchContent = matchContent.replace(
  /\{tournamentPhase === "SWISS" \? `SWISS ROUND \$\{currentRoundIdx \+ 1\}` : ROUND_LABEL\(currentRoundIdx \+ 1, playoffBracket\.length\)\}/g,
  `{ROUND_LABEL(currentRoundIdx, playoffBracket)}`
);

// Save Match.tsx
fs.writeFileSync(matchTsxPath, matchContent);
console.log("Successfully refactored match.tsx");

// PreTournamentScreen.tsx Refactor
const preTsxPath = path.resolve('src/components/match/PreTournamentScreen.tsx');
let preContent = fs.readFileSync(preTsxPath, 'utf8');

preContent = preContent.replace(/import type \{ SwissTeamState, BracketMatch \} from "@\/lib\/engine\/bracket";/, `import type { BracketMatch } from "@/lib/engine/bracket";\nimport { PlayoffBracket } from "@/components/match/PlayoffBracket";`);

preContent = preContent.replace(/export function PreTournamentScreen.*?\} \{/s, `export function PreTournamentScreen({ userTeam, playoffBracket, onStartTournament }: { userTeam: any; playoffBracket: BracketMatch[][]; onStartTournament: () => void }) {`);

// Remove swiss standings and infographic, replace with Bracket Preview
preContent = preContent.replace(
  /<div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-5">.*?<\/div>\s*<\/div>/s,
  `<div className="lg:col-span-12 flex flex-col gap-5">
           {/* Pick'Ems */}
           <div className="clip-corner border border-border bg-surface/50 backdrop-blur flex flex-col w-full">
             <div className="p-3 border-b border-border/30 flex justify-between items-center bg-black/40">
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Target className="w-3 h-3" /> Round 1 Pick'Ems
                </div>
                <button 
                  onClick={handleAutoPick} 
                  className="text-[9px] font-black tracking-widest uppercase border border-primary/30 text-primary px-3 py-1 hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  Auto Pick
                </button>
             </div>
             <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-black/20">
                {playoffBracket[0]?.map(m => (
                  <MatchRow key={m.id} m={m} picked={userPicks[m.id]} onPick={handlePick} />
                ))}
             </div>
           </div>

           {/* Bracket Progression Preview */}
           <div className="flex-1 clip-corner border border-border bg-surface/50 backdrop-blur flex flex-col min-h-[400px]">
             <div className="p-3 border-b border-border/30 flex justify-between items-center bg-black/40">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  DOUBLE ELIMINATION STANDINGS 🌐
                </div>
             </div>
             <div className="flex-1 relative bg-black/20 overflow-hidden">
                <PlayoffBracket bracket={playoffBracket} />
             </div>
           </div>
        </div>`
);

preContent = preContent.replace(/const handleAutoPick.*?setUserPicks\(picks\);\s*\}, \[firstRoundMatches\]\);/s, `const handleAutoPick = useCallback(() => {
    const picks: Record<string, string> = {};
    for (const m of playoffBracket[0] || []) {
      if (m.teamA && m.teamB) {
        picks[m.id] = Math.random() > 0.5 ? m.teamA.name : m.teamB.name;
      }
    }
    setUserPicks(picks);
  }, [playoffBracket]);`);

fs.writeFileSync(preTsxPath, preContent);
console.log("Successfully refactored PreTournamentScreen.tsx");

// PlayoffBracket.tsx Refactor for Double Elimination
const playoffTsxPath = path.resolve('src/components/match/PlayoffBracket.tsx');
let playoffContent = fs.readFileSync(playoffTsxPath, 'utf8');

// The new layout needs to be precise. 
// QF1..4 -> SF1..2 -> UB-F -> GF
// LB-R1..2 -> LB-R2..2 -> LB-R3 -> LB-F -> GF
const newPlayoffBracketCode = `import React, { useMemo } from "react";
import { motion } from "framer-motion";
import type { BracketMatch } from "@/lib/engine/bracket";
import { Star } from "lucide-react";

interface PlayoffBracketProps {
  bracket: BracketMatch[][];
}

const MatchNode = React.memo(({ match, x, y }: { match: BracketMatch, x: number, y: number }) => {
  const teamA = match.teamA;
  const teamB = match.teamB;
  const winnerA = match.winner?.name === teamA?.name;
  const winnerB = match.winner?.name === teamB?.name;
  const hasWinner = !!match.winner;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute flex flex-col bg-[#0F1115]/90 rounded-[8px] p-2 gap-1 shadow-lg border border-[#1A1D24] hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all z-10"
      style={{ left: x, top: y, width: 170, height: 72 }}
    >
      <TeamRow team={teamA} isWinner={winnerA} isLoser={hasWinner && !winnerA} />
      <TeamRow team={teamB} isWinner={winnerB} isLoser={hasWinner && !winnerB} />
    </motion.div>
  );
});

const TeamRow = ({ team, isWinner, isLoser }: { team: any, isWinner: boolean, isLoser: boolean }) => {
  return (
    <div className={\`flex items-center gap-2 px-1.5 py-1 rounded transition-all duration-300 \${isWinner ? 'bg-white/5' : ''} \${isLoser ? 'opacity-50' : 'opacity-100'}\`}>
      <div 
        className="team-logo-slot w-5 h-5 shrink-0 flex items-center justify-center bg-transparent border border-dashed border-[#2A2F3A] rounded overflow-hidden" 
        data-team={team?.name?.toLowerCase().replace(/\\s+/g, '-')}
      >
      </div>
      <div className={\`flex-1 text-[12px] font-medium truncate \${!team ? 'text-muted-foreground' : 'text-white'}\`}>
        {team ? team.name : "TBD"}
      </div>
      {isWinner && <Star className="w-3.5 h-3.5 text-white shrink-0 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" />}
    </div>
  );
};

export function PlayoffBracket({ bracket }: PlayoffBracketProps) {
  const allMatches = useMemo(() => bracket.flat(), [bracket]);
  const getMatch = (id: string) => allMatches.find(m => m.id === id);

  // Upper Bracket
  const ubQf1 = getMatch("ub-qf-1");
  const ubQf2 = getMatch("ub-qf-2");
  const ubQf3 = getMatch("ub-qf-3");
  const ubQf4 = getMatch("ub-qf-4");
  const ubSf1 = getMatch("ub-sf-1");
  const ubSf2 = getMatch("ub-sf-2");
  const ubF = getMatch("ub-f");

  // Lower Bracket
  const lbR1_1 = getMatch("lb-r1-1");
  const lbR1_2 = getMatch("lb-r1-2");
  const lbR2_1 = getMatch("lb-r2-1");
  const lbR2_2 = getMatch("lb-r2-2");
  const lbR3 = getMatch("lb-r3");
  const lbF = getMatch("lb-f");

  // Grand Final
  const gf = getMatch("gf");

  const pathActive = (fromMatch: BracketMatch | undefined, toMatch: BracketMatch | undefined) => {
    if (!fromMatch || !toMatch) return false;
    return !!fromMatch.winner && (toMatch.teamA?.name === fromMatch.winner.name || toMatch.teamB?.name === fromMatch.winner.name);
  };

  const activeClass = "stroke-white stroke-[2px] drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]";
  const inactiveClass = "stroke-[#2A2F3A] stroke-[1.5px]";

  return (
    <div className="w-full h-full flex items-center justify-center overflow-x-auto p-8 custom-scrollbar relative bg-[#0B0D12]">
      {/* BACKGROUND IMAGE */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.08]"
        style={{ backgroundImage: 'url("/bracket/bracket-champs.png")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      ></div>

      <div className="relative z-10" style={{ width: 1200, height: 600 }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none fill-none" style={{ zIndex: 0 }}>
          {/* UPPER BRACKET CONNECTIONS */}
          <path d="M 170 40 L 190 40 L 190 85 L 210 85" className={\`transition-all duration-500 \${pathActive(ubQf1, ubSf1) ? activeClass : inactiveClass}\`} />
          <path d="M 170 130 L 190 130 L 190 85 L 210 85" className={\`transition-all duration-500 \${pathActive(ubQf2, ubSf1) ? activeClass : inactiveClass}\`} />
          <path d="M 170 220 L 190 220 L 190 265 L 210 265" className={\`transition-all duration-500 \${pathActive(ubQf3, ubSf2) ? activeClass : inactiveClass}\`} />
          <path d="M 170 310 L 190 310 L 190 265 L 210 265" className={\`transition-all duration-500 \${pathActive(ubQf4, ubSf2) ? activeClass : inactiveClass}\`} />
          <path d="M 380 85 L 400 85 L 400 175 L 420 175" className={\`transition-all duration-500 \${pathActive(ubSf1, ubF) ? activeClass : inactiveClass}\`} />
          <path d="M 380 265 L 400 265 L 400 175 L 420 175" className={\`transition-all duration-500 \${pathActive(ubSf2, ubF) ? activeClass : inactiveClass}\`} />
          <path d="M 590 175 L 640 175 L 640 265 L 940 265" className={\`transition-all duration-500 \${pathActive(ubF, gf) ? activeClass : inactiveClass}\`} />

          {/* LOWER BRACKET CONNECTIONS */}
          <path d="M 380 400 L 400 400 L 400 400 L 420 400" className={\`transition-all duration-500 \${pathActive(lbR1_1, lbR2_1) ? activeClass : inactiveClass}\`} />
          <path d="M 380 490 L 400 490 L 400 490 L 420 490" className={\`transition-all duration-500 \${pathActive(lbR1_2, lbR2_2) ? activeClass : inactiveClass}\`} />
          
          <path d="M 590 400 L 610 400 L 610 445 L 630 445" className={\`transition-all duration-500 \${pathActive(lbR2_1, lbR3) ? activeClass : inactiveClass}\`} />
          <path d="M 590 490 L 610 490 L 610 445 L 630 445" className={\`transition-all duration-500 \${pathActive(lbR2_2, lbR3) ? activeClass : inactiveClass}\`} />

          <path d="M 800 445 L 820 445 L 820 355 L 840 355" className={\`transition-all duration-500 \${pathActive(lbR3, lbF) ? activeClass : inactiveClass}\`} />
          <path d="M 1010 355 L 1030 355 L 1030 265 L 1050 265" className={\`transition-all duration-500 \${pathActive(lbF, gf) ? activeClass : inactiveClass}\`} />
        </svg>

        {/* --- UPPER BRACKET --- */}
        {/* QF */}
        {ubQf1 && <MatchNode match={ubQf1} x={0} y={4} />}
        {ubQf2 && <MatchNode match={ubQf2} x={0} y={94} />}
        {ubQf3 && <MatchNode match={ubQf3} x={0} y={184} />}
        {ubQf4 && <MatchNode match={ubQf4} x={0} y={274} />}
        
        {/* SF */}
        {ubSf1 && <MatchNode match={ubSf1} x={210} y={49} />}
        {ubSf2 && <MatchNode match={ubSf2} x={210} y={229} />}

        {/* UB Final */}
        {ubF && <MatchNode match={ubF} x={420} y={139} />}

        {/* --- LOWER BRACKET --- */}
        {/* LB R1 */}
        {lbR1_1 && <MatchNode match={lbR1_1} x={210} y={364} />}
        {lbR1_2 && <MatchNode match={lbR1_2} x={210} y={454} />}
        
        {/* LB R2 */}
        {lbR2_1 && <MatchNode match={lbR2_1} x={420} y={364} />}
        {lbR2_2 && <MatchNode match={lbR2_2} x={420} y={454} />}
        
        {/* LB R3 */}
        {lbR3 && <MatchNode match={lbR3} x={630} y={409} />}

        {/* LB Final */}
        {lbF && <MatchNode match={lbF} x={840} y={319} />}

        {/* --- GRAND FINAL --- */}
        {gf && <MatchNode match={gf} x={1050} y={229} />}
        <div className="absolute font-bold text-[#A0A7B8] text-[10px] tracking-[0.2em] uppercase" style={{ left: 1050, top: 205 }}>Grand Final</div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(playoffTsxPath, newPlayoffBracketCode);
console.log("Successfully refactored PlayoffBracket.tsx");
