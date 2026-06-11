import PostmortemView from '@/portal/incidents/postmortem';

// Forge — Auto-postmortem route (§7.11). Agent-drafted, human-edited.
export default async function PostmortemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PostmortemView id={id} />;
}
