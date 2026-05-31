// Core barrel — the DS component layer for the docs app.
//
// The component library now lives in the extracted **@eidos/ui** package
// (icons / atoms / primitives / blocks / charts / device / drawer / ai). It is
// re-exported here so the 200+ migrated pages keep importing from '@/ds/core'
// unchanged. The three docs-shell wrappers (Section / ComponentInstall /
// AutoPropsTable) depend on the docs app's nav registry + generated props map,
// so they live in this app (./docs-primitives) and are re-exported alongside.
export * from '@eidos/ui';
export * from './docs-primitives';
