import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Message, MessageActions, Response, Conversation } from '@forge/ui';

// ── Message ──────────────────────────────────────────────────────────────────

const meta = {
  title: 'AI/Message',
  component: Message,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'One turn of a chat thread. Drives alignment, avatar, and bubble fill via the `from` role. ' +
          'Supports streaming, attachments, errors, and an actions toolbar slot.',
      },
    },
  },
  args: {
    from: 'assistant',
    variant: 'bubble',
    avatar: true,
    streaming: false,
  },
  argTypes: {
    from: { control: 'inline-radio', options: ['user', 'assistant', 'system'] },
    variant: { control: 'inline-radio', options: ['bubble', 'compact', 'plain'] },
    streaming: { control: 'boolean' },
    avatar: { control: 'boolean' },
    error: { control: 'text' },
    meta: { control: 'text', description: 'Caption row above the bubble.' },
  },
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default assistant bubble with body text. */
export const Default: Story = {
  args: {
    from: 'assistant',
    children: 'The pix-router introduced a synchronous call to bureau-gateway, which violates ADR-006 (async-first inter-tribe communication) and increases p95 latency by ~80 ms under load.',
  },
};

/** User turn — right-aligned with the user avatar. */
export const UserTurn: Story = {
  args: {
    from: 'user',
    userAvatar: { initials: 'LM', name: 'Leonardo Mariga' },
    children: 'What’s the blast radius if we roll back the ledger-svc now?',
  },
};

/** System message — no avatar, minimal chrome. */
export const SystemMessage: Story = {
  args: {
    from: 'system',
    children: 'Context loaded: 18 services, 24 active deploys, incident window open.',
  },
};

/** Compact variant — reduced padding, tighter font. */
export const Compact: Story = {
  args: {
    from: 'assistant',
    variant: 'compact',
    children: 'Coverage delta: +1.2 %. Risk score: 34. Blast radius bounded to Ring 0→2.',
  },
};

/** Plain variant — no bubble shell at all. */
export const Plain: Story = {
  args: {
    from: 'assistant',
    variant: 'plain',
    children: 'Drift detected: fraud-engine reads from ml-feature-store without a circuit breaker.',
  },
};

/** Streaming state — blinking caret trails the body. */
export const Streaming: Story = {
  args: {
    from: 'assistant',
    streaming: true,
    children: 'Analysing the decision tree refactor in PR #7419',
  },
};

/** Error state — danger-toned bubble with an error ribbon below. */
export const WithError: Story = {
  args: {
    from: 'assistant',
    error: 'Context window exceeded — try a shorter prompt.',
    children: 'I was unable to complete the analysis.',
  },
};

/** With file and image attachments rendered as chips. */
export const WithAttachments: Story = {
  args: {
    from: 'user',
    userAvatar: { initials: 'BO', name: 'Beatriz Okamoto' },
    attachments: [
      { name: 'fraud-trace.json', size: '2.1 KB', kind: 'file' },
      { name: 'screenshot.png',   size: '148 KB', kind: 'image' },
    ],
    children: 'Anything odd in this trace?',
  },
};

/** With the canonical MessageActions toolbar. */
export const WithActions: Story = {
  args: {
    from: 'assistant',
    actions: <MessageActions onCopy={() => {}} onRegen={() => {}} onVote={() => {}} vote={null}/>,
    children: 'The consent-vault bump carries zero blast radius — Rust edition conflicts are resolved.',
  },
};

/** Meta caption row above the bubble — typically speaker name + timestamp. */
export const WithMeta: Story = {
  args: {
    from: 'assistant',
    meta: <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>Forge AI · just now</span>,
    children: 'I found 3 ADR violations in the current sprint. Want me to open draft issues?',
  },
};

/** A realistic back-and-forth thread composed with Conversation. */
export const InContext: Story = {
  render: () => {
    function Thread() {
      const [vote, setVote] = React.useState<'up' | 'down' | null>(null);
      return (
        <Conversation title="Incident · pix-router p95 spike">
          <div className="conv-body" style={{ padding: '16px 0' }}>
            <Message
              from="user"
              userAvatar={{ initials: 'LM', name: 'Leonardo Mariga' }}
            >
              What's causing the p95 spike on pix-router? We're at 480 ms, SLO is 200 ms.
            </Message>
            <Message
              from="assistant"
              meta={
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
                  Forge AI · now
                </span>
              }
              actions={
                <MessageActions
                  vote={vote}
                  onVote={setVote}
                  onCopy={() => {}}
                  onRegen={() => {}}
                />
              }
            >
              PR #7421 introduced a synchronous call to <code>bureau-gateway</code> on
              the hot path. Bureau's p95 is 218 ms — adding that to pix-router's baseline
              pushes you past the SLO. Rolling back to 2.6.9 should restore normal latency
              within one ring cycle (~8 min).
            </Message>
            <Message from="user" userAvatar={{ initials: 'LM', name: 'Leonardo Mariga' }}>
              Do we have a GMUD open for that rollback?
            </Message>
            <Message from="assistant" streaming>
              Checking the change management log
            </Message>
          </div>
        </Conversation>
      );
    }
    return <Thread/>;
  },
};
