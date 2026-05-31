import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkline } from '@forge/ui';

// Realistic spark datasets — ETI pillar trends from MOCKS.ETI_PILLARS shape
const VELOCITY  = [76, 79, 82, 85, 88, 87, 90];
const QUALITY   = [72, 74, 77, 79, 81, 80, 83];
const LATENCY   = [142, 138, 155, 148, 136, 141, 134];
const INCIDENTS = [5, 4, 6, 3, 2, 4, 1];

const meta = {
  title: 'Primitives/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Minimal SVG line chart for inline trend display — no axes, no labels, just the shape of the data. ' +
          'The final point is marked with a dot; `fill` adds a translucent area under the curve.',
      },
    },
  },
  args: {
    data: VELOCITY,
    w: 120,
    h: 32,
    color: 'var(--ember)',
    fill: true,
  },
  argTypes: {
    data: { control: 'object', description: 'Array of numbers — the raw series to plot.' },
    w: { control: 'number', description: 'Width in px.' },
    h: { control: 'number', description: 'Height in px.' },
    color: { control: 'text', description: 'Stroke + fill colour (CSS value or custom property).' },
    fill: { control: 'boolean', description: 'Show translucent area fill under the line.' },
  },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — ember sparkline, fill on. */
export const Default: Story = {};

/** No fill — line only. */
export const LineOnly: Story = {
  args: { data: QUALITY, fill: false },
};

/** Custom colour — green for a healthy latency trend. */
export const GreenLatency: Story = {
  args: { data: LATENCY.map(v => -v).map(v => v + 160), color: 'var(--success)', fill: true },
};

/** Wide + tall — for a card with more space. */
export const Large: Story = {
  args: { data: VELOCITY, w: 240, h: 56, fill: true },
};

/** Narrow + short — for a compact table cell. */
export const Tiny: Story = {
  args: { data: INCIDENTS, w: 64, h: 20, color: 'var(--danger)', fill: false },
};

/** ETI pillars row — four sparklines with labels, matching a real dashboard tile. */
export const InContext: Story = {
  render: () => {
    const pillars = [
      { name: 'Velocity',     data: VELOCITY,  delta: '+3', color: 'var(--ember)' },
      { name: 'Quality',      data: QUALITY,   delta: '+2', color: 'var(--success)' },
      { name: 'Latency',      data: LATENCY,   delta: '-8 ms', color: 'var(--info)' },
      { name: 'Incidents',    data: INCIDENTS, delta: '-2', color: 'var(--danger)' },
    ];
    return (
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {pillars.map(({ name, data, delta, color }) => (
          <div
            key={name}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              minWidth: 140,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{name}</span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  color: delta.startsWith('-') && name !== 'Incidents' ? 'var(--danger)' : 'var(--success)',
                }}
              >
                {delta}
              </span>
            </div>
            <Sparkline data={data} w={120} h={28} color={color} fill />
          </div>
        ))}
      </div>
    );
  },
};
