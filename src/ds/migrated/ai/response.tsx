'use client';
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, PropsTable, Response, ProseCode, MessageActions, installTabs, Lede, Mono } from '@/ds/core';


  // Response, ProseCode, and the streaming caret are now canonical DS-core
  // components (core/ai). This page imports them — no local re-implementation.
  // ResponseActions → <MessageActions surface="response"/>.

  // ─── code snippets shown in the page ─────────────────────────────────────
  const USAGE_CODE = `<Response meta={<>Eidos AI · 14:02 · gpt-5</>}>
  <h2>What changed in 0421</h2>
  <p>Three things shipped together — none of them broke in
     isolation, but their interaction is why on-call paged.</p>
  <ol>
    <li><b>grpc retry budget</b> bumped from <code>3</code> to <code>8</code></li>
    <li><b>identity-svc pool</b> doubled (16 → 32)</li>
    <li><b>Datadog metric rename</b> — alerts unbound</li>
  </ol>
</Response>`;

  const RICH_CODE = `<Response meta={<>Eidos AI · 14:02</>}>
  <h2>Migration plan</h2>
  <p>Run the dry-run first, then promote in two steps:</p>
  <ProseCode lang="bash">{
\`forge migrate --dry-run --target=billing-svc
forge migrate --promote --canary=10%
forge migrate --promote --canary=100%\`
  }</ProseCode>

  <table>
    <thead><tr><th>Step</th><th>Owner</th><th className="num">ETA</th></tr></thead>
    <tbody>
      <tr><td>Dry-run</td><td>infra</td><td className="num">5 min</td></tr>
      <tr><td>Canary</td><td>billing</td><td className="num">12 min</td></tr>
      <tr><td>Full roll</td><td>billing</td><td className="num">3 min</td></tr>
    </tbody>
  </table>

  <blockquote>
    The pool-size bump is the load-bearing change here — everything
    else is bookkeeping. <cite>migration-plan-0422.md</cite>
  </blockquote>
</Response>`;

  const DIAGRAM_CODE = `<Response meta={<>Eidos AI</>}>
  <h2>How the request flows</h2>
  <figure className="ai-diagram">
    {/* Drop any SVG, Mermaid render, or custom drawing here. */}
    <svg viewBox="0 0 600 200" width="600" height="200">…</svg>
    <figcaption>fig. 1 — request path through the 0421 stack</figcaption>
  </figure>
</Response>`;

  const STREAMING_CODE = `// The caret is injected as the LAST inline child of the LAST
// rendered block — so it sits next to the character that just
// printed, not on the line below.
<Response streaming meta={<>Eidos AI · streaming…</>}>
  <h3>Three things to check</h3>
  <p>Each is reversible — start with the cheapest first.</p>
  <ul>
    <li>grpc.toml — retry budget</li>
    <li>Datadog — svc.lat.p99</li>
    <li>deploy diff — last 24h</li>{/* ← caret lands here while typing */}
  </ul>
</Response>`;

  // ─── live demos ──────────────────────────────────────────────────────────

  const Sample = ({ children }) => (
    <div style={{ width: '100%' }}>{children}</div>
  );

  // The diagram below is hand-drawn SVG that uses Eidos tokens — no
  // dependency on Mermaid, but the same slot accepts it.
  const FlowDiagram = () => (
    <svg viewBox="0 0 600 220" width="100%" style={{ maxWidth: 600, height: 'auto' }} aria-hidden="true">
      <defs>
        <marker id="r-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--fg-muted)"/>
        </marker>
      </defs>
      {/* nodes — all label type is driven from the scale token (--text-xs / 11px);
          sub-labels are de-emphasised by fill, not by an off-scale size. */}
      <g fontFamily="var(--font-mono)" style={{ fontSize: 'var(--text-xs)' }} fill="var(--fg)" textAnchor="middle">
        <rect x="20"  y="80" width="110" height="56" rx="8" fill="var(--surface)" stroke="var(--border-strong)"/>
        <text x="75"  y="104">client</text>
        <text x="75"  y="121" fill="var(--fg-subtle)">browser</text>

        <rect x="170" y="80" width="120" height="56" rx="8" fill="var(--surface)" stroke="var(--border-strong)"/>
        <text x="230" y="104">edge router</text>
        <text x="230" y="121" fill="var(--fg-subtle)">cf-worker</text>

        <rect x="330" y="40" width="120" height="56" rx="8" fill="var(--surface)" stroke="var(--border-strong)"/>
        <text x="390" y="64">identity-svc</text>
        <text x="390" y="81" fill="var(--fg-subtle)" style={{ fontVariantNumeric: 'tabular-nums' }}>pool 32</text>

        <rect x="330" y="124" width="120" height="56" rx="8" fill="var(--ember-soft)" stroke="var(--ember)"/>
        <text x="390" y="148" fill="var(--ember-text)">billing-svc</text>
        <text x="390" y="165" fill="var(--ember-text)" style={{ fontVariantNumeric: 'tabular-nums' }}>retry × 8</text>

        <rect x="490" y="80" width="90" height="56" rx="8" fill="var(--surface)" stroke="var(--border-strong)"/>
        <text x="535" y="104">postgres</text>
        <text x="535" y="121" fill="var(--fg-subtle)">primary</text>
      </g>
      {/* edges */}
      <g stroke="var(--fg-muted)" strokeWidth="1.2" fill="none" markerEnd="url(#r-arr)">
        <line x1="130" y1="108" x2="170" y2="108"/>
        <path d="M 290 100 Q 310 100 330 68"/>
        <path d="M 290 116 Q 310 116 330 152"/>
        <line x1="450" y1="68"  x2="490" y2="100"/>
        <line x1="450" y1="152" x2="490" y2="116"/>
      </g>
    </svg>
  );

  // The hero/usage example — same demo we use to anchor the page.
  const HeroResponse = () => (
    <Response meta={<>
      <span className="name">Eidos AI</span>
      <span className="dot"/>
      <span>14:02 · gpt-5</span>
    </>}>
      <h2>What changed in 0421</h2>
      <p>Three things shipped together — none of them broke in isolation, but their interaction is why the on-call paged at 02:14.</p>
      <ol>
        <li><b>grpc retry budget</b> bumped from <code>3</code> to <code>8</code> in <code>config/grpc.toml</code>.</li>
        <li><b>identity-svc pool size</b> doubled (16 → 32) to absorb the migration burst.</li>
        <li><b>Datadog metric rename</b> — <code>svc.latency.p99</code> → <code>svc.lat.p99</code>. Old alerts still bound to the old name.</li>
      </ol>
      <p>The retry-budget bump masked a downstream timeout in <code>billing-svc</code>. Because the alert rename silently un-bound the alert, the page didn't fire until error rate hit 4%.</p>
    </Response>
  );

  // Long, mixed-content response — tables + code + blockquote + headings.
  const RichResponse = () => {
    const [vote, setVote] = React.useState(null);
    return (
      <Response
        meta={<>
          <span className="name">Eidos AI</span>
          <span className="dot"/>
          <span>14:08 · gpt-5</span>
        </>}
        actions={<MessageActions surface="response" onCopy={() => {}} onRegen={() => {}} vote={vote} onVote={setVote}/>}
      >
        <h2>Migration plan</h2>
        <p>Run the dry-run first, then promote in two canary steps. Each step is reversible; the full roll is the only one-way door.</p>

        <ProseCode lang="bash">{`forge migrate --dry-run --target=billing-svc
forge migrate --promote --canary=10%
forge migrate --promote --canary=100%`}</ProseCode>

        <h3>Owners + ETAs</h3>
        <table>
          <thead>
            <tr>
              <th>Step</th>
              <th>Owner</th>
              <th className="num">ETA</th>
              <th>Rollback</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Dry-run</td><td>infra</td><td className="num">5 min</td><td>n/a</td></tr>
            <tr><td>Canary 10%</td><td>billing</td><td className="num">12 min</td><td><code>forge canary --revert</code></td></tr>
            <tr><td>Full roll</td><td>billing</td><td className="num">3 min</td><td>previous-release pin</td></tr>
            <tr><td>Verify p99</td><td>oncall</td><td className="num">10 min</td><td>—</td></tr>
          </tbody>
        </table>

        <blockquote>
          The pool-size bump is the load-bearing change here — everything else is bookkeeping. If <code>identity-svc</code> p99 stays under 220 ms during canary, the rest will follow.
          <cite>migration-plan-0422.md · L4</cite>
        </blockquote>

        <h3>Watch list</h3>
        <ul>
          <li><a href="#">Datadog · billing p99</a> — alert at 250 ms for 5 min</li>
          <li><a href="#">Datadog · identity pool sat.</a> — alert at 80%</li>
          <li><a href="#">grafana · retries per request</a> — alert at 1.5</li>
        </ul>
      </Response>
    );
  };

  // Diagram demo — Response with a figure slot.
  const DiagramResponse = () => (
    <Response meta={<><span className="name">Eidos AI</span></>}>
      <h2>How the request flows</h2>
      <p>The retry storm comes from the <code>edge → billing-svc</code> path. Identity is touched on every hop but stays cold.</p>
      <figure className="ai-diagram">
        <FlowDiagram/>
        <figcaption>fig. 1 — request path through the 0421 stack. The accent edge is where retries amplify.</figcaption>
      </figure>
      <p>The fix is to drop the retry budget on the edge → billing edge specifically, not globally — the rest of the mesh benefits from the higher budget.</p>
    </Response>
  );

  // Streaming demo — multi-block answer, token-by-token. The caret rides
  // the tail of whatever block is currently being printed: it sits next
  // to the heading character while the heading types in, hops to the
  // paragraph as that block opens, then walks down the list items.
  const STREAM_SCRIPT = [
    { tag: 'h3', text: 'Three things to check' },
    { tag: 'p',  text: "Each is reversible — start with the cheapest first." },
    { tag: 'ul', items: [
      'grpc.toml — retry budget bumped from 3 to 8',
      'Datadog — svc.lat.p99 alert binding broke on rename',
      'deploy diff — last 24 hours, two services',
    ]},
  ];
  const STREAM_TOTAL = STREAM_SCRIPT.reduce((sum, b) =>
    sum + (b.text ? b.text.length : 0)
       + (b.items ? b.items.reduce((s, t) => s + t.length, 0) : 0), 0);

  const StreamingResponse = () => {
    const [n, setN] = React.useState(0);
    React.useEffect(() => {
      if (n >= STREAM_TOTAL) {
        const t = setTimeout(() => setN(0), 1800);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setN(n + 1), 28);
      return () => clearTimeout(t);
    }, [n]);
    const done = n >= STREAM_TOTAL;

    // Walk the script consuming `n` characters; emit only the blocks
    // (and partial last block) that have appeared so far.
    let remaining = n;
    const blocks = [];
    for (let i = 0; i < STREAM_SCRIPT.length; i++) {
      if (remaining <= 0) break;
      const b = STREAM_SCRIPT[i];
      if (b.text != null) {
        const slice = b.text.slice(0, remaining);
        const Tag = b.tag as React.ElementType;
        blocks.push(<Tag key={i}>{slice}</Tag>);
        remaining -= b.text.length;
      } else if (b.items) {
        const lis = [];
        for (let j = 0; j < b.items.length; j++) {
          if (remaining <= 0) break;
          const txt = b.items[j];
          lis.push(<li key={j}>{txt.slice(0, remaining)}</li>);
          remaining -= txt.length;
        }
        if (lis.length) blocks.push(<ul key={i}>{lis}</ul>);
      }
    }

    return (
      <Response
        streaming={!done}
        meta={<>
          <span className="name">Eidos AI</span>
          <span className="dot"/>
          <span>{done ? 'just now' : 'streaming…'}</span>
        </>}
      >
        {blocks}
      </Response>
    );
  };

  // Document-mode flow — short user turn (compact bubble) above a Response.
  // The user question composes the canonical .ai-resp.user / .ai-resp-q bubble
  // (trailing alignment, ember-soft fill, the tail radius, and the RTL flip all
  // come from ai.css) — no inline bubble styling on the page.
  const DocumentFlow = () => (
    <div style={{ width: '100%', maxWidth: 880, display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div className="ai-resp user">
        <div className="ai-resp-stack">
          <div className="ai-resp-q">
            Walk me through the 0421 release — what changed and why on-call paged.
          </div>
        </div>
      </div>
      <HeroResponse/>
    </div>
  );

  // ─── page ────────────────────────────────────────────────────────────────
export default function ResponsePage() {
  return (
    <Section
      id="ai-response"
      num="07"
      title="Response"
      desc={`Long-form, bubble-less model output — the "streamdown" surface. Real heading hierarchy, a 68ch prose body, and wide blocks (tables, diagrams, code, captioned figures) that escape the prose cap. Reach for it when the model routinely answers in multi-block markdown and a chat bubble would crush headings into bold and lists into wrapped lines. The streaming caret rides the tail of the live block, so it reads like text being written, not a spinner.`}
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-response')} ariaLabel="package manager"/>
      <Lede>
        Ships the <Mono>Response</Mono> frame, the <Mono>.ai-prose</Mono> typography system, the <Mono>ProseCode</Mono> block, and re-exports <Mono>AICaret</Mono> from <a href="/ai/message" style={{ color: 'var(--fg)' }}>AI / Message</a>. No markdown renderer is bundled — pass already-rendered nodes (we recommend <a href="https://github.com/remarkjs/react-markdown" target="_blank" rel="noreferrer" style={{ color: 'var(--fg)' }}>react-markdown</a> with the <Mono>.ai-prose</Mono> wrapper).
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="three-paragraph model answer · meta row · no avatar" code={USAGE_CODE} height={400}>
        <HeroResponse/>
      </Frame>
      <Lede>
        No bubble. No max-width constraint that crushes long sentences. The <Mono>.ai-prose</Mono> wrapper does the editorial work — headings, lists, inline code, links — at a real prose scale (68ch body, 28px <Mono>h1</Mono>, 22px <Mono>h2</Mono>).
      </Lede>

      {/* EXAMPLES HEAD */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      {/* RICH BODY */}
      <SubHead meta="headings · table · code · blockquote · actions">Rich body</SubHead>
      <Frame label="multi-block response with toolbar — hover to reveal actions" code={RICH_CODE} height={720}>
        <RichResponse/>
      </Frame>
      <Lede>
        Mix freely. Headings break the answer into scannable sections; tables carry data; code blocks carry runnable commands; the blockquote carries an attributable source. Each block respects its own width — the <Mono>.ai-prose</Mono> rules constrain narrative blocks to 68ch and let wide blocks (tables, code, diagrams) span the full 880px.
      </Lede>

      {/* DIAGRAM */}
      <SubHead meta="figure · diagram slot">Diagrams &amp; figures</SubHead>
      <Frame label="drop any SVG or Mermaid render into the .ai-diagram slot" code={DIAGRAM_CODE} height={520}>
        <DiagramResponse/>
      </Frame>
      <Lede>
        <Mono>.ai-diagram</Mono> is a bordered surface — Eidos doesn't bundle Mermaid, but the slot accepts whatever you render. Pair every diagram with a mono <Mono>&lt;figcaption&gt;</Mono> so the figure has a name when it travels.
      </Lede>

      {/* STREAMING */}
      <SubHead meta="streaming · token-by-token">Streaming</SubHead>
      <Frame label="caret rides the live character — heading → paragraph → list" code={STREAMING_CODE} height={420}>
        <StreamingResponse/>
      </Frame>
      <Lede>
        The streaming caret (<Mono>&lt;AICaret/&gt;</Mono>) is injected as the last inline child of the last rendered block, so it sits next to the character that just printed — never parked on a line below. As new blocks open (heading → paragraph → list), the caret hops to follow. Same keyframe, same accent as <a href="/ai/message" style={{ color: 'var(--fg)' }}>Message</a>.
      </Lede>

      {/* DOCUMENT FLOW */}
      <SubHead meta="composition · inside Conversation mode=&quot;document&quot;">Document-mode flow</SubHead>
      <Frame label="user question as compact bubble + assistant Response below" height={520}>
        <DocumentFlow/>
      </Frame>
      <Lede>
        The recommended layout for ChatGPT-style products. The user question stays a compact bubble at the trailing edge — it preserves the speaker boundary cheaply — and the assistant turn opens up into a full Response. See <a href="/ai/conversation" style={{ color: 'var(--fg)' }}>Conversation · document mode</a> for the wrapping shell.
      </Lede>

      {/* A11Y */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The prose body is reading content — Tab stops are its links, plus the per-code-block Copy button and the action toolbar (Copy / Regenerate / Upvote / Downvote / Share) below the answer, each fired with Enter/Space. The toolbar is keyboard-reachable even though it only reaches full opacity on hover; vote buttons toggle on Space and report their pressed state.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The frame is <code style={{fontFamily:'var(--font-mono)'}}>role="article"</code> with <code style={{fontFamily:'var(--font-mono)'}}>aria-roledescription="assistant response"</code>, and the content uses real <code style={{fontFamily:'var(--font-mono)'}}>h2</code>/<code style={{fontFamily:'var(--font-mono)'}}>h3</code>, lists, and <code style={{fontFamily:'var(--font-mono)'}}>&lt;table&gt;</code> with header cells so heading and table navigation work. While streaming, the body is an <code style={{fontFamily:'var(--font-mono)'}}>aria-live="polite"</code> region marked <code style={{fontFamily:'var(--font-mono)'}}>aria-busy="true"</code> until done, the <code style={{fontFamily:'var(--font-mono)'}}>AICaret</code> is <code style={{fontFamily:'var(--font-mono)'}}>aria-hidden</code>, and each <code style={{fontFamily:'var(--font-mono)'}}>&lt;figure&gt;</code> pairs with a <code style={{fontFamily:'var(--font-mono)'}}>&lt;figcaption&gt;</code> so diagrams have a name.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Focus order runs meta → body links → wide-block controls → actions, matching the read. Links are underlined as well as ember (not colour-only) and show a visible focus ring; 15px/1.65 body, inline-code ember chips, and mono captions all clear AA, and the accent edge in the flow diagram is reinforced by the "retry × 8" label, not hue alone.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Under <code style={{fontFamily:'var(--font-mono)'}}>prefers-reduced-motion</code> the streaming caret stops blinking and the token-by-token reveal can fall back to rendering the finished answer at once, while the action toolbar's opacity fade is dropped so it appears instantly on focus.</div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — headings, lists, blockquote all read from start" height={380}>
        <div dir="rtl" style={{ width: '100%' }}>
          <Response meta={<>
            <span className="name">Eidos AI</span>
            <span className="dot"/>
            <span>14:02</span>
          </>}>
            <h2>ما الذي تغير في 0421</h2>
            <p>ثلاثة تغييرات شُحنت معًا — لم يُسبب أي منها مشكلة بمعزل، لكن تفاعلها هو سبب استدعاء المناوب.</p>
            <ul>
              <li><b>ميزانية إعادة المحاولة في grpc</b> رُفعت من <code>3</code> إلى <code>8</code>.</li>
              <li><b>حجم تجمع identity-svc</b> تضاعف (16 → 32).</li>
              <li><b>إعادة تسمية مقياس Datadog</b> — التنبيهات القديمة لم تعد مربوطة.</li>
            </ul>
            <blockquote>
              التغيير الحامل هو رفع حجم التجمع. <cite>تقرير-0421</cite>
            </blockquote>
          </Response>
        </div>
      </Frame>
      <Lede>
        Every spacing rule uses logical properties (<Mono>padding-inline</Mono>, <Mono>border-inline-start</Mono>) so the RTL flip is automatic. The blockquote bar flips from leading to trailing without any per-rule override.
      </Lede>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 520 }} aria-hidden="true">
              <Response
                meta={<>
                  <span className="name">Eidos AI</span>
                  <span className="dot"/>
                  <span>just now</span>
                </>}
                actions={
                  <>
                    <button className="ai-resp-action"><Icons.copy size={14}/></button>
                    <button className="ai-resp-action"><Icons.refresh size={14}/></button>
                    <button className="ai-resp-action"><Icons.check size={14}/></button>
                  </>
                }
              >
                <h2>Heading at prose scale</h2>
                <p>Body at 15px / 1.65, capped at 68ch so the line length stays readable. Wide blocks — tables, code, diagrams — escape the cap.</p>
                <ProseCode lang="bash">{`forge incident replay --id 0421`}</ProseCode>
              </Response>
              <span className="lead h" style={{ top: 8,   left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 42,  left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 90,  left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 168, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 232, left: -32, width: 28 }}/>
              <div className="pin" style={{ top: 2,   left: -54 }}>1</div>
              <div className="pin" style={{ top: 36,  left: -54 }}>2</div>
              <div className="pin" style={{ top: 84,  left: -54 }}>3</div>
              <div className="pin" style={{ top: 162, left: -54 }}>4</div>
              <div className="pin" style={{ top: 226, left: -54 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 620, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Meta row.</b> Mono caption with speaker name + timestamp + model id. Slot an <a href="/ai/label" style={{ color: 'var(--fg)' }}>AI Label</a> here when the response is being surfaced outside a chat surface.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Heading.</b> Real <Mono>h2</Mono> at 22px. Use the same hierarchy a human writer would (<Mono>h1</Mono> only when the answer is its own document; <Mono>h2</Mono> for sections; <Mono>h3</Mono> for sub-sections).</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Prose body.</b> 15px / 1.65, capped at 68ch. Inline code uses the same ember-on-elevated chip as <Mono>Message</Mono> so callouts read across surfaces.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Wide block.</b> Code, table, diagram, figure — each gets a fully padded surface and escapes the 68ch prose cap. Code blocks ship with a mono header (lang + copy).</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Actions toolbar.</b> Sits below the body as its own row — not nailed to a bubble corner. Fades from 55% to 100% on hover, same affordance as Message but with 28px hit targets for desktop reading.</span>
          </div>
        </div>
      </div>

      {/* DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — use Response when the answer needs structure</div>
          <div className="body" style={{ padding: 14 }}>
            <Sample>
              <Response meta={<><span className="name">Eidos AI</span></>}>
                <h3>Three things to check</h3>
                <ul>
                  <li><code>grpc.toml</code> — retry budget</li>
                  <li>Datadog — <code>svc.lat.p99</code></li>
                  <li>deploy diff — last 24h</li>
                </ul>
              </Response>
            </Sample>
          </div>
          <div className="note">A heading + a list + inline code. The prose scale carries each cleanly; a bubble would crush them all into one paragraph.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — stuff a multi-block answer into a Message bubble</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="msg" style={{ width: '100%', maxWidth: 320 }}>
              <div className="msg-stack">
                <div className="msg-bubble">
                  <b>Three things to check</b><br/>
                  grpc.toml — retry budget<br/>
                  Datadog — svc.lat.p99<br/>
                  deploy diff — last 24h
                </div>
              </div>
            </div>
          </div>
          <div className="note">Headings flatten into bold. Lists become wrapped lines. The 78% bubble cap fights the content.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — let wide blocks escape the prose cap</div>
          <div className="body" style={{ padding: 14 }}>
            <Sample>
              <Response meta={<><span className="name">Eidos AI</span></>}>
                <p>Latency by service:</p>
                <table>
                  <thead><tr><th>svc</th><th className="num">p99</th></tr></thead>
                  <tbody>
                    <tr><td>billing</td><td className="num">221 ms</td></tr>
                    <tr><td>identity</td><td className="num">88 ms</td></tr>
                    <tr><td>orders</td><td className="num">142 ms</td></tr>
                  </tbody>
                </table>
              </Response>
            </Sample>
          </div>
          <div className="note">Tables get the full container width. Narrative paragraphs stay at 68ch.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — wrap Response in a chat bubble for "visual consistency"</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="msg" style={{ width: '100%', maxWidth: 360 }}>
              <div className="msg-stack" style={{ maxWidth: '78%' }}>
                <div className="msg-bubble">
                  <b>Heading</b><br/>
                  body text…<br/>
                  body text…<br/>
                  + a table that overflows
                </div>
              </div>
            </div>
          </div>
          <div className="note">The 78% cap and the rounded shell defeat the purpose of Response. If the answer needs structure, drop the bubble.</div>
        </div>
      </div>

      {/* PROPS */}
      <SubHead meta="ResponseProps">API reference</SubHead>
      <AutoPropsTable component="Response" label="<Response />"/>
      <PropsTable
        label="<ProseCode />"
        rows={[
          { prop: 'lang',     type: 'string',   default: '"bash"', description: 'Language label shown in the mono code-block header. Display-only — no syntax highlighting wired here.' },
          { prop: 'children', type: 'string',   required: true,    description: 'The code text. Copy button pulls from this verbatim.' },
        ]}
      />
    </Section>
  );
}
