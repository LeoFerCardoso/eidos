import * as React from 'react';
import { cn } from './lib/utils';
import { Icons } from './icons';

// Forge DS — Resizable panels.
//
// Split any two panes with a drag-and-keyboard handle. Supports:
//   orientation horizontal | vertical
//   min/max size per panel (px or %, passed as CSS on the container)
//   controlled + uncontrolled defaultSizes (% of the group)
//   optional collapsible panel (collapses to collapsedSize on Enter / keyboard)
//   pointer drag via setPointerCapture
//   full keyboard model on the handle:
//     ArrowLeft/Right (horizontal) or ArrowUp/Down (vertical) — nudge by step
//     Shift+Arrow — larger step
//     Home / End — jump to min / max
//     Enter — toggle collapse (if collapsible)
//   RTL-aware: direction read from the nearest [dir] ancestor at runtime
//   prefers-reduced-motion: collapse/expand skips the transition
//
// CSS lives in tokens.css / ds.css (promoted via cssBlock in the build item).
// No <style> block, no Tailwind, no Radix.

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export type ResizableOrientation = 'horizontal' | 'vertical';

export interface ResizableProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Layout axis for the handle. Horizontal = left/right panels; vertical = top/bottom. */
  orientation?: ResizableOrientation;
  /**
   * Initial size of the FIRST panel as a percentage (0–100).
   * Uncontrolled. To control, use `sizes` + `onSizesChange`.
   */
  defaultSizes?: [number, number];
  /** Controlled sizes. [firstPanelPercent, secondPanelPercent]. Must sum to 100. */
  sizes?: [number, number];
  /** Called whenever the split changes. Receives [firstPercent, secondPercent]. */
  onSizesChange?: (sizes: [number, number]) => void;
  /**
   * Minimum size of the FIRST panel (0–100 %).
   * @default 10
   */
  minSize?: number;
  /**
   * Maximum size of the FIRST panel (0–100 %).
   * @default 90
   */
  maxSize?: number;
  /**
   * When true, dragging below minSize collapses the first panel.
   * Enter on the handle toggles collapse/expand.
   */
  collapsible?: boolean;
  /**
   * Size the first panel collapses to (0–100 %).
   * @default 0
   */
  collapsedSize?: number;
  /** Arrow-key nudge size in percentage points. @default 1 */
  step?: number;
  /** Shift+Arrow nudge size in percentage points. @default 10 */
  largeStep?: number;
  /** Accessible label for the drag handle. @default "Resize panels" */
  handleLabel?: string;
  /** Show the grip pill in the divider. @default true */
  withHandle?: boolean;
  /** Extra class on the root container. */
  className?: string;
  /**
   * Either the two-node tuple (legacy form):
   *   `{[ <div>…</div>, <div>…</div> ]}`
   *
   * Or the compound three-child form:
   *   `<ResizablePanel/> <ResizableHandle/> <ResizablePanel/>`
   */
  children: [React.ReactNode, React.ReactNode] | [React.ReactNode, React.ReactNode, React.ReactNode];
}

export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  /** @internal Injected by Resizable in compound mode — do not set manually. */
  _panelIndex?: number;
  /** @internal Injected by Resizable in compound mode — do not set manually. */
  _panelStyle?: React.CSSProperties;
}

export interface ResizableHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render a visible grip pill in the divider centre. @default true */
  withHandle?: boolean;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// Internal context — lets Handle read orientation + callbacks from Resizable
// ═══════════════════════════════════════════════════════════════════════════

interface ResizableCtx {
  orientation: ResizableOrientation;
  sizes: [number, number];
  minSize: number;
  maxSize: number;
  step: number;
  largeStep: number;
  collapsible: boolean;
  collapsedSize: number;
  collapsed: boolean;
  handleLabel: string;
  withHandle: boolean;
  /** Stable id placed on the first panel element so aria-controls resolves. */
  firstPanelId: string;
  /** Computed styles for each panel by index (0 = first, 1 = second). */
  panelStyles: [React.CSSProperties, React.CSSProperties];
  groupRef: React.RefObject<HTMLDivElement | null>;
  handlePointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  toggleCollapse: () => void;
}

const ResizableContext = React.createContext<ResizableCtx | null>(null);

const useResizableCtx = () => {
  const ctx = React.useContext(ResizableContext);
  if (!ctx) throw new Error('ResizableHandle must be used inside <Resizable>.');
  return ctx;
};

// ═══════════════════════════════════════════════════════════════════════════
// Helper — clamp
// ═══════════════════════════════════════════════════════════════════════════

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

// ═══════════════════════════════════════════════════════════════════════════
// Resizable — the group that owns state + measurement
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Root component that owns the panel-split state.
 * Wrap exactly two children: `[<ResizablePanel>, <ResizablePanel>]`.
 * The `<ResizableHandle>` lives between the two panels.
 *
 * ```tsx
 * <Resizable orientation="horizontal" defaultSizes={[30, 70]}>
 *   {[
 *     <ResizablePanel key="a">Left</ResizablePanel>,
 *     <ResizablePanel key="b">Right</ResizablePanel>,
 *   ]}
 * </Resizable>
 * ```
 *
 * Or, for the compound sub-component style with an explicit handle:
 * ```tsx
 * <Resizable orientation="horizontal" defaultSizes={[30, 70]}>
 *   {[
 *     <><ResizablePanel>Left</ResizablePanel><ResizableHandle withHandle /></>,
 *     <ResizablePanel>Right</ResizablePanel>,
 *   ]}
 * </Resizable>
 * ```
 */
export const Resizable = React.forwardRef<HTMLDivElement, ResizableProps>(
  (
    {
      orientation = 'horizontal',
      defaultSizes,
      sizes: sizesProp,
      onSizesChange,
      minSize = 10,
      maxSize = 90,
      collapsible = false,
      collapsedSize = 0,
      step = 1,
      largeStep = 10,
      handleLabel = 'Resize panels',
      withHandle = true,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const isControlled = sizesProp !== undefined;
    const [internalSizes, setInternalSizes] = React.useState<[number, number]>(
      defaultSizes ?? [50, 50],
    );
    const [collapsed, setCollapsed] = React.useState(false);
    const groupRef = React.useRef<HTMLDivElement>(null);
    // Stable id shared via context so aria-controls on the handle resolves to
    // the real first-panel element (RZ1 fix).
    const firstPanelId = React.useId();

    const sizes: [number, number] = isControlled ? sizesProp! : internalSizes;

    const commit = React.useCallback(
      (next: [number, number]) => {
        if (!isControlled) setInternalSizes(next);
        onSizesChange?.(next);
      },
      [isControlled, onSizesChange],
    );

    // ── RTL detection ─────────────────────────────────────────────────────────
    const getDir = () => {
      if (!groupRef.current) return 'ltr';
      const el = groupRef.current.closest<HTMLElement>('[dir]');
      return el ? getComputedStyle(el).direction : 'ltr';
    };

    // ── Pointer drag ──────────────────────────────────────────────────────────
    const dragOrigin = React.useRef<{
      clientAxis: number;
      startFirst: number;
    } | null>(null);

    const handlePointerDown = React.useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        // Capture element + pointerId synchronously at pointerdown so onUp can
        // release it safely even after the event has been pooled (RZ3 fix).
        const captureEl = e.currentTarget;
        const capturedPointerId = e.pointerId;
        captureEl.setPointerCapture(capturedPointerId);

        const groupEl = groupRef.current;
        if (!groupEl) return;

        const isH = orientation === 'horizontal';
        const rect = groupEl.getBoundingClientRect();
        const groupSize = isH ? rect.width : rect.height;

        const startPercent = collapsed ? collapsedSize : sizes[0];
        dragOrigin.current = {
          clientAxis: isH ? e.clientX : e.clientY,
          startFirst: startPercent,
        };

        const onMove = (ev: PointerEvent) => {
          if (!dragOrigin.current) return;
          const delta = (isH ? ev.clientX : ev.clientY) - dragOrigin.current.clientAxis;
          const dir = isH ? getDir() : 'ltr';
          const sign = isH && dir === 'rtl' ? -1 : 1;
          const deltaPercent = sign * (delta / groupSize) * 100;
          let next = clamp(dragOrigin.current.startFirst + deltaPercent, minSize, maxSize);

          if (collapsible && next <= minSize + (largeStep / 2)) {
            next = collapsedSize;
            setCollapsed(true);
          } else {
            setCollapsed(false);
          }
          commit([next, 100 - next]);
        };

        const onUp = () => {
          // Use the synchronously-captured element + pointerId (not the pooled event).
          captureEl.releasePointerCapture(capturedPointerId);
          dragOrigin.current = null;
          groupEl.removeEventListener('pointermove', onMove);
          groupEl.removeEventListener('pointerup', onUp);
        };

        // Attach to groupEl so capture release works even when moving fast.
        groupEl.addEventListener('pointermove', onMove);
        groupEl.addEventListener('pointerup', onUp);
      },
      [orientation, sizes, minSize, maxSize, collapsible, collapsedSize, largeStep, commit],
    );

    // ── Keyboard ──────────────────────────────────────────────────────────────
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const isH = orientation === 'horizontal';
        const dir = isH ? getDir() : 'ltr';
        const rtlFactor = isH && dir === 'rtl' ? -1 : 1;

        const decKey = isH ? 'ArrowLeft' : 'ArrowUp';
        const incKey = isH ? 'ArrowRight' : 'ArrowDown';

        let handled = true;
        const nudge = e.shiftKey ? largeStep : step;
        const current = collapsed ? collapsedSize : sizes[0];

        if (e.key === decKey) {
          const next = clamp(current - nudge * rtlFactor, minSize, maxSize);
          if (collapsible && next <= minSize) {
            setCollapsed(true);
            commit([collapsedSize, 100 - collapsedSize]);
          } else {
            setCollapsed(false);
            commit([next, 100 - next]);
          }
        } else if (e.key === incKey) {
          const next = clamp(current + nudge * rtlFactor, minSize, maxSize);
          setCollapsed(false);
          commit([next, 100 - next]);
        } else if (e.key === 'Home') {
          setCollapsed(collapsible);
          commit([collapsible ? collapsedSize : minSize, 100 - (collapsible ? collapsedSize : minSize)]);
        } else if (e.key === 'End') {
          setCollapsed(false);
          commit([maxSize, 100 - maxSize]);
        } else if (e.key === 'Enter' && collapsible) {
          toggleCollapse();
        } else {
          handled = false;
        }

        if (handled) e.preventDefault();
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [orientation, sizes, step, largeStep, minSize, maxSize, collapsible, collapsedSize, collapsed, commit],
    );

    const toggleCollapse = React.useCallback(() => {
      if (!collapsible) return;
      if (collapsed) {
        const restore = Math.max(minSize, sizes[0] || minSize);
        setCollapsed(false);
        commit([restore, 100 - restore]);
      } else {
        setCollapsed(true);
        commit([collapsedSize, 100 - collapsedSize]);
      }
    }, [collapsible, collapsed, sizes, minSize, collapsedSize, commit]);

    const firstSize = collapsed ? collapsedSize : sizes[0];

    const isH = orientation === 'horizontal';
    const firstStyle: React.CSSProperties = isH
      ? { width: `${firstSize}%`, flexShrink: 0, overflow: 'hidden' }
      : { height: `${firstSize}%`, flexShrink: 0, overflow: 'hidden' };
    const secondStyle: React.CSSProperties = isH
      ? { flex: 1, overflow: 'hidden' }
      : { flex: 1, overflow: 'hidden' };

    const ctx: ResizableCtx = {
      orientation,
      sizes,
      minSize,
      maxSize,
      step,
      withHandle,
      largeStep,
      collapsible,
      collapsedSize,
      collapsed,
      handleLabel,
      firstPanelId,
      panelStyles: [firstStyle, secondStyle],
      groupRef,
      handlePointerDown,
      handleKeyDown,
      toggleCollapse,
    };

    // ── Compound-aware render ────────────────────────────────────────────────
    // Detect whether children are the compound form (ResizablePanel / ResizableHandle
    // elements) or the plain two-node tuple (raw divs, backward-compat).
    //
    // Compound form:
    //   <Resizable>
    //     <ResizablePanel>…</ResizablePanel>
    //     <ResizableHandle />
    //     <ResizablePanel>…</ResizablePanel>
    //   </Resizable>
    //
    // Tuple form (docs-page compat):
    //   <Resizable>{[ <div>…</div>, <div>…</div> ]}</Resizable>
    //
    // In compound form, ResizablePanel reads its sizing from context (by index).
    // The internal rz-panel wrappers are NOT rendered — ResizablePanel is the panel.
    // In tuple form, the legacy internal wrappers are used.
    const isCompound = (() => {
      // The compound form has ResizablePanel/ResizableHandle as direct children.
      // The tuple form has plain nodes (raw divs, etc.) at children[0]/children[1].
      // We detect by checking the displayName on the component type rather than
      // comparing to the const directly (avoids reference-before-init for const-hoisting).
      return React.Children.toArray(children as unknown as React.ReactNode[]).some(
        (c) => {
          if (!React.isValidElement(c)) return false;
          const typeName =
            (c.type as { displayName?: string })?.displayName;
          return typeName === 'ResizablePanel' || typeName === 'ResizableHandle';
        },
      );
    })();

    let renderedChildren: React.ReactNode;

    if (isCompound) {
      // Inject panelIndex into ResizablePanel children by scanning both slots.
      // children[0] = first panel node (ResizablePanel or fragment containing one)
      // children[1] = second panel node
      // The handle may be passed as children[0]'s sibling or as a separate child
      // between them — here we expect the 3-child compound form:
      //   <Resizable> <Panel/> <Handle/> <Panel/> </Resizable>
      // which means children is typed as [first, second] but in compound usage the
      // caller may pass a 3-element array. We accept both shapes.
      let panelIdx = 0;
      renderedChildren = React.Children.map(children as unknown as React.ReactNode[], (child) => {
        if (!React.isValidElement(child)) return child;
        const typeName = (child.type as { displayName?: string })?.displayName;
        if (typeName === 'ResizablePanel') {
          const idx = panelIdx++;
          const panelStyle = idx === 0 ? firstStyle : secondStyle;
          const id = idx === 0 ? firstPanelId : undefined;
          return React.cloneElement(
            child as React.ReactElement<ResizablePanelProps & { _panelIndex?: number; _panelStyle?: React.CSSProperties; id?: string }>,
            { _panelIndex: idx, _panelStyle: panelStyle, id },
          );
        }
        // ResizableHandle and other nodes — already read from context; pass through
        return child;
      });
    } else {
      // Legacy tuple form — use internal wrappers (original behavior)
      renderedChildren = (
        <>
          <div id={firstPanelId} className="rz-panel rz-panel-first" style={firstStyle}>
            {children[0]}
          </div>
          <ResizableHandle withHandle={withHandle} />
          <div className="rz-panel rz-panel-second" style={secondStyle}>
            {children[1]}
          </div>
        </>
      );
    }

    return (
      <ResizableContext.Provider value={ctx}>
        <div
          ref={(el) => {
            (groupRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            if (typeof ref === 'function') ref(el);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }}
          className={cn('rz-group', `rz-${orientation}`, className)}
          data-orientation={orientation}
          {...rest}
        >
          {renderedChildren}
        </div>
      </ResizableContext.Provider>
    );
  },
);
Resizable.displayName = 'Resizable';

// ═══════════════════════════════════════════════════════════════════════════
// ResizablePanel — a plain semantic div that consumers style
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A single panel inside a `<Resizable>` group. Renders as a plain `<div>`.
 * In compound form, `<Resizable>` injects sizing styles via `_panelStyle` and
 * the first-panel id via the HTML `id` prop — do not set these manually.
 * Size is fully controlled by `<Resizable>`; `className`/`style` can add visual treatment.
 *
 * Compound usage:
 * ```tsx
 * <Resizable orientation="horizontal" defaultSizes={[30, 70]}>
 *   <ResizablePanel>Files</ResizablePanel>
 *   <ResizableHandle />
 *   <ResizablePanel>Editor</ResizablePanel>
 * </Resizable>
 * ```
 */
export const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  ({ children, className, _panelIndex, _panelStyle, style, ...rest }, ref) => {
    const panelClass = _panelIndex === 0
      ? 'rz-panel rz-panel-first'
      : _panelIndex === 1
        ? 'rz-panel rz-panel-second'
        : 'rz-panel';
    return (
      <div
        ref={ref}
        className={cn(panelClass, className)}
        style={{ ..._panelStyle, ...style }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
ResizablePanel.displayName = 'ResizablePanel';

// ═══════════════════════════════════════════════════════════════════════════
// ResizableHandle — the interactive divider between two panels
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The drag handle between two panels. Must be a direct child of `<Resizable>`.
 * Renders a 10px hit zone with a 1px visible line. With `withHandle`, adds a
 * centred grip pill (the standard Forge affordance).
 *
 * Keyboard: ArrowLeft/Right (horizontal) or ArrowUp/Down (vertical) nudges by
 * `step`; Shift+Arrow nudges by `largeStep`; Home/End jump to min/max; Enter
 * toggles collapse when `collapsible` is set on the parent.
 */
export const ResizableHandle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
  ({ withHandle = true, className, ...rest }, ref) => {
    const ctx = useResizableCtx();
    const { orientation, sizes, minSize, maxSize, handleLabel, collapsed, firstPanelId, handlePointerDown, handleKeyDown } = ctx;
    const isH = orientation === 'horizontal';

    // The value we report to aria-valuenow is the first panel's size in percent.
    const valuenow = Math.round(collapsed ? ctx.collapsedSize : sizes[0]);

    return (
      <div
        ref={ref}
        role="separator"
        tabIndex={0}
        aria-orientation={orientation}
        aria-label={handleLabel}
        aria-valuenow={valuenow}
        aria-valuemin={minSize}
        aria-valuemax={maxSize}
        aria-controls={firstPanelId}
        className={cn(
          'rz-handle',
          isH ? 'rz-handle-h' : 'rz-handle-v',
          collapsed && 'rz-collapsed',
          className,
        )}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {/* 1px visible seam */}
        <div className="rz-seam" aria-hidden="true" />
        {/* Grip pill */}
        {withHandle && (
          <div className="rz-grip" aria-hidden="true">
            <Icons.gripVertical
              size={12}
              style={!isH ? { transform: 'rotate(90deg)' } : undefined}
            />
          </div>
        )}
      </div>
    );
  },
);
ResizableHandle.displayName = 'ResizableHandle';
