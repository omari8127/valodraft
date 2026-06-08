import { createFileRoute } from "@tanstack/react-router";
import { useDynasty } from "@/lib/store/dynasty";
import { useProgression, getRankTier, getRankBadge } from "@/lib/store/progression";
import { GAME_MODE_BY_ID } from "@/data/tournaments";
import { Trophy, Globe, User } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/leaderboards")({
  head: () => ({
    meta: [
      { title: "Leaderboards — Valorant Champions Draft" },
      { name: "description", content: "Compare your seasonal ranked MMR against simulated global VCT pro players and view your saved dynasties." },
    ],
  }),
  component: LeaderboardsPage,
});

interface LeaderboardEntry {
  name: string;
  mmr: number;
  isUser?: boolean;
}

function LeaderboardsPage() {
  const saves = useDynasty((s) => s.saves);
  const userMmr = useProgression((s) => s.mmr);

  const byOVR = [...saves].sort((a, b) => b.teamOVR - a.teamOVR).slice(0, 10);
  const byWins = [...saves].sort((a, b) => b.wins - a.wins).slice(0, 10);

  // Generate simulated global ranked ladder
  const globalLeaderboard = useMemo(() => {
    const pros: LeaderboardEntry[] = [
      { name: "aspas 🇧🇷", mmr: 2150 },
      { name: "TenZ 🇨🇦", mmr: 2010 },
      { name: "Chronicle 🇷🇺", mmr: 1920 },
      { name: "tuyz 🇧🇷", mmr: 1790 },
      { name: "Boaster 🇬🇧", mmr: 1680 },
      { name: "Mazino 🇨🇱", mmr: 1520 },
      { name: "Cryocells 🇺🇸", mmr: 1480 },
      { name: "FNS 🇨🇦", mmr: 1390 },
      { name: "ANGE1 🇺🇦", mmr: 1280 },
      { name: "Boostio 🇺🇸", mmr: 1210 },
      { name: "Sacy 🇧🇷", mmr: 1140 },
      { name: "stax 🇰🇷", mmr: 1050 },
      { name: "benjyfishy 🇬🇧", mmr: 980 },
      { name: "johnqt 🇲🇦", mmr: 850 },
    ];

    const allEntries = [...pros, { name: "YOU (Draft Manager) 👤", mmr: userMmr, isUser: true }];
    return allEntries.sort((a, b) => b.mmr - a.mmr);
  }, [userMmr]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
        // Standings
      </div>
      <h1 className="mt-1 font-display text-4xl sm:text-5xl">Leaderboards</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Column 1: Simulated Global Ranked VCT Ladder */}
        <div className="lg:col-span-1 clip-corner border border-border bg-surface/70 p-5 backdrop-blur flex flex-col">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gold flex items-center gap-1.5 mb-3 border-b border-border/40 pb-2">
            <Globe className="w-4 h-4 text-gold" /> Global Ranked Ladder (Season 1)
          </div>
          <ol className="divide-y divide-border/30 overflow-y-auto max-h-[600px] pr-1 space-y-1">
            {globalLeaderboard.map((entry, i) => {
              const tier = getRankTier(entry.mmr);
              const badge = getRankBadge(tier);
              return (
                <li
                  key={entry.name + i}
                  className={`flex items-center justify-between py-2 px-3 clip-corner transition ${
                    entry.isUser
                      ? "bg-gold/15 border border-gold/40 shadow-[0_0_10px_rgba(212,175,55,0.15)] font-bold text-white"
                      : "hover:bg-background/30"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`font-display text-base w-6 text-center ${
                        i === 0 ? "text-gold" : i < 3 ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="text-xl shrink-0 select-none">{badge}</span>
                    <div className="truncate">
                      <div className="text-xs truncate">{entry.name}</div>
                      <div className="text-[8px] text-muted-foreground uppercase font-mono tracking-wider">
                        {tier}
                      </div>
                    </div>
                  </div>
                  <div className={`font-display text-base ${entry.isUser ? "text-gold font-bold" : "text-primary"}`}>
                    {entry.mmr} <span className="text-[9px] font-mono font-normal text-muted-foreground">MMR</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Column 2: Local Dynasty By Team OVR */}
        <div className="lg:col-span-1">
          <Board title="Top Dynasties (By Team OVR)" rows={byOVR} field="teamOVR" suffix="" />
        </div>

        {/* Column 3: Local Dynasty By Wins */}
        <div className="lg:col-span-1">
          <Board title="Top Dynasties (By Wins)" rows={byWins} field="wins" suffix=" W" />
        </div>
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
    <div className="clip-corner border border-border bg-surface/70 p-5 backdrop-blur h-full flex flex-col">
      <div className="text-[10px] font-bold uppercase tracking-widest text-gold flex items-center gap-1.5 mb-3 border-b border-border/40 pb-2">
        <Trophy className="w-4 h-4 text-gold" /> {title}
      </div>
      {rows.length === 0 ? (
        <div className="my-auto text-center text-sm text-muted-foreground py-12">
          No dynasty data available. Draft a roster to compete and claim your spot!
        </div>
      ) : (
        <ol className="divide-y divide-border/30 space-y-1 overflow-y-auto max-h-[600px] pr-1">
          {rows.map((r, i) => (
            <li key={r.id} className="flex items-center justify-between py-2 px-3 hover:bg-background/30 rounded clip-corner">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`font-display text-xl w-6 text-center ${
                    i === 0 ? "text-gold font-bold" : i < 3 ? "text-primary font-bold" : "text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="truncate">
                  <div className="font-semibold text-xs truncate">{r.name}</div>
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground truncate">
                    {GAME_MODE_BY_ID[r.modeId]?.name ?? r.modeId}
                  </div>
                </div>
              </div>
              <div className="font-display text-xl text-primary shrink-0 ml-2">
                {r[field]}
                <span className="text-xs text-muted-foreground">{suffix}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
