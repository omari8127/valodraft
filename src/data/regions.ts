import type { Organization, Region } from "@/types/game";

export const REGIONS: Region[] = ["AMERICAS", "EMEA", "PACIFIC", "CHINA"];

export const ORGANIZATIONS: Organization[] = [
  // AMERICAS
  { id: "loud", name: "LOUD", shortName: "LOUD", region: "AMERICAS" },
  { id: "sentinels", name: "Sentinels", shortName: "SEN", region: "AMERICAS" },
  { id: "nrg", name: "NRG Esports", shortName: "NRG", region: "AMERICAS" },
  { id: "leviatan", name: "Leviatán", shortName: "LEV", region: "AMERICAS" },
  { id: "kru", name: "KRÜ Esports", shortName: "KRÜ", region: "AMERICAS" },
  { id: "mibr", name: "MIBR", shortName: "MIBR", region: "AMERICAS" },
  { id: "g2", name: "G2 Esports", shortName: "G2", region: "AMERICAS" },
  { id: "eg", name: "Evil Geniuses", shortName: "EG", region: "AMERICAS" },
  { id: "c9", name: "Cloud9", shortName: "C9", region: "AMERICAS" },
  { id: "100t", name: "100 Thieves", shortName: "100T", region: "AMERICAS" },
  { id: "optic", name: "OpTic Gaming", shortName: "OPTC", region: "AMERICAS" },
  { id: "furia", name: "FURIA", shortName: "FUR", region: "AMERICAS" },
  { id: "envy", name: "Envy", shortName: "NV", region: "AMERICAS" },
  { id: "keyd", name: "Keyd Stars", shortName: "VK", region: "AMERICAS" },
  { id: "vikings", name: "Team Vikings", shortName: "VKS", region: "AMERICAS" },
  { id: "xset", name: "XSET", shortName: "XSET", region: "AMERICAS" },
  { id: "version1", name: "Version1", shortName: "V1", region: "AMERICAS" },
  { id: "sharks", name: "Sharks Esports", shortName: "SHK", region: "AMERICAS" },
  { id: "liberty", name: "Havan Liberty", shortName: "HL", region: "AMERICAS" },
  { id: "nip", name: "Ninjas in Pyjamas", shortName: "NIP", region: "AMERICAS" },
  { id: "guard", name: "The Guard", shortName: "TGD", region: "AMERICAS" },

  // EMEA
  { id: "fnatic", name: "Fnatic", shortName: "FNC", region: "EMEA" },
  { id: "tl", name: "Team Liquid", shortName: "TL", region: "EMEA" },
  { id: "acend", name: "Acend", shortName: "ACE", region: "EMEA" },
  { id: "fpx", name: "FunPlus Phoenix", shortName: "FPX", region: "EMEA" },
  { id: "navi", name: "NAVI", shortName: "NAVI", region: "EMEA" },
  { id: "fut", name: "FUT Esports", shortName: "FUT", region: "EMEA" },
  { id: "giantx", name: "GIANTX", shortName: "GX", region: "EMEA" },
  { id: "vitality", name: "Team Vitality", shortName: "VIT", region: "EMEA" },
  { id: "heretics", name: "Team Heretics", shortName: "TH", region: "EMEA" },
  { id: "karmine", name: "Karmine Corp", shortName: "KC", region: "EMEA" },
  { id: "gambit", name: "Gambit Esports", shortName: "GMB", region: "EMEA" },
  { id: "smb", name: "SuperMassive Blaze", shortName: "SMB", region: "EMEA" },
  { id: "guild", name: "Guild Esports", shortName: "GLD", region: "EMEA" },
  { id: "wolves", name: "Wolves Esports", shortName: "WLV", region: "EMEA" },

  // PACIFIC
  { id: "prx", name: "Paper Rex", shortName: "PRX", region: "PACIFIC" },
  { id: "drx", name: "DRX", shortName: "DRX", region: "PACIFIC" },
  { id: "geng", name: "Gen.G Esports", shortName: "GENG", region: "PACIFIC" },
  { id: "talon", name: "Talon Esports", shortName: "TLN", region: "PACIFIC" },
  { id: "rrq", name: "Rex Regum Qeon", shortName: "RRQ", region: "PACIFIC" },
  { id: "t1", name: "T1", shortName: "T1", region: "PACIFIC" },
  { id: "zeta", name: "ZETA DIVISION", shortName: "ZETA", region: "PACIFIC" },
  { id: "crazy", name: "Crazy Raccoon", shortName: "CR", region: "PACIFIC" },
  { id: "vs", name: "Vision Strikers", shortName: "VS", region: "PACIFIC" },
  { id: "x10", name: "X10 Esports", shortName: "X10", region: "PACIFIC" },
  { id: "secret", name: "Team Secret", shortName: "TS", region: "PACIFIC" },
  { id: "fullsense", name: "Full Sense", shortName: "FS", region: "PACIFIC" },
  { id: "nuturn", name: "NUTURN Gaming", shortName: "NU", region: "PACIFIC" },
  { id: "f4q", name: "F4Q", shortName: "F4Q", region: "PACIFIC" },
  { id: "xerxia", name: "XERXIA", shortName: "XIA", region: "PACIFIC" },
  { id: "northeption", name: "NORTHEPTION", shortName: "NTH", region: "PACIFIC" },

  // CHINA
  { id: "edg", name: "EDward Gaming", shortName: "EDG", region: "CHINA" },
  { id: "blg", name: "Bilibili Gaming", shortName: "BLG", region: "CHINA" },
  { id: "trace", name: "Trace Esports", shortName: "TE", region: "CHINA" },
  { id: "xlg", name: "Xi Lai Gaming", shortName: "XLG", region: "CHINA" },
  { id: "drg", name: "Dragon Ranger", shortName: "DRG", region: "CHINA" },
  { id: "nova", name: "Nova Esports", shortName: "NOVA", region: "CHINA" },
  { id: "ase", name: "Attack Soul Esports", shortName: "ASE", region: "CHINA" },
];

export const ORG_BY_ID: Record<string, Organization> = Object.fromEntries(
  ORGANIZATIONS.map((o) => [o.id, o]),
);
