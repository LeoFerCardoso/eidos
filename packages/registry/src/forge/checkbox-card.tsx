import * as React from 'react';
import { Icons } from '@/components/forge/icons';

type CardOrientation = 'horizontal' | 'vertical';

interface CheckboxCardProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'title'> {
  /** Primary label text. */
  title: React.ReactNode;
  /** Secondary description line. */
  description?: React.ReactNode;
  /** Optional leading icon rendered above/before the title. */
  icon?: React.ReactNode;
  /** Card layout — `horizontal` (default): control + content in a row;
   *  `vertical`: control on top, content below. */
  orientation?: CardOrientation;
  /** Controlled checked state. */
  checked?: boolean;
  /** Uncontrolled default checked state. */
  defaultChecked?: boolean;
  /** Called when the checked state changes. */
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

function CheckboxCard({
  title,
  description,
  icon,
  orientation = 'horizontal',
  checked,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  id,
  className = '',
  onChange,
  ...rest
}: CheckboxCardProps) {
  const reactId = React.useId();
  const cid = id || reactId;

  // Uncontrolled internal state (used only when checked is undefined)
  const [internal, setInternal] = React.useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internal;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternal(e.target.checked);
    onCheckedChange?.(e.target.checked);
    onChange?.(e);
  };

  const cardCls = [
    'sel-card',
    orientation === 'vertical' ? 'sel-card--vertical' : '',
    isChecked ? 'sel-card--checked' : '',
    disabled ? 'sel-card--disabled' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <label className={cardCls} htmlFor={cid} aria-disabled={disabled || undefined}>
      <input
        type="checkbox"
        id={cid}
        className="fc-input"
        checked={isControlled ? checked : undefined}
        defaultChecked={!isControlled ? defaultChecked : undefined}
        disabled={disabled}
        onChange={handleChange}
        {...rest}
      />
      <span className="fc-check-box" aria-hidden="true">
        <span className="fc-check-icon">
          <Icons.check size={10} strokeWidth={3} color="currentColor" />
        </span>
      </span>
      <span className="sel-card__body">
        {icon && <span className="sel-card__icon" aria-hidden="true">{icon}</span>}
        <span className="sel-card__title">{title}</span>
        {description && <span className="sel-card__desc">{description}</span>}
      </span>
    </label>
  );
}

export { CheckboxCard };
