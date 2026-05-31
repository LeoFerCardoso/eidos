import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AILabelWithPopover } from '@eidos/ui';

const meta = {
  title: 'AI/AILabelWithPopover',
  component: AILabelWithPopover,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An interactive AI badge that reveals a popover with model provenance details — ' +
          'model identifier, generation timestamp, and confidence score. Use it anywhere ' +
          'AI-generated values appear in the product surface (tables, detail panels, ' +
          'decision boards) so operators can inspect and accept, edit, or revoke the output.',
      },
    },
  },
} satisfies Meta<typeof AILabelWithPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default pill — shows the popover with model, timestamp, and confidence on click. */
export const Default: Story = {
  args: {
    variant: 'pill',
    size: 'md',
    label: 'AI summary',
    model: 'forge-ai/gpt-4o-mini',
    ts: '2 min ago',
    confidence: 0.92,
    children: 'Fraud score elevated due to geolocation mismatch and 3 rapid sequential transactions.',
  },
};

/** Variant matrix — all four trigger flavors at medium size, each pre-populated with
 *  realistic IDP/DevEx data so reviewers can open any popover independently. */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>pill</span>
        <AILabelWithPopover
          variant="pill"
          size="md"
          label="Risk classification"
          model="forge-ai/risk-classifier-v2"
          ts="5 min ago"
          confidence={0.88}
        >
          Service classified as medium-risk based on 14-day transaction pattern and peer-group deviation.
        </AILabelWithPopover>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>mark</span>
        <AILabelWithPopover
          variant="mark"
          size="md"
          label="Incident summary"
          model="forge-ai/gpt-4o"
          ts="1 min ago"
          confidence={0.95}
        >
          High p95 latency in payment-gateway traced to stale feature-store data after canary rollout.
        </AILabelWithPopover>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>box</span>
        <AILabelWithPopover
          variant="box"
          size="md"
          label="Deploy recommendation"
          model="forge-ai/deploy-advisor-v1"
          ts="12 min ago"
          confidence={0.79}
        >
          Model recommends delaying ring-2 rollout — error rate in ring-1 is 0.4%, above the 0.2% threshold.
        </AILabelWithPopover>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>dot</span>
        <AILabelWithPopover
          variant="dot"
          size="md"
          label="Anomaly detected"
          model="forge-ai/anomaly-detector-v3"
          ts="just now"
          confidence={0.97}
        >
          Unusually high API call rate from merchant ID M-88231 — 3.4× above 30-day baseline.
        </AILabelWithPopover>
      </div>
    </div>
  ),
};

/** Size scale — the same pill variant at sm, md, and lg to verify visual rhythm in dense layouts. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <AILabelWithPopover
        variant="pill"
        size="sm"
        label="Chargeback probability"
        model="forge-ai/chargeback-pred-v4"
        ts="30 sec ago"
        confidence={0.84}
      >
        Chargeback likelihood for transaction TXN-44821 is 17% — above the 12% alert threshold.
      </AILabelWithPopover>

      <AILabelWithPopover
        variant="pill"
        size="md"
        label="Chargeback probability"
        model="forge-ai/chargeback-pred-v4"
        ts="30 sec ago"
        confidence={0.84}
      >
        Chargeback likelihood for transaction TXN-44821 is 17% — above the 12% alert threshold.
      </AILabelWithPopover>

      <AILabelWithPopover
        variant="pill"
        size="lg"
        label="Chargeback probability"
        model="forge-ai/chargeback-pred-v4"
        ts="30 sec ago"
        confidence={0.84}
      >
        Chargeback likelihood for transaction TXN-44821 is 17% — above the 12% alert threshold.
      </AILabelWithPopover>
    </div>
  ),
};

/** In context — AI badge inline with tabular data, the most common production placement. */
export const InTableContext: Story = {
  render: () => (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, color: 'var(--fg)' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--border)' }}>
          <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--fg-muted)', fontWeight: 500 }}>Merchant</th>
          <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--fg-muted)', fontWeight: 500 }}>Risk score</th>
          <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--fg-muted)', fontWeight: 500 }}>Classification</th>
        </tr>
      </thead>
      <tbody>
        <tr style={{ borderBottom: '1px solid var(--border)' }}>
          <td style={{ padding: '10px 12px' }}>Pix Recorrente Ltda</td>
          <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>74</td>
          <td style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            Medium
            <AILabelWithPopover
              variant="pill"
              size="sm"
              label="Risk classification"
              model="forge-ai/risk-classifier-v2"
              ts="4 min ago"
              confidence={0.88}
            >
              Classified as medium-risk based on 14-day transaction pattern and velocity deviation.
            </AILabelWithPopover>
          </td>
        </tr>
        <tr style={{ borderBottom: '1px solid var(--border)' }}>
          <td style={{ padding: '10px 12px' }}>FastBoleto S.A.</td>
          <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>91</td>
          <td style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            High
            <AILabelWithPopover
              variant="pill"
              size="sm"
              label="Risk classification"
              model="forge-ai/risk-classifier-v2"
              ts="4 min ago"
              confidence={0.96}
            >
              High-risk flag triggered by 3 chargebacks in 7 days and new device fingerprint.
            </AILabelWithPopover>
          </td>
        </tr>
        <tr>
          <td style={{ padding: '10px 12px' }}>Transfero Digital</td>
          <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>23</td>
          <td style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            Low
            <AILabelWithPopover
              variant="pill"
              size="sm"
              label="Risk classification"
              model="forge-ai/risk-classifier-v2"
              ts="4 min ago"
              confidence={0.91}
            >
              Consistent transaction behavior over 90-day window; no anomalies detected.
            </AILabelWithPopover>
          </td>
        </tr>
      </tbody>
    </table>
  ),
};
