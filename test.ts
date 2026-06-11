import { PLAYER_ENTRIES } from "./src/data/generate.js";
console.log(PLAYER_ENTRIES.filter(p => p.name === 'qck').map(p => p.id));
