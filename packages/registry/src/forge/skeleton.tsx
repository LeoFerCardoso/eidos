import * as React from 'react';
import { cn } from '@/lib/utils';

type SkeletonVariant = 'line' | 'box' | 'circle';

interface SkeletonProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Shape preset.
   * line   — horizontal bar, 12 px tall, 6 px radius (paragraph rhythm)
   * box    — rectangular block, 8 px radius (cards, images, thumbnails)
   * circle — fully round; use `size` for both width and height
   */
  variant?: SkeletonVariant;
  /**
   * Width in px (number) or any CSS length string (e.g. "80%", "12rem").
   * Ignored for `circle` — use `size` instead.
   * Defaults to "100%" for line/box.
   */
  width?: number | string;
  /**
   * Height in px (number) or any CSS length string.
   * Ignored for `circle` — use `size` instead.
   * Defaults to 12 for line, "auto" for box.
   */
  height?: number | string;
  /**
   * Diameter shortcut for `variant="circle"`. Sets both width and height.
   * Defaults to 32.
   */
  size?: number;
  /**
   * Border-radius override (px or CSS string). When omitted the variant
   * default applies (line → 6px, box → 8px, circle → 50%).
   */
  radius?: number | string;
  /**
   * Number of stacked line bars to render. When > 1 the last bar is
   * rendered at 62% width (mirrors the AI streaming paragraph placeholder).
   * Ignored when `variant` is "box" or "circle".
   */
  lines?: number;
  /**
   * Accessible label emitted as an sr-only "Loading…" span inside a
   * role="status" wrapper on the outermost element. Use on the topmost
   * skeleton group — not on each individual bar — so a screen reader hears
   * one announcement.
   * Default: undefined (no wrapper; shapes are aria-hidden only).
   */
  label?: string;
  /** Extra utility classes merged via cn(). */
  className?: string;
  /** Inline style override. */
  style?: React.CSSProperties;
}

const srOnly: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
};

function resolveShapeStyle(
  variant: SkeletonVariant,
  width?: number | string,
  height?: number | string,
  size?: number,
  radius?: number | string,
): React.CSSProperties {
  const css: React.CSSProperties = {};

  if (variant === 'circle') {
    const d = size ?? 32;
    css.width = d;
    css.height = d;
  } else {
    if (width !== undefined) css.width = width;
    if (height !== undefined) css.height = height;
  }

  if (radius !== undefined) {
    css.borderRadius = typeof radius === 'number' ? `${radius}px` : radius;
  }

  return css;
}

const Skeleton = React.forwardRef<HTMLElement, SkeletonProps>(
  (
    {
      variant = 'line',
      width,
      height,
      size,
      radius,
      lines,
      label,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const multiLine = variant === 'line' && lines !== undefined && lines > 1;
    const shapeStyle = resolveShapeStyle(variant, width, height, size, radius);

    // ── Multi-line: wrapper div + N bars ──────────────────────────────────────
    if (multiLine) {
      const n = lines!;
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={cn('sk-group', className)}
          style={{ ...style }}
          {...(label ? { role: 'status' } : { 'aria-hidden': 'true' })}
          {...(rest as React.HTMLAttributes<HTMLDivElement>)}
        >
          {label && <span style={srOnly}>{label}</span>}
          {Array.from({ length: n }).map((_, i) => (
            <span
              key={i}
              className="sk sk-shimmer line"
              style={i === n - 1 ? { width: '62%' } : undefined}
              aria-hidden="true"
            />
          ))}
        </div>
      );
    }

    // ── With label: wrap in role="status" div ─────────────────────────────────
    if (label) {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          role="status"
          className={cn('sk-group', className)}
          style={style}
          {...(rest as React.HTMLAttributes<HTMLDivElement>)}
        >
          <span style={srOnly}>{label}</span>
          <span
            className={cn('sk sk-shimmer', variant)}
            style={shapeStyle}
            aria-hidden="true"
          />
        </div>
      );
    }

    // ── Default: bare decorative span ─────────────────────────────────────────
    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        className={cn('sk sk-shimmer', variant, className)}
        style={{ ...shapeStyle, ...style }}
        aria-hidden="true"
        {...(rest as React.HTMLAttributes<HTMLSpanElement>)}
      />
    );
  },
);

export { Skeleton };
