import * as React from 'react';
import { Icons } from '@/components/forge/icons';

interface ComboboxOption {
  label: string;
  value: string;
  /** Short secondary text rendered on the trailing edge (mono, faint). */
  meta?: string;
  /** Whether the option is non-interactive. */
  disabled?: boolean;
  /** Optional leading icon element. */
  icon?: React.ReactNode;
}

interface ComboboxGroup {
  label: string;
  options: ComboboxOption[];
}

interface ComboboxProps {
  /** Flat option list. Mutually exclusive with `groups`. */
  options?: ComboboxOption[];
  /** Grouped options — mono uppercase header per cluster. */
  groups?: ComboboxGroup[];
  /**
   * Controlled value. Pass a string for single-select, string[] for multi.
   * Pass null/undefined to represent "no selection".
   */
  value: string | string[] | null | undefined;
  /**
   * Called when the selection changes.
   * Canonical prop — prefer this over `onChange`.
   */
  onValueChange?: (value: string | string[]) => void;
  /**
   * @deprecated Use `onValueChange` instead.
   * Kept as a back-compat alias; both fire when provided.
   */
  onChange?: (value: string | string[]) => void;
  /** Faint trigger label when no value is selected. */
  placeholder?: string;
  /** Placeholder inside the search input in the panel. */
  searchPlaceholder?: string;
  /** Enable multi-select with chip preview row below the trigger. */
  multiple?: boolean;
  /** Standard disabled semantics — no interaction possible. */
  disabled?: boolean;
  /** Paints the trigger border + ring with --danger. */
  invalid?: boolean;
  /** Trigger height: sm = 28px, md = 36px (default), lg = 44px. */
  size?: 'sm' | 'md' | 'lg';
  /** Expand to 100% of the container width. */
  full?: boolean;
  /** Message shown when the search query matches no options. */
  emptyText?: string;
  /** Override the inline width of the root wrapper (e.g. "320px"). */
  width?: string;
}

const Combobox = (props: ComboboxProps) => {
  const {
    options = [],
    groups,
    value,
    onValueChange,
    onChange,
    placeholder,
    searchPlaceholder = 'Search…',
    multiple = false,
    disabled = false,
    invalid = false,
    size = 'md',
    full = false,
    emptyText = 'No matches.',
    width,
  } = props;

  // Emit to both the canonical prop and the deprecated alias.
  const emit = (v: string | string[]) => {
    onValueChange?.(v);
    onChange?.(v);
  };

  // Flatten option list regardless of source (flat or grouped).
  const flat: ComboboxOption[] = groups
    ? groups.flatMap((g) => g.options)
    : options;

  const resolvedPlaceholder = placeholder ?? (multiple ? 'Select…' : 'Pick one');

  // ── Stable id prefix for option elements (aria-activedescendant) ──────────

  const uid = React.useId();
  const optionIdPrefix = `${uid}-opt`;

  // ── State ──────────────────────────────────────────────────────────────────

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [panelPos, setPanelPos] = React.useState<{ top: number; left: number; width: number } | null>(null);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // ── Derived values ─────────────────────────────────────────────────────────

  const matchesQuery = (o: ComboboxOption) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      o.label.toLowerCase().includes(q) ||
      o.value.toLowerCase().includes(q)
    );
  };

  const filteredFlat = flat.filter(matchesQuery);

  const isSelected = (o: ComboboxOption): boolean => {
    if (multiple) {
      return Array.isArray(value) && value.includes(o.value);
    }
    return value === o.value;
  };

  const selectedSingle = !multiple
    ? flat.find((o) => o.value === value) ?? null
    : null;

  const selectedMulti: ComboboxOption[] = multiple
    ? flat.filter((o) => Array.isArray(value) && value.includes(o.value))
    : [];

  // ── Trigger class string ───────────────────────────────────────────────────

  const triggerClass = [
    'cb-trigger',
    size !== 'md' ? size : '',
    open ? 'is-open' : '',
    invalid ? 'is-invalid' : '',
    disabled ? 'is-disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  // ── Click-outside & Escape ─────────────────────────────────────────────────

  React.useEffect(() => {
    if (!open) return;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        // Return focus to the trigger so keyboard users stay oriented.
        setTimeout(() => triggerRef.current?.focus(), 0);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  // ── Fixed-position panel placement ────────────────────────────────────────

  React.useEffect(() => {
    if (!open) {
      setPanelPos(null);
      return;
    }

    const place = () => {
      if (!triggerRef.current) return;
      const r = triggerRef.current.getBoundingClientRect();
      setPanelPos({ top: r.bottom + 6, left: r.left, width: r.width });
    };

    place();

    const closeOnScroll = () => setOpen(false);
    window.addEventListener('scroll', closeOnScroll, true);
    window.addEventListener('resize', closeOnScroll);
    return () => {
      window.removeEventListener('scroll', closeOnScroll, true);
      window.removeEventListener('resize', closeOnScroll);
    };
  }, [open]);

  // ── Focus search input when panel opens ───────────────────────────────────

  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  // ── Reset query and active index when panel closes ────────────────────────

  React.useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIdx(0);
    }
  }, [open]);

  // ── Selection commit ──────────────────────────────────────────────────────

  const commit = (o: ComboboxOption) => {
    if (o.disabled) return;
    if (multiple) {
      const cur = Array.isArray(value) ? value : [];
      emit(
        cur.includes(o.value)
          ? cur.filter((v) => v !== o.value)
          : [...cur, o.value]
      );
    } else {
      emit(o.value);
      setOpen(false);
    }
  };

  const removeChip = (e: React.MouseEvent, chipValue: string) => {
    e.stopPropagation();
    const cur = Array.isArray(value) ? value : [];
    emit(cur.filter((v) => v !== chipValue));
  };

  // ── Keyboard navigation inside the search input ───────────────────────────

  // Find the next enabled option index in the given direction (+1 or -1).
  const nextEnabled = (from: number, dir: 1 | -1): number => {
    const len = filteredFlat.length;
    let idx = from + dir;
    while (idx >= 0 && idx < len) {
      if (!filteredFlat[idx].disabled) return idx;
      idx += dir;
    }
    return from; // no enabled option in that direction; stay put
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => nextEnabled(i, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => nextEnabled(i, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const o = filteredFlat[activeIdx];
      if (o) commit(o);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  // ── Render helpers ────────────────────────────────────────────────────────

  const renderItems = (list: ComboboxOption[], baseIndex: number) =>
    list.map((o, i) => {
      const realIdx = baseIndex + i;
      return (
        <button
          key={o.value}
          id={`${optionIdPrefix}-${realIdx}`}
          type="button"
          className={[
            'cb-item',
            activeIdx === realIdx ? 'is-active' : '',
            o.disabled ? 'is-disabled' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onMouseEnter={() => setActiveIdx(realIdx)}
          onClick={() => commit(o)}
          role="option"
          aria-selected={isSelected(o) || undefined}
        >
          {o.icon && o.icon}
          <span className="label">{o.label}</span>
          {o.meta && <span className="meta">{o.meta}</span>}
          {/* Trailing check with a permanently-reserved slot, so every row aligns
              whether or not it is the selected one. */}
          <span className="check">
            {isSelected(o) && <Icons.check size={14} />}
          </span>
        </button>
      );
    });

  let panelContent: React.ReactNode;

  if (filteredFlat.length === 0) {
    panelContent = <div className="cb-empty">{emptyText}</div>;
  } else if (groups) {
    let cursor = 0;
    panelContent = groups.map((g) => {
      const visible = g.options.filter(matchesQuery);
      if (visible.length === 0) return null;
      const block = (
        <div key={g.label}>
          <div className="cb-group-label">{g.label}</div>
          {renderItems(visible, cursor)}
        </div>
      );
      cursor += visible.length;
      return block;
    });
  } else {
    panelContent = renderItems(filteredFlat, 0);
  }

  // ── Trigger label ─────────────────────────────────────────────────────────

  const hasValue = selectedSingle !== null || (multiple && selectedMulti.length > 0);
  const triggerLabel = selectedSingle
    ? selectedSingle.label
    : multiple && selectedMulti.length > 0
    ? `${selectedMulti.length} selected`
    : resolvedPlaceholder;

  // ── Root wrapper style ────────────────────────────────────────────────────

  const wrapperStyle: React.CSSProperties | undefined = width ? { width } : undefined;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      ref={rootRef}
      className={['cb', full ? 'full' : ''].filter(Boolean).join(' ')}
      style={wrapperStyle}
    >
      <button
        ref={triggerRef}
        type="button"
        className={triggerClass}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-disabled={disabled || undefined}
        aria-invalid={invalid || undefined}
      >
        {!multiple && selectedSingle?.icon}
        <span className={['label', hasValue ? '' : 'placeholder'].filter(Boolean).join(' ')}>
          {triggerLabel}
        </span>
        <Icons.chevronDown size={14} className="chev" />
      </button>

      {multiple && selectedMulti.length > 0 && (
        <div className="cb-chips">
          {selectedMulti.map((o) => (
            <span key={o.value} className="cb-chip">
              <span className="label">{o.label}</span>
              <button
                type="button"
                className="x"
                aria-label={`Remove ${o.label}`}
                onClick={(e) => removeChip(e, o.value)}
              >
                <Icons.x size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {open && panelPos && (
        <div
          ref={panelRef}
          className="cb-panel"
          role="dialog"
          aria-label="Choose option"
          style={{
            top: panelPos.top,
            left: panelPos.left,
            width: panelPos.width,
          }}
        >
          <div className="cb-search">
            <Icons.search size={14} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIdx(0);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder={searchPlaceholder}
              aria-label="Search options"
            />
          </div>
          <div
            className="cb-list"
            role="listbox"
            aria-multiselectable={multiple || undefined}
            aria-activedescendant={filteredFlat.length > 0 ? `${optionIdPrefix}-${activeIdx}` : undefined}
          >
            {panelContent}
          </div>
        </div>
      )}
    </div>
  );
};

export { Combobox };
