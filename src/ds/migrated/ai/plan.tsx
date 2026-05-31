'use client';
// Forge AI — Plan. The agent's commitment: an ordered checklist it ticks off
// as it works. Documents the Plan component (Plan({ title, items })).
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, AutoPropsTable, installTabs, Plan, Lede, Mono } from '@/ds/core';


// ── Static usage demo ────────────────────────────────────────────────────────
const USAGE_ITEMS = [
  { title: 'Fetch recent deploys for Tier-1 services', status: 'done' as const },
  { title: 'Identify the deploy that touched the spike window', status: 'done' as const },
  { title: 'Pull the diff and annotate candidates', status: 'active' as const, detail: 'Checking identity-svc @ 0421…' },
  { title: 'Draft a remediation recommendation', status: 'pending' as const },
];

const USAGE_CODE = `import { Plan } from "@/ds/core"

<Plan
  title="Plan"
  items={[
    { title: "Fetch recent deploys", status: "done" },
    { title: "Identify the deploy", status: "done" },
    { title: "Pull the diff", status: "active", detail: "Checking identity-svc…" },
    { title: "Draft recommendation", status: "pending" },
  ]}
/>`;

// ── Live ticking demo ────────────────────────────────────────────────────────
const TICK_ITEMS = [
  { title: 'Inspect failing health checks', detail: 'gateway, identity-svc' },
  { title: 'Correlate with recent deploys' },
  { title: 'Check error budget burn rate' },
  { title: 'Propose rollback candidates' },
];
const STATUSES: Array<'pending' | 'active' | 'done'> = ['pending', 'active', 'done'];

function LiveTicking() {
  // activeIdx cycles 0 → 3; once all done it resets
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [doneCount, setDoneCount] = React.useState(0);

  React.useEffect(() => {
    if (doneCount >= TICK_ITEMS.length) {
      // short pause then restart
      const id = setTimeout(() => { setActiveIdx(0); setDoneCount(0); }, 1800);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setDoneCount(d => d + 1);
      setActiveIdx(i => Math.min(i + 1, TICK_ITEMS.length));
    }, 900);
    return () => clearTimeout(id);
  }, [doneCount]);

  const items = TICK_ITEMS.map((it, i) => ({
    ...it,
    status: (i < doneCount ? 'done' : i === activeIdx && doneCount < TICK_ITEMS.length ? 'active' : 'pending') as 'pending' | 'active' | 'done',
  }));

  return (
    <div aria-live="polite" aria-label="Agent plan progress">
      <Plan title="Plan" items={items}/>
    </div>
  );
}

// ── Long plan demo ────────────────────────────────────────────────────────────
const LONG_ITEMS = [
  { title: 'Collect service topology', status: 'done' as const, detail: '14 services · 3 tiers' },
  { title: 'Parse recent alert history', status: 'done' as const, detail: '48 h window' },
  { title: 'Correlate alerts with deploy log', status: 'done' as const },
  { title: 'Rank high-risk deploys', status: 'done' as const, detail: 'Top 3 candidates identified' },
  { title: 'Fetch diff for identity-svc @ 0421', status: 'active' as const, detail: 'Fetching from GitHub…' },
  { title: 'Fetch diff for gateway @ 0418', status: 'pending' as const },
  { title: 'Annotate candidates with risk scores', status: 'pending' as const },
  { title: 'Draft rollback recommendation', status: 'pending' as const },
  { title: 'Write incident report stub', status: 'pending' as const },
];

// ── In context (inside a Message) ─────────────────────────────────────────
const IN_CONTEXT_ITEMS = [
  { title: 'List recent Tier-1 deploys', status: 'done' as const },
  { title: 'Cross-reference with p99 spike window', status: 'done' as const },
  { title: 'Fetch the relevant diff', status: 'active' as const, detail: 'identity-svc @ 0421' },
  { title: 'Write a root-cause summary', status: 'pending' as const },
];

// ─── page ─────────────────────────────────────────────────────────────────
export default function PlanPage() {
  return (
    <Section
      id="ai-plan"
      num="14"
      title="Plan"
      desc="The agent's commitment made legible: an ordered checklist it ticks off as it works. Show it at the top of a turn so users know the shape of the work before it happens."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-plan')} ariaLabel="package manager"/>
      <Lede>One plan per turn, front-loaded — never revised mid-task without naming the change.</Lede>
      <Lede>
        Ships <Mono>Plan</Mono> from the <Mono>@/ds/core</Mono> agentic layer.
        The component renders an <Mono>&lt;ol&gt;</Mono> internally so screen readers announce
        step position and count. Status is real text (the count "2/4") not colour-only.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="4-step plan — two done, one active, one pending" code={USAGE_CODE} height={280}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <Plan title="Plan" items={USAGE_ITEMS}/>
        </div>
      </Frame>
      <Lede>
        The header shows a <Mono>done/total</Mono> count so users can track progress
        at a glance without scanning every row. The count is textual — it reads aloud as "2/4" — not
        a progress bar driven by colour alone.
      </Lede>

      {/* EXAMPLES divider */}
      <div className="ds-examples-rule" style={{ marginBlockStart: 'var(--space-8)', marginBlockEnd: 'var(--space-1)' }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      {/* Live ticking */}
      <SubHead meta="interactive · live">Live ticking</SubHead>
      <Frame label="steps advance pending → active → done every ~900 ms — loops" height={260}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <LiveTicking/>
        </div>
      </Frame>
      <Lede>
        Drive the items array from your streaming state — swap each item's <Mono>status</Mono>{' '}
        as the agent progresses. The component is stateless; ownership stays with the caller.
        The wrapping <Mono>aria-live="polite"</Mono> region announces each transition.
      </Lede>

      {/* Long plan */}
      <SubHead meta="8+ steps">Long plan</SubHead>
      <Frame label="nine steps — four done, one active, four pending with detail" height={440}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <Plan title="Incident investigation" items={LONG_ITEMS}/>
        </div>
      </Frame>
      <Lede>
        Use the optional <Mono>detail</Mono> field for sub-context — a count,
        a resource name, a brief observation. Keep it one line; for richer output
        a <a href="/ai/task" style={{ color: 'var(--ember)' }}>Task</a> with sub-items is
        the right primitive.
      </Lede>

      {/* In context */}
      <SubHead meta="composition · inside a Message">In context</SubHead>
      <Frame label="Plan at the top of an assistant turn — precedes the first tool call" height={340}>
        <div className="msg-thread" style={{ width: '100%', maxWidth: 580, padding: 0 }}>
          <div className="msg">
            <div className="msg-stack" style={{ maxWidth: '100%' }}>
              <div className="msg-meta">
                <span className="name">Forge AI</span>
                <span className="dot"/>
                <span>just now</span>
              </div>
              <Plan title="Plan" items={IN_CONTEXT_ITEMS}/>
              <div className="msg-bubble" style={{ color: 'var(--fg-muted)', fontStyle: 'italic' }}>
                Starting with Tier-1 deploys in the last 24 hours…
              </div>
            </div>
          </div>
        </div>
      </Frame>
      <Lede>
        Place the Plan immediately after the agent header, before any tool calls.
        Users orient to the work before the first tool fires — the plan is the commitment,
        the tool calls are the execution.
      </Lede>

      {/* 5. ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The Plan is a passive reading surface — no interactive affordances, not a Tab stop.
            If you add a "View detail" link inside a step's <Mono>detail</Mono>{' '}
            slot, that link is reached by Tab in document order, never trapping focus inside the list.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The internal <Mono>&lt;ol&gt;</Mono> renders step
            position ("1 of 4") automatically. The header count ("2/4") is plain text — screen readers
            read it aloud with no extra annotation needed. Wrap live-updating demos in{' '}
            <Mono>aria-live="polite"</Mono> so each step
            transition is announced. The active step's pulsing status dot is{' '}
            <Mono>aria-hidden</Mono>; status is communicated
            by the <Mono>data-status</Mono> attribute on each list item, not colour alone.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The done mark (check icon on <Mono>--success</Mono>),
            the active pulsing dot (<Mono>--status-running</Mono> sky-blue
            on an <Mono>--ember-soft</Mono> row tint), and the
            pending step number (fg-muted on surface) all clear AA against the panel background. The single
            ember signal is the row highlight — the dot itself stays the running-status hue. Pending step
            numbers use the muted scale — never the same ink as the active state.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Under <Mono>prefers-reduced-motion</Mono> the
            active step's pulsing dot renders as a static filled circle and any connector or mark
            transitions resolve instantly. The live-ticking demo still advances steps — only the
            animation is removed, not the state machine.
          </div>
        </div>
      </div>

      {/* 6. RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — step mark leads from the start (right) edge, connector mirrors" height={280}>
        <div dir="rtl" style={{ width: '100%', maxWidth: 480 }}>
          <Plan
            title="الخطة"
            items={[
              { title: 'جلب عمليات النشر الأخيرة', status: 'done' },
              { title: 'تحديد النشر الذي أثّر على الفترة الحرجة', status: 'done' },
              { title: 'استخراج الفروق وتحليل الأسباب', status: 'active', detail: 'فحص identity-svc…' },
              { title: 'صياغة توصية الإصلاح', status: 'pending' },
            ]}
          />
        </div>
      </Frame>
      <Lede>
        Every spacing rule uses logical properties. The step mark moves to the start (right) edge,
        the connector runs down the start side, and the detail line wraps naturally from right to left.
        The count ("2/4") stays numerals — it is not reversed.
      </Lede>

      {/* 7. ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 420 }} aria-hidden="true">
              <Plan
                title="Plan"
                items={[
                  { title: 'Fetch recent deploys', status: 'done' },
                  { title: 'Identify candidates', status: 'active', detail: 'identity-svc @ 0421' },
                  { title: 'Draft recommendation', status: 'pending' },
                ]}
              />
              {/* leads */}
              <span className="lead h" style={{ top: 16, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 16, right: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 52, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 82, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 114, left: -32, width: 28 }}/>
              {/* pins */}
              <div className="pin" style={{ top: 8, left: -54 }}>1</div>
              <div className="pin" style={{ top: 8, right: -54 }}>2</div>
              <div className="pin" style={{ top: 44, left: -54 }}>3</div>
              <div className="pin" style={{ top: 74, left: -54 }}>4</div>
              <div className="pin" style={{ top: 106, left: -54 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Header.</b> Target icon + plan title + <Mono>done/total</Mono> count. The count is plain text — a screen reader reads "2/4" without extra annotation.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Count badge.</b> <Mono>{'{done}/{total}'}</Mono> — updates as items complete. Always textual, never a colour-only indicator.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Step mark.</b> Done = check icon (<Mono>--success</Mono>); active = pulsing status dot (<Mono>--status-running</Mono> sky-blue) on an <Mono>--ember-soft</Mono> row tint; pending = muted step number. Three visually distinct states that do not rely on hue alone.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Step title.</b> Full-weight for the active step, muted for pending, faint-struck for done. Logical <Mono>text-decoration</Mono> reuses the <Mono>--fg-faint</Mono> token.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Detail line.</b> Optional one-liner below the title — a count, a resource name, a short observation. Mono-faced to read as metadata, not instruction.</span>
          </div>
        </div>
      </div>

      {/* 8. DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — show the plan up front, then tick it off</div>
          <div className="body" style={{ padding: 14 }}>
            <Plan
              title="Plan"
              items={[
                { title: 'Fetch deploys', status: 'done' },
                { title: 'Pull the diff', status: 'active' },
                { title: 'Draft recommendation', status: 'pending' },
              ]}
            />
          </div>
          <div className="note">Front-load the plan so users know the shape of the work before the first tool fires.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — add steps mid-task without naming the change</div>
          <div className="body" style={{ padding: 14 }}>
            <Plan
              title="Plan"
              items={[
                { title: 'Fetch deploys', status: 'done' },
                { title: 'Pull the diff', status: 'done' },
                { title: 'Check rollback feasibility', status: 'done' },
                { title: 'Also check canary status (added now)', status: 'active' },
                { title: 'Also check SLO burn (added now)', status: 'active' },
                { title: 'Draft recommendation', status: 'pending' },
              ]}
            />
          </div>
          <div className="note">A plan that grows silently breaks trust. If scope changes, say so — start a revised plan or annotate the addition.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — one active step at a time</div>
          <div className="body" style={{ padding: 14 }}>
            <Plan
              title="Plan"
              items={[
                { title: 'Fetch deploys', status: 'done' },
                { title: 'Pull the diff', status: 'active', detail: 'identity-svc @ 0421' },
                { title: 'Draft recommendation', status: 'pending' },
              ]}
            />
          </div>
          <div className="note">One active step reads as focused work. Users know exactly what the agent is doing right now.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use Plan for a single step</div>
          <div className="body" style={{ padding: 14 }}>
            <Plan
              title="Plan"
              items={[
                { title: 'Fetch the deploy log', status: 'active' },
              ]}
            />
          </div>
          <div className="note">A one-step plan is just a label. Use a <a href="/ai/task" style={{ color: 'var(--ember)' }}>Task</a> instead, or omit the plan entirely.</div>
        </div>
      </div>

      {/* 9. API REFERENCE */}
      <SubHead meta="PlanProps">API reference</SubHead>
      <AutoPropsTable component="Plan" label="<Plan />"/>
      <PropsTable
        label="PlanItem"
        rows={[
          { prop: 'title', type: 'string', required: true, description: 'Step label. Shown full-weight when active, muted when pending, faint-struck when done.' },
          { prop: 'status', type: '"pending" | "active" | "done"', default: '"pending"', description: 'Drives the step mark: done=check, active=pulsing dot, pending=step number.' },
          { prop: 'detail', type: 'string', default: undefined, description: 'Optional one-line metadata below the title — a count, a resource name, a short observation.' },
        ]}
      />
    </Section>
  );
}
