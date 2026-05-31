'use client';
// Eidos DS — Components / Checkbox.
// Native <input type="checkbox"> with a styled visual sibling. Supports
// checked, indeterminate, disabled, and error states. Sizes sm / md / lg.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, Mono, Alert, AlertDescription } from '@/ds/core';


const USAGE_CODE = `import { Checkbox } from "@/components/forge/checkbox"

export function Demo() {
  const [checked, setChecked] = React.useState(false)
  return (
    <Checkbox checked={checked} onCheckedChange={setChecked}>
      Run smoke tests
    </Checkbox>
  )
}`;

// Single checkbox primitive. Pass `desc` for a two-line variant; pass
// `indeterminate` for the tri-state. Use `aria-disabled` on the wrapper
// (not just `disabled` on the input) so the click target itself stops
// responding — the label's :hover would otherwise still react.
const Checkbox = (props) => {
  const id = props.id || React.useId();
  const checked = !!props.checked;
  const indet = !!props.indeterminate;
  const size = props.size || 'md';
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.indeterminate = indet; }, [indet]);
  const cls = ['fc']
    .concat(size !== 'md' ? [size] : [])
    .concat(props.error ? ['error'] : [])
    .concat(props.desc ? ['block'] : [])
    .join(' ');
  return (
    <label className={cls} aria-disabled={props.disabled || undefined}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={'fc-input' + (indet ? ' indeterminate' : '')}
        checked={checked}
        aria-describedby={props.desc ? id + '-desc' : undefined}
        aria-invalid={props.error || undefined}
        onChange={(e) => {
          // Mirror the shipped @eidos/ui API: native onChange (event) plus the
          // onCheckedChange alias that hands back the next boolean directly.
          props.onChange && props.onChange(e);
          props.onCheckedChange && props.onCheckedChange(e.target.checked);
        }}
        disabled={props.disabled}
      />
      <span className="fc-check-box" aria-hidden="true">
        {indet
          ? <span className="fc-check-dash"/>
          : <span className="fc-check-icon"><Icons.check size={10} strokeWidth={3} color="currentColor"/></span>}
      </span>
      {(props.children || props.desc) && (
        <span className="fc-text">
          {props.children && <span className="fc-label">{props.children}</span>}
          {props.desc && <span className="fc-desc" id={id + '-desc'}>{props.desc}</span>}
        </span>
      )}
    </label>
  );
};

// Stateful demo wrapper — every interactive Frame on this page binds its
// own React state, never relying on the demo's natural "uncontrolled"
// mode (which wouldn't show the indeterminate animation).
const useBool = (init) => {
  const [v, setV] = React.useState(init);
  return [v, () => setV(x => !x)];
};

// Single
const SingleDemo = () => {
  const [a, ta] = useBool(false);
  const [b, tb] = useBool(true);
  const [c, tc] = useBool(true);
  return (
    <>
      <Checkbox checked={a} onCheckedChange={ta}>Run smoke tests</Checkbox>
      <Checkbox checked={b} onCheckedChange={tb}>Notify Slack on failure</Checkbox>
      <Checkbox checked={c} onCheckedChange={tc} desc="Promote the build to staging immediately after the green checks land.">Auto-promote</Checkbox>
    </>
  );
};

// Group with select-all / indeterminate
const SelectAllDemo = () => {
  const items = [
    { id: 'svc-identity', label: 'identity-svc' },
    { id: 'svc-billing',  label: 'billing-svc' },
    { id: 'svc-search',   label: 'search-svc' },
    { id: 'svc-mail',     label: 'mail-svc' },
  ];
  const [picked, setPicked] = React.useState(new Set(['svc-identity', 'svc-billing']));
  const all = picked.size === items.length;
  const some = picked.size > 0 && !all;
  const toggleOne = (id) => setPicked(p => {
    const next = new Set(p);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const toggleAll = () => setPicked(all ? new Set() : new Set(items.map(it => it.id)));
  return (
    <div style={{display:'flex', flexDirection:'column', gap: 10, inlineSize:'100%', maxInlineSize: 320}}>
      <div style={{paddingBlockEnd: 10, borderBlockEnd:'1px solid var(--border)'}}>
        <Checkbox checked={all} indeterminate={some} onCheckedChange={toggleAll}>
          Select all services
        </Checkbox>
      </div>
      {items.map(it => (
        <Checkbox key={it.id} checked={picked.has(it.id)} onCheckedChange={() => toggleOne(it.id)}>{it.label}</Checkbox>
      ))}
    </div>
  );
};

// Sizes
const SizesDemo = () => {
  const [a, ta] = useBool(true);
  const [b, tb] = useBool(true);
  const [c, tc] = useBool(true);
  return (
    <>
      <Checkbox size="sm" checked={a} onCheckedChange={ta}>Small</Checkbox>
      <Checkbox size="md" checked={b} onCheckedChange={tb}>Medium (default)</Checkbox>
      <Checkbox size="lg" checked={c} onCheckedChange={tc}>Large</Checkbox>
    </>
  );
};

// States row — non-interactive on purpose so users can scan all at once
const StatesDemo = () => (
  <>
    <Checkbox>Default</Checkbox>
    <Checkbox checked onChange={()=>{}}>Checked</Checkbox>
    <Checkbox indeterminate onChange={()=>{}}>Indeterminate</Checkbox>
    <Checkbox disabled>Disabled</Checkbox>
    <Checkbox checked disabled>Disabled checked</Checkbox>
    <Checkbox error>With error</Checkbox>
  </>
);

export default function Page() {
  return (
    <Section
      id="checkbox"
      title="Checkbox"
      desc="A binary or tri-state choice. Use it for independent options that don't need to be mutually exclusive — pick a radio when only one selection makes sense."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('checkbox')} ariaLabel="package manager"/>
      <Lede>
        Ships <Mono>checkbox.tsx</Mono> — a native <Mono>&lt;input type="checkbox"&gt;</Mono> with a styled visual sibling, so keyboard support, the <Mono>:indeterminate</Mono> third state, and form-submit semantics come from the platform, not a wrapper. Toggle with the native <Mono>onChange</Mono> event or the <Mono>onCheckedChange</Mono> alias that hands back the next boolean. Pick the <em>Manual</em> tab to paste the source by hand.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <Checkbox checked onChange={()=>{}}>Run smoke tests</Checkbox>
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
      <SubHead meta="checked · unchecked">Default</SubHead>
      <Frame
        label="click to toggle"
        code={`<Checkbox checked={a} onCheckedChange={setA}>Run smoke tests</Checkbox>
<Checkbox checked={b} onCheckedChange={setB}>Notify Slack on failure</Checkbox>
<Checkbox checked={c} onCheckedChange={setC}
          desc="Promote the build to staging immediately after the green checks land.">
  Auto-promote
</Checkbox>`}
      >
        <div style={{display:'flex', flexDirection:'column', gap: 10}}>
          <SingleDemo/>
        </div>
      </Frame>

      {/* Indeterminate / select-all */}
      <SubHead meta="tri-state · select-all">Indeterminate</SubHead>
      <Frame
        label="parent reflects partial child state"
        code={`// Parent shows three states based on child selections:
//   - none picked  → unchecked
//   - some picked  → indeterminate
//   - all picked   → checked
const all  = picked.size === items.length
const some = picked.size > 0 && !all

<Checkbox
  checked={all}
  indeterminate={some}
  onCheckedChange={toggleAll}
>
  Select all services
</Checkbox>`}
      >
        <SelectAllDemo/>
      </Frame>
      <p style={{fontSize: 'var(--text-body)', color:'var(--fg-muted)', marginBlockStart: 14, lineHeight: 1.6, maxInlineSize:'64ch'}}>
        The native <Mono>:indeterminate</Mono> pseudo-class isn't reflected by the React <Mono>checked</Mono> prop — so the third state is its own boolean <Mono>indeterminate</Mono> prop, set on the element as <Mono>el.indeterminate = true</Mono> inside a ref'd effect. The <Mono>Checkbox</Mono> does this for you; you never pass a string to <Mono>checked</Mono>.
      </p>

      {/* With description */}
      <SubHead meta="two-line">With description</SubHead>
      <Frame
        label="primary label + helper text"
        code={`<Checkbox
  checked={on}
  onCheckedChange={setOn}
  desc="The build is promoted to staging immediately after the green checks land."
>
  Auto-promote on green
</Checkbox>`}
      >
        <DescDemo/>
      </Frame>

      {/* Sizes */}
      <SubHead meta="sm · md · lg">Sizes</SubHead>
      <Frame
        label="14px · 16px · 18px"
        code={`<Checkbox size="sm" checked onCheckedChange={setA}>Small</Checkbox>
<Checkbox size="md" checked onCheckedChange={setB}>Medium (default)</Checkbox>
<Checkbox size="lg" checked onCheckedChange={setC}>Large</Checkbox>`}
        row
      >
        <SizesDemo/>
      </Frame>

      {/* States */}
      <SubHead meta="states">States</SubHead>
      <Frame label="default · checked · indeterminate · disabled · error" row>
        <StatesDemo/>
      </Frame>

      {/* In a form */}
      <SubHead meta="composition · validation">Inside a form</SubHead>
      <Frame
        label="uncheck all to see the live invalid state"
        code={`// Group requires at least one stage. With none picked the
// fieldset is invalid: each box takes error, and a danger
// Alert carries the message (aria-describedby), not colour alone.
const none = !smoke && !e2e && !perf

<fieldset aria-describedby={none ? "stages-err" : undefined}>
  <legend>Test stages</legend>
  <Checkbox error={none} checked={smoke} onCheckedChange={setSmoke}>Smoke</Checkbox>
  {/* …e2e, perf… */}
  {none && (
    <Alert tone="danger" id="stages-err">
      <AlertDescription>Pick at least one stage.</AlertDescription>
    </Alert>
  )}
</fieldset>`}
      >
        <FormFragment/>
      </Frame>

      {/* Accessibility */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginBlockStart: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 8}}>Keyboard</div>
          <dl style={{display:'grid', gridTemplateColumns:'auto 1fr', columnGap: 14, rowGap: 6, margin: 0, fontSize: 'var(--text-base)', lineHeight: 1.5}}>
            <dt><Mono>Tab</Mono> / <Mono>Shift+Tab</Mono></dt><dd style={{margin:0, color:'var(--fg-muted)'}}>Move focus to / from the box. Disabled boxes are skipped.</dd>
            <dt><Mono>Space</Mono></dt><dd style={{margin:0, color:'var(--fg-muted)'}}>Toggle the focused box. A select-all box flips between all and none.</dd>
            <dt><Mono>Enter</Mono></dt><dd style={{margin:0, color:'var(--fg-muted)'}}>No effect — checkboxes never submit; that's the form's job.</dd>
          </dl>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>A native <Mono>input type="checkbox"</Mono>, so role and state are free: <Mono>aria-checked</Mono> reads <em>true</em>, <em>false</em>, or <em>mixed</em> for the indeterminate select-all. The whole <Mono>&lt;label&gt;</Mono> is the accessible name; <Mono>desc</Mono> is exposed through <Mono>aria-describedby</Mono>, and the error state sets <Mono>aria-invalid</Mono> alongside a real message — never colour alone.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The focused box shows the ember focus ring (<Mono>--ring</Mono>) at ≥3:1; the error box swaps it for <Mono>--ring-danger</Mono>. A checked box fills ember and stamps the check in dark ink (<Mono>--ember-fg</Mono>, never ember-on-ember); label (<Mono>--fg</Mono>) and desc (<Mono>--fg-muted</Mono>) both clear AA.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The check / dash mark fades and scales in on toggle via <Mono>--ease</Mono>. Under <Mono>prefers-reduced-motion: reduce</Mono> the global guard collapses the transition to ~0.01ms, so the box reflects state instantly without the stamp animation.</div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label="dir=&quot;rtl&quot; — box leads, label trails"
        code={`<div dir="rtl">
  <Checkbox checked onCheckedChange={setA}>تشغيل اختبارات الدخان</Checkbox>
  <Checkbox indeterminate>إخطار Slack عند الفشل</Checkbox>
  <Checkbox checked onCheckedChange={setB} desc="بعد نجاح الفحوصات.">
    ترقية تلقائية إلى التشغيل التجريبي
  </Checkbox>
</div>`}
      >
        <RTLDemo/>
      </Frame>
      <p style={{fontSize: 'var(--text-body)', color:'var(--fg-muted)', marginBlockStart: 14, lineHeight: 1.6, maxInlineSize:'64ch'}}>
        Box and label sit on the inline-flex axis, so they swap visual order automatically. The <Mono>fc-text</Mono> column inherits text alignment from the document, no per-component override needed.
      </p>

      {/* Anatomy */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 36px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width: 360}} aria-hidden="true">
              <Checkbox checked onChange={()=>{}} desc="The build is promoted automatically.">Auto-promote on green</Checkbox>
              {/* Leader lines */}
              <span className="lead h" style={{top: 8, left: -28, width: 24}}/>
              <span className="lead v" style={{top: -22, left: 8, height: 22}}/>
              <span className="lead v" style={{top: -22, left: 145, height: 38}}/>
              <span className="lead v" style={{top: 50, left: 145, height: 22}}/>
              {/* Pins */}
              <div className="pin" style={{top: -2, left: -52}}>1</div>
              <div className="pin" style={{top: -42, left: 8, transform:'translateX(-50%)'}}>2</div>
              <div className="pin" style={{top: -42, left: 145, transform:'translateX(-50%)'}}>3</div>
              <div className="pin" style={{top: 78, left: 145, transform:'translateX(-50%)'}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Click target.</b> The whole <Mono>&lt;label&gt;</Mono> is clickable, not just the box — small targets are a Fitts' law tax.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Box.</b> 16×16 (sm 14 / lg 18) with a 1.5px <Mono>--border-stronger</Mono> rim. On checked it fills <Mono>--ember</Mono> and stamps a 10px check in dark ink (<Mono>--ember-fg</Mono>).</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Label.</b> Geist Sans <Mono>--text-sm</Mono> in <Mono>--fg</Mono>. One short phrase; avoid trailing periods.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Description (optional).</b> <Mono>--text-sm</Mono> in <Mono>--fg-muted</Mono>, wired to the box via <Mono>aria-describedby</Mono>. Use it for the consequence of the choice, not a restatement of the label.</span>
          </div>
        </div>
      </div>

      {/* When to use */}
      <SubHead meta="when to use">Checkbox vs Radio vs Toggle</SubHead>
      <div className="dd-grid" style={{gridTemplateColumns:'1fr 1fr 1fr'}}>
        <div className="surface" style={{padding: 16}}>
          <div className="ds-h-eyebrow" style={{marginBottom: 6}}>Checkbox</div>
          <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55}}>Independent options. Selecting one doesn't restrict the others. Saved on submit.</div>
        </div>
        <div className="surface" style={{padding: 16}}>
          <div className="ds-h-eyebrow" style={{marginBottom: 6}}>Radio</div>
          <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55}}>Mutually exclusive — exactly one of N. Saved on submit.</div>
        </div>
        <div className="surface" style={{padding: 16}}>
          <div className="ds-h-eyebrow" style={{marginBottom: 6}}>Toggle</div>
          <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55}}>A binary setting that takes effect immediately — no save button.</div>
        </div>
      </div>

      {/* Do/Don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — group with a clear scope</div>
          <div className="body" style={{padding: 14, alignItems:'flex-start'}}>
            <div style={{display:'flex', flexDirection:'column', gap: 8, width:'100%', maxWidth: 240}}>
              <div className="ds-h-eyebrow" style={{margin: 0}}>Notifications</div>
              <Checkbox checked onChange={()=>{}}>Email me about deploys</Checkbox>
              <Checkbox onChange={()=>{}}>Email me about quota</Checkbox>
              <Checkbox checked onChange={()=>{}}>Daily summary at 9am</Checkbox>
            </div>
          </div>
          <div className="note">Each item is independently saved with the same scope label, so the user always knows what they're toggling.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — mutually exclusive</div>
          <div className="body" style={{padding: 14, alignItems:'flex-start'}}>
            <div style={{display:'flex', flexDirection:'column', gap: 8, width:'100%', maxWidth: 240}}>
              <div className="ds-h-eyebrow" style={{margin: 0}}>Plan</div>
              <Checkbox onChange={()=>{}}>Hobby</Checkbox>
              <Checkbox checked onChange={()=>{}}>Pro</Checkbox>
              <Checkbox onChange={()=>{}}>Enterprise</Checkbox>
            </div>
          </div>
          <div className="note">Use Radio when only one selection makes sense — checkboxes here invite the user to pick two plans.</div>
        </div>
      </div>

      {/* 4. API REFERENCE */}
      <SubHead meta="CheckboxProps">API reference</SubHead>
      <AutoPropsTable component="Checkbox" label="<Checkbox />"/>
    </Section>
  );
}

// Sub-demo: with description
const DescDemo = () => {
  const [a, setA] = React.useState(true);
  const [b, setB] = React.useState(false);
  return (
    <div style={{display:'flex', flexDirection:'column', gap: 14, inlineSize:'100%', maxInlineSize: 420}}>
      <Checkbox checked={a} onCheckedChange={setA}
        desc="The build is promoted to staging immediately after the green checks land.">
        Auto-promote on green
      </Checkbox>
      <Checkbox checked={b} onCheckedChange={setB}
        desc="A canary release rolls out to 10% of pods first, with a five-minute soak before the rest.">
        Canary first
      </Checkbox>
    </div>
  );
};

// Sub-demo: form fragment — shows the live validation/error flow. With nothing
// picked the group is *invalid* (every box borders danger + an announced message
// wired via aria-describedby); pick any stage and the error clears. This is the
// shipped truth: `error` is colour on the box, so a real message must carry it.
const FormFragment = () => {
  const [opts, setOpts] = React.useState({ smoke: false, e2e: false, perf: false });
  const flip = (k) => setOpts(o => ({...o, [k]: !o[k]}));
  const none = !opts.smoke && !opts.e2e && !opts.perf;
  return (
    <fieldset style={{border:'none', padding: 0, margin: 0, inlineSize:'100%', maxInlineSize: 420}} aria-describedby={none ? 'stages-err' : undefined}>
      <legend className="t-mono-label" style={{padding: 0, marginBlockEnd: 10}}>Test stages</legend>
      <div style={{display:'flex', flexDirection:'column', gap: 10}}>
        <Checkbox error={none} checked={opts.smoke} onCheckedChange={() => flip('smoke')} desc="≈ 30 seconds, runs on every push.">Smoke</Checkbox>
        <Checkbox error={none} checked={opts.e2e} onCheckedChange={() => flip('e2e')} desc="≈ 8 minutes, runs on the merge queue.">End-to-end</Checkbox>
        <Checkbox error={none} checked={opts.perf} onCheckedChange={() => flip('perf')} desc="≈ 22 minutes, runs nightly on main.">Performance</Checkbox>
      </div>
      {none
        ? (
          <div style={{marginBlockStart: 12}}>
            <Alert tone="danger" id="stages-err">
              <AlertDescription>Pick at least one stage — leaving all unchecked blocks the deploy.</AlertDescription>
            </Alert>
          </div>
        )
        : <div style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)', marginBlockStart: 12}}>{[opts.smoke, opts.e2e, opts.perf].filter(Boolean).length} of 3 stages will run on this deploy.</div>}
    </fieldset>
  );
};

// Sub-demo: RTL
const RTLDemo = () => {
  const [a, setA] = React.useState(true);
  const [b, setB] = React.useState(false);
  return (
    <div dir="rtl" style={{display:'flex', flexDirection:'column', gap: 10, inlineSize:'100%', maxInlineSize: 360}}>
      <Checkbox checked={a} onCheckedChange={setA}>تشغيل اختبارات الدخان</Checkbox>
      <Checkbox indeterminate>إخطار Slack عند الفشل</Checkbox>
      <Checkbox checked={b} onCheckedChange={setB} desc="بعد نجاح الفحوصات الخضراء مباشرةً.">ترقية تلقائية إلى التشغيل التجريبي</Checkbox>
    </div>
  );
};
