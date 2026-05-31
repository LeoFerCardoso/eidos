import * as React from 'react';
import { cn } from '@/lib/utils';

const NAMED_RATIOS: Record<string, number> = {
  '16/9':  16 / 9,
  '16:9':  16 / 9,
  '4/3':   4 / 3,
  '4:3':   4 / 3,
  '3/2':   3 / 2,
  '3:2':   3 / 2,
  '1/1':   1,
  '1:1':   1,
  '3/4':   3 / 4,
  '3:4':   3 / 4,
  '9/16':  9 / 16,
  '9:16':  9 / 16,
  '21/9':  21 / 9,
  '21:9':  21 / 9,
};

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Numeric ratio (width ÷ height), or a named preset string such as
   * `'16/9'`, `'4/3'`, `'1/1'`, `'9/16'`, `'21/9'`.
   * Defaults to `1` (square).
   */
  ratio?: number | string;
  /**
   * Border-radius shorthand applied to the container.
   * Accepts any CSS value. Defaults to `var(--radius-md)`.
   */
  radius?: string;
  /** Content inside the box (img, video, iframe, or any block element). */
  children?: React.ReactNode;
  /** Extra utility classes merged via cn(). */
  className?: string;
  /** Inline style overrides for the container. */
  style?: React.CSSProperties;
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  (
    {
      ratio = 1,
      radius = 'var(--radius-md)',
      children,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    // Resolve ratio to a number
    const resolvedRatio: number = (() => {
      if (typeof ratio === 'number') return ratio;
      if (typeof ratio === 'string') {
        const preset = NAMED_RATIOS[ratio.trim()];
        if (preset !== undefined) return preset;
        // Try parsing "W/H" or "W:H"
        const parts = ratio.trim().split(/[/:]/).map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[1] !== 0) {
          return parts[0] / parts[1];
        }
        const num = parseFloat(ratio);
        return isNaN(num) ? 1 : num;
      }
      return 1;
    })();

    return (
      <div
        ref={ref}
        className={cn('ar', className)}
        style={{
          aspectRatio: String(resolvedRatio),
          borderRadius: radius,
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export { AspectRatio };
