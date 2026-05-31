'use client';
// Eidos DS — Components / Input Group
// Sections: Installation → Usage → Variants → Sizes → States → In context
//           → Accessibility → RTL → Anatomy → Do/Don't → API reference
import * as React from 'react';
import {
  Icons,
  Frame,
  Section,
  SubHead,
  Lede,
  Mono,
  InputGroup,
  InputAddon,
  ComponentInstall,
  AutoPropsTable,
} from '@/ds/core';

// ── Code snippets ─────────────────────────────────────────────────────────────

const USAGE_CODE = `import { InputGroup, InputAddon } from "@/components/forge/input-group"

export function Demo() {
  return (
    <InputGroup style={{ maxWidth: 460 }}>
      <InputAddon kind="icon"><Search size={14} /></InputAddon>
      <input className="in-control" placeholder="Search projects, files, people…" />
      <InputAddon kind="button" accent>Search</InputAddon>
    </InputGroup>
  )
}`;

const URL_COPY_CODE = `<InputGroup style={{ maxWidth: 460 }}>
  <InputAddon kind="icon"><Link size={14} /></InputAddon>
  <input className="in-control" readOnly defaultValue="https://eidos-ds.com/invites/3f4-9k2-x8q" />
  <InputAddon kind="button" aria-label="Copy link">
    <Copy size={14} />
  </InputAddon>
</InputGroup>`;

const AFFIX_CODE = `{/* URL scheme prefix — affix linked via aria-describedby */}
<InputGroup>
  <InputAddon kind="text" id="url-scheme">https://</InputAddon>
  <input className="in-control" aria-describedby="url-scheme" defaultValue="eidos.example.com/team" />
</InputGroup>

{/* Trailing unit suffix */}
<InputGroup>
  <input className="in-control" placeholder="42" aria-describedby="unit-suffix" />
  <InputAddon kind="text" id="unit-suffix">USD / month</InputAddon>
</InputGroup>`;

const SELECT_CODE = `{/* Currency picker + amount input */}
<InputGroup>
  <InputAddon kind="select" defaultValue="USD">
    <option>USD</option>
    <option>EUR</option>
    <option>BRL</option>
  </InputAddon>
  <input className="in-control" placeholder="0.00" />
  <InputAddon kind="text" id="currency-unit">/ month</InputAddon>
</InputGroup>`;

const LIVE_BUILDER_CODE = `// The three segments compose into ONE structured value.
const [ccy, setCcy] = useState("USD")
const [amount, setAmount] = useState("1299.5")
const formatted = formatAmount(amount, ccy)       // "1,299.50" (JPY → "1,299")

<InputGroup>
  <InputAddon kind="select" value={ccy} onChange={(e) => setCcy(e.target.value)}>
    <option>USD</option><option>EUR</option><option>BRL</option><option>JPY</option>
  </InputAddon>
  <input
    className="in-control"
    inputMode="decimal"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
  />
  <InputAddon kind="text">/ month</InputAddon>
</InputGroup>

{/* Live, right-aligned, tabular-nums readout of the composed value */}
<span className="t-mono">{CURRENCY_SYMBOL[ccy]}{formatted} {ccy} / month</span>`;

const THREE_SEG_CODE = `<InputGroup>
  <InputAddon kind="text" id="filter-label">Filter</InputAddon>
  <InputAddon kind="select" defaultValue="name">
    <option value="name">name</option>
    <option value="owner">owner</option>
    <option value="tag">tag</option>
  </InputAddon>
  <input className="in-control" aria-describedby="filter-label" placeholder="contains…" />
  <InputAddon kind="button" accent>Apply</InputAddon>
</InputGroup>`;

const SEND_CODE = `<InputGroup>
  <InputAddon kind="button" aria-label="Add attachment">
    <Paperclip size={14} />
  </InputAddon>
  <input
    className="in-control"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    placeholder="Reply to thread…"
  />
  <InputAddon kind="button" accent aria-label="Send">
    <ArrowRight size={14} />
  </InputAddon>
</InputGroup>`;

const RTL_CODE = `<div dir="rtl">
  <InputGroup style={{ maxWidth: 460 }}>
    <InputAddon kind="icon"><Search size={14} /></InputAddon>
    <input className="in-control" placeholder="ابحث في المشاريع…" />
    <InputAddon kind="button" accent>بحث</InputAddon>
  </InputGroup>
</div>`;

// ── Page ──────────────────────────────────────────────────────────────────────

const CURRENCY_SYMBOL: Record<string, string> = { USD: '$', EUR: '€', BRL: 'R$', JPY: '¥' };

// Live amount formatter — groups the integer part with separators and keeps the
// currency's natural fraction count (JPY has none), so the preview lines up
// under tabular-nums. Currency-aware so the readout is honest, not just pretty.
function formatAmount(raw: string, currency: string): string {
  const cleaned = raw.replace(/[^\d.]/g, '');
  if (!cleaned) return '';
  const fractionDigits = currency === 'JPY' ? 0 : 2;
  const [intPart, ...rest] = cleaned.split('.');
  const grouped = (intPart || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (fractionDigits === 0) return grouped;
  const dec = rest.join('').slice(0, fractionDigits);
  return cleaned.includes('.') ? `${grouped}.${dec}` : grouped;
}

export default function Page() {
  const [q, setQ] = React.useState('');
  const [url, setUrl] = React.useState('eidos.example.com/team');
  // Live currency builder — the three segments compose into one structured value.
  const [ccy, setCcy] = React.useState('USD');
  const [amount, setAmount] = React.useState('1299.5');
  const formatted = formatAmount(amount, ccy);
  const preview = formatted ? `${CURRENCY_SYMBOL[ccy]}${formatted} ${ccy} / month` : `${CURRENCY_SYMBOL[ccy]}— ${ccy} / month`;

  return (
    <Section
      id="input-group"
      title="Input Group"
      desc="A horizontal cluster — input, button, and optional addons — sharing one bordered shell. Reach for it when a field has an attached action: search, copy-link, host:port, currency."
    >
      {/* ====================================================================
          1. INSTALLATION
          ==================================================================== */}
      <ComponentInstall slug="input-group" />

      {/* ====================================================================
          2. USAGE
          ==================================================================== */}
      <SubHead meta="hello world">Usage</SubHead>
      <Lede>
        Adjacent segments share a single border (negative margin + z-index). Corners only round on the outermost piece. Combine any <Mono>input</Mono>, <Mono>InputAddon</Mono> kind, or a plain <Mono>select</Mono> inside — currency-with-switcher, host:port, send-message all work.
      </Lede>
      <Frame label="basic" code={USAGE_CODE}>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: 24 }}>
          <InputGroup style={{ maxWidth: 460, width: '100%' }}>
            <InputAddon kind="icon"><Icons.search size={14} /></InputAddon>
            <input className="in-control" placeholder="Search projects, files, people…" />
            <InputAddon kind="button" accent>Search</InputAddon>
          </InputGroup>
        </div>
      </Frame>

      {/* ====================================================================
          3. VARIANTS
          ==================================================================== */}
      <div style={{
        marginTop: 36, marginBottom: 6,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--fg-faint)',
        }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* URL + copy */}
      <SubHead meta="copy link">URL + copy</SubHead>
      <Frame label="readonly URL · icon copy button on the trailing edge" code={URL_COPY_CODE}>
        <div style={{ padding: 24, display: 'flex', justifyContent: 'center', width: '100%' }}>
          <InputGroup style={{ maxWidth: 460, width: '100%' }}>
            <InputAddon kind="icon"><Icons.link size={14} /></InputAddon>
            <input className="in-control" readOnly defaultValue="https://eidos-ds.com/invites/3f4-9k2-x8q" />
            <InputAddon kind="button" aria-label="Copy link">
              <Icons.copy size={14} />
            </InputAddon>
          </InputGroup>
        </div>
      </Frame>
      <Lede>
        Icon-only buttons must carry an <Mono>aria-label</Mono>. The copy action is on the trailing edge in LTR and the leading edge in RTL — logical CSS handles the flip automatically.
      </Lede>

      {/* Static text affixes */}
      <SubHead meta="affixes">With static text affix</SubHead>
      <Frame label="static text segments anchor unit / domain / namespace" code={AFFIX_CODE}>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', width: '100%' }}>
          <InputGroup style={{ maxWidth: 460, width: '100%' }}>
            <InputAddon kind="text" id="demo-scheme">https://</InputAddon>
            <input className="in-control" aria-describedby="demo-scheme" value={url} onChange={(e) => setUrl(e.target.value)} />
          </InputGroup>
          <InputGroup style={{ maxWidth: 460, width: '100%' }}>
            <input className="in-control" placeholder="42" aria-describedby="demo-unit" />
            <InputAddon kind="text" id="demo-unit">USD per month</InputAddon>
          </InputGroup>
          <InputGroup style={{ maxWidth: 460, width: '100%' }}>
            <InputAddon kind="text" id="demo-at">@</InputAddon>
            <input className="in-control" aria-describedby="demo-at" placeholder="username" />
          </InputGroup>
        </div>
      </Frame>
      <Lede>
        Text affixes are <Mono>kind="text"</Mono> spans — background tinted, mono font, non-interactive. Pass an <Mono>id</Mono> to the affix and reference it on the input with <Mono>aria-describedby</Mono> so screen readers announce the context alongside the field name.
      </Lede>

      {/* Input + select */}
      <SubHead meta="picker">Input + select</SubHead>
      <Frame label="select picks the unit — currency, country code, scheme" code={SELECT_CODE}>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', width: '100%' }}>
          <InputGroup style={{ maxWidth: 460, width: '100%' }}>
            <InputAddon kind="select" defaultValue="USD">
              <option>USD</option>
              <option>EUR</option>
              <option>BRL</option>
              <option>JPY</option>
            </InputAddon>
            <input className="in-control" placeholder="0.00" />
            <InputAddon kind="text">/ month</InputAddon>
          </InputGroup>
          <InputGroup style={{ maxWidth: 460, width: '100%' }}>
            <InputAddon kind="select" defaultValue="+1">
              <option>+1</option>
              <option>+44</option>
              <option>+55</option>
              <option>+81</option>
            </InputAddon>
            <input className="in-control" placeholder="(415) 555 0182" />
          </InputGroup>
        </div>
      </Frame>

      {/* Live currency builder — signature composition */}
      <SubHead meta="live · composes a value">Currency builder</SubHead>
      <Lede>
        Three segments — picker, amount, suffix — that compose into a <em>single</em> structured value. The amount field reads as you type and the readout below groups + aligns it with tabular-nums (<Mono>.t-mono</Mono>), so every digit lands in a fixed column. This is the case a plain input can't make on its own.
      </Lede>
      <Frame label="type an amount — the segments assemble one formatted, tabular value" code={LIVE_BUILDER_CODE}>
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', width: '100%' }}>
          <InputGroup style={{ maxWidth: 360, width: '100%' }}>
            <InputAddon
              kind="select"
              {...({
                value: ccy,
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setCcy(e.target.value),
              } as React.SelectHTMLAttributes<HTMLSelectElement>)}
            >
              <option>USD</option>
              <option>EUR</option>
              <option>BRL</option>
              <option>JPY</option>
            </InputAddon>
            <input
              className="in-control"
              inputMode="decimal"
              aria-label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
            <InputAddon kind="text">/ month</InputAddon>
          </InputGroup>
          <div
            aria-live="polite"
            style={{
              display: 'flex', alignItems: 'baseline', gap: 10,
              padding: '10px 16px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              minWidth: 220, justifyContent: 'center',
            }}
          >
            <span className="t-mono-label" style={{ color: 'var(--fg-faint)' }}>charges</span>
            <span className="t-mono" style={{ fontSize: 'var(--text-md)', color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>
              {preview}
            </span>
          </div>
        </div>
      </Frame>

      {/* Three segments */}
      <SubHead meta="three-up">Three segments</SubHead>
      <Frame label="text label + select + input + primary action" code={THREE_SEG_CODE}>
        <div style={{ padding: 24, display: 'flex', justifyContent: 'center', width: '100%' }}>
          <InputGroup style={{ maxWidth: 560, width: '100%' }}>
            <InputAddon kind="text">Filter</InputAddon>
            <InputAddon kind="select" defaultValue="name">
              <option>name</option>
              <option>owner</option>
              <option>tag</option>
            </InputAddon>
            <input className="in-control" placeholder="contains…" />
            <InputAddon kind="button" accent>Apply</InputAddon>
          </InputGroup>
        </div>
      </Frame>

      {/* Send message */}
      <SubHead meta="action">Send a message</SubHead>
      <Frame label="leading attachment · typing area · trailing send" code={SEND_CODE}>
        <div style={{ padding: 24, display: 'flex', justifyContent: 'center', width: '100%' }}>
          <InputGroup style={{ maxWidth: 560, width: '100%' }}>
            <InputAddon kind="button" aria-label="Add attachment">
              <Icons.paperclip size={14} />
            </InputAddon>
            <input
              className="in-control"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Reply to thread…"
            />
            <InputAddon kind="button" accent aria-label="Send">
              <Icons.arrowRight size={14} />
            </InputAddon>
          </InputGroup>
        </div>
      </Frame>

      {/* ====================================================================
          4. SIZES
          ==================================================================== */}
      <SubHead meta="sm · md · lg">Sizes</SubHead>
      <Frame label="size matches buttons + inputs · 28 / 36 / 44 px">
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', width: '100%' }}>
          <InputGroup size="sm" style={{ maxWidth: 460, width: '100%' }}>
            <input className="in-control" placeholder="Small" />
            <InputAddon kind="button">Apply</InputAddon>
          </InputGroup>
          <InputGroup size="md" style={{ maxWidth: 460, width: '100%' }}>
            <input className="in-control" placeholder="Default" />
            <InputAddon kind="button" accent>Apply</InputAddon>
          </InputGroup>
          <InputGroup size="lg" style={{ maxWidth: 460, width: '100%' }}>
            <input className="in-control" placeholder="Large" />
            <InputAddon kind="button" accent>Subscribe</InputAddon>
          </InputGroup>
        </div>
      </Frame>

      {/* ====================================================================
          5. STATES
          ==================================================================== */}
      <SubHead meta="states">States</SubHead>
      <Frame label="default · invalid · with disabled segment">
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', width: '100%' }}>
          <InputGroup invalid style={{ maxWidth: 460, width: '100%' }}>
            <input className="in-control" defaultValue="not-an-email" />
            <InputAddon kind="button">Submit</InputAddon>
          </InputGroup>
          <InputGroup style={{ maxWidth: 460, width: '100%' }}>
            <input className="in-control" placeholder="user@…" />
            <InputAddon kind="button" disabled>Send invite</InputAddon>
          </InputGroup>
          <InputGroup disabled style={{ maxWidth: 460, width: '100%' }}>
            <input className="in-control" placeholder="Disabled group" />
            <InputAddon kind="button" accent>Apply</InputAddon>
          </InputGroup>
        </div>
      </Frame>

      {/* ====================================================================
          6. IN CONTEXT
          ==================================================================== */}
      <SubHead meta="real surface">In context</SubHead>
      <Lede>
        Pair with a <Mono>&lt;label&gt;</Mono> above and a helper line below — the same rhythm as the Form stack. The group row never shifts height on validation: errors replace the helper line in-place.
      </Lede>
      <Frame label="invite link + budget form — realistic field stack">
        <div style={{ padding: 32, display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480, width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label htmlFor="ic-invite" className="t-small" style={{ fontWeight: 500, color: 'var(--fg)' }}>
                Invite link
              </label>
              <InputGroup>
                <InputAddon kind="icon"><Icons.link size={14} /></InputAddon>
                <input
                  id="ic-invite"
                  className="in-control"
                  readOnly
                  defaultValue="https://eidos-ds.com/invites/3f4-9k2-x8q"
                />
                <InputAddon kind="button" aria-label="Copy link">
                  <Icons.copy size={14} />
                </InputAddon>
              </InputGroup>
              <span className="t-small" style={{ color: 'var(--fg-muted)' }}>Share with anyone to grant read access.</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label htmlFor="ic-budget" className="t-small" style={{ fontWeight: 500, color: 'var(--fg)' }}>
                Monthly budget
              </label>
              <InputGroup>
                <InputAddon kind="select" aria-label="Currency">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </InputAddon>
                <input id="ic-budget" className="in-control" type="number" min="0" placeholder="0.00" />
                <InputAddon kind="text">/ month</InputAddon>
              </InputGroup>
            </div>
          </div>
        </div>
      </Frame>

      {/* ====================================================================
          7. ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The shared shell renders as <Mono>role="group"</Mono> — Tab moves through the real children in DOM order (input, then select, then any button). The visual seams never add or remove tab stops. <Mono>Enter</Mono> inside the text field submits the group's primary action when wrapped in a <Mono>&lt;form&gt;</Mono>.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Each control keeps its own role and name. The input is labelled by a real <Mono>&lt;label&gt;</Mono> or <Mono>aria-label</Mono>. Give text affixes an <Mono>id</Mono> and reference it from the input via <Mono>aria-describedby</Mono> — screen readers then announce the scheme, unit, or namespace alongside the field name. Icon-only buttons carry an explicit <Mono>aria-label</Mono>.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The ember focus ring <Mono>--ring</Mono> appears on whichever segment is focused and is never clipped by neighbours (the active segment lifts via <Mono>z-index:1</Mono>). Affix text (<Mono>var(--fg-muted)</Mono> on <Mono>var(--bg-elevated)</Mono>) and seam borders clear AA contrast.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Only border-color and focus-ring transitions animate, both under <Mono>var(--dur-fast)</Mono> token eases. A <Mono>@media (prefers-reduced-motion: reduce)</Mono> rule stops those transitions so the group is effectively motion-free for users who prefer it.
          </div>
        </div>
      </div>

      {/* ====================================================================
          8. RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — segment order reverses; button auto-mirrors to the leading visual edge'
        code={RTL_CODE}
      >
        <div dir="rtl" style={{ padding: 24, display: 'flex', justifyContent: 'center', width: '100%' }}>
          <InputGroup style={{ maxWidth: 460, width: '100%' }}>
            <InputAddon kind="icon"><Icons.search size={14} /></InputAddon>
            <input className="in-control" placeholder="ابحث في المشاريع…" />
            <InputAddon kind="button" accent>بحث</InputAddon>
          </InputGroup>
        </div>
      </Frame>
      <Lede>
        Logical properties — <Mono>border-start-start-radius</Mono>, <Mono>margin-inline-start</Mono>, <Mono>border-inline-end</Mono> — handle direction-flipping automatically. The action button stays on the trailing visual edge in both LTR and RTL with no code change.
      </Lede>

      {/* ====================================================================
          9. ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 72px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 380 }} aria-hidden="true">
              <InputGroup style={{ width: '100%' }}>
                <InputAddon kind="text">https://</InputAddon>
                <input className="in-control" readOnly tabIndex={-1} defaultValue="eidos.example.com/team" />
                <InputAddon kind="button" tabIndex={-1} style={{ cursor: 'default' }}>
                  <Icons.copy size={13} />
                  <span style={{ marginInlineStart: 4 }}>Copy</span>
                </InputAddon>
              </InputGroup>
              <div className="t-small" style={{ color: 'var(--fg-subtle)', marginTop: 8 }}>
                Share this URL with anyone on the team.
              </div>

              {/* Lead lines + pins */}
              <span className="lead v" style={{ top: -22, left: 40, height: 18 }} />
              <span className="lead v" style={{ top: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }} />
              <span className="lead v" style={{ top: -22, right: 56, height: 18 }} />
              <span className="lead h" style={{ top: 14, right: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 6, right: -28, width: 24 }} />

              <div className="pin" style={{ top: -42, left: 40, transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: -42, left: '50%', transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ top: -42, right: 56, transform: 'translateX(50%)' }}>3</div>
              <div className="pin" style={{ top: 6, right: -52 }}>4</div>
              <div className="pin" style={{ bottom: -2, right: -52 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '72px auto 0' }}>
            <span className="num">1</span>
            <span><b style={{ color: 'var(--fg)' }}>Leading addon.</b> <Mono>kind="text"</Mono> for static prefixes (URL scheme, unit, @) or <Mono>kind="button"</Mono> for a leading action. Reads first in LTR; flips automatically in RTL via logical CSS.</span>
            <span className="num">2</span>
            <span><b style={{ color: 'var(--fg)' }}>Input segment.</b> Native <Mono>&lt;input className="in-control"&gt;</Mono> — <Mono>flex: 1 1 auto</Mono> so it absorbs available space while addons stay fixed-width. Borderless; the group paints the ring.</span>
            <span className="num">3</span>
            <span><b style={{ color: 'var(--fg)' }}>Trailing addon.</b> <Mono>kind="button"</Mono> (action) or <Mono>kind="text"</Mono> (suffix). Lives on the trailing edge — copy, send, switch unit.</span>
            <span className="num">4</span>
            <span><b style={{ color: 'var(--fg)' }}>Shared shell.</b> Adjacent segments overlap by <Mono>-1px</Mono> so the row paints as a single border. The focused segment lifts via <Mono>z-index:1</Mono> so its ring sits on top.</span>
            <span className="num">5</span>
            <span><b style={{ color: 'var(--fg)' }}>Helper text.</b> Below the group, same rhythm as Forms. Errors replace the helper line so the layout never shifts on validate.</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          10. DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — let the input expand; keep buttons fixed</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8, width: '100%' }}>
            <InputGroup style={{ width: '100%' }}>
              <input className="in-control" placeholder="Email…" />
              <InputAddon kind="button" accent>Subscribe</InputAddon>
            </InputGroup>
          </div>
          <div className="note">The text field should grow with the surface. Buttons stay at their natural width so the action area doesn't shift as the viewport resizes.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — detach segments that belong together</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8, width: '100%' }}>
            {/* Intentionally wrong: separated components without the shared shell */}
            <div style={{ display: 'inline-flex', gap: 6, width: '100%' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-lg)', padding: '0 12px' }}>
                <input style={{ flex: 1, background: 'transparent', border: 0, outline: 0, color: 'var(--fg)', font: '400 13px/1.4 var(--font-sans)' }} placeholder="Email…" />
              </div>
              <button style={{ display: 'inline-flex', alignItems: 'center', padding: '0 14px', minHeight: 36, borderRadius: 'var(--radius-lg)', background: 'var(--ember)', border: '1px solid var(--ember)', color: 'var(--ember-fg)', fontWeight: 500, cursor: 'pointer', font: 'inherit', fontSize: 13 }}>Send</button>
            </div>
          </div>
          <div className="note">Detached segments read as two separate controls. If they belong together, group them — the shared border is the visual contract that says "one control."</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — show the error on the offending segment</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8, width: '100%' }}>
            <InputGroup invalid style={{ width: '100%' }}>
              <input className="in-control" defaultValue="not-an-email" />
              <InputAddon kind="button">Send invite</InputAddon>
            </InputGroup>
            <span className="t-small" style={{ color: 'var(--danger)' }}>Enter a valid email address.</span>
          </div>
          <div className="note">Set <Mono>invalid</Mono> on the group to paint the danger ring. Pair with a helper line below — never move or replace the group itself.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — chain four or more segments</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8, width: '100%' }}>
            <InputGroup style={{ width: '100%' }}>
              <InputAddon kind="text">https://</InputAddon>
              <InputAddon kind="select"><option>www</option></InputAddon>
              <input className="in-control" placeholder="domain" />
              <InputAddon kind="text">.</InputAddon>
              <InputAddon kind="select"><option>com</option></InputAddon>
              <InputAddon kind="button">Save</InputAddon>
            </InputGroup>
          </div>
          <div className="note">Past four segments the row becomes hard to scan. Split into multiple fields or use a single Input with a richer suggestion popover.</div>
        </div>
      </div>

      {/* ====================================================================
          11. API REFERENCE
          ==================================================================== */}
      <SubHead meta="InputGroupProps · InputAddonProps">API reference</SubHead>
      <AutoPropsTable component="InputGroup" />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-subtle)', margin: '24px 0 8px' }}>InputAddon</div>
      <AutoPropsTable component="InputAddon" />
    </Section>
  );
}
