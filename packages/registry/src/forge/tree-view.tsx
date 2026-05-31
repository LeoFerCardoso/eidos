import * as React from 'react';
import { Icons } from '@/components/forge/icons';

type TreeNodeData = { id: string; label?: React.ReactNode; icon?: string; meta?: React.ReactNode; badge?: React.ReactNode; children?: TreeNodeData[] };

const TreeNode = ({ node, level, expanded, toggle, selected, onSelect }: {
  node: TreeNodeData;
  level: number;
  expanded: Record<string, boolean>;
  toggle: (id: string) => void;
  selected?: string;
  onSelect?: (node: TreeNodeData) => void;
}) => {
  const has = node.children && node.children.length > 0;
  const isOpen = expanded[node.id];
  const IconComp = node.icon && Icons[node.icon];
  const isSel = selected === node.id;
  return (
    <li className={'tree-node lvl-' + level + (isSel ? ' is-selected' : '') + (isOpen ? ' is-open' : '')}>
      <div className="tree-row"
           onClick={() => { onSelect && onSelect(node); if (has) toggle(node.id); }}
           role={onSelect || has ? 'button' : undefined} tabIndex={onSelect || has ? 0 : undefined}>
        <div className="tree-rails" aria-hidden="true">
          {Array.from({ length: level }).map((_, i) => <span key={i} className="tree-rail"/>)}
        </div>
        <span className="tree-toggle" aria-label={has ? (isOpen ? 'Collapse' : 'Expand') : undefined}
              aria-expanded={has ? isOpen : undefined}
              onClick={(e) => { if (has) { e.stopPropagation(); toggle(node.id); } }}>
          {has && <span className={'chev' + (isOpen ? ' rot' : '')} aria-hidden="true"><Icons.chevronRight size={11}/></span>}
        </span>
        <span className="tree-icon">
          {IconComp
            ? <IconComp size={13}/>
            : (has ? <Icons.folder size={13}/> : <Icons.file size={13}/>)}
        </span>
        <span className="tree-label">{node.label}</span>
        {node.meta != null && <span className="tree-meta">{node.meta}</span>}
        {node.badge && <span className="tree-badge">{node.badge}</span>}
      </div>
      {has && isOpen && (
        <ul className="tree-children" role="group">
          {node.children.map(c => (
            <TreeNode key={c.id} node={c} level={level + 1}
                      expanded={expanded} toggle={toggle}
                      selected={selected} onSelect={onSelect}/>
          ))}
        </ul>
      )}
    </li>
  );
};

const TreeView = ({ nodes = [], defaultExpanded = [], selected, onSelect, variant = 'files' }: {
  /** Root-level tree nodes. Each node may contain nested children. */
  nodes?: TreeNodeData[];
  /** IDs of nodes that start expanded. */
  defaultExpanded?: string[];
  /** ID of the currently-selected node. Applies the ember selection tint and aria-selected. */
  selected?: string;
  /** Fires when the user clicks a node row. */
  onSelect?: (node: TreeNodeData) => void;
  /** Visual variant for the tree (e.g. "files" for a file-tree layout). */
  variant?: string;
}) => {
  const init = React.useMemo(() => {
    const o = {}; defaultExpanded.forEach(id => { o[id] = true; }); return o;
  }, [defaultExpanded.join('|')]);
  const [expanded, setExpanded] = React.useState(init);
  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));
  return (
    <ul className={'tree-view variant-' + variant} role="tree">
      {nodes.map(n => (
        <TreeNode key={n.id} node={n} level={0}
                  expanded={expanded} toggle={toggle}
                  selected={selected} onSelect={onSelect}/>
      ))}
    </ul>
  );
};

export { TreeView };
