import DiagramDetail from '@/portal/architecture/diagram-detail';

// Forge — Architecture diagram detail route. Opened when a diagram card is
// clicked in /portal/architecture (Diagrams tab). The diagram id is the path.
export default async function ArchitectureDiagramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DiagramDetail id={id} />;
}
