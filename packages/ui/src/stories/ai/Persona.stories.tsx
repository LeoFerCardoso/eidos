import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Persona, SpeechInput, AgentIdentity } from '@eidos/ui';

// ── Persona meta ─────────────────────────────────────────────────────────────

const meta = {
  title: 'AI/Voice/Persona',
  component: Persona,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The voice orb that represents the AI on a dedicated audio surface, visualising ' +
          'the conversation state: idle, listening, thinking, or speaking. The ring and orb ' +
          'animate via CSS; animations are suppressed under `prefers-reduced-motion`, where ' +
          'the gradient tint alone differentiates states. For static chat headers and lists, ' +
          'reach for AgentIdentity instead.',
      },
    },
  },
  args: { state: 'listening', size: 96, label: 'Forge Voice Agent' },
  argTypes: {
    state: { control: 'inline-radio', options: ['idle', 'listening', 'thinking', 'speaking'] },
    size: { control: 'number' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Persona>;

export default meta;
type Story = StoryObj<typeof meta>;

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
};
const monoLabel: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: 'var(--fg-muted)',
};

/** Single orb, driven by controls — the hello-world the doc page leads with. */
export const Default: Story = {};

/** The four documented states side by side: idle · listening · thinking · speaking. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
      {(['idle', 'listening', 'thinking', 'speaking'] as const).map((s) => (
        <div key={s} style={stack}>
          <Persona state={s} size={96} label="Forge Voice Agent" />
          <span style={monoLabel}>{s.toUpperCase()}</span>
        </div>
      ))}
    </div>
  ),
};

/** The four documented sizes — 64 · 96 · 144 · 200 px; stay at/above 48 px so the ring + gradient hold. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      {[64, 96, 144, 200].map((sz) => (
        <div key={sz} style={stack}>
          <Persona state="idle" size={sz} label="Forge Voice Agent" />
          <span style={monoLabel}>{sz}</span>
        </div>
      ))}
    </div>
  ),
};

/** Canonical audio-only layout: the orb (size 200) centred above the SpeechInput. */
export const VoiceSurface: Story = {
  name: 'In a voice surface',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        minBlockSize: 360,
        padding: 32,
      }}
    >
      <Persona state="listening" size={200} label="Forge Voice Agent" />
      <SpeechInput
        state="listening"
        levels={[0.4, 0.7, 0.9, 0.6, 0.8, 0.5, 0.7, 0.9, 0.4, 0.6, 0.8, 0.5, 0.7, 0.6]}
      />
    </div>
  ),
};

/** When to use each: Persona on an audio surface vs. AgentIdentity in a chat header / list. */
export const WithAgentIdentity: Story = {
  name: 'With AgentIdentity',
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={stack}>
        <Persona state="speaking" size={96} label="Forge Voice Agent" />
        <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>audio surface</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBlockStart: 12 }}>
        <AgentIdentity
          agent={{ name: 'Forge Voice Agent', model: 'anthropic/claude-sonnet-4.5', status: 'online' }}
        />
        <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>
          chat header / settings list
        </span>
      </div>
    </div>
  ),
};
