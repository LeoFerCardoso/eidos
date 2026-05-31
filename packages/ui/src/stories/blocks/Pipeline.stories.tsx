import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pipeline, MOCKS } from '@forge/ui';

// An in-flight run: built/tested/scanned, canary advancing, full deploy queued.
const RUNNING_STEPS = [
  { id: 'build',  label: 'Build',   status: 'done',    meta: '1m 12s' },
  { id: 'test',   label: 'Test',    status: 'done',    meta: '4m 38s' },
  { id: 'sast',   label: 'SAST',    status: 'done',    meta: '22s' },
  { id: 'risk',   label: 'Risk',    status: 'done',    meta: '8s' },
  { id: 'canary', label: 'Canary',  status: 'running', meta: 'Ring 0 · 62%' },
  { id: 'full',   label: 'Full',    status: 'pending', meta: undefined },
];

// Every stage cleared — the released-to-all happy ending.
const PASSED_STEPS = [
  { id: 'build',  label: 'Build',   status: 'done', meta: '58s' },
  { id: 'test',   label: 'Test',    status: 'done', meta: '2m 44s' },
  { id: 'sast',   label: 'SAST',    status: 'done', meta: '19s' },
  { id: 'risk',   label: 'Risk',    status: 'done', meta: '7s' },
  { id: 'canary', label: 'Canary',  status: 'done', meta: 'Ring 0–2' },
  { id: 'full',   label: 'Full',    status: 'done', meta: 'Ring 3–4' },
];

// Canary errored — the full deploy never started.
const FAILED_STEPS = [
  { id: 'build',  label: 'Build',   status: 'done',    meta: '1m 02s' },
  { id: 'test',   label: 'Test',    status: 'done',    meta: '3m 11s' },
  { id: 'sast',   label: 'SAST',    status: 'done',    meta: '18s' },
  { id: 'risk',   label: 'Risk',    status: 'done',    meta: '9s' },
  { id: 'canary', label: 'Canary',  status: 'error',   meta: 'p95 spike' },
  { id: 'full',   label: 'Full',    status: 'pending', meta: undefined },
];

// Failed at SAST → everything downstream skipped (doc page's failure example).
const SKIPPED_STEPS = [
  { id: 'build',  label: 'Build',  status: 'done',    meta: '58s' },
  { id: 'test',   label: 'Test',   status: 'done',    meta: '2m 44s' },
  { id: 'sast',   label: 'SAST',   status: 'error',   meta: 'CVE-2024-xxxx' },
  { id: 'risk',   label: 'Risk',   status: 'skipped', meta: undefined },
  { id: 'canary', label: 'Canary', status: 'skipped', meta: undefined },
  { id: 'full',   label: 'Full',   status: 'skipped', meta: undefined },
];

const meta = {
  title: 'Blocks/Pipeline',
  component: Pipeline,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A left-to-right tracker for a build → test → deploy run — the CI/CD bar on a ' +
          'deploy page, the status cell in a deploy table, the hero on a release dashboard. ' +
          'Two variants share one step model: `stepper` (cards on a dotted rail, Linear/Vercel ' +
          'feel) and `chevron` (nested right-pointing arrows, GitHub Actions style). Each step ' +
          'carries a `status` (`done | running | pending | error | skipped`) mapped to a Forge ' +
          '`--status-*` token. For vertical, time-ordered sequences use `Timeline` instead.',
      },
    },
  },
  args: {
    variant: 'stepper',
    steps: RUNNING_STEPS,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['stepper', 'chevron'] },
    compact: { control: 'boolean' },
    currentIndex: { control: 'number' },
  },
} satisfies Meta<typeof Pipeline>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Stepper (default) — an in-flight deploy paused at the canary stage. */
export const Default: Story = {};

/** Chevron variant — same step model rendered as nested wedge arrows. */
export const Chevron: Story = {
  args: { variant: 'chevron' },
};

/** Compact stepper — drops labels and meta, leaving dots only for table-cell density. */
export const Compact: Story = {
  args: { compact: true },
};

/** A fully successful run — every stage `done`, released to all rings. */
export const AllPassed: Story = {
  args: { steps: PASSED_STEPS },
};

/** A blocked run — canary errored and the full deploy never started. */
export const Failed: Story = {
  args: { steps: FAILED_STEPS },
};

/** SAST failed → every downstream stage is `skipped` (dash glyph, muted dot). */
export const Skipped: Story = {
  args: { steps: SKIPPED_STEPS },
};

/** `currentIndex` forces which step reads as in-flight, overriding the first `running`. */
export const ForcedCurrent: Story = {
  args: { steps: RUNNING_STEPS, currentIndex: 2 },
};

/** Deploy-board composition — a live run, a passed release, and a failed canary together. */
export const InContext: Story = {
  render: () => {
    const live = MOCKS.DEPLOYS.find((d) => d.id === 'D-9182')!;
    const passed = MOCKS.DEPLOYS.find((d) => d.id === 'D-9180')!;
    const failed = MOCKS.DEPLOYS.find((d) => d.id === 'D-9179')!;
    const toSteps = (stages: Record<string, string>) =>
      Object.entries(stages).map(([id, status]) => ({
        id,
        label: id.charAt(0).toUpperCase() + id.slice(1),
        status,
      }));
    const row = (
      d: (typeof MOCKS.DEPLOYS)[number],
      variant: 'stepper' | 'chevron',
      note: string,
    ) => (
      <div>
        <p
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--fg-muted)',
            marginBlockEnd: 8,
          }}
        >
          {d.service} · {d.id} · {note}
        </p>
        <Pipeline variant={variant} steps={toSteps(d.stages)} />
      </div>
    );
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {row(live, 'stepper', 'stepper · in-flight')}
        {row(passed, 'chevron', 'chevron · released')}
        {row(failed, 'chevron', 'chevron · failed canary')}
      </div>
    );
  },
};
