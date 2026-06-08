import { REAL_ROSTERS } from "./src/data/realRosters";

// Known real roles for major players to enforce accuracy
const REAL_ROLES: Record<string, string> = {
  // User examples
  "FNS": "SENTINEL",
  "stax": "FLEX",
  "Chronicle": "FLEX",
  "Leo": "INITIATOR",
  "Alfajer": "SENTINEL",
  "Less": "SENTINEL",
  "nAts": "SENTINEL",
  "Sacy": "INITIATOR",
  "Ethan": "INITIATOR",
  "crashies": "INITIATOR",
  "Victor": "FLEX",
  "Jawgemo": "FLEX",
  "C0M": "SENTINEL",
  "MaKo": "SENTINEL",
  "Boostio": "CONTROLLER",
  "johnqt": "INITIATOR",
  "benjyfishy": "SENTINEL",
  "CHICHOO": "INITIATOR", // CHICHOO is Initiator/Flex
  "Smoggy": "CONTROLLER",

  // Duelists
  "cNed": "DUELIST",
  "yay": "DUELIST",
  "Derke": "DUELIST",
  "aspas": "DUELIST",
  "something": "DUELIST",
  "texture": "DUELIST",
  "tuyz": "CONTROLLER",
  "Tuyz": "CONTROLLER",
  "Sayaplayer": "DUELIST",
  "Cryocells": "DUELIST",
  "Demon1": "DUELIST",
  "jinggg": "DUELIST",
  "Jinggg": "DUELIST",
  "ZmjjKK": "DUELIST",
  "KangKang": "DUELIST",
  "BuZz": "DUELIST",
  "heat": "DUELIST",
  "keznit": "DUELIST",
  "ScreaM": "DUELIST",
  "qck": "DUELIST",
  "Asuna": "DUELIST",
  "leaf": "DUELIST",
  "Dep": "DUELIST",
  "zekken": "DUELIST",
  "jawgemo": "FLEX",
  "f0rsakeN": "FLEX",
  "d3ffo": "DUELIST",
  "mwzera": "DUELIST",
  "TenZ": "DUELIST", // TenZ is Duelist in 2021/2022
  "whz": "DUELIST",
  "KK": "DUELIST",
  "Yosemite": "INITIATOR",

  // Initiators
  "SicK": "INITIATOR",
  "Shao": "INITIATOR",
  "Lakia": "INITIATOR",
  "Zest": "INITIATOR",
  "d4v41": "INITIATOR",
  "Jamppi": "INITIATOR",
  "eeiu": "INITIATOR",
  "Trent": "INITIATOR",
  "trent": "INITIATOR",
  "Cloud": "INITIATOR",
  "Cyn1c": "INITIATOR",
  "Rb": "FLEX",
  "rb": "FLEX",
  "JessieVash": "INITIATOR",
  "BONECOLD": "CONTROLLER",

  // Controllers
  "zombs": "CONTROLLER",
  "Marved": "CONTROLLER",
  "Boaster": "CONTROLLER",
  "mindfreak": "CONTROLLER",
  "Melser": "CONTROLLER",
  "Mazino": "CONTROLLER",
  "Karon": "CONTROLLER",
  "SugarZ3ro": "CONTROLLER",
  "valyn": "CONTROLLER",
  "Redgar": "CONTROLLER",
  "ANGE1": "CONTROLLER",
  "s0m": "CONTROLLER",
  "pancada": "CONTROLLER",
  "pANcada": "CONTROLLER",
  "L1NK": "CONTROLLER",
  "sScary": "CONTROLLER",
  "BORKUM": "CONTROLLER",

  // Sentinels
  "dapr": "SENTINEL",
  "SUYGETSU": "SENTINEL",
  "suygetsu": "SENTINEL",
  "Suygetsu": "SENTINEL",
  "tex": "SENTINEL",
  "Klaus": "SENTINEL",
  "Net": "SENTINEL",
  "net": "SENTINEL",
  "Laz": "SENTINEL",
  "Meteor": "SENTINEL",

  // Flex
  "Sheydos": "FLEX",
  "soulcas": "FLEX",
  "Rossy": "FLEX",
  "Nivera": "FLEX",
  "Starxo": "FLEX",
  "starxo": "FLEX",
};

const ROLES = ["DUELIST", "INITIATOR", "CONTROLLER", "SENTINEL", "FLEX"] as const;
type Role = typeof ROLES[number];

function getPermutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr];
  const perms: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const subPerms = getPermutations(rest);
    for (const sub of subPerms) {
      perms.push([arr[i], ...sub]);
    }
  }
  return perms;
}

const allRolePerms = getPermutations([...ROLES]);

console.log("Analyzing rosters...");
const changes: string[] = [];

for (const [tournamentId, teams] of Object.entries(REAL_ROSTERS)) {
  for (const [teamId, roster] of Object.entries(teams)) {
    const players = roster.players;
    
    // Find optimal role assignment
    let bestPerm: Role[] | null = null;
    let bestScore = -Infinity;
    
    for (const perm of allRolePerms) {
      let score = 0;
      for (let i = 0; i < 5; i++) {
        const p = players[i];
        const assignedRole = perm[i];
        
        // Check hard override
        const overrideRole = REAL_ROLES[p.name];
        if (overrideRole) {
          if (assignedRole === overrideRole) {
            score += 1000;
          } else {
            score -= 1000; // heavy penalty for violating hard override
          }
        } else {
          // Fallback to original role
          if (assignedRole === p.role) {
            score += 100;
          } else if (assignedRole === "FLEX") {
            score += 20; // flex fallback is okay
          }
        }
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestPerm = perm;
      }
    }
    
    if (bestPerm) {
      for (let i = 0; i < 5; i++) {
        const p = players[i];
        const assigned = bestPerm[i];
        if (p.role !== assigned) {
          changes.push(`${tournamentId} | ${teamId} | ${p.name}: ${p.role} -> ${assigned}`);
        }
      }
    }
  }
}

console.log(`Total role changes: ${changes.length}`);
console.log("Sample changes (first 30):");
for (const change of changes.slice(0, 30)) {
  console.log(change);
}

