import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Queue, Message, Empty, Icons } from '@eidos/ui';

const SAMPLE_ITEMS = [
  'What is the p95 latency trend for ledger-svc this week?',
  'Show me all PRs that modified fraud-engine in the last 30 days.',
  'Generate a GMUD draft for the bureau-gateway schema migration.',
];

const meta = {
  title: 'AI/Queue',
  component: Queue,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An ordered list of prompts the user has lined up while the agent is busy. ' +
          'Items can be plain strings or { text } objects; rendered in arrival order, ' +
          'and removable when onRemove is provided.',
      },
    },
  },
  args: {
    title: 'Queued',
    items: SAMPLE_ITEMS,
  },
  argTypes: {
    title: { control: 'text' },
  },
} satisfies Meta<typeof Queue>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three queued prompts, driven by args. The header shows the title and a live count. */
export const Default: Story = {};

/** Variant — string[]: the minimal form, used when there is no per-item metadata. */
export const StringForm: Story = {
  args: {
    items: [
      'What services are in the critical path?',
      'Show me the p95 latency for gateway over the last 24 h',
    ],
  },
};

/** Variant — [{ text }] object form: the documented expansion point (id/priority/ts later). */
export const ObjectForm: Story = {
  args: {
    items: [
      { text: 'List all open incidents tagged tier-1' },
      { text: 'Draft a rollback plan for identity-svc' },
      { text: 'Which team owns billing-svc?' },
    ],
  },
};

/** Removable — interactive; passing onRemove renders the per-item × and rovs focus to the next item. */
export const Removable: Story = {
  render: () => {
    const [items, setItems] = React.useState(SAMPLE_ITEMS);
    return (
      <Queue
        title="Queued"
        items={items}
        onRemove={(i) => setItems((prev) => prev.filter((_, idx) => idx !== i))}
      />
    );
  },
};

/** Empty state — items:[] renders only the header (count "0"); compose Empty for the body. */
export const EmptyState: Story = {
  render: () => (
    <div style={{ width: 380 }}>
      <Queue title="Queued" items={[]} />
      <div style={{ marginTop: 16 }}>
        <Empty
          title="Nothing queued"
          desc="Keep typing while the agent works — prompts you send will appear here."
          icon={<Icons.list size={22} />}
          size="sm"
        />
      </div>
    </div>
  ),
};

/** Long queue — 8+ items: each prompt truncates to one line with an ellipsis. */
export const LongQueue: Story = {
  render: () => {
    const [items, setItems] = React.useState([
      'Summarise all incidents from the last 7 days',
      'Which services have a burn rate above 1.5x?',
      'Show me the full deploy history for billing-svc including rollbacks and hotfixes',
      'Draft a postmortem for the Nov-14 outage',
      "List all runbooks that haven't been updated in over 90 days",
      'Check whether identity-svc has any open CVEs in the current image',
      'Compare latency between gateway v2.4.1 and v2.4.2',
      'Pull error logs from the last 30 min filtered to 5xx',
    ]);
    return (
      <div style={{ width: 400 }}>
        <Queue
          title="Queued"
          items={items}
          onRemove={(i) => setItems((prev) => prev.filter((_, idx) => idx !== i))}
        />
      </div>
    );
  },
};

/** Custom title — match product voice ("Next up", "Pending"). */
export const CustomTitle: Story = {
  args: { title: 'Next up', items: SAMPLE_ITEMS.slice(0, 2) },
};

/** Single item — confirms the layout still reads well. */
export const SingleItem: Story = {
  args: { items: ['What is the current deploy status of fraud-engine?'] },
};

/** In context — Queue beside a streaming Message, so users see what the agent will do next. */
export const InContext: Story = {
  render: () => {
    const [queued, setQueued] = React.useState([
      'Show me the deploy diff for billing-svc',
      'Open an incident for identity-svc if p95 > 500ms',
    ]);
    return (
      <div style={{ width: 580, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Message from="assistant" streaming meta="Forge AI · now">
            Checking the incident queue for tier-1 services over the last 24 hours…
          </Message>
        </div>
        <div style={{ width: 220, flexShrink: 0 }}>
          <Queue
            title="Queued"
            items={queued}
            onRemove={(i) => setQueued((prev) => prev.filter((_, idx) => idx !== i))}
          />
        </div>
      </div>
    );
  },
};
