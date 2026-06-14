export interface GameMap {
  id: string;
  name: string;
  image: string;
  baseStats: {
    attackBias: number;
    defenseBias: number;
    volatility: number;
    pace: number;
  };
}

export const MAPS: GameMap[] = [
  { id: "abyss", name: "Abyss", image: "/mapas/abyss.png", baseStats: { attackBias: 0.1, defenseBias: 0.1, volatility: 0.3, pace: 0.8 } },
  { id: "ascent", name: "Ascent", image: "/mapas/ascent.png", baseStats: { attackBias: 0, defenseBias: 0.2, volatility: 0.1, pace: 0.5 } },
  { id: "bind", name: "Bind", image: "/mapas/bind.png", baseStats: { attackBias: 0.1, defenseBias: 0.1, volatility: 0.2, pace: 0.6 } },
  { id: "breeze", name: "Breeze", image: "/mapas/breeze.png", baseStats: { attackBias: 0.2, defenseBias: 0, volatility: 0.4, pace: 0.4 } },
  { id: "corrode", name: "Corrode", image: "/mapas/corrode.png", baseStats: { attackBias: 0.1, defenseBias: 0.1, volatility: 0.3, pace: 0.6 } },
  { id: "fracture", name: "Fracture", image: "/mapas/fracture.png", baseStats: { attackBias: 0.2, defenseBias: 0, volatility: 0.3, pace: 0.7 } },
  { id: "haven", name: "Haven", image: "/mapas/haven.png", baseStats: { attackBias: 0.1, defenseBias: 0, volatility: 0.2, pace: 0.5 } },
  { id: "icebox", name: "Icebox", image: "/mapas/icebox.png", baseStats: { attackBias: 0.1, defenseBias: 0.1, volatility: 0.4, pace: 0.6 } },
  { id: "lotus", name: "Lotus", image: "/mapas/lotus.png", baseStats: { attackBias: 0.2, defenseBias: 0, volatility: 0.2, pace: 0.6 } },
  { id: "pearl", name: "Pearl", image: "/mapas/pearl.png", baseStats: { attackBias: 0, defenseBias: 0.1, volatility: 0.3, pace: 0.5 } },
  { id: "split", name: "Split", image: "/mapas/split.png", baseStats: { attackBias: 0, defenseBias: 0.2, volatility: 0.2, pace: 0.4 } },
  { id: "sunset", name: "Sunset", image: "/mapas/sunset.png", baseStats: { attackBias: 0.1, defenseBias: 0.1, volatility: 0.2, pace: 0.6 } },
];

export function getRandomMapPool(count: number = 7): GameMap[] {
  const shuffled = [...MAPS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
