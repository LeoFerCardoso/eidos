import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Breadcrumb, Icons } from '@eidos/ui';

// ── Shared fixtures ───────────────────────────────────────────────────────────

const BASE_ITEMS = [
  { label: 'Services', href: '#' },
  { label: 'forge-api', href: '#' },
  { label: 'Deploys', href: '#' },
  { label: 'v2.14.0' },
];

const LONG_ITEMS = [
  { label: 'Services', href: '#' },
  { label: 'forge-api', href: '#' },
  { label: 'Environments', href: '#' },
  { label: 'Production', href: '#' },
  { label: 'Deploys', href: '#' },
  { label: 'v2.14.0' },
];

// ── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Primitives/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A hierarchical trail of links from the root to the current page. ' +
          'Wraps a semantic `<nav aria-label="Breadcrumb">` > `<ol>` > `<li>` structure. ' +
          'Supports four separator variants (chevron, slash, dot, arrow), ' +
          'overflow collapse via DropdownMenu, compact size, and full RTL parity.',
      },
    },
  },
  args: {
    items: BASE_ITEMS,
    separator: 'chevron',
    size: 'md',
  },
  argTypes: {
    separator: {
      control: 'inline-radio',
      options: ['chevron', 'slash', 'dot', 'arrow'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    maxItems: { control: 'number' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ───────────────────────────────────────────────────────────────────

/** Default chevron separator, medium size, four crumbs. */
export const Default: Story = {};

// ── Separator variants ────────────────────────────────────────────────────────

/** All four separator variants side-by-side. */
export const Separators: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {(['chevron', 'slash', 'dot', 'arrow'] as const).map((sep) => (
        <div key={sep} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <code
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--fg-muted)',
              minWidth: 72,
            }}
          >
            {sep}
          </code>
          <Breadcrumb
            items={[
              { label: 'Services', href: '#' },
              { label: 'forge-api', href: '#' },
              { label: 'Settings' },
            ]}
            separator={sep}
          />
        </div>
      ))}
    </div>
  ),
};

// ── Compact size ──────────────────────────────────────────────────────────────

/** Small size for use inside page-header bars next to the topbar. */
export const Compact: Story = {
  args: {
    size: 'sm',
    items: [
      { label: 'Services', href: '#' },
      { label: 'forge-api', href: '#' },
      { label: 'Settings' },
    ],
  },
};

// ── Overflow collapse ─────────────────────────────────────────────────────────

/** When items exceed maxItems the middle collapses into an ellipsis DropdownMenu. */
export const WithCollapse: Story = {
  args: {
    items: LONG_ITEMS,
    maxItems: 3,
  },
};

// ── With icon ─────────────────────────────────────────────────────────────────

/** Leading icon on the first crumb (home). */
export const WithIcon: Story = {
  render: () => {
    // We import Icons inline so the story is self-contained.
    return (
      <Breadcrumb
        items={[
          { label: 'Services', href: '#', icon: <Icons.home size={13} /> },
          { label: 'forge-api', href: '#' },
          { label: 'Deploys' },
        ]}
      />
    );
  },
};

// ── onClick items ─────────────────────────────────────────────────────────────

/** Items can use onClick (e.g. in an SPA router) instead of href. */
export const WithOnClick: Story = {
  render: () => {
    const [last, setLast] = React.useState('—');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Breadcrumb
          items={[
            { label: 'Services', onClick: () => setLast('Services') },
            { label: 'forge-api', onClick: () => setLast('forge-api') },
            { label: 'Deploys' },
          ]}
        />
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--fg-muted)',
            margin: 0,
          }}
        >
          Last clicked: {last}
        </p>
      </div>
    );
  },
};

// ── RTL ───────────────────────────────────────────────────────────────────────

/**
 * Under dir="rtl" the chevron/arrow separators mirror with scaleX(-1)
 * so they always point to the next (more specific) segment.
 * Slash and dot separators are non-directional and do not mirror.
 */
export const RTL: Story = {
  render: () => (
    <div
      dir="rtl"
      style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '8px 0' }}
    >
      {(['chevron', 'arrow', 'slash', 'dot'] as const).map((sep) => (
        <div key={sep} style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'flex-start' }}>
          <code
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--fg-muted)',
              minWidth: 72,
              direction: 'ltr',
            }}
          >
            {sep}
          </code>
          <Breadcrumb
            items={[
              { label: 'الخدمات', href: '#' },
              { label: 'forge-api', href: '#' },
              { label: 'عمليات النشر' },
            ]}
            separator={sep}
            label="مسار التنقّل"
          />
        </div>
      ))}
    </div>
  ),
};

// ── In context ────────────────────────────────────────────────────────────────

/** Breadcrumb above a page title — the typical in-app placement. */
export const InContext: Story = {
  render: () => (
    <div
      style={{
        width: '100%',
        padding: '24px 28px',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--bg-elevated)',
      }}
    >
      <Breadcrumb
        size="sm"
        items={[
          { label: 'Services', href: '#' },
          { label: 'forge-api', href: '#' },
          { label: 'Settings' },
        ]}
        style={{ marginBottom: 14 } as React.CSSProperties}
      />
      <h2
        style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          margin: '0 0 6px',
          color: 'var(--fg)',
        }}
      >
        Settings
      </h2>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--fg-muted)', margin: 0 }}>
        Manage alert routes, on-call rotation, and the dependency map for forge-api.
      </p>
    </div>
  ),
};
