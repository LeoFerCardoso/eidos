import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { AILabel, AILabelWithPopover, AgentAvatar, AgentIdentity } from '@forge/ui';

// ── AILabel meta ──────────────────────────────────────────────────────────────

const meta = {
  title: 'AI/Identity/AILabel',
  component: AILabel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Flags AI-generated content in four visual flavors: `box` (22 px tile), `mark` ' +
          '(text + sparkle), `pill` (tinted background), `dot` (icon-only). One colour ' +
          '(ember), one label ("AI"). `interactive` promotes it to a button with a focus ring.',
      },
    },
  },
  args: {
    variant: 'mark',
    size: 'md',
    revoked: false,
    interactive: false,
  },
  argTypes: {
    variant:     { control: 'inline-radio', options: ['box', 'mark', 'pill', 'dot'] },
    size:        { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    revoked:     { control: 'boolean' },
    interactive: { control: 'boolean' },
  },
} satisfies Meta<typeof AILabel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — mark variant, md size. */
export const Default: Story = {};

/** All four variants side by side. */
export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      {(['box', 'mark', 'pill', 'dot'] as const).map((v) => (
        <span key={v} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <AILabel variant={v} />
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{v}</code>
        </span>
      ))}
    </div>
  ),
};

/** Three sizes — sm, md, lg. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {(['sm', 'md', 'lg'] as const).map((sz) => (
        <span key={sz} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <AILabel variant="pill" size={sz} />
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{sz}</code>
        </span>
      ))}
    </div>
  ),
};

/** Revoked — strikethrough, muted color. */
export const Revoked: Story = {
  args: { revoked: true, variant: 'pill' },
};

/** Interactive — button role, keyboard + focus ring. */
export const Interactive: Story = {
  args: { interactive: true, variant: 'pill' },
};

/** Custom label — short token override ("Beta", "ML"). */
export const CustomLabel: Story = {
  name: 'Custom label',
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <AILabel variant="pill">Beta</AILabel>
      <AILabel variant="pill">ML</AILabel>
      <AILabel variant="mark">GPT-4o</AILabel>
    </div>
  ),
};

// ── AILabelWithPopover ────────────────────────────────────────────────────────

export const WithPopover: Story = {
  name: 'AILabelWithPopover',
  render: () => (
    <div style={{ padding: 32, fontFamily: 'var(--font-sans)', display: 'inline-flex', gap: 16, alignItems: 'center' }}>
      <span style={{ fontSize: 13, color: 'var(--fg)' }}>Risk score: 34</span>
      <AILabelWithPopover
        variant="pill"
        size="sm"
        label="AI risk score"
        model="forge-ai/gpt-4o-mini"
        ts="2 min ago"
        confidence={0.92}
      >
        Computed from blast radius, cyclomatic complexity, and coverage delta.
      </AILabelWithPopover>
    </div>
  ),
};

// ── AgentAvatar ───────────────────────────────────────────────────────────────

export const AgentAvatarDefault: Story = {
  name: 'AgentAvatar — default',
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <AgentAvatar size={24} />
      <AgentAvatar size={32} />
      <AgentAvatar size={40} />
      <AgentAvatar size={48} />
    </div>
  ),
};

export const AgentAvatarWithStatus: Story = {
  name: 'AgentAvatar — with presence',
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      {(['online', 'away', 'offline', 'busy'] as const).map((status) => (
        <span key={status} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <AgentAvatar size={32} status={status} name="Forge AI" />
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{status}</code>
        </span>
      ))}
    </div>
  ),
};

export const AgentAvatarInitials: Story = {
  name: 'AgentAvatar — initials',
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <AgentAvatar size={32} initials="FA" name="Forge AI" />
      <AgentAvatar size={32} initials="RZ" ember={false} name="Risk Agent" />
    </div>
  ),
};

// ── AgentIdentity ─────────────────────────────────────────────────────────────

export const AgentIdentityDefault: Story = {
  name: 'AgentIdentity — default',
  render: () => (
    <AgentIdentity
      agent={{ name: 'Forge AI', model: 'forge-ai/gpt-4o', status: 'online' }}
    />
  ),
};

export const AgentIdentityWithLabel: Story = {
  name: 'AgentIdentity — with AILabel',
  render: () => (
    <AgentIdentity
      agent={{ name: 'Risk Analyst', model: 'forge-ai/gpt-4o-mini', status: 'online' }}
      label
    />
  ),
};

export const AgentIdentityInContext: Story = {
  name: 'AgentIdentity — in context (message header)',
  render: () => (
    <div style={{
      maxWidth: 480,
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <AgentIdentity agent={{ name: 'Forge AI', model: 'gpt-4o', status: 'online' }} label />
        <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>14:01</span>
      </div>
      <div style={{ padding: '12px 14px', fontSize: 13, color: 'var(--fg)', lineHeight: 1.6 }}>
        The pix-router p95 is 89 ms, within SLO. The Ring 2 canary is at 62% traffic.
      </div>
    </div>
  ),
};
