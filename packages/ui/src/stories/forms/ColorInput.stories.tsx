import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { ColorInput, ColorPicker } from '@eidos/ui';

// ─── Forge / IDP brand swatches ────────────────────────────────────────────
const BRAND_SWATCHES = [
  '#FF6B35', '#F87171', '#FACC15', '#4ADE80',
  '#60A5FA', '#A78BFA', '#F472B6', '#08090A',
  '#1F2024', '#F4F4F5', '#FFFFFF', '#52525B',
];

const meta = {
  title: 'Forms/ColorInput',
  component: ColorInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A swatch + hex code trigger that opens an H/S/V color picker popover. ' +
          'State lives in HSV space so the saturation/value square and hue bar stay ' +
          'geometrically intuitive. Hex and RGB are derived and stay in sync. ' +
          'Optional alpha slider extends the hex format to 8 characters (#RRGGBBAA). ' +
          'The EyeDropper API is used when available (Chrome / Edge).',
      },
    },
  },
  args: {
    value: '#FF6B35',
    alpha: false,
    swatches: [],
    size: 'md',
    disabled: false,
  },
  argTypes: {
    value: { control: 'text' },
    alpha: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof ColorInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ──────────────────────────────────────────────────────────────────
/** Ember brand color — the picker's neutral starting state.
 *  Uses local state so the trigger swatch updates live when you open the picker
 *  and choose a color. */
export const Default: Story = {
  render: (args) => {
    const [color, setColor] = React.useState('#FF6B35');
    return <ColorInput {...args} value={color} onChange={setColor} />;
  },
};

// ── WithAlpha ────────────────────────────────────────────────────────────────
/**
 * Alpha slider enabled — hex extends to 8 characters (#RRGGBBAA).
 * The checker-pattern swatch reveals transparency visually.
 * Uses local state so the trigger updates live.
 */
export const WithAlpha: Story = {
  render: (args) => {
    const [color, setColor] = React.useState('#FF6B35E6');
    return <ColorInput {...args} value={color} onChange={setColor} alpha />;
  },
};

// ── WithSwatches ─────────────────────────────────────────────────────────────
/**
 * Curated Forge brand palette pinned below the inputs.
 * Click any swatch to snap to that value exactly.
 * Uses local state so the trigger swatch updates on every pick.
 */
export const WithSwatches: Story = {
  render: (args) => {
    const [color, setColor] = React.useState('#FF6B35');
    return <ColorInput {...args} value={color} onChange={setColor} swatches={BRAND_SWATCHES} />;
  },
};

// ── Sizes ────────────────────────────────────────────────────────────────────
/**
 * Three trigger sizes — sm (28px), md (36px), lg (44px) — to match the
 * surrounding form chrome height.
 */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
      <ColorInput {...args} size="sm" value="#60A5FA" />
      <ColorInput {...args} size="md" value="#4ADE80" />
      <ColorInput {...args} size="lg" value="#A78BFA" />
    </div>
  ),
};

// ── Interactive ──────────────────────────────────────────────────────────────
/**
 * Fully controlled — useState wires up onChange so the live hex value is
 * displayed below the trigger. This mirrors the real consumer pattern.
 */
export const Interactive: Story = {
  render: () => {
    const [color, setColor] = React.useState('#FF6B35');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
        <div className="in-field">
          <label className="in-label">Theme accent</label>
          <ColorInput
            value={color}
            onChange={setColor}
            swatches={BRAND_SWATCHES}
            alpha
          />
          <div className="in-help">
            Current value:{' '}
            <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>
              {color}
            </code>
          </div>
        </div>
        {/* Live preview swatch */}
        <div
          style={{
            height: 48,
            borderRadius: 'var(--radius-xl)',
            background: color,
            border: '1px solid var(--border)',
            transition: 'background 120ms',
          }}
          aria-hidden="true"
        />
      </div>
    );
  },
};

// ── InlineColorPicker ─────────────────────────────────────────────────────────
/**
 * The raw ColorPicker — rendered inline without the trigger popover.
 * Useful for embedding in a panel, settings sheet, or command palette.
 * The "Use preset" button switches to a clearly different color so live
 * updates are immediately visible.
 */
export const InlineColorPicker: Story = {
  render: () => {
    const [color, setColor] = React.useState('#60A5FA');
    return (
      <div style={{ maxWidth: 288, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <ColorPicker
          value={color}
          onChange={setColor}
          swatches={BRAND_SWATCHES}
          alpha
        />
        <button
          type="button"
          className="btn ghost"
          onClick={() => setColor('#FF6B35')}
          style={{ alignSelf: 'flex-start', width: 'auto', padding: '4px 10px', fontSize: 12 }}
        >
          Use ember preset
        </button>
        <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          {color}
        </p>
      </div>
    );
  },
};
