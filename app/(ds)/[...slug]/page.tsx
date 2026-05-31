import { DSPageLoader } from '@/components/layout/ds-page-loader';
import { MIGRATED } from '@/ds/migrated/registry';

// Every DS page (components, foundations, charts, elements, ai, patterns, get-started,
// resources) renders here, inside the persisted (ds) DocsShell — so navigating the
// sidebar only swaps this content and keeps the menu scroll + selection.
export function generateStaticParams() {
  return Object.keys(MIGRATED)
    // `overview` is the Introduction — it renders at the home route ('/'), not /overview.
    .filter((k) => k !== 'overview')
    .map((k) => ({ slug: k.split('/') }));
}
export const dynamicParams = false;

export default async function DSPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <DSPageLoader routeKey={(slug ?? []).join('/')} />;
}
