import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { SpeechInput, PromptInput } from '@eidos/ui';

// ── Waveform fixtures (mirror the doc page bar-count variants) ────────────────
const LEVELS_6: number[]  = [0.50, 0.82, 0.44, 0.91, 0.63, 0.37];
const LEVELS_14: number[] = [0.35, 0.62, 0.84, 0.51, 0.78, 0.43, 0.91, 0.67, 0.55, 0.80, 0.39, 0.72, 0.48, 0.60];
const LEVELS_22: number[] = [0.4, 0.6, 0.8, 0.55, 0.72, 0.88, 0.42, 0.65, 0.91, 0.50, 0.73, 0.85, 0.38, 0.66, 0.80, 0.48, 0.70, 0.90, 0.44, 0.62, 0.78, 0.52];

const meta = {
  title: 'AI/Voice/SpeechInput',
  component: SpeechInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Mic button with state and optional waveform/transcript preview. Two shapes: ' +
          'full (dedicated voice screen, mic + waveform + hint) and compact (`compact=true`, ' +
          'icon-only button that slots into `PromptInput` footerTools).',
      },
    },
  },
  args: {
    state: 'idle',
    compact: false,
    transcript: '',
  },
  argTypes: {
    state:      { control: 'inline-radio', options: ['idle', 'listening', 'processing', 'error'] },
    compact:    { control: 'boolean' },
    transcript: { control: 'text' },
  },
} satisfies Meta<typeof SpeechInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full variant, idle — driven by args. */
export const Default: Story = {};

/** Interactive — toggle idle → listening with real useState. */
export const Interactive: Story = {
  render: () => {
    const [state, setState] = React.useState<'idle' | 'listening' | 'processing' | 'error'>('idle');
    const toggle = () => setState((s) => (s === 'idle' ? 'listening' : 'idle'));
    return (
      <SpeechInput
        state={state}
        onToggle={toggle}
        levels={state === 'listening' ? LEVELS_14 : undefined}
      />
    );
  },
};

/** Listening — animated waveform bars visible. */
export const Listening: Story = {
  args: { state: 'listening', levels: LEVELS_14 },
};

/** Processing — transcribing, mic stays focusable but onToggle is a no-op. */
export const Processing: Story = {
  args: { state: 'processing', transcript: 'What is the p95 for pix-router right now?' },
};

/** Error — microphone unavailable; danger-tinted, tap to retry. */
export const Error: Story = {
  args: { state: 'error' },
};

/** Waveform — 6 bars (compact toolbar width). Bar count = levels.length. */
export const Waveform6Bars: Story = {
  name: 'Waveform — 6 bars',
  args: { state: 'listening', levels: LEVELS_6 },
};

/** Waveform — 14 bars (standard surface). The default density. */
export const Waveform14Bars: Story = {
  name: 'Waveform — 14 bars (standard)',
  args: { state: 'listening', levels: LEVELS_14 },
};

/** Waveform — 22 bars (wide viewport). */
export const Waveform22Bars: Story = {
  name: 'Waveform — 22 bars (wide)',
  args: { state: 'listening', levels: LEVELS_22 },
};

/** With transcript — show waveform AND running transcription together while listening. */
export const WithTranscript: Story = {
  name: 'With transcript',
  args: {
    state: 'listening',
    levels: LEVELS_14,
    transcript: 'How long until the canary finishes?',
  },
};

/** Compact — icon-only mic button for the PromptInput footer. */
export const Compact: Story = {
  args: { compact: true, state: 'idle' },
};

/** Compact, listening — aria-pressed=true, ember-tinted. */
export const CompactListening: Story = {
  name: 'Compact — listening',
  args: { compact: true, state: 'listening' },
};

/** In context — compact mic slotted into PromptInput footerTools, the documented real surface. */
export const InContext: Story = {
  parameters: { layout: 'padded' },
  render: () => {
    const [state, setState] = React.useState<'idle' | 'listening' | 'processing' | 'error'>('idle');
    const toggle = () => {
      if (state === 'idle') {
        setState('listening');
      } else if (state === 'listening') {
        setState('processing');
        setTimeout(() => setState('idle'), 1600);
      }
    };
    return (
      <div style={{ width: '100%', maxWidth: 520 }}>
        <PromptInput
          placeholder="Ask anything…"
          status="ready"
          footerTools={<SpeechInput compact state={state} onToggle={toggle} />}
        />
      </div>
    );
  },
};
