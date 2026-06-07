import PipelineRunDetail from '@/portal/pipelines/run-detail';

// Forge — Pipeline run detail route. The run id comes from the path.
export default async function PipelineRunPage({ params }: { params: Promise<{ run: string }> }) {
  const { run } = await params;
  return <PipelineRunDetail runId={run} />;
}
