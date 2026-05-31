import type { Meta, StoryObj } from '@storybook/react-vite';
import { LogViewer } from '@forge/ui';

const SAMPLE_LINES = [
  { id: 1,  time: '02:14:01.012', level: 'info',  message: 'pix-router started on :8080' },
  { id: 2,  time: '02:14:01.248', level: 'debug', message: 'Connected to ledger-svc at ledger-svc.pix.svc.cluster.local:50051' },
  { id: 3,  time: '02:14:02.001', level: 'info',  message: 'Health check passed — downstream latency 9ms' },
  { id: 4,  time: '02:14:08.312', level: 'info',  message: 'POST /pix/v2/payments 200 — 84ms · txn=PIX-9F3A' },
  { id: 5,  time: '02:14:08.800', level: 'debug', message: 'Idempotency key cached: PIX-9F3A ttl=300s' },
  { id: 6,  time: '02:14:09.120', level: 'info',  message: 'POST /pix/v2/payments 200 — 91ms · txn=PIX-9F3B' },
  { id: 7,  time: '02:14:11.002', level: 'warn',  message: 'bureau-gateway p95 elevated: 312ms (SLO: 250ms)' },
  { id: 8,  time: '02:14:11.200', level: 'info',  message: 'Circuit breaker: bureau-gateway → HALF_OPEN' },
  { id: 9,  time: '02:14:14.500', level: 'error', message: 'POST /pix/v2/payments 503 — bureau-gateway unavailable' },
  { id: 10, time: '02:14:14.501', level: 'error', message: 'Retry #1 → bureau-gateway: connect timeout after 200ms' },
  { id: 11, time: '02:14:15.003', level: 'fatal', message: 'Circuit breaker OPEN — all traffic to bureau-gateway suspended' },
  { id: 12, time: '02:14:15.200', level: 'warn',  message: 'Fallback activated: returning cached bureau score' },
  { id: 13, time: '02:14:18.400', level: 'info',  message: 'Circuit breaker: bureau-gateway → HALF_OPEN (probe)' },
  { id: 14, time: '02:14:19.100', level: 'info',  message: 'bureau-gateway probe OK — 118ms. Closing circuit.' },
  { id: 15, time: '02:14:19.400', level: 'info',  message: 'POST /pix/v2/payments 200 — 122ms · txn=PIX-9F3C' },
];

const meta = {
  title: 'Elements/LogViewer',
  component: LogViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A terminal-style log stream with severity-colored rows. ' +
          'Three variants: `compact` (level badge + message only), ' +
          '`expanded` (timestamp + severity columns), and ' +
          '`filterable` (full toolbar with per-level chip toggles and text search).',
      },
    },
  },
  args: {
    lines: SAMPLE_LINES,
    variant: 'compact',
    height: 280,
    follow: false,
    wrap: false,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['compact', 'expanded', 'filterable'] },
    height: { control: 'number' },
    follow: { control: 'boolean' },
    wrap: { control: 'boolean' },
  },
} satisfies Meta<typeof LogViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Compact view — level badge + message, no timestamp column. */
export const Default: Story = {};

/** Expanded — timestamp + severity columns. */
export const Expanded: Story = {
  args: { variant: 'expanded', height: 300 },
};

/** Filterable — toolbar with level chip toggles and text search. */
export const Filterable: Story = {
  args: { variant: 'filterable', height: 340 },
};

/** Empty state — no log output yet. */
export const Empty: Story = {
  args: { lines: [] },
};

/** Wrapped long lines instead of ellipsis truncation. */
export const Wrapped: Story = {
  args: {
    variant: 'expanded',
    wrap: true,
    lines: [
      { id: 1, time: '02:14:14.501', level: 'error', message: 'POST /pix/v2/payments 503 — Upstream bureau-gateway returned HTTP 503 after 200ms; idempotency key PIX-9F3A will be retained for 300s; retry scheduled via exponential back-off (attempt 1/3, next in 400ms).' },
      { id: 2, time: '02:14:15.003', level: 'fatal', message: 'Circuit breaker OPEN — all outbound traffic to bureau-gateway suspended; downstream callers will receive 503 with Retry-After: 30 until probe recovers.' },
    ],
  },
};

/** Filterable viewer embedded in a service detail card. */
export const InContext: Story = {
  render: () => (
    <div style={{ maxWidth: 760 }}>
      <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBottom: 8 }}>
        pix-router · D-9182 · canary log
      </p>
      <LogViewer lines={SAMPLE_LINES} variant="filterable" height={360} />
    </div>
  ),
};
