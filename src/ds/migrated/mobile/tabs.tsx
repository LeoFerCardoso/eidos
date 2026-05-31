'use client';
// Eidos Mobile — Tabs. A horizontal strip under the app bar that switches the view below it,
// with a sliding underline on the active label. Unlike the Tab bar (top-level destinations,
// fixed at the bottom) tabs live inside one screen; unlike Segmented control they scroll when
// the set is long and read as section headers, not a pill toggle.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

// Page-scoped reduced-motion flag — there is no global motion guard, so the inline
// underline/colour transitions are gated on this (matches @eidos/ui's matchMedia pattern).
function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

function Tabs({ tabs, active, onChange, idBase }: { tabs: string[]; active: number; onChange: (i: number) => void; idBase: string }) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [bar, setBar] = React.useState({ left: 0, width: 0 });
  const reduced = useReducedMotion();
  React.useEffect(() => {
    const el = refs.current[active];
    if (el) {
      setBar({ left: el.offsetLeft, width: el.offsetWidth });
      el.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
    }
  }, [active, tabs, reduced]);

  // Roving tabindex: Arrow keys move + activate (RTL-mirrored), Home/End jump to the ends.
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    let next = active;
    if (e.key === 'ArrowRight') next = rtl ? active - 1 : active + 1;
    else if (e.key === 'ArrowLeft') next = rtl ? active + 1 : active - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    else return;
    e.preventDefault();
    next = (next + tabs.length) % tabs.length;
    onChange(next);
    refs.current[next]?.focus();
  }

  return (
    <div role="tablist" aria-label="Service views" onKeyDown={onKeyDown} style={{ position: 'relative', display: 'flex', gap: 4, overflowX: 'auto', borderBlockEnd: '1px solid var(--border)', scrollbarWidth: 'none' }}>
      {tabs.map((t, i) => (
        <button
          key={t}
          ref={(el) => { refs.current[i] = el; }}
          id={`${idBase}-tab-${i}`}
          role="tab"
          aria-selected={i === active}
          aria-controls={`${idBase}-panel-${i}`}
          tabIndex={i === active ? 0 : -1}
          onClick={() => onChange(i)}
          style={{
            flex: 'none', padding: '12px 14px', border: 'none', background: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            fontSize: 'var(--text-sm)', fontWeight: i === active ? 650 : 500, color: i === active ? 'var(--fg)' : 'var(--fg-muted)',
            transition: reduced ? 'none' : 'color var(--dur-fast) var(--ease)',
          }}
        >
          {t}
        </button>
      ))}
      <span aria-hidden="true" style={{ position: 'absolute', insetBlockEnd: 0, insetInlineStart: bar.left, width: bar.width, height: 2, background: 'var(--accent)', borderRadius: 2, transition: reduced ? 'none' : 'inset-inline-start var(--dur) var(--ease-spring), width var(--dur) var(--ease-spring)' }} />
    </div>
  );
}

const PANELS = ['Overview', 'Deploys', 'Metrics', 'Logs', 'Settings'];

function TabsScreen({ idBase = 'svc' }: { idBase?: string }) {
  const [active, setActive] = React.useState(1);
  return (
    <div style={{ paddingBlockStart: 50, height: '100%' }}>
      <div style={{ paddingInline: 16, paddingBlockEnd: 4, fontSize: 'var(--text-xl)', fontWeight: 700 }}>payments-api</div>
      <div style={{ paddingInline: 8 }}><Tabs tabs={PANELS} active={active} onChange={setActive} idBase={idBase} /></div>
      <div
        role="tabpanel"
        id={`${idBase}-panel-${active}`}
        aria-labelledby={`${idBase}-tab-${active}`}
        tabIndex={0}
        style={{ padding: 16, color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}
      >
        <div className="t-mono-label" style={{ color: 'var(--fg-faint)', marginBlockEnd: 8 }}>{PANELS[active].toUpperCase()}</div>
        {active === 1 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['v4.3.0 · 2m ago', 'v4.2.9 · 1h ago', 'v4.2.8 · yesterday'].map((d) => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <Icons.rocket size={15} color="var(--accent)" /><span style={{ color: 'var(--fg)', fontFamily: 'var(--font-mono)', fontFeatureSettings: "'tnum', 'zero'" }}>{d}</span>
              </div>
            ))}
          </div>
        ) : (
          <div>The {PANELS[active]} panel renders here. Switching a tab swaps this region only.</div>
        )}
      </div>
    </div>
  );
}

export default function MobileTabs() {
  return (
    <Section
      id="tabs"
      num="01"
      title="Tabs"
      desc="A scrollable strip beneath the app bar for switching between peer sections of one object — Overview, Deploys, Metrics, Logs. The active label carries a sliding ember underline."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>For top-level app destinations use the Tab bar; for a short two-to-four-way toggle use the Segmented control. Tabs are for splitting one object's detail into peer sections.</Lede>
      <Frame label="Tap a label — the underline slides and the panel swaps · scroll for more" center>
        <DeviceFrame initial="iphone-se"><TabsScreen idBase="svc-usage" /></DeviceFrame>
      </Frame>

      <SubHead meta="states">Scroll behaviour</SubHead>
      <Frame label="Few tabs sit static · many scroll horizontally with the strip">
        <div style={{ display: 'grid', gap: 14, maxWidth: 360, margin: '0 auto', paddingBlock: 8 }}>
          <DemoTabs tabs={['Overview', 'Deploys', 'Metrics']} active={0} idBase="svc-few" />
          <DemoTabs tabs={['Overview', 'Deploys', 'Metrics', 'Logs', 'Settings', 'Access', 'Costs']} active={3} idBase="svc-many" />
        </div>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '60px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 300 }} aria-hidden="true">
              <div style={{ position: 'relative', display: 'flex', gap: 6, borderBlockEnd: '1px solid var(--border)' }}>
                <span style={{ padding: '10px 12px', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>Overview</span>
                <span style={{ padding: '10px 12px', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--fg)' }}>Deploys</span>
                <span style={{ padding: '10px 12px', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>Metrics</span>
                <span style={{ position: 'absolute', insetBlockEnd: 0, insetInlineStart: 76, width: 70, height: 2, background: 'var(--accent)', borderRadius: 2 }} />
              </div>
              <span className="lead v" style={{ insetBlockStart: -24, insetInlineStart: 24, height: 18 }} />
              <span className="lead v" style={{ insetBlockStart: -24, insetInlineStart: 110, height: 18 }} />
              <span className="lead v" style={{ insetBlockEnd: -24, insetInlineStart: 110, height: 18 }} />
              <div className="pin" style={{ insetBlockStart: -46, insetInlineStart: 12 }}>1</div>
              <div className="pin" style={{ insetBlockStart: -46, insetInlineStart: 96 }}>2</div>
              <div className="pin" style={{ insetBlockEnd: -46, insetInlineStart: 96 }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Rest tab.</b> A muted label, no underline; the whole strip scrolls horizontally when the labels overflow.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Active tab.</b> Full-strength, heavier label — selection is shown by weight as well as the underline.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Indicator.</b> A 2px <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--accent</code> underline that slides to the active tab's width — the page's one ember accent.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginBlockStart: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Touch targets</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Each tab clears 44px tall with its padding; selecting a tab calls <Mono>scrollIntoView</Mono> so the active label is pulled in from an edge, never clipped.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Tablist semantics</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The strip is <Mono>role="tablist"</Mono>; each tab is a <Mono>role="tab"</Mono> carrying <Mono>aria-selected</Mono> and <Mono>aria-controls</Mono> pointing at the matching <Mono>role="tabpanel"</Mono>, which back-references it with <Mono>aria-labelledby</Mono>.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Keyboard</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, display: 'grid', gap: 4 }}>
            <div><kbd className="kbd">→</kbd> / <kbd className="kbd">←</kbd> — previous / next tab (mirrored under RTL)</div>
            <div><kbd className="kbd">Home</kbd> / <kbd className="kbd">End</kbd> — first / last tab</div>
            <div>Roving <Mono>tabindex</Mono>: one Tab stop lands on the active tab; arrows move <em>and</em> activate from there.</div>
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Contrast + motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Active state is weight <em>plus</em> the underline, not colour alone — and the active label sits at full <Mono>--fg</Mono> (≥7:1), rest labels at <Mono>--fg-muted</Mono>. With no global guard, the underline slide and colour fade are gated on a local <Mono>prefers-reduced-motion</Mono> flag, collapsing to an instant move.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — the strip starts on the right; the underline tracks from that edge'} center code={`<span style={{ insetInlineStart: bar.left }} /> {/* logical, so it slides from the start edge */}`} lang="tsx">
        <div dir="rtl"><DeviceFrame initial="iphone-se"><TabsScreen idBase="svc-rtl" /></DeviceFrame></div>
      </Frame>
      <Lede>The scrollable strip begins from the right under <Mono>dir="rtl"</Mono>, and because the indicator is positioned with <Mono>inset-inline-start</Mono> the sliding underline measures from that same start edge and tracks the active tab correctly. Labels are plain text and don't mirror.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — peer sections of one object</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch' }}><DemoTabs tabs={['Overview', 'Deploys', 'Metrics', 'Logs']} active={1} idBase="svc-do" /></div>
          <div className="note">Sibling views of the same service. Tap moves between them; the panel below swaps.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — top-level app destinations</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch' }}><DemoTabs tabs={['Home', 'Search', 'Deploys', 'Alerts', 'Profile']} active={0} idBase="svc-dont" /></div>
          <div className="note">Switching whole areas of the app belongs in a fixed bottom Tab bar, always reachable by the thumb.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="tabs"
        lang="tsx"
        code={`<div role="tablist" className="m-tabs" onKeyDown={onArrowHomeEnd}>
  {views.map((v, i) => (                          /* overflow-x: auto; scrollbar hidden */
    <button role="tab" id={\`tab-\${i}\`} aria-selected={i === active}
      aria-controls={\`panel-\${i}\`} tabIndex={i === active ? 0 : -1}  /* roving */
      onClick={() => setActive(i)}>{v}</button>
  ))}
  <span className="m-tabs-underline" style={{ left, width }} />  {/* slides to active */}
</div>
<div role="tabpanel" id={\`panel-\${active}\`} aria-labelledby={\`tab-\${active}\`}>
  { panels[active] }
</div>

/* underline 2px var(--accent); active label heavier (weight, not colour alone).
   Arrow ← → (RTL-mirrored) + Home/End move AND activate; slide gated on
   prefers-reduced-motion (no global guard). */`}
      />
      <p className="ds-caption" style={{ marginBlockStart: 12 }}>
        For app-level destinations use the <a href="/mobile/tab-bar.html" style={{ color: 'var(--ember)' }}>Tab bar</a>; for a short toggle, the <a href="/mobile/segmented.html" style={{ color: 'var(--ember)' }}>Segmented control</a>.
      </p>
    </Section>
  );
}

function DemoTabs({ tabs, active, idBase }: { tabs: string[]; active: number; idBase: string }) {
  const [a, setA] = React.useState(active);
  return (
    <>
      <Tabs tabs={tabs} active={a} onChange={setA} idBase={idBase} />
      {tabs.map((t, i) => (
        <div
          key={t}
          role="tabpanel"
          id={`${idBase}-panel-${i}`}
          aria-labelledby={`${idBase}-tab-${i}`}
          hidden={i !== a}
        />
      ))}
    </>
  );
}
