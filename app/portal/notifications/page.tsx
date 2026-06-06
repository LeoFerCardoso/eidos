'use client';
// Forge — the notifications inbox. The topbar bell is a compact preview; this
// is the full feed. One subject per tab, so NO card wraps it — just the list,
// running full-bleed inside the page content area. Each row carries more than
// the bell does: a detail line, a right-aligned time, and on-hover actions.
// Shares the data + <NotifRow> with the bell so the two never drift.
import * as React from 'react';
import { Button, Icons, Tabs, TabsList, TabsTrigger, TabsContent } from '@/ds/core';
import { FPageHeader, FSearch } from '@/portal/shell/portal-shell';
import { NotifRow } from '@/portal/notifications/notif-row';
import { NOTIFS, filterByTab, type Notif, type NotifTab } from '@/portal/data/notifications';

const TABS: [NotifTab, string][] = [
  ['all', 'All'],
  ['following', 'Following'],
  ['archive', 'Archive'],
];

function Feed({
  rows,
  onRead,
  onArchive,
  empty,
}: {
  rows: Notif[];
  onRead: (id: string) => void;
  onArchive?: (id: string) => void;
  empty: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="fp-feed-empty">
        <Icons.inbox size={20} />
        <span>{empty}</span>
      </div>
    );
  }
  return (
    <div className="fp-feed">
      {rows.map((n) => <NotifRow key={n.id} n={n} variant="full" onRead={onRead} onArchive={onArchive} />)}
    </div>
  );
}

export default function NotificationsInboxPage() {
  const [tab, setTab] = React.useState<NotifTab>('all');
  const [query, setQuery] = React.useState('');
  const [read, setRead] = React.useState<Record<string, boolean>>({});
  const [archived, setArchived] = React.useState<Record<string, boolean>>({});

  const markRead = React.useCallback((id: string) => setRead((r) => (r[id] ? r : { ...r, [id]: true })), []);
  const markAll = () => setRead(Object.fromEntries(NOTIFS.map((n) => [n.id, true])));
  const archive = React.useCallback((id: string) => {
    setArchived((a) => ({ ...a, [id]: true }));
    setRead((r) => (r[id] ? r : { ...r, [id]: true }));
  }, []);

  const rows = NOTIFS.map((n) => ({
    ...n,
    unread: n.unread && !read[n.id],
    archived: n.archived || archived[n.id],
  }));

  const search = React.useCallback(
    (list: Notif[]) => {
      const q = query.trim().toLowerCase();
      if (!q) return list;
      return list.filter((n) =>
        [n.actor, n.action, n.target, n.context, n.body].filter(Boolean).join(' ').toLowerCase().includes(q),
      );
    },
    [query],
  );

  const panelRows = (t: NotifTab) => search(filterByTab(rows, t));
  const unreadOf = (t: NotifTab) => filterByTab(rows, t).filter((n) => n.unread).length;
  const allUnread = unreadOf('all');

  return (
    <>
      <FPageHeader
        eyebrow="Inbox"
        title="Notifications"
        subtitle="Deploys, reviews, incidents and approvals from the services you own."
        actions={
          <>
            <Button type="button" variant="ghost">
              <Icons.settings size={13} /> Settings
            </Button>
            <Button type="button" variant="ghost" onClick={markAll} disabled={!allUnread}>
              <Icons.check size={13} /> Mark all as read
            </Button>
          </>
        }
      />

      <Tabs className="fp-feed-tabs" value={tab} onValueChange={(v) => setTab(v as NotifTab)}>
        <div className="fp-feed-bar">
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

          <FSearch
            value={query}
            onChange={setQuery}
            placeholder="Search notifications…"
            aria-label="Search notifications"
            className="fp-feed-search"
          />
        </div>

        {TABS.map(([id]) => (
          <TabsContent key={id} value={id}>
            <Feed
              rows={panelRows(id)}
              onRead={markRead}
              onArchive={id === 'archive' ? undefined : archive}
              empty={
                id === 'archive'
                  ? 'Nothing archived yet.'
                  : query.trim()
                    ? `No notifications matching “${query.trim()}”.`
                    : "You're all caught up."
              }
            />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
