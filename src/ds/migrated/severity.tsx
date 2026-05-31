'use client';
// Eidos DS — Foundations / Severity (semantic state vocabulary)
// Sibling of color.jsx — color defines WHAT the tokens are, this page
// defines WHEN to reach for severity vs status vs health vs risk.
// Critical for an IDP because every product surface combines two or
// three of these in the same view (a Down service + a Running deploy
// + a P0 incident + a High-risk PR all on one page).
import { Section, SubHead, Frame, Icons, Lede, Mono } from '@/ds/core';

const DecisionRow = ({ when, pick, why }) => (
  <tr>
    <td style={{padding:'12px 14px', borderBottom:'1px solid var(--border)', fontSize: 'var(--text-base)', color:'var(--fg)'}}>{when}</td>
    <td style={{padding:'12px 14px', borderBottom:'1px solid var(--border)'}}>{pick}</td>
    <td style={{padding:'12px 14px', borderBottom:'1px solid var(--border)', fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.55}}>{why}</td>
  </tr>
);

export default function Severity() {
  return (
    <Section id="severity" num="09" title="Severity & state" desc="Four distinct token families for an IDP: severity (event triage), run status (step progress), service health, and change risk. Each answers a different question — they never share a palette.">
      <Lede>
        The brand palette (<Mono>--ember</Mono>, <Mono>--success</Mono>, <Mono>--danger</Mono>, …) says what something <em>feels like</em>. For a Developer Experience platform we also need to say what something <em>is</em>: an incident, a run step, a service's health, a change's risk. This page is the decision tree — pick the token family that matches the <em>semantic role</em>, never the closest hex.
      </Lede>

      {/* The four families at a glance */}
      <SubHead meta="four roles · platform layer">The four families</SubHead>
      <div className="ds-grid cols-2" style={{marginBottom: 28}}>
        {[
          ['Severity', '--severity-p0 .. p3', 'Classifies an EVENT.', 'Incidents, alerts, support tickets — anything that needs triage and might page someone.', 'severity-p1'],
          ['Status',   '--status-{pending,running,done,error,skipped}', 'Classifies a STEP.', 'Pipeline nodes, agent tool calls, workflow tasks, ring deploys — anything that progresses.', 'status-running'],
          ['Health',   '--health-{up,degraded,down,unknown}', 'Classifies an ENTITY.', 'Services, dependencies, MCP servers — anything that exists continuously and has uptime.', 'health-degraded'],
          ['Risk',     '--risk-{low,med,high,crit}', 'Classifies a CHANGE.', 'Change Risk Score on a PR, Quality Gate decision on a deploy, blast radius on a flag rollout.', 'risk-high'],
        ].map(([fam, tok, role, use, pillCls]) => (
          <div key={fam} className="surface" style={{padding: 16}}>
            <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 8}}>
              <span className={`pill ${pillCls}`} style={{minWidth: 0}}><span className="dot"/> {fam}</span>
              <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>{tok}</span>
            </div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg)', fontWeight: 500, marginBottom: 4}}>{role}</div>
            <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.55}}>{use}</div>
          </div>
        ))}
      </div>

      {/* Decision matrix */}
      <SubHead meta="when to pick which">Decision matrix</SubHead>
      <Lede up>
        Every screen in the platform layer mixes these. Use the matrix to keep them coherent — a service can be Down (health), without being a P0 (severity), and trigger a Running rollout (status) for a High-risk change (risk) at the same time.
      </Lede>
      <div style={{background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow:'hidden'}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize: 'var(--text-base)'}}>
          <thead>
            <tr style={{background:'var(--bg-elevated)'}}>
              <th style={{textAlign:'start', padding:'10px 14px', fontSize: 'var(--text-xs)', fontFamily:'var(--font-mono)', color:'var(--fg-subtle)', letterSpacing:'.06em', textTransform:'uppercase', borderBottom:'1px solid var(--border)'}}>When the thing is…</th>
              <th style={{textAlign:'start', padding:'10px 14px', fontSize: 'var(--text-xs)', fontFamily:'var(--font-mono)', color:'var(--fg-subtle)', letterSpacing:'.06em', textTransform:'uppercase', borderBottom:'1px solid var(--border)'}}>Reach for</th>
              <th style={{textAlign:'start', padding:'10px 14px', fontSize: 'var(--text-xs)', fontFamily:'var(--font-mono)', color:'var(--fg-subtle)', letterSpacing:'.06em', textTransform:'uppercase', borderBottom:'1px solid var(--border)'}}>Why this family</th>
            </tr>
          </thead>
          <tbody>
            <DecisionRow when="A failure that paged on-call." pick={<span className="pill severity-p0"><span className="dot"/> P0</span>} why="The screen needs to communicate urgency. Severity carries the deeper-than-danger red." />
            <DecisionRow when="A deploy step that's actively executing." pick={<span className="pill status-running"><span className="dot"/> Running</span>} why="The thing is mid-progress. Status colors are tied to motion (blue), not to mood." />
            <DecisionRow when="A service whose health checks are flapping." pick={<span className="pill health-degraded"><Icons.alert size={10}/> Degraded</span>} why="An entity, not an event. Health expresses 'this thing is partially OK over time'." />
            <DecisionRow when="A PR that touches the auth service + a payments migration." pick={<span className="pill risk-high">High</span>} why="A change's risk surface — gradates green→red so the Change Risk Score gauge can interpolate." />
            <DecisionRow when="A scheduled maintenance window — informational." pick={<span className="pill severity-p3"><span className="dot"/> P3</span>} why="Still an event, just the lowest tier. Don't reach for --info or --muted — keep the family consistent." />
            <DecisionRow when="A workflow node the user intentionally skipped." pick={<span className="pill status-skipped"><span className="dot"/> Skipped</span>} why="Same vocabulary as Done/Error so a workflow view stays readable across all step shapes." />
            <DecisionRow when="An MCP server we can't reach to verify state." pick={<span className="pill health-unknown">— Unknown</span>} why="Health, not status — the entity exists, we just don't have current data on it." />
            <DecisionRow when="A flag that, when flipped, hits 100% of paying users." pick={<span className="pill risk-crit">Critical</span>} why="Risk reads blast radius, not failure. A flag can be Critical-risk without ever failing." />
          </tbody>
        </table>
      </div>

      {/* Severity in depth */}
      <SubHead meta="P0 → P3">Severity in depth</SubHead>
      <Frame label="incident.io / PagerDuty conventions, mapped to Eidos tokens">
        <div style={{display:'flex', flexDirection:'column', gap: 12, width:'100%'}}>
          {[
            ['P0', 'severity-p0', '--severity-p0', '#FB5252', '#B91C1C', 'CRITICAL', 'Outage, data loss, security incident. Pages on-call regardless of business hours. Examples: eidos-api 5xx > 50%, customer-data leaked, prod database unreachable.'],
            ['P1', 'severity-p1', '--severity-p1', '#FB923C', '#EA580C', 'HIGH',     'SLO burning, degraded service. Working-hours response. Examples: p99 latency 3× target, a region degraded, a payment provider failing for one card type.'],
            ['P2', 'severity-p2', '--severity-p2', '#FBBF24', '#EAB308', 'MEDIUM',   'Partial impact with a workaround. Ticket queue. Examples: stale cache for 1 customer cohort, intermittent UI bug, slow background job.'],
            ['P3', 'severity-p3', '--severity-p3', '#7DD3FC', '#0EA5E9', 'LOW',      'Informational, cosmetic, scheduled. No SLA. Examples: scheduled maintenance, deprecation reminder, copy typo.'],
          ].map(([code, cls, tok, darkHex, lightHex, label, desc]) => (
            <div key={code} style={{display:'flex', alignItems:'stretch', gap: 14, background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow:'hidden'}}>
              <div style={{width: 56, background: `var(${tok})`, color:`var(${tok}-ink)`, fontWeight: 700, fontSize: 'var(--text-xl)', fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums', display:'flex', alignItems:'center', justifyContent:'center', letterSpacing:'.02em'}}>{code}</div>
              <div style={{padding:'12px 14px 12px 0', flex: 1, minWidth: 0}}>
                <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 6, flexWrap:'wrap'}}>
                  <span className={`pill ${cls}`}>{label}</span>
                  <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>{tok}</span>
                  <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-faint)'}}>dark · {darkHex} &nbsp;·&nbsp; light · {lightHex}</span>
                </div>
                <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55}}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
      <p className="ds-caption">Severity is luminance-tuned per theme — dark mode uses bright red <Mono>#FB5252</Mono> so P0 reads as critical against the deep surface, light mode drops to <Mono>#B91C1C</Mono> so it stays AA-readable on white.</p>

      {/* Status in depth */}
      <SubHead meta="five states">Run status</SubHead>
      <Frame label="step state — used by pipelines, workflows, agent runs, ring deploys">
        <div style={{display:'flex', flexDirection:'column', gap: 0, width:'100%'}}>
          {[
            ['Pending', 'status-pending', 'Step is queued, hasn\'t started yet.'],
            ['Running', 'status-running', 'Actively executing — pair with a Spinner or pulsing dot.'],
            ['Done',    'status-done',    'Finished successfully. Steady state.'],
            ['Error',   'status-error',   'Finished with a failure. Always paired with a retry / view-log action.'],
            ['Skipped', 'status-skipped', 'Explicitly bypassed — branch condition, feature flag, user action.'],
          ].map(([label, cls, desc], i, a) => (
            <div key={label} style={{display:'flex', alignItems:'center', gap: 14, padding:'12px 14px', borderBottom: i < a.length - 1 ? '1px solid var(--border)' : 'none'}}>
              <span className={`pill ${cls}`} style={{minWidth: 92, justifyContent:'center'}}><span className="dot"/> {label}</span>
              <span style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55}}>{desc}</span>
            </div>
          ))}
        </div>
      </Frame>

      {/* Health in depth */}
      <SubHead meta="four states">Service health</SubHead>
      <Frame label="health — used by Service Catalog, Score Cards, Dependency Graph">
        <div style={{display:'flex', flexDirection:'column', gap: 0, width:'100%'}}>
          {[
            ['Up',        'health-up',        <Icons.check size={10}/>, 'All health checks passing; SLO within budget.'],
            ['Degraded',  'health-degraded',  <Icons.alert size={10}/>, 'Partial failures, SLO burning, or 1-of-N replicas unhealthy.'],
            ['Down',      'health-down',      <Icons.x size={10}/>,     'All health checks failing or service is fully unreachable.'],
            ['Unknown',   'health-unknown',   null,                     'No recent telemetry — heartbeat lost, monitoring offline, or never observed.'],
          ].map(([label, cls, icon, desc], i, a) => (
            <div key={label as string} style={{display:'flex', alignItems:'center', gap: 14, padding:'12px 14px', borderBottom: i < a.length - 1 ? '1px solid var(--border)' : 'none'}}>
              <span className={`pill ${cls}`} style={{minWidth: 110, justifyContent:'center'}}>{icon} {label}</span>
              <span style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55}}>{desc}</span>
            </div>
          ))}
        </div>
      </Frame>
      <p className="ds-caption">Health is about <em>continuous existence</em>. If something either runs or doesn't (a one-shot job, a test), reach for <b style={{color:'var(--fg)'}}>Status</b> instead.</p>

      {/* Risk in depth */}
      <SubHead meta="change risk · quality gate">Risk</SubHead>
      <Frame label="risk classification — used by CRS on PRs and Quality Gate on deploys">
        <div style={{display:'flex', flexDirection:'column', gap: 0, width:'100%'}}>
          {[
            ['Low',      'risk-low',  '< 30',  'Single non-critical service, tests green, low blast radius.'],
            ['Medium',   'risk-med',  '30–60', 'One shared service, schema changes, or merges around a freeze window.'],
            ['High',     'risk-high', '60–85', 'Auth, payments, or data-migration paths. Cross-team review required.'],
            ['Critical', 'risk-crit', '> 85',  'Customer-facing breaking changes, multi-service migration, regulated workload. Manual approval mandatory.'],
          ].map(([label, cls, range, desc], i, a) => (
            <div key={label} style={{display:'flex', alignItems:'center', gap: 14, padding:'12px 14px', borderBottom: i < a.length - 1 ? '1px solid var(--border)' : 'none'}}>
              <span className={`pill ${cls}`} style={{minWidth: 92, justifyContent:'center'}}>{label}</span>
              <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-muted)', minWidth: 60, fontVariantNumeric:'tabular-nums'}}>{range}</span>
              <span style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55}}>{desc}</span>
            </div>
          ))}
        </div>
      </Frame>

      {/* Composition — all four families in one row */}
      <SubHead meta="composition">All four together</SubHead>
      <Lede up>
        A real Eidos view: a service row that uses all four families at once. Read left-to-right — the catalog tells you what the service <em>is</em> (health), the row's badge tells you about the active <em>event</em> (severity), the deploy strip shows where the latest <em>change</em> is (status), and the right column scores the next <em>change</em>'s risk.
      </Lede>
      <Frame label="eidos-api in the catalog — four token families in one row">
        <div style={{display:'flex', flexDirection:'column', gap: 10, width:'100%'}}>
          <div style={{display:'grid', gridTemplateColumns:'200px 1fr 1fr 1fr', gap: 12, padding:'12px 14px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', alignItems:'center'}}>
            <div>
              <div style={{fontSize: 'var(--text-md)', fontWeight: 600, color:'var(--fg)', marginBottom: 4}}>eidos-api</div>
              <span className="pill health-up"><Icons.check size={10}/> Up</span>
            </div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)'}}>
              <div style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', marginBottom: 4, letterSpacing:'.08em', textTransform:'uppercase'}}>Active incident</div>
              <span className="pill severity-p3"><span className="dot"/> P3</span>
            </div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)'}}>
              <div style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', marginBottom: 4, letterSpacing:'.08em', textTransform:'uppercase'}}>Latest deploy</div>
              <span className="pill status-running"><span className="dot"/> Running · canary 25%</span>
            </div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)'}}>
              <div style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', marginBottom: 4, letterSpacing:'.08em', textTransform:'uppercase'}}>Next change · CRS 72</div>
              <span className="pill risk-high">High</span>
            </div>
          </div>
        </div>
      </Frame>
      <p className="ds-caption">No two token families overlap visually. The four reads as four facts about one service, not as four ways of saying "warning".</p>

      {/* Accessibility & pairings */}
      <SubHead meta="a11y">Accessibility &amp; pairings</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Never colour alone</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Every family pairs its colour with a word and, where it helps, an icon or shape — P0 reads as &quot;P0&quot;, not just red. A red-green colour-blind operator must still tell a down service from a healthy one without seeing the hue.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Contrast (AA)</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Each family&apos;s text-on-fill pairing meets AA (4.5:1) in dark and light. On a solid danger or warning fill the foreground is dark or light ink, never the family&apos;s own hue laid on itself.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Live updates</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>When a status changes asynchronously, announce it: <Mono>role=&quot;status&quot;</Mono> (polite) for routine run-state changes, <Mono>role=&quot;alert&quot;</Mono> (assertive) for a new P0 or a service going down, so screen-reader users hear escalations.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>A pulsing &quot;live&quot; or &quot;running&quot; indicator must stop under <Mono>prefers-reduced-motion</Mono> and rest as a solid swatch — the family and label still carry the meaning without the animation.</div>
        </div>
      </div>

      {/* Do/Don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pick the family that matches the semantic role</div>
          <div className="body" style={{padding: 14, flexDirection:'column', alignItems:'flex-start', gap: 8}}>
            <span className="pill severity-p1"><span className="dot"/> P1 — pageable</span>
            <span className="pill status-running"><span className="dot"/> Running</span>
            <span className="pill health-degraded"><Icons.alert size={10}/> Degraded</span>
            <span className="pill risk-high">High risk</span>
          </div>
          <div className="note">Four different roles, four different families. The reader parses each one in &lt; 200ms.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — collapse them all into `--warning`</div>
          <div className="body" style={{padding: 14, flexDirection:'column', alignItems:'flex-start', gap: 8}}>
            <span className="pill warning"><span className="dot"/> P1</span>
            <span className="pill warning"><span className="dot"/> Running</span>
            <span className="pill warning">Degraded</span>
            <span className="pill warning">High risk</span>
          </div>
          <div className="note">Four amber pills compete for the same attention and the row stops communicating.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — keep the family even for the "ok" state</div>
          <div className="body" style={{padding: 14, flexDirection:'column', alignItems:'flex-start', gap: 8}}>
            <span className="pill status-done"><span className="dot"/> Done</span>
            <span className="pill health-up"><Icons.check size={10}/> Up</span>
            <span className="pill risk-low">Low</span>
          </div>
          <div className="note">"Done", "Up", "Low" all use the same green hue token (~ #34D399) but the noun reads correctly inline.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — reach for `--success` to mean "low risk"</div>
          <div className="body" style={{padding: 14, flexDirection:'column', alignItems:'flex-start', gap: 8}}>
            <span className="pill success">Low risk</span>
            <span className="pill success">Done</span>
            <span className="pill success">Up</span>
          </div>
          <div className="note">Bypasses the family. The dark/light overrides won't drift coherently when the brand `--success` shifts.</div>
        </div>
      </div>
    </Section>
  );
}
