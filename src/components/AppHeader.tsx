import { Link } from "@tanstack/react-router";

const NAV = [
  { to: "/play", label: "Play" },
  { to: "/database", label: "Database" },
  { to: "/collection", label: "Collection" },
  { to: "/leaderboards", label: "Leaderboards" },
  { to: "/settings", label: "Settings" },
] as const;

export function AppHeader() {
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
      </div>
    </header>
  );
}
