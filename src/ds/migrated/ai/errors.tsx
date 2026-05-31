'use client';
import * as React from 'react';
import { Icons, Frame, Section, SubHead, PropsTable, Lede, Mono } from '@/ds/core';


  // ─── 1) Model unavailable ───────────────────────────────────────────────
  const ModelDown = () => (
    <div className="alert danger" style={{ width: '100%', maxWidth: 640 }} role="alert">
      <span className="alert-icon"><Icons.plug size={16}/></span>
      <div className="alert-body">
        <div className="alert-title">Sonnet 4.6 is unavailable right now</div>
        <div className="alert-desc">The provider is reporting elevated error rates on this model. Switching to Opus 4.7 keeps your context.</div>
        <div className="alert-meta">
          <span className="pill danger"><span className="dot"/>model down · 4m</span>
          <span className="req-id" style={{ fontVariantNumeric: 'tabular-nums' }}>req-id: 0a9e21</span>
        </div>
        <div className="alert-actions">
          <button className="btn xs ember"><Icons.refresh size={11}/> Retry on Sonnet</button>
          <button className="btn xs outline">Switch to Opus 4.7</button>
          <a className="btn xs link" href="#" target="_blank" rel="noreferrer">Status page</a>
        </div>
      </div>
    </div>
  );

  // ─── 2) Rate limited ────────────────────────────────────────────────────
  const RateLimited = () => {
    const [s, setS] = React.useState(38);
    React.useEffect(() => {
      const t = setInterval(() => setS(v => v <= 1 ? 38 : v - 1), 1000);
      return () => clearInterval(t);
    }, []);
    const pct = Math.max(0, Math.min(100, (s / 60) * 100));
    return (
      <div className="alert warning" style={{ width: '100%', maxWidth: 640 }} role="status" aria-live="polite">
        <span className="alert-icon"><Icons.clock size={16}/></span>
        <div className="alert-body">
          <div className="alert-title">Slow down — retry in <span style={{ fontVariantNumeric: 'tabular-nums' }}>{s}s</span></div>
          <div className="alert-desc">You've hit the per-minute prompt limit. Trim the prompt or wait — the window resets every 60s.</div>
          <div className="alert-meta">
            <span className="pill warning"><span className="dot"/>rate-limited</span>
            <span className="mono">limit: 40 req/min · used 41</span>
          </div>
          <div className="alert-extra">
            <div
              className="prog warning"
              role="progressbar"
              aria-label="Rate-limit window"
              aria-valuemin={0}
              aria-valuemax={60}
              aria-valuenow={60 - s}
              aria-valuetext={`${s} seconds remaining`}
            >
              <div className="prog-head">
                <span className="label">minute window</span>
                <span className="pct" style={{ fontVariantNumeric: 'tabular-nums' }}>{s}s remaining</span>
              </div>
              <div className="prog-track"><div className="prog-fill" style={{ width: pct + '%' }}/></div>
            </div>
          </div>
          <div className="alert-actions">
            <button className="btn xs outline" disabled={s > 0}>Retry now</button>
            <button className="btn xs ghost">Trim prompt (-1.4k tokens)</button>
          </div>
        </div>
      </div>
    );
  };

  // ─── 3) Safety refusal ──────────────────────────────────────────────────
  const SafetyRefusal = () => (
    <div className="alert info" style={{ width: '100%', maxWidth: 640 }}>
      <span className="alert-icon"><Icons.shield size={16}/></span>
      <div className="alert-body">
        <div className="alert-title">The model declined to answer this one</div>
        <div className="alert-desc">The prompt asked for instructions to bypass auth on a third-party service. Rephrase as a hypothetical or pull from the service's public docs instead.</div>
        <div className="alert-meta">
          <span className="pill ice"><span className="dot"/>safety policy: external-creds</span>
        </div>
        <div className="alert-actions">
          <button className="btn xs ember">Rephrase</button>
          <button className="btn xs ghost">Why was this blocked?</button>
        </div>
      </div>
    </div>
  );

  // ─── 4) Context overflow ────────────────────────────────────────────────
  const ContextOverflow = () => (
    <div className="alert warning" style={{ width: '100%', maxWidth: 640 }}>
      <span className="alert-icon"><Icons.layers size={16}/></span>
      <div className="alert-body">
        <div className="alert-title">Conversation is past the context window</div>
        <div className="alert-desc">Sonnet 4.6 holds 200k tokens. This thread is at 218k. Summarising the older turns will free room for the next reply.</div>
        <div className="alert-extra">
          <div
            className="prog warning"
            role="progressbar"
            aria-label="Context window usage"
            aria-valuemin={0}
            aria-valuemax={200000}
            aria-valuenow={200000}
            aria-valuetext="218,400 of 200,000 tokens — over limit"
          >
            <div className="prog-head">
              <span className="label">tokens used</span>
              <span className="pct" style={{ fontVariantNumeric: 'tabular-nums' }}>218,400 / 200,000 <span className="over warn-over">+18,400</span></span>
            </div>
            <div className="prog-track"><div className="prog-fill" style={{ width: '100%' }}/></div>
          </div>
          <div className="breakdown" style={{ fontVariantNumeric: 'tabular-nums' }}>
            <span>system: 1.2k</span>
            <span>history: 198k</span>
            <span>prompt: 19k</span>
          </div>
        </div>
        <div className="alert-actions">
          <button className="btn xs ember"><Icons.zap size={11}/> Summarise older turns</button>
          <button className="btn xs outline">Start new chat</button>
        </div>
      </div>
    </div>
  );

  // ─── 5) Network timeout ─────────────────────────────────────────────────
  const NetworkTimeout = () => (
    <div className="alert danger" style={{ width: '100%', maxWidth: 640 }} role="alert">
      <span className="alert-icon"><Icons.globe size={16}/></span>
      <div className="alert-body">
        <div className="alert-title">Lost connection while streaming</div>
        <div className="alert-desc">The response stopped mid-sentence after 14s. The partial text below is preserved — retry to continue.</div>
        <div className="alert-meta">
          <span className="pill danger"><span className="dot"/>network · timeout 14s</span>
          <span className="mono" style={{ fontVariantNumeric: 'tabular-nums' }}>last token at 14:02:38</span>
        </div>
        <div className="alert-actions">
          <button className="btn xs ember"><Icons.refresh size={11}/> Retry</button>
          <button className="btn xs outline">Keep waiting</button>
          <button className="btn xs ghost">Save partial reply</button>
        </div>
      </div>
    </div>
  );

  // ─── 6) Partial failure (tool call failed mid-response) ─────────────────
  const PartialFailure = () => (
    <div className="ai-resp" style={{ width: '100%', maxWidth: 640 }}>
      <div className="ai-resp-stack">
        <div className="ai-resp-meta">
          <span className="name">Forge AI</span>
          <span className="dot"/>
          <span>14:08 · partial</span>
        </div>
        <div className="ai-prose">
          <p>I pulled the latest deploy diff — the retry budget on <code>grpc.toml</code> went from 3 to 8 in commit <code>ab12cd</code>.</p>
          <p>I tried to fetch the Datadog metric to confirm the p99 spike, but the tool failed:</p>
          <div className="alert danger" style={{ marginTop: 8 }}>
            <span className="alert-icon"><Icons.alert size={14}/></span>
            <div className="alert-body">
              <div className="alert-title" style={{ fontSize: 'var(--text-sm)' }}>tool: <Mono>datadog.queryMetric</Mono></div>
              <div className="alert-desc" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums' }}>403 — DD_API_KEY scope missing <code>metric:read</code>. Add the scope and retry, or paste the metric value here and I'll continue.</div>
              <div className="alert-actions">
                <button className="btn xs outline">Retry tool</button>
                <button className="btn xs ghost">Skip & continue</button>
                <button className="btn xs ghost">Paste manually</button>
              </div>
            </div>
          </div>
          <p style={{ marginTop: 10 }}>If you confirm the metric, I'll finish the analysis with or without the tool.</p>
        </div>
      </div>
    </div>
  );

  // ─── code snippets ──────────────────────────────────────────────────────
  const MODEL_DOWN_CODE = `<Alert variant="danger">
  <Plug className="h-4 w-4"/>
  <AlertTitle>Sonnet 4.6 is unavailable right now</AlertTitle>
  <AlertDescription>The provider is reporting elevated error rates…</AlertDescription>
  <AlertMeta>
    <Pill tone="danger">model down · 4m</Pill>
    <span className="req-id">req-id: 0a9e21</span>
  </AlertMeta>
  <AlertActions>
    <Button size="xs" variant="ember"><Refresh/> Retry on Sonnet</Button>
    <Button size="xs" variant="outline">Switch to Opus 4.7</Button>
    <a className="btn xs link" href={statusUrl}>Status page</a>
  </AlertActions>
</Alert>`;

  const RATE_CODE = `<Alert variant="warning">
  <Clock className="h-4 w-4"/>
  <AlertTitle>Slow down — retry in {seconds}s</AlertTitle>
  <AlertDescription>You've hit the per-minute prompt limit.</AlertDescription>
  <AlertMeta>
    <Pill tone="warning">rate-limited</Pill>
    <span className="mono">limit: 40 req/min · used 41</span>
  </AlertMeta>
  <AlertExtra>
    <Progress value={100} variant="warning" label="minute window" sub={\`\${seconds}s remaining\`}/>
  </AlertExtra>
  <AlertActions>
    <Button size="xs" variant="outline" disabled={seconds > 0}>Retry now</Button>
    <Button size="xs" variant="ghost">Trim prompt (-1.4k tokens)</Button>
  </AlertActions>
</Alert>`;

  const REFUSAL_CODE = `<Alert variant="info">
  <Shield className="h-4 w-4"/>
  <AlertTitle>The model declined to answer this one</AlertTitle>
  <AlertDescription>The prompt asked to bypass auth on a third-party service…</AlertDescription>
  <AlertMeta>
    <Pill tone="ice">safety policy: external-creds</Pill>
  </AlertMeta>
  <AlertActions>
    <Button size="xs" variant="ember">Rephrase</Button>
    <Button size="xs" variant="ghost">Why was this blocked?</Button>
  </AlertActions>
</Alert>`;

  const CTX_CODE = `<Alert variant="warning">
  <Layers className="h-4 w-4"/>
  <AlertTitle>Conversation is past the context window</AlertTitle>
  <AlertDescription>Sonnet 4.6 holds 200k tokens. This thread is at 218k.</AlertDescription>
  <AlertExtra>
    <Progress value={100} variant="warning" label="tokens used" sub="218,400 / 200,000"/>
    <Breakdown items={[
      { label: "system",  value: "1.2k"  },
      { label: "history", value: "198k"  },
      { label: "prompt",  value: "19k"   },
    ]}/>
  </AlertExtra>
  <AlertActions>
    <Button size="xs" variant="ember"><Zap/> Summarise older turns</Button>
    <Button size="xs" variant="outline">Start new chat</Button>
  </AlertActions>
</Alert>`;

  const TIMEOUT_CODE = `<Alert variant="danger">
  <Globe className="h-4 w-4"/>
  <AlertTitle>Lost connection while streaming</AlertTitle>
  <AlertDescription>The response stopped after 14s. Partial text is preserved.</AlertDescription>
  <AlertMeta>
    <Pill tone="danger">network · timeout 14s</Pill>
    <span className="mono">last token at 14:02:38</span>
  </AlertMeta>
  <AlertActions>
    <Button size="xs" variant="ember"><Refresh/> Retry</Button>
    <Button size="xs" variant="outline">Keep waiting</Button>
    <Button size="xs" variant="ghost">Save partial reply</Button>
  </AlertActions>
</Alert>`;

  const PARTIAL_CODE = `<Response>
  <p>I pulled the latest deploy diff — …</p>
  <Alert variant="danger">
    <AlertIcon><AlertTriangle/></AlertIcon>
    <AlertTitle>tool: <code>datadog.queryMetric</code></AlertTitle>
    <AlertDescription className="font-mono">
      403 — DD_API_KEY scope missing <code>metric:read</code>.
    </AlertDescription>
    <AlertActions>
      <Button size="xs" variant="outline">Retry tool</Button>
      <Button size="xs" variant="ghost">Skip & continue</Button>
      <Button size="xs" variant="ghost">Paste manually</Button>
    </AlertActions>
  </Alert>
  <p>If you confirm the metric, I'll finish the analysis…</p>
</Response>`;

  // ─── decision matrix ────────────────────────────────────────────────────
  const Matrix = () => (
    <div className="ds-frame">
      <div className="ds-frame-head"><span className="label">decision matrix · root cause → recipe</span></div>
      <div className="ds-frame-body" style={{ padding: 0 }}>
        <table className="ds-props-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Root cause</th>
              <th>Recipe</th>
              <th>Alert variant</th>
              <th>Slots used</th>
              <th>Primary CTA</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>provider 5xx / model offline</code></td><td>Model unavailable</td><td><span className="pill danger"><span className="dot"/>danger</span></td><td>meta · actions</td><td>Switch model</td></tr>
            <tr><td><code>429 / per-minute cap</code></td><td>Rate limited</td><td><span className="pill warning"><span className="dot"/>warning</span></td><td>meta · extra · actions</td><td>Wait + countdown</td></tr>
            <tr><td><code>safety policy hit</code></td><td>Refusal</td><td><span className="pill ice"><span className="dot"/>info</span></td><td>meta · actions</td><td>Rephrase</td></tr>
            <tr><td><code>tokens &gt; window</code></td><td>Context overflow</td><td><span className="pill warning"><span className="dot"/>warning</span></td><td>extra · actions</td><td>Summarise older turns</td></tr>
            <tr><td><code>socket drop / 504</code></td><td>Network timeout</td><td><span className="pill danger"><span className="dot"/>danger</span></td><td>meta · actions</td><td>Retry · keep waiting</td></tr>
            <tr><td><code>tool call returned !2xx</code></td><td>Partial failure</td><td><span className="pill danger"><span className="dot"/>inline</span></td><td>actions (inside Response)</td><td>Retry tool · skip · paste</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // ─── page ────────────────────────────────────────────────────────────────
export default function ErrorsPage() {
  return (
    <Section
      id="ai-errors"
      num="09"
      title="Errors"
      desc="AI failure states are recipes on the Alert primitive — reach for them whenever a model call can't complete: provider down, rate limit, safety refusal, context overflow, timeout, or a tool failing mid-stream."
    >
      <Lede>The principle is always the same: name the specific failure and offer the next action — never &ldquo;something went wrong.&rdquo;</Lede>
      <Lede>
        Every recipe on this page is just <Mono>&lt;Alert variant="…"&gt;</Mono> with different slots — never a bespoke <Mono>AIError</Mono> component. See <a href="/alerts" style={{ color: 'var(--ember)' }}>Components / Alerts</a> for the primitive contract; this page is the AI-specific cookbook.
      </Lede>

      <div className="alert info" style={{ width: '100%', maxWidth: 720, marginBottom: 24 }}>
        <span className="alert-icon"><Icons.info size={14}/></span>
        <div className="alert-body">
          <div className="alert-title" style={{ fontSize: 'var(--text-sm)' }}>Why no <Mono>AIError</Mono> component?</div>
          <div className="alert-desc" style={{ fontSize: 'var(--text-base)' }}>
            Each AI failure has different copy, different actions, different diagnostics — but the shape is always the same five Alert slots. A wrapper would either force one rigid shape on every error or accept enough props that it isn't a wrapper anymore. Compose <Mono>&lt;Alert&gt;</Mono> directly.
          </div>
        </div>
      </div>

      {/* 1 */}
      <SubHead meta="provider 5xx · model offline">Model unavailable</SubHead>
      <Frame label="meta · actions · status link" code={MODEL_DOWN_CODE} height={240}>
        <ModelDown/>
      </Frame>
      <p className="ds-caption">
        Name the model. Name the symptom. Offer to switch — most production setups have a sibling model the user is happy to use. Always include the request id so the user can hand it to support.
      </p>

      {/* 2 */}
      <SubHead meta="429 · per-minute cap">Rate limited</SubHead>
      <Frame label="meta · extra (Progress countdown) · actions" code={RATE_CODE} height={260}>
        <RateLimited/>
      </Frame>
      <p className="ds-caption">
        Show the countdown live. Show the actual cap so the user understands the budget, not just the result. Suggest trimming the prompt — most rate-limits are token rate-limits.
      </p>

      {/* 3 */}
      <SubHead meta="safety policy">Safety refusal</SubHead>
      <Frame label="info tone · meta · actions" code={REFUSAL_CODE} height={220}>
        <SafetyRefusal/>
      </Frame>
      <p className="ds-caption">
        Refusals are the only error tone that uses <Mono>info</Mono>, not <Mono>danger</Mono>. The system isn't broken — the policy fired. Show the policy name so the user can read about it.
      </p>

      {/* 4 */}
      <SubHead meta="context window">Context overflow</SubHead>
      <Frame label="extra (Progress + breakdown) · actions" code={CTX_CODE} height={280}>
        <ContextOverflow/>
      </Frame>
      <p className="ds-caption">
        Show used / limit as a real bar via <Mono>&lt;AlertExtra&gt;</Mono>. Break down where the tokens went — if the system prompt is 1.2k of a 200k window, the user knows the bottleneck is history, not their question. The summarise action keeps the thread intact.
      </p>

      {/* 5 */}
      <SubHead meta="socket drop · 504">Network timeout</SubHead>
      <Frame label="meta · actions — preserve the partial reply" code={TIMEOUT_CODE} height={240}>
        <NetworkTimeout/>
      </Frame>
      <p className="ds-caption">
        Always preserve the partial reply. The user spent prompt budget; throwing away the half-answer makes the failure twice as expensive. The two-button "Retry / Keep waiting" pair is correct — sometimes the upstream is just slow.
      </p>

      {/* 6 */}
      <SubHead meta="tool call failed mid-response">Partial failure</SubHead>
      <Frame label="<Alert variant='danger'> nested inside <Response>" code={PARTIAL_CODE} height={420}>
        <PartialFailure/>
      </Frame>
      <p className="ds-caption">
        The model already wrote the part it could. The failed tool gets a <Mono>&lt;Alert variant="danger"&gt;</Mono> in flow with the exact tool name, the HTTP code, and the actionable detail. Three CTAs: retry the tool, skip and continue without it, or paste the value the tool would have returned.
      </p>

      {/* DECISION MATRIX */}
      <SubHead meta="root cause → recipe">Decision matrix</SubHead>
      <Matrix/>
      <p className="ds-caption">
        Pick one recipe per error. Mixing tones (a danger banner with a refusal CTA) erodes trust — the user learns to ignore the colour.
      </p>

      {/* A11Y */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>When an error replaces or interrupts the stream, move focus to the alert's primary action (Retry, Switch model, Summarise) so the recovery path is one keystroke away. Every action in <Mono>.alert-actions</Mono> is a real button reached by <Mono>Tab</Mono> and fired with <Mono>Enter</Mono>/<Mono>Space</Mono>; a disabled &ldquo;Retry now&rdquo; during a rate-limit cannot be focused until the countdown clears.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The danger/timeout alerts carry <Mono>role=&quot;alert&quot;</Mono> (assertive) so the failure is announced immediately; the rate-limit countdown is <Mono>role=&quot;status&quot;</Mono> + <Mono>aria-live=&quot;polite&quot;</Mono> so the ticking seconds don't spam the buffer. The countdown and the token-budget meters are each a <Mono>role=&quot;progressbar&quot;</Mono> with live <Mono>aria-valuenow</Mono>/<Mono>aria-valuetext</Mono> (&ldquo;38 seconds remaining&rdquo;, &ldquo;218,400 of 200,000 tokens — over limit&rdquo;); the request id and tool name are real text so the user can read them to support.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The tone icon is paired with a text status pill (&ldquo;model down&rdquo;, &ldquo;rate-limited&rdquo;, &ldquo;safety policy&rdquo;) so the danger/warning/info distinction never rests on colour alone. Pill labels use the dedicated status tokens at AA on their soft fills; the ember primary CTA carries dark <Mono>--bg</Mono> ink. Buttons take the canonical <Mono>:focus-visible</Mono> ring; focus order runs title → diagnostic → actions, primary first.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Under <Mono>prefers-reduced-motion</Mono> the rate-limit countdown bar updates in discrete steps with no easing, the partial-failure alert appears in place rather than sliding into the response, and any retry spinner becomes a static &ldquo;Retrying…&rdquo; label.</div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — alert icon flips to the leading edge" height={220}>
        <div dir="rtl" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div className="alert danger" style={{ width: '100%', maxWidth: 640 }}>
            <span className="alert-icon"><Icons.plug size={16}/></span>
            <div className="alert-body">
              <div className="alert-title">النموذج غير متاح حالياً</div>
              <div className="alert-desc">يبلغ المزود عن معدل أخطاء مرتفع. التبديل إلى نموذج آخر يحافظ على السياق.</div>
              <div className="alert-meta">
                <span className="pill danger"><span className="dot"/>معطل · ٤ د</span>
              </div>
              <div className="alert-actions">
                <button className="btn xs ember"><Icons.refresh size={11}/> إعادة المحاولة</button>
                <button className="btn xs outline">تبديل النموذج</button>
              </div>
            </div>
          </div>
        </div>
      </Frame>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy — same 5 slots as Alert, applied to an AI failure</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 540 }} aria-hidden="true">
              <ContextOverflow/>
              <span className="lead h" style={{ top: 16, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 42, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 80, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 138, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 196, left: -32, width: 28 }}/>
              <div className="pin" style={{ top: 10,  left: -54 }}>1</div>
              <div className="pin" style={{ top: 36,  left: -54 }}>2</div>
              <div className="pin" style={{ top: 74,  left: -54 }}>3</div>
              <div className="pin" style={{ top: 132, left: -54 }}>4</div>
              <div className="pin" style={{ top: 190, left: -54 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 620, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Tone icon.</b> <Mono>.alert-icon</Mono> — Maps 1:1 to the tone (danger / warning / info). Never decorative.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Title.</b> <Mono>.alert-title</Mono> — Names the failure. Avoid "Error" — say what's wrong ("Conversation is past the context window").</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Description.</b> <Mono>.alert-desc</Mono> — One sentence: what happened, what fixes it. No stack traces in the user-facing copy.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Diagnostic.</b> <Mono>.alert-extra</Mono> — Optional. Drop a <Mono>&lt;Progress/&gt;</Mono>, a breakdown, request IDs, policy names — whatever the user needs to act or escalate.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Actions.</b> <Mono>.alert-actions</Mono> — Primary first. Never bury the action under a secondary disclosure.</span>
          </div>
        </div>
      </div>

      {/* DO/DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — name the specific failure and propose action</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="alert danger" style={{ width: '100%' }}>
              <span className="alert-icon"><Icons.plug size={16}/></span>
              <div className="alert-body">
                <div className="alert-title">Sonnet 4.6 is unavailable right now</div>
                <div className="alert-desc">The provider is reporting elevated error rates.</div>
                <div className="alert-actions">
                  <button className="btn xs ember">Switch to Opus 4.7</button>
                </div>
              </div>
            </div>
          </div>
          <div className="note">The user knows what's wrong (model down) and what to do (switch). One sentence each.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — fall back to "something went wrong"</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="alert danger" style={{ width: '100%' }}>
              <span className="alert-icon"><Icons.alert size={16}/></span>
              <div className="alert-body">
                <div className="alert-title">Something went wrong</div>
                <div className="alert-desc">Please try again later.</div>
                <div className="alert-actions">
                  <button className="btn xs outline">OK</button>
                </div>
              </div>
            </div>
          </div>
          <div className="note">No diagnosis, no path forward. The user retries blindly and hits the same wall.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — preserve partial output on failure</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%' }}>
              <div className="ai-resp" style={{ marginBottom: 10 }}>
                <div className="ai-resp-stack">
                  <div className="ai-prose">
                    <p>The retry budget bump is the load-bearing change here…</p>
                  </div>
                </div>
              </div>
              <div className="alert danger" style={{ width: '100%' }}>
                <span className="alert-icon"><Icons.alert size={16}/></span>
                <div className="alert-body">
                  <div className="alert-title">Stream interrupted</div>
                  <div className="alert-actions">
                    <button className="btn xs ember">Continue</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="note">Half an answer is more useful than zero. Continue from where the stream broke.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — wipe the message and show only the error</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="alert danger" style={{ width: '100%' }}>
              <span className="alert-icon"><Icons.alert size={16}/></span>
              <div className="alert-body">
                <div className="alert-title">Failed</div>
                <div className="alert-desc">Reply was discarded.</div>
                <div className="alert-actions">
                  <button className="btn xs outline">Retry</button>
                </div>
              </div>
            </div>
          </div>
          <div className="note">The user paid the prompt cost. Don't make them pay again to read the same first paragraph.</div>
        </div>
      </div>

      {/* PROPS — composition reference, no bespoke component */}
      <SubHead meta="composition">Composition reference</SubHead>
      <p className="ds-caption">
        Every recipe above is exactly the same primitive — <Mono>&lt;Alert variant="…"&gt;</Mono> with a different mix of slots. The table below maps each recipe to the slots it composes; the full slot contract lives on the <a href="/alerts" style={{ color: 'var(--ember)' }}>Alerts page</a>.
      </p>
      <PropsTable
        label="recipe → slots"
        rows={[
          { prop: 'Model unavailable',  type: 'variant="danger"',  required: true, description: 'title · description · meta (status pill + req-id) · actions (retry · switch · status link)' },
          { prop: 'Rate limited',       type: 'variant="warning"', required: true, description: 'title · description · meta (rate-limit pill + usage) · extra (Progress countdown) · actions (retry disabled + trim)' },
          { prop: 'Safety refusal',     type: 'variant="info"',    required: true, description: 'title · description · meta (policy pill) · actions (rephrase · explain)' },
          { prop: 'Context overflow',   type: 'variant="warning"', required: true, description: 'title · description · extra (token <Progress/> + breakdown) · actions (summarise · new chat)' },
          { prop: 'Network timeout',    type: 'variant="danger"',  required: true, description: 'title · description · meta (network pill + last token timestamp) · actions (retry · wait · save partial)' },
          { prop: 'Partial tool failure', type: 'inline inside <Response>', required: true, description: 'A <Alert variant="danger"> nested between prose blocks. Title is the tool name in mono; description carries the HTTP code + actionable detail; actions retry / skip / paste.' },
        ]}
      />
    </Section>
  );
}
