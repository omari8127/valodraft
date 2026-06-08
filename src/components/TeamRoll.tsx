import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SlotRole, TeamEntry } from "@/types/game";
import { ORG_BY_ID } from "@/data/regions";
import { TOURNAMENT_BY_ID } from "@/data/tournaments";
import { availableTeamsForRole } from "@/lib/store/draft";

interface Props {
  /** All teams in the mode pool */
  pool: TeamEntry[];
  /** Teams already locked (used) in this draft */
  locked: Set<string>;
  /** Roles already locked in this draft */
  lockedRoles: SlotRole[];
  /** Current draft slot role (used only to filter decoy cards) */
  role: SlotRole;
  /** The team that was randomly selected BEFORE this component mounted */
  selectedTeam: TeamEntry;
  onComplete: () => void;
  duration?: number;
}

export function TeamRoll({ pool, locked, lockedRoles, role, selectedTeam, onComplete, duration = 5000 }: Props) {
  const [phase, setPhase] = useState<"spinning" | "flash" | "done">("spinning");
  const [showResult, setShowResult] = useState(false);

  // Build a fixed 50-item reel with the winner locked at index 35.
  // All other slots are decoys (random from available pool, ok to be random for visuals).
  const CARD_FULL = 188; // w-44 (176px) + gap-3 (12px)
  const START_INDEX = 10;
  const TARGET_INDEX = 35;

  const available = useMemo(
    () => availableTeamsForRole(pool, locked, role, lockedRoles),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Decoys are purely cosmetic — only selectedTeam matters for the draft.
  // We build the reel array once at mount (ref so it never changes).
  const reelRef = useRef<TeamEntry[]>([]);
  if (reelRef.current.length === 0) {
    const decoys = available.length > 0 ? available : [selectedTeam];
    for (let i = 0; i < 50; i++) {
      if (i === TARGET_INDEX) {
        reelRef.current.push(selectedTeam);
      } else {
        reelRef.current.push(decoys[Math.floor(Math.random() * decoys.length)]);
      }
    }
  }
  const reel = reelRef.current;

  // Centering math:
  // The motion.div has `absolute left-1/2`, so x=0 means its left edge is at 50% of the parent.
  // To center card at index N: x = -(N * CARD_FULL) - (176 / 2)
  // (we shift left by N full cards, plus half a card width to center the card itself)
  const initialX = -(START_INDEX * CARD_FULL) - 88;
  const landX = -(TARGET_INDEX * CARD_FULL) - 88;

  // Validation: confirm the reel has selectedTeam at TARGET_INDEX
  if (reel[TARGET_INDEX]?.id !== selectedTeam.id) {
    console.error(
      "[Roulette desync] reel[TARGET_INDEX].id !== selectedTeam.id",
      reel[TARGET_INDEX]?.id,
      "!==",
      selectedTeam.id,
    );
  }
  console.log("[Roll] Visual target:", selectedTeam.orgId, selectedTeam.tournamentId);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setShowResult(true);
      setPhase("flash");
    }, duration);
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, duration + 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {phase === "flash" && (
        <div className="pointer-events-none absolute inset-0 z-20 animate-flash bg-primary/30" />
      )}
      <div className="clip-corner relative overflow-hidden border border-border bg-surface/80 p-6 backdrop-blur">
        <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <span className="text-primary">// Rolling team for {role}</span>
          <span className="animate-pulse">LIVE</span>
        </div>

        <div className="relative h-32 w-full overflow-hidden rounded-lg border border-border/40 bg-background/50">
          {/* center indicator — truth line */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-px -translate-x-1/2 bg-primary shadow-[0_0_18px_var(--color-primary)]" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-background via-transparent to-background" />

          <motion.div
            initial={{ x: initialX }}
            animate={{ x: landX }}
            transition={{
              duration: duration / 1000,
              ease: [0.15, 0.7, 0.25, 1],
            }}
            className="absolute left-1/2 flex h-full items-center gap-3 will-change-transform"
            style={{ filter: phase === "spinning" ? "blur(0.5px)" : "none" }}
          >
            {reel.map((t, i) => {
              const org = ORG_BY_ID[t.orgId];
              const tour = TOURNAMENT_BY_ID[t.tournamentId];
              const isWinner = i === TARGET_INDEX;
              return (
                <div
                  key={`${t.id}-${i}`}
                  className={`clip-corner flex h-24 w-44 shrink-0 flex-col justify-center border px-3 ${
                    isWinner ? "border-primary bg-primary/10" : "border-border/60 bg-background/80"
                  }`}
                >
                  <div className="font-display text-xl leading-none">{org?.shortName}</div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {tour?.shortName} · {tour?.year}
                  </div>
                  <div className="mt-2 inline-block w-fit clip-tag bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {org?.region}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        <AnimatePresence>
          {showResult && phase !== "spinning" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex items-center justify-between border-t border-primary/40 pt-4"
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary">
                  Selected
                </div>
                <div className="font-display text-3xl">
                  {ORG_BY_ID[selectedTeam.orgId]?.name} ·{" "}
                  <span className="text-primary">
                    {TOURNAMENT_BY_ID[selectedTeam.tournamentId]?.shortName}
                  </span>
                </div>
              </div>
              <div className="font-display text-5xl text-gold">{selectedTeam.avgRating}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
