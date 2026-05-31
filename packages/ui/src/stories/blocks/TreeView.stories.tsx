import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
// Story-parity: the docs page (src/ds/migrated/idp/tree-view.tsx) documents ForgeTree —
// the @pierre/trees wrapper at src/components/pierre-tree.tsx — NOT the nodes-based
// @eidos/ui TreeView. We document the SAME surface here: a path-first file tree with a
// git-status lane, fuzzy search, drag-and-drop, context menus, flatten-empty-directories,
// window chrome and RTL. ForgeTree loads via next/dynamic({ ssr:false }) and depends on
// @pierre/trees, so it renders client-side (Storybook supports this).
import { ForgeTree } from '@/components/pierre-tree';

// ── Mirrors the page's REPO fixture — a realistic monorepo slice with many file
//    types so the per-language icon colours are tangible. Path-first: directories
//    are inferred from the segments. ──
const REPO = [
  '.github/workflows/ci.yml',
  'build/assets/images/social/logo.png',
  'build/index.mjs',
  'build/scripts.js',
  'config/project/tsconfig.json',
  'node_modules/react/index.js',
  'node_modules/react/package.json',
  'public/404.html',
  'public/favicon.ico',
  'scripts/release.sh',
  'src/components/Avatar.tsx',
  'src/components/Badge.tsx',
  'src/components/Button.tsx',
  'src/components/Button.test.tsx',
  'src/components/Card.tsx',
  'src/components/Dialog.tsx',
  'src/components/Input.tsx',
  'src/hooks/useDebounce.ts',
  'src/hooks/useMediaQuery.ts',
  'src/lib/mdx.tsx',
  'src/styles/globals.css',
  'src/styles/tokens.css',
  'src/utils/cn.ts',
  'src/index.ts',
  '.browserslistrc',
  '.gitignore',
  '.oxlintrc.json',
  'bunfig.toml',
  'package.json',
  'README.md',
  'stylelint.config.js',
];

// Git lane — status rides colour AND a letter glyph, never colour alone. Covers
// every state the engine paints (added · modified · deleted · renamed · untracked).
const REPO_GIT = [
  { path: 'src/components/Button.tsx', status: 'added' as const },
  { path: 'src/components/Card.tsx', status: 'added' as const },
  { path: 'src/index.ts', status: 'modified' as const },
  { path: 'src/styles/globals.css', status: 'modified' as const },
  { path: '.gitignore', status: 'deleted' as const },
  { path: 'package.json', status: 'renamed' as const },
  { path: 'README.md', status: 'untracked' as const },
];

// Domain taxonomy — service-and-tier hierarchy, same engine, no file extensions.
const SERVICES = [
  'Payments/forge-api',
  'Payments/pix-router',
  'Payments/fraud-engine',
  'Identity/identity-svc',
  'Identity/bureau-gateway',
  'Identity/kyc-orchestrator',
];
const SERVICES_META: Record<string, string> = {
  'Payments/forge-api': 'T1',
  'Payments/pix-router': 'T1',
  'Payments/fraud-engine': 'T1',
  'Identity/identity-svc': 'T1',
  'Identity/bureau-gateway': 'T2',
  'Identity/kyc-orchestrator': 'T1',
};

const EXPAND_SRC = ['src', 'src/components'];

const meta = {
  title: 'Elements/TreeView',
  component: ForgeTree,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'ForgeTree — the @pierre/trees engine re-skinned to Forge (the same surface the ' +
          'docs page documents). Feed it a flat list of canonical `paths`; directories are ' +
          'inferred from the segments. `gitStatus` paints the status lane (colour + letter), ' +
          '`search` + `searchMode` filter by name, `dragAndDrop` + `lockedPaths` move rows, ' +
          '`contextMenu` + `contextMenuTrigger` mount the Forge menu, `flattenEmptyDirectories` ' +
          'collapses single-child chains, `chrome` frames it as an IDE panel, and `dir="rtl"` ' +
          'mirrors the layout. Selection accent and focus ring are ember; the model, ' +
          'virtualization and keyboard a11y are the library’s.',
      },
    },
  },
  args: {
    paths: REPO,
    chrome: 'acme-components',
    defaultExpanded: EXPAND_SRC,
    selected: 'src/components/Button.tsx',
    height: 420,
  },
  argTypes: {
    paths: { control: false, description: 'Canonical leaf paths; directories are inferred.' },
    defaultExpanded: { control: false, description: 'Directory paths that start expanded.' },
    initialExpansion: {
      control: 'select',
      options: ['open', 'closed'],
      description: "Expand everything ('open'), nothing ('closed') or to a depth (number). Overrides defaultExpanded.",
    },
    selected: { control: 'text', description: 'Selected leaf path (single-select) — adds ember tint + aria-selected.' },
    gitStatus: { control: false, description: 'Per-path git decoration (added | modified | deleted | renamed | untracked).' },
    meta: { control: false, description: 'Per-path trailing text rendered in the action lane.' },
    density: {
      control: 'select',
      options: ['compact', 'default', 'relaxed'],
      description: 'Row height + spacing preset.',
    },
    flattenEmptyDirectories: { control: 'boolean', description: 'Collapse single-child folder chains into one breadcrumb row.' },
    search: { control: 'boolean', description: 'Mount the built-in fuzzy search field above the tree.' },
    searchMode: {
      control: 'select',
      options: ['hide-non-matches', 'collapse-non-matches', 'expand-matches'],
      description: 'How non-matching rows behave while searching.',
    },
    initialSearchQuery: { control: 'text', description: 'Pre-populate the search field (e.g. to demo a mode at rest).' },
    dragAndDrop: { control: 'boolean', description: 'Enable drag-to-move between folders and to the root.' },
    lockedPaths: { control: false, description: 'Paths that cannot be dragged (canDrag=false); each also gets a "locked" tag.' },
    contextMenu: { control: 'boolean', description: 'Mount the Forge context menu (new file/folder, rename, delete).' },
    contextMenuTrigger: {
      control: 'select',
      options: ['both', 'right-click', 'button'],
      description: 'How the context menu opens.',
    },
    chrome: { control: 'text', description: 'Render an IDE-style window chrome header (traffic lights, title, actions).' },
    dir: {
      control: 'inline-radio',
      options: ['ltr', 'rtl'],
      description: 'Writing direction — set "rtl" on the host so the engine\'s RTL layout engages.',
    },
    height: { control: false, description: 'Fixed panel height; rows virtualize and scroll inside it.' },
  },
} satisfies Meta<typeof ForgeTree>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Path-first file tree with window chrome, two branches pre-expanded, and a selected row. */
export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <ForgeTree {...args} />
    </div>
  ),
};

/** Git status lane — colour + letter on the inline-end edge, descendant dots on folders. */
export const GitStatus: Story = {
  args: {
    chrome: undefined,
    selected: undefined,
    initialExpansion: 'open',
    gitStatus: REPO_GIT,
    height: 560,
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <ForgeTree {...args} />
    </div>
  ),
};

/** Filter by name — the three modes for non-matching rows, "tsx" prefilled. */
export const Search: Story = {
  args: { chrome: undefined, selected: undefined, search: true, initialSearchQuery: 'tsx', height: 360 },
  render: (args) => (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      <div>
        <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBlockEnd: 8 }}>
          hide-non-matches
        </p>
        <ForgeTree {...args} searchMode="hide-non-matches" defaultExpanded={EXPAND_SRC} />
      </div>
      <div>
        <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBlockEnd: 8 }}>
          collapse-non-matches
        </p>
        <ForgeTree {...args} searchMode="collapse-non-matches" defaultExpanded={EXPAND_SRC} />
      </div>
      <div>
        <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBlockEnd: 8 }}>
          expand-matches
        </p>
        <ForgeTree {...args} searchMode="expand-matches" defaultExpanded={EXPAND_SRC} />
      </div>
    </div>
  ),
};

/** Drag rows onto folders or the root — package.json is locked (canDrag=false). */
export const DragAndDrop: Story = {
  args: {
    chrome: undefined,
    selected: undefined,
    dragAndDrop: true,
    lockedPaths: ['package.json'],
    defaultExpanded: ['src', 'src/components', 'src/utils'],
    height: 480,
  },
  render: (args) => (
    <div style={{ maxWidth: 460 }}>
      <ForgeTree {...args} />
    </div>
  ),
};

/** Right-click a row (or the per-row button) for new file/folder, rename and delete. */
export const ContextMenu: Story = {
  args: {
    chrome: 'acme-components',
    selected: undefined,
    contextMenu: true,
    contextMenuTrigger: 'both',
    defaultExpanded: EXPAND_SRC,
    height: 420,
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <ForgeTree {...args} />
    </div>
  ),
};

/** Collapse single-child folder chains (assets / images / social) into one breadcrumb row. */
export const FlattenEmptyDirectories: Story = {
  args: {
    chrome: undefined,
    selected: undefined,
    flattenEmptyDirectories: true,
    defaultExpanded: ['.github', 'build', 'build/assets/images/social', 'config'],
    height: 384,
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <ForgeTree {...args} />
    </div>
  ),
};

/** Same engine on a service-and-tier taxonomy — tier rides a text meta tag in the action lane. */
export const ServiceCatalog: Story = {
  args: {
    paths: SERVICES,
    chrome: undefined,
    selected: undefined,
    defaultExpanded: ['Payments', 'Identity'],
    meta: SERVICES_META,
    density: 'relaxed',
    height: 300,
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <ForgeTree {...args} />
    </div>
  ),
};

/**
 * RTL — set dir="rtl" on the tree itself so the engine's RTL mode engages: chevrons,
 * indent guides and the git lane flip to the inline-start edge, and filenames stay
 * bidi-isolated LTR (they are code, so they read left-to-right inside the mirrored layout).
 */
export const RTL: Story = {
  args: {
    dir: 'rtl',
    chrome: undefined,
    selected: undefined,
    gitStatus: REPO_GIT,
    defaultExpanded: EXPAND_SRC,
    height: 360,
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <ForgeTree {...args} />
    </div>
  ),
};
