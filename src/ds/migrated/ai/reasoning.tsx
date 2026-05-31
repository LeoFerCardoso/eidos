'use client';
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Reasoning, Lede, Mono } from '@/ds/core';

  const mono  = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--ember)' };

  // Duration counter — tiny self-ticking hook for the demos.
  const useDuration = (running: boolean) => {
    const [d, setD] = React.useState(0);
    React.useEffect(() => {
      if (!running) return;
      const start = performance.now() - d * 1000;
      let raf: number;
      const tick = (now: number) => { setD((now - start) / 1000); raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [running]); // eslint-disable-line
    return d;
  };

  // ─── live demos ─────────────────────────────────────────────────────────
  const StreamingDemo = () => {
    const [streaming, setStreaming] = React.useState(true);
    const d = useDuration(streaming);

    // Cycle: stream for 5s, settle for 3s, repeat.
    React.useEffect(() => {
      let on = streaming;
      const id = setInterval(() => {
        on = !on; setStreaming(on);
      }, on ? 5500 : 3500);
      return () => clearInterval(id);
    }, []); // eslint-disable-line

    return (
      <Reasoning streaming={streaming} duration={d}>
        {streaming ? (
          <div className="rsn-skel">
            <div className="ln" style={{ width: '94%' }}/>
            <div className="ln" style={{ width: '76%' }}/>
            <div className="ln" style={{ width: '88%' }}/>
            <div className="ln" style={{ width: '64%' }}/>
          </div>
        ) : (
          <>
            <p>
              The user's symptom — a p99 spike on <code>identity-svc</code> — overlaps with
              the 0421 release window. <em>Look at the deploy diff first.</em>
            </p>
            <p>
              Two candidates in that diff: the retry budget bump on <code>grpc.toml</code>
              (3 → 8), and the connection-pool size change on <code>identity</code> (8 → 32).
              Either could mask a downstream timeout, but only the pool change touches the
              code path the spike sits on.
            </p>
            <p>
              <em>Conclusion:</em> recommend the user revert the pool-size change first,
              keep the retry-budget bump for now.
            </p>
          </>
        )}
      </Reasoning>
    );
  };

  const StaticDoneDemo = () => (
    <Reasoning streaming={false} duration={2.4} defaultOpen={true}>
      <p>
        Three candidates in the 0421 diff. Only one (<code>pool-size: 8 → 32</code>) sits on
        the code path of the p99 spike.
      </p>
      <p>
        <em>Conclusion:</em> revert the pool-size change first, keep the retry-budget bump.
      </p>
    </Reasoning>
  );

  const InMessageDemo = () => {
    const [streaming, setStreaming] = React.useState(true);
    const d = useDuration(streaming);
    React.useEffect(() => {
      const id = setTimeout(() => setStreaming(false), 4200);
      return () => clearTimeout(id);
    }, []);
    return (
      <div style={{ width: '100%', maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>
          Forge AI <span style={{ marginInline: 6, color: 'var(--fg-faint)' }}>·</span> just now
        </div>

        <Reasoning streaming={streaming} duration={d}>
          {streaming ? (
            <div className="rsn-skel">
              <div className="ln" style={{ width: '90%' }}/>
              <div className="ln" style={{ width: '72%' }}/>
              <div className="ln" style={{ width: '84%' }}/>
            </div>
          ) : (
            <p>
              The p99 spike sits on <code>identity-svc</code> — only the pool-size change in
              0421 touches that path. <em>Recommend reverting it first.</em>
            </p>
          )}
        </Reasoning>

        {!streaming && (
          <div style={{
            padding: '10px 12px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10, borderEndStartRadius: 4,
            fontSize: 'var(--text-base)', color: 'var(--fg)', maxWidth: '90%',
          }}>
            Revert the <code style={{ ...mono, fontSize: 'var(--text-xs)' }}>pool-size</code> change in
            0421 first — that's the only candidate on the spike's code path. Keep the retry
            budget bump until the spike clears.
          </div>
        )}
      </div>
    );
  };

  // ─── code snippets ──────────────────────────────────────────────────────
  const USAGE_CODE = `<Reasoning streaming={status === 'streaming'} duration={duration}>
  <p>
    The user's p99 spike overlaps with the 0421 release. Look at the
    deploy diff first…
  </p>
</Reasoning>`;

  const COMP_CODE = `<Message from="assistant" meta={<>Forge AI · just now</>}>
  <Reasoning streaming={streaming} duration={d}>
    <p>The p99 spike sits on identity-svc — only the pool-size change touches it.</p>
  </Reasoning>
  Revert the pool-size change in 0421 first — that's the only…
</Message>`;

  // ─── page ────────────────────────────────────────────────────────────────
export default function ReasoningPage() {
  return (
    <Section
      id="ai-reasoning"
      num="05"
      title="Reasoning"
      desc="The model's thinking-out-loud trace, shown above the answer as a collapsible disclosure. Auto-opens while the model reasons, auto-collapses once settled. Use it when the path to the answer is worth showing."
    >
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-reasoning')} ariaLabel="package manager"/>
      <Lede>Keep reasoning a footnote: the answer, not the trace, is what sits in front of the user once reasoning is done.</Lede>
      <Lede>
        Composes the <a href="/collapsible" style={{ color: 'var(--ember)' }}>Collapsible</a> primitive plus the canonical <a href="/skeleton" style={{ color: 'var(--ember)' }}>shimmer</a> already used by Skeleton — so a streaming reasoning trace and a loading skeleton share the same visual language.
      </Lede>

      <SubHead meta="hello world · live">Usage</SubHead>
      <Frame label="streams for ~5s, settles for ~3s, then streams again" code={USAGE_CODE} height={300}>
        <StreamingDemo/>
      </Frame>
      <p className="t-body" style={{ color: 'var(--fg-muted)', marginTop: 14, maxWidth: '64ch' }}>
        While the model is mid-thought, the verb word ("Thinking") shimmers along the ember gradient and the icon tile pulses. The body shows shimmering skeleton lines instead of trying to render incomplete tokens. When the trace settles, the verb flips to "Thought", the duration freezes, and the body auto-collapses — but stays one click away.
      </p>

      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <SubHead meta="open · done">Static settled state</SubHead>
      <Frame label="duration frozen · panel manually open for review" height={220}>
        <StaticDoneDemo/>
      </Frame>

      <SubHead meta="composition · inside a Message">Inside an assistant turn</SubHead>
      <Frame label="reasoning above · answer below — same rhythm in both states" code={COMP_CODE} height={320}>
        <InMessageDemo/>
      </Frame>
      <p className="t-body" style={{ color: 'var(--fg-muted)', marginTop: 14, maxWidth: '64ch' }}>
        Place the reasoning <i>before</i> the answer body inside an assistant <a href="/ai/message" style={{ color: 'var(--ember)' }}>Message</a>. Reads like a footnote that arrived first.
      </p>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The trigger row is a single <code style={{fontFamily:'var(--font-mono)'}}>&lt;button&gt;</code>: Tab reaches it, Enter/Space toggles the body, and once the user toggles, their choice wins over the auto open/collapse. The trace body is reading content with no inner Tab stops; any links inside (IDs, files) are reached in order after the trigger.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The trigger exposes <code style={{fontFamily:'var(--font-mono)'}}>aria-expanded</code> and the collapsed body is <code style={{fontFamily:'var(--font-mono)'}}>aria-hidden</code>, so a closed trace isn't read. The verb is real text — "Thinking" while streaming, "Thought" once done — not a colour cue, and the duration ("2.4s") is spoken alongside it. While streaming, the trace lives in an <code style={{fontFamily:'var(--font-mono)'}}>aria-live="polite"</code> region announced as <code style={{fontFamily:'var(--font-mono)'}}>aria-busy="true"</code>, and the shimmer skeleton is decorative (<code style={{fontFamily:'var(--font-mono)'}}>aria-hidden</code>) rather than read as garbled half-tokens.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The trigger shows a 2px inset ember focus ring. The streaming state is signalled by the verb text and the pulsing icon together, never the ember shimmer alone; the mono trace body on <code style={{fontFamily:'var(--font-mono)'}}>--fg-muted</code> and the ember-soft icon tile both clear AA against the elevated panel.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Under <code style={{fontFamily:'var(--font-mono)'}}>prefers-reduced-motion</code> the verb-word shimmer and the icon pulse are switched off (the verb shows a static ember), the skeleton lines stop animating, and the body expands/collapses instantly instead of sliding its max-height.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — icon flips to start, chevron + duration mirror" height={220}>
        <div dir="rtl" style={{ width: '100%' }}>
          <Reasoning streaming={false} duration={3.7} defaultOpen={true} title="فكر">
            <p>
              ارتفاع p99 يقع على <code>identity-svc</code> — التغيير الوحيد في 0421 الذي يمسه
              هو زيادة حجم تجمع الاتصالات.
            </p>
          </Reasoning>
        </div>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 460 }} aria-hidden="true">
              <Reasoning streaming={false} duration={2.4} defaultOpen={true}>
                <p>Three candidates in the 0421 diff…</p>
              </Reasoning>
              {/* Header is inline: [sparkle 22] [verb] [·] [2.4s] [⌄] — pins point
                  to each from above; body sits below at ~y=46. */}
              <span className="lead v" style={{ top: -22, left: 11,  height: 18 }}/>
              <span className="lead v" style={{ top: -22, left: 56,  height: 18 }}/>
              <span className="lead v" style={{ top: -22, left: 110, height: 18 }}/>
              <span className="lead v" style={{ top: -22, left: 134, height: 18 }}/>
              <span className="lead h" style={{ top: 64,  left: -30, width: 26 }}/>
              <div className="pin" style={{ top: -42, left: 11,  transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: -42, left: 56,  transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ top: -42, left: 110, transform: 'translateX(-50%)' }}>3</div>
              <div className="pin" style={{ top: -42, left: 134, transform: 'translateX(-50%)' }}>4</div>
              <div className="pin" style={{ top: 56,  left: -54 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 580, margin: '72px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Sparkle tile.</b> 22×22 ember-soft tile with the sparkle icon — the visual identity of the "model is thinking" surface. Pulses with an <Mono>--ember-soft</Mono> ring during streaming.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Verb.</b> Sans semibold ember — "Thinking" while streaming, "Thought" once settled. While streaming, the word gets the ember gradient shimmer (text-clipped); once done, it freezes to solid ember.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Duration.</b> Mono tabular ticker, faint. Counts up while streaming; freezes at the final value when the trace settles. Separated from the verb by a 3px <Mono>--fg-faint</Mono> dot.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Chevron.</b> Sits right after the duration (not pushed to a far edge). Rotates 180° when the body is open. The whole row is one button — <Mono>aria-expanded</Mono> reflects state.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Body trace.</b> Mono-faced, breathing below the header — no border divider (it's not a box). Auto-opens during streaming, auto-collapses when done; the user's toggle wins from then on. Skeleton shimmer fills it until real tokens arrive.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — auto-collapse when done</div>
          <div className="body" style={{ padding: 14 }}>
            <Reasoning streaming={false} duration={1.9}>
              <p>Three candidates…</p>
            </Reasoning>
          </div>
          <div className="note">The reasoning is a footnote — surface it during, hide it after, leave the answer in front.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — leave the panel forever-open</div>
          <div className="body" style={{ padding: 14 }}>
            <Reasoning streaming={false} duration={1.9} defaultOpen={true}>
              <p>… (50 lines of trace permanently in front of the user) …</p>
            </Reasoning>
          </div>
          <div className="note">If every answer ships with 8 paragraphs of reasoning visible, the answer drowns.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — shimmer while streaming</div>
          <div className="body" style={{ padding: 14 }}>
            <Reasoning streaming={true} duration={3.2}>
              <div className="rsn-skel">
                <div className="ln" style={{ width: '90%' }}/>
                <div className="ln" style={{ width: '72%' }}/>
              </div>
            </Reasoning>
          </div>
          <div className="note">Shimmer says "alive" — the user knows the model hasn't stalled.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — paint half-tokens into the body</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="rsn">
              <button className="rsn-trigger" aria-expanded="true">
                <span className="ico"><Icons.sparkle size={12}/></span>
                <span className="label"><span style={{ color: 'var(--fg)' }}>Thinking</span></span>
              </button>
              <div className="rsn-body" style={{ maxHeight: 200 }}>
                <div className="rsn-body-inner">The user's symp — wait actually let me restart — the user's p99 spi</div>
              </div>
            </div>
          </div>
          <div className="note">Streaming half-tokens look like the model is glitching. Show the skeleton until a full sentence is ready.</div>
        </div>
      </div>

      <SubHead meta="ReasoningProps">API reference</SubHead>
      <AutoPropsTable component="Reasoning" label="<Reasoning />"/>
    </Section>
  );
}
