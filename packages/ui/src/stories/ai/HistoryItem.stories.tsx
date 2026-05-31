import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HistoryItem } from '@forge/ui';
import type { HistoryThread } from '@forge/ui';

const THREAD_DEFAULT: HistoryThread = {
  id: 'thread-001',
  title: 'Fraud engine latency investigation',
  preview: 'Analysed p95 spike in scoring chain — root cause: stale feature store data.',
};

const THREAD_ACTIVE: HistoryThread = {
  id: 'thread-002',
  title: 'Deploy rollback — pix-router v4.1.2',
  preview: 'Canary rolled back after error rate exceeded 2% threshold on ring-0.',
  active: true,
};

const THREAD_STARRED: HistoryThread = {
  id: 'thread-003',
  title: 'Incident INC-9812 post-mortem',
  preview: 'ML feature store returned stale vectors; circuit breaker opened at 14:07 BRT.',
  starred: true,
};

const THREAD_STARRED_ACTIVE: HistoryThread = {
  id: 'thread-004',
  title: 'Agent scaffolding for billing-svc',
  preview: 'Generated OpenAPI client + retry policy config for billing-svc v2 endpoints.',
  starred: true,
  active: true,
};

const THREAD_LONG_TITLE: HistoryThread = {
  id: 'thread-005',
  title: 'Refactor auth-gateway rate-limit middleware to use sliding window algorithm',
  preview: 'Compared token-bucket vs sliding-window; sliding-window chosen for burst tolerance.',
};

const meta = {
  title: 'AI/HistoryItem',
  component: HistoryItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A single conversation thread row in the history rail. Renders the thread ' +
          'title and a one-line preview, highlights a search query substring in ember, ' +
          'and exposes inline rename / delete actions on hover. Use inside a ' +
          'HistoryGroup or directly in a custom rail.',
      },
    },
  },
  args: {
    thread: THREAD_DEFAULT,
  },
} satisfies Meta<typeof HistoryItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default thread row — no active or starred state. */
export const Default: Story = {};

/** Active thread — the currently selected conversation is highlighted. */
export const Active: Story = {
  args: { thread: THREAD_ACTIVE },
};

/** Starred thread — a star icon appears at the trailing edge. */
export const Starred: Story = {
  args: { thread: THREAD_STARRED },
};

/**
 * State matrix — default, active, starred, and starred+active laid out
 * side-by-side inside a fixed-width rail column so spacing is representative.
 */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', width: 280, gap: 2 }}>
      <HistoryItem thread={THREAD_DEFAULT} />
      <HistoryItem thread={THREAD_ACTIVE} />
      <HistoryItem thread={THREAD_STARRED} />
      <HistoryItem thread={THREAD_STARRED_ACTIVE} />
    </div>
  ),
};

/**
 * Search highlight — the query substring is highlighted in ember
 * (var(--accent)) inside the title.
 */
export const SearchHighlight: Story = {
  args: {
    thread: THREAD_DEFAULT,
    query: 'latency',
  },
};

/**
 * Long title — verifies single-line truncation at rail width (280 px).
 */
export const LongTitle: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <HistoryItem thread={THREAD_LONG_TITLE} />
    </div>
  ),
};
