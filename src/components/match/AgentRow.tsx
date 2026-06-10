interface Props {
  agent?: string;
  compact?: boolean;
}

export function AgentRow({ agent, compact = false }: Props) {
  if (!agent) return null;

  const sizeClass = compact ? "w-8 h-8 md:w-8 md:h-8" : "w-9 h-9 md:w-10 md:h-10";

  return (
    <div className="flex -space-x-1.5 overflow-hidden">
      <img
        src={`/agents/${agent.toLowerCase()}.png`}
        alt={agent}
        title={agent}
        className={`inline-block ${sizeClass} bg-transparent object-contain`}
        style={{ mixBlendMode: "lighten" }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = `/agents/default-agent.png`;
        }}
      />
    </div>
  );
}
