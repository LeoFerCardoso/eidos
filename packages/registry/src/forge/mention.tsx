import * as React from 'react';
import { Avatar } from '@/components/forge/avatar';
import { HoverCard } from '@/components/forge/hover-card';
import { Icons } from '@/components/forge/icons';

interface MentionPerson {
  /** Display name — rendered as "@Name" in the pill. */
  name: string;
  /** Photo URL; falls back to generated initials. */
  src?: string;
  /** Job title / role. */
  role?: string;
  /** Team or tribe name. */
  tribe?: string;
  /** Presence state — drives the status dot colour beside the name. */
  status?: 'online' | 'away' | 'busy' | 'offline';
  /**
   * Presence note shown as the status-dot tooltip, e.g. "On-call now · paged
   * 6h ago". Only rendered when `status` is set.
   */
  presence?: string;
  /** Short professional summary (bio) — clamped to ~3 lines. */
  bio?: string;
  /** Location / region line. */
  region?: string;
  /** Contact email address. */
  email?: string;
  /** Contact phone number — rendered as a tel: link. */
  phone?: string;
  /** Joined date label, e.g. "Joined Mar 2021". */
  joined?: string;
  /** Google Chat (or similar) DM link. */
  chatHref?: string;
  /** Profile page route. */
  href?: string;
}

const Mention = React.forwardRef<
  HTMLSpanElement,
  { person: MentionPerson; className?: string }
>(({ person, className }, ref) => {
  const profile = person.href ?? '#';
  const mailHref = person.email
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(person.email)}`
    : undefined;
  const telHref = person.phone
    ? `tel:${person.phone.replace(/[^\d+]/g, '')}`
    : undefined;

  return (
    <HoverCard
      openDelay={150}
      side="top"
      align="start"
      minWidth={320}
      className="mention-hc"
      trigger={
        <a href={profile} className={`mention${className ? ` ${className}` : ''}`}>
          @{person.name}
        </a>
      }
    >
      {/* Profile card — edge-to-edge cover banner, avatar straddling the edge */}
      <div className="mention-card">
        {/* Cover banner — ember gradient */}
        <div className="mention-cover" aria-hidden="true" />

        {/* Avatar — ringed, straddling the banner bottom */}
        <span className="mention-av">
          <Avatar name={person.name} src={person.src} size={64} />
        </span>

        {/* Identity body */}
        <div className="mention-body">
          <div className="mention-name">
            <span>{person.name}</span>
            {person.status && (
              <span
                className="mention-dot"
                data-status={person.status}
                title={person.presence}
                aria-label={`${person.name} is ${person.status}${person.presence ? `: ${person.presence}` : ''}`}
              />
            )}
          </div>

          {(person.role || person.tribe) && (
            <div className="mention-role">
              {[person.role, person.tribe].filter(Boolean).join(' · ')}
            </div>
          )}

          {person.bio && (
            <p className="mention-bio">{person.bio}</p>
          )}

          {(person.region || person.email || person.phone) && (
            <div className="mention-rows">
              {person.region && (
                <p className="mention-row">
                  <Icons.region size={13} aria-hidden="true" />
                  {person.region}
                </p>
              )}
              {person.email && mailHref && (
                <a
                  className="mention-row mention-link"
                  href={mailHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Email ${person.name}`}
                >
                  <Icons.mail size={13} aria-hidden="true" />
                  <span>{person.email}</span>
                </a>
              )}
              {person.phone && telHref && (
                <a
                  className="mention-row mention-link"
                  href={telHref}
                  aria-label={`Call ${person.name}`}
                >
                  <Icons.phone size={13} aria-hidden="true" />
                  <span>{person.phone}</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer — joined date + actions */}
        <div className="mention-foot">
          {person.joined && (
            <span className="mention-joined">{person.joined}</span>
          )}
          <span className="mention-actions">
            <a href={profile} className="btn ghost sm">
              <Icons.user size={13} aria-hidden="true" /> Profile
            </a>
            <a
              href={person.chatHref ?? 'https://chat.google.com/'}
              target="_blank"
              rel="noreferrer"
              className="btn ember sm"
              aria-label={`Message ${person.name} on Google Chat`}
            >
              <Icons.chat size={13} aria-hidden="true" /> Message
            </a>
          </span>
        </div>
      </div>
    </HoverCard>
  );
});

export { Mention };
