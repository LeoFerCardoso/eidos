import type { Meta, StoryObj } from '@storybook/react-vite';
import { TokenSwatch } from '@eidos/ui';

const meta = {
  title: 'Docs/TokenSwatch',
  component: TokenSwatch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A live token swatch that paints its color via `var(varName)` so it tracks the active theme. ' +
          '`value` is the dark-mode literal; `lightValue` (optional) shows both dark and light values in ' +
          'the meta row. Includes a "Copy var" button for quick token adoption.',
      },
    },
  },
  args: {
    name: 'Ember / Accent',
    value: '#FF6B35',
    varName: '--ember',
    lightValue: undefined,
  },
  argTypes: {
    name: { control: 'text', description: 'Human-readable token name.' },
    value: { control: 'text', description: 'Dark-mode hex literal shown in the meta row.' },
    lightValue: { control: 'text', description: 'Light-mode hex literal — when provided both values are shown.' },
    varName: { control: 'text', description: 'CSS custom property name (e.g. "--ember").' },
  },
} satisfies Meta<typeof TokenSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The ember accent — the single brand color used throughout the DS. */
export const Default: Story = {};

/** Dual-mode token — shows both dark and light values in the meta. */
export const DualMode: Story = {
  args: {
    name: 'Background',
    value: '#08090A',
    lightValue: '#FFFFFF',
    varName: '--bg',
  },
};

/** A full palette of Forge semantic tokens. */
export const AllCoreTokens: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <TokenSwatch name="Ember / Accent" value="#FF6B35"  varName="--ember" />
      <TokenSwatch name="Background"     value="#08090A"  lightValue="#FFFFFF" varName="--bg" />
      <TokenSwatch name="Foreground"     value="#F5F5F5"  lightValue="#08090A" varName="--fg" />
      <TokenSwatch name="FG Muted"       value="#9CA3AF"  lightValue="#6B7280" varName="--fg-muted" />
      <TokenSwatch name="FG Faint"       value="#374151"  lightValue="#D1D5DB" varName="--fg-faint" />
      <TokenSwatch name="Surface"        value="#111318"  lightValue="#F9FAFB" varName="--surface" />
      <TokenSwatch name="Surface 2"      value="#1A1F2B"  lightValue="#F3F4F6" varName="--surface2" />
      <TokenSwatch name="Border"         value="#1F2937"  lightValue="#E5E7EB" varName="--border" />
      <TokenSwatch name="Success"        value="#22C55E"  varName="--success" />
      <TokenSwatch name="Warning"        value="#F59E0B"  varName="--warning" />
      <TokenSwatch name="Error"          value="#EF4444"  varName="--error" />
    </div>
  ),
};
