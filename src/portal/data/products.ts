// Forge (IDP Portal) · product data (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; this product/portal = "Forge".
//
// A PRODUCT is the business-facing offering the org sells/operates. It is NOT a
// new entity to maintain by hand · it is a *lens* that composes things already
// modelled elsewhere:
//   • services       (services.ts)        · owned 1:1 via serviceIds
//   • databases      (databases.ts)       · derived where db.service ∈ serviceIds
//   • cloud resources(cloud-resources.ts) · derived where resource.ref ∈ serviceIds
//   • buckets        (buckets.ts)         · assigned explicitly (buckets have no service link)
//   • squads + people(teams.ts)           · derived from the owning squads of its services
// On top of that a product names its *responsibles* (DRI, eng lead, PM) and its
// internal *modules* (sub-groupings of services), so the detail page can answer
// "who owns this and what is it made of" without a backend.

import { SERVICES, getService, type PortalService, type Tribe } from './services';
import { DATABASES, type Database } from './databases';
import { BUCKETS, type Bucket } from './buckets';
import { RESOURCES, type CloudResource } from './cloud-resources';
import { SQUADS, getSquad, peopleInSquads, type Squad, type Person } from './teams';

export type ProductStage = 'GA' | 'Beta' | 'Sunset';

export interface ProductModule {
  name: string;
  blurb: string;
  /** services that make up this module. */
  serviceIds: string[];
  /** person id (teams.ts) who owns the module. */
  ownerId: string;
}

export interface Product {
  id: string;
  name: string;
  tribe: Tribe;
  stage: ProductStage;
  summary: string;
  /** the services this product owns (source of truth for derivation). */
  serviceIds: string[];
  /** buckets attached to the product (buckets carry no service link). */
  bucketIds?: string[];
  /** responsibles · person ids from teams.ts. */
  ownerId: string; // the DRI / product owner
  engLeadId: string;
  pmId?: string;
  /** headline API products this offering exposes. */
  apis?: string[];
  modules: ProductModule[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'onescore',
    name: 'OneScore Platform',
    tribe: 'Score & Risk',
    stage: 'GA',
    summary:
      'The scoring + single-call consult platform · Acerta CPF/CNPJ queries, the 0–1000 risk score, the feature store and live drift monitoring.',
    serviceIds: ['acerta-api', 'score-engine', 'onescore-gateway', 'ignite-feature-store', 'risk-monitor'],
    bucketIds: ['model-artifacts'],
    ownerId: 'camila-duarte',
    engLeadId: 'leticia-prado',
    pmId: 'camila-duarte',
    apis: ['OneScore', 'Acerta Complete', 'Score PF', 'Score PJ'],
    modules: [
      { name: 'Consult API', blurb: 'Acerta single-call CPF/CNPJ orchestration.', serviceIds: ['acerta-api'], ownerId: 'rafael-moura' },
      { name: 'Scoring engine', blurb: 'The 0–1000 risk score + the unified PF/PJ gateway.', serviceIds: ['score-engine', 'onescore-gateway'], ownerId: 'leticia-prado' },
      { name: 'Feature store', blurb: 'Ignite · the attributes that feed score + fraud models.', serviceIds: ['ignite-feature-store'], ownerId: 'gustavo-mendes' },
      { name: 'Risk monitoring', blurb: 'Score-distribution drift + SLO breach detection.', serviceIds: ['risk-monitor'], ownerId: 'henrique-lima' },
    ],
  },
  {
    id: 'konduto',
    name: 'Konduto Anti-Fraud',
    tribe: 'Anti-Fraud',
    stage: 'GA',
    summary:
      'Transactional anti-fraud decisioning · device fingerprint, velocity rules and a chargeback classifier, pre- and post-authorization.',
    serviceIds: ['konduto-antifraud', 'device-fingerprint', 'velocity-check', 'chargeback-classifier'],
    bucketIds: ['legacy-konduto'],
    ownerId: 'patricia-lemos',
    engLeadId: 'patricia-lemos',
    pmId: 'sofia-barros',
    apis: ['Transactional Anti-Fraud', 'Device ID API'],
    modules: [
      { name: 'Fraud decision', blurb: 'The Konduto real-time fraud score.', serviceIds: ['konduto-antifraud'], ownerId: 'lucas-ferraz' },
      { name: 'Device & velocity', blurb: 'Fingerprinting + frequency-pattern rules.', serviceIds: ['device-fingerprint', 'velocity-check'], ownerId: 'bianca-souza' },
      { name: 'Chargeback ML', blurb: 'Dispute-likelihood model before authorization.', serviceIds: ['chargeback-classifier'], ownerId: 'marcelo-pinto' },
    ],
  },
  {
    id: 'identity-kyc',
    name: 'Identity & KYC',
    tribe: 'Identity',
    stage: 'GA',
    summary:
      'Onboarding and identity assurance · proofing, document OCR, biometric match and watchlist screening for account opening.',
    serviceIds: ['identity-proofing', 'document-ocr', 'biometric-match', 'watchlist-screener'],
    bucketIds: ['kyc-documents', 'doc-uploads', 'biometric-frames', 'temp-ocr'],
    ownerId: 'andre-figueira',
    engLeadId: 'andre-figueira',
    pmId: 'sofia-barros',
    apis: ['Identity Proofing', 'Document Verification', 'Biometric Verification', 'Watchlist API'],
    modules: [
      { name: 'Proofing', blurb: 'KYC identity verification and red-flags.', serviceIds: ['identity-proofing'], ownerId: 'andre-figueira' },
      { name: 'Document & biometrics', blurb: 'RG/CNH OCR plus liveness + face match.', serviceIds: ['document-ocr', 'biometric-match'], ownerId: 'renata-cardoso' },
      { name: 'Screening', blurb: 'PEP, sanction and adverse-media checks.', serviceIds: ['watchlist-screener'], ownerId: 'felipe-araujo' },
    ],
  },
  {
    id: 'boavista-bureau',
    name: 'Boa Vista Bureau',
    tribe: 'Data & Bureau',
    stage: 'GA',
    summary:
      'The bureau source of truth · SCPC access, Cadastro Positivo ingestion, negativation, reconciliation and the partner Open Data API.',
    serviceIds: ['scpc-gateway', 'cadastro-positivo-ingestor', 'bureau-ingestion', 'boavista-opendata', 'bureau-reconciler', 'negativation-writer'],
    bucketIds: ['bureau-exports'],
    ownerId: 'diego-vasquez',
    engLeadId: 'diego-vasquez',
    apis: ['Boa Vista API SCPC', 'Open Data Partner API'],
    modules: [
      { name: 'Bureau access', blurb: 'SCPC negative + positive record access.', serviceIds: ['scpc-gateway'], ownerId: 'rodrigo-teixeira' },
      { name: 'Ingestion', blurb: 'Cadastro Positivo + credit-data pipelines.', serviceIds: ['cadastro-positivo-ingestor', 'bureau-ingestion'], ownerId: 'mariana-castelli' },
      { name: 'Write path', blurb: 'Negativation writes and nightly reconciliation.', serviceIds: ['negativation-writer', 'bureau-reconciler'], ownerId: 'carla-monteiro' },
      { name: 'Open Data', blurb: 'Enriched bureau data for authorized partners.', serviceIds: ['boavista-opendata'], ownerId: 'diego-vasquez' },
    ],
  },
  {
    id: 'interconnect',
    name: 'InterConnect Decisioning',
    tribe: 'Decisioning',
    stage: 'GA',
    summary:
      'Real-time credit decisioning · the rules engine, a drag-and-drop policy studio, the legacy adapter and offer orchestration.',
    serviceIds: ['decision-engine', 'policy-studio', 'interconnect-adapter', 'offer-orchestrator'],
    ownerId: 'thiago-albuquerque',
    engLeadId: 'thiago-albuquerque',
    pmId: 'camila-duarte',
    apis: ['Risk Decisioning', 'Policy Management API', 'Offer API'],
    modules: [
      { name: 'Rules engine', blurb: 'Real-time credit rules and policies.', serviceIds: ['decision-engine'], ownerId: 'thiago-albuquerque' },
      { name: 'Policy studio', blurb: 'No-code rule builder for credit analysts.', serviceIds: ['policy-studio'], ownerId: 'vanessa-luz' },
      { name: 'Integration & offers', blurb: 'Legacy adapter + optimal-offer selection.', serviceIds: ['interconnect-adapter', 'offer-orchestrator'], ownerId: 'eduardo-ramos' },
    ],
  },
  {
    id: 'developer-platform',
    name: 'Developer Platform',
    tribe: 'Platform',
    stage: 'GA',
    summary:
      'The shared spine every product builds on · LGPD consent, the immutable audit trail and partner webhook delivery.',
    serviceIds: ['consent-service', 'audit-trail', 'webhook-dispatcher'],
    bucketIds: ['app-logs-cold', 'audit-archive', 'db-backups'],
    ownerId: 'bruno-tanaka',
    engLeadId: 'bruno-tanaka',
    apis: ['Consent API', 'Audit API'],
    modules: [
      { name: 'Consent & audit', blurb: 'LGPD legal basis + the append-only audit log.', serviceIds: ['consent-service', 'audit-trail'], ownerId: 'priscila-gomes' },
      { name: 'Eventing', blurb: 'Fan-out webhook delivery to partner endpoints.', serviceIds: ['webhook-dispatcher'], ownerId: 'marcos-vieira' },
    ],
  },
  {
    id: 'recovery-suite',
    name: 'Recovery Suite',
    tribe: 'Recovery',
    stage: 'Beta',
    summary:
      'Credit-recovery journeys · negativation comms, protest filing, debt restructuring and multi-channel collection routing.',
    serviceIds: ['recovery-comms', 'debt-restructure', 'protest-gateway', 'collection-router'],
    ownerId: 'fernanda-rocha',
    engLeadId: 'fernanda-rocha',
    modules: [
      { name: 'Comms & protest', blurb: 'Recovery communications + notary protest filing.', serviceIds: ['recovery-comms', 'protest-gateway'], ownerId: 'paulo-bittencourt' },
      { name: 'Restructure & routing', blurb: 'Renegotiation terms + optimal collection channel.', serviceIds: ['debt-restructure', 'collection-router'], ownerId: 'larissa-nunes' },
    ],
  },
];

export const STAGE_TONE: Record<ProductStage, 'health-up' | 'ice' | 'warning'> = {
  GA: 'health-up',
  Beta: 'ice',
  Sunset: 'warning',
};

// ── Lookups + derivation ──────────────────────────────────────────────────────

export const getProduct = (id: string): Product | undefined => PRODUCTS.find((p) => p.id === id);

export const productServices = (p: Product): PortalService[] =>
  p.serviceIds.map(getService).filter(Boolean) as PortalService[];

export const productDatabases = (p: Product): Database[] =>
  DATABASES.filter((d) => d.service && p.serviceIds.includes(d.service));

export const productCloud = (p: Product): CloudResource[] =>
  RESOURCES.filter((r) => r.ref && p.serviceIds.includes(r.ref));

export const productBuckets = (p: Product): Bucket[] =>
  p.bucketIds ? BUCKETS.filter((b) => p.bucketIds!.includes(b.id)) : [];

/** Distinct squads that own the product's services (mapped to teams.ts squads). */
export function productSquads(p: Product): Squad[] {
  const names = new Set(productServices(p).map((s) => s.squad));
  return SQUADS.filter((sq) => names.has(sq.name));
}

export const productSquadIds = (p: Product): string[] => productSquads(p).map((s) => s.id);

export const productPeople = (p: Product): Person[] => peopleInSquads(productSquadIds(p));

/** Total cloud + storage spend per month (BRL). */
export function productSpendMo(p: Product): number {
  const cloud = productCloud(p).reduce((m, r) => m + r.costMo, 0);
  const storage = productBuckets(p).reduce((m, b) => m + b.costMo, 0);
  return cloud + storage;
}

export const fmtBrl = (n: number): string =>
  'R$ ' + (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n));

export const PRODUCT_KPIS = {
  products: PRODUCTS.length,
  services: PRODUCTS.reduce((m, p) => m + p.serviceIds.length, 0),
  squads: new Set(PRODUCTS.flatMap((p) => productSquadIds(p))).size,
  spendMo: PRODUCTS.reduce((m, p) => m + productSpendMo(p), 0),
};
