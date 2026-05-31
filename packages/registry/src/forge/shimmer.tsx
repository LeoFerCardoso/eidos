import * as React from 'react';

const Shimmer = ({
  children = 'Thinking…',
  className,
  style,
}: {
  /** The text label behind the gradient sweep. Keep under 4 words, end with "…". */
  children?: React.ReactNode;
  /** Additional className appended to .ai-shimmer. Use to adjust font-size or color — not the animation. */
  className?: string;
  /** Inline style override. Avoid overriding animation-related properties — use the class instead. */
  style?: React.CSSProperties;
}) => (
  <span className={'ai-shimmer' + (className ? ' ' + className : '')} style={style} aria-live="polite">
    {children}
  </span>
);

export { Shimmer };
