import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { TierBadge } from '@forge/ui';

const TIERS = ['T1', 'T2', 'T3'] as const;

const meta = {
  title: 'Primitives/TierBadge',
  component: TierBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '**Deprecated** — prefer `<Chip tone="tier-t1|tier-t2|tier-t3">` directly. ' +
          'TierBadge renders a service reliability tier chip (T1 = highest, T3 = lowest). ' +
          'Use it in service catalogs, incident boards, and SLO dashboards to communicate ' +
          'operational tier at a glance. The component is a thin wrapper kept for one-release back-compat.',
      },
    },
  },
  args: {
    tier: 'T1',
  },
  argTypes: {
    tier: { control: 'inline-radio', options: TIERS },
  },
} satisfies Meta<typeof TierBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Smallest real usage — a single T1 (mission-critical) tier chip. */
export const Default: Story = {
  render: (args) => <TierBadge {...args} />,
};

/** All three reliability tiers side by side — T1 (mission-critical), T2 (business-important), T3 (internal). */
export const AllTiers: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <TierBadge tier="T1" />
      <TierBadge tier="T2" />
      <TierBadge tier="T3" />
    </div>
  ),
};

/** In context — tier chips surfaced in a service catalog row. */
export const InContext: Story = {
  render: () => (
    <div
      className="surface"
      style={{ borderRadius: 10, overflow: 'hidden', maxWidth: 560 }}
    >
      {[
        { name: 'payments-api',       owner: 'Platform',   tier: 'T1', latency: '42 ms',  uptime: '99.98%' },
        { name: 'notification-svc',   owner: 'Messaging',  tier: 'T2', latency: '118 ms', uptime: '99.81%' },
        { name: 'feature-flag-proxy', owner: 'DevEx',      tier: 'T3', latency: '9 ms',   uptime: '99.40%' },
      ].map((row, i) => (
        <div
          key={row.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 16px',
            borderTop: i > 0 ? '1px solid var(--border)' : 'none',
          }}
        >
          <TierBadge tier={row.tier} />
          <span
            style={{
              flex: 1,
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-mono)',
              color: 'var(--fg)',
            }}
          >
            {row.name}
          </span>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-muted)',
              fontFamily: 'var(--font-mono)',
              minWidth: 52,
              textAlign: 'end',
            }}
          >
            {row.latency}
          </span>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-muted)',
              fontFamily: 'var(--font-mono)',
              minWidth: 56,
              textAlign: 'end',
            }}
          >
            {row.uptime}
          </span>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-subtle)',
              minWidth: 64,
              textAlign: 'end',
            }}
          >
            {row.owner}
          </span>
        </div>
      ))}
    </div>
  ),
};
