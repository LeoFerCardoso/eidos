// Eidos AI — component layer barrel.
//
// The AI sub-DS composes the base Core primitives (Avatar, CodeBlock,
// CopyButton, DataTable, JSONInspector, TreeView, LogViewer, DiffViewer,
// Banner, Empty, StatusDot, SeverityPill, RelativeTime, Timeline, …) and
// adds only the AI-specific glue here. Each module is pure (no .css import,
// no top-level side effect) so the Core barrel keeps tree-shaking.
//
// Migrated AI pages import these via the Core barrel:
//   import { Message, AICaret, Tool, Reasoning, Citation, Sources } from '@/ds/core'
export * from './identity';
export * from './prose';
export * from './content';
export * from './message';
export * from './context';
export * from './artifact';
export * from './terminal';
export * from './voice';
export * from './ask';
export * from './agentic';
export * from './sources';
export * from './prompt';
export * from './history';
