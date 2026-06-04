'use client';
// Forge AI — the scripted copilot conversation, extracted so it can render in
// BOTH surfaces: the full /portal/assistant page AND the topbar slide-over
// drawer (opened from the sparkle button). The caller owns the width wrapper
// and any page header — this component is just thread · suggestions · composer.
//
// Replies are matched to the estate scenario (acerta-api degradation) so the
// vision is demonstrable offline; the real AI SDK wiring lives in app/ai-chat
// and turns on once VERCEL_AI_GATEWAY_API_KEY is set.
import * as React from 'react';
import Link from 'next/link';
import { HealthBadge, Icons, Pill } from '@/ds/core';
import { IconBubble } from '@/ds/examples/example-shell';

type Msg = { id: string; role: 'ai' | 'user'; content: React.ReactNode };

const SUGGESTIONS = [
  'Why is acerta-api degraded?',
  'Summarize open incidents',
  'Scaffold a scoring service',
  "What's my estate health?",
];

// ── Scripted answers ───────────────────────────────────────────────────────────
function answer(qRaw: string): React.ReactNode {
  const q = qRaw.toLowerCase();

  if (/acerta|degrad|slow|latenc|p99|p95|rollback/.test(q)) {
    return (
      <>
        <p style={{ margin: '0 0 10px' }}>
          <code className="mono">acerta-api</code> p99 is up <strong>41%</strong> since the{' '}
          <code className="mono">v4.12.0</code> deploy (2h ago). I correlated it with its dependencies:
        </p>
        <div className="surface" style={{ padding: 12, borderRadius: 8, marginBlockEnd: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)' }}>
            <code className="mono" style={{ fontWeight: 600 }}>konduto-antifraud</code>
            <HealthBadge state="degraded" pulse />
            <span style={{ color: 'var(--fg-muted)' }}>false-positive +18% since v3.1.7</span>
          </div>
        </div>
        <p style={{ margin: '0 0 12px' }}>
          Likely cause: the new fraud-score rule in <code className="mono">konduto-antifraud v3.1.7</code> is adding
          latency and rejections upstream. <strong>Recommended:</strong> roll back konduto-antifraud to{' '}
          <code className="mono">v3.1.6</code>, or gate the rule behind a flag.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn ember sm">
            <Icons.rollback size={12} /> Roll back konduto-antifraud
          </button>
          <Link className="btn ghost sm" href="/portal/catalog/acerta-api">
            <Icons.server size={12} /> Open acerta-api
          </Link>
        </div>
      </>
    );
  }

  if (/incident|inc-|on-?call|page/.test(q)) {
    return (
      <>
        <p style={{ margin: '0 0 10px' }}>There is <strong>1 open incident</strong> right now:</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBlockEnd: 10 }}>
          <Pill tone="severity-p2">P2</Pill>
          <span style={{ fontSize: 'var(--text-sm)' }}>
            <strong>INC-2041</strong> · p95 spike after konduto-antifraud v3.1.7 — opened 6h ago, commander Bruno Mendes.
          </span>
        </div>
        <Link className="btn ghost sm" href="/portal/catalog/acerta-api">
          View impacted service <Icons.chevronRight size={12} />
        </Link>
      </>
    );
  }

  if (/scaffold|template|new service|create|bootstrap/.test(q)) {
    return (
      <>
        <p style={{ margin: '0 0 12px' }}>
          The <strong>scoring-service</strong> template is the paved road for a new risk-score service — it ships with
          the Ignite feature store wiring, LGPD consent, observability and golden CI/CD pre-configured.
        </p>
        <Link className="btn ember sm" href="/portal/create">
          <Icons.rocket size={12} /> Start from a template
        </Link>
      </>
    );
  }

  if (/health|estate|score|status|overview/.test(q)) {
    return (
      <>
        <p style={{ margin: '0 0 10px' }}>
          Estate health is <strong>92</strong> (up 2 pts week-over-week). <strong>2 services</strong> are degraded right
          now — <code className="mono">acerta-api</code> and <code className="mono">konduto-antifraud</code> — both tied to
          the same konduto deploy. 44 deploys shipped this week with 0 failed gates.
        </p>
        <Link className="btn ghost sm" href="/portal">
          Open my Home digest <Icons.chevronRight size={12} />
        </Link>
      </>
    );
  }

  return (
    <p style={{ margin: 0 }}>
      I can help with service health, incidents, deploys and scaffolding new services. Try one of the suggestions
      below, or ask about a specific service like <code className="mono">acerta-api</code>.
    </p>
  );
}

const GREETING: React.ReactNode = (
  <>
    Hi Leonardo — I'm caught up on your estate. <strong>2 services are degraded</strong> and{' '}
    <strong>1 incident</strong> is open, all tied to the konduto-antifraud v3.1.7 deploy. Ask me anything, or pick a
    starter below.
  </>
);

/**
 * The Forge AI conversation. Renders thread · suggestion chips · sticky
 * composer. The caller supplies the width wrapper (the page centres it at
 * 800px; the drawer lets it fill). `autoFocus` focuses the composer on mount
 * (the drawer wants this; the page does not, to avoid scroll-jacking on load).
 */
export function ForgeAIChat({ autoFocus = false }: { autoFocus?: boolean }) {
  const [messages, setMessages] = React.useState<Msg[]>([{ id: 'greeting', role: 'ai', content: GREETING }]);
  const [input, setInput] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const counter = React.useRef(0);
  const endRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, thinking]);

  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const ask = (text: string) => {
    const t = text.trim();
    if (!t || thinking) return;
    const uid = `u${++counter.current}`;
    setMessages((m) => [...m, { id: uid, role: 'user', content: t }]);
    setInput('');
    setThinking(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, { id: `a${++counter.current}`, role: 'ai', content: answer(t) }]);
      setThinking(false);
    }, 750);
  };

  return (
    <>
      {/* Thread */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBlockEnd: 18 }}>
        {messages.map((m) =>
          m.role === 'ai' ? (
            <div key={m.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <IconBubble icon="sparkle" size={32} tone="ember" />
              <div
                className="fp-card"
                style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-sm)', lineHeight: 1.55 }}
              >
                {m.content}
              </div>
            </div>
          ) : (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div
                style={{
                  background: 'var(--ember-soft)',
                  color: 'var(--fg)',
                  border: '1px solid color-mix(in oklch, var(--ember) 22%, transparent)',
                  borderRadius: 'var(--radius-2xl)',
                  padding: '10px 14px',
                  fontSize: 'var(--text-sm)',
                  maxWidth: '80%',
                }}
              >
                {m.content}
              </div>
            </div>
          ),
        )}
        {thinking && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <IconBubble icon="sparkle" size={32} tone="ember" />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="dot" style={{ background: 'var(--ember)' } as React.CSSProperties} /> Forge AI is thinking…
            </span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && !thinking && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBlockEnd: 16 }}>
          {SUGGESTIONS.map((s) => (
            <button key={s} className="chip" style={{ cursor: 'pointer' }} onClick={() => ask(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="in-group"
        style={{ position: 'sticky', insetBlockEnd: 16 }}
      >
        <span className="in-addon icon">
          <Icons.sparkle size={14} />
        </span>
        <input
          ref={inputRef}
          className="in-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Forge AI about your estate…"
          aria-label="Message Forge AI"
        />
        <button type="submit" className="btn ember sm" disabled={!input.trim() || thinking} style={{ margin: 4 }}>
          <Icons.arrowRight size={13} />
        </button>
      </form>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', textAlign: 'center', marginBlockStart: 10 }}>
        Demo mode · wire to the live model by setting <code className="mono">VERCEL_AI_GATEWAY_API_KEY</code>.
      </p>
    </>
  );
}
