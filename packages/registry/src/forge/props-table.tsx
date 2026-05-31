import * as React from 'react';

const PropsTable = ({ rows, label = 'props' }: {
  rows: { prop: string; type?: string; default?: string; required?: boolean; description?: React.ReactNode }[];
  label?: string;
}) => (
  <div className="ds-frame ds-props-frame">
    <div className="ds-frame-head">
      <span className="label">{label}</span>
    </div>
    <div className="ds-props-wrap">
      <table className="ds-props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.prop + ':' + i}>
              <td className="prop">
                <code>{r.prop}</code>
                {r.required && <span className="req" aria-label="required">*</span>}
              </td>
              <td className="type"><code>{r.type}</code></td>
              <td className="default">
                {r.default
                  ? <code>{r.default}</code>
                  : <span className="dim">—</span>}
              </td>
              <td className="desc">{r.description || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export { PropsTable };
