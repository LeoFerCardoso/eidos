import ApiDetail from '@/portal/apis/api-detail';

// Forge — API detail route. The API id comes from the path.
export default async function ApiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ApiDetail id={id} />;
}
