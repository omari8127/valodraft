import type { Rarity } from "@/types/game";

export function rarityFor(rating: number): Rarity {
  if (rating >= 98) return "CHAMPIONS";
  if (rating >= 95) return "LEGENDARY";
  if (rating >= 90) return "EPIC";
  if (rating >= 85) return "RARE";
  return "COMMON";
}

export const RARITY_META: Record<
  Rarity,
  { label: string; color: string; glow: string; ring: string; bg: string }
> = {
  CHAMPIONS: {
    label: "CHAMPIONS",
    color: "text-[oklch(0.65_0.25_25)]",
    glow: "shadow-[0_0_28px_oklch(0.65_0.25_25/0.7)]",
    ring: "ring-2 ring-[oklch(0.65_0.25_25)]",
    bg: "from-[oklch(0.35_0.18_25)] to-[oklch(0.15_0.05_25)]",
  },
  LEGENDARY: {
    label: "LEGENDARY",
    color: "text-[oklch(0.82_0.16_85)]",
    glow: "shadow-[0_0_22px_oklch(0.82_0.16_85/0.55)]",
    ring: "ring-2 ring-[oklch(0.82_0.16_85)]",
    bg: "from-[oklch(0.35_0.12_85)] to-[oklch(0.18_0.06_85)]",
  },
  EPIC: {
    label: "EPIC",
    color: "text-[oklch(0.7_0.2_300)]",
    glow: "shadow-[0_0_18px_oklch(0.7_0.2_300/0.5)]",
    ring: "ring-2 ring-[oklch(0.7_0.2_300)]",
    bg: "from-[oklch(0.3_0.14_300)] to-[oklch(0.15_0.06_300)]",
  },
  RARE: {
    label: "RARE",
    color: "text-[oklch(0.7_0.15_240)]",
    glow: "shadow-[0_0_14px_oklch(0.7_0.15_240/0.45)]",
    ring: "ring-2 ring-[oklch(0.7_0.15_240)]",
    bg: "from-[oklch(0.3_0.12_240)] to-[oklch(0.15_0.06_240)]",
  },
  COMMON: {
    label: "COMMON",
    color: "text-[oklch(0.75_0.01_250)]",
    glow: "",
    ring: "ring-1 ring-[oklch(0.5_0.01_250)]",
    bg: "from-[oklch(0.25_0.01_250)] to-[oklch(0.14_0.01_250)]",
  },
};
