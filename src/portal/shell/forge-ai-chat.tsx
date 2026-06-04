'use client';
// Forge AI — the in-context copilot for the topbar slide-over, built from the DS
// AI components (Suggestion, Message, PromptInput). Two states:
//   • EMPTY  — a ForgeMark hero + starter Suggestions to pick from.
//   • THREAD — picking a starter (or typing) opens a scripted conversation:
//     the user turn, a brief "reading your estate" assistant turn, then the
//     answer — rendered as DS <Message> bubbles. It's a simulation so the UX is
//     demonstrable offline; the full /portal/assistant page will stream real
//     model output with markdown. The side panel shows the conversation UX.
import * as React from 'react';
import Link from 'next/link';
import {
  Icons, Pill,
  ForgeMark, Message, PromptInput, Suggestion, SuggestionCard,
} from '@/ds/core';
import { RootCauseWidget } from './forge-ai-widgets';

const STARTERS: { icon: string; title: string; line: string }[] = [
  { icon: 'gauge',    title: 'Why is acerta-api degraded?', line: 'Correlate the p99 spike with its dependencies.' },
  { icon: 'incident', title: 'Summarize open incidents',   line: 'Severity, owner and blast radius at a glance.' },
  { icon: 'rocket',   title: 'Scaffold a scoring service', line: 'Start from the paved-road template.' },
  { icon: 'pulse',    title: "What's my estate health?",   line: 'Health score, degraded services, deploys this week.' },
];

// Mid-thread follow-ups offered after the first answer — keeps the conversation
// going with one tap (Suggestion in its sm, inline size).
const FOLLOWUPS = ['Roll back konduto-antifraud', 'Who is on-call?', 'Open the incident'];

// ── Scripted answers (the acerta-api degradation scenario) ──────────────────────
function answer(qRaw: string): React.ReactNode {
  const q = qRaw.toLowerCase();

  if (/acerta|degrad|slow|latenc|p99|p95|rollback|roll back|konduto/.test(q)) {
    return (
      <>
        <p style={{ margin: '0 0 10px' }}>
          <code className="mono">acerta-api</code> p99 is up <strong>41%</strong> since the{' '}
          <code className="mono">v4.12.0</code> deploy (2h ago). I correlated it with its dependencies:
        </p>
        <RootCauseWidget
          nodes={[
            {
              name: 'acerta-api', icon: 'server', health: 'degraded',
              metric: { label: 'p99 240ms', delta: 41, inverted: true },
              version: 'v4.12.0', age: '2h ago',
            },
            {
              name: 'konduto-antifraud', icon: 'shield', health: 'degraded', root: true,
              metric: { label: 'false-positive', delta: 18, inverted: true },
              version: 'v3.1.7', age: '1d ago',
            },
          ]}
        />
        <p style={{ margin: '12px 0 12px' }}>
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
            <strong>INC-2041</strong> · p95 spike after konduto-antifraud v3.1.7, opened 6h ago, commander Bruno Mendes.
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
          The <strong>scoring-service</strong> template is the paved road for a new risk-score service. It ships with
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
          Estate health is <strong>92</strong> (up 2 pts week over week). <strong>2 services</strong> are degraded right
          now, <code className="mono">acerta-api</code> and <code className="mono">konduto-antifraud</code>, both tied to
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
      I can help with service health, incidents, deploys and scaffolding new services. Try a starter, or ask about a
      specific service like <code className="mono">acerta-api</code>.
    </p>
  );
}

type Turn = { id: string; role: 'user' | 'assistant'; content: React.ReactNode };

export function ForgeAIChat() {
  const [turns, setTurns] = React.useState<Turn[]>([]);
  const [input, setInput] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  // Follow-up suggestions stay highlighted once picked.
  const [usedSuggestions, setUsedSuggestions] = React.useState<Set<string>>(new Set());
  const counter = React.useRef(0);
  const endRef = React.useRef<HTMLDivElement>(null);
  const started = turns.length > 0;

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [turns, thinking]);

  const ask = (text: string) => {
    const t = text.trim();
    if (!t || thinking) return;
    setTurns((m) => [...m, { id: `u${++counter.current}`, role: 'user', content: t }]);
    setInput('');
    setThinking(true);
    window.setTimeout(() => {
      setTurns((m) => [...m, { id: `a${++counter.current}`, role: 'assistant', content: answer(t) }]);
      setThinking(false);
    }, 850);
  };

  return (
    <div className="fp-ai-chat">
      <div className="fp-ai-chat-scroll">
        {!started ? (
          <div className="fp-ai-empty">
            <ForgeMark size={40} />
            <h2 className="fp-ai-empty-title">How can Forge AI help?</h2>
            <p className="fp-ai-empty-sub">
              It reads your estate, services, deploys, incidents and SLOs, and acts on it. Pick a starter or ask anything.
            </p>
            <div className="sg-cards fp-ai-empty-cards">
              {STARTERS.map((s) => {
                const I = (Icons as Record<string, React.FC<{ size?: number }>>)[s.icon] ?? Icons.sparkle;
                return (
                  <SuggestionCard
                    key={s.title}
                    icon={<I size={14} />}
                    title={s.title}
                    line={s.line}
                    onClick={() => ask(s.title)}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div className="fp-ai-thread">
            {turns.map((t) => (
              <Message
                key={t.id}
                from={t.role}
                meta={t.role === 'assistant' ? 'Forge AI' : undefined}
              >
                {t.content}
              </Message>
            ))}
            {thinking && (
              <Message from="assistant" streaming meta="Forge AI">
                Reading your estate…
              </Message>
            )}
            {!thinking && (
              <div className="fp-ai-followups">
                {FOLLOWUPS.map((f) => (
                  <Suggestion
                    key={f}
                    size="sm"
                    pressed={usedSuggestions.has(f)}
                    onClick={() => {
                      setUsedSuggestions((u) => new Set(u).add(f));
                      ask(f);
                    }}
                  >
                    {f}
                  </Suggestion>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <div className="fp-ai-chat-composer">
        <PromptInput
          status={thinking ? 'streaming' : 'ready'}
          value={input}
          onChange={setInput}
          onSubmit={(v) => ask(v)}
          placeholder="Ask Forge AI about your estate…"
          actions={[
            { id: 'attach',  icon: 'paperclip', label: 'Attach a file',      description: 'Logs, a config, a screenshot' },
            { id: 'service', icon: 'server',    label: 'Add a service',       description: 'Bring a service into context' },
            { id: 'search',  icon: 'search',    label: 'Search the catalog',  description: 'Services, deploys, runbooks' },
            { id: 'tool',    icon: 'terminal',  label: 'Run a tool',          description: 'Pick a tool for the agent to call' },
          ]}
          footerHint="Grounded in your live catalog. Verify before you act on production."
        />
      </div>
    </div>
  );
}
