import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Valorant Champions Draft — Build your legendary roster" },
      {
        name: "description",
        content:
          "Roll teams, draft superstars, and sim the bracket. A premium Valorant Champions & Masters draft simulator.",
      },
    ],
  }),
  component: Index,
});

import { useEffect } from "react";

function Index() {
  const { t } = useLanguage();

  useEffect(() => {
    document.body.removeAttribute("data-theme");
    document.body.classList.remove("bg-champions-particles", "bg-masters-particles");
    localStorage.removeItem("ui-theme");
  }, []);

  const MENU = [
    { to: "/collection", label: t("collection"), desc: "Your drafted rosters & stats" },
    { to: "/leaderboards", label: t("leaderboards"), desc: "Top dynasties by OVR" },
  ] as const;

  return (
    <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:py-20">
      {/* Hero */}
      <section className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="mb-4 inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
            <span className="h-1 w-1 animate-pulse rounded-full bg-primary" />
            Live draft engine · v1.0
          </div>
          <h1 className="font-display text-5xl leading-[0.95] sm:text-7xl lg:text-8xl uppercase">
            Build the
            <br />
            <span className="text-primary">undefeated</span>
            <br />
            roster.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Roll teams from every Valorant Champions and Masters era. Lock in stars, chase
            chemistry, and simulate your way to the trophy.
          </p>
          <div className="mt-8">
            <Link
              to="/play"
              className="clip-corner group relative inline-flex items-center gap-3 bg-primary px-8 py-4 font-display text-lg tracking-widest text-primary-foreground transition hover:brightness-110"
            >
              <span className="relative font-bold uppercase">{t("startDraft")}</span>
              <span className="block h-2 w-2 bg-primary-foreground/80" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Menu grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-3xl">
        {MENU.map((m, i) => (
          <motion.div
            key={m.to}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
          >
            <Link
              to={m.to}
              className="clip-corner group relative flex h-full flex-col justify-between gap-6 border border-border bg-surface/60 p-6 backdrop-blur transition hover:border-primary/60 hover:bg-surface-2/60"
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                // {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="font-display text-2xl uppercase tracking-wider">{m.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">{m.desc}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Stats strip */}
      <section className="grid grid-cols-2 gap-2 border-y border-border py-6 sm:grid-cols-4">
        {[
          ["13", "Tournaments"],
          ["5", "Champions Eras"],
          ["8", "Masters Events"],
          ["100+", "Players"],
        ].map(([n, l]) => (
          <div key={l} className="text-center">
            <div className="font-display text-4xl text-primary">{n}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {l}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
