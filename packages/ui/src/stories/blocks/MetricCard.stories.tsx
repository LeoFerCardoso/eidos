import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricCard } from '@forge/ui';

const SERIES = [12, 18, 15, 22, 19, 28, 24, 31, 27, 35, 30, 38];

const meta = {
  title: 'Elements/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A KPI card: mono eyebrow label, a headline value, an optional period-over-period `Trend` chip, ' +
          'an optional sparkline, and a footer for SLO/comparison context.',
      },
    },
  },
  args: {
    label: 'Deploy frequency',
    value: 142,
    delta: 12,
    deltaUnit: '%',
    size: 'md',
    foot: 'vs. previous 30 days',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    value: { control: 'text' },
    delta: { control: 'number' },
    inverted: { control: 'boolean' },
  },
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** With a sparkline under the value. */
export const WithSparkline: Story = {
  args: { label: 'Requests / min', value: '38.2', unit: 'k', series: SERIES, delta: 9 },
};

/** A "lower is better" metric — `inverted` flips the trend color so the chip
 *  follows the verdict (a drop in MTTR is good → green). */
export const InvertedMetric: Story = {
  args: { label: 'MTTR', value: 24, unit: 'min', delta: -18, inverted: true, foot: 'Mean time to restore' },
};

/** Negative movement on a normal metric reads red. */
export const NegativeDelta: Story = {
  args: { label: 'Change failure rate', value: '7.4', suffix: '%', delta: -3 },
};

/** The three densities. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <MetricCard key={size} label={`Size ${size}`} value={142} delta={12} size={size} series={SERIES} />
      ))}
    </div>
  ),
};

/** A row of cards as they'd sit on a DORA dashboard. */
export const InContext: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', gap: 16 }}>
      <MetricCard label="Deploy frequency" value={142} delta={12} series={SERIES} foot="last 30 days" />
      <MetricCard label="Lead time" value={3.2} unit="h" delta={-22} inverted series={SERIES} foot="commit → prod" />
      <MetricCard label="Change failure rate" value="7.4" suffix="%" delta={-3} foot="last 30 days" />
    </div>
  ),
};
