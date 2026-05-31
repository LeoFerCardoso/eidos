'use client';
// Forge DS — Components / Switch (formerly Toggle).
// A binary setting that takes effect immediately — no save button. The
// thumb glides on a (0.34, 1.56, 0.64, 1) cubic-bezier so it overshoots
// slightly then settles, giving the control a tactile, spring-like feel
// instead of a flat slide. Track + thumb colors animate alongside.
//
// Inspired by shadcn/ui's Switch:
//   - Light mode has a distinct, lighter visual stance (white floating thumb
//     on zinc-200 track) so it doesn't look identical to dark mode.
//   - Invalid state via aria-invalid / .invalid — danger-tinted track + label.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, Mono } from '@/ds/core';



  const USAGE_CODE = `import { Switch } from "@/components/forge/switch"

export function Demo() {
  const [on, setOn] = React.useState(true)
  return (
    <Switch checked={on} onCheckedChange={setOn}>
      Auto-deploy on merge
    </Switch>
  )
}`;

  const Switch = (props) => {
    const id = props.id || React.useId();
    const size = props.size || 'md';
    const cls = ['fc']
      .concat(size !== 'md' ? [size] : [])
      .concat(props.desc ? ['block'] : [])
      .concat(props.invalid ? ['invalid'] : [])
      .join(' ');
    return (
      <label
        className={cls}
        aria-disabled={props.disabled || undefined}
        aria-invalid={props.invalid || undefined}
      >
        <input
          id={id}
          type="checkbox"
          role="switch"
          className="fc-input"
          checked={!!props.checked}
          onChange={props.onChange || (() => {})}
          disabled={props.disabled}
          aria-checked={!!props.checked}
          aria-invalid={props.invalid || undefined}
          aria-describedby={props.errorId || undefined}
        />
        <span className="fc-toggle-track" aria-hidden="true">
          <span className="fc-toggle-thumb"/>
        </span>
        {(props.children || props.desc) && (
          <span className="fc-text">
            {props.children && <span className="fc-label">{props.children}</span>}
            {props.desc && <span className="fc-desc">{props.desc}</span>}
          </span>
        )}
      </label>
    );
  };

  // Settings row — Switch on the trailing edge, label/desc filling the rest.
  const SwitchRow = (props) => {
    const id = props.id || React.useId();
    return (
      <div className="fc-row">
        <label htmlFor={id} className="fc-text" style={{cursor:'pointer', flex: 1}}>
          <span className="fc-label">{props.title}</span>
          {props.desc && <span className="fc-desc" style={{marginTop: 4}}>{props.desc}</span>}
        </label>
        <Switch id={id} size={props.size} checked={props.checked} onChange={props.onChange} disabled={props.disabled} invalid={props.invalid}/>
      </div>
    );
  };

  // ---- demos -----------------------------------------------------------
  const useBool = (init) => {
    const [v, setV] = React.useState(init);
    return [v, () => setV(x => !x)];
  };

  const SimpleDemo = () => {
    const [a, ta] = useBool(true);
    const [b, tb] = useBool(false);
    return (
      <>
        <Switch checked={a} onChange={ta}>Auto-deploy on merge</Switch>
        <Switch checked={b} onChange={tb}>Notify Slack on failure</Switch>
      </>
    );
  };

  const SizesDemo = () => {
    const [a, ta] = useBool(true);
    const [b, tb] = useBool(true);
    const [c, tc] = useBool(true);
    return (
      <>
        <Switch size="sm" checked={a} onChange={ta}>Small</Switch>
        <Switch size="md" checked={b} onChange={tb}>Medium (default)</Switch>
        <Switch size="lg" checked={c} onChange={tc}>Large</Switch>
      </>
    );
  };

  const StatesDemo = () => (
    <>
      <Switch onChange={()=>{}}>Off</Switch>
      <Switch checked onChange={()=>{}}>On</Switch>
      <Switch disabled onChange={()=>{}}>Disabled off</Switch>
      <Switch checked disabled onChange={()=>{}}>Disabled on</Switch>
    </>
  );

  // Invalid demo — the user accepted critical-alerts via SMS but their phone
  // number is missing on the profile. The switch turns danger-red, the label
  // turns danger-red, and a danger-red helper line below explains what to fix.
  const InvalidDemo = () => {
    const [sms, setSms] = React.useState(true);
    const [marketing, setMarketing] = React.useState(false);
    const errorId = React.useId();
    return (
      <div style={{width:'100%', maxWidth: 480, display:'flex', flexDirection:'column', gap: 18}}>
        <div>
          <Switch
            checked={sms}
            onChange={() => setSms(v => !v)}
            invalid
            errorId={errorId}
            desc="Critical incident pages will be sent here."
          >
            Send SMS for critical alerts
          </Switch>
          <span id={errorId} className="fc-error" style={{marginInlineStart: 50}}>
            Phone number is missing — add one in profile to enable SMS.
          </span>
        </div>
        <div>
          <Switch checked={marketing} onChange={() => setMarketing(v => !v)} desc="Product updates, tips, weekly digest.">
            Marketing emails
          </Switch>
        </div>
      </div>
    );
  };

  const SettingsDemo = () => {
    const [auto, setAuto] = React.useState(true);
    const [slack, setSlack] = React.useState(false);
    const [smoke, setSmoke] = React.useState(true);
    const [canary, setCanary] = React.useState(true);
    const [pause, setPause] = React.useState(false);
    return (
      <div style={{width:'100%', maxWidth: 560, padding: '0 16px'}}>
        <SwitchRow checked={auto}   onChange={()=>setAuto(v=>!v)}   title="Auto-deploy on merge"        desc="Push to main triggers a deploy as soon as CI is green."/>
        <SwitchRow checked={slack}  onChange={()=>setSlack(v=>!v)}  title="Notify Slack on failure"     desc="Posts to #deploys when a stage fails or rolls back."/>
        <SwitchRow checked={smoke}  onChange={()=>setSmoke(v=>!v)}  title="Run smoke tests"             desc="≈ 30 seconds. Blocks promotion to staging on failure."/>
        <SwitchRow checked={canary} onChange={()=>setCanary(v=>!v)} title="Canary first"                desc="Roll out to 10% of pods, soak 5 minutes, then promote."/>
        <SwitchRow checked={pause}  onChange={()=>setPause(v=>!v)}  title="Pause auto-rollback"         desc="Off by default — the system reverts unhealthy deploys."/>
      </div>
    );
  };

  // Inline composition — switch next to a single sentence
  const InlineDemo = () => {
    const [v, setV] = React.useState(true);
    return (
      <div style={{display:'flex', alignItems:'center', gap: 12, padding: '12px 16px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', width:'100%', maxWidth: 480}}>
        <span style={{fontSize: 'var(--text-base)', color:'var(--fg)', flex: 1}}>Enable beta features for this workspace</span>
        <Switch checked={v} onChange={() => setV(x => !x)}/>
      </div>
    );
  };

  const RTLDemo = () => {
    const [a, setA] = React.useState(true);
    const [b, setB] = React.useState(false);
    const [c, setC] = React.useState(true);
    return (
      <div dir="rtl" style={{width:'100%', maxWidth: 560, padding:'0 16px'}}>
        <SwitchRow checked={a} onChange={()=>setA(x=>!x)} title="نشر تلقائي عند الدمج"      desc="ينطلق النشر فور نجاح اختبارات CI على فرع main."/>
        <SwitchRow checked={b} onChange={()=>setB(x=>!x)} title="إخطار Slack عند الفشل"   desc="يُنشر في قناة #deploys عند فشل أي مرحلة أو الرجوع."/>
        <SwitchRow checked={c} onChange={()=>setC(x=>!x)} title="إصدار تجريبي أولاً"         desc="نشر إلى 10٪ من الحاويات، ثم انتظار 5 دقائق قبل الترقية."/>
      </div>
    );
  };

export default function Page() {
    return (
    <Section
      id="switch"
      title="Switch"
      desc="A binary on/off control that takes effect the moment it changes — no save button. Inspired by shadcn/ui's Switch. Use a Checkbox when the change happens later (on submit) or sits inside a form."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('switch')} ariaLabel="package manager"/>
      <Lede>
        Ships <Mono>switch.tsx</Mono> wrapping Radix's primitive — the spring-back thumb animation and light-mode override live in the local stylesheet.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <Switch checked onChange={()=>{}}>Auto-deploy on merge</Switch>
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

      {/* Default */}
      <SubHead meta="on · off">Default</SubHead>
      <Frame
        label="click to toggle — thumb glides with a small spring overshoot"
        code={`<Switch checked={a} onCheckedChange={setA}>Auto-deploy on merge</Switch>
<Switch checked={b} onCheckedChange={setB}>Notify Slack on failure</Switch>`}
      >
        <div style={{display:'flex', flexDirection:'column', gap: 14}}>
          <SimpleDemo/>
        </div>
      </Frame>
      <p style={{fontSize: 'var(--text-body)', color:'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth:'64ch'}}>
        The thumb uses <Mono>cubic-bezier(0.34, 1.56, 0.64, 1)</Mono> — a back-out curve that overshoots before settling. Combined with the 220ms duration, that's the difference between "snaps" and "slides".
      </p>

      {/* Light vs Dark */}
      <SubHead meta="light · dark">Light mode</SubHead>
      <Frame
        label="light theme — distinct from dark: zinc-200 track, white floating thumb"
        code={`/* The light-mode override in tokens.css */
[data-theme="light"] .fc-toggle-track {
  background: #E4E4E7;
  border-color: rgba(0,0,0,0.06);
  box-shadow: inset 0 1px 1px rgba(0,0,0,0.04);
}
[data-theme="light"] .fc-toggle-thumb {
  background: #FFFFFF;
  box-shadow: 0 1px 2px rgba(0,0,0,0.16);
}
[data-theme="light"] .fc-input:checked + .fc-toggle-track .fc-toggle-thumb {
  background: #FFFFFF;
}`}
      >
        <div data-theme="light" style={{background:'var(--bg)', borderRadius: 10, padding: 24, width:'100%', maxWidth: 520, color:'var(--fg)'}}>
          <div style={{display:'flex', flexDirection:'column', gap: 14}}>
            <Switch checked onChange={()=>{}}>Auto-deploy on merge</Switch>
            <Switch onChange={()=>{}}>Notify Slack on failure</Switch>
            <Switch checked disabled onChange={()=>{}}>Disabled (on)</Switch>
          </div>
        </div>
      </Frame>
      <p style={{fontSize: 'var(--text-body)', color:'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth:'64ch'}}>
        Light mode uses the same ember accent for ON, but the OFF track switches to a soft zinc gray (<Mono>#E4E4E7</Mono>) that reads clearly distinct from the page background, with an opaque white thumb floating on a 1-px shadow — shadcn's "thumb is the page surface" pattern. Dark mode keeps the original dim track + neutral thumb.
      </p>

      {/* Sizes */}
      <SubHead meta="sm · md · lg">Sizes</SubHead>
      <Frame
        label="32×18 · 40×22 · 48×26"
        code={`<Switch size="sm" checked={a} onCheckedChange={setA}>Small</Switch>
<Switch size="md" checked={b} onCheckedChange={setB}>Medium (default)</Switch>
<Switch size="lg" checked={c} onCheckedChange={setC}>Large</Switch>`}
        row
      >
        <SizesDemo/>
      </Frame>

      {/* States */}
      <SubHead meta="states">States</SubHead>
      <Frame label="off · on · disabled (off & on)" row>
        <StatesDemo/>
      </Frame>

      {/* Invalid */}
      <SubHead meta="error">Invalid state</SubHead>
      <Frame
        label="aria-invalid — danger-tinted track + label, helper line below"
        code={`<Switch
  checked={sms}
  onCheckedChange={setSms}
  invalid
  aria-describedby="sms-error"
  desc="Critical incident pages will be sent here."
>
  Send SMS for critical alerts
</Switch>
<span id="sms-error" className="fc-error">
  Phone number is missing — add one in profile to enable SMS.
</span>`}
      >
        <InvalidDemo/>
      </Frame>
      <p style={{fontSize: 'var(--text-body)', color:'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth:'64ch'}}>
        Three things flip together: the track gets a danger border + soft red ring, the label changes to <Mono>var(--danger)</Mono>, and a <Mono>.fc-error</Mono> helper line below names the missing precondition. Wire <Mono>aria-describedby</Mono> on the input to the helper id so screen readers announce it.
      </p>

      {/* Settings list */}
      <SubHead meta="composition">Settings list</SubHead>
      <Frame
        label="label/desc on the leading edge, switch on the trailing edge"
        code={`<SwitchRow
  title="Auto-deploy on merge"
  desc="Push to main triggers a deploy as soon as CI is green."
  checked={auto}
  onCheckedChange={setAuto}
/>`}
      >
        <SettingsDemo/>
      </Frame>

      {/* Inline */}
      <SubHead meta="inline">Inline row</SubHead>
      <Frame label="single line · use it for one-off settings inside a card or banner">
        <InlineDemo/>
      </Frame>

      {/* Accessibility */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 10}}>Keyboard</div>
          <div role="list" style={{display:'flex', flexDirection:'column', gap: 2}}>
            <div className="kbd-row" role="listitem">
              <span className="label">Move focus to the switch</span>
              <span className="kbd-chord trailing"><kbd className="kbd">Tab</kbd></span>
            </div>
            <div className="kbd-row" role="listitem">
              <span className="label">Toggle on / off (writes immediately)</span>
              <span className="kbd-chord trailing"><kbd className="kbd">Space</kbd></span>
            </div>
            <div className="kbd-row" role="listitem">
              <span className="label">No-op — a switch is not a submit control</span>
              <span className="kbd-chord trailing"><kbd className="kbd">Enter</kbd></span>
            </div>
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>It is a native checkbox with <Mono>{'role="switch"'}</Mono>, so the browser exposes its state as <Mono>aria-checked</Mono> (announced &quot;on&quot;/&quot;off&quot;, not &quot;checked&quot;). It is named by the visible <Mono>.fc-label</Mono> the <Mono>{'<label>'}</Mono> wraps — a settings row adds an explicit <Mono>htmlFor</Mono>/<Mono>id</Mono> tie. Helper text is wired through <Mono>aria-describedby</Mono>; an invalid switch sets <Mono>aria-invalid</Mono>.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The track shows the ember focus ring (<Mono>--ring</Mono>). On / off must be distinguishable by more than colour — the thumb shifts position and the track tone changes — and the on-state ember track keeps AA non-text contrast (3:1) against the surface in both themes.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The thumb slides on a back-out spring and the track colour eases over 220ms on toggle. Under <Mono>prefers-reduced-motion</Mono> the transition is dropped — the thumb jumps between ends instantly with no slide.</div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label="dir=&quot;rtl&quot; — switch moves to the visual left, slide direction inverts"
        code={`<div dir="rtl">
  <SwitchRow
    checked={on}
    onCheckedChange={setOn}
    title="نشر تلقائي عند الدمج"
    desc="ينطلق النشر فور نجاح اختبارات CI على فرع main."
  />
</div>`}
      >
        <RTLDemo/>
      </Frame>
      <p style={{fontSize: 'var(--text-body)', color:'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth:'64ch'}}>
        Inline-flex flips the row order automatically, but <Mono>transform: translateX</Mono> doesn't have a logical equivalent — the negative offset under <Mono>{'[dir="rtl"]'}</Mono> is the one explicit override.
      </p>

      {/* Anatomy */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 36px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div
              aria-hidden="true"
              style={{position:'relative', width: 280, pointerEvents:'none', userSelect:'none'}}
            >
              {/* Static (non-interactive) switch — markup mirrors the live one */}
              <label className="fc block" style={{cursor:'default'}}>
                <input type="checkbox" role="switch" className="fc-input" defaultChecked readOnly tabIndex={-1}/>
                <span className="fc-toggle-track" aria-hidden="true">
                  <span className="fc-toggle-thumb"/>
                </span>
                <span className="fc-text">
                  <span className="fc-label">Auto-deploy on merge</span>
                  <span className="fc-desc">Push to main triggers a deploy.</span>
                </span>
              </label>
              {/* Leader lines (dashed) — connect each pin to the part it names */}
              {/* 1 — Track (above, leader down to track top at y=0) */}
              <span style={{position:'absolute', top: -22, left: 20, width: 1, height: 18, borderInlineStart:'1px dashed var(--border-strong)', opacity: .8}}/>
              {/* 2 — Thumb (below the track, leader up to thumb-row at y=22) */}
              <span style={{position:'absolute', top: 26, left: 30, width: 1, height: 22, borderInlineStart:'1px dashed var(--border-strong)', opacity: .8}}/>
              {/* 3 — Label (above the label, leader down to label-baseline) */}
              <span style={{position:'absolute', top: -22, left: 145, width: 1, height: 18, borderInlineStart:'1px dashed var(--border-strong)', opacity: .8}}/>
              {/* 4 — Description (below the desc, leader up to desc bottom) */}
              <span style={{position:'absolute', top: 42, left: 145, width: 1, height: 22, borderInlineStart:'1px dashed var(--border-strong)', opacity: .8}}/>
              {/* Pins — comfortably offset above/below so they never cover text or chrome */}
              <div className="pin" style={{top: -42, left: 20, transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: 50, left: 30, transform:'translateX(-50%)'}}>2</div>
              <div className="pin" style={{top: -42, left: 145, transform:'translateX(-50%)'}}>3</div>
              <div className="pin" style={{top: 66, left: 145, transform:'translateX(-50%)'}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Track.</b> 40×22 pill, 1px border. On → ember fill, off → surface-active (dark) or zinc-200 (light). Color transitions on the standard ease.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Thumb.</b> Circle inset 2px in the track, sliding on a back-out spring. Light mode: always white. Dark mode: muted gray (off) {'->'} near-black (on).</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Label.</b> Geist Sans at the small step (<Mono>--text-sm</Mono>; the settings row bumps weight to 500). Tints to <Mono>--danger</Mono> in the invalid state.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Description (optional).</b> The consequence of the setting, in present tense — "Push to main triggers a deploy" beats "Whether deploys are automatic".</span>
          </div>
        </div>
      </div>

      {/* When to use */}
      <SubHead meta="when to use">Switch vs Checkbox</SubHead>
      <div className="dd-grid">
        <div className="surface" style={{padding: 16}}>
          <div className="ds-h-eyebrow" style={{marginBottom: 6}}>Switch</div>
          <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55, marginBottom: 8}}>
            "On / off" right now. The change writes through immediately. Use in settings, feature flags, preference panels.
          </div>
          <div style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)'}}>Label is a noun phrase: <em>Notifications</em>, <em>Beta features</em>.</div>
        </div>
        <div className="surface" style={{padding: 16}}>
          <div className="ds-h-eyebrow" style={{marginBottom: 6}}>Checkbox</div>
          <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55, marginBottom: 8}}>
            "Yes / no" as part of a form. The change is staged and saved with the rest on submit. Use in forms, filters, multi-select lists.
          </div>
          <div style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)'}}>Label is an action: <em>I agree to the terms</em>, <em>Run smoke tests</em>.</div>
        </div>
      </div>

      {/* Do/Don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — write through immediately</div>
          <div className="body" style={{padding: 14, alignItems:'flex-start'}}>
            <div style={{display:'flex', flexDirection:'column', gap: 4, width:'100%', maxWidth: 320}}>
              <div className="fc-row" style={{padding: '10px 0'}}>
                <span className="fc-text"><span className="fc-label" style={{fontSize: 'var(--text-base)'}}>Daily summary email</span></span>
                <Switch size="sm" checked onChange={()=>{}}/>
              </div>
              <div className="fc-row" style={{padding: '10px 0'}}>
                <span className="fc-text"><span className="fc-label" style={{fontSize: 'var(--text-base)'}}>Beta features</span></span>
                <Switch size="sm" onChange={()=>{}}/>
              </div>
            </div>
          </div>
          <div className="note">Each flip writes the new state to the server. No "save" button — the switch <em>is</em> the save.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — inside a form</div>
          <div className="body" style={{padding: 14, alignItems:'flex-start'}}>
            <div style={{display:'flex', flexDirection:'column', gap: 10, width:'100%', maxWidth: 320}}>
              <div className="t-mono-label" style={{padding: 0}}>Sign up</div>
              <input style={{height:32, padding:'0 10px', borderRadius: 'var(--radius-lg)', background:'var(--surface)', border:'1px solid var(--border-strong)', color:'var(--fg)', fontSize: 'var(--text-base)'}} placeholder="email"/>
              <div className="fc-row" style={{padding: '10px 0', borderBottom:'none'}}>
                <span className="fc-text"><span className="fc-label" style={{fontSize: 'var(--text-base)'}}>I agree to the terms</span></span>
                <Switch size="sm" onChange={()=>{}}/>
              </div>
              <button className="btn xs ember" style={{alignSelf:'flex-start'}}>Sign up</button>
            </div>
          </div>
          <div className="note">Switches write immediately, so users assume the agreement is already saved before they hit submit. Use a Checkbox for form consent.</div>
        </div>
      </div>

      {/* 4. API REFERENCE */}
      <SubHead meta="SwitchProps">API reference</SubHead>
      <AutoPropsTable component="Switch" label="<Switch />"/>
    </Section>
    );
  }
