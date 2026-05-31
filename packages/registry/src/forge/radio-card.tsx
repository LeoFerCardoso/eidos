import * as React from 'react';

type CardOrientation = 'horizontal' | 'vertical';

interface RadioCardProps {
  /** The value this card represents within a RadioCardGroup. */
  value: string;
  /** Primary label text. */
  title: React.ReactNode;
  /** Secondary description line. */
  description?: React.ReactNode;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Card layout. Inherited from RadioCardGroup when used inside one. */
  orientation?: CardOrientation;
  /** Whether this card is currently selected (controlled by RadioCardGroup). */
  checked?: boolean;
  /** Called when this card is selected. */
  onChange?: (value: string) => void;
  /** Shared input name (provided by RadioCardGroup). */
  name?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

function RadioCard({
  value,
  title,
  description,
  icon,
  orientation = 'horizontal',
  checked = false,
  onChange,
  name,
  disabled = false,
  id,
  className = '',
}: RadioCardProps) {
  const reactId = React.useId();
  const rid = id || reactId;

  const cardCls = [
    'sel-card',
    orientation === 'vertical' ? 'sel-card--vertical' : '',
    checked ? 'sel-card--checked' : '',
    disabled ? 'sel-card--disabled' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <label className={cardCls} htmlFor={rid} aria-disabled={disabled || undefined}>
      <input
        type="radio"
        id={rid}
        className="fc-input"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange?.(value)}
      />
      <span className="fc-radio-box" aria-hidden="true">
        <span className="fc-radio-dot" />
      </span>
      <span className="sel-card__body">
        {icon && <span className="sel-card__icon" aria-hidden="true">{icon}</span>}
        <span className="sel-card__title">{title}</span>
        {description && <span className="sel-card__desc">{description}</span>}
      </span>
    </label>
  );
}

export { RadioCard };
