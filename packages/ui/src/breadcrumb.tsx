import * as React from 'react';
import { cn } from './lib/utils';
import { Icons } from './icons';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './menu';

// Eidos DS — Breadcrumb
//
// nav[aria-label="Breadcrumb"] > ol > li trail.
//
// Separator variants via the `separator` prop:
//   'chevron' (default) — directional, mirrors under RTL
//   'arrow'             — directional, mirrors under RTL
//   'slash'             — non-directional, never mirrors
//   'dot'               — non-directional, never mirrors
//
// Overflow collapse: when visible items exceed `maxItems`, the middle crumbs
// collapse into an ellipsis button that opens a DropdownMenu listing the
// hidden items. The current page receives aria-current="page" and is rendered
// as plain text (no link). Items accept href or onClick.
//
// CSS classes (.bc-*) live in packages/ui/styles/ds.css.
// No <style> block here — emit className strings only.

// ── Types ────────────────────────────────────────────────────────────────────

export type BreadcrumbSeparator = 'chevron' | 'slash' | 'dot' | 'arrow';

export interface BreadcrumbItemDef {
  /** Visible label for this crumb. */
  label: React.ReactNode;
  /** Navigation destination. Mutually exclusive with onClick. */
  href?: string;
  /** Action handler. Mutually exclusive with href. */
  onClick?: (e: React.MouseEvent) => void;
  /** Optional leading icon (14px). */
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  /**
   * Ordered list of crumbs — last entry is the current page (rendered as plain
   * text with aria-current="page").
   */
  items: BreadcrumbItemDef[];
  /** Separator style between items. Defaults to 'chevron'. */
  separator?: BreadcrumbSeparator;
  /**
   * Maximum visible items before collapsing the middle into an ellipsis.
   * When set, the first and last items always show; the middle is collapsed.
   * Pass 0 or undefined to disable collapsing.
   */
  maxItems?: number;
  /** Compact size — smaller font, tighter gaps. Ideal for page-header bars. */
  size?: 'sm' | 'md';
  /** aria-label for the wrapping <nav>. Defaults to "Breadcrumb". */
  label?: string;
  /** Extra classes on the <nav> element. */
  className?: string;
}

// Re-exported item type so consumers can type item arrays directly.
export type { BreadcrumbItemDef as BreadcrumbItemProps };

// ── Internal helpers ─────────────────────────────────────────────────────────

/** Determines reading direction from the nearest [dir] ancestor. */
function resolveDir(el: HTMLElement | null): 'ltr' | 'rtl' {
  let node: HTMLElement | null = el;
  while (node) {
    const d = node.getAttribute('dir');
    if (d === 'rtl') return 'rtl';
    if (d === 'ltr') return 'ltr';
    node = node.parentElement;
  }
  return 'ltr';
}

// ── SepGlyph — renders a single separator character/icon ────────────────────

interface SepGlyphProps {
  type: BreadcrumbSeparator;
  dir: 'ltr' | 'rtl';
}

const SepGlyph: React.FC<SepGlyphProps> = ({ type, dir }) => {
  const isRtl = dir === 'rtl';

  if (type === 'slash') {
    return (
      <span className="bc-sep" aria-hidden="true">
        /
      </span>
    );
  }

  if (type === 'dot') {
    return (
      <span className="bc-sep bc-sep-dot" aria-hidden="true">
        ·
      </span>
    );
  }

  if (type === 'arrow') {
    return (
      <span
        className="bc-sep"
        aria-hidden="true"
        style={isRtl ? { transform: 'scaleX(-1)', display: 'inline-flex' } : { display: 'inline-flex' }}
      >
        <Icons.arrowRight size={12} />
      </span>
    );
  }

  // Default: chevron — directional
  return (
    <span
      className="bc-sep"
      aria-hidden="true"
      style={isRtl ? { transform: 'scaleX(-1)', display: 'inline-flex' } : { display: 'inline-flex' }}
    >
      <Icons.chevronRight size={14} />
    </span>
  );
};

// ── BreadcrumbItem — a single rendered crumb ─────────────────────────────────

interface BreadcrumbItemInternalProps {
  item: BreadcrumbItemDef;
  isCurrent: boolean;
}

const BreadcrumbItem: React.FC<BreadcrumbItemInternalProps> = ({ item, isCurrent }) => {
  if (isCurrent) {
    return (
      <span aria-current="page" className="bc-page">
        {item.icon && (
          <span aria-hidden="true" className="bc-icon">
            {item.icon}
          </span>
        )}
        {item.label}
      </span>
    );
  }

  if (item.href) {
    return (
      <a
        href={item.href}
        className="bc-link"
        onClick={(e) => {
          if (item.onClick) {
            e.preventDefault();
            item.onClick(e);
          }
        }}
      >
        {item.icon && (
          <span aria-hidden="true" className="bc-icon">
            {item.icon}
          </span>
        )}
        {item.label}
      </a>
    );
  }

  if (item.onClick) {
    return (
      <button type="button" className="bc-link bc-btn" onClick={item.onClick}>
        {item.icon && (
          <span aria-hidden="true" className="bc-icon">
            {item.icon}
          </span>
        )}
        {item.label}
      </button>
    );
  }

  // Fallback — plain text (non-interactive ancestor, rare)
  return (
    <span className="bc-link bc-text">
      {item.icon && (
        <span aria-hidden="true" className="bc-icon">
          {item.icon}
        </span>
      )}
      {item.label}
    </span>
  );
};

// ── Breadcrumb ────────────────────────────────────────────────────────────────

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      items,
      separator = 'chevron',
      maxItems,
      size = 'md',
      label = 'Breadcrumb',
      className,
    },
    ref,
  ) => {
    const navRef = React.useRef<HTMLElement | null>(null);
    const [dir, setDir] = React.useState<'ltr' | 'rtl'>('ltr');

    // Resolve RTL from the nearest [dir] ancestor on mount.
    React.useLayoutEffect(() => {
      if (navRef.current) {
        setDir(resolveDir(navRef.current));
      }
    }, []);

    // Merge external + internal ref.
    const setRef = React.useCallback(
      (node: HTMLElement | null) => {
        navRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      },
      [ref],
    );

    if (!items || items.length === 0) return null;

    // ── Overflow collapse ───────────────────────────────────────────────────
    //
    // When maxItems is set and the number of items exceeds it, we keep the
    // first 1 and the last 1 visible and collapse everything in between into
    // an ellipsis DropdownMenu trigger.
    const shouldCollapse = !!maxItems && items.length > maxItems;
    const visibleItems = shouldCollapse
      ? [items[0], null, items[items.length - 1]] // null = ellipsis slot
      : items;
    const hiddenItems = shouldCollapse
      ? items.slice(1, items.length - 1)
      : [];

    // ── Render ──────────────────────────────────────────────────────────────

    const olChildren: React.ReactNode[] = [];

    visibleItems.forEach((itemOrNull, visIdx) => {
      const isEllipsis = itemOrNull === null;
      const isLast = visIdx === visibleItems.length - 1;

      if (isEllipsis) {
        // Ellipsis button — opens DropdownMenu with hidden crumbs.
        olChildren.push(
          <li key="bc-ellipsis" className="bc-li">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="bc-ellipsis"
                aria-label={`Show ${hiddenItems.length} hidden items`}
              >
                <Icons.more size={12} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {hiddenItems.map((hidden, hi) => (
                  <DropdownMenuItem
                    key={hi}
                    icon={hidden.icon ? () => <>{hidden.icon}</> : undefined}
                    onClick={
                      // For href crumbs: navigate in onClick (no preventDefault) so
                      // the menu closes after DropdownMenuItem.handleClick runs.
                      // For onClick-only crumbs: call the handler directly; the menu
                      // closes unless the consumer explicitly called preventDefault.
                      hidden.href
                        ? () => { window.location.href = hidden.href!; }
                        : hidden.onClick
                        ? (e: React.MouseEvent<HTMLButtonElement>) => {
                            hidden.onClick!(e as unknown as React.MouseEvent);
                          }
                        : undefined
                    }
                  >
                    {hidden.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>,
        );
      } else {
        // Normal crumb
        const isCurrent = isLast;
        olChildren.push(
          <li key={visIdx} className="bc-li">
            <BreadcrumbItem item={itemOrNull} isCurrent={isCurrent} />
          </li>,
        );
      }

      // Separator after every item except the last.
      if (!isLast) {
        olChildren.push(
          <li key={`sep-${visIdx}`} className="bc-li bc-sep-li" aria-hidden="true">
            <SepGlyph type={separator} dir={dir} />
          </li>,
        );
      }
    });

    return (
      <nav
        ref={setRef}
        aria-label={label}
        className={cn('bc-nav', size === 'sm' && 'bc-sm', className)}
      >
        <ol className="bc-ol">{olChildren}</ol>
      </nav>
    );
  },
);
Breadcrumb.displayName = 'Breadcrumb';
