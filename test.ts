import { TEAM_ENTRIES } from "./src/data/generate.js";
import fs from "fs";
const mibr = TEAM_ENTRIES.find(t => t.id === "mibr_2025");
const vikings = TEAM_ENTRIES.find(t => t.id === "vikings_2021");
fs.writeFileSync("test.json", JSON.stringify({ mibr, vikings }, null, 2));
console.log("Done");
