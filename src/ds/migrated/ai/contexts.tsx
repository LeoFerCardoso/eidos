'use client';
// Eidos AI — Contexts. What the model is grounded on: attached files, linked sources,
// and scope chips. Plus the context-window gauge — how much of the model's token
// budget is spent. Built from .pill / .chip + the core Icons + Context.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, Icons, AutoPropsTable, Context, PromptInput, Lede, Mono } from '@/ds/core';

const SOURCES = [
  { icon: 'file', label: 'runbook-identity.md', meta: 'attached' },
  { icon: 'database', label: 'services · 142 rows', meta: 'query' },
  { icon: 'globe', label: 'status.forge.dev', meta: 'fetched' },
  { icon: 'book', label: 'ADR-0042 · step-up auth', meta: 'linked' },
];

const ContextChip = ({ icon, label, meta }: { icon: string; label: string; meta: string }) => {
  const Icon = (Icons as Record<string, any>)[icon] || Icons.circle;
  return (
    <span className="pill neutral" style={{ gap: 8, paddingInline: 10, paddingBlock: 6, border: '1px solid var(--border)' }}>
      <Icon size={13} color="var(--fg-muted)" />
      <span style={{ fontWeight: 500 }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>{meta}</span>
      <Icons.x size={11} color="var(--fg-faint)" />
    </span>
  );
};

export default function AiContexts() {
  return (
    <Section
      id="contexts"
      num="01"
      title="Contexts"
      desc="The grounding rail above the composer: attached files, queried data, fetched pages, and linked decisions, each a removable chip. Show it whenever an answer leans on something other than the model's own weights."
    >
      <SubHead meta="grounding">Source chips</SubHead>
      <Lede>Pair with Citations so every claim in the answer traces back to these same sources — and let the user prune what the reply is based on before they send.</Lede>
      <Frame label="Attached context above the prompt">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 620 }}>
          {SOURCES.map((s) => <ContextChip key={s.label} {...s} />)}
          <button className="pill neutral" style={{ gap: 6, paddingInline: 10, paddingBlock: 6, border: '1px dashed var(--border)', color: 'var(--fg-muted)', cursor: 'pointer' }}>
            <Icons.paperclip size={12} /> Add context
          </button>
        </div>
      </Frame>

      <SubHead meta="scope">Scope row</SubHead>
      <p className="ds-caption">
        A scope chip narrows what the agent may touch — a tribe, an environment, a service. Pair it with the <a href="/ai/citations" style={{ color: 'var(--ember)' }}>citations</a> pattern so every claim in the answer links back to one of these sources.
      </p>
      <Frame label="Scope chips">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="pill ember"><span className="dot" /> Tribe · Identity</span>
          <span className="pill neutral" style={{ border: '1px solid var(--border)' }}><Icons.server size={12} /> Env · staging</span>
          <span className="pill neutral" style={{ border: '1px solid var(--border)' }}><Icons.folder size={12} /> 3 services</span>
        </div>
      </Frame>

      <SubHead meta="context window">Window gauge</SubHead>
      <Lede>
        "Context" means two things — what the model knows (the chips above) AND
        how much of its <em>context window</em> is left. <Mono>{`<Context/>`}</Mono> is
        a unified indicator with two visual forms: a radial gauge (<Mono>variant="gauge"</Mono>) and
        a linear bar (<Mono>variant="bar"</Mono>).
        Pair it with the file count so the user sees both grounding and budget at a glance.
      </Lede>

      <SubHead meta="gauge variant">Gauge — radial ring</SubHead>
      <Frame label="Context variant=&quot;gauge&quot; — radial · sizes · tones (ok / mid / warn)" row code={`<Context variant="gauge" used={8240}   total={200000}/>
<Context variant="gauge" used={142000} total={200000}/>
<Context variant="gauge" used={188000} total={200000}/>
<Context variant="gauge" used={8240}   total={200000} files={3}/>
<Context variant="compact" used={142000} total={200000}/>`}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
          <Context variant="gauge" used={8240}   total={200000}/>
          <Context variant="gauge" used={142000} total={200000}/>
          <Context variant="gauge" used={188000} total={200000}/>
          <Context variant="gauge" used={8240}   total={200000} files={3}/>
          <Context variant="compact" used={142000} total={200000} size={22}/>
        </div>
      </Frame>
      <Lede>
        Tone shifts at 60% (mid) and 85% (warn) by default — the user gets a
        soft heads-up before they hit the cliff. The full numbers stay in the{' '}
        <Mono>title</Mono> + <Mono>aria-label</Mono> for screen readers.
        Use <Mono>variant="compact"</Mono> for
        very tight rows (radial + percent only, no token numbers).
      </Lede>

      <SubHead meta="bar variant">Bar — linear progress</SubHead>
      <Frame label="Context variant=&quot;bar&quot; — when a horizontal row has the room" code={`<Context variant="bar" used={142000} total={200000} files={3}/>`}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
          <Context variant="bar" used={8240}   total={200000}/>
          <Context variant="bar" used={142000} total={200000} files={3}/>
          <Context variant="bar" used={188000} total={200000} files={7}/>
        </div>
      </Frame>
      <Lede>
        The bar form reads naturally in horizontal rows. Use it when there is generous horizontal space and the radial reads as a foreign element (e.g. a full-width composer toolbar). The same tone thresholds, the same token label, the same file count — only the shape changes.
      </Lede>

      <SubHead meta="embedded">In the Prompt Input</SubHead>
      <Frame label="Context as the contextSlot of PromptInput — sits before the model selector" code={`<PromptInput
  value={text} onChange={setText} onSubmit={send}
  modelValue={model} onModelChange={setModel}
  contextSlot={<Context variant="gauge" used={used} total={200000} files={3}/>}
/>`}>
        <div style={{ width: '100%', maxWidth: 620 }}>
          <PromptInput
            value=""
            onChange={() => {}}
            onSubmit={() => {}}
            modelValue="claude-sonnet-4.5"
            onModelChange={() => {}}
            contextSlot={<Context variant="gauge" used={142000} total={200000} files={3}/>}
            placeholder="Ask anything…"
          />
        </div>
      </Frame>

      <SubHead meta="shape">The context object</SubHead>
      <CodeBlock
        label="passing context to the model"
        lang="ts"
        code={`type Context =
  | { kind: 'file'; name: string; bytes: number }
  | { kind: 'query'; source: string; rows: number }
  | { kind: 'url'; href: string }
  | { kind: 'scope'; tribe?: string; env?: string };

// Send the resolved context alongside the prompt; surface each
// item as a removable chip so the grounding stays auditable.
const context: Context[] = attachments.map(toContext);`}
      />

      {/* ====================================================================
          ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The chip row is a horizontal toolbar: Tab reaches it, then arrow keys move between chips. The trailing × removes a chip on Enter/Space — and on Backspace/Delete when the chip itself is focused — returning focus to the next chip, or to the "Add context" button if it was the last. The dashed "Add context" button is a normal Tab stop that opens the file/source picker on Enter.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Group the chips under <code style={{fontFamily:'var(--font-mono)'}}>role="group"</code> with <code style={{fontFamily:'var(--font-mono)'}}>aria-label="Attached context"</code>. Each chip reads its label plus its kind ("runbook-identity.md, attached file"), and the remove control carries <code style={{fontFamily:'var(--font-mono)'}}>aria-label="Remove runbook-identity.md"</code>. The Context gauge/bar carries <code style={{fontFamily:'var(--font-mono)'}}>role="meter"</code> + <code style={{fontFamily:'var(--font-mono)'}}>aria-label</code> with the full token count for screen readers.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Focus order runs chips first, then the add button, then the composer below — grounding before input. Each chip shows a visible ember focus ring; the mono <code style={{fontFamily:'var(--font-mono)'}}>--fg-faint</code> meta text ("attached", "query") is decorative restatement, with the chip label held at AA on the neutral pill surface.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Under <code style={{fontFamily:'var(--font-mono)'}}>prefers-reduced-motion</code>, chips appear and disappear instantly — no slide-in on attach, no fade on remove — and the ember scope dot drops its pulse to a static fill.</div>
        </div>
      </div>

      {/* ====================================================================
          RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — chips flow right-to-left; inline-start icon and dismiss × swap sides'
        code={`<div dir="rtl">
  <div role="group" aria-label="السياق المرفق"
       style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
    <Context variant="gauge" used={96000} total={200000} files={2}/>
    {/* chip row mirrors: icon at inline-start (right), × at inline-end (left) */}
  </div>
</div>`}
        lang="tsx"
      >
        <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 620 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <ContextChip icon="file" label="دليل-الهوية.md" meta="مرفق" />
            <ContextChip icon="database" label="الخدمات · 142 سطر" meta="استعلام" />
            <span className="pill ember">
              <span className="dot" /> القبيلة · الهوية
            </span>
            <button className="pill neutral" style={{ gap: 6, paddingInline: 10, paddingBlock: 6, border: '1px dashed var(--border)', color: 'var(--fg-muted)', cursor: 'pointer' }}>
              <Icons.paperclip size={12} /> إضافة سياق
            </button>
          </div>
          <Context variant="bar" used={96000} total={200000} files={2}/>
        </div>
      </Frame>
      <Lede>
        Context chips use logical CSS flex, so in <Mono>dir="rtl"</Mono> the leading source icon moves to the inline-start (right) and the trailing dismiss <Mono>×</Mono> moves to the inline-end (left) — no manual mirroring needed. The gauge ring and bar track are non-directional; only the inline layout and the token label text direction follow the document direction.
      </Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 48px 80px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: '100%', maxWidth: 540 }} aria-hidden="true">
              {/* Source chip row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                <ContextChip icon="file" label="runbook-identity.md" meta="attached" />
                <span className="pill ember"><span className="dot" /> Tribe · Identity</span>
              </div>
              {/* Context gauge */}
              <Context variant="gauge" used={96000} total={200000} files={2}/>

              {/* pin 1 — source icon */}
              <span className="lead v" style={{ top: -28, left: 12, height: 22 }} />
              <div className="pin" style={{ top: -52, left: 12, transform: 'translateX(-50%)' }}>1</div>
              {/* pin 2 — chip label */}
              <span className="lead v" style={{ top: -28, left: 80, height: 22 }} />
              <div className="pin" style={{ top: -52, left: 80, transform: 'translateX(-50%)' }}>2</div>
              {/* pin 3 — kind meta */}
              <span className="lead v" style={{ top: -28, left: 200, height: 22 }} />
              <div className="pin" style={{ top: -52, left: 200, transform: 'translateX(-50%)' }}>3</div>
              {/* pin 4 — dismiss × */}
              <span className="lead v" style={{ top: -28, left: 260, height: 22 }} />
              <div className="pin" style={{ top: -52, left: 260, transform: 'translateX(-50%)' }}>4</div>
              {/* pin 5 — scope chip */}
              <span className="lead v" style={{ top: -28, left: 320, height: 22 }} />
              <div className="pin" style={{ top: -52, left: 320, transform: 'translateX(-50%)' }}>5</div>
              {/* pin 6 — gauge ring */}
              <span className="lead h" style={{ top: 62, right: -30, width: 24 }} />
              <div className="pin" style={{ top: 52, right: -54 }}>6</div>
              {/* pin 7 — token label */}
              <span className="lead h" style={{ top: 82, right: -30, width: 24 }} />
              <div className="pin" style={{ top: 72, right: -54 }}>7</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Source icon.</b> 13px glyph identifying the kind — <Mono>file</Mono>, <Mono>database</Mono>, <Mono>globe</Mono>, <Mono>book</Mono>. <Mono>aria-hidden</Mono>; the chip label carries all meaning for screen readers.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Chip label.</b> Geist Sans 500 — the resource name or query identifier. Keep it short: file names truncate with an ellipsis beyond the chip's max-width.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Kind meta.</b> Mono <Mono>--text-xs</Mono> in <Mono>--fg-faint</Mono> — "attached", "query", "fetched", "linked". Decorative restatement of the icon; the chip label and <Mono>aria-label</Mono> already name the kind.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Dismiss ×.</b> 11px. Removes the chip and returns focus to the next chip or the "Add context" button. Carries <Mono>{'aria-label="Remove <name>"'}</Mono>. Omit when the context is read-only.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Scope chip.</b> Ember pill marking the agent's reach — tribe, environment, or service boundary. Pair with the source chips so the user sees both grounding and permission scope at a glance.</span>
            <span className="num">6</span><span><b style={{ color: 'var(--fg)' }}>Gauge ring.</b> SVG radial indicator of token budget consumed. Tones shift at 60% (mid / amber) and 85% (warn / red). Use <Mono>variant="bar"</Mono> in wide horizontal layouts. Carries <Mono>role="meter"</Mono> with a full <Mono>aria-label</Mono>.</span>
            <span className="num">7</span><span><b style={{ color: 'var(--fg)' }}>Token label.</b> Mono caption showing "used / total" tokens. Hidden in <Mono>variant="compact"</Mono> — only the ring and percentage remain. Always present when there is room; the number anchors the ring reading.</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — surface grounding before the composer</div>
          <div className="body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <ContextChip icon="file" label="runbook-deploy.md" meta="attached" />
                <span className="pill ember"><span className="dot" /> Tribe · Platform</span>
              </div>
              <Context variant="bar" used={62000} total={200000} files={1}/>
            </div>
          </div>
          <div className="note">Show the chip rail and gauge above the input. The user sees exactly what the model knows before they ask — and can prune stale context before spending tokens.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — attach context silently with no indicator</div>
          <div className="body">
            <div style={{ maxWidth: 400 }}>
              <div style={{ padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--fg-muted)', fontSize: 'var(--text-body)' }}>
                Ask anything about your services…
              </div>
              <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>
                (4 files attached in the background)
              </div>
            </div>
          </div>
          <div className="note">Hidden context is a trust violation. Users need to know what the model is grounded on — otherwise they cannot tell a hallucination from a sourced answer. Always show what is attached.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — warn before the token budget runs out</div>
          <div className="body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 340 }}>
              <Context variant="gauge" used={178000} total={200000} files={7}/>
              <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.5 }}>
                Context window at 89% — remove files or start a new session.
              </p>
            </div>
          </div>
          <div className="note">At 85% the gauge shifts to warn tone automatically. Pair it with an inline message so the user knows the fix — remove chips, summarise, or open a fresh session.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — mix source chips with scope chips without a visual separator</div>
          <div className="body">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: 360 }}>
              <span className="pill ember"><span className="dot" /> Tribe · Payments</span>
              <span className="pill neutral" style={{ border: '1px solid var(--border)', paddingInline: 10, paddingBlock: 6 }}><Icons.file size={13} color="var(--fg-muted)" /> compliance-policy.pdf</span>
              <span className="pill ember"><span className="dot" /> Env · prod</span>
              <span className="pill neutral" style={{ border: '1px solid var(--border)', paddingInline: 10, paddingBlock: 6 }}><Icons.database size={13} color="var(--fg-muted)" /> transactions · 8 k rows</span>
            </div>
          </div>
          <div className="note">Interleaved scope and source chips blur the distinction between "what the agent may act on" and "what it is grounded on". Group scope chips first, then sources, with a visible divider.</div>
        </div>
      </div>

      {/* ====================================================================
          API REFERENCE
          ==================================================================== */}
      <SubHead meta="ContextProps">API reference</SubHead>
      <AutoPropsTable component="Context" label="<Context />"/>
      <p className="ds-caption">
        <b>Deprecated aliases:</b> <Mono>ContextGauge</Mono> (forwards to <Mono>{'<Context variant="gauge">'}</Mono>) and <Mono>ContextBar</Mono> (forwards to <Mono>{'<Context variant="bar">'}</Mono>) are preserved for backward-compat. Migrate to the unified <Mono>Context</Mono> component.
      </p>
    </Section>
  );
}
