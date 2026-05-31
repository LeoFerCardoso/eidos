import * as React from 'react';
import { Icons } from '@/components/forge/icons';

const Queue = ({
  title = 'Queued', items = [], onRemove,
}: {
  /** Header label shown beside the list icon. Update to match product voice ("Next up", "Pending"). */
  title?: string;
  /** Items in order. Accepts plain strings or objects with a text field. */
  items?: any[];
  /** Called with the 0-based index of the removed item. When omitted, the remove button is not rendered. */
  onRemove?: (i: number) => void;
}) => {
  // Roving focus after a remove: keep refs to the per-item remove buttons and,
  // once the parent has re-rendered with the shorter list, move focus to the
  // remove button now occupying the removed index (the next item), falling back
  // to the new last item — so keyboard users can keep clearing without lifting
  // their hands. Documented in queue.tsx (Keyboard a11y card).
  const btnRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const pendingFocus = React.useRef<number | null>(null);

  const handleRemove = (i: number) => {
    pendingFocus.current = i;
    onRemove?.(i);
  };

  React.useLayoutEffect(() => {
    const target = pendingFocus.current;
    pendingFocus.current = null;
    if (target === null) return;
    if (items.length === 0) return; // list emptied — nothing to focus
    const idx = Math.min(target, items.length - 1);
    btnRefs.current[idx]?.focus();
  }, [items.length]);

  return (
    <div className="ai-queue">
      <div className="ai-queue-head">
        <Icons.list size={12}/><span>{title}</span>
        <span className="count" role="status" aria-live="polite">{items.length}</span>
      </div>
      <ol className="ai-queue-list">
        {items.map((it, i) => (
          <li key={i} className="ai-queue-item">
            <span className="ai-queue-pos">{i + 1}</span>
            <span className="ai-queue-text">{typeof it === 'string' ? it : it.text}</span>
            {onRemove && (
              <button
                className="ai-queue-remove"
                aria-label="Remove from queue"
                ref={el => { btnRefs.current[i] = el; }}
                onClick={() => handleRemove(i)}
              >
                <Icons.x size={12}/>
              </button>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export { Queue };
