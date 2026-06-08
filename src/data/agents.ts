export interface AgentData {
  id: string;
  role: "duelist" | "initiator" | "controller" | "sentinel";
  entryPower: number;
  clutch: number;
  utility: number;
}

export const AGENTS: Record<string, AgentData> = {
  jett: { id: "jett", role: "duelist", entryPower: 95, clutch: 85, utility: 60 },
  raze: { id: "raze", role: "duelist", entryPower: 90, clutch: 80, utility: 70 },
  phoenix: { id: "phoenix", role: "duelist", entryPower: 85, clutch: 80, utility: 75 },
  reyna: { id: "reyna", role: "duelist", entryPower: 80, clutch: 95, utility: 50 },
  neon: { id: "neon", role: "duelist", entryPower: 88, clutch: 75, utility: 65 },
  yoru: { id: "yoru", role: "duelist", entryPower: 85, clutch: 85, utility: 70 },
  iso: { id: "iso", role: "duelist", entryPower: 82, clutch: 90, utility: 60 },

  sova: { id: "sova", role: "initiator", entryPower: 60, clutch: 85, utility: 95 },
  breach: { id: "breach", role: "initiator", entryPower: 75, clutch: 70, utility: 90 },
  skye: { id: "skye", role: "initiator", entryPower: 70, clutch: 75, utility: 90 },
  kayo: { id: "kayo", role: "initiator", entryPower: 75, clutch: 80, utility: 95 },
  fade: { id: "fade", role: "initiator", entryPower: 65, clutch: 80, utility: 90 },
  gekko: { id: "gekko", role: "initiator", entryPower: 70, clutch: 85, utility: 85 },

  omen: { id: "omen", role: "controller", entryPower: 70, clutch: 88, utility: 85 },
  brimstone: { id: "brimstone", role: "controller", entryPower: 65, clutch: 75, utility: 90 },
  viper: { id: "viper", role: "controller", entryPower: 60, clutch: 85, utility: 95 },
  astra: { id: "astra", role: "controller", entryPower: 55, clutch: 80, utility: 95 },
  harbor: { id: "harbor", role: "controller", entryPower: 65, clutch: 70, utility: 85 },
  clove: { id: "clove", role: "controller", entryPower: 80, clutch: 85, utility: 80 },

  killjoy: { id: "killjoy", role: "sentinel", entryPower: 55, clutch: 90, utility: 95 },
  cypher: { id: "cypher", role: "sentinel", entryPower: 50, clutch: 85, utility: 95 },
  sage: { id: "sage", role: "sentinel", entryPower: 60, clutch: 80, utility: 90 },
  chamber: { id: "chamber", role: "sentinel", entryPower: 85, clutch: 90, utility: 70 },
  deadlock: { id: "deadlock", role: "sentinel", entryPower: 60, clutch: 85, utility: 85 },
};

export const AGENTS_BY_ROLE = {
  DUELIST: ["jett", "raze", "phoenix", "reyna", "neon", "yoru", "iso"],
  INITIATOR: ["sova", "breach", "skye", "kayo", "fade", "gekko"],
  CONTROLLER: ["omen", "brimstone", "viper", "astra", "harbor", "clove"],
  SENTINEL: ["killjoy", "cypher", "sage", "chamber", "deadlock"],
};
