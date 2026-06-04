'use client';
// Forge AI — conversation widgets. Richer-than-prose artifacts the copilot drops
// into an assistant turn. Composed from DS atoms (HealthBadge, Trend, Icons) and
// the contrast/flat rules. Grow this file as new widget types land.
import * as React from 'react';
import Link from 'next/link';
import { HealthBadge, Trend, Icons, Avatar, HoverCard } from '@/ds/core';

type Health = 'up' | 'degraded' | 'down';

export interface RootCauseNode {
  /** Service name (rendered mono). */
  name: string;
  /** Icons key for the leading glyph. */
  icon?: string;
  health: Health;
  /** The headline metric, e.g. "p99 240ms" + a +41% trend. */
  metric: { label: string; delta: number; unit?: string; inverted?: boolean };
  version: string;
  age: string;
  /** Marks the node as the suspected cause — gets a soft emphasis. */
  root?: boolean;
}

// ── User mention ────────────────────────────────────────────────────────────

export interface MentionPerson {
  name: string;
  /** Photo URL; falls back to initials. */
  src?: string;
  role?: string;
  tribe?: string;
  /** Presence — drives the status dot beside the name; presence text is its tooltip. */
  status?: 'online' | 'away' | 'busy' | 'offline';
  /** Presence note used as the status-dot tooltip, e.g. "On-call now · paged 6h ago". */
  presence?: string;
  /** Short self-written professional summary shown as the support line. */
  bio?: string;
  /** Direct-message link (Google Chat). */
  chatHref?: string;
  /** Location / region line. */
  region?: string;
  /** Contact email. */
  email?: string;
  /** Contact phone. */
  phone?: string;
  /** Joined date, e.g. "Joined Mar 2021". */
  joined?: string;
  /** Profile route. */
  href?: string;
}

/**
 * Inline @-mention of a person: an avatar pill that is clickable (to the profile)
 * AND opens a HoverCard preview on hover/focus — avatar, role · tribe, presence,
 * and quick actions. Use anywhere a person's name appears in prose (chat answers,
 * incident commanders, PR authors).
 */
export function UserMention({ person }: { person: MentionPerson }) {
  const profile = person.href ?? '/portal';
  return (
    <HoverCard
      openDelay={150}
      side="top"
      align="start"
      minWidth={320}
      className="fp-profile-hc"
      trigger={
        <a href={profile} className="fp-mention">@{person.name}</a>
      }
    >
      <div className="fp-profile">
        <div className="fp-profile-cover" aria-hidden="true" />
        <span className="fp-profile-av">
          <Avatar name={person.name} src={person.src} size={64} />
        </span>
        <div className="fp-profile-body">
          <div className="fp-profile-name">
            <span>{person.name}</span>
            {person.status && (
              <span className="fp-profile-dot" data-status={person.status} title={person.presence} />
            )}
          </div>
          {(person.role || person.tribe) && (
            <div className="fp-profile-role">{[person.role, person.tribe].filter(Boolean).join(' · ')}</div>
          )}
          {person.bio && <p className="fp-profile-bio">{person.bio}</p>}
          {(person.region || person.email || person.phone) && (
            <div className="fp-profile-rows">
              {person.region && (
                <p className="fp-profile-row"><Icons.region size={13} /> {person.region}</p>
              )}
              {person.email && (
                <a
                  className="fp-profile-row fp-profile-link"
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(person.email)}`}
                  target="_blank"
                  rel="noreferrer"
                  title={`Email ${person.name}`}
                >
                  <Icons.mail size={13} /> <span>{person.email}</span>
                </a>
              )}
              {person.phone && (
                <a
                  className="fp-profile-row fp-profile-link"
                  href={`tel:${person.phone.replace(/[^\d+]/g, '')}`}
                  title={`Call ${person.name}`}
                >
                  <Icons.phone size={13} /> <span>{person.phone}</span>
                </a>
              )}
            </div>
          )}
        </div>
        <div className="fp-profile-foot">
          {person.joined && <span className="fp-profile-joined">{person.joined}</span>}
          <span className="fp-profile-actions">
            <Link href={profile} className="btn ghost sm"><Icons.user size={13} /> Profile</Link>
            <a
              href={person.chatHref ?? 'https://chat.google.com/'}
              target="_blank"
              rel="noreferrer"
              className="btn ember sm"
              title={`Message ${person.name} on Google Chat`}
            >
              <Icons.chat size={13} /> Message
            </a>
          </span>
        </div>
      </div>
    </HoverCard>
  );
}

/**
 * Root-cause / dependency-correlation widget. Renders an impacted service and the
 * dependency it correlates with as a linked chain, so the "why" is visual: each
 * node carries its health, headline metric, version and age, and the suspected
 * cause is highlighted. Flat, square atoms inside one bordered widget surface.
 */
export function RootCauseWidget({
  title = 'Likely root cause',
  nodes,
}: {
  title?: string;
  nodes: RootCauseNode[];
}) {
  return (
    <div className="fp-aiw">
      <div className="fp-aiw-head">
        <span className="fp-aiw-ic" aria-hidden="true"><Icons.target size={13} /></span>
        <span className="fp-aiw-title">{title}</span>
      </div>

      <div className="fp-aiw-chain">
        {nodes.map((n, i) => {
          const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[n.icon || 'server'] ?? Icons.server;
          return (
            <React.Fragment key={n.name}>
              {i > 0 && (
                <div className="fp-aiw-link" aria-hidden="true">
                  <Icons.arrowDown size={12} />
                  <span>depends on</span>
                </div>
              )}
              <div className={`fp-aiw-node${n.root ? ' is-root on-accent-soft' : ''}`}>
                <div className="fp-aiw-node-head">
                  <span className="fp-aiw-node-ic"><Icon size={14} /></span>
                  <code className="mono fp-aiw-name">{n.name}</code>
                  <HealthBadge state={n.health} pulse={n.health !== 'up'} />
                </div>
                <div className="fp-aiw-node-meta">
                  <span className="fp-aiw-metric">{n.metric.label}</span>
                  <Trend delta={n.metric.delta} unit={n.metric.unit ?? '%'} inverted={n.metric.inverted} />
                  <span className="fp-aiw-sep">·</span>
                  <code className="mono">{n.version}</code>
                  <span className="fp-aiw-sep">·</span>
                  <span>{n.age}</span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
