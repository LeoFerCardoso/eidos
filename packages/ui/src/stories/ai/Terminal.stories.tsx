import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Terminal } from '@eidos/ui';
import type { TerminalLine } from '@eidos/ui';

// ── Fixtures ─────────────────────────────────────────────────────────────────

const DEPLOY_LINES: TerminalLine[] = [
  { kind: 'note', text: '── pix-router · Ring 2 canary ──' },
  { kind: 'in',   text: 'kubectl rollout status deployment/pix-router -n production' },
  { kind: 'out',  text: 'Waiting for deployment "pix-router" rollout to finish: 3 of 5 new replicas have been updated…' },
  { kind: 'out',  text: 'Waiting for rollout to finish: 2 old replicas are pending termination…' },
  { kind: 'out',  text: 'deployment "pix-router" successfully rolled out' },
  { kind: 'in',   text: 'kubectl get pods -n production -l app=pix-router' },
  { kind: 'out',  text: 'NAME                          READY   STATUS    RESTARTS   AGE' },
  { kind: 'out',  text: 'pix-router-7c9b8f4d9-k2pqz   1/1     Running   0          2m14s' },
  { kind: 'out',  text: 'pix-router-7c9b8f4d9-mxr7t   1/1     Running   0          2m11s' },
];

const ERROR_LINES: TerminalLine[] = [
  { kind: 'in',  text: 'helm upgrade bureau-gateway ./charts/bureau-gateway --namespace production' },
  { kind: 'out', text: 'Release "bureau-gateway" has been upgraded.' },
  { kind: 'err', text: 'Error: 1 error occurred: context deadline exceeded' },
  { kind: 'err', text: 'helm upgrade failed: deployment timed out after 300s' },
  { kind: 'note', text: 'Rollback triggered automatically.' },
  { kind: 'in',  text: 'helm rollback bureau-gateway 0 --namespace production' },
  { kind: 'out', text: 'Rollback was a success! Happy Helming!' },
];

const RUNNING_LINES: TerminalLine[] = [
  { kind: 'note', text: '── fraud-engine · SAST scan ──' },
  { kind: 'in',   text: 'semgrep scan --config auto --output semgrep-report.json' },
  { kind: 'out',  text: 'Scanning 412 files…' },
  { kind: 'out',  text: '  [INFO] Running 312 rules across Python, TypeScript' },
];

const meta = {
  title: 'AI/Terminal',
  component: Terminal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A styled mono surface that pairs commands and their output — not a real emulator. ' +
          'Lines are typed: `in` (command with prompt), `out` (stdout), `err` (stderr, danger tone), ' +
          '`note` (editorial annotation). A `status` pill and optional `title` appear in the header.',
      },
    },
  },
  args: {
    title: 'session · pix-router',
    status: 'done',
    prompt: '$',
    lines: DEPLOY_LINES,
  },
  argTypes: {
    title: { control: 'text' },
    status: { control: 'inline-radio', options: ['idle', 'running', 'done', 'error'] },
    prompt: { control: 'text' },
  },
} satisfies Meta<typeof Terminal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Successful deploy run. */
export const Default: Story = {};

/** Error state — failed Helm upgrade + rollback. */
export const ErrorState: Story = {
  name: 'Error state',
  args: {
    title: 'session · bureau-gateway',
    status: 'error',
    lines: ERROR_LINES,
  },
};

/** Running — scan in progress, aria-live active. */
export const Running: Story = {
  args: {
    title: 'SAST scan · fraud-engine',
    status: 'running',
    lines: RUNNING_LINES,
  },
};

/** No header — title and status both omitted. */
export const NoHeader: Story = {
  name: 'No header',
  args: {
    title: undefined,
    status: undefined,
    lines: [
      { kind: 'in',  text: 'git log --oneline -5' },
      { kind: 'out', text: 'a3c1f9e feat(ledger): batch BTREE inserts' },
      { kind: 'out', text: 'b2d4e7f fix(fraud): null user_agent' },
      { kind: 'out', text: 'c8f2a1b chore: bump tonic 0.11' },
    ],
  },
};

/** Custom prompt symbol — useful for PowerShell or Python REPL sessions. */
export const CustomPrompt: Story = {
  name: 'Custom prompt (>)',
  args: {
    title: 'Python REPL',
    status: 'idle',
    prompt: '>>>',
    lines: [
      { kind: 'in',  text: 'import pandas as pd' },
      { kind: 'in',  text: 'df = pd.read_parquet("audit_log.parquet")' },
      { kind: 'out', text: '<DataFrame 1 024 rows × 12 columns>' },
      { kind: 'in',  text: 'df["user_agent"].isna().sum()' },
      { kind: 'out', text: '37' },
    ],
  },
};

/** In context — inside an agent card in a wider layout. */
export const InContext: Story = {
  render: () => (
    <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'var(--font-sans)' }}>
      <p style={{ fontSize: 13, color: 'var(--fg-muted)', margin: 0 }}>
        The agent ran the following commands to verify the deploy:
      </p>
      <Terminal
        title="session · pix-router"
        status="done"
        lines={DEPLOY_LINES}
      />
    </div>
  ),
};
