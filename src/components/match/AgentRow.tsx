interface Props {
  agent?: string;
}

export function AgentRow({ agent }: Props) {
  if (!agent) return null;

  return (
    <div className="flex -space-x-1.5 overflow-hidden">
      <img
        src={`/agents/${agent.toLowerCase()}.png`}
        alt={agent}
        title={agent}
        className="inline-block w-9 h-9 md:w-10 md:h-10 bg-transparent object-contain"
        style={{ mixBlendMode: "lighten" }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = `/agents/default-agent.png`;
        }}
      />
    </div>
  );
}
