import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Chip, Icons } from '@eidos/ui';

const TONES = ['neutral', 'ok', 'bad', 'warn', 'ember', 'tier-t1', 'tier-t2', 'tier-t3'] as const;

const meta = {
  title: 'Primitives/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Attribute chip — a compact 4px-radius rectangle (Geist Mono) for versions, ' +
          'delta values, ref names, and service-reliability tiers. ' +
          'Use Chip (not Pill) when the label is a fixed attribute: a semver, a git ref, ' +
          'a latency delta, or a tier classification. ' +
          'Supports trend arrows (up/down), a leading icon slot, and a removable × action.',
      },
    },
  },
  args: {
    tone: 'neutral',
    children: 'v2.14.0',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: TONES },
    trend: { control: 'inline-radio', options: [undefined, 'up', 'down'] },
    onRemove: { action: 'removed' },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Smallest real example — a service version attribute chip. */
export const Default: Story = {
  args: {
    tone: 'neutral',
    children: 'v2.14.0',
  },
};

/** All tones in a single row. */
export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <Chip tone="neutral">v2.14.0</Chip>
      <Chip tone="ok">+8 ms</Chip>
      <Chip tone="bad">−240 ms</Chip>
      <Chip tone="warn">+62 ms</Chip>
      <Chip tone="ember">canary</Chip>
      <Chip tone="tier-t1">tier-1</Chip>
      <Chip tone="tier-t2">tier-2</Chip>
      <Chip tone="tier-t3">tier-3</Chip>
    </div>
  ),
};

/** Trend arrows — up arrow for improvement, down for regression. Arrows are semantic, not directional. */
export const WithTrend: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <Chip tone="ok" trend="up">p99 42 ms</Chip>
      <Chip tone="bad" trend="down">p99 640 ms</Chip>
      <Chip tone="warn" trend="up">throughput +12%</Chip>
      <Chip tone="bad" trend="down">error rate +3.2%</Chip>
      <Chip tone="neutral" trend="up">coverage 91%</Chip>
    </div>
  ),
};

/**
 * With icon — leading icon slot. An 8px colour dot (from `var(--*)` tokens) carries
 * language/runtime identity (GitHub linguist pattern); a 10px glyph tags categorical
 * refs like a branch or version. The icon is decorative — the label carries meaning.
 */
export const WithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <Chip
        icon={
          <span
            style={{
              display: 'inline-block',
              inlineSize: 8,
              blockSize: 8,
              borderRadius: '50%',
              background: 'var(--ice)',
            }}
          />
        }
      >
        Python
      </Chip>
      <Chip
        icon={
          <span
            style={{
              display: 'inline-block',
              inlineSize: 8,
              blockSize: 8,
              borderRadius: '50%',
              background: 'var(--warning)',
            }}
          />
        }
      >
        JavaScript
      </Chip>
      <Chip icon={<Icons.branch size={10} />}>main</Chip>
      <Chip icon={<Icons.tag size={10} />}>v2.91.0</Chip>
    </div>
  ),
};

/** Removable — trailing × button for filter chips and tag-style attribute lists. */
export const Removable: Story = {
  render: () => {
    const initial = [
      { id: 'env-prod', label: 'env:prod', tone: 'ember' as const },
      { id: 'region-use1', label: 'region:us-east-1', tone: 'neutral' as const },
      { id: 'service-api', label: 'service:eidos-api', tone: 'neutral' as const },
      { id: 'severity-p1', label: 'severity:P1', tone: 'bad' as const },
    ];
    const [chips, setChips] = React.useState(initial);
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        {chips.map((c) => (
          <Chip
            key={c.id}
            tone={c.tone}
            onRemove={() => setChips((prev) => prev.filter((x) => x.id !== c.id))}
            removeLabel={`Remove filter ${c.label}`}
          >
            {c.label}
          </Chip>
        ))}
        {chips.length === 0 && (
          <button
            type="button"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', cursor: 'pointer' }}
            onClick={() => setChips(initial)}
          >
            Restore filters
          </button>
        )}
      </div>
    );
  },
};

/** Reliability tiers — service classification used in the incident dashboard. */
export const ReliabilityTiers: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[
        { tier: 'tier-t1' as const, label: 'tier-1', service: 'eidos-api', slo: '99.99%' },
        { tier: 'tier-t2' as const, label: 'tier-2', service: 'eidos-webhooks', slo: '99.9%' },
        { tier: 'tier-t3' as const, label: 'tier-3', service: 'eidos-preview', slo: '99.5%' },
      ].map(({ tier, label, service, slo }) => (
        <div key={tier} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Chip tone={tier}>{label}</Chip>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--fg)' }}>{service}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>SLO {slo}</span>
        </div>
      ))}
    </div>
  ),
};

/** RTL — layout composes logically; trend arrows are intentionally direction-neutral (up = up). */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <Chip tone="neutral">v2.14.0</Chip>
      <Chip tone="ok" trend="up">p99 42 ms</Chip>
      <Chip tone="bad" trend="down">معدل الخطأ +3.2%</Chip>
      <Chip tone="tier-t1">tier-1</Chip>
      <Chip
        tone="ember"
        onRemove={() => {}}
        removeLabel="إزالة الفلتر"
      >
        env:prod
      </Chip>
    </div>
  ),
};

/** In context — chips used inside a deploy summary card alongside service metadata. */
export const InContext: Story = {
  render: () => (
    <div className="surface" style={{ padding: 20, borderRadius: 10, maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--fg)' }}>
          eidos-api
        </span>
        <Chip tone="tier-t1">tier-1</Chip>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <Chip tone="neutral">v2.14.0</Chip>
        <Chip tone="ok" trend="up">p50 12 ms</Chip>
        <Chip tone="warn" trend="down">p99 420 ms</Chip>
        <Chip tone="neutral">us-east-1</Chip>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <Chip tone="ember">canary</Chip>
        <Chip tone="neutral">main@a3f9c12</Chip>
      </div>
    </div>
  ),
};
