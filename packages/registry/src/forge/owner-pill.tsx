import * as React from 'react';
import { Avatar } from '@/components/forge/avatar';

function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return (words[0][0] ?? '').toUpperCase();
  return ((words[0][0] ?? '') + (words[words.length - 1][0] ?? '')).toUpperCase();
}

interface OwnerPillProps {
  /** Person descriptor. `src` (optional) renders a photo avatar with initials fallback. */
  person?: { name: string; initials: string; role?: string; src?: string };
  /** Role appended after the name in muted weight ("· SRE"). */
  role?: string;
  /** Ember-tint the avatar — reserve for the current user / "you". */
  ember?: boolean;
}

const OwnerPill = ({ person, role, ember = false }: OwnerPillProps) => {
  if (!person) return null;
  return (
    <span className="owner-pill" title={person.name + (role ? ` — ${role}` : '')}>
      <Avatar p={person} src={person.src} size={20} ember={ember}/>
      <span className="owner-pill-text">
        <span className="name">{person.name}</span>
        {role && <span className="role">· {role}</span>}
      </span>
    </span>
  );
};

export { OwnerPill };
