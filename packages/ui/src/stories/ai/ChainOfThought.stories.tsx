import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChainOfThought, Response } from '@eidos/ui';

// Realistic fintech investigation steps — the doc page's "show your work" trace.
const STEPS = [
  { kind: 'think',  label: 'Identify the affected service', status: 'done' },
  { kind: 'search', label: 'Query incident log for fraud-engine (last 24 h)', status: 'done',
    detail: 'Found 2 open incidents (INC-9812, INC-9813).' },
  { kind: 'observe', label: 'Check p95 latency for fraud-engine', status: 'done',
    detail: 'p95 = 312 ms — within SLO (< 500 ms).' },
  { kind: 'plan',  label: 'Determine whether to surface incidents to user', status: 'done' },
  { kind: 'done',  label: 'Conclude: safe to proceed, attach incident context', status: 'done' },
];

const PARTIAL_STEPS = STEPS.slice(0, 3);

// All six documented kinds side by side — each maps to a fixed icon.
const KIND_STEPS = [
  { kind: 'think',   label: 'Think — initial question or hypothesis' },
  { kind: 'search',  label: 'Search — query a tool or knowledge source' },
  { kind: 'observe', label: 'Observe — interpret a result' },
  { kind: 'plan',    label: 'Plan — decide the next action' },
  { kind: 'read',    label: 'Read — parse a document or schema' },
  { kind: 'done',    label: 'Done — conclusion or final answer' },
];

// Streaming source — steps append one-by-one in the interactive story.
const STREAM_STEPS = [
  { kind: 'think',   label: "What's driving the p99 spike?",          detail: 'Spike began 14:07 UTC — correlate with deploy window.' },
  { kind: 'search',  label: 'Search deploy log · since=24h · tier=T1', detail: 'eidos.deploys' },
  { kind: 'observe', label: '4 T1 deploys — identity-svc is newest',   detail: 'Committed 14:02 · +15 files changed' },
  { kind: 'plan',    label: 'Diff identity-svc @ 0421',                detail: 'pool-size 8→32 and retry-budget 3→8 in same commit' },
  { kind: 'done',    label: 'Revert pool-size; keep retry-budget',      detail: "pool-size is the only change on the spike's code path" },
];

// In-context trace — collapsed once settled, the answer sits in front.
const IN_CTX_STEPS = [
  { kind: 'think',   label: 'User is asking about the p99 spike — check Tier-1 deploys first' },
  { kind: 'search',  label: 'listDeploys · since=24h · tier=T1' },
  { kind: 'observe', label: 'identity-svc @ 0421 is the only deploy in the spike window' },
  { kind: 'plan',    label: 'Recommend reverting the pool-size change' },
  { kind: 'done',    label: 'Answer ready' },
];

const meta = {
  title: 'AI/ChainOfThought',
  component: ChainOfThought,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A collapsible multi-step reasoning trace. Each step carries a kind (think / search / ' +
          'observe / plan / read / done), a label, and optional detail. Append steps as they stream in.',
      },
    },
  },
  args: {
    title: 'Chain of thought',
    defaultOpen: true,
    steps: STEPS,
  },
  argTypes: {
    title: { control: 'text' },
    defaultOpen: { control: 'boolean' },
  },
} satisfies Meta<typeof ChainOfThought>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full settled trace — all five steps done (driven by args). */
export const Default: Story = {};

/** Partial — trace still building (3 of 5 steps arrived). */
export const Partial: Story = {
  args: { steps: PARTIAL_STEPS },
};

/** All six documented kinds, each with its own icon: think · search · observe · plan · read · done. */
export const StepKinds: Story = {
  args: { title: 'Step kinds', steps: KIND_STEPS },
};

/** Custom title for a specialised trace — exercises the read kind. */
export const SearchTrace: Story = {
  args: {
    title: 'Search trace',
    steps: [
      { kind: 'search', label: 'Query: fraud-engine incidents, last 24 h', status: 'done', detail: '2 results' },
      { kind: 'read',   label: 'Read INC-9812 detail', status: 'done' },
      { kind: 'read',   label: 'Read INC-9813 detail', status: 'done' },
      { kind: 'observe', label: 'Neither incident correlates with user account', status: 'done' },
    ],
  },
};

/** Streaming — steps append one-by-one as tokens arrive; wrap in aria-live so each is announced. */
export const Streaming: Story = {
  render: () => {
    const [visibleCount, setVisibleCount] = React.useState(1);
    const [done, setDone] = React.useState(false);
    React.useEffect(() => {
      if (done) {
        const id = setTimeout(() => { setVisibleCount(1); setDone(false); }, 2400);
        return () => clearTimeout(id);
      }
      if (visibleCount >= STREAM_STEPS.length) {
        const id = setTimeout(() => setDone(true), 1200);
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => setVisibleCount((v) => v + 1), 500);
      return () => clearTimeout(id);
    }, [visibleCount, done]);
    return (
      <div aria-live="polite" aria-label="Chain of thought streaming" style={{ maxWidth: 560 }}>
        <ChainOfThought title="Chain of thought" defaultOpen steps={STREAM_STEPS.slice(0, visibleCount)} />
      </div>
    );
  },
};

/** Collapsed initially — model settled without surfacing the trace. */
export const CollapsedByDefault: Story = {
  args: { defaultOpen: false },
};

/** Empty steps list — renders the header with "0 steps". */
export const Empty: Story = {
  args: { steps: [] },
};

/** In context — the canonical "show your work then answer": a collapsed trace above the Response. */
export const InContext: Story = {
  render: () => (
    <div style={{ maxWidth: 580, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <ChainOfThought title="Chain of thought" defaultOpen={false} steps={IN_CTX_STEPS} />
      <Response meta="Eidos AI · just now">
        <p>
          The <code>identity-svc</code> deploy at 14:02 is the only one in the spike window. The
          pool-size change (8 → 32) is the sole diff on the p99 code path — recommend reverting it.
          The retry-budget bump is safe to keep.
        </p>
      </Response>
    </div>
  ),
};

/** RTL — logical CSS flips the step mark to the start (right) edge; the kind icons are non-directional. */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ maxWidth: 560 }}>
      <ChainOfThought
        title="سلسلة التفكير"
        defaultOpen
        steps={[
          { kind: 'think',   label: 'ما سبب ارتفاع p99 على identity-svc؟', detail: 'مقارنة النشر بنافذة الارتفاع' },
          { kind: 'search',  label: 'البحث في سجل النشر', detail: 'eidos.deploys · since=24h' },
          { kind: 'observe', label: 'تم العثور على 4 عمليات نشر — identity-svc هو الأحدث' },
          { kind: 'plan',    label: 'فحص تغيير pool-size فقط' },
          { kind: 'done',    label: 'التوصية بالتراجع عن pool-size' },
        ]}
      />
    </div>
  ),
};
