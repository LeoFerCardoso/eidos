// Forge (IDP Portal) — domain data (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; this product/portal = "Forge".
//
// Realistic internal services for a credit-bureau engineering org. These back
// the Software Catalog and Service-detail pages. The shape extends the DS
// `ServiceData` (name · version · deploys · alert · lang · p95) with the extra
// fields the catalog/detail surfaces need (tribe · coverage · summary ·
// deps · apis). Langs are limited to those LangBadge paints:
// TypeScript · Go · Java · Python · Rust.
//
// Domain vocabulary sourced from Equifax / Boa Vista product lines: SCPC,
// Acerta (consulta CPF), Cadastro Positivo, Konduto (antifraude), InterConnect
// (decisioning), Ignite (analytics/feature store), OneScore.

export type Lang = 'TypeScript' | 'Go' | 'Java' | 'Python' | 'Rust';
export type Tribe =
  | 'Score & Risk'
  | 'Anti-Fraud'
  | 'Identity'
  | 'Data & Bureau'
  | 'Decisioning'
  | 'Platform'
  | 'Recovery';

export interface PortalService {
  id: string;
  name: string;
  lang: Lang;
  tribe: Tribe;
  /** p95 latency in ms. */
  p95: number;
  /** test coverage, %. */
  coverage: number;
  version: string;
  /** human "last deploy" label. */
  deploys: string;
  /** true → degraded, paints the HealthBadge red + pulse. */
  alert?: boolean;
  /** one-line purpose. */
  summary: string;
  /** ids of services this one depends on. */
  deps?: string[];
  /** public API products this service exposes. */
  apis?: string[];
  /** owning squad. */
  squad: string;
  /** does it touch personal data → LGPD-in-scope. */
  pii?: boolean;
}

export const SERVICES: PortalService[] = [
  // ── Score & Risk ──────────────────────────────────────────────────────────
  {
    id: 'acerta-api',
    name: 'acerta-api',
    lang: 'Go',
    tribe: 'Score & Risk',
    p95: 240,
    coverage: 86,
    version: '4.12.0',
    deploys: '2h ago',
    alert: true,
    summary:
      'CPF/CNPJ query (Acerta) — orchestrates registration data, restrictions, credit score, and estimated income in a single call.',
    deps: ['score-engine', 'scpc-gateway', 'consent-service', 'konduto-antifraud'],
    apis: ['Acerta Essential', 'Acerta Plus', 'Acerta Complete'],
    squad: 'Squad Query',
    pii: true,
  },
  {
    id: 'score-engine',
    name: 'score-engine',
    lang: 'Java',
    tribe: 'Score & Risk',
    p95: 85,
    coverage: 91,
    version: '7.3.1',
    deploys: '1d ago',
    summary: 'Risk score engine (0–1000) over Cadastro Positivo + credit history.',
    deps: ['ignite-feature-store', 'scpc-gateway'],
    apis: ['OneScore', 'Score PF', 'Score PJ'],
    squad: 'Squad Models',
    pii: true,
  },
  {
    id: 'ignite-feature-store',
    name: 'ignite-feature-store',
    lang: 'Python',
    tribe: 'Score & Risk',
    p95: 70,
    coverage: 82,
    version: '1.14.0',
    deploys: '6d ago',
    summary: 'Feature store (Ignite) — attributes and variables that feed the score and fraud models.',
    deps: ['bureau-ingestion'],
    squad: 'Squad Models',
  },
  {
    id: 'onescore-gateway',
    name: 'onescore-gateway',
    lang: 'Go',
    tribe: 'Score & Risk',
    p95: 92,
    coverage: 88,
    version: '2.5.0',
    deploys: '3h ago',
    summary: 'Unified scoring gateway — routes PF/PJ score requests to the appropriate model and version.',
    deps: ['score-engine'],
    apis: ['OneScore Gateway'],
    squad: 'Squad Models',
    pii: true,
  },
  {
    id: 'risk-monitor',
    name: 'risk-monitor',
    lang: 'Python',
    tribe: 'Score & Risk',
    p95: 55,
    coverage: 81,
    version: '1.3.2',
    deploys: '5d ago',
    summary: 'Real-time risk monitoring — watches score distribution drift and fires SLO breach alerts.',
    deps: ['score-engine', 'ignite-feature-store'],
    squad: 'Squad Models',
  },

  // ── Anti-Fraud ────────────────────────────────────────────────────────────
  {
    id: 'konduto-antifraud',
    name: 'konduto-antifraud',
    lang: 'Python',
    tribe: 'Anti-Fraud',
    p95: 95,
    coverage: 84,
    version: '3.1.7',
    deploys: '5h ago',
    alert: true,
    summary: 'Transactional anti-fraud decision (Konduto) — pre- and post-authorization, with fraud score.',
    deps: ['ignite-feature-store', 'identity-proofing'],
    apis: ['Transactional Anti-Fraud'],
    squad: 'Squad Fraud',
    pii: true,
  },
  {
    id: 'device-fingerprint',
    name: 'device-fingerprint',
    lang: 'TypeScript',
    tribe: 'Anti-Fraud',
    p95: 60,
    coverage: 85,
    version: '1.7.0',
    deploys: '2d ago',
    summary: 'Device fingerprinting — collects and hashes browser/app signals to detect returning fraudulent actors.',
    apis: ['Device ID API'],
    squad: 'Squad Fraud',
    pii: true,
  },
  {
    id: 'velocity-check',
    name: 'velocity-check',
    lang: 'Go',
    tribe: 'Anti-Fraud',
    p95: 38,
    coverage: 90,
    version: '3.0.1',
    deploys: '1d ago',
    summary: 'Velocity rules engine — detects abnormal request frequency patterns per CPF/IP/device.',
    deps: ['device-fingerprint'],
    squad: 'Squad Fraud',
  },
  {
    id: 'chargeback-classifier',
    name: 'chargeback-classifier',
    lang: 'Python',
    tribe: 'Anti-Fraud',
    p95: 120,
    coverage: 77,
    version: '2.1.0',
    deploys: '7d ago',
    summary: 'Chargeback classifier — ML model that predicts dispute likelihood before authorization.',
    deps: ['ignite-feature-store', 'konduto-antifraud'],
    squad: 'Squad Fraud',
    pii: true,
  },

  // ── Identity ──────────────────────────────────────────────────────────────
  {
    id: 'identity-proofing',
    name: 'identity-proofing',
    lang: 'Go',
    tribe: 'Identity',
    p95: 130,
    coverage: 87,
    version: '2.8.0',
    deploys: '2d ago',
    summary: 'Onboarding / KYC — identity verification, proofing, and red-flags for account opening.',
    deps: ['consent-service', 'scpc-gateway'],
    apis: ['Identity Proofing', 'Document Verification'],
    squad: 'Squad Identity',
    pii: true,
  },
  {
    id: 'document-ocr',
    name: 'document-ocr',
    lang: 'Python',
    tribe: 'Identity',
    p95: 850,
    coverage: 72,
    version: '1.4.0',
    deploys: '4d ago',
    summary: 'Document OCR pipeline — extracts and validates data from RG/CNH images for KYC flows.',
    deps: ['identity-proofing'],
    squad: 'Squad Identity',
    pii: true,
  },
  {
    id: 'biometric-match',
    name: 'biometric-match',
    lang: 'Go',
    tribe: 'Identity',
    p95: 310,
    coverage: 84,
    version: '2.0.0',
    deploys: '6d ago',
    summary: 'Biometric matching — liveness check and face-match against government databases.',
    deps: ['identity-proofing', 'document-ocr'],
    apis: ['Biometric Verification'],
    squad: 'Squad Identity',
    pii: true,
  },
  {
    id: 'watchlist-screener',
    name: 'watchlist-screener',
    lang: 'Java',
    tribe: 'Identity',
    p95: 75,
    coverage: 89,
    version: '1.9.0',
    deploys: '3d ago',
    summary: 'Watchlist screening — checks entities against PEP, sanction, and adverse-media lists.',
    deps: ['consent-service'],
    apis: ['Watchlist API'],
    squad: 'Squad Identity',
    pii: true,
  },

  // ── Data & Bureau ─────────────────────────────────────────────────────────
  {
    id: 'scpc-gateway',
    name: 'scpc-gateway',
    lang: 'Java',
    tribe: 'Data & Bureau',
    p95: 160,
    coverage: 88,
    version: '5.9.4',
    deploys: '3d ago',
    summary: 'Access to the SCPC database (negative and positive records) — the bureau\'s source of truth.',
    deps: ['bureau-ingestion'],
    apis: ['Boa Vista API SCPC'],
    squad: 'Squad Bureau',
    pii: true,
  },
  {
    id: 'cadastro-positivo-ingestor',
    name: 'cadastro-positivo-ingestor',
    lang: 'Python',
    tribe: 'Data & Bureau',
    p95: 320,
    coverage: 79,
    version: '3.4.0',
    deploys: '8d ago',
    summary: 'Ingestion and normalization of Cadastro Positivo data received from sources.',
    deps: ['bureau-ingestion'],
    squad: 'Squad Bureau',
    pii: true,
  },
  {
    id: 'bureau-ingestion',
    name: 'bureau-ingestion',
    lang: 'Go',
    tribe: 'Data & Bureau',
    p95: 410,
    coverage: 81,
    version: '4.0.5',
    deploys: '12d ago',
    summary: 'Credit data ingestion pipeline (negative + positive records) from external sources.',
    squad: 'Squad Bureau',
    pii: true,
  },
  {
    id: 'boavista-opendata',
    name: 'boavista-opendata',
    lang: 'Java',
    tribe: 'Data & Bureau',
    p95: 190,
    coverage: 83,
    version: '3.1.0',
    deploys: '10d ago',
    summary: 'Boa Vista Open Data API — exposes enriched bureau data for authorized partners under LGPD consent.',
    deps: ['scpc-gateway', 'consent-service'],
    apis: ['Open Data Partner API'],
    squad: 'Squad Bureau',
    pii: true,
  },
  {
    id: 'bureau-reconciler',
    name: 'bureau-reconciler',
    lang: 'Python',
    tribe: 'Data & Bureau',
    p95: 600,
    coverage: 76,
    version: '2.2.0',
    deploys: '14d ago',
    summary: 'Nightly reconciliation job — cross-validates bureau records with source institutions to detect divergences.',
    deps: ['bureau-ingestion'],
    squad: 'Squad Bureau',
  },
  {
    id: 'negativation-writer',
    name: 'negativation-writer',
    lang: 'Go',
    tribe: 'Data & Bureau',
    p95: 230,
    coverage: 86,
    version: '4.3.0',
    deploys: '2d ago',
    summary: 'Negativation write path — processes and commits negative credit events to the SCPC base.',
    deps: ['scpc-gateway', 'consent-service'],
    squad: 'Squad Bureau',
    pii: true,
  },

  // ── Decisioning ───────────────────────────────────────────────────────────
  {
    id: 'decision-engine',
    name: 'decision-engine',
    lang: 'Java',
    tribe: 'Decisioning',
    p95: 110,
    coverage: 90,
    version: '6.0.2',
    deploys: '4d ago',
    summary: 'Real-time credit rules and policies engine (InterConnect-style).',
    deps: ['score-engine', 'konduto-antifraud'],
    apis: ['Risk Decisioning'],
    squad: 'Squad Decisioning',
  },
  {
    id: 'policy-studio',
    name: 'policy-studio',
    lang: 'TypeScript',
    tribe: 'Decisioning',
    p95: 95,
    coverage: 87,
    version: '1.6.0',
    deploys: '2d ago',
    summary: 'Policy studio — drag-and-drop rule builder for credit analysts to configure decisioning strategies.',
    deps: ['decision-engine'],
    apis: ['Policy Management API'],
    squad: 'Squad Decisioning',
  },
  {
    id: 'interconnect-adapter',
    name: 'interconnect-adapter',
    lang: 'Java',
    tribe: 'Decisioning',
    p95: 140,
    coverage: 91,
    version: '5.2.0',
    deploys: '1d ago',
    summary: 'InterConnect adapter — translates legacy credit workflow payloads to the Forge decisioning API contract.',
    deps: ['decision-engine', 'score-engine'],
    squad: 'Squad Decisioning',
  },
  {
    id: 'offer-orchestrator',
    name: 'offer-orchestrator',
    lang: 'Go',
    tribe: 'Decisioning',
    p95: 110,
    coverage: 85,
    version: '1.1.0',
    deploys: '5d ago',
    summary: 'Credit offer orchestrator — selects the optimal product and limit given a decisioning outcome.',
    deps: ['decision-engine', 'score-engine'],
    apis: ['Offer API'],
    squad: 'Squad Decisioning',
    pii: true,
  },

  // ── Platform ──────────────────────────────────────────────────────────────
  {
    id: 'consent-service',
    name: 'consent-service',
    lang: 'TypeScript',
    tribe: 'Platform',
    p95: 45,
    coverage: 93,
    version: '2.2.1',
    deploys: '1d ago',
    summary: 'LGPD consent — legal basis, purpose, and audit trail for every query.',
    apis: ['Consent API'],
    squad: 'Squad Platform',
    pii: true,
  },
  {
    id: 'audit-trail',
    name: 'audit-trail',
    lang: 'TypeScript',
    tribe: 'Platform',
    p95: 40,
    coverage: 94,
    version: '3.0.0',
    deploys: '4d ago',
    summary: 'Audit trail service — immutable append-only log of every data access and decision event.',
    deps: ['consent-service'],
    apis: ['Audit API'],
    squad: 'Squad Platform',
    pii: true,
  },
  {
    id: 'webhook-dispatcher',
    name: 'webhook-dispatcher',
    lang: 'Go',
    tribe: 'Platform',
    p95: 85,
    coverage: 88,
    version: '2.4.0',
    deploys: '3d ago',
    summary: 'Webhook dispatcher — fan-out delivery of bureau and score events to registered partner endpoints.',
    deps: ['audit-trail'],
    squad: 'Squad Platform',
  },

  // ── Recovery ──────────────────────────────────────────────────────────────
  {
    id: 'recovery-comms',
    name: 'recovery-comms',
    lang: 'TypeScript',
    tribe: 'Recovery',
    p95: 180,
    coverage: 76,
    version: '1.9.2',
    deploys: '9d ago',
    summary: 'Negative listing, protest, and collection communications for credit recovery.',
    deps: ['scpc-gateway'],
    squad: 'Squad Recovery',
    pii: true,
  },
  {
    id: 'debt-restructure',
    name: 'debt-restructure',
    lang: 'Java',
    tribe: 'Recovery',
    p95: 200,
    coverage: 79,
    version: '2.0.1',
    deploys: '11d ago',
    summary: 'Debt restructuring engine — evaluates renegotiation proposals and generates counter-offer terms.',
    deps: ['scpc-gateway', 'decision-engine'],
    squad: 'Squad Recovery',
    pii: true,
  },
  {
    id: 'protest-gateway',
    name: 'protest-gateway',
    lang: 'TypeScript',
    tribe: 'Recovery',
    p95: 155,
    coverage: 74,
    version: '1.5.0',
    deploys: '8d ago',
    summary: 'Protest gateway — interfaces with notary office registries to file and cancel protests programmatically.',
    deps: ['recovery-comms'],
    squad: 'Squad Recovery',
    pii: true,
  },
  {
    id: 'collection-router',
    name: 'collection-router',
    lang: 'Go',
    tribe: 'Recovery',
    p95: 95,
    coverage: 80,
    version: '1.2.0',
    deploys: '6d ago',
    summary: 'Collection routing engine — assigns overdue accounts to the optimal recovery channel (SMS, email, letter, agency).',
    deps: ['recovery-comms', 'decision-engine'],
    squad: 'Squad Recovery',
    pii: true,
  },
];

export const TRIBES: Tribe[] = [
  'Score & Risk',
  'Anti-Fraud',
  'Identity',
  'Data & Bureau',
  'Decisioning',
  'Platform',
  'Recovery',
];

export function getService(id: string): PortalService | undefined {
  return SERVICES.find((s) => s.id === id);
}

/** The flagship service the first slice spotlights (Service detail + AI explain). */
export const FLAGSHIP_ID = 'acerta-api';
