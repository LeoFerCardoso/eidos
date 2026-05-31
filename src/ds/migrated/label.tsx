'use client';
// Eidos DS — Components / Label
// Page: Installation → Usage → Variants → In context → Accessibility → RTL →
//        Anatomy → Do/Don't → API reference
import {
  Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable,
  installTabs, Lede, Mono, Label,
} from '@/ds/core';

// ── Install code ────────────────────────────────────────────────────────────
const INSTALL_TABS = installTabs('label');

// ── Usage snippet ────────────────────────────────────────────────────────────
const USAGE_CODE = `import { Label } from "@/components/forge/label"
import { Input }  from "@/components/forge/input"

export function Demo() {
  return (
    <div className="in-field" style={{ minWidth: 320 }}>
      <Label htmlFor="email">Email</Label>
      <Input id="email" placeholder="you@eidos.com" />
    </div>
  )
}`;

// ── Variants snippet ─────────────────────────────────────────────────────────
const VARIANTS_CODE = `{/* plain */}
<Label htmlFor="name">Full name</Label>

{/* required — ember asterisk + sr-only text */}
<Label htmlFor="name" required>Full name</Label>

{/* optional — muted suffix */}
<Label htmlFor="pronoun" optional>Pronoun</Label>`;

// ── Sizes snippet ─────────────────────────────────────────────────────────────
const SIZES_CODE = `{/* md (default) */}
<Label htmlFor="service">Service name</Label>

{/* sm — compact / nested */}
<Label htmlFor="apikey" size="sm">API key</Label>`;

// ── States snippet ────────────────────────────────────────────────────────────
const STATES_CODE = `{/* disabled label dims with its control */}
<Label htmlFor="locked" disabled>Billing email</Label>`;

// =============================================================================
// PAGE
// =============================================================================
export default function LabelPage() {
  return (
    <Section
      id="label"
      title="Label"
      desc="A form field's identifier. Always visible — even when a placeholder hints at the same thing. Links to its control via htmlFor so clicking focuses or toggles it."
    >

      {/* ── 1. INSTALLATION ────────────────────────────────────────────── */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={INSTALL_TABS} ariaLabel="package manager" />
      <Lede>
        Ships <Mono>Label</Mono> — a native <Mono>&lt;label&gt;</Mono> wrapper with no
        runtime dependency beyond <Mono>cn()</Mono>. Clicking the label focuses (or
        toggles) its bound control via the browser's built-in association.
      </Lede>

      {/* ── 2. USAGE ───────────────────────────────────────────────────── */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="label + input · htmlFor → id" code={USAGE_CODE}>
        <div className="in-field" style={{ inlineSize: '36ch' }}>
          <Label htmlFor="lbl-usage">Email</Label>
          <div className="in-group">
            <input id="lbl-usage" className="in-control" placeholder="you@eidos.com" />
          </div>
        </div>
      </Frame>

      {/* ── 3. VARIANTS ────────────────────────────────────────────────── */}
      <SubHead meta="3 variants">Variants</SubHead>
      <Frame label="plain · required · optional" code={VARIANTS_CODE}>
        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          <div className="in-field" style={{ inlineSize: '24ch' }}>
            <Label htmlFor="lbl-plain">Full name</Label>
            <div className="in-group">
              <input id="lbl-plain" className="in-control" placeholder="Ada Lovelace" />
            </div>
          </div>
          <div className="in-field" style={{ inlineSize: '24ch' }}>
            <Label htmlFor="lbl-req" required>Full name</Label>
            <div className="in-group">
              <input id="lbl-req" className="in-control" placeholder="Ada Lovelace" />
            </div>
          </div>
          <div className="in-field" style={{ inlineSize: '24ch' }}>
            <Label htmlFor="lbl-opt" optional>Pronoun</Label>
            <div className="in-group">
              <input id="lbl-opt" className="in-control" placeholder="e.g. she/her" />
            </div>
          </div>
        </div>
      </Frame>
      <Lede up>
        Pick <em>one</em> convention per form: mark required fields with <Mono>*</Mono> in
        mostly-optional forms, or mark optional fields with <Mono>(optional)</Mono> in
        mostly-required ones. Never mix both on the same form — it redundantly labels
        every field.
      </Lede>

      {/* ── Sizes ────────────────────────────────────────────────────────── */}
      <SubHead meta="2 sizes">Sizes</SubHead>
      <Frame label="md (default) · sm" code={SIZES_CODE}>
        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          <div className="in-field" style={{ inlineSize: '26ch' }}>
            <Label htmlFor="lbl-md">Service name</Label>
            <div className="in-group">
              <input id="lbl-md" className="in-control" placeholder="identity-svc" />
            </div>
          </div>
          <div className="in-field" style={{ inlineSize: '26ch' }}>
            <Label htmlFor="lbl-sm" size="sm">API key</Label>
            <div className="in-group sm">
              <input id="lbl-sm" className="in-control" placeholder="sk_live_••••" />
            </div>
          </div>
        </div>
      </Frame>

      {/* ── States ───────────────────────────────────────────────────────── */}
      <SubHead meta="default · disabled">States</SubHead>
      <Frame label="disabled — dims label + control together" code={STATES_CODE}>
        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          <div className="in-field" style={{ inlineSize: '26ch' }}>
            <Label htmlFor="lbl-active">Billing email</Label>
            <div className="in-group">
              <input id="lbl-active" className="in-control" defaultValue="billing@acme.com" />
            </div>
          </div>
          <div className="in-field" style={{ inlineSize: '26ch' }}>
            <Label htmlFor="lbl-dis" disabled>Billing email</Label>
            <div className="in-group is-disabled">
              <input id="lbl-dis" className="in-control" value="billing@acme.com" disabled readOnly />
            </div>
          </div>
        </div>
      </Frame>

      {/* ── Helper text ───────────────────────────────────────────────────── */}
      <SubHead meta="description + error">Helper text</SubHead>
      <Frame label="helper below · error replaces helper — never both">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', inlineSize: '36ch' }}>
          <div className="in-field">
            <Label htmlFor="lbl-help">API key</Label>
            <div className="in-group">
              <input id="lbl-help" className="in-control" defaultValue="sk_live_••••" type="password" />
            </div>
            <p className="in-help">Used to authenticate server-to-server calls.</p>
          </div>
          <div className="in-field">
            <Label htmlFor="lbl-err">API key</Label>
            <div className="in-group is-invalid">
              <input id="lbl-err" className="in-control" defaultValue="sk_live_zzz" aria-invalid="true" />
            </div>
            <p className="in-error">That key is not associated with your account.</p>
          </div>
        </div>
      </Frame>

      {/* ── 4. IN CONTEXT ─────────────────────────────────────────────────── */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame label="sign-in form — required + helper text">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', inlineSize: '40ch' }}>
          <div className="in-field">
            <Label htmlFor="ctx-email" required>Email</Label>
            <div className="in-group">
              <input id="ctx-email" className="in-control" type="email" placeholder="you@equifax.com" />
            </div>
          </div>
          <div className="in-field">
            <Label htmlFor="ctx-pw" required>Password</Label>
            <div className="in-group">
              <input id="ctx-pw" className="in-control" type="password" placeholder="••••••••" />
            </div>
            <p className="in-help">Minimum 12 characters.</p>
          </div>
          <div className="in-field">
            <Label htmlFor="ctx-org" optional>Organisation</Label>
            <div className="in-group">
              <input id="ctx-org" className="in-control" placeholder="Acme Corp" />
            </div>
          </div>
        </div>
      </Frame>

      {/* ── Visually hidden labels ────────────────────────────────────────── */}
      <SubHead meta="never invisible">Visually hidden labels</SubHead>
      <Frame label="search field · .sr-only keeps the label in DOM for screen readers">
        <div className="in-field" style={{ inlineSize: '32ch' }}>
          <Label htmlFor="lbl-search" className="sr-only">Search</Label>
          <div className="in-group">
            <span className="in-addon icon" aria-hidden="true"><Icons.search size={14} /></span>
            <input id="lbl-search" className="in-control" placeholder="Search…" />
          </div>
        </div>
      </Frame>
      <Lede up>
        A placeholder is never a label. When space is scarce (search, inline filter),
        keep the <Mono>&lt;label&gt;</Mono> in the DOM and hide it with <Mono>.sr-only</Mono>{' '}
        — screen readers still announce it. Never use <Mono>aria-label</Mono> on the input
        as a first resort; a real <Mono>&lt;label&gt;</Mono> also widens the tap target.
      </Lede>

      {/* ── 5. ACCESSIBILITY ──────────────────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginBlockStart: 'var(--space-3)' }}>
        <div className="surface" style={{ padding: 'var(--space-4)' }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 'var(--space-1)' }}>Keyboard</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>
            A label is not a tab stop, but clicking or tapping it focuses (or
            toggles) the associated control — widening the hit target to the full
            text width. For checkboxes and radios this means the label text is
            part of the activation area, not just the box.
          </div>
        </div>
        <div className="surface" style={{ padding: 'var(--space-4)' }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 'var(--space-1)' }}>Screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>
            Bind via <Mono>htmlFor</Mono> matching the control's <Mono>id</Mono> so the
            field is announced with its name. The <Mono>required</Mono> prop emits an
            <Mono>aria-hidden</Mono> asterisk plus a <Mono>.sr-only</Mono> "required"
            span — the meaning is conveyed verbally, not by colour alone.
          </div>
        </div>
        <div className="surface" style={{ padding: 'var(--space-4)' }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 'var(--space-1)' }}>Focus &amp; contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>
            The label shows no focus ring (the control does). Label text and the
            required/optional markers clear AA contrast on the form surface. A
            disabled field dims label and control together so the relationship is
            never ambiguous — the <Mono>disabled</Mono> prop forwards
            <Mono>data-disabled</Mono> and the <Mono>.is-disabled</Mono> class.
          </div>
        </div>
        <div className="surface" style={{ padding: 'var(--space-4)' }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 'var(--space-1)' }}>Motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>
            The label is static — no transitions or animations — so{' '}
            <Mono>prefers-reduced-motion</Mono> has nothing to suppress.
          </div>
        </div>
      </div>

      {/* ── 6. RTL ────────────────────────────────────────────────────────── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — label and markers flip with reading direction'>
        <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', inlineSize: '36ch' }}>
          <div className="in-field">
            <Label htmlFor="rtl-email" required>البريد الإلكتروني</Label>
            <div className="in-group">
              <input id="rtl-email" className="in-control" placeholder="you@eidos.com" />
            </div>
            <p className="in-help">يستخدم لتسجيل الدخول.</p>
          </div>
          <div className="in-field">
            <Label htmlFor="rtl-org" optional>المنظمة</Label>
            <div className="in-group">
              <input id="rtl-org" className="in-control" placeholder="شركة المثال" />
            </div>
          </div>
        </div>
      </Frame>
      <Lede>
        <Mono>.in-label</Mono> uses <Mono>display: inline-flex</Mono> and logical gap,
        so the required asterisk and optional suffix sit at the inline-end position
        automatically — they follow the reading direction without any RTL override.
        The label has no directional icon, so there is nothing to mirror.
      </Lede>

      {/* ── 7. ANATOMY ────────────────────────────────────────────────────── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ paddingBlock: 'var(--space-16) var(--space-12)', paddingInline: 'var(--space-8)' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', inlineSize: 280 }} aria-hidden="true">
              <div className="in-field">
                <Label>Project name <span className="required-mark" aria-hidden="true">*</span> <span className="opt">(optional)</span></Label>
                <div className="in-group">
                  <input className="in-control" tabIndex={-1} placeholder="acme-prod" style={{ cursor: 'default' }} />
                </div>
              </div>
              <span className="lead h" style={{ insetBlockStart: 8, insetInlineStart: -28, inlineSize: 24 }} />
              <span className="lead v" style={{ insetBlockStart: -22, insetInlineStart: 92, blockSize: 18 }} />
              <span className="lead h" style={{ insetBlockStart: 8, insetInlineEnd: -28, inlineSize: 24 }} />
              <span className="lead v" style={{ insetBlockStart: 26, insetInlineStart: 40, blockSize: 12 }} />
              <div className="pin" style={{ insetBlockStart: 0, insetInlineStart: -52 }}>1</div>
              <div className="pin" style={{ insetBlockStart: -42, insetInlineStart: 92, transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ insetBlockStart: 0, insetInlineEnd: -52 }}>3</div>
              <div className="pin" style={{ insetBlockStart: 38, insetInlineStart: 40, transform: 'translateX(-50%)' }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxInlineSize: '60ch', marginBlock: 'var(--space-12) 0', marginInline: 'auto' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Text.</b> Geist 500/13. Sentence case. A noun, never a question or command.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Required marker.</b> Ember asterisk (<Mono>aria-hidden</Mono>) + visually-hidden "required" — colour is decorative, not load-bearing.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Optional suffix.</b> Muted "(optional)" in <Mono>var(--fg-muted)</Mono> — load-bearing text, so it clears AA on the form surface. Mutually exclusive with the required marker.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Spacing.</b> 6px gap to the control below — close enough to read as one pair.</span>
          </div>
        </div>
      </div>

      {/* ── 8. DO / DON'T ─────────────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — write nouns, sentence case</div>
          <div className="body">
            <div className="in-field" style={{ inlineSize: '28ch' }}>
              <Label htmlFor="dd-do">Billing email</Label>
              <div className="in-group">
                <input id="dd-do" className="in-control" placeholder="billing@…" />
              </div>
            </div>
          </div>
          <div className="note">"Billing email" names the field — sentence case, no colon. The verb belongs on the submit button.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — phrase labels as questions or commands</div>
          <div className="body">
            <div className="in-field" style={{ inlineSize: '28ch' }}>
              <Label htmlFor="dd-dont">PLEASE ENTER YOUR BILLING EMAIL ADDRESS:</Label>
              <div className="in-group">
                <input id="dd-dont" className="in-control" />
              </div>
            </div>
          </div>
          <div className="note">All-caps, colons, and imperatives are noise. Save the verb for the submit button.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — mark required OR optional, not both</div>
          <div className="body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div className="in-field" style={{ inlineSize: '24ch' }}>
                <Label htmlFor="dd-do2" required>Full name</Label>
                <div className="in-group"><input id="dd-do2" className="in-control" placeholder="Ada" /></div>
              </div>
              <div className="in-field" style={{ inlineSize: '24ch' }}>
                <Label htmlFor="dd-do3" optional>Pronoun</Label>
                <div className="in-group"><input id="dd-do3" className="in-control" placeholder="she/her" /></div>
              </div>
            </div>
          </div>
          <div className="note">Pick one convention per form. Use <Mono>required</Mono> when most fields are optional; use <Mono>optional</Mono> when most are required.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — mix required and optional on the same form</div>
          <div className="body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div className="in-field" style={{ inlineSize: '24ch' }}>
                <Label htmlFor="dd-dont2" required>Full name</Label>
                <div className="in-group"><input id="dd-dont2" className="in-control" placeholder="Ada" /></div>
              </div>
              <div className="in-field" style={{ inlineSize: '24ch' }}>
                <Label htmlFor="dd-dont3" optional>Pronoun</Label>
                <div className="in-group"><input id="dd-dont3" className="in-control" placeholder="she/her" /></div>
              </div>
              <div className="in-field" style={{ inlineSize: '24ch' }}>
                <Label htmlFor="dd-dont4" required>Email</Label>
                <div className="in-group"><input id="dd-dont4" className="in-control" placeholder="you@…" /></div>
              </div>
            </div>
          </div>
          <div className="note">Using both conventions forces users to track two separate signals. Choose one.</div>
        </div>
      </div>

      {/* ── 9. API REFERENCE ──────────────────────────────────────────────── */}
      <SubHead meta="LabelProps">API reference</SubHead>
      <AutoPropsTable component="Label" label="<Label />" />
    </Section>
  );
}
