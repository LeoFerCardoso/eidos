import AgentDetail from '@/portal/agents/agent-detail';

// Forge — Agent detail / settings route. Opened when a card is clicked in the
// Agents catalog (instead of starting a chat). The agent id comes from the path.
export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AgentDetail id={id} />;
}
