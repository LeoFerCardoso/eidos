import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CopyChip } from '@eidos/ui';

const TONES = ['default', 'ember', 'ice'] as const;

const meta = {
  title: 'Primitives/CopyChip',
  component: CopyChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Click-to-copy chip — displays a value (commit SHA, namespace, service ref) and copies it to the clipboard on click. ' +
          'Shows a brief "Copied" checkmark affordance for 1.4 s. Three tones via `.chip` variants.',
      },
    },
  },
  args: {
    value: 'a3f9c2d',
    tone: 'default',
  },
  argTypes: {
    value: { control: 'text', description: 'Text to copy (also displayed unless `label` overrides).' },
    label: { control: 'text', description: 'Display label — use for shortened SHAs or aliases.' },
    tone: { control: 'inline-radio', options: TONES },
  },
} satisfies Meta<typeof CopyChip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default chip with a commit SHA. */
export const Default: Story = {};

/** Ember-tinted — for primary identifiers in a header. */
export const Ember: Story = {
  args: { value: 'identity-svc@4.18.2', tone: 'ember' },
};

/** Ice-tinted — for namespaces or environment refs. */
export const Ice: Story = {
  args: { value: 'prod-us-east-1', tone: 'ice' },
};

/** With a shortened label that hides the full value visually. */
export const WithLabel: Story = {
  args: { value: 'a3f9c2d8e1b57f0943ac2d1e84f6b7c0938572ad', label: 'a3f9c2d' },
};

/**
 * Truncate the display, copy the full value — the page's value-vs-label axis.
 * The visible alias stays scannable while `value` carries the full canonical string.
 */
export const Truncated: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
      <CopyChip value="ghcr.io/eidos/payments-api:a3f8e4c2d9b817f6e4d8e3b0e2af1a06c8d7b5a9" label="a3f8e4c" />
      <CopyChip value="sk_live_8x4Pr••••••••••••" label="sk_live_8x4···" />
      <CopyChip value="ns: eidos-prod-us-east-2-aurora-cluster-01" label="eidos-prod-us-east-2" />
    </div>
  ),
};

/** All three tones. */
export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
      {TONES.map((tone) => (
        <CopyChip key={tone} value={`ref-${tone}`} tone={tone} />
      ))}
    </div>
  ),
};

/**
 * Copied state — the headline behaviour. Click a chip to trigger the transient
 * `.is-copied` success surface (~1.4 s) and the live "Copied" confirmation.
 * The chip owns its own copied state; the surrounding render adds an
 * aria-live announcement so the affordance is observable in the story canvas.
 */
export const Copied: Story = {
  render: () => {
    const [last, setLast] = React.useState<string | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }} onClick={() => setLast('try clicking me')}>
          <CopyChip value="try clicking me" />
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }} onClick={() => setLast('catalog://agents/code-reviewer')}>
          <CopyChip value="eidos://catalog/agents/code-reviewer-v2" label="catalog://agents/code-reviewer" />
        </div>
        <span aria-live="polite" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>
          {last ? `Copied: ${last}` : 'Click a chip to copy — note the brief success state.'}
        </span>
      </div>
    );
  },
};

/** In a service detail row — K8s namespace + deploy SHA. */
export const InContext: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 16,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        maxWidth: 440,
      }}
    >
      {[
        { label: 'Namespace', value: 'pix-router-prod', tone: 'ice' as const },
        { label: 'Commit SHA', value: 'a3f9c2d8e1b57f09', displayLabel: 'a3f9c2d', tone: 'default' as const },
        { label: 'Image tag', value: 'pix-router:2.7.0-canary', tone: 'ember' as const },
      ].map(({ label, value, displayLabel, tone }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{label}</span>
          <CopyChip value={value} label={displayLabel} tone={tone} />
        </div>
      ))}
    </div>
  ),
};
