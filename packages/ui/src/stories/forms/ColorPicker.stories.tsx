import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { ColorPicker, ColorInput } from '@forge/ui';

// ── Curated palettes ────────────────────────────────────────────────────────
// Brand / semantic tokens representative of a real IDP / DevEx design system.

const BRAND_SWATCHES = [
  '#FF6B35', // ember / accent
  '#1A73E8', // info-blue
  '#34A853', // success-green
  '#FBBC04', // warning-amber
  '#EA4335', // error-red
  '#9334E6', // purple / AI highlight
  '#0D1117', // ink / dark-bg
  '#F6F8FA', // surface / light-bg
];

const STATUS_SWATCHES = [
  '#22C55E', // deployed / healthy
  '#F59E0B', // degraded / warning
  '#EF4444', // incident / critical
  '#3B82F6', // in-progress
  '#6B7280', // idle / offline
  '#8B5CF6', // canary / experimental
];

const meta = {
  title: 'Forms/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '`ColorPicker` renders an inline HSV picker — saturation/value square, hue bar, ' +
          'optional alpha slider, hex + RGB inputs, optional eyedropper, and an optional ' +
          'swatch palette. Use it inside a popover (via `ColorInput`, the trigger wrapper) or ' +
          'inline when the color selection surface should always be visible — e.g. theme ' +
          'editors, incident-status colour coding, service-label configuration, and AI ' +
          'agent personality customisation.\n\n' +
          '`ColorInput` wraps `ColorPicker` in a swatch-trigger button that opens the picker ' +
          'in a `position:fixed` popover, safe under `overflow:hidden` ancestors.',
      },
    },
  },
  argTypes: {
    value: { control: 'text' },
    alpha: { control: 'boolean' },
    swatches: { control: false },
    onChange: { action: 'changed' },
    popRef: { control: false },
    style: { control: false },
  },
  args: {
    value: '#FF6B35',
    alpha: false,
    swatches: [],
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ─────────────────────────────────────────────────────────────────

/**
 * Minimal inline picker. The ember accent (`#FF6B35`) is the default value —
 * matching the Forge brand token. Drag the SV square or the hue bar to
 * explore; the hex and RGB fields update in real time.
 */
export const Default: Story = {
  args: {
    value: '#FF6B35',
    alpha: false,
    swatches: [],
  },
};

// ── With swatch palette ─────────────────────────────────────────────────────

/**
 * Brand swatch palette — 8 curated tokens covering accent, semantic states,
 * ink and surface. One click applies the colour without touching the sliders.
 * Suitable for theme configuration flows.
 */
export const WithSwatches: Story = {
  args: {
    value: '#1A73E8',
    swatches: BRAND_SWATCHES,
  },
};

// ── Alpha enabled ───────────────────────────────────────────────────────────

/**
 * When `alpha` is `true` an additional alpha slider appears below the hue bar
 * and the hex field expands to 8 characters (`#RRGGBBAA`). Use for overlay
 * colours — chart annotations, incident-band backgrounds, AI response
 * highlight fills.
 */
export const WithAlpha: Story = {
  args: {
    value: '#9334E680',
    alpha: true,
    swatches: STATUS_SWATCHES,
  },
};

// ── States (ColorInput trigger variants) ───────────────────────────────────

/**
 * `ColorInput` is the production-ready trigger that wraps `ColorPicker` in a
 * fixed-position popover. This story lays out all three trigger sizes and the
 * disabled state side by side so you can compare them at a glance.
 *
 * - **sm** (28 px) — compact toolbars, inline property panels.
 * - **md** (36 px, default) — standard form rows.
 * - **lg** (44 px) — prominent theme or brand editors.
 * - **disabled** — greys out the trigger and blocks the popover.
 */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
      {/* Size row */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--fg-faint)',
              marginBottom: 8,
            }}
          >
            sm — 28 px
          </div>
          <ColorInput
            size="sm"
            defaultValue="#1A73E8"
            swatches={BRAND_SWATCHES}
          />
        </div>

        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--fg-faint)',
              marginBottom: 8,
            }}
          >
            md — 36 px (default)
          </div>
          <ColorInput
            size="md"
            defaultValue="#FF6B35"
            swatches={BRAND_SWATCHES}
          />
        </div>

        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--fg-faint)',
              marginBottom: 8,
            }}
          >
            lg — 44 px
          </div>
          <ColorInput
            size="lg"
            defaultValue="#34A853"
            swatches={BRAND_SWATCHES}
          />
        </div>

        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--fg-faint)',
              marginBottom: 8,
            }}
          >
            disabled
          </div>
          <ColorInput
            size="md"
            defaultValue="#6B7280"
            disabled
          />
        </div>
      </div>

      {/* With alpha */}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--fg-faint)',
            marginBottom: 8,
          }}
        >
          md + alpha channel
        </div>
        <ColorInput
          size="md"
          defaultValue="#9334E680"
          alpha
          swatches={STATUS_SWATCHES}
        />
      </div>
    </div>
  ),
};

// ── Controlled (with live readout) ──────────────────────────────────────────

/**
 * Fully controlled `ColorInput` — parent state drives the value; the selected
 * hex is echoed beside the trigger. Use this pattern in configuration forms
 * where the colour must be persisted or validated on change.
 */
export const Controlled: Story = {
  render: () => {
    const [color, setColor] = React.useState('#EA4335');
    return (
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <ColorInput
          value={color}
          onChange={setColor}
          swatches={STATUS_SWATCHES}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--fg-faint)',
            }}
          >
            Controlled value
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 14,
                height: 14,
                borderRadius: 3,
                background: color,
                border: '1px solid var(--border)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: 'var(--fg)',
              }}
            >
              {color}
            </span>
          </div>
        </div>
      </div>
    );
  },
};
