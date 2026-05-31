import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { MathView } from '@eidos/ui';

// ── MathView ──────────────────────────────────────────────────────────────────
// Styled surface for rendered TeX expressions inside a model reply.
// The DS does not bundle KaTeX — the consumer renders to HTML string and passes
// it via `html`, or passes children (plain text or a Skeleton) as a fallback.
// Switches between inline <span role="math"> and block <div role="math">.

const meta = {
  title: 'AI/MathView',
  component: MathView,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A styled surface for mathematical expressions inside an AI reply. ' +
          'Accepts pre-rendered KaTeX HTML via the `html` prop (rendered with ' +
          '`dangerouslySetInnerHTML`) or plain-text / React children as a fallback. ' +
          'Use `display={false}` (default) for inline terms within prose, ' +
          'and `display={true}` for standalone centred equations that occupy their own line.',
      },
    },
    layout: 'padded',
  },
  args: {
    display: false,
    children: 'risk = 0.4·complexity + 0.3·blast_radius + 0.3·coverage_delta',
  },
  argTypes: {
    display: { control: 'boolean' },
    html: { control: 'text' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof MathView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Inline expression — embedded in a sentence of prose inside a model reply. */
export const Default: Story = {
  render: (args) => (
    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg)', lineHeight: 1.8 }}>
      The fraud risk score for each transaction is computed as{' '}
      <MathView {...args} />{' '}
      where each term is normalised to the interval [0, 1].
    </p>
  ),
};

/** Inline vs block — covers both `display` variants side by side. */
export const Variants: Story = {
  name: 'Variants — inline and block',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg)' }}>
      {/* Inline */}
      <div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', display: 'block', marginBottom: 8 }}>
          display=false (inline)
        </span>
        <p style={{ lineHeight: 1.8, margin: 0 }}>
          P99 latency is flagged when{' '}
          <MathView>{'p99 > SLO_threshold * 1.5'}</MathView>{' '}
          for two consecutive 5-minute windows.
        </p>
      </div>
      {/* Block */}
      <div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', display: 'block', marginBottom: 8 }}>
          display=true (block)
        </span>
        <p style={{ lineHeight: 1.8, margin: '0 0 8px' }}>
          The Engineering Throughput Index (ETI) aggregates five pillars:
        </p>
        <MathView display>
          {'ETI = (velocity + quality + reliability + ai_adoption + standards) / 5'}
        </MathView>
        <p style={{ lineHeight: 1.8, margin: '8px 0 0', color: 'var(--fg-muted)' }}>
          Each pillar is a normalised score in [0, 100].
        </p>
      </div>
    </div>
  ),
};

/** Multiple inline expressions — dense formula-rich prose from an AI analysis reply. */
export const InlineInProse: Story = {
  name: 'Inline in prose',
  render: () => (
    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg)', lineHeight: 1.8, maxWidth: 560 }}>
      <p style={{ margin: '0 0 12px' }}>
        The canary rollout uses a stepped traffic model. Let{' '}
        <MathView>{'r(t)'}</MathView> be the traffic fraction at time{' '}
        <MathView>{'t'}</MathView>. The step function is defined as:
      </p>
      <MathView display>
        {'r(t) = min(r_max, r_0 * e^(k * t))'}
      </MathView>
      <p style={{ margin: '12px 0 0' }}>
        We stop advancing when the p95 error rate{' '}
        <MathView>{'ε_p95'}</MathView> exceeds{' '}
        <MathView>{'ε_baseline * 1.1'}</MathView>{' '}
        for more than two consecutive measurement windows.
      </p>
    </div>
  ),
};

/** Pre-rendered HTML via `html` prop — simulates KaTeX renderToString output. */
export const WithHtmlProp: Story = {
  name: 'With html prop (simulated KaTeX)',
  render: () => (
    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg)', lineHeight: 1.8 }}>
      <p style={{ margin: '0 0 8px' }}>
        The deployment health score passed to the circuit breaker is:
      </p>
      {/* Simulated KaTeX output — in production this comes from renderToString(). */}
      <MathView
        display
        html={'<span style="font-family:var(--font-mono);letter-spacing:0.02em">H = (1 − error_rate) × (1 − latency_penalty) × availability</span>'}
      />
      <p style={{ margin: '8px 0 0', color: 'var(--fg-muted)' }}>
        A score below 0.85 triggers automatic ring-0 rollback.
      </p>
    </div>
  ),
};

/** Children fallback — renders plain-text math when html is not available yet (e.g. KaTeX loading). */
export const ChildrenFallback: Story = {
  name: 'Children fallback (no html)',
  render: () => (
    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg)', lineHeight: 1.8 }}>
      <p style={{ margin: '0 0 8px' }}>
        Blast radius estimate before KaTeX loads:
      </p>
      <MathView display>
        blast_radius = affected_services / total_downstream_count
      </MathView>
    </div>
  ),
};
