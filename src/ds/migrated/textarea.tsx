'use client';
// Forge DS — Components / Textarea
// Multi-line text input. Built on .in-field / .in-group so it inherits the
// focus ring, helper text, and invalid state from the rest of the form
// system.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, Mono } from '@/ds/core';



  const USAGE_CODE = `import { Textarea } from "@/components/forge/textarea"
import { Label } from "@/components/forge/label"

export function Demo() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="bio">About</Label>
      <Textarea id="bio" placeholder="Tell us about yourself…" rows={4}/>
    </div>
  )
}`;

export default function Textarea() {
    const [val, setVal] = React.useState("This is a multi-line message. Try resizing — autosize keeps the textarea snug to its content.");
    const [count, setCount] = React.useState(val.length);
    const max = 280;
    return (
      <Section
        id="textarea"
        title="Textarea"
        desc="Multi-line text entry. Inherits .in-field's label / helper / invalid pattern so a textarea reads identically to an input — only the cell grows."
      >
        {/* 1. INSTALLATION */}
        <SubHead meta="package managers">Installation</SubHead>
        <TabbedCode tabs={installTabs('textarea')} ariaLabel="package manager"/>
        <Lede>
          Ships <Mono>textarea.tsx</Mono> + the <Mono>.in-*</Mono> field shell so a textarea reads identically to an Input — same focus ring, helper line, invalid state.
        </Lede>

        {/* 2. USAGE */}
        <SubHead meta="hello world">Usage</SubHead>
        <Frame label="basic" code={USAGE_CODE}>
          <div className="in-field" style={{minWidth: 380}}>
            <label className="in-label" htmlFor="t-usage">About</label>
            <div className="in-group">
              <textarea id="t-usage" className="in-control" rows={4} placeholder="Tell us about yourself…"/>
            </div>
          </div>
        </Frame>

        {/* 3. EXAMPLES */}
        <div style={{
          marginTop: 36, marginBottom: 6,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--fg-faint)',
          }}>Examples</span>
          <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
        </div>

        {/* ── Default ─────────────────────────────────────────────── */}
        <SubHead meta="default">Default</SubHead>
        <Frame
          label="label · helper · 4 rows"
          code={`<Field label="About" htmlFor="bio" help="A short bio for your profile. Plain text.">
  <Textarea id="bio" rows={4} placeholder="Tell us about yourself…"/>
</Field>`}>
          <div className="in-field" style={{minWidth: 380}}>
            <label className="in-label" htmlFor="t-bio">About</label>
            <div className="in-group">
              <textarea id="t-bio" className="in-control" rows={4} placeholder="Tell us about yourself…"/>
            </div>
            <p className="in-helper">A short bio for your profile. Plain text.</p>
          </div>
        </Frame>

        {/* ── With character counter ──────────────────────────────── */}
        <SubHead meta="counter slot">With character counter</SubHead>
        <Frame label="counter lives in .in-helper · polite live region · invalid past max"
          code={`<Field
  label="Message"
  htmlFor="msg"
  help="Plain text. Markdown is not rendered."
  // counter renders an aria-live="polite" span so the running
  // total is announced on pause, not on every keystroke
  counter={\`\${value.length}/280\`}
  error={value.length > 280 ? "Trim it down — you are over the limit." : undefined}
>
  <Textarea
    id="msg"
    rows={4}
    value={value}
    onChange={(e) => setValue(e.target.value)}
    invalid={value.length > 280}
  />
</Field>`}>
          <div className="in-field" style={{minWidth: 380}}>
            <label className="in-label" htmlFor="t-msg">Message</label>
            <div className={'in-group' + (count > max ? ' is-invalid' : '')}>
              <textarea
                id="t-msg"
                className="in-control"
                rows={4}
                value={val}
                aria-invalid={count > max || undefined}
                aria-describedby="t-msg-help t-msg-count"
                onChange={(e) => { setVal(e.target.value); setCount(e.target.value.length); }}
              />
            </div>
            <p className="in-helper" style={{display:'flex', justifyContent:'space-between'}}>
              <span id="t-msg-help">{count > max ? 'Trim it down — you are over the limit.' : 'Plain text. Markdown is not rendered.'}</span>
              <span
                id="t-msg-count"
                className="t-mono"
                aria-live="polite"
                aria-atomic="true"
                style={{color: count > max ? 'var(--danger)' : 'var(--fg-muted)'}}
              >{count}/{max}</span>
            </p>
          </div>
        </Frame>

        {/* ── Sizes ───────────────────────────────────────────────── */}
        <SubHead meta="3 sizes">Sizes</SubHead>
        <Frame label="sm · md · lg"
          code={`<Textarea size="sm" rows={2}/>
<Textarea size="md" rows={3}/>
<Textarea size="lg" rows={4}/>`}>
          <div style={{display:'flex', flexDirection:'column', gap: 12, width: 380}}>
            <div className="in-field"><label className="in-label">Small</label><div className="in-group sm"><textarea className="in-control" rows={2} placeholder="sm — chat reply…"/></div></div>
            <div className="in-field"><label className="in-label">Medium</label><div className="in-group"><textarea className="in-control" rows={3} placeholder="md — default…"/></div></div>
            <div className="in-field"><label className="in-label">Large</label><div className="in-group lg"><textarea className="in-control" rows={4} placeholder="lg — long-form…"/></div></div>
          </div>
        </Frame>

        {/* ── States ──────────────────────────────────────────────── */}
        <SubHead meta="states">States</SubHead>
        <Frame label="default · focus · invalid · disabled · readonly"
          code={`<Textarea defaultValue="Default" rows={2}/>
<Textarea defaultValue="Invalid" invalid rows={2}/>
<Textarea defaultValue="Disabled" disabled rows={2}/>
<Textarea defaultValue="Read-only" readOnly rows={2}/>`}>
          <div style={{display:'flex', flexDirection:'column', gap: 12, width: 380}}>
            <div className="in-field"><div className="in-group"><textarea className="in-control" rows={2} defaultValue="Default"/></div></div>
            <div className="in-field"><div className="in-group is-invalid"><textarea className="in-control" rows={2} defaultValue="Invalid — past max length" aria-invalid="true"/></div><p className="in-helper" style={{color:'var(--danger)'}}>Limit is 280 characters.</p></div>
            <div className="in-field"><div className="in-group"><textarea className="in-control" rows={2} defaultValue="Disabled" disabled/></div></div>
            <div className="in-field"><div className="in-group"><textarea className="in-control" rows={2} defaultValue="Read-only — copy enabled" readOnly/></div></div>
          </div>
        </Frame>

        {/* ── Accessibility ───────────────────────────────────────── */}
        <SubHead meta="a11y">Accessibility</SubHead>
        <div className="ds-grid cols-2" style={{marginTop: 12}}>
          <div className="surface" style={{padding: 18}}>
            <div className="t-small" style={{fontWeight: 600, marginBlockEnd: 10}}>Keyboard</div>
            <dl style={{margin: 0, display:'grid', gridTemplateColumns:'auto 1fr', columnGap: 14, rowGap: 8, alignItems:'baseline'}}>
              <dt><kbd className="kbd">Tab</kbd></dt>
              <dd className="t-small" style={{margin:0, color:'var(--fg-muted)'}}>Moves focus into, then out of, the field.</dd>
              <dt><kbd className="kbd">Enter</kbd></dt>
              <dd className="t-small" style={{margin:0, color:'var(--fg-muted)'}}>Inserts a newline — never submits the form.</dd>
              <dt><kbd className="kbd">←</kbd><kbd className="kbd">→</kbd><kbd className="kbd">↑</kbd><kbd className="kbd">↓</kbd></dt>
              <dd className="t-small" style={{margin:0, color:'var(--fg-muted)'}}>Move the caret by character and by line.</dd>
              <dt><kbd className="kbd">Home</kbd> <kbd className="kbd">End</kbd></dt>
              <dd className="t-small" style={{margin:0, color:'var(--fg-muted)'}}>Jump to line start / end; add <kbd className="kbd">Ctrl</kbd>/<kbd className="kbd">⌘</kbd> to jump the whole field.</dd>
            </dl>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div className="t-small" style={{fontWeight: 600, marginBlockEnd: 6}}>Screen reader</div>
            <div className="t-small" style={{color: 'var(--fg-muted)'}}>A programmatic <Mono>&lt;label htmlFor&gt;</Mono> (or <Mono>aria-labelledby</Mono>) names the field; helper text and the counter are both wired through <Mono>aria-describedby</Mono>. Past the limit the control sets <Mono>aria-invalid="true"</Mono>. The counter sits in an <Mono>aria-live="polite"</Mono> / <Mono>aria-atomic</Mono> span, so the running total is announced on a typing pause — not on every keystroke.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div className="t-small" style={{fontWeight: 600, marginBlockEnd: 6}}>Focus &amp; contrast</div>
            <div className="t-small" style={{color: 'var(--fg-muted)'}}>The field shows the ember focus ring (<Mono>--ring</Mono>) at ≥3:1 against the surface. The invalid state is carried by a danger-toned border plus the error message, not colour alone; placeholder, value and helper text all meet AA (4.5:1) on the field surface in both themes.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div className="t-small" style={{fontWeight: 600, marginBlockEnd: 6}}>Motion</div>
            <div className="t-small" style={{color: 'var(--fg-muted)'}}>The only transition is the focus-ring fade eased with <Mono>--ease</Mono>. Auto-grow resizes the field without animating height, so there is nothing to disable under <Mono>prefers-reduced-motion</Mono>.</div>
          </div>
        </div>

        {/* ── RTL ─────────────────────────────────────────────────── */}
        <SubHead meta="RTL · العربية">RTL</SubHead>
        <Frame label="dir=&quot;rtl&quot; — text aligns to the right, resize handle mirrors to the start edge"
          code={`<div dir="rtl">
  <Field label="رسالة" help="نص عادي. لا يتم عرض Markdown.">
    <Textarea rows={3} placeholder="اكتب رسالتك هنا…"/>
  </Field>
</div>`}>
          <div dir="rtl" className="in-field" style={{minWidth: 380}}>
            <label className="in-label">رسالة</label>
            <div className="in-group"><textarea className="in-control" rows={3} placeholder="اكتب رسالتك هنا…"/></div>
            <p className="in-helper">نص عادي. لا يتم عرض Markdown.</p>
          </div>
        </Frame>
        <Lede>
          Logical properties (<Mono>text-align: start</Mono>, <Mono>padding-inline</Mono>) mean Arabic copy flows right-to-left without any direction-specific CSS. The resize handle mirrors to the inline-start corner; the helper and counter text align to the start edge automatically.
        </Lede>

        {/* ── Anatomy ──────────────────────────────────────────────── */}
        <SubHead meta="anatomy">Anatomy</SubHead>
        <div className="ds-frame">
          <div className="ds-frame-head"><span className="label">anatomy</span></div>
          <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
            <div className="ana" style={{display:'flex', justifyContent:'center'}}>
              <div className="stage" style={{position:'relative', width: 320}} aria-hidden="true">
                <div className="in-field">
                  <label className="in-label">About</label>
                  <div className="in-group">
                    <textarea className="in-control" rows={3} tabIndex={-1} defaultValue="A short bio for your profile." style={{cursor:'default'}}/>
                  </div>
                  <p className="in-helper">Plain text. Markdown is not rendered.</p>
                </div>
                {/* Leads */}
                <span className="lead h" style={{top: 10, left: -36, width: 30}}/>
                <span className="lead h" style={{top: 56, left: -36, width: 30}}/>
                <span className="lead h" style={{top: 84, right: -36, width: 30}}/>
                <span className="lead h" style={{bottom: 26, left: -36, width: 30}}/>
                <span className="lead v" style={{bottom: -22, right: 6, height: 18}}/>
                {/* Pins */}
                <div className="pin" style={{top: 2, left: -58}}>1</div>
                <div className="pin" style={{top: 48, left: -58}}>2</div>
                <div className="pin" style={{top: 76, right: -58}}>3</div>
                <div className="pin" style={{bottom: 18, left: -58}}>4</div>
                <div className="pin" style={{bottom: -42, right: 0, transform:'translateX(50%)'}}>5</div>
              </div>
            </div>
            <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
              <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Label.</b> Always present. Pair with <Mono>htmlFor</Mono>. Uses <Mono>.in-label</Mono>.</span>
              <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Group shell.</b> Border + focus ring chrome live here. Uses <Mono>.in-group</Mono>.</span>
              <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Control.</b> The bare textarea — silent on focus. Uses <Mono>.in-control</Mono>.</span>
              <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Helper.</b> Description, counter, or error under the group. Uses <Mono>.in-helper</Mono>.</span>
              <span className="num">5</span><span><b style={{color:'var(--fg)'}}>Resize handle.</b> Browser-native bottom-end corner. <Mono>resize: vertical</Mono> by default.</span>
            </div>
          </div>
        </div>

        {/* ── Do / Don't ──────────────────────────────────────────── */}
        <SubHead meta="rules">Do / Don't</SubHead>
        <div className="dd-grid">
          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — show a live counter when there is a max</div>
            <div className="body">
              <div className="in-field" style={{maxWidth: 320}}>
                <div className="in-group"><textarea className="in-control" rows={2} defaultValue="Short and to the point."/></div>
                <p className="in-helper" style={{display:'flex', justifyContent:'space-between'}}><span>Public.</span><span className="t-mono" style={{color:'var(--fg-muted)'}}>23/280</span></p>
              </div>
            </div>
            <div className="note">Counter on the right, helper on the left — the user sees the budget without leaving the input.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — disable resize without explaining why</div>
            <div className="body">
              <div className="in-field" style={{maxWidth: 320}}>
                <div className="in-group"><textarea className="in-control" rows={2} defaultValue="Can't drag this." style={{resize:'none'}}/></div>
              </div>
            </div>
            <div className="note">Locking the corner traps users with too-short cells. Allow vertical resize unless the layout truly cannot grow.</div>
          </div>
        </div>

        {/* 4. API REFERENCE */}
        <SubHead meta="TextareaProps">API reference</SubHead>
        <AutoPropsTable component="Textarea" label="<Textarea />"/>
      </Section>
    );
  }
