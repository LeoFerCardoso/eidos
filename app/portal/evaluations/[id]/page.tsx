import EvalDetail from '@/portal/evaluations/eval-detail';

// Forge — Experiment detail route. The experiment id comes from the path.
export default async function EvaluationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EvalDetail id={id} />;
}
