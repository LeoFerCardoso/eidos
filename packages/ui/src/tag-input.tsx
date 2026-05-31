import * as React from 'react';
import { cn } from './lib/utils';
import { Icons } from './icons';

// Eidos DS — TagInput
//
// Multi-value tag entry field. Type a value, then press Enter or comma to
// commit it as a chip. Backspace on an empty caret removes the last chip.
// Each chip's remove button is keyboard-reachable:
//   - ArrowLeft from the text input (or any chip) moves focus to the
//     previous chip's remove button.
//   - ArrowRight from a chip moves forward; from the last chip it returns
//     focus to the text input.
//   - Backspace or Delete on a focused remove button removes THAT chip,
//     returning focus to the next chip's button or the text input.
//   - Enter or Space on a focused remove button also removes the chip.
//
// Paste splits on comma and newline. Supports optional maxTags, duplicate
// prevention, and a validate predicate. Controlled (value + onValueChange)
// and uncontrolled (defaultValue) modes.
//
// CSS: packages/ui/styles/tokens.css (.in-group/.in-tags/.in-tag)
// No <style> here — emit className strings only.

// ── Types ────────────────────────────────────────────────────────────────────

export interface TagInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Controlled list of tag strings.
   * If provided the component is fully controlled; pair with `onValueChange`.
   */
  value?: string[];
  /**
   * Uncontrolled initial list. Ignored when `value` is provided.
   */
  defaultValue?: string[];
  /**
   * Called whenever the tag list changes (add, remove).
   */
  onValueChange?: (tags: string[]) => void;
  /**
   * Placeholder text shown only when no tags and the text field is empty.
   */
  placeholder?: string;
  /**
   * Hard cap on the total number of tags. The field shows a `n / max` counter
   * when this prop is set and disables the input once the cap is reached.
   */
  maxTags?: number;
  /**
   * Commit-time validator. Return `null` for valid; return an error message
   * string for invalid. Called before the duplicate check.
   */
  validate?: (tag: string) => string | null;
  /**
   * Group height to match surrounding form chrome.
   * sm = 28px, md = 36px (default), lg = 44px.
   */
  size?: 'sm' | 'md' | 'lg';
  /** Locks the field — no input, no remove. */
  disabled?: boolean;
  /** Shows tags but prevents editing. */
  readOnly?: boolean;
  /**
   * Accessible label used by the `role="group"` wrapper and associated with
   * the text input via `aria-labelledby`. If omitted the outer `<label>`
   * element linked via `id` serves as the label.
   */
  label?: string;
  /**
   * The `id` applied to the inner `<input>` — connect an outer `<label htmlFor>`.
   */
  id?: string;
  /** Helper text shown below the field when there is no error. */
  help?: string;
  /** Extra classes merged onto the root `.in-field` wrapper via cn(). */
  className?: string;
}

// ── Component ────────────────────────────────────────────────────────────────

export const TagInput = React.forwardRef<HTMLDivElement, TagInputProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      placeholder = 'Add tag…',
      maxTags,
      validate,
      size = 'md',
      disabled = false,
      readOnly = false,
      label,
      id,
      help,
      className,
      ...rest
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [internalTags, setInternalTags] = React.useState<string[]>(
      defaultValue ?? [],
    );
    const tags = isControlled ? (valueProp ?? []) : internalTags;

    const [inputValue, setInputValue] = React.useState('');
    const [error, setError] = React.useState('');
    // Announce text for the live region (screen-reader feedback on add/remove).
    const [announce, setAnnounce] = React.useState('');

    const inputRef = React.useRef<HTMLInputElement>(null);
    const groupRef = React.useRef<HTMLDivElement>(null);
    // Refs for each tag's remove button — used for Arrow-key focus management.
    const removeButtonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

    // Stable IDs
    const reactId = React.useId();
    const inputId = id ?? `${reactId}-input`;
    const descId = `${reactId}-desc`;
    const errorId = `${reactId}-err`;
    const liveId = `${reactId}-live`;

    // Keep removeButtonRefs in sync with tag count.
    removeButtonRefs.current = removeButtonRefs.current.slice(0, tags.length);

    // ── Tag mutation helpers ─────────────────────────────────────────────────

    const setTags = (next: string[]) => {
      if (!isControlled) setInternalTags(next);
      onValueChange?.(next);
    };

    const commitTag = (raw: string) => {
      const tag = raw.trim().replace(/,+$/, '').trim();
      setError('');
      if (!tag) { setInputValue(''); return; }

      // Duplicate check
      if (tags.includes(tag)) {
        setError('Already added');
        setInputValue('');
        return;
      }

      // Max-tags check
      if (maxTags !== undefined && tags.length >= maxTags) {
        setError(`Maximum ${maxTags} tag${maxTags !== 1 ? 's' : ''} reached`);
        return;
      }

      // Custom validation
      if (validate) {
        const msg = validate(tag);
        if (msg) { setError(msg); return; }
      }

      const next = [...tags, tag];
      setTags(next);
      setInputValue('');
      setAnnounce(`Added ${tag}`);
    };

    const removeTag = (index: number, focusTarget: 'next' | 'prev' | 'input' = 'input') => {
      const removed = tags[index];
      const nextTags = tags.filter((_, i) => i !== index);
      setTags(nextTags);
      setError('');
      setAnnounce(`Removed ${removed}`);

      // Focus management after removal.
      requestAnimationFrame(() => {
        if (focusTarget === 'input' || nextTags.length === 0) {
          inputRef.current?.focus();
        } else if (focusTarget === 'next') {
          // Focus the button that is now at the same index (was next, shifted left).
          const nextBtn = removeButtonRefs.current[index];
          if (nextBtn) {
            nextBtn.focus();
          } else {
            // We removed the last one — go to the new last, or the input.
            const prevBtn = removeButtonRefs.current[nextTags.length - 1];
            if (prevBtn) prevBtn.focus(); else inputRef.current?.focus();
          }
        } else {
          // prev — focus the one before removed, or input if none.
          const prevIdx = index - 1;
          const prevBtn = prevIdx >= 0 ? removeButtonRefs.current[prevIdx] : null;
          if (prevBtn) prevBtn.focus(); else inputRef.current?.focus();
        }
      });
    };

    // ── Paste handler: split on comma / newline ──────────────────────────────

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData.getData('text');
      if (!text.includes(',') && !text.includes('\n')) return; // let normal paste proceed
      e.preventDefault();
      const parts = text.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean);
      let current = [...tags];
      for (const part of parts) {
        if (!part) continue;
        if (current.includes(part)) continue;
        if (maxTags !== undefined && current.length >= maxTags) break;
        if (validate && validate(part)) continue;
        current = [...current, part];
      }
      setTags(current);
    };

    // ── Keyboard handler on the text input ──────────────────────────────────

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        commitTag(inputValue);
      } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
        removeTag(tags.length - 1, 'input');
      } else if (e.key === 'ArrowLeft' && !inputValue && tags.length > 0) {
        // Move focus to the last chip's remove button.
        e.preventDefault();
        const lastBtn = removeButtonRefs.current[tags.length - 1];
        if (lastBtn) lastBtn.focus();
      }
    };

    // ── Keyboard handler on a chip remove button ─────────────────────────────

    const handleChipKeyDown = (
      e: React.KeyboardEvent<HTMLButtonElement>,
      index: number,
    ) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        removeTag(index, index + 1 < tags.length ? 'next' : 'prev');
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        removeTag(index, index + 1 < tags.length ? 'next' : 'prev');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevBtn = index > 0 ? removeButtonRefs.current[index - 1] : null;
        if (prevBtn) prevBtn.focus();
        // If already at first chip, stay.
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (index + 1 < tags.length) {
          const nextBtn = removeButtonRefs.current[index + 1];
          if (nextBtn) nextBtn.focus();
        } else {
          // Last chip — move focus back to the text input.
          inputRef.current?.focus();
        }
      }
    };

    // ── Derived state ────────────────────────────────────────────────────────

    const isInvalid = error !== '';
    const atMax = maxTags !== undefined && tags.length >= maxTags;
    const isInputDisabled = disabled || readOnly || atMax;

    // ── Render ───────────────────────────────────────────────────────────────

    const describedBy = [
      isInvalid ? errorId : null,
      help && !isInvalid ? descId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div
        ref={ref}
        role="group"
        aria-label={label}
        className={cn('in-field', className)}
        {...rest}
      >
        {/* Visually-hidden live region for screen-reader announcements */}
        <span
          id={liveId}
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
            whiteSpace: 'nowrap',
          }}
        >
          {announce}
        </span>

        {/* Tag group + input */}
        <div
          ref={groupRef}
          className={cn(
            'in-group',
            size !== 'md' && size,
            isInvalid && 'is-invalid',
            disabled && 'is-disabled',
            readOnly && 'is-readonly',
          )}
          onClick={() => {
            if (!isInputDisabled) inputRef.current?.focus();
          }}
        >
          <div className="in-tags">
            {tags.map((tag, index) => (
              <span key={`${tag}-${index}`} className="in-tag">
                {tag}
                {!readOnly && !disabled && (
                  <button
                    type="button"
                    className="tag-x"
                    aria-label={`Remove ${tag}`}
                    ref={(el) => { removeButtonRefs.current[index] = el; }}
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(index, index + 1 < tags.length ? 'next' : 'prev');
                    }}
                    onKeyDown={(e) => handleChipKeyDown(e, index)}
                  >
                    <Icons.x size={11} />
                  </button>
                )}
              </span>
            ))}
            <input
              ref={inputRef}
              id={inputId}
              className="in-control"
              type="text"
              value={inputValue}
              placeholder={tags.length === 0 ? placeholder : ''}
              disabled={isInputDisabled}
              readOnly={readOnly}
              aria-invalid={isInvalid || undefined}
              aria-describedby={describedBy}
              aria-label={label ? undefined : 'Add tag'}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onBlur={() => {
                if (inputValue.trim()) commitTag(inputValue);
              }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Error / help / counter row */}
        {(isInvalid || help || maxTags !== undefined) && (
          <div className="in-helprow">
            {isInvalid ? (
              <span id={errorId} className="in-error">
                <Icons.alert size={12} />
                {error}
              </span>
            ) : help ? (
              <span id={descId} className="in-help">
                {help}
              </span>
            ) : (
              <span />
            )}
            {maxTags !== undefined && (
              <span className="in-counter" aria-live="polite">
                {tags.length} / {maxTags}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

TagInput.displayName = 'TagInput';
