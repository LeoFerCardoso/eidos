import * as React from 'react';

// Button — the canonical DS button. Wraps the authored `.btn` class API with a
// typed variant/size so screens never hand-roll `className="btn outline sm"`.
// Variants and sizes match the Buttons docs page (the gold reference).
export type ButtonVariant = 'default' | 'ember' | 'outline' | 'ghost' | 'link' | 'destructive';
export type ButtonSize = 'md' | 'sm' | 'xs' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** ember = primary · default = secondary (surface fill) · outline · ghost · link · destructive. */
  variant?: ButtonVariant;
  /** md (32px) · sm (26px) · xs (22px) · lg (40px). */
  size?: ButtonSize;
  /** Icon-only square button. */
  icon?: boolean;
  /** Render the single child element instead of a <button>, merging the .btn classes
   *  (e.g. wrap a next/link <Link>). */
  asChild?: boolean;
}

export function btnClass(variant: ButtonVariant = 'default', size: ButtonSize = 'md', icon = false, extra = ''): string {
  return ['btn', variant !== 'default' ? variant : '', size !== 'md' ? size : '', icon ? 'icon' : '', extra]
    .filter(Boolean)
    .join(' ');
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'md', icon = false, asChild = false, className = '', children, type, ...rest }, ref) => {
    const cls = btnClass(variant, size, icon, className);
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: [cls, child.props.className].filter(Boolean).join(' '),
        ...rest,
      } as React.HTMLAttributes<HTMLElement>);
    }
    return (
      <button ref={ref} type={type ?? 'button'} className={cls} {...rest}>
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
