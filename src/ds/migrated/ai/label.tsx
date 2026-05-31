'use client';
// Eidos DS — Components / AI Label.
// Small badge that flags AI-generated content. Reuses the 4-point sparkle
// from the ForgeMark glyph + ember accent so an AI marker reads as a Eidos
// moment, not a foreign sticker.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, AILabel, AILabelWithPopover, Spark, Lede, Mono, Spinner, Alert, AlertTitle, AlertDescription } from '@/ds/core';


// AILabel, AILabelWithPopover and the Spark glyph are now DS-core components
// (core/ai/identity.tsx) — imported above, not re-implemented here.

const USAGE_CODE = `import { AILabel } from "@/ds/core"

export function Demo() {
  return <AILabel variant="pill">AI</AILabel>
}`;

const inputStyle = {
  height: 36, padding: '0 12px', borderRadius: 'var(--radius-lg)',
  background: 'var(--surface)', border: '1px solid var(--border-strong)',
  color: 'var(--fg)', fontSize: 'var(--text-base)', width: '100%',
};
const stack: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 };
const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12 };

const VARIANTS_CODE = [
  '<AILabel variant="box"/>',
  '<AILabel variant="mark">AI</AILabel>',
  '<AILabel variant="pill">AI</AILabel>',
  '<AILabel variant="dot"/>'
].join('\n');

const SIZES_CODE = [
  '<AILabel variant="box" size="sm"/>',
  '<AILabel variant="box"/>',
  '<AILabel variant="box" size="lg"/>'
].join('\n');

const STATES_CODE = [
  '// default — the model wrote this value',
  '<AILabel variant="pill">AI</AILabel>',
  '',
  '// generating — value not ready yet; show a Spinner, not a badge',
  '<Spinner size="sm" aria-label="Generating" />',
  '',
  '// revoked — a reviewer rejected the suggestion (kept visible)',
  '<AILabel variant="pill" revoked>AI</AILabel>',
  '',
  '// failed — generation errored; surface a danger Alert, never a silent badge',
  '<Alert tone="danger">…couldn’t generate this value.</Alert>'
].join('\n');

const POPOVER_CODE = [
  '<AILabelWithPopover',
  '  variant="pill"',
  '  label="AI summary"',
  '  model="forge-ai/gpt-4o-mini"',
  '  ts="2 min ago"',
  '  confidence={0.92}>',
  '  Generated from the last 30 days of incident reports.',
  '</AILabelWithPopover>'
].join('\n');

const FIELD_CODE = [
  '<label>',
  '  Service description',
  '  <AILabel variant="pill" size="sm">AI</AILabel>',
  '</label>',
  '<textarea defaultValue="..." />'
].join('\n');

const CELL_CODE = [
  '<td>',
  '  identity-svc',
  '  <AILabel variant="dot" size="sm"/>',
  '</td>'
].join('\n');

const REVIEW_CODE = [
  'const [status, setStatus] = useState("suggested")',
  '',
  '<AILabel variant="pill" revoked={status === "revoked"}>AI</AILabel>',
  '<input readOnly value={value} aria-invalid={status === "revoked"} />',
  '',
  '// reviewer acts on the suggestion the badge stands for',
  '<button onClick={() => setStatus("accepted")}>Accept</button>',
  '<button onClick={() => setStatus("revoked")}>Revoke</button>'
].join('\n');

// ── ReviewDemo — performs the suggested → accepted / revoked lifecycle the
// page documents. The badge is the live signal: ember while the value is the
// model's, struck-through once a reviewer rejects it. One ember accent, real
// disabled states, focus-visible controls composed from .btn.
function ReviewDemo() {
  const [status, setStatus] = React.useState<'suggested' | 'accepted' | 'revoked'>('suggested');
  const resolved = status !== 'suggested';

  const copy = {
    suggested: { note: 'Eidos AI suggested this tier from the last 90 days of traffic. Review it.', tone: 'var(--fg-muted)' },
    accepted: { note: 'Accepted — the value is now owned by the service, not the model.', tone: 'var(--fg-muted)' },
    revoked: { note: 'Revoked — the mark stays struck so the next reviewer sees it was checked.', tone: 'var(--fg-muted)' },
  }[status];

  return (
    <div style={{ width: '100%', maxWidth: 460 }}>
      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="t-mono-label" style={{ paddingInline: 0 }}>Service tier</span>
        <AILabel variant="pill" size="sm" revoked={status === 'revoked'}>AI</AILabel>
        {status === 'accepted' && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)' }}>
            <Icons.check size={12}/> accepted
          </span>
        )}
      </div>
      <input
        readOnly
        value="T1 — business critical"
        aria-invalid={status === 'revoked'}
        aria-label="AI-suggested service tier"
        style={{ ...inputStyle, color: status === 'revoked' ? 'var(--fg-faint)' : 'var(--fg)', textDecoration: status === 'revoked' ? 'line-through' : 'none' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, minHeight: 18, fontSize: 'var(--text-base)', color: copy.tone, lineHeight: 1.5 }}>
        <Spark size={9}/> {copy.note}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button className="btn sm ember" disabled={resolved} onClick={() => setStatus('accepted')}>
          <Icons.check size={13}/> Accept
        </button>
        <button className="btn sm ghost" disabled={resolved} onClick={() => setStatus('revoked')}>
          <Icons.x size={13}/> Revoke
        </button>
        <button className="btn sm ghost" disabled={!resolved} onClick={() => setStatus('suggested')} style={{ marginInlineStart: 'auto' }}>
          <Icons.refresh size={13}/> Reset
        </button>
      </div>
    </div>
  );
}

export default function AILabelPage() {
  return (
    <Section
      id="ai-label"
      num="02"
      title="AI Label"
      desc="A small badge that flags AI-generated content, built from the 4-point Eidos sparkle and the ember accent. Attach it to the specific field or value a model wrote — never the whole page."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-label')} ariaLabel="package manager"/>
      <Lede>One colour, one label, four variants: resist inventing more.</Lede>
      <Lede>
        Ships <Mono>AILabel</Mono> and the <Mono>AILabelWithPopover</Mono> wrapper that shows the model, timestamp, and confidence on click.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" row code={USAGE_CODE}>
        <AILabel variant="pill">AI</AILabel>
      </Frame>

      {/* 3. EXAMPLES */}
      <div className="ds-examples-rule" style={{ marginTop: 36, marginBottom: 6 }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      <SubHead meta="4 variants">Variants</SubHead>
      <Frame label="box · mark · pill · dot" row code={VARIANTS_CODE}>
        <div style={stack}><AILabel variant="box"/><span className="t-mono-label">box</span></div>
        <div style={stack}><AILabel variant="mark">AI</AILabel><span className="t-mono-label">mark</span></div>
        <div style={stack}><AILabel variant="pill">AI</AILabel><span className="t-mono-label">pill</span></div>
        <div style={stack}><AILabel variant="dot"/><span className="t-mono-label">dot</span></div>
      </Frame>

      <SubHead meta="3 sizes">Sizes</SubHead>
      <Frame label="sm · md · lg" row code={SIZES_CODE}>
        <div style={row}>
          <AILabel variant="box" size="sm"/>
          <AILabel variant="box"/>
          <AILabel variant="box" size="lg"/>
        </div>
        <span className="divider-v" style={{ height: 28, marginInline: 4 }}/>
        <div style={row}>
          <AILabel variant="pill" size="sm">AI</AILabel>
          <AILabel variant="pill">AI</AILabel>
          <AILabel variant="pill" size="lg">AI</AILabel>
        </div>
      </Frame>

      <SubHead meta="default · generating · revoked · failed">States</SubHead>
      <Lede up>Every AI-written value moves through the same four states — show each one explicitly. A badge only ever stands for a value that <em>exists</em>; while one is being generated you show progress, and if generation fails you raise it, never a half-state.</Lede>
      <Frame label="the full lifecycle of an AI-written value" code={STATES_CODE}>
        <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'flex-start' }}>
          <div style={stack}>
            <div style={{ ...row, minHeight: 28 }}>
              <AILabel variant="pill">AI</AILabel>
              <AILabel variant="box"/>
              <AILabel variant="mark">AI</AILabel>
            </div>
            <span className="t-mono-label">default</span>
          </div>
          <span className="divider-v" style={{ height: 36, marginInline: 4 }}/>
          <div style={stack}>
            <div style={{ ...row, minHeight: 28 }}>
              <Spinner size="sm" aria-label="Generating value"/>
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>generating…</span>
            </div>
            <span className="t-mono-label">generating</span>
          </div>
          <span className="divider-v" style={{ height: 36, marginInline: 4 }}/>
          <div style={stack}>
            <div style={{ ...row, minHeight: 28 }}>
              <AILabel variant="pill" revoked>AI</AILabel>
              <AILabel variant="box" revoked/>
              <AILabel variant="mark" revoked>AI</AILabel>
            </div>
            <span className="t-mono-label">revoked</span>
          </div>
        </div>
        <div style={{ width: '100%', maxWidth: 420, marginTop: 22 }}>
          <Alert tone="danger">
            <AlertTitle>Couldn’t generate this value</AlertTitle>
            <AlertDescription>The model timed out after 30s. Enter the value manually, or retry.</AlertDescription>
          </Alert>
          <span className="t-mono-label" style={{ display: 'block', marginTop: 8, paddingInline: 0 }}>failed</span>
        </div>
      </Frame>

      <SubHead meta="interactive">Interactive</SubHead>
      <Frame label="click any badge — opens a source popover (Esc / click-away to close)" height={220} code={POPOVER_CODE}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, paddingTop: 8 }}>
          <AILabelWithPopover variant="pill" label="AI summary">
            Generated from the last 30 days of incident reports.
          </AILabelWithPopover>
          <AILabelWithPopover variant="box" label="AI value" model="forge-ai/sonnet-4-6" ts="just now" confidence={0.88}>
            Suggested service name based on existing repo patterns.
          </AILabelWithPopover>
          <AILabelWithPopover variant="mark" label="AI tag" ts="14:02" confidence={0.74}>
            Tag inferred from the deploy diff.
          </AILabelWithPopover>
        </div>
      </Frame>

      <SubHead meta="review flow">Reviewing a suggestion</SubHead>
      <Lede up>The badge is not decoration — it is the live state of a decision. Accept it and the value becomes the service&apos;s own; revoke it and the mark stays struck so the next reviewer can see it was checked. Try it:</Lede>
      <Frame label="Accept / Revoke a model suggestion — the badge tracks the outcome" code={REVIEW_CODE}>
        <ReviewDemo/>
      </Frame>

      <SubHead meta="composition">In form fields</SubHead>
      <Frame label="label-side · suggested value" code={FIELD_CODE}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="t-mono-label" style={{ padding: 0 }}>Service description</span>
            <AILabel variant="pill" size="sm">AI</AILabel>
          </div>
          <textarea
            style={{ ...inputStyle, height: 76, padding: 10, resize: 'vertical', fontFamily: 'var(--font)', lineHeight: 1.5 }}
            defaultValue="Identity service — issues, rotates, and validates JWT credentials for all internal services."
          />
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-subtle)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Spark size={9}/> Suggested by Eidos AI · accept or edit
          </div>
        </div>
      </Frame>

      <SubHead meta="composition">In tables</SubHead>
      <Frame label="cell-level marker · scoped to the AI-touched value" code={CELL_CODE}>
        <table className="tbl" style={{ margin: 0 }}>
          <thead>
            <tr><th>Service</th><th>Owner</th><th>Tier</th><th>Last deploy</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  identity-svc <AILabel variant="dot" size="sm"/>
                </span>
              </td>
              <td style={{ color: 'var(--fg-muted)' }}>platform-eng</td>
              <td>T1</td>
              <td className="t-mono" style={{ color: 'var(--fg-muted)' }}>2 min ago</td>
            </tr>
            <tr>
              <td>billing-svc</td>
              <td style={{ color: 'var(--fg-muted)' }}>checkout</td>
              <td>T1</td>
              <td className="t-mono" style={{ color: 'var(--fg-muted)' }}>14 min ago</td>
            </tr>
            <tr>
              <td>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  marketing-cms <AILabel variant="pill" size="sm">AI</AILabel>
                </span>
              </td>
              <td style={{ color: 'var(--fg-muted)' }}>growth</td>
              <td>T3</td>
              <td className="t-mono" style={{ color: 'var(--fg-muted)' }}>1 h ago</td>
            </tr>
          </tbody>
        </table>
      </Frame>

      <SubHead meta="when to use">When to use each variant</SubHead>
      <div className="surface" style={{ padding: 14, marginBottom: 18 }}>
        <table className="tbl" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ width: 110 }}>Variant</th>
              <th>Use when</th>
              <th>Avoid when</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><AILabel variant="box"/></td>
              <td>You need the strongest signal — regulated workflows, or where one wrong character has cost.</td>
              <td>You're already in a tight inline run of badges.</td>
            </tr>
            <tr>
              <td><AILabel variant="mark">AI</AILabel></td>
              <td>You're attributing a paragraph or annotating a bullet point — reads as a footnote.</td>
              <td>It's a clickable trigger — the mark looks decorative.</td>
            </tr>
            <tr>
              <td><AILabel variant="pill">AI</AILabel></td>
              <td>The badge is a control — clickable for source / edit / revoke.</td>
              <td>The row already has 3+ pills — you'll lose the AI signal.</td>
            </tr>
            <tr>
              <td><AILabel variant="dot"/></td>
              <td>Inside a dense table cell where you can't spare even 18px.</td>
              <td>It's the only AI affordance on the page.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 10}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5, marginBottom: 12}}>A plain badge is decorative and not a Tab stop. With <code style={{fontFamily:'var(--font-mono)'}}>interactive</code> (or any <Mono tone="subtle">AILabelWithPopover</Mono>) it renders as a real <code style={{fontFamily:'var(--font-mono)'}}>role=&quot;button&quot;</code> with <code style={{fontFamily:'var(--font-mono)'}}>tabIndex=0</code>:</div>
          <table className="tbl" style={{ margin: 0 }}>
            <thead><tr><th style={{ width: 96 }}>Key</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td><kbd className="kbd">Tab</kbd></td><td>Move focus to / from the badge</td></tr>
              <tr><td><kbd className="kbd">Enter</kbd> <kbd className="kbd">Space</kbd></td><td>Toggle the source popover</td></tr>
              <tr><td><kbd className="kbd">Esc</kbd></td><td>Close the popover, focus returns to the badge</td></tr>
              <tr><td><kbd className="kbd">Tab</kbd> ×3</td><td>Step through Accept · Edit · Revoke inside the popover</td></tr>
            </tbody>
          </table>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The sparkle SVG is <code style={{fontFamily:'var(--font-mono)'}}>aria-hidden</code>; meaning comes from the badge&apos;s own <code style={{fontFamily:'var(--font-mono)'}}>aria-label</code> — <code style={{fontFamily:'var(--font-mono)'}}>&quot;AI-generated content&quot;</code>, or <code style={{fontFamily:'var(--font-mono)'}}>&quot;AI-generated content — view source&quot;</code> when interactive — so the label-less <Mono tone="subtle">dot</Mono> variant is still announced. The popover is <code style={{fontFamily:'var(--font-mono)'}}>role=&quot;dialog&quot;</code> labelled <code style={{fontFamily:'var(--font-mono)'}}>&quot;AI source&quot;</code>. The <Mono tone="subtle">revoked</Mono> state is conveyed visually (mute + strike) only — when rejection must be announced, pair it with adjacent text (e.g. <code style={{fontFamily:'var(--font-mono)'}}>aria-invalid</code> on the field, as the review demo above does).</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The interactive badge shows a 2px ember <code style={{fontFamily:'var(--font-mono)'}}>:focus-visible</code> ring (a <code style={{fontFamily:'var(--font-mono)'}}>--bg</code>/<code style={{fontFamily:'var(--font-mono)'}}>--ember</code> double-shadow that stays visible on any surface). Ember text on the pill&apos;s <code style={{fontFamily:'var(--font-mono)'}}>--ember-soft</code> fill, and the revoked muted/struck text, both clear AA — never re-tint the badge to a custom hue that drops below it.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The badge is static and the popover appears with no fade or scale — there is nothing to animate. The only movement is a <code style={{fontFamily:'var(--font-mono)'}}>background-color</code> transition on the interactive pill&apos;s hover/focus; under <code style={{fontFamily:'var(--font-mono)'}}>prefers-reduced-motion</code> that transition collapses to an instant colour change.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label="dir=&quot;rtl&quot; — sparkle moves to the trailing edge, label stays as 'AI'"
        code={`<div dir="rtl">
  <span>وصف الخدمة <AILabel variant="pill" size="sm">AI</AILabel></span>
  <span>identity-svc <AILabel variant="dot" size="sm"/></span>
</div>`}
      >
        <div dir="rtl" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-base)' }}>
            <span>وصف الخدمة</span>
            <AILabel variant="pill" size="sm">AI</AILabel>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <AILabel variant="box" size="sm"/>
            <AILabel variant="mark">AI</AILabel>
            <AILabel variant="dot"/>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-base)' }}>
            <span>identity-svc</span>
            <AILabel variant="dot" size="sm"/>
          </div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, marginBottom: 18, lineHeight: 1.6, maxWidth: '64ch' }}>
        The label text always stays as "AI" — it's an internationally recognised initialism. Only the layout flips: the sparkle glyph moves to the trailing edge, the pill's padding mirrors, and any popover anchor reads from the start side.
      </p>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative'}} aria-hidden="true">
              <AILabel variant="pill" size="lg">AI</AILabel>
              <span className="lead v" style={{top: -22, left: 14, height: 18}}/>
              <span className="lead v" style={{top: -22, right: 16, height: 18}}/>
              <span className="lead h" style={{top: 14, left: -28, width: 24}}/>
              <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
              <div className="pin" style={{top: -42, left: 14, transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: -42, right: 16, transform:'translateX(50%)'}}>2</div>
              <div className="pin" style={{top: 6, left: -52}}>3</div>
              <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Sparkle glyph.</b> 4-point Eidos mark in <Mono>currentColor</Mono>. 10–13px depending on size. Sits on the leading edge — flips to trailing in RTL.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Label.</b> Geist mono 11px, weight 600, letter-spacing 0.04em. Always "AI" — an internationally recognised initialism, never translated.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Accent color.</b> <Mono>var(--ember)</Mono> for text + border + glyph. One colour, one signal — never re-tint the badge.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Pill shape.</b> <Mono>border-radius: 999px</Mono> with <Mono>--ember-soft</Mono> fill and a 30%-ember border. Other variants (box, mark, dot) drop the fill but keep the same accent + glyph.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — attach to the value, not the page</div>
          <div className="body" style={{ padding: 14, justifyContent: 'flex-start' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-base)' }}>
              identity-svc <AILabel variant="dot" size="sm"/>
            </span>
          </div>
          <div className="note">Scope the label to the specific cell or value the model wrote.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — wrap the whole page in one badge</div>
          <div className="body" style={{ padding: 14, flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>
              <AILabel variant="pill" size="sm">AI</AILabel>
              <span>This page is AI-generated</span>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', marginTop: 4 }}>(then 30 fields, none of which are actually from the model)</div>
          </div>
          <div className="note">A page-level AI banner trains users to ignore the marker.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — show source on demand</div>
          <div className="body" style={{ padding: 14 }}>
            <AILabelWithPopover variant="pill" label="AI summary" ts="2 min ago" confidence={0.92}>
              Generated from the last 30 days of incident reports.
            </AILabelWithPopover>
          </div>
          <div className="note">Click reveals model, when it ran, confidence, and actions. Trust comes from transparency.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — write the source inline</div>
          <div className="body" style={{ padding: 14 }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
              <AILabel variant="pill" size="sm">AI</AILabel> · gpt-4o-mini at 14:02 with 92% confidence
            </span>
          </div>
          <div className="note">Source belongs in a popover, not in the row.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — keep the revoked state visible</div>
          <div className="body" style={{ padding: 14 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-base)' }}>
              T2 <AILabel variant="dot" size="sm" revoked/>
            </span>
          </div>
          <div className="note">After a user rejects the suggestion, leave the muted/struck mark in place — shows the field was reviewed.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — invent variants or colours</div>
          <div className="body" style={{ padding: 14, gap: 8 }}>
            <span className="ai-label pill" style={{ color: '#a78bfa', borderColor: 'rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.12)' }}>
              <span className="ai-glyph"><Spark/></span><span className="ai-text">AI</span>
            </span>
          </div>
          <div className="note">One colour (ember), one label ("AI"), one set of variants.</div>
        </div>
      </div>

      {/* 4. API REFERENCE */}
      <SubHead meta="AILabelProps">API reference</SubHead>
      <AutoPropsTable component="AILabel" label="<AILabel />"/>
      <AutoPropsTable component="AILabelWithPopover" label="<AILabelWithPopover />"/>
    </Section>
  );
}
