import { useState, useEffect } from "react";

export type SupportedLanguage = "EN" | "ES" | "PT";

export const TRANSLATIONS = {
  // Navigation / Core Actions
  startDraft: {
    EN: "Start Draft",
    ES: "Iniciar Draft",
    PT: "Iniciar Draft",
  },
  collection: {
    EN: "Collection",
    ES: "Colección",
    PT: "Coleção",
  },
  leaderboards: {
    EN: "Leaderboards",
    ES: "Clasificación",
    PT: "Classificação",
  },
  settings: {
    EN: "Settings",
    ES: "Ajustes",
    PT: "Configurações",
  },
  playMatch: {
    EN: "PLAY MATCH",
    ES: "JUGAR PARTIDO",
    PT: "JOGAR PARTIDA",
  },
  nextGame: {
    EN: "NEXT GAME",
    ES: "SIGUIENTE JUEGO",
    PT: "PRÓXIMO JOGO",
  },
  newDraft: {
    EN: "NEW DRAFT",
    ES: "NUEVO DRAFT",
    PT: "NOVO DRAFT",
  },
  selectGameMode: {
    EN: "Select your game mode",
    ES: "Selecciona tu modo de juego",
    PT: "Selecione seu modo de jogo",
  },
  reset: {
    EN: "Reset",
    ES: "Restablecer",
    PT: "Restaurar",
  },
  play: {
    EN: "Play",
    ES: "Jugar",
    PT: "Jogar",
  },
  continueBtn: {
    EN: "CONTINUE",
    ES: "CONTINUAR",
    PT: "CONTINUAR",
  },
  closeBtn: {
    EN: "Close",
    ES: "Cerrar",
    PT: "Fechar",
  },
  closeLogs: {
    EN: "Close Logs",
    ES: "Cerrar Registros",
    PT: "Fechar Registros",
  },

  // Setup / Lobby Page
  classicMode: {
    EN: "Classic",
    ES: "Clásico",
    PT: "Clássico",
  },
  rankedMode: {
    EN: "Ranked",
    ES: "Clasificatorio",
    PT: "Ranqueado",
  },
  classicDesc: {
    EN: "Casual draft. MMR is unaffected. All tournament years are unlocked for you immediately.",
    ES: "Draft casual. El MMR no se ve afectado. Todos los años del torneo están desbloqueados de inmediato.",
    PT: "Draft casual. MMR não é afetado. Todos os anos do torneio são desbloqueados imediatamente.",
  },
  rankedDesc: {
    EN: "Competitive draft. Earn or lose MMR (+25/-20). Historical years are locked by your manager level.",
    ES: "Draft competitivo. Gana o pierde MMR (+25/-20). Los años históricos se desbloquean según tu nivel.",
    PT: "Draft competitivo. Ganhe ou perca MMR (+25/-20). Os anos históricos são bloqueados pelo seu nível.",
  },
  aiDifficulty: {
    EN: "AI Draft Difficulty",
    ES: "Dificultad de Draft de IA",
    PT: "Dificuldade de Draft da IA",
  },
  difficultyEasy: {
    EN: "Easy: AI draft picks are completely random and ignore role synergy.",
    ES: "Fácil: Las selecciones de la IA son completamente aleatorias e ignoran la sinergia.",
    PT: "Fácil: As escolhas da IA são completamente aleatórias e ignoram a sinergia.",
  },
  difficultyMedium: {
    EN: "Medium: AI uses balanced picks prioritizing base OVR and missing roles.",
    ES: "Medio: La IA usa selecciones equilibradas priorizando OVR base y roles faltantes.",
    PT: "Médio: A IA usa escolhas equilibradas priorizando o OVR base e os papéis ausentes.",
  },
  difficultyHard: {
    EN: "Hard: AI optimally drafts to maximize both chemistry, role weights, and total Team OVR.",
    ES: "Difícil: La IA selecciona de forma óptima para maximizar la química, pesos de rol y OVR del equipo.",
    PT: "Difícil: A IA escolhe de forma ideal para maximizar a química, pesos de papel e OVR da equipe.",
  },
  activePatchMeta: {
    EN: "Active Patch Meta",
    ES: "Meta de Parche Activo",
    PT: "Meta de Patch Ativo",
  },
  cycleMetaBtn: {
    EN: "Cycle Meta",
    ES: "Ciclar Meta",
    PT: "Ciclar Meta",
  },
  selectPlayerPool: {
    EN: "Select Player Pool",
    ES: "Seleccionar Grupo de Jugadores",
    PT: "Selecionar Grupo de Jogadores",
  },
  yearsUnlocked: {
    EN: "Years Unlocked",
    ES: "Años Desbloqueados",
    PT: "Anos Desbloqueados",
  },
  levelUnlockInfo: {
    EN: "Leveling up unlocks more eras! level 1: 2021 | level 2: 2022 | level 3: 2023 | level 4: 2024 | level 5: 2025.",
    ES: "¡Subir de nivel desbloquea más eras! nivel 1: 2021 | nivel 2: 2022 | nivel 3: 2023 | nivel 4: 2024 | nivel 5: 2025.",
    PT: "Subir de nível desbloqueia mais eras! nível 1: 2021 | nível 2: 2022 | nível 3: 2023 | nível 4: 2024 | nível 5: 2025.",
  },
  chooseDraftMode: {
    EN: "Choose Draft Rule Mode",
    ES: "Elegir Modo de Reglas de Draft",
    PT: "Escolher Modo de Regras de Draft",
  },
  strictModeTitle: {
    EN: "STRICT MODE",
    ES: "MODO ESTRICTO",
    PT: "MODO ESTRITO",
  },
  strictModeDesc: {
    EN: "Strict competitive rules. Duplicate roles are blocked except in the FLEX slot. FLEX is limited to missing roles or Initiators.",
    ES: "Reglas competitivas estrictas. Los roles duplicados están bloqueados excepto en el FLEX. FLEX está limitado a roles faltantes o Iniciadores.",
    PT: "Regras competitivas estritas. Funções duplicadas são bloqueadas, exceto no FLEX. FLEX é limitado a funções ausentes ou Iniciadores.",
  },
  flexibleModeTitle: {
    EN: "FLEXIBLE MODE",
    ES: "MODO FLEXIBLE",
    PT: "MODO FLEXÍVEL",
  },
  flexibleModeDesc: {
    EN: "Any player can be picked for any slot. No role block restrictions, but standard composition penalties apply in real-time.",
    ES: "Cualquier jugador puede ser elegido. Sin restricciones de rol, pero las penalizaciones normales se aplican en tiempo real.",
    PT: "Qualquer jogador pode ser escolhido. Sem restrições de função, mas penalidades padrão se aplicam em tempo real.",
  },
  chaosModeTitle: {
    EN: "CHAOS MODE",
    ES: "MODO CAOS",
    PT: "MODO CAOS",
  },
  chaosModeDesc: {
    EN: "No restrictions. Go wild with any composition. A flat OVR modifier penalty of 0.3 is applied for casual fun.",
    ES: "Sin restricciones. Ve con cualquier composición. Se aplica una penalización plana de 0.3 de OVR para diversión casual.",
    PT: "Sem restrições. Vá com qualquer composição. Uma penalidade plana de 0.3 de OVR é aplicada para diversão casual.",
  },

  // Draft Page
  draftChallenge: {
    EN: "Draft Challenge",
    ES: "Desafío de Draft",
    PT: "Desafio de Draft",
  },
  rerollsCounter: {
    EN: "Rerolls",
    ES: "Rerolls",
    PT: "Rerolls",
  },
  readyNextRoll: {
    EN: "Ready for the next roll",
    ES: "Listo para el próximo roll",
    PT: "Pronto para o próximo roll",
  },
  rollInfoText: {
    EN: "A random team from your active pool will be selected for",
    ES: "Un equipo aleatorio de tu grupo activo será seleccionado para",
    PT: "Uma equipe aleatória do seu grupo ativo será selecionada para",
  },
  rollBtn: {
    EN: "ROLL",
    ES: "ROLL",
    PT: "ROLL",
  },
  rerollBtn: {
    EN: "REROLL",
    ES: "REROLL",
    PT: "REROLL",
  },
  rosterLocked: {
    EN: "ROSTER LOCKED",
    ES: "ROSTER BLOQUEADO",
    PT: "ROSTER BLOQUEADO",
  },
  rosterReadyText: {
    EN: "Your team is ready. Test them against the field.",
    ES: "Tu equipo está listo. Pruébalos en el campo de batalla.",
    PT: "Sua equipe está pronta. Teste-os no campo de batalha.",
  },
  draftOrderLabel: {
    EN: "Draft order",
    ES: "Orden de draft",
    PT: "Ordem de draft",
  },
  chooseMemberText: {
    EN: "CHOOSE A MEMBER",
    ES: "ELIGE UN MIEMBRO",
    PT: "ESCOLHA UM MEMBRO",
  },
  draftLocksRosterText: {
    EN: "Choose any member — drafting locks the remaining roster members of",
    ES: "Elige cualquier miembro — seleccionarlo bloqueará el resto de miembros de",
    PT: "Escolha qualquer membro — selecioná-lo bloqueará o restante dos membros de",
  },
  compRatios: {
    EN: "Composition Ratios",
    ES: "Proporciones de Composición",
    PT: "Proporções de Composição",
  },
  compWarningTitle: {
    EN: "⚠️ Composition Warning",
    ES: "⚠️ Advertencia de Composición",
    PT: "⚠️ Aviso de Composição",
  },
  compWarningDesc: {
    EN: "Unbalanced composition will reduce performance (-TSS penalties will apply in match simulation).",
    ES: "La composición desequilibrada reducirá el rendimiento (se aplicarán penalizaciones de TSS en la simulación).",
    PT: "A composição desequilibrada reduzirá o desempenho (penalidades de TSS serão aplicadas na simulação).",
  },

  // Tooltips & Lock Reasons
  lockAlreadySelected: {
    EN: "Player already selected in your roster.",
    ES: "Jugador ya seleccionado en tu roster.",
    PT: "Jogador já selecionado no seu roster.",
  },
  lockStrictRole: {
    EN: "STRICT mode role lock: this slot requires a matching role player.",
    ES: "Bloqueo de rol STRICT: este slot requiere un jugador del rol correspondiente.",
    PT: "Bloqueio de função STRICT: esta vaga requer um jogador com a função correspondente.",
  },
  lockFlexStrict: {
    EN: "STRICT FLEX lock: requires Initiator (if missing) or Duelist (if 1 exists).",
    ES: "Bloqueo FLEX STRICT: requiere Iniciador (si falta) o Duelista (si ya existe 1).",
    PT: "Bloqueio FLEX STRICT: requer Iniciador (se ausente) o Duelista (se já existir 1).",
  },
  lockCoach: {
    EN: "Coaches can only be drafted in the final COACH slot.",
    ES: "Los entrenadores solo se pueden seleccionar en el espacio de COACH final.",
    PT: "Os treinadores só podem ser selecionados na vaga final de COACH.",
  },
  unavailable: {
    EN: "Unavailable.",
    ES: "No disponible.",
    PT: "Indisponível.",
  },

  // Match Page
  liveLabel: {
    EN: "🔴 LIVE",
    ES: "🔴 EN VIVO",
    PT: "🔴 AO VIVO",
  },
  broadcastLabel: {
    EN: "VCT Broadcast",
    ES: "Transmisión VCT",
    PT: "Transmissão VCT",
  },
  scoreboardFinalScore: {
    EN: "FINAL SCORE",
    ES: "PUNTUACIÓN FINAL",
    PT: "PLACAR FINAL",
  },
  matchupOverview: {
    EN: "Matchup Overview",
    ES: "Vista General del Enfrentamiento",
    PT: "Visão Geral do Confronto",
  },
  playByPlay: {
    EN: "Play-by-play Feed",
    ES: "Transmisión Jugada a Jugada",
    PT: "Transmissão Jogada a Jogada",
  },
  simulationSpeed: {
    EN: "Simulation Speed",
    ES: "Velocidad de Simulación",
    PT: "Velocidade de Simulação",
  },
  simulating: {
    EN: "SIMULATING...",
    ES: "SIMULANDO...",
    PT: "SIMULANDO...",
  },
  victory: {
    EN: "VICTORY",
    ES: "VICTORIA",
    PT: "VITÓRIA",
  },
  defeat: {
    EN: "DEFEAT",
    ES: "DERROTA",
    PT: "DERROTA",
  },
  rewardsTitle: {
    EN: "Match Rewards & XP Update",
    ES: "Recompensas de Partida y XP",
    PT: "Recompensas de Partida e XP",
  },
  viewReplayLogs: {
    EN: "View Round Replay Logs",
    ES: "Ver Registros de la Ronda",
    PT: "Ver Registros da Rodada",
  },
  replayLogsHeader: {
    EN: "Match Replay Logs",
    ES: "Registros de la Partida",
    PT: "Registros da Partida",
  },

  // Leaderboards Page
  standingsTitle: {
    EN: "Standings",
    ES: "Clasificación",
    PT: "Classificação",
  },
  globalLadderTitle: {
    EN: "Global Ranked Ladder (Season 1)",
    ES: "Clasificación Global (Temporada 1)",
    PT: "Classificação Global (Temporada 1)",
  },
  topDynastiesOVR: {
    EN: "Top Dynasties (By Team OVR)",
    ES: "Mejores Dinastías (Por OVR)",
    PT: "Melhores Dinastias (Por OVR)",
  },
  topDynastiesWins: {
    EN: "Top Dynasties (By Wins)",
    ES: "Mejores Dinastías (Por Victorias)",
    PT: "Melhores Dinastias (Por Vitórias)",
  },
  noDynastyData: {
    EN: "No dynasty data available. Draft a roster to compete and claim your spot!",
    ES: "Sin datos de dinastía. ¡Haz un draft para competir y reclamar tu puesto!",
    PT: "Sem dados de dinastia. Faça um draft para competir e reivindicar seu lugar!",
  },
  resetProgressionAlert: {
    EN: "Reset progression?",
    ES: "¿Restablecer progreso?",
    PT: "Restaurar progresso?",
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS;

export function useLanguage() {
  const [lang, setLang] = useState<SupportedLanguage>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("valodraft_lang") as SupportedLanguage) || "EN";
    }
    return "EN";
  });

  const changeLanguage = (newLang: SupportedLanguage) => {
    setLang(newLang);
    localStorage.setItem("valodraft_lang", newLang);
    window.dispatchEvent(new Event("valodraft_lang_change"));
  };

  useEffect(() => {
    const handleLangChange = () => {
      const current = (localStorage.getItem("valodraft_lang") as SupportedLanguage) || "EN";
      setLang(current);
    };
    window.addEventListener("valodraft_lang_change", handleLangChange);
    return () => {
      window.removeEventListener("valodraft_lang_change", handleLangChange);
    };
  }, []);

  const t = (key: TranslationKey): string => {
    const translation = TRANSLATIONS[key];
    if (translation) {
      return translation[lang] || translation["EN"];
    }
    return key;
  };

  return {
    lang,
    t,
    changeLanguage,
  };
}
