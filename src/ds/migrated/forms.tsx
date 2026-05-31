'use client';
// Eidos DS — Components / Forms (inputs · selects · search · checkbox)
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs, Lede, Mono } from '@/ds/core';


const USAGE_CODE = `import { Input, Label } from "@/components/forge/forms"

export function Demo() {
  return (
    <div className="in-field">
      <Label>Service name</Label>
      <Input placeholder="identity-svc"/>
    </div>
  );
}`;

export default function Forms() {
  const inputStyle = {
    height: 36, padding: '0 12px', borderRadius: 'var(--radius-lg)',
    background: 'var(--surface)', border: '1px solid var(--border-strong)',
    color: 'var(--fg)', fontSize: 'var(--text-base)', width: '100%',
  };
  return (
    <Section id="forms" num="11" title="Forms" desc="The shared field grammar behind every Eidos input — label, control, helper, and error in one predictable rhythm. Text fields, selects, switches, checkboxes, and radios all read and validate the same.">
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('forms')} ariaLabel="package manager"/>
      <Lede>
        Bundles <Mono>Input</Mono>, <Mono>Textarea</Mono>, <Mono>Label</Mono>, and the field-state CSS. Forms in Eidos stay quiet — surface backgrounds, hairline borders, ember focus ring.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Lede>Each control — text field, select, search, switch, checkbox, radio — also has its own page with full variants and anatomy. This page shows the shared field wrapper that governs every one of them.</Lede>
      <Frame label="basic" code={USAGE_CODE}>
        <div style={{width:'100%', maxWidth: 320}}>
          <label className="t-mono-label" htmlFor="f-basic" style={{display:'block', padding:0, marginBottom: 6}}>Service name</label>
          <input id="f-basic" style={inputStyle} placeholder="identity-svc"/>
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

      <SubHead meta="text · search · select · textarea">Inputs</SubHead>
      <div className="ds-grid cols-2">
        <Frame label="Text input" code={`<label className="t-mono-label">Service name</label>
<input className="ds-input" placeholder="identity-svc"/>`}>
          <div style={{width:'100%', maxWidth: 320}}>
            <label className="t-mono-label" htmlFor="f-name" style={{display:'block', padding:0, marginBottom: 6}}>Service name</label>
            <input id="f-name" style={inputStyle} placeholder="identity-svc" aria-describedby="f-name-help"/>
            <div id="f-name-help" style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)', marginTop: 6}}>Lowercase, hyphenated. 3–32 chars.</div>
          </div>
        </Frame>

        <Frame label="Search input">
          <div style={{position:'relative', width:'100%', maxWidth: 320}}>
            <label htmlFor="f-search" className="sr-only">Search</label>
            <Icons.search size={14} aria-hidden="true" style={{position:'absolute', top: 11, insetInlineStart: 10, color:'var(--fg-subtle)'}}/>
            <input id="f-search" type="search" style={{...inputStyle, paddingInlineStart: 32}} placeholder="Search services, deploys, GMUDs…"/>
            <span className="kbd" aria-hidden="true" style={{position:'absolute', top: 9, insetInlineEnd: 8}}>⌘K</span>
          </div>
        </Frame>

        <Frame label="Select" code={`<select className="ds-select">…</select>`}>
          <div style={{width:'100%', maxWidth: 320}}>
            <label className="t-mono-label" htmlFor="f-tier" style={{display:'block', padding:0, marginBottom: 6}}>Tier</label>
            <select id="f-tier" style={inputStyle} defaultValue="T1">
              <option>T1 — Critical</option>
              <option>T2 — Important</option>
              <option>T3 — Standard</option>
            </select>
          </div>
        </Frame>

        <Frame label="Textarea">
          <div style={{width:'100%', maxWidth: 320}}>
            <label className="t-mono-label" htmlFor="f-summary" style={{display:'block', padding:0, marginBottom: 6}}>Change summary</label>
            <textarea id="f-summary" style={{...inputStyle, height: 96, padding: 10, resize:'vertical'}} placeholder="What is changing and why."/>
          </div>
        </Frame>
      </div>

      <SubHead meta="states">Field states</SubHead>
      <Frame label="default · focused · error · disabled" row>
        <div style={{width: 200}}>
          <label className="t-mono-label" htmlFor="st-default" style={{display:'block', padding:0, marginBottom: 6}}>default</label>
          <input id="st-default" style={inputStyle} placeholder="placeholder"/>
        </div>
        <div style={{width: 200}}>
          <label className="t-mono-label" htmlFor="st-focused" style={{display:'block', padding:0, marginBottom: 6}}>focused</label>
          <input id="st-focused" style={{...inputStyle, borderColor:'var(--ember)', boxShadow:'0 0 0 3px var(--ember-soft)'}} defaultValue="identity-svc"/>
        </div>
        <div style={{width: 200}}>
          <label className="t-mono-label" htmlFor="st-error" style={{display:'block', padding:0, marginBottom: 6}}>error</label>
          <input id="st-error" style={{...inputStyle, borderColor:'var(--danger)'}} defaultValue="Identity SVC" aria-invalid="true" aria-describedby="st-error-msg"/>
          <div id="st-error-msg" role="alert" style={{fontSize: 'var(--text-base)', color:'var(--danger)', marginTop: 4}}>Must be lowercase</div>
        </div>
        <div style={{width: 200}}>
          <label className="t-mono-label" htmlFor="st-disabled" style={{display:'block', padding:0, marginBottom: 6}}>disabled</label>
          <input id="st-disabled" style={{...inputStyle, opacity: 0.4, cursor:'not-allowed'}} defaultValue="locked" disabled/>
        </div>
      </Frame>

      <SubHead meta="bool">Switch / Checkbox / Radio</SubHead>
      <p style={{fontSize: 'var(--text-body)', color:'var(--fg-muted)', marginBottom: 14, maxWidth:'64ch'}}>
        See them together below. Each control has its own page with full variants, motion, sizes, and anatomy: <a href="/checkbox" style={{color:'var(--ember)'}}>Checkbox</a>, <a href="/radio" style={{color:'var(--ember)'}}>Radio</a>, <a href="/switch" style={{color:'var(--ember)'}}>Switch</a>.
      </p>
      <BoolInputs/>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Every control is a native element, so Tab order follows the DOM and matches the visual stack. Checkboxes and switches toggle on Space, radios move within their group with the arrow keys, and selects open with Space / Enter or arrow keys. Submit fires on Enter from any text field.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Each field is named by a real <Mono>{'<label htmlFor>'}</Mono> — never a placeholder. Helper text and errors are wired with <Mono>aria-describedby</Mono>; an invalid field sets <Mono>aria-invalid</Mono> and its error carries <Mono>role="alert"</Mono> so it announces on validate. Required fields use the native <Mono>required</Mono> attribute, not just a visual asterisk.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>All controls share the offset focus ring. Error and disabled states pair colour with an icon or text so meaning never depends on hue alone, and label, helper, placeholder, and error copy each clear AA contrast on the field surface.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Focus-ring fades, switch thumb travel, and error reveals are short token transitions. Under <Mono>prefers-reduced-motion: reduce</Mono> they snap to the final state with no easing.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label="dir=&quot;rtl&quot; — labels lead, helpers + errors stay below the field"
        code={`<div dir="rtl">
  <label className="t-mono-label">اسم الخدمة</label>
  <input placeholder="identity-svc" />
  <div className="helper">حروف صغيرة، تفصلها شرطات. ٣–٣٢ حرفًا.</div>

  {/* Search — icon and shortcut hint flip with the layout */}
  <div style={{position:'relative'}}>
    <Icons.search style={{insetInlineStart: 10}}/>
    <input style={{paddingInlineStart: 32}} placeholder="بحث عن الخدمات…" />
    <span className="kbd" style={{insetInlineEnd: 8}}>⌘K</span>
  </div>
</div>`}
      >
        <div dir="rtl" className="ds-grid cols-2" style={{width:'100%'}}>
          <div style={{width:'100%', maxWidth: 320}}>
            <label className="t-mono-label" htmlFor="rtl-name" style={{display:'block', padding:0, marginBottom: 6}}>اسم الخدمة</label>
            <input id="rtl-name" style={inputStyle} placeholder="identity-svc" aria-describedby="rtl-name-help"/>
            <div id="rtl-name-help" style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)', marginTop: 6}}>حروف صغيرة، تفصلها شرطات. ٣–٣٢ حرفًا.</div>
          </div>
          <div style={{position:'relative', width:'100%', maxWidth: 320}}>
            <label htmlFor="rtl-search" className="sr-only">بحث</label>
            <Icons.search size={14} aria-hidden="true" style={{position:'absolute', top: 11, insetInlineStart: 10, color:'var(--fg-subtle)'}}/>
            <input id="rtl-search" type="search" style={{...inputStyle, paddingInlineStart: 32}} placeholder="بحث عن الخدمات وعمليات النشر…"/>
            <span className="kbd" aria-hidden="true" style={{position:'absolute', top: 9, insetInlineEnd: 8}}>⌘K</span>
          </div>
          <div style={{width:'100%', maxWidth: 320}}>
            <label className="t-mono-label" htmlFor="rtl-tier" style={{display:'block', padding:0, marginBottom: 6}}>الفئة</label>
            <select id="rtl-tier" style={inputStyle} defaultValue="T1">
              <option>T1 — حرجة</option>
              <option>T2 — مهمة</option>
              <option>T3 — قياسية</option>
            </select>
          </div>
          <div style={{width:'100%', maxWidth: 320}}>
            <label className="t-mono-label" htmlFor="rtl-err" style={{display:'block', padding:0, marginBottom: 6}}>الاسم</label>
            <input id="rtl-err" style={{...inputStyle, borderColor:'var(--danger)'}} defaultValue="Identity SVC" aria-invalid="true" aria-describedby="rtl-err-msg"/>
            <div id="rtl-err-msg" role="alert" style={{fontSize: 'var(--text-base)', color:'var(--danger)', marginTop: 4}}>يجب أن يكون بأحرف صغيرة</div>
          </div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Use <Mono>insetInlineStart/End</Mono> for absolutely-positioned adornments (search icons, shortcut hints) and <Mono>paddingInlineStart/End</Mono> on the input itself. Static fonts and Latin tokens (<Mono>identity-svc</Mono>) are auto-isolated by the browser inside RTL flow.
      </p>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 72px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width: 320}} aria-hidden="true">
              <div style={{width:'100%'}}>
                <div className="t-mono-label" style={{padding:0, marginBottom: 6}}>
                  Service name <span style={{color:'var(--ember)'}}>*</span>
                </div>
                <div style={{position:'relative'}}>
                  <Icons.search size={14} style={{position:'absolute', top: 11, insetInlineStart: 10, color:'var(--fg-subtle)'}}/>
                  <input
                    style={{...inputStyle, paddingInlineStart: 32, borderColor:'var(--danger)'}}
                    defaultValue="Identity SVC"
                    readOnly
                    tabIndex={-1}
                  />
                </div>
                <div style={{fontSize: 'var(--text-base)', color:'var(--danger)', marginTop: 6}}>
                  Must be lowercase and hyphenated.
                </div>
              </div>

              {/* Lead lines + pins */}
              <span className="lead h" style={{top: 6, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 44, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 38, right: -28, width: 24}}/>
              <span className="lead v" style={{bottom: -22, left: 24, height: 18}}/>
              <span className="lead h" style={{bottom: 8, right: -28, width: 24}}/>

              <div className="pin" style={{top: -2, left: -52}}>1</div>
              <div className="pin" style={{top: 36, left: -52}}>2</div>
              <div className="pin" style={{top: 30, right: -52}}>3</div>
              <div className="pin" style={{bottom: -42, left: 24, transform:'translateX(-50%)'}}>4</div>
              <div className="pin" style={{bottom: 0, right: -52}}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'72px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Label.</b> <Mono>.t-mono-label</Mono>. Mono 11/0.18em uppercase. Required fields get a small ember asterisk — never rely on color alone, always pair with copy elsewhere ("Required").</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Control.</b> The <Mono>&lt;input&gt;</Mono> itself. 36px tall, 6px radius, hairline <Mono>--border-strong</Mono>. Invalid state swaps the border for <Mono>--danger</Mono>.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Leading icon.</b> Optional. Absolutely positioned via <Mono>insetInlineStart</Mono>; the input gets matching <Mono>paddingInlineStart</Mono> so text never collides with the glyph.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Validation message.</b> Below the control. <Mono>--danger</Mono> when invalid; <Mono>--fg-subtle</Mono> for the neutral helper variant. Same vertical rhythm in both states.</span>
            <span className="num">5</span><span><b style={{color:'var(--fg)'}}>Spacing rhythm.</b> 6px between label · control · helper. Errors don't add a row — they replace the helper so the layout never shifts on validate.</span>
          </div>
        </div>
      </div>

      {/* 4. API REFERENCE */}
      <SubHead meta="InputProps">API reference</SubHead>
      <PropsTable
        label="<Input />"
        rows={[
          { prop: 'value', type: 'string', description: 'Controlled value.' },
          { prop: 'onChange', type: '(e: ChangeEvent) => void', description: 'Standard React change handler.' },
          { prop: 'defaultValue', type: 'string', description: 'Initial value for uncontrolled use.' },
          { prop: 'placeholder', type: 'string', description: 'Faint hint shown when empty.' },
          { prop: 'type', type: '"text" | "email" | "password" | "number" | "search"', default: '"text"', description: 'HTML input type — drives keyboard + validation.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Locks the input.' },
          { prop: 'invalid', type: 'boolean', default: 'false', description: 'Paints the field border with --danger and sets aria-invalid.' },
          { prop: 'className', type: 'string', description: 'Extra utility classes merged via cn().' },
        ]}
      />
      <PropsTable
        label="<Label />"
        rows={[
          { prop: 'htmlFor', type: 'string', description: 'ID of the associated input for click-to-focus.' },
          { prop: 'required', type: 'boolean', default: 'false', description: 'Appends an ember asterisk after the label text.' },
          { prop: 'className', type: 'string', description: 'Extra utility classes merged via cn().' },
        ]}
      />
    </Section>
  );
}

// Interactive toggle / checkbox / radio. The full surface area for each
// (motion, sizes, anatomy, do/don't) lives on its own page — this is the
// condensed "see them together in a form" view. The visual chrome is
// identical: same .fc-* classes from tokens.css.
const BoolInputs = () => {
  const [autoDeploy, setAutoDeploy] = React.useState(true);
  const [notify, setNotify] = React.useState(false);
  const [smoke, setSmoke] = React.useState(true);
  const [skip, setSkip] = React.useState(false);
  const [canary, setCanary] = React.useState('10');

  const Switch = ({ checked, onChange, children }) => (
    <label className="fc">
      <input type="checkbox" role="switch" className="fc-input" checked={checked} onChange={onChange} aria-checked={checked}/>
      <span className="fc-toggle-track" aria-hidden="true"><span className="fc-toggle-thumb"/></span>
      <span className="fc-text"><span className="fc-label" style={{fontSize: 'var(--text-base)'}}>{children}</span></span>
    </label>
  );

  const Check = ({ checked, onChange, children }) => (
    <label className="fc">
      <input type="checkbox" className="fc-input" checked={checked} onChange={onChange}/>
      <span className="fc-check-box" aria-hidden="true">
        <span className="fc-check-icon"><Icons.check size={10} strokeWidth={3} color="currentColor"/></span>
      </span>
      <span className="fc-text"><span className="fc-label" style={{fontSize: 'var(--text-base)'}}>{children}</span></span>
    </label>
  );

  const Radio = ({ value, children }) => {
    const on = canary === value;
    return (
      <label className="fc">
        <input type="radio" name="canary" className="fc-input" checked={on} onChange={() => setCanary(value)}/>
        <span className="fc-radio-box" aria-hidden="true"><span className="fc-radio-dot"/></span>
        <span className="fc-text"><span className="fc-label" style={{fontSize: 'var(--text-base)'}}>{children}</span></span>
      </label>
    );
  };

  return (
    <Frame label="click to toggle · controlled state" row>
      <Switch checked={autoDeploy} onChange={()=>setAutoDeploy(v=>!v)}>Auto-deploy on merge</Switch>
      <Switch checked={notify}     onChange={()=>setNotify(v=>!v)}>Notify Slack</Switch>
      <Check  checked={smoke}      onChange={()=>setSmoke(v=>!v)}>Run smoke tests</Check>
      <Check  checked={skip}       onChange={()=>setSkip(v=>!v)}>Skip approval</Check>
      <Radio value="10">Canary 10%</Radio>
      <Radio value="50">Canary 50%</Radio>
      <Radio value="100">Full rollout</Radio>
    </Frame>
  );
};
