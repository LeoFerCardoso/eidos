// Forge (IDP Portal) — API catalog (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/apis — the global listing of every API the bureau exposes,
// grouped by product and service. Each API links back to its owning service in
// the catalog. Mock but consistent.

export type ApiKind = 'REST' | 'gRPC' | 'GraphQL' | 'Webhook' | 'Event';
export type ApiVisibility = 'public' | 'partner' | 'internal';
export type ApiStatus = 'stable' | 'beta' | 'deprecated';

export interface Api {
  id: string;
  name: string;
  desc: string;
  service: string;
  product: string;
  kind: ApiKind;
  version: string;
  consumers: number;
  p95: number;
  visibility: ApiVisibility;
  status: ApiStatus;
  owner: string;
}

export const PRODUCTS = ['Score & Risk', 'Anti-Fraud', 'Identity', 'Data & Bureau', 'Decisioning', 'Platform', 'Recovery'];

export const APIS: Api[] = [
  { id: 'acerta-consulta',   name: 'Acerta Consulta',        desc: 'CPF/CNPJ credit consultation by document.',      service: 'acerta-api',         product: 'Score & Risk',  kind: 'REST',    version: 'v4',   consumers: 142, p95: 138, visibility: 'public',   status: 'stable',     owner: 'Rafael Mendonça' },
  { id: 'onescore',          name: 'OneScore',               desc: 'Unified credit score for PF and PJ.',            service: 'onescore-gateway',   product: 'Score & Risk',  kind: 'REST',    version: 'v2',   consumers: 96,  p95: 92,  visibility: 'public',   status: 'stable',     owner: 'Thiago Albuquerque' },
  { id: 'score-grpc',        name: 'Score Engine RPC',       desc: 'Low-latency scoring for internal callers.',      service: 'score-engine',       product: 'Score & Risk',  kind: 'gRPC',    version: 'v7',   consumers: 8,   p95: 24,  visibility: 'internal', status: 'stable',     owner: 'Thiago Albuquerque' },
  { id: 'risk-events',       name: 'Risk Events',            desc: 'Streamed risk decisions for downstream.',        service: 'risk-monitor',       product: 'Score & Risk',  kind: 'Event',   version: 'v1',   consumers: 12,  p95: 0,   visibility: 'internal', status: 'beta',       owner: 'Thiago Albuquerque' },
  { id: 'konduto-decision',  name: 'Konduto Decision',       desc: 'Antifraud decision for a transaction.',          service: 'konduto-antifraud',  product: 'Anti-Fraud',    kind: 'REST',    version: 'v3',   consumers: 64,  p95: 71,  visibility: 'public',   status: 'stable',     owner: 'Beatriz Okamoto' },
  { id: 'device-fp',         name: 'Device Fingerprint',     desc: 'Device reputation and fingerprint lookup.',      service: 'device-fingerprint', product: 'Anti-Fraud',    kind: 'REST',    version: 'v2',   consumers: 31,  p95: 44,  visibility: 'partner',  status: 'stable',     owner: 'Beatriz Okamoto' },
  { id: 'chargeback-hook',   name: 'Chargeback Webhook',     desc: 'Posts chargeback classifications to partners.',  service: 'chargeback-classifier', product: 'Anti-Fraud', kind: 'Webhook', version: 'v1',   consumers: 18,  p95: 0,   visibility: 'partner',  status: 'stable',     owner: 'Beatriz Okamoto' },
  { id: 'identity-proof',    name: 'Identity Proofing',      desc: 'KYC step-up and document verification.',         service: 'identity-proofing',  product: 'Identity',      kind: 'REST',    version: 'v3',   consumers: 47,  p95: 210, visibility: 'public',   status: 'stable',     owner: 'Camila Tanaka' },
  { id: 'ocr-grpc',          name: 'Document OCR RPC',       desc: 'Extracts fields from uploaded documents.',       service: 'document-ocr',       product: 'Identity',      kind: 'gRPC',    version: 'v3',   consumers: 6,   p95: 880, visibility: 'internal', status: 'stable',     owner: 'Camila Tanaka' },
  { id: 'biometric',         name: 'Biometric Match',        desc: 'Face match against the document photo.',         service: 'biometric-match',    product: 'Identity',      kind: 'REST',    version: 'v1',   consumers: 9,   p95: 320, visibility: 'internal', status: 'beta',       owner: 'Camila Tanaka' },
  { id: 'scpc',              name: 'SCPC Gateway',           desc: 'SCPC bureau queries and negativation.',          service: 'scpc-gateway',       product: 'Data & Bureau', kind: 'REST',    version: 'v5',   consumers: 88,  p95: 162, visibility: 'public',   status: 'stable',     owner: 'Diego Vasquez' },
  { id: 'cadastro-positivo', name: 'Cadastro Positivo',      desc: 'Positive registry ingestion and reads.',         service: 'cadastro-positivo-ingestor', product: 'Data & Bureau', kind: 'REST', version: 'v2', consumers: 22,  p95: 140, visibility: 'partner',  status: 'stable',     owner: 'Diego Vasquez' },
  { id: 'bureau-graphql',    name: 'Bureau Graph',           desc: 'GraphQL over the unified bureau entity graph.',  service: 'bureau-ingestion',   product: 'Data & Bureau', kind: 'GraphQL', version: 'v1',   consumers: 14,  p95: 96,  visibility: 'internal', status: 'beta',       owner: 'Diego Vasquez' },
  { id: 'negativation',      name: 'Negativation Writer',    desc: 'Writes debt negativation records.',              service: 'negativation-writer',product: 'Data & Bureau', kind: 'REST',    version: 'v1',   consumers: 5,   p95: 110, visibility: 'internal', status: 'deprecated', owner: 'Diego Vasquez' },
  { id: 'decision',          name: 'Decision Engine',        desc: 'Runs decisioning policies on an applicant.',     service: 'decision-engine',    product: 'Decisioning',   kind: 'REST',    version: 'v6',   consumers: 38,  p95: 88,  visibility: 'public',   status: 'stable',     owner: 'Thiago Albuquerque' },
  { id: 'interconnect',      name: 'InterConnect Adapter',   desc: 'Legacy decisioning bridge for partners.',        service: 'interconnect-adapter',product: 'Decisioning',  kind: 'REST',    version: 'v2',   consumers: 11,  p95: 240, visibility: 'partner',  status: 'deprecated', owner: 'Thiago Albuquerque' },
  { id: 'consent',           name: 'Consent Service',        desc: 'LGPD consent scope reads and writes.',           service: 'consent-service',    product: 'Platform',      kind: 'REST',    version: 'v2',   consumers: 54,  p95: 36,  visibility: 'internal', status: 'stable',     owner: 'Larissa Fontana' },
  { id: 'webhook-dispatch',  name: 'Webhook Dispatcher',     desc: 'Fan-out events to partner endpoints.',           service: 'webhook-dispatcher', product: 'Platform',      kind: 'Webhook', version: 'v3',   consumers: 27,  p95: 0,   visibility: 'partner',  status: 'stable',     owner: 'Larissa Fontana' },
];

export const KIND_TONE: Record<ApiKind, 'ember' | 'ice' | 'health-up' | 'warning' | 'neutral'> = {
  REST: 'ember',
  gRPC: 'ice',
  GraphQL: 'health-up',
  Webhook: 'warning',
  Event: 'neutral',
};

export const VIS_TONE: Record<ApiVisibility, 'ember' | 'ice' | 'neutral'> = {
  public: 'ember',
  partner: 'ice',
  internal: 'neutral',
};

export const STATUS_TONE: Record<ApiStatus, { label: string; tone: 'health-up' | 'ice' | 'warning' }> = {
  stable: { label: 'Stable', tone: 'health-up' },
  beta: { label: 'Beta', tone: 'ice' },
  deprecated: { label: 'Deprecated', tone: 'warning' },
};

export const KPIS = [
  { id: 'total', label: 'APIs', value: String(APIS.length), note: `Across ${PRODUCTS.length} products.` },
  { id: 'public', label: 'Public', value: String(APIS.filter((a) => a.visibility === 'public').length), note: 'Externally consumable.' },
  { id: 'deprecated', label: 'Deprecated', value: String(APIS.filter((a) => a.status === 'deprecated').length), note: 'Plan migrations off these.' },
  { id: 'consumers', label: 'Total consumers', value: String(APIS.reduce((m, a) => m + a.consumers, 0)), note: 'Registered integrations.' },
];
