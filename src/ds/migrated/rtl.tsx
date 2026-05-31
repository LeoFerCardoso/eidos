'use client';
import { Icons, Section, SubHead, CodeBlock, Lede, Mono, Kbd } from '@/ds/core';

export default function RTL() {
  return (
    <Section
      id="rtl"
      num="05"
      title="RTL"
      desc="Forge uses logical CSS properties — components flip automatically under dir=rtl. Not yet shipped in a live RTL product, but the contracts below let you turn it on without rewrites."
    >
      {/* Status callout — honesty first */}
      <SubHead meta="status">Where this stands</SubHead>
      <div className="surface" style={{padding: 18, borderColor:'var(--warning-soft)', borderInlineStart:'3px solid var(--warning)'}}>
        <div style={{display:'flex', alignItems:'flex-start', gap: 12}}>
          <Icons.alert size={16} color="var(--warning)"/>
          <div>
            <div className="t-body" style={{fontWeight: 600, marginBottom: 4}}>RTL is supported, not validated.</div>
            <div className="t-body" style={{color:'var(--fg-muted)', maxWidth:'68ch'}}>
              Every layout in Forge uses logical properties (<Mono>margin-inline</Mono>, <Mono>padding-block</Mono>, <Mono>border-inline-start</Mono>) so flipping <Mono>dir=&quot;rtl&quot;</Mono> on the document root flips the chrome correctly. We have not yet shipped a product in Arabic or Hebrew, so before going live with RTL, validate with a native reader.
            </div>
          </div>
        </div>
      </div>

      {/* How to enable */}
      <SubHead meta="enable">Turn it on</SubHead>
      <CodeBlock label="HTML root" lang="html" code={`<!-- Per-document — recommended -->
<html lang="ar" dir="rtl" data-theme="dark">

<!-- Per-subtree — for a single Arabic block in an LTR product -->
<aside dir="rtl">
  <h2>القسم العربي</h2>
  <p>محتوى داخل واجهة بالإنجليزية.</p>
</aside>`}/>

      {/* Logical properties */}
      <SubHead meta="contract">The logical-property contract</SubHead>
      <Lede up>
        New components MUST use logical CSS properties. Physical properties like <Mono>margin-left</Mono> won't flip in RTL — they'll point the wrong way for an Arabic reader.
      </Lede>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Use these · avoid the physical equivalents</span></div>
        <table className="spec" style={{margin: 0}}>
          <thead><tr><th style={{padding:'10px 12px'}}>Use</th><th>Instead of</th><th>Why</th></tr></thead>
          <tbody>
            <tr><td className="tok-name">margin-inline-start</td><td className="mono">margin-left</td><td>Flips to the right in RTL</td></tr>
            <tr><td className="tok-name">padding-inline</td><td className="mono">padding-left + padding-right</td><td>One value, both sides correct</td></tr>
            <tr><td className="tok-name">border-inline-start</td><td className="mono">border-left</td><td>Active-state stripe stays on the leading edge</td></tr>
            <tr><td className="tok-name">inset-inline-start</td><td className="mono">left</td><td>Position relative to reading direction</td></tr>
            <tr><td className="tok-name">text-align: start</td><td className="mono">text-align: left</td><td>Aligns to the leading edge in any script</td></tr>
            <tr><td className="tok-name">flex-direction: row</td><td className="mono">row + manual reverse</td><td>Already direction-aware in flex</td></tr>
          </tbody>
        </table>
      </div>

      {/* Icon flipping */}
      <SubHead meta="icons">Icons that point</SubHead>
      <Lede up>
        Directional icons (arrows, chevrons, "next" markers) need to flip horizontally under RTL. Decorative or non-directional icons (search, settings, bell) stay as they are.
      </Lede>
      <CodeBlock label="rtl-icons.css" lang="css" code={`/* Flip directional icons inside an RTL subtree */
[dir="rtl"] .icon-directional {
  transform: scaleX(-1);
}

/* In JSX — pick the right icon per direction */
const Next = dir === 'rtl' ? Icons.arrowLeft : Icons.arrowRight;`}/>

      {/* Live preview */}
      <SubHead meta="live">Live preview</SubHead>
      <Lede up>
        The same component rendered LTR and RTL. The padding, border weight, and accent stripe all stay anchored to the leading edge — and the timestamp keeps its <Mono>tabular-nums</Mono> rhythm regardless of script.
      </Lede>
      <div className="ds-grid cols-2">
        <div dir="ltr" className="surface" style={{padding: 16, borderInlineStart:'3px solid var(--ember)'}}>
          <div className="ds-h-eyebrow">LTR · english</div>
          <div className="t-body" style={{fontWeight: 600, marginTop: 4}}>Deploy starts at <span style={{fontVariantNumeric:'tabular-nums'}}>14:30</span></div>
          <div className="t-small" style={{color:'var(--fg-muted)', marginTop: 4}}>Three approvers required before the rollout begins.</div>
        </div>
        <div dir="rtl" className="surface" style={{padding: 16, borderInlineStart:'3px solid var(--ember)'}}>
          <div className="ds-h-eyebrow">RTL · العربية</div>
          <div className="t-body" style={{fontWeight: 600, marginTop: 4}}>يبدأ النشر في الساعة <span style={{fontVariantNumeric:'tabular-nums'}}>14:30</span></div>
          <div className="t-small" style={{color:'var(--fg-muted)', marginTop: 4}}>ثلاثة معتمدين مطلوبون قبل بدء الطرح.</div>
        </div>
      </div>

      {/* Numbers + dates */}
      <SubHead meta="caveats">Numbers, dates, and the bidi gotcha</SubHead>
      <div className="ds-grid cols-2">
        <div className="surface" style={{padding: 16}}>
          <div className="t-small" style={{fontWeight: 600, marginBottom: 4}}>Numbers stay LTR</div>
          <div className="t-small" style={{color:'var(--fg-muted)'}}>
            Even inside Arabic text, numerals run left-to-right. The browser handles this — but mixed strings in spec tables can read inconsistently. Pin numerics with <Mono>font-variant-numeric: tabular-nums</Mono>.
          </div>
        </div>
        <div className="surface" style={{padding: 16}}>
          <div className="t-small" style={{fontWeight: 600, marginBottom: 4}}>Use <Mono>Intl.*</Mono> for formatting</div>
          <div className="t-small" style={{color:'var(--fg-muted)'}}>
            Dates, currencies, units — pass the <Mono>locale</Mono> through. Hardcoded <span style={{fontVariantNumeric:'tabular-nums'}}>&quot;DD/MM/YYYY&quot;</span> or <span style={{fontVariantNumeric:'tabular-nums'}}>&quot;R$ 1.234,56&quot;</span> formats become illegible the moment you ship a non-pt-BR product.
          </div>
        </div>
      </div>

      {/* Accessibility — RTL is a keyboard + bidi + motion concern ────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede up>
        Flipping direction is not only visual. Arrow-key semantics invert, the document must declare its language, and animations that slide content travel the opposite way. The contract holds in both directions.
      </Lede>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div className="t-small" style={{fontWeight: 600, marginBottom: 10}}>Keyboard — arrow semantics invert</div>
          <Kbd label="Move to the next item" meta="composer / tabs / menu" keys={['→ in LTR', '← in RTL']}/>
          <Kbd label="Move to the previous item" meta="" keys={['← in LTR', '→ in RTL']}/>
          <Kbd label="Jump to the first / last item" meta="logical, not geometric" keys={['Home', 'End']}/>
          <div className="t-small" style={{color:'var(--fg-muted)', marginTop: 10}}>
            Bind to <Mono>next</Mono>/<Mono>previous</Mono> intent, never to a literal <Mono>ArrowLeft</Mono> action — read <Mono>dir</Mono> at the event and resolve the logical direction.
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-small" style={{fontWeight: 600, marginBottom: 6}}>Screen reader — declare direction &amp; language</div>
          <div className="t-small" style={{color:'var(--fg-muted)'}}>
            Set <Mono>dir=&quot;rtl&quot;</Mono> and <Mono>lang=&quot;ar&quot;</Mono> on the root (or subtree) so the AT picks the correct voice and bidi algorithm. Directional icons that are decorative carry <Mono>aria-hidden</Mono>; ones that convey order get an <Mono>aria-label</Mono> that names the action (&quot;next&quot;), not the glyph. A single Arabic island inside an English page gets its own <Mono>dir</Mono> on the wrapper.
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-small" style={{fontWeight: 600, marginBottom: 6}}>Contrast — unchanged by mirroring</div>
          <div className="t-small" style={{color:'var(--fg-muted)'}}>
            Flipping direction never changes a foreground/background pair, so AA holds: muted body stays <Mono>--fg-muted</Mono> on <Mono>--surface</Mono>, the leading-edge accent stripe stays ember on the surface, and verified pills carry their own contrasting fill. Bidi numerals keep <Mono>tabular-nums</Mono> so a mixed-script timestamp stays aligned.
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-small" style={{fontWeight: 600, marginBottom: 6}}>Motion — slide direction follows reading</div>
          <div className="t-small" style={{color:'var(--fg-muted)'}}>
            Drawer and carousel translations are authored from the logical inline edge, so a panel that enters from the start slides from the right under RTL. Under <Mono>prefers-reduced-motion: reduce</Mono> the slide collapses to a fade, identical in both directions — no horizontal travel to track.
          </div>
        </div>
      </div>

      {/* Component audit — Phase 1 (Gap Analysis DEF-06) ─────────────────── */}
      <SubHead meta="audit · component-by-component">RTL audit · physical-transform components</SubHead>
      <Lede up>
        Most of the system flips for free via logical properties. A small set of components, however, use <Mono>transform: translateX(...)</Mono>, native scroll math, or absolute positioning — those need explicit RTL handling. This table is the canonical audit; every row is verified live on the component's own page under <Mono>dir=&quot;rtl&quot;</Mono>.
      </Lede>
      <div className="ds-frame">
        <div className="ds-frame-head">
          <span className="label">7 components · each verified live under dir=&quot;rtl&quot;</span>
          <span className="pill success" style={{marginInlineStart:'auto'}}><Icons.check size={10}/> 7 / 7 verified</span>
        </div>
        <table className="spec" style={{margin: 0}}>
          <thead>
            <tr>
              <th style={{width:'9.5rem'}}>Component</th>
              <th style={{width:'7.5rem'}}>Status</th>
              <th>What needs explicit RTL handling</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Switch',      <>Thumb uses <Mono>transform: translateX(…)</Mono> — the <Mono>[dir=&quot;rtl&quot;]</Mono> override on the track flips it. Verified at three sizes (sm / md / lg).</>],
              ['Slider',      <>Range fill direction is reversed via <Mono>[dir=&quot;rtl&quot;] .sl-range</Mono>. The thumb uses <Mono>translate(50%)</Mono> under RTL so it anchors to the value edge.</>],
              ['Calendar',    <>Day-grid uses logical columns; prev / next arrows pair with <Mono>scaleX(-1)</Mono> so the chevron points to the chronological neighbour, not the geometric one.</>],
              ['Date Picker', <>Inherits the Calendar fixes; the trigger input uses logical addons so the calendar icon trails correctly in both directions.</>],
              ['Carousel',    <>Scroll math is RTL-aware — uses negative <Mono>scrollLeft</Mono> semantics per the WHATWG spec. Verified on the autoplay loop and dot pagination.</>],
              ['Tabs',        <>Trail underline uses <Mono>inset-inline</Mono>; arrow keys swap LTR / RTL semantics (<Mono>←</Mono> = next under RTL).</>],
              ['Drawer',      <>The <Mono>side=&quot;start&quot;</Mono> / <Mono>side=&quot;end&quot;</Mono> props map to <Mono>inset-inline</Mono>; the trailing close button stays in the correct corner and the slide-in translation flips with the direction.</>],
            ].map(([name, notes]) => (
              <tr key={name as string}>
                <td className="tok-name" style={{color:'var(--fg)', fontWeight: 500}}>{name}</td>
                <td>
                  <span className="pill success"><Icons.check size={10}/> verified</span>
                </td>
                <td style={{color:'var(--fg-muted)', lineHeight: 1.5}}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Lede>
        If you add a component that uses any of: <Mono>transform: translateX</Mono>, native <Mono>scrollLeft</Mono>, absolute pixel insets, or directional icons — add a row here and verify the component's own page renders correctly inside <Mono>dir=&quot;rtl&quot;</Mono>.
      </Lede>
    </Section>
  );
}
