import * as React from 'react';
import { Code } from '@/components/forge/code';
import { CopyButton } from '@/components/forge/copy-button';

const TabSwitch = ({ tabs, active, onSelect, ariaLabel }: {
  tabs: string[];
  active?: number;
  onSelect?: (i: number) => void;
  ariaLabel?: string;
}) => (
  <div className="ds-tabs" role="tablist" aria-label={ariaLabel}>
    {tabs.map((t, i) => (
      <button
        key={t}
        type="button"
        role="tab"
        aria-selected={i === active}
        tabIndex={i === active ? 0 : -1}
        className={'ds-tab' + (i === active ? ' active' : '')}
        onClick={() => onSelect?.(i)}
      >
        {t}
      </button>
    ))}
  </div>
);

const TabbedCode = ({ tabs, defaultIndex = 0, ariaLabel = 'package manager' }: {
  tabs: { label: string; code: string; lang?: string }[];
  defaultIndex?: number;
  ariaLabel?: string;
}) => {
  const [active, setActive] = React.useState(defaultIndex);
  const tab = tabs[active] || tabs[0];
  return (
    <div className="ds-frame ds-frame-codeonly">
      <div className="ds-frame-head ds-frame-head-tabs">
        <TabSwitch
          tabs={tabs.map(t => t.label)}
          active={active}
          onSelect={setActive}
          ariaLabel={ariaLabel}
        />
        <div className="actions">
          <CopyButton text={tab.code} />
        </div>
      </div>
      <Code lang={tab.lang || 'bash'}>{tab.code}</Code>
    </div>
  );
};

export { TabbedCode };
