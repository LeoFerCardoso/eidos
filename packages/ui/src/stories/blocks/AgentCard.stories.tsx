import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentCard } from '@eidos/ui';

const NOW = Date.now();
const ago = (ms: number) => new Date(NOW - ms);

const AGENTS = [
  {
    name: 'Risk Analyst',
    model: 'claude-sonnet-4-6',
    status: 'up' as const,
    summary: 'Evaluates change risk scores for every pull request, checking blast radius, complexity, and SAST findings against policy thresholds.',
    capabilities: ['risk-scoring', 'sast', 'blast-radius', 'policy-gate'],
    calls: 12847,
    successRate: 98,
    lastRun: ago(14 * 60 * 1000),
  },
  {
    name: 'Fraud Detector',
    model: 'claude-opus-4',
    status: 'degraded' as const,
    summary: 'Real-time transaction scoring using behavioural signals, device fingerprints, and velocity checks.',
    capabilities: ['tx-scoring', 'device-fp', 'velocity', 'ml-features'],
    calls: 48291,
    successRate: 94,
    lastRun: ago(3 * 60 * 1000),
  },
  {
    name: 'SRE Responder',
    model: 'claude-haiku-4',
    status: 'up' as const,
    summary: 'Triages alerts, drafts runbook steps, and links related incidents from the last 30 days.',
    capabilities: ['alert-triage', 'runbook', 'incident-link', 'rca'],
    calls: 2391,
    successRate: 96,
    lastRun: ago(47 * 60 * 1000),
  },
  {
    name: 'KYC Orchestrator',
    model: 'claude-sonnet-4-6',
    status: 'down' as const,
    summary: 'Coordinates document validation, biometric checks, and bureau lookups for new account onboarding.',
    capabilities: ['doc-validation', 'biometric', 'bureau-lookup'],
    calls: 7104,
    successRate: 91,
    lastRun: ago(3 * 60 * 60 * 1000),
  },
];

const meta = {
  title: 'Elements/AgentCard',
  component: AgentCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A catalog tile for an AI agent: ember avatar with bot glyph, name, model, health badge, ' +
          'a 2-line summary, capability chips (up to 5), and a footer with run count, success rate, ' +
          'and relative time of the last run.',
      },
    },
  },
  args: {
    agent: AGENTS[0],
  },
  argTypes: {},
} satisfies Meta<typeof AgentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Healthy agent with strong run metrics. */
export const Default: Story = {};

/** Degraded agent — health badge reflects the impaired status. */
export const Degraded: Story = {
  args: { agent: AGENTS[1] },
};

/** Agent that is fully down. */
export const Down: Story = {
  args: { agent: AGENTS[3] },
};

/** Agent with no run stats yet (new / uncalled). */
export const NoStats: Story = {
  args: {
    agent: {
      name: 'Data Classifier',
      model: 'claude-haiku-4',
      status: 'unknown',
      summary: 'Classifies data sensitivity levels for the data-export pipeline. Not yet active in production.',
      capabilities: ['classification', 'pii-detection'],
    },
  },
};

/** Grid of agent tiles as seen in the AI agent catalog. */
export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {AGENTS.map((agent) => (
        <AgentCard key={agent.name} agent={agent} onOpen={() => {}} />
      ))}
    </div>
  ),
};

/** Clickable tile in a command palette–style agent picker. */
export const InContext: Story = {
  render: () => (
    <div style={{ maxWidth: 340 }}>
      <AgentCard agent={AGENTS[0]} onOpen={() => {}} />
    </div>
  ),
};
