import * as React from 'react';
import { cn } from '@/lib/utils';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * ID of the associated control. Clicking/tapping the label focuses the
   * control (native <label> behaviour — no JS needed).
   */
  htmlFor?: string;
  /**
   * Renders an ember asterisk (aria-hidden) + a visually-hidden "required"
   * span so screen readers announce it. Mutually exclusive with `optional`.
   */
  required?: boolean;
  /**
   * Appends a muted "(optional)" suffix in `--fg-faint`.
   * Mutually exclusive with `required` — pick one convention per form.
   */
  optional?: boolean;
  /**
   * Size variant.
   * - `md` (default) — 13px, standard form label.
   * - `sm`           — 11px, compact/nested label.
   */
  size?: 'sm' | 'md';
  /**
   * Dims the label to match a disabled control.
   * You can also set the `data-disabled` attribute directly.
   */
  disabled?: boolean;
  /** Field name. Use a noun, sentence case. Never a question or imperative. */
  children: React.ReactNode;
  /** Extra utility classes merged via cn(). */
  className?: string;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      required = false,
      optional = false,
      size = 'md',
      disabled = false,
      children,
      className,
      ...rest
    },
    ref,
  ) => (
    <label
      ref={ref}
      data-disabled={disabled || undefined}
      className={cn(
        'in-label',
        size === 'sm' && 'sm',
        (disabled) && 'is-disabled',
        className,
      )}
      {...rest}
    >
      {children}

      {/* Required: ember asterisk (decorative) + sr-only text */}
      {required && !optional && (
        <>
          <span className="required-mark" aria-hidden="true">*</span>
          <span className="sr-only">required</span>
        </>
      )}

      {/* Optional: muted suffix — do not use alongside required */}
      {optional && !required && (
        <span className="opt">(optional)</span>
      )}
    </label>
  ),
);

export { Label };
