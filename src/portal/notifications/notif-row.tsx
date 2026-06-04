'use client';
// One notification row — shared by the topbar bell preview and the
// /portal/notifications inbox. Resolves the avatar policy (photo · ember-system
// · initials · anonymous silhouette) and the optional approval / file affordances.
//
// variant:
//   'compact' (bell)  — time sits inline in the meta line; tight popover width.
//   'full'    (inbox) — time is pulled to a right-aligned column so the wider
//                       page row uses its width like a real inbox.
import * as React from 'react';
import { Avatar, Icons } from '@/ds/core';
import type { Notif } from '@/portal/data/notifications';

export function NotifRow({
  n,
  onRead,
  variant = 'compact',
}: {
  n: Notif;
  onRead?: (id: string) => void;
  variant?: 'compact' | 'full';
}) {
  const SysIcon = n.system ? (Icons as Record<string, React.FC<{ size?: number }>>)[n.system] : null;
  const full = variant === 'full';
  return (
    <div
      className={`fp-notif-row${full ? ' fp-notif-row--full' : ''}${n.unread ? ' unread' : ''}`}
      onMouseEnter={() => n.unread && onRead?.(n.id)}
    >
      <Avatar
        name={n.actor}
        size={36}
        src={n.src}
        ember={!!n.system}
        status={n.system ? undefined : n.status}
      >
        {SysIcon ? <SysIcon size={16} /> : (n.anonymous ? <Icons.user size={16} /> : undefined)}
      </Avatar>
      {/* on-accent-soft re-maps the muted/faint text tiers to legible in-hue ember
          on the unread (--ember-soft) band — the neutral greys lose contrast on the
          warm wash. Scoped to the text block so the neutral-surface avatar is unaffected. */}
      <div className={`fp-notif-main${n.unread ? ' on-accent-soft' : ''}`}>
        <p className="fp-notif-text">
          <strong>{n.actor}</strong> {n.action}
          {n.target ? <> {n.target}</> : null}
        </p>
        <p className="fp-notif-meta">
          {!full && (
            <>
              <span>{n.time}</span>
              <span className="fp-notif-sep">·</span>
            </>
          )}
          <span>{n.context}</span>
        </p>

        {n.kind === 'approval' && (
          <div className="fp-notif-cta">
            <button className="btn ember sm" type="button" onClick={() => onRead?.(n.id)}>Approve</button>
            <button className="btn ghost sm" type="button" onClick={() => onRead?.(n.id)}>Decline</button>
          </div>
        )}

        {n.kind === 'file' && n.file && (
          <span className="fp-notif-file">
            <Icons.file size={13} />
            <span className="name">{n.file.name}</span>
            <span className="size">{n.file.size}</span>
          </span>
        )}
      </div>

      {full && <span className="fp-notif-time">{n.time}</span>}
    </div>
  );
}
