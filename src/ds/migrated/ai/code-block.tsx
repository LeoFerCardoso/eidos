'use client';
// Forge AI — Code block (§2.2 component-page standard).
// Documents the two code surfaces in AI replies: the standalone CodeBlock
// from core (label + copy + syntax-highlighted body) and the inline ProseCode
// (language header + copy + scrollable mono body inside .ai-prose). A live
// Shiki highlight demo is loaded dynamically so no heavy dep enters core.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, CodeBlock, AutoPropsTable, PropsTable, installTabs, Lede, Prose, ProseCode, Skeleton, Mono } from '@/ds/core';

// AI-page inline style convention (agents.tsx idiom — no page-local <style>)

// ── Live Shiki demo ───────────────────────────────────────────────────────
// shiki touches the DOM → always dynamic-import inside useEffect.
const SHIKI_CODE = `import { Experimental_Agent as Agent, stepCountIs } from 'ai';

const agent = new Agent({
  model: 'anthropic/claude-sonnet-4-6',
  system: 'You are the Forge platform agent.',
  tools: { getServiceHealth, openIncident },
  stopWhen: stepCountIs(8),
});

// Each step is plan → call → observe → answer.
const { text, steps } = await agent.generate({ prompt });`;

function ShikiDemo() {
  const [html, setHtml] = React.useState<string | null>(null);
  React.useEffect(() => {
    let on = true;
    import('shiki').then(async ({ codeToHtml }) => {
      const rendered = await codeToHtml(SHIKI_CODE, { lang: 'ts', theme: 'github-dark' });
      if (on) setHtml(rendered);
    }).catch(() => {
      if (on) setHtml(null);
    });
    return () => { on = false; };
  }, []);

  if (!html) return <Skeleton lines={9} width={560}/>;
  return (
    <div
      className="ai-code-shiki"
      style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'auto',
        maxWidth: 640,
        fontSize: 'var(--text-base)',
        lineHeight: 1.6,
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ── Code snippets ─────────────────────────────────────────────────────────
const USAGE_CODE = `import { CodeBlock } from "@/ds/core"

<CodeBlock
  label="deploy command"
  lang="bash"
  code="forge deploy --service identity-svc --ring canary"
/>`;

const PROSE_CODE_USAGE = `import { Prose, ProseCode } from "@/ds/core"

<Prose>
  <p>Run the deploy command:</p>
  <ProseCode lang="bash">
    forge deploy --service identity-svc --ring canary --hold
  </ProseCode>
</Prose>`;

const IN_CONTEXT_CODE = `// Inside a Message turn:
<div className="msg-body">
  <Prose>
    <p>Based on the trace, p95 on <code>identity-svc</code> is degraded.</p>
    <p>Run this to inspect the live traffic:</p>
    <ProseCode lang="bash">
      forge trace --service identity-svc --tail
    </ProseCode>
  </Prose>
</div>`;

const LONG_CODE_SAMPLE = `import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/ai/client';
import type { StreamingOptions } from '@/types/ai';

// This hook manages a streaming AI response with abort support.
// It exposes the partial text, a loading flag, and an error state.
export function useAIStream(prompt: string, opts?: StreamingOptions) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const client = createClient();

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    setText('');
    try {
      const stream = client.stream(prompt, opts);
      for await (const chunk of stream) {
        setText(prev => prev + chunk);
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [prompt]);

  useEffect(() => { run(); }, [run]);
  return { text, loading, error, retry: run };
}`;

export default function AiCodeBlock() {
  return (
    <Section
      id="code-block"
      num="06"
      title="Code block"
      desc="Two surfaces for code in AI replies: standalone CodeBlock (label, language tag, copy button) and inline ProseCode (same chrome inside ai-prose, escaping the 68-character prose cap)."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-code-block')} ariaLabel="package manager"/>
      <Lede>Use CodeBlock for cited examples in documentation; use ProseCode inside model-generated Prose.</Lede>
      <Lede>
        Ships two primitives: <Mono>CodeBlock</Mono> (standalone, from core primitives — label + copy + tokenized body) and <Mono>ProseCode</Mono> (prose-scoped, from <Mono>core/ai/prose</Mono> — same chrome but escaped from the 68ch line cap). Both reuse the existing DS surfaces — no new CSS is needed.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="CodeBlock — standalone · label · lang · copy" code={USAGE_CODE} height={120}>
        <CodeBlock
          label="deploy command"
          lang="bash"
          code="forge deploy --service identity-svc --ring canary"
        />
      </Frame>
      <Lede>
        The canonical way to show a code snippet in a documentation frame or AI response. The label names the snippet; the language tag drives the tokenizer. Copy is always present and real — never an icon-only affordance.
      </Lede>

      {/* EXAMPLES EYEBROW */}
      <div className="ds-examples-rule" style={{ marginBlockStart: 36, marginBlockEnd: 6 }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      {/* PROSE CODE */}
      <SubHead meta="inside prose">ProseCode</SubHead>
      <Frame label="ProseCode — fenced code block inside .ai-prose" code={PROSE_CODE_USAGE} height={200}>
        <Prose style={{ maxWidth: 560 }}>
          <p>Run the deploy command from the service root:</p>
          <ProseCode lang="bash">{`forge deploy \\
  --service identity-svc \\
  --ring canary \\
  --hold`}</ProseCode>
          <p>The <code>--hold</code> flag pauses auto-promotion until you explicitly release.</p>
        </Prose>
      </Frame>
      <Lede>
        <Mono>ProseCode</Mono> escapes the 68ch prose cap and may fill the container. It lives only inside <Mono>{'<Prose>'}</Mono>. For a standalone snippet outside prose, always use the core <Mono>{'<CodeBlock>'}</Mono>.
      </Lede>

      {/* VARIANTS */}
      <SubHead meta="languages">Variants — language support</SubHead>
      <Frame label="bash · ts · css · html — each uses the built-in tokenizer" height={260}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 560 }}>
          <CodeBlock label="shell" lang="bash" code="forge deploy --service identity-svc --ring canary"/>
          <CodeBlock label="typescript" lang="ts" code={`const agent = new Agent({ model: 'anthropic/claude-sonnet-4-6' });`}/>
          <CodeBlock label="css" lang="css" code={`--ember: #FF6B35;\n.ai-code { border-radius: var(--radius-lg); }`}/>
        </div>
      </Frame>
      <Lede>
        The built-in tokenizer covers <Mono>bash</Mono> / <Mono>ts</Mono> / <Mono>tsx</Mono> / <Mono>js</Mono> / <Mono>jsx</Mono> / <Mono>css</Mono> / <Mono>html</Mono>. For richer highlight fidelity in published documentation, use the Shiki live demo below.
      </Lede>

      <SubHead meta="no header">Without header</SubHead>
      <Frame label="ProseCode without a language label — minimal header" height={140}>
        <Prose style={{ maxWidth: 480 }}>
          <ProseCode lang="">{`{ "service": "identity-svc", "p95": 482, "budget": 0.38 }`}</ProseCode>
        </Prose>
      </Frame>
      <Lede>
        Pass an empty <Mono>lang</Mono> to suppress the language token in the header — the copy button remains. Use for JSON blobs or config fragments that don't map to a named language.
      </Lede>

      <SubHead meta="long scroll">Long snippets</SubHead>
      <Frame label="CollapsibleCode — clips at 8 lines, reveals on 'Show code'" height={180}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <CodeBlock label="useAIStream hook" lang="ts" code={LONG_CODE_SAMPLE}/>
        </div>
      </Frame>
      <Lede>
        Code blocks longer than 8 lines auto-collapse behind a "Show code" toggle (the <Mono>CollapsibleCode</Mono> primitive). The fold is visual — the code is present in the DOM and accessible to assistive technology.
      </Lede>

      {/* LIVE SHIKI DEMO */}
      <SubHead meta="shiki · github-dark">Live syntax highlight</SubHead>
      <Lede>
        The built-in tokenizer is a lightweight single-pass highlighter. For documentation that benefits from full grammar-aware colouring, wire Shiki via a dynamic import in <Mono>useEffect</Mono> (never in core — it's a heavy dep). Shiki's output is self-styled inline; wrap it in a Forge surface for border-radius and overflow control.
      </Lede>
      <Frame label="Shiki · github-dark · TypeScript — loads on mount" height={320}>
        <ShikiDemo/>
      </Frame>
      <Lede>
        The pattern: <Mono>{'import(\'shiki\').then(async ({ codeToHtml }) => { … })'}</Mono> inside <Mono>useEffect</Mono>, with a <Mono>Skeleton</Mono> fallback before the promise resolves. Set <Mono>let on = true</Mono> and guard the state setter so the component unmount doesn't trigger a React warning.
      </Lede>
      <CodeBlock
        label="Shiki dynamic-import pattern"
        lang="ts"
        code={`React.useEffect(() => {
  let on = true;
  import('shiki').then(async ({ codeToHtml }) => {
    const html = await codeToHtml(code, { lang: 'ts', theme: 'github-dark' });
    if (on) setHtml(html);
  });
  return () => { on = false; };
}, [code]);

// Render:
// html
//   ? <div className="ai-code-shiki" dangerouslySetInnerHTML={{ __html: html }}/>
//   : <Skeleton lines={6}/>`}
      />

      {/* IN CONTEXT */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame label="code block inside a message turn — Prose + ProseCode composition" code={IN_CONTEXT_CODE} height={280}>
        <div style={{ width: '100%', maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* User prompt */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ padding: '10px 14px', background: 'var(--ember-soft)', border: '1px solid rgba(255,107,53,0.22)', borderRadius: 12, borderEndEndRadius: 4, color: 'var(--fg)', fontSize: 'var(--text-base)', lineHeight: 1.55, maxWidth: '70%' }}>
              How do I inspect live traffic on identity-svc?
            </div>
          </div>
          {/* Agent reply */}
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-lg)', background: 'var(--ember-soft)', border: '1px solid rgba(255,107,53,0.22)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
              <Icons.sparkle size={16} style={{ color: 'var(--ember)' }}/>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className="t-mono-label" style={{ display: 'block', marginBottom: 8 }}>FORGE PLATFORM AGENT</span>
              <Prose>
                <p>Based on the trace, p95 on <code>identity-svc</code> is 482 ms — above the 400 ms target. Run this to tail live traffic:</p>
                <ProseCode lang="bash">{`forge trace --service identity-svc --tail`}</ProseCode>
                <p>You can narrow the window with <code>--last 5m</code> if you want only recent spans.</p>
              </Prose>
            </div>
          </div>
        </div>
      </Frame>
      <Lede>
        Always compose <Mono>ProseCode</Mono> inside <Mono>Prose</Mono> in a message reply. The copy button and language label stay in the block header; the body scrolls without clipping the thread.
      </Lede>

      {/* ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-h3" style={{ marginBlockEnd: 6 }}>Keyboard</div>
          <div className="t-body" style={{ color: 'var(--fg-muted)' }}>
            The copy button is a real <Mono>{'<button>'}</Mono> — Tab reaches it in document order; Enter or Space fires the copy action. The code body itself is not interactive and is not a Tab stop. Inside <Mono>CollapsibleCode</Mono>, the "Show/Hide code" toggle is also a real button, Tab-reachable, toggled by Enter/Space.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-h3" style={{ marginBlockEnd: 6 }}>Screen reader</div>
          <div className="t-body" style={{ color: 'var(--fg-muted)' }}>
            The code body lives in a semantic <Mono>{'<pre><code>'}</Mono> so VoiceOver / NVDA announce it as a code region. The language label is real text (not an icon); the copy button carries <Mono>aria-label="Copy code"</Mono>. The Shiki HTML output is placed inside a <Mono>{'<div>'}</Mono> with no overriding role — its <Mono>{'<pre>'}</Mono> structure is preserved.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-h3" style={{ marginBlockEnd: 6 }}>Contrast</div>
          <div className="t-body" style={{ color: 'var(--fg-muted)' }}>
            The built-in tokenizer colours keywords with <Mono>.k</Mono> = <Mono>var(--ice)</Mono> and strings with <Mono>.s</Mono> = <Mono>var(--warning)</Mono> — both meet AA on the <Mono>var(--bg)</Mono> code surface in both themes. Comments (<Mono>.c</Mono> = <Mono>var(--fg-faint)</Mono>) are decorative-only and never carry required meaning. Shiki's <Mono>github-dark</Mono> theme meets WCAG AA at normal text size. Verify any custom Shiki theme against the actual background colour.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-h3" style={{ marginBlockEnd: 6 }}>Motion</div>
          <div className="t-body" style={{ color: 'var(--fg-muted)' }}>
            Code blocks are static. The only animated element is the copy button's "Copied" state transition; under <Mono>prefers-reduced-motion</Mono>, the label switches instantly with no fade or scale. The CollapsibleCode expand/collapse also resolves immediately without a height animation.
          </div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label="dir=&quot;rtl&quot; — copy button mirrors to the leading edge; code body stays LTR"
        code={`<div dir="rtl">
  <Prose>
    <p>نفّذ الأمر التالي للنشر:</p>
    <ProseCode lang="bash">forge deploy --service identity-svc</ProseCode>
  </Prose>
</div>`}
      >
        <div dir="rtl" style={{ width: '100%', maxWidth: 560 }}>
          <Prose>
            <p>نفّذ الأمر التالي لنشر الخدمة:</p>
            <ProseCode lang="bash">{`forge deploy --service identity-svc --ring canary`}</ProseCode>
            <p>استخدم <code>--hold</code> لإيقاف الترقية التلقائية.</p>
          </Prose>
        </div>
      </Frame>
      <Lede>
        The code block header (language label + copy button) uses logical CSS, so the copy button mirrors to the inline-start edge in RTL. The code body always renders left-to-right regardless of document direction — code is a directionality boundary. Use <Mono>dir="ltr"</Mono> on the <Mono>{'<pre>'}</Mono> if your renderer doesn't do this automatically.
      </Lede>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 480 }} aria-hidden="true">
              <CodeBlock
                label="deploy command"
                lang="bash"
                code={`forge deploy --service identity-svc --ring canary --hold`}
              />
              {/* pin 1 — header */}
              <span className="lead v" style={{ top: -22, left: 60, height: 18 }}/>
              <div className="pin" style={{ top: -42, left: 60, transform: 'translateX(-50%)' }}>1</div>
              {/* pin 2 — language label */}
              <span className="lead v" style={{ top: -22, left: 140, height: 18 }}/>
              <div className="pin" style={{ top: -42, left: 140, transform: 'translateX(-50%)' }}>2</div>
              {/* pin 3 — copy button */}
              <span className="lead h" style={{ top: 18, right: -34, width: 30 }}/>
              <div className="pin" style={{ top: 10, right: -56 }}>3</div>
              {/* pin 4 — code body */}
              <span className="lead v" style={{ bottom: -22, left: 60, height: 18 }}/>
              <div className="pin" style={{ bottom: -42, left: 60, transform: 'translateX(-50%)' }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Header bar.</b> A 36px mono bar that separates the code body from the surrounding prose. Always present — it carries the label and the copy affordance.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Language label.</b> Plain text in Geist Mono — <Mono>bash</Mono>, <Mono>ts</Mono>, <Mono>css</Mono>, etc. Omit (pass <Mono>lang=""</Mono>) only when the language is ambiguous or irrelevant.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Copy button.</b> A real <Mono>{'<button>'}</Mono> — always present, keyboard-reachable, shows "Copied" for 1.4 s then resets. Never icon-only; the label is text.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Code body.</b> A <Mono>{'<pre><code>'}</Mono> block with the built-in tokenizer output. Scrolls horizontally without wrapping; long snippets collapse behind a "Show code" toggle via <Mono>CollapsibleCode</Mono>.</span>
          </div>
        </div>
      </div>

      {/* DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — label the language and offer copy</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%', maxWidth: 340 }}>
              <CodeBlock label="shell" lang="bash" code="forge deploy --service identity-svc"/>
            </div>
          </div>
          <div className="note">A labelled language tag + copy button lets the reader scan and paste without re-typing. Both are always present — they're built into <Mono>CodeBlock</Mono> with no opt-out.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — render runnable commands without a copy affordance</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>
              forge deploy --service identity-svc
            </div>
          </div>
          <div className="note">A bare mono block forces the user to select, copy, and paste manually — and risks transcription errors in a terminal command. Always use <Mono>CodeBlock</Mono> or <Mono>ProseCode</Mono>.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — use ProseCode inside Prose, CodeBlock outside</div>
          <div className="body" style={{ padding: 14 }}>
            <Prose style={{ maxWidth: 320 }}>
              <p>Inspect live traffic with:</p>
              <ProseCode lang="bash">{`forge trace --service identity-svc`}</ProseCode>
            </Prose>
          </div>
          <div className="note">Each surface fits its context: <Mono>ProseCode</Mono> escapes the 68ch cap inside prose; <Mono>CodeBlock</Mono> is self-contained for standalone snippets.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — nest CodeBlock inside Prose</div>
          <div className="body" style={{ padding: 14 }}>
            <Prose style={{ maxWidth: 320 }}>
              <p>Run this command:</p>
              <div style={{ border: '2px dashed var(--danger)', borderRadius: 'var(--radius-lg)', padding: 8 }}>
                <CodeBlock label="shell" lang="bash" code="forge deploy"/>
              </div>
            </Prose>
          </div>
          <div className="note">A <Mono>CodeBlock</Mono> (standalone, full-bleed frame) inside <Mono>Prose</Mono> creates layout conflicts. Use <Mono>ProseCode</Mono> for in-prose fences.</div>
        </div>
      </div>

      {/* API REFERENCE */}
      <SubHead meta="CodeBlockProps">API reference</SubHead>
      <AutoPropsTable component="CodeBlock" label="<CodeBlock />"/>
      <PropsTable
        label="<ProseCode />"
        rows={[
          { prop: 'lang', type: 'string', default: '"bash"', description: 'Language label displayed in the block header. Shown as-is — no tokenization in core. Use Shiki in a useEffect for grammar-aware colouring.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'The raw code string. Trimmed of trailing newlines before render. Displayed verbatim in a <pre> block.' },
        ]}
      />
      <Lede>
        For Shiki-powered highlight, see the live demo above. The pattern: <Mono>import('shiki')</Mono> inside <Mono>useEffect</Mono>, guard with <Mono>let on = true</Mono>, render Shiki HTML into a wrapper div on <Mono>var(--surface)</Mono> with <Mono>border-radius: var(--radius-lg)</Mono>. Never import Shiki at the module level — it's a heavy dep that must not enter the server chunk.
      </Lede>
    </Section>
  );
}
