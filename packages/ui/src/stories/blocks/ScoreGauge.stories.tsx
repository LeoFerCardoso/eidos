import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScoreGauge } from '@eidos/ui';

const meta = {
  title: 'Elements/ScoreGauge',
  component: ScoreGauge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An automotive-style risk gauge with three density variants: ' +
          '`speedo` (hero dial with needle + colored arc), `compact` (96px card ring), ' +
          'and `linear` (horizontal bar for table cells). ' +
          'Palette: green (low) → ember (caution) → amber (high) → red (critical). ' +
          'Pass `inverted` for "higher is better" metrics like Health or Reliability Index.',
      },
    },
  },
  args: {
    variant: 'speedo',
    value: 340,
    min: 0,
    max: 1000,
    label: 'Change Risk Score',
    ticks: true,
    labels: false,
    inverted: false,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['speedo', 'compact', 'linear'] },
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    label: { control: 'text' },
    ticks: { control: 'boolean' },
    labels: { control: 'boolean' },
    inverted: { control: 'boolean' },
    size: { control: 'number' },
    thickness: { control: 'number' },
  },
} satisfies Meta<typeof ScoreGauge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Speedo dial — healthy score in the green band. */
export const Default: Story = {};

/** High-risk score — needle swings into the red band. */
export const HighRisk: Story = {
  args: { value: 820, label: 'Change Risk Score' },
};

/** Speedo with segment labels (LOW / MED / CRIT). */
export const WithLabels: Story = {
  args: { value: 500, labels: true, label: 'Change Risk Score' },
};

/** Compact ring — fits inside a KPI card (96px). */
export const Compact: Story = {
  args: { variant: 'compact', value: 88, max: 100, label: 'ETI' },
};

/** Linear bar — for table cells and inline contexts. */
export const Linear: Story = {
  args: { variant: 'linear', value: 340, max: 1000, label: 'Change Risk Score' },
};

/** `inverted` flips the palette so green is on the high end (Health Index). */
export const Inverted: Story = {
  args: { value: 820, max: 1000, label: 'Reliability Index', inverted: true },
};

/** Three variants side-by-side for a single service's risk score. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <ScoreGauge variant="speedo"   value={340} max={1000} label="Change Risk Score" ticks labels />
      <ScoreGauge variant="compact"  value={340} max={1000} label="CRS" />
      <div style={{ flex: '1 1 200px' }}>
        <ScoreGauge variant="linear" value={340} max={1000} label="Change Risk Score" />
      </div>
    </div>
  ),
};

/** Service-detail panel — hero dial above compact cards for each dimension. */
export const InContext: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div>
      <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBottom: 16 }}>
        pix-router · PR #7421
      </p>
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <ScoreGauge variant="speedo" value={340} max={1000} label="Change Risk Score" ticks labels />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ScoreGauge variant="compact" value={88} max={100} label="ETI" inverted />
          <ScoreGauge variant="compact" value={87} max={100} label="Coverage" inverted />
        </div>
        <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ScoreGauge variant="linear" value={8}   max={20}   label="Complexity" />
          <ScoreGauge variant="linear" value={11}  max={30}   label="Cognitive" />
          <ScoreGauge variant="linear" value={64}  max={100}  label="Maintainability" inverted />
        </div>
      </div>
    </div>
  ),
};
