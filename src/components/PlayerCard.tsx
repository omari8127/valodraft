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
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isAiRec?: boolean;
  isDisabled?: boolean;
}

export function PlayerCard({
  entity,
  isCoach,
  onClick,
  compact,
  mini,
  onMouseEnter,
  onMouseLeave,
  isAiRec,
  isDisabled,
}: Props) {
  const rarity = rarityFor(entity.rating);
  const meta = RARITY_META[rarity];
  const org = ORG_BY_ID[entity.orgId];
  const tournament = TOURNAMENT_BY_ID[entity.tournamentId];

  const getRatingColor = (r: number) => {
    if (r >= 96) return "text-gold";
    if (r >= 90) return "text-red-500";
    if (r >= 85) return "text-purple-500";
    return "text-blue-400";
  };
  const ratingColor = getRatingColor(entity.rating);

  if (mini) {
    return (
      <motion.button
        type="button"
        onClick={isDisabled ? undefined : onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        whileHover={!isDisabled && onClick ? { y: -2, scale: 1.03 } : {}}
        whileTap={!isDisabled && onClick ? { scale: 0.97 } : {}}
        className={`group clip-corner relative w-full overflow-hidden bg-surface border ${
          isAiRec
            ? "border-gold/80 shadow-[0_0_12px_rgba(212,175,55,0.45)]"
            : "border-border"
        } ${!isDisabled && onClick ? "cursor-pointer" : "cursor-default"} text-left ${
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
            </div>
            <div className={`font-display text-xl leading-none shrink-0 ${ratingColor}`}>
              {entity.rating}
            </div>
          </div>
          <div className="mt-1 flex flex-wrap gap-0.5">
            <span
              className="clip-tag px-1.5 py-px text-[8px] font-bold uppercase tracking-wide bg-background/80 text-white border border-white/10"
            >
              {isCoach ? "COACH" : (entity as PlayerEntry).role}
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
      whileHover={!isDisabled && onClick ? { y: -4, scale: 1.02 } : {}}
      whileTap={!isDisabled && onClick ? { scale: 0.98 } : {}}
      className={`group clip-corner relative w-full overflow-hidden bg-surface border ${
        isAiRec
          ? "border-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]"
          : "border-border"
      } ${!isDisabled && onClick ? "cursor-pointer" : "cursor-default"} text-left ${
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
            <span className="clip-tag px-2 py-0.5 bg-background/80 text-white border border-white/10">
              {isCoach ? "COACH" : (entity as PlayerEntry).role}
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
