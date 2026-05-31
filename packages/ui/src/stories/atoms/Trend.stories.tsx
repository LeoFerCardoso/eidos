import type { Meta, StoryObj } from '@storybook/react-vite';
import { Trend } from '@eidos/ui';

const VARIANTS = ['arrow', 'triangle', 'badge', 'bar'] as const;

const meta = {
  title: 'Primitives/Trend',
  component: Trend,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Up/down/flat trend indicator with delta. Four variants control the glyph and chrome; ' +
          '`inverted` flips the colour mapping for metrics where down is good (latency, error rate).',
      },
    },
  },
  args: {
    delta: 12,
    unit: '%',
    inverted: false,
    variant: 'arrow',
    showZero: true,
  },
  argTypes: {
    delta: { control: 'number', description: 'Numeric delta — positive = up, negative = down, 0 = flat.' },
    unit: { control: 'text', description: 'Appended unit string ("%", "ms", "").' },
    inverted: { control: 'boolean', description: 'Flip green/red — for latency, error-rate metrics.' },
    variant: { control: 'inline-radio', options: VARIANTS },
    showZero: { control: 'boolean', description: 'Render a flat indicator when delta is 0.' },
  },
} satisfies Meta<typeof Trend>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default arrow, positive delta. */
export const Default: Story = {};

/** Negative delta — red/down direction. */
export const Down: Story = { args: { delta: -8, unit: '%' } };

/** Zero delta — flat indicator. */
export const Flat: Story = { args: { delta: 0, unit: '%' } };

/** Inverted: down is good — for latency or error rate. */
export const Inverted: Story = { args: { delta: -23, unit: ' ms', inverted: true } };

/** All four variants with the same positive delta. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
      {VARIANTS.map((v) => (
        <span key={v} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Trend delta={14} unit="%" variant={v} />
          <code style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>{v}</code>
        </span>
      ))}
    </div>
  ),
};

/** Directional matrix — all directions × all variants. */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {([-15, 0, 15] as const).map((delta) => (
        <div key={delta} style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {VARIANTS.map((v) => (
            <Trend key={v} delta={delta} unit="%" variant={v} />
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Badge variant in a metric-card context. */
export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {[
        { label: 'Deploys / wk', value: '4 280', delta: 8, unit: '%' },
        { label: 'P95 Latency', value: '142 ms', delta: -23, unit: ' ms', inverted: true },
        { label: 'Coverage', value: '88.3%', delta: 2, unit: ' pts' },
        { label: 'Incidents', value: '3', delta: -1, inverted: true, unit: '' },
      ].map(({ label, value, delta, unit = '', inverted = false }) => (
        <div
          key={label}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '14px 18px',
            minWidth: 130,
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginBottom: 4 }}>{label}</div>
          <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>{value}</div>
          <Trend delta={delta} unit={unit} inverted={inverted} variant="badge" />
        </div>
      ))}
    </div>
  ),
};
