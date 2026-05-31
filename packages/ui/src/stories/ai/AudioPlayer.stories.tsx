import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { AudioPlayer } from '@eidos/ui';

// ── Fixtures ─────────────────────────────────────────────────────────────────
// A freely-available audio file that loads without network (data URI stub) is
// not possible; we use a public domain WAV for Storybook demos. Storybook runs
// offline gracefully — the player renders and controls work; play just stalls.
const DEMO_SRC = 'https://www.w3schools.com/html/horse.ogg';

// 80-bar waveform (0..1 amplitude)
const PEAKS = Array.from({ length: 80 }, (_, i) =>
  0.1 + 0.85 * Math.abs(Math.sin(i * 0.38 + 0.7) * Math.cos(i * 0.12))
);

const meta = {
  title: 'AI/Voice/AudioPlayer',
  component: AudioPlayer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A minimal play/pause/skip/scrub/speed/mute audio player backed by a real ' +
          '`<audio>` element. Supports an optional waveform (`peaks`) and artwork cover. ' +
          'Speed cycles through 0.75×, 1×, 1.25×, 1.5×, 2× on each click. All controls ' +
          'are keyboard-accessible.',
      },
    },
  },
  args: {
    src: DEMO_SRC,
    title: 'Pix Router · Deploy review · 14 min',
    subtitle: 'Recorded 2026-05-29 · Ring 2 canary',
    skipSeconds: 10,
  },
  argTypes: {
    src:         { control: 'text' },
    title:       { control: 'text' },
    subtitle:    { control: 'text' },
    skipSeconds: { control: 'number' },
    duration:    { control: 'number', description: 'Override duration (seconds) for demo without a real file.' },
  },
} satisfies Meta<typeof AudioPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — title, subtitle, plain scrubber. */
export const Default: Story = {};

/** With waveform — peaks replace the plain track bar. */
export const WithWaveform: Story = {
  name: 'With waveform',
  args: { peaks: PEAKS, duration: 847 },
};

/** With cover artwork — leading image slot. */
export const WithCover: Story = {
  name: 'With cover art',
  args: {
    cover: (
      <div style={{
        width: 48, height: 48, borderRadius: 6,
        background: 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#08090A', fontWeight: 700, fontSize: 18,
        fontFamily: 'var(--font-mono)',
      }}>
        PR
      </div>
    ),
    peaks: PEAKS,
    duration: 420,
  },
};

/** No title or subtitle — controls only. */
export const Minimal: Story = {
  name: 'Minimal (no meta)',
  args: { title: undefined, subtitle: undefined, duration: 312 },
};

/** Interactive — real state, showing play/pause toggle. */
export const Interactive: Story = {
  render: () => (
    <AudioPlayer
      src={DEMO_SRC}
      title="Bureau Gateway · Incident review"
      subtitle="2026-05-28 · 7 min"
      peaks={PEAKS}
      duration={423}
      skipSeconds={15}
    />
  ),
};

/** In context — player inside an incident card. */
export const InContext: Story = {
  render: () => (
    <div style={{
      maxWidth: 540,
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>Incident debrief</div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>bureau-gateway · Ring 0 rollback · 2026-05-28</div>
      </div>
      <div style={{ padding: 16 }}>
        <AudioPlayer
          src={DEMO_SRC}
          title="Debrief recording"
          subtitle="Thiago Albuquerque · 7 min 3 s"
          peaks={PEAKS}
          duration={423}
        />
      </div>
    </div>
  ),
};
