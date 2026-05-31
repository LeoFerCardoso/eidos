'use client';
// Eidos AI — Agent. How an agent shows up in the UI: its mark (AgentAvatar),
// its inline identity (AgentIdentity), the AI badge (AILabel), the richer
// AgentCard (reused from core/blocks), and the run loop made legible.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, CodeBlock, PropsTable, installTabs, Lede, AgentAvatar, AgentIdentity, AILabel, AgentCard, HealthBadge, Mono } from '@/ds/core';


const DEMO_AGENT = {
  name: 'Eidos Platform Agent',
  model: 'anthropic/claude-sonnet-4.5',
  status: 'up',
  summary: 'Triages incidents, checks service health, and drafts remediation steps across the platform.',
  capabilities: ['getServiceHealth', 'openIncident', 'searchRunbooks', 'rollbackDeploy'],
  calls: 1284,
  successRate: 97,
  lastRun: new Date(Date.now() - 4 * 60 * 1000),
};

// ── the run loop (in context) ─────────────────────────────────────────────
type Step = { icon: string; tone: string; title: string; body: string; status: string };
const STEPS: Step[] = [
  { icon: 'sparkle', tone: 'var(--ember)',    title: 'Plan', body: 'Decide whether tools are needed and in what order.', status: 'done' },
  { icon: 'zap',     tone: 'var(--ice)',      title: 'Call · getServiceHealth', body: '{ "service": "identity-svc" }', status: 'done' },
  { icon: 'database',tone: 'var(--fg-muted)', title: 'Observe', body: 'p95 482ms · error budget 38% · 2 open incidents', status: 'done' },
  { icon: 'check',   tone: 'var(--success)',  title: 'Answer', body: 'identity-svc is degraded — p95 is above target and the error budget is burning.', status: 'streaming' },
];
function StepRow({ s, last }: { s: Step; last: boolean }) {
  const Icon = (Icons as Record<string, any>)[s.icon] || Icons.circle;
  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ width: 'var(--space-8)', height: 'var(--space-8)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-active)', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: s.tone, flex: '0 0 auto' }}>
          <Icon size={14} />
        </span>
        {!last && <span style={{ width: 'var(--space-px)', flex: 1, background: 'var(--border)', marginBlock: 'var(--space-1)' }} />}
      </div>
      <div className="surface" style={{ flex: 1, padding: 'var(--space-3) var(--space-4)', marginBlockEnd: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="t-small" style={{ fontWeight: 600, color: 'var(--fg)' }}>{s.title}</span>
          <span className={'pill ' + (s.status === 'streaming' ? 'ember' : 'neutral')} style={{ marginInlineStart: 'auto' }}>{s.status}</span>
        </div>
        <div className="t-small" style={{ color: 'var(--fg-muted)', marginBlockStart: 'var(--space-1)', fontFamily: s.title.startsWith('Call') ? 'var(--font-mono)' : undefined, fontVariantNumeric: 'tabular-nums' }}>{s.body}</div>
      </div>
    </div>
  );
}

const stack = { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 'var(--space-2)' };

export default function AiAgents() {
  return (
    <Section
      id="agents"
      num="01"
      title="Agent"
      desc="An agent has two faces: an identity (who is answering — a mark, a name, a model, a live status) and a loop (plan → call a tool → observe → answer). This page covers both."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-agent')} ariaLabel="package manager"/>
      <Lede>Identify an agent the same way everywhere — the avatar, the inline name+model line, or the full card — so users always know which agent they&rsquo;re talking to and what it can do. Render every turn of its run as an auditable step.</Lede>
      <Lede>
        Ships <Mono>AgentAvatar</Mono>, <Mono>AgentIdentity</Mono> and the <Mono>AILabel</Mono> badge, and re-exports the richer <Mono>AgentCard</Mono> from the core block layer. Identity composes the same <Mono>.avatar</Mono> chrome and ember accent as the rest of Eidos — no new palette.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="AgentIdentity — avatar · name · model · presence" row code={`<AgentIdentity agent={{
  name: 'Eidos Platform Agent',
  model: 'anthropic/claude-sonnet-4.5',
  status: 'online',
}}/>`}>
        <AgentIdentity agent={{ name: 'Eidos Platform Agent', model: 'anthropic/claude-sonnet-4.5', status: 'online' }}/>
      </Frame>
      <Lede>
        The canonical way an agent is identified: a squircle mark, the agent's name, its model on a mono line, and a presence dot. Drop it in a chat header, a meta row, or a settings list.
      </Lede>

      {/* EXAMPLES */}
      <div className="ds-examples-rule" style={{ marginBlockStart: 'var(--space-8)', marginBlockEnd: 'var(--space-1)' }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      {/* AVATAR */}
      <SubHead meta="sizes">Avatar</SubHead>
      <Frame label="24 · 32 · 40 · 48 — the agent mark, squircle to read as 'not a person'" row code={`<AgentAvatar size={24}/>
<AgentAvatar size={32}/>
<AgentAvatar size={40}/>
<AgentAvatar size={48}/>`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
          <div style={stack}><AgentAvatar size={24}/><span className="t-mono-label">24</span></div>
          <div style={stack}><AgentAvatar size={32}/><span className="t-mono-label">32</span></div>
          <div style={stack}><AgentAvatar size={40}/><span className="t-mono-label">40</span></div>
          <div style={stack}><AgentAvatar size={48}/><span className="t-mono-label">48</span></div>
        </div>
      </Frame>

      <SubHead meta="presence">Presence &amp; persona</SubHead>
      <Frame label="status dot · custom glyph · named persona (initials)" row code={`<AgentAvatar size={40} status="online"/>
<AgentAvatar size={40} status="busy"/>
<AgentAvatar size={40} status="offline"/>
<AgentAvatar size={40} glyph={<Icons.shield size={20}/>}/>
<AgentAvatar size={40} initials="RX" ember={false}/>`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
          <div style={stack}><AgentAvatar size={40} status="online"/><span className="t-mono-label">online</span></div>
          <div style={stack}><AgentAvatar size={40} status="busy"/><span className="t-mono-label">busy</span></div>
          <div style={stack}><AgentAvatar size={40} status="offline"/><span className="t-mono-label">offline</span></div>
          <div style={stack}><AgentAvatar size={40} glyph={<Icons.shield size={20}/>}/><span className="t-mono-label">glyph</span></div>
          <div style={stack}><AgentAvatar size={40} initials="RX" ember={false}/><span className="t-mono-label">persona</span></div>
        </div>
      </Frame>
      <Lede>
        Presence reuses the core <Mono>.status-dot</Mono> (online / away / busy / offline). Override the glyph for a specialised agent (a security agent gets a shield), or pass <Mono>initials</Mono> for a named persona that isn't the generic bot mark.
      </Lede>

      {/* CARD */}
      <SubHead meta="composition">Card</SubHead>
      <Frame label="AgentCard (core block) — identity + health + capabilities + run stats" code={`<AgentCard agent={{
  name: 'Eidos Platform Agent',
  model: 'anthropic/claude-sonnet-4.5',
  status: 'up',
  summary: 'Triages incidents, checks service health…',
  capabilities: ['getServiceHealth', 'openIncident', '…'],
  calls: 1284, successRate: 97, lastRun,
}}/>`} height={300}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <AgentCard agent={DEMO_AGENT}/>
        </div>
      </Frame>
      <Lede>
        For a directory, a picker, or an agent's settings page, the full card carries everything: the identity, a one-line summary, a live <Mono>HealthBadge</Mono>, the tools it can call, and its run record. It's the existing core <Mono>AgentCard</Mono> — Eidos AI reuses it, it doesn't fork it.
      </Lede>

      {/* IN CONTEXT — the loop */}
      <SubHead meta="in context · the loop">The run</SubHead>
      <Frame label="plan · call · observe · answer — each turn as an auditable step">
        <div style={{ width: '100%', maxWidth: 600 }} role="log" aria-live="polite">
          {STEPS.map((s, i) => <StepRow key={i} s={s} last={i === STEPS.length - 1} />)}
        </div>
      </Frame>
      <Lede>
        Each step reuses the surface + status pill from core, the tool-call shape from <a href="/ai/tool" style={{ color: 'var(--ember-text)' }}>Tool</a>, and the collapsible trace from <a href="/ai/reasoning" style={{ color: 'var(--ember-text)' }}>Reasoning</a>. Grounding comes from <a href="/ai/contexts" style={{ color: 'var(--ember-text)' }}>Contexts</a>.
      </Lede>

      <SubHead meta="ai sdk v6">The loop in code</SubHead>
      <CodeBlock
        label="a tool-calling agent"
        lang="ts"
        code={`import { Experimental_Agent as Agent, stepCountIs } from 'ai';

const agent = new Agent({
  model: 'anthropic/claude-sonnet-4.5',
  system: 'You are the Eidos platform agent.',
  tools: { getServiceHealth, openIncident },
  stopWhen: stepCountIs(8),
});

const { text, steps } = await agent.generate({ prompt });
// render each step as a row; the final text is the answer.`}
      />
      <Lede>
        The reference agent lives in <Mono>src/lib/ai/</Mono> and is wired into <Mono>app/ai-chat/</Mono>.
      </Lede>

      {/* ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginBlockStart: 'var(--space-3)'}}>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div className="t-small" style={{fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 'var(--space-1)'}}>Keyboard</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>Identity rows and avatars are passive — not Tab stops. An <code style={{fontFamily:'var(--font-mono)'}}>AgentCard</code> with <code style={{fontFamily:'var(--font-mono)'}}>onOpen</code> becomes a real button (Tab reaches it, Enter/Space opens it). The run list is a passive log; Tab lands only on interactive affordances inside a step (a retry, an expand toggle), never traps.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div className="t-small" style={{fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 'var(--space-1)'}}>Screen reader</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The avatar glyph and presence dot are <code style={{fontFamily:'var(--font-mono)'}}>aria-hidden</code> — identity is carried by the visible name + model text. The run is wrapped in <code style={{fontFamily:'var(--font-mono)'}}>role="log"</code> + <code style={{fontFamily:'var(--font-mono)'}}>aria-live="polite"</code> so each step (Plan → Call → Observe → Answer) is announced as it lands, and the status pill is real text ("done", "streaming"), not colour alone.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div className="t-small" style={{fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 'var(--space-1)'}}>Focus &amp; contrast</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The ember avatar glyph rides on the <code style={{fontFamily:'var(--font-mono)'}}>--ember-soft</code> elevated tile (the proven ember-avatar pairing) and clears AA; the mono model line on <code style={{fontFamily:'var(--font-mono)'}}>--fg-muted</code> stays ≥ 4.5:1. Presence is reinforced by the labelled status, never hue alone.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div className="t-small" style={{fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 'var(--space-1)'}}>Motion</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>Under <code style={{fontFamily:'var(--font-mono)'}}>prefers-reduced-motion</code> the streaming Answer step drops the typing caret and the pulsing status dot — the step resolves to completed text instantly and the connector draws with no transition.</div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — avatar leads from the start edge, model line mirrors" row>
        <div dir="rtl" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
          <AgentIdentity agent={{ name: 'وكيل منصة Eidos', model: 'anthropic/claude-sonnet-4.5', status: 'online' }} label/>
          <div style={{ width: '100%', maxWidth: 340 }}>
            <AgentCard agent={{ ...DEMO_AGENT, name: 'وكيل منصة Eidos', summary: 'يفرز الحوادث ويفحص صحة الخدمات ويقترح خطوات الإصلاح.' }}/>
          </div>
        </div>
      </Frame>
      <Lede>
        Every spacing rule uses logical properties, so the flip is automatic — the avatar moves to the start (right) edge, the capability chips wrap from the right, and the footer stats mirror.
      </Lede>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <AgentIdentity agent={{ name: 'Eidos Platform Agent', model: 'anthropic/claude-sonnet-4.5', status: 'online' }} size={40} label/>
              <span className="lead v" style={{ top: -22, left: 18, height: 18 }}/>
              <span className="lead v" style={{ top: -22, left: 44, height: 18 }}/>
              <span className="lead h" style={{ top: 12, right: -30, width: 26 }}/>
              <span className="lead v" style={{ bottom: -22, left: 78, height: 18 }}/>
              <div className="pin" style={{ top: -42, left: 18, transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: -42, left: 44, transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ top: 4, right: -54 }}>3</div>
              <div className="pin" style={{ bottom: -42, left: 78, transform: 'translateX(-50%)' }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, marginBlock: 'var(--space-16) 0', marginInline: 'auto' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Mark.</b> The squircle <Mono>AgentAvatar</Mono> — ember glyph on an <Mono>--ember-soft</Mono> tile. Rounded-square, not a circle, so it reads as an agent and not a human user.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Presence dot.</b> The core <Mono>.status-dot</Mono> pinned to the mark — online / away / busy / offline.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Name + AI label.</b> The agent's name at 13px/600, with an optional <a href="/ai/label" style={{ color: 'var(--ember-text)' }}>AILabel</a> when the surface needs the explicit "AI" flag.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Model line.</b> The model id in Geist Mono on <Mono>--fg-muted</Mono> — the one place the underlying model is always legible.</span>
          </div>
        </div>
      </div>

      {/* DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — identify the agent and its model</div>
          <div className="body" style={{ padding: 'var(--space-4)' }}>
            <AgentIdentity agent={{ name: 'Eidos Platform Agent', model: 'anthropic/claude-sonnet-4.5', status: 'online' }}/>
          </div>
          <div className="note">Name + model + presence. Users always know which agent — and which model — is answering.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use a human avatar for an agent</div>
          <div className="body" style={{ padding: 'var(--space-4)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span className="avatar" style={{ width: 32, height: 32 }}>JS</span>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>Assistant</span>
            </span>
          </div>
          <div className="note">A circular initials avatar reads as a person. Agents get the squircle bot mark.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — show live health on the card</div>
          <div className="body" style={{ padding: 'var(--space-4)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <AgentAvatar size={32}/>
              <HealthBadge state="degraded"/>
            </span>
          </div>
          <div className="note">An agent that depends on tools can be degraded. Surface it so users calibrate trust.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — re-tint the mark per agent</div>
          <div className="body" style={{ padding: 'var(--space-4)' }}>
            <span className="avatar ember ai-agent-avatar" style={{ width: 32, height: 32, color: '#a78bfa', backgroundImage: 'linear-gradient(rgba(167,139,250,0.14), rgba(167,139,250,0.14))', borderColor: 'rgba(167,139,250,0.4)' }}>
              <Icons.agent size={16}/>
            </span>
          </div>
          <div className="note">One accent (ember). Distinguish agents by glyph or name, never by inventing a colour.</div>
        </div>
      </div>

      {/* API REFERENCE */}
      <SubHead meta="props">API reference</SubHead>
      <PropsTable
        label="<AgentAvatar />"
        rows={[
          { prop: 'size',     type: 'number', default: '32', description: 'Square size in px. ≥ 40 picks up the larger presence dot.' },
          { prop: 'status',   type: '"online" | "away" | "busy" | "offline"', default: undefined, description: 'Presence dot pinned to the mark. Omit for no dot.' },
          { prop: 'ember',    type: 'boolean', default: 'true', description: 'Ember-tinted tile (the AI accent). Set false for a neutral persona tile.' },
          { prop: 'glyph',    type: 'ReactNode', default: '<Icons.agent/>', description: 'Override the icon — e.g. a shield for a security agent.' },
          { prop: 'initials', type: 'string', default: undefined, description: 'Render initials instead of a glyph, for a named persona.' },
          { prop: 'name',     type: 'string', default: undefined, description: 'title attribute on the mark.' },
        ]}
      />
      <PropsTable
        label="<AgentIdentity />"
        rows={[
          { prop: 'agent', type: '{ name, model, status }', required: true, description: 'Identity object. status drives the presence dot; model renders on the mono line.' },
          { prop: 'size',  type: 'number', default: '32', description: 'Avatar size in px.' },
          { prop: 'label', type: 'boolean', default: 'false', description: 'Append an <AILabel/> pill after the name.' },
        ]}
      />
      <Lede>
        The richer <Mono>&lt;AgentCard agent={`{…}`}/&gt;</Mono> (summary, capabilities, health, run stats, <Mono>onOpen</Mono>) is documented in the core block layer — Eidos AI reuses it directly.
      </Lede>
    </Section>
  );
}
