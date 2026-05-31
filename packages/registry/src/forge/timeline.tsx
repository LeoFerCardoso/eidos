import * as React from 'react';
import { Avatar } from '@/components/forge/avatar';
import { Icons } from '@/components/forge/icons';
import { RelativeTime } from '@/components/forge/relative-time';

type TimelineItem = {
  id?: string;
  title?: React.ReactNode;
  meta?: React.ReactNode;
  at?: string | number | Date;
  person?: { name: string; initials: string; role?: string };
  icon?: string;
  tone?: string;
  current?: boolean;
  done?: boolean;
  children?: React.ReactNode;
};

const Timeline = ({ items = [], compact = false }: {
  /** Ordered event items — each: { id, title, meta?, at?, person?, icon?, tone?, children?, current?, done? }. */
  items?: TimelineItem[];
  /** Tighten density for sidesheets, drawers. */
  compact?: boolean;
}) => {
  return (
    <ol className={'timeline tl-v' + (compact ? ' compact' : '')}>
      {items.map((it, i) => {
        const Icon = it.icon && Icons[it.icon];
        const isCurrent = !!it.current;
        const isDone = !!it.done;
        const cls = ['tl-item'];
        if (isCurrent) cls.push('is-current');
        if (isDone) cls.push('is-done');
        return (
          <li key={it.id || i} className={cls.join(' ')}>
            <span className={'tl-pin ' + (it.tone || 'default')} aria-hidden="true">
              {isCurrent && <span className="tl-halo" aria-hidden="true"/>}
              {it.person ? <Avatar p={it.person} size={22}/> :
               Icon ? <Icon size={11}/> :
               <span className="tl-dot"/>}
            </span>
            <div className="tl-body">
              <div className="tl-row">
                <span className="tl-title">{it.title}</span>
                {it.at && <RelativeTime value={it.at}/>}
              </div>
              {it.meta && <div className="tl-meta">{it.meta}</div>}
              {it.children && <div className="tl-child">{it.children}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export { Timeline };
