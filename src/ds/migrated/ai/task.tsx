'use client';
// Eidos AI — Task. A single unit of agent work with status and optional
// sub-steps. Documents the Task component.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, AutoPropsTable, installTabs, Task, Lede, Mono } from '@/ds/core';


// ── Usage demo ──────────────────────────────────────────────────────────────
const USAGE_CODE = `import { Task } from "@/ds/core"

<Task
  title="Deploy identity-svc canary"
  status="active"
  detail="Tier 1 · ring 1 of 3"
  items={[
    { title: "Build Docker image", status: "done" },
    { title: "Push to registry",   status: "active" },
    { title: "Route 5% traffic",   status: "pending" },
  ]}
/>`;

// ── All four statuses ────────────────────────────────────────────────────────
const STATUSES_CODE = `<Task title="Validate schema" status="pending"/>
<Task title="Run smoke tests"  status="active"/>
<Task title="Tag release"      status="done"/>
<Task title="Rollback canary"  status="error" detail="Exit code 1"/>`;

// ── Interactive sub-tasks ────────────────────────────────────────────────────
const DEPLOY_ITEMS_INITIAL = [
  { title: 'Build Docker image', status: 'pending' as const },
  { title: 'Push to registry',   status: 'pending' as const },
  { title: 'Route 5% traffic',   status: 'pending' as const },
];

function InteractiveSubtasks() {
  const [items, setItems] = React.useState<Array<{ title: string; status: 'pending' | 'done' }>>(DEPLOY_ITEMS_INITIAL);

  const tick = () => {
    setItems(prev => {
      const nextActive = prev.findIndex(it => it.status !== 'done');
      if (nextActive === -1) return DEPLOY_ITEMS_INITIAL; // reset
      return prev.map((it, i) => ({
        ...it,
        status: i < nextActive ? 'done' : i === nextActive ? ('done' as const) : it.status,
      }));
    });
  };

  const taskStatus: 'pending' | 'active' | 'done' =
    items.every(it => it.status === 'done')
      ? 'done'
      : items.some(it => it.status === 'done')
        ? 'active'
        : 'pending';

  const doneCount = items.filter(it => it.status === 'done').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start', width: '100%', maxWidth: 480 }}>
      {/* aria-live region: announces the rolled-up status as TEXT on every tick */}
      <div aria-live="polite" style={{ width: '100%' }}>
        <Task
          title="Deploy identity-svc canary"
          status={taskStatus}
          detail={`Tier 1 · ring 1 of 3`}
          items={items}
        />
        <span className="sr-only">
          {`Deploy identity-svc canary — status ${taskStatus}, ${doneCount} of ${items.length} sub-tasks done.`}
        </span>
      </div>
      <button
        className="btn xs ghost"
        onClick={tick}
      >
        {items.every(it => it.status === 'done') ? 'Reset' : 'Advance step'}
      </button>
    </div>
  );
}

// ── In context — stack of 3 tasks inside a Message ─────────────────────────
const FEED_ITEMS: Array<{
  title: string;
  status: 'pending' | 'active' | 'done' | 'error';
  detail?: string;
  items?: Array<{ title: string; status: 'pending' | 'active' | 'done' | 'error' }>;
}> = [
  {
    title: 'Check service health',
    status: 'done',
    detail: '3 services · all Tier 1',
    items: [
      { title: 'identity-svc', status: 'done' },
      { title: 'billing-svc',  status: 'done' },
      { title: 'gateway',      status: 'done' },
    ],
  },
  {
    title: 'Correlate with deploy log',
    status: 'active',
    detail: 'Scanning last 24 h…',
  },
  {
    title: 'Draft rollback recommendation',
    status: 'pending',
  },
];

// ─── page ─────────────────────────────────────────────────────────────────
export default function TaskPage() {
  return (
    <Section
      id="ai-task"
      num="15"
      title="Task"
      desc="A single unit of agent work — one discrete goal, one status, optional sub-steps. Stack several Tasks to build a live to-do feed during a multi-tool run."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-task')} ariaLabel="package manager"/>
      <Lede>Keep each Task to one thing the agent is doing or has done. For multi-step plans, use Plan first, then Tasks as the execution unit.</Lede>
      <Lede>
        Ships <Mono>Task</Mono> from the <Mono>@/ds/core</Mono> agentic layer.
        Sub-tasks render as a semantic <Mono>&lt;ul&gt;</Mono>; each status mark pairs its glyph with a
        visually-hidden status word, and a live feed wraps the stack in <Mono>aria-live="polite"</Mono> so
        every transition is announced as text.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="Deploy task with 3 sub-steps — push is active" code={USAGE_CODE} height={240}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <Task
            title="Deploy identity-svc canary"
            status="active"
            detail="Tier 1 · ring 1 of 3"
            items={[
              { title: 'Build Docker image', status: 'done' },
              { title: 'Push to registry',   status: 'active' },
              { title: 'Route 5% traffic',   status: 'pending' },
            ]}
          />
        </div>
      </Frame>
      <Lede>
        Pass a <Mono>detail</Mono> string for right-aligned metadata (tier, ring, count).
        The detail is mono-faced to read as status metadata, not instruction copy.
      </Lede>

      {/* EXAMPLES divider */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      {/* Statuses */}
      <SubHead meta="4 statuses">Statuses</SubHead>
      <Frame label="pending · active · done · error — all four side by side" code={STATUSES_CODE} height={280}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 480 }}>
          <Task title="Validate schema" status="pending"/>
          <Task title="Run smoke tests"  status="active"/>
          <Task title="Tag release"      status="done"/>
          <Task title="Rollback canary"  status="error" detail="Exit code 1"/>
        </div>
      </Frame>
      <Lede>
        Each status has a distinct mark: pending = hollow dot, active = pulsing cyan running dot
        (<Mono>--status-running</Mono>), done = success check, error = danger x. Status is never
        communicated by colour alone — every mark also ships a visually-hidden status word
        (<Mono>sr-only</Mono>), so the state reaches a screen reader as text, not shape.
      </Lede>

      {/* Interactive sub-tasks */}
      <SubHead meta="interactive · sub-steps">Sub-tasks</SubHead>
      <Frame label="click 'Advance step' to tick sub-tasks off — the parent status updates" height={280}>
        <InteractiveSubtasks/>
      </Frame>
      <Lede>
        The parent <Mono>status</Mono> rolls up from the sub-items in your state.
        Task is stateless — the caller drives status. Sub-tasks render as a <Mono>&lt;ul&gt;</Mono>{' '}
        at a reduced indent; each item inherits the same mark vocabulary as the parent.
        This demo also writes a visually-hidden line — <Mono>"status active, 1 of 3 sub-tasks done"</Mono> —
        into the <Mono>aria-live="polite"</Mono> region on every step, so a screen reader hears the
        rolled-up state change as words, not just a moving dot.
      </Lede>

      {/* In context */}
      <SubHead meta="composition · inside a Message">In context</SubHead>
      <Frame label="stack of 3 Tasks — the agent's live to-do feed during a multi-tool run" height={360}>
        <div style={{ width: '100%', maxWidth: 580, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>
            Eidos AI <span style={{ margin: '0 6px', color: 'var(--fg-faint)' }}>·</span> just now
          </div>
          <div aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FEED_ITEMS.map((t, i) => (
              <React.Fragment key={i}>
                <Task
                  title={t.title}
                  status={t.status}
                  detail={t.detail}
                  items={t.items}
                />
                <span className="sr-only">{`${t.title} — status ${t.status}.`}</span>
              </React.Fragment>
            ))}
          </div>
          <div style={{
            padding: '10px 12px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-2xl)', borderEndStartRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-base)', color: 'var(--fg-muted)', maxWidth: '88%',
            fontStyle: 'italic',
          }}>
            Cross-referencing deploy timestamps with the spike window…
          </div>
        </div>
      </Frame>
      <Lede>
        A task feed reads as a live checklist: the user sees what the agent has done, what it's
        doing now, and what comes next. Wrap the task stack in{' '}
        <Mono>aria-live="polite"</Mono> so screen readers announce transitions.
        Don't bury a tool call inside a Task — use the{' '}
        <a href="/ai/tool" style={{ color: 'var(--ember)' }}>Tool</a> component for that.
      </Lede>

      {/* 5. ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Keyboard</div>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 14px', margin: 0, alignItems: 'baseline' }}>
            <dt><kbd className="kbd">Tab</kbd></dt>
            <dd style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>The Task body itself is not a stop — it is a passive reading surface. Tab lands only on real interactive children you add (a link in <Mono>detail</Mono>, a retry <Mono>&lt;button&gt;</Mono> in a sub-task), reached in document order.</dd>
            <dt><span className="kbd-chord"><kbd className="kbd">Shift</kbd><kbd className="kbd">Tab</kbd></span></dt>
            <dd style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>Move focus backward through those same children.</dd>
            <dt><span className="kbd-chord"><kbd className="kbd">Enter</kbd><kbd className="kbd">Space</kbd></span></dt>
            <dd style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>Activate whichever child control has focus — Task adds no key handlers of its own.</dd>
          </dl>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55, marginTop: 10 }}>
            Sub-task <Mono>&lt;li&gt;</Mono> rows are not focusable. If a sub-task needs an action, add a real <Mono>&lt;button&gt;</Mono> child — it becomes a natural sequential Tab stop and draws the canonical <Mono>:focus-visible</Mono> ring; never use <Mono>tabindex</Mono> on the row itself.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Each status mark carries a visually-hidden status word — <Mono>&lt;span class="sr-only"&gt;active&lt;/span&gt;</Mono> —
            so the state is announced as <b style={{ color: 'var(--fg)' }}>text</b>, never by mark shape or colour
            alone. The pulsing dot and the check/x glyph are <Mono>aria-hidden</Mono> decoration on top of that word
            (<Mono>data-status</Mono> is a styling hook only — attributes are not announced). Sub-tasks render as a
            semantic <Mono>&lt;ul&gt;</Mono> so the count ("3 items") is announced. Wrap live-updating task feeds in{' '}
            <Mono>aria-live="polite"</Mono> on the container so each transition is read out as it lands.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Done mark uses <code style={{ fontFamily: 'var(--font-mono)' }}>--success</code> (green check) on the
            surface panel; error mark uses <code style={{ fontFamily: 'var(--font-mono)' }}>--danger</code> (red x).
            Both clear AA against the panel background at 13px bold. The active pulsing dot uses the cyan running
            tone (<code style={{ fontFamily: 'var(--font-mono)' }}>--status-running</code>), a high-luminance hue
            that clears AA against the panel — colour is never the only signal, since the pulse plus the visible
            status word carry it too. The detail line on{' '}
            <code style={{ fontFamily: 'var(--font-mono)' }}>--fg-muted</code> stays ≥ 4.5:1.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Under <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code> the
            active status dot renders as a static filled circle — no pulse animation. Any connector
            transition resolves instantly. The interactive sub-tasks demo still advances on click;
            only the animation is suppressed, not the state machine.
          </div>
        </div>
      </div>

      {/* 6. RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — status mark leads from the start (right) edge, detail aligns end" height={260}>
        <div dir="rtl" style={{ width: '100%', maxWidth: 480 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Task
              title="نشر canary لـ identity-svc"
              status="active"
              detail="الطبقة 1 · الحلقة 1 من 3"
              items={[
                { title: 'بناء صورة Docker', status: 'done' },
                { title: 'رفع إلى السجل',    status: 'active' },
                { title: 'توجيه 5% من الزيارات', status: 'pending' },
              ]}
            />
            <Task title="التحقق من صحة النظام" status="done"/>
            <Task title="تراجع عن النشر"       status="error" detail="رمز الخروج 1"/>
          </div>
        </div>
      </Frame>
      <Lede>
        Logical CSS properties mean the flip is automatic: the status mark moves to the start (right)
        edge, the sub-task indent mirrors, and the detail string aligns to the end (left) edge.
        Status words ("active", "done", "error") remain English — they're attribute values, not user-facing text.
      </Lede>

      {/* 7. ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 440 }} aria-hidden="true">
              <Task
                title="Deploy identity-svc canary"
                status="active"
                detail="Tier 1 · ring 1 of 3"
                items={[
                  { title: 'Build Docker image', status: 'done' },
                  { title: 'Push to registry',   status: 'active' },
                  { title: 'Route 5% traffic',   status: 'pending' },
                ]}
              />
              {/* leads */}
              <span className="lead h" style={{ top: 16, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 16, right: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 44, right: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 76, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 104, left: -32, width: 28 }}/>
              {/* pins */}
              <div className="pin" style={{ top: 8, left: -54 }}>1</div>
              <div className="pin" style={{ top: 8, right: -54 }}>2</div>
              <div className="pin" style={{ top: 36, right: -54 }}>3</div>
              <div className="pin" style={{ top: 68, left: -54 }}>4</div>
              <div className="pin" style={{ top: 96, left: -54 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Status mark.</b> Done = check (<Mono>--success</Mono>); active = pulsing cyan running dot (<Mono>--status-running</Mono>); error = x (<Mono>--danger</Mono>); pending = hollow dot. Each mark also carries a visually-hidden status word — shape, colour, <em>and</em> text, never colour alone.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Title.</b> The task's goal in plain language. Full-weight when active or error; muted when pending; faint-struck when done.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Detail.</b> Right-aligned (end-aligned) metadata — tier, ring number, count, short observation. Mono-faced to read as metadata, not instruction copy. Optional.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Sub-task list.</b> Optional <Mono>&lt;ul&gt;</Mono> of nested items, each with its own mark. Same vocabulary as the parent; reduced indent from the start edge.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Sub-task row.</b> Mark (same four states) + title. No detail field on sub-items — keep them one-liners; escalate to a Task for richer items.</span>
          </div>
        </div>
      </div>

      {/* 8. DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — one Task per discrete unit of work</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Task title="Check service health" status="done"/>
              <Task title="Correlate with deploys" status="active"/>
              <Task title="Draft recommendation"  status="pending"/>
            </div>
          </div>
          <div className="note">Three tasks, each with a single clear goal. The user always knows what's done and what's next.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — bury a tool call inside a Task</div>
          <div className="body" style={{ padding: 14 }}>
            <Task
              title="Check health · listServices · parseResult · correlate · rank · …"
              status="active"
              detail="(doing many unrelated things)"
            />
          </div>
          <div className="note">Tool calls have their own component. Use <a href="/ai/tool" style={{ color: 'var(--ember)' }}>Tool</a> for a tool call; Task is for the goal-level unit.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — expose the error state explicitly</div>
          <div className="body" style={{ padding: 14 }}>
            <Task title="Deploy canary" status="error" detail="Exit code 1 · ring 1"/>
          </div>
          <div className="note">An error Task tells the user something went wrong and where, without requiring them to open a tool disclosure.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — leave an error Task as "active" to mask failures</div>
          <div className="body" style={{ padding: 14 }}>
            <Task title="Deploy canary" status="active" detail="Still running…"/>
          </div>
          <div className="note">An active Task that never resolves breaks trust. Transition to error as soon as a failure is known.</div>
        </div>
      </div>

      {/* 9. API REFERENCE */}
      <SubHead meta="TaskProps">API reference</SubHead>
      <AutoPropsTable component="Task" label="<Task />"/>
      <PropsTable
        label="TaskItem"
        rows={[
          { prop: 'title', type: 'string', required: true, description: 'Sub-task label. Keep it one line; if you need detail, escalate to a Task.' },
          { prop: 'status', type: '"pending" | "active" | "done" | "error"', default: '"pending"', description: 'Same four states as the parent, same mark vocabulary.' },
        ]}
      />
    </Section>
  );
}
