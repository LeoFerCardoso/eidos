import * as React from 'react';
import { Code } from '@/components/forge/code';
import { CopyButton } from '@/components/forge/copy-button';
import { Icons } from '@/components/forge/icons';

const langFromExt = (path) => {
  const ext = path.toLowerCase().split('.').pop();
  if (ext === 'tsx' || ext === 'jsx' || ext === 'ts' || ext === 'js') return 'jsx';
  if (ext === 'css' || ext === 'scss') return 'css';
  if (ext === 'html') return 'html';
  if (ext === 'sh' || ext === 'bash') return 'bash';
  return 'jsx';
};

const buildTree = (files) => {
  const root = {};
  files.forEach((f, idx) => {
    const parts = f.path.split('/');
    let cursor = root;
    parts.forEach((part, i) => {
      const isLeaf = i === parts.length - 1;
      if (isLeaf) {
        cursor[part] = { __file: idx };
      } else {
        if (!cursor[part] || cursor[part].__file !== undefined) cursor[part] = {};
        cursor = cursor[part];
      }
    });
  });
  return root;
};

const fileExtDot = (path) => {
  const ext = path.toLowerCase().split('.').pop();
  // Color-coded dot in the file tree — quick visual cue per language.
  if (ext === 'tsx' || ext === 'jsx') return 'var(--ember-glow)';
  if (ext === 'ts' || ext === 'js')   return '#93C5FD';
  if (ext === 'css' || ext === 'scss') return 'var(--accent-3)';
  if (ext === 'html')                  return 'var(--success)';
  if (ext === 'json')                  return 'var(--warning)';
  return 'var(--fg-faint)';
};

const TreeNode = ({ node, activeIdx, setActive, depth }: {
  node: Record<string, any>;
  activeIdx: number;
  setActive: (idx: number) => void;
  depth: number;
}) => {
  const entries = Object.entries(node);
  return (
    <ul className="ds-codetree-list" style={depth === 0 ? null : { paddingInlineStart: 14 }}>
      {entries.map(([name, value]) => {
        if (value.__file !== undefined) {
          const idx = value.__file;
          return (
            <li key={name}>
              <button
                type="button"
                className={'ds-codetree-file' + (idx === activeIdx ? ' active' : '')}
                onClick={() => setActive(idx)}
              >
                <span className="dot" style={{ background: fileExtDot(name) }} aria-hidden="true"/>
                <span className="name">{name}</span>
              </button>
            </li>
          );
        }
        return (
          <li key={name}>
            <div className="ds-codetree-folder">
              <Icons.chevronDown size={10}/>
              <Icons.folder size={11}/>
              <span className="name">{name}</span>
            </div>
            <TreeNode node={value} activeIdx={activeIdx} setActive={setActive} depth={depth + 1}/>
          </li>
        );
      })}
    </ul>
  );
};

const CodeTree = ({ files, defaultIndex = 0, label }: {
  files: { path: string; code: string; lang?: string }[];
  defaultIndex?: number;
  label?: string;
}) => {
  const [active, setActive] = React.useState(defaultIndex);
  const file = files[active] || files[0];
  const tree = React.useMemo(() => buildTree(files), [files]);
  const lang = file.lang || langFromExt(file.path);
  return (
    <div className="ds-frame ds-frame-tree">
      <div className="ds-frame-head">
        <span className="label">{label || file.path}</span>
        <div className="actions">
          <CopyButton text={file.code}/>
        </div>
      </div>
      <div className="ds-codetree">
        <aside className="ds-codetree-sidebar" aria-label="Files">
          <TreeNode node={tree} activeIdx={active} setActive={setActive} depth={0}/>
        </aside>
        <div className="ds-codetree-body">
          <Code lang={lang}>{file.code}</Code>
        </div>
      </div>
    </div>
  );
};

export { CodeTree };
