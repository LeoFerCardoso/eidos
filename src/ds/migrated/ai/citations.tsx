'use client';
// Forge AI — Citations: inline Citation chip + hover popover (§2.2 standard).
// This page covers the INLINE chip only. For the standalone Sources panel
// (the numbered list below an answer), see /ai/sources.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, Citation, Sources, AICaret, installTabs, Lede, Mono } from '@/ds/core';


  // ─── sample sources used across every demo ──────────────────────────────
  const SOURCES = [
    {
      id: 1,
      domain: 'datadog.com',
      title: 'Trace events for incident-0421 — billing-svc',
      url: 'https://app.datadoghq.com/apm/trace/0421',
      snippet: 'p99 latency rose to 412 ms between 02:14 and 02:38 UTC; root cause traced to retry storm on the edge → billing-svc edge.',
      fetched: '14:01 · 18s ago',
    },
    {
      id: 2,
      domain: 'github.com',
      title: 'config/grpc.toml — retry budget bumped to 8',
      url: 'https://github.com/forge/repo/commit/ab12cd',
      snippet: 'Increase retry_budget from 3 to 8 to absorb migration burst on identity-svc. Reviewed by @ops.',
      fetched: '14:01 · 18s ago',
    },
    {
      id: 3,
      domain: 'docs.forge.dev',
      title: 'Runbook · Tier-1 incident · billing-svc',
      url: 'https://docs.forge.dev/runbooks/tier-1/billing.md',
      snippet: 'Step 1: revert the most recent canary; Step 2: drop retry_budget to baseline; Step 3: rebind alert names.',
      fetched: '14:01 · 18s ago',
    },
    {
      id: 4,
      domain: 'notion.so',
      title: 'Postmortem · 0421 — alert binding regression',
      url: 'https://notion.so/forge/postmortem-0421',
      snippet: 'Renaming svc.latency.p99 → svc.lat.p99 silently un-bound the existing PagerDuty alert. Caught at 4% error rate.',
      fetched: '14:01 · 18s ago',
    },
  ];

  // ─── helpers ────────────────────────────────────────────────────────────
  const RespFrame = ({ children, meta }) => (
    <div className="ai-resp">
      <div className="ai-resp-stack">
        {meta && <div className="ai-resp-meta">{meta}</div>}
        <div className="ai-prose">{children}</div>
      </div>
    </div>
  );

  // ─── code snippets ──────────────────────────────────────────────────────
  const INLINE_CODE = `<p>The retry budget on <code>grpc.toml</code> was bumped from
3 to 8<Citation n={2} source={sources[1]}/>, which masked a downstream
timeout in <code>billing-svc</code><Citation n={1} source={sources[0]}/>.</p>`;

  const FULL_CODE = `<Response meta={…}>
  <h2>What changed in 0421</h2>
  <p>Three things shipped together — none broke in isolation.</p>
  <ul>
    <li>retry budget bumped 3 → 8<Citation n={2}/></li>
    <li>identity-svc pool 16 → 32<Citation n={3}/></li>
    <li>Datadog metric rename — alerts unbound<Citation n={4}/></li>
  </ul>
</Response>
<Sources sources={sources}/>`;

  // ─── density demo ───────────────────────────────────────────────────────
  const DensityDemo = () => {
    const [d, setD] = React.useState('low');
    const para = (
      d === 'low'
        ? <p>The retry budget bump from 3 to 8 in <code>grpc.toml</code> is the load-bearing change here<Citation n={2} source={SOURCES[1]}/>. Everything else — the pool resize, the metric rename — is bookkeeping.</p>
        : d === 'med'
        ? <p>The retry budget bump from 3 to 8 in <code>grpc.toml</code><Citation n={2} source={SOURCES[1]}/> is the load-bearing change. The pool resize<Citation n={3} source={SOURCES[2]}/> and the metric rename<Citation n={4} source={SOURCES[3]}/> are bookkeeping.</p>
        : <p>The retry budget<Citation n={2} source={SOURCES[1]}/> bump from 3<Citation n={2} source={SOURCES[1]}/> to 8<Citation n={2} source={SOURCES[1]}/> in <code>grpc.toml</code><Citation n={2} source={SOURCES[1]}/> is the load-bearing change<Citation n={1} source={SOURCES[0]}/> here<Citation n={1} source={SOURCES[0]}/>. The pool resize<Citation n={3} source={SOURCES[2]}/> and the metric rename<Citation n={4} source={SOURCES[3]}/> are bookkeeping<Citation n={3} source={SOURCES[2]}/>.</p>
    );
    return (
      <div style={{ width: '100%', maxWidth: 640 }}>
        <div className="btn-group" role="tablist" style={{ marginBottom: 14 }}>
          {['low','med','high'].map(k => (
            <button
              key={k}
              role="tab"
              aria-selected={d === k}
              className={'btn xs ' + (d === k ? 'ember' : 'outline')}
              onClick={() => setD(k)}
            >{k} density</button>
          ))}
        </div>
        <RespFrame meta={<><span className="name">Forge AI</span><span className="dot"/><span>density: {d}</span></>}>
          {para}
        </RespFrame>
        <p className="ds-caption" style={{ marginTop: 14 }}>
          {d === 'low'  && 'One claim, one chip. The reader can audit without distraction.'}
          {d === 'med'  && 'One chip per fact. Readable when claims are tightly packed.'}
          {d === 'high' && 'Citation soup — every word is annotated, no claim is identifiable. Avoid.'}
        </p>
      </div>
    );
  };

  // ─── live demos ─────────────────────────────────────────────────────────
  const InlineDemo = () => (
    <RespFrame meta={<><span className="name">Forge AI</span><span className="dot"/><span>14:02</span></>}>
      <p>The on-call paged because the retry budget on <code>grpc.toml</code> was bumped from 3 to 8<Citation n={2} source={SOURCES[1]}/>, which masked a downstream timeout in <code>billing-svc</code><Citation n={1} source={SOURCES[0]}/>. The runbook recommends reverting the most recent canary first<Citation n={3} source={SOURCES[2]}/>.</p>
      <p>Hover any chip to preview the source. Click to open it in a new tab.</p>
    </RespFrame>
  );

  // ─── states demo — every state a chip can be in ──────────────────────────
  // A single Citation is in exactly one of three states: grounded (popover),
  // silenced (no source → no popover, the chip's "empty" affordance), or
  // arriving during stream (renders inline with the text, no separate spinner).
  const StatesDemo = () => {
    const [streaming, setStreaming] = React.useState(true);
    React.useEffect(() => {
      const t = setTimeout(() => setStreaming(false), 2400);
      return () => clearTimeout(t);
    }, []);
    return (
      <div className="ds-grid cols-3" style={{ width: '100%' }}>
        {/* grounded — popover-capable */}
        <div>
          <div className="ds-caption" style={{ marginBottom: 8 }}>Grounded — has a source</div>
          <RespFrame meta={<><span className="name">Forge AI</span></>}>
            <p>Retry budget bumped to 8<Citation n={2} source={SOURCES[1]}/>.</p>
          </RespFrame>
          <p className="ds-caption" style={{ marginTop: 8 }}>Hover, focus, or click the chip to open the source popover.</p>
        </div>
        {/* silenced — no source, no popover */}
        <div>
          <div className="ds-caption" style={{ marginBottom: 8 }}>Silenced — no source</div>
          <RespFrame meta={<><span className="name">Forge AI</span></>}>
            <p>See gRPC retry-budget docs<Citation n={5} tone="neutral"/>.</p>
          </RespFrame>
          <p className="ds-caption" style={{ marginTop: 8 }}>Omit <Mono>source</Mono> and the chip renders without a popover — a bare rank that still maps to the panel.</p>
        </div>
        {/* streaming — chip arrives with the text */}
        <div>
          <div className="ds-caption" style={{ marginBottom: 8 }}>Streaming — chip arrives with the text</div>
          <RespFrame meta={<><span className="name">Forge AI</span><span className="dot"/><span>{streaming ? 'streaming…' : 'complete'}</span></>}>
            {streaming
              ? <p>Retry budget bumped to 8<AICaret/></p>
              : <p>Retry budget bumped to 8<Citation n={2} source={SOURCES[1]}/>.</p>}
          </RespFrame>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn xs outline" onClick={() => setStreaming(true)}>Replay stream</button>
            <span className="ds-caption">The chip snaps in with its claim — never a separate spinner.</span>
          </div>
        </div>
      </div>
    );
  };

  const FullDemo = () => (
    <div style={{ width: '100%', maxWidth: 720 }}>
      <RespFrame meta={<><span className="name">Forge AI</span><span className="dot"/><span>14:02 · with sources</span></>}>
        <h2>What changed in 0421</h2>
        <p>Three things shipped together — none broke in isolation, but their interaction is why on-call paged at 02:14<Citation n={1} source={SOURCES[0]}/>.</p>
        <ul>
          <li><b>grpc retry budget</b> bumped from <code>3</code> to <code>8</code> in <code>config/grpc.toml</code><Citation n={2} source={SOURCES[1]}/>.</li>
          <li><b>identity-svc pool</b> doubled (16 → 32) to absorb the migration burst<Citation n={3} source={SOURCES[2]}/>.</li>
          <li><b>Datadog metric rename</b> — old alert binding silently broke<Citation n={4} source={SOURCES[3]}/>.</li>
        </ul>
      </RespFrame>
      <div style={{ marginTop: 18 }}>
        <Sources sources={SOURCES}/>
      </div>
    </div>
  );

  const QuoteDemo = () => (
    <RespFrame meta={<><span className="name">Forge AI</span></>}>
      <p>The runbook is explicit on the order of operations:</p>
      <blockquote>
        Revert the most recent canary first. Only after p99 returns to baseline should you drop the retry budget back to 3.
        <cite>
          <a href={SOURCES[2].url} target="_blank" rel="noreferrer" style={{ color: 'var(--ember)' }}>
            {SOURCES[2].domain} · {SOURCES[2].title}
          </a>
        </cite>
      </blockquote>
      <p>If you skip the revert, the retry storm continues against the now-cold pool.</p>
    </RespFrame>
  );

  // ─── page ────────────────────────────────────────────────────────────────
export default function CitationsPage() {
  return (
    <Section
      id="ai-citations"
      num="08"
      title="Citations"
      desc="The inline Citation chip: a numbered superscript in prose that opens a popover with the source domain, title, snippet, and URL. Every grounded claim gets a chip — the number maps to the same entry in the Sources panel."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-citations')} ariaLabel="package manager"/>
      <Lede>For the numbered sources panel shown below the answer, see the Sources page at /ai/sources — citations and sources share a rank contract.</Lede>
      <Lede>
        Ships <Mono>Citation</Mono> (the inline chip + popover) and <Mono>Sources</Mono> (the numbered panel). Both import from <Mono>@/ds/core</Mono> — they share the <Mono>.ai-cite-*</Mono> CSS in <Mono>ai.css</Mono>. This page documents the chip; the panel is on the <a href="/ai/sources" style={{ color: 'var(--ember)' }}>Sources</a> page.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="Citation — numbered chip inline in prose, hover for source popover" code={INLINE_CODE} height={260}>
        <InlineDemo/>
      </Frame>
      <p className="ds-caption">
        Wrap each grounded claim with a <Mono>{'<Citation n={1} source={sources[0]}/>'}</Mono> chip. The number matches the rank in the companion <Mono>Sources</Mono> panel. Hover or focus reveals the popover; click navigates to the source URL.
      </p>

      {/* EXAMPLES EYEBROW */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      {/* CROSS-LINK note (replaces the panel-only demo that moved to /ai/sources) */}
      <div className="surface" style={{ padding: 14, marginBottom: 18 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--ember)' }}>Sources panel →</span>
        {' '}
        <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.6 }}>
          The numbered list of retrieved documents that sits below the answer (rank · title · domain · snippet · retrieved-at) is documented on the{' '}
          <a href="/ai/sources" style={{ color: 'var(--ember)' }}>Sources</a>{' '}
          page. Both components share the same source shape and the same numbering contract.
        </span>
      </div>

      {/* CHIP VARIANTS — tone */}
      <SubHead meta="ember · neutral">Tone variants</SubHead>
      <Frame label="ember (grounded claim) · neutral (ungrounded / supplemental reference)" height={180}>
        <div style={{ maxWidth: 560, width: '100%' }}>
          <RespFrame meta={<><span className="name">Forge AI</span></>}>
            <p>
              The retry storm is confirmed in the trace data<Citation n={1} source={SOURCES[0]} tone="ember"/>.
              See also the general gRPC docs<Citation n={2} tone="neutral"/> for background on retry budgets.
            </p>
          </RespFrame>
        </div>
      </Frame>
      <p className="ds-caption">
        <Mono>tone="ember"</Mono> (default) for grounded claims — the source is a retrieved document that directly supports the statement. <Mono>tone="neutral"</Mono> for supplemental references that add context but are not the primary evidence.
      </p>

      {/* STATES */}
      <SubHead meta="grounded · silenced · streaming">States</SubHead>
      <Frame label="a chip is in exactly one state — grounded (popover) · silenced (no source) · arriving mid-stream" height={300}>
        <StatesDemo/>
      </Frame>
      <p className="ds-caption">
        A citation has no loading spinner of its own: it either resolves to a source (popover) or it doesn't (<Mono>source</Mono> omitted → a bare rank, still mapped to the panel). While the answer streams, the chip is appended after its claim alongside the <Mono>AICaret</Mono> and snaps in with the rest of the text — there is no intermediate placeholder.
      </p>

      {/* FULL — main demo */}
      <SubHead meta="response + sources together">Inline + sources</SubHead>
      <Frame label="the canonical pattern · response above · numbered sources below" code={FULL_CODE} height={760}>
        <FullDemo/>
      </Frame>
      <p className="ds-caption">
        The two pieces work as one unit. The reader scans the prose, taps a chip to verify, and falls naturally into the sources list to find the next document. Same numeric scheme top-to-bottom — never re-rank. The <a href="/ai/sources" style={{ color: 'var(--ember)' }}>Sources</a> page documents the panel surface and its variants (collapsible, empty state, custom onSelect handler).
      </p>

      {/* QUOTE */}
      <SubHead meta="verbatim quote">Cited block quote</SubHead>
      <Frame label="when the model quotes a source verbatim, source attribution sits in the cite slot" height={320}>
        <QuoteDemo/>
      </Frame>
      <p className="ds-caption">
        The blockquote already ships an attribution slot (<Mono>&lt;cite&gt;</Mono>). For verbatim quotes use it instead of a numeric chip — the link is heavier on the eye and that's correct: a quote is a stronger truth-claim than a paraphrase.
      </p>

      {/* DENSITY */}
      <SubHead meta="low · med · high">Citation density</SubHead>
      <Frame label="toggle to compare — most answers should sit at low / med" height={340}>
        <DensityDemo/>
      </Frame>
      <p className="ds-caption">
        Cite once per claim. Citing every word makes every word equally suspect; citing nothing makes the answer un-auditable. The middle is the only useful place to live.
      </p>

      {/* A11Y */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Each inline chip is a real <code style={{fontFamily:'var(--font-mono)'}}>&lt;button&gt;</code> in the text flow: Tab reaches it, Enter/Space opens the source popover, Esc closes it and returns focus to the chip. The popover stays open while focus is inside it (the 150ms close delay is for the mouse, not the keyboard). In the sources panel, each entry's title is a normal link reached by Tab and opened with Enter.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The chip carries <code style={{fontFamily:'var(--font-mono)'}}>aria-haspopup="dialog"</code> + <code style={{fontFamily:'var(--font-mono)'}}>aria-expanded</code>, and an <code style={{fontFamily:'var(--font-mono)'}}>aria-label="Source 2, github.com"</code> so the bare numeral isn't read as a stray digit. The popover is <code style={{fontFamily:'var(--font-mono)'}}>role="dialog"</code> labelled by the source title. The panel is an ordered list (<code style={{fontFamily:'var(--font-mono)'}}>&lt;ol&gt;</code>) so the rank is conveyed by structure, matching the inline numbers.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Focus order is chip → its popover → next chip → … → panel, mirroring reading order. The chip shows a visible focus ring; its ember-soft square keeps the tabular numeral at AA against the chip fill, and panel link text, domain caption, and snippet all clear AA on the prose surface — the number is the link between layers, not colour.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Under <code style={{fontFamily:'var(--font-mono)'}}>prefers-reduced-motion</code> the popover appears and dismisses instantly with no fade or slide, and chips that arrive while the answer is still streaming snap in with the rest of the text rather than animating.</div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — chip + popover anchor mirror automatically" height={380}>
        <div dir="rtl" style={{ width: '100%' }}>
          <RespFrame meta={<><span className="name">Forge AI</span></>}>
            <p>تم رفع ميزانية إعادة المحاولة في <code>grpc.toml</code> من 3 إلى 8<Citation n={2} source={SOURCES[1]}/>، مما أخفى مهلة منتهية في <code>billing-svc</code><Citation n={1} source={SOURCES[0]}/>.</p>
          </RespFrame>
          <div style={{ marginTop: 18 }}>
            <Sources sources={SOURCES.slice(0, 2)} title="المصادر"/>
          </div>
        </div>
      </Frame>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 520 }} aria-hidden="true">
              <RespFrame meta={<><span className="name">Forge AI</span></>}>
                <p>The retry budget bump<span className="ai-cite-chip" style={{ marginInlineStart: 2 }}>2</span> masked a timeout in billing-svc.</p>
              </RespFrame>
              <div style={{ marginTop: 14 }}>
                <Sources sources={SOURCES.slice(0, 2)}/>
              </div>
              <span className="lead h" style={{ top: 36, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 100, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 154, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 220, left: -32, width: 28 }}/>
              <div className="pin" style={{ top: 30, left: -54 }}>1</div>
              <div className="pin" style={{ top: 94, left: -54 }}>2</div>
              <div className="pin" style={{ top: 148, left: -54 }}>3</div>
              <div className="pin" style={{ top: 214, left: -54 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 620, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Inline chip.</b> 16px ember-soft square with a tabular-numbers digit. Sits flush with the character that precedes it — no extra inline-margin, so the reader's eye does not break stride.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Hover popover.</b> Domain + title + snippet + URL. Stays open while the cursor is over chip or popover (150ms close delay). Keyboard: Enter/Space opens; Esc closes and returns focus to the chip. <Mono>role="dialog"</Mono> with the source title as the accessible name.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Number rank.</b> The value in the chip must match the <Mono>id</Mono> of the corresponding entry in the companion <a href="/ai/sources" style={{ color: 'var(--ember)' }}>Sources</a> panel. This is the only link between the two surfaces — never re-rank.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Sources panel (companion).</b> The numbered list of retrieved documents below the answer. Documented on the <a href="/ai/sources" style={{ color: 'var(--ember)' }}>Sources</a> page — the chip and panel are always used together.</span>
          </div>
        </div>
      </div>

      {/* DO/DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — cite once per claim</div>
          <div className="body" style={{ padding: 14 }}>
            <RespFrame meta={<><span className="name">Forge AI</span></>}>
              <p>Retry budget went from 3 to 8<Citation n={2} source={SOURCES[1]}/>. Pool size doubled<Citation n={3} source={SOURCES[2]}/>.</p>
            </RespFrame>
          </div>
          <div className="note">Each chip points at exactly one fact. The reader can audit each independently.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — citation-bomb every sentence</div>
          <div className="body" style={{ padding: 14 }}>
            <RespFrame meta={<><span className="name">Forge AI</span></>}>
              <p>The<Citation n={1} source={SOURCES[0]}/> retry<Citation n={2} source={SOURCES[1]}/> budget<Citation n={2} source={SOURCES[1]}/> went<Citation n={1} source={SOURCES[0]}/> from<Citation n={2} source={SOURCES[1]}/> 3<Citation n={2} source={SOURCES[1]}/> to<Citation n={2} source={SOURCES[1]}/> 8<Citation n={2} source={SOURCES[1]}/>.</p>
            </RespFrame>
          </div>
          <div className="note">Every chip dilutes the next. The reader gives up on auditing.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — keep numbers consistent across surfaces</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%' }}>
              <RespFrame meta={<><span className="name">Forge AI</span></>}>
                <p>See sources [1] and [3]<Citation n={1} source={SOURCES[0]}/><Citation n={3} source={SOURCES[2]}/></p>
              </RespFrame>
              <div style={{ marginTop: 12 }}>
                <Sources sources={[SOURCES[0], SOURCES[2]]}/>
              </div>
            </div>
          </div>
          <div className="note">[1] in the prose maps to [1] in the panel. Always.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — re-rank per paragraph</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.7 }}>
              ¶1 · cites [1], [2]<br/>
              ¶2 · cites [1], [2] (different sources!)<br/>
              ¶3 · cites [1], [2] (different again!)<br/>
              <span style={{ color: 'var(--danger)' }}>panel · 6 entries, no map</span>
            </div>
          </div>
          <div className="note">Per-paragraph numbering destroys the chip → panel link. Number once across the whole response.</div>
        </div>
      </div>

      {/* PROPS */}
      <SubHead meta="API">API reference</SubHead>
      <AutoPropsTable component="Citation" label="<Citation />"/>
      <p className="ds-caption">
        <b>Source</b> shape: <Mono>&#123; id: number; domain: string; title: string; url: string; snippet: string; fetched: string &#125;</Mono>. The <Mono>fetched</Mono> field is human-formatted ("14:01 · 18s ago") because retrieval freshness is a judgment, not a sort key. Full <Mono>Sources</Mono> panel props (collapsible, onSelect, empty state) are documented on the <a href="/ai/sources" style={{ color: 'var(--ember)' }}>Sources</a> page.
      </p>
    </Section>
  );
}
