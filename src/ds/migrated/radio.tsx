'use client';
// Eidos DS — Components / Radio.
// Mutually-exclusive choice from a known set. Always rendered as a group
// — a single radio is a UX anti-pattern. Two visual variants: classic
// row of small radios, and full-bleed radio cards for richer choices.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs, Lede, Mono } from '@/ds/core';



  const USAGE_CODE = `import { RadioGroup } from "@/components/forge/radio-group"

export function Demo() {
  const [value, setValue] = React.useState("canary")
  return (
    <RadioGroup
      ariaLabel="Rollout strategy"
      value={value}
      onChange={setValue}
      options={[
        { label: "All at once",  value: "all" },
        { label: "Canary 10%",   value: "canary" },
        { label: "Blue / green", value: "blue" },
      ]}
    />
  )
}`;

  // Single radio primitive — almost identical to Checkbox, but circular
  // and bound to a `name` so the browser's native group semantics work.
  const Radio = (props) => {
    const id = props.id || React.useId();
    const size = props.size || 'md';
    const cls = ['fc']
      .concat(size !== 'md' ? [size] : [])
      .concat(props.desc ? ['block'] : [])
      .join(' ');
    return (
      <label className={cls} aria-disabled={props.disabled || undefined}>
        <input
          id={id}
          type="radio"
          name={props.name}
          className="fc-input"
          checked={!!props.checked}
          onChange={props.onChange || (() => {})}
          disabled={props.disabled}
        />
        <span className="fc-radio-box" aria-hidden="true">
          <span className="fc-radio-dot"/>
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

  // Radio group — controlled. Pass items as { value, label, desc?, disabled? }.
  // `direction` switches between vertical (default) and horizontal (chip-row).
  const RadioGroup = (props) => {
    const name = props.name || React.useId();
    const direction = props.direction || 'vertical';
    return (
      <div role="radiogroup" aria-label={props.ariaLabel}
        style={{display:'flex', flexDirection: direction === 'horizontal' ? 'row' : 'column', gap: direction === 'horizontal' ? 18 : 10, flexWrap: direction === 'horizontal' ? 'wrap' : 'nowrap'}}>
        {props.items.map(it => (
          <Radio
            key={it.value}
            name={name}
            checked={props.value === it.value}
            onChange={() => props.onChange && props.onChange(it.value)}
            desc={it.desc}
            disabled={it.disabled}
          >{it.label}</Radio>
        ))}
      </div>
    );
  };

  // Radio card — entire surface is the click target. Uses the same
  // <input>+visual-box pattern, but wraps the whole row in `.fc-card` so
  // hover/checked styles light up the whole panel.
  const RadioCard = (props) => {
    const id = props.id || React.useId();
    const checked = !!props.checked;
    return (
      <label
        className={'fc-card' + (checked ? ' checked' : '') + (props.disabled ? ' disabled' : '')}
        aria-disabled={props.disabled || undefined}
        style={props.disabled ? {opacity: 0.5, cursor:'not-allowed'} : undefined}
      >
        <input
          id={id}
          type="radio"
          name={props.name}
          className="fc-input"
          checked={checked}
          onChange={props.onChange || (() => {})}
          disabled={props.disabled}
        />
        <span className="fc-radio-box" aria-hidden="true">
          <span className="fc-radio-dot"/>
        </span>
        <span className="fc-text" style={{flex: 1}}>
          <span className="fc-label" style={{fontSize: 'var(--text-md)', fontWeight: 500}}>{props.title}</span>
          {props.desc && <span className="fc-desc">{props.desc}</span>}
          {props.meta && <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums', color:'var(--fg-subtle)', marginBlockStart: 4}}>{props.meta}</span>}
        </span>
      </label>
    );
  };

  // Stateful demos
  const VerticalDemo = () => {
    const [v, setV] = React.useState('canary');
    return (
      <RadioGroup
        ariaLabel="Rollout strategy"
        value={v} onChange={setV}
        items={[
          { value: 'all',    label: 'All at once',  desc: 'Roll out to 100% of pods immediately. Fastest, riskiest.' },
          { value: 'canary', label: 'Canary 10%',   desc: 'Roll out to 10% first, soak for 5 minutes, then promote.' },
          { value: 'blue',   label: 'Blue / green', desc: 'Spin up a parallel fleet. Switch traffic in one cut.' },
        ]}
      />
    );
  };

  const HorizontalDemo = () => {
    const [v, setV] = React.useState('eu');
    return (
      <RadioGroup
        direction="horizontal"
        ariaLabel="Region"
        value={v} onChange={setV}
        items={[
          { value: 'us', label: 'us-east' },
          { value: 'eu', label: 'eu-west' },
          { value: 'ap', label: 'ap-south' },
          { value: 'sa', label: 'sa-east' },
        ]}
      />
    );
  };

  const SizesDemo = () => {
    const [v, setV] = React.useState('b');
    return (
      <>
        <Radio name="sz-sm" size="sm" checked={v==='a'} onChange={()=>setV('a')}>Small</Radio>
        <Radio name="sz-md" size="md" checked={v==='b'} onChange={()=>setV('b')}>Medium (default)</Radio>
        <Radio name="sz-lg" size="lg" checked={v==='c'} onChange={()=>setV('c')}>Large</Radio>
      </>
    );
  };

  const StatesDemo = () => (
    <>
      <Radio name="s1" onChange={()=>{}}>Default</Radio>
      <Radio name="s2" checked onChange={()=>{}}>Checked</Radio>
      <Radio name="s3" disabled onChange={()=>{}}>Disabled</Radio>
      <Radio name="s4" checked disabled onChange={()=>{}}>Disabled checked</Radio>
    </>
  );

  // Card variant — the highest-signal use of radio. Pricing tiers, plans, deploy strategies.
  const CardsDemo = () => {
    const [v, setV] = React.useState('pro');
    const items = [
      { value: 'hobby', title: 'Hobby',      desc: 'Up to 3 services, 1 environment. No SLA.', meta: 'Free' },
      { value: 'pro',   title: 'Pro',        desc: '20 services, 4 environments. 99.9% SLA, business-hours support.', meta: '$120 / month' },
      { value: 'team',  title: 'Team',       desc: 'Unlimited services, custom environments. 24/7 support.', meta: '$480 / month' },
      { value: 'ent',   title: 'Enterprise', desc: 'Dedicated infrastructure, custom contracts.', meta: 'Talk to sales' },
    ];
    return (
      <div role="radiogroup" aria-label="Plan" style={{display:'flex', flexDirection:'column', gap: 10, width:'100%', maxWidth: 480}}>
        {items.map(it => (
          <RadioCard
            key={it.value}
            name="plan"
            checked={v === it.value}
            onChange={() => setV(it.value)}
            title={it.title}
            desc={it.desc}
            meta={it.meta}
          />
        ))}
      </div>
    );
  };

  const RTLDemo = () => {
    const [v, setV] = React.useState('canary');
    return (
      <div dir="rtl" style={{width:'100%', maxWidth: 480}}>
        <RadioGroup
          ariaLabel="استراتيجية النشر"
          value={v} onChange={setV}
          items={[
            { value: 'all',    label: 'دفعة واحدة', desc: 'النشر إلى 100٪ من الحاويات فورًا. الأسرع، الأكثر مخاطرة.' },
            { value: 'canary', label: 'Canary 10٪', desc: 'البدء بـ 10٪، الانتظار 5 دقائق، ثم الترقية.' },
            { value: 'blue',   label: 'أزرق / أخضر', desc: 'تشغيل أسطول موازٍ، ثم تبديل حركة المرور دفعة واحدة.' },
          ]}
        />
      </div>
    );
  };

export default function Page() {
    return (
    <Section
      id="radio"
      title="Radio"
      desc="Pick exactly one from a small, named set. Always rendered as a group. For five or more options, use a select; for two or three, radios are clearer than a dropdown."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('radio-group')} ariaLabel="package manager"/>
      <Lede>
        Ships <Mono>radio-group.tsx</Mono> as native radio inputs bound to one <Mono>name</Mono> — arrow-key navigation, group semantics, and form submission are native.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <div style={{width:'100%', maxWidth: 360}}>
          <VerticalDemo/>
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

      {/* Default — vertical */}
      <SubHead meta="vertical · descriptions">Default</SubHead>
      <Frame
        label="standard radio group"
        code={`<RadioGroup
  ariaLabel="Rollout strategy"
  value={value}
  onChange={setValue}
  options={[
    { label: "All at once", value: "all" },
    {
      label: "Canary 10%",
      value: "canary",
      description: "Roll out to 10% first, soak for 5 minutes, then promote.",
    },
    { label: "Blue / green", value: "blue" },
  ]}
/>`}
      >
        <div style={{width:'100%', maxWidth: 480}}>
          <VerticalDemo/>
        </div>
      </Frame>

      {/* Horizontal */}
      <SubHead meta="horizontal · short labels">Horizontal</SubHead>
      <Frame
        label="chip row · region selector"
        code={`<RadioGroup
  inline
  ariaLabel="Region"
  value={region}
  onChange={setRegion}
  options={[
    { label: "us-east",  value: "us" },
    { label: "eu-west",  value: "eu" },
    { label: "ap-south", value: "ap" },
    { label: "sa-east",  value: "sa" },
  ]}
/>`}
      >
        <HorizontalDemo/>
      </Frame>

      {/* Cards */}
      <SubHead meta="card variant">Radio cards</SubHead>
      <Frame
        label="entire panel is the target — best for plans, tiers, modes"
        code={`<RadioCardGroup
  ariaLabel="Plan"
  value={plan}
  onValueChange={setPlan}
  options={[
    {
      value: "pro",
      title: "Pro",
      description: "20 services, 4 environments. 99.9% SLA.",
    },
  ]}
/>`}
      >
        <CardsDemo/>
      </Frame>
      <p style={{fontSize: 'var(--text-body)', color:'var(--fg-muted)', marginBlockStart: 14, lineHeight: 1.6, maxWidth:'64ch'}}>
        Card variant inherits the same accessibility contract as plain radios — the input is real, the visual chrome is decorative. Tab keys move between cards, arrow keys move within the group.
      </p>

      {/* Sizes */}
      <SubHead meta="sm · md · lg">Sizes</SubHead>
      <Frame label="14px · 16px · 18px" row>
        <SizesDemo/>
      </Frame>

      {/* States */}
      <SubHead meta="states">States</SubHead>
      <Frame label="default · checked · disabled" row>
        <StatesDemo/>
      </Frame>

      {/* Accessibility */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginBlockStart: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The group is a single tab stop: <Mono>Tab</Mono> lands on the checked radio (or the first one if none is selected), then <Mono>↑</Mono> <Mono>↓</Mono> <Mono>←</Mono> <Mono>→</Mono> move selection between options and wrap at the ends. Selection follows focus, so arrowing both moves and chooses — there is no separate <Mono>Space</Mono> step.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The set is a <Mono>role="radiogroup"</Mono> named by its group label (<Mono>aria-labelledby</Mono>); each option is a native radio (or <Mono>role="radio"</Mono> with <Mono>aria-checked</Mono>). Per-option descriptions are tied in with <Mono>aria-describedby</Mono>, and the position is announced ("2 of 4").</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The focused radio shows the offset <Mono>--ring</Mono> at ≥3:1 against the surface; the card variant rings the whole tappable card. Selected state is never colour-only — the ember dot and the card's ember border carry the state alongside the <Mono>aria-checked</Mono> value — and labels, descriptions, and the control outline clear AA contrast on the surface.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>On selection the dot scales from 0 → 1 with a small overshoot (<Mono>--dur</Mono> on a spring ease) — the same curve as the toggle thumb, so the family reads as one. Under <Mono>prefers-reduced-motion: reduce</Mono> the transition is dropped and the dot appears instantly, with no scale.</div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label="dir=&quot;rtl&quot; — radio leads, label trails"
        code={`<div dir="rtl">
  <RadioGroup
    ariaLabel="استراتيجية النشر"
    value={value}
    onChange={setValue}
    options={[
      { label: "دفعة واحدة", value: "all" },
      { label: "Canary ١٠٪", value: "canary" },
      { label: "أزرق / أخضر", value: "blue" },
    ]}
  />
</div>`}
      >
        <RTLDemo/>
      </Frame>

      {/* Anatomy */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 36px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width: 360}} aria-hidden="true">
              <Radio checked onChange={()=>{}} desc="Roll out to 10% first, soak for 5 minutes.">Canary 10%</Radio>
              <span className="lead h" style={{top: 8, left: -28, width: 24}}/>
              <span className="lead v" style={{top: -22, left: 8, height: 22}}/>
              <span className="lead v" style={{top: -22, left: 110, height: 38}}/>
              <span className="lead v" style={{top: 50, left: 110, height: 22}}/>
              <div className="pin" style={{top: -2, left: -52}}>1</div>
              <div className="pin" style={{top: -42, left: 8, transform:'translateX(-50%)'}}>2</div>
              <div className="pin" style={{top: -42, left: 110, transform:'translateX(-50%)'}}>3</div>
              <div className="pin" style={{top: 78, left: 110, transform:'translateX(-50%)'}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Click target.</b> The whole label, including the description.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Box.</b> 16×16 circle. On checked, the inner dot animates in with a small overshoot — same spring as the toggle thumb, locking the family together.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Label.</b> Geist Sans at the small text size. The choice itself, in 1–3 words.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Description (optional).</b> Use it to disambiguate similar choices. Keep to one line at 480px.</span>
          </div>
        </div>
      </div>

      {/* Do/Don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — 2 to 5 known options</div>
          <div className="body" style={{padding: 14, alignItems:'flex-start'}}>
            <div style={{display:'flex', flexDirection:'column', gap: 8}}>
              <Radio name="do1" checked onChange={()=>{}}>Public</Radio>
              <Radio name="do1" onChange={()=>{}}>Unlisted</Radio>
              <Radio name="do1" onChange={()=>{}}>Private</Radio>
            </div>
          </div>
          <div className="note">All options visible at once means no extra click to pick. Above five, switch to a select.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — independent options</div>
          <div className="body" style={{padding: 14, alignItems:'flex-start'}}>
            <div style={{display:'flex', flexDirection:'column', gap: 8}}>
              <Radio name="dont1" checked onChange={()=>{}}>Send daily summary</Radio>
              <Radio name="dont1" onChange={()=>{}}>Send incident alerts</Radio>
              <Radio name="dont1" onChange={()=>{}}>Send weekly digest</Radio>
            </div>
          </div>
          <div className="note">These should be three separate checkboxes — the user might want all three. Radio forces them to choose one.</div>
        </div>
      </div>

      {/* 4. API REFERENCE */}
      <SubHead meta="RadioGroupProps">API reference</SubHead>
      <PropsTable
        label="<RadioGroup />"
        rows={[
          { prop: 'options', type: 'RadioOption[]', required: true, description: 'The choices. Each is { label, value, description?, disabled? } — the group is declarative, not children.' },
          { prop: 'value', type: 'string', description: 'Controlled selected value. Matches the `value` of one option.' },
          { prop: 'defaultValue', type: 'string', description: 'Uncontrolled initial selection.' },
          { prop: 'onChange', type: '(value: string) => void', description: 'Fires with the new value when the user selects a different option.' },
          { prop: 'inline', type: 'boolean', default: 'false', description: 'Lay options out in a row instead of a column.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the entire group at once.' },
          { prop: 'name', type: 'string', description: 'Shared native form name for every radio input (auto-generated if omitted).' },
          { prop: 'ariaLabel', type: 'string', description: 'Accessible name for the role="radiogroup" wrapper.' },
          { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Box footprint, applied to every option.' },
        ]}
      />
      <PropsTable
        label="RadioOption"
        rows={[
          { prop: 'value', type: 'string', required: true, description: 'The value committed to the group when this option is selected.' },
          { prop: 'label', type: 'React.ReactNode', required: true, description: 'The choice itself, in 1–3 words.' },
          { prop: 'description', type: 'React.ReactNode', description: 'Optional helper text under the label.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables this option only.' },
        ]}
      />
      <PropsTable
        label="<RadioCardGroup />"
        rows={[
          { prop: 'options', type: 'RadioCardOption[]', required: true, description: 'The cards. Each is { value, title, description?, icon?, disabled? }.' },
          { prop: 'value', type: 'string', description: 'Controlled selected value.' },
          { prop: 'defaultValue', type: 'string', description: 'Uncontrolled initial selection.' },
          { prop: 'onValueChange', type: '(value: string) => void', description: 'Fires with the new value when a card is selected.' },
          { prop: 'orientation', type: '"vertical" | "horizontal"', default: '"vertical"', description: 'Group layout — column of cards (default) or a row.' },
          { prop: 'cardOrientation', type: '"horizontal" | "vertical"', default: '"horizontal"', description: 'How each card lays out its control + content.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the entire group.' },
          { prop: 'name', type: 'string', description: 'Shared native form name (auto-generated if omitted).' },
          { prop: 'ariaLabel', type: 'string', description: 'Accessible name for the role="radiogroup" wrapper.' },
        ]}
      />
    </Section>
    );
  }
