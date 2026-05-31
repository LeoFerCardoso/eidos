import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Shimmer } from '@forge/ui';

// ── Shimmer ───────────────────────────────────────────────────────────────────
// A gradient sweep over a short text label — used for the "before first token"
// beat ("Thinking…", "Searching…"). The animation stops under prefers-reduced-motion.
// IMAGE loading placeholders live in Attachment (ImageView shimmer) and Skeleton.

const meta = {
  title: 'AI/Shimmer',
  component: Shimmer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An animated gradient sweep over a short text label — used for the "before first token" ' +
          'beat ("Thinking…", "Searching…"). This is a TEXT-ONLY placeholder. ' +
          'Image loading shimmer lives in Attachment/ImageView. ' +
          'The animation stops under `prefers-reduced-motion`.',
      },
    },
  },
  args: { children: 'Thinking…' },
  argTypes: {
    children: { control: 'text', description: 'The label behind the gradient. Keep under 4 words, end with "…".' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof Shimmer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — "Thinking…" label shimmering. */
export const Default: Story = {};

/** Common text label variants used across AI surfaces. */
export const LabelVariants: Story = {
  name: 'Label variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Shimmer>Thinking…</Shimmer>
      <Shimmer>Searching the codebase…</Shimmer>
      <Shimmer>Analysing risk…</Shimmer>
      <Shimmer>Generating response…</Shimmer>
      <Shimmer>Reasoning…</Shimmer>
    </div>
  ),
};

/** Cycling labels — shows how to rotate the label during multi-stage model activity. */
export const CyclingLabels: Story = {
  name: 'Cycling labels',
  render: () => {
    const LABELS = ['Thinking…', 'Searching the codebase…', 'Generating…', 'Reasoning…'];
    function Demo() {
      const [idx, setIdx] = React.useState(0);
      React.useEffect(() => {
        const t = setInterval(() => setIdx(i => (i + 1) % LABELS.length), 1800);
        return () => clearInterval(t);
      }, []);
      return <Shimmer>{LABELS[idx]}</Shimmer>;
    }
    return <Demo />;
  },
};

/** RTL — gradient direction mirrors for right-to-left text. */
export const RTL: Story = {
  name: 'RTL (Arabic)',
  render: () => (
    <div dir="rtl">
      <Shimmer>جارٍ التفكير…</Shimmer>
    </div>
  ),
};
