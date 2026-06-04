'use client';
// Forge — the dedicated notifications inbox. The topbar bell is a preview; this
// is the full feed. Follows the portal page standard (FPageHeader with live
// counts + actions → a toolbar of DS components → content → footer count) and
// composes only Eidos primitives (canonical Tabs, in-group search). Shares the
// data + <NotifRow> with the bell so the two never drift.
import * as React from 'react';
import { Icons, Tabs, TabsList, TabsTrigger, TabsContent } from '@/ds/core';
import { FPageHeader } from '@/portal/shell/portal-shell';
import { NotifRow } from '@/portal/notifications/notif-row';
import { NOTIFS, filterByTab, type Notif, type NotifTab } from '@/portal/data/notifications';

const TABS: [NotifTab, string][] = [
  ['all', 'All'],
  ['following', 'Following'],
  ['archive', 'Archive'],
];

function InboxList({ rows, onRead, emptyArchive }: { rows: Notif[]; onRead: (id: string) => void; emptyArchive: boolean }) {
  if (rows.length === 0) {
    return (
      <div className="fp-notif-empty">
        <Icons.inbox size={20} />
        <span>{emptyArchive ? 'Nothing archived yet.' : "You're all caught up."}</span>
      </div>
    );
  }
  return (
    <div className="fp-inbox-list">
      {rows.map((n) => <NotifRow key={n.id} n={n} variant="full" onRead={onRead} />)}
    </div>
  );
}

export default function NotificationsInboxPage() {
  const [tab, setTab] = React.useState<NotifTab>('all');
  const [query, setQuery] = React.useState('');
  const [read, setRead] = React.useState<Record<string, boolean>>({});

  const markRead = React.useCallback((id: string) => setRead((r) => (r[id] ? r : { ...r, [id]: true })), []);
  const markAll = () => setRead(Object.fromEntries(NOTIFS.map((n) => [n.id, true])));

  const rows = NOTIFS.map((n) => ({ ...n, unread: n.unread && !read[n.id] }));

  const search = React.useCallback(
    (list: Notif[]) => {
      const q = query.trim().toLowerCase();
      if (!q) return list;
      return list.filter((n) => [n.actor, n.action, n.target, n.context].filter(Boolean).join(' ').toLowerCase().includes(q));
    },
    [query],
  );

  const panelRows = (t: NotifTab) => search(filterByTab(rows, t));
  const unreadOf = (t: NotifTab) => filterByTab(rows, t).filter((n) => n.unread).length;

  const total = filterByTab(rows, 'all').length;
  const allUnread = unreadOf('all');
  const needAction = rows.filter((n) => n.kind === 'approval' && !n.archived).length;

  const subtitle = [
    `${total} notifications`,
    `${allUnread} unread`,
    needAction > 0 ? `${needAction} need action` : null,
  ].filter(Boolean).join(' · ');

  return (
    <>
      <FPageHeader
        eyebrow="Inbox"
        title="Notifications"
        subtitle={subtitle}
        actions={
          <>
            <button type="button" className="btn ghost">
              <Icons.settings size={13} /> Settings
            </button>
            <button type="button" className="btn ghost" onClick={markAll} disabled={!allUnread}>
              <Icons.check size={13} /> Mark all as read
            </button>
          </>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as NotifTab)}>
        <div className="fp-inbox-toolbar">
          <TabsList aria-label="Notification filter">
            {TABS.map(([id, label]) => {
              const c = unreadOf(id);
              return (
                <TabsTrigger key={id} value={id}>
                  {label}
                  {c > 0 && <span className="count">{c}</span>}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="in-group fp-inbox-search">
            <span className="in-addon icon">
              <Icons.search size={13} />
            </span>
            <input
              className="in-control"
              placeholder="Search notifications…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search notifications"
            />
          </div>
        </div>

        {TABS.map(([id]) => {
          const list = panelRows(id);
          return (
            <TabsContent key={id} value={id}>
              <div className="fp-inbox">
                <InboxList rows={list} onRead={markRead} emptyArchive={id === 'archive'} />
              </div>
              {list.length > 0 && (
                <div className="fp-inbox-foot">
                  {list.length} {list.length === 1 ? 'notification' : 'notifications'}
                  {query.trim() && ` matching “${query.trim()}”`}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </>
  );
}
