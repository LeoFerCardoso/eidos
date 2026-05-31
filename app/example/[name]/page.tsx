import { ExampleLoader } from '@/components/layout/example-loader';
import { EXAMPLES_REG } from '@/ds/examples/registry';

// Standalone IDP example screens — a dedicated /example/<name> route, OUTSIDE the docs
// shell (full-screen), per the chosen architecture.
export function generateStaticParams() {
  return Object.keys(EXAMPLES_REG).map((name) => ({ name }));
}
export const dynamicParams = false;

export default async function ExamplePage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  return <ExampleLoader name={name} />;
}
