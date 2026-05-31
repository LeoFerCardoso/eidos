import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from '@forge/ui';

const meta = {
  title: 'Primitives/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Linear bar, circular ring, and segmented stepper. ' +
          'Determinate (value/max) or indeterminate (no value). ' +
          'All visuals live in ds.css under the .prog-* namespace so Alert, AI errors, ' +
          'and table footers all compose the same primitive.',
      },
    },
  },
  args: {
    value: 64,
    max: 100,
    size: 'sm',
    status: 'primary',
    label: 'Building identity-svc',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['linear', 'circular'] },
    status: { control: 'inline-radio', options: ['primary', 'success', 'warning', 'danger', 'neutral'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    indeterminate: { control: 'boolean' },
    striped: { control: 'boolean' },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default determinate bar driven by Storybook controls. */
export const Default: Story = {};

/** All four sizes side by side. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 460 }}>
      <Progress value={45} size="xs" label="xs · 2px" />
      <Progress value={62} size="sm" label="sm · 4px (default)" />
      <Progress value={78} size="md" label="md · 6px" />
      <Progress value={36} size="lg" label="lg · 10px" />
    </div>
  ),
};

/** Every status tone. */
export const StatusTones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 460 }}>
      <Progress value={72} status="primary" label="In progress" sub="default · ember" />
      <Progress value={100} status="success" label="Completed" sub="success · all checks passed" />
      <Progress value={92} status="warning" label="Approaching quota" sub="warning · 92% of 100 GB" />
      <Progress value={100} status="danger" label="Failed at step 4" sub="danger · transient retry" />
      <Progress value={42} status="neutral" label="Paused" sub="neutral · awaiting approval" />
    </div>
  ),
};

/** Indeterminate — animated slug for unknown durations. */
export const Indeterminate: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 460 }}>
      <Progress label="Querying remote registry" sub="response time unknown" />
      <Progress size="md" status="neutral" label="Connecting to provider" sub="no progress contract from upstream" />
    </div>
  ),
};

/** Buffer layer — received vs. confirmed (streaming uploads). */
export const Buffer: Story = {
  render: () => (
    <Progress
      value={54}
      buffered={78}
      label="Streaming to object store"
      sub="received 78 MB · confirmed 54 MB"
    />
  ),
  decorators: [(Story) => <div style={{ maxWidth: 460 }}><Story /></div>],
};

/** Striped fill — motion cue for long-running uploads. */
export const Striped: Story = {
  args: {
    value: 67,
    striped: true,
    size: 'md',
    label: 'Encrypting backup',
    sub: '14 GB of 21 GB',
  },
  decorators: [(Story) => <div style={{ maxWidth: 460 }}><Story /></div>],
};

/** Segmented stepper — discrete named phases. */
export const Segmented: Story = {
  render: () => (
    <Progress
      segments={['Build', 'Test', 'Canary', 'Ring 3', 'Ring 4']}
      activeSegment={2}
      label="Deploy ring 2 · canary running"
      sub="step 3 of 5"
    />
  ),
  decorators: [(Story) => <div style={{ maxWidth: 460 }}><Story /></div>],
};

/** Circular determinate — compact for tiles and dashboards. */
export const Circular: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
      <Progress variant="circular" value={64} aria-label="64% complete" />
      <Progress variant="circular" value={92} status="success" aria-label="92% — success" />
      <Progress variant="circular" value={38} status="warning" aria-label="38% — warning" />
      <Progress variant="circular" value={12} status="danger" aria-label="12% — danger" />
      <Progress variant="circular" aria-label="Loading" />
      <Progress variant="circular" value={48} circleSize={80} strokeWidth={6} aria-label="48% — large" />
    </div>
  ),
};

/** Live counter — simulates polling/websocket updates. */
export const LiveUpdates: Story = {
  render: () => {
    const [pct, setPct] = React.useState(0);
    React.useEffect(() => {
      let raf: number;
      let start = performance.now();
      const duration = 6000;
      const tick = (t: number) => {
        const elapsed = (t - start) % duration;
        const next = Math.round((elapsed / duration) * 100);
        setPct(next);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, []);
    return (
      <div style={{ maxWidth: 460 }}>
        <Progress value={pct} label="Building identity-svc" sub="compiling Go binaries" />
      </div>
    );
  },
};

/** File uploader — composed context row. */
export const InContext: Story = {
  render: () => (
    <div style={{ maxWidth: 540 }}>
      <div className="prog-row">
        <div className="ico" style={{ width: 36, height: 36, borderRadius: 6, background: 'var(--surface-hover)', color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div>
          <div className="name" style={{ fontSize: 13, fontWeight: 500 }}>contracts-2026.pdf</div>
          <div className="meta" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-subtle)', marginTop: 2 }}>2.4 MB · uploading…</div>
          <Progress value={67} size="xs" style={{ marginTop: 6 }} aria-label="67% uploaded" />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', fontFeatureSettings: "'tnum'" }}>67%</span>
      </div>
      <div className="prog-row" style={{ marginTop: 8 }}>
        <div className="ico" style={{ width: 36, height: 36, borderRadius: 6, background: 'var(--surface-hover)', color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div>
          <div className="name" style={{ fontSize: 13, fontWeight: 500 }}>audit-log-q3.csv</div>
          <div className="meta" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-subtle)', marginTop: 2 }}>1.1 MB · uploaded</div>
          <Progress value={100} size="xs" status="success" style={{ marginTop: 6 }} aria-label="Upload complete" />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--success)', fontFeatureSettings: "'tnum'" }}>100%</span>
      </div>
    </div>
  ),
};

/** RTL — bar fills from the trailing (right-to-left) edge. */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Progress value={64} label="جاري بناء identity-svc" sub="تجميع ثنائيات Go" />
      <Progress value={92} status="success" label="اكتمل النسخ الاحتياطي" sub="٢١ غيغابايت" />
      <Progress label="جارٍ الاتصال بمزود الخدمة" />
      <Progress
        segments={['بناء', 'اختبار', 'كناري', 'حلقة 3', 'حلقة 4']}
        activeSegment={2}
        label="حلقة النشر ٢"
        sub="الخطوة ٣ من ٥"
      />
    </div>
  ),
};
