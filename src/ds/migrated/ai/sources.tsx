'use client';
// Eidos AI — Sources panel/list (§2.2 component-page standard).
// Documents the standalone `Sources` surface: the numbered list of retrieved
// documents shown below an AI answer (rank · title · domain · snippet ·
// retrieved-at timestamp). For the INLINE Citation chip + popover, see the
// Citations page at /ai/citations.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, PropsTable, installTabs, Lede, Sources, Citation, Empty, Mono } from '@/ds/core';

// AI-page inline style convention

// ── sample sources ────────────────────────────────────────────────────────────
const SOURCES = [
  {
    id: 1,
    domain: 'datadog.com',
    title: 'Trace events for incident-0421 — billing-svc',
    url: 'https://app.datadoghq.com/apm/trace/0421',
    snippet: 'p99 latency rose to 412 ms between 02:14 and 02:38 UTC; root cause traced to retry storm on the edge → billing-svc.',
    fetched: '14:01 · 18s ago',
  },
  {
    id: 2,
    domain: 'github.com',
    title: 'config/grpc.toml — retry budget bumped to 8',
    url: 'https://github.com/eidos/repo/commit/ab12cd',
    snippet: 'Increase retry_budget from 3 to 8 to absorb migration burst on identity-svc. Reviewed by @ops.',
    fetched: '14:01 · 20s ago',
  },
  {
    id: 3,
    domain: 'docs.eidos.dev',
    title: 'Runbook · Tier-1 incident · billing-svc',
    url: 'https://docs.eidos.dev/runbooks/tier-1/billing.md',
    snippet: 'Step 1: revert the most recent canary; Step 2: drop retry_budget to baseline; Step 3: rebind alert names.',
    fetched: '14:01 · 22s ago',
  },
  {
    id: 4,
    domain: 'notion.so',
    title: 'Postmortem · 0421 — alert binding regression',
    url: 'https://notion.so/eidos/postmortem-0421',
    snippet: 'Renaming svc.latency.p99 → svc.lat.p99 silently un-bound the existing PagerDuty alert. Caught at 4% error rate.',
    fetched: '14:01 · 25s ago',
  },
  {
    id: 5,
    domain: 'pagerduty.com',
    title: 'Incident #1894 — billing-svc p99 spike',
    url: 'https://eidos.pagerduty.com/incidents/1894',
    snippet: 'Triggered at 02:14 UTC. On-call: @maya. Error budget at 38% remaining. Escalated to P1 at 02:22 UTC.',
    fetched: '14:02 · 10s ago',
  },
];

// ── code snippets ─────────────────────────────────────────────────────────────
const BASIC_CODE = `<Sources sources={[
  {
    id: 1,
    domain: 'datadog.com',
    title: 'Trace events for incident-0421',
    url: 'https://…',
    snippet: 'p99 latency rose to 412 ms…',
    fetched: '14:01 · 18s ago',
  },
  // …more sources
]}/>`;

const COLLAPSIBLE_CODE = `<Sources
  sources={sources}
  collapsible
  title="Sources"
/>`;

const ONSELECT_CODE = `<Sources
  sources={sources}
  onSelect={(source) => {
    // open in an in-app preview drawer instead of a new tab
    openPreview(source.url);
  }}
/>`;

const FULL_PATTERN_CODE = `// The canonical pattern: response above, sources below.
<div>
  <div className="ai-prose">
    <h2>What changed in 0421</h2>
    <p>
      Three things shipped together<Citation n={1} source={sources[0]}/>.
      The retry budget bumped 3 → 8<Citation n={2} source={sources[1]}/>.
    </p>
  </div>
  <Sources sources={sources}/>
</div>`;

// ── Density / variant demo ────────────────────────────────────────────────────
const SourcesDensityDemo = () => {
  const [count, setCount] = React.useState(3);
  return (
    <div style={{ width: '100%', maxWidth: 720 }}>
      <div className="btn-group" role="group" aria-label="Number of sources" style={{ marginBottom: 14 }}>
        {[1, 2, 3, 5].map(n => (
          <button
            key={n}
            className={'btn xs ' + (count === n ? 'ember' : 'outline')}
            onClick={() => setCount(n)}
          >{n} source{n > 1 ? 's' : ''}</button>
        ))}
      </div>
      <Sources sources={SOURCES.slice(0, count)}/>
    </div>
  );
};

// ── Pagination demo — 12 sources so the > 5 threshold trips pagination ────────
const MANY_SOURCES = [
  ...SOURCES,
  { id: 6,  domain: 'grafana.com',   title: 'Service map · billing-svc retries', url: '#', snippet: 'Edge → billing-svc retry rate spiked 4.2× during the incident window; identity-svc pool saturation steady at 78%.', fetched: '14:01 · 30s ago' },
  { id: 7,  domain: 'sentry.io',     title: 'Error: ConnectionResetError in billing-svc', url: '#', snippet: 'First seen 02:13 UTC, 1,284 events. Stack trace points to the gRPC retry handler.', fetched: '14:01 · 32s ago' },
  { id: 8,  domain: 'github.com',    title: 'PR #2841 — alert binding rename', url: '#', snippet: 'Renames svc.latency.p99 → svc.lat.p99 in the Datadog config. Merged before the incident.', fetched: '14:01 · 40s ago' },
  { id: 9,  domain: 'jira.acme.io',  title: 'INC-0421 — Tier-1 incident ticket', url: '#', snippet: 'Status: closed. Time to resolve: 38 minutes. Postmortem due 2026-05-30.', fetched: '14:02 · 1m ago' },
  { id: 10, domain: 'slack.com',     title: '#oncall — paged 02:14 UTC', url: '#', snippet: 'Acknowledged by @maya at 02:15. Bridge opened. SRE + Billing on the call.', fetched: '14:02 · 1m ago' },
  { id: 11, domain: 'docs.eidos.dev',title: 'Architecture · billing-svc dependencies', url: '#', snippet: 'billing-svc depends on identity-svc for token validation and on orders-svc for state.', fetched: '14:02 · 1m ago' },
  { id: 12, domain: 'datadog.com',   title: 'Dashboard · billing-svc SLO', url: '#', snippet: 'Error budget for May: 38% remaining. Current burn rate: 1.8x.', fetched: '14:02 · 2m ago' },
];
const PaginatedSourcesDemo = () => (
  <div style={{ width: '100%', maxWidth: 620 }}>
    <Sources sources={MANY_SOURCES}/>
  </div>
);

// ── Collapsible demo ──────────────────────────────────────────────────────────
const CollapsibleDemo = () => (
  <div style={{ width: '100%', maxWidth: 600 }}>
    <Sources sources={SOURCES} collapsible title="Sources"/>
  </div>
);

// ── Empty state demo ──────────────────────────────────────────────────────────
const EmptySourcesDemo = () => (
  <div style={{ width: '100%', maxWidth: 600 }}>
    <div className="ai-cite-panel">
      <div className="ai-cite-panel-head">
        <span className="label">Sources</span>
        <span className="count">0</span>
      </div>
      <Empty
        size="sm"
        iconName="link"
        title="No sources retrieved"
        desc="This answer was not grounded in retrieved documents."
      />
    </div>
  </div>
);

// ── In context: response + sources ───────────────────────────────────────────
const InContextDemo = () => (
  <div style={{ width: '100%', maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 0 }}>
    {/* Response */}
    <div className="ai-resp">
      <div className="ai-resp-stack">
        <div className="ai-resp-meta">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>Eidos AI</span>
          <span style={{ color: 'var(--fg-faint)', margin: '0 6px' }}>·</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-faint)' }}>14:02</span>
        </div>
        <div className="ai-prose">
          <h3>What changed in 0421</h3>
          <p>
            Three things shipped together — none broke in isolation, but their interaction triggered the page at 02:14
            <Citation n={1} source={SOURCES[0]}/>.
          </p>
          <ul>
            <li><b>gRPC retry budget</b> bumped from 3 to 8 in <code>config/grpc.toml</code><Citation n={2} source={SOURCES[1]}/> — absorbed burst traffic but masked upstream timeouts.</li>
            <li><b>Datadog metric rename</b> silently unbound the PagerDuty alert<Citation n={4} source={SOURCES[3]}/> — we had no early warning.</li>
            <li><b>Runbook</b> recommends reverting the canary first<Citation n={3} source={SOURCES[2]}/> before dropping the retry budget.</li>
          </ul>
        </div>
      </div>
    </div>
    {/* Sources panel */}
    <div style={{ marginTop: 18 }}>
      <Sources sources={SOURCES.slice(0, 4)}/>
    </div>
  </div>
);

export default function AiSources() {
  return (
    <Section
      id="sources"
      num="13b"
      title="Sources"
      desc="The numbered sources panel shown below a retrieval-augmented answer. Each entry carries the rank, title, domain, snippet, and retrieved-at timestamp."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-sources')} ariaLabel="package manager"/>
      <Lede>The rank number links each source to the matching inline Citation chip in the prose above — the numbers are the contract between the two layers. For the inline chip, see Citations at /ai/citations.</Lede>
      <Lede>
        Ships <Mono>Sources</Mono> (the panel/list surface) and the companion <Mono>Citation</Mono> chip for inline use. Both live in <Mono>core/ai/sources.tsx</Mono> and share the <Mono>.ai-cite-*</Mono> CSS in <Mono>ai.css</Mono>. The <Mono>SourcesPanel</Mono> export is a backward-compat alias for <Mono>Sources</Mono>.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="Sources — numbered list: rank · title · domain · snippet · retrieved-at" code={BASIC_CODE} height={440}>
        <div style={{ width: '100%', maxWidth: 680 }}>
          <Sources sources={SOURCES.slice(0, 3)}/>
        </div>
      </Frame>
      <Lede>
        Pass an ordered array of source objects. The array index + 1 is the rank — first entry is [1], second is [2]. The rank is the link between this panel and the inline <Mono>Citation</Mono> chips in the prose above — never re-rank between the two surfaces.
      </Lede>

      {/* EXAMPLES EYEBROW */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      {/* DENSITY VARIANTS */}
      <SubHead meta="1 · 2 · 3 · 5 sources">Density</SubHead>
      <Frame label="toggle to see the panel at different source counts" height={560}>
        <SourcesDensityDemo/>
      </Frame>
      <Lede>
        The panel adapts to any count. One source: the rank and a single entry. Five sources: a tall, scrollable list. Optimal: 3–5 sources — more than 5 overwhelms the reader; fewer than 3 rarely justifies the panel chrome.
      </Lede>

      {/* COLLAPSIBLE */}
      <SubHead meta="collapsible">Collapsible</SubHead>
      <Frame label="collapsible — hidden behind a &quot;Sources N&quot; disclosure for compact contexts" code={COLLAPSIBLE_CODE} height={320}>
        <CollapsibleDemo/>
      </Frame>
      <Lede>
        Use <Mono>collapsible</Mono> when the sources panel appears inside a sidesheet, hover-card, or a compact context where vertical space is scarce. The disclosure shows the count at a glance. For full-width chat surfaces, the default (expanded) form is clearer.
      </Lede>

      {/* PAGINATION (>5 SOURCES) */}
      <SubHead meta="long lists · paginated">Pagination</SubHead>
      <Frame label="when sources.length > perPage (default 5), arrows + position appear" height={500}>
        <PaginatedSourcesDemo/>
      </Frame>
      <Lede>
        For long retrievals — RAG runs that pull a dozen documents, a "show all" view — the panel paginates at <Mono>perPage</Mono> (5 by default). The leading <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', padding: '1px 5px', border: '1px solid var(--border)', borderRadius: 3, color: 'var(--fg-muted)' }}>{'<'}</kbd> / <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', padding: '1px 5px', border: '1px solid var(--border)', borderRadius: 3, color: 'var(--fg-muted)' }}>{'>'}</kbd> arrows step through; the centre shows <Mono>1–5 of 12</Mono>.
      </Lede>

      {/* EMPTY STATE */}
      <SubHead meta="empty state">Empty state</SubHead>
      <Frame label="no sources retrieved — ungrounded answer" height={240}>
        <EmptySourcesDemo/>
      </Frame>
      <Lede>
        When no sources were retrieved — for example, the model answered from training data only — render the empty state rather than hiding the panel. The empty state makes the absence of grounding explicit, which is more honest than silence.
      </Lede>

      {/* CUSTOM onSelect */}
      <SubHead meta="in-app navigation">Custom link handler</SubHead>
      <Frame label="onSelect intercepts the link — useful for in-app preview drawers" code={ONSELECT_CODE} height={300}>
        <div style={{ width: '100%', maxWidth: 600 }}>
          <Sources
            sources={SOURCES.slice(0, 2)}
            onSelect={(s) => { /* noop in demo */ void s; }}
          />
        </div>
      </Frame>
      <Lede>
        When <Mono>onSelect</Mono> is provided, the title links become buttons and the handler receives the source object instead of opening the URL in a new tab. Use this for in-app preview drawers, sidesheets, or any context where leaving the page would lose state.
      </Lede>

      {/* IN CONTEXT */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame label="the canonical pattern — response above with inline chips · sources panel below" height={720}>
        <InContextDemo/>
      </Frame>
      <Lede>
        The canonical pattern: the assistant's prose carries inline <Mono>Citation</Mono> chips; the <Mono>Sources</Mono> panel sits immediately below. The reader scans the prose, taps a chip to see the source inline, then falls naturally into the panel to find the next document. The numbering is identical between the two surfaces — never re-rank.
      </Lede>
      <div className="surface" style={{ padding: 14, marginTop: 6 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--ember)' }}>Cross-link:</span>
        {' '}
        <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.6 }}>
          For the inline <code style={{ fontFamily: 'var(--font-mono)' }}>Citation</code> chip and its hover popover, see the{' '}
          <a href="/ai/citations" style={{ color: 'var(--ember)' }}>Citations</a> page.
          The two components are designed to work as a unit — the Sources panel is useless without Citations in the prose, and vice versa.
        </span>
      </div>

      {/* ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The panel header in collapsible mode is a real <code style={{ fontFamily: 'var(--font-mono)' }}>button</code>: Tab reaches it, Enter/Space toggles the list. Each source title is a normal link (<code style={{ fontFamily: 'var(--font-mono)' }}>&lt;a&gt;</code>) reached by Tab and opened with Enter. When <code style={{ fontFamily: 'var(--font-mono)' }}>onSelect</code> is provided, the link becomes a button (<code style={{ fontFamily: 'var(--font-mono)' }}>role="button"</code>) — Enter/Space activates it.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The sources list is an <code style={{ fontFamily: 'var(--font-mono)' }}>&lt;ol&gt;</code> — rank is conveyed by the list order, matching the inline chip numbers. Each entry's rank number is visible text and read aloud, reinforcing the link between the chip and the entry. The collapsible header carries <code style={{ fontFamily: 'var(--font-mono)' }}>aria-expanded</code> to communicate the open/closed state. The empty state uses <code style={{ fontFamily: 'var(--font-mono)' }}>role="status"</code>.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Focus order inside the panel: header (if collapsible) → source 1 title → source 2 title → … — matching reading order. Source title links show a visible focus ring. The rank number, domain caption, snippet, and timestamp all clear AA contrast on the panel surface. The rank is text, not colour, so the chip-to-entry link is colour-blind-safe.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Under <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code> the collapsible panel opens and closes instantly with no height animation. Source entries that arrive while the answer streams snap in with the prose — no stagger or slide entrance animation.
          </div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — panel rank, title, and domain mirror; retrieved-at stays on the trailing edge" height={380}>
        <div dir="rtl" style={{ width: '100%', maxWidth: 680 }}>
          <Sources
            sources={[
              { ...SOURCES[0], title: 'تتبع أحداث الحادثة 0421 — billing-svc', snippet: 'ارتفع زمن الاستجابة p99 إلى 412ms بين 02:14 و02:38 UTC.', domain: 'datadog.com', fetched: '14:01 · منذ 18ث' },
              { ...SOURCES[1], title: 'config/grpc.toml — رفع ميزانية المحاولة إلى 8', snippet: 'رفع retry_budget من 3 إلى 8 لاستيعاب موجة الهجرة على identity-svc.', domain: 'github.com', fetched: '14:01 · منذ 20ث' },
              { ...SOURCES[2], title: 'دليل تشغيل · حادثة الفئة الأولى · billing-svc', snippet: 'الخطوة 1: عكس أحدث canary؛ الخطوة 2: خفض retry_budget؛ الخطوة 3: ربط أسماء التنبيهات.', domain: 'docs.eidos.dev', fetched: '14:01 · منذ 22ث' },
            ]}
            title="المصادر"
          />
        </div>
      </Frame>
      <Lede>
        All spacing uses logical CSS properties, so the layout mirrors automatically under <Mono>dir="rtl"</Mono>: the rank appears on the inline-end (left) side, the title and domain flip their reading direction, and the retrieved-at timestamp sits on the inline-start (right) edge. The panel is usable without any RTL-specific override.
      </Lede>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 560 }} aria-hidden="true">
              <Sources sources={SOURCES.slice(0, 2)}/>
              {/* pins */}
              <span className="lead h" style={{ top: 20, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 64, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 100, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 128, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 200, left: -32, width: 28 }}/>
              <div className="pin" style={{ top: 12, left: -54 }}>1</div>
              <div className="pin" style={{ top: 56, left: -54 }}>2</div>
              <div className="pin" style={{ top: 92, left: -54 }}>3</div>
              <div className="pin" style={{ top: 120, left: -54 }}>4</div>
              <div className="pin" style={{ top: 192, left: -54 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 640, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Panel head.</b> Mono "Sources" label + count pill. In collapsible mode the head becomes a button — aria-expanded tracks open/closed. The count gives the reader a quick density signal.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Rank.</b> Bold numeric index matching the inline Citation chip number. The contract between layers — chip [2] always points to entry [2] in the panel. Never re-rank.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Title link.</b> The document title as a clickable link to the source URL. When <Mono>onSelect</Mono> is provided it becomes a button instead.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Domain + snippet.</b> The source domain in Geist Mono (icon + hostname) followed by a one-line excerpt of the cited passage.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Retrieved-at.</b> Human-formatted freshness string ("14:01 · 18s ago"). The consumer formats this — freshness is a judgment, not a sort key. Use <Mono>RelativeTime</Mono> if you have a <Mono>Date</Mono> object.</span>
          </div>
        </div>
      </div>

      {/* DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — keep the rank consistent across surfaces</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%' }}>
              <div className="ai-prose" style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.6 }}>Incident paged at 02:14<Citation n={1} source={SOURCES[0]}/>. Retry budget bumped<Citation n={2} source={SOURCES[1]}/>.</p>
              </div>
              <Sources sources={[SOURCES[0], SOURCES[1]]}/>
            </div>
          </div>
          <div className="note">[1] in the prose maps to [1] in the panel. [2] maps to [2]. Always. The numbering is the only thing that links the two surfaces.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — re-rank between prose and panel</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)', lineHeight: 1.7 }}>
              Prose: cites [1] (github.com)<br/>
              Prose: cites [2] (datadog.com)<br/>
              Panel: [1] datadog.com ← mismatch<br/>
              Panel: [2] github.com ← mismatch<br/>
              <span style={{ color: 'var(--danger)', fontSize: 'var(--text-xs)' }}>chip [1] ≠ panel entry [1]</span>
            </div>
          </div>
          <div className="note">If the array order in Sources differs from the citation order in the prose, the chip–panel link breaks. Number once, in the order they appear in the answer.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — show the empty state for ungrounded answers</div>
          <div className="body" style={{ padding: 14 }}>
            <EmptySourcesDemo/>
          </div>
          <div className="note">An empty panel is more honest than hiding it. Users learn that the model answered from training data, not retrieved documents.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — add sources to an ungrounded answer</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--danger)', lineHeight: 1.7 }}>
              answer: "The sky is blue."<br/>
              // no retrieval happened<br/>
              {'<Sources sources={hallucinated}/>'}  ← wrong
            </div>
          </div>
          <div className="note">Sources are for retrieval-augmented answers only. Attaching sources to a non-RAG answer creates the impression that claims are grounded when they aren't.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — use collapsible in compact contexts</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%' }}>
              <Sources sources={SOURCES.slice(0, 3)} collapsible title="Sources"/>
            </div>
          </div>
          <div className="note">In sidesheets, hover-cards, or narrow columns the collapsible variant saves vertical space while still surfacing the source count.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — show more than 8 sources</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)', lineHeight: 1.7 }}>
              sources.length === 24<br/>
              {'<Sources sources={24sources}/>'}  ← overwhelming<br/>
              <span style={{ color: 'var(--danger)', fontSize: 'var(--text-xs)' }}>user cannot audit 24 sources</span>
            </div>
          </div>
          <div className="note">More than 8 sources saturates the panel — the reader cannot audit them all. Re-rank and surface only the top 3–5 most relevant. If the model used many documents, summarise rather than listing all.</div>
        </div>
      </div>

      {/* API REFERENCE */}
      <SubHead meta="SourcesProps">API reference</SubHead>
      <AutoPropsTable component="Sources" label="<Sources />"/>
      <PropsTable
        label="CitationSource (source shape)"
        rows={[
          { prop: 'id', type: 'number', required: true, description: 'Numeric rank. Must match the n prop on the Citation chip in the prose. First source: id=1.' },
          { prop: 'domain', type: 'string', required: true, description: 'Hostname of the source (e.g. "github.com"). Rendered in Geist Mono under the title.' },
          { prop: 'title', type: 'string', required: true, description: 'Document title — the clickable link in the panel entry.' },
          { prop: 'url', type: 'string', required: true, description: 'Full URL. Used as the link href (new tab) unless onSelect intercepts.' },
          { prop: 'snippet', type: 'string', required: true, description: 'One-line excerpt of the cited passage. Displayed below the domain in muted body text.' },
          { prop: 'fetched', type: 'string', default: undefined, description: 'Human-formatted retrieval timestamp ("14:01 · 18s ago"). Consumer-formatted — freshness is a judgment, not a sort key. Use RelativeTime if you have a Date object.' },
        ]}
      />
      <Lede>
        <b>Cross-link:</b> the inline <Mono>{'<Citation n={1} source={source}/>'}</Mono> chip that opens a popover is documented on the{' '}
        <a href="/ai/citations" style={{ color: 'var(--ember)' }}>Citations</a> page.
        {' '}Use <Mono>RelativeTime</Mono> (from <Mono>@/ds/core</Mono>) if your data has a <Mono>Date</Mono> object — pass its output as the <Mono>fetched</Mono> string.
      </Lede>
    </Section>
  );
}
