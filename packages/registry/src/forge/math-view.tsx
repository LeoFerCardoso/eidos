import * as React from 'react';

const MathView = ({
  display = false,
  html,
  children,
  className,
  style,
  ...rest
}: {
  /** Block display mode — renders as div, centered, with displayMode spacing. Match with KaTeX renderToString({ displayMode: true }). */
  display?: boolean;
  /** Pre-rendered KaTeX HTML string from renderToString(). When provided, set via dangerouslySetInnerHTML. */
  html?: string;
  /** Fallback slot when html is not provided — render plain text math or a Skeleton here. */
  children?: React.ReactNode;
  /** Appended to .ai-math (and .block when display=true). */
  className?: string;
  /** Inline styles on the wrapper element. */
  style?: React.CSSProperties;
  [x: string]: any;
}) => {
  const cls = 'ai-math' + (display ? ' block' : '') + (className ? ' ' + className : '');
  const Tag = display ? 'div' : 'span';
  if (html != null) {
    return <Tag className={cls} style={style} role="math" {...rest} dangerouslySetInnerHTML={{ __html: html }}/>;
  }
  return <Tag className={cls} style={style} role="math" {...rest}>{children}</Tag>;
};

export { MathView };
