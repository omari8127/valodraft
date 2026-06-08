import { create } from "zustand";

export type RankedTier =
  | "Iron"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
  | "Ascendant"
  | "Immortal"
  | "Radiant";

export type GameDifficulty = "EASY" | "MEDIUM" | "HARD";
export type PatchMetaType = "Duelist Meta" | "Sentinel Meta" | "Utility Meta" | "Balanced Meta";

interface ProgressionState {
  mmr: number;
  xp: number;
  level: number;
  difficulty: GameDifficulty;
  rankedActive: boolean;
  activeMeta: PatchMetaType;
  
  // Actions
  recordMatchResult: (won: boolean) => { mmrChange: number; xpChange: number; leveledUp: boolean };
  setDifficulty: (diff: GameDifficulty) => void;
  setRankedActive: (active: boolean) => void;
  cycleMeta: () => void;
  resetProgression: () => void;
}

export function getRankTier(mmr: number): RankedTier {
  if (mmr < 900) return "Iron";
  if (mmr < 1000) return "Bronze";
  if (mmr < 1100) return "Silver";
  if (mmr < 1220) return "Gold";
  if (mmr < 1350) return "Platinum";
  if (mmr < 1500) return "Diamond";
  if (mmr < 1650) return "Ascendant";
  if (mmr < 1800) return "Immortal";
  return "Radiant";
}

export function getRankBadge(tier: RankedTier): string {
  // Return a themed emoji representation for now
  switch (tier) {
    case "Iron": return "⚪";
    case "Bronze": return "🟫";
    case "Silver": return "⬜";
    case "Gold": return "🟨";
    case "Platinum": return "🟩";
    case "Diamond": return "🔷";
    case "Ascendant": return "🟢";
    case "Immortal": return "🟥";
    case "Radiant": return "☀️";
  }
}

export function getUnlockedYears(level: number): number[] {
  const years = [];
  if (level >= 1) years.push(2021);
  if (level >= 2) years.push(2022);
  if (level >= 3) years.push(2023);
  if (level >= 4) years.push(2024);
  if (level >= 5) years.push(2025);
  return years;
}

const META_POOL: PatchMetaType[] = [
  "Duelist Meta",
  "Sentinel Meta",
  "Utility Meta",
  "Balanced Meta"
];

// Helper to load state from localStorage safely
const loadState = () => {
  if (typeof window === "undefined") {
    return {
      mmr: 1000,
      xp: 0,
      level: 1,
      difficulty: "MEDIUM" as GameDifficulty,
      rankedActive: false,
      activeMeta: "Balanced Meta" as PatchMetaType,
    };
  }
  
  try {
    const saved = localStorage.getItem("valodraft_progression");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        mmr: parsed.mmr ?? 1000,
        xp: parsed.xp ?? 0,
        level: parsed.level ?? 1,
        difficulty: parsed.difficulty ?? "MEDIUM",
        rankedActive: parsed.rankedActive ?? false,
        activeMeta: parsed.activeMeta ?? "Balanced Meta",
      };
    }
  } catch (e) {
    console.error("Failed to load progression state from localStorage", e);
  }
  
  return {
    mmr: 1000,
    xp: 0,
    level: 1,
    difficulty: "MEDIUM" as GameDifficulty,
    rankedActive: false,
    activeMeta: "Balanced Meta" as PatchMetaType,
  };
};

export const useProgression = create<ProgressionState>((set, get) => {
  const initialState = loadState();
  
  const saveState = (updated: Partial<ProgressionState>) => {
    if (typeof window === "undefined") return;
    try {
      const current = {
        mmr: get().mmr,
        xp: get().xp,
        level: get().level,
        difficulty: get().difficulty,
        rankedActive: get().rankedActive,
        activeMeta: get().activeMeta,
        ...updated
      };
      localStorage.setItem("valodraft_progression", JSON.stringify(current));
    } catch (e) {
      console.error("Failed to save progression state to localStorage", e);
    }
  };

  return {
    ...initialState,

    recordMatchResult: (won) => {
      const { mmr, xp, level, rankedActive } = get();
      
      // MMR scaling: Win +25, Loss -20 (Ranked only)
      const mmrChange = rankedActive ? (won ? 25 : -20) : 0;
      const nextMmr = Math.max(100, mmr + mmrChange); // floor at 100
      
      // XP scaling: Win +100, Loss +40
      const xpChange = won ? 100 : 40;
      let nextXp = xp + xpChange;
      let nextLevel = level;
      let leveledUp = false;
      
      // Level up every 300 XP
      while (nextXp >= 300) {
        nextXp -= 300;
        nextLevel += 1;
        leveledUp = true;
      }
      
      set({
        mmr: nextMmr,
        xp: nextXp,
        level: nextLevel
      });
      
      saveState({ mmr: nextMmr, xp: nextXp, level: nextLevel });
      
      // Return details for UI feedback
      return {
        mmrChange,
        xpChange,
        leveledUp
      };
    },

    setDifficulty: (difficulty) => {
      set({ difficulty });
      saveState({ difficulty });
    },

    setRankedActive: (rankedActive) => {
      set({ rankedActive });
      saveState({ rankedActive });
    },

    cycleMeta: () => {
      const current = get().activeMeta;
      const idx = META_POOL.indexOf(current);
      const nextMeta = META_POOL[(idx + 1) % META_POOL.length];
      set({ activeMeta: nextMeta });
      saveState({ activeMeta: nextMeta });
    },

    resetProgression: () => {
      const reset = {
        mmr: 1000,
        xp: 0,
        level: 1,
        difficulty: "MEDIUM" as GameDifficulty,
        rankedActive: false,
        activeMeta: "Balanced Meta" as PatchMetaType,
      };
      set(reset);
      saveState(reset);
    }
  };
});

// Prepare architecture for future Supabase integration:
// export async function syncProgressionToCloud(userId: string, state: any) {
//   const { data, error } = await supabase
//     .from('profiles')
//     .update({ mmr: state.mmr, level: state.level, xp: state.xp })
//     .eq('id', userId);
//   return { data, error };
// }
