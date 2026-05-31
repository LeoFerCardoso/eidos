import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Transcription, Persona } from '@forge/ui';
import type { TranscriptTurn } from '@forge/ui';

// ── Fixtures ─────────────────────────────────────────────────────────────────

const TURNS: TranscriptTurn[] = [
  { id: 'u1', speaker: 'Leonardo', initials: 'LM', side: 'user',  text: 'What is the current p95 latency for pix-router?', time: '14:01' },
  { id: 'a1', speaker: 'Forge AI', initials: 'AI', side: 'agent', text: 'The pix-router p95 is 89 ms, well below the 250 ms SLO threshold. Ring 2 canary is at 62% traffic.', time: '14:01', confidence: 0.97 },
  { id: 'u2', speaker: 'Leonardo', initials: 'LM', side: 'user',  text: 'Any active alerts on the Pix tribe?', time: '14:02' },
  { id: 'a2', speaker: 'Forge AI', initials: 'AI', side: 'agent', text: 'One alert: pix-router has an anomaly flag set. No alert on ledger-svc or reconciliation-svc.', time: '14:02', confidence: 0.91 },
  { id: 'u3', speaker: 'Leonardo', initials: 'LM', side: 'user',  text: 'Can you open the emergency rollback runbook for pix-router?', time: '14:03' },
  { id: 'a3', speaker: 'Forge AI', initials: 'AI', side: 'agent', text: 'Opening runbook rb-pix-rollback. Last successful execution was 14 days ago, 7 total runs, 100% success rate.', time: '14:03', confidence: 0.99 },
];

// Long fixture (11 turns) for the scroll-container story.
const LONG_TURNS: TranscriptTurn[] = [
  { id: 'l1',  speaker: 'Forge AI', initials: 'AI', side: 'agent', time: '10:00', text: 'Daily briefing: 14 services healthy, 1 degraded (billing-svc — p95 elevated).' },
  { id: 'l2',  speaker: 'Lead SRE', initials: 'LS', side: 'user',  time: '10:00', text: "What's causing the billing-svc degradation?" },
  { id: 'l3',  speaker: 'Forge AI', initials: 'AI', side: 'agent', time: '10:01', text: 'A spike in checkout volume at 09:52 UTC triggered the autoscaler. New instances are warm — p95 should recover within 3 minutes.' },
  { id: 'l4',  speaker: 'Lead SRE', initials: 'LS', side: 'user',  time: '10:01', text: 'Should I page the billing team?' },
  { id: 'l5',  speaker: 'Forge AI', initials: 'AI', side: 'agent', time: '10:01', text: 'Not yet. The autoscaler is handling it. Suggest a 5-minute window before escalation.' },
  { id: 'l6',  speaker: 'Lead SRE', initials: 'LS', side: 'user',  time: '10:02', text: "Agreed. What's the on-call rotation look like this week?" },
  { id: 'l7',  speaker: 'Forge AI', initials: 'AI', side: 'agent', time: '10:02', text: 'Primary: Reza (platform). Secondary: Ana (infra). Escalation: Leo (team lead). No swaps flagged.' },
  { id: 'l8',  speaker: 'Lead SRE', initials: 'LS', side: 'user',  time: '10:03', text: 'All good. Anything else for the standup?' },
  { id: 'l9',  speaker: 'Forge AI', initials: 'AI', side: 'agent', time: '10:03', text: 'One deploy window at 14:00 UTC — feature-flags service, patch release. Low risk, 10-minute rollout.' },
  { id: 'l10', speaker: 'Lead SRE', initials: 'LS', side: 'user',  time: '10:03', text: "Noted. I'll mention it. Thanks." },
  { id: 'l11', speaker: 'Forge AI', initials: 'AI', side: 'agent', time: '10:04', text: 'Standup digest has been posted to #platform-oncall.' },
];

// Script the Live story replays one turn at a time.
const LIVE_SCRIPT: TranscriptTurn[] = [
  { id: 'v1', speaker: 'Forge AI', initials: 'AI', side: 'agent', time: '11:00', text: 'Voice session started. How can I help you today?' },
  { id: 'v2', speaker: 'You',      initials: 'YO', side: 'user',  time: '11:00', text: 'Check the status of the payment pipeline.' },
  { id: 'v3', speaker: 'Forge AI', initials: 'AI', side: 'agent', time: '11:00', text: 'Payment pipeline is healthy. All 6 stages are processing normally with a p99 of 210 ms.' },
  { id: 'v4', speaker: 'You',      initials: 'YO', side: 'user',  time: '11:01', text: 'Any failed transactions in the last hour?' },
  { id: 'v5', speaker: 'Forge AI', initials: 'AI', side: 'agent', time: '11:01', text: '3 failed transactions — all flagged as fraud, not system errors. No action needed.' },
  { id: 'v6', speaker: 'You',      initials: 'YO', side: 'user',  time: '11:01', text: 'Great. End session.' },
];

const meta = {
  title: 'AI/Voice/Transcription',
  component: Transcription,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Speaker-labelled turn list for a voice or audio session transcript. ' +
          'User turns are tinted with the ember accent; agent turns are neutral. ' +
          'Optionally renders per-turn timestamps and confidence percentage chips. ' +
          'The list carries role="log" so appended turns are announced as a polite live region.',
      },
    },
  },
  args: {
    showTime: true,
    showConfidence: false,
  },
  argTypes: {
    showTime:       { control: 'boolean' },
    showConfidence: { control: 'boolean' },
  },
} satisfies Meta<typeof Transcription>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — speaker-labelled turns with timestamps, no confidence (the Usage demo). */
export const Default: Story = {
  args: { turns: TURNS },
};

/** With confidence — colour-coded accuracy chips (≥90% muted, 70–90% amber, <70% danger). */
export const WithConfidence: Story = {
  name: 'With confidence chips',
  args: { turns: TURNS, showConfidence: true },
};

/** No timestamps — showTime=false drops the time field per turn. */
export const NoTimestamps: Story = {
  name: 'No timestamps',
  args: { turns: TURNS, showTime: false },
};

/** Empty — no turns yet; the role="log" container renders ready to receive appends. */
export const Empty: Story = {
  args: { turns: [] },
};

/** Long transcript — 11+ turns inside a max-height scroll container (overflow-y: auto). */
export const LongTranscript: Story = {
  name: 'Long transcript (scroll)',
  render: (args) => (
    <div style={{ maxHeight: 280, overflowY: 'auto', width: '100%', maxWidth: 560 }}>
      <Transcription {...args} turns={LONG_TURNS} />
    </div>
  ),
};

/** Live (streaming) — turns append every ~1.4 s into the role="log" region, then reset and replay. */
export const Live: Story = {
  name: 'Live (streaming)',
  render: (args) => {
    const [turns, setTurns] = React.useState<TranscriptTurn[]>([]);
    const idxRef = React.useRef(0);
    React.useEffect(() => {
      const id = setInterval(() => {
        const next = LIVE_SCRIPT[idxRef.current];
        if (!next) {
          setTurns([]);
          idxRef.current = 0;
          return;
        }
        setTurns((prev) => [...prev, next]);
        idxRef.current += 1;
      }, 1400);
      return () => clearInterval(id);
    }, []);
    return (
      <div style={{ width: '100%', maxWidth: 560 }}>
        <Transcription {...args} turns={turns} />
      </div>
    );
  },
};

/** In context — the canonical voice-reply surface: a Persona orb above the transcript. */
export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: '100%', maxWidth: 560 }}>
      <Persona state="speaking" size={96} label="Forge Agent" />
      <div style={{ width: '100%', maxHeight: 360, overflowY: 'auto' }}>
        <Transcription turns={TURNS} showTime showConfidence />
      </div>
    </div>
  ),
};
