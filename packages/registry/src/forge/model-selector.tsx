import * as React from 'react';
import { createPortal } from 'react-dom';
import { Icons } from '@/components/forge/icons';
import { ModelBadge } from '@/components/forge/model-badge';

interface ModelOption {
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

const ModelSelector = ({
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

export { ModelSelector };
