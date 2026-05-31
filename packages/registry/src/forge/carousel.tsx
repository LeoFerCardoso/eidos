import * as React from 'react';
import type { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Embla options — align, loop, slidesToScroll, etc. `direction` is set
   *  automatically from the nearest `[dir]` ancestor. */
  opts?: Omit<EmblaOptionsType, 'direction'>;
  /**
   * hero: each slide fills the carousel width (16:7 aspect ratio).
   * default: slides are sized by the content / slide's className.
   */
  variant?: 'default' | 'hero';
  /** Scroll axis. */
  orientation?: 'horizontal' | 'vertical';
  /** Expose the raw Embla API for external control. */
  setApi?: (api: EmblaCarouselType) => void;
  /**
   * Autoplay interval in ms. Pass a positive number to enable.
   * Automatically disabled under prefers-reduced-motion.
   * Pauses on pointer enter and focus-within.
   */
  autoplayInterval?: number;
  /** Accessible label for the carousel region (aria-label). */
  label?: string;
  children?: React.ReactNode;
  className?: string;
}

interface CarouselCtx {
  embla: EmblaCarouselType | undefined;
  slideCount: number;
  currentIndex: number;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  orientation: 'horizontal' | 'vertical';
  variant: 'default' | 'hero';
}

const CarouselContext = React.createContext<CarouselCtx | null>(null);

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      opts,
      variant = 'default',
      orientation = 'horizontal',
      setApi,
      autoplayInterval,
      label = 'Carousel',
      children,
      className,
      onKeyDown,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    // ── Detect nearest [dir] attribute ────────────────────────────────────
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const combinedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    const [rtl, setRtl] = React.useState(false);
    React.useEffect(() => {
      const node = rootRef.current;
      if (!node) return;
      const dir = window.getComputedStyle(node).direction;
      setRtl(dir === 'rtl');
    }, []);

    // ── Embla setup ───────────────────────────────────────────────────────
    const axis = orientation === 'vertical' ? 'y' : 'x';
    const emblaOpts: EmblaOptionsType = {
      axis,
      direction: rtl ? 'rtl' : 'ltr',
      ...opts,
    };

    const [emblaRef, emblaApi] = useEmblaCarousel(emblaOpts);

    // Re-init when RTL changes (embla direction is not hot-swappable).
    React.useEffect(() => {
      if (!emblaApi) return;
      emblaApi.reInit({ direction: rtl ? 'rtl' : 'ltr', ...opts });
    }, [rtl]); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
      if (emblaApi && setApi) setApi(emblaApi);
    }, [emblaApi, setApi]);

    // ── State synced to embla events ──────────────────────────────────────
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [slideCount, setSlideCount] = React.useState(0);

    const syncState = React.useCallback(() => {
      if (!emblaApi) return;
      setCurrentIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      setSlideCount(emblaApi.scrollSnapList().length);
    }, [emblaApi]);

    React.useEffect(() => {
      if (!emblaApi) return;
      syncState();
      emblaApi.on('select', syncState);
      emblaApi.on('reInit', syncState);
      return () => {
        emblaApi.off('select', syncState);
        emblaApi.off('reInit', syncState);
      };
    }, [emblaApi, syncState]);

    // ── Navigation ────────────────────────────────────────────────────────
    const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = React.useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

    // ── Keyboard on region ────────────────────────────────────────────────
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const isHoriz = orientation === 'horizontal';
        const prevKey = isHoriz ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
        const nextKey = isHoriz ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
        if (e.key === prevKey) { e.preventDefault(); scrollPrev(); }
        else if (e.key === nextKey) { e.preventDefault(); scrollNext(); }
        else if (e.key === 'Escape') (e.currentTarget as HTMLElement).blur();
        onKeyDown?.(e);
      },
      [orientation, rtl, scrollPrev, scrollNext, onKeyDown],
    );

    // ── Autoplay ──────────────────────────────────────────────────────────
    const paused = React.useRef(false);
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    // Respect prefers-reduced-motion — component-scoped, not global.
    const motionOk = React.useMemo(() => {
      if (typeof window === 'undefined') return true;
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, []);

    const effectiveInterval = motionOk && autoplayInterval && autoplayInterval > 0
      ? autoplayInterval
      : 0;

    React.useEffect(() => {
      if (!effectiveInterval || !emblaApi) return;
      const tick = () => {
        if (paused.current) return;
        emblaApi.canScrollNext() ? emblaApi.scrollNext() : emblaApi.scrollTo(0);
        timerRef.current = setTimeout(tick, effectiveInterval);
      };
      timerRef.current = setTimeout(tick, effectiveInterval);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [effectiveInterval, emblaApi]);

    const pauseAutoplay = () => { paused.current = true; };
    const resumeAutoplay = () => { paused.current = false; };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      pauseAutoplay();
      onMouseEnter?.(e);
    };
    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      resumeAutoplay();
      onMouseLeave?.(e);
    };
    const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
      pauseAutoplay();
      onFocus?.(e);
    };
    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) resumeAutoplay();
      onBlur?.(e);
    };

    // ── Context value ─────────────────────────────────────────────────────
    const ctx: CarouselCtx = {
      embla: emblaApi,
      slideCount,
      currentIndex,
      canScrollPrev,
      canScrollNext,
      scrollPrev,
      scrollNext,
      scrollTo,
      orientation,
      variant,
    };

    // ── Separate slides from controls ────────────────────────────────────
    // CarouselPrev, CarouselNext, CarouselControls and CarouselDots must sit
    // OUTSIDE the viewport (which has overflow:hidden) so their absolute
    // positioning and box-shadows are not clipped. We identify them by the
    // displayName of their type (set on each control component below).
    const CONTROL_NAMES = new Set([
      'CarouselPrev', 'CarouselNext', 'CarouselDots', 'CarouselControls',
    ]);
    const slideChildren: React.ReactNode[] = [];
    const controlChildren: React.ReactNode[] = [];
    React.Children.forEach(children, (child) => {
      if (
        React.isValidElement(child) &&
        typeof child.type !== 'string' &&
        CONTROL_NAMES.has((child.type as { displayName?: string }).displayName ?? '')
      ) {
        controlChildren.push(child);
      } else {
        slideChildren.push(child);
      }
    });

    return (
      <CarouselContext.Provider value={ctx}>
        <div
          ref={combinedRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={label}
          className={cn('carx', variant === 'hero' && 'carx-hero', className)}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        >
          {/* Viewport — embla mounts onto this element */}
          <div ref={emblaRef} className={cn('carx-viewport', orientation === 'vertical' && 'carx-vp-vert')}>
            <div className={cn(
              'carx-track',
              orientation === 'vertical' && 'carx-track-vert',
            )}>
              {slideChildren}
            </div>
          </div>
          {/* Controls (prev/next arrows, dots) rendered outside the viewport
              so overflow:hidden on the viewport does not clip them */}
          {controlChildren}
        </div>
      </CarouselContext.Provider>
    );
  },
);

export { Carousel };
