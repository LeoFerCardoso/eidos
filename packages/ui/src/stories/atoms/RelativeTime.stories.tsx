import type { Meta, StoryObj } from '@storybook/react-vite';
import { RelativeTime } from '@forge/ui';

// Stable past offsets so stories don't flicker
const NOW = Date.now();
const mins = (n: number) => new Date(NOW - n * 60 * 1000);
const hours = (n: number) => new Date(NOW - n * 3600 * 1000);
const days = (n: number) => new Date(NOW - n * 86400 * 1000);

const meta = {
  title: 'Primitives/RelativeTime',
  component: RelativeTime,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Humanised relative timestamp ("3 min ago") inside a `<time>` element. ' +
          'Ticks every 60 s to stay fresh; `absolute` mode appends the formatted date, ' +
          '`tooltip` wraps in a Forge `.tt` with the full datetime on hover.',
      },
    },
  },
  args: {
    value: mins(3),
    absolute: false,
    tooltip: false,
    tooltipSide: 'top',
  },
  argTypes: {
    absolute: { control: 'boolean', description: 'Show absolute date alongside the relative phrase.' },
    tooltip: { control: 'boolean', description: 'Wrap in a Forge tooltip showing the full datetime.' },
    tooltipSide: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
  },
} satisfies Meta<typeof RelativeTime>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — relative only, 3 minutes ago. */
export const Default: Story = {};

/** Absolute mode — shows formatted date + relative phrase. */
export const WithAbsolute: Story = {
  args: { value: hours(2), absolute: true },
};

/** Tooltip — hover to see full datetime. */
export const WithTooltip: Story = {
  args: { value: days(3), tooltip: true, tooltipSide: 'top' },
};

/** Range of time distances to verify the formatting thresholds. */
export const TimeRange: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[
        { label: 'Just now', value: new Date(NOW - 2000) },
        { label: '3 min ago', value: mins(3) },
        { label: '47 min ago', value: mins(47) },
        { label: '2 h ago', value: hours(2) },
        { label: '3 d ago', value: days(3) },
        { label: '2 w ago', value: days(14) },
      ].map(({ label, value }) => (
        <div key={label} style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--fg-muted)', width: 80 }}>{label}</span>
          <RelativeTime value={value} />
        </div>
      ))}
    </div>
  ),
};

/** In a deploy log — service name + deploy ID + timestamp. */
export const InContext: Story = {
  render: () => {
    const rows = [
      { service: 'pix-router', id: 'D-9182', started: mins(14) },
      { service: 'fraud-engine', id: 'D-9181', started: mins(47) },
      { service: 'identity-svc', id: 'D-9180', started: hours(2) },
      { service: 'bureau-gateway', id: 'D-9179', started: hours(3) },
      { service: 'ledger-svc', id: 'D-9178', started: hours(1) },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {rows.map(({ service, id, started }) => (
          <div
            key={id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '8px 0',
              borderBottom: '1px solid var(--border)',
              fontSize: 13,
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', width: 160 }}>{service}</span>
            <span style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{id}</span>
            <span style={{ marginInlineStart: 'auto', fontSize: 12, color: 'var(--fg-muted)' }}>
                <RelativeTime value={started} tooltip />
              </span>
          </div>
        ))}
      </div>
    );
  },
};
