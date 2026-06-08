import { useState, useEffect } from "react";

export type SupportedLanguage = "EN" | "ES" | "PT";

export const TRANSLATIONS = {
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
  compositionMode: {
    EN: "Composition Mode",
    ES: "Modo de Composición",
    PT: "Modo de Composição",
  },
  strict: {
    EN: "STRICT",
    ES: "ESTRICTO",
    PT: "ESTRITO",
  },
  preset: {
    EN: "PRESET",
    ES: "PREESTABLECIDO",
    PT: "PREDEFINIDO",
  },
  custom: {
    EN: "CUSTOM",
    ES: "PERSONALIZADO",
    PT: "PERSONALIZADO",
  },
  database: {
    EN: "Database",
    ES: "Base de Datos",
    PT: "Banco de Dados",
  },
  play: {
    EN: "Play",
    ES: "Jugar",
    PT: "Jogar",
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
