import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Conversation, Message, MessageActions, Response } from '@forge/ui';

const meta = {
  title: 'AI/Conversation',
  component: Conversation,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The thread surface that hosts a chat: a bordered, fixed-height, internally-scrolling ' +
          'container that stacks Messages and snaps to the newest turn. The load-bearing rule is ' +
          'scroll discipline — auto-follow only when the reader is already at the bottom, never ' +
          'yank them down when they have scrolled up into history. Pass `title` for the header ' +
          'strip and `tall` for a taller viewport.',
      },
    },
  },
  args: {
    title: 'Incident replay · 0421',
    tall: false,
  },
  argTypes: {
    title: { control: 'text' },
    tall: { control: 'boolean' },
    mode: { control: 'inline-radio', options: ['chat', 'document'] },
    autoScroll: { control: 'boolean' },
    unreadHint: { control: 'inline-radio', options: ['pill', 'none'] },
    height: { control: 'text' },
  },
} satisfies Meta<typeof Conversation>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — three turns under a titled header, driven entirely by args. */
export const Default: Story = {
  args: {
    children: (
      <>
        <Message from="system" variant="compact">
          Session opened · forge-ai/sonnet-4-6
        </Message>
        <Message from="user" variant="compact" userAvatar={{ initials: 'LM', name: 'Leonardo Mariga' }}>
          Where do I find the Tier-1 incident runbooks?
        </Message>
        <Message from="assistant" variant="compact" meta={<>Forge AI · 14:02</>}>
          In <code>docs/runbooks/tier-1/</code> — each service has its own Markdown file with the
          on-call rotation, dashboards, and rollback steps for the last three releases.
        </Message>
      </>
    ),
  },
};

/** Tall modifier — a taller fixed-height shell for longer threads, ending on a streaming turn. */
export const Tall: Story = {
  args: {
    tall: true,
    children: (
      <>
        <Message from="user" variant="compact" userAvatar={{ initials: 'RM', name: 'Rafael Mendonça' }}>
          Is it safe to promote pix-router 2.7.0 to Ring 3?
        </Message>
        <Message from="assistant" variant="compact" meta={<>Forge AI · 14:02</>}>
          Not yet — the canary at Ring 2 is showing a p99 regression of ~120 ms. Hold until the next
          metrics window (ETA 12 min).
        </Message>
        <Message from="user" variant="compact" userAvatar={{ initials: 'RM', name: 'Rafael Mendonça' }}>
          Can you watch it and notify me when it&rsquo;s clear?
        </Message>
        <Message from="assistant" variant="compact" streaming>
          Watching Ring 2 canary metrics
        </Message>
      </>
    ),
  },
};

/** No title — a body-only shell for embedded surfaces (drawer, side panel). */
export const NoTitle: Story = {
  args: {
    title: undefined,
    children: (
      <>
        <Message from="assistant" variant="compact">
          Context loaded: 18 services, 8 active incidents, 24 deploys in flight.
        </Message>
        <Message from="user" variant="compact" userAvatar={{ initials: 'CT', name: 'Camila Tanaka' }}>
          Summarise the top risk this week.
        </Message>
      </>
    ),
  },
};

/**
 * Document mode (`mode="document"`, ChatGPT-style) — the user question stays a compact bubble on
 * the trailing edge, the assistant turn renders as a full Response (long-form prose). The shell
 * widens and the gap loosens. NOTE: the exported Conversation does not yet wire `mode` to the
 * `.mode-document` shell, so this story composes the documented document surface directly.
 */
export const DocumentMode: Story = {
  args: { title: undefined },
  render: () => (
    <div className="conv mode-document" style={{ height: 560 }}>
      <div className="conv-head">
        <span className="title">Release post-mortem · 0421</span>
        <span
          style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}
        >
          document mode
        </span>
        <span className="spacer" />
      </div>
      <div className="conv-body">
        <div className="conv-doc-q">
          <div className="conv-doc-q-bubble">
            Walk me through the 0421 release post-mortem — what changed, what broke, and what we
            should monitor in 0422.
          </div>
        </div>
        <Response meta={<>Forge AI · 14:02 · gpt-5</>}>
          <h2>What changed in 0421</h2>
          <p>
            Three things shipped together — none of them broke in isolation, but their interaction
            is why the on-call paged at 02:14.
          </p>
          <ol>
            <li>
              <b>grpc retry budget</b> bumped from <code>3</code> to <code>8</code> in{' '}
              <code>config/grpc.toml</code>.
            </li>
            <li>
              <b>identity-svc pool size</b> doubled (16 &rarr; 32) to absorb the migration burst.
            </li>
            <li>
              <b>Datadog metric rename</b> — old alerts still bound to the old name.
            </li>
          </ol>
          <h2>What broke</h2>
          <p>
            The retry-budget bump masked a downstream timeout in <code>billing-svc</code>. Because
            the alert rename silently un-bound the alert, the page didn&rsquo;t fire until error rate
            hit 4%.
          </p>
        </Response>
      </div>
    </div>
  ),
};

/**
 * Empty state — a new chat with no turns. Composes the documented empty surface (ember tile,
 * title, lede, and 1–3 starter pills) inside the thread shell. NOTE: ConversationEmptyState is
 * documented but not exported from @forge/ui, so the markup is composed here.
 */
export const EmptyState: Story = {
  args: { title: undefined },
  render: () => (
    <div className="conv" style={{ height: 340 }}>
      <div className="conv-head">
        <span className="title">New chat</span>
        <span className="spacer" />
      </div>
      <div
        className="conv-body"
        style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 12 }}
      >
        <div style={{ fontWeight: 600, fontSize: 'var(--text-body)' }}>Start with anything</div>
        <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', maxWidth: '46ch', lineHeight: 1.55 }}>
          Ask about an incident, a service, or a deploy diff. The model has read-only access to your
          Datadog and GitHub orgs.
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span className="pill">What changed in the last 24h?</span>
          <span className="pill">Why is identity-svc paging?</span>
          <span className="pill">Tier-1 runbooks for billing</span>
        </div>
      </div>
    </div>
  ),
};

/**
 * Live thread — the load-bearing scroll discipline. New turns snap into view only while the reader
 * is at the bottom; once they scroll up, a floating "n new ↓" jump-pill appears instead of yanking
 * them down. Click jumps back to live and clears the count. NOTE: `autoScroll`/`unreadHint` props
 * and ConversationJumpToLatest are documented but not yet wired in the export, so the behaviour is
 * driven here with state + a composed `.conv-jump` control.
 */
export const LiveThread: Story = {
  args: { title: undefined },
  render: () => {
    function Live() {
      const seed: { id: number; from: 'user' | 'assistant' | 'system'; body: string; meta?: React.ReactNode }[] = [
        { id: 0, from: 'system', body: 'Session opened · forge-ai/sonnet-4-6' },
        { id: 1, from: 'user', body: 'Stuck on grpc retries — anything jump out?' },
        { id: 2, from: 'assistant', meta: <>Forge AI · 14:02</>, body: 'Retry budget on grpc.toml was bumped from 3 to 8 in the last deploy.' },
        { id: 3, from: 'assistant', body: 'That can mask a downstream timeout — billing-svc looks like the suspect.' },
      ];
      const [turns, setTurns] = React.useState(seed);
      const [unread, setUnread] = React.useState(0);
      const [notAtBottom, setNotAtBottom] = React.useState(false);
      const bodyRef = React.useRef<HTMLDivElement>(null);

      const isAtBottom = () => {
        const el = bodyRef.current;
        if (!el) return true;
        return el.scrollHeight - el.scrollTop - el.clientHeight < 24;
      };
      const scrollToBottom = (smooth = true) => {
        const el = bodyRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
      };

      React.useEffect(() => { scrollToBottom(false); }, []);
      React.useEffect(() => {
        const el = bodyRef.current;
        if (!el) return;
        const onScroll = () => {
          const atBottom = isAtBottom();
          setNotAtBottom(!atBottom);
          if (atBottom) setUnread(0);
        };
        el.addEventListener('scroll', onScroll);
        return () => el.removeEventListener('scroll', onScroll);
      }, []);
      React.useEffect(() => {
        const sample: { from: 'user' | 'assistant'; body: string; meta?: React.ReactNode }[] = [
          { from: 'user', body: 'And what about the deploy after?' },
          { from: 'assistant', meta: <>Forge AI · 14:04</>, body: 'That one only touched the migration runner — safe to roll back independently.' },
          { from: 'user', body: 'Got it. Anything else worth checking?' },
          { from: 'assistant', meta: <>Forge AI · 14:06</>, body: 'Watch the p99 on identity-svc — the same retry-bump cascades there too.' },
        ];
        let i = 0;
        const id = setInterval(() => {
          const t = sample[i % sample.length]; i += 1;
          const wasAtBottom = isAtBottom();
          setTurns(prev => [...prev, { id: prev.length, from: t.from, body: t.body, meta: t.meta }]);
          if (wasAtBottom) requestAnimationFrame(() => scrollToBottom(true));
          else setUnread(n => n + 1);
        }, 4500);
        return () => clearInterval(id);
      }, []);

      return (
        <div className="conv tall">
          <div className="conv-head">
            <span className="title">Live thread (auto-scroll demo)</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>
              {turns.length} turns
            </span>
            <span className="spacer" />
          </div>
          <div className="conv-body" ref={bodyRef}>
            {turns.map(t => (
              <Message key={t.id} from={t.from} variant="compact" meta={t.meta}>
                {t.body}
              </Message>
            ))}
          </div>
          {notAtBottom &&
            (unread > 0 ? (
              <button
                className="conv-jump"
                onClick={() => { scrollToBottom(true); setUnread(0); }}
                aria-label={`Jump to latest — ${unread} new messages`}
              >
                <span className="n">{unread}</span>
                <span>new</span>
              </button>
            ) : (
              <button className="conv-jump is-bare" onClick={() => scrollToBottom(true)} aria-label="Jump to latest" />
            ))}
        </div>
      );
    }
    return <Live />;
  },
};

/**
 * In context — a full interactive thread routed through the bound Conversation: assistant turn
 * carries a MessageActions toolbar with a controlled vote, and the reply streams.
 */
export const InContext: Story = {
  args: { title: undefined },
  render: () => {
    function Thread() {
      const [vote, setVote] = React.useState<'up' | 'down' | null>(null);
      return (
        <Conversation title="Forge AI · Engineering Intelligence">
          <Message from="user" variant="compact" userAvatar={{ initials: 'LM', name: 'Leonardo Mariga' }}>
            Which T1 services are at risk of breaching SLO this week?
          </Message>
          <Message
            from="assistant"
            variant="compact"
            meta={
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
                Forge AI · Sonnet 4.6 · just now
              </span>
            }
            actions={<MessageActions vote={vote} onVote={setVote} onCopy={() => {}} onRegen={() => {}} />}
          >
            Two services are at elevated risk: <strong>pix-router</strong> (p95 89 ms, trending up
            after PR #7421) and <strong>bureau-gateway</strong> (p95 218 ms, a GMUD-gated schema
            migration is scheduled for Tuesday 01:00 BRT). All other T1 services are within normal
            operating ranges.
          </Message>
          <Message from="user" variant="compact" userAvatar={{ initials: 'LM', name: 'Leonardo Mariga' }}>
            Open a risk summary for both and tag the owners.
          </Message>
          <Message from="assistant" variant="compact" streaming>
            Drafting risk summaries for pix-router and bureau-gateway
          </Message>
        </Conversation>
      );
    }
    return <Thread />;
  },
};
