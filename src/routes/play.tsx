import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GAME_MODES } from "@/data/tournaments";
import { useDraft } from "@/lib/store/draft";
import { motion } from "framer-motion";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Select Mode — Valorant Champions Draft" },
      { name: "description", content: "Pick your draft pool: Champions, Masters, or Mixed Era." },
    ],
  }),
  component: PlayPage,
});

function PlayPage() {
  const navigate = useNavigate();
  const startDraft = useDraft((s) => s.startDraft);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">// Step 1</div>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl">Select your game mode</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {GAME_MODES.map((mode, i) => (
          <motion.button
            key={mode.id}
            onClick={() => {
              startDraft(mode.id);
              navigate({ to: "/draft" });
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="clip-corner group relative overflow-hidden border border-border bg-surface/70 p-6 text-left backdrop-blur transition hover:border-primary"
          >
            <div className="absolute -right-10 top-2 font-display text-[120px] leading-none text-primary/5">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Mode · {String(i + 1).padStart(2, "0")}
            </div>
            <div className="mt-2 font-display text-3xl">{mode.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">{mode.subtitle}</div>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/80 transition group-hover:text-primary">
              Start <span>→</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-1">
              {mode.tournamentIds.slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="rounded bg-background/70 px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground"
                >
                  {t.replace(/-/g, " ")}
                </span>
              ))}
              {mode.tournamentIds.length > 6 && (
                <span className="text-[10px] text-muted-foreground/70">
                  +{mode.tournamentIds.length - 6} more
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
