import * as React from 'react';
import { Icons } from '@/components/forge/icons';

interface EmptyProps {
  /** Size variant. sm = inline/table, md = page section, lg = hero. */
  size?: 'sm' | 'md' | 'lg';
  /** Apply the ember accent tint to the icon tile. */
  accent?: boolean;
  /** Apply the dotted background pattern to the frame body. */
  dotted?: boolean;
  /** Quiet illustrative cue (an icon, not an emoji). Renders inside a tile. */
  icon?: React.ReactNode;
  /** Icon name keyed into the global Icons map. Used when passing a ReactNode is inconvenient. */
  iconName?: string;
  /** One-line heading. State what is missing — "No projects yet". */
  title?: React.ReactNode;
  /** Short sentence explaining the state and pointing the user to the next step. */
  desc?: React.ReactNode;
  /** Primary action. Pass a ReactNode (Button) or a string for a default ember button. */
  action?: React.ReactNode | string;
  /** Optional secondary action. Pass a ReactNode or a string for a default ghost button. */
  secondary?: React.ReactNode | string;
  /** Extra content rendered below the actions row — suggestion chips, etc. */
  children?: React.ReactNode;
}

const Empty = ({
  size,
  accent,
  dotted,
  icon,
  iconName,
  title,
  desc,
  action,
  secondary,
  children,
}: EmptyProps) => {
  const sz = size || 'md';
  const cls = ['empty', sz];
  if (accent) cls.push('accent');
  if (dotted) cls.push('dotted');

  let iconNode = icon;
  if (!iconNode && iconName && Icons && Icons[iconName]) {
    const I = Icons[iconName];
    iconNode = <I size={sz === 'lg' ? 22 : sz === 'sm' ? 16 : 18}/>;
  }

  return (
    <div className={cls.join(' ')} role="status">
      {iconNode && <div className="empty-icon">{iconNode}</div>}
      <div className="empty-text">
        {title && <div className="empty-title">{title}</div>}
        {desc && <div className="empty-desc">{desc}</div>}
      </div>
      {(action || secondary) && (
        <div className="empty-actions">
          {secondary && (typeof secondary === 'string'
            ? <button className="btn ghost">{secondary}</button>
            : secondary)}
          {action && (typeof action === 'string'
            ? <button className="btn ember">{action}</button>
            : action)}
        </div>
      )}
      {children}
    </div>
  );
};

export { Empty };
