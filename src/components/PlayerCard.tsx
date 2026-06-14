import React from "react";
import { motion } from "framer-motion";
import type { CoachEntry, PlayerEntry, SlotRole } from "@/types/game";
import { rarityFor, RARITY_META } from "@/lib/engine/rarity";
import { ORG_BY_ID } from "@/data/regions";
import { TOURNAMENT_BY_ID } from "@/data/tournaments";
import { TEAM_ENTRY_BY_ID } from "@/data/generate";

interface Props {
  entity: PlayerEntry | CoachEntry;
  isCoach?: boolean;
  onClick?: (entity: PlayerEntry | CoachEntry) => void;
  compact?: boolean;
  /** Ultra-compact mode for showing all 6 team members at once */
  mini?: boolean;
  /** Draft mode for the premium Valorant Champions layout */
  draft?: boolean;
  onMouseEnter?: (entity: PlayerEntry | CoachEntry) => void;
  onMouseLeave?: () => void;
  isAiRec?: boolean;
  isDisabled?: boolean;
  isSelected?: boolean;
  fitLevel?: "STRONG" | "MEDIUM" | "NEUTRAL";
  fitLabel?: string;
  isIgl?: boolean;
  slotRole?: SlotRole;
}

export const PlayerCard = React.memo(function PlayerCard({
  entity,
  isCoach,
  onClick,
  compact,
  mini,
  draft,
  onMouseEnter,
  onMouseLeave,
  isAiRec,
  isDisabled,
  isSelected,
  fitLevel = "NEUTRAL",
  fitLabel,
  isIgl,
  slotRole,
}: Props) {
  const rarity = rarityFor(entity.rating);
  const meta = RARITY_META[rarity];
  const org = ORG_BY_ID[entity.orgId];
  const tournament = TOURNAMENT_BY_ID[entity.tournamentId];

  const ratingColor = "text-white";

  const checkIsIgl = () => {
    if (isCoach) return false;
    if (isIgl !== undefined) return isIgl;
    const p = entity as PlayerEntry;
    if (!p.iglRating || p.iglRating <= 0) return false;
    
    // Fallback: lookup original team
    const tour = TOURNAMENT_BY_ID[p.tournamentId];
    const year = tour?.year ?? 2025;
    const teamId = `${p.orgId}_${year}`;
    const team = TEAM_ENTRY_BY_ID[teamId];
    if (!team) return false;
    
    const maxIgl = Math.max(...team.players.map(x => x.iglRating || 0));
    if (p.iglRating === maxIgl) {
      const bestIglPlayer = team.players
        .filter(x => (x.iglRating || 0) === maxIgl)
        .sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name))[0];
      return bestIglPlayer?.id === p.id;
    }
    return false;
  };
  const resolvedIsIgl = checkIsIgl();

  const getRoleColor = () => {
    const baseBg = "bg-[#0A0E13]";
    if (isCoach) return { border: "border-gray-500/40", glow: "shadow-[0_0_8px_rgba(107,114,128,0.25)] hover:shadow-[0_0_14px_rgba(107,114,128,0.4)]", text: "text-gray-500", bg: baseBg };
    const role = slotRole || (entity as PlayerEntry).primaryRole || (entity as PlayerEntry).role;
    switch (role) {
      case "DUELIST": return { border: "border-red-500/40", glow: "shadow-[0_0_8px_rgba(239,68,68,0.25)] hover:shadow-[0_0_14px_rgba(239,68,68,0.4)]", text: "text-white", bg: baseBg };
      case "INITIATOR": return { border: "border-yellow-500/40", glow: "shadow-[0_0_8px_rgba(234,179,8,0.25)] hover:shadow-[0_0_14px_rgba(234,179,8,0.4)]", text: "text-white", bg: baseBg };
      case "CONTROLLER": return { border: "border-purple-500/40", glow: "shadow-[0_0_8px_rgba(168,85,247,0.25)] hover:shadow-[0_0_14px_rgba(168,85,247,0.4)]", text: "text-white", bg: baseBg };
      case "SENTINEL": return { border: "border-blue-500/40", glow: "shadow-[0_0_8px_rgba(59,130,246,0.25)] hover:shadow-[0_0_14px_rgba(59,130,246,0.4)]", text: "text-white", bg: baseBg };
      case "FLEX": return { border: "border-cyan-500/40", glow: "shadow-[0_0_8px_rgba(6,182,212,0.25)] hover:shadow-[0_0_14px_rgba(6,182,212,0.4)]", text: "text-white", bg: baseBg };
      default: return { border: "border-white/20", glow: "shadow-[0_0_8px_rgba(255,255,255,0.25)] hover:shadow-[0_0_14px_rgba(255,255,255,0.4)]", text: "text-white", bg: baseBg };
    }
  };
  const roleColor = getRoleColor();


  if (draft) {
    const isPlayer = !isCoach;
    const player = isPlayer ? (entity as PlayerEntry) : null;
    
    return (
      <motion.button
        type="button"
        onClick={onClick ? () => onClick(entity) : undefined}
        onMouseEnter={onMouseEnter ? () => onMouseEnter(entity) : undefined}
        onMouseLeave={onMouseLeave}
        whileHover={onClick ? { y: -4, scale: 1.03 } : {}}
        whileTap={onClick ? { scale: 0.98 } : {}}
        className={`group clip-corner relative w-full overflow-hidden ${roleColor.bg} border ${
          isSelected
            ? "border-primary shadow-[0_0_18px_var(--color-primary)]"
            : roleColor.border
        } ${onClick ? `cursor-pointer ${roleColor.glow} transition-all duration-300` : "cursor-default"} text-left player-card flex flex-col justify-between p-4`}
      >
        <div className="absolute inset-0 -translate-x-full opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
          <div className="shimmer h-full w-full opacity-20" />
        </div>
        
        <div className={`relative flex flex-col gap-3 w-full`}>
          {/* Top Row: Avatar, Name, Rating */}
          <div className="flex items-start justify-between w-full">
            <div className="flex items-center gap-3 min-w-0">
               <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 overflow-hidden relative">
                 {isCoach ? (
                   <span className="font-display text-xl text-white/40">{entity.name.substring(0,2).toUpperCase()}</span>
                 ) : (
                   <img 
                     src={player?.image || "/jugadores/nopic.png"} 
                     alt={player?.name || entity.name} 
                     className="w-full h-full object-cover" 
                     onError={(e) => { e.currentTarget.src = "/jugadores/nopic.png"; }} 
                   />
                 )}
               </div>
               <div className="flex flex-col min-w-0">
                  <div className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none ${roleColor.text}`}>
                    {isCoach ? "COACH" : resolvedIsIgl ? `IGL • ${player?.primaryRole}` : player?.primaryRole}
                  </div>
                 <div className="font-display text-2xl text-white truncate leading-none mt-1 flex items-center gap-2">
                   <span>{entity.name}</span>
                 </div>
                 {!isCoach && player?.realName && <div className="text-[9px] text-white/40 uppercase tracking-widest truncate">{player.realName}</div>}
               </div>
            </div>
            
            <div className={`font-display text-4xl leading-none ${ratingColor} shrink-0`}>
              {entity.rating}
            </div>
          </div>
          
          {/* Stats Section */}
          {player?.stats && (
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-1 w-full bg-black/20 p-2 rounded border border-white/5">
              {[
                { label: "AIM", val: player.stats.aim },
                { label: "CLUTCH", val: player.stats.clutch },
                { label: "CONS", val: player.stats.consistency },
                { 
                  label: player.primaryRole === "DUELIST" ? "ENTRY" : player.primaryRole === "SENTINEL" ? "UTIL" : "IGL", 
                  val: player.primaryRole === "DUELIST" ? (player.stats.entryImpact || 0) : player.primaryRole === "SENTINEL" ? (player.stats.utilityImpact || 0) : (player.iglRating || 0), 
                  highlight: fitLevel === "STRONG" || fitLevel === "MEDIUM" 
                },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between text-[9px] font-bold tracking-widest">
                  <span className={stat.highlight ? (fitLevel === "STRONG" ? "text-green-400" : "text-orange-400") : "text-white/50"}>{stat.label}</span>
                  <div className="flex items-center gap-1.5 flex-1 ml-2">
                    <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${stat.highlight ? (fitLevel === "STRONG" ? 'bg-green-400 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-orange-400 shadow-[0_0_5px_rgba(249,115,22,0.5)]') : 'bg-white/40'}`} style={{ width: `${stat.val}%` }} />
                    </div>
                    <span className={`w-4 text-right ${stat.highlight ? (fitLevel === "STRONG" ? 'text-green-400' : 'text-orange-400') : 'text-white/80'}`}>{stat.val}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-1 mt-1 items-center">
             <span className="clip-tag px-1.5 py-0.5 text-[9px] font-bold uppercase bg-white/5 text-white/60">{org?.shortName ?? entity.orgId}</span>
             <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 clip-tag">
               {player?.nationality && <span className="text-[10px] leading-none">{player.nationality === 'USA' ? '🇺🇸' : player.nationality === 'KOR' ? '🇰🇷' : player.nationality === 'BRA' ? '🇧🇷' : '★'}</span>}
               <span className="text-[9px] font-bold uppercase text-white/60">{entity.region}</span>
             </div>
             {fitLevel === "STRONG" && fitLabel && <span className="clip-tag px-1.5 py-0.5 text-[9px] font-bold uppercase bg-green-500/20 text-green-400">{fitLabel}</span>}
             {fitLevel === "MEDIUM" && fitLabel && <span className="clip-tag px-1.5 py-0.5 text-[9px] font-bold uppercase bg-orange-500/20 text-orange-400">{fitLabel}</span>}
             {isAiRec && <span className="clip-tag px-1.5 py-0.5 text-[9px] font-bold bg-gold text-[#0A0E13]">AI REC</span>}
             {isSelected && <span className="clip-tag px-1.5 py-0.5 text-[9px] font-bold bg-primary text-primary-foreground">SELECTED</span>}
          </div>
        </div>
      </motion.button>
    );
  }

  if (mini) {
    return (
      <motion.button
        type="button"
        onClick={onClick ? () => onClick(entity) : undefined}
        onMouseEnter={onMouseEnter ? () => onMouseEnter(entity) : undefined}
        onMouseLeave={onMouseLeave}
        whileHover={!isDisabled && onClick ? { y: -2, scale: 1.03 } : {}}
        whileTap={!isDisabled && onClick ? { scale: 0.97 } : {}}
        className={`group clip-corner relative w-full overflow-hidden bg-[#0A0E13] border ${
          isSelected
            ? "border-primary shadow-[0_0_18px_var(--color-primary)]"
            : roleColor.border
        } ${!isDisabled && onClick ? `cursor-pointer ${roleColor.glow} transition-shadow duration-300` : "cursor-default"} text-left ${
          isDisabled ? "opacity-40 grayscale is-disabled" : ""
        } player-card`}
      >
        <div className="absolute inset-0 -translate-x-full opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
          <div className="shimmer h-full w-full opacity-20" />
        </div>
        <div className="relative p-2">
          <div className="flex items-start justify-between gap-1">
            <div className="font-display text-sm leading-tight truncate text-foreground flex-1 min-w-0 flex items-center gap-1">
              <span>{entity.name}</span>
              {isAiRec && <span className="text-gold text-[10px] font-sans">★</span>}
              {isSelected && <span className="text-primary text-[10px] font-sans">●</span>}
            </div>
            <div className={`font-display text-xl leading-none shrink-0 ${ratingColor}`}>
              {entity.rating}
            </div>
          </div>
          <div className="mt-1 flex flex-wrap gap-0.5">
            <span
              className={`clip-tag px-1.5 py-px text-[8px] font-bold uppercase tracking-wide bg-background/80 ${roleColor.text} border border-white/10`}
            >
              {isCoach ? "COACH" : resolvedIsIgl ? `IGL • ${(entity as PlayerEntry).primaryRole}` : (entity as PlayerEntry).primaryRole || (entity as PlayerEntry).role}
            </span>
            <span className="rounded bg-background/60 px-1 py-px text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">
              {org?.shortName}
            </span>
          </div>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick ? () => onClick(entity) : undefined}
      onMouseEnter={onMouseEnter ? () => onMouseEnter(entity) : undefined}
      onMouseLeave={onMouseLeave}
      whileHover={!isDisabled && onClick ? { y: -4, scale: 1.03 } : {}}
      whileTap={!isDisabled && onClick ? { scale: 0.98 } : {}}
      className={`group clip-corner relative w-full overflow-hidden bg-[#0A0E13] border ${
        isSelected
          ? "border-primary shadow-[0_0_18px_var(--color-primary)]"
          : roleColor.border
      } ${!isDisabled && onClick ? `cursor-pointer ${roleColor.glow} transition-shadow duration-300` : "cursor-default"} text-left ${
        isDisabled ? "opacity-40 grayscale is-disabled" : ""
      } player-card`}
    >
      {/* shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
        <div className="shimmer h-full w-full" />
      </div>

      <div
        className={`relative flex ${compact ? "gap-2 p-3" : "gap-2 p-3 sm:gap-3 sm:p-4"} items-start`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <div
              className={`font-display ${compact ? "text-lg" : "text-lg sm:text-2xl"} truncate text-foreground flex items-center gap-2`}
            >
              <span>{entity.name}</span>
              {isAiRec && (
                <span className="clip-tag px-1.5 py-0.5 text-[8px] font-sans font-bold bg-gold text-background rounded">
                  AI REC
                </span>
              )}
              {isSelected && (
                <span className="clip-tag px-1.5 py-0.5 text-[8px] font-sans font-bold bg-primary text-primary-foreground rounded">
                  SELECTED
                </span>
              )}
            </div>
            <div
              className={`font-display ${compact ? "text-2xl" : "text-2xl sm:text-4xl"} leading-none ${ratingColor}`}
            >
              {entity.rating}
            </div>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="rounded bg-background/60 px-1 sm:px-1.5 py-0.5">
              {org?.shortName ?? entity.orgId}
            </span>
            <span className="rounded bg-background/60 px-1 sm:px-1.5 py-0.5">
              {tournament?.shortName ?? entity.tournamentId}
            </span>
            <span className="rounded bg-background/60 px-1 sm:px-1.5 py-0.5">{entity.region}</span>
            <span className={`clip-tag px-2 py-0.5 bg-background/80 ${roleColor.text} border border-white/10`}>
              {isCoach ? "COACH" : resolvedIsIgl ? `IGL • ${(entity as PlayerEntry).primaryRole}` : (entity as PlayerEntry).primaryRole || (entity as PlayerEntry).role}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`relative flex items-center justify-between border-t border-border/40 bg-background/40 px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${ratingColor}`}
      >
        <span>{entity.orgId}</span>
        <span className="text-muted-foreground">{tournament?.year}</span>
      </div>
    </motion.button>
  );
});
