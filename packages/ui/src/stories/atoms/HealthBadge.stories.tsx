import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { HealthBadge } from '@eidos/ui';

const STATES = ['up', 'degraded', 'down', 'unknown'] as const;

const meta = {
  title: 'Primitives/HealthBadge',
  component: HealthBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Operational health pill for services, agents, and cloud resources. ' +
          'Wraps `.pill.health-*` with an explicit status dot and short label. ' +
          'Use for at-a-glance health status in service catalogs, incident dashboards, ' +
          'and deployment pipelines. Keep labels short: "Up", "Degraded", "Down", "Unknown". ' +
          'Pass `pulse` to animate the dot during active investigation of a degraded state.',
      },
    },
  },
  args: {
    state: 'up',
    pulse: false,
  },
  argTypes: {
    state: { control: 'inline-radio', options: STATES },
    pulse: { control: 'boolean' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof HealthBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — a healthy service reporting "Up". */
export const Default: Story = {
  args: {
    state: 'up',
  },
};

/** All four states side by side — the full health state matrix. */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <HealthBadge state="up" />
      <HealthBadge state="degraded" />
      <HealthBadge state="down" />
      <HealthBadge state="unknown" />
    </div>
  ),
};

/** Pulsing dot — used while an incident is actively being investigated. */
export const Pulsing: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <HealthBadge state="degraded" pulse />
      <HealthBadge state="degraded" pulse label="Degraded · P1 active" />
    </div>
  ),
};

/** Custom labels — override the default text for context-specific messaging. */
export const CustomLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <HealthBadge state="up" label="Healthy" />
      <HealthBadge state="degraded" label="High latency" />
      <HealthBadge state="down" label="Outage" />
      <HealthBadge state="unknown" label="No data" />
    </div>
  ),
};

/** In context — service catalog rows showing mixed health across a deployment. */
export const InContext: Story = {
  render: () => {
    const services = [
      { name: 'eidos-api', region: 'us-east-1', state: 'up' as const, latency: '42 ms' },
      { name: 'auth-gateway', region: 'eu-west-1', state: 'degraded' as const, latency: '380 ms', pulse: true },
      { name: 'ingest-worker', region: 'us-west-2', state: 'down' as const, latency: '—' },
      { name: 'metrics-collector', region: 'ap-southeast-1', state: 'unknown' as const, latency: '—' },
      { name: 'deploy-runner', region: 'us-east-1', state: 'up' as const, latency: '18 ms' },
    ];
    return (
      <div className="surface" style={{ borderRadius: 10, overflow: 'hidden', maxWidth: 560 }}>
        <table className="tbl" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Service</th>
              <th>Region</th>
              <th>Health</th>
              <th style={{ textAlign: 'end' }}>Latency (p95)</th>
            </tr>
          </thead>
          <tbody>
            {services.map((svc) => (
              <tr key={svc.name}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>{svc.name}</td>
                <td style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>{svc.region}</td>
                <td>
                  <HealthBadge state={svc.state} pulse={'pulse' in svc ? svc.pulse : false} />
                </td>
                <td style={{ textAlign: 'end', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
                  {svc.latency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};

/** RTL — badge layout mirrors correctly under right-to-left direction. */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <HealthBadge state="up" />
        <HealthBadge state="degraded" pulse />
        <HealthBadge state="down" />
        <HealthBadge state="unknown" />
      </div>
      <div className="surface" style={{ padding: '10px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 360 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>eidos-api</span>
        <HealthBadge state="up" label="يعمل" />
      </div>
    </div>
  ),
};
