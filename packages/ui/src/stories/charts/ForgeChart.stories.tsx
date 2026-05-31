import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ForgeChart, ForgeTooltipContent, Recharts } from '@eidos/ui';

// Local series fixture — ForgeChart is a container; the chart type is
// determined by the Recharts child you pass in, not a prop on ForgeChart.
const MONTHLY = [
  { month: 'Jan', requests: 38200, errors: 420 },
  { month: 'Feb', requests: 41500, errors: 310 },
  { month: 'Mar', requests: 39800, errors: 380 },
  { month: 'Apr', requests: 44200, errors: 290 },
  { month: 'May', requests: 47600, errors: 510 },
  { month: 'Jun', requests: 52100, errors: 360 },
];

const TICK_STYLE = {
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  fontWeight: 500,
  fill: 'var(--fg-muted)',
};

const meta = {
  title: 'Charts/ForgeChart',
  component: ForgeChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A card-style container that wraps any Recharts composition in a ' +
          'Forge-themed surface with an optional title, subtitle, and meta slot. ' +
          'It sets up <ResponsiveContainer> internally; pass a single Recharts chart ' +
          'element as `children`.',
      },
    },
  },
  args: {
    title: 'API Requests',
    subtitle: 'Monthly volume',
    height: 280,
    padding: 18,
  },
  argTypes: {
    height: { control: 'number' },
    padding: { control: 'number' },
    accent: { control: 'color' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    meta: { control: 'text' },
  },
} satisfies Meta<typeof ForgeChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — a simple line chart of monthly API requests. */
export const Default: Story = {
  render: (args) => (
    <ForgeChart {...args}>
      <Recharts.LineChart data={MONTHLY}>
        <Recharts.CartesianGrid stroke="var(--viz-grid)" vertical={false} />
        <Recharts.XAxis dataKey="month" tick={TICK_STYLE} tickLine={false} axisLine={{ stroke: 'var(--viz-axis)' }} />
        <Recharts.YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
        <Recharts.Tooltip content={<ForgeTooltipContent/>}/>
        <Recharts.Line type="monotone" dataKey="requests" stroke="var(--viz-cat-1)" strokeWidth={2} dot={false} />
      </Recharts.LineChart>
    </ForgeChart>
  ),
};

/** Area chart — cumulative area fill emphasises growth over time. */
export const AreaChart: Story = {
  args: { title: 'Request volume', subtitle: 'Area fill', meta: 'last 6 months' },
  render: (args) => (
    <ForgeChart {...args}>
      <Recharts.AreaChart data={MONTHLY}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--viz-cat-1)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--viz-cat-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Recharts.CartesianGrid stroke="var(--viz-grid)" vertical={false} />
        <Recharts.XAxis dataKey="month" tick={TICK_STYLE} tickLine={false} axisLine={{ stroke: 'var(--viz-axis)' }} />
        <Recharts.YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
        <Recharts.Tooltip content={<ForgeTooltipContent/>}/>
        <Recharts.Area type="monotone" dataKey="requests" stroke="var(--viz-cat-1)" strokeWidth={2} fill="url(#areaFill)" dot={false} />
      </Recharts.AreaChart>
    </ForgeChart>
  ),
};

/** Bar chart — grouped columns for requests vs errors side-by-side. */
export const BarChart: Story = {
  args: { title: 'Requests vs Errors', subtitle: 'Grouped bars', meta: 'last 6 months' },
  render: (args) => (
    <ForgeChart {...args}>
      <Recharts.BarChart data={MONTHLY} barSize={14} barGap={4}>
        <Recharts.CartesianGrid stroke="var(--viz-grid)" vertical={false} />
        <Recharts.XAxis dataKey="month" tick={TICK_STYLE} tickLine={false} axisLine={{ stroke: 'var(--viz-axis)' }} />
        <Recharts.YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
        <Recharts.Tooltip content={<ForgeTooltipContent/>}/>
        <Recharts.Bar dataKey="requests" fill="var(--viz-cat-1)" radius={[3, 3, 0, 0]} />
        <Recharts.Bar dataKey="errors" fill="var(--viz-cat-5)" radius={[3, 3, 0, 0]} />
      </Recharts.BarChart>
    </ForgeChart>
  ),
};

/** Custom accent — overrides the chart-accent CSS variable to ember. */
export const WithAccent: Story = {
  args: { title: 'Deploy frequency', accent: 'var(--accent)', meta: '↑ 12%' },
  render: (args) => (
    <ForgeChart {...args}>
      <Recharts.LineChart data={MONTHLY}>
        <Recharts.CartesianGrid stroke="var(--viz-grid)" vertical={false} />
        <Recharts.XAxis dataKey="month" tick={TICK_STYLE} tickLine={false} axisLine={{ stroke: 'var(--viz-axis)' }} />
        <Recharts.YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
        <Recharts.Tooltip content={<ForgeTooltipContent/>}/>
        <Recharts.Line type="monotone" dataKey="requests" stroke="var(--chart-accent, var(--viz-cat-1))" strokeWidth={2} dot={false} />
      </Recharts.LineChart>
    </ForgeChart>
  ),
};

/** No header — bare chart surface with just the chart body, no title or meta. */
export const NoHeader: Story = {
  args: { title: undefined, subtitle: undefined, meta: undefined, height: 200 },
  render: (args) => (
    <ForgeChart {...args}>
      <Recharts.LineChart data={MONTHLY}>
        <Recharts.CartesianGrid stroke="var(--viz-grid)" vertical={false} />
        <Recharts.XAxis dataKey="month" tick={TICK_STYLE} tickLine={false} axisLine={{ stroke: 'var(--viz-axis)' }} />
        <Recharts.YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
        <Recharts.Line type="monotone" dataKey="requests" stroke="var(--viz-cat-1)" strokeWidth={2} dot={false} />
      </Recharts.LineChart>
    </ForgeChart>
  ),
};

/** In context — a two-column chart grid as it would appear on a DORA dashboard. */
export const InContext: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <ForgeChart title="API Requests" subtitle="Line" meta="6 mo" height={220}>
        <Recharts.LineChart data={MONTHLY}>
          <Recharts.CartesianGrid stroke="var(--viz-grid)" vertical={false} />
          <Recharts.XAxis dataKey="month" tick={TICK_STYLE} tickLine={false} axisLine={{ stroke: 'var(--viz-axis)' }} />
          <Recharts.YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
          <Recharts.Tooltip content={<ForgeTooltipContent/>}/>
          <Recharts.Line type="monotone" dataKey="requests" stroke="var(--viz-cat-1)" strokeWidth={2} dot={false} />
        </Recharts.LineChart>
      </ForgeChart>

      <ForgeChart title="Error count" subtitle="Bar" meta="6 mo" height={220}>
        <Recharts.BarChart data={MONTHLY} barSize={18}>
          <Recharts.CartesianGrid stroke="var(--viz-grid)" vertical={false} />
          <Recharts.XAxis dataKey="month" tick={TICK_STYLE} tickLine={false} axisLine={{ stroke: 'var(--viz-axis)' }} />
          <Recharts.YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
          <Recharts.Tooltip content={<ForgeTooltipContent/>}/>
          <Recharts.Bar dataKey="errors" fill="var(--viz-cat-5)" radius={[3, 3, 0, 0]} />
        </Recharts.BarChart>
      </ForgeChart>
    </div>
  ),
};
