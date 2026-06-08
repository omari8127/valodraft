import { createFileRoute, Link } from "@tanstack/react-router";
import { useDynasty } from "@/lib/store/dynasty";
import { PLAYER_BY_ID } from "@/data/generate";
import { GAME_MODE_BY_ID } from "@/data/tournaments";
import { motion } from "framer-motion";

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "Collection — Valorant Champions Draft" },
      { name: "description", content: "Every dynasty you've drafted, with stats and records." },
    ],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  const saves = useDynasty((s) => s.saves);
  const remove = useDynasty((s) => s.removeSave);

  const totalDrafts = saves.length;
  const totalMatches = saves.reduce((s, x) => s + x.wins + x.losses, 0);
  const totalWins = saves.reduce((s, x) => s + x.wins, 0);
  const bestOVR = Math.max(0, ...saves.map((s) => s.teamOVR));
  const bestChem = Math.max(0, ...saves.map((s) => s.chemistry));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
        // Collection
      </div>
      <h1 className="mt-1 font-display text-4xl sm:text-5xl">My dynasties</h1>

      <div className="mt-6 grid grid-cols-2 gap-2 border-y border-border py-5 sm:grid-cols-5">
        <Stat n={totalDrafts} l="Total Drafts" />
        <Stat n={totalMatches} l="Matches Played" />
        <Stat n={totalWins} l="Wins" />
        <Stat n={bestOVR || "—"} l="Best Team OVR" />
        <Stat n={bestChem || "—"} l="Best Chemistry" />
      </div>

      {saves.length === 0 ? (
        <div className="mt-10 clip-corner border border-border bg-surface/60 p-10 text-center">
          <div className="text-muted-foreground">No dynasties yet.</div>
          <Link
            to="/play"
            className="clip-corner mt-4 inline-block bg-primary px-5 py-2.5 font-display text-sm tracking-widest text-primary-foreground"
          >
            Draft your first roster
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {saves.map((s, i) => {
            const mode = GAME_MODE_BY_ID[s.modeId];
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="clip-corner border border-border bg-surface/70 p-5 backdrop-blur"
              >
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="font-display text-xl">{s.name}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {mode?.name ?? s.modeId}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-3xl text-primary">{s.teamOVR}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gold">
                      Chem +{s.chemistry}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {s.rosterPlayerIds.map((id) => {
                    const p = PLAYER_BY_ID[id];
                    if (!p) return null;
                    return (
                      <span
                        key={id}
                        className="rounded bg-background/70 px-1.5 py-0.5 text-[10px] uppercase"
                      >
                        {p.name} <span className="text-muted-foreground">{p.rating}</span>
                      </span>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    <span className="text-primary">{s.wins}W</span> · {s.losses}L ·{" "}
                    {s.trophies.length}🏆
                  </span>
                  <button
                    onClick={() => remove(s.id)}
                    className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ n, l }: { n: number | string; l: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-3xl text-primary">{n}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {l}
      </div>
    </div>
  );
}
