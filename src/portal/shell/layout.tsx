'use client';
// Forge — small shared layout primitives for the portal pages.
//
// These codify three patterns that were hand-rolled (with inline flex/border
// styles) on nearly every page:
//   • FCardHead — a card's header band: title + optional trailing action.
//   • FRow / FRows — a flat list row (left content + trailing items) inside a
//     `.fp-rows` group that draws hairline dividers between rows. Renders a Next
//     <Link> when `href` is set, a <div> otherwise. The consumer pushes trailing
//     content with a `flex:1` child (or the `.fp-row-main` helper class).
//   • Sub — the small caption under a value/title (the FKpi `sub` slot, etc.).
//
// All visuals live in `src/styles/example-shell.css` (.fp-card-head / .fp-row /
// .fp-rows / .fp-sub) — no inline styles here.
import * as React from 'react';
import Link from 'next/link';

// ── FCardHead ─────────────────────────────────────────────────────────────────

export function FCardHead({
  title,
  action,
  className,
}: {
  title: React.ReactNode;
  /** Optional trailing node — a pill, link or button, aligned to the inline-end. */
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={'fp-card-head' + (className ? ` ${className}` : '')}>
      <div className="fp-card-title">{title}</div>
      {action}
    </div>
  );
}

// ── FRows / FRow ──────────────────────────────────────────────────────────────

export function FRows({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={'fp-rows' + (className ? ` ${className}` : '')}>{children}</div>;
}

type FRowProps = {
  /** When set, the row is a client-side <Link>; otherwise a plain <div>. */
  href?: string;
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, 'children'>;

export function FRow({ href, children, className, ...rest }: FRowProps) {
  const cls = 'fp-row' + (className ? ` ${className}` : '');
  if (href) {
    return (
      <Link href={href} className={cls} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}

// ── Sub ───────────────────────────────────────────────────────────────────────

export function Sub({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <div className="fp-sub" data-muted={muted || undefined}>
      {children}
    </div>
  );
}

// ── PersonAvatar / AvatarStack ─────────────────────────────────────────────────
// A round initials chip (ember-on-ember-soft, matching the workspace + account
// avatars) and an overlapping stack of them with a "+N" overflow. Shared by the
// Teams and Products surfaces. Visuals: .fp-ava / .fp-ava-stack in example-shell.css.

export function PersonAvatar({
  initials,
  size = 28,
  title,
}: {
  initials: string;
  size?: number;
  title?: string;
}) {
  return (
    <span
      className="fp-ava"
      title={title}
      aria-hidden={title ? undefined : true}
      style={{ inlineSize: size, blockSize: size, fontSize: Math.round(size * 0.4) }}
    >
      {initials}
    </span>
  );
}

export function AvatarStack({
  people,
  max = 5,
  size = 24,
}: {
  people: { initials: string; name?: string }[];
  max?: number;
  size?: number;
}) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <span className="fp-ava-stack" aria-hidden="true">
      {shown.map((p, i) => (
        <PersonAvatar key={i} initials={p.initials} size={size} title={p.name} />
      ))}
      {extra > 0 && (
        <span
          className="fp-ava is-more"
          style={{ inlineSize: size, blockSize: size, fontSize: Math.round(size * 0.36) }}
        >
          +{extra}
        </span>
      )}
    </span>
  );
}
