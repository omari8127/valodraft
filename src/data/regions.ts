import type { Organization, Region } from "@/types/game";

export const REGIONS: Region[] = ["AMERICAS", "EMEA", "PACIFIC", "CHINA"];

export const ORGANIZATIONS: Organization[] = [
  // User Custom Org
  { id: "dreamteam", name: "Dream TEAM", shortName: "DRM", region: "AMERICAS", logo: "/orgs/dreamteam.png" },

  // AMERICAS
  { id: "loud", name: "LOUD", shortName: "LOUD", region: "AMERICAS", logo: "/orgs/loud.png" },
  { id: "sentinels", name: "Sentinels", shortName: "SEN", region: "AMERICAS", logo: "/orgs/sentinels.png" },
  { id: "nrg", name: "NRG Esports", shortName: "NRG", region: "AMERICAS", logo: "/orgs/nrg.png" },
  { id: "leviatan", name: "Leviatán", shortName: "LEV", region: "AMERICAS", logo: "/orgs/leviathan.png" },
  { id: "kru", name: "KRÜ Esports", shortName: "KRÜ", region: "AMERICAS", logo: "/orgs/kru.png" },
  { id: "mibr", name: "MIBR", shortName: "MIBR", region: "AMERICAS", logo: "/orgs/mibr.png" },
  { id: "g2", name: "G2 Esports", shortName: "G2", region: "AMERICAS", logo: "/orgs/g2.png" },
  { id: "eg", name: "Evil Geniuses", shortName: "EG", region: "AMERICAS", logo: "/orgs/eg.png" },
  { id: "c9", name: "Cloud9", shortName: "C9", region: "AMERICAS", logo: "/orgs/cloud9.png" },
  { id: "100t", name: "100 Thieves", shortName: "100T", region: "AMERICAS", logo: "/orgs/100t.png" },
  { id: "optic", name: "OpTic Gaming", shortName: "OPTC", region: "AMERICAS", logo: "/orgs/optic.png" },
  { id: "furia", name: "FURIA", shortName: "FUR", region: "AMERICAS", logo: "/orgs/furia.png" },
  { id: "envy", name: "Envy", shortName: "NV", region: "AMERICAS", logo: "/orgs/envy.png" },
  { id: "keyd", name: "Keyd Stars", shortName: "VK", region: "AMERICAS", logo: "/orgs/keydstarts.png" },
  { id: "vikings", name: "Team Vikings", shortName: "VKS", region: "AMERICAS", logo: "/orgs/teamvikings.png" },
  { id: "xset", name: "XSET", shortName: "XSET", region: "AMERICAS", logo: "/orgs/xset.png" },
  { id: "version1", name: "Version1", shortName: "V1", region: "AMERICAS", logo: "" },
  { id: "sharks", name: "Sharks Esports", shortName: "SHK", region: "AMERICAS", logo: "" },
  { id: "liberty", name: "Havan Liberty", shortName: "HL", region: "AMERICAS", logo: "" },
  { id: "nip", name: "Ninjas in Pyjamas", shortName: "NIP", region: "AMERICAS", logo: "/orgs/ninjasinpyjama.png" },
  { id: "guard", name: "The Guard", shortName: "TGD", region: "AMERICAS", logo: "" },

  // EMEA
  { id: "fnatic", name: "Fnatic", shortName: "FNC", region: "EMEA", logo: "/orgs/fnatic.png" },
  { id: "tl", name: "Team Liquid", shortName: "TL", region: "EMEA", logo: "/orgs/teamliquid.png" },
  { id: "acend", name: "Acend", shortName: "ACE", region: "EMEA", logo: "/orgs/acend.png" },
  { id: "fpx", name: "FunPlus Phoenix", shortName: "FPX", region: "EMEA", logo: "/orgs/fpx.png" },
  { id: "navi", name: "NAVI", shortName: "NAVI", region: "EMEA", logo: "/orgs/NAVI.png" },
  { id: "fut", name: "FUT Esports", shortName: "FUT", region: "EMEA", logo: "/orgs/fut.png" },
  { id: "giantx", name: "GIANTX", shortName: "GX", region: "EMEA", logo: "/orgs/giantx.png" },
  { id: "vitality", name: "Team Vitality", shortName: "VIT", region: "EMEA", logo: "/orgs/teamvitality.png" },
  { id: "heretics", name: "Team Heretics", shortName: "TH", region: "EMEA", logo: "/orgs/teamheretics.png" },
  { id: "karmine", name: "Karmine Corp", shortName: "KC", region: "EMEA", logo: "" },
  { id: "gambit", name: "Gambit Esports", shortName: "GMB", region: "EMEA", logo: "/orgs/gambit.png" },
  { id: "smb", name: "SuperMassive Blaze", shortName: "SMB", region: "EMEA", logo: "" },
  { id: "guild", name: "Guild Esports", shortName: "GLD", region: "EMEA", logo: "" },
  { id: "wolves", name: "Wolves Esports", shortName: "WLV", region: "EMEA", logo: "" },

  // PACIFIC
  { id: "prx", name: "Paper Rex", shortName: "PRX", region: "PACIFIC", logo: "/orgs/paperrex.png" },
  { id: "drx", name: "DRX", shortName: "DRX", region: "PACIFIC", logo: "/orgs/drx.png" },
  { id: "geng", name: "Gen.G Esports", shortName: "GENG", region: "PACIFIC", logo: "/orgs/geng.png" },
  { id: "talon", name: "Talon Esports", shortName: "TLN", region: "PACIFIC", logo: "/orgs/talon.png" },
  { id: "rrq", name: "Rex Regum Qeon", shortName: "RRQ", region: "PACIFIC", logo: "/orgs/rrq.png" },
  { id: "t1", name: "T1", shortName: "T1", region: "PACIFIC", logo: "/orgs/T1.png" },
  { id: "zeta", name: "ZETA DIVISION", shortName: "ZETA", region: "PACIFIC", logo: "/orgs/zetadivision.png" },
  { id: "crazy", name: "Crazy Raccoon", shortName: "CR", region: "PACIFIC", logo: "/orgs/crazyracoons.png" },
  { id: "vs", name: "Vision Strikers", shortName: "VS", region: "PACIFIC", logo: "/orgs/visionstrikers.png" },
  { id: "x10", name: "X10 Esports", shortName: "X10", region: "PACIFIC", logo: "/orgs/x10.png" },
  { id: "secret", name: "Team Secret", shortName: "TS", region: "PACIFIC", logo: "/orgs/teamsecret.png" },
  { id: "fullsense", name: "Full Sense", shortName: "FS", region: "PACIFIC", logo: "/orgs/fullsense.png" },
  { id: "nuturn", name: "NUTURN Gaming", shortName: "NU", region: "PACIFIC", logo: "" },
  { id: "f4q", name: "F4Q", shortName: "F4Q", region: "PACIFIC", logo: "" },
  { id: "xerxia", name: "XERXIA", shortName: "XIA", region: "PACIFIC", logo: "/orgs/xerxia.png" },
  { id: "northeption", name: "NORTHEPTION", shortName: "NTH", region: "PACIFIC", logo: "" },

  // CHINA
  { id: "edg", name: "EDward Gaming", shortName: "EDG", region: "CHINA", logo: "/orgs/edg.png" },
  { id: "blg", name: "Bilibili Gaming", shortName: "BLG", region: "CHINA", logo: "/orgs/blg.png" },
  { id: "trace", name: "Trace Esports", shortName: "TE", region: "CHINA", logo: "/orgs/traceesports.png" },
  { id: "xlg", name: "Xi Lai Gaming", shortName: "XLG", region: "CHINA", logo: "/orgs/xlgesports.png" },
  { id: "drg", name: "Dragon Ranger", shortName: "DRG", region: "CHINA", logo: "/orgs/drg.png" },
  { id: "nova", name: "Nova Esports", shortName: "NOVA", region: "CHINA", logo: "" },
  { id: "ase", name: "Attack Soul Esports", shortName: "ASE", region: "CHINA", logo: "" },
];

export const ORG_BY_ID: Record<string, Organization> = Object.fromEntries(
  ORGANIZATIONS.map((o) => [o.id, o]),
);
