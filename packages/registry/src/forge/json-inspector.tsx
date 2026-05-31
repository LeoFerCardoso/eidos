import * as React from 'react';

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

const renderValue = (v, path, expanded, toggle, depth) => {
  if (v === null) return <span className="json-null">null</span>;
  if (typeof v === 'string') return <span className="json-str">"{v}"</span>;
  if (typeof v === 'number') return <span className="json-num">{String(v)}</span>;
  if (typeof v === 'boolean') return <span className="json-bool">{String(v)}</span>;
  if (Array.isArray(v)) {
    const open = expanded[path] !== false;
    if (v.length === 0) return <span className="json-bracket">[]</span>;
    return (
      <>
        <button type="button" className="json-toggle" onClick={() => toggle(path)} aria-expanded={open}>
          <span className="json-bracket">{open ? '[' : `[ … ${v.length} ]`}</span>
        </button>
        {open && (
          <ul className="json-list">
            {v.map((item, i) => (
              <li key={i}><span className="json-key">{i}:</span> {renderValue(item, path + '.' + i, expanded, toggle, depth + 1)}</li>
            ))}
          </ul>
        )}
        {open && <span className="json-bracket">]</span>}
      </>
    );
  }
  if (isObj(v)) {
    const keys = Object.keys(v);
    const open = expanded[path] !== false;
    if (keys.length === 0) return <span className="json-bracket">{'{}'}</span>;
    return (
      <>
        <button type="button" className="json-toggle" onClick={() => toggle(path)} aria-expanded={open}>
          <span className="json-bracket">{open ? '{' : `{ … ${keys.length} }`}</span>
        </button>
        {open && (
          <ul className="json-list">
            {keys.map(k => (
              <li key={k}><span className="json-key">"{k}":</span> {renderValue(v[k], path + '.' + k, expanded, toggle, depth + 1)}</li>
            ))}
          </ul>
        )}
        {open && <span className="json-bracket">{'}'}</span>}
      </>
    );
  }
  return <span>{String(v)}</span>;
};

const JSONInspector = ({ data, defaultCollapsedPaths = [] }: {
  /** JSON-serializable value to render (object, array, or primitive). */
  data?: any;
  /** Paths that start collapsed. Syntax: $.deploy.rings — use to hide verbose branches on load. */
  defaultCollapsedPaths?: string[];
}) => {
  const init = React.useMemo(() => {
    const o = {}; defaultCollapsedPaths.forEach(p => { o[p] = false; }); return o;
  }, [defaultCollapsedPaths.join('|')]);
  const [expanded, setExpanded] = React.useState(init);
  const toggle = (p) => setExpanded(prev => ({ ...prev, [p]: !(prev[p] !== false) }));
  return (
    <div className="json-inspector">
      {renderValue(data, '$', expanded, toggle, 0)}
    </div>
  );
};

export { JSONInspector };
