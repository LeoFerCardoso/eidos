'use client';
// Re-export the real DS primitives so MDX/docs components can use them. This file
// used to host legacy duplicates; it now points at the single source of truth —
// the @eidos/ui package (pure primitives) + the docs-shell wrappers (Section /
// ComponentInstall / AutoPropsTable), both surfaced through the '@/ds/core' barrel.
// New/migrated pages import from '@/components/docs' and get the real, typed primitives.
export { Icons, ForgeMark, installTabs } from '@eidos/ui';
export {
  Section,
  SubHead,
  Lede,
  Frame,
  CodeBlock,
  Code,
  CopyButton,
  Tabs,
  PropsTable,
  AutoPropsTable,
  ComponentInstall,
  TokenSwatch,
  SpecRow,
  Mono,
  TabbedCode,
  CollapsibleCode,
  CodeTree,
  Pagination,
  SimplePagination,
  Section as PageSection,
} from '@/ds/core';

// API-table row shape, re-exported for pages that build PropsTable rows by hand.
export type PropRow = { prop: string; type: string; default?: string; required?: boolean; description?: string };
