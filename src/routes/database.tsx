import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PLAYER_ENTRIES } from "@/data/generate";
import { TOURNAMENTS, TOURNAMENT_BY_ID } from "@/data/tournaments";
import { ORG_BY_ID, REGIONS } from "@/data/regions";
import { PlayerCard } from "@/components/PlayerCard";
import type { PlayerRole, Region } from "@/types/game";

export const Route = createFileRoute("/database")({
  head: () => ({
    meta: [
      { title: "Player Database — Valorant Champions Draft" },
      { name: "description", content: "Every player from every Champions and Masters event." },
    ],
  }),
  component: DatabasePage,
});

const ROLES: PlayerRole[] = ["DUELIST", "INITIATOR", "CONTROLLER", "SENTINEL", "FLEX"];

function DatabasePage() {
  const [region, setRegion] = useState<Region | "ALL">("ALL");
  const [role, setRole] = useState<PlayerRole | "ALL">("ALL");
  const [tournamentId, setTournamentId] = useState<string | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return PLAYER_ENTRIES.filter((p) => {
      if (region !== "ALL" && p.region !== region) return false;
      if (role !== "ALL" && p.role !== role) return false;
      if (tournamentId !== "ALL" && p.tournamentId !== tournamentId) return false;
      if (search) {
        const q = search.toLowerCase();
        const org = ORG_BY_ID[p.orgId];
        return (
          p.name.toLowerCase().includes(q) ||
          org?.name.toLowerCase().includes(q) ||
          org?.shortName.toLowerCase().includes(q)
        );
      }
      return true;
    })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 120);
  }, [region, role, tournamentId, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
        // Database
      </div>
      <h1 className="mt-1 font-display text-4xl sm:text-5xl">Player & team database</h1>

      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Select label="Region" value={region} onChange={(v) => setRegion(v as Region | "ALL")}>
          <option value="ALL">All regions</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
        <Select label="Role" value={role} onChange={(v) => setRole(v as PlayerRole | "ALL")}>
          <option value="ALL">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
        <Select label="Tournament" value={tournamentId} onChange={setTournamentId}>
          <option value="ALL">All tournaments</option>
          {TOURNAMENTS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </Select>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Player, team, org…"
            className="clip-corner border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        Showing {filtered.length} player{filtered.length === 1 ? "" : "s"}{" "}
        {tournamentId !== "ALL" && `from ${TOURNAMENT_BY_ID[tournamentId]?.name}`}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => (
          <PlayerCard key={p.id} entity={p} />
        ))}
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="clip-corner border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
      >
        {children}
      </select>
    </label>
  );
}
