'use client';
// Forge — Chat workspace. A full-bleed surface INSIDE the portal shell that
// mirrors the /example/ai-chat experience: a 264px sub-sidebar (New chat ·
// Projects · Search · pinned spaces · chat history) plus a main column that
// swaps between four views — New chat (empty hero), an active thread, Search,
// and Projects. Navigation is internal state (no route change) so the whole
// experience lives "inside this page", as the product IA intends.
//
// Built only from DS components (PromptInput, Message, Response, ChainOfThought,
// Citation, Sources, Diagram, MathView, Suggestion…). NO inline <style> — all
// chrome is the .fp-chat-* layer in src/styles/example-shell.css.
import * as React from 'react';
import {
  Icons, ForgeMark, Avatar,
  PromptInput, PromptBanner, SuggestionCard,
  Message, Response, MessageActions, ProseCode, Prose,
  ChainOfThought, Citation, Sources,
  Diagram, MathView,
  Modal, Card, CardMedia, CardHeader, CardTitle, CardContent,
  ToggleGroup, ToggleGroupItem,
} from '@/ds/core';
import { usePageCrumb } from '@/portal/shell/portal-shell';
import { useRouter, useSearchParams } from 'next/navigation';
import { AGENTS, type Agent } from '@/portal/data/agents';

// ── Sidebar data (one source of truth for every view) ───────────────────────
const PINNED = [
  { id: 'space-score',  label: 'Score & decisioning', icon: 'gauge' },
  { id: 'space-fraud',  label: 'Fraud & risk',        icon: 'shield' },
  { id: 'space-bureau', label: 'Bureau & SCR',        icon: 'book' },
];

const RECENTS = [
  { id: 'acerta-p99', title: 'acerta-api p99 spike after v4.12',        preview: 'Correlated it with the konduto-antifraud deploy…' },
  { id: 'breaker',    title: 'Circuit breaker for onescore-gateway',    preview: 'A Resilience4j config for the SCPC timeout…' },
  { id: 'fraud-fp',   title: 'konduto-antifraud false-positive spike',  preview: 'The new fraud-score rule is over-rejecting…' },
];

const YESTERDAY = [
  { id: 'kyc-ring1',   title: 'identity-proofing — Ring 1 rollout plan', preview: 'Ring 1 starts with the LATAM cohort…' },
  { id: 'cp-backfill', title: 'cadastro-positivo-ingestor backfill',     preview: 'Reprocess 14M CPFs from the SCR feed…' },
  { id: 'negativ',     title: 'negativation-writer idempotency review',  preview: 'The retry handler is missing a dedup key…' },
  { id: 'lgpd-sweep',  title: 'LGPD consent sweep — Q2 services',        preview: '12 services log PII without a consent scope…' },
  { id: 'offer-flag',  title: 'offer-orchestrator cohort rollout',       preview: 'Suggest cohort 2 (10%) for tomorrow…' },
];

type View = 'new' | 'thread' | 'search' | 'projects' | 'project' | 'archive' | 'artifacts';
type Nav = { view: View; chatId?: string; projectId?: string; agentId?: string };

// Archived chats — restorable (rollback un-archives them).
const ARCHIVED = [
  { id: 'arc-pix-throttle', title: 'Pix throttle config — 06/04 spike',  preview: 'Added a 2s throttle on the offline path until the rail recovered.', when: 'Archived 2w ago' },
  { id: 'arc-q4-cost',      title: 'Q4 cost review — Cloud Run',          preview: 'Cloud Run was 18% of the platform bill; rightsized to cut ~30%.',  when: 'Archived 3w ago' },
  { id: 'arc-sast-q1',      title: 'SAST sweep — Q1 services',            preview: 'Triaged 9 high-severity findings; 7 fixed, 2 accepted.',          when: 'Archived 1mo ago' },
  { id: 'arc-onb-runbook',  title: 'Onboarding runbook for new SREs',     preview: 'Drafted the day-1 setup, pager rotation and escalation paths.',    when: 'Archived 2mo ago' },
];

// Artifacts created through chat — each links back to the chat that made it.
type ArtifactKind = 'image' | 'document' | 'html' | 'app' | 'code' | 'data';
type ArtifactItem = {
  id: string;
  kind: ArtifactKind;
  title: string;
  meta: string;
  created: string;
  chatId: string;
  chatTitle: string;
};

const ART_KIND: Record<ArtifactKind, { icon: string; label: string; bg: string; fg: string }> = {
  image:    { icon: 'image',    label: 'Image',    bg: 'rgba(52, 211, 153, 0.14)', fg: '#34D399' },
  document: { icon: 'doc',      label: 'Document', bg: 'rgba(96, 165, 250, 0.16)', fg: '#60A5FA' },
  html:     { icon: 'globe',    label: 'HTML',     bg: 'rgba(192, 132, 252, 0.16)', fg: '#C084FC' },
  app:      { icon: 'appWindow', label: 'App',     bg: 'rgba(251, 146, 60, 0.16)', fg: '#FB923C' },
  code:     { icon: 'terminal', label: 'Code',     bg: 'rgba(56, 189, 248, 0.16)', fg: '#38BDF8' },
  data:     { icon: 'database', label: 'Dataset',  bg: 'rgba(163, 230, 53, 0.14)', fg: '#A3E635' },
};

const ARTIFACTS: ArtifactItem[] = [
  { id: 'art-cutover-svg', kind: 'image',    title: 'Cutover sequence diagram',          meta: 'SVG · 24 KB',            created: '2h ago',   chatId: 'acerta-p99', chatTitle: 'acerta-api p99 spike after v4.12' },
  { id: 'art-runbook',     kind: 'document',  title: 'Runbook — score-engine → Aurora',   meta: 'Markdown · 5.4 KB',      created: 'Yesterday', chatId: 'breaker',    chatTitle: 'Circuit breaker for onescore-gateway' },
  { id: 'art-status-page', kind: 'html',      title: 'Incident status page',              meta: 'Static · 8 KB',          created: 'Yesterday', chatId: 'fraud-fp',   chatTitle: 'konduto-antifraud false-positive spike' },
  { id: 'art-breaker-cfg', kind: 'code',      title: 'Resilience4j breaker config',       meta: 'YAML · 1.2 KB',          created: '2d ago',   chatId: 'breaker',    chatTitle: 'Circuit breaker for onescore-gateway' },
  { id: 'art-fp-dash',     kind: 'app',       title: 'False-positive triage mini-app',    meta: 'React · interactive',    created: '3d ago',   chatId: 'fraud-fp',   chatTitle: 'konduto-antifraud false-positive spike' },
  { id: 'art-cpf-sample',  kind: 'data',      title: 'SCR reconciliation sample',         meta: 'CSV · 240 rows',         created: '4d ago',   chatId: 'cp-backfill', chatTitle: 'cadastro-positivo-ingestor backfill' },
];

const findChatTitle = (id: string): string => {
  const all = [...RECENTS, ...YESTERDAY, ...ARCHIVED];
  return all.find((t) => t.id === id)?.title
    ?? PINNED.find((p) => p.id === id)?.label
    ?? RECENTS[0].title;
};

const ICON = (key: string): React.FC<{ size?: number }> =>
  (Icons as Record<string, React.FC<{ size?: number }>>)[key] ?? Icons.folder;

// Canonical DS search field (mirrors the Inputs doc's Search demo): an .in-group
// with a leading .in-addon.icon magnifier and a trailing affordance that swaps
// between the keyboard-shortcut hint (empty) and a clear-✕ button (typed).
const ChatSearch = ({
  value, onChange, placeholder, shortcut = '⌘K', className, size = 'md',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  shortcut?: string;
  className?: string;
  size?: 'md' | 'lg';
}) => {
  const lg = size === 'lg';
  return (
    <div className={'in-group' + (lg ? ' fp-search-hero' : '') + (className ? ` ${className}` : '')}>
      <span className="in-addon icon"><Icons.search size={lg ? 16 : 14} /></span>
      <input
        className="in-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      />
      {value ? (
        <button type="button" className="in-addon btn" onClick={() => onChange('')} aria-label="Clear search">
          <Icons.x size={lg ? 15 : 14} />
        </button>
      ) : (
        <span className="in-addon" style={{ paddingInline: 10 }}><span className="kbd">{shortcut}</span></span>
      )}
    </div>
  );
};

// ── Sub-sidebar ─────────────────────────────────────────────────────────────
const SideRow = ({
  icon, label, count, kbd, active, onClick,
}: {
  icon: string; label: string; count?: number; kbd?: string; active?: boolean; onClick: () => void;
}) => {
  const I = ICON(icon);
  return (
    <button
      type="button"
      className={'fp-chat-row' + (active ? ' is-active' : '')}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      <I size={14} />
      <span className="label">{label}</span>
      {typeof count === 'number' && <span className="count">{count}</span>}
      {kbd && <span className="kbd">{kbd}</span>}
    </button>
  );
};

const HistoryBucket = ({
  label, items, activeChat, onOpen,
}: {
  label: string; items: typeof RECENTS; activeChat?: string; onOpen: (id: string) => void;
}) => (
  <div className="ai-hist-group fp-chat-hist">
    <div className="ai-hist-group-head">
      <span>{label}</span>
      <span>{items.length}</span>
    </div>
    {items.map((t) => (
      <button
        key={t.id}
        type="button"
        className={'ai-hist-item' + (activeChat === t.id ? ' is-active' : '')}
        onClick={() => onOpen(t.id)}
      >
        <div className="body">
          <div className="title">{t.title}</div>
          <div className="preview">{t.preview}</div>
        </div>
      </button>
    ))}
  </div>
);

const ChatSidebar = ({ nav, go }: { nav: Nav; go: (n: Nav) => void }) => {
  const router = useRouter();
  return (
  <aside className="fp-chat-side" aria-label="Chat navigation">
    <button
      type="button"
      className={'fp-chat-newchat' + (nav.view === 'new' && !nav.agentId ? ' is-active' : '')}
      onClick={() => go({ view: 'new' })}
    >
      <Icons.plus size={14} />
      <span>New chat</span>
    </button>

    <nav className="fp-chat-nav" aria-label="Primary">
      <SideRow icon="search" label="Search chats" kbd="⌘K"        active={nav.view === 'search'}    onClick={() => go({ view: 'search' })} />
      <SideRow icon="inbox"  label="Archive"      count={ARCHIVED.length}  active={nav.view === 'archive'}   onClick={() => go({ view: 'archive' })} />
      <SideRow icon="grid"   label="Artifacts"    count={ARTIFACTS.length} active={nav.view === 'artifacts'} onClick={() => go({ view: 'artifacts' })} />
    </nav>

    <div className="fp-chat-sep" role="separator" />

    {/* Projects — the pinned spaces, with a link through to the full gallery. */}
    <div className="fp-chat-grouphead">
      <span>Projects</span>
      <button type="button" className="fp-chat-viewmore" onClick={() => go({ view: 'projects' })}>
        View more <Icons.chevronRight size={11} />
      </button>
    </div>
    <nav className="fp-chat-nav" aria-label="Projects">
      {PINNED.map((p) => (
        <SideRow
          key={p.id}
          icon={p.icon}
          label={p.label}
          active={nav.view === 'project' && nav.projectId === p.id}
          onClick={() => go({ view: 'project', projectId: p.id })}
        />
      ))}
    </nav>

    <div className="fp-chat-sep" role="separator" />

    {/* Agents — quick new-chat with a domain assistant; View more opens the
        external Agents catalog (/portal/agents). */}
    <div className="fp-chat-grouphead">
      <span>Agents</span>
      <button type="button" className="fp-chat-viewmore" onClick={() => router.push('/portal/agents')}>
        View more <Icons.chevronRight size={11} />
      </button>
    </div>
    <nav className="fp-chat-nav" aria-label="Agents">
      {AGENTS.slice(0, 3).map((a) => (
        <button
          key={a.id}
          type="button"
          className={'fp-chat-agent' + (nav.view === 'new' && nav.agentId === a.id ? ' is-active' : '')}
          onClick={() => go({ view: 'new', agentId: a.id })}
        >
          <Avatar name={a.name} size={22} />
          <span className="label">{a.name}</span>
        </button>
      ))}
    </nav>

    <div className="fp-chat-sep" role="separator" />

    <HistoryBucket label="Chats"     items={RECENTS}   activeChat={nav.view === 'thread' ? nav.chatId : undefined} onOpen={(id) => go({ view: 'thread', chatId: id })} />
    <HistoryBucket label="Yesterday" items={YESTERDAY} activeChat={nav.view === 'thread' ? nav.chatId : undefined} onOpen={(id) => go({ view: 'thread', chatId: id })} />
  </aside>
  );
};

// ── View: New chat (empty hero) ─────────────────────────────────────────────
const STARTERS: { icon: string; title: string; line: string; prompt: string }[] = [
  {
    icon: 'gauge',
    title: 'Audit the score-serving path',
    line: 'Correlate acerta-api p99 with its dependencies.',
    prompt: 'Audit p99 latency on the score-serving path (acerta-api → onescore-gateway → score-engine). Correlate the spike with recent deploys and upstream dependencies, and tell me the most likely root cause.',
  },
  {
    icon: 'shield',
    title: 'konduto-antifraud rejections',
    line: 'Why did the false-positive rate spike?',
    prompt: 'konduto-antifraud false-positive rejections spiked after the v3.1.7 deploy. Walk me through which rule changed, the expected impact on approvals, and whether I should roll it back or gate it behind a flag.',
  },
  {
    icon: 'book',
    title: 'LGPD consent gaps',
    line: 'Find services logging PII without a consent scope.',
    prompt: 'Find every service in the catalog that logs PII (CPF, CNPJ, name or address) without a registered LGPD consent scope, rank them by request volume, and suggest the consent scope each one should declare.',
  },
  {
    icon: 'incident',
    title: 'Draft a postmortem',
    line: 'Blameless write-up for INC-2041.',
    prompt: 'Draft a blameless postmortem for INC-2041 in the Forge IC template: timeline, contributing factors, customer impact, and 3–5 corrective actions with owners and due dates.',
  },
];

const NewChatView = ({ onSend, agent }: { onSend: () => void; agent?: Agent }) => {
  const [text, setText] = React.useState('');
  const [model, setModel] = React.useState('eidos-sonnet-4-6');
  const [banner, setBanner] = React.useState(true);

  return (
    <div className="fp-chat-empty">
      <div className="fp-chat-empty-hero">
        <div className="fp-chat-empty-mark" aria-hidden="true">
          {agent ? <Avatar name={agent.name} size={56} /> : <ForgeMark size={56} color="currentColor" />}
        </div>
        <h1 className="fp-chat-empty-title">{agent ? `Chat with ${agent.name}` : 'Hello, Leonardo'}</h1>
        <p className="fp-chat-empty-sub">
          {agent
            ? `${agent.role}. Ask anything in this domain — it answers from the right runbooks and catalog services.`
            : 'What can Forge AI help you with today? Ask about a service, draft a runbook, or kick off an incident review.'}
        </p>
      </div>

      <div className="sg-cards fp-chat-empty-cards">
        {STARTERS.map((s) => {
          const I = ICON(s.icon);
          return (
            <SuggestionCard
              key={s.title}
              icon={<I size={14} />}
              title={s.title}
              line={s.line}
              onClick={() => setText(s.prompt)}
            />
          );
        })}
      </div>

      <div className="fp-chat-empty-composer">
        <PromptInput
          status="ready"
          value={text}
          onChange={setText}
          onSubmit={() => { setText(''); onSend(); }}
          modelValue={model}
          onModelChange={setModel}
          elevated
          topBanner={banner ? (
            <PromptBanner tone="promo" cta="Upgrade →" onDismiss={() => setBanner(false)}>
              Access premium models &amp; agents on Forge Pro
            </PromptBanner>
          ) : undefined}
          actions={[
            { id: 'upload', icon: 'upload',   label: 'Upload images or files', description: 'PNG, JPG, PDF, logs · up to 20 MB' },
            { id: 'image',  icon: 'sparkle',  label: 'Generate image',         description: 'Describe a picture and the agent will draw it' },
            { id: 'search', icon: 'search',   label: 'Deep search',            description: 'Browse trusted sources for a longer answer' },
            { id: 'tools',  icon: 'terminal', label: 'Run a tool',             description: 'Pick a tool the agent should call (file, shell, web…)' },
          ]}
          footerHint={<>Forge AI is grounded in your service catalog — double-check before acting on production.</>}
        />
      </div>
    </div>
  );
};

// ── View: Active thread ─────────────────────────────────────────────────────
const SOURCES = [
  { id: 1, domain: 'aws.amazon.com',          title: 'Aurora PostgreSQL pricing & instance sizing',         url: 'https://aws.amazon.com/rds/aurora/pricing/',                     snippet: 'db.r7g.4xlarge runs $1.07/h on-demand · reserved 1-yr cuts ~37%.', fetched: '14:01 · 18s ago' },
  { id: 2, domain: 'engineering.equifax.com', title: 'Q1 2026 cost review — managed databases',             url: 'https://engineering.equifax.com/q1-2026-db-cost-review',         snippet: 'score-engine and bureau-ingestion account for 62% of Aurora spend.',     fetched: '14:01 · 22s ago' },
  { id: 3, domain: 'cloud.google.com',        title: 'Cloud SQL for PostgreSQL — connection pooling guide', url: 'https://cloud.google.com/sql/docs/postgres/manage-connections',  snippet: 'PgBouncer with transaction pooling is the recommended path.',       fetched: '14:02 · 41s ago' },
  { id: 4, domain: 'docs.percona.com',        title: 'PostgreSQL major-version upgrade playbook',           url: 'https://docs.percona.com/postgresql/major-upgrades',             snippet: 'pg_upgrade with --link cuts downtime to under 5 min for 1 TB.',     fetched: '14:02 · 47s ago' },
];

const ThreadView = ({ chatId }: { chatId: string }) => {
  const [text, setText] = React.useState('');
  const [model, setModel] = React.useState('eidos-opus-4-7');

  // The chat title lives in the topbar breadcrumb (set by PortalChat), not as an
  // in-page header.
  return (
    <div className="fp-chat-thread">
      <div className="msg-thread fluid fp-chat-msgs">
        <Message from="user" meta={<><span className="t-mono-label">You</span> · 14:01</>}>
          Compare our three production Postgres databases and recommend which one to migrate to
          Aurora first this quarter — I care about cost, downtime, and blast radius.
        </Message>

        <Message
          from="assistant"
          meta={<><span className="t-mono-label">Forge AI</span> <span style={{ color: 'var(--fg-faint)', marginInlineStart: 6 }}>Opus 4.7 · 14:02</span></>}
          actions={<MessageActions surface="message" onCopy={() => {}} onRegen={() => {}} vote={null} onVote={() => {}} />}
        >
          <div style={{ marginBottom: 14 }}>
            <ChainOfThought
              defaultOpen
              title="Chain of thought"
              steps={[
                { kind: 'read',    label: 'Loaded service catalog',          detail: 'score-engine, bureau-ingestion, decision-engine — all Postgres 14, multi-AZ on RDS' },
                { kind: 'search',  label: 'Pulled Q1 cost review',           detail: 'Found managed-db costs broken down per service · last 90 days' },
                { kind: 'observe', label: 'Compared traffic + write volume', detail: 'decision-engine writes 4× more than bureau-ingestion; score-engine is read-heavy' },
                { kind: 'plan',    label: 'Drafted a low-risk migration order', detail: 'Read-heavy first → cheapest downtime profile; defer decision-engine' },
              ]}
            />
          </div>

          <Response from="assistant">
            <h3>Recommendation: migrate <code>score-engine</code> first</h3>
            <p>
              Across the three databases <code>score-engine</code> has the
              <strong> highest read-to-write ratio</strong> (≈ 28:1 last 30 days), which makes it the
              lowest-risk migration target — Aurora&apos;s replica-first failover keeps the cutover under
              one minute <Citation n={1} source={SOURCES[0]} />. Cost-wise it&apos;s already the
              second-biggest line in our managed-db spend <Citation n={2} source={SOURCES[1]} />, so the
              saving is material.
            </p>

            <h4>Comparison</h4>
            <table>
              <thead>
                <tr><th scope="col">Service</th><th scope="col">Class</th><th scope="col">Storage</th><th scope="col">Writes / s</th><th scope="col">Monthly cost</th></tr>
              </thead>
              <tbody>
                <tr><td><code>score-engine</code></td><td>db.r7g.4xl</td><td>820 GB</td><td>~120</td><td>$2,140</td></tr>
                <tr><td><code>bureau-ingestion</code></td><td>db.r7g.8xl</td><td>1.6 TB</td><td>~320</td><td>$3,810</td></tr>
                <tr><td><code>decision-engine</code></td><td>db.r7g.8xl</td><td>2.1 TB</td><td>~1,250</td><td>$4,260</td></tr>
              </tbody>
            </table>

            <blockquote>
              <strong>Heads up.</strong> <code>decision-engine</code> is the largest line item but also the
              riskiest — its write volume needs a connection-pooling rework before the cutover
              <Citation n={3} source={SOURCES[2]} />. Defer it until Q3 once PgBouncer is in front.
            </blockquote>

            <h4>Suggested migration order</h4>
            <ol>
              <li><strong>score-engine</strong> — read-heavy, smallest write throughput. Plan for a 60-second cutover using <code>pg_upgrade --link</code><Citation n={4} source={SOURCES[3]} />.</li>
              <li><strong>bureau-ingestion</strong> — write-medium, 1.6 TB. Run a week-long replication shadow against Aurora first.</li>
              <li><strong>decision-engine</strong> — <em>last</em>. Roll out PgBouncer in front, then re-evaluate.</li>
            </ol>

            <h4>Run the migration</h4>
            <ProseCode lang="bash">{`# 1. Snapshot the source
aws rds create-db-snapshot \\
  --db-instance-identifier score-engine-prod \\
  --db-snapshot-identifier score-engine-pre-aurora

# 2. Restore as an Aurora cluster
aws rds restore-db-cluster-from-snapshot \\
  --db-cluster-identifier score-engine-aurora \\
  --snapshot-identifier score-engine-pre-aurora \\
  --engine aurora-postgresql

# 3. Cut over (update the secret, rolling restart)
forge cli release score-engine --db aurora`}</ProseCode>

            <p>
              Estimated saving for <code>score-engine</code> alone is around <strong>$580/month</strong>{' '}
              after the 1-year reserved-instance discount. Want me to draft the migration runbook?
            </p>
          </Response>

          <div style={{ marginTop: 14 }}>
            <Sources sources={SOURCES} title="Sources" defaultOpen={false} />
          </div>
        </Message>

        <Message from="user" meta={<><span className="t-mono-label">You</span> · 14:05</>}>
          Got it. Add the math for the expected p99 win, a sequence diagram of the cutover, and translate
          the rollback summary into pt-BR + 日本語 for the LATAM and APAC oncalls.
        </Message>

        <Message
          from="assistant"
          meta={<><span className="t-mono-label">Forge AI</span> <span style={{ color: 'var(--fg-faint)', marginInlineStart: 6 }}>Opus 4.7 · 14:06</span></>}
          actions={<MessageActions surface="message" onCopy={() => {}} onRegen={() => {}} vote={null} onVote={() => {}} />}
        >
          <Response from="assistant">
            <h3>Expected p99 win — the math</h3>
            <p>
              With Aurora&apos;s replica-first failover (RTO ≈ 60 s) the contribution of cutover stalls to
              the monthly p99 collapses roughly an order of magnitude. Modelling tail latency:
            </p>
            <MathView display>
              <strong>p<sub>99</sub>(month)</strong> = max(<em>p<sub>99</sub>(baseline)</em>, <em>T<sub>cutover</sub></em>)
            </MathView>
            <p>
              gives a baseline p99 of <code>320 ms</code> and a cutover-bound ceiling of{' '}
              <MathView><em>T<sub>cutover</sub></em> ≈ 60 000 ms</MathView> under RDS multi-AZ; Aurora drops{' '}
              <MathView><em>T<sub>cutover</sub></em></MathView> to ≈ <strong>1 000 ms</strong>, so the monthly
              p99 returns to the baseline three full nines below the old worst-case spike.
            </p>

            <h3>Cutover sequence</h3>
            <Diagram caption="Sequence — score-engine → Aurora cutover during the Sun 02:00 UTC window">
              <svg viewBox="0 0 560 220" role="img" aria-label="Cutover sequence diagram" style={{ inlineSize: '100%', blockSize: 'auto' }}>
                <defs>
                  <marker id="fc-aha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                  </marker>
                </defs>
                {[{ x: 70, label: 'CLI' }, { x: 200, label: 'RDS' }, { x: 330, label: 'Secret' }, { x: 460, label: 'score' }].map((l) => (
                  <g key={l.label}>
                    <rect x={l.x - 36} y="10" width="72" height="22" rx="4" fill="var(--bg-elevated)" stroke="var(--border)" />
                    <text x={l.x} y="25" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg)">{l.label}</text>
                    <line x1={l.x} y1="34" x2={l.x} y2="200" stroke="var(--border)" strokeDasharray="3 3" />
                  </g>
                ))}
                <g stroke="var(--ember)" fill="var(--ember)">
                  <line x1="70" y1="60" x2="200" y2="60" markerEnd="url(#fc-aha)" />
                  <text x="135" y="55" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--ember)">create-db-snapshot</text>
                </g>
                <g stroke="var(--fg-muted)" fill="var(--fg-muted)">
                  <line x1="200" y1="100" x2="70" y2="100" markerEnd="url(#fc-aha)" />
                  <text x="135" y="95" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-muted)">snapshot-id</text>
                </g>
                <g stroke="var(--ember)" fill="var(--ember)">
                  <line x1="70" y1="140" x2="330" y2="140" markerEnd="url(#fc-aha)" />
                  <text x="200" y="135" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--ember)">rotate secret → aurora endpoint</text>
                </g>
                <g stroke="var(--success, #34D399)" fill="var(--success, #34D399)">
                  <line x1="330" y1="180" x2="460" y2="180" markerEnd="url(#fc-aha)" />
                  <text x="395" y="175" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--success, #34D399)">rolling restart</text>
                </g>
              </svg>
            </Diagram>

            <h3>Rollback summary — multi-locale</h3>
            <ul>
              <li><strong>EN.</strong> <em>If any check fails, restore the original RDS endpoint in the secret and roll back. Snapshot is retained for 30 days.</em></li>
              <li lang="pt-BR"><strong>PT-BR.</strong> <em>Se algum check falhar, restaure o endpoint RDS original no secret e faça o rollback. O snapshot fica retido por 30 dias.</em></li>
              <li lang="ja"><strong>日本語.</strong> <em>チェックに失敗した場合、シークレット内の元の RDS エンドポイントを復元し、ロールバックしてください。スナップショットは 30 日間保持されます。</em></li>
            </ul>

            <p>Anything else — comms template, runbook PR, or want me to update the catalog card directly?</p>
          </Response>
        </Message>
      </div>

      <div className="fp-chat-thread-foot">
        <PromptInput
          status="ready"
          value={text}
          onChange={setText}
          onSubmit={() => setText('')}
          modelValue={model}
          onModelChange={setModel}
          placeholder="Reply…"
          actions={[
            { id: 'upload', icon: 'upload',   label: 'Upload images or files' },
            { id: 'search', icon: 'search',   label: 'Deep search' },
            { id: 'tools',  icon: 'terminal', label: 'Run a tool' },
          ]}
          footerHint={<>Forge AI can make mistakes — please double-check important answers.</>}
        />
      </div>
    </div>
  );
};

// ── View: Search ────────────────────────────────────────────────────────────
type SearchResult = { id: string; title: string; snippet: string; project: string; when: string; bucket: 'today' | 'week' | 'earlier' };

const CORPUS: SearchResult[] = [
  ...RECENTS.map((r, i) => ({ id: r.id, title: r.title, snippet: r.preview, project: ['Score & decisioning', 'Score & decisioning', 'Fraud & risk'][i % 3], when: i === 0 ? '14:01' : i === 1 ? '11:24' : '09:08', bucket: 'today' as const })),
  ...YESTERDAY.map((r, i) => ({ id: r.id, title: r.title, snippet: r.preview, project: ['Identity & KYC', 'Bureau & SCR', 'Bureau & SCR', 'Consent & LGPD', 'Score & decisioning'][i % 5], when: ['Yesterday', 'Yesterday', '2d ago', '3d ago', '4d ago'][i % 5], bucket: i < 2 ? ('week' as const) : ('earlier' as const) })),
  { id: 'scr-latency', title: 'SCR query latency — 06/04 spike',          snippet: 'scpc-gateway p95 jumped after the feed contract change…', project: 'Bureau & SCR',  when: '2w ago', bucket: 'earlier' },
  { id: 'finops-q4',   title: 'Q4 cost review — Cloud Run rightsizing',   snippet: 'Cloud Run accounts for 18% of the platform bill…',        project: 'Cost & FinOps', when: '3w ago', bucket: 'earlier' },
];

const RECENT_QUERIES = ['p99 spike', 'konduto false positive', 'SCR latency', 'LGPD consent', 'cost review'];

const highlight = (text: string, q: string): React.ReactNode => {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (<>{text.slice(0, i)}<mark>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>);
};

const SearchView = ({ onOpen }: { onOpen: (id: string) => void }) => {
  const [q, setQ] = React.useState('');
  const matches = CORPUS.filter((r) => !q || r.title.toLowerCase().includes(q.toLowerCase()) || r.snippet.toLowerCase().includes(q.toLowerCase()));
  const buckets: { key: SearchResult['bucket']; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This week' },
    { key: 'earlier', label: 'Earlier' },
  ];

  return (
    <div className="fp-chat-search">
      <header className="fp-chat-search-head">
        <span className="eyebrow">Forge AI · Search</span>
        <h1>Search your chat history</h1>
        <p className="lede">Find an answer the assistant already gave, or jump back into a thread. Searches across every chat across every project.</p>
      </header>

      {/* Same DS search component as everywhere else, just the large (hero) size. */}
      <ChatSearch size="lg" value={q} onChange={setQ} placeholder="Search chats, messages, citations…" />

      <div className="fp-chat-search-recent">
        <span className="fp-chat-search-recent-label">Recent</span>
        <div className="fp-chat-search-recent-chips">
          {RECENT_QUERIES.map((rq) => (
            <button key={rq} className={'fp-chat-search-chip' + (q === rq ? ' is-active' : '')} onClick={() => setQ(rq)}>
              <Icons.clock size={11} />{rq}
            </button>
          ))}
        </div>
      </div>

      <div className="fp-chat-search-summary">
        {!q.trim()
          ? <><b>{matches.length}</b> chats across every project · type to filter</>
          : matches.length === 0
            ? <>No matches for <code>{q}</code></>
            : <><b>{matches.length}</b> {matches.length === 1 ? 'result' : 'results'} for <code>{q}</code></>}
      </div>

      {buckets.map((b) => {
        const rows = matches.filter((r) => r.bucket === b.key);
        if (rows.length === 0) return null;
        return (
          <section key={b.key} className="fp-chat-search-bucket">
            <div className="fp-chat-search-bucket-head"><span>{b.label}</span><span>{rows.length}</span></div>
            <ul className="fp-chat-search-rows">
              {rows.map((r) => (
                <li key={r.id}>
                  <button type="button" className="fp-chat-search-row" onClick={() => onOpen(r.id)}>
                    <span className="row-icon"><Icons.chat size={13} /></span>
                    <div className="row-body">
                      <div className="row-title">{highlight(r.title, q)}</div>
                      <div className="row-snippet">{highlight(r.snippet, q)}</div>
                      <div className="row-meta"><span>{r.project}</span><span className="dot">·</span><span>{r.when}</span></div>
                    </div>
                    <Icons.arrowUp size={12} className="row-chev" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {matches.length === 0 && (
        <div className="fp-chat-search-empty">
          <Icons.search size={28} />
          <p>No matches in your chat history.</p>
          <p className="hint">Try a different keyword or remove filters.</p>
        </div>
      )}
    </div>
  );
};

// ── View: Projects ──────────────────────────────────────────────────────────
type Project = { id: string; name: string; desc: string; icon: string; chats: number; docs: number; updated: string };

const PROJECTS: Project[] = [
  { id: 'score-decisioning', name: 'Score & decisioning', desc: 'Score serving, the Ignite feature store and the decision engine for credit risk.',        icon: 'gauge',      chats: 38, docs: 22, updated: '2h ago' },
  { id: 'fraud-risk',        name: 'Fraud & risk',        desc: 'Antifraud rules, device fingerprinting, velocity checks and chargeback models.',           icon: 'shield',     chats: 21, docs: 18, updated: '6h ago' },
  { id: 'bureau-scr',        name: 'Bureau & SCR',        desc: 'SCPC, Cadastro Positivo ingestion and Boa Vista bureau reconciliation against the SCR.',   icon: 'book',       chats: 17, docs: 41, updated: 'Yesterday' },
  { id: 'identity-kyc',      name: 'Identity & KYC',      desc: 'Identity proofing, document OCR, biometric match and watchlist screening.',                icon: 'lock',       chats: 12, docs: 12, updated: '2d ago' },
  { id: 'consent-lgpd',      name: 'Consent & LGPD',      desc: 'Consent scopes, data-subject requests and PII audit across the service catalog.',          icon: 'compliance', chats: 9,  docs: 27, updated: '3d ago' },
  { id: 'incident-library',  name: 'Incident library',    desc: 'Postmortems, RCA drafts and incident command runbooks for the bureau platform.',           icon: 'incident',   chats: 26, docs: 53, updated: '4d ago' },
  { id: 'runbooks',          name: 'Runbooks',            desc: 'Operational playbooks for every prod service — rollback, restore, throttle, replay.',      icon: 'pipeline',   chats: 5,  docs: 9,  updated: '6d ago' },
  { id: 'cost-finops',       name: 'Cost & FinOps',       desc: 'Cloud cost analysis, reserved-capacity planning and rightsizing recommendations.',         icon: 'cloud',      chats: 11, docs: 27, updated: '1w ago' },
];

const ProjectsView = ({ onOpen }: { onOpen: (id: string) => void }) => {
  const [q, setQ] = React.useState('');
  const filtered = PROJECTS.filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.desc.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="fp-chat-projects">
      <header className="fp-chat-projects-head">
        <div className="head-left">
          <span className="eyebrow">Forge AI · Projects</span>
          <h1>Your project workspaces</h1>
          <p className="lede">Group conversations, docs and runbooks by scope. Each project keeps its own context so the assistant grounds its answers in only the right files for that workspace.</p>
        </div>
        <button className="btn ember fp-chat-projects-create"><Icons.plus size={13} /> Create project</button>
      </header>

      <div className="fp-chat-projects-toolbar">
        <ChatSearch value={q} onChange={setQ} placeholder="Search projects…" className="fp-chat-projects-search" />
        <div className="fp-chat-projects-toolbar-end">
          <span className="fp-chat-projects-count">{filtered.length} {filtered.length === 1 ? 'project' : 'projects'}</span>
          <button className="btn sm outline"><span style={{ color: 'var(--fg-muted)' }}>Sort:</span><span>Recent activity</span><Icons.chevronDown size={11} /></button>
        </div>
      </div>

      <div className="fp-chat-projects-grid">
        {filtered.map((p) => {
          const I = ICON(p.icon);
          // Each tile opens its project detail. The three pinned spaces carry a
          // dedicated payload; the rest fall back to the Score & decisioning space.
          const TILE_TO_SPACE: Record<string, string> = { 'score-decisioning': 'space-score', 'fraud-risk': 'space-fraud', 'bureau-scr': 'space-bureau' };
          return (
            <button key={p.id} type="button" className="fp-chat-projects-card" onClick={() => onOpen(TILE_TO_SPACE[p.id] ?? 'space-score')}>
              <span className="ic"><I size={16} /></span>
              <div className="title">{p.name}</div>
              <div className="desc">{p.desc}</div>
              <div className="stats">
                <span><b>{p.chats}</b> chats</span><span className="dot">·</span>
                <span><b>{p.docs}</b> docs</span><span className="dot">·</span>
                <span className="updated">{p.updated}</span>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="fp-chat-projects-empty">
          <Icons.folder size={28} />
          <p>No projects match <code>{q}</code>.</p>
        </div>
      )}
    </div>
  );
};

// ── View: Project detail ────────────────────────────────────────────────────
type FileKind = 'xls' | 'doc' | 'pdf' | 'pptx' | 'csv';
const FILE_META: Record<FileKind, { label: string; bg: string; fg: string }> = {
  xls:  { label: 'XLS', bg: 'rgba(52, 211, 153, 0.14)', fg: '#34D399' },
  doc:  { label: 'DOC', bg: 'rgba(96, 165, 250, 0.16)', fg: '#60A5FA' },
  pdf:  { label: 'PDF', bg: 'rgba(248, 113, 113, 0.16)', fg: '#F87171' },
  pptx: { label: 'PPT', bg: 'rgba(251, 146, 60, 0.16)', fg: '#FB923C' },
  csv:  { label: 'CSV', bg: 'rgba(192, 132, 252, 0.16)', fg: '#C084FC' },
};

type ProjectPayload = {
  files: { kind: FileKind; name: string }[];
  instructions: string;
  chats: { id: string; title: string; preview: string; when: string }[];
};

const PROJECT_PAYLOAD: Record<string, ProjectPayload> = {
  'space-score': {
    files: [
      { kind: 'xls', name: 'score-slos.xlsx' },
      { kind: 'pdf', name: 'model-card-v7.pdf' },
      { kind: 'doc', name: 'decisioning runbook.docx' },
    ],
    instructions: 'Respond in a professional, concise tone. Ground answers in the Score & decisioning runbooks and prefer commands the on-call can paste. Never echo a raw CPF or CNPJ in examples.',
    chats: [
      { id: 'acerta-p99',   title: 'acerta-api p99 spike after v4.12',      preview: 'Correlated it with the konduto-antifraud deploy…',  when: '14:01' },
      { id: 'feature-lag',  title: 'ignite-feature-store freshness lag',    preview: 'Feature TTL is stale for the thin-file cohort…',    when: 'Yesterday' },
      { id: 'reason-codes', title: 'onescore-gateway reason-code mismatch', preview: 'Reason codes drift from the policy-studio map…',    when: '2d ago' },
      { id: 'shadow-v8',    title: 'score-engine v8 shadow results',        preview: 'AUC up 1.2 pts on the LATAM holdout…',              when: '3d ago' },
      { id: 'offer-flag',   title: 'offer-orchestrator cohort rollout',     preview: 'Suggest cohort 2 (10%) for tomorrow…',             when: '1w ago' },
    ],
  },
  'space-fraud': {
    files: [
      { kind: 'pdf', name: 'fraud-rules-v3.pdf' },
      { kind: 'doc', name: 'chargeback playbook.docx' },
      { kind: 'csv', name: 'fp-rate-2026Q1.csv' },
    ],
    instructions: 'Draft fraud-rule changes against the konduto-antifraud schema. Always state the expected false-positive impact and a rollback. Keep tone neutral and decisive.',
    chats: [
      { id: 'fraud-fp',     title: 'konduto-antifraud false-positive spike', preview: 'The new fraud-score rule is over-rejecting…', when: '09:14' },
      { id: 'device-drift', title: 'device-fingerprint coverage drop',       preview: 'iOS 18 drops the canvas signal…',            when: 'Yesterday' },
      { id: 'velocity',     title: 'velocity-check threshold tuning',        preview: 'Pix bursts trip the per-CPF limit…',         when: '4d ago' },
      { id: 'chargeback',   title: 'chargeback-classifier recall review',    preview: 'Recall dipped on the e-commerce segment…',   when: '1w ago' },
    ],
  },
  'space-bureau': {
    files: [
      { kind: 'doc', name: 'scpc-integration.docx' },
      { kind: 'doc', name: 'cadastro-positivo-spec.docx' },
      { kind: 'csv', name: 'reconciliation-2026Q1.csv' },
    ],
    instructions: 'Author bureau runbooks in the standard structure: Pre-flight → Cutover → Validation → Rollback. Reference the SCR layout and the Boa Vista feed contracts. Keep paragraphs under three sentences.',
    chats: [
      { id: 'cp-backfill', title: 'cadastro-positivo-ingestor backfill',  preview: 'Reprocess 14M CPFs from the SCR feed…',          when: '14:05' },
      { id: 'recon-break', title: 'bureau-reconciler mismatch on SCPC',   preview: 'Daily delta off by 0.3% since the feed change…', when: 'Yesterday' },
      { id: 'negativ',     title: 'negativation-writer idempotency review', preview: 'The retry handler is missing a dedup key…',     when: '3d ago' },
      { id: 'opendata',    title: 'boavista-opendata ingest drill',       preview: 'Backfill window is 24h max…',                    when: '5d ago' },
    ],
  },
};

const ProjectDetailView = ({ projectId, onBack, onOpenChat }: { projectId: string; onBack: () => void; onOpenChat: (id: string) => void }) => {
  const project = PINNED.find((p) => p.id === projectId) ?? PINNED[0];
  const payload = PROJECT_PAYLOAD[project.id] ?? PROJECT_PAYLOAD['space-score'];
  const [text, setText] = React.useState('');
  const [model, setModel] = React.useState('eidos-sonnet-4-6');
  const [banner, setBanner] = React.useState(true);
  const [starred, setStarred] = React.useState(false);

  return (
    <div className="fp-chat-pd">
      <button type="button" className="fp-chat-pd-back" onClick={onBack}>
        <Icons.arrowLeft size={13} /><span>All projects</span>
      </button>

      <header className="fp-chat-pd-header">
        <div className="fp-chat-pd-folder"><Icons.folder size={24} /></div>
        <div className="fp-chat-pd-title-block">
          <div className="title-row">
            <h1>{project.label}</h1>
            <span className="fp-chat-pd-pill" aria-label="Private project"><Icons.lock size={11} /> Private</span>
          </div>
          <p className="fp-chat-pd-sub">
            {payload.chats.length} {payload.chats.length === 1 ? 'chat' : 'chats'} · {payload.files.length} {payload.files.length === 1 ? 'file' : 'files'} · you and 4 others
          </p>
        </div>
        <div className="fp-chat-pd-actions">
          <button type="button" className={'fp-chat-pd-icon-btn' + (starred ? ' is-on' : '')} onClick={() => setStarred((v) => !v)} aria-pressed={starred} aria-label="Star project" title={starred ? 'Unstar' : 'Star'}>
            <Icons.star size={15} />
          </button>
          <button type="button" className="fp-chat-pd-icon-btn" aria-label="More options" title="More"><Icons.more size={16} /></button>
        </div>
      </header>

      <div className="fp-chat-pd-composer">
        <PromptInput
          status="ready"
          value={text}
          onChange={setText}
          onSubmit={() => setText('')}
          modelValue={model}
          onModelChange={setModel}
          placeholder="How can I help you today?"
          elevated
          topBanner={banner ? (
            <PromptBanner tone="promo" cta="Upgrade →" onDismiss={() => setBanner(false)}>Access premium models &amp; features</PromptBanner>
          ) : undefined}
          actions={[
            { id: 'upload', icon: 'upload',   label: 'Upload to this project' },
            { id: 'search', icon: 'search',   label: 'Deep search in catalog' },
            { id: 'tools',  icon: 'terminal', label: 'Run a tool' },
          ]}
        />
      </div>

      <section className="fp-chat-pd-meta" aria-label="Project context">
        <div className="fp-chat-pd-meta-col">
          <div className="fp-chat-pd-meta-head">
            <h3>Project files</h3>
            <span className="fp-chat-pd-meta-count">{payload.files.length} {payload.files.length === 1 ? 'file' : 'files'}</span>
          </div>
          <div className="fp-chat-pd-files">
            {payload.files.map((f) => {
              const meta = FILE_META[f.kind];
              return <span key={f.name} className="fp-chat-pd-file-chip" style={{ background: meta.bg, color: meta.fg }} title={f.name}>{meta.label}</span>;
            })}
            <button type="button" className="fp-chat-pd-file-add" aria-label="Add file" title="Add file"><Icons.plus size={13} /></button>
          </div>
        </div>

        <div className="fp-chat-pd-meta-sep" role="separator" />

        <div className="fp-chat-pd-meta-col">
          <div className="fp-chat-pd-meta-head">
            <h3>Instructions</h3>
            <button type="button" className="fp-chat-pd-icon-btn" aria-label="Edit instructions" title="Edit"><Icons.edit size={13} /></button>
          </div>
          <p className="fp-chat-pd-instructions">{payload.instructions}</p>
        </div>
      </section>

      <section className="fp-chat-pd-chats" aria-label="Chats in this project">
        <div className="fp-chat-pd-chats-head">
          <h3>Chats in this project</h3>
          <span className="fp-chat-pd-meta-count">{payload.chats.length}</span>
        </div>
        <ul className="fp-chat-pd-chats-list">
          {payload.chats.map((c) => (
            <li key={c.id}>
              <button type="button" className="fp-chat-pd-chat-row" onClick={() => onOpenChat(c.id)}>
                <span className="fp-chat-pd-chat-ico"><Icons.chat size={13} /></span>
                <span className="fp-chat-pd-chat-title">{c.title}</span>
                <span className="fp-chat-pd-chat-em">—</span>
                <span className="fp-chat-pd-chat-preview">{c.preview}</span>
                <span className="fp-chat-pd-chat-when">{c.when}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

// ── View: Archive ───────────────────────────────────────────────────────────
const ArchiveView = ({ onOpen }: { onOpen: (id: string) => void }) => {
  // Restoring un-archives a chat (rollback) — it leaves the archive list.
  const [restored, setRestored] = React.useState<Set<string>>(new Set());
  const [q, setQ] = React.useState('');
  const all = ARCHIVED.filter((c) => !restored.has(c.id));
  const rows = all.filter((c) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return c.title.toLowerCase().includes(s) || c.preview.toLowerCase().includes(s);
  });

  return (
    <div className="fp-chat-pane fp-chat-archive">
      <header className="fp-chat-pane-head">
        <span className="eyebrow">Forge AI · Archive</span>
        <h1>Archived chats</h1>
        <p className="lede">Conversations you&apos;ve put away. Restore one to roll it back into your active Chats list.</p>
      </header>

      {all.length > 0 && (
        <div className="fp-chat-arc-toolbar">
          <ChatSearch value={q} onChange={setQ} placeholder="Search archived chats…" className="fp-chat-arc-search" />
        </div>
      )}

      {all.length === 0 ? (
        <div className="fp-chat-pane-empty">
          <Icons.inbox size={26} />
          <p>No archived chats.</p>
          <p className="hint">Chats you archive will collect here.</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="fp-chat-pane-empty">
          <Icons.inbox size={26} />
          <p>No archived chats match &ldquo;{q.trim()}&rdquo;.</p>
        </div>
      ) : (
        <ul className="fp-chat-arc-list">
          {rows.map((c) => (
            <li key={c.id} className="fp-chat-arc-row">
              <span className="fp-chat-arc-ico" aria-hidden="true"><Icons.chat size={14} /></span>
              <button type="button" className="fp-chat-arc-body" onClick={() => onOpen(c.id)}>
                <span className="title">{c.title}</span>
                <span className="preview">{c.preview}</span>
              </button>
              <span className="fp-chat-arc-when">{c.when}</span>
              <button
                type="button"
                className="btn sm ghost fp-chat-arc-restore"
                onClick={() => setRestored((s) => new Set(s).add(c.id))}
                title="Restore — move back to Chats"
              >
                <Icons.undo size={13} /> Restore
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ── View: Artifacts ─────────────────────────────────────────────────────────
// Lightweight, self-contained previews per artifact kind (no network / no real
// files) so the gallery + viewer are demonstrable offline.
const HTML_SRC = `<!doctype html><html><head><meta charset="utf-8"><style>
  :root{color-scheme:dark}body{font:14px/1.5 system-ui,sans-serif;margin:0;background:#0b0b0d;color:#e7e7ea;padding:28px}
  .ok{color:#34d399}.bad{color:#f87171}h1{font-size:20px;margin:0 0 4px}.sub{color:#9b9ba3;margin:0 0 20px}
  .row{display:flex;justify-content:space-between;padding:11px 0;border-top:1px solid #ffffff14}
  .dot{display:inline-block;inline-size:8px;block-size:8px;border-radius:50%;margin-inline-end:8px}
  .pill{font:11px/1 ui-monospace,monospace;color:#08090a;background:#ff6b35;padding:3px 7px;border-radius:6px}
</style></head><body>
  <h1>Forge · Status</h1><p class="sub">Score &amp; Risk platform · updated 14:06 BRT</p>
  <div class="row"><span><span class="dot" style="background:#f87171"></span>acerta-api</span><span class="bad">Degraded · p99 240ms</span></div>
  <div class="row"><span><span class="dot" style="background:#34d399"></span>onescore-gateway</span><span class="ok">Operational</span></div>
  <div class="row"><span><span class="dot" style="background:#34d399"></span>score-engine</span><span class="ok">Operational</span></div>
  <div class="row"><span><span class="dot" style="background:#f87171"></span>konduto-antifraud</span><span class="bad">Degraded · v3.1.7</span></div>
  <p style="margin-top:22px"><span class="pill">INC-2041 · P2</span></p>
</body></html>`;

const APP_SRC = `<!doctype html><html><head><meta charset="utf-8"><style>
  :root{color-scheme:dark}body{font:14px/1.5 system-ui,sans-serif;margin:0;background:#111113;color:#e7e7ea;padding:24px}
  h1{font-size:16px;margin:0 0 16px}.card{background:#19191c;border:1px solid #ffffff14;border-radius:10px;padding:14px;margin-block-end:10px;display:flex;justify-content:space-between;align-items:center}
  .t{font-weight:600}.m{color:#9b9ba3;font-size:12px}button{font:600 12px system-ui;color:#08090a;background:#ff6b35;border:0;border-radius:7px;padding:7px 12px;cursor:pointer}
  button.gh{background:transparent;color:#e7e7ea;border:1px solid #ffffff20}
</style></head><body>
  <h1>False-positive triage</h1>
  <div class="card"><div><div class="t">tx_8841 · R$ 1.240,00</div><div class="m">score 0.92 · rule fraud-score-v3</div></div><div><button>Approve</button> <button class="gh" onclick="this.closest('.card').remove()">Reject</button></div></div>
  <div class="card"><div><div class="t">tx_8842 · R$ 89,90</div><div class="m">score 0.71 · rule velocity-cap</div></div><div><button>Approve</button> <button class="gh" onclick="this.closest('.card').remove()">Reject</button></div></div>
  <div class="card"><div><div class="t">tx_8843 · R$ 4.500,00</div><div class="m">score 0.88 · rule device-mismatch</div></div><div><button>Approve</button> <button class="gh" onclick="this.closest('.card').remove()">Reject</button></div></div>
</body></html>`;

const BREAKER_YAML = `# onescore-gateway — Resilience4j circuit breaker
resilience4j.circuitbreaker:
  instances:
    scpc:
      slidingWindowType: TIME_BASED
      slidingWindowSize: 30          # seconds
      failureRateThreshold: 50       # %
      slowCallDurationThreshold: 2s
      slowCallRateThreshold: 80      # %
      waitDurationInOpenState: 10s
      permittedNumberOfCallsInHalfOpenState: 5
      minimumNumberOfCalls: 20`;

const CSV_ROWS = [
  ['cpf_hash', 'bureau', 'scr_status', 'delta'],
  ['a91f…3c', 'boavista', 'matched', '0'],
  ['7b20…e1', 'scpc', 'mismatch', '+2'],
  ['c4d8…9a', 'boavista', 'matched', '0'],
  ['18ee…0f', 'scpc', 'missing', '−1'],
];

const ArtifactPreview = ({ a }: { a: ArtifactItem }) => {
  if (a.kind === 'image') {
    return (
      <div className="fp-art-image" role="img" aria-label={a.title}>
        <Icons.image size={44} />
        <span className="dims">SVG diagram · 920 × 360</span>
      </div>
    );
  }
  if (a.kind === 'document') {
    return (
      <Prose>
        <h2>Runbook — score-engine → Aurora migration</h2>
        <p><strong>Owners:</strong> score-platform · <strong>Window:</strong> Sun 02:00 UTC</p>
        <h3>1 · Pre-flight</h3>
        <ul>
          <li>Confirm RPO ≤ 5 min in the catalog SLO panel</li>
          <li>Take a logical backup → S3</li>
          <li>Notify <code>#release</code> 30 min before the window</li>
        </ul>
        <h3>2 · Cutover</h3>
        <ol>
          <li>Snapshot the source RDS instance</li>
          <li>Restore as an Aurora cluster from the snapshot</li>
          <li>Re-point the <code>score-engine</code> secret, rolling restart</li>
        </ol>
        <blockquote><strong>If any check fails, roll back.</strong> The rollback path is faster than the forward path inside the window.</blockquote>
      </Prose>
    );
  }
  if (a.kind === 'html') return <iframe className="fp-art-frame" srcDoc={HTML_SRC} title={a.title} sandbox="" />;
  if (a.kind === 'app') return <iframe className="fp-art-frame" srcDoc={APP_SRC} title={a.title} sandbox="allow-scripts" />;
  if (a.kind === 'code') return <ProseCode lang="yaml">{BREAKER_YAML}</ProseCode>;
  // data
  return (
    <table className="fp-art-table">
      <thead><tr>{CSV_ROWS[0].map((h) => <th key={h}>{h}</th>)}</tr></thead>
      <tbody>{CSV_ROWS.slice(1).map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><code className="mono">{c}</code></td>)}</tr>)}</tbody>
    </table>
  );
};

const ArtifactsView = ({ onOpenChat }: { onOpenChat: (id: string) => void }) => {
  const [sel, setSel] = React.useState<ArtifactItem | null>(null);
  const [mode, setMode] = React.useState<'grid' | 'list'>('grid');
  const [q, setQ] = React.useState('');
  const kind = sel ? ART_KIND[sel.kind] : null;

  const items = ARTIFACTS.filter((a) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return a.title.toLowerCase().includes(s) || ART_KIND[a.kind].label.toLowerCase().includes(s) || a.meta.toLowerCase().includes(s);
  });

  return (
    <div className="fp-chat-pane fp-chat-artifacts">
      <header className="fp-chat-pane-head">
        <span className="eyebrow">Forge AI · Artifacts</span>
        <h1>Artifacts</h1>
        <p className="lede">Everything Forge AI built for you — diagrams, docs, pages, apps, code and datasets. Open one to preview it and jump back to the chat that made it.</p>
      </header>

      {/* Toolbar — search (leading) · grid/list toggle (trailing). */}
      <div className="fp-chat-art-toolbar">
        <ChatSearch value={q} onChange={setQ} placeholder="Search artifacts…" className="fp-chat-art-search" />
        <ToggleGroup
          type="single"
          variant="default"
          value={mode}
          onValueChange={(v) => v && setMode(v as 'grid' | 'list')}
          aria-label="View mode"
          className="fp-chat-art-toggle"
        >
          <ToggleGroupItem value="grid" aria-label="Grid view"><Icons.grid size={12} /></ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view"><Icons.menu size={12} /></ToggleGroupItem>
        </ToggleGroup>
      </div>

      {items.length === 0 ? (
        <div className="fp-chat-pane-empty">
          <Icons.grid size={26} />
          <p>No artifacts match &ldquo;{q.trim()}&rdquo;.</p>
        </div>
      ) : mode === 'grid' ? (
        <div className="fp-chat-art-grid">
          {items.map((a) => {
            const k = ART_KIND[a.kind];
            const I = ICON(k.icon);
            return (
              <Card
                key={a.id}
                variant="elevated"
                interactive
                compact
                role="button"
                tabIndex={0}
                className="fp-chat-art-card"
                aria-label={`${a.title} — ${k.label}`}
                onClick={() => setSel(a)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(a); } }}
              >
                <CardMedia alt={`${k.label} artifact`} className="fp-chat-art-media" style={{ ['--art-accent']: k.fg } as React.CSSProperties}>
                  <span className="fp-chat-art-tag">{k.label}</span>
                  <span className="fp-chat-art-glyph"><I size={30} /></span>
                </CardMedia>
                <CardHeader>
                  <CardTitle as="h3">{a.title}</CardTitle>
                </CardHeader>
                <CardContent className="fp-chat-art-meta">{a.meta} · {a.created}</CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <ul className="fp-chat-art-list">
          {items.map((a) => {
            const k = ART_KIND[a.kind];
            const I = ICON(k.icon);
            return (
              <li key={a.id} className="fp-chat-art-row">
                <button type="button" className="fp-chat-art-row-btn" onClick={() => setSel(a)} aria-label={`${a.title} — ${k.label}`}>
                  <span className="fp-chat-art-row-ico" style={{ background: k.bg, color: k.fg }} aria-hidden="true"><I size={15} /></span>
                  <span className="fp-chat-art-row-body">
                    <span className="title">{a.title}</span>
                    <span className="sub">{k.label} · {a.meta}</span>
                  </span>
                  <span className="fp-chat-art-row-when">{a.created}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={!!sel}
        onOpenChange={(o) => { if (!o) setSel(null); }}
        size="xl"
        icon={kind ? ICON(kind.icon) : undefined}
        title={sel?.title}
        desc={sel ? `${kind?.label} · ${sel.meta} · created ${sel.created}` : undefined}
        className="fp-art-modal"
        footer={sel ? (
          <>
            <span className="fp-art-foot-src">
              From{' '}
              <button type="button" className="fp-art-foot-link" onClick={() => { onOpenChat(sel.chatId); setSel(null); }}>
                {sel.chatTitle}
              </button>
            </span>
            <span className="fp-art-foot-actions">
              <button type="button" className="btn sm outline"><Icons.copy size={13} /> Copy</button>
              <button type="button" className="btn sm outline"><Icons.download size={13} /> Download</button>
              <button type="button" className="btn sm ember" onClick={() => { onOpenChat(sel.chatId); setSel(null); }}>
                <Icons.chat size={13} /> Open chat
              </button>
            </span>
          </>
        ) : undefined}
      >
        {sel && <div className="fp-art-view">{<ArtifactPreview a={sel} />}</div>}
      </Modal>
    </div>
  );
};

// ── Root ────────────────────────────────────────────────────────────────────
export default function PortalChat() {
  const [nav, setNav] = React.useState<Nav>({ view: 'new' });
  const go = React.useCallback((n: Nav) => setNav(n), []);

  // Deep link from the Agents catalog: /portal/chat?agent=<id> opens a fresh
  // chat already scoped to that agent.
  const searchParams = useSearchParams();
  React.useEffect(() => {
    const agentId = searchParams.get('agent');
    if (agentId && AGENTS.some((a) => a.id === agentId)) setNav({ view: 'new', agentId });
  }, [searchParams]);

  // Surface the open chat's title in the topbar breadcrumb (Forge / Chat / …).
  const { setCrumb } = usePageCrumb();
  React.useEffect(() => {
    setCrumb(nav.view === 'thread' ? { label: findChatTitle(nav.chatId ?? 'acerta-p99') } : null);
    return () => setCrumb(null);
  }, [nav, setCrumb]);

  return (
    <div className="fp-chat">
      <ChatSidebar nav={nav} go={go} />
      <section className="fp-chat-main">
        {nav.view === 'new' && <NewChatView agent={AGENTS.find((a) => a.id === nav.agentId)} onSend={() => go({ view: 'thread', chatId: 'acerta-p99' })} />}
        {nav.view === 'thread' && <ThreadView chatId={nav.chatId ?? 'acerta-p99'} />}
        {nav.view === 'search' && <SearchView onOpen={(id) => go({ view: 'thread', chatId: id })} />}
        {nav.view === 'projects' && <ProjectsView onOpen={(id) => go({ view: 'project', projectId: id })} />}
        {nav.view === 'project' && <ProjectDetailView projectId={nav.projectId ?? 'space-score'} onBack={() => go({ view: 'projects' })} onOpenChat={(id) => go({ view: 'thread', chatId: id })} />}
        {nav.view === 'archive' && <ArchiveView onOpen={(id) => go({ view: 'thread', chatId: id })} />}
        {nav.view === 'artifacts' && <ArtifactsView onOpenChat={(id) => go({ view: 'thread', chatId: id })} />}
      </section>
    </div>
  );
}
