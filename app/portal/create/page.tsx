'use client';
// Forge · Templates (golden paths).
// Persona: Software Engineer. Question: which paved-road template gets my new
// service to production fastest? Primary action: "Build with Forge AI" (header)
// OR pick a template card. Flow: pick template (gallery) -> Service (name +
// product) -> Access (who can work on it) -> Review -> Provisioning (live logs).
// The template ABSTRACTS platform decisions; we never ask the dev for pipeline,
// SLO or observability. A service belongs to a PRODUCT, not a tribe.
import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Banner,
  Button,
  Chip,
  Drawer,
  Icons,
  Input,
  LangBadge,
  OwnerPill,
  Pill,
  Pipeline,
  Select,
  StatusDot,
  ToggleGroup,
  ToggleGroupItem,
} from '@/ds/core';
import { FPageHeader, FSection, IconBubble, FSearch } from '@/portal/shell/portal-shell';

type Maturity = 'Stable' | 'Beta';
type Person = { name: string; initials: string; role?: string };

interface Template {
  id: string;
  name: string;
  desc: string;
  lang: 'TypeScript' | 'Go' | 'Java' | 'Python' | 'Rust';
  framework: string[];
  maturity: Maturity;
  maintainer: Person;
  usage: number;
  version: string;
  icon: string;
  featured?: boolean;
  agentic?: boolean;
  match: RegExp;
}

const PEOPLE: Record<string, Person> = {
  camila: { name: 'Camila Tanaka', initials: 'CT', role: 'Staff Eng' },
  bruno: { name: 'Bruno Mendes', initials: 'BM', role: 'SRE' },
  larissa: { name: 'Larissa Fontana', initials: 'LF', role: 'Tech Lead' },
  rafael: { name: 'Rafael Souza', initials: 'RS', role: 'Platform' },
  ana: { name: 'Ana Lima', initials: 'AL', role: 'Backend' },
};

// A service belongs to a product line, not a tribe.
const PRODUCTS = ['Acerta', 'OneScore', 'Konduto', 'Cadastro Positivo', 'Identity & KYC', 'Bureau / SCPC', 'Platform'];

const TEMPLATES: Template[] = [
  {
    id: 'scoring-service',
    name: 'scoring-service',
    desc: 'Risk score service (0 to 1000) wired to the Ignite feature store and the OneScore contract. SLOs, pipeline and dashboards baked in.',
    lang: 'Go',
    framework: ['gRPC', 'Helm', 'OTel'],
    maturity: 'Stable',
    maintainer: PEOPLE.rafael,
    usage: 84,
    version: '3.2.0',
    icon: 'package',
    featured: true,
    match: /score|risk|credit|rating/i,
  },
  {
    id: 'bureau-api',
    name: 'bureau-api',
    desc: 'SCPC backed query API (CPF/CNPJ) with consent enforcement and a full audit trail baked in.',
    lang: 'Java',
    framework: ['Spring Boot 3', 'OTel'],
    maturity: 'Stable',
    maintainer: PEOPLE.larissa,
    usage: 61,
    version: '5.1.0',
    icon: 'database',
    match: /bureau|scpc|cpf|cnpj|query|consult|lookup/i,
  },
  {
    id: 'bureau-agent',
    name: 'bureau-agent',
    desc: 'MCP enabled AI agent: tool calling plus streaming grounded on the catalog, OTel traced. The paved road for agentic features.',
    lang: 'TypeScript',
    framework: ['MCP', 'AI SDK'],
    maturity: 'Beta',
    maintainer: PEOPLE.camila,
    usage: 12,
    version: '0.4.0',
    icon: 'sparkle',
    agentic: true,
    match: /agent|mcp|ai|copilot|assistant|tool-?call/i,
  },
  {
    id: 'antifraud-rule',
    name: 'antifraud-rule',
    desc: 'Konduto style transactional decisioning with feature store wiring and rule versioning.',
    lang: 'Python',
    framework: ['FastAPI', 'MLflow'],
    maturity: 'Stable',
    maintainer: PEOPLE.ana,
    usage: 37,
    version: '2.1.0',
    icon: 'shield',
    match: /fraud|konduto|decision|rule/i,
  },
  {
    id: 'kyc-flow',
    name: 'kyc-flow',
    desc: 'Identity proofing plus document verification orchestration for account opening.',
    lang: 'Go',
    framework: ['Hono', 'OTel'],
    maturity: 'Beta',
    maintainer: PEOPLE.bruno,
    usage: 18,
    version: '0.7.0',
    icon: 'user',
    match: /kyc|onboard|identity|document|proof/i,
  },
  {
    id: 'event-consumer',
    name: 'event-consumer',
    desc: 'Kafka consumer for bureau ingestion: idempotent, with dead letter and replay tooling pre baked.',
    lang: 'Go',
    framework: ['Kafka', 'OTel'],
    maturity: 'Stable',
    maintainer: PEOPLE.rafael,
    usage: 44,
    version: '2.3.4',
    icon: 'queue',
    match: /event|kafka|consum|ingest|stream|queue/i,
  },
  {
    id: 'shared-lib',
    name: 'shared-lib',
    desc: 'Versioned shared SDK/package published to the internal registry with semantic release.',
    lang: 'TypeScript',
    framework: ['tsup', 'changesets'],
    maturity: 'Stable',
    maintainer: PEOPLE.camila,
    usage: 29,
    version: '1.9.2',
    icon: 'package',
    match: /lib|sdk|package|shared|module/i,
  },
];

const RECENT: { id: string; when: string }[] = [
  { id: 'scoring-service', when: '4h ago' },
  { id: 'bureau-api', when: 'yesterday' },
  { id: 'antifraud-rule', when: '3d ago' },
  { id: 'event-consumer', when: '1w ago' },
];

const GUARANTEES = [
  { icon: 'lock', label: 'LGPD consent', note: 'consent-service plus legal basis' },
  { icon: 'activity', label: 'Observability', note: 'OpenTelemetry traces, metrics, logs' },
  { icon: 'pipeline', label: 'Golden CI/CD', note: 'Eidos quality gates plus ring deploys' },
  { icon: 'gauge', label: 'SLOs and alerts', note: 'p95, availability, error rate' },
  { icon: 'catalog', label: 'Catalog registration', note: 'auto registered, ownership wired' },
];

// Follows the example screens' ember usage (Stable = green, Beta = ember).
const MATURITY_TONE: Record<Maturity, 'success' | 'ember'> = { Stable: 'success', Beta: 'ember' };

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const getTemplate = (id: string) => TEMPLATES.find((t) => t.id === id);
const matchTemplate = (q: string) => TEMPLATES.find((t) => t.match.test(q))?.id ?? 'scoring-service';
const STAGGER = (i: number) => ({ animationDelay: `calc(var(--dur-stagger) * ${Math.min(i, 8)})` }) as React.CSSProperties;

type View = 'gallery' | 'wizard' | 'provision';

export default function TemplatesPage() {
  const [view, setView] = React.useState<View>('gallery');
  const [template, setTemplate] = React.useState<string>('scoring-service');
  const [aiOpen, setAiOpen] = React.useState(false);
  const [config, setConfig] = React.useState<ScaffoldConfig | null>(null);

  // Browser-back inside the page: entering the wizard pushes a history entry so
  // the browser Back button returns to the gallery instead of leaving the page.
  const enterWizard = (id: string) => {
    setTemplate(id);
    setView('wizard');
    setAiOpen(false);
    if (typeof window !== 'undefined') window.history.pushState({ forge: 'wizard' }, '');
  };
  const backToGallery = () => {
    if (typeof window !== 'undefined' && window.history.state?.forge) window.history.back();
    else setView('gallery');
  };
  React.useEffect(() => {
    const onPop = () => {
      setView('gallery');
      setConfig(null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return (
    <div className="page-enter">
      {view === 'gallery' && (
        <FPageHeader
          eyebrow="Self-service"
          title="Templates"
          subtitle="Owned, opinionated golden paths. Every template ships with LGPD, observability, CI/CD and SLOs already wired."
          actions={
            <>
              <Button type="button" variant="ghost" onClick={() => alert('Authoring guide')}>
                <Icons.book size={13} /> Authoring guide
              </Button>
              <Button type="button" variant="ember" onClick={() => setAiOpen(true)}>
                <Icons.sparkle size={13} /> Build with Forge AI
              </Button>
            </>
          }
        />
      )}

      {view === 'gallery' && <Gallery onUse={enterWizard} />}
      {view === 'wizard' && (
        <ConfigForm
          template={template}
          onCancel={backToGallery}
          onProvision={(c) => {
            setConfig(c);
            setView('provision');
          }}
        />
      )}
      {view === 'provision' && config && <Provisioning config={config} />}

      <ForgeAIDrawer open={aiOpen} onClose={() => setAiOpen(false)} onUse={enterWizard} />
    </div>
  );
}

// ── Gallery (example-style) ──────────────────────────────────────────────────
function Gallery({ onUse }: { onUse: (id: string) => void }) {
  const [query, setQuery] = React.useState('');
  const [lang, setLang] = React.useState('All languages');

  const filtered = TEMPLATES.filter((t) => {
    if (lang !== 'All languages' && t.lang !== lang) return false;
    if (query) {
      const q = query.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
    }
    return true;
  });
  const hero = TEMPLATES.find((t) => t.featured) ?? TEMPLATES[0];
  const langOptions = [
    { value: 'All languages', label: 'All languages' },
    ...['TypeScript', 'Go', 'Java', 'Python', 'Rust'].map((l) => ({ value: l, label: l })),
  ];

  return (
    <>
      {/* Hero: featured golden path (ember, like the example) */}
      <div className="fp-card fp-card--ember-hero" style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'center', flexWrap: 'wrap' }}>
        <IconBubble icon={hero.icon} size={52} tone="ember" solid />
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginBlockEnd: 4 }}>
            <span className="t-mono-label" style={{ color: 'var(--ember)' }}>Most used</span>
            <Pill tone="ember">v{hero.version}</Pill>
          </div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{hero.name}</div>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginBlockStart: 6, lineHeight: 1.55, maxWidth: 600 }}>{hero.desc}</div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBlockStart: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
            <OwnerPill person={hero.maintainer} role="Maintainer" />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg)' }}>{hero.usage}</span> scaffolds this quarter
            </span>
          </div>
        </div>
        <Button type="button" variant="outline" onClick={() => onUse(hero.id)}>
          <Icons.rocket size={13} /> Use template
        </Button>
      </div>

      {/* Filters: search + language — 12px gap, matched heights */}
      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--space-4)' }}>
        <div style={{ flex: 1, minWidth: 280, maxWidth: 460, display: 'flex' }}>
          <FSearch
            value={query}
            onChange={setQuery}
            placeholder="Filter by name, framework, language"
            aria-label="Filter templates"
            className="fluid"
          />
        </div>
        <span className="fp-filter-select">
          <Select value={lang} onValueChange={setLang} options={langOptions} />
        </span>
        <span style={{ marginInlineStart: 'auto', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
          {filtered.length} of {TEMPLATES.length} templates
        </span>
      </div>

      {/* Body: cards + sidebar */}
      <div className="fp-grid fp-grid-2x1" style={{ alignItems: 'start', gap: 'var(--space-4)' }}>
        <div>
          {filtered.length === 0 ? (
            <Banner tone="neutral" icon="search" title="No templates match" message="Try a different language, clear the filter, or build with Forge AI from the header." />
          ) : (
            <div className="fp-grid fp-grid-auto">
              {filtered.map((t, i) => {
                const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[t.icon] ?? Icons.package;
                return (
                  <div
                    key={t.id}
                    className="fp-card fade-in"
                    role="button"
                    tabIndex={0}
                    onClick={() => onUse(t.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onUse(t.id);
                      }
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', cursor: 'pointer', ...STAGGER(i) }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <IconBubble icon={t.icon} size={36} tone="ember">
                        <Icon size={16} />
                      </IconBubble>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 'var(--text-base)' }}>{t.name}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }}>v{t.version}</div>
                      </div>
                      <Pill tone={MATURITY_TONE[t.maturity]} dot>{t.maturity}</Pill>
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{t.desc}</p>
                    <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap', alignItems: 'center' }}>
                      <LangBadge lang={t.lang} />
                      {t.framework.slice(0, 2).map((f) => (<Chip key={f}>{f}</Chip>))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBlockStart: '1px solid var(--border)', paddingBlockStart: 'var(--space-2)', marginBlockStart: 'var(--space-1)' }}>
                      <OwnerPill person={t.maintainer} />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Icons.rocket size={11} /> {t.usage}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="fp-card">
            <div className="fp-card-head"><div className="fp-card-title">Every template includes</div></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {GUARANTEES.map((g) => {
                const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[g.icon] ?? Icons.check;
                return (
                  <div key={g.label} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--ember)', marginBlockStart: 1, flexShrink: 0 }}><Icon size={14} /></span>
                    <div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{g.label}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{g.note}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="fp-card">
            <div className="fp-card-head"><div className="fp-card-title">Recently used by me</div></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {RECENT.map((r) => {
                const tpl = getTemplate(r.id);
                if (!tpl) return null;
                const Ic = (Icons as Record<string, React.FC<{ size?: number }>>)[tpl.icon] ?? Icons.package;
                return (
                  <li key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Ic size={12} />
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', flex: 1 }}>{tpl.name}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{r.when}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Configure: one long form (AWS-style), no step wizard ─────────────────────
type ScaffoldConfig = { template: string; name: string; product: string; visibility: string; access: Person[] };

function ConfigForm({ template, onCancel, onProvision }: { template: string; onCancel: () => void; onProvision: (c: ScaffoldConfig) => void }) {
  const [name, setName] = React.useState('');
  const [product, setProduct] = React.useState(PRODUCTS[0]);
  const [visibility, setVisibility] = React.useState('internal');
  const [access, setAccess] = React.useState<Person[]>([PEOPLE.camila, PEOPLE.bruno]);

  const tpl = getTemplate(template)!;
  const repoSlug = name ? slug(name) : 'my-new-service';
  const repoPath = `forge/${slug(product)}/${repoSlug}`;
  const TplIcon = (Icons as Record<string, React.FC<{ size?: number }>>)[tpl.icon] ?? Icons.package;
  const canProvision = name.trim().length > 1 && access.length >= 2;

  return (
    <>
      {/* Back link above the title (in place of the eyebrow) */}
      <div style={{ marginBlockEnd: 'var(--space-2)' }}>
        <Button type="button" variant="ghost" onClick={onCancel} style={{ marginInlineStart: -8 }}>
          <Icons.chevronLeft size={13} /> Back to templates
        </Button>
      </div>
      <FPageHeader
        title="Scaffold a new service"
        subtitle={<>From the <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg)' }}>{tpl.name}</span> golden path</>}
      />

      <div className="fp-grid fp-grid-2x1" style={{ alignItems: 'start', gap: 'var(--space-4)', marginBlockStart: 'var(--space-4)' }}>
        {/* Form card */}
        <div className="fp-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Template context row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', paddingBlockEnd: 'var(--space-4)', borderBlockEnd: '1px solid var(--border)' }}>
            <IconBubble icon={tpl.icon} size={32} tone="ember"><TplIcon size={14} /></IconBubble>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>Template </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{tpl.name} <span style={{ color: 'var(--fg-faint)' }}>v{tpl.version}</span></span>
            </div>
            <Pill tone={MATURITY_TONE[tpl.maturity]} dot>{tpl.maturity}</Pill>
          </div>

          {/* Service details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 560 }}>
            <div style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>Service details</div>
            <Input label="Service name" value={name} onChange={(e) => setName(e.target.value)} placeholder="my-new-service" help={`Creates ${repoPath}`} />
            <Select width="100%" label="Product" help="The product this service belongs to. Ownership can move between teams; the product stays." value={product} onValueChange={setProduct} options={PRODUCTS.map((p) => ({ value: p, label: p }))} />
          </div>

          <div style={{ borderBlockStart: '1px solid var(--border)' }} />

          {/* Access */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>Access</div>
            <div className="in-field">
              <label className="in-label">Visibility</label>
              <ToggleGroup type="single" variant="default" value={visibility} onValueChange={(v) => v && setVisibility(v as string)}>
                <ToggleGroupItem value="internal">Internal</ToggleGroupItem>
                <ToggleGroupItem value="restricted">Restricted</ToggleGroupItem>
                <ToggleGroupItem value="public">Public</ToggleGroupItem>
              </ToggleGroup>
              {visibility === 'public' && (
                <Banner tone="warning" icon="shield" title="Regulated data needs a security review" message="This product handles financial or identity data. Public visibility triggers a mandatory review before the repo is created." />
              )}
            </div>
            <div className="in-field">
              <label className="in-label">People with access</label>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>Repo write, PR reviews and on-call escalations. At least 2 required.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxWidth: 560 }}>
                {access.map((p) => (
                  <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', paddingBlock: 'var(--space-2)', borderBlockEnd: '1px solid var(--border)' }}>
                    <OwnerPill person={p} />
                    <span style={{ marginInlineStart: 'auto', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>{p.role}</span>
                    <Button type="button" variant="ghost" size="sm" aria-label={`Remove ${p.name}`} onClick={() => setAccess((a) => a.filter((x) => x.name !== p.name))}>
                      <Icons.x size={12} />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="ghost" size="sm" style={{ alignSelf: 'flex-start', marginBlockStart: 'var(--space-1)' }} onClick={() => setAccess((a) => [...a, PEOPLE.larissa, PEOPLE.rafael, PEOPLE.ana].filter((p, i, arr) => arr.findIndex((x) => x.name === p.name) === i).slice(0, 4))}>
                  <Icons.plus size={12} /> Add person
                </Button>
              </div>
            </div>
          </div>

          {/* Actions inside the form card */}
          <div style={{ marginBlockStart: 'var(--space-1)', paddingBlockStart: 'var(--space-4)', borderBlockStart: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
            {!canProvision && (
              <span style={{ marginInlineEnd: 'auto', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>Set a service name and at least 2 people with access.</span>
            )}
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="button" variant="ember" disabled={!canProvision} onClick={() => onProvision({ template, name: repoSlug, product, visibility, access })}>
              <Icons.rocket size={13} /> Provision service
            </Button>
          </div>
        </div>

        {/* Summary card */}
        <aside style={{ position: 'sticky', insetBlockStart: 'var(--space-4)' }}>
          <div className="fp-card">
            <div className="t-mono-label" style={{ marginBlockEnd: 'var(--space-3)' }}>Summary</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Row label="Template" value={<span style={{ fontFamily: 'var(--font-mono)' }}>{tpl.name}</span>} />
              <Row label="Repository" value={<span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--ember)' }}>{repoPath}</span>} />
              <Row label="Product" value={<Pill tone="ember">{product}</Pill>} />
              <Row label="Visibility" value={<Pill tone="neutral">{visibility}</Pill>} />
              <Row label="Access" value={<span style={{ fontFamily: 'var(--font-mono)' }}>{access.length} people</span>} />
            </div>
            <div style={{ marginBlockStart: 'var(--space-3)', paddingBlockStart: 'var(--space-3)', borderBlockStart: '1px solid var(--border)' }}>
              <div className="t-mono-label" style={{ marginBlockEnd: 'var(--space-2)' }}>Forge will</div>
              {['Create the repo and open a PR', 'Run CI and build the image', 'Register p95 and availability SLOs', 'Add the service to the catalog'].map((s) => (
                <div key={s} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', paddingBlock: 'var(--space-1)' }}>
                  <Icons.check size={13} style={{ color: 'var(--ember)', flexShrink: 0 } as React.CSSProperties} /> {s}
                </div>
              ))}
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', marginBlockStart: 'var(--space-2)' }}>About 90 seconds</div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <span className="t-mono-label" style={{ minWidth: 96 }}>{label}</span>
      <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-1)', flexWrap: 'wrap' }}>{value}</span>
    </div>
  );
}

// ── Provisioning screen: live steps + logs + elapsed timer ───────────────────
type LogLine = { t: string; level: 'info' | 'ok' | 'warn'; msg: string };
const PROVISION_STEPS: { label: string; logs: { level: LogLine['level']; msg: string }[] }[] = [
  { label: 'Create repository', logs: [
    { level: 'info', msg: 'Initializing repository' },
    { level: 'info', msg: 'Applying template' },
    { level: 'ok', msg: 'Pushed initial commit (23 files)' },
  ] },
  { label: 'Open pull request', logs: [
    { level: 'info', msg: 'Opened PR #1 (scaffold)' },
    { level: 'ok', msg: 'Review requested from owners' },
  ] },
  { label: 'Run CI', logs: [
    { level: 'info', msg: 'Build started' },
    { level: 'ok', msg: 'Lint passed' },
    { level: 'ok', msg: 'Unit tests 18/18 passed' },
    { level: 'ok', msg: 'Container image built' },
  ] },
  { label: 'Register SLOs', logs: [
    { level: 'ok', msg: 'p95 latency SLO created' },
    { level: 'ok', msg: 'Availability 99.9% SLO created' },
  ] },
  { label: 'Register in catalog', logs: [
    { level: 'ok', msg: 'Service registered' },
    { level: 'ok', msg: 'Ownership and dashboards wired' },
  ] },
];

function Provisioning({ config }: { config: ScaffoldConfig }) {
  const router = useRouter();
  const tpl = getTemplate(config.template)!;
  const repoPath = `forge/${slug(config.product)}/${config.name}`;
  const [seconds, setSeconds] = React.useState(0);
  const [done, setDone] = React.useState(0); // index of next step to run
  const [logs, setLogs] = React.useState<LogLine[]>([]);
  const logEnd = React.useRef<HTMLDivElement>(null);
  const tick = React.useRef(0);

  const complete = done >= PROVISION_STEPS.length;

  // Elapsed timer (counter, not Date.now, so SSR/CSR never diverge).
  React.useEffect(() => {
    if (complete) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [complete]);

  // Step + log machine: advance one log every ~700ms, complete a step after its logs.
  React.useEffect(() => {
    if (complete) return;
    const stepLogs = PROVISION_STEPS[done].logs;
    const id = setInterval(() => {
      tick.current += 1;
      const line = stepLogs[tick.current - 1];
      const mm = Math.floor(tick.current / 60);
      const stamp = `${String(mm).padStart(2, '0')}:${String((done * 6 + tick.current) % 60).padStart(2, '0')}`;
      if (line) setLogs((l) => [...l, { t: stamp, level: line.level, msg: `[${PROVISION_STEPS[done].label}] ${line.msg}` }]);
      if (tick.current >= stepLogs.length) {
        tick.current = 0;
        setDone((d) => d + 1);
      }
    }, 700);
    return () => clearInterval(id);
  }, [done, complete]);

  React.useEffect(() => {
    logEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [logs]);

  const stepper = PROVISION_STEPS.map((s, i) => ({
    id: s.label,
    label: s.label,
    status: i < done ? 'pass' : i === done && !complete ? 'running' : complete ? 'pass' : 'pending',
  }));
  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className="fade-in">
      <FPageHeaderlessTitle
        repoPath={repoPath}
        complete={complete}
        elapsed={mmss}
      />

      <div className="fp-card fp-steps" style={{ margin: 'var(--space-4) 0' }}>
        <Pipeline variant="stepper" steps={stepper} currentIndex={complete ? PROVISION_STEPS.length - 1 : done} />
      </div>

      {/* Live log stream */}
      <div className="fp-card" style={{ padding: 0 }}>
        <div className="fp-card-head" style={{ padding: 'var(--space-3) var(--space-4)' }}>
          <div className="fp-card-title">Provisioning log</div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
            <Icons.clock size={12} /> {mmss}
          </span>
        </div>
        <div style={{ maxHeight: 320, overflowY: 'auto', padding: 'var(--space-3) var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', lineHeight: 1.8, background: 'var(--bg)' }}>
          {logs.map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <span style={{ color: 'var(--fg-faint)', flexShrink: 0 }}>{l.t}</span>
              <StatusDot tone={l.level === 'ok' ? 'up' : l.level === 'warn' ? 'degraded' : 'info'} size="sm" />
              <span style={{ color: l.level === 'ok' ? 'var(--fg)' : 'var(--fg-muted)' }}>{l.msg}</span>
            </div>
          ))}
          {!complete && (
            <div style={{ display: 'flex', gap: 'var(--space-3)', color: 'var(--fg-muted)' }}>
              <span style={{ color: 'var(--fg-faint)', flexShrink: 0 }}>{mmss}</span>
              <span className="ai-caret" aria-hidden="true" />
            </div>
          )}
          <div ref={logEnd} />
        </div>
      </div>

      {complete && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBlockStart: 'var(--space-4)' }}>
          <Button type="button" variant="ember" onClick={() => router.push(`/portal/catalog/${config.name}`)}>
            <Icons.server size={13} /> Open service
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push('/portal/catalog')}>
            <Icons.catalog size={13} /> Back to catalog
          </Button>
        </div>
      )}
    </div>
  );
}

function FPageHeaderlessTitle({ repoPath, complete, elapsed }: { repoPath: string; complete: boolean; elapsed: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <IconBubble icon={complete ? 'check' : 'rocket'} size={40} tone={complete ? 'ember' : 'ember'} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="t-mono-label" style={{ color: 'var(--ember)' }}>{complete ? 'Provisioned' : 'Provisioning'}</div>
        <h1 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{repoPath}</h1>
      </div>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {complete ? <Pill tone="success" dot>Done</Pill> : <Pill tone="ember"><span className="dot" /> Running · {elapsed}</Pill>}
      </span>
    </div>
  );
}

// ── Forge AI drawer: chat to build a project ─────────────────────────────────
type ChatMsg = { id: string; role: 'ai' | 'user'; node: React.ReactNode };

function ForgeAIDrawer({ open, onClose, onUse }: { open: boolean; onClose: () => void; onUse: (id: string) => void }) {
  const [messages, setMessages] = React.useState<ChatMsg[]>([]);
  const [input, setInput] = React.useState('');
  const counter = React.useRef(0);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ id: 'greet', role: 'ai', node: 'Tell me what you want to build and I will pick the golden path and pre fill the scaffold. For example: "a Go API that returns a credit score for a CPF".' }]);
    }
  }, [open, messages.length]);
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const ask = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const id = getTemplate(matchTemplate(t))!;
    setMessages((m) => [
      ...m,
      { id: `u${++counter.current}`, role: 'user', node: t },
      {
        id: `a${++counter.current}`,
        role: 'ai',
        node: (
          <>
            <p style={{ margin: '0 0 8px' }}>The <strong>{id.name}</strong> golden path fits. It ships LGPD consent, observability, CI/CD and SLOs. I pre filled the scaffold for you.</p>
            <Button type="button" variant="ember" size="sm" onClick={() => onUse(id.id)}>
              <Icons.rocket size={12} /> Use {id.name}
            </Button>
          </>
        ),
      },
    ]);
    setInput('');
  };

  return (
    <Drawer open={open} side="right" title="Build with Forge AI" desc="Describe a service, get the right golden path" onClose={onClose} style={{ '--dr-w': '420px' } as React.CSSProperties}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', minHeight: 0 }}>
        {messages.map((m) =>
          m.role === 'ai' ? (
            <div key={m.id} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
              <IconBubble icon="sparkle" size={28} tone="ember" />
              <div className="fp-card" style={{ flex: 1, fontSize: 'var(--text-sm)', lineHeight: 1.55 }}>{m.node}</div>
            </div>
          ) : (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ background: 'var(--ember-soft)', border: '1px solid color-mix(in oklch, var(--ember) 22%, transparent)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-sm)', maxWidth: '85%' }}>{m.node}</div>
            </div>
          ),
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="in-group"
        style={{ marginBlockStart: 'var(--space-3)' }}
      >
        <span className="in-addon icon"><Icons.sparkle size={14} /></span>
        <input className="in-control" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe what you want to build" aria-label="Message Forge AI" />
        <Button type="submit" variant="ember" size="sm" disabled={!input.trim()} style={{ margin: 4 }}>
          <Icons.chevronRight size={13} />
        </Button>
      </form>
    </Drawer>
  );
}
