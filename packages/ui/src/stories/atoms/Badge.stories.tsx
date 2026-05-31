import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Badge } from '@forge/ui';

// All six documented tones (see Components / Badges doc page).
const TONES = ['neutral', 'new', 'ice', 'success', 'warning', 'danger'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Count badge — a compact ~18px inline marker that rides next to a nav label, ' +
          'tab title, or feature heading. Six tones signal state (new, ice, success, warning, ' +
          'danger), it carries a numeric count, a version tag, or a short state word ' +
          '(new / updated / beta), and a dot variant acts as a presence indicator without text. ' +
          'Use `pushEnd` to hug the trailing edge of a flex nav row. ' +
          'For static reliability/language tags use the sibling `TierBadge` / `LangBadge` stories.',
      },
    },
  },
  args: {
    tone: 'neutral',
    size: 'md',
    dot: false,
    pushEnd: false,
    children: '12',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: TONES },
    size: { control: 'inline-radio', options: SIZES },
    dot: { control: 'boolean' },
    pushEnd: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default neutral count badge driven by controls. */
export const Default: Story = {
  args: {
    tone: 'neutral',
    children: '12',
  },
};

/** All six documented tones at the default (md) size. */
export const Variants: Story = {
  name: 'Variants — Tones',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {TONES.map((tone) => (
        <span key={tone} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Badge tone={tone}>{tone === 'neutral' ? '42' : '3'}</Badge>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
            {tone}
          </code>
        </span>
      ))}
    </div>
  ),
};

/** Three sizes — sm 14px, md 18px (default), lg 22px. */
export const Sizes: Story = {
  name: 'Sizes',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
      {SIZES.map((size) => (
        <span key={size} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Badge size={size} tone="new">99+</Badge>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
            {size === 'md' ? 'md (default)' : size}
          </code>
        </span>
      ))}
    </div>
  ),
};

/** Dot variant — presence indicator with no numeric content. */
export const DotVariant: Story = {
  name: 'Dot — Presence Indicator',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
      {(['new', 'success', 'warning', 'danger', 'neutral'] as const).map((tone) => (
        <span key={tone} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Badge dot tone={tone} />
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
            {tone}
          </code>
        </span>
      ))}
    </div>
  ),
};

/**
 * Numeric — a count riding next to a label. Badges stay meaningful as text
 * ("Inbox 12") and never appear as a bare number without a preceding label.
 */
export const Numeric: Story = {
  name: 'Numeric — Counts',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', color: 'var(--fg)' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Inbox <Badge>12</Badge></span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Failed <Badge tone="danger">3</Badge></span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>OK <Badge tone="success">142</Badge></span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Big number <Badge size="lg">9,482</Badge></span>
    </div>
  ),
};

/**
 * State markers — short words ("new", "updated", "beta") that ride next to a
 * menu item, link, or feature title. Tone is always paired with the text label
 * so colour-blind users read the state directly.
 */
export const StateMarkers: Story = {
  name: 'State — New / Updated / Beta',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', color: 'var(--fg)' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        Quality Gates <Badge tone="new">new</Badge>
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        Risk score <Badge tone="ice">updated</Badge>
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        Agent runner <Badge tone="warning">beta</Badge>
      </span>
    </div>
  ),
};

/**
 * Version tag — a semantic version riding next to a service name. Pre-release
 * builds escalate tone (warning for rc, danger for unstable).
 */
export const VersionTag: Story = {
  name: 'Version Tag',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg)',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        forge-api <Badge>v2.1.7</Badge>
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        pix-router <Badge tone="warning">v1.0.0-rc.4</Badge>
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        fraud-engine <Badge tone="danger">v0.9.2</Badge>
      </span>
    </div>
  ),
};

/**
 * In context — `pushEnd` hugs the trailing edge of a flex nav row via
 * `margin-inline-start: auto`, simulating a sidebar navigation list with
 * counts on routes that have activity.
 */
export const InContext: Story = {
  name: 'In Context — Sidebar Nav',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: 240,
        padding: 8,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 10,
      }}
    >
      {(
        [
          { label: 'Overview',      badge: null },
          { label: 'Alerts',        badge: { count: '5',   tone: 'danger'  as const } },
          { label: 'Pull requests', badge: { count: '12',  tone: 'new'     as const } },
          { label: 'Deployments',   badge: { count: '3',   tone: 'warning' as const } },
          { label: 'Discussions',   badge: { count: '99+', tone: 'neutral' as const } },
          { label: 'Settings',      badge: null },
        ] as Array<{ label: string; badge: { count: string; tone: 'danger' | 'new' | 'warning' | 'neutral' } | null }>
      ).map(({ label, badge }) => (
        <div
          key={label}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '6px 8px',
            borderRadius: 6,
          }}
        >
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>{label}</span>
          {badge && (
            <Badge tone={badge.tone} pushEnd>
              {badge.count}
            </Badge>
          )}
        </div>
      ))}
    </div>
  ),
};

/** RTL — the trailing `pushEnd` badge flips to the logical start side in a right-to-left layout. */
export const RTL: Story = {
  name: 'RTL',
  render: () => (
    <div dir="rtl">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: 240,
          padding: 8,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 10,
        }}
      >
        {(
          [
            { label: 'نظرة عامة',    badge: null },
            { label: 'التنبيهات',   badge: { count: '5',   tone: 'danger'  as const } },
            { label: 'طلبات السحب', badge: { count: '12',  tone: 'new'     as const } },
            { label: 'النشر',       badge: { count: '3',   tone: 'warning' as const } },
            { label: 'المناقشات',   badge: { count: '99+', tone: 'neutral' as const } },
          ] as Array<{ label: string; badge: { count: string; tone: 'danger' | 'new' | 'warning' | 'neutral' } | null }>
        ).map(({ label, badge }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 8px',
              borderRadius: 6,
            }}
          >
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>{label}</span>
            {badge && (
              <Badge tone={badge.tone} pushEnd>
                {badge.count}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  ),
};
