import * as React from 'react';
import { Icons } from './icons';

// Forge DS — Selection Cards
//
// CheckboxCard and RadioCard/RadioCardGroup: clickable card surfaces that
// wrap native checkbox / radio inputs. The ENTIRE card is the selection
// target — implemented as a <label> element so clicking anywhere:
//   • toggles the native input (no JS required for the toggle itself),
//   • places focus on the input (native label behaviour),
//   • exposes the visual focus ring on the card via :has(.fc-input:focus-visible).
//
// CSS lives in tokens.css under the .sel-card* block.
//
// A11y:
//   • Real <input type="checkbox|radio"> inside the label → keyboard Space
//     toggles; Tab moves focus; arrow keys move between radios (native).
//   • The card <label> wraps the input → focus is ON the input, visible
//     ring is on the card via :has(). No role="button" duplication.
//   • disabled → aria-disabled on label + pointer-events:none on card.
//   • RadioCardGroup exposes role="radiogroup" + aria-label.

type CardOrientation = 'horizontal' | 'vertical';

// ── CheckboxCard ─────────────────────────────────────────────────────────────

export interface CheckboxCardProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'title'> {
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

export function CheckboxCard({
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

// ── RadioCard ─────────────────────────────────────────────────────────────────

export interface RadioCardProps {
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

export function RadioCard({
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

// ── RadioCardGroup ────────────────────────────────────────────────────────────

export interface RadioCardOption {
  value: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioCardGroupProps {
  /** Options to render as RadioCards. */
  options: RadioCardOption[];
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled default selected value. */
  defaultValue?: string;
  /** Called when a card is selected. */
  onValueChange?: (value: string) => void;
  /** Shared input name (auto-generated if omitted). */
  name?: string;
  /** Group layout — `vertical` (default, column of cards) or `horizontal` (row). */
  orientation?: 'horizontal' | 'vertical';
  /** Card orientation — how each individual card lays out its control + content. */
  cardOrientation?: CardOrientation;
  /** Disable the entire group. */
  disabled?: boolean;
  /** Accessible name for the group (role="radiogroup"). */
  ariaLabel?: string;
  className?: string;
}

export function RadioCardGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  orientation = 'vertical',
  cardOrientation = 'horizontal',
  disabled = false,
  ariaLabel,
  className = '',
}: RadioCardGroupProps) {
  const reactId = React.useId();
  const groupName = name || reactId;

  const [internal, setInternal] = React.useState(defaultValue ?? '');
  const isControlled = value !== undefined;
  const selected = isControlled ? value : internal;

  const handleChange = (v: string) => {
    if (!isControlled) setInternal(v);
    onValueChange?.(v);
  };

  const groupCls = [
    'sel-card-group',
    orientation === 'horizontal' ? 'sel-card-group--horizontal' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div role="radiogroup" aria-label={ariaLabel} className={groupCls}>
      {options.map((opt) => (
        <RadioCard
          key={opt.value}
          value={opt.value}
          title={opt.title}
          description={opt.description}
          icon={opt.icon}
          orientation={cardOrientation}
          checked={selected === opt.value}
          onChange={handleChange}
          name={groupName}
          disabled={disabled || opt.disabled}
        />
      ))}
    </div>
  );
}
