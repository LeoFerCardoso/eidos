import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  HistoryShell,
  HistoryGroup,
  HistoryItem,
} from '@eidos/ui';
import type { HistoryThread } from '@eidos/ui';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const TODAY_THREADS: HistoryThread[] = [
  {
    id: 'thr-1',
    title: 'Pix Router latency spike — root cause',
    preview: 'Analyzed p95 latency regression in fraud-engine after 14:02 deploy',
    active: true,
    starred: true,
  },
  {
    id: 'thr-2',
    title: 'Rollback strategy for payments-api v4.2.1',
    preview: 'Drafted staged rollback plan with ring-0 canary validation',
  },
];

const YESTERDAY_THREADS: HistoryThread[] = [
  {
    id: 'thr-3',
    title: 'Auth service token expiry edge cases',
    preview: 'Reviewed JWT refresh-token overlap window with 5s clock skew',
    starred: true,
  },
  {
    id: 'thr-4',
    title: 'INC-9812 timeline reconstruction',
    preview: 'Mapped alert → detection → mitigation events from runbook logs',
  },
];

const LAST_WEEK_THREADS: HistoryThread[] = [
  {
    id: 'thr-5',
    title: 'Deploy pipeline for feature/risk-score-v2',
    preview: 'Generated GitHub Actions workflow with approval gates per ring',
  },
  {
    id: 'thr-6',
    title: 'Infra cost attribution — Q2 review',
    preview: 'Summarised EC2 vs Fargate spend by BU for FinOps meeting',
  },
  {
    id: 'thr-7',
    title: 'Observability stack for new ML endpoints',
    preview: 'Recommended OTEL + Prometheus scrape config for scoring service',
  },
];

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: 'AI/HistoryShell',
  component: HistoryShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A 280 px sidebar rail that houses the full conversation history. ' +
          'Renders a "New chat" CTA, a search field, and thread rows bucketed ' +
          'by recency (Today / Yesterday / Last week). ' +
          'Use it as the left rail of an AI chat layout; pass `fluid` when ' +
          'mounting inside a slide-out drawer so it fills the drawer width.',
      },
    },
  },
  args: {
    fluid: false,
    query: '',
    showActions: true,
  },
  argTypes: {
    fluid: { control: 'boolean' },
    showActions: { control: 'boolean' },
    query: { control: 'text' },
  },
} satisfies Meta<typeof HistoryShell>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ───────────────────────────────────────────────────────────────────

/** Default rail — three recency buckets with realistic agent/DevEx thread titles. */
export const Default: Story = {
  render: (args) => (
    <div style={{ display: 'flex', width: 280 }}>
      <HistoryShell {...args}>
        <div className="ai-hist-list">
          <HistoryGroup label="Today" threads={TODAY_THREADS} />
          <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} />
          <HistoryGroup label="Last week" threads={LAST_WEEK_THREADS} />
        </div>
      </HistoryShell>
    </div>
  ),
};

/** Empty state — no threads yet; the rail shows only the CTA and search field. */
export const Empty: Story = {
  render: (args) => (
    <div style={{ display: 'flex', width: 280 }}>
      <HistoryShell {...args}>
        <div className="ai-hist-list">
          <div className="ai-hist-empty">
            <span>No history yet</span>
            <span>Start a new chat to begin</span>
          </div>
        </div>
      </HistoryShell>
    </div>
  ),
};

/** Search active — query pre-populates the search field and highlights matching substrings in thread titles. */
export const SearchActive: Story = {
  args: { query: 'rollback' },
  render: (args) => (
    <div style={{ display: 'flex', width: 280 }}>
      <HistoryShell {...args}>
        <div className="ai-hist-list">
          <HistoryGroup
            label="Today"
            threads={TODAY_THREADS}
            query={args.query}
          />
          <HistoryGroup
            label="Yesterday"
            threads={YESTERDAY_THREADS}
            query={args.query}
          />
        </div>
      </HistoryShell>
    </div>
  ),
};

/** Fluid — fills container width; use inside slide-out drawers or mobile viewports. */
export const Fluid: Story = {
  args: { fluid: true },
  render: (args) => (
    <div style={{ display: 'flex', width: '100%', maxWidth: 360 }}>
      <HistoryShell {...args}>
        <div className="ai-hist-list">
          <HistoryGroup label="Today" threads={TODAY_THREADS} />
          <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} />
        </div>
      </HistoryShell>
    </div>
  ),
};

/**
 * Variants side-by-side — default rail, fluid rail with search active, and rail
 * without the panel-toggle action button. Covers the key prop combinations in one view.
 */
export const Variants: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 24,
        padding: 24,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      {/* Default — fixed width, panel toggle visible */}
      <div>
        <p
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--fg-muted)',
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Default
        </p>
        <div style={{ width: 280 }}>
          <HistoryShell>
            <div className="ai-hist-list">
              <HistoryGroup label="Today" threads={TODAY_THREADS} />
              <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} />
              <HistoryGroup label="Last week" threads={LAST_WEEK_THREADS} />
            </div>
          </HistoryShell>
        </div>
      </div>

      {/* Search active */}
      <div>
        <p
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--fg-muted)',
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Search active
        </p>
        <div style={{ width: 280 }}>
          <HistoryShell query="deploy">
            <div className="ai-hist-list">
              <HistoryGroup
                label="Today"
                threads={TODAY_THREADS}
                query="deploy"
              />
              <HistoryGroup
                label="Last week"
                threads={LAST_WEEK_THREADS}
                query="deploy"
              />
            </div>
          </HistoryShell>
        </div>
      </div>

      {/* No panel-toggle action */}
      <div>
        <p
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--fg-muted)',
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          showActions=false
        </p>
        <div style={{ width: 280 }}>
          <HistoryShell showActions={false}>
            <div className="ai-hist-list">
              <HistoryGroup label="Today" threads={TODAY_THREADS} />
              <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} />
            </div>
          </HistoryShell>
        </div>
      </div>

      {/* Individual HistoryItem states */}
      <div>
        <p
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--fg-muted)',
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Item states
        </p>
        <div
          style={{
            width: 280,
            border: '1px solid var(--border)',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          <HistoryItem
            thread={{
              id: 'st-1',
              title: 'Active — fraud-engine debug session',
              preview: 'Currently open thread',
              active: true,
            }}
          />
          <HistoryItem
            thread={{
              id: 'st-2',
              title: 'Starred — INC-9812 timeline',
              preview: 'Pinned for quick access',
              starred: true,
            }}
          />
          <HistoryItem
            thread={{
              id: 'st-3',
              title: 'Regular thread',
              preview: 'No special state applied',
            }}
          />
        </div>
      </div>
    </div>
  ),
};
