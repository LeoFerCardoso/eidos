import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stat } from '@eidos/ui';

const meta = {
  title: 'Elements/Stat',
  component: Stat,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A compact inline KPI: a mono eyebrow label, a headline value with optional suffix, ' +
          'an optional period-over-period `Trend` chip, and a faint hint line. ' +
          'Three variants — `default`, `hero`, and `inline` — cover card tiles, page headers, and row cells respectively.',
      },
    },
  },
  args: {
    label: 'Deploy frequency',
    value: 142,
    suffix: undefined,
    hint: 'last 30 days',
    variant: 'default',
    align: 'start',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'hero', 'inline'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    delta: { control: 'number' },
    inverted: { control: 'boolean' },
    value: { control: 'text' },
    suffix: { control: 'text' },
    hint: { control: 'text' },
  },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** With a period-over-period trend chip (positive movement). */
export const WithDelta: Story = {
  args: { label: 'Deploy frequency', value: 142, delta: 12, deltaUnit: '%', hint: 'vs. previous 30 days' },
};

/** "Lower is better" metric — `inverted` flips the trend chip so a negative delta reads green. */
export const Inverted: Story = {
  args: { label: 'MTTR', value: 24, suffix: ' min', delta: -18, inverted: true, hint: 'mean time to restore' },
};

/** Hero variant for page-header KPIs. */
export const Hero: Story = {
  args: { label: 'Engineering throughput index', value: 88, suffix: '/100', delta: 3, variant: 'hero' },
};

/** Inline variant — fits inside table cells or dense rows. */
export const Inline: Story = {
  args: { label: 'p95', value: 142, suffix: ' ms', variant: 'inline' },
};

/** All three variants side-by-side for comparison. */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <Stat label="Deploy freq" value={142} delta={12} hint="last 30 days" variant="default" />
      <Stat label="ETI" value={88} suffix="/100" delta={3} variant="hero" />
      <Stat label="p95" value={142} suffix=" ms" variant="inline" />
    </div>
  ),
};

/** A row of DORA-metric tiles as they'd appear on an engineering dashboard. */
export const InContext: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      <Stat label="Deploy frequency" value={142} delta={12} hint="last 30 days" />
      <Stat label="Lead time" value="3.2" suffix=" h" delta={-22} inverted hint="commit → prod" />
      <Stat label="Change failure rate" value="7.4" suffix="%" delta={-3} hint="last 30 days" />
      <Stat label="MTTR" value={24} suffix=" min" delta={-18} inverted hint="mean time to restore" />
    </div>
  ),
};
