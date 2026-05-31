import { DocsShell } from '@/components/layout/docs-shell';

// Nested layout for the idiomatic (Phase 0) design-system docs. Renders the two-column
// chrome once; route content slots into <main>. Legacy pages (app/[...slug]) are
// unaffected — they keep using DSRuntime + the old window-based DSShell.
export default function DSGroupLayout({ children }: { children: React.ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
