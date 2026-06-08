import type { PlayerRole } from "@/types/game";

export interface GameMap {
  id: string;
  name: string;
  bonusRole?: PlayerRole;
  bonusPct?: number;
}

export const MAPS: GameMap[] = [
  { id: "bind", name: "Bind", bonusRole: "DUELIST", bonusPct: 3 },
  { id: "haven", name: "Haven", bonusRole: "INITIATOR", bonusPct: 3 },
  { id: "ascent", name: "Ascent" },
  { id: "lotus", name: "Lotus", bonusRole: "CONTROLLER", bonusPct: 3 },
  { id: "sunset", name: "Sunset" },
  { id: "split", name: "Split", bonusRole: "FLEX", bonusPct: 3 },
  { id: "icebox", name: "Icebox", bonusRole: "SENTINEL", bonusPct: 3 },
  { id: "pearl", name: "Pearl" },
  { id: "fracture", name: "Fracture" },
  { id: "abyss", name: "Abyss" },
];
