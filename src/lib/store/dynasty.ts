import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SavedDynasty } from "@/types/game";

interface DynastyState {
  saves: SavedDynasty[];
  addSave: (s: SavedDynasty) => void;
  removeSave: (id: string) => void;
  addTrophy: (id: string, trophy: string) => void;
  recordWin: (id: string) => void;
  recordLoss: (id: string) => void;
  updateProgression: (id: string, mapRatings: Record<string, number>, teamStrength?: number, synergy?: number) => void;
}

export const useDynasty = create<DynastyState>()(
  persist(
    (set) => ({
      saves: [],
      addSave: (s) => set((st) => ({ saves: [s, ...st.saves] })),
      removeSave: (id) => set((st) => ({ saves: st.saves.filter((x) => x.id !== id) })),
      addTrophy: (id, trophy) =>
        set((st) => ({
          saves: st.saves.map((x) =>
            x.id === id ? { ...x, trophies: [...new Set([...x.trophies, trophy])] } : x,
          ),
        })),
      recordWin: (id) =>
        set((st) => ({
          saves: st.saves.map((x) => (x.id === id ? { ...x, wins: x.wins + 1 } : x)),
        })),
      recordLoss: (id) =>
        set((st) => ({
          saves: st.saves.map((x) => (x.id === id ? { ...x, losses: x.losses + 1 } : x)),
        })),
      updateProgression: (id, mapRatings, teamStrength, synergy) =>
        set((st) => ({
          saves: st.saves.map((x) => {
            if (x.id === id) {
              return {
                ...x,
                teamProgression: {
                  mapRatings,
                  teamStrength: teamStrength ?? x.teamProgression?.teamStrength ?? x.teamOVR,
                  synergy: synergy ?? x.teamProgression?.synergy ?? x.chemistry,
                }
              };
            }
            return x;
          }),
        })),
    }),
    { name: "vcd-dynasty-v1" },
  ),
);
