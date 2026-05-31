import type { Meta, StoryObj } from '@storybook/react-vite';
import { SpecRow } from '@eidos/ui';

const meta = {
  title: 'Docs/SpecRow',
  component: SpecRow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A single `<tr>` for a token/spec table — renders three cells: token name, value, and usage. ' +
          'Always wrap it in `<table><tbody>` in the consuming page; see the stories below for the ' +
          'correct table chrome that Eidos docs pages use.',
      },
    },
  },
  args: {
    token: '--ember',
    value: '#FF6B35',
    usage: 'Brand accent — at most 2× per screen.',
  },
  argTypes: {
    token: { control: 'text', description: 'Token name or element name shown in the first cell.' },
    value: { control: 'text', description: 'Resolved value or size shown in the second cell.' },
    usage: { control: 'text', description: 'Usage note shown in the third cell.' },
  },
} satisfies Meta<typeof SpecRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single row — must be rendered inside a table. */
export const Default: Story = {
  render: (args) => (
    <table className="tbl" style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Token</th>
          <th>Value</th>
          <th>Usage</th>
        </tr>
      </thead>
      <tbody>
        <SpecRow {...args} />
      </tbody>
    </table>
  ),
};

/** Full color-token spec table — the typical Tokens section layout. */
export const ColorTokenTable: Story = {
  render: () => (
    <table className="tbl" style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Token</th>
          <th>Value (dark)</th>
          <th>Usage</th>
        </tr>
      </thead>
      <tbody>
        <SpecRow token="--ember"    value="#FF6B35"  usage="Brand accent — at most 2× per screen." />
        <SpecRow token="--bg"       value="#08090A"  usage="Page background." />
        <SpecRow token="--fg"       value="#F5F5F5"  usage="Primary text on dark bg." />
        <SpecRow token="--fg-muted" value="#9CA3AF"  usage="Secondary / caption text." />
        <SpecRow token="--fg-faint" value="#374151"  usage="Decorative dividers, placeholder text." />
        <SpecRow token="--surface"  value="#111318"  usage="Card / panel background." />
        <SpecRow token="--border"   value="#1F2937"  usage="Dividers, input borders." />
      </tbody>
    </table>
  ),
};

/** Spacing spec table — same pattern, different column labels. */
export const SpacingTokenTable: Story = {
  render: () => (
    <table className="tbl" style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Token</th>
          <th>Value</th>
          <th>Usage</th>
        </tr>
      </thead>
      <tbody>
        <SpecRow token="--space-1"   value="4px"   usage="Icon gap, compact padding." />
        <SpecRow token="--space-2"   value="8px"   usage="Inline gap between label and icon." />
        <SpecRow token="--space-3"   value="12px"  usage="Button horizontal padding (sm)." />
        <SpecRow token="--space-4"   value="16px"  usage="Default section padding." />
        <SpecRow token="--space-6"   value="24px"  usage="Card internal padding." />
        <SpecRow token="--space-8"   value="32px"  usage="Section vertical rhythm." />
      </tbody>
    </table>
  ),
};
