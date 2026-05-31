import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@forge/ui';

const meta = {
  title: 'Primitives/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Compound tab component. Compose `<Tabs>` → `<TabsList>` → `<TabsTrigger value="…">` + `<TabsContent value="…">`. ' +
          'Full ARIA (tablist/tab/tabpanel), roving tabindex, keyboard navigation (Arrow, Home, End), ' +
          'RTL-aware directional keys, and `prefers-reduced-motion` support.',
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default compound usage — line variant, automatic activation. */
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList aria-label="Service sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="deploys">Deploys</TabsTrigger>
        <TabsTrigger value="runbooks">Runbooks</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        High-signal summary of the service. Owner, region, last deploy, current SLO burn.
      </TabsContent>
      <TabsContent value="deploys">
        A timeline of every release that touched this service in the last 30 days.
      </TabsContent>
      <TabsContent value="runbooks">
        Linked runbooks — each a single-page playbook with role, severity, and exact commands.
      </TabsContent>
      <TabsContent value="settings">
        Service-level configuration: alert routes, on-call rotation, dependency map.
      </TabsContent>
    </Tabs>
  ),
};

/** Three visual variants side by side: line, pills, enclosed. */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Line (default) */}
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-faint)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>line</p>
        <Tabs defaultValue="a" variant="line">
          <TabsList>
            <TabsTrigger value="a">Overview</TabsTrigger>
            <TabsTrigger value="b">Deploys</TabsTrigger>
            <TabsTrigger value="c">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Line variant — page-level navigation.</TabsContent>
          <TabsContent value="b">Deploy timeline.</TabsContent>
          <TabsContent value="c">Settings panel.</TabsContent>
        </Tabs>
      </div>

      {/* Pills */}
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-faint)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>pills</p>
        <Tabs defaultValue="day" variant="pills">
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
          <TabsContent value="day">Data for the last 24 hours.</TabsContent>
          <TabsContent value="week">Data for the last 7 days, hourly aggregation.</TabsContent>
          <TabsContent value="month">Data for the last 30 days, daily aggregation.</TabsContent>
          <TabsContent value="year">Data for the last 12 months, weekly aggregation.</TabsContent>
        </Tabs>
      </div>

      {/* Enclosed */}
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-faint)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>enclosed</p>
        <Tabs defaultValue="preview" variant="enclosed">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">Live component preview area.</TabsContent>
          <TabsContent value="code">Source code snippet.</TabsContent>
          <TabsContent value="tokens">Design token values.</TabsContent>
        </Tabs>
      </div>
    </div>
  ),
};

/** Size variants — md (default) and sm. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-faint)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>md (default)</p>
        <Tabs defaultValue="a" size="md">
          <TabsList>
            <TabsTrigger value="a">Overview</TabsTrigger>
            <TabsTrigger value="b">Deploys</TabsTrigger>
            <TabsTrigger value="c">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Medium-size tab strip.</TabsContent>
          <TabsContent value="b">Deploys content.</TabsContent>
          <TabsContent value="c">Settings content.</TabsContent>
        </Tabs>
      </div>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-faint)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>sm</p>
        <Tabs defaultValue="a" size="sm">
          <TabsList>
            <TabsTrigger value="a">Overview</TabsTrigger>
            <TabsTrigger value="b">Deploys</TabsTrigger>
            <TabsTrigger value="c">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Small tab strip for dense layouts.</TabsContent>
          <TabsContent value="b">Deploys content.</TabsContent>
          <TabsContent value="c">Settings content.</TabsContent>
        </Tabs>
      </div>
    </div>
  ),
};

/** Vertical orientation — tablist on the left, panel on the right. */
export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="overview" orientation="vertical">
      <TabsList aria-label="Service sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="deploys">Deploys</TabsTrigger>
        <TabsTrigger value="runbooks">Runbooks</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">High-signal service summary.</TabsContent>
      <TabsContent value="deploys">Release timeline.</TabsContent>
      <TabsContent value="runbooks">Linked playbooks.</TabsContent>
      <TabsContent value="settings">Service configuration.</TabsContent>
    </Tabs>
  ),
};

/** Disabled triggers are skipped during keyboard navigation. */
export const WithDisabled: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="deploys" disabled>Deploys (disabled)</TabsTrigger>
        <TabsTrigger value="runbooks">Runbooks</TabsTrigger>
        <TabsTrigger value="settings" disabled>Settings (disabled)</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview panel — press ArrowRight to jump to Runbooks (Deploys is disabled).</TabsContent>
      <TabsContent value="deploys">You cannot activate this panel.</TabsContent>
      <TabsContent value="runbooks">Runbooks panel.</TabsContent>
      <TabsContent value="settings">You cannot activate this panel.</TabsContent>
    </Tabs>
  ),
};

/** Realistic IDP context — service detail tabs with count badges. */
export const InContext: Story = {
  render: () => {
    const [active, setActive] = React.useState('overview');
    const panels: Record<string, string> = {
      overview: 'Owner: Platform Team · Region: us-east-1 · Last deploy: 2 hours ago · SLO burn: 0.3%',
      deploys: 'v2.4.1 (GMUD-2841) — 2 hrs ago\nv2.4.0 (GMUD-2801) — 1 day ago\nv2.3.9 (GMUD-2770) — 3 days ago',
      runbooks: 'RB-001: On-call escalation\nRB-002: Database failover\nRB-003: Cache invalidation',
      settings: 'Alert route: PagerDuty #platform\nOn-call: Weekly rotation\nDependencies: postgres, redis, s3',
    };
    return (
      <Tabs value={active} onValueChange={setActive}>
        <TabsList aria-label="Service sections">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deploys">
            Deploys <span className="count">12</span>
          </TabsTrigger>
          <TabsTrigger value="runbooks">
            Runbooks <span className="count">3</span>
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        {Object.entries(panels).map(([v, text]) => (
          <TabsContent key={v} value={v} style={{ whiteSpace: 'pre-line' }}>
            {text}
          </TabsContent>
        ))}
      </Tabs>
    );
  },
};

/** RTL — first tab lands on the right; arrow keys mirror. */
export const RTL: Story = {
  render: () => (
    <div dir="rtl">
      <Tabs defaultValue="overview">
        <TabsList aria-label="أقسام الخدمة">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="deploys">
            عمليات النشر <span className="count">١٢</span>
          </TabsTrigger>
          <TabsTrigger value="runbooks">
            كتب التشغيل <span className="count">٤</span>
          </TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">ملخّص عالي الإشارة للخدمة. المالك، المنطقة، آخر نشر.</TabsContent>
        <TabsContent value="deploys">الجدول الزمني لكل إصدار في آخر ٣٠ يومًا.</TabsContent>
        <TabsContent value="runbooks">كتب التشغيل المرتبطة.</TabsContent>
        <TabsContent value="settings">إعدادات على مستوى الخدمة.</TabsContent>
      </Tabs>
    </div>
  ),
};
