import * as React from 'react';
import { createPortal } from 'react-dom';
// Eidos AI — prompt-input composer + suggestion chips.
//
// PromptInput parts: SubmitBtn (→ exported as PromptSubmit), ModelPicker
// (→ ModelSelector), ModelBadge, Attachment, DropZone, DragDropOverlay.
// These use the `.pi-*` CSS family from ai.css. Styles are NOT in this file.
//
// ModelBadge composes Chip (badge family) — a compact monospaced chip
// preset for 1–2 letter model abbreviations inside the ModelSelector trigger.
//
// Suggestion + SuggestionCard: starter-prompt chips in `.sg-*` CSS.
//
// Styles live in src/styles/ai.css.
import { Icons } from '../icons';
import { Chip } from '../badge';

// ── PromptSubmit (SubmitBtn) ─────────────────────────────────────────────────
// Status-aware submit button inside the composer footer.
//   status    "ready" | "submitted" | "streaming" | "error"
//   hasText   boolean — when ready, disabled unless there is text
//   onClick   handler
export const PromptSubmit = ({
  status,
  hasText,
  onClick,
}: {
  status: 'ready' | 'submitted' | 'streaming' | 'error';
  hasText?: boolean;
  onClick?: () => void;
}) => {
  if (status === 'submitted') return (
    <button className="pi-submit is-submitted" disabled>
      <span className="pi-submit-spin"/>
    </button>
  );
  if (status === 'streaming') return (
    <button className="pi-submit is-streaming" onClick={onClick} aria-label="Stop generating">
      <span style={{ width: 11, height: 11, background: 'currentColor', borderRadius: 2 }}/>
    </button>
  );
  if (status === 'error') return (
    <button className="pi-submit is-error" onClick={onClick} aria-label="Retry">
      <Icons.alert size={14}/>
    </button>
  );
  return (
    <button className="pi-submit" onClick={onClick} disabled={!hasText} aria-label="Send">
      <Icons.arrowUp size={14}/>
    </button>
  );
};

// SubmitBtn alias for backward-compat
export const SubmitBtn = PromptSubmit;

// ── ModelBadge ───────────────────────────────────────────────────────────────
// 1–2 letter mono chip used inside the model picker trigger. Composes Chip
// (badge family) with a compact size override so it fits inline in the trigger.
export const ModelBadge = ({ short = 'S' }: { short?: string }) => (
  <Chip
    style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700, padding: '1px 5px' }}
  >
    {short}
  </Chip>
);

// ── ModelSelector (ModelPicker) ──────────────────────────────────────────────
// Model drop-up inside the composer footer. Anchors above the trigger.
//   value     string — current model id
//   onChange  (id: string) => void
//   models    optional array override (default: Eidos-example models)
export interface ModelOption {
  id: string;
  short: string;
  name: string;
  cost?: string;
}

const DEFAULT_MODELS: ModelOption[] = [
  { id: 'eidos-sonnet-4-6', short: 'S',  name: 'Sonnet 4.6', cost: '$3 / 1M' },
  { id: 'eidos-opus-4-7',   short: 'O',  name: 'Opus 4.7',   cost: '$15 / 1M' },
  { id: 'eidos-haiku-4-5',  short: 'H',  name: 'Haiku 4.5',  cost: '$1 / 1M' },
];

export const ModelSelector = ({
  value,
  onChange,
  models = DEFAULT_MODELS,
}: {
  /** The id of the currently selected model. Must match one of the ids in the models array. */
  value: string;
  /** Called with the model id when the user selects a different option. The parent is responsible for updating value. */
  onChange: (id: string) => void;
  /** Optional array of model definitions. Defaults to three Eidos-hosted models (Sonnet, Opus, Haiku). */
  models?: ModelOption[];
}) => {
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState<number>(-1);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  // Anchor position for the portaled menu — re-measured every layout pass
  // while open. We position the menu ABOVE the trigger by default (composers
  // usually live near the bottom of a thread); flip BELOW when no room.
  const [pos, setPos] = React.useState<{ top: number; left: number; width: number } | null>(null);
  const current = models.find(m => m.id === value) || models[0];
  const currentIdx = Math.max(0, models.findIndex(m => m.id === current.id));

  React.useEffect(() => { if (open) setFocused(currentIdx); }, [open, currentIdx]);

  // Measure the trigger AND the rendered menu, then place the menu above
  // (or below if cramped). useLayoutEffect avoids the one-frame flash where
  // an unpositioned menu paints at top:0.
  const place = React.useCallback(() => {
    const t = triggerRef.current;
    if (!t) return;
    const r = t.getBoundingClientRect();
    const menuH = menuRef.current?.getBoundingClientRect().height ?? 0;
    const GAP = 6;
    const fitsAbove = r.top - GAP - menuH >= 8;
    const top = fitsAbove
      ? r.top - GAP - menuH
      : r.bottom + GAP;
    setPos({ top, left: r.left, width: Math.max(r.width, 220) });
  }, []);

  React.useLayoutEffect(() => { if (open) place(); }, [open, place]);
  React.useEffect(() => {
    if (!open) return;
    const onWin = () => place();
    window.addEventListener('scroll', onWin, true);
    window.addEventListener('resize', onWin);
    return () => {
      window.removeEventListener('scroll', onWin, true);
      window.removeEventListener('resize', onWin);
    };
  }, [open, place]);

  // Outside-click + Escape close. menuRef contains the portaled menu so we
  // must allow clicks inside it through (it's not a child of wrapRef).
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapRef.current && wrapRef.current.contains(t)) return;
      if (menuRef.current && menuRef.current.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Roving-keyboard handler bound to the FOCUSED trigger button (the portaled
  // listbox is tabIndex={-1} and never receives focus, so the handler must
  // live here). When closed, Arrow/Enter/Space open the menu; when open they
  // move the highlighted option (aria-activedescendant) or select + close.
  const onTriggerKey = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocused(f => (f + 1) % models.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setFocused(f => (f - 1 + models.length) % models.length); }
    else if (e.key === 'Home') { e.preventDefault(); setFocused(0); }
    else if (e.key === 'End')  { e.preventDefault(); setFocused(models.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const m = models[focused];
      if (m) { onChange(m.id); setOpen(false); }
    }
  };

  const listboxId = 'ms-listbox-' + React.useId();

  // Position-only inline styles. Visual styling (bg, border, shadow, padding,
  // max-height, overflow) lives in the self-contained `.pi-menu-portal` class,
  // so there is no inheritance from the in-flow `.pi-menu` rule (which is
  // position:absolute and used elsewhere by non-portaled menus).
  const menuStyle: React.CSSProperties = pos
    ? { top: pos.top, left: pos.left, minWidth: pos.width, visibility: 'visible' }
    : { top: -9999, left: -9999, visibility: 'hidden', pointerEvents: 'none' };

  const menu = open && typeof document !== 'undefined' && createPortal(
    <div
      ref={menuRef}
      id={listboxId}
      className="pi-menu-portal"
      style={menuStyle}
      role="listbox" aria-label="Choose a model"
      aria-activedescendant={'ms-' + (models[focused]?.id || current.id)}
      tabIndex={-1}
    >
      {models.map((m, i) => {
        const isCurrent = m.id === current.id;
        const isFocused = i === focused;
        return (
          <div
            key={m.id}
            id={'ms-' + m.id}
            role="option"
            aria-selected={isCurrent}
            aria-current={isCurrent ? 'true' : undefined}
            className={'pi-menu-item' + (isCurrent ? ' is-active' : '') + (isFocused ? ' is-focused' : '')}
            onClick={() => { onChange(m.id); setOpen(false); }}
            onMouseEnter={() => setFocused(i)}
          >
            <ModelBadge short={m.short}/>
            <span>{m.name}</span>
            {m.cost && <span className="sub">{m.cost}</span>}
          </div>
        );
      })}
    </div>,
    document.body,
  );

  return (
    <div style={{ position: 'relative' }} ref={wrapRef}>
      <button
        ref={triggerRef}
        className="pi-model"
        onClick={() => setOpen(v => !v)}
        onKeyDown={onTriggerKey}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={open ? 'ms-' + (models[focused]?.id || current.id) : undefined}
      >
        <ModelBadge short={current.short}/>
        <span className="name">{current.name}</span>
        <Icons.chevronDown size={11}/>
      </button>
      {menu}
    </div>
  );
};

// ModelPicker alias for backward-compat
export const ModelPicker = ModelSelector;

// ── Attachment ───────────────────────────────────────────────────────────────
// One attachment chip in the composer header.
//   file      { name, size, kind: "file" | "image", url?, hue? }
//   onRemove  () => void
//   progress  number (0–100) — shows per-chip progress bar when uploading
export interface AttachmentFile {
  name: string;
  size: string;
  kind: 'file' | 'image';
  url?: string;
  hue?: number;
}

const FakeImage = ({ hue = 12 }: { hue?: number }) => (
  <svg viewBox="0 0 40 40" aria-hidden="true">
    <defs>
      <linearGradient id={'fg' + hue} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"  stopColor={`hsl(${hue}, 80%, 55%)`}/>
        <stop offset="100%" stopColor={`hsl(${hue + 60}, 70%, 45%)`}/>
      </linearGradient>
    </defs>
    <rect width="40" height="40" fill={`url(#fg${hue})`}/>
    <circle cx="28" cy="14" r="4" fill="rgba(255,255,255,0.35)"/>
    <path d="M 4 36 L 14 22 L 22 30 L 32 18 L 40 28 L 40 40 L 4 40 Z" fill="rgba(0,0,0,0.25)"/>
  </svg>
);

export const Attachment = ({
  file,
  onRemove,
  progress,
}: {
  file: AttachmentFile;
  onRemove?: () => void;
  progress?: number;
}) => {
  const isImage = file.kind === 'image';
  const cls = ['pi-att'];
  if (isImage) cls.push('image');
  if (progress != null && progress < 100) cls.push('is-uploading');
  return (
    <div className={cls.join(' ')}>
      <span className="thumb">
        {isImage
          ? (file.url ? <img src={file.url} alt=""/> : <FakeImage hue={file.hue || 12}/>)
          : <Icons.file size={13}/>}
      </span>
      <span className="meta">
        <span className="name">{file.name}</span>
        <span className="sz">{file.size}{progress != null && progress < 100 ? ` · ${progress}%` : ''}</span>
      </span>
      {onRemove && (
        <button className="close" onClick={onRemove} aria-label={`Remove ${file.name}`}>
          <Icons.x size={11}/>
        </button>
      )}
      {progress != null && progress < 100 && (
        <span className="progress"><span style={{ width: progress + '%' }}/></span>
      )}
    </div>
  );
};

// ── DropZone ─────────────────────────────────────────────────────────────────
// Basic drag-and-drop compositor with a footer drop hint.
export const DropZone = ({
  onDrop,
  modelValue = 'eidos-sonnet-4-6',
  onModelChange,
  children,
}: {
  onDrop?: (files: FileList) => void;
  modelValue?: string;
  onModelChange?: (id: string) => void;
  children?: React.ReactNode;
}) => {
  const [drag, setDrag] = React.useState(false);
  return (
    <div
      className={'pi' + (drag ? ' is-dragging' : '')}
      onDragEnter={e => { e.preventDefault(); setDrag(true); }}
      onDragOver={e => { e.preventDefault(); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => {
        e.preventDefault();
        setDrag(false);
        if (onDrop) onDrop(e.dataTransfer.files);
      }}
    >
      {children || (
        <div className="pi-body">
          <textarea className="pi-textarea" placeholder="Drag a file anywhere on this composer…" rows={2}/>
        </div>
      )}
      {drag ? (
        <div className="pi-drop-hint">
          <Icons.upload size={14}/> Drop to attach
        </div>
      ) : (
        <div className="pi-foot">
          <button className="pi-tool"><Icons.paperclip size={15}/></button>
          {onModelChange && (
            <ModelSelector value={modelValue} onChange={onModelChange}/>
          )}
          <span className="spacer"/>
          <PromptSubmit status="ready" hasText={false} onClick={() => {}}/>
        </div>
      )}
    </div>
  );
};

// ── DragDropOverlay ──────────────────────────────────────────────────────────
// Full-shell ember overlay variant (paints a veil over the whole composer).
export const DragDropOverlay = ({
  onDrop,
  modelValue = 'eidos-sonnet-4-6',
  onModelChange,
  initialFiles = [],
  placeholder,
}: {
  onDrop?: (files: FileList) => void;
  modelValue?: string;
  onModelChange?: (id: string) => void;
  initialFiles?: (AttachmentFile & { id: string })[];
  placeholder?: string;
}) => {
  const [drag, setDrag] = React.useState(false);
  const [files, setFiles] = React.useState(initialFiles);
  return (
    <div
      className={'pi' + (drag ? ' is-dragging' : '')}
      style={{ position: 'relative' }}
      onDragEnter={e => { e.preventDefault(); setDrag(true); }}
      onDragOver={e => { e.preventDefault(); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => {
        e.preventDefault();
        setDrag(false);
        if (onDrop) onDrop(e.dataTransfer.files);
        setFiles(f => f.concat({
          id: 'f' + Date.now(),
          name: 'pasted-trace.json',
          size: '2.1 KB',
          kind: 'file',
        }));
      }}
    >
      {files.length > 0 && (
        <div className="pi-head">
          {files.map(f => (
            <Attachment
              key={f.id}
              file={f}
              onRemove={() => setFiles(arr => arr.filter(x => x.id !== f.id))}
            />
          ))}
        </div>
      )}
      <div className="pi-body">
        <textarea
          className="pi-textarea"
          placeholder={placeholder || 'Drag a file anywhere on this composer…'}
          rows={2}
          readOnly
          defaultValue="Have a look — anything jump out from the trace?"
        />
      </div>
      <div className="pi-foot">
        <button className="pi-tool"><Icons.paperclip size={15}/></button>
        {onModelChange && <ModelSelector value={modelValue} onChange={onModelChange}/>}
        <span className="spacer"/>
        <PromptSubmit status="ready" hasText={true} onClick={() => {}}/>
      </div>
      {drag && (
        <div className="pi-drop-overlay">
          <Icons.upload size={22}/>
          <span>Drop to attach</span>
          <span className="sub">images · PDFs · logs · up to 20 MB</span>
        </div>
      )}
    </div>
  );
};

// ── PromptInput ──────────────────────────────────────────────────────────────
// Composite prompt-input shell: optional attachment header, auto-sizing textarea,
// footer toolbar (attach · model · spacer · submit). Covers all states:
//   status   "ready" | "submitted" | "streaming" | "error"
//   disabled boolean — locks the entire composer (e.g. waiting for attachments to upload)
//   invalid  boolean — danger border + ring for validation failure
//
// The component is a thin controlled wrapper over the .pi-* CSS class family.
// All parts (PromptSubmit, ModelSelector, Attachment, DropZone) are separately
// exported so consumers can compose custom toolbars.
export interface PromptInputProps {
  /** Current status — drives the submit button icon and fill. */
  status?: 'ready' | 'submitted' | 'streaming' | 'error';
  /** When true, the whole composer is locked (textarea disabled, tools disabled, submit disabled). */
  disabled?: boolean;
  /** When true, paints a danger border + ring for validation failure. */
  invalid?: boolean;
  /** Placeholder text shown in the textarea. */
  placeholder?: string;
  /** Initial or controlled textarea value. */
  value?: string;
  /** Called on value changes (controlled usage). */
  onChange?: (value: string) => void;
  /** Called on Enter (without Shift) or the submit button click. */
  onSubmit?: (value: string) => void;
  /** Called on the stop button click while status="streaming". */
  onStop?: () => void;
  /** Model value for the ModelSelector; omit to hide the picker. */
  modelValue?: string;
  /** Called when the user picks a different model. */
  onModelChange?: (id: string) => void;
  /** Array of attachment files rendered in the header. */
  attachments?: (AttachmentFile & { id: string })[];
  /** Called when an attachment × is clicked. */
  onRemoveAttachment?: (id: string) => void;
  /** Extra content to render in the footer, after the attach icon and before the spacer. */
  footerTools?: React.ReactNode;
  /** Stable slot for the context indicator (e.g. <ContextGauge/>). Rendered
   *  in the footer right before the model selector / submit. Use this rather
   *  than footerTools so the gauge has a consistent position across products. */
  contextSlot?: React.ReactNode;
  /** Textarea rows (default 1; auto-grows up to max-height). */
  rows?: number;
  /** Optional banner ribbon ABOVE the textarea, INSIDE the bordered shell.
   *  Use for upgrade prompts, context hints, model-warning chips, etc. */
  topBanner?: React.ReactNode;
  /** When set, replaces the default paperclip button with a "+" button that
   *  opens a context menu of these actions. Items can include dividers and
   *  destructive (danger-toned) entries. */
  actions?: PromptInputAction[];
  /** Called when an actions menu item is clicked. */
  onActionSelect?: (id: string) => void;
  /** Supporting text rendered BELOW the bordered shell — small, muted,
   *  centred. Use for legal nags ("AI can make mistakes — please double-check"). */
  footerHint?: React.ReactNode;
  /** Adds a subtle DS shadow (--shadow-1) below the field for a soft lift. */
  elevated?: boolean;
}

// ── PromptBanner ─────────────────────────────────────────────────────────────
// Sub-component for the topBanner slot. Renders a 1-line ribbon at the top
// of the .pi shell with an icon, a label, an optional ember CTA, and an
// optional dismiss × button. Tones map to the DS status colors:
//   "promo"   ember (the default — upgrade / new-feature nudges)
//   "info"    neutral (system / context note)
//   "warn"    warning (degradation / cost guard)
//   "success" success (just-saved / connected)
//   "danger"  danger (rate-limit / blocked)
// Tone drives ONLY the icon + CTA tint — the banner background stays
// transparent so it shares the shell surface with the input field.
export type PromptBannerTone = 'promo' | 'info' | 'warn' | 'success' | 'danger';

const TONE_ICON: Record<PromptBannerTone, string> = {
  promo:   'sparkle',
  info:    'info',
  warn:    'alert',
  success: 'check',
  danger:  'alert',
};

export const PromptBanner = ({
  tone = 'promo',
  icon,
  cta,
  onCtaClick,
  onDismiss,
  children,
}: {
  /** Tints the icon + CTA. Default "promo" (ember). */
  tone?: PromptBannerTone;
  /** Override the tone-default icon. Pass an `Icons.*` name. */
  icon?: string;
  /** Trailing CTA label (rendered ember). Omit for a message-only ribbon. */
  cta?: string;
  /** CTA click handler. */
  onCtaClick?: () => void;
  /** When set, shows a × dismiss button after the CTA. */
  onDismiss?: () => void;
  /** Banner message. */
  children: React.ReactNode;
}) => {
  const iconName = icon || TONE_ICON[tone];
  const IconCmp = (Icons as Record<string, any>)[iconName];
  const toneCls = ' tone-' + tone;
  // Render as a Fragment so the icon / text / CTA / × become direct flex
  // children of the `.pi-banner` slot (no extra wrapper div). Tone is set on
  // each child independently so the icon + CTA can pick up the right tint.
  return (
    <>
      {IconCmp && (
        <span className={'pi-banner-icon' + toneCls} aria-hidden="true">
          <IconCmp size={13}/>
        </span>
      )}
      <span className="pi-banner-text">{children}</span>
      {cta && (
        <button
          type="button"
          className={'pi-banner-cta' + toneCls}
          onClick={onCtaClick}
        >
          {cta}
        </button>
      )}
      {onDismiss && (
        <button
          type="button"
          className="pi-banner-x"
          onClick={onDismiss}
          aria-label="Dismiss banner"
        >
          <Icons.x size={11}/>
        </button>
      )}
    </>
  );
};

export interface PromptInputAction {
  id: string;
  /** Visible label. */
  label: string;
  /** Optional second line below the label (muted). */
  description?: string;
  /** Icon name keyed into Icons. */
  icon?: string;
  /** Renders a hairline divider instead of a clickable row. */
  divider?: boolean;
  /** Tints the item danger. */
  destructive?: boolean;
  /** Item-level click handler. onActionSelect (component-level) also fires. */
  onSelect?: () => void;
}

// PromptActions — the "+" button that opens a context menu of actions.
// Portals the menu to <body> using the same pattern as ModelSelector so
// it escapes any container clipping. Position-only inline styles; visual
// chrome inherits .pi-menu-portal.
const PromptActions = ({
  actions, onSelect, disabled,
}: {
  actions: PromptInputAction[];
  onSelect?: (id: string) => void;
  disabled?: boolean;
}) => {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState<{ top: number; left: number; width: number } | null>(null);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const place = React.useCallback(() => {
    const t = triggerRef.current; if (!t) return;
    const r = t.getBoundingClientRect();
    const menuH = menuRef.current?.getBoundingClientRect().height ?? 0;
    const GAP = 8;
    const fitsAbove = r.top - GAP - menuH >= 8;
    const top = fitsAbove ? r.top - GAP - menuH : r.bottom + GAP;
    setPos({ top, left: r.left, width: Math.max(r.width, 240) });
  }, []);

  React.useLayoutEffect(() => { if (open) place(); }, [open, place]);
  React.useEffect(() => {
    if (!open) return;
    const onWin = () => place();
    window.addEventListener('scroll', onWin, true);
    window.addEventListener('resize', onWin);
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapRef.current && wrapRef.current.contains(t)) return;
      if (menuRef.current && menuRef.current.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onWin, true);
      window.removeEventListener('resize', onWin);
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, place]);

  const menuStyle: React.CSSProperties = pos
    ? { top: pos.top, left: pos.left, minWidth: pos.width, visibility: 'visible' }
    : { top: -9999, left: -9999, visibility: 'hidden', pointerEvents: 'none' };

  const menu = open && typeof document !== 'undefined' && createPortal(
    <div
      ref={menuRef}
      className="pi-menu-portal pi-actions-menu"
      style={menuStyle}
      role="menu"
      aria-label="Prompt actions"
    >
      {actions.map((a, i) =>
        a.divider
          ? <div key={'div-' + i} className="pi-actions-divider" role="separator"/>
          : (
            <button
              key={a.id}
              type="button"
              role="menuitem"
              className={'pi-actions-item' + (a.destructive ? ' is-danger' : '')}
              onClick={() => {
                onSelect && onSelect(a.id);
                a.onSelect && a.onSelect();
                setOpen(false);
              }}
            >
              {a.icon && (Icons as Record<string, any>)[a.icon] && (
                <span className="pi-actions-ico">
                  {React.createElement((Icons as Record<string, any>)[a.icon], { size: 14 })}
                </span>
              )}
              <span className="pi-actions-text">
                <span className="label">{a.label}</span>
                {a.description && <span className="desc">{a.description}</span>}
              </span>
            </button>
          )
      )}
    </div>,
    document.body,
  );

  return (
    <div ref={wrapRef} style={{ display: 'inline-flex' }}>
      <button
        ref={triggerRef}
        type="button"
        className="pi-tool"
        onClick={() => setOpen(v => !v)}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open actions menu"
      >
        <Icons.plus size={15}/>
      </button>
      {menu}
    </div>
  );
};

export const PromptInput: React.FC<PromptInputProps> = ({
  status = 'ready',
  disabled = false,
  invalid = false,
  placeholder = 'Ask anything…',
  value,
  onChange,
  onSubmit,
  onStop,
  modelValue,
  onModelChange,
  attachments = [],
  onRemoveAttachment,
  footerTools,
  contextSlot,
  rows = 1,
  topBanner,
  actions,
  onActionSelect,
  footerHint,
  elevated,
}) => {
  const [localText, setLocalText] = React.useState(value ?? '');
  const text = value !== undefined ? value : localText;
  const taRef = React.useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setLocalText(v);
    if (onChange) onChange(v);
    // auto-size
    const el = taRef.current;
    if (el) { el.style.height = 'auto'; el.style.height = Math.min(220, el.scrollHeight) + 'px'; }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (status === 'ready' && text.trim() && !disabled && onSubmit) {
        onSubmit(text);
      }
    }
  };

  const shellCls = ['pi'];
  if (invalid) shellCls.push('is-invalid');
  if (elevated) shellCls.push('is-elevated');
  if (topBanner) shellCls.push('has-banner');

  // When a banner is present: the .pi outer shell carries the focus ring
  // (wrapping banner + field together) and a softer background, while a
  // nested .pi-field holds the body + foot with ROUNDED TOP CORNERS against
  // the banner — flush against .pi's sides and bottom (only the input's top
  // edge gets the rounding, sides + bottom share the outer container).
  // Without a banner: the body + foot render directly inside .pi (legacy
  // single-card layout — no behavioural change for plain composers).
  const inputBlock = (
    <>
      {attachments.length > 0 && (
        <div className="pi-head">
          {attachments.map(f => (
            <Attachment
              key={f.id}
              file={f}
              onRemove={onRemoveAttachment ? () => onRemoveAttachment(f.id) : undefined}
            />
          ))}
        </div>
      )}
      <div className="pi-body">
        <textarea
          ref={taRef}
          className="pi-textarea"
          placeholder={placeholder}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled || status === 'submitted'}
          rows={rows}
          aria-label={placeholder}
          aria-busy={status === 'submitted' || status === 'streaming' ? true : undefined}
          aria-invalid={invalid || undefined}
        />
      </div>
      <div className="pi-foot">
        {actions && actions.length > 0 ? (
          <PromptActions
            actions={actions}
            onSelect={onActionSelect}
            disabled={disabled || status === 'submitted'}
          />
        ) : (
          <button className="pi-tool" disabled={disabled || status === 'submitted'} title="Attach file">
            <Icons.paperclip size={15}/>
          </button>
        )}
        {footerTools}
        <span className="spacer"/>
        {contextSlot && <span className="pi-ctx-slot">{contextSlot}</span>}
        {modelValue !== undefined && onModelChange && (
          <ModelSelector value={modelValue} onChange={onModelChange}/>
        )}
        <PromptSubmit
          status={status}
          hasText={text.trim().length > 0}
          onClick={status === 'streaming' ? onStop : onSubmit ? () => onSubmit(text) : undefined}
        />
      </div>
    </>
  );

  return (
    <div className="pi-shell">
      <div className={shellCls.join(' ')}>
        {topBanner && <div className="pi-banner">{topBanner}</div>}
        {topBanner ? <div className="pi-field">{inputBlock}</div> : inputBlock}
      </div>
      {footerHint && <div className="pi-hint">{footerHint}</div>}
    </div>
  );
};

// ── Suggestion + SuggestionCard ──────────────────────────────────────────────
// Starter-prompt chip (inline pill) and high-emphasis tile card.
// CSS family: `.sg-*` from ai.css.

// Suggestion — a clickable pill. Three sizes (sm / md / lg).
//   icon     ReactNode — optional 11–13px leading icon
//   size     "sm" | "md" | "lg"
//   pressed  boolean — locks ember-soft fill (already-picked filter)
//   onClick  () => void
export const Suggestion = ({
  icon,
  children,
  size = 'md',
  pressed,
  onClick,
}: {
  /** Optional 11–13px leading icon. */
  icon?: React.ReactNode;
  /** Label text. Sentence case, up to 8 words. */
  children: React.ReactNode;
  /** Chip size. sm for inline mid-thread; lg for empty state hero rows. */
  size?: 'sm' | 'md' | 'lg';
  /** Locks the ember-soft fill — use for already-picked filters. */
  pressed?: boolean;
  /** Fires when the chip is activated (click or Enter/Space). */
  onClick?: () => void;
}) => (
  <button
    className={'sg ' + (size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : '') + (pressed ? ' is-on' : '')}
    aria-pressed={pressed}
    onClick={onClick}
  >
    {icon && <span className="ico" aria-hidden="true">{icon}</span>}
    <span>{children}</span>
  </button>
);

// SuggestionCard — high-emphasis tile for empty-state grids.
//   icon     ReactNode — ember-soft tile icon
//   title    string    — headline (≤ 12 words)
//   line     string    — supporting line (≤ 15 words)
//   onClick  () => void
export const SuggestionCard = ({
  icon,
  title,
  line,
  onClick,
}: {
  /** Small ember-soft tile icon at the top of the card. */
  icon: React.ReactNode;
  /** Headline — usually a question. Up to 12 words. */
  title: string;
  /** Supporting line under the title. Up to 15 words. */
  line: string;
  /** Fires when the tile is activated. */
  onClick?: () => void;
}) => (
  <button className="sg-card" onClick={onClick}>
    <span className="ico" aria-hidden="true">{icon}</span>
    <span className="title">{title}</span>
    <span className="line">{line}</span>
  </button>
);
