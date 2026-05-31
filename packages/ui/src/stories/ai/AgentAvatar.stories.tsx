import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentAvatar } from '@eidos/ui';
import { Icons } from '@eidos/ui';

const meta = {
  title: 'AI/AgentAvatar',
  component: AgentAvatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The visual mark for an AI agent in the Forge platform. Renders a circular ' +
          'avatar with the canonical ember tint, an optional presence dot, and either the ' +
          'default agent glyph, a custom icon, or two-letter initials. Use it anywhere an ' +
          'agent needs to be identified — chat headers, run logs, agentic pipeline cards, ' +
          'and incident-response threads.',
      },
    },
  },
  args: {
    size: 32,
    ember: true,
    name: 'Forge AI',
  },
  argTypes: {
    size: { control: { type: 'number', min: 16, max: 80, step: 4 } },
    ember: { control: 'boolean' },
    status: {
      control: 'inline-radio',
      options: [undefined, 'online', 'away', 'busy', 'offline'],
    },
    initials: { control: 'text' },
    name: { control: 'text' },
  },
} satisfies Meta<typeof AgentAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default agent avatar — 32 px, ember tint, agent glyph, no presence dot. */
export const Default: Story = {
  args: {
    size: 32,
    name: 'Deploy Agent',
  },
};

/** All four presence statuses side by side. */
export const PresenceStates: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <AgentAvatar size={36} status="online" name="Incident Responder" />
        <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>online</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <AgentAvatar size={36} status="away" name="Canary Watcher" />
        <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>away</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <AgentAvatar size={36} status="busy" name="Fraud Scorer" />
        <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>busy</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <AgentAvatar size={36} status="offline" name="Log Analyzer" />
        <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>offline</span>
      </div>
    </div>
  ),
};

/** Size scale — 20, 28, 32, 40, 48, 64 px. */
export const SizeScale: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {([20, 28, 32, 40, 48, 64] as const).map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <AgentAvatar size={s} name={`Agent ${s}px`} status="online" />
          <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>{s}</span>
        </div>
      ))}
    </div>
  ),
};

/** Initials variant — used for named personas (e.g. "Deploy Agent" → DA). */
export const WithInitials: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <AgentAvatar size={36} initials="DA" name="Deploy Agent" />
        <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Deploy Agent</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <AgentAvatar size={36} initials="IR" name="Incident Responder" status="online" />
        <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Incident Responder</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <AgentAvatar size={36} initials="FS" name="Fraud Scorer" status="busy" />
        <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Fraud Scorer</span>
      </div>
    </div>
  ),
};

/** Custom glyph — override the default agent icon with any ReactNode. */
export const CustomGlyph: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <AgentAvatar size={36} glyph={<Icons.terminal size={18} />} name="Shell Agent" />
        <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Shell Agent</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <AgentAvatar size={36} glyph={<Icons.search size={18} />} name="Search Agent" status="online" />
        <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Search Agent</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <AgentAvatar size={36} glyph={<Icons.barChart size={18} />} name="Analytics Agent" status="away" />
        <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Analytics Agent</span>
      </div>
    </div>
  ),
};

/** Non-ember — used when distinguishing a human user avatar from an agent in the same thread. */
export const NonEmber: Story = {
  args: {
    size: 36,
    ember: false,
    initials: 'LC',
    name: 'Leo Cardoso (human)',
  },
};
