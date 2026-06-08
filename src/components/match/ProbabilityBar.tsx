import { motion } from "framer-motion";

interface Props {
  probA: number;
}

export function ProbabilityBar({ probA }: Props) {
  const percentA = Math.round(probA * 100);
  const percentB = 100 - percentA;

  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
        <span>Win Probability</span>
      </div>
      <div className="h-2 w-full bg-surface overflow-hidden flex clip-corner border border-border/40 relative">
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{
            background: "linear-gradient(90deg, #ff3b3b 0%, #ff9a3b 25%, #f7ff3b 50%, #3bff7a 75%, #00ffcc 100%)"
          }}
          animate={{ width: `${percentA}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        />
      </div>
      <div className="flex justify-between text-xs font-display mt-1.5">
        <span className="text-green-500">{percentA}%</span>
        <span className="text-red-500">{percentB}%</span>
      </div>
    </div>
  );
}
