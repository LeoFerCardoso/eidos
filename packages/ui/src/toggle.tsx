import * as React from 'react';
import { cn } from './lib/utils';

// ═══════════════════════════════════════════════════════════════════════════
// Toggle — a two-state PRESSED BUTTON (aria-pressed), NOT a switch.
//
// Contract:
//   - Pure <button> — no Radix, no external deps.
//   - aria-pressed="true"|"false" (never aria-checked).
//   - variant: ghost | outline | solid.
//   - size: sm | md | lg.
//   - Controlled: pressed + onPressedChange.
//   - Uncontrolled: defaultPressed.
//   - Pressed state is fill + border, never colour-only.
//   - focus-visible ring from .btn system.
//   - Logical CSS properties for RTL parity.
//   - Reduced-motion: transition: none under prefers-reduced-motion.
//
// CSS lives in packages/ui/styles/tokens.css (.tgl-* block, promoted).
// ═══════════════════════════════════════════════════════════════════════════

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Controlled pressed state. When provided, the component is controlled.
   * Maps directly to `aria-pressed`.
   */
  pressed?: boolean;
  /** Uncontrolled initial pressed state. Ignored when `pressed` is provided. */
  defaultPressed?: boolean;
  /** Fires when the user clicks, receiving the *next* pressed value. */
  onPressedChange?: (pressed: boolean) => void;
  /** Visual chrome variant. Default is "ghost". */
  variant?: 'ghost' | 'outline' | 'solid';
  /** Height footprint. sm = 26px · md = 32px · lg = 40px. */
  size?: 'sm' | 'md' | 'lg';
  /** Standard button disabled. */
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      pressed: pressedProp,
      defaultPressed = false,
      onPressedChange,
      variant = 'ghost',
      size = 'md',
      disabled = false,
      children,
      className,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const isControlled = pressedProp !== undefined;
    const [internalPressed, setInternalPressed] = React.useState(defaultPressed);
    const pressed = isControlled ? pressedProp : internalPressed;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const next = !pressed;
      if (!isControlled) setInternalPressed(next);
      onPressedChange?.(next);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'tgl',
          variant !== 'ghost' && variant,
          size !== 'md' && size,
          pressed && 'is-pressed',
          className,
        )}
        aria-pressed={pressed}
        disabled={disabled}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
Toggle.displayName = 'Toggle';
