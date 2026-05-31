'use client';

import { usePathname } from 'next/navigation';
import { navForPath, DESIGN_SYSTEMS } from '@/lib/nav';

/** Breadcrumb derived from the route + typed nav: <DS> / <group> / <subgroup> / <page>. */
export function Breadcrumb() {
  const pathname = usePathname();
  const { item, ds } = navForPath(pathname);
  const dsLabel = DESIGN_SYSTEMS.find((d) => d.id === ds)?.label ?? 'Eidos';
  const group = item?.group;
  const subgroup = item?.subgroup;
  const pageLabel = item?.label ?? 'Introduction';
  return (
    <div className="crumbs">
      <span>{dsLabel}</span>
      {group && (
        <>
          <span className="sep">/</span>
          <span>{group}</span>
        </>
      )}
      {subgroup && (
        <>
          <span className="sep">/</span>
          <span>{subgroup}</span>
        </>
      )}
      <span className="sep">/</span>
      <span style={{ color: 'var(--fg)' }}>{pageLabel}</span>
    </div>
  );
}
