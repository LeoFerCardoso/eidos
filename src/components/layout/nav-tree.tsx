'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DSIcon } from './ds-icon';
import { type NavGroup, type NavItem } from '@/lib/nav';

// Mirrors the legacy NavLink/NavGroup markup (.ds-link/.ds-section-title/.ds-subsection)
// so it's visually identical, but driven by the typed NAV + Next routing + usePathname.
function NavLink({ item, indented }: { item: NavItem; indented?: boolean }) {
  const pathname = usePathname();
  const active = pathname === item.href;
  const className =
    'ds-link' +
    (active ? ' active' : '') +
    (indented ? ' is-indented' : '') +
    (item.external ? ' is-external' : '');
  return (
    <Link href={item.href} className={className} aria-current={active ? 'page' : undefined}>
      <span className="ds-link-label">{item.label}</span>
      {item.external && (
        <span className="ds-link-ext" aria-hidden="true">
          <DSIcon name="externalLink" size={11} />
        </span>
      )}
      {item.badge && (
        <span className={'ds-link-badge ' + item.badge} aria-label={`${item.badge} page`}>
          {item.badge === 'new' ? 'New' : item.badge === 'updated' ? 'Updated' : item.badge}
        </span>
      )}
    </Link>
  );
}

export function NavTree({ groups }: { groups: NavGroup[] }) {
  return (
    <>
      {groups.map((group) => (
        <div key={group.group}>
          <div className="ds-section-title">{group.group}</div>
          {group.subgroups
            ? group.subgroups.map((sg) => (
                <div key={sg.subgroup} className="ds-subsection">
                  <div className="ds-subsection-title">{sg.subgroup}</div>
                  {sg.items.map((it) => <NavLink key={it.slug} item={it} indented />)}
                </div>
              ))
            : group.items?.map((it) => <NavLink key={it.slug} item={it} />)}
        </div>
      ))}
    </>
  );
}
