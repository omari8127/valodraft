import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFlagUrl(nationalityOrRegion: string | undefined): string {
  if (!nationalityOrRegion) return "https://flagcdn.com/w20/un.png";

  const val = nationalityOrRegion.toLowerCase().trim();
  
  if (val === "brazil") return "https://flagcdn.com/w20/br.png";
  if (val === "russia") return "https://flagcdn.com/w20/ru.png";
  if (val === "emea") return "https://flagcdn.com/w20/eu.png";

  const map: Record<string, string> = {
    usa: "us", "united states": "us",
    uk: "gb", "united kingdom": "gb",
    canada: "ca", chile: "cl", argentina: "ar",
    finland: "fi", spain: "es", poland: "pl",
    turkey: "tr", thailand: "th", belgium: "be",
    korea: "kr", "south korea": "kr", japan: "jp",
    china: "cn", indonesia: "id", philippines: "ph",
    singapore: "sg", malaysia: "my", sweden: "se",
    france: "fr", germany: "de", denmark: "dk",
    latvia: "lv", lithuania: "lt", croatia: "hr",
    "saudi arabia": "sa", australia: "au",
    colombia: "co", peru: "pe", mexico: "mx",
    "new zealand": "nz", vietnam: "vn",
    taiwan: "tw", "hong kong": "hk",
    americas: "us", pacific: "kr",
  };

  const code = map[val];
  if (code) return `https://flagcdn.com/w20/${code}.png`;

  if (val.length === 2) return `https://flagcdn.com/w20/${val}.png`;
  
  return `https://flagcdn.com/w20/${val.substring(0, 2)}.png`;
}
