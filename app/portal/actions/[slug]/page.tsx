import ActionDetail from '@/portal/actions/action-detail';

// Forge · Action detail route. Opened from an Action card in the registry.
// The action id comes from the path segment.
export default async function ActionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ActionDetail slug={slug} />;
}
