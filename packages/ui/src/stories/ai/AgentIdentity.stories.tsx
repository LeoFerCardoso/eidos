import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentIdentity } from '@eidos/ui';

const meta = {
  title: 'AI/AgentIdentity',
  component: AgentIdentity,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The canonical "who is talking" row for agent-driven surfaces. ' +
          'Combines an AgentAvatar, a name line, and an optional model identifier. ' +
          'Use it in chat meta rows, agentic step headers, and incident response ' +
          'feeds wherever you need to identify the acting agent at a glance.',
      },
    },
  },
  args: {
    agent: { name: 'Forge AI', model: 'forge-ai/gpt-4o-mini', status: 'online' },
    size: 32,
    label: false,
  },
  argTypes: {
    size: { control: 'number' },
    label: { control: 'boolean' },
    'agent.status': {
      control: 'inline-radio',
      options: ['online', 'away', 'offline', 'busy'],
    },
  },
} satisfies Meta<typeof AgentIdentity>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — avatar + name + model line with an active presence dot. */
export const Default: Story = {};

/** With AI label — appends an AILabel pill after the agent name to flag AI-generated content. */
export const WithAILabel: Story = {
  args: {
    agent: { name: 'Deploy Agent', model: 'forge-ai/codex-v2', status: 'online' },
    label: true,
  },
};

/**
 * Variants — presence states, sizes, and label flag laid out side by side.
 * Covers the full variant × state matrix: four presence values across two
 * avatar sizes, plus the AILabel variant.
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Presence states */}
      <section>
        <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Presence states
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
          <AgentIdentity
            agent={{ name: 'Forge AI', model: 'forge-ai/gpt-4o-mini', status: 'online' }}
          />
          <AgentIdentity
            agent={{ name: 'Incident Responder', model: 'forge-ai/claude-3-haiku', status: 'away' }}
          />
          <AgentIdentity
            agent={{ name: 'Fraud Engine', model: 'forge-ai/risk-v3', status: 'busy' }}
          />
          <AgentIdentity
            agent={{ name: 'Audit Bot', model: 'forge-ai/compliance-v1', status: 'offline' }}
          />
        </div>
      </section>

      {/* Sizes */}
      <section>
        <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Sizes
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
          <AgentIdentity
            agent={{ name: 'Deploy Agent', model: 'forge-ai/codex-v2', status: 'online' }}
            size={24}
          />
          <AgentIdentity
            agent={{ name: 'Deploy Agent', model: 'forge-ai/codex-v2', status: 'online' }}
            size={32}
          />
          <AgentIdentity
            agent={{ name: 'Deploy Agent', model: 'forge-ai/codex-v2', status: 'online' }}
            size={40}
          />
          <AgentIdentity
            agent={{ name: 'Deploy Agent', model: 'forge-ai/codex-v2', status: 'online' }}
            size={48}
          />
        </div>
      </section>

      {/* With AI label */}
      <section>
        <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          With AI label
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
          <AgentIdentity
            agent={{ name: 'Forge AI', model: 'forge-ai/gpt-4o-mini', status: 'online' }}
            label
          />
          <AgentIdentity
            agent={{ name: 'Summarisation Agent', model: 'forge-ai/claude-3-5-sonnet', status: 'away' }}
            label
            size={40}
          />
        </div>
      </section>

      {/* No model line */}
      <section>
        <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Name only (no model identifier)
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
          <AgentIdentity
            agent={{ name: 'Pix Router', status: 'online' }}
          />
          <AgentIdentity
            agent={{ name: 'CI Pipeline Bot', status: 'busy' }}
            label
          />
          <AgentIdentity
            agent={{}}
          />
        </div>
      </section>

    </div>
  ),
};

/** In context — identity row inside an agentic step card, as it would appear in a deploy feed. */
export const InContext: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 20,
        borderRadius: 10,
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        maxWidth: 440,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <AgentIdentity
          agent={{ name: 'Deploy Agent', model: 'forge-ai/codex-v2', status: 'online' }}
          label
        />
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)' }}>
          2 min ago
        </span>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--fg)', lineHeight: 1.5 }}>
        Rolled back <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>pix-router</code>{' '}
        from <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>v4.2.1</code> to{' '}
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>v4.1.9</code> — latency p95
        returned to baseline within 90 s.
      </p>
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <span
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--fg-muted)',
            background: 'var(--surface-raised)',
            borderRadius: 4,
            padding: '2px 6px',
          }}
        >
          ring-0
        </span>
        <span
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--fg-muted)',
            background: 'var(--surface-raised)',
            borderRadius: 4,
            padding: '2px 6px',
          }}
        >
          INC-9812
        </span>
      </div>
    </div>
  ),
};
