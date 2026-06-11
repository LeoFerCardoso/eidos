import RunDetail from '@/portal/runs/run-detail';

// Forge · Run detail route. Opened from a run row or a "Runs of this workflow"
// link. The run id comes from the path segment.
export default async function RunDetailPage({ params }: { params: Promise<{ run: string }> }) {
  const { run } = await params;
  return <RunDetail id={run} />;
}
