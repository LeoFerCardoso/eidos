import * as React from 'react';
import { createPortal } from 'react-dom';
import { Icons } from './icons';
// Eidos DS — Custom Select.
//
// Single-value picker from a closed set with custom rendering (icons,
// descriptions, groups). For typeahead + multi-select + chips, use Combobox.
//
// CSS classes live in packages/ui/styles/tokens.css (.sel-* block).
// No <style> block here — emit className strings only.
//
// Panel uses position:fixed + getBoundingClientRect() to escape
// parent overflow:hidden (e.g. .ds-frame).

// ── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
  /** Optional leading icon element (or component). */
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  /** Short description rendered below the label in the panel. */
  description?: string;
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps {
  /** Controlled value. */
  value?: string;
  /** Called when the user picks a new option. */
  onValueChange?: (value: string) => void;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Flat option list. Mutually exclusive with `groups`. */
  options?: SelectOption[];
  /** Grouped option list — renders a mono uppercase heading per cluster. */
  groups?: SelectGroup[];
  /** Faint placeholder shown when no value is selected. */
  placeholder?: string;
  /** Render a search filter above the list. Recommended when > ~10 options. */
  searchable?: boolean;
  /** Placeholder inside the search input. */
  searchPlaceholder?: string;
  /** Trigger height: sm = 26px, md = 32px (default), lg = 40px. */
  size?: 'sm' | 'md' | 'lg';
  /** Locks the trigger; standard disabled semantics. */
  disabled?: boolean;
  /** Paints the trigger border + ring with --danger. */
  invalid?: boolean;
  /** Danger message — also implies `invalid`. */
  error?: React.ReactNode;
  /** Helper text shown below the field when no error. */
  help?: React.ReactNode;
  /** Accessible label rendered above the trigger. */
  label?: React.ReactNode;
  /** Leading icon shown inside the trigger (and optionally options). */
  leadingIcon?: React.ComponentType<{ size?: number; className?: string }>;
  /** Expand to 100% container width. */
  full?: boolean;
  /** Override the inline width (e.g. "320px"). */
  width?: string;
  /** Message shown when the search matches no options. */
  emptyText?: string;
  /** Accessible id for the trigger button. */
  id?: string;
  /** Extra classes on the root wrapper. */
  className?: string;
}

// ── Component ────────────────────────────────────────────────────────────────

export const Select = (props: SelectProps) => {
  const {
    value: valueProp,
    onValueChange,
    defaultValue,
    options = [],
    groups,
    placeholder = 'Select…',
    searchable = false,
    searchPlaceholder = 'Search…',
    size = 'md',
    disabled = false,
    invalid = false,
    error,
    help,
    label,
    leadingIcon: LeadingIcon,
    full = false,
    width,
    emptyText = 'No matches',
    id,
    className = '',
  } = props;

  const reactId = React.useId();
  const triggerId = id || reactId;
  // Stable prefix for option element ids (aria-activedescendant target).
  const optionIdPrefix = `${reactId}-opt`;
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue);
  const value = isControlled ? valueProp : internalValue;

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [panelPos, setPanelPos] = React.useState<{ top: number; left: number; width: number } | null>(null);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Flatten groups for keyboard / search, preserving group structure for render.
  const flat: SelectOption[] = React.useMemo(
    () => (groups ? groups.flatMap((g) => g.options) : options),
    [groups, options]
  );

  const filtered: SelectOption[] = React.useMemo(() => {
    if (!searchable || !query.trim()) return flat;
    const q = query.toLowerCase();
    return flat.filter((o) =>
      (o.label + ' ' + (o.description || '')).toLowerCase().includes(q)
    );
  }, [flat, query, searchable]);

  const selected = flat.find((o) => o.value === value) ?? null;
  const isInvalid = invalid || !!error;

  // ── Panel placement ───────────────────────────────────────────────────────

  React.useEffect(() => {
    if (!open) { setPanelPos(null); return; }
    const place = () => {
      if (!triggerRef.current) return;
      const r = triggerRef.current.getBoundingClientRect();
      setPanelPos({ top: r.bottom + 4, left: r.left, width: r.width });
    };
    place();
    // Reposition the fixed panel as the page scrolls/resizes — do NOT close
    // (closing on any scroll fired spuriously, e.g. when focus scrolled an
    // ancestor, slamming the panel shut). Closing is owned by outside-click /
    // Escape / selection.
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open]);

  // ── Click-outside + Escape ────────────────────────────────────────────────

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // ── Auto-focus search + reset on close ───────────────────────────────────

  React.useEffect(() => {
    if (open && searchable) {
      const t = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open, searchable]);

  React.useEffect(() => {
    if (!open) { setQuery(''); setActiveIdx(0); }
  }, [open]);

  React.useEffect(() => { setActiveIdx(0); }, [query]);

  // ── Commit selection ──────────────────────────────────────────────────────

  const commit = (opt: SelectOption) => {
    if (opt.disabled) return;
    if (!isControlled) setInternalValue(opt.value);
    onValueChange?.(opt.value);
    setOpen(false);
    setQuery('');
    triggerRef.current?.focus();
  };

  // ── Keyboard navigation ───────────────────────────────────────────────────

  const handleTriggerKey = (e: React.KeyboardEvent) => {
    if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
      if (!open) { e.preventDefault(); setOpen(true); }
    }
  };

  const handleListKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(filtered.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[activeIdx]) commit(filtered[activeIdx]); }
    else if (e.key === 'Tab') { setOpen(false); }
  };

  // ── Render helpers ────────────────────────────────────────────────────────

  const renderOption = (o: SelectOption, idx: number) => {
    const isActive = idx === activeIdx;
    const isSel = o.value === value;
    const Ico = o.icon;
    return (
      <button
        key={o.value}
        id={`${optionIdPrefix}-${idx}`}
        type="button"
        disabled={o.disabled}
        className={[
          'sel-option',
          isActive ? 'is-active' : '',
          isSel ? 'is-selected' : '',
          o.disabled ? 'is-disabled' : '',
        ].filter(Boolean).join(' ')}
        onClick={() => commit(o)}
        onMouseEnter={() => setActiveIdx(idx)}
        role="option"
        aria-selected={isSel}
      >
        <span className="left">
          {Ico
            ? <Ico size={14} className="ico" />
            : <span style={{ width: 14 }} />}
          <span style={{ minWidth: 0 }}>
            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.label}</span>
            {o.description && <span className="desc">{o.description}</span>}
          </span>
        </span>
        <Icons.check size={14} className="check" />
      </button>
    );
  };

  let panelBody: React.ReactNode;
  if (filtered.length === 0) {
    panelBody = <div className="sel-empty">{emptyText}</div>;
  } else if (groups) {
    let cursor = 0;
    panelBody = groups.map((g) => {
      const gItems = g.options.filter((o) => filtered.some((f) => f.value === o.value));
      if (!gItems.length) return null;
      const block = (
        <div key={g.label} role="group" aria-label={g.label}>
          <div className="sel-group-label">{g.label}</div>
          {gItems.map((o) => { const node = renderOption(o, cursor); cursor++; return node; })}
        </div>
      );
      return block;
    });
  } else {
    panelBody = filtered.map(renderOption);
  }

  // ── Classes ───────────────────────────────────────────────────────────────

  const rootCls = [
    'sel-root',
    full ? 'full' : '',
    className,
  ].filter(Boolean).join(' ');

  const triggerCls = [
    'sel-trigger',
    open ? 'is-open' : '',
    size !== 'md' ? size : '',
    !selected ? 'is-empty' : '',
    isInvalid ? 'is-invalid' : '',
    disabled ? 'is-disabled' : '',
  ].filter(Boolean).join(' ');

  const fieldHasHelp = !!label || !!help || !!error;

  const rootStyle: React.CSSProperties | undefined = width ? { width } : undefined;

  // ── Render ────────────────────────────────────────────────────────────────

  const trigger = (
    <div className={rootCls} ref={rootRef} style={rootStyle} onKeyDown={handleListKey}>
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        className={triggerCls}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={handleTriggerKey}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={isInvalid || undefined}
        aria-describedby={error ? `${triggerId}-err` : help ? `${triggerId}-help` : undefined}
      >
        <span className="sel-value">
          {selected ? (
            <>
              {(LeadingIcon || selected.icon) && (() => {
                const Ic = LeadingIcon ?? selected.icon!;
                return <Ic size={14} className="ico" />;
              })()}
              <span>{selected.label}</span>
            </>
          ) : (
            <>
              {LeadingIcon && <LeadingIcon size={14} className="ico" />}
              <span>{placeholder}</span>
            </>
          )}
        </span>
        <Icons.chevronDown size={14} className="sel-chev" />
      </button>

      {open && panelPos && typeof document !== 'undefined' && createPortal(
        <div
          ref={panelRef}
          className="sel-panel"
          role="listbox"
          aria-label={typeof label === 'string' ? label : undefined}
          aria-activedescendant={filtered.length > 0 ? `${optionIdPrefix}-${activeIdx}` : undefined}
          style={{ top: panelPos.top, left: panelPos.left, width: panelPos.width }}
        >
          {searchable && (
            <div className="sel-search">
              <Icons.search size={14} color="var(--fg-faint)" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleListKey}
                placeholder={searchPlaceholder}
                aria-label="Search options"
              />
            </div>
          )}
          <div className="sel-list">{panelBody}</div>
        </div>,
        document.body,
      )}
    </div>
  );

  if (!fieldHasHelp) return trigger;

  return (
    <div className="sel-field">
      {label && (
        <label className="sel-field-label" htmlFor={triggerId}>{label}</label>
      )}
      {trigger}
      {(help || error) && (
        <span
          className="sel-field-help"
          id={error ? `${triggerId}-err` : `${triggerId}-help`}
          style={error ? { color: 'var(--danger)' } : undefined}
        >
          {error ?? help}
        </span>
      )}
    </div>
  );
};
