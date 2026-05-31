import * as React from 'react';

const slugifyHeading = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const SubHead = ({ children, meta }: { children?: React.ReactNode; meta?: string }) => {
  const id = typeof children === 'string' ? 'sec-' + slugifyHeading(children) : undefined;
  return (
    <h2 className="ds-sub" id={id} data-toc={typeof children === 'string' ? children : undefined}>
      <span className="ds-sub-text">{children}</span>
      {meta && <span className="meta">{meta}</span>}
      {id && <a className="ds-sub-anchor" href={'#' + id} aria-label="Link to this section">#</a>}
    </h2>
  );
};

export { SubHead };
