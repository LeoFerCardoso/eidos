import * as React from 'react';

const Diagram = ({
  caption,
  children,
  className,
  style,
}: {
  caption?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <figure className={'ai-diagram' + (className ? ' ' + className : '')} style={style}>
    {children}
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
);

export { Diagram };
