'use client';
// Forge DS — Components / Collapsible
// Single disclosure: one trigger + one animated region.
// The atom beneath Accordion — reach for it when only one optional block is involved.
import * as React from 'react';
import {
  Icons,
  Frame,
  Section,
  SubHead,
  Lede,
  Mono,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/ds/core';
import { ComponentInstall, AutoPropsTable } from '@/ds/core';

// ── Code samples ──────────────────────────────────────────────────────────────

const USAGE_CODE = `import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@forge/ui";
import * as React from "react";

export function Demo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>Advanced options</CollapsibleTrigger>
      <CollapsibleContent>
        Force a custom region, set a TTL, or attach a side-car.
      </CollapsibleContent>
    </Collapsible>
  );
}`;

const DEFAULT_OPEN_CODE = `<Collapsible defaultOpen>
  <CollapsibleTrigger>Raw payload</CollapsibleTrigger>
  <CollapsibleContent>
    <pre>{"id":"svc_8f3","region":"us-east-1"}</pre>
  </CollapsibleContent>
</Collapsible>`;

const CONTROLLED_CODE = `const [open, setOpen] = React.useState(false);

<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger>Region label</CollapsibleTrigger>
  <CollapsibleContent>…</CollapsibleContent>
</Collapsible>`;

const DISABLED_CODE = `<Collapsible disabled>
  <CollapsibleTrigger>Locked region</CollapsibleTrigger>
  <CollapsibleContent>Not reachable.</CollapsibleContent>
</Collapsible>`;

const RTL_CODE = `<div dir="rtl">
  {/* justify-content: space-between + text-align: start
      → label right-aligns, chevron rides the trailing (left) edge */}
  <Collapsible defaultOpen>
    <CollapsibleTrigger>خيارات متقدمة</CollapsibleTrigger>
    <CollapsibleContent>
      افرض منطقة مخصصة، أو اضبط مدة البقاء.
    </CollapsibleContent>
  </Collapsible>
</div>`;

// ── Controlled state wrapper for the "Controlled" demo ────────────────────────
function ControlledDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn sm outline" onClick={() => setOpen(true)}>Open</button>
        <button className="btn sm outline" onClick={() => setOpen(false)}>Close</button>
      </div>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger>Controlled region</CollapsibleTrigger>
        <CollapsibleContent>
          Driven by external state — the buttons above bypass the trigger but both paths fire{' '}
          <Mono>onOpenChange</Mono>.
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// ── In-context demo ───────────────────────────────────────────────────────────
function InContextDemo() {
  return (
    <div className="surface" style={{ padding: 20, borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 440 }}>
      <div style={{ fontWeight: 600, fontSize: 'var(--text-body)', color: 'var(--fg)', marginBottom: 4 }}>
        api-gateway · us-east-1
      </div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', marginBottom: 16 }}>
        3 replicas · healthy
      </div>
      <Collapsible>
        <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>
        <CollapsibleContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
              <span>TTL override</span>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg)' }}>3600s</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
              <span>Side-car enabled</span>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--fg)' }}>true</code>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CollapsiblePage() {
  return (
    <Section
      id="collapsible"
      title="Collapsible"
      desc="One trigger, one animated region. The atom beneath Accordion — reach for it when a page has a single optional block. Use Accordion when 2+ peer regions need single-open enforcement."
    >
      {/* ── 1. INSTALLATION ─────────────────────────────────────────────── */}
      <ComponentInstall slug="collapsible" />
      <Lede>
        Plain React over the Forge CSS layer — no Radix, no measuring. Height
        animates via <Mono>grid-template-rows: 0fr {'→'} 1fr</Mono> so no{' '}
        <Mono>ResizeObserver</Mono> is needed. The trigger and content IDs wire{' '}
        themselves through shared context so <Mono>aria-controls</Mono> and{' '}
        <Mono>aria-labelledby</Mono> always resolve.
      </Lede>

      {/* ── 2. USAGE ────────────────────────────────────────────────────── */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <Collapsible>
            <CollapsibleTrigger>Advanced options</CollapsibleTrigger>
            <CollapsibleContent>
              Force a custom region, set a TTL, or attach a side-car.
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Frame>

      {/* ── 3. VARIANTS ─────────────────────────────────────────────────── */}
      <div style={{
        marginTop: 36, marginBottom: 6,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--fg-faint)',
        }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      <SubHead meta="defaultOpen prop">Default open</SubHead>
      <Frame label="starts open · closes on click" code={DEFAULT_OPEN_CODE}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <Collapsible defaultOpen>
            <CollapsibleTrigger>Raw payload</CollapsibleTrigger>
            <CollapsibleContent>
              <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg)', lineHeight: 1.6 }}>
                {`{\n  "id": "svc_8f3",\n  "region": "us-east-1",\n  "replicas": 3\n}`}
              </pre>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Frame>

      <SubHead meta="controlled">Controlled</SubHead>
      <Frame label="open / onOpenChange — drive state externally" code={CONTROLLED_CODE}>
        <ControlledDemo />
      </Frame>

      <SubHead meta="disabled">Disabled</SubHead>
      <Frame label="trigger is non-interactive · visually dimmed" code={DISABLED_CODE}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <Collapsible disabled>
            <CollapsibleTrigger>Locked region</CollapsibleTrigger>
            <CollapsibleContent>Not reachable while disabled.</CollapsibleContent>
          </Collapsible>
        </div>
      </Frame>

      {/* ── 4. IN CONTEXT ───────────────────────────────────────────────── */}
      <SubHead meta="real surface">In context</SubHead>
      <Lede up>A service card that reveals advanced settings inside an inline disclosure.</Lede>
      <Frame label="service detail card with Collapsible">
        <InContextDemo />
      </Frame>

      {/* ── 4b. DECISION MATRIX ─────────────────────────────────────────── */}
      <SubHead meta="when to use">Collapsible vs Accordion</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Pick the right primitive</span></div>
        <table className="spec" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ padding: '10px 12px' }}>Use</th>
              <th>Pattern</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>One optional region — "Advanced options"</td><td className="tok-name">Collapsible</td></tr>
            <tr><td>3+ peer regions, only one open at a time — FAQ</td><td className="tok-name">Accordion (single)</td></tr>
            <tr><td>3+ peer regions, any number open — settings categories</td><td className="tok-name">Accordion (multiple)</td></tr>
            <tr><td>Region is large and must persist — main panel</td><td className="tok-name">Tabs</td></tr>
          </tbody>
        </table>
      </div>

      {/* ── 5. ACCESSIBILITY ────────────────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-body" style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            <Mono>Tab</Mono> moves focus to the trigger. <Mono>Enter</Mono> or{' '}
            <Mono>Space</Mono> toggles the region. Focus remains on the trigger after
            toggling. When open, <Mono>Tab</Mono> continues naturally into the revealed
            content in DOM order. When closed the content is <Mono>inert</Mono> so it
            is skipped entirely.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-body" style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The trigger is a <Mono>{'<button>'}</Mono> with{' '}
            <Mono>aria-expanded</Mono> (true/false) and{' '}
            <Mono>aria-controls</Mono> pointing at the content region by stable ID.
            The region carries <Mono>role="region"</Mono> and{' '}
            <Mono>aria-labelledby</Mono> pointing back at the trigger. Both IDs are
            wired through context — they always resolve.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-body" style={{ fontWeight: 600, marginBottom: 6 }}>Collapsed content</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            When closed, <Mono>aria-hidden="true"</Mono> and the HTML{' '}
            <Mono>inert</Mono> attribute are applied to the content region. This removes
            it from the accessibility tree and the tab order entirely — screen readers
            and keyboard users never encounter collapsed content.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-body" style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The height slides via <Mono>grid-template-rows: 0fr {'→'} 1fr</Mono> and
            the chevron rotates, both on <Mono>var(--ease)</Mono>. Under{' '}
            <Mono>prefers-reduced-motion: reduce</Mono> the{' '}
            <Mono>.coll-body</Mono> and <Mono>.coll-chev</Mono> transitions are set to{' '}
            <Mono>none</Mono> so the region opens instantly with no slide or rotation.
          </div>
        </div>
      </div>

      {/* ── 6. RTL ──────────────────────────────────────────────────────── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — label right-aligns, chevron rides the trailing (left) edge'
        center
        code={RTL_CODE}
        lang="tsx"
      >
        <div dir="rtl" style={{ width: '100%', maxWidth: 440 }}>
          <Collapsible defaultOpen>
            <CollapsibleTrigger>خيارات متقدمة</CollapsibleTrigger>
            <CollapsibleContent>
              افرض منطقة مخصصة، أو اضبط مدة البقاء، أو أرفق حاوية جانبية.
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Frame>
      <Lede>
        The trigger uses <Mono>justify-content: space-between</Mono> and{' '}
        <Mono>text-align: start</Mono>, so in RTL the label right-aligns and
        the disclosure chevron rides the trailing edge to the{' '}
        <b style={{ color: 'var(--fg)' }}>left</b> automatically — no override
        needed. The chevron is a vertical glyph (rotates 180° on open) so it reads
        correctly in either direction; only horizontal arrows need a{' '}
        <Mono>scaleX(-1)</Mono> mirror.
      </Lede>

      {/* ── 7. ANATOMY ──────────────────────────────────────────────────── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 320 }} aria-hidden="true">
              <div className="coll-root">
                {/* Static mock — not interactive, aria-hidden on parent */}
                <div
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '10px 14px', textAlign: 'start',
                    fontSize: 'var(--text-base)', fontWeight: 500,
                    background: 'transparent', borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span>Advanced options</span>
                  <Icons.chevronDown size={14} />
                </div>
                <div style={{
                  borderTop: '1px dashed var(--border)', padding: '8px 14px',
                  fontSize: 'var(--text-base)', color: 'var(--fg-faint)', fontStyle: 'italic',
                }}>
                  region · collapsed
                </div>
              </div>
              <span className="lead h" style={{ top: 18, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 18, right: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 18, left: -28, width: 24 }} />
              <span className="lead v" style={{ top: -22, left: 60, height: 18 }} />
              <div className="pin" style={{ top: 10, left: -52 }}>1</div>
              <div className="pin" style={{ top: 10, right: -52 }}>2</div>
              <div className="pin" style={{ bottom: 10, left: -52 }}>3</div>
              <div className="pin" style={{ top: -42, left: 60, transform: 'translateX(-50%)' }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span>
            <span><b style={{ color: 'var(--fg)' }}>Trigger.</b> Full-width <Mono>{'<button>'}</Mono> with <Mono>aria-expanded</Mono> and <Mono>aria-controls</Mono>. Sentence-case noun phrase.</span>
            <span className="num">2</span>
            <span><b style={{ color: 'var(--fg)' }}>Chevron.</b> Visual affordance. Rotates 180° on open via <Mono>transform</Mono> and <Mono>var(--ease)</Mono>.</span>
            <span className="num">3</span>
            <span><b style={{ color: 'var(--fg)' }}>Region.</b> <Mono>role="region"</Mono> with <Mono>aria-labelledby</Mono>. Animates via <Mono>grid-template-rows: 0fr {'→'} 1fr</Mono>.</span>
            <span className="num">4</span>
            <span><b style={{ color: 'var(--fg)' }}>ARIA ID link.</b> Trigger ID and content ID are generated by <Mono>useId()</Mono> and shared via context — both always resolve.</span>
          </div>
        </div>
      </div>

      {/* ── 8. DO / DON'T ───────────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — animate height, not opacity</div>
          <div className="body">
            <Collapsible defaultOpen>
              <CollapsibleTrigger>Animated by grid-row</CollapsibleTrigger>
              <CollapsibleContent>
                Sliding height tells the eye "this content lives here." Fading in/out reads as new content arriving.
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div className="note"><Mono>grid-template-rows: 0fr {'→'} 1fr</Mono> gives a clean height animation without measuring the inner DOM.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — put required content behind a chevron</div>
          <div className="body">
            <Collapsible>
              <CollapsibleTrigger>Required: payment method</CollapsibleTrigger>
              <CollapsibleContent>
                If the user must act to proceed, never hide the action behind a closed region.
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div className="note">Collapsibles are for OPTIONAL detail. If the content is required, render it directly.</div>
        </div>
      </div>

      {/* ── 9. API REFERENCE ────────────────────────────────────────────── */}
      <SubHead meta="CollapsibleProps">API reference</SubHead>
      <AutoPropsTable component="Collapsible" label="<Collapsible />" />
      <AutoPropsTable component="CollapsibleTrigger" label="<CollapsibleTrigger />" />
      <AutoPropsTable component="CollapsibleContent" label="<CollapsibleContent />" />
    </Section>
  );
}
