import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Pill, Icons } from '@eidos/ui';

const TONES = [
  'neutral', 'ember', 'success', 'warning', 'danger', 'ice',
  'severity-p0', 'severity-p1', 'severity-p2', 'severity-p3',
  'health-up', 'health-degraded', 'health-down', 'health-unknown',
  'status-pending', 'status-running', 'status-done', 'status-error', 'status-skipped',
  'risk-low', 'risk-med', 'risk-high', 'risk-crit',
] as const;

const meta = {
  title: 'Primitives/Pill',
  component: Pill,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'State pill — rounded capsule (22 px) for service health, deploy state, incident severity, and run status. ' +
          'Supports a static dot, a live pulsing ring (use only while work is in-flight), a leading icon, ' +
          'and a trailing remove button. Choose `tone` from the base set (neutral/ember/success/warning/danger/ice) ' +
          'or a semantic family (severity-*, health-*, status-*, risk-*).',
      },
    },
  },
  args: {
    tone: 'neutral',
    live: false,
    dot: false,
  },
  argTypes: {
    tone: { control: 'select', options: TONES },
    live: { control: 'boolean' },
    dot: { control: 'boolean' },
    onRemove: { action: 'removed' },
  },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default state pill — neutral tone, no decoration. */
export const Default: Story = {
  args: {
    children: 'Deployed',
  },
};

/** Static dot shown with `dot` prop. */
export const WithDot: Story = {
  args: {
    tone: 'health-up',
    dot: true,
    children: 'Healthy',
  },
};

/** Live pulsing ring — use only while a process is actively in-flight. */
export const Live: Story = {
  args: {
    tone: 'status-running',
    live: true,
    children: 'Deploying',
  },
};

/** Leading icon replacing the dot slot. */
export const WithIcon: Story = {
  render: (args) => (
    <Pill {...args} tone="status-error" icon={<Icons.incident size={12} />}>
      Incident open
    </Pill>
  ),
};

/** Removable pill — trailing × button with accessible label. */
export const Removable: Story = {
  render: () => {
    const [tags, setTags] = React.useState(['forge-api', 'us-east-1', 'production']);
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {tags.map((tag) => (
          <Pill
            key={tag}
            tone="ice"
            onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))}
            removeLabel={`Remove filter ${tag}`}
          >
            {tag}
          </Pill>
        ))}
        {tags.length === 0 && (
          <button
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', cursor: 'pointer' }}
            onClick={() => setTags(['forge-api', 'us-east-1', 'production'])}
          >
            Restore filters
          </button>
        )}
      </div>
    );
  },
};

/** All six base tones side by side. */
export const BaseTones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Pill tone="neutral" dot>Neutral</Pill>
      <Pill tone="success" dot>Success</Pill>
      <Pill tone="warning" dot>Warning</Pill>
      <Pill tone="danger" dot>Danger</Pill>
      <Pill tone="ember" dot>Ember</Pill>
      <Pill tone="ice" dot>Ice</Pill>
    </div>
  ),
};

/** Severity family — incident triage (P0–P3). */
export const SeverityFamily: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Pill tone="severity-p0" dot>P0 · Critical</Pill>
      <Pill tone="severity-p1" dot>P1 · High</Pill>
      <Pill tone="severity-p2" dot>P2 · Medium</Pill>
      <Pill tone="severity-p3" dot>P3 · Low</Pill>
    </div>
  ),
};

/** Health family — service uptime states. */
export const HealthFamily: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Pill tone="health-up" dot>Healthy</Pill>
      <Pill tone="health-degraded" dot>Degraded</Pill>
      <Pill tone="health-down" dot>Down</Pill>
      <Pill tone="health-unknown" dot>Unknown</Pill>
    </div>
  ),
};

/** Status family — pipeline / run step states. */
export const StatusFamily: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Pill tone="status-pending" dot>Pending</Pill>
      <Pill tone="status-running" live>Running</Pill>
      <Pill tone="status-done" dot>Done</Pill>
      <Pill tone="status-error" dot>Error</Pill>
      <Pill tone="status-skipped" dot>Skipped</Pill>
    </div>
  ),
};

/** Risk family — change risk score. */
export const RiskFamily: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Pill tone="risk-low" dot>Low risk</Pill>
      <Pill tone="risk-med" dot>Medium risk</Pill>
      <Pill tone="risk-high" dot>High risk</Pill>
      <Pill tone="risk-crit" dot>Critical risk</Pill>
    </div>
  ),
};

/** RTL — text and remove button flip correctly under dir="rtl". */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Pill tone="health-up" dot>بدون مشكلة</Pill>
      <Pill tone="status-running" live>جارٍ النشر</Pill>
      <Pill tone="severity-p1" dot>P1 · عالٍ</Pill>
      <Pill tone="ice" onRemove={() => {}} removeLabel="إزالة us-east-1">us-east-1</Pill>
    </div>
  ),
};

/**
 * All tones laid out in a matrix: each row is a semantic family,
 * columns are dot / live / icon / removable variants.
 */
export const Variants: Story = {
  render: () => {
    const [removed, setRemoved] = React.useState<string[]>([]);
    const toggle = (key: string) =>
      setRemoved((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
      );
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* ── Base tones ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', minWidth: 90 }}>base</span>
          <Pill tone="neutral">Neutral</Pill>
          <Pill tone="success" dot>Operational</Pill>
          <Pill tone="warning" dot>Degraded</Pill>
          <Pill tone="danger" dot>Outage</Pill>
          <Pill tone="ember" dot>Beta</Pill>
          <Pill tone="ice" dot>Preview</Pill>
        </div>

        {/* ── Status family ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', minWidth: 90 }}>status</span>
          <Pill tone="status-pending" dot>Queued</Pill>
          <Pill tone="status-running" live>Building</Pill>
          <Pill tone="status-done" dot>Deployed</Pill>
          <Pill tone="status-error" dot>Failed</Pill>
          <Pill tone="status-skipped" dot>Skipped</Pill>
        </div>

        {/* ── Health family ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', minWidth: 90 }}>health</span>
          <Pill tone="health-up" dot>forge-api</Pill>
          <Pill tone="health-degraded" dot>forge-auth</Pill>
          <Pill tone="health-down" dot>forge-cdn</Pill>
          <Pill tone="health-unknown" dot>forge-mq</Pill>
        </div>

        {/* ── Severity family ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', minWidth: 90 }}>severity</span>
          <Pill tone="severity-p0" icon={<Icons.incident size={12} />}>SEV-1 · DB write failure</Pill>
          <Pill tone="severity-p1" dot>SEV-2 · Latency spike</Pill>
          <Pill tone="severity-p2" dot>SEV-3 · Retry storm</Pill>
          <Pill tone="severity-p3" dot>SEV-4 · UI lag</Pill>
        </div>

        {/* ── Risk family ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', minWidth: 90 }}>risk</span>
          <Pill tone="risk-low" dot>Low</Pill>
          <Pill tone="risk-med" dot>Medium</Pill>
          <Pill tone="risk-high" dot>High</Pill>
          <Pill tone="risk-crit" dot>Critical</Pill>
        </div>

        {/* ── Removable (filter chips pattern) ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', minWidth: 90 }}>removable</span>
          {['region:us-east-1', 'env:production', 'team:platform'].map((label) =>
            removed.includes(label) ? null : (
              <Pill
                key={label}
                tone="ice"
                onRemove={() => toggle(label)}
                removeLabel={`Remove ${label}`}
              >
                {label}
              </Pill>
            ),
          )}
          {removed.length > 0 && (
            <button
              style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
              onClick={() => setRemoved([])}
            >
              reset
            </button>
          )}
        </div>
      </div>
    );
  },
};
