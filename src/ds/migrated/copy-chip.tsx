'use client';
// Forge DS — Components / CopyChip
// .chip with click-to-copy affordance. Used for SHAs, service refs,
// k8s namespaces, tokens, API keys — anywhere a row exposes an identifier
// the reader will paste elsewhere.
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, CopyChip, TierBadge, HealthBadge, Lede, Mono, Kbd } from '@/ds/core';


  const USAGE_CODE = `import { CopyChip } from "@/components/forge/copy-chip"

export function Demo() {
  return (
    <CopyChip value="ghcr.io/forge/payments-api:a3f8e4c" label="a3f8e4c" />
  )
}`;

export default function CopyChipPage() {
  return (
    <Section id="copy-chip" title="Copy chip" desc="A chip that copies its value to clipboard on click. Behaves like .chip — mono, inline, kbd-shaped — but with a copy affordance and a brief 'Copied' state.">
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('copy-chip')} ariaLabel="package manager"/>
      <Lede>Ships <Mono>&lt;CopyChip/&gt;</Mono>. Renders <Mono>.chip.copy-chip</Mono> with a trailing copy icon; on click the chip becomes a <Mono>.is-copied</Mono> success surface for ~1.4s before reverting.</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" row code={USAGE_CODE}>
        <CopyChip value="ghcr.io/forge/payments-api:a3f8e4c" label="a3f8e4c"/>
        <CopyChip value="forge/payments-api"/>
        <CopyChip value="ns: production · cluster: us-east-2" label="prod · us-east-2"/>
      </Frame>

      <SubHead meta="default · ember · ice">Tones</SubHead>
      <Frame label="tint the chip to rank an identifier" row code={`<CopyChip value="forge/identity-svc" />              {/* default */}
<CopyChip value="identity-svc@4.18.2" tone="ember" /> {/* primary */}
<CopyChip value="prod-us-east-1"      tone="ice" />  {/* secondary */}`}>
        <CopyChip value="forge/identity-svc"/>
        <CopyChip value="identity-svc@4.18.2" tone="ember"/>
        <CopyChip value="prod-us-east-1" tone="ice"/>
      </Frame>
      <Lede>Default is the right call for a row of equal-weight refs. Reach for a tone only to <em>rank</em> one identifier against its neighbours: <Mono>ember</Mono> marks the primary identifier (the service ref or version a reader scans first), <Mono>ice</Mono> marks a secondary or environment ref (a namespace, a cluster). Both keep their mono label above AA — but stay within the single-accent budget: at most one ember chip in view.</Lede>

      <div className="ds-examples-rule" style={{ marginBlockStart: 36, marginBlockEnd: 6 }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      <SubHead meta="value vs. label">Truncate the display, copy the full value</SubHead>
      <Frame label="show a short SHA · copy the full image ref" row code={`<CopyChip
  value="ghcr.io/forge/payments-api:a3f8e4c2d9b817f6"
  label="a3f8e4c"
/>`}>
        <CopyChip value="ghcr.io/forge/payments-api:a3f8e4c2d9b817f6e4d8e3b0e2af1a06c8d7b5a9" label="a3f8e4c"/>
        <CopyChip value="sk_live_8x4Pr••••••••••••" label="sk_live_8x4···"/>
        <CopyChip value="ns: forge-prod-us-east-2-aurora-cluster-01" label="forge-prod-us-east-2"/>
      </Frame>
      <Lede>Show what's scannable (a 7-char SHA, a friendly ref), but copy the full canonical string. Readers paste the long version; they only ever read the short one.</Lede>

      <SubHead meta="in context">Service detail composition</SubHead>
      <Frame label="every identifier as a copy chip">
        <div style={{padding:'14px 16px', border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', background:'var(--surface)'}}>
          <div style={{display:'flex', alignItems:'center', gap: 12, marginBottom: 12}}>
            <span style={{fontSize: 'var(--text-lg)', fontWeight: 600, color:'var(--fg)'}}>payments-api</span>
            <TierBadge tier="T1"/>
            <HealthBadge state="up"/>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'auto 1fr', gap: '10px 16px', alignItems:'center', fontSize: 'var(--text-base)'}}>
            <span style={{color:'var(--fg-faint)', fontFamily:'var(--font-mono)'}}>ref</span>           <CopyChip value="forge/payments-api"/>
            <span style={{color:'var(--fg-faint)', fontFamily:'var(--font-mono)'}}>image</span>         <CopyChip value="ghcr.io/forge/payments-api:a3f8e4c" label="ghcr.io/forge/payments-api:a3f8e4c"/>
            <span style={{color:'var(--fg-faint)', fontFamily:'var(--font-mono)'}}>commit</span>        <CopyChip value="a3f8e4c2d9b817f6e4d8e3b0e2af1a06c8d7b5a9" label="a3f8e4c"/>
            <span style={{color:'var(--fg-faint)', fontFamily:'var(--font-mono)'}}>namespace</span>     <CopyChip value="forge-payments-prod" label="forge-payments-prod"/>
            <span style={{color:'var(--fg-faint)', fontFamily:'var(--font-mono)'}}>cluster</span>       <CopyChip value="prod-us-east-2"/>
          </div>
        </div>
      </Frame>

      <SubHead meta="state">Copied state</SubHead>
      <Frame label="click any chip — confirmation is seen and spoken, never colour alone" row code={`<CopyChip value="copy me" />`}>
        <CopyChip value="try clicking me"/>
        <CopyChip value="forge://catalog/agents/code-reviewer-v2" label="catalog://agents/code-reviewer"/>
      </Frame>
      <div style={{display:'flex', flexWrap:'wrap', alignItems:'center', gap: 10, marginBlockStart: 14, fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', letterSpacing:'0.04em', color:'var(--fg-faint)'}}>
        <span style={{color:'var(--fg-subtle)'}}>on click</span>
        <span>clipboard.writeText(value)</span>
        <Icons.arrowRight size={12}/>
        <span>aria-live: &ldquo;Copied&rdquo;</span>
        <Icons.arrowRight size={12}/>
        <span>copy &rarr; check icon</span>
        <Icons.arrowRight size={12}/>
        <span>revert after 1.4s</span>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 10}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginBottom: 12}}>The chip is a real <Mono>&lt;button&gt;</Mono>, so it is in the tab order and copies without a pointer — no custom handlers.</div>
          <div style={{display:'flex', flexDirection:'column', gap: 6}}>
            <Kbd label="Move focus to the chip" keys="Tab"/>
            <Kbd label="Copy value to clipboard" keys="Enter"/>
            <Kbd label="Copy value to clipboard" keys="Space"/>
          </div>
          <div style={{color: 'var(--fg-faint)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginTop: 10}}>Focus stays on the chip through the copied state, so a reader can copy several refs in a row without losing their place.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The button's accessible name is the action, not the alias: <Mono>aria-label="Copy {'{'}value{'}'}"</Mono>, so even when the visible label is a truncated SHA the reader hears the full string being copied. On success a <Mono>role="status" aria-live="polite"</Mono> region announces <Mono>"Copied"</Mono> — the confirmation is spoken, never a silent colour shift.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The chip shows the ember focus ring (<Mono>--ring</Mono>) against the surface. The copied state pairs the success-tinted surface with a check glyph, so confirmation reads from the icon and the live region — not from colour alone; the default, ember, and ice mono labels each clear AA.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The copied surface cross-fades for ~1.4s then reverts. Under prefers-reduced-motion the global guard collapses the transition to instant, so the state still toggles without the fade.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — copy icon moves to the leading (left) edge'} center code={`<div dir="rtl"><CopyChip value="…" label="…"/></div>`} lang="tsx">
        <div dir="rtl" style={{display:'flex', flexWrap:'wrap', gap: 12, alignItems:'center'}}>
          <CopyChip value="ghcr.io/forge/payments-api:a3f8e4c" label="a3f8e4c"/>
          <CopyChip value="forge/payments-api"/>
          <CopyChip value="ns: production · cluster: us-east-2" label="prod · us-east-2"/>
        </div>
      </Frame>
      <Lede>The chip is an <Mono>inline-flex</Mono> button, so under <Mono>dir="rtl"</Mono> its label right-aligns and the trailing copy icon moves to the leading (left) edge automatically — no override needed. The copy glyph is non-directional, so it is not mirrored. The chip's value (image refs, SHAs, namespaces) stays LTR, which is correct: those identifiers are read and pasted left-to-right regardless of UI direction.</Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 48px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <CopyChip value="ghcr.io/forge/payments-api:a3f8e4c" label="a3f8e4c" />
              {/* pin 1 — code text */}
              <span className="lead v" style={{ top: -28, left: '30%', height: 22 }} />
              <div className="pin" style={{ top: -50, left: '30%', transform: 'translateX(-50%)' }}>1</div>
              {/* pin 2 — copy button icon */}
              <span className="lead v" style={{ top: -28, right: 10, height: 22 }} />
              <div className="pin" style={{ top: -50, right: 10, transform: 'translateX(50%)' }}>2</div>
              {/* pin 3 — chip surface / shape */}
              <span className="lead v" style={{ bottom: -28, left: '50%', height: 22 }} />
              <div className="pin" style={{ bottom: -50, left: '50%', transform: 'translateX(-50%)' }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '60px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Code text.</b> Rendered in <Mono>var(--font-mono)</Mono> at 11px. The visible <Mono>label</Mono> may be a truncated alias (a 7-char SHA, a friendly ref) while the full canonical string lives in <Mono>value</Mono> — what actually goes to the clipboard.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Copy button.</b> A trailing copy icon (<Mono>Icons.copy</Mono> 12px). On click — or Enter/Space — it writes <Mono>value</Mono> to the clipboard. Transitions to a <Mono>Icons.check</Mono> success icon for ~1.4s, then reverts. The whole chip is a real <Mono>&lt;button&gt;</Mono>.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Chip surface.</b> <Mono>.chip</Mono> — the kbd-shaped inline surface: 6px radius, 4px vertical / 8px horizontal padding, <Mono>var(--surface-active)</Mono> fill. On the <Mono>.is-copied</Mono> state the fill shifts to a success tint for clear visual confirmation without colour alone.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — wrap any identifier worth pasting</div>
          <div className="body"><CopyChip value="a3f8e4c2d9b817f6e4d8e3b0e2af1a06c8d7b5a9" label="a3f8e4c"/></div>
          <div className="note">SHAs, image refs, namespaces, API keys, agent IDs, MCP server URIs — every "copy-paste-able" string deserves a chip.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use for prose or labels</div>
          <div className="body"><CopyChip value="Last deployed 3 minutes ago"/></div>
          <div className="note">Copy chips are for <em>copy-paste targets</em>. Don't wrap human-readable phrases in them — that's a label or a tooltip.</div>
        </div>
      </div>

      <SubHead meta="CopyChipProps">API reference</SubHead>
      <AutoPropsTable component="CopyChip" label="<CopyChip />"/>
      <p style={{fontSize: 'var(--text-base)', color:'var(--fg-faint)', marginTop: 10, lineHeight: 1.6}}>Uses <Mono>navigator.clipboard.writeText</Mono> when available, with a hidden <Mono>textarea</Mono> + <Mono>document.execCommand</Mono> fallback for older webview embeds.</p>
    </Section>
  );
}
