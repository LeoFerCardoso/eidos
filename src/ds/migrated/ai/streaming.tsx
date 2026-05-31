'use client';
// Forge AI — Streaming. Token-by-token assistant output with the blinking caret,
// composed from the .ai-* prose surface + the core AICaret primitive.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, AICaret, Icons, Lede, Mono } from '@/ds/core';

const SAMPLE =
  'Streaming keeps the surface alive while the model thinks. Forge renders each token as it arrives, with a blinking caret trailing the text so the reader knows generation is still in flight. When the stream ends, the caret simply disappears.';

const SAMPLE_AR =
  'يُبقي البث السطح حيًّا أثناء تفكير النموذج. تعرض Forge كل رمز فور وصوله، مع مؤشر وامض يتبع النص ليعرف القارئ أن التوليد ما زال جاريًا. وعندما ينتهي البث، يختفي المؤشر ببساطة.';

function StreamDemo({ sample = SAMPLE, statusLabel }: { sample?: string; statusLabel?: { live: string; done: string } }) {
  const [n, setN] = React.useState(0);
  const [running, setRunning] = React.useState(true);
  React.useEffect(() => {
    if (!running) return;
    if (n >= sample.length) { setRunning(false); return; }
    const id = setTimeout(() => setN((v) => v + 1), 18);
    return () => clearTimeout(id);
  }, [n, running, sample.length]);
  const replay = () => { setN(0); setRunning(true); };
  const live = statusLabel?.live ?? 'streaming…';
  const done = statusLabel?.done ?? 'done';
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      {/* aria-live polite: new tokens are announced without interrupting; aria-busy tracks the stream. */}
      <div
        className="surface"
        style={{ padding: 18, minHeight: 120, fontSize: 'var(--text-md)', lineHeight: 1.6, color: 'var(--fg)' }}
        aria-live="polite"
        aria-busy={running}
      >
        {sample.slice(0, n)}
        {running && <AICaret />}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBlockStart: 12, alignItems: 'center' }}>
        <button className="btn sm" onClick={replay} disabled={running}>
          <Icons.refresh size={12} /> Replay
        </button>
        {/* Redundant text status: the "still generating / done" state never relies on the blink alone. */}
        <span role="status" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
          {running ? live : done} · {n}/{sample.length}
        </span>
      </div>
    </div>
  );
}

export default function AiStreaming() {
  return (
    <Section
      id="streaming"
      num="01"
      title="Streaming"
      desc="Render assistant output token-by-token as it arrives instead of waiting for the whole reply. Use it on any model surface where latency would otherwise read as a stall — the incremental text proves the model is working."
    >
      <SubHead meta="live">Token-by-token</SubHead>
      <Lede>A single ember caret trails the last token while the stream is open, then vanishes on completion — the only signal the reader needs that generation is still in flight.</Lede>
      <Frame label="Streaming response with caret">
        <StreamDemo />
      </Frame>

      <SubHead meta="caret">The caret</SubHead>
      <p className="ds-caption">
        The caret is the <Mono>AICaret</Mono> primitive — a 2px ember bar that pulses on the <Mono>ai-caret-blink</Mono> keyframe in <Mono>ai.css</Mono>. Mount it after the streamed text only while the stream is open.
      </p>
      <Frame label="Caret, standalone" center>
        <span style={{ fontSize: 'var(--text-lg)' }}>The model is typing<AICaret /></span>
      </Frame>

      <SubHead meta="ai sdk v6">Wiring it up</SubHead>
      <CodeBlock
        label="streaming with the AI SDK"
        lang="tsx"
        code={`import { useChat } from '@ai-sdk/react';

function Thread() {
  const { messages, status } = useChat();
  return messages.map((m) => (
    <div key={m.id} className="ai-prose">
      {m.parts.map((p, i) => (p.type === 'text' ? <span key={i}>{p.text}</span> : null))}
      {m.role === 'assistant' && status === 'streaming' && <AICaret />}
    </div>
  ));
}`}
      />
      <p className="ds-caption">
        On Vercel, point the route at the AI Gateway with a plain <Mono>&quot;provider/model&quot;</Mono> string and stream with <Mono>toUIMessageStreamResponse()</Mono>. See the reference route under <Mono>app/ai-chat/</Mono>.
      </p>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Streaming text holds no focus — the caret is decorative and never a Tab stop. Wire a stop control (Esc, or a Stop button reachable by Tab and fired with Enter/Space) so the reader can interrupt a long generation; on completion, focus stays with the composer so the user can keep typing.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Put the streamed text in an <code style={{fontFamily:'var(--font-mono)'}}>aria-live="polite"</code> region so new tokens are announced without cutting off the user — never <code style={{fontFamily:'var(--font-mono)'}}>assertive</code>, which would re-read on every token. Mark the message <code style={{fontFamily:'var(--font-mono)'}}>aria-busy="true"</code> while <code style={{fontFamily:'var(--font-mono)'}}>status === 'streaming'</code> and clear it on done. The <code style={{fontFamily:'var(--font-mono)'}}>AICaret</code> is <code style={{fontFamily:'var(--font-mono)'}}>aria-hidden</code> so it's never spoken as a character.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The 2px ember caret sits on the body surface and is a status hint, not information — the "still generating" / "done" state is also carried by the mono status label ("streaming…" / "done"), so a reader who can't perceive the blink isn't left guessing. Body text on <code style={{fontFamily:'var(--font-mono)'}}>--surface</code> clears AA.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Under <code style={{fontFamily:'var(--font-mono)'}}>prefers-reduced-motion</code> the caret stops blinking — it renders as a steady ember bar — and reduced-motion readers can be served the full reply at once rather than the token-by-token reveal, falling back to instant text.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — text streams right-to-left; the caret trails the last token on the inline-start edge" height={260}>
        <div dir="rtl" style={{ width: '100%' }}>
          <StreamDemo sample={SAMPLE_AR} statusLabel={{ live: 'يبثّ…', done: 'تمّ' }} />
        </div>
      </Frame>
      <Lede>
        The caret uses logical CSS (<Mono>margin-inline-start</Mono>) so it trails the last token on the
        reading-direction tail in both scripts — no manual mirroring. The caret bar is non-directional, so it
        needs no <Mono>transform: scaleX(-1)</Mono>; only the <Mono>Replay</Mono> button&apos;s leading refresh
        icon and the status line reorder with the flow.
      </Lede>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 440 }} aria-hidden="true">
              <div className="surface" style={{ padding: 18, fontSize: 'var(--text-md)', lineHeight: 1.6, color: 'var(--fg)' }}>
                Forge renders each token as it arrives<AICaret />
              </div>
              {/* leads */}
              <span className="lead h" style={{ top: 30, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 30, right: -32, width: 28 }}/>
              <span className="lead v" style={{ bottom: -36, left: 232, height: 28 }}/>
              {/* pins */}
              <div className="pin" style={{ top: 22, left: -54 }}>1</div>
              <div className="pin" style={{ top: 22, right: -54 }}>2</div>
              <div className="pin" style={{ bottom: -64, left: 220 }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 580, margin: '72px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Streamed text.</b> The assistant reply, appended token-by-token into an <Mono>aria-live=&quot;polite&quot;</Mono> region marked <Mono>aria-busy</Mono> while the stream is open. It carries the message; the caret never does.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Caret.</b> The <Mono>AICaret</Mono> primitive — a 2px ember bar trailing the last token on the inline-start tail. Decorative (<Mono>aria-hidden</Mono>), it pulses on the <Mono>ai-caret-blink</Mono> keyframe and holds steady under <Mono>prefers-reduced-motion</Mono>. Mount it only while streaming; drop it on completion.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Status label.</b> A mono <Mono>role=&quot;status&quot;</Mono> line ("streaming… / done") that carries the generation state in text, so a reader who can&apos;t perceive the blink is never left guessing.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don&apos;t</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — announce with <Mono>aria-live=&quot;polite&quot;</Mono> plus a redundant status label</div>
          <div className="body" style={{ padding: 14 }}>
            <CodeBlock
              lang="tsx"
              code={`<div aria-live="polite" aria-busy={streaming}>
  {text}{streaming && <AICaret />}
</div>
<span role="status">{streaming ? 'streaming…' : 'done'}</span>`}
            />
          </div>
          <div className="note"><Mono>polite</Mono> waits for a pause before announcing, so it never cuts off the user; the text status carries the state for readers who can&apos;t perceive the blink.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don&apos;t — use <Mono>aria-live=&quot;assertive&quot;</Mono> on the stream</div>
          <div className="body" style={{ padding: 14 }}>
            <CodeBlock
              lang="tsx"
              code={`<div aria-live="assertive">
  {text}{streaming && <AICaret />}
</div>`}
            />
          </div>
          <div className="note"><Mono>assertive</Mono> interrupts and re-reads on every token, drowning the screen-reader user in a stutter of repeats. Reserve it for genuine alerts, never streamed prose.</div>
        </div>
      </div>
    </Section>
  );
}
