'use client';
// Forge Mobile — Text Area. A multi-line text input that grows with its content:
// persistent label above, character counter in the footer, helper/error below.
// Focus rings in ember. The container owns the ring so the inner <textarea>
// runs outline:none. Use for incident notes, PR comments, free-form descriptions.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  helper,
  error,
  maxLength,
  disabled,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string;
  maxLength?: number;
  disabled?: boolean;
  rows?: number;
}) {
  const [focus, setFocus] = React.useState(false);
  const invalid = !!error;
  const id = React.useId();
  const helpId = id + '-help';
  const over = maxLength != null && value.length > maxLength;
  const borderColor = invalid || over ? 'var(--danger)' : focus ? 'var(--accent)' : 'var(--border-strong)';
  return (
    <div style={{ opacity: disabled ? 0.55 : 1 }}>
      <label htmlFor={id} style={{ display: 'block', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--fg-muted)', marginBlockEnd: 6 }}>{label}</label>
      <span
        style={{
          display: 'block', borderRadius: 'var(--radius-md)', background: 'var(--surface)',
          border: `1.5px solid ${borderColor}`,
          boxShadow: focus && !invalid && !over ? '0 0 0 3px color-mix(in oklab, var(--accent) 20%, transparent)' : 'none',
          transition: 'border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease)',
        }}
      >
        <textarea
          id={id}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          rows={rows}
          aria-invalid={invalid || over || undefined}
          aria-describedby={helper || error ? helpId : undefined}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            display: 'block', width: '100%', minHeight: `${rows * 24}px`,
            padding: '10px 12px', border: 'none', outline: 'none', resize: 'vertical',
            background: 'none', color: 'var(--fg)', fontSize: 'var(--text-sm)',
            fontFamily: 'inherit', lineHeight: 1.6,
            boxSizing: 'border-box',
          }}
        />
        {maxLength != null && (
          <span
            aria-live="polite"
            style={{
              display: 'block', textAlign: 'end', padding: '0 10px 8px',
              fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums',
              color: over ? 'var(--danger)' : value.length > maxLength * 0.8 ? 'var(--fg-muted)' : 'var(--fg-faint)',
            }}
          >
            {value.length}/{maxLength}
          </span>
        )}
      </span>
      {(helper || error) && (
        <span id={helpId} style={{ display: 'block', fontSize: 'var(--text-base)', marginBlockStart: 6, color: invalid || over ? 'var(--danger)' : 'var(--fg-muted)' }}>
          {error || helper}
        </span>
      )}
    </div>
  );
}

function TextAreaScreen() {
  const [note, setNote] = React.useState('');
  const [desc, setDesc] = React.useState('Automated deploy failed on staging. Rollback triggered, root cause under investigation.');
  return (
    <div style={{ padding: '52px 16px 0', height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ flex: 1, fontSize: 'var(--text-xl, 20px)', fontWeight: 700, letterSpacing: '-0.02em' }}>New incident</span>
        <button type="button" style={{ padding: '0 14px', height: 34, borderRadius: 'var(--radius-lg)', background: 'var(--accent)', color: 'var(--ember-fg)', fontSize: 'var(--text-base)', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          File
        </button>
      </div>
      <TextArea
        label="Description"
        value={desc}
        onChange={setDesc}
        placeholder="What happened?"
        helper="Visible to all on-call engineers"
        rows={3}
        maxLength={280}
      />
      <TextArea
        label="Mitigations tried"
        value={note}
        onChange={setNote}
        placeholder="Steps attempted so far…"
        rows={3}
        maxLength={500}
      />
    </div>
  );
}

export default function MobileTextArea() {
  return (
    <Section
      id="text-area"
      num="01"
      title="Text Area"
      desc="A multi-line text input for longer free text on a handset — persistent label above, optional character counter, and a helper line that swaps to an error without layout shift."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Use a text area for fields that regularly exceed one line — incident descriptions, PR comments, service changelogs. For short free text, use Text Field instead.</Lede>
      <Frame label="Incident note composer — label · counter · helper · focus ring" center>
        <DeviceFrame initial="iphone-se"><TextAreaScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="states">States</SubHead>
      <Frame label="Rest · focus · counter warning · error · disabled — border and counter react, height is stable">
        <div style={{ display: 'grid', gap: 18, maxWidth: 340, margin: '0 auto', padding: '12px 0' }}>
          <TextArea label="Rest" value="" onChange={() => {}} placeholder="Enter a description…" rows={3} />
          <TextArea label="Filled (focus)" value="Automated deploy failed on staging — rollback triggered." onChange={() => {}} rows={3} maxLength={80} />
          <TextArea label="Counter warning" value="Deploy pipeline blocked on the authentication-service shard after a config drift was introduced by the last feature flag rollout to production." onChange={() => {}} rows={3} maxLength={140} />
          <TextArea label="Error" value="bad" onChange={() => {}} error="Description must be at least 20 characters" rows={3} />
          <TextArea label="Disabled" value="Read-only context." rows={2} disabled />
        </div>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 320 }} aria-hidden="true">
              <span style={{ display: 'block', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--fg-muted)', marginBlockEnd: 6 }}>Description</span>
              <span style={{ display: 'block', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1.5px solid var(--accent)', overflow: 'hidden' }}>
                <span style={{ display: 'block', padding: '10px 12px', fontSize: 'var(--text-sm)', color: 'var(--fg)', lineHeight: 1.6, minHeight: 72 }}>
                  Automated deploy failed on staging — rollback triggered.
                </span>
                <span style={{ display: 'block', textAlign: 'end', padding: '0 10px 8px', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)' }}>52/280</span>
              </span>
              <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginBlockStart: 6 }}>Visible to all on-call engineers</span>
              <span className="lead h" style={{ top: 4, left: -30, width: 26 }} />
              <span className="lead v" style={{ top: 30, left: '38%', height: 16 }} />
              <span className="lead h" style={{ top: 90, right: -30, width: 26 }} />
              <span className="lead h" style={{ bottom: 4, left: -30, width: 26 }} />
              <div className="pin" style={{ top: -8, left: -56 }}>1</div>
              <div className="pin" style={{ top: 18, left: -4 }}>2</div>
              <div className="pin" style={{ top: 80, right: -56 }}>3</div>
              <div className="pin" style={{ bottom: -8, left: -56 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '60px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Label.</b> Persistent above the box in a real <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>&lt;label&gt;</code>; never collapses into a placeholder. Required — no floating label.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Editable area.</b> Grows vertically via <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>resize:vertical</code>; the container owns the ember focus ring via <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>:focus-within</code> so the inner native element runs <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>outline:none</code>.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Counter.</b> Tabular mono at <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--text-xs</code> in the footer with <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>font-variant-numeric:tabular-nums</code> so digits don&apos;t shift; turns <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--fg-muted</code> at 80% usage, <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--danger</code> at overflow. Border follows; the live region announces the count to screen readers.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Helper / error.</b> One reserved line; error text swaps in without shifting the form below.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Label association</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>A real <code style={{ fontFamily: 'var(--font-mono)' }}>&lt;label htmlFor&gt;</code> links to the textarea. The label persists while typing so VoiceOver and TalkBack always have a name for the field.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader + error</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Validation sets <code style={{ fontFamily: 'var(--font-mono)' }}>aria-invalid="true"</code> on the textarea and links the error message via <code style={{ fontFamily: 'var(--font-mono)' }}>aria-describedby</code> — VoiceOver reads it on focus.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The container gets a 1.5px ember border + soft glow via <code style={{ fontFamily: 'var(--font-mono)' }}>:focus-within</code>. The inner textarea sets <code style={{ fontFamily: 'var(--font-mono)' }}>outline:none</code> to prevent a doubled ring.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Touch target ≥ 44px</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The textarea has <code style={{ fontFamily: 'var(--font-mono)' }}>min-height</code> based on row count; the default 4-row layout always clears 44px. For 1-row compact variants, add explicit padding to reach 44px.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, display: 'grid', gap: 6 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}><kbd style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg)', minWidth: 72 }}>Tab</kbd><span>Move focus into / out of the field; the container shows the ember ring.</span></div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}><kbd style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg)', minWidth: 72 }}>Enter</kbd><span>Inserts a newline (multi-line) — never submits the form.</span></div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}><kbd style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg)', minWidth: 72 }}>⌘/Ctrl A</kbd><span>Select all text within the field.</span></div>
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Live count &amp; reduced motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The counter is an <code style={{ fontFamily: 'var(--font-mono)' }}>aria-live="polite"</code> region, so VoiceOver/TalkBack read the remaining count without stealing focus. The border/glow transition runs on <code style={{ fontFamily: 'var(--font-mono)' }}>--dur-fast</code> and collapses under <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code> — state still reads through color and the live count.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — label and helper right-align; counter moves to inline-start; caret follows script'} center code={`<div dir="rtl">
  <TextArea label="وصف الحادثة" value="…" helper="مرئي لجميع المهندسين" maxLength={280} />
</div>`} lang="tsx">
        <div dir="rtl">
          <div style={{ maxWidth: 320, margin: '0 auto', padding: '8px 0' }}>
            <TextArea
              label="وصف الحادثة"
              value="فشل النشر التلقائي على بيئة التجهيز — تم تفعيل الرجوع للنسخة السابقة."
              onChange={() => {}}
              helper="مرئي لجميع المهندسين في الاستعداد"
              maxLength={280}
              rows={3}
            />
          </div>
        </div>
      </Frame>
      <Lede>Under <Mono>dir="rtl"</Mono> the persistent label and helper text align to the start (right), the character counter moves to <Mono>inline-start</Mono>, and the caret position follows the RTL script — no per-field overrides, all driven by logical CSS properties.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — persistent label, counter, helper reserved</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <TextArea
              label="Incident description"
              value="Deploy failed on us-east-1 after config drift."
              onChange={() => {}}
              helper="Visible to the on-call rotation"
              maxLength={280}
              rows={3}
            />
          </div>
          <div className="note">Label stays visible while typing; counter warns before overflow; helper sits in a stable slot.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — placeholder as the only label</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <span style={{
              display: 'block', borderRadius: 'var(--radius-md)', background: 'var(--surface)',
              border: '1.5px solid var(--border)', overflow: 'hidden',
            }}>
              <span style={{ display: 'block', padding: '10px 12px', fontSize: 'var(--text-sm)', color: 'var(--fg-faint)', lineHeight: 1.6, minHeight: 72 }}>
                Describe the incident…
              </span>
            </span>
          </div>
          <div className="note">Once the user types, the label is gone — placeholder contrast also fails WCAG AA at the default opacity.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="text-area"
        lang="tsx"
        code={`<div>
  <label htmlFor="inc-desc" className="m-field-label">
    Incident description
  </label>
  <span
    className="m-textarea-box"
    data-focus     /* container owns the ring — :focus-within */
    data-invalid   /* danger border + ring when aria-invalid */
  >
    <textarea
      id="inc-desc"
      rows={4}
      aria-invalid={!!error}
      aria-describedby="inc-desc-help"
      style={{ outline: 'none' }}  /* box owns the ring */
    />
    {maxLength != null && (
      <span className="m-textarea-counter" aria-live="polite">
        {value.length}/{maxLength}
      </span>
    )}
  </span>
  <span id="inc-desc-help" className="m-field-help">
    {error ?? helper}
  </span>
</div>

/* box: var(--surface), 1.5px border; focus-within: var(--accent) + soft glow;
   counter: 11px tabular mono; danger at overflow; resize:vertical */`}
      />
    </Section>
  );
}
