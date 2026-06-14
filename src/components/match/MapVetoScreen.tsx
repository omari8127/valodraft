import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import { getFlagUrl } from "@/lib/utils";
import { ORG_BY_ID } from "@/data/regions";
import type { MatchTeam } from "@/lib/engine/match/MatchEngine";
import type { GameMap } from "@/data/maps";

interface Props {
  teamA: MatchTeam;
  teamB: MatchTeam;
  teamA_OVR: number;
  teamB_OVR: number;
  mapPool: GameMap[];
  isBO5: boolean;
  userTeamName: string;
  onVetoComplete: (vetoMaps: GameMap[]) => void;
}



// ── Map Card (Grid Style) ──
const MapCard = React.memo(({
  map, status, actionType, onAction, disabled, isUserTurn,
}: {
  map: GameMap; status: "AVAILABLE" | "BANNED" | "PICKED" | "DECIDER";
  actionType?: "BAN" | "PICK"; onAction: (id: string) => void;
  disabled: boolean; isUserTurn: boolean;
}) => {
  const clickable = status === "AVAILABLE" && !disabled;

  let borderStyle = "border-transparent";
  let opacity = "opacity-100";

  if (status === "BANNED") {
    opacity = "opacity-30 grayscale";
    borderStyle = "border-red-900/30";
  } else if (status === "PICKED") {
    borderStyle = "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
  } else if (status === "DECIDER") {
    borderStyle = "border-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.3)]";
  } else if (clickable && actionType === "BAN") {
    borderStyle = "border-transparent hover:border-red-500";
  } else if (clickable && actionType === "PICK") {
    borderStyle = "border-transparent hover:border-green-500";
  }

  return (
    <button
      onClick={() => clickable && onAction(map.id)}
      disabled={!clickable}
      className={`relative w-full aspect-[16/9] rounded-[4px] border border-solid overflow-hidden transition-all duration-200 select-none bg-[#0a0c10] group
        ${borderStyle} ${opacity} ${clickable ? "cursor-pointer" : "cursor-default"}
      `}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${map.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

      <div className="absolute inset-0 flex flex-col justify-end p-3">
        <span className="font-display text-xl text-white font-black uppercase tracking-widest drop-shadow-md text-left leading-none">
          {map.name}
        </span>
      </div>

      {status === "PICKED" && (
        <div className="absolute top-2 right-2 bg-green-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-sm tracking-widest uppercase">
          PICKED
        </div>
      )}
      {status === "DECIDER" && (
        <div className="absolute top-2 right-2 bg-[#ffd700] text-black text-[9px] font-black px-1.5 py-0.5 rounded-sm tracking-widest uppercase">
          DECIDER
        </div>
      )}
      {status === "BANNED" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-red-500 text-5xl font-black drop-shadow-lg">✕</span>
        </div>
      )}

      {clickable && actionType && (
        <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity
          ${actionType === "BAN" ? "bg-red-900/60" : "bg-green-900/60"}`}>
          <span className={`font-black font-display text-2xl tracking-widest uppercase
            ${actionType === "BAN" ? "text-red-400" : "text-green-400"}`}>
            {actionType}
          </span>
        </div>
      )}
    </button>
  );
});

const getIglPlayer = (players: any[]) => {
  if (!players || players.length === 0) return null;
  const maxIgl = Math.max(...players.map(x => x.iglRating || 0));
  return [...players]
    .filter(x => (x.iglRating || 0) === maxIgl)
    .sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name))[0];
};

// ── Roster Player Row ──
const PlayerRow = ({ player, isIgl }: { player: any; isIgl?: boolean }) => {
  const nat = (player.nationality || "").toLowerCase();
  const flagUrl = getFlagUrl(nat);
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-white/[0.02] transition-colors rounded">
      <div className="w-10 h-10 rounded-full bg-[#1e222b] border border-[#2a2f3a] overflow-hidden shrink-0 flex items-center justify-center">
        <img
          src={player.image || "/jugadores/nopic.png"}
          alt={player.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = "/jugadores/nopic.png"; }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          {nat && <img src={flagUrl} className="w-3.5 h-2.5 rounded-sm object-cover" alt="flag" />}
          <span className="font-bold text-[13px] text-white truncate leading-none">{player.name}</span>
        </div>
        <div className="text-[10px] text-[#A0A7B8] uppercase tracking-widest font-medium">
          {isIgl ? `IGL • ${player.primaryRole}` : player.primaryRole}
        </div>
      </div>
      <div className="font-display text-xl text-white shrink-0">{player.rating}</div>
    </div>
  );
};

export function MapVetoScreen({ teamA, teamB, teamA_OVR, teamB_OVR, mapPool, isBO5, userTeamName, onVetoComplete }: Props) {
  const [bannedMapIds, setBannedMapIds] = useState<string[]>([]);
  const [pickedMapIds, setPickedMapIds] = useState<string[]>([]);
  const [deciderMapId, setDeciderMapId] = useState<string | null>(null);
  const [readyToStart, setReadyToStart] = useState(false);
  const [finalMaps, setFinalMaps] = useState<GameMap[]>([]);

  const teamAFirst = teamA_OVR >= teamB_OVR;
  const firstTeam = teamAFirst ? teamA.name : teamB.name;
  const secondTeam = teamAFirst ? teamB.name : teamA.name;

  const sequence = useMemo(() => isBO5
    ? [
        { action: "BAN" as const, teamId: firstTeam },
        { action: "BAN" as const, teamId: secondTeam },
        { action: "PICK" as const, teamId: firstTeam },
        { action: "PICK" as const, teamId: secondTeam },
        { action: "PICK" as const, teamId: firstTeam },
        { action: "PICK" as const, teamId: secondTeam },
      ]
    : [
        { action: "BAN" as const, teamId: firstTeam },
        { action: "BAN" as const, teamId: secondTeam },
        { action: "PICK" as const, teamId: firstTeam },
        { action: "PICK" as const, teamId: secondTeam },
        { action: "BAN" as const, teamId: firstTeam },
        { action: "BAN" as const, teamId: secondTeam },
      ],
    [isBO5, firstTeam, secondTeam]);

  const currentStepIndex = bannedMapIds.length + pickedMapIds.length;
  const currentStep = sequence[currentStepIndex];
  const isUserTurn = currentStep?.teamId === userTeamName;

  // ── Map Scores (seeded deterministic, guaranteed 1 good + 2 balanced + rest bad) ──
  // MUST be declared before AI useEffect that depends on it.
  const mapScores = useMemo(() => {
    const seedString = `${teamA.name}-${teamA_OVR}-${teamB.name}-${teamB_OVR}`;
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = Math.imul(31, hash) + seedString.charCodeAt(i) | 0;
    }
    let seed = hash;
    const rng = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // Rank maps by initial random value to determine their tier
    const ranked = mapPool.map(m => ({ map: m, r: rng() })).sort((a, b) => b.r - a.r);

    // Assign tier-based scores: 1 good, 2 balanced, rest bad
    return ranked.map((item, rank) => {
      let score: number;
      if (rank === 0) {
        // 1 guaranteed good pick: +1.0 to +2.0
        score = 1.0 + rng() * 1.0;
      } else if (rank <= 2) {
        // 2 balanced: -0.3 to +0.3
        score = -0.3 + rng() * 0.6;
      } else {
        // Rest are bad/veto: -1.0 to -2.0
        score = -1.0 - rng() * 1.0;
      }
      return { map: item.map, score: +score.toFixed(1) };
    }).sort((a, b) => b.score - a.score);
  }, [mapPool, teamA.name, teamA_OVR, teamB.name, teamB_OVR]);

  // ── Handle Action (MUST be declared before AI useEffect) ──
  const handleAction = useCallback((mapId: string) => {
    if (!currentStep) return;
    if (currentStep.action === "BAN") {
      setBannedMapIds(prev => [...prev, mapId]);
    } else {
      setPickedMapIds(prev => [...prev, mapId]);
    }
  }, [currentStep]);

  // ── AI Logic (runs AFTER mapScores and handleAction are declared) ──
  useEffect(() => {
    if (!currentStep) return;
    if (currentStep.teamId === userTeamName) return;

    const timer = setTimeout(() => {
      const available = mapPool.filter(m => !bannedMapIds.includes(m.id) && !pickedMapIds.includes(m.id));
      if (available.length === 0) return;

      const isTeamA = currentStep.teamId === teamA.name;
      const scored = available.map(m => {
        const uiScore = mapScores.find(ms => ms.map.id === m.id)?.score || 0;
        // TeamA uses positive scores (their good maps), teamB uses inverted scores
        return { m, s: isTeamA ? uiScore : -uiScore };
      });
      let chosen: GameMap;
      if (currentStep.action === "BAN") {
        // Ban the worst map for this team (lowest score = opponent's best)
        chosen = scored.sort((a, b) => a.s - b.s)[0].m;
      } else {
        // Pick the best map for this team (highest score)
        chosen = scored.sort((a, b) => b.s - a.s)[0].m;
      }
      handleAction(chosen.id);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentStep, mapPool, bannedMapIds, pickedMapIds, userTeamName, mapScores, teamA.name, handleAction]);

  // ── Resolve Decider (runs when sequence is complete) ──
  useEffect(() => {
    if (!currentStep && !deciderMapId) {
      const leftover = mapPool.find(m => !bannedMapIds.includes(m.id) && !pickedMapIds.includes(m.id));
      if (leftover) {
        setDeciderMapId(leftover.id);
        const maps = pickedMapIds.map(id => mapPool.find(m => m.id === id)!).concat(leftover);
        setFinalMaps(maps);
        setReadyToStart(true);
      }
    }
  }, [currentStep, deciderMapId, mapPool, bannedMapIds, pickedMapIds]);

  // ── Derived analysis values ──
  const goodPicks = mapScores.filter(m => m.score >= 1.0);
  const balanced = mapScores.filter(m => m.score >= -0.4 && m.score < 1.0);
  const vetoUrgent = mapScores.filter(m => m.score < -0.4);

  const userTeam = teamA.name === userTeamName ? teamA : teamB;

  return (
    <div className="min-h-screen bg-[#07090c] p-6 lg:p-8 flex items-center justify-center font-sans overflow-y-auto">
      <div className="w-full max-w-[1400px] flex flex-col gap-6 mx-auto">
        
        {/* TOP ROW */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT: MAPS */}
          <div className="flex-1 bg-[#0F1115] border border-[#1e222b] rounded-[10px] p-6 lg:p-8 flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <span className="text-2xl lg:text-3xl font-display font-black text-white uppercase truncate max-w-[200px] sm:max-w-none">{teamA.name}</span>
                <span className="bg-[#1e222b] text-[#A0A7B8] px-2 py-0.5 rounded text-xs font-black">OVR {teamA_OVR}</span>
              </div>
              <span className="text-[#A0A7B8] font-black text-sm uppercase tracking-widest">VS</span>
              <div className="flex items-center gap-4">
                <span className="bg-[#1e222b] text-[#A0A7B8] px-2 py-0.5 rounded text-xs font-black">OVR {teamB_OVR}</span>
                <span className="text-2xl lg:text-3xl font-display font-black text-[#A0A7B8] uppercase truncate max-w-[200px] sm:max-w-none">{teamB.name}</span>
              </div>
            </div>

            {/* Turn Indicator */}
            <div className="flex justify-center mb-8 h-10">
              <AnimatePresence mode="wait">
                {!readyToStart ? (
                  <motion.div
                    key={`step-${currentStepIndex}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`px-8 py-2.5 rounded-full border text-[11px] font-black tracking-widest uppercase flex items-center gap-3
                      ${isUserTurn 
                        ? "bg-red-500/10 border-red-500/30 text-red-500" 
                        : "bg-[#1e222b]/50 border-[#1e222b] text-[#A0A7B8]"}`}
                  >
                    {isUserTurn ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        YOUR TURN TO {currentStep?.action}
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-[#A0A7B8] animate-pulse" />
                        {currentStep?.teamId} IS {currentStep?.action === "BAN" ? "BANNING" : "PICKING"}...
                      </>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="px-6 py-2.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-500 text-[11px] font-black tracking-widest uppercase flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      VETO COMPLETE
                    </div>
                    <button
                      onClick={() => onVetoComplete(finalMaps)}
                      className="bg-white text-black hover:bg-gray-200 px-8 py-2.5 rounded-full text-[11px] font-black tracking-widest uppercase flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" /> START SIMULATION
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Maps Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:gap-4 flex-1 items-start">
              {mapPool.map(map => {
                let status: "AVAILABLE" | "BANNED" | "PICKED" | "DECIDER" = "AVAILABLE";
                if (bannedMapIds.includes(map.id)) status = "BANNED";
                else if (pickedMapIds.includes(map.id)) status = "PICKED";
                else if (deciderMapId === map.id) status = "DECIDER";

                return (
                  <MapCard
                    key={map.id}
                    map={map}
                    status={status}
                    actionType={currentStep?.action}
                    onAction={handleAction}
                    disabled={readyToStart || !isUserTurn || !currentStep}
                    isUserTurn={isUserTurn && !readyToStart}
                  />
                );
              })}
            </div>
          </div>

          {/* RIGHT: ANALYSIS */}
          <div className="w-full lg:w-[380px] bg-[#0F1115] border border-[#1e222b] rounded-[10px] p-4 lg:p-5 shrink-0 flex flex-col gap-3 max-h-[600px] overflow-hidden">
            
            <div>
              <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1.5">ANÁLISIS PREVIO</div>
              <div className="text-[9px] font-bold text-[#A0A7B8] uppercase tracking-widest mb-1">
                VENTAJA POR MAPA ({teamA.name} ←→ {teamB.name})
              </div>
            </div>

            {/* Good Picks */}
            {goodPicks.length > 0 && (
              <div className="flex flex-col gap-1">
                <div className="text-[8px] font-black text-green-500 uppercase tracking-widest mb-0.5">BUEN PICK (+1.0 TO +2.0)</div>
                {goodPicks.map(({ map, score }) => (
                  <div key={map.id} className="flex justify-between items-center border border-green-500/30 bg-green-500/10 px-2 py-1 rounded-[4px]">
                    <span className="text-[11px] font-bold text-white">{map.name}</span>
                    <span className="text-[11px] font-bold text-green-400">{score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Balanced */}
            {balanced.length > 0 && (
              <div className="flex flex-col gap-1">
                <div className="text-[8px] font-black text-[#A0A7B8] uppercase tracking-widest mb-0.5">EQUILIBRADO (-0.4 TO +0.4)</div>
                {balanced.map(({ map, score }) => (
                  <div key={map.id} className="flex justify-between items-center border border-[#1e222b] bg-[#111318] px-2 py-1 rounded-[4px]">
                    <span className="text-[11px] font-bold text-white">{map.name}</span>
                    <span className="text-[11px] font-bold text-[#A0A7B8]">{score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Veto Urgent */}
            {vetoUrgent.length > 0 && (
              <div className="flex flex-col gap-1">
                <div className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-0.5">VETO URGENTE (-1.0 TO -2.0)</div>
                {vetoUrgent.map(({ map, score }) => (
                  <div key={map.id} className="flex justify-between items-center border border-red-500/20 bg-red-500/5 px-2 py-1 rounded-[4px]">
                    <span className="text-[11px] font-bold text-white">{map.name}</span>
                    <span className="text-[11px] font-bold text-red-400">{score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Form & Composition */}
            <div className="flex flex-col gap-3 mt-1 pt-3 border-t border-[#1e222b]">
              <div>
                <div className="text-[9px] font-black text-[#A0A7B8] uppercase tracking-widest mb-1.5">FORMA DE TUS JUGADORES</div>
                <div className="flex flex-col gap-1">
                  {userTeam.players.map(p => {
                    const form = (p as any).form ?? 0;
                    const formLabel = form > 0 ? `buena (+${form}%)` : form < 0 ? `mala (${form}%)` : "estable (0%)";
                    const formColor = form > 0 ? "text-green-400" : form < 0 ? "text-red-400" : "text-[#A0A7B8]";
                    const nat = (p.nationality || "").toLowerCase();
                    const flagUrl = getFlagUrl(nat);
                    return (
                      <div key={p.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {nat && <img src={flagUrl} className="w-3.5 h-2.5 rounded-[2px] object-cover" alt="flag" />}
                          <span className="text-[11px] font-bold text-white leading-none">{p.name}</span>
                        </div>
                        <span className={`text-[10px] font-bold ${formColor} leading-none`}>{formLabel}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-[9px] font-black text-[#A0A7B8] uppercase tracking-widest mb-1.5">
                  TU COMPOSICIÓN (+{teamA_OVR - 75 > 0 ? (teamA_OVR - 75).toFixed(1) : "0"})
                </div>
                <div className="flex flex-col gap-1">
                  {[
                    { label: "OVR del equipo", value: `+${((teamA_OVR - 80) * 0.5 + 2.5).toFixed(1)}`, color: "text-green-400" },
                    { label: "Ventaja de semilla", value: teamA_OVR >= teamB_OVR ? "+1.0" : "-1.0", color: teamA_OVR >= teamB_OVR ? "text-green-400" : "text-red-400" },
                    { label: "Balance de roles", value: "+0.5", color: "text-white" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-[11px] text-[#A0A7B8] font-medium leading-none">{item.label}</span>
                      <span className={`text-[10px] font-bold ${item.color} leading-none`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: ROSTERS */}
        <div className="bg-[#0F1115] border border-[#1e222b] rounded-[10px] p-6 lg:p-8">
          <div className="text-[11px] font-black text-white uppercase tracking-widest mb-6">ALINEACIONES Y RASGOS</div>
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#1e222b]">
            {/* Team A */}
            <div className="flex-1 md:pr-8 flex flex-col gap-3 pt-6 md:pt-0">
              <div className="flex justify-between items-center mb-2 px-2">
                <div className="flex items-center gap-2">
                  {teamA.orgId && ORG_BY_ID[teamA.orgId]?.region === "EMEA" ? (
                    <img src="https://flagcdn.com/w20/eu.png" className="w-4 h-3 rounded-sm object-cover" alt="EU" />
                  ) : (
                    <div className="w-4 h-3 bg-red-500 rounded-sm" />
                  )}
                  <span className="font-display font-black text-sm uppercase text-white tracking-widest">{teamA.name}</span>
                </div>
                <div className="text-[9px] font-bold text-[#A0A7B8] uppercase tracking-widest">
                  IGL {getIglPlayer(teamA.players)?.name} · EQUILIBRADO
                </div>
              </div>
              <div className="flex flex-col">
                {teamA.players.map(p => {
                  const isIgl = p.id === getIglPlayer(teamA.players)?.id;
                  return <PlayerRow key={p.id} player={p} isIgl={isIgl} />;
                })}
              </div>
            </div>

            {/* Team B */}
            <div className="flex-1 md:pl-8 flex flex-col gap-3 pt-6 md:pt-0">
              <div className="flex justify-between items-center mb-2 px-2">
                <div className="flex items-center gap-2">
                  {teamB.orgId && ORG_BY_ID[teamB.orgId]?.region === "EMEA" ? (
                    <img src="https://flagcdn.com/w20/eu.png" className="w-4 h-3 rounded-sm object-cover" alt="EU" />
                  ) : (
                    <div className="w-4 h-3 bg-green-500 rounded-sm" />
                  )}
                  <span className="font-display font-black text-sm uppercase text-white tracking-widest">{teamB.name}</span>
                </div>
                <div className="text-[9px] font-bold text-[#A0A7B8] uppercase tracking-widest">
                  IGL {getIglPlayer(teamB.players)?.name} · EQUILIBRADO
                </div>
              </div>
              <div className="flex flex-col">
                {teamB.players.map(p => {
                  const isIgl = p.id === getIglPlayer(teamB.players)?.id;
                  return <PlayerRow key={p.id} player={p} isIgl={isIgl} />;
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
