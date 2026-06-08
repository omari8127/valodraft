import type { Roster } from "@/types/game";
import { PLAYER_BY_ID, COACH_BY_ID } from "@/data/generate";
import { ORG_BY_ID } from "@/data/regions";
import { TOURNAMENT_BY_ID } from "@/data/tournaments";
import { rarityFor, RARITY_META } from "@/lib/engine/rarity";

interface Props {
  roster: Roster;
  currentIdx: number;
  hoveredRole?: string | null;
}

export function RosterPanel({ roster, currentIdx, hoveredRole }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
      {roster.slots.map((slot, i) => {
        const player = slot.playerId ? PLAYER_BY_ID[slot.playerId] : null;
        const coach = slot.coachId ? COACH_BY_ID[slot.coachId] : null;
        const entity = player ?? coach;
        const isCurrent = i === currentIdx;
        const filled = !!entity;
        const rarity = entity ? rarityFor(entity.rating) : null;
        const meta = rarity ? RARITY_META[rarity] : null;
        const org = entity ? ORG_BY_ID[entity.orgId] : null;
        const tour = entity ? TOURNAMENT_BY_ID[entity.tournamentId] : null;
        const isHovered = hoveredRole === slot.role;
        return (
          <div
            key={slot.role + i}
            className={`clip-corner relative flex flex-col border bg-surface/60 p-3 transition role-slot ${isHovered ? "hovered" : ""} ${
              isCurrent
                ? "border-primary shadow-[0_0_18px_var(--color-primary)] animate-pulse-red"
                : filled
                  ? `border-border/60 ${meta?.ring ?? ""}`
                  : "border-dashed border-border/50 opacity-70"
            }`}
          >
            {entity ? (
              <>
                {/* Show actual player role, always white */}
                <div
                  className="text-[10px] font-bold uppercase tracking-widest text-white"
                >
                  {player ? player.role : "COACH"}
                </div>
                <div className="mt-1 font-display text-lg leading-tight truncate">
                  {entity.name}
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {org?.shortName} · {tour?.shortName}
                </div>
                <div className={`mt-auto font-display text-3xl ${meta?.color ?? ""}`}>
                  {entity.rating}
                </div>
              </>
            ) : (
              <>
                {/* Empty slot role labels, always white */}
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/90">
                  {slot.role === "FLEX" ? `SLOT ${i + 1} (FLEX)` : slot.role}
                </div>
                <div className="mt-3 font-display text-sm text-muted-foreground">
                  {isCurrent ? "ON THE CLOCK" : "Empty"}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
