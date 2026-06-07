// Forge (IDP Portal) — Architecture records (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/architecture — the Architecture Decision Records the company
// follows (and that ground the agents) plus the catalog of architecture
// diagrams. Separate from architecture.ts (the AI-Insights topology graph).
// Mock but consistent.

export type AdrStatus = 'accepted' | 'proposed' | 'superseded' | 'deprecated';

export interface Adr {
  id: string;
  title: string;
  status: AdrStatus;
  date: string;
  owner: string;
  tags: string[];
  context: string;
  supersedes?: string;
}

export const ADRS: Adr[] = [
  { id: 'ADR-0042', title: 'All PII must be redacted before logs', status: 'accepted', date: '2026-05-18', owner: 'Larissa Fontana', tags: ['security', 'lgpd'], context: 'CPF/CNPJ may never reach a log sink unredacted.' },
  { id: 'ADR-0041', title: 'gRPC for internal service-to-service calls', status: 'accepted', date: '2026-05-02', owner: 'Thiago Albuquerque', tags: ['api', 'platform'], context: 'Internal calls use gRPC; REST is for external surfaces only.' },
  { id: 'ADR-0040', title: 'Ring-based progressive delivery for all deploys', status: 'accepted', date: '2026-04-21', owner: 'Larissa Fontana', tags: ['delivery', 'reliability'], context: 'Every production deploy advances through rings 0 to 4 with canary gates.' },
  { id: 'ADR-0039', title: 'Snowflake as the single analytical store', status: 'accepted', date: '2026-04-09', owner: 'Diego Vasquez', tags: ['data'], context: 'New analytical workloads land in Snowflake, not bespoke warehouses.', supersedes: 'ADR-0021' },
  { id: 'ADR-0038', title: 'Consent check required before any PII read', status: 'accepted', date: '2026-03-30', owner: 'Camila Tanaka', tags: ['security', 'lgpd'], context: 'Services and agents must validate consent scope before reading PII.' },
  { id: 'ADR-0037', title: 'Idempotency keys on all write endpoints', status: 'accepted', date: '2026-03-12', owner: 'Rafael Mendonça', tags: ['api', 'reliability'], context: 'Write APIs accept an idempotency key to make retries safe.' },
  { id: 'ADR-0043', title: 'Agents must call systems via MCP, not direct SDKs', status: 'proposed', date: '2026-06-01', owner: 'Leonardo Cardoso', tags: ['ai', 'platform'], context: 'Agent tool access is mediated by MCP servers for audit and least privilege.' },
  { id: 'ADR-0044', title: 'Adopt OpenTelemetry as the only tracing standard', status: 'proposed', date: '2026-06-04', owner: 'Larissa Fontana', tags: ['observability'], context: 'Standardize all tracing on OTel; retire vendor agents.' },
  { id: 'ADR-0021', title: 'BigQuery for ad-hoc analytics', status: 'superseded', date: '2025-09-15', owner: 'Diego Vasquez', tags: ['data'], context: 'Superseded by ADR-0039 in favor of Snowflake.' },
  { id: 'ADR-0014', title: 'SOAP bus for partner decisioning', status: 'deprecated', date: '2025-05-20', owner: 'Thiago Albuquerque', tags: ['decisioning', 'legacy'], context: 'Legacy SOAP integration; migrate partners to REST.' },
];

export const ADR_STATUS_META: Record<AdrStatus, { label: string; tone: 'health-up' | 'ice' | 'neutral' | 'warning' }> = {
  accepted: { label: 'Accepted', tone: 'health-up' },
  proposed: { label: 'Proposed', tone: 'ice' },
  superseded: { label: 'Superseded', tone: 'neutral' },
  deprecated: { label: 'Deprecated', tone: 'warning' },
};

export type DiagramType = 'Solution' | 'Data flow' | 'Context' | 'ERD' | 'Sequence' | 'Component';

export interface Diagram {
  id: string;
  title: string;
  type: DiagramType;
  scope: string;
  format: 'Mermaid' | 'Excalidraw' | 'C4';
  updated: string;
  owner: string;
}

export const DIAGRAM_ICON: Record<DiagramType, string> = {
  Solution: 'layers',
  'Data flow': 'activity',
  Context: 'globe',
  ERD: 'database',
  Sequence: 'gitPullRequest',
  Component: 'package',
};

export const DIAGRAMS: Diagram[] = [
  { id: 'd-credit-solution', title: 'Credit consultation, end to end', type: 'Solution', scope: 'Score & Risk',  format: 'C4',         updated: '3 days ago',  owner: 'Thiago Albuquerque' },
  { id: 'd-bureau-context',  title: 'Bureau platform system context',  type: 'Context',  scope: 'Platform',     format: 'C4',         updated: '1 week ago',  owner: 'Diego Vasquez' },
  { id: 'd-pii-dataflow',    title: 'PII data flow and consent gates',  type: 'Data flow',scope: 'Compliance',   format: 'Mermaid',    updated: '5 days ago',  owner: 'Camila Tanaka' },
  { id: 'd-score-erd',       title: 'Score feature store schema',       type: 'ERD',      scope: 'Data & Bureau',format: 'Mermaid',    updated: '2 weeks ago', owner: 'Diego Vasquez' },
  { id: 'd-auth-sequence',   title: 'Biometric step-up auth sequence',  type: 'Sequence', scope: 'Identity',     format: 'Mermaid',    updated: '4 days ago',  owner: 'Camila Tanaka' },
  { id: 'd-fraud-components', title: 'Antifraud decision components',   type: 'Component',scope: 'Anti-Fraud',   format: 'Excalidraw', updated: '1 week ago',  owner: 'Beatriz Okamoto' },
  { id: 'd-deploy-dataflow', title: 'Ring deploy and rollback flow',    type: 'Data flow',scope: 'Platform',     format: 'Mermaid',    updated: '6 days ago',  owner: 'Larissa Fontana' },
  { id: 'd-onescore-solution', title: 'OneScore PJ solution design',    type: 'Solution', scope: 'Score & Risk', format: 'C4',         updated: '2 days ago',  owner: 'Thiago Albuquerque' },
];

export const KPIS = [
  { id: 'accepted', label: 'Accepted ADRs', value: String(ADRS.filter((a) => a.status === 'accepted').length), note: 'In force across the org.' },
  { id: 'proposed', label: 'Proposed', value: String(ADRS.filter((a) => a.status === 'proposed').length), note: 'Open for review.' },
  { id: 'diagrams', label: 'Diagrams', value: String(DIAGRAMS.length), note: 'Across 6 types.' },
  { id: 'agents', label: 'Used by agents', value: String(ADRS.filter((a) => a.status === 'accepted').length), note: 'ADRs ground agent decisions.' },
];

export const AI_READ = {
  title: 'Decisions agents enforce',
  body: 'Every accepted ADR is loaded as a context for the platform agents, so they refuse changes that violate one. ADR-0043 (agents call systems via MCP, not direct SDKs) is still proposed but already shapes the MCP server catalog. Accepting it would let Forge auto-flag any agent wired to a direct SDK during review.',
};
