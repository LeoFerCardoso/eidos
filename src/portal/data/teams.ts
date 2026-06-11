// Forge (IDP Portal) · org-structure data (Equifax Boa Vista, Brazil · Latam).
// Naming: design system = "Eidos"; this product/portal = "Forge".
//
// The Equifax org is a 5-level hierarchy, top to bottom:
//   REGION (a workspace in the sidebar switcher · e.g. Equifax BVS · Latam)
//     └ ALLIANCE   a business line inside the region (Credit Solutions, …)
//        └ TRIBE   a domain area (Score & Risk, Anti-Fraud, …) · reuses the
//          │       service `Tribe` so Teams and the Catalog speak one vocabulary
//          └ SQUAD a delivery team (Squad Query, Squad Models, …) · the same
//            │     squad strings the services in `services.ts` are owned by
//            └ PERSON  a human; a person CAN belong to more than one squad
//
// Only the Latam region (Equifax BVS) is modelled here · that is the estate the
// rest of the portal's domain data describes. Other workspaces render an honest
// "managed by the local platform team" empty state on the Teams page.

import { SERVICES, type Tribe } from './services';

// ── People ──────────────────────────────────────────────────────────────────

export type Role =
  | 'Alliance Lead'
  | 'Engineering Manager'
  | 'Tech Lead'
  | 'Staff Engineer'
  | 'Senior Engineer'
  | 'Engineer'
  | 'SRE'
  | 'Product Manager'
  | 'Data Scientist'
  | 'QA Engineer'
  | 'Security Engineer';

export interface Person {
  id: string;
  name: string;
  role: Role;
  /** avatar initials. */
  initials: string;
  email: string;
  /** squad ids this person belongs to · can be more than one. */
  squads: string[];
}

// ── Squads ────────────────────────────────────────────────────────────────────

export interface Squad {
  /** short id used in Person.squads + as the page key. */
  id: string;
  /** the full "Squad X" label, matching services.ts `squad`. */
  name: string;
  tribe: Tribe;
  mission: string;
  /** person id of the squad lead. */
  leadId: string;
}

export const SQUADS: Squad[] = [
  { id: 'query',       name: 'Squad Query',       tribe: 'Score & Risk',  mission: 'Consult APIs (Acerta) · the single-call CPF/CNPJ query surface.',     leadId: 'rafael-moura' },
  { id: 'models',      name: 'Squad Models',      tribe: 'Score & Risk',  mission: 'Risk + score models, the feature store and drift monitoring.',        leadId: 'leticia-prado' },
  { id: 'fraud',       name: 'Squad Fraud',       tribe: 'Anti-Fraud',    mission: 'Transactional anti-fraud (Konduto), device, velocity and disputes.',  leadId: 'patricia-lemos' },
  { id: 'identity',    name: 'Squad Identity',    tribe: 'Identity',      mission: 'Onboarding / KYC · proofing, document OCR, biometrics, watchlists.',  leadId: 'andre-figueira' },
  { id: 'bureau',      name: 'Squad Bureau',      tribe: 'Data & Bureau', mission: 'SCPC, Cadastro Positivo ingestion and the bureau source of truth.',    leadId: 'diego-vasquez' },
  { id: 'decisioning', name: 'Squad Decisioning', tribe: 'Decisioning',   mission: 'Real-time credit rules engine (InterConnect) and policy studio.',     leadId: 'camila-duarte' },
  { id: 'platform',    name: 'Squad Platform',    tribe: 'Platform',      mission: 'Consent, audit trail, webhooks and the shared developer platform.',   leadId: 'bruno-tanaka' },
  { id: 'recovery',    name: 'Squad Recovery',    tribe: 'Recovery',      mission: 'Negativation, protest, debt restructuring and collection routing.',   leadId: 'fernanda-rocha' },
];

export const PEOPLE: Person[] = [
  // ── Squad Query ──
  { id: 'rafael-moura',     name: 'Rafael Moura',      role: 'Tech Lead',           initials: 'RM', email: 'rafael.moura@equifax.com',     squads: ['query', 'models'] },
  { id: 'juliana-alves',    name: 'Juliana Alves',     role: 'Senior Engineer',     initials: 'JA', email: 'juliana.alves@equifax.com',    squads: ['query'] },
  { id: 'pedro-nogueira',   name: 'Pedro Nogueira',    role: 'Engineer',            initials: 'PN', email: 'pedro.nogueira@equifax.com',   squads: ['query'] },
  { id: 'camila-duarte',    name: 'Camila Duarte',     role: 'Product Manager',     initials: 'CD', email: 'camila.duarte@equifax.com',    squads: ['query', 'decisioning'] },
  { id: 'tomas-ribeiro',    name: 'Tomás Ribeiro',     role: 'QA Engineer',         initials: 'TR', email: 'tomas.ribeiro@equifax.com',    squads: ['query'] },

  // ── Squad Models ──
  { id: 'leticia-prado',    name: 'Letícia Prado',     role: 'Engineering Manager', initials: 'LP', email: 'leticia.prado@equifax.com',    squads: ['models'] },
  { id: 'gustavo-mendes',   name: 'Gustavo Mendes',    role: 'Data Scientist',      initials: 'GM', email: 'gustavo.mendes@equifax.com',   squads: ['models'] },
  { id: 'aline-castro',     name: 'Aline Castro',      role: 'Data Scientist',      initials: 'AC', email: 'aline.castro@equifax.com',     squads: ['models'] },
  { id: 'henrique-lima',    name: 'Henrique Lima',     role: 'Senior Engineer',     initials: 'HL', email: 'henrique.lima@equifax.com',    squads: ['models'] },

  // ── Squad Fraud ──
  { id: 'patricia-lemos',   name: 'Patrícia Lemos',    role: 'Engineering Manager', initials: 'PL', email: 'patricia.lemos@equifax.com',   squads: ['fraud', 'identity'] },
  { id: 'lucas-ferraz',     name: 'Lucas Ferraz',      role: 'Staff Engineer',      initials: 'LF', email: 'lucas.ferraz@equifax.com',     squads: ['fraud'] },
  { id: 'bianca-souza',     name: 'Bianca Souza',      role: 'Senior Engineer',     initials: 'BS', email: 'bianca.souza@equifax.com',     squads: ['fraud'] },
  { id: 'marcelo-pinto',    name: 'Marcelo Pinto',     role: 'Data Scientist',      initials: 'MP', email: 'marcelo.pinto@equifax.com',    squads: ['fraud'] },

  // ── Squad Identity ──
  { id: 'andre-figueira',   name: 'André Figueira',    role: 'Tech Lead',           initials: 'AF', email: 'andre.figueira@equifax.com',   squads: ['identity'] },
  { id: 'renata-cardoso',   name: 'Renata Cardoso',    role: 'Senior Engineer',     initials: 'RC', email: 'renata.cardoso@equifax.com',   squads: ['identity'] },
  { id: 'felipe-araujo',    name: 'Felipe Araújo',     role: 'Engineer',            initials: 'FA', email: 'felipe.araujo@equifax.com',    squads: ['identity'] },
  { id: 'sofia-barros',     name: 'Sofia Barros',      role: 'Product Manager',     initials: 'SB', email: 'sofia.barros@equifax.com',     squads: ['identity', 'fraud'] },

  // ── Squad Bureau ──
  { id: 'diego-vasquez',    name: 'Diego Vasquez',     role: 'Engineering Manager', initials: 'DV', email: 'diego.vasquez@equifax.com',    squads: ['bureau'] },
  { id: 'mariana-castelli', name: 'Mariana Castelli',  role: 'Staff Engineer',      initials: 'MC', email: 'mariana.castelli@equifax.com',  squads: ['bureau', 'platform'] },
  { id: 'rodrigo-teixeira', name: 'Rodrigo Teixeira',  role: 'Senior Engineer',     initials: 'RT', email: 'rodrigo.teixeira@equifax.com',  squads: ['bureau'] },
  { id: 'carla-monteiro',   name: 'Carla Monteiro',    role: 'Engineer',            initials: 'CM', email: 'carla.monteiro@equifax.com',   squads: ['bureau'] },

  // ── Squad Decisioning ──
  { id: 'thiago-albuquerque', name: 'Thiago Albuquerque', role: 'Tech Lead',        initials: 'TA', email: 'thiago.albuquerque@equifax.com', squads: ['decisioning'] },
  { id: 'vanessa-luz',      name: 'Vanessa Luz',       role: 'Senior Engineer',     initials: 'VL', email: 'vanessa.luz@equifax.com',      squads: ['decisioning'] },
  { id: 'eduardo-ramos',    name: 'Eduardo Ramos',     role: 'Engineer',            initials: 'ER', email: 'eduardo.ramos@equifax.com',    squads: ['decisioning'] },

  // ── Squad Platform ──
  { id: 'bruno-tanaka',     name: 'Bruno Tanaka',      role: 'Engineering Manager', initials: 'BT', email: 'bruno.tanaka@equifax.com',     squads: ['platform'] },
  { id: 'isabela-freitas',  name: 'Isabela Freitas',   role: 'SRE',                 initials: 'IF', email: 'isabela.freitas@equifax.com',  squads: ['platform'] },
  { id: 'marcos-vieira',    name: 'Marcos Vieira',     role: 'SRE',                 initials: 'MV', email: 'marcos.vieira@equifax.com',    squads: ['platform'] },
  { id: 'priscila-gomes',   name: 'Priscila Gomes',    role: 'Security Engineer',   initials: 'PG', email: 'priscila.gomes@equifax.com',   squads: ['platform'] },
  { id: 'daniel-okabe',     name: 'Daniel Okabe',      role: 'Staff Engineer',      initials: 'DO', email: 'daniel.okabe@equifax.com',     squads: ['platform', 'decisioning'] },

  // ── Squad Recovery ──
  { id: 'fernanda-rocha',   name: 'Fernanda Rocha',    role: 'Tech Lead',           initials: 'FR', email: 'fernanda.rocha@equifax.com',   squads: ['recovery'] },
  { id: 'paulo-bittencourt', name: 'Paulo Bittencourt', role: 'Senior Engineer',    initials: 'PB', email: 'paulo.bittencourt@equifax.com', squads: ['recovery'] },
  { id: 'larissa-nunes',    name: 'Larissa Nunes',     role: 'Engineer',            initials: 'LN', email: 'larissa.nunes@equifax.com',    squads: ['recovery'] },
];

// ── Alliances + Region ──────────────────────────────────────────────────────

export interface Alliance {
  id: string;
  name: string;
  mission: string;
  /** person id of the alliance lead. */
  leadId: string;
  /** domain tribes this alliance owns. */
  tribes: Tribe[];
}

export const ALLIANCES: Alliance[] = [
  {
    id: 'credit-solutions',
    name: 'Credit Solutions',
    mission: 'The score, the query and the decisioning engine · the revenue core of the bureau.',
    leadId: 'leticia-prado',
    tribes: ['Score & Risk', 'Decisioning'],
  },
  {
    id: 'fraud-identity',
    name: 'Fraud & Identity',
    mission: 'Keep transactions and onboarding safe · anti-fraud decisioning and KYC.',
    leadId: 'patricia-lemos',
    tribes: ['Anti-Fraud', 'Identity'],
  },
  {
    id: 'data-platform',
    name: 'Data Platform',
    mission: 'The bureau source of truth plus the shared developer + consent platform.',
    leadId: 'diego-vasquez',
    tribes: ['Data & Bureau', 'Platform'],
  },
  {
    id: 'recovery',
    name: 'Recovery & Collections',
    mission: 'Negativation, protest and debt-recovery journeys.',
    leadId: 'fernanda-rocha',
    tribes: ['Recovery'],
  },
];

export interface Region {
  id: string;
  /** matches a workspace name in the sidebar switcher. */
  workspace: string;
  name: string;
  location: string;
  /** false → not modelled; the page shows an honest empty state. */
  modelled: boolean;
}

export const REGIONS: Region[] = [
  { id: 'bvs', workspace: 'Equifax BVS',       name: 'Equifax BVS',      location: 'Brazil · Latam',          modelled: true  },
  { id: 'usis', workspace: 'Equifax USIS',     name: 'Equifax USIS',     location: 'USA · North America',     modelled: false },
  { id: 'ca',   workspace: 'Equifax Canada',   name: 'Equifax Canada',   location: 'Canada · North America',  modelled: false },
  { id: 'uki',  workspace: 'Equifax UK&I',     name: 'Equifax UK&I',     location: 'United Kingdom · Europe', modelled: false },
  { id: 'au',   workspace: 'Equifax Australia', name: 'Equifax Australia', location: 'Australia · Asia Pacific', modelled: false },
];

// ── Lookups + derived helpers ─────────────────────────────────────────────────

export const getPerson = (id: string): Person | undefined => PEOPLE.find((p) => p.id === id);
export const getSquad = (id: string): Squad | undefined => SQUADS.find((s) => s.id === id);
export const getAlliance = (id: string): Alliance | undefined => ALLIANCES.find((a) => a.id === id);

/** Members of a squad · lead first, then by role weight, then name. */
const ROLE_WEIGHT: Record<Role, number> = {
  'Alliance Lead': 0, 'Engineering Manager': 1, 'Tech Lead': 2, 'Staff Engineer': 3,
  'Product Manager': 4, 'Data Scientist': 5, 'Security Engineer': 6, 'SRE': 7,
  'Senior Engineer': 8, 'Engineer': 9, 'QA Engineer': 10,
};

export function peopleInSquad(squadId: string): Person[] {
  const squad = getSquad(squadId);
  return PEOPLE.filter((p) => p.squads.includes(squadId)).sort((a, b) => {
    if (squad) {
      if (a.id === squad.leadId) return -1;
      if (b.id === squad.leadId) return 1;
    }
    const w = ROLE_WEIGHT[a.role] - ROLE_WEIGHT[b.role];
    return w !== 0 ? w : a.name.localeCompare(b.name);
  });
}

export const squadsInTribe = (tribe: Tribe): Squad[] => SQUADS.filter((s) => s.tribe === tribe);

/** Distinct people across a set of squad ids (a person can span squads). */
export function peopleInSquads(squadIds: string[]): Person[] {
  const seen = new Set<string>();
  const out: Person[] = [];
  for (const id of squadIds) {
    for (const p of peopleInSquad(id)) {
      if (!seen.has(p.id)) { seen.add(p.id); out.push(p); }
    }
  }
  return out;
}

export const squadIdsInAlliance = (a: Alliance): string[] =>
  a.tribes.flatMap((t) => squadsInTribe(t).map((s) => s.id));

/** Services owned by a squad · derived from services.ts so Teams and Catalog agree. */
export const servicesInSquad = (squadId: string): number => {
  const squad = getSquad(squadId);
  if (!squad) return 0;
  return SERVICES.filter((s) => s.squad === squad.name).length;
};

// Org-wide rollup for the modelled (Latam) region.
export const ORG_STATS = {
  alliances: ALLIANCES.length,
  tribes: new Set(SQUADS.map((s) => s.tribe)).size,
  squads: SQUADS.length,
  people: PEOPLE.length,
};
