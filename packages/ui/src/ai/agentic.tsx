import * as React from 'react';
// Eidos AI — agentic disclosure shells.
//
// Tool: a four-state (pending → running → done → error) collapsible block
// for one model tool call. Exports the main <Tool/> plus composable sub-parts
// <ToolStatus/>, <ToolInput/>, <ToolOutput/>.
//
// Reasoning: a streaming/settled collapsible for the model's thinking trace.
// Auto-opens while streaming, auto-collapses when done; user toggle wins.
//
// ToolStatus composes the Pill primitive (badge family) so run-states reuse
// the design system's semantic tones and CSS rather than bespoke `.tool-status`
// classes. Mapping:
//   input-streaming  → Pill tone="ice"     live  (pending / in-flight)
//   input-available  → Pill tone="warning" live  (running / executing)
//   output-available → Pill tone="success" icon=check (done)
//   output-error     → Pill tone="danger"  icon=alert (error)
//
// Styles live in src/styles/ai.css under the `.tool-*` and `.rsn-*` blocks.
import { Icons } from '../icons';
import { Code } from '../primitives';
import { StatusDot } from '../atoms';
import { Pill } from '../badge';

// ── Tool ─────────────────────────────────────────────────────────────────────

export const STATUS_META = {
  'input-streaming':  { tone: 'ice'     as const, live: true,  label: 'Pending', icon: undefined },
  'input-available':  { tone: 'warning' as const, live: true,  label: 'Running', icon: undefined },
  'output-available': { tone: 'success' as const, live: false, label: 'Done',    icon: <Icons.check size={10}/> },
  'output-error':     { tone: 'danger'  as const, live: false, label: 'Error',   icon: <Icons.alert size={10}/> },
};

// ToolStatus — the pill showing the four run-states.
// Composes Pill (badge family) so run-states reuse DS semantic tones.
// Status is real text ("Pending" etc.) for screen readers — never colour alone.
export const ToolStatus = ({
  state,
}: {
  /** Run-state key; one of the four STATUS_META entries. */
  state: string;
}) => {
  const m = STATUS_META[state as keyof typeof STATUS_META] || STATUS_META['input-streaming'];
  return (
    <Pill tone={m.tone} live={m.live} icon={m.icon} dot={!m.icon && !m.live}>
      {m.label}
    </Pill>
  );
};

// Tool — one collapsible tool-call block.
export const Tool = ({
  name,
  ns = 'eidos.ai',
  state,
  ms,
  defaultOpen,
  children,
}: {
  /** Tool function name. Mono-rendered after the namespace prefix. */
  name: string;
  /** Namespace prefix shown dimmer than the name — reads like an import path. */
  ns?: string;
  /** Drives the status pill, the auto-open behaviour, and which sections render. */
  state: string;
  /** Call duration in ms. Shown next to the name in mono when state enters an output state. */
  ms?: number;
  /** Manual override for the initial open state. Defaults to open on output-available / output-error. */
  defaultOpen?: boolean;
  /** ToolInput + (optional) ToolOutput slots. */
  children?: React.ReactNode;
}) => {
  const autoOpen = state === 'output-available' || state === 'output-error';
  const [open, setOpen] = React.useState(defaultOpen ?? autoOpen);
  const [touched, setTouched] = React.useState(false);
  React.useEffect(() => {
    if (touched) return;
    setOpen(autoOpen);
  }, [autoOpen, touched]);
  return (
    <div className="tool" data-open={open ? 'true' : 'false'}>
      <button
        className="tool-head"
        onClick={() => { setTouched(true); setOpen(v => !v); }}
        aria-expanded={open}
      >
        <span className="ico"><Icons.zap size={13}/></span>
        <span className="name"><span className="ns">{ns}.</span>{name}</span>
        {typeof ms === 'number' && <span className="ms">{ms} ms</span>}
        <span role="status" aria-live="polite" className="tool-status-live"><ToolStatus state={state}/></span>
        <Icons.chevronDown size={13} className="chev"/>
      </button>
      <div className="tool-body" aria-hidden={!open}>
        {children}
      </div>
    </div>
  );
};

// ToolInput — the JSON input section of a tool call.
export const ToolInput = ({
  params,
  streaming,
  paramsHint,
}: {
  /** Tool input args. Rendered as syntax-highlighted JSON. */
  params: object;
  /** When true, swap the JSON for shimmer placeholders while params stream in. */
  streaming?: boolean;
  /** Right-aligned meta text — e.g. "3 args" or "streaming…". */
  paramsHint?: string;
}) => (
  <div className="tool-section">
    <div className="tool-section-label">
      <span>Input</span>
      {paramsHint && <span className="meta">{paramsHint}</span>}
    </div>
    {streaming ? (
      <div className="tool-skel">
        <div className="ln" style={{ width: '70%' }}/>
        <div className="ln" style={{ width: '88%' }}/>
        <div className="ln" style={{ width: '56%' }}/>
      </div>
    ) : (
      <Code lang="json">{JSON.stringify(params, null, 2)}</Code>
    )}
  </div>
);

// ToolOutput — the result/error section of a tool call.
export const ToolOutput = ({
  label = 'Output',
  children,
  meta,
}: {
  /** Section label. Switch to "Error" when state = output-error. */
  label?: string;
  /** Rendered result. Use Eidos primitives — Table, Code, plain prose, error card. */
  children?: React.ReactNode;
  /** Right-aligned meta — row count, HTTP status, etc. */
  meta?: string;
}) => (
  <div className="tool-section">
    <div className="tool-section-label">
      <span>{label}</span>
      {meta && <span className="meta">{meta}</span>}
    </div>
    {children}
  </div>
);

// ── Reasoning ────────────────────────────────────────────────────────────────

// Reasoning — collapsible thinking trace, shown above the answer.
// Auto-opens while streaming, auto-collapses when done. User toggle wins.
export const Reasoning = ({
  streaming,
  duration,
  title,
  defaultOpen,
  onOpenChange,
  children,
}: {
  /** Drives auto-open and the shimmer verb. Flip to false when tokens stop arriving. */
  streaming?: boolean;
  /** Seconds elapsed. Mono-rendered next to the verb; pair with a useDuration hook. */
  duration?: number;
  /** Override the verb label. Default: "Thinking" while streaming, "Thought" when settled. */
  title?: string;
  /** Initial open state before any user toggle. Auto-state takes over until the user clicks. */
  defaultOpen?: boolean;
  /** Called when the user manually toggles the collapsible open/closed. */
  onOpenChange?: (open: boolean) => void;
  /** Trace content. Use mono-faced paragraphs; <em> for soft annotations, <code> for IDs. */
  children?: React.ReactNode;
}) => {
  const [userToggled, setUserToggled] = React.useState(false);
  const [open, setOpen] = React.useState(defaultOpen ?? streaming ?? false);

  // Auto-open during streaming / auto-collapse when done — but ONLY if the
  // consumer didn't pin the state with an explicit `defaultOpen`, and only
  // until the user manually toggles. Without the `defaultOpen` guard, the
  // anatomy demo (defaultOpen + streaming=false) would silently auto-close.
  React.useEffect(() => {
    if (userToggled) return;
    if (defaultOpen !== undefined) return;
    setOpen(!!streaming);
  }, [streaming, userToggled, defaultOpen]);

  const verb = streaming ? 'Thinking' : 'Thought';
  return (
    <div
      className="rsn"
      data-streaming={streaming ? 'true' : 'false'}
      data-open={open ? 'true' : 'false'}
    >
      <button
        className="rsn-trigger"
        onClick={() => {
          setUserToggled(true);
          setOpen(v => {
            const next = !v;
            onOpenChange?.(next);
            return next;
          });
        }}
        aria-expanded={open}
      >
        <span className="ico"><Icons.sparkle size={12}/></span>
        <span className="label">
          <span className="verb">{title || verb}</span>
          <span className="dot"/>
          <span className="dur">{(duration ?? 0).toFixed(1)}s</span>
        </span>
        <Icons.chevronDown size={13} className="chev"/>
      </button>
      <div className="rsn-body" aria-hidden={!open} aria-live="polite" aria-busy={!!streaming}>
        <div className="rsn-body-inner" aria-hidden={streaming ? true : undefined}>{children}</div>
      </div>
    </div>
  );
};

// ── ChainOfThought ─────────────────────────────────────────────────────────
// A collapsible, multi-step reasoning trace: each step is a kind (think /
// search / observe / plan / done) + a label + optional detail. Richer than
// Reasoning's single prose blob — use when you want the steps legible.
const COT_ICON: Record<string, string> = {
  think: 'sparkle', search: 'search', observe: 'eye', plan: 'clipboard', done: 'check', read: 'book',
};
export const ChainOfThought = ({
  title, steps = [], defaultOpen = true,
}: {
  /** Header label. Override for specialised traces ("Search trace", "Retrieval steps"). */
  title?: string;
  /** Ordered list of steps. Rendered as a semantic ol. Append steps as they stream in. */
  steps?: any[];
  /** Initial open state before any user toggle. Set false after the trace settles. */
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="ai-cot" data-open={open ? 'true' : 'false'}>
      <button className="ai-cot-head" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span className="ico"><Icons.sparkle size={13} aria-hidden="true"/></span>
        <span className="label">{title || 'Chain of thought'}</span>
        <span className="count">{steps.length} steps</span>
        <Icons.chevronDown size={13} className="chev" aria-hidden="true"/>
      </button>
      <div className="ai-cot-body" aria-hidden={!open}>
        <ol className="ai-cot-steps">
          {steps.map((s, i) => {
            const Ico = (Icons as Record<string, any>)[COT_ICON[s.kind] || 'sparkle'] || Icons.sparkle;
            return (
              <li key={i} className="ai-cot-step" data-status={s.status || 'done'}>
                <span className="ai-cot-mark"><Ico size={12} aria-hidden="true"/></span>
                <div className="ai-cot-content">
                  <div className="ai-cot-label">{s.label}</div>
                  {s.detail && <div className="ai-cot-detail">{s.detail}</div>}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

// ── Plan ───────────────────────────────────────────────────────────────────
// An ordered checklist the agent commits to and ticks off as it works.
export const Plan = ({
  title = 'Plan', items = [],
}: {
  /** Header label. Use "Plan" for the primary plan; override for named sub-plans. */
  title?: string;
  /** Ordered list of steps. Rendered as a semantic ol so screen readers announce position. */
  items?: any[];
}) => {
  const done = items.filter((i) => i.status === 'done').length;
  return (
    <div className="ai-plan">
      <div className="ai-plan-head">
        <span className="ico"><Icons.target size={13}/></span>
        <span className="label">{title}</span>
        <span className="count">{done}/{items.length}</span>
      </div>
      <ol className="ai-plan-list">
        {items.map((it, i) => (
          <li key={i} className="ai-plan-item" data-status={it.status || 'pending'}>
            <span className="ai-plan-mark">
              {it.status === 'done'
                ? <Icons.check size={11}/>
                : it.status === 'active'
                  ? <StatusDot tone="running" size="sm" pulse/>
                  : <span className="ai-plan-num">{i + 1}</span>}
            </span>
            <div className="ai-plan-content">
              <div className="ai-plan-title">{it.title}</div>
              {it.detail && <div className="ai-plan-detail">{it.detail}</div>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

// ── Task ───────────────────────────────────────────────────────────────────
// A single unit of agent work with a status and optional sub-steps. Compose
// several for a live to-do feed.
const taskMark = (status: string) => {
  if (status === 'done')   return <Icons.check size={11}/>;
  if (status === 'error')  return <Icons.x size={11}/>;
  if (status === 'active') return <StatusDot tone="running" size="sm" pulse/>;
  return <span className="ai-task-dot"/>;
};
export const Task = ({
  title, status = 'pending', detail, items,
}: {
  /** Task goal. Plain language; full-weight when active/error, muted when pending, faint-struck when done. */
  title: React.ReactNode;
  /** Drives the status mark and title weight. Transition through states as the agent works. */
  status?: string;
  /** Right-aligned (end-aligned) metadata — tier, ring, count, short observation. Mono-faced. */
  detail?: React.ReactNode;
  /** Sub-task list. Renders as a semantic ul indented from the start edge. */
  items?: any[];
}) => (
  <div className="ai-task" data-status={status}>
    <div className="ai-task-head">
      <span className="ai-task-mark"><span aria-hidden="true">{taskMark(status)}</span><span className="sr-only">{status}</span></span>
      <span className="ai-task-title">{title}</span>
      {detail && <span className="ai-task-detail">{detail}</span>}
    </div>
    {items && items.length > 0 && (
      <ul className="ai-task-subs">
        {items.map((s, i) => (
          <li key={i} className="ai-task-sub" data-status={s.status || 'pending'}>
            <span className="ai-task-mark sm"><span aria-hidden="true">{taskMark(s.status || 'pending')}</span><span className="sr-only">{s.status || 'pending'}</span></span>
            <span>{s.title}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

// ── Checkpoint ───────────────────────────────────────────────────────────────
// A save-point marker between turns — "you can restore the conversation to
// here". A centered chip on a hairline rule.
export const Checkpoint = ({
  label = 'Checkpoint', time, onRestore,
}: {
  /** Text label inside the chip. Name it after the captured state: "Before rollback", "Plan agreed". */
  label?: string;
  /** Optional timestamp. Accepts a string ("14:32", "2 min ago") or a ReactNode. Rendered in Geist Mono. */
  time?: React.ReactNode;
  /** When provided, renders a Restore button inside the chip. Called on click; consumer updates UI state. */
  onRestore?: () => void;
}) => (
  <div className="ai-checkpoint" role="separator" aria-label={`${label}${time ? ' · ' + time : ''}`}>
    <span className="ai-checkpoint-rule"/>
    <span className="ai-checkpoint-label">
      <Icons.flag size={11} className="flag-mark" aria-hidden="true"/>
      <span className="lbl">{label}</span>
      {time && <><span className="sep">·</span><span className="t">{time}</span></>}
      {onRestore && <button className="ai-checkpoint-restore" onClick={onRestore} aria-label={`Restore conversation to ${label}`}>Restore</button>}
    </span>
    <span className="ai-checkpoint-rule"/>
  </div>
);

// ── Confirmation ───────────────────────────────────────────────────────────
// The agent asks before doing something consequential. Pending shows
// Confirm/Cancel; once resolved it collapses to a result line.
export const Confirmation = ({
  title, message, tone = 'default', state = 'pending',
  confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, children,
}: {
  /** One-line label naming the action. Also the aria-label for the group. */
  title?: React.ReactNode;
  /** Explanatory text — the consequence, scope, or caveat. Recommended for destructive actions. */
  message?: React.ReactNode;
  /** default uses an ember Confirm button; danger uses the danger red for destructive actions. */
  tone?: string;
  /** Controls what renders. pending shows the full card; confirmed/cancelled render a compact result line. */
  state?: string;
  /** Label on the primary action button. Name the action: "Drop deploy", "Delete service". */
  confirmLabel?: string;
  /** Label on the secondary action button. */
  cancelLabel?: string;
  /** Called when Confirm is clicked. Wire this to set state to "confirmed". */
  onConfirm?: () => void;
  /** Called when Cancel is clicked. Wire this to set state to "cancelled". */
  onCancel?: () => void;
  /** Rendered inside the card body below message — use for custom content (e.g. a diff, affected resources). */
  children?: React.ReactNode;
}) => (
  <div className="ai-confirm" data-state={state} data-tone={tone} role="group" aria-label={typeof title === 'string' ? title : 'Confirmation'}>
    <div className="ai-confirm-body">
      <span className="ai-confirm-ico" aria-hidden="true"><Icons.alert size={14}/></span>
      <div className="ai-confirm-text">
        {title && <div className="ai-confirm-title">{title}</div>}
        {message && <div className="ai-confirm-msg">{message}</div>}
        {children}
      </div>
    </div>
    {state === 'pending' ? (
      <div className="ai-confirm-actions">
        <button className="btn xs ghost" onClick={onCancel}>{cancelLabel}</button>
        <button className={'btn xs ' + (tone === 'danger' ? 'danger' : 'ember')} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    ) : (
      <div className="ai-confirm-result" data-state={state}>
        {state === 'confirmed'
          ? <><Icons.check size={12} aria-hidden="true"/> {confirmLabel}</>
          : <><Icons.x size={12} aria-hidden="true"/> {cancelLabel}</>}
      </div>
    )}
  </div>
);

// ── Queue ──────────────────────────────────────────────────────────────────
// Prompts the user has lined up while the agent is busy. Ordered, removable.
export const Queue = ({
  title = 'Queued', items = [], onRemove,
}: {
  /** Header label shown beside the list icon. Update to match product voice ("Next up", "Pending"). */
  title?: string;
  /** Items in order. Accepts plain strings or objects with a text field. */
  items?: any[];
  /** Called with the 0-based index of the removed item. When omitted, the remove button is not rendered. */
  onRemove?: (i: number) => void;
}) => {
  // Roving focus after a remove: keep refs to the per-item remove buttons and,
  // once the parent has re-rendered with the shorter list, move focus to the
  // remove button now occupying the removed index (the next item), falling back
  // to the new last item — so keyboard users can keep clearing without lifting
  // their hands. Documented in queue.tsx (Keyboard a11y card).
  const btnRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const pendingFocus = React.useRef<number | null>(null);

  const handleRemove = (i: number) => {
    pendingFocus.current = i;
    onRemove?.(i);
  };

  React.useLayoutEffect(() => {
    const target = pendingFocus.current;
    pendingFocus.current = null;
    if (target === null) return;
    if (items.length === 0) return; // list emptied — nothing to focus
    const idx = Math.min(target, items.length - 1);
    btnRefs.current[idx]?.focus();
  }, [items.length]);

  return (
    <div className="ai-queue">
      <div className="ai-queue-head">
        <Icons.list size={12}/><span>{title}</span>
        <span className="count" role="status" aria-live="polite">{items.length}</span>
      </div>
      <ol className="ai-queue-list">
        {items.map((it, i) => (
          <li key={i} className="ai-queue-item">
            <span className="ai-queue-pos">{i + 1}</span>
            <span className="ai-queue-text">{typeof it === 'string' ? it : it.text}</span>
            {onRemove && (
              <button
                className="ai-queue-remove"
                aria-label="Remove from queue"
                ref={el => { btnRefs.current[i] = el; }}
                onClick={() => handleRemove(i)}
              >
                <Icons.x size={12}/>
              </button>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};
