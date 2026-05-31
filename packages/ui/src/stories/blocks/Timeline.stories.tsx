import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timeline } from '@eidos/ui';

const NOW = Date.now();
const ago = (ms: number) => new Date(NOW - ms);

const DEPLOY_EVENTS = [
  { id: 'e1', title: 'Deploy queued', meta: 'pix-router v2.7.0 · Rafael Mendonça', at: ago(14 * 60 * 1000), icon: 'clock', done: true },
  { id: 'e2', title: 'Build passed', meta: '1m 12s · 142 artifacts', at: ago(13 * 60 * 1000), icon: 'check', done: true },
  { id: 'e3', title: 'Tests passed', meta: '4m 38s · 1,847 specs', at: ago(9 * 60 * 1000), icon: 'check', done: true },
  { id: 'e4', title: 'Risk gate: low (34)', meta: 'Blast radius Ring 0→2', at: ago(8 * 60 * 1000), icon: 'shield', done: true },
  { id: 'e5', title: 'Canary active', meta: 'Ring 0 · 62% healthy', at: ago(2 * 60 * 1000), icon: 'flame', current: true },
  { id: 'e6', title: 'Full rollout', meta: 'Pending canary completion', icon: 'server' },
];

const INCIDENT_EVENTS = [
  { id: 'i1', title: 'P0 opened', meta: 'pix-router — elevated error rate (4.2%)', at: ago(95 * 60 * 1000), tone: 'danger', icon: 'alert', done: true },
  {
    id: 'i2', title: 'ACK · Rafael Mendonça', at: ago(88 * 60 * 1000), done: true,
    person: { name: 'Rafael Mendonça', initials: 'RM', role: 'Tech Lead · Pix' },
  },
  { id: 'i3', title: 'Hypothesis: idempotency key collision on retry', meta: 'Added to #pix-incident', at: ago(80 * 60 * 1000), icon: 'info', done: true },
  { id: 'i4', title: 'Fix deployed — D-9182', meta: 'v2.7.1 to canary (Ring 0)', at: ago(22 * 60 * 1000), icon: 'check', current: true, tone: 'success' },
  { id: 'i5', title: 'Monitoring window active', meta: 'Error rate stable at 0.1%', icon: 'clock' },
  { id: 'i6', title: 'Post-mortem scheduled', meta: 'Thu 15:00 BRT', icon: 'edit' },
];

const meta = {
  title: 'Elements/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A vertical sequence of events with ember-tinted current step, quiet-green done steps, ' +
          'and neutral pending steps. Items can carry an avatar, an icon, a tone, ' +
          'and arbitrary child content. Use `compact` in sidesheets and drawers.',
      },
    },
  },
  args: {
    items: DEPLOY_EVENTS,
    compact: false,
  },
  argTypes: {
    compact: { control: 'boolean' },
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A deploy lifecycle with the canary step in flight (ember). */
export const Default: Story = {};

/** With person avatars in the pins (incident ACK flow). */
export const WithAvatars: Story = {
  args: { items: INCIDENT_EVENTS },
};

/** Compact density — tighter rows for sidesheets and drawers. */
export const Compact: Story = {
  args: { compact: true },
};

/** Deploy timeline in a card at realistic width. */
export const InContext: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBottom: 12 }}>
        pix-router · D-9182 · in flight
      </p>
      <Timeline items={DEPLOY_EVENTS} />
    </div>
  ),
};
