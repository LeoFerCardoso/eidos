# Forge — IDP Portal · Brief do produto

> **Forge** é o mockup navegável do **Internal Developer Platform da Equifax Boa Vista**
> (bureau de crédito), construído sobre o **Eidos Design System**. Objetivo: dar ao time
> uma **visão concreta do que vamos construir de verdade** — não demos de componentes
> soltos, mas um produto coeso, orientado às jornadas reais do desenvolvedor.
>
> **Nomenclatura:** Design System = **Eidos** · Produto/portal = **Forge** · copiloto = **Forge AI**.

## Por que existe
Hoje o repo tem (a) o catálogo de componentes Eidos (`src/ds/migrated/**`), (b) as telas de
exemplo isoladas (`src/ds/examples/**` → `/example/*`). Falta o **produto montado**: o Forge
levanta os corpos dessas telas, conecta com roteamento real e aterra em **dados de domínio
reais**, virando a referência viva do IDP. Tudo do DS — componente, doc e exemplo — é
**recurso e contexto** para construir o Forge.

## Personas
- **Dev** (primária) — encontra/cria serviços, acompanha saúde e deploys.
- **Tech lead / EM** — scorecards, DORA, propriedade.
- **SRE / on-call** — incidentes, deploys progressivos.
- **Plataforma** — golden paths, compliance/LGPD.

## Arquitetura
- Route group **`app/(portal)/**`** com shell próprio (`src/portal/shell/portal-shell.tsx`) —
  rail · topbar · main, reusando as classes `.fp-*` (já globais) com `next/link` + `usePathname`.
- Dados de domínio em **`src/portal/data/**`** (Equifax Boa Vista).
- Regras para agentes em **`app/(portal)/AGENTS.md`**.

## Information Architecture (IA) + source-map
O **fio condutor é o Forge AI** (transversal, não um silo). Cada página mapeia de onde "bebe":
a tela de exemplo de partida, os componentes Eidos e as docs.

| Área / página | Rota | Origem (exemplo) | Componentes Eidos | Status |
|---|---|---|---|---|
| **Home / digest** | `/portal` | `ai-insights`, `score-cards` | KPI, Trend, ServiceCard | ⏳ próximo |
| **Catálogo** | `/portal/catalog` | `service-catalog` | ServiceCard, HealthBadge, TierBadge, LangBadge, Sparkline | ✅ feito |
| **Service detail** | `/portal/catalog/[service]` | `service-detail` | DataTable, ScoreGauge, Timeline, badges | ✅ feito (v1) |
| **Golden paths** | `/portal/create` | `templates`, `service-scaffold` | Cards, Stepper/forms | ⏳ próximo |
| **Pipelines** | `/portal/pipelines` | `pipeline-console`, `pipeline-view` | Pipeline, DiffViewer, LogViewer | ⏳ |
| **Fraude & risco** | `/portal/fraud` | `quality-gates`, `dora-dashboard` | Charts, gauges | ⏳ |
| **DORA** | `/portal/dora` | `dora-dashboard` | Charts, MetricCard | ⏳ |
| **Scorecards** | `/portal/scorecards` | `score-cards`, `quality-gates` | ScoreGauge, RingBar | ⏳ |
| **Incidentes** | `/portal/incidents` | `incident-room` | Timeline, Alert, badges | ⏳ |
| **LGPD & auditoria** | `/portal/compliance` | `cloud-inventory` (estrutura) | DataTable, badges | ⏳ |
| **Forge AI** | `/portal/assistant` | `ai-chat` (+ variantes), `ask` | ai-shell, useChat (app/ai-chat) | ⏳ |

## Primeira fatia (em construção)
Jornada ponta-a-ponta: **Catálogo → Service detail → Forge AI explica → Golden path**.
- ✅ **Catálogo** — serviços reais (score-engine, acerta-api, scpc-gateway, konduto-antifraud…),
  busca, filtro por tribo, views salvas, grid/lista.
- ✅ **Service detail** — vitrine `acerta-api`: header, KPIs, abas (Overview/Dependências/API…),
  e o painel **"Forge AI explica"** (correlaciona deploy + dependência + métrica → sugere rollback).
- ⏳ **Golden path** (`/portal/create`) — criar serviço de score PJ com LGPD/observabilidade embutidos.
- ⏳ **Forge AI** — ligar o copiloto ao `app/ai-chat` (AI SDK) para o "explica" virar interativo.

## Cenário-âncora do Forge AI (o "uau")
`acerta-api` degradado: p99 +41% após deploy `v4.12.0`; `konduto-antifraud` com +18% de
falso-positivo no mesmo intervalo → causa provável: regra nova no `v3.1.7` → recomenda rollback.
É o argumento de visão: **a AI tecida no produto**, correlacionando o que o dev levaria horas para achar.

## Princípios
1. **Orientado ao real** — jornadas conectadas + dados de domínio plausíveis, nunca lorem.
2. **Compor, nunca reinventar** — só Eidos; toda peça nova vira candidata a componente do DS.
3. **Forge AI é o diferencial** — presente in-context em cada página, não escondido numa aba.
4. **Incremental** — uma fatia vertical de cada vez, sempre navegável.
