import * as React from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const AVATAR_PRESET: Record<AvatarSize, number> = {
  xs: 18, sm: 22, md: 28, lg: 36, xl: 48,
};

function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return (words[0][0] ?? '').toUpperCase();
  return ((words[0][0] ?? '') + (words[words.length - 1][0] ?? '')).toUpperCase();
}

interface AvatarProps {
  /**
   * Full name — used for the `title` tooltip and as the source for computed
   * initials when no `children` or `src` is provided.
   */
  name?: string;
  /** Size preset. xs=18 · sm=22 · md=28 (default) · lg=36 · xl=48. Also accepts a raw pixel number for legacy callers. */
  size?: AvatarSize | number;
  /** Image URL. Renders an `<img>` that falls back to initials on load error. */
  src?: string;
  /** Presence dot in the trailing-bottom corner. online · away · busy · offline. */
  status?: 'online' | 'away' | 'busy' | 'offline';
  /** Tints background with --ember-soft + ember text. Reserve for the current user / "you". */
  ember?: boolean;
  /** Override the initials — e.g. an icon for bot / system users. */
  children?: React.ReactNode;
  /** Extra utility classes merged via cn(). */
  className?: string;
  /**
   * @deprecated Pass `name` + `children` instead.
   * Legacy person descriptor — { name, initials, role? }.
   */
  p?: { name: string; initials: string; role?: string };
}

function AvatarBase({
  name: nameProp,
  size = 'md',
  src,
  status,
  ember = false,
  children,
  className,
  p,
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  // Resolution: name from explicit prop or legacy p?.name
  const resolvedName = nameProp ?? p?.name ?? '';
  // Diameter: preset string or explicit pixel number (legacy callers)
  const dia = typeof size === 'number' ? size : AVATAR_PRESET[size ?? 'md'];
  // Initials: children > legacy p?.initials > computed from name
  const resolvedInitials = children ?? p?.initials ?? (resolvedName ? initials(resolvedName) : null);

  const cls = ['avatar', ember ? 'ember' : '', className ?? ''].filter(Boolean).join(' ');

  return (
    <span
      className={cls}
      style={{ width: dia, height: dia, fontSize: dia * 0.36 }}
      title={resolvedName || undefined}
    >
      {src && !imgError
        ? <img src={src} alt={resolvedName || ''} onError={() => setImgError(true)} />
        : resolvedInitials}
      {status && (
        <span
          className={['status-dot', status !== 'online' ? status : ''].filter(Boolean).join(' ')}
          aria-hidden="true"
        />
      )}
    </span>
  );
}

const Avatar = AvatarBase;

export { Avatar };
