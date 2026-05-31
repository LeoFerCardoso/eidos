import * as React from 'react';
import { ColorPicker } from '@/components/forge/color-picker';
import { Icons } from '@/components/forge/icons';

type ColorSize = 'sm' | 'md' | 'lg';

interface ColorInputProps {
  /** Controlled hex value. Six-char (#RRGGBB) or eight-char (#RRGGBBAA). */
  value?: string;
  /** Uncontrolled initial hex. Used when `value` is not provided. */
  defaultValue?: string;
  /** Fires on every change inside the picker. */
  onChange?: (hex: string) => void;
  /** Show the alpha slider and extend hex to 8 characters. */
  alpha?: boolean;
  /** Curated palette shown below the inputs. */
  swatches?: string[];
  /** Trigger height — 28 / 36 / 44 px. */
  size?: ColorSize;
  /** Greys out the trigger and blocks the popover. */
  disabled?: boolean;
  /** Extra utility classes forwarded to the trigger button. */
  className?: string;
}

function ColorInput({
  value,
  defaultValue = '#FF6B35',
  onChange,
  alpha = false,
  swatches = [],
  size = 'md',
  disabled = false,
  className = '',
}: ColorInputProps) {
  // Internal state — used when uncontrolled (value === undefined).
  const [internalVal, setInternalVal] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentVal = isControlled ? value! : internalVal;

  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const popRef = React.useRef<HTMLDivElement>(null);

  // Position the popover flush under the trigger, escaping overflow:hidden.
  React.useLayoutEffect(() => {
    if (!open) { setPos(null); return; }
    const place = () => {
      const el = triggerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: r.left });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  // Dismiss on outside click or Escape.
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (popRef.current?.contains(e.target as Node)) return;
      if (triggerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const handleChange = (next: string) => {
    if (!isControlled) setInternalVal(next);
    onChange?.(next);
  };

  const triggerCls = ['cp-trigger', size !== 'md' ? size : '', className]
    .filter(Boolean).join(' ');

  return (
    <div style={{ display: 'inline-block' }}>
      <button
        ref={triggerRef}
        type="button"
        className={triggerCls}
        onClick={() => { if (!disabled) setOpen(o => !o); }}
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
        style={disabled ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
      >
        <span className="cp-swatch">
          <span style={{ background: currentVal }} />
        </span>
        <span className="cp-trigger-divider" />
        <span className="cp-trigger-text">{currentVal}</span>
        <span className="cp-trigger-arrow">
          <Icons.chevronDown size={13} />
        </span>
      </button>

      {open && pos && (
        <ColorPicker
          popRef={popRef}
          style={{ top: pos.top, left: pos.left }}
          value={currentVal}
          alpha={alpha}
          swatches={swatches}
          onChange={handleChange}
        />
      )}
    </div>
  );
}

export { ColorInput };
