import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Citation, Sources } from '@eidos/ui';
import type { CitationSource } from '@eidos/ui';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const SRC_RINGS: CitationSource = {
  id: 1,
  domain: 'docs.eidosplatform.io',
  title: 'Pix Router — Ring deployment model',
  url: 'https://docs.eidosplatform.io/pix-router/rings',
  snippet:
    'The ring deployment model gates each release through a sequence of traffic slices (Ring 0–4) with automatic rollback on SLO breach.',
  fetched: '14:01 · 18s ago',
};

const SRC_IDEMPOTENCY: CitationSource = {
  id: 2,
  domain: 'github.com',
  title: 'PR #7421 · idempotency keys for retries',
  url: 'https://github.com/org/pix-router/pull/7421',
  snippet:
    'Adds idempotency keys to all outbound Pix calls to prevent duplicate transactions on retry. Risk score: 34 / low.',
  fetched: '14:01 · 20s ago',
};

const SRC_ADR: CitationSource = {
  id: 3,
  domain: 'confluence.internal',
  title: 'ADR-006 — async-first inter-tribe communication',
  url: 'https://confluence.internal/adr/006',
  snippet:
    'All inter-tribe calls MUST be async (event-bus) unless the use case is user-facing and latency-sensitive.',
  fetched: '14:02 · 1m ago',
};

const SRC_LATENCY: CitationSource = {
  id: 4,
  domain: 'grafana.internal',
  title: 'bureau-gateway p95 latency dashboard',
  url: 'https://grafana.internal/d/bureau-gw',
  snippet: 'p95 latency: 218 ms. SLO threshold: 250 ms. Current health: green.',
  fetched: '14:02 · 1m ago',
};

const SRC_NO_FETCH: CitationSource = {
  id: 5,
  domain: 'runbooks.eidosplatform.io',
  title: 'Bureau Gateway · Provider failover',
  url: 'https://runbooks.eidosplatform.io/bureau-failover',
  snippet:
    'Execute the failover by toggling the `BUREAU_PROVIDER` feature flag to the secondary endpoint.',
};

// ── Demo wrappers ──────────────────────────────────────────────────────────────
// A response paragraph rendered in the AI prose voice. Citation chips live inline
// in this text flow — that is the only place a raw px fontSize is acceptable (it
// approximates the rendered model-response body), never invented chrome.

/** A model-response paragraph: Geist Sans, prose line-height, default ink. */
const Prose: React.FC<React.PropsWithChildren<{ maxWidth?: number }>> = ({ children, maxWidth }) => (
  <p
    style={{
      maxWidth,
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: 1.7,
      color: 'var(--fg)',
      margin: 0,
    }}
  >
    {children}
  </p>
);

/** A mono eyebrow caption above a demo row (uses the token type scale). */
const Eyebrow: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span
    style={{
      display: 'block',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      letterSpacing: '0.04em',
      color: 'var(--fg-muted)',
      marginBlockEnd: 6,
    }}
  >
    {children}
  </span>
);

// ── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'AI/Citation',
  component: Citation,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An inline superscript chip that opens a hover/focus popover with the source domain, ' +
          'title, snippet, and URL. Use `tone="ember"` for grounded model claims backed by a ' +
          'retrieved source; use `tone="neutral"` for ungrounded or low-confidence references. ' +
          'Pair with the `Sources` panel — chip rank `n` must match the panel entry rank.',
      },
    },
  },
  args: {
    n: 1,
    source: SRC_RINGS,
    tone: 'ember',
  },
  argTypes: {
    n: { control: 'number' },
    tone: { control: 'inline-radio', options: ['ember', 'neutral'] },
    href: { control: 'text' },
  },
} satisfies Meta<typeof Citation>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ───────────────────────────────────────────────────────────────────

/** Default — ember chip with a source popover. Hover or focus the chip to reveal the popover. */
export const Default: Story = {
  render: (args) => (
    <Prose>
      The Pix Router uses a ring-based deployment model
      <Citation {...args} />
      {' '}that gates each release through traffic slices (Ring 0–4) with
      automatic SLO rollback.
    </Prose>
  ),
};

/** Tone variants — ember (grounded claim) vs neutral (ungrounded or low-confidence). */
export const Variants: Story = {
  name: 'Tone variants',
  parameters: {
    docs: {
      description: {
        story:
          '`ember` matches the accent and signals a retrieval-grounded claim. ' +
          '`neutral` uses a muted treatment for unverified or low-confidence references.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Ember — grounded */}
      <div>
        <Eyebrow>tone=&quot;ember&quot; — grounded claim</Eyebrow>
        <Prose>
          The ring model automatically rolls back deployments that breach their SLO
          <Citation n={1} source={SRC_RINGS} tone="ember" />
          {' '}within one ring cycle (~8 min).
        </Prose>
      </div>

      {/* Neutral — ungrounded */}
      <div>
        <Eyebrow>tone=&quot;neutral&quot; — ungrounded reference</Eyebrow>
        <Prose>
          Based on general platform convention
          <Citation n={2} tone="neutral" />
          {' '}cross-tribe calls should prefer the async event-bus path.
        </Prose>
      </div>

      {/* No popover — source omitted */}
      <div>
        <Eyebrow>no source prop — popover silenced</Eyebrow>
        <Prose>
          See ADR-006
          <Citation n={3} tone="ember" />
          {' '}for the authoritative definition of async-first inter-tribe communication.
        </Prose>
      </div>
    </div>
  ),
};

/** Multiple chips — four inline citations in a single response paragraph. */
export const MultipleInline: Story = {
  name: 'Multiple inline chips',
  parameters: {
    docs: {
      description: {
        story:
          'Shows four citation chips in one response paragraph. Each chip `n` maps to its ' +
          'corresponding entry in the `Sources` panel — never re-rank after grounding.',
      },
    },
  },
  render: () => (
    <Prose maxWidth={620}>
      Three changes shipped together: the ring deployment model
      <Citation n={1} source={SRC_RINGS} />
      {' '}gates rollout, PR #7421 adds idempotency keys
      <Citation n={2} source={SRC_IDEMPOTENCY} />
      {' '}to prevent duplicate transactions, ADR-006
      <Citation n={3} source={SRC_ADR} />
      {' '}mandates async-first calls, and bureau-gateway p95 was already at 218 ms
      <Citation n={4} source={SRC_LATENCY} />
      {' '}before the retry budget change amplified load.
    </Prose>
  ),
};

/** Source without fetched timestamp — `fetched` is optional; footer omits the clock row. */
export const NoFetchedTimestamp: Story = {
  name: 'Source without timestamp',
  args: {
    n: 5,
    source: SRC_NO_FETCH,
    tone: 'ember',
  },
  render: (args) => (
    <Prose>
      Trigger provider failover via the feature flag
      <Citation {...args} />
      {' '}documented in the Bureau Gateway runbook.
    </Prose>
  ),
};

/** href override — link target is overridden independently of source.url. */
export const HrefOverride: Story = {
  name: 'Custom href override',
  args: {
    n: 1,
    source: SRC_RINGS,
    href: 'https://docs.eidosplatform.io/pix-router/changelog',
    tone: 'ember',
  },
  render: (args) => (
    <Prose>
      The ring model changelog tracks every deployment decision
      <Citation {...args} />
      {' '}with diffable config snapshots.
    </Prose>
  ),
};

/**
 * In context — the canonical pattern: a response paragraph with inline chips
 * above a Sources panel. Each chip `n` matches the panel entry rank (its `id`):
 * the number is the only link between the two surfaces. Tap a chip to verify,
 * then fall into the matching numbered entry below. Never re-rank.
 */
export const InContext: Story = {
  name: 'In context — inline + sources',
  parameters: {
    docs: {
      description: {
        story:
          "The doc page's headline pattern: response prose above the numbered Sources panel. " +
          'Chip `n=1..4` maps one-to-one to the panel entries (`id` 1..4) — the shared ' +
          'numbering contract is the whole thesis of the component. Compose `Citation` with ' +
          'the sibling `Sources` panel from @eidos/ui.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 720 }}>
      <Prose>
        Three changes shipped together — none broke in isolation, but their interaction is why
        on-call paged: the ring deployment model
        <Citation n={1} source={SRC_RINGS} />
        {' '}gates rollout, PR #7421 added idempotency keys
        <Citation n={2} source={SRC_IDEMPOTENCY} />
        {' '}to prevent duplicate Pix transactions, ADR-006
        <Citation n={3} source={SRC_ADR} />
        {' '}mandates async-first inter-tribe calls, and bureau-gateway p95 was already at 218 ms
        <Citation n={4} source={SRC_LATENCY} />
        {' '}before the retry budget amplified load.
      </Prose>
      <Sources sources={[SRC_RINGS, SRC_IDEMPOTENCY, SRC_ADR, SRC_LATENCY]} />
    </div>
  ),
};
