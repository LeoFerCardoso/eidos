// @eidos/ui — the Eidos Design System component library.
//
// Framework-agnostic React + a shared semantic CSS layer (import the stylesheets
// from "@eidos/ui/styles/*"). Each module imports its dependencies directly
// (icons → atoms/blocks; recharts → charts; ai → primitives/atoms/icons), so there
// is no load-order side-effect and no `window` registry. The package is marked
// `sideEffects: ["*.css"]` so this barrel tree-shakes (recharts only ships in chart
// consumers).
//
// The three DOCS-SHELL wrappers (Section / ComponentInstall / AutoPropsTable) are
// NOT here — they depend on the docs app's nav registry + generated props map and
// live in the docs app (src/ds/core/docs-primitives.tsx).
export * from './mocks';
export * from './icons';
export * from './brand-icons';
export * from './badge';
export * from './atoms';
export * from './primitives';
export * from './blocks';
export * from './charts';
export * from './device';
export * from './drawer';
export * from './forms';
export * from './select';
export * from './calendar';
export * from './date-picker';
export * from './combobox';
export * from './color-input';
export * from './ai';
export * from './modal';
export * from './alert-dialog';
export * from './popover';
export * from './tooltip';
export * from './hover-card';
export * from './menu';
export * from './menubar';
export * from './command';
export * from './notification';
export * from './separator';
export * from './aspect-ratio';
export * from './scroll-area';
export * from './button-group';
export * from './breadcrumb';
export * from './toolbar';
export * from './navigation';
export * from './sidebar';
export * from './resizable';
export * from './accordion';
export * from './collapsible';
export * from './carousel';
export * from './table';
export * from './card';
export * from './alert';
export * from './progress';
export * from './spinner';
export * from './skeleton';
export * from './toggle';
export * from './toggle-group';
export * from './label';
export * from './input-group';
export * from './tag-input';
export * from './tabs';
export * from './password';
export * from './selection-card';
