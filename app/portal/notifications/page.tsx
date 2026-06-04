'use client';
// Forge — the dedicated notifications inbox. The topbar bell is a preview; this
// is where the full feed lives (tabs · mark-all · every row). Shares the data
// and the <NotifRow> component with the bell so the two never drift.
import * as React from 'react';
import { Icons } from '@/ds/core';
import { FPageHeader } from '@/portal/shell/portal-shell';
import { NotifRow } from '@/portal/notifications/notif-row';
import { NOTIFS, filterByTab, type NotifTab } from '@/portal/data/notifications';

const TABS: [NotifTab, string][] = [
  ['all', 'All'],
  ['following', 'Following'],
  ['archive', 'Archive'],
];

export default function NotificationsInboxPage() {
  const [tab, setTab] = React.useState<NotifTab>('all');
  const [read, setRead] = React.useState<Record<string, boolean>>({});

  const markRead = React.useCallback((id: string) => setRead((r) => (r[id] ? r : { ...r, [id]: true })), []);
  const markAll = () => setRead(Object.fromEntries(NOTIFS.map((n) => [n.id, true])));

  const rows = NOTIFS.map((n) => ({ ...n, unread: n.unread && !read[n.id] }));
  const filtered = filterByTab(rows, tab);

  const count = (t: NotifTab) => filterByTab(rows, t).filter((n) => n.unread).length;
  const allUnread = count('all');

  return (
    <>
      <FPageHeader
        eyebrow="Inbox"
        title="Notifications"
        subtitle="Everything across your estate — deploys, incidents, reviews and approvals."
        actions={
          <button type="button" className="btn ghost sm" onClick={markAll} disabled={!allUnread}>
            <Icons.check size={14} /> Mark all as read
          </button>
        }
      />

      <div className="fp-inbox">
        <div className="fp-notif-tabs" role="tablist" aria-label="Notification filter">
          {TABS.map(([id, label]) => {
            const c = count(id);
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                className={`fp-notif-tab${tab === id ? ' is-active' : ''}`}
                onClick={() => setTab(id)}
              >
                {label}
                {c > 0 && <span className="fp-notif-count">{c}</span>}
              </button>
            );
          })}
          <button type="button" className="fp-notif-gear" aria-label="Notification settings">
            <Icons.settings size={14} />
          </button>
        </div>

        <div className="fp-inbox-list">
          {filtered.length === 0 ? (
            <div className="fp-notif-empty">
              <Icons.inbox size={20} />
              <span>{tab === 'archive' ? 'Nothing archived yet.' : "You're all caught up."}</span>
            </div>
          ) : (
            filtered.map((n) => <NotifRow key={n.id} n={n} onRead={markRead} />)
          )}
        </div>
      </div>
    </>
  );
}
