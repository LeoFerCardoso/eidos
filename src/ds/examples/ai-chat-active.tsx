'use client';
// Forge IDP — AI Chat (active thread).
//
// The page a user lands on after clicking a chat in the sidebar's Recents
// or Yesterday bucket. Reads ?chat=<id> from the URL, picks a title +
// thread body from a small mock catalog, and renders the rich-markdown
// conversation: Chain of Thought, Response prose (headings, table,
// blockquote, lists, code), inline Citations, Sources panel, streaming
// follow-up, docked composer.
import * as React from 'react';
import {
  Icons,
  PromptInput,
  Message, Response, MessageActions, ProseCode,
  ChainOfThought, Citation, Sources,
  Diagram, MathView,
} from '@/ds/core';
import { ChatShell, RECENTS, YESTERDAY, PINNED } from './chat-shell';

// ── Sources used by the Postgres demo ───────────────────────────────────
const SOURCES = [
  { id: 1, domain: 'aws.amazon.com',          title: 'Aurora PostgreSQL pricing & instance sizing',  url: 'https://aws.amazon.com/rds/aurora/pricing/',                     snippet: 'db.r7g.4xlarge runs $1.07/h on-demand · reserved 1-yr cuts ~37%.', fetched: '14:01 · 18s ago' },
  { id: 2, domain: 'engineering.example.com', title: 'Q1 2026 cost review — managed databases',     url: 'https://engineering.example.com/q1-2026-db-cost-review',         snippet: 'identity-svc and ledger-svc account for 62% of Aurora spend.',     fetched: '14:01 · 22s ago' },
  { id: 3, domain: 'cloud.google.com',        title: 'Cloud SQL for PostgreSQL — connection pooling guide', url: 'https://cloud.google.com/sql/docs/postgres/manage-connections', snippet: 'PgBouncer with transaction pooling is the recommended path.',     fetched: '14:02 · 41s ago' },
  { id: 4, domain: 'docs.percona.com',        title: 'PostgreSQL major-version upgrade playbook',   url: 'https://docs.percona.com/postgresql/major-upgrades',             snippet: 'pg_upgrade with --link cuts downtime to under 5 min for 1 TB.',   fetched: '14:02 · 47s ago' },
];

// Inline syntax-highlighting helper — renders the canonical .ai-code shell
// but accepts ALREADY-TOKENISED children (so we can paint keywords / strings /
// comments in different colours) while keeping a separate `raw` plain-text
// source for the Copy button. The DS doesn't bundle Shiki; this is the
// demo-grade fallback for hand-coloured snippets.
const HighlightedCode = ({
  lang,
  raw,
  children,
}: {
  lang: string;
  raw: string;
  children: React.ReactNode;
}) => {
  const [ok, setOk] = React.useState(false);
  const onCopy = async () => {
    try { await navigator.clipboard.writeText(raw); }
    catch {}
    setOk(true);
    setTimeout(() => setOk(false), 1200);
  };
  return (
    <div className="ai-code">
      <div className="ai-code-head">
        <span className="lang">{lang}</span>
        <span className="spacer"/>
        <button className="ai-code-copy" onClick={onCopy} aria-label="Copy code">
          {ok ? <Icons.check size={11}/> : <Icons.copy size={11}/>}
          {ok ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="ai-code-body">{children}</pre>
    </div>
  );
};

// Shorthand to reduce noise when writing tokenised snippets.
const K = ({ children }: { children: React.ReactNode }) => <span className="tok-key">{children}</span>;
const S = ({ children }: { children: React.ReactNode }) => <span className="tok-str">{children}</span>;
const N = ({ children }: { children: React.ReactNode }) => <span className="tok-num">{children}</span>;
const C = ({ children }: { children: React.ReactNode }) => <span className="tok-com">{children}</span>;
const F = ({ children }: { children: React.ReactNode }) => <span className="tok-fn">{children}</span>;
const T = ({ children }: { children: React.ReactNode }) => <span className="tok-typ">{children}</span>;

// Find a chat by id across all sidebar buckets — returns the title for
// the crumbs. Pinned spaces use their label as the thread title.
const findChat = (id: string) => {
  const pin = PINNED.find(p => p.id === id);
  if (pin) return pin.label;
  const all = [...RECENTS, ...YESTERDAY];
  const m = all.find(t => t.id === id);
  return m ? m.title : RECENTS[0].title;
};

const App = () => {
  // Read ?chat=<id> from the URL. Defaults to the first recent.
  const [chatId, setChatId] = React.useState<string>('pix-p95');
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = new URLSearchParams(window.location.search).get('chat');
    if (id) setChatId(id);
  }, []);
  const chatTitle = findChat(chatId);

  const [text, setText] = React.useState('');
  const [model, setModel] = React.useState('forge-opus-4-7');

  return (
    <ChatShell
      side="recent"
      activeChat={chatId}
      crumbs={['Forge', 'AI', 'Recents', chatTitle]}
    >
      <div className="aic-thread">
        <div className="msg-thread fluid">
          {/* User turn 1 */}
          <Message
            from="user"
            meta={<><span className="t-mono-label">You</span> · 14:01</>}
          >
            Compare our three production Postgres databases and recommend which
            one to migrate to Aurora first this quarter — I care about cost,
            downtime, and blast radius.
          </Message>

          {/* Assistant turn — chain of thought + rich response */}
          <Message
            from="assistant"
            meta={
              <>
                <span className="t-mono-label">Forge AI</span> ·
                <span style={{ color: 'var(--fg-faint)', marginInlineStart: 6 }}>Opus 4.7</span>
                <span style={{ color: 'var(--fg-faint)', marginInlineStart: 6 }}>· 14:02</span>
              </>
            }
            actions={
              <MessageActions
                surface="message"
                onCopy={() => {}}
                onRegen={() => {}}
                vote={null}
                onVote={() => {}}
              />
            }
          >
            <div style={{ marginBottom: 14 }}>
              <ChainOfThought
                defaultOpen
                title="Chain of thought"
                steps={[
                  { kind: 'read',    label: 'Loaded service catalog',                detail: 'identity-svc, ledger-svc, billing-svc — all Postgres 14, multi-AZ on RDS' },
                  { kind: 'search',  label: 'Pulled Q1 cost review',                 detail: 'Found managed-db costs broken down per service · last 90 days' },
                  { kind: 'observe', label: 'Compared traffic + write volume',      detail: 'billing-svc writes 4× more than ledger-svc; identity-svc is read-heavy' },
                  { kind: 'plan',    label: 'Drafted a low-risk migration order',  detail: 'Read-heavy first → cheapest downtime profile; defer billing-svc' },
                ]}
              />
            </div>

            <Response from="assistant">
              <h3>Recommendation: migrate <code>identity-svc</code> first</h3>
              <p>
                Across the three databases <code>identity-svc</code> has the
                <strong> highest read-to-write ratio</strong> (≈ 28:1 last 30
                days), which makes it the lowest-risk migration target — Aurora&apos;s
                replica-first failover keeps the cutover under one minute
                <Citation n={1} source={SOURCES[0]}/>. Cost-wise it&apos;s already
                the second-biggest line in our managed-db spend
                <Citation n={2} source={SOURCES[1]}/>, so the saving is material.
              </p>

              <h4>Comparison</h4>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Service</th>
                    <th scope="col">Class</th>
                    <th scope="col">Storage</th>
                    <th scope="col">Writes / s</th>
                    <th scope="col">Monthly cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><code>identity-svc</code></td><td>db.r7g.4xl</td><td>820 GB</td><td>~120</td><td>$2,140</td></tr>
                  <tr><td><code>ledger-svc</code></td><td>db.r7g.8xl</td><td>1.6 TB</td><td>~320</td><td>$3,810</td></tr>
                  <tr><td><code>billing-svc</code></td><td>db.r7g.8xl</td><td>2.1 TB</td><td>~1,250</td><td>$4,260</td></tr>
                </tbody>
              </table>

              <blockquote>
                <strong>Heads up.</strong> <code>billing-svc</code> is the largest
                line item but also the riskiest — its write volume needs a
                connection-pooling rework before the cutover
                <Citation n={3} source={SOURCES[2]}/>. Defer it until Q3 once
                PgBouncer is in front.
              </blockquote>

              <h4>Suggested migration order</h4>
              <ol>
                <li><strong>identity-svc</strong> — read-heavy, smallest write throughput. Plan for a 60-second cutover using <code>pg_upgrade --link</code><Citation n={4} source={SOURCES[3]}/>.</li>
                <li><strong>ledger-svc</strong> — write-medium, 1.6 TB. Run a week-long replication shadow against Aurora first.</li>
                <li><strong>billing-svc</strong> — <em>last</em>. Roll out PgBouncer in front, then re-evaluate.</li>
              </ol>

              <h4>Pre-flight checks</h4>
              <ul>
                <li>Confirm <code>identity-svc</code> RPO ≤ 5 min in the runbook</li>
                <li>Take a logical backup the night before</li>
                <li>Schedule the cutover during the maintenance window (Sun 02:00 UTC)</li>
                <li>Set up the Aurora CloudWatch alarms (replica lag, ACU)</li>
              </ul>

              <h4>Run the migration</h4>
              <ProseCode lang="bash">{`# 1. Snapshot the source
aws rds create-db-snapshot \\
  --db-instance-identifier identity-svc-prod \\
  --db-snapshot-identifier identity-svc-pre-aurora

# 2. Restore as an Aurora cluster
aws rds restore-db-cluster-from-snapshot \\
  --db-cluster-identifier identity-svc-aurora \\
  --snapshot-identifier identity-svc-pre-aurora \\
  --engine aurora-postgresql

# 3. Cut over (update the secret, rolling restart)
forge cli release identity-svc --db aurora`}</ProseCode>

              <p>
                Estimated saving for <code>identity-svc</code> alone is around
                <strong> $580/month</strong> after the 1-year reserved-instance
                discount. Want me to draft the migration runbook?
              </p>
            </Response>

            <div style={{ marginTop: 14 }}>
              <Sources sources={SOURCES} title="Sources" defaultOpen={false}/>
            </div>
          </Message>

          <Message
            from="user"
            meta={<><span className="t-mono-label">You</span> · 14:05</>}
          >
            Got it. Add the math for the expected p99 win, a sequence diagram of
            the cutover, and translate the rollback summary into pt-BR + 日本語
            for the LATAM and APAC oncalls.
          </Message>

          {/* Rich-features final response — exercises Math (block + inline),
              a Mermaid sequence diagram (inline SVG slotted into the core
              Diagram component), CJK rendering, and a comparison table. No
              streaming caret — this is the canonical "answer ready" state. */}
          <Message
            from="assistant"
            meta={
              <>
                <span className="t-mono-label">Forge AI</span> ·
                <span style={{ color: 'var(--fg-faint)', marginInlineStart: 6 }}>Opus 4.7</span>
                <span style={{ color: 'var(--fg-faint)', marginInlineStart: 6 }}>· 14:06</span>
              </>
            }
            actions={
              <MessageActions
                surface="message"
                onCopy={() => {}}
                onRegen={() => {}}
                vote={null}
                onVote={() => {}}
              />
            }
          >
            <Response from="assistant">
              <h3>Expected p99 win — the math</h3>
              <p>
                With Aurora&apos;s replica-first failover (RTO ≈ 60 s) the
                contribution of cutover stalls to the monthly p99 collapses
                roughly an order of magnitude. Modelling tail latency:
              </p>
              <MathView display>
                <strong>p<sub>99</sub>(month)</strong> = max(<em>p<sub>99</sub>(baseline)</em>, <em>T<sub>cutover</sub></em>)
              </MathView>
              <p>
                gives a baseline p99 of <code>320 ms</code> and a cutover-bound
                ceiling of <MathView><em>T<sub>cutover</sub></em> ≈ 60 000 ms</MathView>{' '}
                under RDS multi-AZ; Aurora drops <MathView><em>T<sub>cutover</sub></em></MathView>{' '}
                to ≈ <strong>1 000 ms</strong>, so the monthly p99 returns to
                the baseline three full nines below the old worst-case spike.
              </p>

              <h3>Cutover sequence</h3>
              <Diagram caption="Sequence — identity-svc → Aurora cutover during the Sun 02:00 UTC window">
                <svg viewBox="0 0 560 220" role="img" aria-label="Cutover sequence diagram" style={{ inlineSize: '100%', blockSize: 'auto' }}>
                  <defs>
                    <marker id="aha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/>
                    </marker>
                  </defs>
                  {/* lifelines */}
                  {[
                    { x: 70,  label: 'CLI' },
                    { x: 200, label: 'RDS' },
                    { x: 330, label: 'Secret' },
                    { x: 460, label: 'svc' },
                  ].map(l => (
                    <g key={l.label}>
                      <rect x={l.x - 36} y="10" width="72" height="22" rx="4" fill="var(--bg-elevated)" stroke="var(--border)"/>
                      <text x={l.x} y="25" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg)">{l.label}</text>
                      <line x1={l.x} y1="34" x2={l.x} y2="200" stroke="var(--border)" strokeDasharray="3 3"/>
                    </g>
                  ))}
                  {/* messages */}
                  <g stroke="var(--ember)" fill="var(--ember)">
                    <line x1="70" y1="60" x2="200" y2="60" markerEnd="url(#aha)"/>
                    <text x="135" y="55" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--ember)">create-db-snapshot</text>
                  </g>
                  <g stroke="var(--fg-muted)" fill="var(--fg-muted)">
                    <line x1="200" y1="100" x2="70" y2="100" markerEnd="url(#aha)"/>
                    <text x="135" y="95" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-muted)">snapshot-id</text>
                  </g>
                  <g stroke="var(--ember)" fill="var(--ember)">
                    <line x1="70" y1="140" x2="330" y2="140" markerEnd="url(#aha)"/>
                    <text x="200" y="135" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--ember)">rotate secret → aurora endpoint</text>
                  </g>
                  <g stroke="var(--success, #34D399)" fill="var(--success, #34D399)">
                    <line x1="330" y1="180" x2="460" y2="180" markerEnd="url(#aha)"/>
                    <text x="395" y="175" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--success, #34D399)">rolling restart</text>
                  </g>
                </svg>
              </Diagram>

              <h3>Comparison — quick recap</h3>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">RDS multi-AZ</th>
                    <th scope="col">Aurora (target)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Cutover RTO</td><td>~60 s</td><td>≤ 1 s</td></tr>
                  <tr><td>Replica lag</td><td>200–500 ms</td><td>20–80 ms</td></tr>
                  <tr><td>Cost / month</td><td>$2,140</td><td>~$1,560</td></tr>
                </tbody>
              </table>

              <h3>Rollback summary — multi-locale</h3>
              <p>
                For the on-call comms templates, here&apos;s the rollback line in
                the three locales we need:
              </p>
              <ul>
                <li><strong>EN.</strong> <em>If any check fails, restore the original RDS endpoint in the secret and roll back. Snapshot is retained for 30 days.</em></li>
                <li lang="pt-BR"><strong>PT-BR.</strong> <em>Se algum check falhar, restaure o endpoint RDS original no secret e faça o rollback. O snapshot fica retido por 30 dias.</em></li>
                <li lang="ja"><strong>日本語.</strong> <em>チェックに失敗した場合、シークレット内の元の RDS エンドポイントを復元し、ロールバックしてください。スナップショットは 30 日間保持されます。</em></li>
                <li lang="zh-Hans"><strong>简体中文.</strong> <em>如果任何检查失败,请将密钥中的 RDS 端点恢复为原始值并回滚。快照保留 30 天。</em></li>
              </ul>

              <h3>Validation queries</h3>
              <p>
                Run these against the Aurora cluster post-cutover to confirm
                consistency with the source. The numbers should match within
                the replication-lag window (≤ 200 ms).
              </p>
              <HighlightedCode
                lang="sql"
                raw={`-- identity-svc post-cutover validation
SELECT count(*) AS active_sessions
FROM   identity.sessions
WHERE  expires_at > now()
  AND  revoked_at IS NULL;

-- per-tenant token issue rate, last hour
SELECT tenant_id,
       count(*)            AS issued,
       avg(extract(epoch FROM (issued_at - requested_at))) AS avg_latency_s
FROM   identity.token_log
WHERE  issued_at >= now() - interval '1 hour'
GROUP  BY tenant_id
ORDER  BY issued DESC
LIMIT  20;`}
              >
                <C>{`-- identity-svc post-cutover validation`}</C>{'\n'}
                <K>SELECT</K> <F>count</F>(<K>*</K>) <K>AS</K> active_sessions{'\n'}
                <K>FROM   </K>identity.sessions{'\n'}
                <K>WHERE  </K>expires_at <K>&gt;</K> <F>now</F>(){'\n'}
                {'  '}<K>AND  </K>revoked_at <K>IS NULL</K>;{'\n'}
                {'\n'}
                <C>{`-- per-tenant token issue rate, last hour`}</C>{'\n'}
                <K>SELECT</K> tenant_id,{'\n'}
                {'       '}<F>count</F>(<K>*</K>){'            '}<K>AS</K> issued,{'\n'}
                {'       '}<F>avg</F>(<F>extract</F>(<T>epoch</T> <K>FROM</K> (issued_at <K>-</K> requested_at))) <K>AS</K> avg_latency_s{'\n'}
                <K>FROM   </K>identity.token_log{'\n'}
                <K>WHERE  </K>issued_at <K>&gt;=</K> <F>now</F>() <K>-</K> <K>interval</K> <S>{`'1 hour'`}</S>{'\n'}
                <K>GROUP  BY</K> tenant_id{'\n'}
                <K>ORDER  BY</K> issued <K>DESC</K>{'\n'}
                <K>LIMIT  </K><N>20</N>;
              </HighlightedCode>

              <h3>Final cutover command</h3>
              <ProseCode lang="bash">{`# Run as identity-platform during the Sun 02:00 UTC window
forge cli release identity-svc \\
  --db aurora \\
  --secret-rotate aurora-prod \\
  --canary 5% --soak 10m`}</ProseCode>

              <p>
                Anything else — comms template, runbook PR, or want me to update
                the catalog card directly?
              </p>
            </Response>
          </Message>
        </div>

        <div className="aic-thread-foot">
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
            footerHint={<>AI can make mistakes — please double-check important answers.</>}
          />
        </div>
      </div>

      <style>{`
        .aic-thread {
          display: flex; flex-direction: column;
          min-block-size: 100%;
        }
        .aic-thread > .msg-thread {
          flex: 1 1 auto;
          inline-size: 100%;
          max-inline-size: 820px;
          margin-inline: auto;
          padding: 28px 24px 24px;
        }
        .aic-thread-foot {
          position: sticky;
          inset-block-end: 0;
          inline-size: 100%;
          padding: 14px 24px 18px;
          background: var(--bg);
          display: flex; justify-content: center;
        }
        .aic-thread-foot::before {
          content: '';
          position: absolute;
          inset-inline: 0;
          inset-block-end: 100%;
          block-size: 28px;
          background: linear-gradient(to top, var(--bg) 0%, transparent 100%);
          pointer-events: none;
        }
        .aic-thread-foot > .pi-shell { max-inline-size: 760px; }
      `}</style>
    </ChatShell>
  );
};

export default App;
