import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Response, MessageActions, ProseCode } from '@eidos/ui';

const meta = {
  title: 'AI/Response',
  component: Response,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Long-form, bubble-less model output — the "streamdown" surface. Real heading hierarchy, a ' +
          '68ch prose body, and wide blocks (tables, code, diagrams, captioned figures) that escape the ' +
          'prose cap. The streaming caret rides the tail of the live block. Pass already-rendered prose ' +
          'nodes as children — the DS does not bundle a markdown renderer.',
      },
    },
  },
  args: {
    from: 'assistant',
    streaming: false,
    meta: (
      <>
        <span className="name">Eidos AI</span>
        <span className="dot" />
        <span>14:02 · gpt-5</span>
      </>
    ),
    children: (
      <>
        <h2>What changed in 0421</h2>
        <p>
          Three things shipped together — none of them broke in isolation, but their interaction is why
          the on-call paged at 02:14.
        </p>
        <ol>
          <li>
            <b>grpc retry budget</b> bumped from <code>3</code> to <code>8</code> in{' '}
            <code>config/grpc.toml</code>.
          </li>
          <li>
            <b>identity-svc pool size</b> doubled (16 → 32) to absorb the migration burst.
          </li>
          <li>
            <b>Datadog metric rename</b> — <code>svc.latency.p99</code> → <code>svc.lat.p99</code>. Old
            alerts still bound to the old name.
          </li>
        </ol>
      </>
    ),
  },
  argTypes: {
    from: { control: 'inline-radio', options: ['assistant', 'user'] },
    streaming: { control: 'boolean' },
  },
} satisfies Meta<typeof Response>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Usage — a multi-paragraph model answer with a mono meta row and no bubble (args-driven). */
export const Default: Story = {};

/** Rich body — headings + a wide table + a code block + an attributable blockquote, with the response actions toolbar. */
export const RichBody: Story = {
  render: () => {
    function Demo() {
      const [vote, setVote] = React.useState<'up' | 'down' | null>(null);
      return (
        <Response
          meta={
            <>
              <span className="name">Eidos AI</span>
              <span className="dot" />
              <span>14:08 · gpt-5</span>
            </>
          }
          actions={
            <MessageActions
              surface="response"
              vote={vote}
              onVote={setVote}
              onCopy={() => {}}
              onRegen={() => {}}
              onShare={() => {}}
            />
          }
        >
          <h2>Migration plan</h2>
          <p>
            Run the dry-run first, then promote in two canary steps. Each step is reversible; the full
            roll is the only one-way door.
          </p>
          <ProseCode lang="bash">{`eidos migrate --dry-run --target=billing-svc
eidos migrate --promote --canary=10%
eidos migrate --promote --canary=100%`}</ProseCode>
          <h3>Owners + ETAs</h3>
          <table>
            <thead>
              <tr>
                <th>Step</th>
                <th>Owner</th>
                <th className="num">ETA</th>
                <th>Rollback</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dry-run</td>
                <td>infra</td>
                <td className="num">5 min</td>
                <td>n/a</td>
              </tr>
              <tr>
                <td>Canary 10%</td>
                <td>billing</td>
                <td className="num">12 min</td>
                <td>
                  <code>eidos canary --revert</code>
                </td>
              </tr>
              <tr>
                <td>Full roll</td>
                <td>billing</td>
                <td className="num">3 min</td>
                <td>previous-release pin</td>
              </tr>
            </tbody>
          </table>
          <blockquote>
            The pool-size bump is the load-bearing change here — everything else is bookkeeping.
            <cite>migration-plan-0422.md · L4</cite>
          </blockquote>
        </Response>
      );
    }
    return <Demo />;
  },
};

/** Diagrams & figures — a Response with a bordered .ai-diagram figure slot and a mono figcaption. */
export const Diagram: Story = {
  render: () => (
    <Response
      meta={
        <>
          <span className="name">Eidos AI</span>
        </>
      }
    >
      <h2>How the request flows</h2>
      <p>
        The retry storm comes from the <code>edge → billing-svc</code> path. Identity is touched on
        every hop but stays cold.
      </p>
      <figure className="ai-diagram">
        <svg
          viewBox="0 0 600 220"
          width="100%"
          style={{ maxWidth: 600, height: 'auto' }}
          aria-hidden="true"
        >
          <defs>
            <marker
              id="r-arr"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--fg-muted)" />
            </marker>
          </defs>
          <g fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg)" textAnchor="middle">
            <rect x="20" y="80" width="110" height="56" rx="8" fill="var(--surface)" stroke="var(--border-strong)" />
            <text x="75" y="105">client</text>
            <rect x="170" y="80" width="120" height="56" rx="8" fill="var(--surface)" stroke="var(--border-strong)" />
            <text x="230" y="105">edge router</text>
            <rect x="330" y="124" width="120" height="56" rx="8" fill="var(--ember-soft)" stroke="var(--ember)" />
            <text x="390" y="149" fill="var(--ember-text)">billing-svc</text>
            <text x="390" y="164" fill="var(--ember-text)" fontSize="9.5">retry × 8</text>
            <rect x="490" y="80" width="90" height="56" rx="8" fill="var(--surface)" stroke="var(--border-strong)" />
            <text x="535" y="105">postgres</text>
          </g>
          <g stroke="var(--fg-muted)" strokeWidth="1.2" fill="none" markerEnd="url(#r-arr)">
            <line x1="130" y1="108" x2="170" y2="108" />
            <path d="M 290 116 Q 310 116 330 152" />
            <line x1="450" y1="152" x2="490" y2="116" />
          </g>
        </svg>
        <figcaption>fig. 1 — request path through the 0421 stack. The accent edge is where retries amplify.</figcaption>
      </figure>
    </Response>
  ),
};

/** Streaming — the caret rides the live character, walking heading → paragraph → list token by token. */
export const Streaming: Story = {
  render: () => {
    const SCRIPT: { tag?: string; text?: string; items?: string[] }[] = [
      { tag: 'h3', text: 'Three things to check' },
      { tag: 'p', text: 'Each is reversible — start with the cheapest first.' },
      {
        tag: 'ul',
        items: [
          'grpc.toml — retry budget bumped from 3 to 8',
          'Datadog — svc.lat.p99 alert binding broke on rename',
          'deploy diff — last 24 hours, two services',
        ],
      },
    ];
    const TOTAL = SCRIPT.reduce(
      (sum, b) =>
        sum +
        (b.text ? b.text.length : 0) +
        (b.items ? b.items.reduce((s, t) => s + t.length, 0) : 0),
      0
    );

    function Demo() {
      const [n, setN] = React.useState(0);
      React.useEffect(() => {
        if (n >= TOTAL) {
          const t = setTimeout(() => setN(0), 1800);
          return () => clearTimeout(t);
        }
        const t = setTimeout(() => setN(n + 1), 28);
        return () => clearTimeout(t);
      }, [n]);
      const done = n >= TOTAL;

      let remaining = n;
      const blocks: React.ReactNode[] = [];
      for (let i = 0; i < SCRIPT.length; i++) {
        if (remaining <= 0) break;
        const b = SCRIPT[i];
        if (b.text != null) {
          const slice = b.text.slice(0, remaining);
          const Tag = b.tag as React.ElementType;
          blocks.push(<Tag key={i}>{slice}</Tag>);
          remaining -= b.text.length;
        } else if (b.items) {
          const lis: React.ReactNode[] = [];
          for (let j = 0; j < b.items.length; j++) {
            if (remaining <= 0) break;
            const txt = b.items[j];
            lis.push(<li key={j}>{txt.slice(0, remaining)}</li>);
            remaining -= txt.length;
          }
          if (lis.length) blocks.push(<ul key={i}>{lis}</ul>);
        }
      }

      return (
        <Response
          streaming={!done}
          meta={
            <>
              <span className="name">Eidos AI</span>
              <span className="dot" />
              <span>{done ? 'just now' : 'streaming…'}</span>
            </>
          }
        >
          {blocks}
        </Response>
      );
    }
    return <Demo />;
  },
};

/** In context — document-mode flow: a compact user-question bubble above a full assistant Response. */
export const DocumentFlow: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: 880, display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--ember-soft)',
            border: '1px solid var(--ember-border)',
            borderRadius: 'var(--radius-2xl)',
            borderEndEndRadius: 4,
            fontSize: 'var(--text-md)',
            lineHeight: 1.55,
            maxWidth: '70%',
            color: 'var(--fg)',
          }}
        >
          Walk me through the 0421 release — what changed and why on-call paged.
        </div>
      </div>
      <Response
        meta={
          <>
            <span className="name">Eidos AI</span>
            <span className="dot" />
            <span>14:02 · gpt-5</span>
          </>
        }
      >
        <h2>What changed in 0421</h2>
        <p>
          Three things shipped together — none of them broke in isolation, but their interaction is why
          the on-call paged at 02:14.
        </p>
        <ol>
          <li>
            <b>grpc retry budget</b> bumped from <code>3</code> to <code>8</code>.
          </li>
          <li>
            <b>identity-svc pool size</b> doubled (16 → 32).
          </li>
          <li>
            <b>Datadog metric rename</b> — old alerts still bound to the old name.
          </li>
        </ol>
      </Response>
    </div>
  ),
};
