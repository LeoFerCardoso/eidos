import WorkflowDetail from '@/portal/workflows/workflow-detail';

// Forge · Workflow detail route. Opened from a workflow card. The workflow id
// comes from the path segment.
export default async function WorkflowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <WorkflowDetail id={id} />;
}
