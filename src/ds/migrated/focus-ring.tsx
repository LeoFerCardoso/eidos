'use client';
// Forge DS — Foundations / Focus Ring
//
// The single canonical interactive focus indicator used by every component.
// Goal: one affordance, one set of tokens, one behaviour — whether the user
// reaches the element with the keyboard (Tab) or activates it with a pointer.
//
// Spec at a glance:
//   • Solid 2px outline painted OUTSIDE the element
//   • 2px offset between element edge and the outline (gap is transparent —
//     whatever is behind shows through, so it works on every surface)
//   • Fires on :focus-visible AND on stateful "open" markers
//     (.is-open on triggers, [aria-expanded="true"] when applicable)
//   • Inside editable areas, the OUTER container owns the ring; inner
//     <input>/<textarea> elements stay silent — never two rings nested
import * as React from 'react';
import { Icons, Frame, Section, SubHead, SpecRow, Lede, Mono } from '@/ds/core';


// Reusable mock trigger so we can show focused / open / invalid / danger
// permutations without wiring real popovers. The "focus" state uses the
// outline-offset pattern, identical to what real components render.
const Trigger = ({ state='default', invalid=false, label='Next.js', kind='trigger' }) => {
  const cls = kind === 'btn' ? ['btn', 'ember'] : ['cb-trigger'];
  if (state === 'open' && kind !== 'btn') cls.push('is-open');
  if (invalid) cls.push('is-invalid');
  const style: React.CSSProperties = { cursor:'default', userSelect:'none' };
  if (kind === 'trigger') style.width = 220;
  if (state === 'focus' || state === 'open') {
    style.outline = `var(--ring-width) solid ${invalid ? 'var(--ring-danger)' : 'var(--ring)'}`;
    style.outlineOffset = 'var(--ring-offset)';
  }
  if (kind === 'btn') {
    return <button className={cls.join(' ')} style={style} tabIndex={-1}>{label}</button>;
  }
  return (
    <div className={cls.join(' ')} style={style} tabIndex={-1} aria-hidden="true">
      <span className="label">{label}</span>
      <Icons.chevronDown size={14} className="chev"/>
    </div>
  );
};

export default function FocusRing() {
  return (
    <Section
      id="focus-ring"
      num="09"
      title="Focus Ring"
      desc="One affordance, every component. Keyboard and pointer interactions share the same offset outline so users always see the focused target — regardless of how they got there."
    >
      <Lede>
        Every interactive element in Forge — buttons, inputs, triggers, the command palette, the file drop zone, even the checkbox box — uses the <b style={{color:'var(--fg)'}}>same</b> focus ring. A solid 2px outline painted just outside the element, with a 2px gap that shows through to whatever sits behind. No more "I tabbed here but the ring is different from when I clicked." No more browser-default blue rings sneaking through. One affordance, one pattern, no per-component drift.
      </Lede>

      {/* ────────────────────────────────────────────────────────────────
          PREVIEW — show the same ring around different element types
          ──────────────────────────────────────────────────────────────── */}
      <SubHead meta="one ring, every component">Preview</SubHead>
      <Frame label="The same outline-offset pattern on a button, a trigger, an input, and a checkbox">
        <div style={{display:'flex', flexWrap:'wrap', gap: 28, alignItems:'center', width:'100%', justifyContent:'center', padding:'12px 0'}}>
          <Trigger kind="btn" state="focus" label="Deploy"/>
          <Trigger state="open" label="Next.js"/>
          <div className="in-group md" style={{width: 200, outline:'var(--ring-width) solid var(--ring)', outlineOffset:'var(--ring-offset)'}}>
            <input className="in-control" defaultValue="forge-platform" readOnly/>
          </div>
          <label className="fc" style={{cursor:'default'}}>
            <input type="checkbox" defaultChecked readOnly className="fc-input" tabIndex={-1}/>
            <span className="fc-check-box" style={{background:'var(--ember)', borderColor:'var(--ember)', outline:'var(--ring-width) solid var(--ring)', outlineOffset:'var(--ring-offset)'}}>
              <Icons.check size={10} color="var(--ember-fg)" strokeWidth={3}/>
            </span>
            <span className="fc-text"><span className="fc-label">Auto-deploy</span></span>
          </label>
        </div>
      </Frame>

      {/* ────────────────────────────────────────────────────────────────
          TOKENS
          ──────────────────────────────────────────────────────────────── */}
      <SubHead meta="4 tokens">Tokens</SubHead>
      <table className="spec">
        <thead><tr><th>Token</th><th>Value</th><th>Use</th></tr></thead>
        <tbody>
          <SpecRow token="--ring-width" value="2px" usage="Stroke thickness of the outline. Never override per-component."/>
          <SpecRow token="--ring-offset" value="2px" usage="Gap between the element's edge and the ring start. The gap is transparent — whatever is behind the element shows through."/>
          <SpecRow token="--ring" value="var(--ember)" usage="Default ring color — solid ember. Re-derives per theme via the --ember token."/>
          <SpecRow token="--ring-danger" value="var(--danger)" usage="Invalid / error variant — solid danger. Theme-tracked."/>
        </tbody>
      </table>
      <Lede>
        That's it. Four tokens, no composed shorthands, no per-surface gap-colors. The transparent gap means the same outline works whether the element sits on the canvas, on a card, on an elevated panel, or on a solid ember surface.
      </Lede>

      {/* ────────────────────────────────────────────────────────────────
          ANATOMY
          ──────────────────────────────────────────────────────────────── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">A focused element · 2px outline · 2px offset · transparent gap</span></div>
        <div className="ds-frame-body" style={{padding: '72px 36px 64px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative'}} aria-hidden="true">
              <Trigger state="focus" label="Next.js"/>
              {/* Leader lines */}
              <span className="lead h" style={{top: 18, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 18, right: -28, width: 24}}/>
              <span className="lead v" style={{top: -22, left: '50%', height: 18}}/>
              <span className="lead v" style={{bottom: -22, left: '50%', height: 18}}/>
              {/* Numbered pins */}
              <div className="pin" style={{top: 8, left: -52}}>1</div>
              <div className="pin" style={{top: 8, right: -52}}>2</div>
              <div className="pin" style={{top: -42, left: '50%', transform:'translateX(-50%)'}}>3</div>
              <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 580, margin:'72px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Element edge.</b> The element keeps its natural resting border. The focus ring does NOT recolor it — that would couple the affordance to surfaces that don't have a visible border (ghost button, icon-only).</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Outline.</b> A 2px solid stroke painted outside the element via <Mono>outline</Mono> (not border, not box-shadow). Doesn't take layout space; doesn't compose with elevation shadows.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Offset.</b> 2px transparent gap between the element's edge and the outline. <Mono>outline-offset</Mono> handles this natively — whatever is behind the element shows through.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>One source.</b> The native browser outline is replaced with ours via <Mono>outline: var(--ring-width) solid var(--ring)</Mono>. No double rings, no stray defaults.</span>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────
          THE PATTERN
          ──────────────────────────────────────────────────────────────── */}
      <SubHead meta="copy-paste pattern">The pattern</SubHead>
      <Frame label="One block, every interactive component. Drop into your CSS verbatim." lang="css" code={`/* The canonical Forge focus ring.
   Wire :focus-visible (keyboard) AND any stateful "open" marker
   (.is-open, [aria-expanded="true"]) to the same declaration so
   pointer and keyboard reach the SAME affordance. */
.my-trigger {
  /* Element keeps its natural border. */
  border: 1px solid var(--border-strong);
  outline: none;
  transition: outline-color var(--dur-fast) var(--ease);
}

.my-trigger:focus-visible,
.my-trigger.is-open {
  outline: var(--ring-width) solid var(--ring);
  outline-offset: var(--ring-offset);
}

/* Invalid variant — same geometry, danger hue. */
.my-trigger.is-invalid:focus-visible,
.my-trigger.is-invalid.is-open {
  outline: var(--ring-width) solid var(--ring-danger);
  outline-offset: var(--ring-offset);
}`}>
        <div style={{display:'flex', gap: 16, alignItems:'center', flexWrap:'wrap'}}>
          <Trigger state="default" label="Default"/>
          <Trigger state="focus" label=":focus-visible"/>
          <Trigger state="open" label=".is-open"/>
          <Trigger state="focus" invalid label="invalid"/>
        </div>
      </Frame>

      {/* ────────────────────────────────────────────────────────────────
          STATE MATRIX
          ──────────────────────────────────────────────────────────────── */}
      <SubHead meta="states">State matrix</SubHead>
      <table className="spec">
        <thead><tr><th>State</th><th>Trigger</th><th>What changes</th></tr></thead>
        <tbody>
          <tr><td className="tok-name">Resting</td><td>—</td><td>No outline. Element renders at its natural border / background.</td></tr>
          <tr><td className="tok-name">Hover</td><td><Mono>:hover</Mono></td><td>Surface or border shift only. <b>No outline</b> — hover is not focus.</td></tr>
          <tr><td className="tok-name">Keyboard focus</td><td><Mono>:focus-visible</Mono></td><td>2px solid <Mono>--ring</Mono> outline, 2px offset.</td></tr>
          <tr><td className="tok-name">Pointer-opened</td><td><Mono>.is-open</Mono></td><td>Same outline. The user clicked to open — they need to see what's active.</td></tr>
          <tr><td className="tok-name">Invalid + focus</td><td><Mono>.is-invalid:focus-visible</Mono></td><td>Same geometry, danger hue.</td></tr>
          <tr><td className="tok-name">Disabled</td><td><Mono>:disabled</Mono></td><td>No outline ever — disabled elements can't receive focus.</td></tr>
        </tbody>
      </table>

      {/* ────────────────────────────────────────────────────────────────
          EDITABLE AREAS — RING OWNERSHIP
          ──────────────────────────────────────────────────────────────── */}
      <SubHead meta="containers vs natives">Editable areas</SubHead>
      <Lede>
        Whenever an interactive component has an editable child (a search input, a textarea, the search row in the command palette), the OUTER container owns the ring via <Mono>:focus-within</Mono>. The inner native element runs <Mono>outline: none</Mono> so the affordance is single. One ring, one rectangle — never an inner ring inside an outer ring.
      </Lede>
      <Frame label="Outer container owns the ring · inner input stays silent" lang="css" code={`/* Container OWNS the ring */
.in-group:focus-within {
  outline: var(--ring-width) solid var(--ring);
  outline-offset: var(--ring-offset);
}

/* Inner input STAYS SILENT */
.in-group .in-control:focus {
  outline: none;
  box-shadow: none;
}`}>
        <div style={{display:'flex', flexDirection:'column', gap: 14, width: '100%', maxWidth: 480}}>
          <div className="in-field">
            <label className="in-label">Outer container — focus ring projected via :focus-within</label>
            <div className="in-group md" style={{outline:'var(--ring-width) solid var(--ring)', outlineOffset:'var(--ring-offset)'}}>
              <input className="in-control" defaultValue="forge-platform" readOnly/>
            </div>
          </div>
          <div className="in-field">
            <label className="in-label">Inner input — silent, no second ring</label>
            <div className="in-group md">
              <input className="in-control" defaultValue="services/api-gateway" readOnly/>
            </div>
          </div>
        </div>
      </Frame>

      {/* ────────────────────────────────────────────────────────────────
          DO / DON'T
          ──────────────────────────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — same ring for keyboard AND pointer</div>
          <div className="body" style={{flexDirection:'column', alignItems:'center', gap: 18}}>
            <Trigger state="focus" label="Tabbed here"/>
            <Trigger state="open" label="Clicked open"/>
          </div>
          <div className="note">Both look identical. The user always knows what's active, regardless of input mode.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — ring on tab, nothing on click</div>
          <div className="body" style={{flexDirection:'column', alignItems:'center', gap: 18}}>
            <Trigger state="focus" label="Tabbed here"/>
            <Trigger state="default" label="Clicked open"/>
          </div>
          <div className="note">If <Mono>:focus-visible</Mono> is the only trigger, mouse users open the panel and see nothing focused — the trigger appears resting.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — outline with offset (gap shows through)</div>
          <div className="body" style={{padding: 14, justifyContent:'center'}}>
            <Trigger state="focus" label="Next.js"/>
          </div>
          <div className="note">The 2px gap is transparent. The ring works on every surface — canvas, card, ember solid — without per-surface tweaks.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — flush ring with no gap</div>
          <div className="body" style={{padding: 14, justifyContent:'center'}}>
            <div className="cb-trigger" style={{width: 220, cursor:'default', borderColor:'var(--ember)', boxShadow:'0 0 0 3px var(--ember-soft)'}} tabIndex={-1}>
              <span className="label">Next.js</span>
              <Icons.chevronDown size={14} className="chev"/>
            </div>
          </div>
          <div className="note">A ring that touches the element's edge reads as a fat border. The gap is what makes it legible as a focus indicator.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — outer container owns the ring</div>
          <div className="body" style={{padding: 14}}>
            <div className="in-group md" style={{width:'100%', outline:'var(--ring-width) solid var(--ring)', outlineOffset:'var(--ring-offset)'}}>
              <input className="in-control" defaultValue="search…" readOnly/>
            </div>
          </div>
          <div className="note">One ring, painted by the wrapper via <Mono>:focus-within</Mono>. The inner input is silent.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — ring inside an editable area</div>
          <div className="body" style={{padding: 14}}>
            <div className="in-group md" style={{width:'100%', outline:'var(--ring-width) solid var(--ring)', outlineOffset:'var(--ring-offset)'}}>
              <input className="in-control" defaultValue="search…" readOnly style={{boxShadow:'inset 0 0 0 2px var(--ring)', borderRadius: 4}}/>
            </div>
          </div>
          <div className="note">Two rings stacked read as a styling bug. Pick the outer one and silence the inner native focus.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — use tokens, not hardcoded alpha</div>
          <div className="body" style={{padding: 14}}>
            <pre className="t-mono" style={{fontSize:'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
{`outline: var(--ring-width)
   solid var(--ring);
outline-offset:
   var(--ring-offset);`}
            </pre>
          </div>
          <div className="note">One source of truth — theme overrides, alpha tuning, density variants all flow through the token.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — sprinkle <Mono>rgba()</Mono> per component</div>
          <div className="body" style={{padding: 14}}>
            <pre className="t-mono" style={{fontSize:'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
{`box-shadow:
  0 0 0 3px rgba(255,107,53,0.22);`}
            </pre>
          </div>
          <div className="note">Every drift opens a path for theme inconsistency — light mode hits a too-saturated tint, dark mode loses contrast.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — suppress the native outline first</div>
          <div className="body" style={{padding: 14}}>
            <pre className="t-mono" style={{fontSize:'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
{`.my-trigger { outline: none; }
.my-trigger:focus-visible {
  outline:
    var(--ring-width) solid var(--ring);
  outline-offset: var(--ring-offset);
}`}
            </pre>
          </div>
          <div className="note">Always REPLACE the native ring with our own — but always replace, never strip without restoring.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — strip outline without painting ours</div>
          <div className="body" style={{padding: 14}}>
            <pre className="t-mono" style={{fontSize:'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
{`.my-trigger { outline: none; }
/* …nothing else. Focus is invisible. */`}
            </pre>
          </div>
          <div className="note">A trigger with no focus indicator is unusable by keyboard. WCAG 2.4.7 fails. Don't ship.</div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────
          COMPONENT SCORECARD
          ──────────────────────────────────────────────────────────────── */}
      <SubHead meta="audit">Component scorecard</SubHead>
      <Lede>
        Every interactive component in Forge ships with the canonical outline-offset ring. Reach for these patterns when authoring a new one.
      </Lede>
      <table className="spec">
        <thead><tr><th>Component</th><th>Ring carrier</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td className="tok-name">Button</td><td><Mono>:focus-visible</Mono></td><td>All variants share the same ring — ember, outline, ghost, link, destructive.</td></tr>
          <tr><td className="tok-name">Input / Number / Textarea</td><td><Mono>.in-group:focus-within</Mono></td><td>Outer group owns the ring; inner <Mono>&lt;input&gt;</Mono> is silent.</td></tr>
          <tr><td className="tok-name">Combobox</td><td><Mono>:focus-visible · .is-open</Mono></td><td>Pointer-open AND keyboard focus both fire the outline on the trigger.</td></tr>
          <tr><td className="tok-name">Date Picker</td><td><Mono>:focus-visible · .is-open</Mono></td><td>Same dual-trigger pattern as Combobox.</td></tr>
          <tr><td className="tok-name">Color Input</td><td><Mono>:focus-visible</Mono></td><td>Trigger owns the ring; the popover inside doesn't repaint it.</td></tr>
          <tr><td className="tok-name">File Input drop zone</td><td><Mono>:focus-within</Mono></td><td>Hidden native input projects the ring onto the dashed dropzone parent.</td></tr>
          <tr><td className="tok-name">Command palette</td><td><Mono>:focus-within</Mono></td><td>Outer dialog shell owns the ring; the search input inside is silent.</td></tr>
          <tr><td className="tok-name">Checkbox / Radio / Switch</td><td><Mono>.fc-input:focus-visible + &lt;visual&gt;</Mono></td><td>Visual box sibling renders the outline on behalf of the visually-hidden input.</td></tr>
          <tr><td className="tok-name">Slider</td><td><Mono>.sl-thumb:focus-visible</Mono></td><td>Thumb-only — the track itself never receives focus.</td></tr>
        </tbody>
      </table>

      {/* ────────────────────────────────────────────────────────────────
          A11Y
          ──────────────────────────────────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginBlockStart: 12, marginBlockEnd: 18}}>
        <div className="surface" style={{padding: 18}}>
          <div className="t-small" style={{fontWeight: 600, marginBlockEnd: 10}}>Keyboard</div>
          <dl style={{margin: 0, display:'grid', gridTemplateColumns:'auto 1fr', columnGap: 14, rowGap: 8, alignItems:'baseline'}}>
            <dt><kbd className="kbd">Tab</kbd></dt>
            <dd className="t-small" style={{margin: 0, color:'var(--fg-muted)'}}>Move focus to the next interactive element; the ring appears via <Mono>:focus-visible</Mono> only when the keyboard advanced focus.</dd>
            <dt><kbd className="kbd">Shift</kbd> <kbd className="kbd">Tab</kbd></dt>
            <dd className="t-small" style={{margin: 0, color:'var(--fg-muted)'}}>Move focus to the previous element; the same outline-offset ring follows it.</dd>
            <dt><kbd className="kbd">Enter</kbd> <kbd className="kbd">Space</kbd></dt>
            <dd className="t-small" style={{margin: 0, color:'var(--fg-muted)'}}>Activate or open the focused trigger; on open, <Mono>.is-open</Mono> keeps the ring painted so pointer users see the active target too.</dd>
            <dt><kbd className="kbd">Esc</kbd></dt>
            <dd className="t-small" style={{margin: 0, color:'var(--fg-muted)'}}>Close an opened trigger; focus returns to it and the ring stays until focus moves on. Disabled elements never receive focus, so they never show a ring.</dd>
          </dl>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-small" style={{fontWeight: 600, marginBlockEnd: 6}}>ARIA &amp; screen reader</div>
          <div className="t-small" style={{color:'var(--fg-muted)'}}>
            The ring is a purely visual affordance — it carries no ARIA. State is announced by the element it decorates: a trigger exposes <Mono>aria-expanded</Mono> (the <Mono>.is-open</Mono> ring mirrors <Mono>aria-expanded="true"</Mono>), an invalid field carries <Mono>aria-invalid="true"</Mono> alongside the <Mono>--ring-danger</Mono> hue, and a disabled control sets <Mono>disabled</Mono> / <Mono>aria-disabled</Mono> so it is removed from the focus order. Never substitute the ring for a label or an ARIA state.
          </div>
        </div>
      </div>
      <ul style={{margin: 0, padding: 0, listStyle:'none', display:'flex', flexDirection:'column', gap: 10, maxWidth: '72ch'}}>
        <li style={{display:'flex', gap: 10, color:'var(--fg-muted)', lineHeight: 1.6}}>
          <Icons.check size={14} style={{color:'var(--success)', flex:'0 0 auto', marginTop: 4}}/>
          <span><b style={{color:'var(--fg)'}}>WCAG 2.4.7 (Focus Visible).</b> Every keyboard-reachable element shows a focus indicator. Forge does this with the canonical outline on every component.</span>
        </li>
        <li style={{display:'flex', gap: 10, color:'var(--fg-muted)', lineHeight: 1.6}}>
          <Icons.check size={14} style={{color:'var(--success)', flex:'0 0 auto', marginTop: 4}}/>
          <span><b style={{color:'var(--fg)'}}>WCAG 2.4.11 (Focus Appearance, AAA).</b> 2px solid outline at ≥3:1 contrast against the adjacent background. Solid ember meets this in both themes — the offset gap guarantees contrast independent of the element's own fill.</span>
        </li>
        <li style={{display:'flex', gap: 10, color:'var(--fg-muted)', lineHeight: 1.6}}>
          <Icons.check size={14} style={{color:'var(--success)', flex:'0 0 auto', marginTop: 4}}/>
          <span><b style={{color:'var(--fg)'}}>Reduced motion respected.</b> The outline transition collapses to 0.01ms under <Mono>prefers-reduced-motion: reduce</Mono> — the state still changes, the animation drops.</span>
        </li>
        <li style={{display:'flex', gap: 10, color:'var(--fg-muted)', lineHeight: 1.6}}>
          <Icons.check size={14} style={{color:'var(--success)', flex:'0 0 auto', marginTop: 4}}/>
          <span><b style={{color:'var(--fg)'}}>Pointer ≠ keyboard.</b> We fire the ring on BOTH so input-mode is never a silent variable in the affordance.</span>
        </li>
      </ul>
    </Section>
  );
}
