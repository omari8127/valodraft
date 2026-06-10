import { motion } from "framer-motion";
import type { CoachEntry, DraftMode, PlayerEntry, Roster, SlotRole } from "@/types/game";
import { PLAYER_BY_ID, COACH_BY_ID } from "@/data/generate";
import { ORG_BY_ID } from "@/data/regions";
import { TOURNAMENT_BY_ID } from "@/data/tournaments";
import { rarityFor, RARITY_META } from "@/lib/engine/rarity";
import { canPlaceCoachInSlot, canPlacePlayerInSlot } from "@/lib/store/draft";


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
      case "CONTROLLER": return "border-blue-500/40";
      case "SENTINEL": return "border-green-500/40";
      case "FLEX": return "border-purple-500/40";
      case "COACH": return "border-gray-500/40";
      default: return "border-border/60";
    }
  };

  return (
    <div className="flex flex-col gap-4">
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
            disabled={!canPlace}
            onClick={() => canPlace && onSelectSlot?.(i)}
            className={`clip-corner relative flex min-h-[96px] flex-col overflow-hidden border bg-[#0A0E13]/80 p-4 text-left transition-all duration-300 role-slot ${isHovered ? "hovered" : ""} ${isFlexRoleChoice ? "role-slot-confirm" : ""} ${
              canPlace
                ? "cursor-pointer border-primary/80 bg-primary/10 shadow-[0_0_18px_var(--color-primary)]"
                : isCurrent && !hasPendingPick
                  ? "border-primary shadow-[0_0_18px_var(--color-primary)] animate-pulse-red"
                  : filled
                    ? `${getSlotBorderColor(slot.role, true)} ${meta?.ring ?? ""}`
                    : isBlockedPlacement
                      ? "cursor-not-allowed border-dashed border-border/30 opacity-30"
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
                    : hasPendingPick
                      ? "NOT COMPATIBLE"
                      : isCurrent
                        ? "ON THE CLOCK"
                        : "Empty"}
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
