import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ForgeMark } from '@forge/ui';

const VARIANTS = ['solid', 'outline', 'expressive'] as const;

const meta = {
  title: 'Icons/ForgeMark',
  component: ForgeMark,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Forge brand mark — a Lucide flame flanked by three 4-point sparkles. ' +
          'Three variants: `solid` (production chrome, favicons), `outline` (editorial, ' +
          'spec sheets), and `expressive` (hero, splash, onboarding). ' +
          'On ember or accent fills the mark must use dark ink (#08090A) for contrast.',
      },
    },
  },
  args: {
    size: 32,
    variant: 'solid',
    color: 'var(--ember)',
    glow: false,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    size: { control: 'number' },
    color: { control: 'color' },
    glow: { control: 'boolean' },
  },
} satisfies Meta<typeof ForgeMark>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — solid variant at 32px in the ember token. */
export const Default: Story = {};

/** All three variants side by side. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      {VARIANTS.map((v) => (
        <div key={v} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <ForgeMark size={40} variant={v} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{v}</span>
        </div>
      ))}
    </div>
  ),
};

/** Sizes — from favicon-scale (16px) to hero (80px). */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24 }}>
      {[16, 24, 32, 48, 64, 80].map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <ForgeMark size={s} variant="solid" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-muted)' }}>{s}px</span>
        </div>
      ))}
    </div>
  ),
};

/** Glow — drop-shadow for splash and hero surfaces. */
export const WithGlow: Story = {
  args: { glow: true, size: 48, variant: 'solid' },
};

/** Expressive with glow — the hero combination for onboarding. */
export const ExpressiveGlow: Story = {
  args: { variant: 'expressive', glow: true, size: 64 },
};

/**
 * Contrast invariant: on an ember/accent fill the mark must be dark ink.
 * This story verifies the rule — `color="#08090A"` (var(--bg)) on the
 * ember tile, `color="var(--ember)"` on the dark surface.
 */
export const OnColoredSurfaces: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Ember fill → dark ink foreground */}
      <div style={{
        background: 'var(--ember)',
        borderRadius: 12,
        padding: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <ForgeMark size={40} variant="solid" color="#08090A" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#08090A' }}>ember fill</span>
      </div>
      {/* Dark surface → ember mark */}
      <div style={{
        background: '#08090A',
        borderRadius: 12,
        padding: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <ForgeMark size={40} variant="solid" color="var(--ember)" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ember)' }}>dark surface</span>
      </div>
      {/* Light surface → default ember */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        border: '1px solid #E5E7EB',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <ForgeMark size={40} variant="solid" color="var(--ember)" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#374151' }}>light surface</span>
      </div>
    </div>
  ),
};

/** Outline — editorial use, spec sheets and wireframes. */
export const Outline: Story = {
  args: { variant: 'outline', size: 48 },
};
