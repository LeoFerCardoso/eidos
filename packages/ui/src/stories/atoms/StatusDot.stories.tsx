import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusDot } from '@eidos/ui';

// The full set of status tones backed by ds.css (`.s-dot.<tone>`).
const TONES = [
  'up', 'running', 'pending', 'degraded', 'down', 'error',
  'done', 'skipped', 'unknown', 'p0', 'p1', 'p2', 'p3',
] as const;

const meta = {
  title: 'Primitives/StatusDot',
  component: StatusDot,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A 1-glyph status indicator — a tinted dot keyed to a Forge status tone. ' +
          'Decorative by default (`aria-hidden`); pair it with a visible label or pass `title` for a tooltip.',
      },
    },
  },
  args: { tone: 'up', size: 'md', pulse: false },
  argTypes: {
    tone: { control: 'select', options: TONES, description: 'Status tone (drives the color).' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    pulse: { control: 'boolean', description: 'Animate a soft pulse — use sparingly for live/at-risk states.' },
    title: { control: 'text' },
  },
} satisfies Meta<typeof StatusDot>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single dot, driven entirely by the controls. */
export const Default: Story = {};

/** Every tone in the system, with its key. */
export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
      {TONES.map((tone) => (
        <span key={tone} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <StatusDot tone={tone} />
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{tone}</code>
        </span>
      ))}
    </div>
  ),
};

/** The three sizes, side by side. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <span key={size} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <StatusDot tone="up" size={size} />
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{size}</code>
        </span>
      ))}
    </div>
  ),
};

/** Pulsing — for a live or actively-degrading signal. */
export const Pulsing: Story = {
  args: { tone: 'running', pulse: true },
};

/**
 * The dot's headline use: paired with a label inside real rows — a pipeline
 * step list, a service health row, and dense mono log lines. Mirrors the doc
 * page's "In context" section.
 */
export const InContext: Story = {
  render: () => {
    const row: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      color: 'var(--fg-muted)',
    };
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 20,
          fontSize: 'var(--text-base)',
          maxWidth: 520,
        }}
      >
        {/* Pipeline-style row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '10px 14px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface)',
          }}
        >
          <span style={row}><StatusDot tone="done" /><span>checkout</span></span>
          <span style={{ color: 'var(--fg-faint)' }}>›</span>
          <span style={row}><StatusDot tone="done" /><span>build</span></span>
          <span style={{ color: 'var(--fg-faint)' }}>›</span>
          <span style={row}><StatusDot tone="running" pulse /><span>test</span></span>
          <span style={{ color: 'var(--fg-faint)' }}>›</span>
          <span style={row}><StatusDot tone="pending" /><span>deploy</span></span>
        </div>

        {/* Service health row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface)',
          }}
        >
          <span style={row}>
            <StatusDot tone="degraded" pulse />
            <span style={{ color: 'var(--fg)' }}>payments-api</span>
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>
            p99: 412ms · err: 1.4%
          </span>
        </div>

        {/* Log lines */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--fg-muted)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <span style={row}><StatusDot tone="done" size="sm" /><span>12:42:03  202  POST /v1/deploys/forge-api</span></span>
          <span style={row}><StatusDot tone="error" size="sm" /><span>12:42:04  500  POST /v1/agents/run</span></span>
          <span style={row}><StatusDot tone="skipped" size="sm" /><span>12:42:05  --   skipped: gate failed</span></span>
        </div>
      </div>
    );
  },
};
