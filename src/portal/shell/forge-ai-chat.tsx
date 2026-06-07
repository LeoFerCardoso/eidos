'use client';
// Forge AI — the in-context copilot for the topbar slide-over, built from the DS
// AI components (Suggestion, Message, PromptInput). Two states:
//   • EMPTY  — a ForgeMark hero + starter Suggestions to pick from.
//   • THREAD — picking a starter (or typing) opens a scripted conversation:
//     the user turn, a brief "reading your estate" assistant turn, then the
//     answer — rendered as DS <Message> bubbles. It's a simulation so the UX is
//     demonstrable offline; the full /portal/chat page will stream real
//     model output with markdown. The side panel shows the conversation UX.
import * as React from 'react';
import Link from 'next/link';
import {
  Icons,
  Button,
  ForgeMark, Message, PromptInput, Suggestion, SuggestionCard,
} from '@/ds/core';
import { RootCauseWidget, IncidentWidget, FlagWidget, RecoveryWidget, UserMention } from './forge-ai-widgets';

const COMMANDER = {
  name: 'Marcus Johnson',
  src: '/avatars/Marcus-Johnson.jpg',
  role: 'Staff SRE',
  tribe: 'Score & Risk',
  status: 'busy' as const,
  presence: 'On-call now · paged 6h ago',
  bio: 'SRE on the Score & Risk platform. Owns the on-call rotation and the konduto rollback runbooks. Ask me about incident response and SLOs.',
  region: 'São Paulo · Brazil',
  email: 'marcus.johnson@equifax.com',
  phone: '+55 11 99876-5432',
  joined: 'Joined Mar 2021',
  chatHref: 'https://chat.google.com/',
  href: '/portal',
};

// Backup on-call (real headshot, so the mention hovercard reads right).
const BACKUP = {
  name: 'Diego Ferreira',
  src: '/avatars/Diego-Ferreira.jpg',
  role: 'Platform Eng',
  tribe: 'Score & Risk',
  status: 'online' as const,
  presence: 'Available · backup on-call',
  bio: 'Platform engineer on Score & Risk. Secondary pager this week. Owns the Ignite feature-store wiring.',
  region: 'Rio de Janeiro · Brazil',
  email: 'diego.ferreira@equifax.com',
  phone: '+55 21 98123-4567',
  joined: 'Joined Aug 2022',
  chatHref: 'https://chat.google.com/',
  href: '/portal',
};

const STARTERS: { icon: string; title: string; line: string }[] = [
  { icon: 'gauge',    title: 'Why is acerta-api degraded?', line: 'Correlate the p99 spike with its dependencies.' },
  { icon: 'incident', title: 'Summarize open incidents',   line: 'Severity, owner and blast radius at a glance.' },
  { icon: 'rocket',   title: 'Scaffold a scoring service', line: 'Start from the paved-road template.' },
  { icon: 'pulse',    title: "What's my estate health?",   line: 'Health score, degraded services, deploys this week.' },
];

// Mid-thread follow-ups offered after the first answer — keeps the conversation
// going with one tap (Suggestion in its sm, inline size). Ordered as the
// incident-response escalation: mitigate (flag) → durable fix (rollback) → people.
const FOLLOWUPS = ['Disable the feature flag', 'Roll back konduto-antifraud', 'Who is on-call?'];

// ── Scripted answers (the acerta-api degradation scenario) ──────────────────────
// `ask` is threaded in so an action button inside an answer can advance the
// thread — the agentic escalation is: mitigate (kill the feature flag) → confirm
// recovery → propose the durable rollback while the fix is prepared.
function answer(qRaw: string, ask: (text: string) => void): React.ReactNode {
  const q = qRaw.toLowerCase();

  if (/roll ?back/.test(q)) {
    return (
      <>
        <p style={{ margin: '0 0 12px' }}>
          This rolls back <code className="mono">konduto-antifraud</code> from <code className="mono">v3.1.7</code> to{' '}
          <code className="mono">v3.1.6</code> in prod, reverting the new fraud-score rule. Gated rollout, about 4
          minutes, and I'll watch <code className="mono">acerta-api</code> p99 for 10 minutes after.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button variant="ember" size="sm"><Icons.rollback size={12} /> Confirm rollback</Button>
          <Button variant="ghost" size="sm">Cancel</Button>
        </div>
      </>
    );
  }

  // Mitigation confirmed — the flag is off, the estate recovers, and only then
  // do I propose the durable rollback (the flag-off is temporary).
  if (/turn off|flag (is )?off|disabled the flag|mitigat|recovered|healthy now/.test(q)) {
    return (
      <>
        <p style={{ margin: '0 0 10px' }}>
          Done · <code className="mono">konduto.fraud-score-v2</code> is <strong>off</strong> in production. The new
          fraud-score rule stopped running and the estate is recovering:
        </p>
        <RecoveryWidget
          nodes={[
            { name: 'acerta-api', icon: 'server', metric: 'p95 118ms', note: 'back within SLO' },
            { name: 'konduto-antifraud', icon: 'shield', metric: 'false-positive 2.1%', note: 'baseline restored' },
          ]}
        />
        <p style={{ margin: '12px 0 12px' }}>
          This is a <strong>temporary</strong> mitigation · the rule is only gated, not removed, so it can't ship to
          users but it's still in the build. While the team prepares the proper fix, I recommend rolling back{' '}
          <code className="mono">konduto-antifraud</code> from <code className="mono">v3.1.7</code> to{' '}
          <code className="mono">v3.1.6</code> in production so the release is clean.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button variant="ember" size="sm" onClick={() => ask('Roll back konduto-antifraud')}>
            <Icons.rollback size={12} /> Roll back konduto-antifraud
          </Button>
          <Button variant="ghost" size="sm" asChild><Link href="/portal/catalog/acerta-api">
            <Icons.server size={12} /> View acerta-api
          </Link></Button>
        </div>
      </>
    );
  }

  // Fastest, fully-reversible mitigation — flip the feature flag that wraps the
  // offending rule. No deploy; proposed BEFORE any rollback.
  if (/feature ?-?flag|disable .*flag|kill ?switch|gate the rule|toggle .*flag/.test(q)) {
    return (
      <>
        <p style={{ margin: '0 0 10px' }}>
          Good · the new fraud-score rule didn't ship as raw code. It's wrapped in a feature flag,{' '}
          <code className="mono">konduto.fraud-score-v2</code>, so we don't need a deploy to stop it:
        </p>
        <FlagWidget
          name="konduto.fraud-score-v2"
          state="on"
          wraps="New fraud-score rule · konduto-antifraud v3.1.7"
          scope="production · 100% of traffic"
        />
        <p style={{ margin: '12px 0 12px' }}>
          Turning it off is a runtime config change · it takes effect in <strong>~5s</strong>, needs no deploy and is
          fully reversible. The rejections stop immediately and p95 should normalize, buying time while the fix is
          prepared.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button variant="ember" size="sm" onClick={() => ask('Turn off the flag now')}>
            <Icons.flag size={12} /> Disable the flag
          </Button>
          <Button variant="ghost" size="sm">Cancel</Button>
        </div>
      </>
    );
  }

  if (/acerta|degrad|slow|latenc|p99|p95|konduto/.test(q)) {
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
          latency and rejections upstream. It's wrapped in a feature flag, so the{' '}
          <strong>fastest mitigation is to turn the flag off</strong> · no deploy, instantly reversible · then roll back
          for a clean release once the fix is ready.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button variant="ember" size="sm" onClick={() => ask('Disable the feature flag')}>
            <Icons.flag size={12} /> Disable the feature flag
          </Button>
          <Button variant="ghost" size="sm" asChild><Link href="/portal/catalog/acerta-api">
            <Icons.server size={12} /> Open acerta-api
          </Link></Button>
        </div>
      </>
    );
  }

  if (/on-?call|who('?s| is)? on|rotation|the pager/.test(q)) {
    return (
      <>
        <p style={{ margin: '0 0 10px' }}>
          <UserMention person={COMMANDER} /> has the <strong>Score &amp; Risk</strong> pager right now. On since 12:00,
          off at 18:00, paged 6h ago for INC-2041. Backup is <UserMention person={BACKUP} />.
        </p>
        <Button variant="ghost" size="sm" asChild><a href={COMMANDER.chatHref} target="_blank" rel="noreferrer">
          <Icons.chat size={12} /> Message on-call
        </a></Button>
      </>
    );
  }

  if (/incident|inc-|open the|page/.test(q)) {
    return (
      <>
        <p style={{ margin: '0 0 10px' }}>
          There is <strong>1 open incident</strong> right now. Commander is <UserMention person={COMMANDER} /> ·
          here's the summary and what's driving it:
        </p>
        <IncidentWidget
          id="INC-2041"
          severity="p2"
          title="p95 spike after konduto-antifraud v3.1.7"
          status="Open · 6h"
          opened="opened 6h ago"
          impacted={2}
          nodes={[
            {
              name: 'acerta-api', icon: 'server', health: 'degraded',
              metric: { label: 'p95 240ms', delta: 41, inverted: true },
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
          <code className="mono">acerta-api</code> is degraded because its dependency{' '}
          <code className="mono">konduto-antifraud</code> (the suspected root cause) is also degraded · the new
          fraud-score rule in <code className="mono">v3.1.7</code> is adding latency and rejections upstream. That rule
          shipped behind a feature flag, so the <strong>fastest mitigation is to flip it off</strong> · no deploy,
          instantly reversible · before we touch the release.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button variant="ember" size="sm" onClick={() => ask('Disable the feature flag')}>
            <Icons.flag size={12} /> Disable the feature flag
          </Button>
          <Button variant="ghost" size="sm" asChild><Link href="/portal/catalog/acerta-api">
            <Icons.server size={12} /> View impacted service
          </Link></Button>
        </div>
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
        <Button variant="ember" size="sm" asChild><Link href="/portal/create">
          <Icons.rocket size={12} /> Start from a template
        </Link></Button>
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
        <Button variant="ghost" size="sm" asChild><Link href="/portal">
          Open my Home digest <Icons.chevronRight size={12} />
        </Link></Button>
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
  // Guard against re-entrancy from a ref (not the `thinking` state) so `ask` can
  // be a stable callback — action buttons baked into an earlier answer call the
  // very same `ask`, with no stale-closure surprises.
  const thinkingRef = React.useRef(false);
  const endRef = React.useRef<HTMLDivElement>(null);
  const started = turns.length > 0;

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [turns, thinking]);

  const ask = React.useCallback((text: string) => {
    const t = text.trim();
    if (!t || thinkingRef.current) return;
    thinkingRef.current = true;
    setTurns((m) => [...m, { id: `u${++counter.current}`, role: 'user', content: t }]);
    setInput('');
    setThinking(true);
    window.setTimeout(() => {
      setTurns((m) => [...m, { id: `a${++counter.current}`, role: 'assistant', content: answer(t, ask) }]);
      thinkingRef.current = false;
      setThinking(false);
    }, 850);
  }, []);

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
