import PrDetail from '@/portal/quality-gates/pr-detail';

// Forge — Quality Gates PR detail route. The PR number comes from the path.
export default async function QualityGatePrPage({ params }: { params: Promise<{ pr: string }> }) {
  const { pr } = await params;
  return <PrDetail prId={pr} />;
}
