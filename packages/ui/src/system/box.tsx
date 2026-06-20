import * as React from 'react';
import { cx } from './cx';
import type {
  SpaceToken, RadiusToken, BackgroundToken, BorderToken, TextToken,
  Display, Direction, Align, Justify, Wrap, Size, FlexValue, GridColumns,
} from './tokens.gen';

/**
 * Style props for {@link Box}. Every value is a design-token union — there is no
 * `string` escape hatch, so a value outside the system does not type-check. This is
 * the core of the LLM-safe contract: the only expressible words are the correct ones.
 *
 * Spacing uses LOGICAL axes (RTL-first): `pt`/`pb` are the block axis,
 * `ps`/`pe` the inline start/end.
 */
export interface BoxStyleProps {
  /** padding (all sides) */ p?: SpaceToken;
  /** padding inline (←→) */ px?: SpaceToken;
  /** padding block (↑↓) */ py?: SpaceToken;
  /** padding block-start */ pt?: SpaceToken;
  /** padding block-end */ pb?: SpaceToken;
  /** padding inline-start */ ps?: SpaceToken;
  /** padding inline-end */ pe?: SpaceToken;
  gap?: SpaceToken;
  gapX?: SpaceToken;
  gapY?: SpaceToken;
  radius?: RadiusToken;
  /** background-color (token only) */ background?: BackgroundToken;
  /** 1px solid border in the given token color */ borderColor?: BorderToken;
  /** foreground/text color (token only) */ color?: TextToken;
  display?: Display;
  direction?: Direction;
  align?: Align;
  justify?: Justify;
  wrap?: Wrap;
  flex?: FlexValue;
  /** grid-template-columns: repeat(n, 1fr) */ columns?: GridColumns;
  width?: Size;
  height?: Size;
}

const SPACE_CLASS: Record<keyof Pick<BoxStyleProps, 'p' | 'px' | 'py' | 'pt' | 'pb' | 'ps' | 'pe'>, string> = {
  p: 'p', px: 'px', py: 'py', pt: 'pt', pb: 'pb', ps: 'ps', pe: 'pe',
};

/** Translate the typed style props into the generated atomic class names. */
function styleClasses(p: BoxStyleProps): string {
  return cx(
    p.p && `eb-p-${p.p}`,
    p.px && `eb-px-${p.px}`,
    p.py && `eb-py-${p.py}`,
    p.pt && `eb-pt-${p.pt}`,
    p.pb && `eb-pb-${p.pb}`,
    p.ps && `eb-ps-${p.ps}`,
    p.pe && `eb-pe-${p.pe}`,
    p.gap && `eb-gap-${p.gap}`,
    p.gapX && `eb-gap-x-${p.gapX}`,
    p.gapY && `eb-gap-y-${p.gapY}`,
    p.radius && `eb-r-${p.radius}`,
    p.background && `eb-bg-${p.background}`,
    p.borderColor && `eb-bd-${p.borderColor}`,
    p.color && `eb-fg-${p.color}`,
    p.display && `eb-d-${p.display}`,
    p.direction && `eb-fd-${p.direction}`,
    p.align && `eb-ai-${p.align}`,
    p.justify && `eb-jc-${p.justify}`,
    p.wrap && `eb-fw-${p.wrap}`,
    p.flex && `eb-flex-${p.flex}`,
    p.columns && `eb-gc-${p.columns}`,
    p.width && `eb-w-${p.width}`,
    p.height && `eb-h-${p.height}`,
  );
}

const STYLE_KEYS: ReadonlyArray<keyof BoxStyleProps> = [
  ...Object.keys(SPACE_CLASS) as (keyof BoxStyleProps)[],
  'gap', 'gapX', 'gapY', 'radius', 'background', 'borderColor', 'color',
  'display', 'direction', 'align', 'justify', 'wrap', 'flex', 'columns', 'width', 'height',
];

/**
 * Passthrough DOM attributes Box forwards to the rendered element. Crucially this
 * OMITS `style` and `className` — the two open string surfaces an LLM reaches for.
 * Semantics come from `as`; styling comes only from the typed props above.
 */
type DomProps = Omit<React.HTMLAttributes<HTMLElement>, 'style' | 'className' | 'color'>;

export interface BoxProps extends BoxStyleProps, DomProps {
  /** The semantic element to render (`nav`, `ul`, `li`, `header`, …). Defaults to `div`. */
  as?: React.ElementType;
  children?: React.ReactNode;
}

/**
 * The one layout primitive. Renders a chosen semantic element (`as`) styled solely
 * through typed design-token props. There is no `className`/`style` prop, so off-system
 * values are not expressible. Compose semantics with `as`:
 *
 * ```tsx
 * <Box as="nav" display="flex" align="center" gap="3" px="4">…</Box>
 * <Box as="ul" display="flex" direction="col" gap="2"><Box as="li">…</Box></Box>
 * ```
 */
export const Box = React.forwardRef<HTMLElement, BoxProps>(function Box(props, ref) {
  const { as, children, ...rest } = props;
  const style: BoxStyleProps = {};
  const dom: Record<string, unknown> = {};
  for (const key of Object.keys(rest) as (keyof typeof rest)[]) {
    if ((STYLE_KEYS as readonly string[]).includes(key as string)) (style as Record<string, unknown>)[key as string] = rest[key];
    else dom[key as string] = rest[key];
  }
  const Comp = (as ?? 'div') as React.ElementType;
  return (
    <Comp ref={ref} className={styleClasses(style)} {...dom}>
      {children}
    </Comp>
  );
});
