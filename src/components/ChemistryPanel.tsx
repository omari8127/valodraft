import type { ChemistryBreakdown } from "@/types/game";

interface Props {
  chemistry: ChemistryBreakdown;
  ovr: number;
}

export function ChemistryPanel({ chemistry, ovr }: Props) {
  const rows: Array<[string, number]> = [
    ["Organization", chemistry.organization],
    ["Region", chemistry.region],
    ["Nationality", chemistry.nationality],
    ["Coach × Org", chemistry.coachOrg],
    ["Coach × Region", chemistry.coachRegion],
    ["Full Org", chemistry.fullOrg],
    ["Role Diversity", chemistry.roleBalance],
  ];
  return (
    <div className="clip-corner border border-border bg-surface/70 p-4 backdrop-blur">
      <div className="flex items-baseline justify-between">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Team OVR
        </div>
        <div className="font-display text-5xl text-primary">{ovr || "—"}</div>
      </div>
      <div className="mt-4 border-t border-border/50 pt-3">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gold">
          Chemistry · {chemistry.total}
        </div>
        <div className="mt-2 space-y-1.5">
          {rows.map(([label, val]) => (
            <div key={label} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{label}</span>
              <span className={val > 0 ? "font-semibold text-gold" : "text-muted-foreground/60"}>
                +{val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
