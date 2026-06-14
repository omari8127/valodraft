import { motion } from "framer-motion";
import type { CoachEntry, DraftMode, PlayerEntry, Roster, SlotRole } from "@/types/game";
import { PLAYER_BY_ID, COACH_BY_ID } from "@/data/generate";
import { ORG_BY_ID } from "@/data/regions";
import { TOURNAMENT_BY_ID } from "@/data/tournaments";
import { rarityFor, RARITY_META } from "@/lib/engine/rarity";
import { canPlaceCoachInSlot, canPlacePlayerInSlot } from "@/lib/store/draft";
import { evaluateTeamRoles } from "@/lib/engine/match/ProbabilityEngine";


const ROLE_LABEL_ES: Record<SlotRole, string> = {
  DUELIST: "Duelista",
  INITIATOR: "Iniciador",
  CONTROLLER: "Controlador",
  SENTINEL: "Centinela",
  FLEX: "Flex",
  COACH: "Coach",
};

function isFlexiblePlayer(player?: PlayerEntry | null) {
  return player?.primaryRole === "FLEX";
}

interface Props {
  roster: Roster;
  currentIdx: number;
  hoveredRole?: string | null;
  pendingPlayer?: PlayerEntry | null;
  pendingCoach?: CoachEntry | null;
  draftMode?: DraftMode;
  onSelectSlot?: (slotIndex: number) => void;
}

export function RosterPanel({
  roster,
  currentIdx,
  hoveredRole,
  pendingPlayer,
  pendingCoach,
  draftMode = "STRICT",
  onSelectSlot,
}: Props) {
  const hasPendingPick = !!pendingPlayer || !!pendingCoach;
  const pendingIsFlex = isFlexiblePlayer(pendingPlayer);

  const getSlotBorderColor = (role: SlotRole, isFilled: boolean) => {
    if (!isFilled) return "";
    switch (role) {
      case "DUELIST": return "border-red-500/40";
      case "INITIATOR": return "border-yellow-500/40";
      case "CONTROLLER": return "border-purple-500/40";
      case "SENTINEL": return "border-blue-500/40";
      case "FLEX": return "border-cyan-500/40";
      case "COACH": return "border-gray-500/40";
      default: return "border-border/60";
    }
  };

  const getSlotHoverStyles = (role: SlotRole) => {
    switch (role) {
      case "DUELIST": return "border-red-500 shadow-[0_0_14px_rgba(239,68,68,0.5)] scale-[1.01] -translate-y-[2px]";
      case "INITIATOR": return "border-yellow-500 shadow-[0_0_14px_rgba(234,179,8,0.5)] scale-[1.01] -translate-y-[2px]";
      case "CONTROLLER": return "border-purple-500 shadow-[0_0_14px_rgba(168,85,247,0.5)] scale-[1.01] -translate-y-[2px]";
      case "SENTINEL": return "border-blue-500 shadow-[0_0_14px_rgba(59,130,246,0.5)] scale-[1.01] -translate-y-[2px]";
      case "FLEX": return "border-cyan-500 shadow-[0_0_14px_rgba(6,182,212,0.5)] scale-[1.01] -translate-y-[2px]";
      case "COACH": return "border-gray-500 shadow-[0_0_14px_rgba(107,114,128,0.5)] scale-[1.01] -translate-y-[2px]";
      default: return "border-primary shadow-[0_0_12px_var(--color-primary)] scale-[1.01] -translate-y-[2px]";
    }
  };

  const getSlotHoverClasses = (role: SlotRole) => {
    switch (role) {
      case "DUELIST": return "hover:border-red-500 hover:shadow-[0_0_14px_rgba(239,68,68,0.5)] hover:scale-[1.01] hover:-translate-y-[2px]";
      case "INITIATOR": return "hover:border-yellow-500 hover:shadow-[0_0_14px_rgba(234,179,8,0.5)] hover:scale-[1.01] hover:-translate-y-[2px]";
      case "CONTROLLER": return "hover:border-purple-500 hover:shadow-[0_0_14px_rgba(168,85,247,0.5)] hover:scale-[1.01] hover:-translate-y-[2px]";
      case "SENTINEL": return "hover:border-blue-500 hover:shadow-[0_0_14px_rgba(59,130,246,0.5)] hover:scale-[1.01] hover:-translate-y-[2px]";
      case "FLEX": return "hover:border-cyan-500 hover:shadow-[0_0_14px_rgba(6,182,212,0.5)] hover:scale-[1.01] hover:-translate-y-[2px]";
      case "COACH": return "hover:border-gray-500 hover:shadow-[0_0_14px_rgba(107,114,128,0.5)] hover:scale-[1.01] hover:-translate-y-[2px]";
      default: return "hover:border-primary hover:shadow-[0_0_12px_var(--color-primary)] hover:scale-[1.01] hover:-translate-y-[2px]";
    }
  };

  const draftedPlayers = roster.slots.filter(s => s.playerId && s.role !== "COACH").map(s => s.playerWithForm ?? PLAYER_BY_ID[s.playerId!]).filter(Boolean) as PlayerEntry[];
  const teamRoles = evaluateTeamRoles({ players: draftedPlayers } as any);

  let qualityText = "Balanced team";
  let qualityColor = "text-gray-400";
  let qualityBg = "bg-white/5 border-white/10";
  
  if (teamRoles.hasIGL && teamRoles.hasController && teamRoles.hasEntry && teamRoles.hasSentinel) {
    qualityText = "✔ Strong composition";
    qualityColor = "text-green-400";
    qualityBg = "bg-green-500/10 border-green-500/20";
  } else if (!teamRoles.hasIGL && !teamRoles.hasController) {
    qualityText = "⚠ Missing IGL & Controller";
    qualityColor = "text-red-400";
    qualityBg = "bg-red-500/10 border-red-500/20";
  } else if (!teamRoles.hasIGL) {
    qualityText = "⚠ Missing IGL";
    qualityColor = "text-red-400";
    qualityBg = "bg-red-500/10 border-red-500/20";
  } else if (!teamRoles.hasController) {
    qualityText = "⚠ Missing Controller";
    qualityColor = "text-red-400";
    qualityBg = "bg-red-500/10 border-red-500/20";
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Team Quality Panel */}
      <div className={`clip-corner p-3 border ${qualityBg} flex items-center justify-center`}>
        <span className={`text-[11px] font-bold uppercase tracking-widest ${qualityColor}`}>{qualityText}</span>
      </div>

      {roster.slots.map((slot, i) => {
        const player = slot.playerWithForm ?? (slot.playerId ? PLAYER_BY_ID[slot.playerId] : null);
        const coach = slot.coachId ? COACH_BY_ID[slot.coachId] : null;
        const entity = player ?? coach;
        const isCurrent = i === currentIdx;
        const filled = !!entity;
        const rarity = entity ? rarityFor(entity.rating) : null;
        const meta = rarity ? RARITY_META[rarity] : null;
        const org = entity ? ORG_BY_ID[entity.orgId] : null;
        const tour = entity ? TOURNAMENT_BY_ID[entity.tournamentId] : null;
        const canPlace = pendingPlayer
          ? canPlacePlayerInSlot(pendingPlayer, roster, i, draftMode)
          : pendingCoach
            ? canPlaceCoachInSlot(pendingCoach, roster, i)
            : false;
        const isHovered = hoveredRole === slot.role || canPlace;
        const isBlockedPlacement = hasPendingPick && !filled && !canPlace;
        const isFlexRoleChoice = pendingIsFlex && canPlace && slot.role !== "COACH";

        return (
          <motion.button
            type="button"
            key={slot.role + i}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.045, duration: 0.25 }}
            whileHover={canPlace ? { x: -3, scale: 1.015 } : undefined}
            whileTap={canPlace ? { scale: 0.985 } : undefined}
            onClick={() => canPlace && onSelectSlot?.(i)}
            className={`clip-corner relative flex min-h-[96px] flex-col overflow-hidden border bg-[#0A0E13]/80 p-4 text-left transition-all duration-300 role-slot ${isHovered ? "hovered" : ""} ${isFlexRoleChoice ? "role-slot-confirm" : ""} ${canPlace ? "cursor-pointer" : "cursor-default"} ${getSlotHoverClasses(slot.role)} ${
              isHovered
                ? getSlotHoverStyles(slot.role)
                : canPlace
                  ? "border-primary/80 bg-primary/10 shadow-[0_0_18px_var(--color-primary)]"
                  : isCurrent && !hasPendingPick
                    ? "border-primary shadow-[0_0_18px_var(--color-primary)] animate-pulse-red"
                    : filled
                      ? `${getSlotBorderColor(slot.role, true)} ${meta?.ring ?? ""}`
                      : "border-dashed border-border/40 opacity-60"
            }`}
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {canPlace && (
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,color-mix(in_oklab,var(--color-primary)_24%,transparent),transparent_40%)]" />
            )}

            {entity ? (
              <>
                <div className="relative flex items-center justify-between gap-2">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white">
                    {player ? ROLE_LABEL_ES[slot.role] : "COACH"}
                  </div>
                  <div className="rounded border border-white/10 bg-background/50 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                    SLOT {i + 1}
                  </div>
                </div>
                <div className="relative mt-1 font-display text-lg leading-tight truncate">
                  {entity.name}
                </div>
                <div className="relative text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {org?.shortName} · {tour?.shortName}
                </div>
                <div className={`relative mt-auto font-display text-3xl ${meta?.color ?? ""}`}>
                  {entity.rating}
                </div>
              </>
            ) : (
              <>
                <div className="relative flex items-center justify-between gap-2">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/90">
                    {ROLE_LABEL_ES[slot.role]}
                  </div>
                  {canPlace && (
                    <span className="rounded bg-primary px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-primary-foreground">
                      {isFlexRoleChoice ? "ELEGIR ROL" : "CLICK"}
                    </span>
                  )}
                </div>
                <div className="relative mt-3 font-display text-sm text-muted-foreground">
                  {canPlace
                    ? (isFlexRoleChoice ? `Jugar como ${ROLE_LABEL_ES[slot.role]}` : "PLACE HERE")
                    : isCurrent
                      ? "CURRENT PICK"
                      : ""}
                </div>
                {canPlace && (
                  <div className="relative mt-auto text-[10px] font-semibold uppercase tracking-widest text-primary">
                    {isFlexRoleChoice ? `Confirmar ${ROLE_LABEL_ES[slot.role]}` : "Confirmar posición"}
                  </div>
                )}
              </>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
