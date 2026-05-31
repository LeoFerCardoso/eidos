import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Sources, SourcesPanel, Citation, Empty, Icons } from '@eidos/ui';
import type { CitationSource } from '@eidos/ui';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const SOURCES: CitationSource[] = [
  { id: 1, domain: 'docs.eidosplatform.io', title: 'Pix Router — Ring deployment model', url: 'https://docs.eidosplatform.io/pix-router/rings', snippet: 'The ring deployment model gates each release through a sequence of traffic slices (Ring 0–4) with automatic rollback on SLO breach.', fetched: '14:01 · 18s ago' },
  { id: 2, domain: 'github.com', title: 'PR #7421 · idempotency keys for retries', url: 'https://github.com/org/pix-router/pull/7421', snippet: 'Adds idempotency keys to all outbound Pix calls to prevent duplicate transactions on retry. Risk score: 34 / low.', fetched: '14:01 · 20s ago' },
  { id: 3, domain: 'confluence.internal', title: 'ADR-006 — async-first inter-tribe communication', url: 'https://confluence.internal/adr/006', snippet: 'All inter-tribe calls MUST be async (event-bus) unless the use case is user-facing and latency-sensitive.', fetched: '14:02 · 1m ago' },
  { id: 4, domain: 'grafana.internal', title: 'bureau-gateway p95 latency dashboard', url: 'https://grafana.internal/d/bureau-gw', snippet: 'p95 latency: 218 ms. SLO threshold: 250 ms. Current health: green.', fetched: '14:02 · 1m ago' },
  { id: 5, domain: 'runbooks.eidosplatform.io', title: 'Bureau Gateway · Provider failover', url: 'https://runbooks.eidosplatform.io/bureau-failover', snippet: 'Execute the failover by toggling the `BUREAU_PROVIDER` feature flag to the secondary endpoint.', fetched: '14:03 · 2m ago' },
  { id: 6, domain: 'docs.eidosplatform.io', title: 'Fraud Engine — null user_agent handling', url: 'https://docs.eidosplatform.io/fraud-engine/known-issues', snippet: 'When user_agent is null the scoring pipeline raises a NullPointerException. Fixed in v3.4.7.', fetched: '14:03 · 2m ago' },
];

// ── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'AI/Sources',
  component: Sources,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A numbered sources panel rendered below an AI response, pairing with `Citation` inline ' +
          'chips. The rank number is the contract between the two layers — chip [n] always points to ' +
          'panel entry [n], never re-ranked. Supports collapsible disclosure, pagination, and an ' +
          'optional `onSelect` intercept. `SourcesPanel` is a backward-compat alias.',
      },
    },
  },
  args: {
    sources: SOURCES,
    title: 'Sources',
    collapsible: true,
    defaultOpen: true,
    countNoun: 'findings',
    perPage: 5,
  },
  argTypes: {
    title: { control: 'text' },
    collapsible: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    countNoun: { control: 'text' },
    perPage: { control: 'number' },
  },
} satisfies Meta<typeof Sources>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — the panel driven by args. Toggle `collapsible`, `defaultOpen`,
 *  `perPage`, and `countNoun` from the controls to see every documented mode. */
export const Default: Story = {};

/** Density — the panel adapts to any source count. Optimal is 3–5; toggle the
 *  count to compare a single entry against a tall, scrollable list. */
export const Density: Story = {
  name: 'Density (1 · 2 · 3 · 5)',
  render: () => {
    function Demo() {
      const [count, setCount] = React.useState(3);
      return (
        <div style={{ width: '100%', maxWidth: 720 }}>
          <div className="btn-group" role="group" aria-label="Number of sources" style={{ marginBottom: 14 }}>
            {[1, 2, 3, 5].map((n) => (
              <button
                key={n}
                className={'btn xs ' + (count === n ? 'ember' : 'outline')}
                onClick={() => setCount(n)}
              >
                {n} source{n > 1 ? 's' : ''}
              </button>
            ))}
          </div>
          <Sources sources={SOURCES.slice(0, count)} collapsible={false} />
        </div>
      );
    }
    return <Demo />;
  },
};

/** Collapsible — hidden behind a "{title} · N {countNoun}" disclosure for compact
 *  contexts (sidesheets, hover-cards, narrow columns). Click the header to toggle. */
export const Collapsible: Story = {
  args: { sources: SOURCES.slice(0, 3), collapsible: true, defaultOpen: true },
};

/** Collapsed on load — the disclosure surfaces the count while saving vertical space. */
export const CollapsedOnLoad: Story = {
  name: 'Collapsible — collapsed on load',
  args: { sources: SOURCES.slice(0, 3), collapsible: true, defaultOpen: false },
};

/** Non-collapsible — for full-width chat surfaces the expanded form is clearer; the
 *  panel header is a plain div, not a button. */
export const NotCollapsible: Story = {
  name: 'Non-collapsible',
  args: { sources: SOURCES.slice(0, 3), collapsible: false },
};

/** Pagination — when `sources.length > perPage` (5 by default) the panel paginates:
 *  the leading/trailing arrows step through, the centre shows "1–5 of N". */
export const Paginated: Story = {
  args: { sources: SOURCES, perPage: 3, collapsible: false },
};

/** Empty state — when no sources were retrieved (the model answered from training
 *  data only), render the panel chrome with an `Empty` body rather than hiding it.
 *  Making the absence of grounding explicit is more honest than silence. */
export const EmptyState: Story = {
  name: 'Empty (ungrounded answer)',
  render: () => (
    <div style={{ width: '100%', maxWidth: 600 }}>
      <div className="ai-cite-panel">
        <div className="ai-cite-panel-head">
          <span className="label">Sources</span>
          <span className="count">0 findings</span>
        </div>
        <Empty
          size="sm"
          iconName="link"
          title="No sources retrieved"
          desc="This answer was not grounded in retrieved documents."
        />
      </div>
    </div>
  ),
};

/** Custom link handler — when `onSelect` is provided, the title links become buttons
 *  (`role="option"` in a listbox) and the handler receives the source object instead
 *  of opening the URL. Useful for in-app preview drawers that must not lose state. */
export const CustomLinkHandler: Story = {
  name: 'Custom onSelect handler',
  render: () => {
    function Demo() {
      const [selected, setSelected] = React.useState('');
      return (
        <div style={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Sources
            sources={SOURCES.slice(0, 3)}
            collapsible={false}
            onSelect={(s) => setSelected(s.title)}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', minHeight: 16 }}>
            {selected ? `selected: ${selected}` : 'click a source to select'}
          </span>
        </div>
      );
    }
    return <Demo />;
  },
};

/** SourcesPanel alias — `SourcesPanel` is the backward-compat alias; identical to `Sources`. */
export const SourcesPanelAlias: Story = {
  name: 'SourcesPanel (alias)',
  render: () => <SourcesPanel sources={SOURCES.slice(0, 3)} collapsible={false} />,
};

/** Citation — ember chip for a grounded claim, with the hover/focus popover. */
export const CitationEmber: Story = {
  name: 'Citation — ember (grounded)',
  render: () => (
    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.6, color: 'var(--fg)', maxWidth: 560 }}>
      The Pix Router uses a ring-based deployment model
      <Citation n={1} source={SOURCES[0]} tone="ember" />{' '}
      that gates each release through traffic slices with automatic SLO rollback.
    </p>
  ),
};

/** Citation — neutral chip for an ungrounded reference (no `source` popover). */
export const CitationNeutral: Story = {
  name: 'Citation — neutral (ungrounded)',
  render: () => (
    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.6, color: 'var(--fg)', maxWidth: 560 }}>
      Based on general documentation
      <Citation n={1} tone="neutral" />{' '}
      the recommended approach is async-first communication.
    </p>
  ),
};

/** In context — the canonical pattern: assistant prose carrying inline `Citation`
 *  chips, with the `Sources` panel immediately below. The numbering is identical
 *  across both surfaces — never re-rank. */
export const InContext: Story = {
  render: () => (
    <div style={{ maxWidth: 640, fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--fg)', margin: 0 }}>
        The Pix Router uses a ring deployment model
        <Citation n={1} source={SOURCES[0]} />{' '}
        where PR #7421 adds idempotency keys
        <Citation n={2} source={SOURCES[1]} />{' '}
        to prevent duplicate transactions. This change is bounded to Ring 0→2 and respects
        ADR-006
        <Citation n={3} source={SOURCES[2]} />{' '}
        for async-first inter-tribe communication.
      </p>
      <Sources sources={SOURCES} title="Sources" />
    </div>
  ),
};

/** Response with inline citations — the full grounded-answer composition: an assistant
 *  response with inline `Citation` chips in its body, followed by the `Sources` panel.
 *  Chip numbers map directly to panel entries — never re-rank. */
export const ResponseWithCitations: Story = {
  name: 'Response with inline citations',
  render: () => {
    function Demo() {
      const [vote, setVote] = React.useState<'up' | 'down' | null>(null);
      return (
        <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Response with inline citations */}
          <div className="ai-resp assistant" role="article" aria-roledescription="assistant response">
            <div className="ai-resp-stack">
              <div className="ai-resp-meta" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>
                Eidos AI · Sonnet 4.6 · just now
              </div>
              <div className="ai-prose">
                <h3>What caused the pix-router p95 spike?</h3>
                <p>
                  Three things shipped together — none broke in isolation, but their interaction
                  is why on-call paged at 02:14<Citation n={1} source={SOURCES[0]} />.
                </p>
                <ul>
                  <li>
                    <b>gRPC retry budget</b> bumped from <code>3</code> to <code>8</code> in{' '}
                    <code>config/grpc.toml</code><Citation n={2} source={SOURCES[1]} />.
                  </li>
                  <li>
                    <b>identity-svc pool</b> doubled (16 → 32) to absorb the migration
                    burst<Citation n={3} source={SOURCES[2]} />.
                  </li>
                  <li>
                    <b>Datadog metric rename</b> — old alert binding silently
                    broke<Citation n={4} source={SOURCES[3]} />.
                  </li>
                </ul>
                <p>
                  Bureau gateway p95 was already at 218 ms<Citation n={4} source={SOURCES[3]} />{' '}
                  — adding the retry amplification pushed pix-router past its 200 ms SLO.
                  Rolling back to 2.6.9 restores normal latency within one ring cycle (~8 min).
                </p>
              </div>
              <div className="ai-resp-actions" style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                <button className="ai-resp-action" aria-label="Copy response">
                  <Icons.copy size={14} />
                </button>
                <button
                  className={'ai-resp-action thumb-up' + (vote === 'up' ? ' is-on' : '')}
                  aria-pressed={vote === 'up'}
                  onClick={() => setVote((v) => (v === 'up' ? null : 'up'))}
                  aria-label="Helpful"
                >
                  <Icons.check size={14} />
                </button>
                <button
                  className={'ai-resp-action thumb-down' + (vote === 'down' ? ' is-on' : '')}
                  aria-pressed={vote === 'down'}
                  onClick={() => setVote((v) => (v === 'down' ? null : 'down'))}
                  aria-label="Not helpful"
                >
                  <Icons.x size={14} />
                </button>
              </div>
            </div>
          </div>
          {/* Sources panel */}
          <Sources sources={SOURCES} title="Sources" defaultOpen collapsible />
        </div>
      );
    }
    return <Demo />;
  },
};
