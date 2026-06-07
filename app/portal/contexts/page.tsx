'use client';
// Forge — Contexts. The knowledge base agents read to ground their answers:
// bureau registries, Google Drive, Confluence, uploaded files and Markdown
// documents authored here. This catalog is the single source: everything is
// attachable in the agent wizard's Knowledge step.
//
// Brief — Persona: anyone grounding an agent + the knowledge owner. Question:
// what can my agent read, where does it come from, and is it fresh? Data:
// CONTEXTS (src/portal/data/contexts.ts). Primary action: connect a source /
// upload / author a doc / attach to an agent. Distinctive move: one knowledge
// base spanning registries, Drive, Confluence, uploads and authored Markdown,
// each with a sync status.
//
// Composes only Eidos DS + .fp-* classes.
import * as React from 'react';
import { BrandIcon, Button, Icons, Pill, Select } from '@/ds/core';
import { FPageHeader, FSearch, FSection } from '@/portal/shell/portal-shell';
import {
  CONNECTORS,
  CONTEXTS,
  SOURCE_META,
  STATUS_META,
  fmtItems,
  totalItems,
  type Context,
  type ContextSource,
} from '@/portal/data/contexts';

const SOURCE_FILTERS = [
  { value: 'all', label: 'All sources' },
  { value: 'Registry', label: 'Registries' },
  { value: 'Google Drive', label: 'Google Drive' },
  { value: 'Confluence', label: 'Confluence' },
  { value: 'Upload', label: 'Uploads' },
  { value: 'Markdown', label: 'Markdown' },
];

function SourceCell({ source }: { source: ContextSource }) {
  const m = SOURCE_META[source];
  return (
    <span className="fp-ctx-src">
      {m.brand ? (
        <BrandIcon slug={m.brand} size={14} color="brand" />
      ) : (
        (() => {
          const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[m.icon ?? 'database'] ?? Icons.database;
          return <Icon size={13} />;
        })()
      )}
      {source}
    </span>
  );
}

export default function ContextsPage() {
  const [query, setQuery] = React.useState('');
  const [source, setSource] = React.useState('all');

  const filtered = React.useMemo(() => {
    let list = CONTEXTS;
    if (source !== 'all') list = list.filter((c) => c.source === source);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.owner.toLowerCase().includes(q));
    }
    return list;
  }, [query, source]);

  return (
    <>
      <FPageHeader
        eyebrow="Knowledge base"
        title="Contexts"
        subtitle={`${CONTEXTS.length} contexts · ${fmtItems(totalItems)} items indexed for agents to read`}
        actions={
          <>
            <Button variant="ghost"><Icons.upload size={13} /> Upload</Button>
            <Button variant="ember"><Icons.plus size={13} /> New document</Button>
          </>
        }
      />

      {/* Connect tiles */}
      <div className="fp-connect">
        {CONNECTORS.map((c) => (
          <button key={c.id} type="button" className="fp-connect-tile">
            <span className="fp-connect-ic" aria-hidden="true">
              {c.brand ? (
                <BrandIcon slug={c.brand} size={18} color="brand" />
              ) : (
                (() => {
                  const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[c.icon ?? 'plus'] ?? Icons.plus;
                  return <Icon size={16} />;
                })()
              )}
            </span>
            <span className="fp-connect-tx">
              <span className="fp-connect-label">{c.label}</span>
              <span className="fp-connect-desc">{c.desc}</span>
            </span>
            <Icons.plus size={14} />
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 460, display: 'flex' }}>
          <FSearch value={query} onChange={setQuery} placeholder="Search contexts, owners…" aria-label="Search contexts" className="fluid" />
        </div>
        <span className="fp-filter-select">
          <Select value={source} onValueChange={setSource} options={SOURCE_FILTERS} width="170px" />
        </span>
      </div>

      <FSection title="All contexts" style={{ marginBlockStart: 'var(--fp-filter-gap, 14px)' }}>
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Source</th>
                  <th style={{ textAlign: 'end' }}>Items</th>
                  <th>Owner</th>
                  <th style={{ textAlign: 'end' }}>Updated</th>
                  <th style={{ textAlign: 'end' }}>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c: Context) => {
                  const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[c.icon] ?? Icons.doc;
                  const st = STATUS_META[c.status];
                  return (
                    <tr key={c.id}>
                      <td>
                        <span className="fp-ctx-name">
                          <span className="fp-ctx-ic"><Icon size={14} /></span>
                          <span>
                            <span style={{ fontWeight: 600 }}>{c.name}</span>
                            <span className="fp-cell-sub">{c.desc}</span>
                          </span>
                        </span>
                      </td>
                      <td><SourceCell source={c.source} /></td>
                      <td className="mono" style={{ textAlign: 'end' }}>{fmtItems(c.items)}</td>
                      <td style={{ color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{c.owner}</td>
                      <td className="mono" style={{ textAlign: 'end', color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{c.updated}</td>
                      <td style={{ textAlign: 'end' }}>
                        <Pill tone={st.tone} dot live={c.status === 'syncing'}>{st.label}</Pill>
                      </td>
                      <td style={{ textAlign: 'end' }}>
                        <Button variant="ghost" size="sm"><Icons.plus size={11} /> Add</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </FSection>

      {filtered.length === 0 && (
        <div className="fp-empty" style={{ marginBlockStart: 16 }}>
          <Icons.search size={18} />
          <span>No contexts match this filter.</span>
        </div>
      )}
    </>
  );
}
