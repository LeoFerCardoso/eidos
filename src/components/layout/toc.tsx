'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

type Item = { id: string; text: string };

// "On this page" rail — generated from the page's semantic <h2 class="ds-sub"> section
// headings. DS page content mounts asynchronously (DSPageLoader), so we re-scan via a
// MutationObserver + on route change, and track the active heading on scroll.
export function TableOfContents() {
  const pathname = usePathname();
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState('');
  const scrollRef = useRef<HTMLElement | null>(null);

  // Collect headings (and keep collecting while the page streams in).
  useEffect(() => {
    const root = document.querySelector('.ds-main-inner');
    const scroller = document.querySelector('.ds-main') as HTMLElement | null;
    scrollRef.current = scroller;
    if (!root) return;
    const scan = () => {
      const hs = Array.from(root.querySelectorAll('h2.ds-sub[id]')) as HTMLElement[];
      const next = hs.map((h) => ({ id: h.id, text: h.dataset.toc || h.querySelector('.ds-sub-text')?.textContent || h.textContent || '' }));
      // Two layouts: pages with ≥2 sections get the centered-content + rail grid; pages
      // without (Introduction, sub-DS overviews) stay a single centered column.
      root.classList.toggle('ds-has-toc', next.length >= 2);
      setItems((prev) => (prev.length === next.length && prev.every((p, i) => p.id === next[i].id) ? prev : next));
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });
    const t = setTimeout(scan, 300);
    return () => { mo.disconnect(); clearTimeout(t); };
  }, [pathname]);

  // Highlight the heading nearest the top of the scroll area.
  useEffect(() => {
    if (items.length < 2) return;
    const scroller = scrollRef.current || window;
    const onScroll = () => {
      let current = items[0]?.id || '';
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= 120) current = it.id;
      }
      setActive(current);
    };
    onScroll();
    const target: any = scroller;
    target.addEventListener('scroll', onScroll, { passive: true });
    return () => target.removeEventListener('scroll', onScroll);
  }, [items]);

  if (items.length < 2) return <div className="ds-doc-toc" aria-hidden="true" />;

  return (
    <div className="ds-doc-toc">
      <nav className="ds-toc" aria-label="On this page">
        <div className="ds-toc-title">On this page</div>
        <ul>
          {items.map((it) => (
            <li key={it.id}>
              <a href={`#${it.id}`} className={it.id === active ? 'active' : ''}>{it.text}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
