import * as React from 'react';
import { createPortal } from 'react-dom';
import { Attachment } from '@/components/forge/attachment';
import { Icons } from '@/components/forge/icons';
import { ModelSelector } from '@/components/forge/model-selector';
import { PromptSubmit } from '@/components/forge/prompt-submit';

interface AttachmentFile {
  name: string;
  size: string;
  kind: 'file' | 'image';
  url?: string;
  hue?: number;
}

interface PromptInputProps {
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

interface PromptInputAction {
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

const PromptInput: React.FC<PromptInputProps> = ({
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

export { PromptInput };
