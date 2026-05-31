import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Prose, ProseCode } from '@forge/ui';

const meta = {
  title: 'AI/Prose',
  component: Prose,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The `.ai-prose` editorial surface for rendered model markdown — headings, lists, ' +
          'inline code, links, tables, blockquotes. Pass already-rendered ReactNodes as children ' +
          '(e.g. react-markdown output). When `streaming`, the component marks the region ' +
          '`aria-live/aria-busy` and trails an animated caret on the last block.',
      },
    },
  },
  args: {
    streaming: false,
  },
  argTypes: {
    streaming: { control: 'boolean', description: 'Append a streaming caret and set aria-live.' },
    as:        { control: 'text', description: 'Wrapper element tag (default "div").' },
  },
} satisfies Meta<typeof Prose>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Typical model response with headings, list, and inline code. */
export const Default: Story = {
  render: (args) => (
    <Prose {...args}>
      <h2>Pix Router — Ring 2 canary assessment</h2>
      <p>
        The current p95 latency is <code>89 ms</code>, which is{' '}
        <strong>well within</strong> the 250 ms SLO threshold.
        The canary is at 62% production traffic with no error-rate anomaly.
      </p>
      <h3>Key observations</h3>
      <ul>
        <li>Idempotency keys added in PR #7421 prevent duplicate Pix transactions on retry.</li>
        <li>Blast radius is bounded to Ring 0→2; Ring 3 and 4 remain on <code>v2.6.1</code>.</li>
        <li>No SAST findings in the new changeset.</li>
      </ul>
      <p>
        Recommendation: proceed to Ring 3 unless p95 exceeds{' '}
        <code>180 ms</code> in the next 10 minutes.
      </p>
    </Prose>
  ),
};

/** Streaming — caret trails the last rendered character. */
export const Streaming: Story = {
  args: { streaming: true },
  render: (args) => (
    <Prose {...args}>
      <p>
        The bureau-gateway p95 is currently at <code>218 ms</code>, approaching the SLO limit
      </p>
    </Prose>
  ),
};

/** With a ProseCode block — mono header, copy button, pre body. */
export const WithCodeBlock: Story = {
  name: 'With ProseCode block',
  render: (args) => (
    <Prose {...args}>
      <p>To roll back the bureau-gateway deployment, run:</p>
      <ProseCode lang="bash">
        {`helm rollback bureau-gateway 0 --namespace production\nkubectl rollout status deployment/bureau-gateway -n production`}
      </ProseCode>
      <p>The rollback should complete in under 60 seconds.</p>
    </Prose>
  ),
};

/** ProseCode standalone — with copy button. */
export const ProseCodeStandalone: Story = {
  name: 'ProseCode — standalone',
  render: () => (
    <ProseCode lang="typescript">
      {`async function deployRing(ring: number, service: string): Promise<void> {\n  await k8s.rollout({ service, ring, canary: ring < 3 });\n}`}
    </ProseCode>
  ),
};

/** ProseCode — multiple languages. */
export const ProseCodeLanguages: Story = {
  name: 'ProseCode — languages',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ProseCode lang="bash">{'kubectl get pods -n production -l app=pix-router'}</ProseCode>
      <ProseCode lang="json">{'{\n  "service": "pix-router",\n  "ring": 2,\n  "p95": 89,\n  "slo": 250\n}'}</ProseCode>
      <ProseCode lang="python">{'df["user_agent"].isna().sum()  # → 37'}</ProseCode>
    </div>
  ),
};

/** In context — prose inside a chat bubble. */
export const InContext: Story = {
  render: () => (
    <div style={{
      maxWidth: 560,
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '14px 16px',
      fontFamily: 'var(--font-sans)',
      background: 'var(--surface)',
    }}>
      <Prose>
        <p>
          Based on the current telemetry, <strong>pix-router</strong> is healthy.
          The canary reached Ring 2 with p95 <code>89 ms</code>.
        </p>
        <ProseCode lang="bash">{'kubectl rollout status deployment/pix-router -n production'}</ProseCode>
        <p>Proceed to Ring 3 when ready.</p>
      </Prose>
    </div>
  ),
};
