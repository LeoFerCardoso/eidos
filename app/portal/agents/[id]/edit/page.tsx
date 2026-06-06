import NewAgent from '@/portal/agents/new-agent';

// Edit reuses the create form in "edit" mode (all sections on one page).
export default async function EditAgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NewAgent editId={id} />;
}
