import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icons } from '@eidos/ui';

// One story file, no component binding — Icons is a map, not a single component.
const meta = {
  title: 'Icons/Gallery',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The complete Forge icon set — Lucide-style 24×24 stroke glyphs, ' +
          'rendered at 20px here. Each entry in the `Icons` map is a standalone ' +
          'React component accepting `size`, `color`, and `strokeWidth` props.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** All glyphs in a labelled grid at the default size. */
export const AllIcons: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
        gap: 8,
        fontFamily: 'var(--font-mono)',
      }}
    >
      {Object.entries(Icons).map(([name, IconComponent]) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            padding: '12px 8px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--fg)',
          }}
        >
          <IconComponent size={20} />
          <span
            style={{
              fontSize: 10,
              color: 'var(--fg-muted)',
              textAlign: 'center',
              wordBreak: 'break-all',
              lineHeight: 1.3,
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
};

/** Large — glyphs at 32px for anatomy and documentation use. */
export const Large: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: 8,
        fontFamily: 'var(--font-mono)',
      }}
    >
      {Object.entries(Icons).map(([name, IconComponent]) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            padding: '16px 8px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--fg)',
          }}
        >
          <IconComponent size={32} />
          <span style={{ fontSize: 9, color: 'var(--fg-muted)', textAlign: 'center', wordBreak: 'break-all' }}>
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
};

/** Thinner stroke — all glyphs with strokeWidth 1 for editorial contexts. */
export const ThinStroke: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, color: 'var(--fg)' }}>
      {Object.entries(Icons).map(([name, IconComponent]) => (
        <IconComponent key={name} size={20} strokeWidth={1} />
      ))}
    </div>
  ),
};
