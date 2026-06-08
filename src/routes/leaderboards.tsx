import { createFileRoute } from "@tanstack/react-router";
import { useDynasty } from "@/lib/store/dynasty";
import { GAME_MODE_BY_ID } from "@/data/tournaments";

export const Route = createFileRoute("/leaderboards")({
  head: () => ({
    meta: [
      { title: "Leaderboards — Valorant Champions Draft" },
      { name: "description", content: "Your dynasties ranked by OVR, chemistry, and wins." },
    ],
  }),
  component: LeaderboardsPage,
});

function LeaderboardsPage() {
  const saves = useDynasty((s) => s.saves);
  const byOVR = [...saves].sort((a, b) => b.teamOVR - a.teamOVR).slice(0, 25);
  const byWins = [...saves].sort((a, b) => b.wins - a.wins).slice(0, 25);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
        // Leaderboards
      </div>
      <h1 className="mt-1 font-display text-4xl sm:text-5xl">Top dynasties</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Board title="By Team OVR" rows={byOVR} field="teamOVR" suffix="" />
        <Board title="By Wins" rows={byWins} field="wins" suffix="W" />
      </div>
    </div>
  );
}

function Board({
  title,
  rows,
  field,
  suffix,
}: {
  title: string;
  rows: ReturnType<typeof useDynasty.getState>["saves"];
  field: "teamOVR" | "wins";
  suffix: string;
}) {
  return (
    <div className="clip-corner border border-border bg-surface/70 p-4 backdrop-blur">
      <div className="text-[10px] font-bold uppercase tracking-widest text-gold">{title}</div>
      {rows.length === 0 ? (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          No data yet. Draft a roster.
        </div>
      ) : (
        <ol className="mt-3 divide-y divide-border/40">
          {rows.map((r, i) => (
            <li key={r.id} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-3">
                <span
                  className={`font-display text-2xl ${
                    i === 0 ? "text-gold" : i < 3 ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {GAME_MODE_BY_ID[r.modeId]?.name ?? r.modeId}
                  </div>
                </div>
              </div>
              <div className="font-display text-2xl text-primary">
                {r[field]}
                {suffix}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
