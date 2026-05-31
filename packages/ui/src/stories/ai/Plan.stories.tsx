import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plan, Message } from '@eidos/ui';

// Plan types `items` as any[]; this local shape keeps the demo data type-checked
// against the documented "pending" | "active" | "done" status union.
type PlanItem = {
  title: string;
  status: 'pending' | 'active' | 'done';
  detail?: string;
};

// Mixed states — some done, one active, the rest pending. Drives Default.
const ITEMS_MIXED: PlanItem[] = [
  { title: 'Fetch service health for fraud-engine', status: 'done' },
  { title: 'Query incident log for the past 24 hours', status: 'done', detail: '2 incidents found' },
  { title: 'Evaluate blast radius of INC-9812', status: 'active', detail: 'Ring 0 → 2' },
  { title: 'Check if incident affects user account usr_4f9a2c', status: 'pending' },
  { title: 'Produce final recommendation', status: 'pending' },
];

const ITEMS_ALL_DONE: PlanItem[] = ITEMS_MIXED.map((i) => ({ ...i, status: 'done' }));
const ITEMS_ALL_PENDING: PlanItem[] = ITEMS_MIXED.map((i) => ({ ...i, status: 'pending' }));

// Nine-step plan with detail lines — the doc page's "Long plan" (8+ steps) demo.
const ITEMS_LONG: PlanItem[] = [
  { title: 'Collect service topology', status: 'done', detail: '14 services · 3 tiers' },
  { title: 'Parse recent alert history', status: 'done', detail: '48 h window' },
  { title: 'Correlate alerts with deploy log', status: 'done' },
  { title: 'Rank high-risk deploys', status: 'done', detail: 'Top 3 candidates identified' },
  { title: 'Fetch diff for identity-svc @ 0421', status: 'active', detail: 'Fetching from GitHub…' },
  { title: 'Fetch diff for gateway @ 0418', status: 'pending' },
  { title: 'Annotate candidates with risk scores', status: 'pending' },
  { title: 'Draft rollback recommendation', status: 'pending' },
  { title: 'Write incident report stub', status: 'pending' },
];

// Steps the live-ticking demo cycles through pending → active → done.
const TICK_ITEMS: { title: string; detail?: string }[] = [
  { title: 'Inspect failing health checks', detail: 'gateway, identity-svc' },
  { title: 'Correlate with recent deploys' },
  { title: 'Check error budget burn rate' },
  { title: 'Propose rollback candidates' },
];

const meta = {
  title: 'AI/Plan',
  component: Plan,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An ordered checklist the agent commits to at the start of a task. Steps tick off ' +
          'as the agent works; the header counter (done/total) updates in real time.',
      },
    },
  },
  args: {
    title: 'Plan',
    items: ITEMS_MIXED,
  },
  argTypes: {
    title: { control: 'text' },
  },
} satisfies Meta<typeof Plan>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Mixed states — some done, one active, the rest pending. The canonical plan. */
export const Default: Story = {};

/** All steps complete — the counter reads total/total. */
export const AllDone: Story = {
  args: { items: ITEMS_ALL_DONE },
};

/** All steps pending — the plan as just committed, before any work begins. */
export const AllPending: Story = {
  args: { items: ITEMS_ALL_PENDING },
};

/** Custom plan title for a named sub-task. */
export const CustomTitle: Story = {
  args: { title: 'Incident triage plan', items: ITEMS_MIXED },
};

/** Eight-plus steps with detail lines — a long investigation plan. */
export const LongPlan: Story = {
  args: { title: 'Incident investigation', items: ITEMS_LONG },
};

/** Empty plan — the agent has committed to nothing yet. */
export const Empty: Story = {
  args: { items: [] },
};

/**
 * Live ticking — steps advance pending → active → done every ~900 ms, then loop.
 * Wrapped in an aria-live region so each transition is announced.
 */
export const LiveTicking: Story = {
  args: { title: 'Plan' },
  render: (args) => {
    const [activeIdx, setActiveIdx] = React.useState(0);
    const [doneCount, setDoneCount] = React.useState(0);

    React.useEffect(() => {
      if (doneCount >= TICK_ITEMS.length) {
        const id = setTimeout(() => { setActiveIdx(0); setDoneCount(0); }, 1800);
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => {
        setDoneCount((d) => d + 1);
        setActiveIdx((i) => Math.min(i + 1, TICK_ITEMS.length));
      }, 900);
      return () => clearTimeout(id);
    }, [doneCount]);

    const items: PlanItem[] = TICK_ITEMS.map((it, i) => ({
      ...it,
      status:
        i < doneCount
          ? 'done'
          : i === activeIdx && doneCount < TICK_ITEMS.length
            ? 'active'
            : 'pending',
    }));

    return (
      <div aria-live="polite" aria-label="Agent plan progress" style={{ maxWidth: 480 }}>
        <Plan title={args.title} items={items} />
      </div>
    );
  },
};

/**
 * In context — the Plan sits at the top of an assistant turn, before the first
 * tool call, composed inside a Message bubble from @eidos/ui.
 */
export const InContext: Story = {
  render: () => (
    <Message from="assistant" meta="Forge AI · just now" variant="plain">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 480 }}>
        <Plan
          title="Plan"
          items={[
            { title: 'List recent Tier-1 deploys', status: 'done' },
            { title: 'Cross-reference with p99 spike window', status: 'done' },
            { title: 'Fetch the relevant diff', status: 'active', detail: 'identity-svc @ 0421' },
            { title: 'Write a root-cause summary', status: 'pending' },
          ] satisfies PlanItem[]}
        />
        <p style={{ margin: 0, color: 'var(--fg-muted)', fontStyle: 'italic' }}>
          Starting with Tier-1 deploys in the last 24 hours…
        </p>
      </div>
    </Message>
  ),
};
