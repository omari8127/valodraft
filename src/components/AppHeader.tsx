import { Link } from "@tanstack/react-router";
import { useLanguage, type SupportedLanguage } from "@/lib/i18n";
import { Settings as SettingsIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function AppHeader() {
  const { lang, t, changeLanguage } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const NAV = [
    { to: "/play", label: t("play") },
    { to: "/collection", label: t("collection") },
    { to: "/leaderboards", label: t("leaderboards") },
  ] as const;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg tracking-widest">
          <span className="inline-block h-5 w-1.5 bg-primary" />
          <span>
            VALORANT <span className="text-primary">CHAMPIONS</span> DRAFT
          </span>
        </Link>
        
        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:bg-surface hover:text-foreground"
              activeProps={{ className: "text-foreground bg-surface" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 ml-auto md:ml-0">
          {/* Language Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="clip-corner flex items-center justify-center border border-border bg-surface/50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-surface-2 transition cursor-pointer"
            >
              🌐 {lang}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-24 origin-top-right border border-border bg-surface p-1 shadow-lg clip-corner backdrop-blur-lg">
                {(["EN", "ES", "PT"] as SupportedLanguage[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      changeLanguage(l);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded hover:bg-primary/20 hover:text-primary transition cursor-pointer ${
                      lang === l ? "text-primary bg-primary/10" : "text-muted-foreground"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings Icon */}
          <Link
            to="/settings"
            className="group relative flex h-8 w-8 items-center justify-center rounded border border-border bg-surface/50 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition"
            title={t("settings")}
          >
            <SettingsIcon className="h-4 w-4 transition group-hover:rotate-45" />
            
            {/* Tooltip */}
            <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 scale-0 rounded bg-background border border-border px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground transition-all group-hover:scale-100 shadow-md whitespace-nowrap z-50">
              {t("settings")}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
