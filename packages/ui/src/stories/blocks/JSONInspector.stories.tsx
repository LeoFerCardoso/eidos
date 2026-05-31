import type { Meta, StoryObj } from '@storybook/react-vite';
import { JSONInspector, MOCKS } from '@eidos/ui';

const DEPLOY_PAYLOAD = {
  id: 'D-9182',
  service: 'pix-router',
  version: '2.7.0',
  author: 'Rafael Mendonça',
  status: 'in-flight',
  currentRing: 2,
  progress: 62,
  stages: {
    build:  { status: 'done', duration: '1m 12s', artifacts: 142 },
    test:   { status: 'done', duration: '4m 38s', specs: 1847 },
    sast:   { status: 'done', duration: '22s',    findings: 0 },
    risk:   { status: 'done', score: 34, verdict: 'low', blastRadius: 'Ring 0→2' },
    canary: { status: 'running', ring: 2, percentHealth: 62 },
    full:   { status: 'pending' },
  },
  rings: [
    { ring: 0, audience: 'Internal',    percent: 100, status: 'done' },
    { ring: 1, audience: 'Canary 1%',   percent: 100, status: 'done' },
    { ring: 2, audience: '10% traffic', percent: 62,  status: 'running' },
    { ring: 3, audience: '50% traffic', percent: 0,   status: 'pending' },
    { ring: 4, audience: '100%',        percent: 0,   status: 'pending' },
  ],
  metadata: {
    commitSha: 'a1b2c3d4e5f6',
    prNumber: 7421,
    triggeredAt: '2026-05-29T02:14:01Z',
    qualityGate: {
      cyclomaticComplexity: 8,
      cognitiveComplexity: 11,
      maintainabilityIndex: 64,
      coverageDelta: '+1.2%',
      sast: 0,
    },
  },
};

// LLM tool-use trace — the doc page leads with this as the inspector's ideal companion
// to the Agent / Tool pages. Mixes string / number / boolean / nested-array / object.
const AGENT_TRACE = {
  agent: 'pr-reviewer',
  model: 'gpt-4o',
  input: 'review PR #7421',
  tools: [
    { name: 'github_pull',     args: { number: 7421 },              latency_ms: 142 },
    { name: 'semantic_search', args: { query: 'idempotency keys' }, hits: 4 },
    { name: 'risk_score',      args: { pr: 7421 }, output: { score: 34, verdict: 'low' } },
  ],
  tokens: { input: 1842, output: 412 },
  cost_usd: 0.018,
  cached: true,
};

const SIMPLE_OBJECT = {
  name: 'pix-router',
  tier: 'T1',
  lang: 'Go',
  p95: 89,
  alert: true,
  tags: ['pix', 'payments', 'fintech'],
};

const meta = {
  title: 'Blocks/JSONInspector',
  component: JSONInspector,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A collapsible, colour-coded JSON tree for API payloads, LLM agent traces, webhook bodies, and deploy manifests. ' +
          'Keys render in ember, strings in green, numbers in cyan, booleans in warm amber, null in muted — colour is a scanning aid, the literal text carries the meaning. ' +
          'Nodes expand by default; pass `defaultCollapsedPaths` (e.g. `["$.rings"]`) to ship verbose branches folded on load. ' +
          'Recursive — handles any JSON-serializable value (object, array, or primitive) at arbitrary depth.',
      },
    },
  },
  args: {
    data: SIMPLE_OBJECT,
    defaultCollapsedPaths: [],
  },
  argTypes: {},
} satisfies Meta<typeof JSONInspector>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — a flat object driven by args; every primitive type (string, number, boolean, array) is visible at once. */
export const Default: Story = {};

/** A deeply nested deploy payload — the verbose rings + quality-gate branches ship pre-collapsed. */
export const DeepNested: Story = {
  args: {
    data: DEPLOY_PAYLOAD,
    defaultCollapsedPaths: ['$.rings', '$.metadata.qualityGate'],
  },
};

/** Agent trace — the doc page's lead use: an LLM tool-use trace (tools array, token counts, cost). */
export const AgentTrace: Story = {
  args: {
    data: AGENT_TRACE,
    defaultCollapsedPaths: [],
  },
};

/** Start collapsed — `defaultCollapsedPaths` hides verbose branches on initial render so the reader opens only what they came for. */
export const StartCollapsed: Story = {
  args: {
    data: DEPLOY_PAYLOAD,
    defaultCollapsedPaths: ['$.stages', '$.rings', '$.metadata'],
  },
};

/** An array at the top level — the inspector renders an array root as readily as an object root. */
export const ArrayRoot: Story = {
  args: {
    data: [
      { ring: 0, status: 'done',    percent: 100 },
      { ring: 1, status: 'done',    percent: 100 },
      { ring: 2, status: 'running', percent: 62  },
      { ring: 3, status: 'pending', percent: 0   },
    ],
  },
};

/** A bare primitive value — renders without a container object or array. */
export const PrimitiveValue: Story = {
  args: { data: 'pix-router v2.7.0 · Ring 2 · 62% healthy' },
};

/**
 * RTL — under `dir="rtl"` the fold carets anchor to the right, keys align from the right,
 * and child branches indent rightward (logical CSS). Colour encoding is unchanged.
 */
export const RTL: Story = {
  parameters: { docs: { description: { story: 'Arabic-keyed payload rendered right-to-left; indentation and fold carets mirror via logical CSS.' } } },
  render: () => (
    <div dir="rtl" style={{ maxWidth: 360 }}>
      <JSONInspector
        data={{
          الخدمة: 'pix-router',
          الإصدار: '2.7.0',
          النشر: { المرحلة: 'Ring 2', التقدم: 62 },
          الأعلام: { idempotency: true, batch_writes: false },
          العلامات: null,
        }}
        defaultCollapsedPaths={['$.النشر']}
      />
    </div>
  ),
};

/** In context — the inspector embedded in a deploy-event sidesheet, fed from the shared DEPLOYS mock. */
export const InContext: Story = {
  render: () => {
    const deploy = MOCKS.DEPLOYS[0];
    return (
      <div style={{ maxWidth: 560 }}>
        <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBlockEnd: 10 }}>
          {deploy.id} · raw deploy payload
        </p>
        <JSONInspector data={deploy} defaultCollapsedPaths={['$.stages']} />
      </div>
    );
  },
};
