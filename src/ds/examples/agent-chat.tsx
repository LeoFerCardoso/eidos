'use client';
import * as React from 'react';
import { Avatar, Banner, DataTable, HealthBadge, Icons, MOCKS, Message, OwnerPill, RelativeTime, SeverityPill, Sparkline, StatusDot, TierBadge, Trend } from '@/ds/core';
import { FKpi, FPageHeader, FSection, FShell, useQueryParam } from './example-shell';
// Eidos IDP — Example: Eidos Agent · ChatGPT-in-the-platform drawer.
//
// Pattern: the product is visible at left (a real page — service detail), and
// the right-side Drawer is the agent surface. The agent can read context from
// the page, call tools, propose actions on the platform itself, cite ADRs,
// stream code, and open PRs. Inspired by Linear AI, Cursor, Copilot Chat.
//
// All composed from existing DS primitives — Avatar, Message, Pill, Card, btn,
// Sparkline, HealthBadge, OwnerPill, StatusDot — no new visual primitives.

  
  
  
  
  
  const PEOPLE = MOCKS.PEOPLE || [];
  const SERVICES = MOCKS.SERVICES || [];

  const me = PEOPLE.find(p => p.initials === 'LM') || PEOPLE[0];
  const pixRouter = SERVICES.find(s => s.name === 'pix-router');

  // ---------- Conversation turns ----------
  // Each turn is rendered manually so we can drop in custom tool calls / cards.
  const TURNS = [
    {
      kind: 'agent-hello',
      content: (
        <div>
          <div style={{fontSize: 'var(--text-base)', marginBottom: 6, fontWeight: 600}}>Hi Leonardo — I&apos;m caught up.</div>
          <div style={{color:'var(--fg-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6}}>
            I&apos;ve read the last 7 days of <span className="mono">pix-router</span> activity, its ADRs, dependent
            services, recent PRs, and the last 3 incidents. Ask me anything — I can also propose actions on Eidos.
          </div>
          <div style={{display:'flex', gap: 6, flexWrap:'wrap', marginTop: 12}}>
            <button className="chip" style={{fontSize: 'var(--text-xs)', cursor:'pointer'}}>Why is p95 climbing?</button>
            <button className="chip" style={{fontSize: 'var(--text-xs)', cursor:'pointer'}}>Open PR to add circuit breaker</button>
            <button className="chip" style={{fontSize: 'var(--text-xs)', cursor:'pointer'}}>Compare to ledger-svc</button>
          </div>
        </div>
      ),
    },
    {
      kind: 'user',
      person: me,
      content: 'Why is pix-router p95 climbing again? Last 7 days.',
    },
    {
      kind: 'agent-thinking',
      duration: '1.8s',
      steps: [
        'Reading pix-router telemetry · last 168h',
        'Diff vs. prior 7d baseline',
        'Correlating with deploys + flag rollouts',
        'Looking up ADRs that govern dependencies',
      ],
    },
    {
      kind: 'tool',
      name: 'observability.read',
      args: { service: 'pix-router', window: '7d', metric: 'p95_latency' },
      result: '2,016 datapoints · 1 anomaly window detected',
    },
    {
      kind: 'agent',
      content: (
        <div>
          <p style={{margin: 0, marginBottom: 10, fontSize: 'var(--text-base)', lineHeight: 1.6}}>
            Two drivers, ranked by impact:
          </p>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-2xl)',
            padding: 12,
            marginBottom: 10,
          }}>
            <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 8}}>
              <SeverityPill level="p1"/>
              <strong style={{fontSize: 'var(--text-sm)'}}>Sync coupling to bureau-gateway</strong>
            </div>
            <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.55, marginBottom: 8}}>
              PR <span className="mono" style={{color:'var(--ember)'}}>#7421</span> introduced
              a synchronous call inside <span className="mono">PixOrchestrator.dispatch</span>.
              Under peak load this adds ~80ms p95. Violates ADR-006 (async-first).
            </div>
            <div style={{display:'flex', gap: 12, fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>
              <span><Icons.calendar size={11}/> introduced 4 days ago</span>
              <span><Icons.user size={11}/> Rafael Mendonça</span>
            </div>
          </div>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-2xl)',
            padding: 12,
            marginBottom: 10,
          }}>
            <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 8}}>
              <SeverityPill level="p2"/>
              <strong style={{fontSize: 'var(--text-sm)'}}>ml-feature-store cache miss spike</strong>
            </div>
            <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.55}}>
              Hit rate dropped from 94% to 71% after the merchant nightly job started writing
              at 02:00 BRT. Correlates with <span className="mono">data-export</span> egress spike.
            </div>
          </div>
          <p style={{margin: 0, fontSize: 'var(--text-base)', lineHeight: 1.6}}>
            I can open a PR that wraps the sync call with a circuit breaker (matching
            <span className="mono" style={{color:'var(--ember)'}}> ledger-svc</span>&apos;s pattern). Want me to draft it?
          </p>
        </div>
      ),
      citations: [
        { id: 'c1', label: 'ADR-006 · Async-first inter-tribe communication', meta: '2025-04-30' },
        { id: 'c2', label: 'PR #7421 · idempotency keys for retries', meta: '12m ago' },
        { id: 'c3', label: 'Incident IR-2026-0118 · pix-router degradation', meta: '3d ago' },
      ],
    },
    {
      kind: 'user',
      person: me,
      content: 'Yes, draft the PR. Match ledger-svc\'s breaker. Target Ring 1 first.',
    },
    {
      kind: 'agent-thinking',
      duration: '3.2s',
      steps: [
        'Cloning go-grpc-svc breaker pattern from ledger-svc',
        'Generating patch for PixOrchestrator.dispatch',
        'Writing tests covering both happy and tripped paths',
        'Computing change risk score',
      ],
    },
    {
      kind: 'tool',
      name: 'eidos.openPR',
      args: { service: 'pix-router', base: 'main', target: 'Ring 1', author: 'eidos-agent' },
      result: 'PR #7424 drafted — 4 files changed, +186 / -22',
    },
    {
      kind: 'agent',
      content: (
        <div>
          <p style={{margin: 0, marginBottom: 12, fontSize: 'var(--text-base)', lineHeight: 1.6}}>
            Draft PR <strong>#7424</strong> is ready in your branch. I matched the
            <span className="mono" style={{color:'var(--ember)'}}> ledger-svc </span>
            breaker pattern (gobreaker, 5/30s/1.5x) and added 4 test cases.
          </p>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: 0,
            marginBottom: 10,
            overflow:'hidden',
          }}>
            <div style={{padding: '10px 12px', borderBottom: '1px solid var(--border)', display:'flex', alignItems:'center', gap: 10}}>
              <Icons.gitPullRequest size={14} style={{color:'var(--ember)'}}/>
              <strong style={{fontSize: 'var(--text-sm)'}}>PR #7424 — feat(pix-router): circuit breaker for bureau-gateway sync</strong>
            </div>
            <div style={{padding: 12, fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', lineHeight: 1.55}}>
              <div style={{color:'var(--success)'}}>+ import &quot;github.com/sony/gobreaker&quot;</div>
              <div style={{color:'var(--success)'}}>+ var bureauBreaker = gobreaker.NewCircuitBreaker(...)</div>
              <div style={{color:'var(--success)'}}>+ result, err := bureauBreaker.Execute(func() ...)</div>
              <div style={{color:'var(--danger)'}}>- result, err := bureauClient.Dispatch(ctx, req)</div>
              <div style={{color:'var(--fg-muted)', marginTop: 6}}>... +180 lines hidden, 4 files</div>
            </div>
            <div style={{
              padding: 10,
              borderTop:'1px solid var(--border)',
              display:'flex', gap: 8, alignItems:'center',
              background: 'color-mix(in oklch, var(--success) 6%, transparent)',
            }}>
              <Icons.shield size={13} style={{color:'var(--success)'}}/>
              <span style={{fontSize: 'var(--text-xs)'}}><strong>Change Risk Score 32 / 100</strong> — Low.</span>
              <span style={{marginInlineStart:'auto', fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>
                Coverage delta <span className="mono">+1.4%</span> · Blast <span className="mono">Ring 0→1</span>
              </span>
            </div>
          </div>
          <div style={{display:'flex', gap: 8, flexWrap:'wrap'}}>
            <button className="btn primary" style={{fontSize: 'var(--text-xs)'}}>
              <Icons.eye size={11}/> Open PR
            </button>
            <button className="btn ghost" style={{fontSize: 'var(--text-xs)'}}>
              <Icons.gitFork size={11}/> View diff
            </button>
            <button className="btn ghost" style={{fontSize: 'var(--text-xs)'}}>
              <Icons.sparkle size={11}/> Improve tests
            </button>
          </div>
        </div>
      ),
      citations: [
        { id: 'c4', label: 'ledger-svc/pkg/breaker · canonical pattern', meta: 'reference' },
        { id: 'c5', label: 'gobreaker · v0.5.0', meta: 'external' },
      ],
    },
  ];

  // ---------- Conversation rendering helpers ----------
  const ChatBubble = ({ children }) => (
    <div style={{
      padding: '12px 14px',
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-2xl)',
      borderTopRightRadius: 4,
      fontSize: 'var(--text-base)',
      lineHeight: 1.55,
    }}>{children}</div>
  );

  const Citations = ({ items }) => (
    <div style={{
      marginTop: 8,
      paddingTop: 10,
      borderTop: '1px solid var(--border)',
      display:'flex', flexDirection:'column', gap: 6,
    }}>
      <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)', fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.06em'}}>
        Sources
      </div>
      {items.map((c, i) => (
        <div key={c.id} style={{display:'flex', alignItems:'center', gap: 8, fontSize: 'var(--text-xs)'}}>
          <span className="mono" style={{
            display:'inline-flex',
            width: 18, height: 18,
            alignItems:'center', justifyContent:'center',
            background:'var(--surface-active)',
            borderRadius: 'var(--radius-lg)',
            color:'var(--fg-muted)',
            fontSize: 'var(--text-xs)',
          }}>{i + 1}</span>
          <span style={{flex:1, color:'var(--fg)'}}>{c.label}</span>
          <span style={{color:'var(--fg-faint)', fontSize: 'var(--text-xs)'}}>{c.meta}</span>
        </div>
      ))}
    </div>
  );

  const ThinkingTurn = ({ steps, duration }) => (
    <div style={{
      padding: 12,
      border: '1px dashed var(--border)',
      borderRadius: 'var(--radius-xl)',
      background: 'color-mix(in oklch, var(--ember) 4%, transparent)',
    }}>
      <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 8}}>
        <Icons.sparkle size={12} style={{color:'var(--ember)'}}/>
        <span style={{fontSize: 'var(--text-xs)', fontFamily:'var(--font-mono)', color:'var(--fg-muted)', textTransform:'uppercase', letterSpacing:'0.06em'}}>
          Thinking · {duration}
        </span>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap: 4}}>
        {steps.map((s, i) => (
          <div key={i} style={{display:'flex', alignItems:'center', gap: 8, fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>
            <Icons.check size={11} style={{color:'var(--success)'}}/>
            {s}
          </div>
        ))}
      </div>
    </div>
  );

  const ToolTurn = ({ name, args, result }) => (
    <div style={{
      padding: 12,
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      background: 'var(--surface)',
      fontFamily:'var(--font-mono)',
      fontSize: 'var(--text-xs)',
    }}>
      <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 8}}>
        <Icons.terminal size={12} style={{color:'var(--ember)'}}/>
        <span style={{color:'var(--ember)'}}>{name}()</span>
        <span className="pill status-done" style={{marginInlineStart:'auto'}}>
          <StatusDot tone="done" size="sm"/>OK
        </span>
      </div>
      <pre style={{margin: 0, color:'var(--fg-muted)', fontSize: 'var(--text-xs)', lineHeight: 1.5, whiteSpace:'pre-wrap'}}>
{`args = ${JSON.stringify(args, null, 2)}
─────────
${result}`}
      </pre>
    </div>
  );

  // ---------- Backdrop product view (the "page" the agent is helping with) ----------
  const ProductView = () => (
    <div>
      <FPageHeader
        eyebrow="Catalog / Pix tribe"
        title="pix-router"
        status={
          <>
            <TierBadge tier="T1"/>
            <HealthBadge state="degraded" pulse/>
          </>
        }
        subtitle="Pix routing service for inter-bank transfers. Owned by the Pix tribe."
        meta={
          <>
            <span className="chip">v2.6.10</span>
            <span className="chip">Go</span>
            <span className="chip ok">p95 142ms</span>
            <span className="chip">deployed 14m ago</span>
          </>
        }
        actions={
          <>
            <button className="btn ghost"><Icons.eye size={13}/> Watch</button>
            <button className="btn ghost"><Icons.bell size={13}/> Subscribe</button>
            <button className="btn ember"><Icons.deploy size={13}/> Deploy</button>
          </>
        }/>

      <Banner
        tone="warning"
        icon="alert"
        title="p95 latency is trending up"
        message="Last 7 days +28%. Eidos agent has a hypothesis — open the drawer to discuss."
        action="Ask Eidos"/>

      <div className="fp-grid fp-grid-4" style={{marginTop: 18}}>
        <FKpi label="p95 latency" value="142ms"
          sub={<Sparkline data={[88, 92, 98, 110, 122, 134, 142]} w={200} h={32} color="var(--warning)"/>}
          trendNode={<Trend delta={28} unit="%" inverted/>}/>
        <FKpi label="Error rate" value="0.04%"
          sub={<Sparkline data={[0.06, 0.05, 0.04, 0.04, 0.05, 0.04, 0.04]} w={200} h={32} color="var(--success)"/>}
          trendNode={<Trend delta={-1} unit="bp" inverted/>}/>
        <FKpi label="Throughput" value="2.4k/s"
          sub={<Sparkline data={[1.8, 2.0, 2.1, 2.2, 2.3, 2.4, 2.4]} w={200} h={32}/>}
          trendNode={<Trend delta={32} unit="%"/>}/>
        <FKpi label="Coverage" value="78.2%"
          sub={<Sparkline data={[74, 75, 76, 76, 77, 78, 78]} w={200} h={32} color="var(--success)"/>}
          trendNode={<Trend delta={4} unit="pp"/>}/>
      </div>

      <div className="fp-card" style={{marginTop: 18}}>
        <div className="fp-card-head">
          <div>
            <div className="fp-card-title">Dependencies</div>
            <div className="fp-card-sub">Outgoing calls observed in the last 24h</div>
          </div>
          <HealthBadge state="degraded"/>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap: 8}}>
          {['ledger-svc', 'bureau-gateway', 'event-bus'].map((dep) => (
            <div key={dep} style={{
              display:'flex', alignItems:'center', gap: 10,
              padding:'10px 12px',
              border:'1px solid var(--border)',
              borderRadius: 'var(--radius-2xl)',
              background: 'var(--bg-elevated)',
            }}>
              <Icons.server size={13} style={{color:'var(--fg-muted)'}}/>
              <span className="mono" style={{fontWeight: 600, fontSize: 'var(--text-sm)'}}>{dep}</span>
              {dep === 'bureau-gateway' && (
                <span className="pill severity-p1" style={{marginInlineStart: 8}}>
                  <Icons.alert size={10}/> Sync coupling
                </span>
              )}
              <span style={{marginInlineStart:'auto', fontSize: 'var(--text-xs)', color:'var(--fg-muted)', fontFamily:'var(--font-mono)'}}>
                {dep === 'ledger-svc' && '~140 req/s · async'}
                {dep === 'bureau-gateway' && '~120 req/s · sync · +80ms p95'}
                {dep === 'event-bus' && '~2.1k msg/s · async'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ---------- Drawer ----------
  const AgentDrawer = ({ onClose }) => {
    const [input, setInput] = React.useState('');
    return (
      <aside style={{
        position:'fixed',
        insetInlineEnd: 0,
        insetBlock: 0,
        width: 480,
        background:'var(--bg-elevated)',
        borderInlineStart:'1px solid var(--border)',
        boxShadow:'var(--elev-3)',
        display:'flex',
        flexDirection:'column',
        zIndex: 100,
      }}>
        {/* Drawer head */}
        <div style={{
          padding: '14px 16px',
          borderBottom:'1px solid var(--border)',
          display:'flex', alignItems:'center', gap: 12,
        }}>
          <span style={{
            width: 32, height: 32, borderRadius: 'var(--radius-2xl)',
            background: 'color-mix(in oklch, var(--ember) 22%, transparent)',
            color:'var(--ember)',
            display:'inline-flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icons.sparkle size={14}/>
          </span>
          <div style={{flex:1, minWidth: 0}}>
            <div style={{fontWeight: 600, fontSize: 'var(--text-base)'}}>Eidos agent</div>
            <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)', display:'flex', alignItems:'center', gap: 6}}>
              <StatusDot tone="done" size="sm" pulse/>
              <span>Reading <span className="mono">pix-router</span> context</span>
            </div>
          </div>
          <button className="fp-topbar-icon" title="History" aria-label="History">
            <Icons.clock size={14}/>
          </button>
          <button className="fp-topbar-icon" title="New chat" aria-label="New chat">
            <Icons.plus size={14}/>
          </button>
          <button className="fp-topbar-icon" title="Close" aria-label="Close" onClick={onClose}>
            <Icons.x size={14}/>
          </button>
        </div>

        {/* Context strip — what the agent sees */}
        <div style={{
          padding: '10px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          fontSize: 'var(--text-xs)',
          color: 'var(--fg-muted)',
          display:'flex', alignItems:'center', gap: 8, flexWrap:'wrap',
        }}>
          <Icons.eye size={11}/>
          <span>Context · </span>
          <span className="chip mono" style={{fontSize: 'var(--text-xs)'}}>service: pix-router</span>
          <span className="chip mono" style={{fontSize: 'var(--text-xs)'}}>last 7d</span>
          <span className="chip mono" style={{fontSize: 'var(--text-xs)'}}>ADRs: 3</span>
          <span className="chip mono" style={{fontSize: 'var(--text-xs)'}}>PRs: 12</span>
        </div>

        {/* Drawer body */}
        <div style={{flex:1, overflowY:'auto', padding: 16, display:'flex', flexDirection:'column', gap: 14}}>
          {TURNS.map((t, i) => {
            if (t.kind === 'agent-hello' || t.kind === 'agent') {
              return (
                <div key={i} style={{display:'flex', gap: 10, alignItems:'flex-start'}}>
                  <span style={{
                    width: 26, height: 26, borderRadius: 'var(--radius-xl)',
                    background: 'color-mix(in oklch, var(--ember) 22%, transparent)',
                    color:'var(--ember)',
                    display:'inline-flex', alignItems:'center', justifyContent:'center',
                    flexShrink: 0,
                  }}>
                    <Icons.sparkle size={12}/>
                  </span>
                  <div style={{flex:1, minWidth: 0}}>
                    <div style={{
                      padding: '12px 14px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-2xl)',
                      borderTopLeftRadius: 4,
                    }}>
                      {t.content}
                    </div>
                    {t.citations && <Citations items={t.citations}/>}
                  </div>
                </div>
              );
            }
            if (t.kind === 'user') {
              return (
                <div key={i} style={{display:'flex', gap: 10, alignItems:'flex-start', justifyContent:'flex-end'}}>
                  <div style={{maxWidth:'80%'}}>
                    <ChatBubble>{t.content}</ChatBubble>
                  </div>
                  <Avatar p={t.person}/>
                </div>
              );
            }
            if (t.kind === 'agent-thinking') {
              return <div key={i} style={{marginInlineStart: 36}}><ThinkingTurn steps={t.steps} duration={t.duration}/></div>;
            }
            if (t.kind === 'tool') {
              return <div key={i} style={{marginInlineStart: 36}}><ToolTurn name={t.name} args={t.args} result={t.result}/></div>;
            }
            return null;
          })}
        </div>

        {/* Drawer foot — composer */}
        <div style={{padding: 12, borderTop:'1px solid var(--border)', background: 'var(--bg-elevated)'}}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-2xl)',
            padding: 10,
          }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Eidos anything about pix-router, or propose an action…"
              style={{
                width: '100%',
                minHeight: 56,
                resize: 'none',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'var(--fg)',
                fontFamily: 'inherit',
                fontSize: 'var(--text-base)',
                lineHeight: 1.5,
              }}
            />
            <div style={{display:'flex', alignItems:'center', gap: 6, marginTop: 6}}>
              <button className="fp-topbar-icon" title="Attach" aria-label="Attach"><Icons.paperclip size={12}/></button>
              <button className="fp-topbar-icon" title="Slash command" aria-label="Slash command"><Icons.terminal size={12}/></button>
              <span className="chip mono" style={{fontSize: 'var(--text-xs)'}}>@service</span>
              <span className="chip mono" style={{fontSize: 'var(--text-xs)'}}>/ADR</span>
              <button className="btn primary" style={{marginInlineStart:'auto', fontSize: 'var(--text-xs)'}}>
                <Icons.arrowRight size={11}/> Send
              </button>
            </div>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', marginTop: 8, fontSize: 'var(--text-xs)', color:'var(--fg-faint)', fontFamily:'var(--font-mono)'}}>
            <span>Eidos agent · GPT-5 · grounded in pix-router</span>
            <span>⌘↵ to send</span>
          </div>
        </div>
      </aside>
    );
  };

  // ---------- App ----------
  const App = () => {
    const [drawerOpen, setDrawerOpen] = React.useState(true);
    // Optional ?agent= / ?service= from a deep link. We don't reshape the
    // mock conversation — the drawer is canonical pix-router — but we do
    // reflect the source in the crumb + subNav so the back-trip is honest.
    const q = useQueryParam ? useQueryParam() : () => null;
    const agentId = q('agent');
    const serviceId = q('service');
    const cameFromAgentCatalog = !!agentId;
    return (
      <FShell
        nav={cameFromAgentCatalog ? 'agents' : 'services'}
        crumbs={
          cameFromAgentCatalog
            ? [
                { label: 'Eidos', href: '/example/ai-insights' },
                { label: 'Agents', href: '/example/agent-catalog' },
                agentId || 'pr-reviewer',
                'pix-router',
              ]
            : [
                { label: 'Eidos', href: '/example/ai-insights' },
                { label: 'Services', href: '/example/service-catalog' },
                { label: 'pix-router', href: '/example/service-detail?id=' + (serviceId || 'pix-router') },
                'Eidos agent',
              ]
        }
        onAgentChat={() => setDrawerOpen(true)}>
        <div style={{paddingInlineEnd: drawerOpen ? 'var(--fp-drawer-width, 460px)' : 0, transition:'padding 200ms ease'}}>
          <ProductView/>
        </div>
        {drawerOpen && <AgentDrawer onClose={() => setDrawerOpen(false)}/>}
      </FShell>
    );
  };

  
  export default App;
