'use client';
// Eidos Mobile — Text field. A single-line input sized for a thumb and the on-screen
// keyboard: a persistent label above the box, an optional leading icon, a clear affordance,
// and a helper line that becomes the error message in place. Never a placeholder-as-label.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

function Field({
  label, value, onChange, placeholder, icon, helper, error, type = 'text', inputMode, disabled,
}: {
  label: string; value: string; onChange?: (v: string) => void; placeholder?: string;
  icon?: React.ReactNode; helper?: string; error?: string; type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']; disabled?: boolean;
}) {
  const invalid = !!error;
  const reactId = React.useId();
  const helpId = (helper || error) ? `${reactId}-help` : undefined;
  // Rest/invalid border only — the focus ring is the canonical :focus-visible
  // outline from ds.css (the input keeps its native outline; we never set
  // outline:none), so keyboard/switch-control users get a real, consistent ring.
  const borderColor = invalid ? 'var(--danger)' : 'var(--border-strong)';
  return (
    <label style={{ display: 'block', opacity: disabled ? 0.55 : 1 }}>
      <span style={{ display: 'block', fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 6 }}>{label}</span>
      <span
        style={{
          display: 'flex', alignItems: 'center', gap: 8, height: 46, padding: '0 12px',
          borderRadius: 'var(--radius-md)', background: 'var(--surface)',
          border: `1.5px solid ${borderColor}`,
        }}
      >
        {icon && <span style={{ color: invalid ? 'var(--danger)' : 'var(--fg-faint)', display: 'flex' }}>{icon}</span>}
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          aria-invalid={invalid || undefined}
          aria-describedby={helpId}
          style={{ flex: 1, minWidth: 0, border: 'none', background: 'none', color: 'var(--fg)', fontSize: 'var(--text-sm)', fontFamily: 'inherit', borderRadius: 'var(--radius-sm)' }}
        />
        {value && !disabled && (
          <button type="button" onClick={() => onChange?.('')} aria-label="Clear" style={{ display: 'grid', placeItems: 'center', width: 22, height: 22, borderRadius: 999, border: 'none', background: 'var(--surface-active)', color: 'var(--fg-muted)', cursor: 'pointer' }}>
            <Icons.x size={12} />
          </button>
        )}
      </span>
      {(helper || error) && (
        <span id={helpId} role={invalid ? 'alert' : undefined} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-base)', lineHeight: 1.45, marginBlockStart: 6, color: invalid ? 'var(--danger)' : 'var(--fg-muted)' }}>
          {invalid && <Icons.alert size={12} aria-hidden="true" />}
          <span>{error || helper}</span>
        </span>
      )}
    </label>
  );
}

function FieldScreen() {
  const [name, setName] = React.useState('payments-api');
  const [email, setEmail] = React.useState('on-call');
  return (
    <div style={{ padding: '58px 18px 0', height: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.02em' }}>New service</div>
      <Field label="Service name" value={name} onChange={setName} inputMode="text" icon={<Icons.server size={15} />} helper="Lowercase, hyphenated" />
      <Field label="On-call alias" value={email} onChange={setEmail} type="email" inputMode="email" icon={<Icons.bell size={15} />} error="Must be a full email address" />
      <Field label="Repo URL" value="" onChange={() => {}} type="url" inputMode="url" placeholder="github.com/org/repo" icon={<Icons.gitFork size={15} />} />
    </div>
  );
}

export default function MobileTextField() {
  return (
    <Section
      id="text-field"
      num="01"
      title="Text field"
      desc="A single-line input for short free text on a handset — persistent label above, thumb-friendly height, and a helper line that becomes the error in the same spot without layout shift."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Never use a placeholder as the label — it disappears on focus and the user loses context. The label lives above the box and stays visible throughout the interaction.</Lede>
      <Frame label="Persistent label · leading icon · clear button · inline helper/error" center>
        <DeviceFrame initial="iphone-se"><FieldScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="states">States</SubHead>
      <Lede>Tab into any field below: the box keeps its rest border and shows the canonical ember focus ring — a real <Mono>:focus-visible</Mono> outline, not a hover-style swap. The error row carries a leading icon and an alert icon on the message, so it never relies on red alone. The reserved helper line means the box height never changes between states.</Lede>
      <Frame label="Rest · focus (Tab in) · filled with clear · error · disabled — the box height never changes">
        <div style={{ display: 'grid', gap: 16, maxWidth: 320, margin: '0 auto', padding: '8px 0' }}>
          <Field label="Rest" value="" onChange={() => {}} inputMode="text" placeholder="empty" helper="Helper line is always reserved" />
          <Field label="Filled" value="identity-svc" onChange={() => {}} inputMode="text" icon={<Icons.server size={15} />} />
          <Field label="Error" value="payments_api" onChange={() => {}} inputMode="text" icon={<Icons.server size={15} />} error="Name is already taken" />
          <Field label="Disabled" value="locked" onChange={() => {}} icon={<Icons.lock size={15} />} disabled />
        </div>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 300 }} aria-hidden="true">
              <span style={{ display: 'block', fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 6 }}>Service name</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, height: 46, padding: '0 12px', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1.5px solid var(--border-strong)', outline: 'var(--ring-width) solid var(--ring)', outlineOffset: 'var(--ring-offset)' }}>
                <Icons.server size={15} color="var(--fg-faint)" />
                <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>payments-api</span>
                <span style={{ display: 'grid', placeItems: 'center', width: 22, height: 22, borderRadius: 999, background: 'var(--surface-active)', color: 'var(--fg-muted)' }}><Icons.x size={12} /></span>
              </span>
              <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginBlockStart: 6 }}>Lowercase, hyphenated</span>
              <span className="lead h" style={{ top: 4, left: -28, width: 24 }} />
              <span className="lead v" style={{ top: 24, left: 22, height: 14 }} />
              <span className="lead h" style={{ top: 44, right: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 4, left: -28, width: 24 }} />
              <div className="pin" style={{ top: -6, left: -52 }}>1</div>
              <div className="pin" style={{ top: 32, left: -4 }}>2</div>
              <div className="pin" style={{ top: 34, right: -52 }}>3</div>
              <div className="pin" style={{ bottom: -6, left: -52 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Label.</b> Persistent, above the box — it never collapses into a placeholder, so it stays readable while typing.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Box + leading icon.</b> 46px tall on <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--surface</code>; keyboard focus shows the canonical <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--ring</code> outline. An optional monoline icon hints the input type and turns <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--danger</code> when invalid.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Clear.</b> A trailing chip that empties the field in one tap — faster than backspacing on a handset.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Helper / error.</b> One reserved line; helper text and the error share the slot so nothing reflows when validation fails.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Touch &amp; keyboard type</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The box is 46px tall and full-width. Each field sets <Mono>type</Mono>/<Mono>inputMode</Mono> — <Mono>email</Mono>, <Mono>url</Mono>, <Mono>text</Mono> above — so the OS raises the matching on-screen keyboard.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Label, not placeholder</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>A real <Mono>&lt;label&gt;</Mono> wraps every input, so the box is always named. Placeholders vanish on type and fail contrast — they&apos;re hints, never the label.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Errors announced</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Invalid fields set <Mono>aria-invalid</Mono> and link the message via <Mono>aria-describedby</Mono>; the live message carries <Mono>role=&quot;alert&quot;</Mono> and an alert icon — never red alone.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus visible</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The input keeps its native outline, so the canonical <Mono>:focus-visible</Mono> ember ring (<Mono>--ring</Mono>) shows on keyboard / switch-control focus — no JS-driven hover swap to miss.</div>
        </div>
      </div>
      <div className="surface" style={{ marginTop: 12, padding: '14px 18px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBlockEnd: 10 }}>Keyboard map</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', columnGap: 18, rowGap: 8, fontSize: 'var(--text-base)', lineHeight: 1.5 }}>
          <Mono>Tab</Mono><span style={{ color: 'var(--fg-muted)' }}>Move focus into the field; the ember focus ring appears.</span>
          <Mono>Esc</Mono><span style={{ color: 'var(--fg-muted)' }}>Native — cancels an IME / autocomplete composition in the input.</span>
          <Mono>Tab → Enter / Space</Mono><span style={{ color: 'var(--fg-muted)' }}>Reach the trailing Clear button (its own tab stop) and activate it.</span>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — label and helper align to the start; leading icon flips right, clear flips left'} center code={`<div dir="rtl"><Field label="اسم الخدمة" value="payments-api" icon={<Icons.server size={15} />} helper="أحرف صغيرة، بشرطة" /></div>`} lang="tsx">
        <div dir="rtl">
          <div style={{ display: 'grid', gap: 16, maxWidth: 320, margin: '0 auto', padding: '8px 0' }}>
            <Field label="اسم الخدمة" value="payments-api" onChange={() => {}} inputMode="text" icon={<Icons.server size={15} />} helper="أحرف صغيرة، بشرطة" />
            <Field label="تنبيه المناوبة" value="on-call" onChange={() => {}} type="email" inputMode="email" icon={<Icons.bell size={15} />} error="يجب أن يكون عنوان بريد كامل" />
          </div>
        </div>
      </Frame>
      <Lede>Under <Mono>dir="rtl"</Mono> the persistent label and helper / error text align to the start (the right), the leading icon flips to the right and the clear chip to the left, and the caret and typing direction follow the script — all from logical properties, no per-field overrides.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — keep the label, reserve the helper line</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <Field label="Service name" value="payments-api" onChange={() => {}} helper="Lowercase, hyphenated" />
          </div>
          <div className="note">Label persists, helper sits in a fixed slot, so an error swaps in without shifting the form.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — placeholder as the only label</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <span style={{ display: 'flex', alignItems: 'center', height: 46, padding: '0 12px', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--fg-faint)', fontSize: 'var(--text-sm)' }}>Service name</span>
          </div>
          <div className="note">Once the user types, the only label is gone — and grey placeholder text fails contrast to begin with.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="text field"
        lang="tsx"
        code={`<label className="m-field" data-invalid={!!error}>
  <span className="m-field-label">On-call alias</span>
  <span className="m-field-box">
    <Icons.bell size={15} />          {/* tints --danger when invalid */}
    <input type="email" inputMode="email"  {/* OS shows the email keyboard */}
      aria-invalid={!!error || undefined}
      aria-describedby="svc-help" />  {/* input keeps its native outline */}
    {value && <button aria-label="Clear">✕</button>}  {/* own tab stop */}
  </span>
  <span id="svc-help" role={error ? 'alert' : undefined} className="m-field-help">
    {error && <Icons.alert size={12} />}{error ?? helper}
  </span>
</label>

/* box 46px; focus: canonical :focus-visible var(--ring); invalid: --danger */`}
      />
    </Section>
  );
}
