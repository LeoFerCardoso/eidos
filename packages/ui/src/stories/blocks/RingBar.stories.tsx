import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RingBar } from '@forge/ui';

const RINGS_INFLIGHT = [
  { label: 'Ring 0', audience: 'Internal · 100 nodes', percent: 100, status: 'done' },
  { label: 'Ring 1', audience: 'Canary · 1% traffic',  percent: 100, status: 'done' },
  { label: 'Ring 2', audience: '10% traffic',           percent: 62,  status: 'running' },
  { label: 'Ring 3', audience: '50% traffic',           percent: 0,   status: 'pending' },
  { label: 'Ring 4', audience: '100% traffic',          percent: 0,   status: 'pending' },
];

const RINGS_DONE = [
  { label: 'Ring 0', audience: 'Internal · 100 nodes', percent: 100, status: 'done' },
  { label: 'Ring 1', audience: 'Canary · 1% traffic',  percent: 100, status: 'done' },
  { label: 'Ring 2', audience: '10% traffic',          percent: 100, status: 'done' },
  { label: 'Ring 3', audience: '50% traffic',          percent: 100, status: 'done' },
  { label: 'Ring 4', audience: '100% traffic',         percent: 100, status: 'done' },
];

const RINGS_FAILED = [
  { label: 'Ring 0', audience: 'Internal · 100 nodes', percent: 100, status: 'done' },
  { label: 'Ring 1', audience: 'Canary · 1% traffic',  percent: 42,  status: 'error' },
  { label: 'Ring 2', audience: '10% traffic',          percent: 0,   status: 'pending' },
  { label: 'Ring 3', audience: '50% traffic',          percent: 0,   status: 'pending' },
  { label: 'Ring 4', audience: '100% traffic',         percent: 0,   status: 'pending' },
];

const meta = {
  title: 'Elements/RingBar',
  component: RingBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A horizontal cohort strip that visualises a ring-deployment rollout. ' +
          'Cells to the left of `currentRing` are fully done; the active ring carries ' +
          'an ember tint and pulsing status dot; future rings are neutral. ' +
          'Pass `popoverFor` to make cells clickable with a popover body.',
      },
    },
  },
  args: {
    rings: RINGS_INFLIGHT,
    currentRing: 2,
  },
  argTypes: {
    currentRing: { control: 'number' },
  },
} satisfies Meta<typeof RingBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Ring 2 in flight — the active cell pulses with ember tint. */
export const Default: Story = {};

/** All rings completed successfully. */
export const Complete: Story = {
  args: { rings: RINGS_DONE, currentRing: 4 },
};

/** Canary (Ring 1) errored — rollout is blocked. */
export const Failed: Story = {
  args: { rings: RINGS_FAILED, currentRing: 1 },
};

/** With a popover render prop — each cell becomes a clickable button. */
export const WithPopover: Story = {
  render: () => (
    <RingBar
      rings={RINGS_INFLIGHT}
      currentRing={2}
      popoverFor={(ring) => (
        <div style={{ padding: '8px 0', minWidth: 180 }}>
          <p style={{ fontSize: 12, fontWeight: 600, margin: '0 0 4px' }}>{ring.label}</p>
          <p style={{ fontSize: 11, color: 'var(--fg-muted)', margin: 0 }}>{ring.audience}</p>
          <p style={{ fontSize: 11, margin: '6px 0 0', fontFamily: 'var(--font-mono)' }}>
            {ring.percent}% complete
          </p>
        </div>
      )}
    />
  ),
};

/** Two simultaneous deploys — realistic dashboard row. */
export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBottom: 8 }}>pix-router · D-9182 · in flight</p>
        <RingBar rings={RINGS_INFLIGHT} currentRing={2} />
      </div>
      <div>
        <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBottom: 8 }}>identity-svc · D-9180 · complete</p>
        <RingBar rings={RINGS_DONE} currentRing={4} />
      </div>
      <div>
        <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBottom: 8 }}>bureau-gateway · D-9179 · canary error</p>
        <RingBar rings={RINGS_FAILED} currentRing={1} />
      </div>
    </div>
  ),
};
