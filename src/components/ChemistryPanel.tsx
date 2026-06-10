import { motion } from "framer-motion";
import type { ChemistryBreakdown } from "@/types/game";

interface Props {
  chemistry: ChemistryBreakdown;
  ovr: number;
}

export function ChemistryPanel({ chemistry, ovr }: Props) {
  const rows: Array<{ label: string; value: number; hint: string }> = [
    { label: "Jugador × Org", value: chemistry.organization, hint: "Parejas con la misma organización" },
    { label: "Jugador × Región", value: chemistry.region, hint: "Parejas de la misma región" },
    { label: "Jugador × País", value: chemistry.nationality, hint: "Parejas con misma nacionalidad" },
    { label: "Coach × Org", value: chemistry.coachOrg, hint: "Coach conectado con jugadores de su org" },
    { label: "Coach × Región", value: chemistry.coachRegion, hint: "Coach conectado por región" },
    { label: "Roster histórico", value: chemistry.fullOrg, hint: "Todos del mismo equipo y torneo" },
    { label: "Balance de roles", value: chemistry.roleBalance, hint: "Cobertura de roles competitivos" },
  ];

  const activeRows = rows.filter((row) => row.value > 0).length;
  const cappedPercent = Math.min(100, Math.max(4, chemistry.total * 3));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="clip-corner relative h-full overflow-hidden border border-border bg-surface/70 p-4 backdrop-blur"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,color-mix(in_oklab,var(--color-primary)_20%,transparent),transparent_38%)]" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gold">
              Chemistry Total
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-4xl text-primary">+{chemistry.total}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {activeRows}/7 links activos
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full border border-border/50 bg-background/70">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${cappedPercent}%` }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="h-full bg-primary shadow-[0_0_16px_var(--color-primary)]"
          />
        </div>

        <div className="mt-4 grid gap-x-4 gap-y-2 sm:grid-cols-3 md:grid-cols-4">
          {rows.map((row, idx) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.035, duration: 0.2 }}
              className={`group flex items-center justify-between gap-3 border-b border-border/30 pb-1.5 text-xs transition ${
                row.value > 0 ? "text-foreground" : "text-muted-foreground/60"
              }`}
              title={row.hint}
            >
              <span className="truncate text-muted-foreground group-hover:text-foreground">{row.label}</span>
              <span className={row.value > 0 ? "font-semibold text-gold" : "text-muted-foreground/60"}>
                +{row.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
