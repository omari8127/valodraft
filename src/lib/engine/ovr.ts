import type { CoachEntry, PlayerEntry, DraftMode } from "@/types/game";
import { computeChemistry } from "./chemistry";

export function computeTeamOVR(
  players: PlayerEntry[],
  coach: CoachEntry | null,
  mode: DraftMode = "STRICT"
): number {
  if (players.length === 0) return 0;

  // 1. Base OVR = average(player.rating + player.form)
  const totalRatingWithForm = players.reduce((s, p) => s + p.rating + (p.form ?? 0), 0);
  const baseOvr = totalRatingWithForm / players.length;

  // 2. Chemistry Multiplier = 1 + (chemistryTotal * 0.0015)
  const chemistryTotal = computeChemistry(players, coach).total;
  const chemMultiplier = 1 + (chemistryTotal * 0.0015);

  // 3. Penalty Multiplier
  let penaltyMultiplier = 1.0;

  if (mode === "CHAOS") {
    // Chaos mode means roles do not punish the roster.
    penaltyMultiplier = 1.0;
  } else {
    // STRICT & FLEXIBLE Modes Standard Penalties:
    const duelists = players.filter((p) => p.primaryRole === "DUELIST").length;
    const controllers = players.filter((p) => p.primaryRole === "CONTROLLER").length;
    const initiators = players.filter((p) => p.primaryRole === "INITIATOR").length;
    const sentinels = players.filter((p) => p.primaryRole === "SENTINEL").length;

    if (controllers === 0) {
      penaltyMultiplier *= 0.85; // Missing Controller -> -15%
    }
    if (sentinels === 0) {
      penaltyMultiplier *= 0.90; // Missing Sentinel -> -10%
    }
    if (initiators === 0) {
      penaltyMultiplier *= 0.90; // Missing Initiator -> -10%
    }
    if (duelists > 1) {
      const extra = duelists - 1;
      penaltyMultiplier *= (1.0 - (extra * 0.08)); // Duplicate Duelists -> -8% per extra
    }
  }

  const finalOvr = baseOvr * chemMultiplier * penaltyMultiplier;

  // Cap at 99 OVR
  return Math.round(Math.min(99, finalOvr) * 10) / 10;
}
