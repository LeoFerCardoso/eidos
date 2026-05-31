'use client';
// Forge Mobile — List (scaffold). Grouped, inset list rows — the spine of settings,
// detail, and menu screens. Leading icon, label, optional value/toggle, chevron.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono, Skeleton, Spinner, Empty, Alert, AlertTitle, AlertDescription, AlertActions } from '@/ds/core';

type Row = { icon: string; tone?: string; label: string; value?: string; chevron?: boolean; toggle?: boolean; paging?: boolean };

const GROUPS: { title: string; rows: Row[] }[] = [
  {
    title: 'Service',
    rows: [
      { icon: 'server', label: 'identity-svc', value: 'Tier 1', chevron: true },
      { icon: 'pipeline', label: 'Deploys', value: '3 today', chevron: true },
      { icon: 'activity', label: 'Health', value: 'Degraded', chevron: true },
    ],
  },
  {
    title: 'Alerts',
    rows: [
      { icon: 'bell', label: 'Push notifications', toggle: true },
      { icon: 'flame', tone: 'var(--ember)', label: 'Incident paging', toggle: true, paging: true },
    ],
  },
];

function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );
}

function RowSwitch({ label, checked, onToggle }: { label: string; checked?: boolean; onToggle?: (v: boolean) => void }) {
  const [internal, setInternal] = React.useState(true);
  const controlled = checked !== undefined;
  const on = controlled ? checked : internal;
  const reduce = usePrefersReducedMotion();
  const toggle = () => {
    const next = !on;
    if (!controlled) setInternal(next);
    onToggle?.(next);
  };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={toggle}
      className="focus-ring"
      style={{ width: 40, height: 24, borderRadius: 999, border: 'none', padding: 2, background: on ? 'var(--ember)' : 'var(--surface-active)', display: 'inline-flex', justifyContent: on ? 'flex-end' : 'flex-start', transition: reduce ? 'none' : 'background var(--dur) var(--ease)', cursor: 'pointer', flex: '0 0 auto' }}
    >
      <span style={{ width: 20, height: 20, borderRadius: 999, background: 'var(--switch-thumb)', boxShadow: 'var(--shadow-1)', transition: reduce ? 'none' : 'transform var(--dur) var(--ease)' }} />
    </button>
  );
}

function RowItem({ r, last, paging, onPaging }: { r: Row; last: boolean; paging?: boolean; onPaging?: (v: boolean) => void }) {
  const Icon = (Icons as Record<string, any>)[r.icon] || Icons.circle;
  const isNav = !!r.chevron && !r.toggle;
  const activate = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); /* navigate */ }
  };
  return (
    <div
      role={isNav ? 'button' : undefined}
      tabIndex={isNav ? 0 : undefined}
      aria-label={isNav && r.value ? `${r.label}, ${r.value}` : undefined}
      onKeyDown={isNav ? activate : undefined}
      className={isNav ? 'focus-ring row-hover' : undefined}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderBottom: last ? 'none' : '1px solid var(--border)', cursor: isNav ? 'pointer' : 'default' }}
    >
      <span style={{ width: 28, height: 28, borderRadius: 7, background: r.tone ? 'var(--ember-soft)' : 'var(--surface-active)', color: r.tone || 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
        <Icon size={15} />
      </span>
      <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500 }}>{r.label}</span>
      {r.value && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums' }}>{r.value}</span>}
      {r.toggle && (r.paging
        ? <RowSwitch label={r.label} checked={paging} onToggle={onPaging} />
        : <RowSwitch label={r.label} />)}
      {r.chevron && <Icons.chevronRight size={15} color="var(--fg-faint)" aria-hidden="true" />}
    </div>
  );
}

function ListScreen() {
  // Innovation: the single ember row drives the list's own state. Toggling
  // "Incident paging" flips a live, mono on-call caption right under the card —
  // the row reacts to itself, so the doc demos the lifecycle a real list has.
  // Rest at "paused" so the screen keeps a single ember mark (the flame tile);
  // turning paging on is the deliberate, earned second ember the user creates.
  const [paging, setPaging] = React.useState(false);
  const reduce = usePrefersReducedMotion();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)', overflow: 'auto' }}>
      <div style={{ height: 50, flex: '0 0 auto' }} />
      <div style={{ padding: '4px 18px 12px', fontSize: 'var(--text-2xl)', fontWeight: 700, letterSpacing: '-0.02em' }}>Settings</div>
      {GROUPS.map((g) => {
        const isAlerts = g.title === 'Alerts';
        return (
          <div key={g.title} style={{ padding: '0 14px 18px' }}>
            <div className="t-mono-label" style={{ padding: '4px 4px 6px' }}>{g.title}</div>
            <div className="surface" style={{ padding: 0, overflow: 'hidden' }}>
              {g.rows.map((r, i) => (
                <RowItem key={r.label} r={r} last={i === g.rows.length - 1} paging={paging} onPaging={setPaging} />
              ))}
            </div>
            {isAlerts && (
              <div
                role="status"
                aria-live="polite"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 6px 0', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums', color: paging ? 'var(--ember)' : 'var(--fg-faint)', transition: reduce ? 'none' : 'color var(--dur) var(--ease)' }}
              >
                <span style={{ width: 6, height: 6, borderRadius: 999, flex: '0 0 auto', background: paging ? 'var(--ember)' : 'var(--fg-faint)' }} aria-hidden="true" />
                {paging ? 'PAGING ON-CALL · ACK WITHIN 5 MIN' : 'PAGING PAUSED · ALERTS LOG ONLY'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function MobileList() {
  return (
    <Section
      id="list"
      num="01"
      title="List"
      desc={<>Inset, grouped rows — the spine of settings, detail, and menu screens. Each row is a <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>44px</span> tap target: leading icon tile, label, then a value, switch, or chevron.</>}
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Reach for List whenever content is a flat set of labelled rows the user reads top-to-bottom and taps into. Group related rows under a quiet mono caption.</Lede>
      <Frame label="rows with value · switch · chevron — toggle Incident paging" center>
        <DeviceFrame><ListScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="loading · empty · error · disabled">States</SubHead>
      <Lede>A list is a feed with a lifecycle, not a fixed set of rows. Show skeleton rows while the group loads, an honest empty when there is nothing to show, an inline error when a row&rsquo;s state cannot be fetched, and a read-only row when the user lacks permission to change it.</Lede>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        {/* Loading — skeleton rows inside the inset card */}
        <Frame label="loading — group streams in">
          <div role="status" aria-busy="true" aria-label="Loading service rows" style={{ width: '100%' }}>
            <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>Loading service rows</span>
            <div className="surface" aria-hidden="true" style={{ padding: 0, overflow: 'hidden' }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderBottom: i === 2 ? 'none' : '1px solid var(--border)' }}>
                  <Skeleton variant="box" width={28} height={28} radius={7} />
                  <Skeleton variant="line" width="44%" height={11} />
                  {i === 0
                    ? <Spinner size="sm" color="var(--fg-subtle)" aria-label="Loading row" style={{ marginInlineStart: 'auto' }} />
                    : <Skeleton variant="line" width={36} height={11} style={{ marginInlineStart: 'auto' }} />}
                </div>
              ))}
            </div>
          </div>
        </Frame>
        {/* Empty — nothing in this group */}
        <Frame label="empty — no rows in this group" center>
          <Empty size="sm" iconName="inbox" title="No services yet" desc="Connect a repository and its services appear here as tappable rows." />
        </Frame>
        {/* Error — a row's state failed to load */}
        <Frame label="error — a row couldn't load">
          <Alert tone="danger">
            <AlertTitle>Couldn&rsquo;t load &ldquo;Health&rdquo;</AlertTitle>
            <AlertDescription>The status request to <Mono tone="subtle">identity-svc</Mono> timed out. The row shows its last value and stays tappable.</AlertDescription>
            <AlertActions><button type="button" className="btn ember xs" tabIndex={-1}>Retry</button><button type="button" className="btn ghost xs" tabIndex={-1}>Dismiss</button></AlertActions>
          </Alert>
        </Frame>
        {/* Disabled — read-only row the user can't change */}
        <Frame label="disabled — read-only row" center>
          <div className="surface" style={{ padding: 0, overflow: 'hidden', width: '100%', maxWidth: 300 }}>
            <div aria-disabled="true" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', opacity: 0.55, cursor: 'not-allowed' }}>
              <span style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--surface-active)', color: 'var(--fg-faint)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Icons.flame size={15} /></span>
              <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--fg-muted)' }}>Incident paging</span>
              <span style={{ width: 40, height: 24, borderRadius: 999, background: 'var(--surface-active)', flex: '0 0 auto' }} aria-hidden="true" />
            </div>
            <div style={{ padding: '0 14px 10px', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', lineHeight: 1.5 }}>Managed by your org policy — ask an admin to change it.</div>
          </div>
        </Frame>
      </div>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 300 }} aria-hidden="true">
              <div className="t-mono-label" style={{ marginBottom: 8, paddingInlineStart: 4 }}>Service</div>
              <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px' }}>
                  <span style={{ display: 'inline-flex', width: 28, height: 28, borderRadius: 8, background: 'var(--ember-soft)', color: 'var(--ember)', alignItems: 'center', justifyContent: 'center' }}><Icons.server size={15} /></span>
                  <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500 }}>payments-api</span>
                  <Icons.chevronRight size={16} style={{ color: 'var(--fg-faint)' }} />
                </div>
                <div style={{ height: 1, background: 'var(--border)', marginInlineStart: 54 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px' }}>
                  <span style={{ display: 'inline-flex', width: 28, height: 28, borderRadius: 8, background: 'var(--surface-active)', color: 'var(--fg-muted)', alignItems: 'center', justifyContent: 'center' }}><Icons.bell size={15} /></span>
                  <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500 }}>Alerts</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums' }}>3</span>
                </div>
              </div>
              <span className="lead h" style={{ top: -2, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 56, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 36, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 56, right: -28, width: 24 }} />
              <span className="lead h" style={{ top: 36, right: -28, width: 24 }} />
              <span className="lead v" style={{ bottom: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }} />
              <div className="pin" style={{ top: -11, left: -52 }}>1</div>
              <div className="pin" style={{ top: 47, left: -52 }}>2</div>
              <div className="pin" style={{ top: 27, left: -52 }}>3</div>
              <div className="pin" style={{ top: 47, right: -52 }}>4</div>
              <div className="pin" style={{ top: 27, right: -52 }}>5</div>
              <div className="pin" style={{ bottom: -42, left: '50%', transform: 'translateX(-50%)' }}>6</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Group caption.</b> Quiet mono label above each inset card (Service, Alerts).</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Inset card.</b> Rounded surface holding the rows; clips the dividers to its corners.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Leading icon tile.</b> <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>28px</span> rounded square; tone goes ember only for the one signal that matters.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Label.</b> <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>13px</span> / weight 500 row title — the primary tap text.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Trailing accessory.</b> A value, a switch, or a chevron — pick one per row, never all three.</span>
            <span className="num">6</span><span><b style={{ color: 'var(--fg)' }}>Divider.</b> Hairline between rows, suppressed on the last row of the card.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede>Every row in the demo above is reachable and operable by keyboard alone — tab to a chevron row or a switch and the canonical ember focus ring appears. Touch is never the only way in.</Lede>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 12}}>Keyboard</div>
          <dl style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 16px', margin: 0, alignItems: 'baseline'}}>
            <dt style={{fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap'}}>Tab</dt>
            <dd style={{margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Move focus to the next chevron row or switch; value-only rows are skipped because they are not interactive. The focus ring marks the active control.</dd>
            <dt style={{fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap'}}>Enter / Space</dt>
            <dd style={{margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>On a chevron row, navigate to its destination. On a switch row, toggle it — try the <b style={{color:'var(--fg)'}}>Incident paging</b> switch in the demo above; the on-call caption updates live.</dd>
            <dt style={{fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap'}}>Shift + Tab</dt>
            <dd style={{margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Move focus back to the previous interactive row — the order follows the visual top-to-bottom reading order of the groups.</dd>
          </dl>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Roles &amp; screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Chevron rows carry <Mono tone="subtle">role=&quot;button&quot;</Mono> + <Mono tone="subtle">tabIndex=0</Mono> and an <Mono tone="subtle">aria-label</Mono> of <Mono tone="subtle">&quot;label, value&quot;</Mono>, so they announce as &ldquo;identity-svc, Tier 1, button&rdquo;; the trailing chevron is <Mono tone="subtle">aria-hidden</Mono>. Switch rows are a real <Mono tone="subtle">role=&quot;switch&quot;</Mono> with <Mono tone="subtle">aria-checked</Mono>, the label passed as <Mono tone="subtle">aria-label</Mono>. The live caption is a <Mono tone="subtle">role=&quot;status&quot;</Mono> + <Mono tone="subtle">aria-live=&quot;polite&quot;</Mono> region, so toggling paging is announced.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Touch target</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Each row clears the <span style={{fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums'}}>44&times;44px</span> minimum via <span style={{fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums'}}>11px</span> block padding; the whole row is the hit area, and the switch keeps its own <span style={{fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums'}}>44px</span> target. There is no hidden gesture — tap navigates, the switch toggles, and nothing is reachable only by swipe.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The switch fill, thumb travel, and the on-call caption&rsquo;s colour shift all drop to none under <Mono tone="subtle">prefers-reduced-motion: reduce</Mono>. Label and value hold AA contrast on the surface; the one ember tile pairs an <Mono tone="subtle">ember-soft</Mono> fill with the solid ember glyph, whose tint stays light enough to keep the glyph legible.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — leading icon moves right, the chevron moves left and mirrors'} center code={`<Icons.chevronRight style={{ transform: 'scaleX(-1)' }} /> {/* points back toward the start edge */}`} lang="tsx">
        <div dir="rtl"><DeviceFrame><ListScreen /></DeviceFrame></div>
      </Frame>
      <Lede>Under <Mono tone="subtle">dir=&quot;rtl&quot;</Mono> each row&rsquo;s leading icon tile moves to the right and the label text right-aligns, while the trailing chevron moves to the left and mirrors with <Mono tone="subtle">scaleX(-1)</Mono> so it still points toward the destination. Section insets follow logical padding (<Mono tone="subtle">padding-inline-start</Mono>), so the divider offset and group caption flip with the rows.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — one accessory per row</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap:0, padding:0}}>
            <div style={{display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderBottom:'1px solid var(--border)'}}><Icons.server size={15} color="var(--fg-muted)"/><span style={{flex:1, fontSize:13}}>Tier</span><span style={{fontSize:13, color:'var(--fg-muted)'}}>Tier 1</span></div>
            <div style={{display:'flex', alignItems:'center', gap:10, padding:'10px 12px'}}><Icons.bell size={15} color="var(--fg-muted)"/><span style={{flex:1, fontSize:13}}>Health</span><Icons.chevronRight size={14} color="var(--fg-faint)"/></div>
          </div>
          <div className="note">A value or a chevron, never both. The single accessory tells the user what the row does.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — value + chevron + switch</div>
          <div className="body" style={{padding:0}}>
            <div style={{display:'flex', alignItems:'center', gap:8, padding:'10px 12px'}}><Icons.activity size={15} color="var(--fg-muted)"/><span style={{flex:1, fontSize:13}}>Health</span><span style={{fontSize:13, color:'var(--fg-muted)'}}>Degraded</span><span style={{width:30, height:18, borderRadius:999, background:'var(--surface-active)'}}/><Icons.chevronRight size={14} color="var(--fg-faint)"/></div>
          </div>
          <div className="note">Three accessories make the row ambiguous — does it open, toggle, or report? Split it into two rows.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="a list row"
        lang="tsx"
        code={`// navigation row — the whole row is the control
<div
  className="m-row focus-ring"
  role="button" tabIndex={0}
  aria-label={value ? \`\${label}, \${value}\` : label}
  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') open(); }}
>
  <span className="m-row-icon"><Icons.server /></span>
  <span className="m-row-label">{label}</span>
  {value && <span className="m-row-value">{value}</span>}
  <Icons.chevronRight aria-hidden="true" />
</div>

// switch row — trailing control replaces the chevron
<button
  type="button" className="focus-ring"
  role="switch" aria-checked={on} aria-label={label}
  onClick={() => setOn(v => !v)}
/>`}
      />
    </Section>
  );
}
