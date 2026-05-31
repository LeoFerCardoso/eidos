'use client';
// Eidos DS — Components / Toolbar
// Page layout:
//   1. Installation     (ComponentInstall)
//   2. Usage            (Frame: import + minimal render)
//   3. Variants         (ToggleButtons · Groups · Disabled)
//   4. In context       (workspace toolbar)
//   5. Accessibility    (keyboard / screen-reader / contrast / motion)
//   6. RTL              (dir="rtl" Frame + Lede)
//   7. Anatomy          (labelled diagram)
//   8. Do / Don't       (dd-grid)
//   9. API reference    (AutoPropsTable)
import * as React from 'react';
import {
  Icons, Frame, Section, SubHead, Lede, Mono,
  ComponentInstall, AutoPropsTable,
  Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator,
} from '@/ds/core';

// ==========================================================================
// Usage code snippet
// ==========================================================================
const USAGE_CODE = `import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/forge/toolbar"

export function Demo() {
  return (
    <Toolbar aria-label="Text formatting">
      <ToolbarButton aria-label="Bold">
        <Bold size={14} />
      </ToolbarButton>
      <ToolbarButton aria-label="Italic">
        <Italic size={14} />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Insert link">
        <Link size={14} />
      </ToolbarButton>
    </Toolbar>
  )
}`;

// ==========================================================================
// PAGE
// ==========================================================================
export default function ToolbarPage() {
  // Toggle states for interactive demos
  const [bold, setBold] = React.useState(false);
  const [italic, setItalic] = React.useState(false);
  const [underline, setUnderline] = React.useState(false);
  const [alignVal, setAlignVal] = React.useState<'left' | 'center' | 'right'>('left');

  // RTL demo states
  const [rtlBold, setRtlBold] = React.useState(false);
  const [rtlItalic, setRtlItalic] = React.useState(false);

  return (
    <Section
      id="toolbar"
      num="27"
      title="Toolbar"
      desc="A single-tab-stop cluster of icon buttons, toggle buttons, and separators. Roving tabindex keeps focus efficient — Arrow keys navigate, Tab leaves."
    >
      {/* ====================================================================
          1. INSTALLATION
          ==================================================================== */}
      <ComponentInstall slug="toolbar" />
      <Lede>
        Ships <Mono>Toolbar</Mono> plus three sub-parts — <Mono>ToolbarButton</Mono>, <Mono>ToolbarGroup</Mono>, and <Mono>ToolbarSeparator</Mono>. Built on the existing <Mono>.btn.icon</Mono> and <Mono>.btn-group</Mono> atoms; the component adds the roving-tabindex keyboard model on top.
      </Lede>

      {/* ====================================================================
          2. USAGE
          ==================================================================== */}
      <SubHead meta="import + render">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <Toolbar aria-label="Text formatting">
          <ToolbarButton aria-label="Bold"><Icons.bold size={14}/></ToolbarButton>
          <ToolbarButton aria-label="Italic"><Icons.italic size={14}/></ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton aria-label="Insert link"><Icons.link size={14}/></ToolbarButton>
        </Toolbar>
      </Frame>

      {/* ====================================================================
          3. VARIANTS
          ==================================================================== */}
      {/* Examples divider eyebrow — canonical composed rule (no bespoke inline chrome) */}
      <div className="ds-examples-rule" style={{ marginBlockStart: 36, marginBlockEnd: 6 }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }} />
      </div>

      {/* ---- Toggle buttons ---- */}
      <SubHead meta="aria-pressed state">Toggle buttons</SubHead>
      <Lede up>
        Pass <Mono>pressed</Mono> + <Mono>onPressedChange</Mono> to <Mono>ToolbarButton</Mono> to make it a stateful toggle. The component sets <Mono>aria-pressed</Mono> automatically — state is communicated to assistive tech without extra markup.
      </Lede>
      <Frame
        label="bold · italic · underline toggles"
        row
        code={`const [bold, setBold] = useState(false)
const [italic, setItalic] = useState(false)

<Toolbar aria-label="Text style">
  <ToolbarButton pressed={bold} onPressedChange={setBold} aria-label="Bold">
    <Bold size={14} />
  </ToolbarButton>
  <ToolbarButton pressed={italic} onPressedChange={setItalic} aria-label="Italic">
    <Italic size={14} />
  </ToolbarButton>
</Toolbar>`}>
        <Toolbar aria-label="Text style">
          <ToolbarButton pressed={bold} onPressedChange={setBold} aria-label="Bold"><Icons.bold size={14}/></ToolbarButton>
          <ToolbarButton pressed={italic} onPressedChange={setItalic} aria-label="Italic"><Icons.italic size={14}/></ToolbarButton>
          <ToolbarButton pressed={underline} onPressedChange={setUnderline} aria-label="Underline"><Icons.underline size={14}/></ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton aria-label="Strikethrough"><Icons.strike size={14}/></ToolbarButton>
        </Toolbar>
      </Frame>

      {/* ---- Groups ---- */}
      <SubHead meta="visual clusters">Groups</SubHead>
      <Lede up>
        Wrap related buttons in <Mono>ToolbarGroup</Mono> to fuse their borders into a single visual unit — identical to the standalone <Mono>ButtonGroup</Mono>, but scoped to toolbar context. Groups do not affect the roving-tabindex order.
      </Lede>
      <Frame
        label="formatting group · alignment group"
        row
        code={`<Toolbar aria-label="Text formatting">
  <ToolbarGroup>
    <ToolbarButton aria-label="Bold"><Bold size={14}/></ToolbarButton>
    <ToolbarButton aria-label="Italic"><Italic size={14}/></ToolbarButton>
    <ToolbarButton aria-label="Underline"><Underline size={14}/></ToolbarButton>
  </ToolbarGroup>
  <ToolbarSeparator />
  <ToolbarGroup>
    <ToolbarButton aria-label="Align left"><AlignLeft size={14}/></ToolbarButton>
    <ToolbarButton aria-label="Align center"><AlignCenter size={14}/></ToolbarButton>
    <ToolbarButton aria-label="Align right"><AlignRight size={14}/></ToolbarButton>
  </ToolbarGroup>
</Toolbar>`}>
        <Toolbar aria-label="Text formatting">
          <ToolbarGroup>
            <ToolbarButton pressed={bold} onPressedChange={setBold} aria-label="Bold"><Icons.bold size={14}/></ToolbarButton>
            <ToolbarButton pressed={italic} onPressedChange={setItalic} aria-label="Italic"><Icons.italic size={14}/></ToolbarButton>
            <ToolbarButton pressed={underline} onPressedChange={setUnderline} aria-label="Underline"><Icons.underline size={14}/></ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <ToolbarButton pressed={alignVal === 'left'} onPressedChange={() => setAlignVal('left')} aria-label="Align left"><Icons.alignLeft size={14}/></ToolbarButton>
            <ToolbarButton pressed={alignVal === 'center'} onPressedChange={() => setAlignVal('center')} aria-label="Align center"><Icons.alignCenter size={14}/></ToolbarButton>
            <ToolbarButton pressed={alignVal === 'right'} onPressedChange={() => setAlignVal('right')} aria-label="Align right"><Icons.alignRight size={14}/></ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarButton aria-label="Insert link"><Icons.link size={14}/></ToolbarButton>
          <ToolbarButton aria-label="More"><Icons.more size={14}/></ToolbarButton>
        </Toolbar>
      </Frame>

      {/* ---- Disabled ---- */}
      <SubHead meta="disabled controls">States</SubHead>
      <Lede up>
        Disabled <Mono>ToolbarButton</Mono>s are skipped by roving-focus navigation automatically — the keyboard model never lands on a control the user cannot activate.
      </Lede>
      <Frame
        label="disabled controls are skipped by arrow keys"
        row
        code={`<Toolbar aria-label="Editor actions">
  <ToolbarButton aria-label="Bold"><Bold size={14}/></ToolbarButton>
  <ToolbarButton aria-label="Italic" disabled><Italic size={14}/></ToolbarButton>
  <ToolbarButton aria-label="Underline"><Underline size={14}/></ToolbarButton>
</Toolbar>`}>
        <Toolbar aria-label="Editor actions">
          <ToolbarButton aria-label="Bold"><Icons.bold size={14}/></ToolbarButton>
          <ToolbarButton aria-label="Italic" disabled><Icons.italic size={14}/></ToolbarButton>
          <ToolbarButton aria-label="Underline"><Icons.underline size={14}/></ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton aria-label="Insert link" disabled><Icons.link size={14}/></ToolbarButton>
          <ToolbarButton aria-label="Insert image"><Icons.image size={14}/></ToolbarButton>
        </Toolbar>
      </Frame>

      {/* ====================================================================
          4. IN CONTEXT
          ==================================================================== */}
      <SubHead meta="real surface">In context</SubHead>
      <Lede up>
        A workspace toolbar splits secondary controls to the leading edge and the single primary CTA to the trailing edge. The full row width comes from <Mono>display: flex; justify-content: space-between</Mono> on the <Mono>Toolbar</Mono>.
      </Lede>
      <Frame
        label="table view — filter / sort left · new record right"
        code={`<Toolbar aria-label="Table controls" style={{ display:'flex', justifyContent:'space-between', width:'100%' }}>
  <div style={{ display:'flex', alignItems:'center', gap: 4 }}>
    <ToolbarGroup>
      <ToolbarButton aria-label="Undo"><Undo size={14}/></ToolbarButton>
      <ToolbarButton aria-label="Redo"><Redo size={14}/></ToolbarButton>
    </ToolbarGroup>
    <ToolbarSeparator />
    <Button variant="outline" size="sm"><Filter size={12}/> Filter</Button>
    <Button variant="outline" size="sm"><Sort size={12}/> Sort</Button>
  </div>
  <Button variant="ember" size="sm"><Plus size={12}/> New record</Button>
</Toolbar>`}>
        <Toolbar aria-label="Table controls" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ToolbarGroup>
              <ToolbarButton aria-label="Undo"><Icons.undo size={14}/></ToolbarButton>
              <ToolbarButton aria-label="Redo"><Icons.redo size={14}/></ToolbarButton>
            </ToolbarGroup>
            <ToolbarSeparator />
            <button className="btn outline sm"><Icons.filter size={12}/> Filter <span className="pill ember" style={{ marginInlineStart: 4, padding: '0 6px', height: 16 }}>3</span></button>
            <button className="btn outline sm"><Icons.sort size={12}/> Sort</button>
            <button className="btn outline sm"><Icons.grid size={12}/> Group</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn ghost sm"><Icons.share size={12}/> Share</button>
            <button className="btn ember sm"><Icons.plus size={12}/> New record</button>
          </div>
        </Toolbar>
      </Frame>

      {/* ---- Decision matrix ---- */}
      <SubHead meta="when to use">Toolbar vs Menubar vs Button Group</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">pick the right pattern</span></div>
        <table className="spec">
          <thead>
            <tr>
              <th>Situation</th>
              <th>Pattern</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Frequent, contextual actions for the current selection or view</td><td className="tok-name">Toolbar</td></tr>
            <tr><td>Hierarchical, app-wide commands (File · Edit · View)</td><td className="tok-name">Menubar</td></tr>
            <tr><td>2–5 actions that conceptually belong together, outside a toolbar</td><td className="tok-name">Button Group</td></tr>
            <tr><td>Mutually-exclusive option (Left · Center · Right)</td><td className="tok-name">ToolbarGroup + toggle</td></tr>
          </tbody>
        </table>
      </div>

      {/* ====================================================================
          5. ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>
            The toolbar is one Tab stop with roving <Mono>tabindex</Mono>: only the active control holds <Mono>tabindex="0"</Mono>; the rest are <Mono>-1</Mono>. <Mono>ArrowLeft</Mono> / <Mono>ArrowRight</Mono> (horizontal) or <Mono>ArrowUp</Mono> / <Mono>ArrowDown</Mono> (vertical) move focus between controls; <Mono>Home</Mono> / <Mono>End</Mono> jump to the first and last. Disabled controls are skipped. <Mono>Tab</Mono> exits the toolbar entirely.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>
            The container carries <Mono>role="toolbar"</Mono> and <Mono>aria-orientation</Mono>. Always provide an <Mono>aria-label</Mono> (e.g. <Mono>"Text formatting"</Mono>) — without it, screen readers announce the region but give no context. Icon-only buttons each require their own <Mono>aria-label</Mono>. Toggle buttons expose <Mono>aria-pressed</Mono>. Separators carry <Mono>role="separator"</Mono> so grouping is announced.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>
            Every focused control shows the ember focus ring (<Mono>--ring</Mono>) at ≥ 3:1 against the toolbar surface. Icon glyphs meet non-text contrast (3:1 AA). Pressed / active state is communicated by a background fill, not colour alone — it holds in both light and dark themes. Hit targets are at least 28 × 28 px (the <Mono>.btn.icon</Mono> footprint).
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>
            Hover and active fills on <Mono>.btn.icon.ghost</Mono> transition with <Mono>var(--ease)</Mono>. Under <Mono>prefers-reduced-motion: reduce</Mono>, the component-scoped guard in <Mono>tokens.css</Mono> (<Mono>.toolbar .btn &#123; transition: none &#125;</Mono>) removes those transitions, so state changes apply instantly.
          </div>
        </div>
      </div>

      {/* ====================================================================
          6. RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — clusters read right-to-left; arrow keys swap'
        row
        code={`<div dir="rtl">
  <Toolbar aria-label="تنسيق النص">
    <ToolbarButton pressed={bold} onPressedChange={setBold} aria-label="عريض">
      <Bold size={14}/>
    </ToolbarButton>
    <ToolbarButton pressed={italic} onPressedChange={setItalic} aria-label="مائل">
      <Italic size={14}/>
    </ToolbarButton>
    <ToolbarSeparator />
    <ToolbarButton aria-label="رابط"><Link size={14}/></ToolbarButton>
    <ToolbarButton aria-label="قائمة"><List size={14}/></ToolbarButton>
  </Toolbar>
</div>`}>
        <div dir="rtl">
          <Toolbar aria-label="تنسيق النص">
            <ToolbarButton pressed={rtlBold} onPressedChange={setRtlBold} aria-label="عريض"><Icons.bold size={14}/></ToolbarButton>
            <ToolbarButton pressed={rtlItalic} onPressedChange={setRtlItalic} aria-label="مائل"><Icons.italic size={14}/></ToolbarButton>
            <ToolbarSeparator />
            <ToolbarButton aria-label="رابط"><Icons.link size={14}/></ToolbarButton>
            <ToolbarButton aria-label="قائمة"><Icons.list size={14}/></ToolbarButton>
          </Toolbar>
        </div>
      </Frame>
      <Lede>
        Under <Mono>dir="rtl"</Mono> the toolbar layout reverses — controls pack from the right. The roving-focus arrow keys adapt automatically: <Mono>ArrowRight</Mono> moves backward (toward the start) and <Mono>ArrowLeft</Mono> moves forward (toward the end), matching the reading direction. Separators and group borders are symmetric and need no mirroring.
      </Lede>

      {/* ====================================================================
          7. ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <Toolbar aria-label="Example" style={{ pointerEvents: 'none' }}>
                <ToolbarButton aria-label="Bold" pressed tabIndex={-1} style={{ cursor: 'default' }}><Icons.bold size={14}/></ToolbarButton>
                <ToolbarGroup>
                  <ToolbarButton aria-label="Italic" tabIndex={-1} style={{ cursor: 'default' }}><Icons.italic size={14}/></ToolbarButton>
                  <ToolbarButton aria-label="Underline" tabIndex={-1} style={{ cursor: 'default' }}><Icons.underline size={14}/></ToolbarButton>
                </ToolbarGroup>
                <ToolbarSeparator />
                <ToolbarButton aria-label="Link" tabIndex={-1} style={{ cursor: 'default' }}><Icons.link size={14}/></ToolbarButton>
                <ToolbarButton aria-label="More" tabIndex={-1} style={{ cursor: 'default' }}><Icons.more size={14}/></ToolbarButton>
              </Toolbar>
              {/* pin connectors */}
              <span className="lead v" style={{ top: -22, left: 14, height: 18 }}/>
              <span className="lead v" style={{ top: -22, left: 70, height: 18 }}/>
              <span className="lead v" style={{ bottom: -22, left: 118, height: 18 }}/>
              <span className="lead v" style={{ top: -22, left: 156, height: 18 }}/>
              <span className="lead v" style={{ bottom: -22, right: 14, height: 18 }}/>
              <div className="pin" style={{ top: -42, left: 14, transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: -42, left: 70, transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ bottom: -42, left: 118, transform: 'translateX(-50%)' }}>3</div>
              <div className="pin" style={{ top: -42, left: 156, transform: 'translateX(-50%)' }}>4</div>
              <div className="pin" style={{ bottom: -42, right: 14, transform: 'translateX(50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Pressed toggle.</b> <Mono>ToolbarButton</Mono> with <Mono>pressed=&#123;true&#125;</Mono> — background fill communicates active state without colour alone.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Grouped cluster.</b> <Mono>ToolbarGroup</Mono> fuses borders into a single visual unit — related controls read as one control set.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Separator.</b> <Mono>ToolbarSeparator</Mono> — 1 × 18 px hairline that marks the boundary between clusters; carries <Mono>role="separator"</Mono>.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Discrete action.</b> A standalone <Mono>ToolbarButton</Mono> (no group) — for one-shot commands like Insert link or Comment.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Overflow control.</b> The rightmost action catches commands that do not fit — usually a <Mono>&#8942;</Mono> popover menu.</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          8. DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — separate clusters with a separator</div>
          <div className="body">
            <Toolbar aria-label="Example">
              <ToolbarButton aria-label="Bold"><Icons.bold size={14}/></ToolbarButton>
              <ToolbarButton aria-label="Italic"><Icons.italic size={14}/></ToolbarButton>
              <ToolbarSeparator />
              <ToolbarButton aria-label="Link"><Icons.link size={14}/></ToolbarButton>
            </Toolbar>
          </div>
          <div className="note">A 1-px hairline between groups tells the eye where one set of actions ends and another begins.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — line up icons with no rhythm</div>
          <div className="body">
            <Toolbar aria-label="Example">
              <ToolbarButton aria-label="B"><Icons.bold size={14}/></ToolbarButton>
              <ToolbarButton aria-label="I"><Icons.italic size={14}/></ToolbarButton>
              <ToolbarButton aria-label="L"><Icons.link size={14}/></ToolbarButton>
              <ToolbarButton aria-label="A"><Icons.alignLeft size={14}/></ToolbarButton>
              <ToolbarButton aria-label="C"><Icons.alignCenter size={14}/></ToolbarButton>
            </Toolbar>
          </div>
          <div className="note">An unbroken row reads as one giant control. Click rate drops because the user has to scan every icon.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — label every icon-only button</div>
          <div className="body">
            <Toolbar aria-label="Example">
              <ToolbarButton aria-label="Insert link"><Icons.link size={14}/></ToolbarButton>
              <ToolbarButton aria-label="Insert image"><Icons.image size={14}/></ToolbarButton>
            </Toolbar>
          </div>
          <div className="note">Every icon-only button must carry an <Mono>aria-label</Mono> — without one, screen readers announce only "button".</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — label the toolbar but skip button labels</div>
          {/* aria-hidden + tabIndex={-1} on every interactive element makes this
              anti-pattern illustration inert so the docs page itself does not emit
              unnamed focusable buttons (TB2). */}
          <div className="body" aria-hidden="true">
            <Toolbar aria-label="Actions" style={{ pointerEvents: 'none' }}>
              <ToolbarButton aria-label="" tabIndex={-1}><Icons.link size={14}/></ToolbarButton>
              <ToolbarButton aria-label="" tabIndex={-1}><Icons.image size={14}/></ToolbarButton>
            </Toolbar>
          </div>
          <div className="note">A toolbar label names the region; it does not substitute for individual button labels.</div>
        </div>
      </div>

      {/* ====================================================================
          9. API REFERENCE
          ==================================================================== */}
      <SubHead meta="ToolbarProps">API reference</SubHead>
      <AutoPropsTable component="Toolbar" />
    </Section>
  );
}
