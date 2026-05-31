import * as React from 'react';
import { cn } from './lib/utils';
import { Icons } from './icons';
// Eidos DS — Command Palette.
//
// A ⌘K (Cmd/Ctrl+K) surface — a single text input that filters across grouped
// navigation, creation, and recent items. Provides:
//   • Controlled + uncontrolled filtering (substring, case-insensitive).
//   • Grouped results with sticky mono uppercase group labels.
//   • Up/Down keyboard navigation across the filtered flat list via
//     aria-activedescendant (focus stays in the input throughout).
//   • Enter runs the highlighted item; ESC closes.
//   • Input: role=combobox aria-expanded aria-controls. List: role=listbox.
//     Items: role=option. Outer dialog wrapper: role=dialog.
//   • Both an inline <Command> and a <CommandDialog> (renders via ReactDOM.createPortal
//     with a full-screen backdrop, body scroll lock, and focus restore on close).
//   • prefers-reduced-motion: entrance animations reduce to instant.
//   • Logical CSS properties throughout — RTL mirroring is automatic.
//
// CSS classes live in the shared stylesheet (.cmd-* block) — see cssBlock return.
// No <style> block here — only className strings.

import * as ReactDOM from 'react-dom';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CommandItem {
  /** Unique item identifier — used as value and for aria-activedescendant ids. */
  id: string;
  /** Display label. Also used for substring filtering unless `keywords` overrides. */
  label: string;
  /** Extra search aliases that extend filtering beyond the label. */
  keywords?: string[];
  /** Leading icon element (14 px). */
  icon?: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  /**
   * Keyboard chord hint displayed at the trailing edge.
   * Pass individual key strings, e.g. ['⌘', 'N']. Rendered as <kbd> chips.
   */
  kbd?: string[];
  /** Disables the item — skipped in keyboard navigation and visually dimmed. */
  disabled?: boolean;
}

export interface CommandGroup {
  /** Group heading — rendered as a mono uppercase label. */
  heading: string;
  items: CommandItem[];
}

export interface CommandProps {
  /** Grouped item list (required for any real usage). */
  groups: CommandGroup[];
  /** Controlled search query. Pass with `onQueryChange` for controlled mode. */
  query?: string;
  /** Called when the search input changes. */
  onQueryChange?: (query: string) => void;
  /** Uncontrolled default search query. */
  defaultQuery?: string;
  /**
   * Called when an item is selected (Enter or click).
   * Receives the CommandItem.id. Close the palette from this callback.
   */
  onSelect?: (id: string) => void;
  /** Placeholder string for the search input. */
  placeholder?: string;
  /**
   * Content rendered inside the footer bar.
   * Defaults to the standard Up/Down/Enter/Esc key hints.
   */
  footer?: React.ReactNode;
  /** Extra classes merged onto the root wrapper. */
  className?: string;
}

export interface CommandDialogProps extends CommandProps {
  /** Controls visibility of the dialog. */
  open: boolean;
  /** Called when the dialog requests to close (ESC or backdrop click). */
  onOpenChange: (open: boolean) => void;
  /** Accessible dialog title — announced to screen readers. Defaults to "Command palette". */
  title?: string;
}

// ── Internal helpers ───────────────────────────────────────────────────────────

/** Normalise a string for substring search. */
const norm = (s: string) => s.toLowerCase().trim();

/** Returns all focusable elements inside a container, in DOM order. */
function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),' +
        'textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
    ),
  );
}

// ── Command (inline) ──────────────────────────────────────────────────────────

/**
 * Inline command palette — renders in flow (no backdrop/portal). Use this when
 * you embed it in a custom surface (e.g. a sidebar, a Modal you control).
 * For the full ⌘K overlay experience, use CommandDialog.
 */
export const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  (
    {
      groups,
      query: queryProp,
      onQueryChange,
      defaultQuery = '',
      onSelect,
      placeholder = 'Type a command or search…',
      footer,
      className,
    },
    ref,
  ) => {
    const isControlled = queryProp !== undefined;
    const [internalQuery, setInternalQuery] = React.useState(defaultQuery);
    const query = isControlled ? queryProp! : internalQuery;

    const [activeIdx, setActiveIdx] = React.useState(0);

    const uid = React.useId();
    const inputId = `${uid}-input`;
    const listId = `${uid}-list`;
    const itemIdPrefix = `${uid}-item`;

    const inputRef = React.useRef<HTMLInputElement>(null);

    // ── Filtering ──────────────────────────────────────────────────────────────

    const filteredGroups = React.useMemo(() => {
      const q = norm(query);
      if (!q) return groups;
      return groups
        .map((g) => ({
          ...g,
          items: g.items.filter((it) => {
            if (norm(it.label).includes(q)) return true;
            return it.keywords?.some((kw) => norm(kw).includes(q)) ?? false;
          }),
        }))
        .filter((g) => g.items.length > 0);
    }, [groups, query]);

    const flatItems = React.useMemo(
      () => filteredGroups.flatMap((g) => g.items),
      [filteredGroups],
    );

    // Clamp activeIdx when the flat list shrinks.
    React.useEffect(() => {
      setActiveIdx((i) => Math.min(i, Math.max(0, flatItems.length - 1)));
    }, [flatItems.length]);

    // Reset on query change.
    React.useEffect(() => {
      setActiveIdx(0);
    }, [query]);

    // ── Commit selection ───────────────────────────────────────────────────────

    const commit = React.useCallback(
      (item: CommandItem) => {
        if (item.disabled) return;
        onSelect?.(item.id);
      },
      [onSelect],
    );

    // ── Keyboard handling ──────────────────────────────────────────────────────

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (flatItems.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => {
          // Skip disabled items going forward.
          let next = i;
          for (let attempt = 0; attempt < flatItems.length; attempt++) {
            next = Math.min(next + 1, flatItems.length - 1);
            if (!flatItems[next]?.disabled) break;
          }
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => {
          let prev = i;
          for (let attempt = 0; attempt < flatItems.length; attempt++) {
            prev = Math.max(prev - 1, 0);
            if (!flatItems[prev]?.disabled) break;
          }
          return prev;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const active = flatItems[activeIdx];
        if (active) commit(active);
      }
      // ESC is handled by the dialog layer; in inline mode, callers intercept it.
    };

    // ── Change handler ─────────────────────────────────────────────────────────

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (!isControlled) setInternalQuery(v);
      onQueryChange?.(v);
    };

    // ── Active item id ─────────────────────────────────────────────────────────

    const activeId =
      flatItems.length > 0 && activeIdx < flatItems.length
        ? `${itemIdPrefix}-${flatItems[activeIdx].id}`
        : undefined;

    // ── Default footer ─────────────────────────────────────────────────────────

    const defaultFooter = (
      <>
        <span className="cmd-foot-count">
          <Icons.command size={12} aria-hidden="true" />
          {flatItems.length} result{flatItems.length !== 1 ? 's' : ''}
        </span>
        <span className="cmd-foot-hints">
          <span className="cmd-hint">
            <kbd className="kbd">↑</kbd>
            <kbd className="kbd">↓</kbd>
            <span>navigate</span>
          </span>
          <span className="cmd-hint">
            <kbd className="kbd">↵</kbd>
            <span>select</span>
          </span>
          <span className="cmd-hint">
            <kbd className="kbd">Esc</kbd>
            <span>close</span>
          </span>
        </span>
      </>
    );

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
      <div ref={ref} className={cn('cmd', className)}>
        {/* Search row */}
        <div className="cmd-search">
          <Icons.search size={14} aria-hidden="true" color="var(--fg-faint)" />
          <input
            ref={inputRef}
            id={inputId}
            role="combobox"
            aria-expanded={flatItems.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeId}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="cmd-input"
          />
          <kbd className="kbd">Esc</kbd>
        </div>

        {/* Results list */}
        <div
          id={listId}
          role="listbox"
          aria-label="Search results"
          className="cmd-results"
        >
          {flatItems.length === 0 ? (
            <div className="cmd-empty" role="status" aria-live="polite">
              No commands match{' '}
              <span className="cmd-empty-query">&ldquo;{query}&rdquo;</span>.
            </div>
          ) : (
            (() => {
              let cursor = 0;
              return filteredGroups.map((g) => (
                <div key={g.heading} className="cmd-group" role="group" aria-label={g.heading}>
                  <div className="cmd-group-label" aria-hidden="true">
                    {g.heading}
                  </div>
                  {g.items.map((item) => {
                    const globalIdx = cursor++;
                    const isActive = globalIdx === activeIdx;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        id={`${itemIdPrefix}-${item.id}`}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        aria-disabled={item.disabled || undefined}
                        disabled={item.disabled}
                        className={cn('cmd-row', isActive && 'is-active')}
                        onMouseEnter={() => setActiveIdx(globalIdx)}
                        onClick={() => commit(item)}
                        tabIndex={-1}
                      >
                        <span className="cmd-row-lead">
                          {Icon && (
                            <span className="cmd-row-icon" aria-hidden="true">
                              <Icon size={14} />
                            </span>
                          )}
                          <span className="cmd-row-label">{item.label}</span>
                        </span>
                        {item.kbd && item.kbd.length > 0 && (
                          <span className="kbd-chord" aria-hidden="true">
                            {item.kbd.map((k, i) => (
                              <kbd key={i} className="kbd">
                                {k}
                              </kbd>
                            ))}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ));
            })()
          )}
        </div>

        {/* Footer */}
        <div className="cmd-foot" aria-hidden="true">
          {footer ?? defaultFooter}
        </div>
      </div>
    );
  },
);
Command.displayName = 'Command';

// ── CommandDialog (full ⌘K overlay) ───────────────────────────────────────────

/**
 * Full-screen ⌘K overlay — portals to document.body, locks scroll, traps
 * focus, restores it on close, and dismisses on ESC or backdrop click.
 * Compose it with <Command> for the palette body.
 */
export const CommandDialog = ({
  open,
  onOpenChange,
  title = 'Command palette',
  ...commandProps
}: CommandDialogProps) => {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<Element | null>(null);
  const uid = React.useId();
  const titleId = `${uid}-dlg-title`;

  // ── Store trigger + body scroll lock ──────────────────────────────────────

  React.useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Restore focus to the element that opened the palette.
      const el = triggerRef.current;
      if (el && typeof (el as HTMLElement).focus === 'function') {
        requestAnimationFrame(() => (el as HTMLElement).focus());
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ── ESC + click-outside ────────────────────────────────────────────────────

  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onOpenChange(false);
        return;
      }
      // Focus trap: Tab / Shift+Tab wrap within the panel.
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = getFocusable(panelRef.current);
        if (focusable.length === 0) { e.preventDefault(); return; }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [open, onOpenChange]);

  // ── Inert sibling roots while open ────────────────────────────────────────

  React.useEffect(() => {
    if (!open) return;
    const roots = Array.from(document.body.children).filter(
      (el) => el !== panelRef.current?.closest('[data-cmd-portal]'),
    );
    roots.forEach((el) => el.setAttribute('inert', ''));
    return () => roots.forEach((el) => el.removeAttribute('inert'));
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onOpenChange(false);
  };

  const handleSelect = (id: string) => {
    commandProps.onSelect?.(id);
    // Typically the caller closes after onSelect, but this ensures close.
    onOpenChange(false);
  };

  return ReactDOM.createPortal(
    <div
      className="cmd-backdrop"
      onClick={handleBackdropClick}
      data-cmd-portal="true"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="cmd-dialog"
      >
        {/* Visually hidden title for screen readers */}
        <span id={titleId} className="sr-only">
          {title}
        </span>
        <Command
          {...commandProps}
          onSelect={handleSelect}
        />
      </div>
    </div>,
    document.body,
  );
};
CommandDialog.displayName = 'CommandDialog';

// ── Sub-component shorthands (for the compound API) ───────────────────────────
// These are lightweight re-exports that let callers write
// <CommandInput/>, <CommandList/>, etc. if they want to assemble the UI
// themselves (advanced use-case). For typical usage, compose <Command groups={…}/>.

export interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Override the leading icon. Defaults to Icons.search. */
  leadingIcon?: React.ReactNode;
}

/** Bare search input row — only needed when assembling a custom command UI. */
export const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ leadingIcon, className, ...rest }, ref) => (
    <div className={cn('cmd-search', className)}>
      {leadingIcon ?? <Icons.search size={14} aria-hidden="true" color="var(--fg-faint)" />}
      <input ref={ref} className="cmd-input" autoComplete="off" spellCheck={false} {...rest} />
    </div>
  ),
);
CommandInput.displayName = 'CommandInput';

export interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/** Results list wrapper — only needed for custom assembly. */
export const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, children, ...rest }, ref) => (
    <div ref={ref} role="listbox" className={cn('cmd-results', className)} {...rest}>
      {children}
    </div>
  ),
);
CommandList.displayName = 'CommandList';

export interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Mono uppercase group heading. */
  heading: string;
  children: React.ReactNode;
}

/** Group container with a sticky heading — only needed for custom assembly. */
export const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ heading, className, children, ...rest }, ref) => (
    <div ref={ref} role="group" aria-label={heading} className={cn('cmd-group', className)} {...rest}>
      <div className="cmd-group-label" aria-hidden="true">
        {heading}
      </div>
      {children}
    </div>
  ),
);
CommandGroup.displayName = 'CommandGroup';

export interface CommandItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Leading icon element (14 px). */
  icon?: React.ComponentType<{ size?: number }>;
  /** Keyboard chord hint. */
  kbd?: string[];
  /** Whether this item is the active (keyboard-highlighted) item. */
  active?: boolean;
}

/** Single command row — only needed for custom assembly. */
export const CommandItem = React.forwardRef<HTMLButtonElement, CommandItemProps>(
  ({ icon: Icon, kbd: kbdKeys, active, className, children, ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      role="option"
      aria-selected={active}
      tabIndex={-1}
      className={cn('cmd-row', active && 'is-active', className)}
      {...rest}
    >
      <span className="cmd-row-lead">
        {Icon && (
          <span className="cmd-row-icon" aria-hidden="true">
            <Icon size={14} />
          </span>
        )}
        <span className="cmd-row-label">{children}</span>
      </span>
      {kbdKeys && kbdKeys.length > 0 && (
        <span className="kbd-chord" aria-hidden="true">
          {kbdKeys.map((k, i) => (
            <kbd key={i} className="kbd">
              {k}
            </kbd>
          ))}
        </span>
      )}
    </button>
  ),
);
CommandItem.displayName = 'CommandItem';

export interface CommandEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/** Empty-state slot rendered when the search matches nothing. */
export const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={cn('cmd-empty', className)}
      {...rest}
    >
      {children ?? 'No results found.'}
    </div>
  ),
);
CommandEmpty.displayName = 'CommandEmpty';

export interface CommandSeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}

/** Horizontal rule between groups. */
export const CommandSeparator = React.forwardRef<HTMLHRElement, CommandSeparatorProps>(
  ({ className, ...rest }, ref) => (
    <hr ref={ref} className={cn('separator horizontal', className)} role="separator" {...rest} />
  ),
);
CommandSeparator.displayName = 'CommandSeparator';
