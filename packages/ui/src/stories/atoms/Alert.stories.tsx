import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertMeta,
  AlertExtra,
  AlertActions,
} from '@forge/ui';

const TONES = ['neutral', 'info', 'success', 'warning', 'danger'] as const;

const meta = {
  title: 'Primitives/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Inline feedback box (NOT a toast). Compound: Alert > AlertTitle + AlertDescription + ' +
          'optional AlertMeta / AlertExtra / AlertActions. ' +
          'Danger/warning use `role="alert"` (assertive); the rest use `role="status"` (polite).',
      },
    },
  },
  args: {
    tone: 'info',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: TONES },
    onDismiss: { action: 'dismissed' },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default (info) alert with title and description. */
export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>A new Tailwind preset is available. Update @forge/design-system to v1.1.</AlertDescription>
    </Alert>
  ),
};

/** All five tones in a stack. */
export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Alert tone="neutral">
        <AlertTitle>A new component catalog page is live</AlertTitle>
        <AlertDescription>Open it from the Get Started group in the sidebar — no new behaviour, just easier to find.</AlertDescription>
      </Alert>
      <Alert tone="info">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>A new Tailwind preset is available. Update @forge/design-system to v1.1.</AlertDescription>
      </Alert>
      <Alert tone="success">
        <AlertTitle>Deployment succeeded</AlertTitle>
        <AlertDescription>forge-api v2.14.0 rolled out to all regions in 4m 12s.</AlertDescription>
      </Alert>
      <Alert tone="warning">
        <AlertTitle>Approaching quota</AlertTitle>
        <AlertDescription>You have used 84% of this month's deploy budget.</AlertDescription>
      </Alert>
      <Alert tone="danger">
        <AlertTitle>Rollback required</AlertTitle>
        <AlertDescription>Health checks are failing on 3/8 instances. The deploy will revert in 90 seconds unless paused.</AlertDescription>
      </Alert>
    </div>
  ),
};

/** Dismissible — renders a close button at the trailing edge. */
export const Dismissible: Story = {
  render: () => {
    const [visible, setVisible] = React.useState(true);
    return visible ? (
      <Alert tone="info" onDismiss={() => setVisible(false)}>
        <AlertTitle>New: components catalog</AlertTitle>
        <AlertDescription>The full list is now its own page. Open from the sidebar.</AlertDescription>
      </Alert>
    ) : (
      <button
        style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', cursor: 'pointer' }}
        onClick={() => setVisible(true)}
      >
        Restore alert
      </button>
    );
  },
};

/** With inline action buttons. */
export const WithActions: Story = {
  render: () => (
    <Alert tone="warning">
      <AlertTitle>Unsaved changes</AlertTitle>
      <AlertDescription>You have edits that have not been published.</AlertDescription>
      <AlertActions>
        <button className="btn xs ember">Publish</button>
        <button className="btn xs ghost">Discard</button>
      </AlertActions>
    </Alert>
  ),
};

/** With a status meta row (pill + request id). */
export const WithMeta: Story = {
  render: () => (
    <Alert tone="danger">
      <AlertTitle>Auth provider unavailable</AlertTitle>
      <AlertDescription>Elevated error rates upstream. Sign-in flows are degraded.</AlertDescription>
      <AlertMeta>
        <span className="pill danger"><span className="dot" />offline · 4m</span>
        <span className="req-id">req-id: 0a9e21</span>
      </AlertMeta>
    </Alert>
  ),
};

/** With a diagnostic extra slot (progress bar + breakdown). */
export const WithExtra: Story = {
  render: () => (
    <Alert tone="warning">
      <AlertTitle>Disk usage critical</AlertTitle>
      <AlertDescription>Compaction will pause if free space drops below 5%.</AlertDescription>
      <AlertExtra>
        <div className="prog warning">
          <div className="prog-head">
            <span className="label">used</span>
            <span className="pct">92 / 100 GB</span>
          </div>
          <div className="prog-track"><div className="prog-fill" style={{ width: '92%' }} /></div>
        </div>
        <div className="breakdown">
          <span>index: 58 GB</span>
          <span>logs: 22 GB</span>
          <span>snapshots: 12 GB</span>
        </div>
      </AlertExtra>
      <AlertActions>
        <button className="btn xs ember">Run cleanup</button>
        <button className="btn xs outline">Open volume</button>
      </AlertActions>
    </Alert>
  ),
};

/** Full composition — every slot at once. */
export const FullComposition: Story = {
  render: () => {
    const [seconds, setSeconds] = React.useState(38);
    React.useEffect(() => {
      if (seconds <= 0) return;
      const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
      return () => clearTimeout(t);
    }, [seconds]);
    return (
      <Alert tone="warning">
        <AlertTitle>Retry in {seconds}s</AlertTitle>
        <AlertDescription>You have hit the per-minute prompt limit. The window resets every 60s.</AlertDescription>
        <AlertMeta>
          <span className="pill warning"><span className="dot" />rate-limited</span>
          <span className="mono">limit: 40 req/min · used 41</span>
        </AlertMeta>
        <AlertExtra>
          <div className="prog warning">
            <div className="prog-head">
              <span className="label">minute window</span>
              <span className="pct">{seconds}s remaining</span>
            </div>
            <div className="prog-track">
              <div className="prog-fill" style={{ width: `${Math.round((seconds / 60) * 100)}%` }} />
            </div>
          </div>
        </AlertExtra>
        <AlertActions>
          <button className="btn xs outline" disabled>Retry now</button>
          <button className="btn xs ghost">Trim prompt (-1.4k tokens)</button>
        </AlertActions>
      </Alert>
    );
  },
};

/** RTL — icon moves to the start (right), dismiss to the end (left). */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Alert tone="info" onDismiss={() => {}}>
        <AlertTitle>إعداد Tailwind جديد متاح</AlertTitle>
        <AlertDescription>حدّث @forge/design-system إلى الإصدار 1.1 للحصول على جميع المكونات الجديدة.</AlertDescription>
      </Alert>
      <Alert tone="warning">
        <AlertTitle>تغييرات غير محفوظة</AlertTitle>
        <AlertDescription>لديك تعديلات لم تُنشر بعد.</AlertDescription>
        <AlertActions>
          <button className="btn xs ember">نشر</button>
          <button className="btn xs ghost">تجاهل</button>
        </AlertActions>
      </Alert>
    </div>
  ),
};

/** In context — alert used inside a settings card layout. */
export const InContext: Story = {
  render: () => (
    <div className="surface" style={{ padding: 24, borderRadius: 10, maxWidth: 540 }}>
      <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', marginBottom: 16 }}>
        Deployment settings
      </div>
      <Alert tone="danger" style={{ marginBottom: 16 }}>
        <AlertTitle>Rollback required</AlertTitle>
        <AlertDescription>Health checks are failing on 3/8 instances. The deploy will revert in 90 seconds unless paused.</AlertDescription>
        <AlertActions>
          <button className="btn xs outline">Pause rollback</button>
          <button className="btn xs ghost">View logs</button>
        </AlertActions>
      </Alert>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="surface" style={{ padding: '8px 12px', borderRadius: 6, fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
          Region: us-east-1
        </div>
        <div className="surface" style={{ padding: '8px 12px', borderRadius: 6, fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
          Instance type: m5.large
        </div>
      </div>
    </div>
  ),
};
