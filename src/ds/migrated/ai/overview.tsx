'use client';
// Forge AI — Overview. Introduction-style landing; the hero is a live streaming chat.
import * as React from 'react';
import { DsOverview } from '@/components/docs';
import { AICaret, Icons } from '@/ds/core';

const ANSWER = 'identity-svc is degraded — p95 is 274ms (target 200ms) and the error budget is 38% and burning. Two open incidents.';

// Honour prefers-reduced-motion in JS: the CSS guard only freezes the AICaret
// blink, not the typewriter loop. When reduced motion is requested we render the
// finished answer statically — no setN interval, no perpetual retype, no caret.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return reduced;
}

function AiHero() {
  const reduced = usePrefersReducedMotion();
  const [n, setN] = React.useState(0);
  const [phase, setPhase] = React.useState<'typing' | 'done'>('typing');
  React.useEffect(() => {
    if (reduced || phase !== 'typing') return;
    if (n >= ANSWER.length) {
      const t = setTimeout(() => setPhase('done'), 200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setN((v) => v + 1), 26);
    return () => clearTimeout(t);
  }, [n, phase, reduced]);
  React.useEffect(() => {
    if (reduced || phase !== 'done') return;
    const t = setTimeout(() => { setN(0); setPhase('typing'); }, 2600);
    return () => clearTimeout(t);
  }, [phase, reduced]);

  const streaming = !reduced && phase === 'typing';
  const shown = reduced ? ANSWER : ANSWER.slice(0, n);

  return (
    <div className="surface" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, width: 380, maxWidth: '100%' }}>
      <div style={{ alignSelf: 'flex-end', maxWidth: '80%', background: 'var(--ember)', color: 'var(--ember-fg)', padding: '8px 12px', borderRadius: 14, fontSize: 'var(--text-sm)', lineHeight: 1.45 }}>
        How is identity-svc doing?
      </div>
      <div style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }}>
        <Icons.zap size={11} color="var(--ice)" /> getServiceHealth · done
      </div>
      <div
        aria-live="polite"
        aria-busy={streaming}
        style={{ alignSelf: 'flex-start', maxWidth: '90%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '9px 12px', borderRadius: 14, fontSize: 'var(--text-sm)', lineHeight: 1.5, minHeight: 64 }}
      >
        {shown}
        {streaming && <AICaret />}
      </div>
    </div>
  );
}

const PAGES: [string, string, string][] = [
  ['message', 'Message', 'One turn — user, assistant, system.'],
  ['conversation', 'Conversation', 'Bordered thread, auto-scroll, jump-pill.'],
  ['prompt-input', 'Prompt Input', 'Composer — textarea, attachments, model picker.'],
  ['streaming', 'Streaming', 'Token-by-token text with the caret.'],
  ['markdown', 'Markdown', 'Rendered prose, code, lists, tables.'],
  ['reasoning', 'Reasoning', 'Collapsible thinking trace.'],
  ['tool', 'Tool', 'Tool call — input, status, output.'],
  ['agents', 'Agents', 'The agent loop: plan → call → answer.'],
  ['contexts', 'Contexts', 'Grounding: sources, files, scope.'],
  ['citations', 'Citations', 'Inline source references.'],
];

export default function AiOverview() {
  return (
    <DsOverview
      eyebrow="Forge / AI"
      title="Build AI surfaces."
      lede="Chat threads, prompt composers, streaming, reasoning traces, tool calls, and agent loops — the moment a Forge product is wired to a model. Every one composes the same primitives, tokens, and ember accent as the core."
      hero={{
        eyebrow: 'Streaming · tools · agents',
        heading: 'The model is the only new dependency.',
        subtitle: 'Compose the core; add the conversation.',
        body: 'A message bubble is a surface; a tool call is a collapsible; a prompt input is an input-group. The AI layer adds the patterns — streaming, grounding, the agent loop — on top of the primitives you already know.',
        actions: (
          <>
            <a className="btn ember" href="/ai/message">Start with Message <Icons.arrowRight size={14} /></a>
            <a className="btn ghost" href="/example/ai-chat-empty">See the chat</a>
          </>
        ),
        visual: <AiHero />,
      }}
      principlesTitle="Principles"
      principles={[
        { t: 'Compose the core', d: 'No new palette, no new accent. AI surfaces are the same surfaces, pills, and inputs — arranged for a conversation.' },
        { t: 'Make work legible', d: 'Stream the answer, show the reasoning, name the tool call. The user always sees what the model did before it replied.' },
        { t: 'Ground every claim', d: 'Attach sources as removable chips and cite them inline, so an answer is auditable, not a black box.' },
      ]}
      tilesTitle="Components"
      tiles={PAGES.map(([slug, label, desc]) => ({ href: `/ai/${slug}`, label, desc }))}
      footer={{
        title: 'Wiring a model?',
        body: 'The reference chat-with-agents (AI SDK v6 + Gateway) lives under app/ai-chat/.',
        actions: <a className="btn" href="/ai/agents">Agents <Icons.arrowRight size={14} /></a>,
      }}
    />
  );
}
