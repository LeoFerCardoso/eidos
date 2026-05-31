import * as React from 'react';
import { Icons } from '@/components/forge/icons';

type SimplePaginationProps = {
  total?: number;
  current?: number;
  onChange?: (page: number) => void;
};

const SimplePagination = (props: SimplePaginationProps) => {
  const total = props.total || 1;
  const current = props.current || 1;
  const onChange = props.onChange || (() => {});
  return (
    <div className="pg">
      <button className="pg-btn outline" disabled={current === 1} onClick={() => onChange(current - 1)}>
        <Icons.chevronLeft size={14} className="ico-prev"/>
        <span>Previous</span>
      </button>
      <span className="pg-ellipsis" style={{font:'400 12px/1 var(--font-mono)', color:'var(--fg-faint)', minWidth: 100}}>
        Page {current} of {total}
      </span>
      <button className="pg-btn outline" disabled={current === total} onClick={() => onChange(current + 1)}>
        <span>Next</span>
        <Icons.chevronRight size={14} className="ico-next"/>
      </button>
    </div>
  );
};

export { SimplePagination };
