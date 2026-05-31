'use client';
import React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, AutoPropsTable, installTabs, AgentCard, HealthBadge, Skeleton, Spinner, Empty, Lede, Mono } from '@/ds/core';


const now = Date.now();
const AGENTS = [
  {
    name: 'codex-reviewer',
    model: 'claude-sonnet-4.6',
    status: 'up',
    summary: 'Reviews PRs against guidelines, security checklist, performance budgets.',
    capabilities: ['PR review', 'security scan', 'perf check'],
    calls: 1247,
    successRate: 96,
    lastRun: new Date(now - 4 * 60_000),
  },
  {
    name: 'runbook-executor',
    model: 'claude-opus-4',
    status: 'degraded',
    summary: 'Executes approved runbooks during incidents. Always asks for human confirmation before destructive steps.',
    capabilities: ['runbook', 'rollback', 'circuit breaker'],
    calls: 318,
    successRate: 92,
    lastRun: new Date(now - 22 * 60_000),
  },
  {
    name: 'cost-inspector',
    model: 'claude-haiku-4',
    status: 'up',
    summary: 'Detects anomalous cost spikes per service / environment and proposes the smallest reverting change.',
    capabilities: ['cost anomaly', 'egress audit', 'recommendation'],
    calls: 6842,
    successRate: 99,
    lastRun: new Date(now - 90_000),
  },
];

const USAGE = `import { AgentCard } from "@/components/forge/agent-card"

export function Demo() {
  return (
    <AgentCard
      agent={{
        name: "codex-reviewer",
        model: "claude-sonnet-4.6",
        status: "up",
        summary: "Reviews PRs against guidelines, security checklist, perf budgets.",
        capabilities: ["PR review", "security scan", "perf check"],
        calls: 1247,
        successRate: 96,
        lastRun: new Date(Date.now() - 4 * 60_000),
      }}
    />
  )
}`;

const OPEN_USAGE = `// Passing onOpen wires the whole tile as a single role="button"
// Tab stop that fires on click, Enter, and Space.
<AgentCard agent={codexReviewer} onOpen={() => openAgent("codex-reviewer")} />`;

// Interactive demo — proves the documented role=button / Enter-Space / focus-ring
// path. Activating any tile (pointer OR keyboard) records the last opened agent.
function OpenDemo() {
  const [opened, setOpened] = React.useState<string | null>(null);
  return (
    <div>
      <div className="ds-grid cols-3">
        {AGENTS.map(a => (
          <AgentCard key={a.name} agent={a} onOpen={() => setOpened(a.name)}/>
        ))}
      </div>
      <div
        role="status"
        aria-live="polite"
        style={{
          marginBlockStart: 16, display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)',
        }}
      >
        <Icons.cornerDownLeft size={13}/>
        {opened
          ? <span>opened <span style={{ color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>{opened}</span> — click a tile or focus one and press <Mono>Enter</Mono> / <Mono>Space</Mono></span>
          : <span style={{ color: 'var(--fg-faint)' }}>Tab to a tile and press Enter / Space — or click — to open it</span>}
      </div>
    </div>
  );
}

// Loading skeleton — mirrors the real .agent-card slots (avatar · id · summary ·
// caps · foot) so the layout never shifts when the agent data resolves.
function AgentCardSkeleton() {
  return (
    <div className="agent-card" aria-hidden="true">
      <div className="ac-head">
        <Skeleton variant="circle" size={44}/>
        <div className="ac-id" style={{ gap: 6 }}>
          <Skeleton width="58%"/>
          <Skeleton width="40%"/>
        </div>
        <Skeleton variant="box" width={64} height={22} radius="999px"/>
      </div>
      <Skeleton lines={2}/>
      <div className="ac-caps">
        <Skeleton variant="box" width={64} height={22} radius="999px"/>
        <Skeleton variant="box" width={80} height={22} radius="999px"/>
        <Skeleton variant="box" width={52} height={22} radius="999px"/>
      </div>
      <div className="ac-foot"><Skeleton width="46%"/></div>
    </div>
  );
}

export default function AgentCardPage() {
  return (
    <Section id="el-agent-card" title="Agent card" desc="Catalog tile for an AI agent — name, model, health, capabilities, and run stats in one glanceable block. Reaches for AgentCard in the agent catalog, the workflow-node inspector, and the incident-response shelf.">
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('agent-card')} ariaLabel="package manager"/>
      <Lede>Every agent surface — the catalog, the workflow palette, the conversation shelf — should reach for <Mono>&lt;AgentCard/&gt;</Mono>. The recipe owns the layout — name over model in the header, capability chips below — so the reader scans the same way every time.</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Lede>Composed from Card + Avatar + HealthBadge + chips + RelativeTime. The recipe owns the layout — the model reads as a muted-mono line under the name, then neutral capability chips below — so the reader scans every agent the same way. Caps at one summary line and five chips; depth belongs on the agent-detail page.</Lede>
      <Frame label="single tile" code={USAGE}>
        <div style={{maxWidth: 420}}>
          <AgentCard agent={AGENTS[0]}/>
        </div>
      </Frame>
      <Lede>Header: ember-soft bot avatar, agent name with the model on a muted-mono line below, health pill. Summary line, then a capability row of neutral chips. Footer: runs · success · last run.</Lede>

      <div style={{ marginTop: 36, marginBottom: 6, display:'flex', alignItems:'center', gap: 12 }}>
        <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--fg-faint)'}}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <SubHead meta="catalog · 3-up">Agent catalog</SubHead>
      <Frame label="three example agents · review · runbook · cost"
             code={`<div className="ds-grid cols-3">
  <AgentCard agent={codexReviewer} />
  <AgentCard agent={runbookExecutor} />
  <AgentCard agent={costInspector} />
</div>`}>
        <div className="ds-grid cols-3">
          {AGENTS.map(a => <AgentCard key={a.name} agent={a}/>)}
        </div>
      </Frame>
      <Lede>The three agents above are the canonical mix for a Eidos demo: one PR reviewer (reads code), one runbook executor (takes action), one observer (watches cost). The catalog usually shows ten of each.</Lede>

      <SubHead meta="status states">Health roll-up</SubHead>
      <Frame label="status drives the badge in the header · degraded gets the pulse"
             code={`{ status: "up" }         // → "Up" badge
{ status: "degraded" }   // → "Degraded" badge, pulse
{ status: "down" }       // → "Down" badge`}>
        <div style={{display:'flex', flexDirection:'column', gap: 10, maxWidth: 460}}>
          <AgentCard agent={{ ...AGENTS[0], status: 'up' }}/>
          <AgentCard agent={{ ...AGENTS[1], status: 'degraded' }}/>
          <AgentCard agent={{ ...AGENTS[0], name: 'arch-drift-watcher', model: 'claude-sonnet-4.6', status: 'down', summary: 'Watches ADR drift across the fleet. Currently down — provider rate-limited.', capabilities: ['ADR drift','dependency scan'], calls: 412, successRate: 87, lastRun: new Date(now - 47 * 60_000) }}/>
        </div>
      </Frame>

      <SubHead meta="interactive · role=button">Open on click or keyboard</SubHead>
      <Lede>Pass <Mono>onOpen</Mono> and the tile becomes a single <Mono>role="button"</Mono> Tab stop that fires on click, <Mono>Enter</Mono>, and <Mono>Space</Mono> — the focus ring wraps the whole footprint, and the chips inside stay out of the tab order so a catalog tabs tile-to-tile. Try it: focus a tile and press <Mono>Enter</Mono>.</Lede>
      <Frame label="onOpen wires the tile · focus a card and press Enter / Space" code={OPEN_USAGE}>
        <OpenDemo/>
      </Frame>

      <SubHead meta="loading">Loading skeleton</SubHead>
      <Lede>While the catalog query is in flight, render a skeleton that mirrors the card's slots so nothing reflows when data resolves. The placeholder is <Mono>aria-hidden</Mono>; a single live <Mono>role="status"</Mono> region announces the load.</Lede>
      <Frame label="three skeleton tiles · same footprint as the loaded card"
             code={`{loading
  ? Array.from({ length: 3 }).map((_, i) => <AgentCardSkeleton key={i} />)
  : agents.map(a => <AgentCard key={a.name} agent={a} />)}`}>
        <div>
          <div className="ds-grid cols-3" aria-hidden="true">
            <AgentCardSkeleton/>
            <AgentCardSkeleton/>
            <AgentCardSkeleton/>
          </div>
          <div role="status" aria-live="polite" style={{ marginBlockStart: 16, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
            <Spinner size="sm"/> Loading agents…
          </div>
        </div>
      </Frame>

      <SubHead meta="empty">Empty catalog</SubHead>
      <Lede>No agents registered yet — show the <Mono>Empty</Mono> primitive with a single primary action rather than a bare grid, so the surface reads as intentional, not broken.</Lede>
      <Frame label="zero agents · the Empty primitive with one ember action"
             code={`{agents.length === 0
  ? <Empty iconName="bot" title="No agents yet" desc="…" action="Register an agent" />
  : agents.map(a => <AgentCard key={a.name} agent={a} />)}`}>
        <Empty
          iconName="bot"
          title="No agents registered"
          desc="Connect a model and define a capability set to publish your first agent to the catalog."
          action="Register an agent"
        />
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginBlockStart: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--fg)', marginBlockEnd: 10}}>Keyboard</div>
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-base)'}}>
            <tbody>
              <tr>
                <td style={{paddingBlock: 4, paddingInlineEnd: 14, whiteSpace: 'nowrap', verticalAlign: 'top'}}><Mono>Tab</Mono></td>
                <td style={{paddingBlock: 4, color: 'var(--fg-muted)', lineHeight: 1.55}}>Moves to the next interactive tile. The whole tile is one stop — chips inside are never separate stops.</td>
              </tr>
              <tr>
                <td style={{paddingBlock: 4, paddingInlineEnd: 14, whiteSpace: 'nowrap', verticalAlign: 'top'}}><Mono>Enter</Mono> / <Mono>Space</Mono></td>
                <td style={{paddingBlock: 4, color: 'var(--fg-muted)', lineHeight: 1.55}}>Fires <Mono>onOpen</Mono> — the same path as a pointer click. A card without <Mono>onOpen</Mono> stays out of the tab order.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--fg)', marginBlockEnd: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>An interactive tile exposes <Mono>role="button"</Mono> with an accessible name built from the agent name and status. The HealthBadge announces its state as text ("Degraded"), the model and capability chips read as a list, and <Mono>lastRun</Mono> renders through <Mono>{'<RelativeTime/>'}</Mono> with the absolute timestamp on the underlying <Mono>{'<time>'}</Mono>.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--fg)', marginBlockEnd: 6}}>Loading &amp; empty</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The skeleton tiles are <Mono>aria-hidden</Mono>; a single live <Mono>role="status"</Mono> region next to them announces "Loading agents…" so assistive tech hears the wait once, not three times. The empty state is the <Mono>Empty</Mono> primitive (also <Mono>role="status"</Mono>) with one labelled primary action — never a bare, silent grid.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--fg)', marginBlockEnd: 6}}>Status, not colour alone</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Up / degraded / down is carried by the HealthBadge label and dot, not the badge colour alone, so health survives greyscale. The only ember on the tile is the soft-tinted bot avatar — the ember glyph sits on an ember-soft fill, never ember-on-ember — and the model line, capability chips, summary and footer stats all meet AA against the card surface.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--fg)', marginBlockEnd: 6}}>Density &amp; reduced motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The interactive tile keeps a full visible focus ring around its whole footprint, kept above the minimum target. The card caps at five chips so it never overflows or reflows unpredictably, and both the degraded HealthBadge pulse and the skeleton shimmer are suppressed under <Mono>prefers-reduced-motion</Mono>.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — leading icon and chip row align to the inline-start (right) edge'>
        <div dir="rtl" style={{ maxWidth: 420 }}>
          <AgentCard agent={{
            ...AGENTS[0],
            name: 'مدقق-الكود',
            summary: 'يراجع طلبات السحب وفق الإرشادات وقائمة الأمان وموازنات الأداء.',
            capabilities: ['مراجعة PR', 'فحص أمني', 'أداء'],
          }}/>
        </div>
      </Frame>
      <Lede>
        The card uses logical CSS (<Mono>inline-start</Mono> / <Mono>inline-end</Mono>), so the bot avatar anchors to the right, the HealthBadge flips to the left, and the capability chip row wraps right-to-left — no extra CSS needed. Static glyphs (the agent icon) stay as-is; only directional layout mirrors.
      </Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 48px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', maxWidth: 420 }} aria-hidden="true">
              <AgentCard agent={AGENTS[0]}/>
              {/* pin 1 — bot avatar */}
              <span className="lead v" style={{ top: -26, left: 22, height: 22 }} />
              <div className="pin" style={{ top: -48, left: 22, transform: 'translateX(-50%)' }}>1</div>
              {/* pin 2 — name + model line */}
              <span className="lead v" style={{ top: -26, left: 100, height: 22 }} />
              <div className="pin" style={{ top: -48, left: 100, transform: 'translateX(-50%)' }}>2</div>
              {/* pin 3 — HealthBadge */}
              <span className="lead v" style={{ top: -26, right: 10, height: 22 }} />
              <div className="pin" style={{ top: -48, right: 10, transform: 'translateX(50%)' }}>3</div>
              {/* pin 4 — capability chips */}
              <span className="lead h" style={{ top: 82, right: -30, width: 24 }} />
              <div className="pin" style={{ top: 72, right: -52 }}>4</div>
              {/* pin 5 — run stats footer */}
              <span className="lead v" style={{ bottom: -26, left: '50%', height: 22 }} />
              <div className="pin" style={{ bottom: -48, left: '50%', transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Bot avatar.</b> Ember-soft pill with the <Mono>agent</Mono> glyph at 20px — anchors the card's identity and differentiates it from a service tile at a glance. Fixed; never replaced by a user photo.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Name + model line.</b> Agent name in Geist 600 at <Mono>--text-md</Mono>; model in <Mono>--text-xs</Mono> muted mono on the line below — "what is it, what powers it" in one scan. Keeping the model in the header keeps it out of the capability row.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>HealthBadge.</b> Up / Degraded / Down — label + dot, not colour alone. Degraded pulses (suppressed under <Mono>prefers-reduced-motion</Mono>). Always flush trailing in the header row.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Capability chips.</b> Neutral <Mono>chip</Mono> pills listing what the agent can do. Capped at 5 — beyond that the tile breaks rhythm; use the agent-detail page for the full list.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Run stats footer.</b> Calls (24h), success-rate %, and last-run relative time in <Mono>--text-xs</Mono> muted mono. Gives the on-call reader a trust signal without opening the detail view.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — keep the summary one sentence</div>
          <div className="body">
            <div style={{maxWidth: 320}}>
              <AgentCard agent={AGENTS[2]}/>
            </div>
          </div>
          <div className="note">"What does this agent do?" should fit in one line. Longer copy belongs on the agent-detail page, not in the catalog tile.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — list every capability</div>
          <div className="body">
            <div style={{maxWidth: 320}}>
              <AgentCard agent={{ ...AGENTS[0], capabilities: ['PR review','security scan','perf check','ADR drift','dependency scan','license audit','test coverage','complexity check'] }}/>
            </div>
          </div>
          <div className="note">The card caps at five chips on purpose. More than five and the tile breaks rhythm — pick the headline capabilities or use a dedicated agent-detail page.</div>
        </div>
      </div>

      <SubHead meta="AgentCardProps">API reference</SubHead>
      {/* Generated from the typed AgentCard props (scripts/gen-props.mjs) — can't drift from the component. */}
      <AutoPropsTable component="AgentCard" label="<AgentCard />"/>
      <PropsTable
        label="Agent shape"
        rows={[
          { prop: 'name', type: 'string', required: true, description: 'Unique agent identifier (mono-rendered).' },
          { prop: 'model', type: 'string', description: 'Underlying model name. Renders as a muted-mono line under the agent name.' },
          { prop: 'status', type: '"up" | "degraded" | "down" | "unknown"', description: 'Drives the <HealthBadge/> in the header.' },
          { prop: 'summary', type: 'string', description: 'One-line description.' },
          { prop: 'capabilities', type: 'string[]', description: 'Capability chips. Capped at 5 in the card.' },
          { prop: 'calls', type: 'number', description: 'Runs in the last 24h.' },
          { prop: 'successRate', type: 'number (0–100)', description: 'Success percentage over the same window.' },
          { prop: 'lastRun', type: 'Date | number | string', description: 'Last invocation. Rendered via <RelativeTime/>.' },
        ]}
      />
    </Section>
  );
}
