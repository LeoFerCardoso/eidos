import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HistoryGroup } from '@eidos/ui';
import type { HistoryThread } from '@eidos/ui';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const TODAY_THREADS: HistoryThread[] = [
  {
    id: 'th-001',
    title: 'Diagnose Pix router latency spike',
    preview: 'p95 jumped to 1.8 s after the 14:02 deploy — checking circuit breakers…',
    active: true,
  },
  {
    id: 'th-002',
    title: 'Generate rollback script for fraud-engine v4.1',
    preview: 'deployctl.rollback({ service: "fraud-engine", version: "4.0.9" })',
    starred: true,
  },
  {
    id: 'th-003',
    title: 'Summarise INC-9812 post-mortem',
    preview: 'Feature store returned stale data; scoring chain retried 3× before tripping.',
  },
];

const YESTERDAY_THREADS: HistoryThread[] = [
  {
    id: 'th-010',
    title: 'Draft runbook for canary ring-0 rollout',
    preview: 'Step 1: validate feature flags; step 2: ship to ring-0 (1 % traffic)…',
    starred: true,
  },
  {
    id: 'th-011',
    title: 'Explain variance in A/B conversion metrics',
    preview: 'The checkout cohort shows a 2.4 % lift but the confidence interval is wide.',
  },
];

const LAST_WEEK_THREADS: HistoryThread[] = [
  {
    id: 'th-020',
    title: 'Map IAM permissions for data-pipeline service account',
    preview: 'Needs storage.objectAdmin on gs://eidos-pipeline-prod and BigQuery jobUser.',
  },
  {
    id: 'th-021',
    title: 'Optimise cold-start time for auth-lambda',
    preview: 'Bundle size: 4.1 MB → 1.2 MB after excluding AWS SDK v2 from layer.',
  },
  {
    id: 'th-022',
    title: 'Review PR #2047 — rate-limiter middleware',
    preview: 'Token bucket implementation looks correct; left comments on edge-case handling.',
  },
];

const STARRED_THREADS: HistoryThread[] = [
  {
    id: 'th-030',
    title: 'Generate rollback script for fraud-engine v4.1',
    preview: 'deployctl.rollback({ service: "fraud-engine", version: "4.0.9" })',
    starred: true,
    active: false,
  },
  {
    id: 'th-031',
    title: 'Draft runbook for canary ring-0 rollout',
    preview: 'Step 1: validate feature flags; step 2: ship to ring-0 (1 % traffic)…',
    starred: true,
  },
];

// ── Meta ───────────────────────────────────────────────────────────────────────

const meta = {
  title: 'AI/HistoryGroup',
  component: HistoryGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A date-bucketed section inside the conversation-history rail. ' +
          'Renders a labelled header (e.g. "Today", "Yesterday") with a thread count, ' +
          'followed by a list of `HistoryItem` rows. Use inside `History` (the full rail) ' +
          'to organise threads by recency; the optional `query` prop forwards a search ' +
          'string to each row for in-title highlight.',
      },
    },
  },
  args: {
    label: 'Today',
    threads: TODAY_THREADS,
    query: '',
  },
  argTypes: {
    label: { control: 'text' },
    query: { control: 'text' },
  },
} satisfies Meta<typeof HistoryGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ────────────────────────────────────────────────────────────────────

/** A single bucket with the active thread highlighted and one starred item. */
export const Default: Story = {};

/** Shows the in-title search highlight: the matching substring is coloured in ember. */
export const WithSearchQuery: Story = {
  args: {
    label: 'Today',
    threads: TODAY_THREADS,
    query: 'rollback',
  },
};

/**
 * Three recency buckets side by side — Today / Yesterday / Last week —
 * demonstrating the full variant × state matrix: active row, starred row,
 * and plain rows across different bucket sizes.
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{ width: 280 }}>
        <HistoryGroup label="Today" threads={TODAY_THREADS} />
      </div>
      <div style={{ width: 280 }}>
        <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} />
      </div>
      <div style={{ width: 280 }}>
        <HistoryGroup label="Last week" threads={LAST_WEEK_THREADS} />
      </div>
    </div>
  ),
};

/** A "Starred" bucket with only bookmarked threads — demonstrates alternative labelling. */
export const StarredBucket: Story = {
  args: {
    label: 'Starred',
    threads: STARRED_THREADS,
  },
};

/** Empty bucket — zero threads — renders just the header row with a 0 count. */
export const EmptyBucket: Story = {
  args: {
    label: 'Last month',
    threads: [],
  },
};
