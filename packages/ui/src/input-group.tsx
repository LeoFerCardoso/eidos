import * as React from 'react';
import { cn } from './lib/utils';

// ═══════════════════════════════════════════════════════════════════════════
// InputGroup — Eidos DS
//
// Composes the existing .in-group / .in-addon / .in-control CSS system that
// is already used by Input and NativeSelect. No parallel .ig-* classes.
//
// The group shell owns the single focus-within ring; child inputs use
// .in-control (borderless inside the group). Addons use .in-addon with a
// kind modifier: text | icon | button | select.
//
// Disabled: aria-disabled on the group + the group's .is-disabled opacity;
// interactive children receive disabled={true} (+ tabIndex={-1} for buttons
// and selects) via context so they are not tab-reachable when the group
// is disabled.
//
// Aria-describedby for text affixes: callers can pass an id to InputAddon
// kind="text" and reference it from the input's aria-describedby — the
// component passes through any id on the span.
//
// CSS: packages/ui/styles/tokens.css (.in-group / .in-addon / .in-control)
// No <style> block here — className strings only.
// ═══════════════════════════════════════════════════════════════════════════

// ── Types ────────────────────────────────────────────────────────────────────

export interface InputGroupProps extends React.HTMLAttributes<HTMLSpanElement> {
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

/**
 * Props shared by every addon kind, regardless of the element it renders.
 * The `kind`-specific attribute surface is layered on by the discriminated
 * union below so each kind gets the right element typing (e.g. a controlled
 * `kind="select"` accepts `value` + a typed `onChange` against
 * `HTMLSelectElement`, and `kind="button"` accepts button attributes).
 */
interface InputAddonBaseProps {
  /** Ember-fill accent for a primary action button (kind="button" only). */
  accent?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Semantic kind — drives the CSS modifier and the element tag:
 *   text   → <span>  — static prefix/suffix label (URL scheme, unit, @)
 *   icon   → <span>  — leading/trailing icon wrapper (single icon, no interaction)
 *   button → <button>— attached action (search, copy, send, apply)
 *   select → <select>— inline picker (currency, country code, scheme)
 *
 * Discriminated on `kind` so each variant exposes its element-specific
 * attributes: a `kind="select"` addon accepts `value`/`defaultValue` and an
 * `onChange` typed against `HTMLSelectElement` (a controlled currency picker is
 * a documented use); `kind="button"` accepts button attributes; `text`/`icon`
 * accept generic span attributes (the `id` pass-through wires aria-describedby).
 */
export type InputAddonProps =
  | (InputAddonBaseProps & {
      kind: 'text' | 'icon';
    } & Omit<React.HTMLAttributes<HTMLSpanElement>, 'children' | 'className'>)
  | (InputAddonBaseProps & {
      kind: 'button';
      /** Disabled state — valid for kind="button" and kind="select". */
      disabled?: boolean;
    } & Omit<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        'children' | 'className' | 'disabled' | 'type'
      >)
  | (InputAddonBaseProps & {
      kind: 'select';
      /** Disabled state — valid for kind="button" and kind="select". */
      disabled?: boolean;
    } & Omit<
        React.SelectHTMLAttributes<HTMLSelectElement>,
        'children' | 'className' | 'disabled'
      >);

// ── Context (internal) ────────────────────────────────────────────────────────

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

// ── InputGroup ────────────────────────────────────────────────────────────────

/**
 * Horizontal cluster that shares one bordered shell (.in-group).
 *
 * Compose `InputAddon` and a native `<input className="in-control">` as children:
 *
 * ```tsx
 * <InputGroup>
 *   <InputAddon kind="text" id="scheme-desc">https://</InputAddon>
 *   <input className="in-control" aria-describedby="scheme-desc" placeholder="eidos.example.com" />
 *   <InputAddon kind="button" accent>Copy</InputAddon>
 * </InputGroup>
 * ```
 *
 * The shell renders as a `<span role="group">` — screen readers announce it as a
 * group and Tab moves through the real child controls in DOM order.
 *
 * When `disabled` is set, `aria-disabled` is placed on the group shell and
 * every child button/select receives `disabled` + `tabIndex={-1}` via context,
 * so they are not reachable by keyboard or mouse.
 */
export const InputGroup = React.forwardRef<HTMLSpanElement, InputGroupProps>(
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
InputGroup.displayName = 'InputGroup';

// ── InputAddon ────────────────────────────────────────────────────────────────

/**
 * A single segment inside an `InputGroup`.
 *
 * - **text** — static label (URL scheme, unit, @ prefix). Renders as `<span>`.
 *   Pass an `id` and reference it from the input's `aria-describedby` so screen
 *   readers announce the affix as context.
 * - **icon** — decorative icon wrapper. Renders as `<span>`.
 * - **button** — interactive action. Renders as `<button type="button">`.
 *   Receives `disabled` and `tabIndex={-1}` from the parent group context when
 *   the group is disabled.
 * - **select** — native picker. Renders as `<select>`.
 *   Receives `disabled` and `tabIndex={-1}` from the parent group context when
 *   the group is disabled.
 */
export const InputAddon = React.forwardRef<HTMLElement, InputAddonProps>(
  (props, ref) => {
    // `disabled` is only declared on the button/select union members; read it
    // through a widened view so the destructure stays valid for text/icon too.
    const {
      kind,
      accent = false,
      disabled: disabledProp,
      children,
      className,
      ...rest
    } = props as InputAddonBaseProps & {
      kind: InputAddonProps['kind'];
      disabled?: boolean;
      [key: string]: unknown;
    };
    const ctx = React.useContext(InputGroupCtx);
    const disabled = disabledProp ?? ctx.disabled;

    const baseCls = cn(
      'in-addon',
      kind,
      accent && 'ember',
      className,
    );

    if (kind === 'button') {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          className={baseCls}
          {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>
      );
    }

    if (kind === 'select') {
      return (
        <select
          ref={ref as React.Ref<HTMLSelectElement>}
          disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          className={baseCls}
          {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {children}
        </select>
      );
    }

    // text | icon → span (non-interactive; id pass-through enables aria-describedby wiring)
    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        className={baseCls}
        {...(rest as React.HTMLAttributes<HTMLSpanElement>)}
      >
        {children}
      </span>
    );
  },
);
InputAddon.displayName = 'InputAddon';
