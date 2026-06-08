import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useDynasty } from "@/lib/store/dynasty";

export const Route = createFileRoute("/trophies")({
  head: () => ({
    meta: [
      { title: "Trophy Room — Valorant Champions Draft" },
      { name: "description", content: "Every trophy you've won across dynasties." },
    ],
  }),
  component: TrophiesPage,
});

const TROPHY_META: Record<string, { color: string; label: string }> = {
  "Tournament Champion": { color: "text-gold", label: "🏆 Tournament Champion" },
  "Match Won": { color: "text-primary", label: "⚡ Match Won" },
  "Perfect Chemistry": { color: "text-accent", label: "✨ Perfect Chemistry" },
  "EMEA Master": { color: "text-foreground", label: "EMEA Master" },
  "Americas Master": { color: "text-foreground", label: "Americas Master" },
  "Pacific Master": { color: "text-foreground", label: "Pacific Master" },
  "China Master": { color: "text-foreground", label: "China Master" },
  "GOAT Draft": { color: "text-gold", label: "GOAT Draft" },
};

function TrophiesPage() {
  const saves = useDynasty((s) => s.saves);
  const all: Array<{ key: string; trophy: string; saveName: string }> = [];
  for (const s of saves) {
    for (const t of s.trophies) all.push({ key: `${s.id}-${t}`, trophy: t, saveName: s.name });
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
        // Trophy Room
      </div>
      <h1 className="mt-1 font-display text-4xl sm:text-5xl">Hall of Champions</h1>

      {all.length === 0 ? (
        <div className="mt-10 clip-corner border border-border bg-surface/60 p-10 text-center text-muted-foreground">
          No trophies yet. Win matches to fill the hall.
        </div>
      ) : (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {all.map((t, i) => {
            const meta = TROPHY_META[t.trophy] ?? { color: "text-foreground", label: t.trophy };
            return (
              <motion.div
                key={t.key}
                initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ rotateY: 10, scale: 1.03 }}
                className="clip-corner relative overflow-hidden border border-gold/40 bg-gradient-to-br from-gold/10 to-background p-5"
              >
                <div className="shimmer absolute inset-0 opacity-30" />
                <div className={`font-display text-xl ${meta.color}`}>{meta.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">{t.saveName}</div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
