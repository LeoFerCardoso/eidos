'use client';
// Forge — the notifications inbox. The topbar bell is a compact preview; this
// is the full feed. One subject per tab, so NO card wraps it — just the list,
// running full-bleed inside the page content area. Each row carries more than
// the bell does: a detail line, a right-aligned time, and on-hover actions.
// Shares the data + <NotifRow> with the bell so the two never drift.
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

  const total = filterByTab(rows, 'all').length;
  const allUnread = unreadOf('all');
  const needAction = rows.filter((n) => n.kind === 'approval' && !n.archived).length;

  // Support line: lead with what's actionable, then the unread count. Real
  // numbers, plain sentences, no em-dash.
  const subtitle = (() => {
    const parts: string[] = [];
    if (needAction > 0) parts.push(`${needAction} approval${needAction > 1 ? 's' : ''} waiting on you`);
    if (allUnread > 0) parts.push(`${allUnread} unread of ${total}`);
    return parts.length ? `${parts.join('. ')}.` : "You're all caught up.";
  })();

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

          <div className="in-group fp-feed-search">
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
