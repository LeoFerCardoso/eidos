'use client';
// Eidos DS — Components / Alerts
// Inline callouts for scoped, in-context state — five semantic tones,
// compound slots (meta / extra / actions), and an optional dismiss button.
// This page imports the real Alert family from @/ds/core (→ @eidos/ui).
import * as React from 'react';
import {
  Icons, Frame, Section, SubHead, Lede, Mono, TabbedCode, installTabs,
  Alert, AlertTitle, AlertDescription,
  AlertMeta, AlertExtra, AlertActions,
  AutoPropsTable,
} from '@/ds/core';

// ─────────────────────────────────────────────────────────────────────────────
const USAGE_CODE = `import {
  Alert, AlertTitle, AlertDescription,
} from "@eidos/ui"

export function Demo() {
  return (
    <Alert tone="info">
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>A new Tailwind preset is available.</AlertDescription>
    </Alert>
  )
}`;

const DISMISSIBLE_CODE = `import * as React from "react"
import { Alert, AlertTitle, AlertDescription } from "@eidos/ui"

export function Demo() {
  const [open, setOpen] = React.useState(true)
  return open ? (
    <Alert tone="info" onDismiss={() => setOpen(false)}>
      <AlertTitle>New: components catalog</AlertTitle>
      <AlertDescription>The full list is now its own page. Open from the sidebar.</AlertDescription>
    </Alert>
  ) : null
}`;

const ACTIONS_CODE = `<Alert tone="warning">
  <AlertTitle>Unsaved changes</AlertTitle>
  <AlertDescription>You have edits that haven't been published.</AlertDescription>
  <AlertActions>
    <Button size="xs" tone="ember">Publish</Button>
    <Button size="xs" tone="ghost">Discard</Button>
  </AlertActions>
</Alert>`;

const META_CODE = `<Alert tone="danger">
  <AlertTitle>Auth provider unavailable</AlertTitle>
  <AlertDescription>Elevated error rates upstream.</AlertDescription>
  <AlertMeta>
    <Pill tone="danger" dot>offline · 4m</Pill>
    <span className="req-id">req-id: 0a9e21</span>
  </AlertMeta>
</Alert>`;

const EXTRA_CODE = `<Alert tone="warning">
  <AlertTitle>Disk usage critical</AlertTitle>
  <AlertDescription>Compaction will pause if free space drops below 5%.</AlertDescription>
  <AlertExtra>
    <Progress value={92} tone="warning" label="used" sub="92 / 100 GB"/>
  </AlertExtra>
  <AlertActions>
    <Button size="xs" tone="ember">Run cleanup</Button>
    <Button size="xs" tone="outline">Open volume</Button>
  </AlertActions>
</Alert>`;

const RTL_CODE = `<div dir="rtl">
  <Alert tone="info" onDismiss={() => setOpen(false)}>
    <AlertTitle>إعداد جديد متاح</AlertTitle>
    <AlertDescription>حدّث الحزمة للحصول على أحدث المكونات.</AlertDescription>
  </Alert>
</div>`;

// ── Page ────────────────────────────────────────────────────────────────────
export default function Alerts() {
  const [dismissed, setDismissed] = React.useState(false);

  return (
    <Section
      id="alerts"
      num="09"
      title="Alerts"
      desc="Inline callouts for scoped, in-context state — five semantic tones (neutral, info, success, warning, danger) with optional meta, diagnostic, and action slots."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('alert')} ariaLabel="package manager" />
      <Lede>
        Ships <Mono>Alert</Mono>, <Mono>AlertTitle</Mono>, <Mono>AlertDescription</Mono>,{' '}
        <Mono>AlertMeta</Mono>, <Mono>AlertExtra</Mono>, and <Mono>AlertActions</Mono>.
        Danger and warning alerts use <Mono>role="alert"</Mono> (assertive live region);
        info, success, and neutral use <Mono>role="status"</Mono> (polite).
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Lede>
        Use sparingly — a banner that is always present trains the user to ignore it.
        Alerts live inline, adjacent to the content they describe. They do not take over the page.
      </Lede>
      <Frame label="basic" code={USAGE_CODE}>
        <div style={{ width: '100%' }}>
          <Alert tone="info">
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>A new Tailwind preset is available.</AlertDescription>
          </Alert>
        </div>
      </Frame>

      {/* 3. VARIANTS */}
      <SubHead meta="5 semantic tones">Semantic tones</SubHead>
      <Frame
        label="neutral · info · success · warning · danger"
        code={`<Alert tone="neutral"><AlertTitle>…</AlertTitle></Alert>
<Alert tone="info"><AlertTitle>…</AlertTitle></Alert>
<Alert tone="success"><AlertTitle>…</AlertTitle></Alert>
<Alert tone="warning"><AlertTitle>…</AlertTitle></Alert>
<Alert tone="danger"><AlertTitle>…</AlertTitle></Alert>`}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Alert tone="neutral">
            <AlertTitle>A new component catalog page is live</AlertTitle>
            <AlertDescription>Open it from the Get Started group in the sidebar.</AlertDescription>
          </Alert>
          <Alert tone="info">
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>
              A new Tailwind preset is available. Update{' '}
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>@eidos/design-system</code>{' '}
              to v1.1.
            </AlertDescription>
          </Alert>
          <Alert tone="success">
            <AlertTitle>Deployment succeeded</AlertTitle>
            <AlertDescription>eidos-api v2.14.0 rolled out to all regions in 4m 12s.</AlertDescription>
          </Alert>
          <Alert tone="warning">
            <AlertTitle>Approaching quota</AlertTitle>
            <AlertDescription>You have used 84% of this month's deploy budget.</AlertDescription>
          </Alert>
          <Alert tone="danger">
            <AlertTitle>Rollback required</AlertTitle>
            <AlertDescription>
              Health checks are failing on 3/8 instances. The deploy will revert in 90 seconds unless paused.
            </AlertDescription>
          </Alert>
        </div>
      </Frame>
      <p className="ds-caption">
        Reach for neutral when there is nothing to celebrate, warn against, or block on — it reads as a quiet
        ambient note. Add a semantic tone only when the message changes what the user should do.
      </p>

      {/* DISMISSIBLE */}
      <SubHead meta="dismissible">With dismiss</SubHead>
      <Frame label="add an onDismiss callback" code={DISMISSIBLE_CODE}>
        <div style={{ width: '100%' }}>
          {!dismissed ? (
            <Alert tone="info" onDismiss={() => setDismissed(true)}>
              <AlertTitle>New: components catalog</AlertTitle>
              <AlertDescription>
                The full list is now its own page — open from the Get Started group in the sidebar.
              </AlertDescription>
            </Alert>
          ) : (
            <button
              className="btn xs ghost"
              onClick={() => setDismissed(false)}
            >
              Restore alert
            </button>
          )}
        </div>
      </Frame>
      <p className="ds-caption">
        Pass <Mono>onDismiss</Mono> to render a dismiss button at the trailing edge. The button carries an
        accessible <Mono>dismissLabel</Mono> (defaults to <Mono>"Dismiss"</Mono>). Never place a dismiss
        button on a danger alert that requires a decision.
      </p>

      {/* WITH ACTIONS */}
      <SubHead meta="with actions">Inline actions</SubHead>
      <Frame label="AlertActions renders a row at the foot of the body" code={ACTIONS_CODE}>
        <div style={{ width: '100%' }}>
          <Alert tone="warning">
            <AlertTitle>Unsaved changes</AlertTitle>
            <AlertDescription>
              You have edits that have not been published. Publish, or discard to start fresh.
            </AlertDescription>
            <AlertActions>
              <button className="btn xs ember">Publish</button>
              <button className="btn xs ghost">Discard</button>
            </AlertActions>
          </Alert>
        </div>
      </Frame>
      <p className="ds-caption">
        Use <Mono>AlertActions</Mono> — never an inline <Mono>div</Mono> — so the row inherits the canonical
        12 px top margin and 8 px gap. Primary action sits first; tertiary link-style actions go last.
      </p>

      {/* WITH META */}
      <SubHead meta="with meta">Status meta</SubHead>
      <Frame label="AlertMeta sits beneath the description — pill + monospace context" code={META_CODE}>
        <div style={{ width: '100%' }}>
          <Alert tone="danger">
            <AlertTitle>Auth provider unavailable</AlertTitle>
            <AlertDescription>Elevated error rates upstream. Sign-in flows are degraded.</AlertDescription>
            <AlertMeta>
              <span className="pill danger"><span className="dot" />offline · 4m</span>
              <span className="req-id">req-id: 0a9e21</span>
            </AlertMeta>
          </Alert>
        </div>
      </Frame>
      <p className="ds-caption">
        Meta is the place for non-decorative status: a runtime pill, a request id, a quota counter.
        Wrap monospace values in <Mono>&lt;span className="mono"/&gt;</Mono> for the canonical 11 px mono treatment.
      </p>

      {/* WITH EXTRA */}
      <SubHead meta="with diagnostic">Diagnostic body</SubHead>
      <Frame
        label="AlertExtra opens a slot — drop a Progress bar, a breakdown, a chart, a code block"
        code={EXTRA_CODE}
      >
        <div style={{ width: '100%' }}>
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
        </div>
      </Frame>
      <p className="ds-caption">
        <Mono>AlertExtra</Mono> is a generic slot — drop in a Progress bar, a breakdown, a tiny chart, or a
        code block. The dashed divider keeps it visually distinct from the title/description.
        Pass the same <Mono>tone</Mono> to the Progress component and the bar inherits the alert tone.
      </p>

      {/* IN CONTEXT */}
      <SubHead meta="in context">In context</SubHead>
      <Frame label="danger alert inside a settings card">
        <div className="surface" style={{ padding: 24, borderRadius: 10, width: '100%', maxWidth: 540 }}>
          <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', marginBottom: 16 }}>
            Deployment settings
          </div>
          <Alert tone="danger" style={{ marginBottom: 16 }}>
            <AlertTitle>Rollback required</AlertTitle>
            <AlertDescription>
              Health checks are failing on 3/8 instances. The deploy will revert in 90 seconds unless paused.
            </AlertDescription>
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
      </Frame>

      {/* ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            An alert is not a focus stop — it is read in place. Any controls inside it (the dismiss button,{' '}
            <Mono>AlertActions</Mono> buttons) are reachable in DOM order with Tab and fire on Enter/Space.
            The dismiss button removes the banner; focus moves to the next element in DOM order.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Danger and warning variants render with <Mono>role="alert"</Mono> and{' '}
            <Mono>aria-live="assertive"</Mono> so they interrupt the current utterance.
            Info, success, and neutral use <Mono>role="status"</Mono> (polite). The semantic icon is{' '}
            <Mono>aria-hidden</Mono>; tone is conveyed by text, never color alone.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Each tinted surface keeps title and description above AA contrast. Meaning is doubled by icon
            plus text — never color alone — so all four tones read correctly for color-blind users.
            The dismiss and action buttons show the ember focus ring (<Mono>--ring</Mono>).
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Alert renders statically with no entrance animation. The dismiss button's hover background
            uses a <Mono>transition</Mono> scoped to <Mono>.alert-dismiss</Mono>; the browser's{' '}
            <Mono>prefers-reduced-motion</Mono> media query is respected via a component-scoped{' '}
            <Mono>@media (prefers-reduced-motion: reduce)</Mono> rule that sets{' '}
            <Mono>transition: none</Mono> on <Mono>.alert-dismiss</Mono>.
          </div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — icon moves to the start (right), dismiss to the end (left)'
        code={RTL_CODE}
      >
        <div dir="rtl" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Alert tone="info" onDismiss={() => {}}>
            <AlertTitle>إعداد Tailwind جديد متاح</AlertTitle>
            <AlertDescription>
              حدّث{' '}
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>@eidos/design-system</code>{' '}
              إلى الإصدار 1.1 للحصول على جميع المكونات الجديدة.
            </AlertDescription>
          </Alert>
          <Alert tone="warning">
            <AlertTitle>تغييرات غير محفوظة</AlertTitle>
            <AlertDescription>لديك تعديلات لم تُنشر بعد. يمكنك النشر، أو التجاهل للبدء من جديد.</AlertDescription>
            <AlertActions>
              <button className="btn xs ember">نشر</button>
              <button className="btn xs ghost">تجاهل</button>
            </AlertActions>
          </Alert>
        </div>
      </Frame>
      <p className="ds-caption">
        The alert uses <Mono>gap</Mono> and logical margin properties (<Mono>margin-inline-*</Mono>) so the
        icon, body, and dismiss button reorder automatically under <Mono>dir="rtl"</Mono> — no mirroring
        overrides are needed.
      </p>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy — every slot composed</span></div>
        <div className="ds-frame-body" style={{ padding: '60px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 540 }} aria-hidden="true">
              <Alert tone="warning">
                <AlertTitle>Retry in 38s</AlertTitle>
                <AlertDescription>You have hit the per-minute prompt limit.</AlertDescription>
                <AlertMeta>
                  <span className="pill warning"><span className="dot" />rate-limited</span>
                  <span className="mono">limit: 40 req/min</span>
                </AlertMeta>
                <AlertExtra>
                  <div className="prog warning">
                    <div className="prog-head">
                      <span className="label">minute window</span>
                      <span className="pct">38s</span>
                    </div>
                    <div className="prog-track"><div className="prog-fill" style={{ width: '100%' }} /></div>
                  </div>
                </AlertExtra>
                <AlertActions>
                  <button className="btn xs outline" tabIndex={-1} disabled>Retry now</button>
                  <button className="btn xs ghost" tabIndex={-1}>Trim prompt</button>
                </AlertActions>
              </Alert>
              {/* Pin connectors */}
              <span className="lead h" style={{ top: 16, left: -32, width: 28 }} />
              <span className="lead h" style={{ top: 44, left: -32, width: 28 }} />
              <span className="lead h" style={{ top: 84, left: -32, width: 28 }} />
              <span className="lead h" style={{ top: 120, left: -32, width: 28 }} />
              <span className="lead h" style={{ top: 175, left: -32, width: 28 }} />
              <span className="lead h" style={{ bottom: 22, left: -32, width: 28 }} />
              <span className="lead h" style={{ top: 16, right: -32, width: 28 }} />
              <div className="pin" style={{ top: 10, left: -54 }}>1</div>
              <div className="pin" style={{ top: 38, left: -54 }}>2</div>
              <div className="pin" style={{ top: 78, left: -54 }}>3</div>
              <div className="pin" style={{ top: 114, left: -54 }}>4</div>
              <div className="pin" style={{ top: 169, left: -54 }}>5</div>
              <div className="pin" style={{ bottom: 16, left: -54 }}>6</div>
              <div className="pin" style={{ top: 10, right: -54 }}>7</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 620, margin: '56px auto 0' }}>
            <span className="num">1</span>
            <span><b style={{ color: 'var(--fg)' }}>Semantic icon.</b> 16 px, color matches the tone. The icon makes the alert scannable before the title is read.</span>
            <span className="num">2</span>
            <span><b style={{ color: 'var(--fg)' }}>Title.</b> 13 px Geist 600 (<Mono>var(--text-sm)</Mono>). One line. Imperative or status — never a question.</span>
            <span className="num">3</span>
            <span><b style={{ color: 'var(--fg)' }}>Description.</b> 13 px muted (<Mono>var(--text-sm)</Mono>). One sentence. What happened, what fixes it.</span>
            <span className="num">4</span>
            <span><b style={{ color: 'var(--fg)' }}>Meta row.</b> Optional. Status pill, request id, quota counter — anything monospace and short.</span>
            <span className="num">5</span>
            <span><b style={{ color: 'var(--fg)' }}>Diagnostic body.</b> Optional. Meter, breakdown, tiny chart, code block. Separated by a dashed divider.</span>
            <span className="num">6</span>
            <span><b style={{ color: 'var(--fg)' }}>Actions.</b> Optional. Primary action first, secondary next, a tertiary link-style action last.</span>
            <span className="num">7</span>
            <span><b style={{ color: 'var(--fg)' }}>Dismiss.</b> Optional. Only for informational alerts. Never on a danger alert that requires a decision.</span>
          </div>
        </div>
      </div>

      {/* DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — one alert at a time</div>
          <div className="body" style={{ padding: 14 }}>
            <Alert tone="info" style={{ width: '100%' }}>
              <AlertTitle>New release available</AlertTitle>
            </Alert>
          </div>
          <div className="note">
            Stack alerts only when each requires its own user decision. Otherwise pick the highest-priority one.
          </div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — alert spam</div>
          <div className="body" style={{ padding: 14, flexDirection: 'column', gap: 8 }}>
            <div className="alert info" style={{ width: '100%', padding: '8px 12px' }}>
              <div className="alert-body"><div className="alert-title" style={{ fontSize: 'var(--text-sm)' }}>New release</div></div>
            </div>
            <div className="alert warning" style={{ width: '100%', padding: '8px 12px' }}>
              <div className="alert-body"><div className="alert-title" style={{ fontSize: 'var(--text-sm)' }}>Quota at 84%</div></div>
            </div>
            <div className="alert success" style={{ width: '100%', padding: '8px 12px' }}>
              <div className="alert-body"><div className="alert-title" style={{ fontSize: 'var(--text-sm)' }}>Deploy ok</div></div>
            </div>
          </div>
          <div className="note">
            Three banners on one page train the user to dismiss everything without reading.
          </div>
        </div>
      </div>

      {/* API REFERENCE */}
      <SubHead meta="AlertProps">API reference</SubHead>
      <AutoPropsTable component="Alert" label="Alert" />
      <AutoPropsTable component="AlertTitle" label="AlertTitle" />
      <AutoPropsTable component="AlertDescription" label="AlertDescription" />
      <AutoPropsTable component="AlertMeta" label="AlertMeta" />
      <AutoPropsTable component="AlertExtra" label="AlertExtra" />
      <AutoPropsTable component="AlertActions" label="AlertActions" />
    </Section>
  );
}
