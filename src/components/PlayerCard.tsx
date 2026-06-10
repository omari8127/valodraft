import { motion } from "framer-motion";
import type { CoachEntry, PlayerEntry } from "@/types/game";
import { rarityFor, RARITY_META } from "@/lib/engine/rarity";
import { ORG_BY_ID } from "@/data/regions";
import { TOURNAMENT_BY_ID } from "@/data/tournaments";

interface Props {
  entity: PlayerEntry | CoachEntry;
  isCoach?: boolean;
  onClick?: () => void;
  compact?: boolean;
  /** Ultra-compact mode for showing all 6 team members at once */
  mini?: boolean;
  /** Draft mode for the premium Valorant Champions layout */
  draft?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isAiRec?: boolean;
  isDisabled?: boolean;
  isSelected?: boolean;
}

export function PlayerCard({
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
}: Props) {
  const rarity = rarityFor(entity.rating);
  const meta = RARITY_META[rarity];
  const org = ORG_BY_ID[entity.orgId];
  const tournament = TOURNAMENT_BY_ID[entity.tournamentId];

  const ratingColor = "text-white";

  const getRoleColor = () => {
    const baseBg = "bg-[#0A0E13]";
    if (isCoach) return { border: "border-gray-500/40", glow: "shadow-[0_0_8px_rgba(107,114,128,0.25)] hover:shadow-[0_0_14px_rgba(107,114,128,0.4)]", text: "text-gray-500", bg: baseBg };
    const role = (entity as PlayerEntry).primaryRole || (entity as PlayerEntry).role;
    switch (role) {
      case "DUELIST": return { border: "border-red-500/40", glow: "shadow-[0_0_8px_rgba(239,68,68,0.25)] hover:shadow-[0_0_14px_rgba(239,68,68,0.4)]", text: "text-white", bg: baseBg };
      case "INITIATOR": return { border: "border-yellow-500/40", glow: "shadow-[0_0_8px_rgba(234,179,8,0.25)] hover:shadow-[0_0_14px_rgba(234,179,8,0.4)]", text: "text-white", bg: baseBg };
      case "CONTROLLER": return { border: "border-purple-500/40", glow: "shadow-[0_0_8px_rgba(168,85,247,0.25)] hover:shadow-[0_0_14px_rgba(168,85,247,0.4)]", text: "text-white", bg: baseBg };
      case "SENTINEL": return { border: "border-green-500/40", glow: "shadow-[0_0_8px_rgba(34,197,94,0.25)] hover:shadow-[0_0_14px_rgba(34,197,94,0.4)]", text: "text-white", bg: baseBg };
      case "FLEX": return { border: "border-cyan-500/40", glow: "shadow-[0_0_8px_rgba(6,182,212,0.25)] hover:shadow-[0_0_14px_rgba(6,182,212,0.4)]", text: "text-white", bg: baseBg };
      default: return { border: "border-white/20", glow: "shadow-[0_0_8px_rgba(255,255,255,0.25)] hover:shadow-[0_0_14px_rgba(255,255,255,0.4)]", text: "text-white", bg: baseBg };
    }
  };
  const roleColor = getRoleColor();


  if (draft) {
    return (
      <motion.button
        type="button"
        onClick={isDisabled ? undefined : onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        whileHover={!isDisabled && onClick ? { y: -4, scale: 1.03 } : {}}
        whileTap={!isDisabled && onClick ? { scale: 0.98 } : {}}
        className={`group clip-corner relative w-full overflow-hidden ${roleColor.bg} border ${
          isSelected
            ? "border-primary shadow-[0_0_18px_var(--color-primary)]"
            : isAiRec
              ? "border-[#FFC700] shadow-[0_0_12px_rgba(255,199,0,0.45)]"
              : roleColor.border
        } ${!isDisabled && onClick ? `cursor-pointer ${roleColor.glow} transition-all duration-300` : "cursor-default"} text-left ${
          isDisabled ? "opacity-60 is-disabled" : ""
        } player-card flex flex-col justify-between min-h-[140px] p-4`}
      >
        <div className="absolute inset-0 -translate-x-full opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
          <div className="shimmer h-full w-full opacity-20" />
        </div>
        
        <div className="relative flex items-start gap-4 w-full">
          {/* Big Rating */}
          <div className={`font-display text-5xl leading-none ${ratingColor} shrink-0 tracking-tighter`}>
            {entity.rating}
          </div>
          
          {/* Info */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${roleColor.text}`}>
              {isCoach ? "COACH" : (entity as PlayerEntry).primaryRole || (entity as PlayerEntry).role}
            </div>
            <div className="font-display text-2xl text-foreground truncate leading-none flex items-center gap-2">
              <span>{entity.name}</span>
              {isDisabled && (
                <span className="clip-tag text-[10px] font-sans font-bold tracking-widest text-[#FFD600] bg-[#FFD600]/10 px-2 py-0.5 rounded-full border border-[#FFD600]/30 shadow-[0_0_6px_rgba(255,214,0,0.2)]">
                  🔒 BLOQ
                </span>
              )}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2 flex items-center gap-2">
              <span>{org?.shortName ?? entity.orgId}</span>
              <span>{tournament?.year ?? entity.tournamentId}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-1 items-end shrink-0">
             {isAiRec && <span className="clip-tag px-1.5 py-0.5 text-[8px] font-sans font-bold bg-gold text-[#0A0E13] rounded">AI REC</span>}
             {isSelected && <span className="clip-tag px-1.5 py-0.5 text-[8px] font-sans font-bold bg-primary text-primary-foreground rounded">SELECTED</span>}
          </div>
        </div>

        {/* Bottom Tags */}
        <div className="relative mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-full">
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">🌎</span>
            <span>{entity.region}</span>
          </div>
          {(entity as PlayerEntry).nationality && (
             <div className="flex items-center gap-1.5 text-gold/80">
               <span>★</span>
               <span>{(entity as PlayerEntry).nationality}</span>
             </div>
          )}
        </div>
      </motion.button>
    );
  }

  if (mini) {
    return (
      <motion.button
        type="button"
        onClick={isDisabled ? undefined : onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        whileHover={!isDisabled && onClick ? { y: -2, scale: 1.03 } : {}}
        whileTap={!isDisabled && onClick ? { scale: 0.97 } : {}}
        className={`group clip-corner relative w-full overflow-hidden bg-[#0A0E13] border ${
          isSelected
            ? "border-primary shadow-[0_0_18px_var(--color-primary)]"
            : isAiRec
              ? "border-gold shadow-[0_0_12px_rgba(212,175,55,0.45)]"
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
              {isCoach ? "COACH" : (entity as PlayerEntry).primaryRole || (entity as PlayerEntry).role}
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
      onClick={isDisabled ? undefined : onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileHover={!isDisabled && onClick ? { y: -4, scale: 1.03 } : {}}
      whileTap={!isDisabled && onClick ? { scale: 0.98 } : {}}
      className={`group clip-corner relative w-full overflow-hidden bg-[#0A0E13] border ${
        isSelected
          ? "border-primary shadow-[0_0_18px_var(--color-primary)]"
          : isAiRec
            ? "border-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]"
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
              {isCoach ? "COACH" : (entity as PlayerEntry).primaryRole || (entity as PlayerEntry).role}
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
}
