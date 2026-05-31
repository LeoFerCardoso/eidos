import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { SeverityPill } from '@eidos/ui';

const LEVELS = ['p0', 'p1', 'p2', 'p3'] as const;

const meta = {
  title: 'Primitives/SeverityPill',
  component: SeverityPill,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Compact pill that communicates incident / alert / change-risk severity. ' +
          'Follows the Eidos P0–P3 convention: P0 = Critical (highest), P3 = Notice (lowest). ' +
          'Use in incident tables, alert feeds, change-management queues, and SLO dashboards ' +
          'wherever a glanceable severity level is required.',
      },
    },
  },
  args: {
    level: 'p1',
    icon: true,
  },
  argTypes: {
    level: { control: 'inline-radio', options: LEVELS },
    icon: { control: 'boolean' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof SeverityPill>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — P1 Major with alert icon, as it appears in an incident feed. */
export const Default: Story = {
  render: (args) => <SeverityPill {...args} />,
};

/** All four severity levels side by side — P0 Critical through P3 Notice. */
export const AllLevels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
      <SeverityPill level="p0" />
      <SeverityPill level="p1" />
      <SeverityPill level="p2" />
      <SeverityPill level="p3" />
    </div>
  ),
};

/** Icon suppressed — use in dense tables where the dot-only tint carries the signal. */
export const WithoutIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
      <SeverityPill level="p0" icon={false} />
      <SeverityPill level="p1" icon={false} />
      <SeverityPill level="p2" icon={false} />
      <SeverityPill level="p3" icon={false} />
    </div>
  ),
};

/** Custom label — override the default text for a specific incident context. */
export const CustomLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
      <SeverityPill level="p0" label="SEV-1 · Full outage" />
      <SeverityPill level="p1" label="SEV-2 · Partial degradation" />
      <SeverityPill level="p2" label="SEV-3 · Single-region" />
      <SeverityPill level="p3" label="SEV-4 · Informational" />
    </div>
  ),
};

/** In context — severity pills used inside an incident list surface. */
export const InContext: Story = {
  render: () => (
    <div
      className="surface"
      style={{ borderRadius: 10, overflow: 'hidden', maxWidth: 560 }}
    >
      <div
        style={{
          padding: '10px 16px',
          fontWeight: 600,
          fontSize: 'var(--text-sm)',
          color: 'var(--fg-muted)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        Active incidents
      </div>
      {[
        { id: 'INC-4821', title: 'Auth service unavailable — us-east-1', level: 'p0' as const, age: '8 min ago' },
        { id: 'INC-4819', title: 'Elevated latency — payments API', level: 'p1' as const, age: '34 min ago' },
        { id: 'INC-4815', title: 'CDN cache miss rate above threshold', level: 'p2' as const, age: '2 h ago' },
        { id: 'INC-4802', title: 'Non-critical config drift detected', level: 'p3' as const, age: '1 d ago' },
      ].map((inc) => (
        <div
          key={inc.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 16px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <SeverityPill level={inc.level} />
          <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>
            {inc.title}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--fg-muted)',
              whiteSpace: 'nowrap',
            }}
          >
            {inc.id} · {inc.age}
          </span>
        </div>
      ))}
    </div>
  ),
};

/** RTL — pills reverse glyph and text direction under dir="rtl". */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <SeverityPill level="p0" />
        <SeverityPill level="p1" />
        <SeverityPill level="p2" />
        <SeverityPill level="p3" />
      </div>
      <div
        className="surface"
        style={{ borderRadius: 8, overflow: 'hidden', maxWidth: 480 }}
      >
        {[
          { id: 'INC-4821', title: 'خدمة المصادقة غير متاحة', level: 'p0' as const },
          { id: 'INC-4819', title: 'زمن استجابة مرتفع — واجهة المدفوعات', level: 'p1' as const },
        ].map((inc) => (
          <div
            key={inc.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 16px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <SeverityPill level={inc.level} />
            <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>
              {inc.title}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--fg-muted)',
              }}
            >
              {inc.id}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};
