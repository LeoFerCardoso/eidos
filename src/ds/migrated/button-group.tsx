'use client';
// Forge DS — Components / Button Group
// Visually joined buttons — segmented toolbar feel.
// Real component imported from @forge/ui (packages/ui/src/button-group.tsx).
import { ButtonGroup, Icons, Frame, Section, SubHead, TabbedCode, installTabs, Lede, Mono, AutoPropsTable } from '@/ds/core';

const USAGE_CODE = `import { ButtonGroup } from "@/components/forge/button-group"

export function Demo() {
  return (
    <ButtonGroup aria-label="Time range">
      <button className="btn outline">Day</button>
      <button className="btn outline" aria-pressed="true">Week</button>
      <button className="btn outline">Month</button>
    </ButtonGroup>
  )
}`;

export default function ButtonGroupPage() {
  return (
    <Section
      id="button-group"
      title="Button Group"
      desc="A row of buttons that share a border and read as one unit. Use it for clusters of related actions or compact toolbar slots — never for selection (that is Toggle Group)."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('button-group')} ariaLabel="package manager"/>
      <Lede>
        The CLI copies <Mono>button-group.tsx</Mono> and its CSS into your repo so you own the source. Pick the <em>Manual</em> tab to paste the files by hand.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" row code={USAGE_CODE}>
        <ButtonGroup aria-label="Time range">
          <button className="btn outline">Day</button>
          <button className="btn outline" aria-pressed="true">Week</button>
          <button className="btn outline">Month</button>
        </ButtonGroup>
      </Frame>
      <Lede up>
        Wrap any set of <Mono>.btn</Mono> elements in <Mono>ButtonGroup</Mono>. Inner borders collapse to a single hairline; outer corners take the shared radius. The <Mono>aria-label</Mono> on the wrapper tells assistive tech what the cluster controls.
      </Lede>

      {/* EXAMPLES divider — canonical labeled-rule helper (mono label + hairline) */}
      <div className="ds-examples-rule" style={{marginBlock: '36px 6px'}}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{flex: 1}}/>
      </div>

      {/* 3a. VARIANTS — Default */}
      <SubHead meta="all outline · shared border">Variants</SubHead>
      <Frame
        label="time range — 4 segments"
        row
        code={`<ButtonGroup aria-label="Time range">
  <button className="btn outline">Day</button>
  <button className="btn outline" aria-pressed="true">Week</button>
  <button className="btn outline">Month</button>
  <button className="btn outline">Year</button>
</ButtonGroup>`}>
        <ButtonGroup aria-label="Time range">
          <button className="btn outline">Day</button>
          <button className="btn outline" aria-pressed="true">Week</button>
          <button className="btn outline">Month</button>
          <button className="btn outline">Year</button>
        </ButtonGroup>
      </Frame>
      <Lede>
        Outline + shared border is the canonical look. Inner edges collapse into a single hairline so the row reads as one composite control.
      </Lede>

      {/* 3b. Icon-only */}
      <SubHead meta="square footprint">Icon-only</SubHead>
      <Frame label="alignment — always add aria-label" row code={`<ButtonGroup aria-label="Alignment">
  <button className="btn icon outline" aria-label="Align left">
    <AlignLeft size={14}/>
  </button>
  <button className="btn icon outline" aria-label="Align center" aria-pressed="true">
    <AlignCenter size={14}/>
  </button>
  <button className="btn icon outline" aria-label="Align right">
    <AlignRight size={14}/>
  </button>
</ButtonGroup>`}>
        <ButtonGroup aria-label="Alignment">
          <button className="btn icon outline" aria-label="Align left"><Icons.alignLeft size={14}/></button>
          <button className="btn icon outline" aria-label="Align center" aria-pressed="true"><Icons.alignCenter size={14}/></button>
          <button className="btn icon outline" aria-label="Align right"><Icons.alignRight size={14}/></button>
        </ButtonGroup>
      </Frame>

      {/* 3c. Split action */}
      <SubHead meta="primary + split">Split action</SubHead>
      <Frame label="primary CTA + overflow chevron" row code={`<ButtonGroup aria-label="Deploy options">
  <button className="btn ember">
    <Rocket size={14}/> Deploy
  </button>
  <button className="btn ember icon" aria-label="More deploy options">
    <ChevronDown size={14}/>
  </button>
</ButtonGroup>`}>
        <ButtonGroup aria-label="Deploy options">
          <button className="btn ember"><Icons.rocket size={14}/> Deploy</button>
          <button className="btn ember icon" aria-label="More deploy options"><Icons.chevronDown size={14}/></button>
        </ButtonGroup>
      </Frame>
      <Lede>
        A split action is a well-known idiom: the main button triggers the primary action; the icon-only chevron opens an overflow menu. Both share the same variant fill, reading as a single control. The chevron <strong>requires</strong> an <Mono>aria-label</Mono> so it does not announce as unnamed.
      </Lede>

      {/* 3d. SIZES */}
      <SubHead meta="3 sizes">Sizes</SubHead>
      <Frame label="sm · md · lg" row code={`<ButtonGroup size="sm" aria-label="…">…</ButtonGroup>
<ButtonGroup aria-label="…">…</ButtonGroup>
<ButtonGroup size="lg" aria-label="…">…</ButtonGroup>`}>
        <ButtonGroup size="sm" aria-label="Small group">
          <button className="btn outline sm">Left</button>
          <button className="btn outline sm">Mid</button>
          <button className="btn outline sm">Right</button>
        </ButtonGroup>
        <ButtonGroup aria-label="Medium group">
          <button className="btn outline">Left</button>
          <button className="btn outline">Mid</button>
          <button className="btn outline">Right</button>
        </ButtonGroup>
        <ButtonGroup size="lg" aria-label="Large group">
          <button className="btn outline lg">Left</button>
          <button className="btn outline lg">Mid</button>
          <button className="btn outline lg">Right</button>
        </ButtonGroup>
      </Frame>

      {/* 3e. VERTICAL */}
      <SubHead meta="stacked">Vertical</SubHead>
      <Frame label='orientation="vertical"' row code={`<ButtonGroup orientation="vertical" aria-label="View mode">
  <button className="btn outline">List</button>
  <button className="btn outline" aria-pressed="true">Grid</button>
  <button className="btn outline">Board</button>
</ButtonGroup>`}>
        <ButtonGroup orientation="vertical" aria-label="View mode">
          <button className="btn outline">List</button>
          <button className="btn outline" aria-pressed="true">Grid</button>
          <button className="btn outline">Board</button>
        </ButtonGroup>
      </Frame>
      <Lede>
        Vertical groups collapse the <em>block-axis</em> borders (top/bottom) instead of the inline ones, applying radius to the start and end corners of the column.
      </Lede>

      {/* 4. IN CONTEXT */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame label="editor toolbar — mixed groups + separators">
        <div className="toolbar" role="toolbar" aria-label="Editor toolbar">
          <ButtonGroup aria-label="Text style">
            <button className="btn icon ghost sm" aria-label="Bold" aria-pressed="true" style={{fontWeight:700}}>B</button>
            <button className="btn icon ghost sm" aria-label="Italic" style={{fontStyle:'italic'}}>I</button>
            <button className="btn icon ghost sm" aria-label="Underline" style={{textDecoration:'underline'}}>U</button>
          </ButtonGroup>
          <span className="toolbar-sep" role="separator" aria-orientation="vertical"/>
          <ButtonGroup aria-label="Alignment">
            <button className="btn icon ghost sm" aria-label="Align left" aria-pressed="true"><Icons.alignLeft size={12}/></button>
            <button className="btn icon ghost sm" aria-label="Align center"><Icons.alignCenter size={12}/></button>
            <button className="btn icon ghost sm" aria-label="Align right"><Icons.alignRight size={12}/></button>
          </ButtonGroup>
          <span className="toolbar-sep" role="separator" aria-orientation="vertical"/>
          <ButtonGroup aria-label="Deploy">
            <button className="btn ember sm"><Icons.rocket size={12}/> Deploy</button>
            <button className="btn ember sm icon" aria-label="More deploy options"><Icons.chevronDown size={12}/></button>
          </ButtonGroup>
        </div>
      </Frame>

      {/* 5. ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', lineHeight: 1.55}}>Each segment is an independent button: Tab steps into and through every cell, Enter or Space activates the focused one. ButtonGroup is a cluster of actions — there is no arrow-key roving (use ToggleGroup for that).</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', lineHeight: 1.55}}>The wrapper carries <Mono>role="group"</Mono> and requires an <Mono>aria-label</Mono> so the cluster is announced as a named group. Icon-only segments require their own <Mono>aria-label</Mono>. A pressed segment carries <Mono>aria-pressed="true"</Mono> so state is non-colour.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', lineHeight: 1.55}}>The focused cell shows the ember ring (<Mono>--ring</Mono>) and is raised above its neighbours (<Mono>z-index:1</Mono>) so the collapsed inner seam never clips it. An ember split action uses dark ink on ember, clearing AA. State is always doubled by <Mono>aria-pressed</Mono>.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', lineHeight: 1.55}}>Segments inherit the button hover lift and active scale via <Mono>--ease</Mono>. Under <Mono>prefers-reduced-motion</Mono> the component-scoped <Mono>.btn</Mono> guard in <Mono>tokens.css</Mono> reduces those transitions to instant so press feedback is immediate with no animation.</div>
        </div>
      </div>

      {/* 6. RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="border-inline + radius logical props mirror automatically" row>
        <div dir="rtl" style={{display:'flex', flexDirection:'column', gap: 12, alignItems:'flex-start'}}>
          <ButtonGroup aria-label="نطاق زمني">
            <button className="btn outline">يوم</button>
            <button className="btn outline" aria-pressed="true">أسبوع</button>
            <button className="btn outline">شهر</button>
          </ButtonGroup>
          <ButtonGroup aria-label="خيارات النشر">
            <button className="btn ember"><Icons.rocket size={14}/> نشر</button>
            <button className="btn ember icon" aria-label="المزيد من خيارات النشر"><Icons.chevronDown size={14}/></button>
          </ButtonGroup>
        </div>
      </Frame>
      <Lede>
        <Mono>border-inline-start: 0</Mono> on inner cells and <Mono>border-start-start-radius</Mono> / <Mono>border-start-end-radius</Mono> on the outer corners are logical CSS properties — they flip automatically in an RTL context. No JS or directional overrides required. The chevron glyph is non-directional (it opens a menu, not a navigation), so it does not mirror.
      </Lede>

      {/* 7. ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative'}} aria-hidden="true">
              <ButtonGroup tabIndex={-1} style={{cursor:'default'}} aria-label="anatomy demo">
                <button className="btn outline" tabIndex={-1} style={{cursor:'default'}}>First</button>
                <button className="btn outline" aria-pressed="true" tabIndex={-1} style={{cursor:'default'}}>Active</button>
                <button className="btn outline" tabIndex={-1} style={{cursor:'default'}}>Last</button>
              </ButtonGroup>
              {/* Leads */}
              <span className="lead v" style={{top: -22, left: 24, height: 18}}/>
              <span className="lead v" style={{top: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
              <span className="lead v" style={{top: -22, right: 24, height: 18}}/>
              <span className="lead h" style={{top: 16, right: -28, width: 24}}/>
              <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
              {/* Pins */}
              <div className="pin" style={{top: -42, left: 24, transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: -42, left: '50%', transform:'translateX(-50%)'}}>2</div>
              <div className="pin" style={{top: -42, right: 24, transform:'translateX(50%)'}}>3</div>
              <div className="pin" style={{top: 8, right: -52}}>4</div>
              <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>First button.</b> Radius on the outside corner only (<Mono>border-start-start-radius</Mono> + <Mono>border-end-start-radius</Mono>). Inner corner is squared so the seam reads as one row.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Active middle.</b> <Mono>aria-pressed="true"</Mono> pairs with a visible fill. No radius — fully boxed.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Last button.</b> Mirror of first — radius on the outside corner only (<Mono>border-start-end-radius</Mono> + <Mono>border-end-end-radius</Mono>).</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Inner seam.</b> Adjacent borders collapse to a single hairline via <Mono>margin-inline-start: -1px</Mono> on every cell after the first, combined with a raised <Mono>z-index:1</Mono> on hover/focus.</span>
            <span className="num">5</span><span><b style={{color:'var(--fg)'}}>Container.</b> <Mono>ButtonGroup</Mono> renders a <Mono>role="group"</Mono> <Mono>div</Mono> that owns the unified layout — <Mono>display:inline-flex</Mono> for horizontal, <Mono>flex-direction:column</Mono> for vertical.</span>
          </div>
        </div>
      </div>

      {/* Decision matrix */}
      <SubHead meta="when to use">Button Group vs Toggle Group</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Pick the right primitive</span></div>
        <table className="spec" style={{margin: 0}}>
          <thead><tr><th style={{padding:'10px 12px'}}>Intent</th><th>Use</th><th>Why</th></tr></thead>
          <tbody>
            <tr><td>Run a set of related actions</td><td className="tok-name">ButtonGroup</td><td>Each segment triggers something; nothing is "selected"</td></tr>
            <tr><td>Pick one option from a set</td><td className="tok-name">ToggleGroup (single)</td><td>Selection state is semantic — radio-like</td></tr>
            <tr><td>Toggle independent flags (bold · italic)</td><td className="tok-name">ToggleGroup (multiple)</td><td>Independent on/off states per cell</td></tr>
            <tr><td>Primary action + overflow menu</td><td className="tok-name">ButtonGroup (split)</td><td>Main button + chevron is a well-known split-button idiom</td></tr>
          </tbody>
        </table>
      </div>

      {/* 8. DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — keep cells the same width when labels are similar</div>
          <div className="body">
            <ButtonGroup aria-label="Time range">
              <button className="btn outline" style={{minWidth: 64}}>Day</button>
              <button className="btn outline" aria-pressed="true" style={{minWidth: 64}}>Week</button>
              <button className="btn outline" style={{minWidth: 64}}>Month</button>
            </ButtonGroup>
          </div>
          <div className="note">Equal cells make the active state obvious. The eye locks on the highlight, not width variation.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — mix competing variants in one group</div>
          <div className="body">
            <ButtonGroup aria-label="Bad example">
              <button className="btn ember">Save</button>
              <button className="btn ghost">Cancel</button>
              <button className="btn destructive">Delete</button>
            </ButtonGroup>
          </div>
          <div className="note">Three hierarchies in one row. Separate destructive actions and never share a border with them.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — add aria-label to every icon-only segment</div>
          <div className="body">
            <ButtonGroup aria-label="Alignment">
              <button className="btn icon outline" aria-label="Align left"><Icons.alignLeft size={14}/></button>
              <button className="btn icon outline" aria-label="Align center"><Icons.alignCenter size={14}/></button>
              <button className="btn icon outline" aria-label="Align right"><Icons.alignRight size={14}/></button>
            </ButtonGroup>
          </div>
          <div className="note">Icon-only cells are visually clear but meaningless to a screen reader without a label.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use ButtonGroup for single selection</div>
          <div className="body">
            <ButtonGroup aria-label="Mode selector">
              <button className="btn outline" aria-pressed="true">Edit</button>
              <button className="btn outline">Preview</button>
              <button className="btn outline">Split</button>
            </ButtonGroup>
          </div>
          <div className="note">The highlight implies one option is chosen, but <Mono>aria-pressed</Mono> is a per-button toggle, not radio selection. Use ToggleGroup with <Mono>role="radiogroup"</Mono> so screen readers announce that only one option is active.</div>
        </div>
      </div>

      {/* 9. API REFERENCE */}
      <SubHead meta="ButtonGroupProps">API reference</SubHead>
      <AutoPropsTable component="ButtonGroup" label="<ButtonGroup />"/>
    </Section>
  );
}
