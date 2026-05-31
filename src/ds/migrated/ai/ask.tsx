'use client';
// Forge AI — Ask. The agent turns the question around: instead of guessing,
// it asks the user with selectable options. Stepped flow only — single-
// or multi-select, free-text "other" escape, skippable questions, back/
// keyboard nav, restartable completion.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, CodeBlock, AutoPropsTable, PropsTable, installTabs, Lede, AskUser, Message, Mono } from '@/ds/core';

// ── inline style consts (no hand-rolled font sizes for prose) ────────────────

// ════════════════════════════════════════════════════════════════════════
// HERO question bank — 5 questions mixing every variant the component
// supports. This is the demo the doc opens with — play through it and
// every mechanic shows up at least once.
// ════════════════════════════════════════════════════════════════════════
const HERO_Qs = [
  {
    id: 'h-runtime',
    title: 'What runtime should the service use?',
    header: 'Runtime',
    // single-select (no multiSelect) — clicking auto-advances
    options: [
      { id: 'go',     title: 'Go',         description: 'Low overhead, fast cold starts, strong concurrency.' },
      { id: 'node',   title: 'Node.js',    description: 'Large ecosystem, event-loop I/O.' },
      { id: 'python', title: 'Python',     description: 'Great for data pipelines and ML workloads.' },
      { id: 'java',   title: 'Java / JVM', description: 'Mature ecosystem, JIT-warm throughput.' },
    ],
  },
  {
    id: 'h-features',
    title: 'Which features should be enabled on the service?',
    header: 'Features',
    multiSelect: true,
    options: [
      { id: 'audit',    title: 'Audit log',         description: 'Tamper-evident record of every state change.' },
      { id: 'rbac',     title: 'Role-based access', description: 'Gate operations behind assigned roles.' },
      { id: 'metrics',  title: 'Prometheus metrics', description: 'Expose /metrics for scraping.' },
      { id: 'tracing',  title: 'OTEL tracing',       description: 'Emit spans to an OpenTelemetry collector.' },
    ],
  },
  {
    id: 'h-db',
    title: 'Which datastore fits the write pattern?',
    header: 'Datastore',
    options: [
      { id: 'pg',    title: 'PostgreSQL',  description: 'ACID transactions, rich query language.' },
      { id: 'redis', title: 'Redis',       description: 'In-memory, sub-ms, caches + queues.' },
      { id: 'kafka', title: 'Kafka',       description: 'Durable log for event-driven pipelines.' },
    ],
  },
  {
    id: 'h-slo',
    title: 'What is your target p99 latency SLO?',
    header: 'Latency SLO',
    skippable: true,
    options: [
      { id: 'lt100', title: 'Under 100 ms',  description: 'Tight — requires careful infra sizing.' },
      { id: 'lt500', title: '100–500 ms',    description: 'Standard for most platform services.' },
      { id: 'lt1s',  title: '500 ms – 1 s',  description: 'Acceptable for batch or background tasks.' },
    ],
  },
  {
    id: 'h-deploy',
    title: 'Where will this service be deployed?',
    header: 'Deployment',
    allowOther: true,
    otherPlaceholder: 'Somewhere else — describe…',
    options: [
      { id: 'k8s',    title: 'Kubernetes',      description: 'Container-orchestrated — standard for Forge services.' },
      { id: 'lambda', title: 'AWS Lambda',     description: 'Serverless — pay per invoke.' },
      { id: 'vm',     title: 'VM / bare metal', description: 'Full control, needed for GPU or high-IO workloads.' },
    ],
  },
];

// ── single-purpose banks (re-used by variant Frames) ─────────────────────
const AUTH_Q = [{
  id: 'auth',
  title: 'Which authentication method should the service use?',
  header: 'Auth method',
  options: [
    { id: 'jwt',     title: 'JWT (stateless)',  description: 'Compact tokens signed by your auth service. Best for microservices.' },
    { id: 'session', title: 'Server sessions',  description: 'Session IDs stored server-side. Best for monolithic apps with Redis.' },
    { id: 'oauth',   title: 'OAuth 2.0 / OIDC', description: 'Delegate auth to an external provider.' },
    { id: 'apikey',  title: 'API key',          description: 'Shared secret passed as a header. Good for M2M.' },
  ],
}];

const FEATURES_Q = [{
  id: 'features',
  title: 'Which features should be enabled on this service?',
  header: 'Features',
  multiSelect: true,
  options: [
    { id: 'audit',   title: 'Audit log',         description: 'Tamper-evident record of every state change.' },
    { id: 'rbac',    title: 'Role-based access', description: 'Gate operations behind assigned roles.' },
    { id: 'metrics', title: 'Prometheus metrics', description: 'Expose /metrics for scraping.' },
    { id: 'tracing', title: 'OTEL tracing',       description: 'Emit spans to an OpenTelemetry collector.' },
  ],
}];

const OTHER_Q = [{
  id: 'rationale',
  title: 'Why do you need a custom rate-limit strategy?',
  header: 'Rate limit',
  allowOther: true,
  otherPlaceholder: 'Describe your traffic pattern…',
  options: [
    { id: 'burst',   title: 'Burst traffic',    description: 'Short spikes tolerated; throttle sustained load.' },
    { id: 'fairuse', title: 'Per-tenant quotas', description: 'Each tenant gets a separate bucket.' },
    { id: 'tiers',   title: 'Tier-based limits', description: 'Free / Pro / Enterprise get different caps.' },
  ],
}];

const SKIP_Q = [{
  id: 'slo',
  title: 'What is your target p99 latency SLO?',
  header: 'Latency SLO',
  skippable: true,
  options: [
    { id: 'lt100', title: 'Under 100 ms', description: 'Tight — requires careful infra sizing.' },
    { id: 'lt500', title: '100–500 ms',   description: 'Standard for most platform services.' },
    { id: 'lt1s',  title: '500 ms – 1 s', description: 'Acceptable for batch or background tasks.' },
  ],
}];

// Helper — a remount-key wrapper so a Frame demo can "reset" the AskUser on demand.
// Pass hideReset when embedding inside a Message bubble (the reset button
// would otherwise sit inside the bubble, which reads wrong).
function ReplayableAsk(
  { hideReset, ...props }: React.ComponentProps<typeof AskUser> & { resetKey?: any; hideReset?: boolean }
) {
  const [k, setK] = React.useState(0);
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <AskUser
        key={k + ':' + String(props.resetKey ?? '')}
        {...props}
        onComplete={(answers) => { props.onComplete?.(answers); /* keep summary visible until reset */ }}
      />
      {!hideReset && (
        <div style={{ marginBlockStart: 14, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => setK((v) => v + 1)}
            className="btn outline xs"
            style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-muted)' }}
          >Reset demo</button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
//  Page
// ────────────────────────────────────────────────────────────────────────
export default function AiAskPage() {
  return (
    <Section
      id="ask"
      num="11"
      title="Ask"
      desc="The agent turns the question around: instead of guessing, it asks the user with selectable options — reach for it when the query is ambiguous and clarification is faster than a wrong answer."
    >
      {/* ── 1. INSTALLATION ───────────────────────────────────────────────── */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-ask')} ariaLabel="package manager"/>
      <Lede>Each question offers 2–5 options with optional multi-select, an inline free-text escape, and a skip — a stepped flow that narrows intent without a full form.</Lede>
      <Lede>
        Ships <Mono>AskUser</Mono>, the <Mono>AskQuestion</Mono> /
        <Mono>AskOption</Mono> shapes, and the <Mono>AskAnswer</Mono>{' '}
        callback type. Pure component — no deps beyond React.
      </Lede>

      {/* ── 2. HERO — interactive full flow ──────────────────────────────── */}
      <SubHead meta="play through it">Interactive flow</SubHead>
      <Lede>
        Five questions covering every variant the component handles: single-select that
        auto-advances, multi-select with a Next button, allowOther free-text escape, and a
        skippable question. Use the mouse, the <Mono>1–9</Mono> number keys, or{' '}
        <Mono>↑/↓ + Enter</Mono>; press <Mono>⌃↵</Mono> to advance
        the multi-select; the "Back" link returns to any earlier question.
      </Lede>
      <Frame label="full 5-question intake — single · multi · other · skippable · single+other" height={520}>
        <ReplayableAsk questions={HERO_Qs}/>
      </Frame>

      {/* VARIANTS head */}
      <div className="ds-examples-rule" style={{ marginBlockStart: 40, marginBlockEnd: 6 }}>
        <span className="t-mono-label">Variants</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      {/* ── 3. SINGLE-SELECT ─────────────────────────────────────────────── */}
      <SubHead meta="auto-advance">Single-select</SubHead>
      <Frame
        label="One choice — clicking commits and the next question lands"
        code={`<AskUser questions={[{
  id: 'auth',
  title: 'Which auth method should the service use?',
  header: 'Auth method',
  options: [
    { id: 'jwt',     title: 'JWT (stateless)',  description: '…' },
    { id: 'session', title: 'Server sessions',  description: '…' },
    { id: 'oauth',   title: 'OAuth 2.0 / OIDC', description: '…' },
    { id: 'apikey',  title: 'API key',          description: '…' },
  ],
}]}/>`}
        height={400}
      >
        <ReplayableAsk questions={AUTH_Q}/>
      </Frame>
      <Lede>
        A single-select question auto-advances after a short beat — long enough to see the
        selected fill confirm before the next question slides in. The completed summary
        shows what you picked + a Restart link.
      </Lede>

      {/* ── 4. MULTI-SELECT ──────────────────────────────────────────────── */}
      <SubHead meta="checkbox + Next">Multi-select</SubHead>
      <Frame
        label="Toggle several options · disabled Next until at least one is chosen"
        code={`<AskUser questions={[{
  id: 'features',
  title: 'Which features should be enabled on this service?',
  header: 'Features',
  multiSelect: true,
  options: [ … ],
}]}/>`}
        height={420}
      >
        <ReplayableAsk questions={FEATURES_Q}/>
      </Frame>
      <Lede>
        Multi-select replaces the auto-advance with an explicit ember <b>Continue</b> /{' '}
        <b>Finish</b> button. The Continue is disabled until the user has picked at least
        one option (or typed in the "other" input). <Mono>⌃↵</Mono> submits the
        current question once a selection is in.
      </Lede>

      {/* ── 5. WITH OTHER ────────────────────────────────────────────────── */}
      <SubHead meta="free-text escape">With "Other"</SubHead>
      <Frame
        label="allowOther — typing in the input auto-selects the row"
        code={`<AskUser questions={[{
  id: 'rationale',
  title: 'Why do you need a custom rate-limit strategy?',
  header: 'Rate limit',
  allowOther: true,
  otherPlaceholder: 'Describe your traffic pattern…',
  options: [ … ],
}]}/>`}
        height={400}
      >
        <ReplayableAsk questions={OTHER_Q}/>
      </Frame>
      <Lede>
        The "other" row is always visible. Typing in it auto-activates it as the selection
        — Continue becomes enabled. Use sparingly: if you find yourself adding "other" to
        every question, your option set is wrong.
      </Lede>

      {/* ── 6. SKIPPABLE ─────────────────────────────────────────────────── */}
      <SubHead meta="optional answer">Skippable</SubHead>
      <Frame
        label="skippable: true — the header gets a Skip link"
        code={`<AskUser questions={[{
  id: 'slo',
  title: 'What is your target p99 latency SLO?',
  header: 'Latency SLO',
  skippable: true,
  options: [ … ],
}]}
  onSkip={(qId) => console.log('skipped', qId)}
/>`}
        height={380}
      >
        <ReplayableAsk questions={SKIP_Q}/>
      </Frame>
      <Lede>
        Skip records the answer as <Mono>{`{ skipped: true, selectedIds: [] }`}</Mono>{' '}
        and advances. <Mono>onSkip(questionId)</Mono> fires alongside so the consumer
        can log it. Reserve Skip for questions where "no answer" is itself a meaningful signal —
        not as an out for badly-scoped questions.
      </Lede>

      {/* ── 7. IN CONTEXT ────────────────────────────────────────────────── */}
      <SubHead meta="inside a Message">In context</SubHead>
      <Frame label="AskUser dropped into an assistant Message bubble" height={460}>
        <div style={{ width: '100%', maxWidth: 620 }}>
          <Message from="assistant" meta={<>Forge AI · 14:02</>}>
            I have a couple of clarifying questions before I scaffold the service.
            <div style={{ marginTop: 14 }}>
              <ReplayableAsk questions={AUTH_Q} hideReset/>
            </div>
          </Message>
        </div>
      </Frame>

      {/* ── 8. ACCESSIBILITY ─────────────────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            <code style={{ fontFamily: 'var(--font-mono)' }}>1</code>–<code style={{ fontFamily: 'var(--font-mono)' }}>9</code> pick an option directly.
            <code style={{ fontFamily: 'var(--font-mono)' }}> ↑</code> / <code style={{ fontFamily: 'var(--font-mono)' }}>↓</code> move the focused option;
            <code style={{ fontFamily: 'var(--font-mono)' }}> Enter</code> selects it.
            <code style={{ fontFamily: 'var(--font-mono)' }}> ⌃↵</code> advances a multi-select question.
            <code style={{ fontFamily: 'var(--font-mono)' }}> Back</code> returns one step. The "other" input is a real
            text field; while focused, number keys are typed (not used as quick-pick).
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The form has <code style={{ fontFamily: 'var(--font-mono)' }}>role="form"</code>;
            single-select options are real <code style={{ fontFamily: 'var(--font-mono)' }}>role="radio"</code> in a
            <code style={{ fontFamily: 'var(--font-mono)' }}> radiogroup</code> labelled by the question; multi-select uses
            <code style={{ fontFamily: 'var(--font-mono)' }}> role="checkbox"</code>. The question title is a real
            <code style={{ fontFamily: 'var(--font-mono)' }}> &lt;h3&gt;</code>, the step counter and topic are
            sans muted text (not a chip), and the disabled Continue button announces its disabled state.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Selection is communicated by an <code style={{ fontFamily: 'var(--font-mono)' }}>--ember-soft</code> fill PLUS a
            2px ember inset bar on the leading edge — never colour alone. The CTA is ember with dark-ink fg
            (contrast invariant). Focus-visible draws a 1.5px ember inner ring on the option.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The cross-fade + slight translate between questions and the progress-bar fill respect{' '}
            <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code> — under it, transitions are
            instant. The auto-advance beat is independent of motion (it's a confirmation pause, not animation).
          </div>
        </div>
      </div>

      {/* ── 9. RTL ───────────────────────────────────────────────────────── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — Skip and Continue mirror; back arrow flips" height={360}>
        <div dir="rtl" style={{ width: '100%' }}>
          <ReplayableAsk questions={[{
            id: 'rtl-auth',
            title: 'ما طريقة المصادقة التي يجب أن تستخدمها الخدمة؟',
            header: 'المصادقة',
            options: [
              { id: 'jwt', title: 'JWT', description: 'رموز موقعة بدون حالة.' },
              { id: 'session', title: 'الجلسات', description: 'معرفات الجلسة المخزنة على الخادم.' },
              { id: 'oauth', title: 'OAuth 2.0', description: 'تفويض إلى مزود خارجي.' },
            ],
          }]}/>
        </div>
      </Frame>
      <Lede>
        All layout uses logical CSS properties — the topic chip, "Question N of M", Skip link,
        Back link and the Continue arrow all flip automatically. The keyboard hint and the
        number badge per option stay LTR (they are inputs from a Latin keyboard).
      </Lede>

      {/* ── 10. ANATOMY ──────────────────────────────────────────────────── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', maxWidth: 460, width: '100%' }} aria-hidden="true">
              <AskUser
                questions={[{
                  id: 'ana',
                  title: 'Which authentication method should the service use?',
                  header: 'Auth method',
                  skippable: true,
                  options: [
                    { id: 'jwt', title: 'JWT (stateless)', description: 'Compact tokens signed by your auth service.' },
                    { id: 'sess', title: 'Server sessions', description: 'Session IDs stored server-side.' },
                  ],
                }]}
              />
              {/* pins */}
              <span className="lead h" style={{ top: 0, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: -8, right: -54 }}>1</div>

              <span className="lead v" style={{ top: -22, left: 14, height: 18 }}/>
              <div className="pin" style={{ top: -42, left: 14, transform: 'translateX(-50%)' }}>2</div>

              <span className="lead h" style={{ top: 60, left: -30, width: 26 }}/>
              <div className="pin" style={{ top: 52, left: -54 }}>3</div>

              <span className="lead h" style={{ top: 130, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: 122, right: -54 }}>4</div>

              <span className="lead v" style={{ bottom: -22, right: 56, height: 18 }}/>
              <div className="pin" style={{ bottom: -42, right: 56, transform: 'translateX(50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '72px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Progress bar.</b> 2px ember fill above the header, growing as the user advances through stepped questions. Hidden in panel mode.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Header.</b> Optional topic prefix in ember sans (the <Mono>header</Mono> prop) + "Question N of M" muted + an optional Skip text-link on the trailing edge. All sans — never mono uppercase.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Title.</b> 20px sans semibold, capped at ~38ch — the question is the protagonist, no decorative chrome around it.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Option row.</b> Borderless row, no tick / radio dot. Title sans semibold; optional description below in muted sans. Selected = <Mono>--ember-soft</Mono> background + 2px ember leading bar. A small mono number badge (1–9) on the trailing edge reveals on hover/focus.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Footer.</b> Back link (when not on the first step) at the leading edge, keyboard hint <kbd className="kbd">⌃↵</kbd>, and the ember Continue / Finish button at the trailing edge. Disabled until a selection is in.</span>
          </div>
        </div>
      </div>

      {/* ── 11. DO / DON'T ───────────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — ask only when the answer is load-bearing</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%', maxWidth: 320 }}>
              <AskUser questions={[{
                id: 'd1',
                title: 'Which datastore?',
                header: 'Datastore',
                options: [
                  { id: 'pg', title: 'PostgreSQL' },
                  { id: 'redis', title: 'Redis' },
                ],
              }]}/>
            </div>
          </div>
          <div className="note">Two crisp options the agent genuinely needs the user to decide on.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — ask before you've tried anything</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%', maxWidth: 320 }}>
              <AskUser questions={[{
                id: 'd2',
                title: 'Should I read the codebase first or skip ahead?',
                options: [
                  { id: 'read', title: 'Read it' },
                  { id: 'skip', title: 'Skip it' },
                ],
              }]}/>
            </div>
          </div>
          <div className="note">Don't surface every routine planning step as an Ask. Decide it; ask only when you genuinely can't.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — give 2–5 sharp options + a description each</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%', maxWidth: 320 }}>
              <AskUser questions={[{
                id: 'd3',
                title: 'Cache strategy?',
                header: 'Cache',
                options: [
                  { id: 'write-through', title: 'Write-through', description: 'Strong consistency, more writes.' },
                  { id: 'lazy', title: 'Lazy / read-through', description: 'Eventual, faster writes.' },
                ],
              }]}/>
            </div>
          </div>
          <div className="note">Crisp options + one-line trade-off each. The user picks in two seconds.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — paste a free-text question disguised as options</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%', maxWidth: 320 }}>
              <AskUser questions={[{
                id: 'd4',
                title: 'Tell me about your traffic',
                allowOther: true,
                otherPlaceholder: 'Describe…',
                options: [],
              }]}/>
            </div>
          </div>
          <div className="note">If there are no real options, you don't have an Ask — you have a question. Send a Message instead.</div>
        </div>
      </div>

      {/* ── 12. WIRING IT UP ─────────────────────────────────────────────── */}
      <SubHead meta="ai sdk v6">Wiring it up</SubHead>
      <CodeBlock
        label="agent → ask → answers"
        lang="tsx"
        code={`import { AskUser, type AskAnswer } from '@/ds/core';

function ClarifyService() {
  return (
    <AskUser
      questions={[
        { id: 'runtime',  title: 'Runtime?',  header: 'Runtime',  options: [
          { id: 'go', title: 'Go' }, { id: 'node', title: 'Node.js' }, { id: 'python', title: 'Python' },
        ]},
        { id: 'features', title: 'Features?', header: 'Features', multiSelect: true, options: [
          { id: 'audit', title: 'Audit log' }, { id: 'rbac', title: 'RBAC' }, { id: 'metrics', title: 'Metrics' },
        ]},
      ]}
      onComplete={(answers: AskAnswer[]) => {
        // Send the resolved answers back to the agent so the next turn can
        // act on them. Each answer keys to a question by questionId.
        agent.send({ kind: 'ask:answers', answers });
      }}
    />
  );
}`}
      />

      {/* ── 13. API ──────────────────────────────────────────────────────── */}
      <SubHead meta="AskUserProps">API reference</SubHead>
      <AutoPropsTable component="AskUser" label="<AskUser />"/>
      <PropsTable
        label="AskQuestion"
        rows={[
          { prop: 'id',               type: 'string',                  required: true,        description: 'Stable identifier — used as the answer key.' },
          { prop: 'title',            type: 'string',                  required: true,        description: 'The question text (rendered as h3).' },
          { prop: 'header',           type: 'string',                  default: undefined,    description: 'Short topic prefix shown in ember before "Question N of M".' },
          { prop: 'options',          type: 'AskOption[]',             required: true,        description: '2–5 options recommended.' },
          { prop: 'multiSelect',      type: 'boolean',                 default: 'false',      description: 'When true, multiple options can be picked and a Continue button appears.' },
          { prop: 'allowOther',       type: 'boolean',                 default: 'false',      description: 'Adds an inline free-text input; typing auto-selects it.' },
          { prop: 'otherPlaceholder', type: 'string',                  default: '"Other — describe in your own words…"', description: 'Placeholder for the allowOther input.' },
          { prop: 'skippable',        type: 'boolean',                 default: 'false',      description: 'Shows a Skip link in the header.' },
          { prop: 'layout',           type: '"stacked" | "inline"',    default: '"stacked"',  description: 'Stacked = description below title; inline = same line, "—" separator.' },
        ]}
      />
      <PropsTable
        label="AskOption"
        rows={[
          { prop: 'id',           type: 'string',          required: true,        description: 'Stable identifier — returned in answer.selectedIds.' },
          { prop: 'title',        type: 'string',          required: true,        description: 'Option title (sans semibold).' },
          { prop: 'description',  type: 'string',          default: undefined,    description: 'Optional explanatory line in muted sans.' },
        ]}
      />
      <PropsTable
        label="AskAnswer (in onComplete payload)"
        rows={[
          { prop: 'questionId',  type: 'string',       required: true, description: 'The question this answer belongs to.' },
          { prop: 'selectedIds', type: 'string[]',     required: true, description: 'IDs the user picked. Includes "__other" when the free-text input has content.' },
          { prop: 'otherText',   type: 'string',       default: '""',  description: 'The free-text content when allowOther is used.' },
          { prop: 'skipped',     type: 'boolean',      default: 'false', description: 'True when the user used Skip on this question.' },
        ]}
      />
    </Section>
  );
}
