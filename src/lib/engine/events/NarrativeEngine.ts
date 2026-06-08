import { TEMPLATES } from "./EventTemplates";

type Category = keyof typeof TEMPLATES;

export class NarrativeEngine {
  private usedTemplates: Record<Category, Set<string>>;

  constructor() {
    this.usedTemplates = {
      EARLY: new Set(),
      MID: new Set(),
      LATE: new Set(),
      CLUTCH: new Set(),
      FINISH: new Set(),
      ACE: new Set(),
      KILL: new Set(),
      MULTI_KILL: new Set(),
      SPIKE_PLANT: new Set(),
      SPIKE_DEFUSE: new Set(),
    };
  }

  public getLine(
    category: Category,
    variables: { player?: string; team?: string; agent?: string },
  ): string {
    const options = TEMPLATES[category];
    let available = options.filter((opt) => !this.usedTemplates[category].has(opt));

    // If we exhausted all options in this category, reset tracking to avoid crashing
    if (available.length === 0) {
      this.usedTemplates[category].clear();
      available = options;
    }

    // Pick a random line from the available pool
    const pick = available[Math.floor(Math.random() * available.length)];
    this.usedTemplates[category].add(pick);

    // Inject variables
    let result = pick;
    if (variables.player) result = result.replace(/{player}/g, variables.player);
    if (variables.team) result = result.replace(/{team}/g, variables.team);
    if (variables.agent) result = result.replace(/{agent}/g, variables.agent);

    return result;
  }
}
