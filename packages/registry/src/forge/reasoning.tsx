import * as React from 'react';
import { Icons } from '@/components/forge/icons';

const Reasoning = ({
  streaming,
  duration,
  title,
  defaultOpen,
  onOpenChange,
  children,
}: {
  /** Drives auto-open and the shimmer verb. Flip to false when tokens stop arriving. */
  streaming?: boolean;
  /** Seconds elapsed. Mono-rendered next to the verb; pair with a useDuration hook. */
  duration?: number;
  /** Override the verb label. Default: "Thinking" while streaming, "Thought" when settled. */
  title?: string;
  /** Initial open state before any user toggle. Auto-state takes over until the user clicks. */
  defaultOpen?: boolean;
  /** Called when the user manually toggles the collapsible open/closed. */
  onOpenChange?: (open: boolean) => void;
  /** Trace content. Use mono-faced paragraphs; <em> for soft annotations, <code> for IDs. */
  children?: React.ReactNode;
}) => {
  const [userToggled, setUserToggled] = React.useState(false);
  const [open, setOpen] = React.useState(defaultOpen ?? streaming ?? false);

  // Auto-open during streaming / auto-collapse when done — but ONLY if the
  // consumer didn't pin the state with an explicit `defaultOpen`, and only
  // until the user manually toggles. Without the `defaultOpen` guard, the
  // anatomy demo (defaultOpen + streaming=false) would silently auto-close.
  React.useEffect(() => {
    if (userToggled) return;
    if (defaultOpen !== undefined) return;
    setOpen(!!streaming);
  }, [streaming, userToggled, defaultOpen]);

  const verb = streaming ? 'Thinking' : 'Thought';
  return (
    <div
      className="rsn"
      data-streaming={streaming ? 'true' : 'false'}
      data-open={open ? 'true' : 'false'}
    >
      <button
        className="rsn-trigger"
        onClick={() => {
          setUserToggled(true);
          setOpen(v => {
            const next = !v;
            onOpenChange?.(next);
            return next;
          });
        }}
        aria-expanded={open}
      >
        <span className="ico"><Icons.sparkle size={12}/></span>
        <span className="label">
          <span className="verb">{title || verb}</span>
          <span className="dot"/>
          <span className="dur">{(duration ?? 0).toFixed(1)}s</span>
        </span>
        <Icons.chevronDown size={13} className="chev"/>
      </button>
      <div className="rsn-body" aria-hidden={!open} aria-live="polite" aria-busy={!!streaming}>
        <div className="rsn-body-inner" aria-hidden={streaming ? true : undefined}>{children}</div>
      </div>
    </div>
  );
};

export { Reasoning };
