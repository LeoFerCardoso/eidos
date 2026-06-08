import ContextDetail from '@/portal/contexts/context-detail';

// Forge — Context detail / settings route. Opened when a row is clicked in the
// Contexts catalog. The context id comes from the path.
export default async function ContextDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ContextDetail id={id} />;
}
