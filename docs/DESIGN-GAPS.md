# Forge Portal · Design Gaps

> **Status 2026-06-10 (fim do dia):** P0 executado por inteiro (passe de ember).
> P1 executado (back-no-eyebrow + respiro/sem-ícone no T4, templates T1–T6
> documentados no example-shell, Workflows com DAG-thumbnail, pills só para
> exceção, dedup AsideSection/EmptyState). P2 executado: família viz
> (`src/portal/shell/viz.tsx`: MetricChartCard, TreemapCard, SankeyCard,
> ActivityHeatmap, ScatterCard, TimeRange, VizAiNote com AILabel lg) aplicada em
> DORA, Cloud Resources, Buckets, Incidents, Evaluations e Traces; SLA timer em
> Incidents; skeleton demo em Traces. Decisões do dono do produto: o hero da
> Home FICA; o Big Insights do AI-Insights FICA em carousel. **Deferido** (passe
> próprio): migração em massa dos inline-styles (catalog detail 125 / create 93
> / settings 77), SunburstCard em Scorecards, comparação A/B de experiments e a
> superfície de datasets.

> **Critique de 2026-06-10.** Método: 43 screenshots headless (tema escuro, 1400px,
> crops em resolução cheia nos suspeitos), greps de aderência ao DS sobre
> `app/portal/**` + `src/portal/**` + `example-shell.css`, e scoring contra os
> padrões do próprio repo (`DESIGN.md`, `anti-ai-slop.md`, `layout-and-spacing.md`).
> Escopo: as 37 rotas do portal. Escala: 0-10 por dimensão, banda pior sustentada.

## Veredicto em uma linha

A arquitetura de informação e a tese agentic estão acima do mercado; o que
rebaixa o conjunto é **um vazamento sistêmico do accent ember** (institucionalizado
em tiles, links de tabela, pills "Official" e fills de gráfico), **pills de estado
positivo repetidas em coluna**, e **uma linguagem de gráficos abaixo do que o DS
oferece** (o portal usa micro-bars CSS enquanto `@eidos/ui` tem a camada
EidosChart/recharts inteira sem uso).

## Scores (lote)

| Dimensão | Score | Evidência-chave |
|---|---|---|
| Philosophy consistency | **4/10** | A regra nuclear do DESIGN.md ("ember no máximo 2x por tela") é violada de forma sistêmica, não pontual: tiles ember em todo card de Services/Products/Templates/Agents (`IconBubble tone="ember"` é o default do idiom), nomes de serviço em ember em TODA linha de APIs/Databases/Cloud-Resources/Pipelines, pill "Official" ember repetida ~20x em Skills, e fills de gráfico ember (14 barras no DORA, 13 no Fraud). A disciplina Geist Sans/Mono está impecável e segura o 4. |
| Visual hierarchy | **6/10** | Pós-correções, as tabelas novas (Runs/Intake/Audit/Traces) escaneiam sem fricção. O que compete: colunas de pills coloridas repetidas (Contexts ~18x "Connected", MCP 13x "Live"), valores multicoloridos por linha em Scorecards/Fraud, e na Home o hero de marketing ("Less friction. More shipping.") gritando acima do Decide, que é o conteúdo que importa. |
| Detail execution | **6/10** | Zero `<style>` por página, zero hex relevante (2 restos: fallback em `catalog/[service]:148` e confetti em `new-agent.tsx:920`), alinhamento de coluna correto nas superfícies novas. A dívida: **inline `style={{}}`** em massa (catalog detail 125, create 93, settings 77, security 43), `AsideSection`/`EmptyState` redefinidos em 4 arquivos, e `Bar`/`PanelHead`/`Sub` locais no Settings. |
| Functionality | **6/10** | Console limpo em todas as rotas, focus-visible nas superfícies novas, empty states nas listas. Gaps: **tema claro não verificado** página a página (só amostras), **nenhum estado de loading/skeleton** no portal inteiro (craft/state-coverage pede; para mockup é aceitável, mas uma tela demonstrando o padrão valeria), e RTL usa propriedades lógicas mas nunca foi verificado em pixel no portal. |
| Innovation | **7/10** | Movimentos genuínos que o mercado não tem: DiagnosisPanel com guardrail inline no war room, autonomy ramp, gate ladder, blast-radius computado do grafo, "view as agent", span tree com reasoning do judge. O que puxa para baixo: a linguagem de charts é mediana para um produto de observabilidade (ver §Q6). |

---

## As 7 perguntas

### Q1 · Estamos seguindo estritamente o DS?

**Estrutura sim, accent não.** Não existe componente "feito por fora": tudo compõe
`@/ds/core` (Button/Pill/Select/Table/Drawer/Timeline/Avatar) + classes `.fp-*`.
As violações são de **regra de uso**, concentradas em uma: o orçamento de ember.

Inventário do vazamento (cada item é uma família de telas, não um caso):
1. **Icon tiles ember por card** — `IconBubble` com `tone="ember"` default: Services (12 tiles/tela), Products (7), Templates (7+hero), Agents (12 avatares ember). Correção barata: tone neutro por default, ember só no item destacado (1 por tela).
2. **Nome de serviço/recurso em ember em toda linha de tabela** — APIs, Databases, Cloud Resources, Pipelines (Security já corrigido). DESIGN.md §2: link informativo = **ice** quando o ember já foi gasto.
3. **Pill "Official" ember repetida** — Skills (20+). Inverter: official é o caso comum (texto quieto); `Community` é a exceção que merece pill.
4. **Ember como fill de gráfico** — DORA (14 barras), Fraud (13 barras), Cloud Resources (bar mix). Fills pertencem a `--accent-2`/viz-cat; ember no máximo na barra destacada.
5. **Owner pills ember** nos módulos de Product detail; pills "lead" em Teams.

### Q2 · Cada elemento novo usa primitivos do DS?

**Sim, com 3 exceções de duplicação local** (não são fora do padrão, são cópias):
- `AsideSection` definido 4x e `EmptyState` 3x (`skill-detail`, `context-detail`, `agent-detail`, `action-detail`) — promover a `src/portal/shell/`.
- `Bar`, `PanelHead`, `Sub` locais em `app/portal/settings/page.tsx`.
- Micro-bars CSS (`.fp-engine-bar`, util bars) reimplementam o que `Sparkline`/charts do DS cobririam.

### Q3 · As classes seguem os padrões de qualidade do DS?

O CSS novo (`.fp-tr-*`, `.fp-ev-*`, `.iq-*`, `.fp-audit-*`) segue: tokens, propriedades
lógicas, focus-visible, hairline dividers, mono header. As regras de tabela-em-grid
(firmadas em 2026-06-09) estão documentadas e aplicadas. A dívida de qualidade é o
**volume de `style={{}}` inline** que deveria ser classe (topo: `catalog/[service]`
125, `create` 93, `settings` 77) — não quebra visual, mas quebra RTL-safety e
manutenção, e é o oposto do "compose existing classes" do CLAUDE.md.

### Q4 · Existe erro visual (sobreposição, espaçamento baixo)?

Nenhuma sobreposição encontrada nas 43 capturas (pós-correções desta semana).
Restos pontuais:
- **Workflows**: página termina em 5 cards de texto com ~60% da viewport vazia — não é erro, é subaproveitamento (ver Q5).
- **Insights**: densidade no limite — linhas de risco com 4+ chips coloridos cada; o carousel da direita esconde 5 painéis atrás de dots.
- **Chat**: centro verticalmente desbalanceado em viewport alta (saudação no terço superior, metade inferior vazia).
- **Agents**: dots do carousel em ember (mais um gasto de accent).

### Q5 · As páginas estão monótonas?

**24 de 37 telas seguem exatamente Title → Banner → KPIs → Toolbar → Lista** (matriz
levantada por grep). O template é CORRETO para superfícies de log/registro (Audit,
Runs, Intake, Traces, APIs, Buckets…) — não mexer. Ele é PREGUIÇOSO em telas cujo
job não é "escanear linhas":
- **Workflows** — orquestrações são GRAFOS; os cards deveriam mostrar um thumbnail
  do DAG + sparkline de success rate, e a página um destaque do flagship. Hoje são
  5 retângulos de texto.
- **Traces / Evaluations** — produtos de observabilidade abrem com TENDÊNCIA
  (Langfuse home: latência p50/p95, custo por modelo, scores no tempo). Hoje abrem
  com 4 números estáticos.
- **Buckets** — o mix de classes em 4 barras horizontais não conta a história
  "onde está o peso morto"; um treemap (storage por bucket, cor = lifecycle) sim.
- **Teams** — adequada (estrutura organizacional); **Home/Insights/Quality
  Gates/Access/Chat/Settings** já escapam do template com layouts próprios — são a
  prova de que o sistema sabe variar quando quer.

**Decisão (direção de produto):** formalizar um **sistema de templates de tela** —
uma família pequena e nomeada, para que a variação seja intencional e a navegação
continue previsível (nem 1 template para tudo, nem cada tela de um jeito):

| Template | Anatomia | Telas |
|---|---|---|
| **T1 · Registro** | Title → Banner → KPIs → Toolbar → Tabela (grid-table rules) | Audit, Runs, Intake, Traces, APIs, Buckets, Databases, Pipelines, Approvals, Incidents, Notifications, LGPD |
| **T2 · Pulse (analytics)** | Title → time-range → grid de **metric-cards compostos** (KPI+chart no mesmo card) → tabela de apoio | DORA, Fraud, Evaluations, Cloud Resources, Scorecards |
| **T3 · Galeria (catálogo)** | Title → facets → grid de cards (1 herói opcional) | Catalog, Products, Agents, Skills, Actions, Templates, MCP, Workflows |
| **T4 · Detalhe (entidade)** | **Back no eyebrow** → Title → meta chips → tabs → conteúdo + rail | catalog/[service], agents/[id], traces/[id], runs/[run], evaluations/[id], products/[id], workflows/[id], incidents/[id] |
| **T5 · Workbench (master-detail)** | Lista à esquerda + painel de trabalho à direita | Access, Chat, Contexts (candidata) |
| **T6 · Mission control** | Composição própria (zonas Decide/Steer/Observe) | Home, AI-Insights — únicos autorizados a layout livre |

Regra: toda página declara seu template; criar um T7 exige justificar por que
nenhum dos 6 serve. T1/T3/T4 já existem de fato — o trabalho é nomear, documentar
no `example-shell.tsx` e migrar as exceções; T2 é o template NOVO (ver Q6).

### Q5b · Navegação de volta nas telas de detalhe (gap novo)

As telas internas (acessadas por clique em card/linha) colocam o link de volta no
**cluster de ações à direita** — péssimo para navegação: o olho procura o caminho
de volta onde entrou, no canto superior esquerdo. Evidência: `traces/[id]` ("All
traces" ghost à direita), `evaluations/[id]` ("All experiments" à direita),
`incidents/[id]/postmortem` ("War room" à direita), `products/[id]` ("All
products" à direita). O contra-exemplo correto já existe: `agents/[id]` tem "Back
to agents" no topo esquerdo (`fp-agentd-topbar`).

**Regra T4:** o eyebrow do `FPageHeader` VIRA o back ("← Traces") em toda tela de
detalhe — `FPageHeader` já aceita nó no `eyebrow`, então é adicionar a convenção
(prop `back={{ href, label }}`) e varrer os detalhes. O cluster da direita fica
exclusivo para AÇÕES sobre a entidade (Re-run, Resolve, Open run...).

### Q6 · Estamos explorando gráficos adequados?

**Este é o gap mais objetivo.** O DS tem a camada completa
`EidosChart`/`Recharts`/`ChartLegend`/`useChartColors` (`packages/ui/src/charts.tsx`)
— e o portal a usa **zero** vezes. Tudo é micro-bar CSS e `Sparkline`. Consequência:
um IDP cujo telhão de métricas (DORA) tem UM gráfico de barras (ember sólido, sem
eixo Y legível), e cujas telas de AI-observability não têm série temporal nenhuma.

**Decisão (direção de produto):** criar a família de **composições ricas** — não
gráficos soltos, mas CARDS compostos (métrica + delta + gráfico + leitura de AI no
mesmo componente), no espírito das referências coletadas (KPI com trend e
comparação de período embutidos; Sankey para fluxos de gasto; Treemap/Sunburst
para composição; heatmap para atividade no tempo). Viabilidade confirmada no
repo: `recharts 2.15.4` já embarca **`Sankey` e `Treemap` nativos**, a camada
`EidosChart` existe, e o DS tem **`AILabel` / `AILabelWithPopover`**
(`packages/ui/src/ai/identity.tsx`) — todo insight gerado por AI num chart leva o
selo, com popover de modelo/quando/confiança.

Componentes novos a criar no DS (família `MetricChart` / viz):
1. **`MetricChartCard`** — label + valor mono + delta + período + gráfico embutido
   (line/area com período anterior fantasma, como a ref "Spending") + rodapé
   opcional `AILabel` com a leitura ("Forge AI: o pico de 9/fev é o batch SCR").
2. **`SankeyCard`** — fluxo de gastos FinOps: conta GCP → produto → serviço
   (cloud-resources) e storage class → bucket → time (buckets/chargeback).
3. **`TreemapCard`** — composição com área = valor e cor = estado: storage por
   bucket (cor = lifecycle), spend por produto, qualidade por scorecard.
4. **`SunburstCard`** (donut aninhado, 2 anéis de `Pie`) — qualidade de produto:
   anel interno = produto, externo = dimensões do scorecard.
5. **`ActivityHeatmap`** — hora × dia: volume de traces, erros, incidentes (a ref
   "Users by time of day"); células clicáveis filtram a tabela abaixo.
6. **Time-range picker** padrão do T2 (7d/30d/90d) no header.

Mapa por tela (todas com dados mock existentes ou triviais):
| Tela | Hoje | Composição proposta |
|---|---|---|
| DORA | 1 bar chart ember | 4 `MetricChartCard` (uma por métrica DORA, trend + banda de benchmark elite/high) + `AILabel` com a leitura da semana |
| Cloud Resources | Bars estáticas | **`SankeyCard`** conta→produto→serviço + `MetricChartCard` de spend 30d; bars atuais viram breakdown secundário |
| Buckets | 4 bars de classe | **`TreemapCard`** storage (cor = lifecycle/dead) + `MetricChartCard` egress; o Sankey de chargeback class→bucket→time como segundo painel |
| Traces | KPIs estáticos | Strip T2: `MetricChartCard` volume+p95+custo por modelo (área empilhada) + **`ActivityHeatmap`** de erros (hora×dia) ligado ao log |
| Evaluations | KPIs estáticos | Score-over-time por scorer + scatter judge-vs-human (correlação Langfuse), ambos com `AILabel` no insight |
| Fraud | Bars ember + segmented | Decision mix ao longo do dia (área empilhada) + heatmap de blocked attempts |
| Scorecards / Products | Mini-bars por célula | **`SunburstCard`** de qualidade por produto no rail |
| Incidents | Tabela | `ActivityHeatmap` de indisponibilidade (hora×dia, 30d) acima da tabela, com leitura AI ("85% dos P1 começam em janela de deploy") |
| Quality Gates | ScoreGauge + ladder | **Manter — é a referência do portal** |

### Q7 · Boas práticas de mercado?

**Acima do mercado:** golden paths com garantias explícitas (Templates), scorecards
com initiatives, gate ladder com CRS, autonomy ramp, trace com judge reasoning
inline, blast radius computado — Port/Backstage não mostram isso com essa nitidez.

**Abaixo do mercado (cada um cabe como mockup pequeno):**
1. **Sem dimensão de TEMPO nas telas de observabilidade** — Langfuse/Datadog abrem
   com time-range picker + tendências; Traces/Evals/DORA têm strings "2h ago" e
   nenhum range selector (só DORA tem um "Last 7 days" estático).
2. **Sem comparação lado a lado** — Braintrust compara experiment A vs B por caso;
   o eval detail mostra um experimento por vez.
3. **Sem skeleton/loading states** — qualquer produto desse segmento demonstra
   progressive loading; o mockup nunca mostra o padrão.
4. **Datasets sem superfície** — evals citam `golden-credit-50` mas não há onde
   ver/curar o dataset (Braintrust/Langfuse têm gestão de datasets de 1ª classe).
5. **Incidents sem SLA timer por linha** (PagerDuty mostra countdown de ack/resolve).
6. **Feature flags sem regras de targeting** no detalhe (LaunchDarkly).

---

## Gaps por página

Formato: gravidade **[P0/P1/P2]** + gap + referência. Páginas sem entrada = sem gap
além dos sistêmicos (S1 ember-flood, S2 pill-repetida, S3 inline-styles, S4 charts).

### Núcleo / Catálogo
- **Home** — [P1] Hero "Less friction. More shipping." é painel decorativo de
  marketing num produto de operações (DESIGN.md §1) e compete com o Decide; rebaixar
  para uma linha de saudação + número. [P2] Aside com 3 cards empilhados (Quick
  start carded-by-default).
- **Services (catalog)** — [P0=S1] 12 tiles ember por tela. [P2] Paginação "1/3"
  minúscula no rodapé direito, fora do padrão de load-more usado em Agents.
- **Service detail** — [P1=S3] 125 inline styles (recorde do portal). [P1] 2 CTAs
  ember no header (+banner ember-tinted + tiles) — escolher um. [P2] Página longa
  sem TOC/âncoras nas tabs.
- **Products** — [P0=S1] tiles + "estrelas" de rating ember por card; rating de
  marketplace é semanticamente estranho para produto interno — trocar por adoção
  (squads/serviços) em mono.
- **Product detail** — [P2] Owner pills ember nos módulos (4x). 
- **APIs** — [P0=S1] coluna inteira de nomes em ember → ice/muted.
- **Databases / Cloud Resources** — [P0=S1] idem nomes ember; [P1=S4] fills ember
  nas bars de spend (cloud-resources) → accent-2/viz-cat. Databases: coluna de pill
  verde "auto-fix" repetida → texto quieto, pill só exceção (regra dos Buckets).
- **Buckets** — ok pós-fix; [P2=S4] treemap proposto (Q6).
- **MCP servers** — [P1=S2] 13 pills "Live" verdes; só Beta/Deprecated merecem pill.
- **Templates (create)** — [P0=S1] hero ember-soft + 7 tiles ember + CTA ember;
  manter ember só no hero. [P1=S3] 93 inline styles.
- **Contexts** — [P1=S2] ~18 pills "Connected"; só syncing/draft merecem. [P2]
  `window.location.assign` na linha (trocar por router/Link).

### AI
- **Chats** — [P2] desbalanceamento vertical em viewport alta; sugestões com 4
  ícones ember pequenos (S1 leve).
- **Agents** — [P0=S1] 12 avatar-tiles ember + dots de carousel ember. [P2] cards
  com 3 linhas de stats — candidato a 2.
- **Agent detail** — ok pós-fix (Permissions tab); [P1=S1] gráfico de spend do
  Usage é 100% barras ember → accent-2.
- **Skills** — [P0=S2+S1] pill "Official" ember em ~20 dos 26 cards; inverter para
  marcar só Community. 
- **Actions** — ok; melhor grade de cards do grupo (guardrail pill é semântica).
- **Traces / Evaluations** — [P1=S4] sem dimensão de tempo (Q6/Q7); [P2] traces
  list: coluna Tokens "in to out" em texto; um glifo → economizaria 20px.
- **AI-Insights** — [P1] carousel esconde 5 painéis atrás de dots (conteúdo
  load-bearing em padrão de descoberta); virar grid 2x. [P2] chips coloridos 4+ por
  linha de risco.

### Delivery
- **Intake / Runs / Pipelines / Audit / Approvals** — ok pós-fixes desta semana;
  Pipelines: [P0=S1] nomes de serviço ember por linha.
- **Workflows** — [P1=Q5] cards de texto + página 60% vazia; DAG thumbnail +
  sparkline por card.
- **Quality Gates** — referência do portal; manter.
- **Feature Flags** — [P2=Q7] detalhe sem targeting rules.
- **DORA** — [P0=S1+S4] 14 barras ember; [P1] sem benchmark bands; é A tela de
  métricas e tem um gráfico só.
- **Incidents** — ok pós-fix; [P2=Q7] sem SLA countdown por linha na lista.
- **Runbooks** — [P2=S2] coluna de trigger pills coloridas repetidas.

### Governance
- **Access** — ok (layout próprio, autonomy ramp); [P2] grants no painel usam o
  estilo chip do drawer (correto neste contexto estreito).
- **Scorecards** — [P1] célula com 3 mini-bars + valor colorido por linha = 5 sinais
  por linha; reduzir para valor + 1 bar. 
- **Security** — ok pós-fix UC-3.
- **Fraud & Risk** — [P0=S1+S4] 13 barras ember; decision-mix ao longo do tempo
  proposto (Q6).
- **LGPD** — [P2=S2] pills "In progress" repetidas na coluna DSR.
- **Architecture** — ok pós-topology; [P2] tab Topology com chips PII em 13 de 16
  nós (quase-repetição; considerar dot em vez de chip).
- **Settings** — [P1=S3] 77 inline styles + `Bar`/`PanelHead`/`Sub` locais.
- **Teams / Notifications** — ok.

---

## Plano de correção priorizado

**P0 — o passe de ember (1 sessão, transforma o produto):**
1. `IconBubble` default → neutro; ember explícito só no item-herói (catalog,
   products, templates, agents, create).
2. Links de entidade em tabelas → `--accent-2` (ice) ou `--fg` + underline hover
   (APIs, databases, cloud-resources, pipelines).
3. Fills de gráfico → `--accent-2`/`--viz-cat-*`; ember apenas na barra/ponto
   destacado (DORA, fraud, cloud-resources, agent-detail usage).
4. Skills: inverter a pill Official→Community.

**P1 — navegação, templates e repetição:**
5. **Back no eyebrow (regra T4)**: prop `back` no `FPageHeader` + varredura dos 8
   detalhes que hoje põem o voltar à direita (Q5b).
6. **Sistema de templates T1–T6** (Q5): documentar a família no
   `example-shell.tsx`, anotar cada página com seu template e migrar as exceções
   (Workflows → T3 com DAG-thumbnail + sparkline; Insights carousel → grid).
7. Regra "pill só para exceção" nas colunas Connected/Live/auto-fix/In
   progress/trigger (contexts, mcp, databases, lgpd, runbooks).
8. Home: rebaixar o hero de marketing.
9. Migração de inline-styles dos 3 piores arquivos para `.fp-*` (catalog detail,
   create, settings) + promover `AsideSection`/`EmptyState` para shared.

**P2 — composições ricas de viz (o template T2, eleva o "wow"):**
10. Construir a família no DS: `MetricChartCard`, `SankeyCard`, `TreemapCard`,
    `SunburstCard`, `ActivityHeatmap` + time-range picker — todos sobre
    `EidosChart`/recharts (Sankey e Treemap nativos no 2.15.4), com `AILabel` no
    rodapé de insight de cada um.
11. Aplicar o mapa por tela (Q6): DORA, Cloud Resources (Sankey), Buckets
    (Treemap), Traces (strip + heatmap), Evaluations (score-over-time +
    judge-vs-human), Fraud, Scorecards (Sunburst), Incidents (heatmap de
    indisponibilidade).
12. Mockups pontuais de mercado: datasets de eval, comparação A/B de experiments,
    SLA timer em incidents, skeleton state demonstrativo em UMA tela.

---

*Gerado pela critique de 2026-06-10; evidências completas (screenshots em
`/tmp/sweep/`, greps) na sessão correspondente.*
