import * as React from 'react';

const AICaret = () => <span className="ai-caret" aria-hidden="true"/>;

const injectCaret = (node: React.ReactNode): React.ReactNode => {
  if (typeof node === 'string' || typeof node === 'number') {
    return <>{node}<AICaret key="__caret"/></>;
  }
  if (!React.isValidElement(node)) return node;
  const inner = React.Children.toArray((node.props as any).children);
  if (inner.length === 0) {
    return React.cloneElement(node, { key: node.key }, <AICaret key="__caret"/>);
  }
  const lastIdx = inner.length - 1;
  const next = [...inner.slice(0, lastIdx), injectCaret(inner[lastIdx])];
  return React.cloneElement(node, { key: node.key }, ...next);
};

const withStreamingCaret = (children: React.ReactNode): React.ReactNode[] => {
  const kids = React.Children.toArray(children);
  if (kids.length === 0) return [<AICaret key="__caret-empty"/>];
  const lastIdx = kids.length - 1;
  return [...kids.slice(0, lastIdx), injectCaret(kids[lastIdx])];
};

const Prose = ({
  streaming = false,
  as: Tag = 'div',
  className,
  children,
  ...rest
}: {
  streaming?: boolean;
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
  [x: string]: any;
}) => (
  <Tag
    className={'ai-prose' + (className ? ' ' + className : '')}
    {...(streaming ? { 'aria-live': 'polite', 'aria-busy': true } : {})}
    {...rest}
  >
    {streaming ? withStreamingCaret(children) : children}
  </Tag>
);

export { Prose };
