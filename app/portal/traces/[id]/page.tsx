import TraceDetail from '@/portal/traces/trace-detail';

// Forge — Trace detail route. The trace id comes from the path.
export default async function TracePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TraceDetail id={id} />;
}
