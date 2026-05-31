import * as React from 'react';
import { cn } from './lib/utils';

// ═══════════════════════════════════════════════════════════════════════════
// Card family — compound component (Card > CardMedia? + CardHeader + CardContent + CardFooter)
//
// variant: outline (default) | elevated | ghost
// density: default | compact
// interactive: boolean — whole card is a link/button, hover lift + focus ring,
//   no nested focusables inside (enforced by single-anchor guidance in docs)
//
// CSS lives in ds.css (.card-x* block — promoted from the inline <style>).
// No <style> here. Logical CSS props throughout (RTL parity).
// ═══════════════════════════════════════════════════════════════════════════

// ── Types ─────────────────────────────────────────────────────────────────

export type CardVariant = 'outline' | 'elevated' | 'ghost';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual style.
   * - `outline`  — bordered surface (default). Use for forms, settings, content blocks.
   * - `elevated` — shadowlifted, no border. Use for tiles on flat canvas.
   * - `ghost`    — transparent, no border. Use for grouped items inside an already-bounded region.
   */
  variant?: CardVariant;
  /**
   * Tighter padding for grid lists and stat tiles.
   */
  compact?: boolean;
  /**
   * Adds hover lift + cursor:pointer. Apply when the whole card is interactive
   * (the Card renders as-is; wrap it in an `<a>` or give `onClick` + role="button").
   * Do NOT nest separate focusable controls inside an interactive card.
   */
  interactive?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/** Root card surface. */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'outline',
      compact = false,
      interactive = false,
      children,
      className,
      ...rest
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        'card-x',
        variant !== 'outline' && variant,
        compact && 'compact',
        interactive && 'interactive',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);
Card.displayName = 'Card';

// ── CardMedia ─────────────────────────────────────────────────────────────

export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accessible alt text for the media region; defaults to aria-hidden when not provided. */
  alt?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Optional full-bleed region above the header.
 * Renders aria-hidden by default — pass `alt` for a descriptive label.
 */
export const CardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(
  ({ alt, children, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn('card-x-media', className)}
      role={alt ? 'img' : undefined}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
      {...rest}
    >
      {children}
    </div>
  ),
);
CardMedia.displayName = 'CardMedia';

// ── CardHeader ────────────────────────────────────────────────────────────

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Row layout — puts title+description on the start and a trailing action on the end.
   * Pass `row` to switch from the default column stack.
   */
  row?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/** Padding region for CardTitle + CardDescription (and an optional trailing action). */
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ row = false, children, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn('card-x-head', row && 'row', className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
CardHeader.displayName = 'CardHeader';

// ── CardTitle ─────────────────────────────────────────────────────────────

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level. Defaults to h3 — adjust per document outline. */
  as?: 'h2' | 'h3' | 'h4';
  children?: React.ReactNode;
  className?: string;
}

/** Semantic heading inside CardHeader. Participates in document outline. */
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Tag = 'h3', children, className, ...rest }, ref) => (
    <Tag
      ref={ref}
      className={cn('card-x-title', className)}
      {...rest}
    >
      {children}
    </Tag>
  ),
);
CardTitle.displayName = 'CardTitle';

// ── CardDescription ───────────────────────────────────────────────────────

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  className?: string;
}

/** Muted paragraph below the title. Optional — skip when the body is self-evident. */
export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className, ...rest }, ref) => (
    <p
      ref={ref}
      className={cn('card-x-desc', className)}
      {...rest}
    >
      {children}
    </p>
  ),
);
CardDescription.displayName = 'CardDescription';

// ── CardContent ───────────────────────────────────────────────────────────

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

/** Main body region. Accepts any content — text, lists, charts, forms. */
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn('card-x-body', className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
CardContent.displayName = 'CardContent';

// ── CardFooter ────────────────────────────────────────────────────────────

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Push all children to the trailing edge (justify-content: flex-end).
   * Useful for action rows — Cancel / Save.
   */
  actions?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/** Hairline-divided foot region for actions or metadata. Skip when the body has its own CTAs. */
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ actions = false, children, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn('card-x-foot', actions && 'actions', className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
CardFooter.displayName = 'CardFooter';
