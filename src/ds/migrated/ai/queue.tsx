'use client';
// Eidos AI — Queue (§2.2 component-page standard, num "17").
// Prompts the user has lined up while the agent is busy. An ordered,
// removable list — users keep typing; the agent works through one at a time.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Queue, Message, Empty, Lede, Mono } from '@/ds/core';

// AI-page inline style convention (agents.tsx / prompt-input.tsx idiom)

// ── live demos ────────────────────────────────────────────────────────────────

// Usage demo — 3 queued prompts, interactive remove
const UsageDemo = () => {
  const [items, setItems] = React.useState([
    'Run the full test suite for identity-svc',
    'Summarise the last 5 deploys',
    'Open an incident if error budget is under 20%',
  ]);
  const remove = (i: number) => setItems(arr => arr.filter((_, idx) => idx !== i));
  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <Queue title="Queued" items={items} onRemove={remove}/>
    </div>
  );
};

// Variant — string-only form
const StringVariantDemo = () => (
  <div style={{ width: '100%', maxWidth: 380 }}>
    <Queue
      title="Queued"
      items={[
        'What services are in the critical path?',
        'Show me the p95 latency for gateway over the last 24 h',
      ]}
    />
  </div>
);

// Variant — object-form [{ text }]
const ObjectVariantDemo = () => (
  <div style={{ width: '100%', maxWidth: 380 }}>
    <Queue
      title="Queued"
      items={[
        { text: 'List all open incidents tagged tier-1' },
        { text: 'Draft a rollback plan for identity-svc' },
        { text: 'Which team owns billing-svc?' },
      ]}
    />
  </div>
);

// Empty state — items:[]
const EmptyQueueDemo = () => (
  <div style={{ width: '100%', maxWidth: 380 }}>
    <Queue title="Queued" items={[]}/>
    <div style={{ marginTop: 16 }}>
      <Empty
        title="Nothing queued"
        desc="Keep typing while the agent works — prompts you send will appear here."
        icon={<Icons.list size={22}/>}
        size="sm"
      />
    </div>
  </div>
);

// Long queue — 8+ items, text-overflow ellipsis handled by CSS
const LONG_ITEMS = [
  'Summarise all incidents from the last 7 days',
  'Which services have a burn rate above 1.5x?',
  'Show me the full deploy history for billing-svc including rollbacks and hotfixes',
  'Draft a postmortem for the Nov-14 outage',
  "List all runbooks that haven't been updated in over 90 days",
  'Check whether identity-svc has any open CVEs in the current image',
  'Compare latency between gateway v2.4.1 and v2.4.2',
  'Pull error logs from the last 30 min filtered to 5xx',
];
const LongQueueDemo = () => {
  const [items, setItems] = React.useState(LONG_ITEMS);
  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <Queue title="Queued" items={items} onRemove={i => setItems(arr => arr.filter((_, idx) => idx !== i))}/>
    </div>
  );
};

// In context — Queue next to a streaming Message
const InContextDemo = () => {
  const [queued, setQueued] = React.useState([
    'Show me the deploy diff for billing-svc',
    'Open an incident for identity-svc if p95 {'>'} 500ms',
  ]);
  return (
    <div style={{ width: '100%', maxWidth: 580, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: 10 }}>Streaming</div>
        <Message from="assistant" streaming meta="Eidos AI · now">
          Checking the incident queue for tier-1 services over the last 24 hours…
        </Message>
      </div>
      <div style={{ width: 220, flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: 10 }}>Next up</div>
        <Queue title="Queued" items={queued} onRemove={i => setQueued(arr => arr.filter((_, idx) => idx !== i))}/>
      </div>
    </div>
  );
};

// ── code snippets ─────────────────────────────────────────────────────────────
const INSTALL_CODE = installTabs('ai-queue');

const USAGE_CODE = `import { Queue } from "@/ds/core";

function Demo() {
  const [items, setItems] = React.useState([
    "Run the full test suite for identity-svc",
    "Summarise the last 5 deploys",
    "Open an incident if error budget is under 20%",
  ]);
  return (
    <Queue
      title="Queued"
      items={items}
      onRemove={i => setItems(arr => arr.filter((_, idx) => idx !== i))}
    />
  );
}`;

const OBJECT_CODE = `// Object form — pass [{ text }] instead of string[]
<Queue
  title="Queued"
  items={[
    { text: "List all open incidents tagged tier-1" },
    { text: "Draft a rollback plan for identity-svc" },
  ]}
  onRemove={i => removeItem(i)}
/>`;

const EMPTY_CODE = `// items:[] renders the header with count 0 — compose Empty for the body
<Queue title="Queued" items={[]}/>
<Empty
  title="Nothing queued"
  desc="Keep typing while the agent works — prompts you send will appear here."
  icon={<Icons.list size={22}/>}
  size="sm"
/>`;

const IN_CONTEXT_CODE = `// Place Queue beside a streaming Message
<div style={{ display: "flex", gap: 20 }}>
  <Message from="assistant" streaming>
    Checking the incident queue…
  </Message>
  <Queue title="Queued" items={queued} onRemove={removeQueued}/>
</div>`;

export default function AiQueuePage() {
  return (
    <Section
      id="queue"
      num="17"
      title="Queue"
      desc="Prompts the user has lined up while the agent is busy. An ordered, removable list that shows what the model will work through next — so users can keep typing without losing track of their intent."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={INSTALL_CODE} ariaLabel="package manager"/>
      <Lede>
        Ships <Mono>Queue</Mono> from <Mono>@/ds/core</Mono> alongside the rest of the AI agentic layer. Items can be plain strings or <Mono>{`{ text }`}</Mono> objects — the component normalises both.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="3 queued prompts — click × to remove" code={USAGE_CODE} height={220}>
        <UsageDemo/>
      </Frame>
      <Lede>
        The list is an <Mono>{'<ol>'}</Mono> — each item carries its ordinal position as a chip, the prompt text, and an optional remove button. The header shows the title and a live count.
      </Lede>

      {/* 3. VARIANTS */}
      <SubHead meta="2 variants">Variants</SubHead>
      <Frame label="string[ ] — the minimal form" code={`<Queue title="Queued" items={["…", "…"]} onRemove={…}/>`} height={160}>
        <StringVariantDemo/>
      </Frame>
      <Lede>
        Pass a plain <Mono>string[]</Mono> when you have no extra metadata per item.
      </Lede>
      <Frame label="[{ text }] — object form" code={OBJECT_CODE} height={180}>
        <ObjectVariantDemo/>
      </Frame>
      <Lede>
        The object form is the expansion point — the <Mono>text</Mono> field is required; future versions may add <Mono>id</Mono>, <Mono>priority</Mono>, or <Mono>ts</Mono>.
      </Lede>

      {/* EMPTY STATE */}
      <SubHead meta="empty">Empty state</SubHead>
      <Frame label="items:[] — compose Empty from core for the body" code={EMPTY_CODE} height={240}>
        <EmptyQueueDemo/>
      </Frame>
      <Lede>
        When <Mono>items</Mono> is empty the component renders only the header (title + count "0"). Compose <Mono>Empty</Mono> from core beneath it to fill the space with a clear affordance.
      </Lede>

      {/* LONG QUEUE */}
      <SubHead meta="overflow">Long queue</SubHead>
      <Frame label="8+ items — text-overflow ellipsis; scroll within the list" code={`<Queue title="Queued" items={longItems} onRemove={…}/>`} height={360}>
        <LongQueueDemo/>
      </Frame>
      <Lede>
        Long prompt text is truncated with an ellipsis at one line; the position chip and remove button stay visible. The list scrolls within its container — cap the outer height with a <Mono>max-height</Mono> when you want a fixed panel.
      </Lede>

      {/* IN CONTEXT */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame label="Queue beside a streaming Message — shows what's lined up" code={IN_CONTEXT_CODE} height={260}>
        <InContextDemo/>
      </Frame>
      <Lede>
        The canonical placement is alongside or below the active streaming turn, so users always know what the agent will do next. On narrow viewports, collapse the queue to a count badge in the composer header.
      </Lede>

      {/* 5. ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The queue is a passive <code style={{ fontFamily: 'var(--font-mono)' }}>{'<ol>'}</code> — it is not a Tab stop itself. Each Remove button is a real <code style={{ fontFamily: 'var(--font-mono)' }}>{'<button>'}</code>: Tab moves focus through the remove buttons in order, Enter/Space fires the remove, and the next item in the list gains focus automatically so users can continue clearing without lifting their hands.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The <code style={{ fontFamily: 'var(--font-mono)' }}>{'<ol>'}</code> gives position semantics ("item 1 of 3") so screen reader users understand ordering — this is why the queue is a list, not a stack of divs. Each Remove button has an explicit <code style={{ fontFamily: 'var(--font-mono)' }}>aria-label="Remove from queue"</code> so the action announces without reading the prompt text again. The header count updates in a live region when items are removed.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The position chip is a neutral token pairing — <code style={{ fontFamily: 'var(--font-mono)' }}>--fg-muted</code> ordinal on a <code style={{ fontFamily: 'var(--font-mono)' }}>--surface-active</code> fill with a <code style={{ fontFamily: 'var(--font-mono)' }}>--border</code> ring; ember is reserved for the one accent signal, not spent on every row. The item text on <code style={{ fontFamily: 'var(--font-mono)' }}>--surface</code> uses full-strength <code style={{ fontFamily: 'var(--font-mono)' }}>--fg</code> for ≥ 4.5:1. Remove buttons show the 2px ember focus ring on <code style={{ fontFamily: 'var(--font-mono)' }}>:focus-visible</code>.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Under <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code> item removal is instant — no collapse animation, no slide-out. The count update in the header is a simple text swap with no transition.
          </div>
        </div>
      </div>

      {/* 6. RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — position chip leads from the start (right) edge; remove button at the end (left)" row>
        <div dir="rtl" style={{ width: '100%', maxWidth: 400 }}>
          <Queue
            title="قائمة الانتظار"
            items={[
              'افحص صحة خدمة الهوية',
              'أعد تلخيص الحوادث المفتوحة خلال الـ 24 ساعة الماضية',
              'اعرض آخر عمليات النشر لخدمة الفواتير',
            ]}
            onRemove={() => {}}
          />
        </div>
      </Frame>
      <Lede>
        All spacing uses logical properties, so the list mirrors automatically. The position chip moves to the start (right) edge, the prompt text flows right-to-left, and the remove button sits at the end (left) edge — no class overrides needed.
      </Lede>

      {/* 7. ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 320 }} aria-hidden="true">
              <Queue
                title="Queued"
                items={[
                  'Run the full test suite for identity-svc',
                  'Summarise the last 5 deploys',
                ]}
                onRemove={() => {}}
              />
              {/* pin 1 — header */}
              <span className="lead v" style={{ top: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }}/>
              <div className="pin" style={{ top: -42, left: '50%', transform: 'translateX(-50%)' }}>1</div>
              {/* pin 2 — position chip */}
              <span className="lead h" style={{ top: 58, left: -30, width: 26 }}/>
              <div className="pin" style={{ top: 48, left: -54 }}>2</div>
              {/* pin 3 — item text */}
              <span className="lead v" style={{ bottom: 30, left: '50%', height: 18, transform: 'translateX(-50%)' }}/>
              <div className="pin" style={{ bottom: 6, left: '50%', transform: 'translateX(-50%)' }}>3</div>
              {/* pin 4 — remove button */}
              <span className="lead h" style={{ top: 58, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: 48, right: -54 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 580, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Header.</b> An icon (<Mono>Icons.list</Mono>), the title string, and a live count badge showing how many items are queued. The count updates immediately on remove.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Position chip.</b> A mono ordinal (1, 2, 3…) in <Mono>--fg-muted</Mono> on a neutral <Mono>--surface-active</Mono> tile with a <Mono>--border</Mono> ring — quiet by design so ember stays the single accent. Tells users exactly where in the sequence each prompt sits. Logical spacing keeps it on the start edge in both LTR and RTL.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Item text.</b> The prompt in Geist Sans at <Mono>--text-base</Mono>, truncated to one line with ellipsis. <Mono>overflow: hidden; text-overflow: ellipsis; white-space: nowrap</Mono> — the full text is in the DOM and reachable by screen readers.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Remove button.</b> An <Mono>Icons.x</Mono> ghost button pinned to the trailing edge. Present only when <Mono>onRemove</Mono> is passed. <Mono>aria-label="Remove from queue"</Mono> is set by the component — do not override it.</span>
          </div>
        </div>
      </div>

      {/* 8. DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — show the queue when the user keeps typing during a long run</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%' }}>
              <div style={{ marginBottom: 10 }}>
                <Message from="assistant" streaming meta="Eidos AI · now">
                  Pulling deploy history for all tier-1 services…
                </Message>
              </div>
              <Queue
                title="Queued"
                items={['Show me the p95 for gateway', 'List open CVEs for identity-svc']}
              />
            </div>
          </div>
          <div className="note">The queue makes it clear the model heard the follow-up. Users stay oriented — no "did it register my message?" anxiety.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — auto-collapse the queue out of sight</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%' }}>
              <Message from="assistant" streaming meta="Eidos AI · now">
                Pulling deploy history…
              </Message>
              <div style={{ marginTop: 10, fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
                (2 queued — hidden)
              </div>
            </div>
          </div>
          <div className="note">Hiding the queue under a collapsed pill leaves users wondering whether their prompt was received. Show the list so they can see and manage what's pending.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — let users remove items from the queue</div>
          <div className="body" style={{ padding: 14 }}>
            <Queue
              title="Queued"
              items={['Summarise the last 5 deploys']}
              onRemove={() => {}}
            />
          </div>
          <div className="note">If the user changes their mind, they should be able to clear a prompt before the agent reaches it. Always pass <Mono>onRemove</Mono>.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use the queue as a history list</div>
          <div className="body" style={{ padding: 14 }}>
            <Queue
              title="Sent"
              items={[
                'What services are in the critical path?',
                'Run the test suite',
                'Summarise open incidents',
              ]}
            />
          </div>
          <div className="note">The queue shows what's waiting — not what's already been answered. Use the Conversation thread for history.</div>
        </div>
      </div>

      {/* 9. API REFERENCE */}
      <SubHead meta="QueueProps">API reference</SubHead>
      <AutoPropsTable component="Queue" label="<Queue />"/>
      <Lede>
        The <Mono>Queue</Mono> is a pure display component — it holds no internal state. Manage the items array in your parent component and pass the updated array on each remove.
      </Lede>
    </Section>
  );
}
