'use client';
// Forge Mobile — Segmented control. The mobile sibling of Tabs: 2–4 mutually
// exclusive options in a pill track, the active one lifted onto a surface. The
// track composes the shipped `.m-segmented` class (focus ring, active lift, and
// reduced-motion live in ds.css) — the page only supplies the roving-tabindex
// keyboard model and the panel the control switches in place.
import * as React from 'react';
import {
  Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono, Kbd,
  Alert, AlertTitle, AlertDescription,
} from '@/ds/core';

type Option = string | { label: string; disabled?: boolean };

function Segmented({
  options,
  label = 'View',
  value,
  onChange,
  controls,
}: {
  options: Option[];
  label?: string;
  value?: number;
  onChange?: (i: number) => void;
  controls?: string;
}) {
  const items = options.map((o) => (typeof o === 'string' ? { label: o, disabled: false } : { disabled: false, ...o }));
  const firstEnabled = items.findIndex((o) => !o.disabled);
  const [internal, setInternal] = React.useState(firstEnabled === -1 ? 0 : firstEnabled);
  const active = value ?? internal;
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  // Roving selection: Arrow keys move the choice within the group (RTL-aware),
  // Home/End jump to the ends. Selection follows focus and steps over disabled
  // segments, matching the radiogroup pattern.
  function step(from: number, dir: number) {
    const n = items.length;
    let i = from;
    for (let k = 0; k < n; k++) {
      i = (i + dir + n) % n;
      if (!items[i].disabled) return i;
    }
    return from;
  }
  function select(i: number) {
    if (items[i].disabled) return;
    if (value === undefined) setInternal(i);
    onChange?.(i);
    refs.current[i]?.focus();
  }
  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    switch (e.key) {
      case 'ArrowRight': e.preventDefault(); select(step(i, rtl ? -1 : 1)); break;
      case 'ArrowLeft': e.preventDefault(); select(step(i, rtl ? 1 : -1)); break;
      case 'ArrowDown': e.preventDefault(); select(step(i, 1)); break;
      case 'ArrowUp': e.preventDefault(); select(step(i, -1)); break;
      case 'Home': e.preventDefault(); select(step(-1, 1)); break;
      case 'End': e.preventDefault(); select(step(items.length, -1)); break;
    }
  }

  return (
    <div className="m-segmented" role="radiogroup" aria-label={label}>
      {items.map((o, i) => (
        <button
          key={o.label}
          ref={(el) => { refs.current[i] = el; }}
          role="radio"
          className={i === active ? 'is-active' : ''}
          aria-checked={i === active}
          aria-controls={controls}
          aria-disabled={o.disabled || undefined}
          disabled={o.disabled}
          tabIndex={i === active ? 0 : -1}
          onClick={() => select(i)}
          onKeyDown={(e) => onKeyDown(e, i)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── The control's whole job is to switch a panel in place. The live demo
// performs exactly that: choosing a status swaps the panel below through its
// real states — a loading skeleton while the tab's data arrives, then content,
// an empty state, or a failed (role="alert") state. Reduced-motion users get
// the swap instantly; everyone else gets the thumb crossfade from ds.css.
const TNUM: React.CSSProperties = { fontVariantNumeric: 'tabular-nums' };

type Tab = {
  label: string;
  count: number;
  // 'list' | 'empty' | 'error' — the state this tab settles into after loading.
  state: 'list' | 'empty' | 'error';
  rows: { id: string; meta: string }[];
};

const TABS: Tab[] = [
  { label: 'Active', count: 3, state: 'list', rows: [
    { id: 'api-gateway', meta: 'building · 1m 12s' },
    { id: 'web-app', meta: 'building · 0m 48s' },
    { id: 'workers', meta: 'queued → building' },
  ] },
  { label: 'Queued', count: 2, state: 'list', rows: [
    { id: 'billing-svc', meta: 'waiting on api-gateway' },
    { id: 'search-idx', meta: 'waiting on web-app' },
  ] },
  { label: 'Done', count: 0, state: 'empty', rows: [] },
  { label: 'Failed', count: 1, state: 'error', rows: [
    { id: 'payments-svc', meta: 'exit 1 · 2m ago' },
  ] },
];

function SkeletonRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) 0' }}>
      <span className="m-skel" style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
        <span className="m-skel" style={{ width: '52%', height: 11 }} />
        <span className="m-skel" style={{ width: '34%', height: 9 }} />
      </div>
    </div>
  );
}

function SegScreen() {
  const [sel, setSel] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const tab = TABS[sel];

  // Switching the segment kicks a short "fetch" so the panel shows its loading
  // skeleton before settling — the real interaction the docs promise. The
  // effect owns the timer so rapid switches cancel the stale one.
  function pick(i: number) {
    setSel(i);
    setLoading(true);
  }
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 520);
    return () => clearTimeout(t);
  }, [sel]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '54px 18px 0', gap: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.02em' }}>Deploys</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-faint)', ...TNUM }}>
          {tab.count} {tab.label.toLowerCase()}
        </div>
      </div>

      <Segmented
        options={['Active', 'Queued', 'Done', 'Failed']}
        label="Deploy status"
        value={sel}
        onChange={pick}
        controls="seg-panel"
      />

      {/* The switched panel. aria-live so a status change is announced; the
          segments point at it via aria-controls. */}
      <div id="seg-panel" role="region" aria-label="Deploys panel" aria-live="polite" style={{ flex: 1, minBlockSize: 0 }}>
        {loading ? (
          <div aria-hidden="true">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : tab.state === 'error' ? (
          <Alert tone="danger" style={{ marginBlockStart: 'var(--space-1)' }}>
            <AlertTitle>1 deploy failed</AlertTitle>
            <AlertDescription>
              <span style={{ fontFamily: 'var(--font-mono)', ...TNUM }}>payments-svc</span> exited 1 · 2m ago. Re-run from the deploy log.
            </AlertDescription>
          </Alert>
        ) : tab.state === 'empty' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', height: '100%', color: 'var(--fg-faint)', textAlign: 'center' }}>
            <Icons.check size={20} />
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>No completed deploys yet</div>
            <div style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}>they land here when a run finishes</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {tab.rows.map((r) => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) 0', borderBlockEnd: '1px solid var(--border)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--fg-faint)', flex: '0 0 auto' }} aria-hidden="true" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minInlineSize: 0 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.id}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)', ...TNUM }}>{r.meta}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MobileSegmented() {
  return (
    <Section
      id="segmented"
      num="01"
      title="Segmented control"
      desc="Two to four mutually-exclusive options in a pill track — the mobile sibling of Tabs, used to filter or switch a panel in place. Active option lifts onto an elevated surface."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Reach for Segmented when the choices are short, peer, and always visible. For more than four options or longer labels, use a list row or a sheet picker instead.</Lede>
      <Frame label="switch a status → the panel below loads, then settles to list / empty / failed" center>
        <DeviceFrame initial="iphone-se"><SegScreen /></DeviceFrame>
      </Frame>
      <Lede up>Choosing a segment swaps the panel in place: a short loading skeleton, then the matching state — three building deploys, an empty &ldquo;Done&rdquo; tray, or a failed run surfaced as a <Mono>role=&quot;alert&quot;</Mono>. That is the whole job of the control, performed live.</Lede>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 280 }} aria-hidden="true">
              <div style={{ display: 'flex', gap: 3, padding: 3, borderRadius: 999, background: 'var(--surface-active)' }}>
                <span style={{ flex: 1, textAlign: 'center', padding: '6px 0', borderRadius: 999, background: 'var(--surface)', boxShadow: 'var(--shadow-1)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--fg)' }}>Day</span>
                <span style={{ flex: 1, textAlign: 'center', padding: '6px 0', borderRadius: 999, fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>Week</span>
                <span style={{ flex: 1, textAlign: 'center', padding: '6px 0', borderRadius: 999, fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>Month</span>
              </div>
              <span className="lead h" style={{ top: 18, left: -28, width: 24 }} />
              <span className="lead v" style={{ top: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }} />
              <span className="lead v" style={{ bottom: -22, left: '16.6%', height: 18, transform: 'translateX(-50%)' }} />
              <span className="lead v" style={{ bottom: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }} />
              <div className="pin" style={{ top: 9, left: -52 }}>1</div>
              <div className="pin" style={{ top: -42, left: '50%', transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ bottom: -42, left: '16.6%', transform: 'translateX(-50%)' }}>3</div>
              <div className="pin" style={{ bottom: -42, left: '50%', transform: 'translateX(-50%)' }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Track.</b> Recessed pill on <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--surface-active</code> with <span style={TNUM}>3px</span> inner padding.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Segments.</b> Equal-width buttons, one label each — no icons, no wrapping.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Active thumb.</b> The selected segment lifts onto an elevated surface with a soft shadow and full-strength label.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Rest segments.</b> Transparent with a muted label until selected.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginBlockStart: 12, alignItems: 'start'}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 10}}>Keyboard map</div>
          <Kbd label="Tab" keys={['⇥']} meta="enter / leave the group" />
          <Kbd label="Move selection (LTR)" keys={['←', '→']} meta="RTL: mirrored" />
          <Kbd label="Move selection (any dir)" keys={['↑', '↓']} />
          <Kbd label="First / last enabled" keys={['Home', 'End']} />
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginBlockStart: 10}}>One roving <Mono>tabindex</Mono> stop reaches the selected segment; selection follows focus and <b style={{color: 'var(--fg)'}}>steps over disabled segments</b>.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 6}}>VoiceOver / TalkBack</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The track is a <code style={{fontFamily:'var(--font-mono)'}}>role=&quot;radiogroup&quot;</code>; each segment is a <code style={{fontFamily:'var(--font-mono)'}}>radio</code> with <code style={{fontFamily:'var(--font-mono)'}}>aria-checked</code>, so it announces <Mono>“Queued, <span style={TNUM}>2 of 3</span>, selected”</Mono>. Each segment also carries <code style={{fontFamily:'var(--font-mono)'}}>aria-controls</code> pointing at the panel, which is a <code style={{fontFamily:'var(--font-mono)'}}>role=&quot;region&quot;</code> + <code style={{fontFamily:'var(--font-mono)'}}>aria-live=&quot;polite&quot;</code>, so the new state is read after the selection. A disabled segment carries <code style={{fontFamily:'var(--font-mono)'}}>aria-disabled</code> and the native <code style={{fontFamily:'var(--font-mono)'}}>disabled</code> attribute, so it announces as dimmed and is skipped.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 6}}>Touch targets &amp; gesture</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Segments split the track&apos;s width evenly and clear <span style={TNUM}>44px</span> tall from the <span style={TNUM}>4-pt</span> base; cap at four for a comfortable thumb width. Tap is the only interaction — no swipe-across to learn — and every enabled segment sits in the focus order.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 6}}>Focus, motion &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The focused segment shows the ember focus ring (<Mono>--ring</Mono>) from <Mono>.m-segmented [role=radio]:focus-visible</Mono>. The thumb crossfade eases on <Mono>--dur-fast</Mono>; the same rule drops the transition to <Mono>none</Mono> under <Mono>prefers-reduced-motion</Mono>, so the swap is instant. Selection is shown by the lifted surface and full-strength label, not colour alone — both keep AA contrast (<span style={TNUM}>4.5:1</span>) on the track.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — segments reverse; the first option sits on the right'} center code={`<div dir="rtl">{/* flex track reverses; the lifted thumb follows the selected segment */}</div>`} lang="tsx">
        <div dir="rtl"><DeviceFrame initial="iphone-se"><SegScreen /></DeviceFrame></div>
      </Frame>
      <Lede>Under <Mono>dir=&quot;rtl&quot;</Mono> the equal-width segments reverse within the pill track, so the first option lands on the right and the rest run leftward. The lifted thumb — the elevated surface plus shadow — follows the selected segment wherever it sits, and no glyph mirrors (there are none); no <Mono>scaleX(-1)</Mono> is involved.</Lede>

      <SubHead meta="rules">Do / Don&apos;t</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — two to four short peers</div>
          <div className="body"><Segmented options={['Active', 'Queued', 'Done']} /></div>
          <div className="note">Short, mutually-exclusive labels that stay one line. The lifted segment reads as selected at a glance.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don&apos;t — six long options</div>
          <div className="body"><Segmented options={['Active', 'Queued', 'Done', 'Failed', 'Rolled back', 'Archived']} /></div>
          <div className="note">Six segments crush each below the touch target and clip the labels. Move long lists to a sheet picker.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="segmented control"
        lang="tsx"
        code={`<div className="m-segmented" role="radiogroup" aria-label="View">
  {options.map((o, i) => (
    <button key={o.label} role="radio" aria-checked={i === active}
      className={i === active ? 'is-active' : ''}
      aria-controls="seg-panel"                 // points at the switched region
      aria-disabled={o.disabled || undefined}
      disabled={o.disabled}
      tabIndex={i === active ? 0 : -1}           // roving tabindex
      onClick={() => select(i)}
      onKeyDown={onKeyDown}>                      // Arrow keys step over disabled
      {o.label}
    </button>
  ))}
</div>
{/* The panel the control switches in place */}
<div id="seg-panel" role="region" aria-live="polite">{/* list · empty · failed */}</div>`}
      />
    </Section>
  );
}
