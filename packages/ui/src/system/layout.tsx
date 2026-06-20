import * as React from 'react';
import { Box, type BoxProps } from './box';

/** Default-applying preset over {@link Box}; explicit props still win. */
function preset(displayName: string, defaults: Partial<BoxProps>) {
  const C = React.forwardRef<HTMLElement, BoxProps>(function Preset(props, ref) {
    return <Box ref={ref} {...defaults} {...props} />;
  });
  C.displayName = displayName;
  return C;
}

/** Vertical flex column. `gap` spaces children; `as` sets semantics (`ul`, `section`…). */
export const Stack = preset('Stack', { display: 'flex', direction: 'col' });

/** Horizontal flex row, vertically centered by default. */
export const Inline = preset('Inline', { display: 'flex', direction: 'row', align: 'center' });

/** CSS grid. Set `columns` (1–12) and `gap`. */
export const Grid = preset('Grid', { display: 'grid' });

/** Flex container that centers its children on both axes. */
export const Center = preset('Center', { display: 'flex', align: 'center', justify: 'center' });
