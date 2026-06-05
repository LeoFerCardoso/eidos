import NewAgent from '@/portal/agents/new-agent';

// Static segment — takes precedence over the [id] dynamic route, so
// /portal/agents/new opens the creation wizard, not the detail page.
export default function NewAgentPage() {
  return <NewAgent />;
}
