import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartLegend, ForgeChart, Recharts } from '@eidos/ui';

const ITEMS = [
  { label: 'Requests',  color: 'var(--viz-cat-1)' },
  { label: 'Errors',    color: 'var(--viz-cat-5)' },
  { label: 'Latency',   color: 'var(--viz-cat-3)' },
];

const MONTHLY = [
  { month: 'Jan', requests: 38200, errors: 420, latency: 142 },
  { month: 'Feb', requests: 41500, errors: 310, latency: 131 },
  { month: 'Mar', requests: 39800, errors: 380, latency: 138 },
  { month: 'Apr', requests: 44200, errors: 290, latency: 125 },
  { month: 'May', requests: 47600, errors: 510, latency: 156 },
  { month: 'Jun', requests: 52100, errors: 360, latency: 118 },
];

const TICK_STYLE = {
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  fontWeight: 500,
  fill: 'var(--fg-muted)',
};

const meta = {
  title: 'Charts/ChartLegend',
  component: ChartLegend,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A horizontal row of colour-swatch + label pairs for labelling chart series. ' +
          'Intended for use above or below a <ForgeChart> when the built-in Recharts legend ' +
          'does not match Forge typography.',
      },
    },
  },
  args: {
    items: ITEMS,
  },
  argTypes: {
    items: { control: 'object' },
  },
} satisfies Meta<typeof ChartLegend>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — three series swatches using viz-cat tokens. */
export const Default: Story = {};

/** Two-item legend for a simpler single-comparison chart. */
export const TwoSeries: Story = {
  args: {
    items: [
      { label: 'P95 latency',  color: 'var(--viz-cat-1)' },
      { label: 'P50 latency',  color: 'var(--viz-cat-2)' },
    ],
  },
};

/** Without explicit colours — swatches fall back to the browser default. */
export const NoColor: Story = {
  args: {
    items: [
      { label: 'Series A' },
      { label: 'Series B' },
      { label: 'Series C' },
    ],
  },
};

/** In context — legend paired with a ForgeChart multi-series line chart. */
export const InContext: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <ChartLegend items={ITEMS} />
      <ForgeChart title="Service health" height={240}>
        <Recharts.LineChart data={MONTHLY}>
          <Recharts.CartesianGrid stroke="var(--viz-grid)" vertical={false} />
          <Recharts.XAxis dataKey="month" tick={TICK_STYLE} tickLine={false} axisLine={{ stroke: 'var(--viz-axis)' }} />
          <Recharts.YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
          <Recharts.Tooltip />
          <Recharts.Line type="monotone" dataKey="requests" stroke="var(--viz-cat-1)" strokeWidth={2} dot={false} />
          <Recharts.Line type="monotone" dataKey="errors"   stroke="var(--viz-cat-5)" strokeWidth={2} dot={false} />
          <Recharts.Line type="monotone" dataKey="latency"  stroke="var(--viz-cat-3)" strokeWidth={2} dot={false} />
        </Recharts.LineChart>
      </ForgeChart>
    </div>
  ),
};
