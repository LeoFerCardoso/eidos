'use client';
// Eidos DS — Components / RelativeTime
// Humanised time-ago label. Updates every 60s. Opt-in Eidos tooltip reveals the
// absolute datetime with seconds — on hover, and on keyboard focus when the
// wrapper is given a tab stop (see TimeTip / the Eidos-tooltip demo below).
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, RelativeTime, Avatar, Lede, Mono } from '@/ds/core';

  const row  = { display: 'flex', alignItems: 'center', gap: 8 };

  // Mirrors the shipped fmtFull() so the page-authored .tt bubble carries the
  // exact same "date · time · seconds" string the component emits — used to make
  // the documented keyboard path (focus reveals the absolute timestamp) fire here.
  const fullOf = (d: Date) =>
    `${d.toLocaleDateString(undefined, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })} · ${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;

  // Focusable .tt wrapper: a real tab stop + role/label so keyboard users can
  // reveal the absolute datetime (`.tt[data-tt]:focus-within` + canonical ring),
  // not just hover. Wraps the plain <time>, which keeps its native `title`.
  const TimeTip = ({ value, side }: { value: Date; side?: 'top' | 'bottom' | 'left' | 'right' }) => (
    <span
      className={['tt', side && side !== 'top' ? side : ''].filter(Boolean).join(' ')}
      data-tt={fullOf(value)}
      tabIndex={0}
      role="button"
      aria-label={`Reveal exact timestamp: ${fullOf(value)}`}
    >
      <RelativeTime value={value}/>
    </span>
  );

  const M = 60_000;
  const samples = [
    { label: 'just now',     value: new Date(Date.now() - 2_000) },
    { label: '3 min ago',    value: new Date(Date.now() - 3 * M) },
    { label: '47 min ago',   value: new Date(Date.now() - 47 * M) },
    { label: '2 h ago',      value: new Date(Date.now() - 2 * 60 * M) },
    { label: '5 d ago',      value: new Date(Date.now() - 5 * 24 * 60 * M) },
    { label: '3 mo ago',     value: new Date(Date.now() - 90 * 24 * 60 * M) },
    { label: 'in 4 d',       value: new Date(Date.now() + 4 * 24 * 60 * M) },
  ];

  const USAGE = `import { RelativeTime } from "@/components/forge/relative-time"

<RelativeTime value={new Date(Date.now() - 3 * 60_000)}/>
{/* "3 min ago" — native browser tooltip (title) with absolute datetime */}

<RelativeTime value={deploy.at} tooltip/>
{/* Same label — designed .tt bubble reveals full date+time on hover */}

{/* Keyboard parity: make the wrapper a tab stop so focus reveals it too */}
<span className="tt" data-tt={full} tabIndex={0} role="button"
      aria-label={\`Reveal exact timestamp: \${full}\`}>
  <RelativeTime value={deploy.at}/>
</span>

<RelativeTime value={incident.opened} absolute/>
{/* "Mon · 14:32 · 3 min ago" — caller wants both at once */}`;

export default function RelativeTimePage() {
  return (
    <Section id="relative-time" title="Relative time" desc="Humanised time-ago label that updates every 60 seconds. The absolute datetime is exposed via a native browser tooltip — opt into the Eidos .tt tooltip for a designed bubble with seconds-precision.">
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('relative-time')} ariaLabel="package manager"/>
      <Lede>Renders inside a semantic <Mono>&lt;time&gt;</Mono> element. Pass <Mono>tooltip</Mono> to wrap the time in a <Mono>.tt</Mono> tooltip — hover reveals the full date, time and seconds. Pass <Mono>absolute</Mono> to show both inline.</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic · native tooltip on title" row code={USAGE}>
        <span style={row}>
          <span style={{ color:'var(--fg-muted)' }}>deploy promoted</span>
          <RelativeTime value={new Date(Date.now() - 3 * M)}/>
        </span>
      </Frame>

      <SubHead meta="hover OR Tab to the cell">Eidos tooltip</SubHead>
      <Frame label="hover — or Tab — the cell · .tt bubble shows full datetime · seconds" row>
        <span style={row}>
          <span style={{ color:'var(--fg-muted)' }}>last deploy</span>
          <TimeTip value={new Date(Date.now() - 47 * M)}/>
          <span style={{ color:'var(--fg-muted)', marginInlineStart: 24 }}>incident opened</span>
          <TimeTip value={new Date(Date.now() - 2 * 60 * M)}/>
        </span>
      </Frame>
      <Lede>The tooltip composes the design system's <Mono>.tt</Mono> primitive — no extra dependency, no custom bubble. Give the wrapper a tab stop (<Mono>tabIndex={'{0}'}</Mono> + <Mono>role="button"</Mono>) and the same bubble reveals on keyboard focus, with the canonical focus ring — try it: <Mono>Tab</Mono> to a cell above.</Lede>

      <SubHead meta="every bucket">Scale</SubHead>
      <Frame label="seconds → years (incl. future) · Tab through to reveal each absolute instant">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 14, fontSize: 'var(--text-base)' }}>
          {samples.map((s, i) => (
            <span key={i} style={row}>
              <span style={{ width: 88, color:'var(--fg-muted)', fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums' }}>{s.label}</span>
              <TimeTip value={s.value}/>
            </span>
          ))}
        </div>
      </Frame>

      <SubHead meta="absolute + relative">Absolute mode</SubHead>
      <Frame label="show both at once — useful for audit logs" row>
        <RelativeTime value={new Date(Date.now() - 47 * M)} absolute/>
      </Frame>

      <SubHead meta="in context">In context</SubHead>
      <Frame label="audit log · activity feed · deploy table">
        <div style={{ display:'flex', flexDirection:'column', gap: 10, fontSize: 'var(--text-base)' }}>
          {[
            { who: { initials: 'AS', name: 'Ana Souza' }, what: 'promoted forge-api v2.1.7 to canary', at: new Date(Date.now() - 4 * M) },
            { who: { initials: 'MP', name: 'Marc P.' },   what: 'commented on INC-4137',              at: new Date(Date.now() - 27 * M) },
            { who: { initials: 'JL', name: 'João L.' },   what: 'merged #4218',                       at: new Date(Date.now() - 3 * 60 * M) },
          ].map((it, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 10, padding:'8px 12px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
              <Avatar p={it.who} size={20}/>
              <span style={{ flex: 1, color:'var(--fg-muted)' }}>
                <span style={{ color:'var(--fg)' }}>{it.who.name}</span> {it.what}
              </span>
              <TimeTip value={it.at}/>
            </div>
          ))}
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 10}}>Keyboard</div>
          <div style={{display:'grid', gridTemplateColumns:'auto 1fr', columnGap: 14, rowGap: 8, alignItems:'baseline', color:'var(--fg-muted)', fontSize:'var(--text-base)', lineHeight: 1.5}}>
            <Mono><b style={{color:'var(--fg)'}}>Tab</b></Mono><span>Moves to the next tooltip cell — each focusable wrapper is its own stop, in document order.</span>
            <Mono><b style={{color:'var(--fg)'}}>Tab</b> ↦ focus</Mono><span>Reveals the absolute <Mono>date · time · seconds</Mono> bubble, the same affordance hover gives a mouse user.</span>
            <Mono><b style={{color:'var(--fg)'}}>Shift+Tab</b></Mono><span>Moves to the previous cell; the bubble hides as focus leaves.</span>
            <Mono><b style={{color:'var(--fg)'}}>Esc</b></Mono><span>Not bound — the bubble is hover/focus-driven, not a dismissable layer, so it needs no close key.</span>
          </div>
          <div style={{marginTop: 12, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>The bare label is static text and adds <i>no</i> tab stop. Only the designed-tooltip wrapper (<Mono>role="button"</Mono> + <Mono>tabIndex={'{0}'}</Mono> + <Mono>aria-label</Mono>) is reachable, exactly as the demos above render.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>Rendered as a semantic <Mono>&lt;time&gt;</Mono> element with a machine-readable <Mono>dateTime</Mono> attribute, so the absolute instant is always available even though the visible text is relative ("3 minutes ago"). The focusable wrapper carries an <Mono>aria-label</Mono> spelling out the full timestamp, so the bubble's content is announced on focus and never relies on the visual layer. Because the label refreshes on a timer, the element is not a live region — it updates silently and is not re-announced on every tick.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>The tooltip wrapper takes the canonical offset focus ring (<Mono>.tt:focus-visible</Mono>) — the same one every interactive element gets, never <Mono>outline:none</Mono> with no substitute. The label uses muted body or mono text that clears AA contrast on the surfaces it sits in — table cells, activity rows, and metadata lines — and the bubble paints dark <Mono>--fg</Mono> on an elevated surface for the same reason.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>The 60-second text refresh is a plain swap with no animation, so there is nothing for <Mono>prefers-reduced-motion</Mono> to suppress. The designed tooltip fades with a short token transition (<Mono>--dur-fast</Mono>) that reduces to opacity-only under reduced motion.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — pure text; it aligns to the start, numerals stay LTR, nothing structural mirrors'} center code={`<div dir="rtl"><RelativeTime value={…}/></div>`} lang="tsx">
        <div dir="rtl" style={{display:'flex', alignItems:'center', gap: 8}}>
          <span style={{ color:'var(--fg-muted)' }}>تمت الترقية</span>
          <RelativeTime value={new Date(Date.now() - 3 * M)}/>
        </div>
      </Frame>
      <Lede>There is nothing structural to mirror — the label is pure inline text in a semantic <Mono>&lt;time&gt;</Mono>. Under <Mono>dir="rtl"</Mono> it aligns to the start (right) edge and the localized words flow right-to-left, while the numerals in "2h" stay left-to-right per the bidi algorithm. Localize the unit words for the active locale; the component itself is direction-agnostic.</Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 48px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <RelativeTime value={new Date(Date.now() - 47 * M)} tooltip />
              {/* pin 1 — relative string */}
              <span className="lead v" style={{ top: -28, left: '30%', height: 22 }} />
              <div className="pin" style={{ top: -50, left: '30%', transform: 'translateX(-50%)' }}>1</div>
              {/* pin 2 — title / datetime tooltip */}
              <span className="lead h" style={{ top: '50%', right: -30, width: 24 }} />
              <div className="pin" style={{ top: '50%', right: -54, transform: 'translateY(-50%)' }}>2</div>
              {/* pin 3 — auto-update tick */}
              <span className="lead v" style={{ bottom: -28, left: '50%', height: 22 }} />
              <div className="pin" style={{ bottom: -50, left: '50%', transform: 'translateX(-50%)' }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '60px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Relative string.</b> Humanised label — "just now", "3 min ago", "5 d ago", "in 4 d". Rendered inside a semantic <Mono>&lt;time&gt;</Mono> element. The bucket boundaries (seconds → minutes → hours → days → months) are fixed; the active bucket is chosen at render time and on each tick.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Tooltip (absolute datetime).</b> The machine-readable <Mono>dateTime</Mono> attribute always carries the ISO instant. Hovering reveals it as a native browser tooltip (<Mono>title</Mono>) by default, or as a designed <Mono>.tt</Mono> bubble when <Mono>tooltip</Mono> is set. The absolute string shows full date, time, and seconds.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Auto-update tick.</b> A <Mono>setInterval</Mono> at 60 s re-evaluates the bucket and swaps the visible string silently (no live-region announcement). The interval clears on unmount to prevent memory leaks. Under <Mono>prefers-reduced-motion</Mono> the optional tooltip fade reduces to instant.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pair with a designed tooltip on busy surfaces</div>
          <div className="body"><span style={row}><span style={{color:'var(--fg-muted)'}}>last seen</span><TimeTip value={new Date(Date.now() - 47 * M)}/></span></div>
          <div className="note">In a table with 100 rows the user needs the absolute time without leaving the cell.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — show only absolute in a busy feed</div>
          <div className="body" style={{ fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-muted)' }}>Mon Apr 12 2026 — 14:32:08 UTC-3</div>
          <div className="note">The reader can compute "how long ago" but it costs cognitive load. Lead with relative; reveal absolute.</div>
        </div>
      </div>

      <SubHead meta="RelativeTimeProps">API reference</SubHead>
      <AutoPropsTable component="RelativeTime" label="<RelativeTime />"/>
    </Section>
  );
}
