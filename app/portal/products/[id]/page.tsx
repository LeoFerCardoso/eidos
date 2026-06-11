import ProductDetail from '@/portal/products/product-detail';

// Forge — Product detail route. Opened from a card in the Products list. The
// product id comes from the path segment; the detail composes the product's
// full estate (services, data, infra) and its squads/people from the catalog.
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetail id={id} />;
}
