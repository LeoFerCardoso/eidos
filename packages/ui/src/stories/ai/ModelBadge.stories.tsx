import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ModelBadge } from '@forge/ui';

const meta = {
  title: 'AI/ModelBadge',
  component: ModelBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A compact monospaced chip that displays a 1–2 letter model abbreviation inside ' +
          'the ModelSelector trigger. Composes the Forge Chip (badge family) with a size ' +
          'override tuned for inline use in the prompt composer footer. Use it wherever a ' +
          'model identity needs to appear in a constrained horizontal slot — trigger buttons, ' +
          'history rows, deployment cards, or agent-run meta lines.',
      },
    },
  },
  args: {
    short: 'S',
  },
  argTypes: {
    short: { control: 'text', description: '1–2 letter model abbreviation shown inside the chip.' },
  },
} satisfies Meta<typeof ModelBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sonnet 4.6 — the default single-letter chip as it appears in the composer trigger. */
export const Default: Story = {
  args: { short: 'S' },
};

/**
 * All three Forge-hosted model abbreviations side by side.
 * S = Sonnet 4.6  ·  O = Opus 4.7  ·  H = Haiku 4.5
 * Shows how the chip scales across the roster of available models.
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Forge-hosted models */}
      <div>
        <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Forge-hosted models
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ModelBadge short="S" />
          <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>Sonnet 4.6</span>
          <span style={{ color: 'var(--fg-subtle)', fontSize: 11, marginInlineStart: 8 }}>$3 / 1M tokens</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <ModelBadge short="O" />
          <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>Opus 4.7</span>
          <span style={{ color: 'var(--fg-subtle)', fontSize: 11, marginInlineStart: 8 }}>$15 / 1M tokens</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <ModelBadge short="H" />
          <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>Haiku 4.5</span>
          <span style={{ color: 'var(--fg-subtle)', fontSize: 11, marginInlineStart: 8 }}>$1 / 1M tokens</span>
        </div>
      </div>

      {/* Two-letter abbreviations */}
      <div>
        <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Two-letter abbreviations (partner models)
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ModelBadge short="G4" />
          <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>GPT-4o</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <ModelBadge short="G3" />
          <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>Gemini 2.0 Pro</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <ModelBadge short="L3" />
          <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>Llama 3.3 70B</span>
        </div>
      </div>

      {/* Inline in a mock trigger row */}
      <div>
        <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Inline trigger context
        </p>
        <button
          className="pi-model"
          style={{ cursor: 'default', pointerEvents: 'none' }}
          aria-label="Selected model: Sonnet 4.6"
        >
          <ModelBadge short="S" />
          <span className="name" style={{ fontSize: 12 }}>Sonnet 4.6</span>
        </button>
      </div>
    </div>
  ),
};

/** Agent-run history rows — badge positioned next to the run metadata line. */
export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {[
        { short: 'S', name: 'Sonnet 4.6', run: 'fraud-score-agent · run #1847', duration: '4.2 s', tokens: '3,120', status: 'Completed' },
        { short: 'O', name: 'Opus 4.7',   run: 'incident-summariser · run #1846', duration: '11.8 s', tokens: '8,540', status: 'Completed' },
        { short: 'H', name: 'Haiku 4.5',  run: 'log-classifier · run #1845',     duration: '0.9 s', tokens: '870',   status: 'Completed' },
      ].map((row) => (
        <div
          key={row.run}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <ModelBadge short={row.short} />
          <span style={{ flex: 1, fontSize: 12, color: 'var(--fg)' }}>{row.run}</span>
          <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>{row.tokens} tok</span>
          <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', minWidth: 44, textAlign: 'end' }}>{row.duration}</span>
        </div>
      ))}
    </div>
  ),
};
