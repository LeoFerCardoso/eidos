import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/forge/icons';

type ToastTone = 'default' | 'info' | 'success' | 'warning' | 'danger' | 'loading';

type ToasterPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

interface ToastAction {
  label: string;
  onClick?: () => void;
}

interface ToastItem {
  id: number;
  tone: ToastTone;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastAction;
  /** ms before auto-dismiss; 0 = never auto-dismiss */
  duration?: number;
}

interface ToasterProps {
  /** Corner the stack anchors to. Pick one per app and stick to it. */
  position?: ToasterPosition;
  /** Max visible toasts before oldest collapses into the stack. */
  visibleToasts?: number;
}

interface ToastContextValue {
  toast: (options: Omit<ToastItem, 'id'>) => number;
  dismiss: (id: number) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

interface ProviderState {
  toasts: ToastItem[];
}

type ProviderAction =
  | { type: 'ADD'; item: ToastItem }
  | { type: 'REMOVE'; id: number };

function reducer(state: ProviderState, action: ProviderAction): ProviderState {
  switch (action.type) {
    case 'ADD':
      return { toasts: [...state.toasts, action.item] };
    case 'REMOVE':
      return { toasts: state.toasts.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

const ICON_MAP: Record<ToastTone, React.ComponentType<{ size?: number; className?: string }> | null> = {
  default:  Icons.bell,
  info:     Icons.info,
  success:  Icons.check,
  warning:  Icons.alert,
  danger:   Icons.x,
  loading:  null,  // rendered as a CSS spinner
};

const ToastCard = React.forwardRef<HTMLLIElement, {
  item: ToastItem;
  onDismiss: () => void;
  dismissLabel?: string;
}>(({ item, onDismiss, dismissLabel = 'Dismiss notification' }, ref) => {
  // Pause auto-dismiss while this card is hovered or focused
  const pausedRef = React.useRef(false);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleClose = React.useCallback((delay: number) => {
    if (delay <= 0) return;
    closeTimerRef.current = setTimeout(() => {
      if (!pausedRef.current) onDismiss();
    }, delay);
  }, [onDismiss]);

  const clearClose = React.useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    const dur = item.duration === undefined ? 4500 : item.duration;
    scheduleClose(dur);
    return clearClose;
  }, [item.duration, scheduleClose, clearClose]);

  const pause = () => {
    pausedRef.current = true;
    clearClose();
  };

  const resume = () => {
    pausedRef.current = false;
    const dur = item.duration === undefined ? 4500 : item.duration;
    if (dur > 0) scheduleClose(1500); // resume with shortened remaining
  };

  // tone → aria-live politeness
  const isAssertive = item.tone === 'danger' || item.tone === 'warning';

  const Icon = ICON_MAP[item.tone];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onDismiss();
    }
  };

  return (
    <li
      ref={ref}
      className={cn('tst toast', item.tone !== 'default' && item.tone)}
      role={isAssertive ? 'alert' : 'status'}
      aria-live={isAssertive ? 'assertive' : 'polite'}
      aria-atomic="true"
      tabIndex={0}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onKeyDown={handleKeyDown}
    >
      {item.tone === 'loading' ? (
        <span aria-hidden="true" className="tst-spin" />
      ) : Icon ? (
        <Icon size={16} className="tst-icon" />
      ) : null}

      <div className="tst-body">
        {item.title && <div className="tst-title">{item.title}</div>}
        {item.description && <div className="tst-desc">{item.description}</div>}
      </div>

      {item.action && (
        <button
          type="button"
          className="tst-action"
          onClick={() => {
            item.action?.onClick?.();
            onDismiss();
          }}
        >
          {item.action.label}
        </button>
      )}

      <button
        type="button"
        className="tst-close"
        aria-label={dismissLabel}
        onClick={onDismiss}
      >
        <Icons.x size={14} />
      </button>
    </li>
  );
});

let _idCounter = 0;

interface ToastProviderProps extends ToasterProps {
  /**
   * Wrap your app (or the subtree that needs toasts) with this provider.
   * `Toaster` is a convenience alias that renders the same provider — use
   * `ToastProvider` when you need to place `useToast()` calls in siblings
   * rather than descendants of `<Toaster>`.
   */
  children?: React.ReactNode;
}

const ToastProvider = ({
  position = 'bottom-right',
  visibleToasts = 5,
  children,
}: ToastProviderProps) => {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] });

  const toast = React.useCallback((options: Omit<ToastItem, 'id'>): number => {
    const id = ++_idCounter;
    dispatch({ type: 'ADD', item: { ...options, id } });
    return id;
  }, []);

  const dismiss = React.useCallback((id: number) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  const visible = state.toasts.slice(-visibleToasts);

  const regionRef = React.useRef<HTMLOListElement>(null);

  // F6 global hotkey — jump focus into the toast region
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'F6' && state.toasts.length > 0) {
        const first = regionRef.current?.querySelector<HTMLElement>('[tabindex="0"]');
        first?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [state.toasts.length]);

  const portalRegion = typeof document !== 'undefined' ? ReactDOM.createPortal(
    <ol
      ref={regionRef}
      className={cn('tst-region', position)}
      aria-label="Notifications"
      role="region"
    >
      {visible.map((item) => (
        <ToastCard
          key={item.id}
          item={item}
          onDismiss={() => dismiss(item.id)}
        />
      ))}
    </ol>,
    document.body,
  ) : null;

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {portalRegion}
    </ToastContext.Provider>
  );
};

const Toaster = ToastProvider;

export { Toaster };
