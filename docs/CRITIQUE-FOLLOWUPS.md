# Critique follow-ups — backlog (deferred)

**Origem:** programa de design-critique + remediação das 217 páginas de doc, 2026-05-31.
**Onde parou:** catálogo forte em todas as dimensões (média/DS — Filosofia 8.2 · Hierarquia 8.0 · Função 8.0 · Detalhe 7.3 · Inovação 7.3); `eidos:verify` 0 block-fail; render headless limpo. Lotes 0–5 + elevação (2 passadas) concluídos. O abaixo foi **deliberadamente adiado** — sem valor marginal suficiente agora.

## P1 — doc afirma X, componente faz Y (dívida de confiança; corrigir = implementar o comportamento OU acertar o texto)
- [ ] **reduced-motion sem guard real** — a seção a11y promete que a animação pausa sob `prefers-reduced-motion`, mas o componente/CSS não tem o guard: `mobile/tab-bar.tsx` (indicador live), `mobile/switch.tsx` (spring do thumb, inline), `file-input.tsx` (`.in-file-progress > span` + spinner). Adicionar `@media (prefers-reduced-motion: reduce){ transition:none }` (ou `useReducedMotion`) no componente.
- [ ] **`patterns/dot-grid.tsx`** — afirma 3× que o grid cai para `--fg @ 5%` no light theme, mas `.pat-dot-grid` não tem regra `[data-theme="light"]` (é 12% nos dois). Adicionar o override em ds.css ou corrigir a cópia.
- [ ] **`tag-input.tsx`** — Motion diz "sem enter/leave" mas o CSS aplica `ti-chip-in`; a11y afirma `role="alert"` + `aria-labelledby` que o componente não emite. Reconciliar.
- [ ] **`ai/code-block.tsx`** — doc atribui auto-collapse (>8 linhas) ao `CodeBlock`, mas só `CollapsibleCode` faz isso. Corrigir a atribuição ou envolver o corpo do CodeBlock em CollapsibleCode.

## P1/P2 — props inertes e subcomponentes não exportados (gaps de binding)
- [ ] **`Conversation`** (`packages/ui/src/ai/message.tsx`) — `ConversationProps` declara `mode`/`autoScroll`/`unreadHint`/`height`, todos ignorados pela impl. E o doc documenta `ConversationHeader`/`ConversationContent`/`ConversationEmptyState`/`ConversationJumpToLatest` que **não são exportados**. Implementar/exportar ou remover do tipo+doc.
- [ ] **`History`** — props `groupBy`/`projects` tipadas mas ignoradas; `HistoryDrawer` documentado e não exportado. Mesmo tratamento.

## Estrutural — Lote 6 (programa próprio, não trivial)
- [ ] **Promover Mobile/Charts/Patterns/block-examples a `@eidos/ui` + stories** — ~76 páginas doc-only (sem export/story). Via `promote-batch`. Decisão estratégica pendente (pode ser intencionalmente doc-only).
- [ ] **`tree-view`** — docs+story já apontam para o `EidosTree` real (`src/components/pierre-tree.tsx`, wrapper @pierre/trees). **Waivers `C-export` e `C-registry-sync` expiram 2026-08-31** — antes disso: re-exportar `EidosTree` do barrel `@eidos/ui` + criar o registry source, e rodar `npm run gen:contract`. (Senão renovar/decidir.)

## Polish opcional (rubric-honesto deixar em "forte 7")
- [ ] Empurrar **Detalhe** (152 págs em 7) e **Inovação** (≈133 não-utilitárias em 7) para 8.0 — só onde servir; risco de over-design nas utilitárias. Média atual já é saudável.
- [ ] Advisories de gate pré-existentes: slop emoji `avatars`/`badges`/`banner` (confirmar se é dentro de `Frame code=`), 9 `story-matrix` de date-helpers.

> Método que funcionou: workflow 2-rodadas (por-página → integrador de arquivos compartilhados) + verificação adversarial de P0 + re-score determinístico. Scripts em `/tmp/eidos-*.mjs` na sessão de origem.
