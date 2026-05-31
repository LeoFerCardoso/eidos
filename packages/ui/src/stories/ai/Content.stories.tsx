import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { ImageView, Diagram, MathView } from '@forge/ui';

// ── ImageView meta ────────────────────────────────────────────────────────────
// NOTE: Shimmer stories have moved to Shimmer.stories.tsx (title 'AI/Shimmer').
// This file covers the remaining content blocks: ImageView, Diagram, MathView.
// Image-in-message / image-in-attachment contexts: see Attachment.stories.tsx.

const meta = {
  title: 'AI/ImageView',
  component: ImageView,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Bordered, rounded, aspect-locked image surface for AI replies. Handles a loading ' +
          'shimmer before decode, a graceful error fallback, and a figcaption for provenance. ' +
          'For attachments and images embedded in messages see the Attachment stories.',
      },
    },
  },
  args: {
    alt: 'Example image',
    aspect: '16 / 9',
    rounded: true,
  },
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    caption: { control: 'text' },
    aspect: { control: 'text' },
    width: { control: 'number' },
    rounded: { control: 'boolean' },
  },
} satisfies Meta<typeof ImageView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Loaded image — 16:9 with caption. */
export const Default: Story = {
  name: 'Loaded',
  args: {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&q=80',
    alt: 'Pix Router deploy dashboard screenshot',
    caption: 'Pix Router · Ring 2 canary — 14:01 BRT',
    aspect: '16 / 9',
    width: 480,
  },
};

/** Loading shimmer — broken URL triggers the shimmer while the browser times out. */
export const Loading: Story = {
  name: 'Loading shimmer',
  args: {
    src: 'https://example.invalid/never-loads.png',
    alt: '',
    aspect: '16 / 9',
    width: 480,
    caption: 'Loading…',
  },
};

/** Error fallback — broken URL eventually fires onError. */
export const ErrorFallback: Story = {
  name: 'Error fallback',
  render: () => (
    <ImageView
      src="https://broken.example/image.png"
      alt="Unavailable chart"
      caption="Data unavailable — check the source."
      aspect="16 / 9"
      width={320}
    />
  ),
};

/** No src — empty fallback renders immediately with the alt label. */
export const NoSrc: Story = {
  name: 'No src (empty fallback)',
  args: {
    alt: 'Architecture diagram',
    aspect: '4 / 3',
    width: 320,
  },
};

/** Aspect ratio variants — 16:9, 1:1, natural. */
export const AspectVariants: Story = {
  name: 'Aspect ratio variants',
  render: () => {
    const SVG_WIDE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%231e3a5f'/%3E%3Cstop offset='100%25' stop-color='%230f172a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='360' fill='url(%23g)'/%3E%3C/svg%3E`;
    const SVG_SQUARE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%230a0b0c'/%3E%3Ccircle cx='200' cy='200' r='80' fill='rgba(255,107,53,0.25)'/%3E%3C/svg%3E`;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', display: 'block', marginBottom: 6 }}>16 / 9</span>
          <ImageView src={SVG_WIDE} alt="Wide gradient" aspect="16 / 9" />
        </div>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', display: 'block', marginBottom: 6 }}>1 / 1</span>
          <ImageView src={SVG_SQUARE} alt="Square gradient" aspect="1 / 1" width={180} />
        </div>
      </div>
    );
  },
};

// ── Diagram ───────────────────────────────────────────────────────────────────

export const DiagramDefault: Story = {
  name: 'Diagram — SVG slot',
  render: () => (
    <Diagram caption="pix-router → bureau-gateway data flow (simplified)">
      <svg viewBox="0 0 320 80" width="320" height="80" style={{ display: 'block' }}>
        <rect x="4" y="24" width="100" height="32" rx="6" fill="var(--surface-2)" stroke="var(--border)"/>
        <text x="54" y="44" textAnchor="middle" fontSize="11" fill="var(--fg)" fontFamily="var(--font-mono)">pix-router</text>
        <path d="M104 40 L200 40" stroke="var(--fg-muted)" strokeWidth="1.5" markerEnd="url(#arr)"/>
        <defs>
          <marker id="arr" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--fg-muted)"/>
          </marker>
        </defs>
        <rect x="200" y="24" width="116" height="32" rx="6" fill="var(--surface-2)" stroke="var(--border)"/>
        <text x="258" y="44" textAnchor="middle" fontSize="11" fill="var(--fg)" fontFamily="var(--font-mono)">bureau-gateway</text>
      </svg>
    </Diagram>
  ),
};

// ── MathView ──────────────────────────────────────────────────────────────────

export const MathViewInline: Story = {
  name: 'MathView — inline',
  render: () => (
    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg)', lineHeight: 1.8 }}>
      The risk score is computed as{' '}
      <MathView>{'risk = 0.4·complexity + 0.3·blast + 0.3·coverage_delta'}</MathView>{' '}
      where each term is normalised to [0, 1].
    </p>
  ),
};

export const MathViewBlock: Story = {
  name: 'MathView — block display',
  render: () => (
    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg)' }}>
      <p>The ETI score is the weighted average of five pillars:</p>
      <MathView display>
        {'ETI = (velocity + quality + reliability + ai_adoption + standards) / 5'}
      </MathView>
    </div>
  ),
};
