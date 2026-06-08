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
        className="inline-block h-6 w-6 rounded-full ring-2 ring-background bg-surface border border-border object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `/agents/default-agent.png`;
        }}
      />
    </div>
  );
}
