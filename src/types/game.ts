export type Region = "AMERICAS" | "EMEA" | "PACIFIC" | "CHINA";

export type PlayerRole = "DUELIST" | "INITIATOR" | "CONTROLLER" | "SENTINEL" | "FLEX";
export type SlotRole = PlayerRole | "COACH";

export type CompositionMode = "STRICT" | "PRESET" | "CUSTOM";
export type PresetType =
  | "STANDARD"
  | "DOUBLE_DUELIST"
  | "DOUBLE_CONTROLLER"
  | "DOUBLE_INITIATOR"
  | "NO_SENTINEL";

export const DRAFT_ORDER: SlotRole[] = [
  "DUELIST",
  "INITIATOR",
  "CONTROLLER",
  "SENTINEL",
  "FLEX",
  "COACH",
];

export type Rarity = "CHAMPIONS" | "LEGENDARY" | "EPIC" | "RARE" | "COMMON";

export interface Organization {
  id: string;
  name: string;
  shortName: string;
  region: Region;
  logo?: string;
}

export type TournamentSeries = "champions" | "masters";

export interface Tournament {
  id: string;
  name: string;
  shortName: string;
  series: TournamentSeries;
  year: number;
  location?: string;
}

export type DraftMode = "STRICT" | "FLEXIBLE" | "CHAOS";

export interface PlayerStats {
  aim: number;
  clutch: number;
  consistency: number;
  leadership: number;
  entryImpact: number;
  utilityImpact: number;
  awpSkill: number;
}

export interface PlayerEntry {
  id: string;
  name: string;
  realName?: string;
  orgId: string;
  tournamentId: string;
  role: PlayerRole; // keep for backward compatibility
  primaryRole: PlayerRole;
  secondaryRole: PlayerRole;
  rating: number;
  region: Region;
  nationality: string;
  mostPlayedAgents?: string[];
  agent?: string;
  form?: number; // dynamic form modifier (-2 to +2)
  stats?: PlayerStats;
  iglRating?: number;
  image?: string;
}

export interface CoachEntry {
  id: string;
  name: string;
  orgId: string;
  tournamentId: string;
  rating: number;
  region: Region;
}

export interface TeamEntry {
  id: string; // org + tournament
  orgId: string;
  tournamentId: string;
  name: string; // e.g. "Sentinels"
  year: number; // e.g. 2025
  displayName: string; // e.g. "Sentinels 2025"
  region: Region;
  players: PlayerEntry[]; // 5
  coach: CoachEntry;
  avgRating: number;
}

export type GameModeId =
  | "champions"
  | "masters"
  | "mixed"
  | "champions-2021"
  | "champions-2022"
  | "champions-2023"
  | "champions-2024"
  | "champions-2025"
  | "masters-reykjavik-2021"
  | "masters-berlin-2021"
  | "masters-reykjavik-2022"
  | "masters-copenhagen-2022"
  | "masters-tokyo-2023"
  | "masters-madrid-2024"
  | "masters-shanghai-2024"
  | "masters-toronto-2025";

export interface GameMode {
  id: GameModeId;
  name: string;
  subtitle: string;
  tournamentIds: string[];
}

export interface RosterSlot {
  role: SlotRole;
  playerId: string | null;
  coachId?: string | null;
  teamEntryId: string | null;
  playerWithForm?: PlayerEntry;
}

export interface Roster {
  slots: RosterSlot[];
}

export interface ChemistryBreakdown {
  organization: number;
  region: number;
  nationality: number;
  coachOrg: number;
  coachRegion: number;
  fullOrg: number;
  roleBalance: number;
  total: number;
}

export interface TeamProgression {
  mapRatings: Record<string, number>;
  teamStrength: number;
  synergy: number;
}

export interface SavedDynasty {
  id: string;
  name: string;
  createdAt: number;
  modeId: GameModeId;
  rosterPlayerIds: string[];
  coachId: string | null;
  teamOVR: number;
  chemistry: number;
  trophies: string[];
  wins: number;
  losses: number;
  playerForms?: Record<string, number>;
  roleAssignments?: Record<string, PlayerRole>;
  draftMode?: DraftMode;
  teamProgression?: TeamProgression;
}
