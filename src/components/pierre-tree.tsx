'use client';
// Eidos DS — TreeView, backed by the real trees.software engine (@pierre/trees).
//
// We render Pierre's actual FileTree web component (path-first model, virtualized
// rows, git-status lane, search, drag-and-drop, context menus, keyboard a11y) and
// re-skin ONLY the colours, typography and shapes to Eidos via the
// `--trees-*-override` custom properties on `.forge-tree` (they inherit through
// the component's Shadow DOM). See `.forge-tree` in ds.css. The tree logic,
// layout and a11y are the library's.
//
// The component is a custom element that paints to the DOM, so it's loaded with
// `next/dynamic({ ssr:false })`: it never runs during static generation and
// ships in this page's chunk only (same isolation strategy @pierre/diffs gets).
import * as React from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { Icons } from '@/ds/core';
import type {
  GitStatusEntry,
  FileTreeDensity,
  FileTreeSearchMode,
  ContextMenuTriggerMode,
} from '@pierre/trees';

export interface ForgeTreeProps {
  /** Path-first model — one canonical path string per leaf, e.g. "apps/api/src/index.ts". */
  paths: string[];
  /** Directory paths that start expanded. */
  defaultExpanded?: string[];
  /** Expand everything ('open'), nothing ('closed') or to a depth (number). Overrides defaultExpanded. */
  initialExpansion?: 'open' | 'closed' | number;
  /** Selected leaf path (single-select for docs). */
  selected?: string;
  /** Per-path git decoration — drives the coloured status lane (added/modified/…). */
  gitStatus?: GitStatusEntry[];
  /** Per-path trailing text decoration (a meta tag rendered in the action lane). */
  meta?: Record<string, string>;
  /** Row height / spacing preset. */
  density?: FileTreeDensity;
  /** Collapse single-child folder chains into one row. */
  flattenEmptyDirectories?: boolean;
  /** Show the in-tree search field. */
  search?: boolean;
  /** How non-matching rows behave while searching. */
  searchMode?: FileTreeSearchMode;
  /** Pre-populate the search field (handy to show a mode at rest). */
  initialSearchQuery?: string;
  /** Enable drag-and-drop move between folders / to the root. */
  dragAndDrop?: boolean;
  /** Paths that cannot be dragged (canDrag=false) — also get a "locked" tag. */
  lockedPaths?: string[];
  /** Mount a Eidos-styled context menu (new file/folder, rename, delete). */
  contextMenu?: boolean;
  /** How the context menu opens. */
  contextMenuTrigger?: ContextMenuTriggerMode;
  /** Render an IDE-style window chrome header (traffic lights, repo title, actions). */
  chrome?: string;
  /** Fixed panel height; the tree virtualizes and scrolls inside it. */
  height?: number | string;
  /** Writing direction — set "rtl" on the host so the engine's RTL layout +
      bidi-isolated labels engage (a wrapper dir="rtl" is not enough). */
  dir?: 'ltr' | 'rtl';
  style?: React.CSSProperties;
}

const dirname = (p: string) => {
  const i = p.lastIndexOf('/');
  return i === -1 ? '' : p.slice(0, i);
};

interface MenuContext {
  close: (o?: { restoreFocus?: boolean }) => void;
  anchorRect: { top: number; right: number; bottom: number; left: number; width: number; height: number };
}

// Eidos-styled context menu. The tree clips its own overflow (rounded card +
// scroll), so the menu is PORTALED to <body> and positioned from the anchor
// rect — it escapes the container. Marked data-file-tree-context-menu-root so
// the library doesn't treat in-menu clicks as outside-clicks. We own the look
// + the actions (real model mutations).
function ForgeTreeMenu({
  item,
  context,
  model,
}: {
  item: { path: string; kind: 'directory' | 'file'; name: string };
  context: MenuContext;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState(() => ({
    left: context.anchorRect.left,
    top: context.anchorRect.bottom + 4,
  }));
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = context.anchorRect;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    let left = r.left;
    let top = r.bottom + 4;
    if (left + w > window.innerWidth - 8) left = Math.max(8, window.innerWidth - 8 - w);
    if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 4);
    setPos({ left, top });
  }, [context]);

  const dir = item.kind === 'directory' ? item.path : dirname(item.path);
  const uniquePath = (base: string, ext: string) => {
    const make = (n: number) => `${dir ? dir + '/' : ''}${base}${n ? '-' + n : ''}${ext}`;
    let n = 0;
    while (model.getItem(make(n))) n++;
    return make(n);
  };
  const newFile = () => {
    const p = uniquePath('untitled', '.ts');
    model.add(p);
    context.close({ restoreFocus: false });
    model.startRenaming(p, { removeIfCanceled: true });
  };
  const newFolder = () => {
    const folder = uniquePath('new-folder', '');
    model.add(`${folder}/.gitkeep`);
    context.close({ restoreFocus: false });
    model.startRenaming(folder, { removeIfCanceled: false });
  };
  const rename = () => {
    context.close({ restoreFocus: false });
    model.startRenaming(item.path);
  };
  const del = () => {
    model.remove(item.path, { recursive: true });
    context.close();
  };
  return createPortal(
    <div
      ref={ref}
      className="forge-tree-menu"
      data-file-tree-context-menu-root="true"
      role="menu"
      aria-label={`Actions for ${item.name}`}
      style={{ position: 'fixed', left: pos.left, top: pos.top, zIndex: 1000 }}
    >
      <button type="button" role="menuitem" className="ftm-item" onClick={newFile}>
        <Icons.file size={14} /> New file
      </button>
      <button type="button" role="menuitem" className="ftm-item" onClick={newFolder}>
        <Icons.folder size={14} /> New folder
      </button>
      <button type="button" role="menuitem" className="ftm-item" onClick={rename}>
        <Icons.edit size={14} /> Rename
      </button>
      <div className="ftm-sep" role="separator" />
      <button type="button" role="menuitem" className="ftm-item danger" onClick={del}>
        <Icons.trash size={14} /> Delete
      </button>
    </div>,
    document.body,
  );
}

// IDE-style window chrome header (slotted above the tree).
function ForgeTreeChrome({
  title,
  model,
}: {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any;
}) {
  const rootNewFile = () => {
    let n = 0;
    const make = (i: number) => `untitled${i ? '-' + i : ''}.ts`;
    while (model.getItem(make(n))) n++;
    model.add(make(n));
    model.startRenaming(make(n), { removeIfCanceled: true });
  };
  return (
    <div className="forge-tree-chrome">
      <span className="ftc-lights" aria-hidden="true">
        <i /><i /><i />
      </span>
      <span className="ftc-title">{title}</span>
      <span className="ftc-actions">
        <button type="button" aria-label="Search files" onClick={() => model.openSearch()}>
          <Icons.search size={15} />
        </button>
        <button type="button" aria-label="New file" onClick={rootNewFile}>
          <Icons.file size={15} />
        </button>
      </span>
    </div>
  );
}

// Load Pierre's React entry inside the dynamic chunk and close over its
// `useFileTree`/`FileTree` so the custom element never lands in the main bundle
// and never runs during static generation.
const ForgeTree = dynamic(
  async () => {
    const mod = await import('@pierre/trees/react');
    function ForgeTreeInner({
      paths,
      defaultExpanded,
      initialExpansion,
      selected,
      gitStatus,
      meta,
      density = 'default',
      flattenEmptyDirectories = false,
      search = false,
      searchMode,
      initialSearchQuery,
      dragAndDrop = false,
      lockedPaths,
      contextMenu = false,
      contextMenuTrigger = 'both',
      chrome,
      height = 320,
      dir,
      style,
    }: ForgeTreeProps) {
      const locked = React.useMemo(() => new Set(lockedPaths ?? []), [lockedPaths]);

      // Merge the per-path meta tag with a "locked" tag for non-draggable rows.
      const renderRowDecoration = React.useCallback(
        ({ item }: { item: { path: string } }) => {
          if (locked.has(item.path)) return { text: 'locked' };
          const text = meta?.[item.path];
          return text ? { text } : null;
        },
        [meta, locked],
      );
      const hasDecoration = Boolean(meta) || locked.size > 0;

      // Shadow-DOM tweaks the override custom props can't reach, injected in the
      // library's @layer unsafe (beats its base rules):
      //  · give the search field top breathing room (it sits flush under the
      //    chrome header / the card edge otherwise);
      //  · in RTL, pin the multi-segment filename label back to LTR so names
      //    don't reorder ("build" → "ldbui").
      const unsafeCSS = React.useMemo(() => {
        const parts: string[] = [];
        // chrome sits flush at the card top, so the search field underneath it
        // needs its own gap; a search-only tree already gets one from the host
        // block padding.
        if (chrome) parts.push('[data-file-tree-search-container]{margin-block-start:10px;}');
        if (dir === 'rtl') parts.push('[data-truncate-group-container]{direction:ltr;}');
        return parts.length ? parts.join('') : undefined;
      }, [chrome, dir]);

      const dndConfig = React.useMemo(() => {
        if (!dragAndDrop) return undefined;
        if (locked.size === 0) return true;
        return {
          canDrag: (dragged: readonly string[]) => !dragged.some((p) => locked.has(p)),
        };
      }, [dragAndDrop, locked]);

      const { model } = mod.useFileTree({
        paths,
        ...(initialExpansion != null
          ? { initialExpansion }
          : { initialExpandedPaths: defaultExpanded }),
        initialSelectedPaths: selected ? [selected] : undefined,
        gitStatus,
        density,
        flattenEmptyDirectories,
        search: search || Boolean(chrome),
        // search/chrome aside, the line above passes the explicit boolean — the
        // engine flattens single-child chains UNLESS this is literally false.
        ...(searchMode ? { fileTreeSearchMode: searchMode } : {}),
        ...(initialSearchQuery ? { initialSearchQuery } : {}),
        ...(dndConfig != null ? { dragAndDrop: dndConfig } : {}),
        ...(contextMenu
          ? {
              renaming: true,
              composition: { contextMenu: { triggerMode: contextMenuTrigger } },
            }
          : {}),
        ...(unsafeCSS ? { unsafeCSS } : {}),
        renderRowDecoration: hasDecoration ? renderRowDecoration : undefined,
      });

      return (
        <mod.FileTree
          model={model}
          className={`forge-tree${chrome ? ' has-chrome' : ''}`}
          dir={dir}
          style={{ height, ...style }}
          header={chrome ? <ForgeTreeChrome title={chrome} model={model} /> : undefined}
          renderContextMenu={
            contextMenu
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (item: any, ctx: any) => <ForgeTreeMenu item={item} context={ctx} model={model} />
              : undefined
          }
        />
      );
    }
    return ForgeTreeInner;
  },
  { ssr: false, loading: () => <div className="forge-tree-loading">Loading tree…</div> },
);

export { ForgeTree };
