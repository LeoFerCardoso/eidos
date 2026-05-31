import * as React from 'react';

const ToolOutput = ({
  label = 'Output',
  children,
  meta,
}: {
  /** Section label. Switch to "Error" when state = output-error. */
  label?: string;
  /** Rendered result. Use Forge primitives — Table, Code, plain prose, error card. */
  children?: React.ReactNode;
  /** Right-aligned meta — row count, HTTP status, etc. */
  meta?: string;
}) => (
  <div className="tool-section">
    <div className="tool-section-label">
      <span>{label}</span>
      {meta && <span className="meta">{meta}</span>}
    </div>
    {children}
  </div>
);

export { ToolOutput };
