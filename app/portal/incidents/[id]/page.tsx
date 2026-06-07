import IncidentRoom from '@/portal/incidents/incident-room';

// Forge — Incident war room route. The incident id comes from the path.
export default async function IncidentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <IncidentRoom id={id} />;
}
