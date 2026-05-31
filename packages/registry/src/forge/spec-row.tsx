import * as React from 'react';

const SpecRow = ({ token, value, usage }: {
  token?: React.ReactNode;
  value?: React.ReactNode;
  usage?: React.ReactNode;
}) => (
  <tr>
    <td className="tok-name">{token}</td>
    <td className="mono">{value}</td>
    <td>{usage}</td>
  </tr>
);

export { SpecRow };
