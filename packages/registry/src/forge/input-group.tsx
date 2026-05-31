import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputGroupProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Height scale — matches the Button and Input size scale.
   * sm = 28px / md = 36px (default) / lg = 44px.
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Paints the danger ring on the group shell.
   * Pair with a helper-text line below.
   */
  invalid?: boolean;
  /**
   * Disables every interactive child at once.
   * Sets aria-disabled on the group and propagates disabled + tabIndex={-1}
   * to child buttons and selects via context so they are not tab-reachable.
   */
  disabled?: boolean;
  /** Expand to 100% of the container width (default: true). */
  full?: boolean;
  children: React.ReactNode;
  className?: string;
}

interface InputGroupContextValue {
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  invalid: boolean;
}

const InputGroupCtx = React.createContext<InputGroupContextValue>({
  size: 'md',
  disabled: false,
  invalid: false,
});

const InputGroup = React.forwardRef<HTMLSpanElement, InputGroupProps>(
  (
    {
      size = 'md',
      invalid = false,
      disabled = false,
      full = true,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <InputGroupCtx.Provider value={{ size, disabled, invalid }}>
        <span
          ref={ref}
          role="group"
          aria-disabled={disabled || undefined}
          className={cn(
            'in-group',
            size !== 'md' && size,
            invalid && 'is-invalid',
            disabled && 'is-disabled',
            full && 'fluid',
            className,
          )}
          {...rest}
        >
          {children}
        </span>
      </InputGroupCtx.Provider>
    );
  },
);

export { InputGroup };
