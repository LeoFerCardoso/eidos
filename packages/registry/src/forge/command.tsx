import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/forge/icons';

interface CommandProps {
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

const norm = (s: string) => s.toLowerCase().trim();

const Command = React.forwardRef<HTMLDivElement, CommandProps>(
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

interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Mono uppercase group heading. */
  heading: string;
  children: React.ReactNode;
}

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ heading, className, children, ...rest }, ref) => (
    <div ref={ref} role="group" aria-label={heading} className={cn('cmd-group', className)} {...rest}>
      <div className="cmd-group-label" aria-hidden="true">
        {heading}
      </div>
      {children}
    </div>
  ),
);

interface CommandItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Leading icon element (14 px). */
  icon?: React.ComponentType<{ size?: number }>;
  /** Keyboard chord hint. */
  kbd?: string[];
  /** Whether this item is the active (keyboard-highlighted) item. */
  active?: boolean;
}

const CommandItem = React.forwardRef<HTMLButtonElement, CommandItemProps>(
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

export { Command };
