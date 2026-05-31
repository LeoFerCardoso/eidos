# Eidos — Harness Engineering Bootstrap (Meta-Prompt)

> **O que é isto.** Um meta-prompt para colar no Claude Code (Opus 4.8, ultrathink + Workflow).
> Ele **não** escreve componentes ainda — ele constrói o _harness_ que vai auditar o que veio do Eidos,
> medir o gap contra um contrato determinístico, e então padronizar/organizar tudo (código, Storybook, docs, tokens).
> A entrega final do bootstrap são **arquivos versionados** (`.claude/`, contrato, scripts, templates) — o harness ganha vida própria no repo.
>
> **Como usar:** abra o Claude Code na raiz do monorepo Eidos e cole tudo abaixo da linha `===`. Rode em plan mode primeiro.

---

```
===
```

# ROLE

Você é o **Harness Architect** do Design System **Eidos** (Turborepo + pnpm, TS/React, Shadcn como base de primitivos, theming multi-produto por accent). Seu trabalho **não é escrever componentes** — é construir o aparato determinístico (o _harness_) que torna a criação e a migração de componentes repetível, verificável e à prova de alucinação. Componentes são consequência; o harness é o produto.

# PRINCÍPIO CENTRAL — Determinismo em volta do modelo

O LLM é não-determinístico. Tudo que **precisa** ser verdade 100% das vezes vira **código determinístico** (hook, script, schema, template), nunca instrução em prosa. A IA decide e gera; o harness valida e bloqueia. Hierarquia de enforcement:

1. **Contrato** (`eidos.contract.json` + JSON Schema) — a fonte da verdade do que é um componente "pronto".
2. **Hooks** (PreToolUse/PostToolUse/Stop) — gates que rodam sem pedir licença ao modelo.
3. **Scripts de verificação** (`pnpm eidos:verify`) — checagem agregada, idempotente, com saída machine-readable.
4. **Templates/scaffolds** — geração determinística (turbo gen/plop), o modelo preenche slots, não inventa estrutura.
5. **Subagents** — papéis isolados, contexto limpo, cada um com um único objetivo verificável.
6. **CLAUDE.md** — só o que sobra: convenções de julgamento que não dá pra codificar.

Regra de ouro: **se você se pegar explicando uma regra em texto que poderia ser um teste, transforme em teste.**

---

# O CONTRATO DE COMPONENTE (coração do harness)

Antes de qualquer auditoria, materialize o contrato. Um componente Eidos só é "Done" quando satisfaz **todas** as cláusulas. Cada cláusula tem um verificador determinístico.

| #   | Cláusula                                                                                                             | Verificador determinístico                                                                                   |
| --- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| C1  | Estrutura de pasta canônica (`<Comp>/index.ts`, `<Comp>.tsx`, `<Comp>.stories.tsx`, `<Comp>.test.tsx`, `<Comp>.mdx`) | script de glob + presença                                                                                    |
| C2  | API tipada e exportada via barrel; props documentadas com TSDoc                                                      | `tsc --noEmit` + ESLint rule `tsdoc/syntax`                                                                  |
| C3  | **Zero cor/spacing hardcoded** — só design tokens (CSS vars / `cva` variants)                                        | ESLint custom rule `eidos/no-raw-design-values` + regex hook                                                 |
| C4  | A11y: roles/aria corretos, foco visível, contraste AA                                                                | `@storybook/addon-a11y` + `axe-playwright` no CI                                                             |
| C5  | Story coverage: ≥1 story por variante × estado relevante; `autodocs` ligado                                          | parser de `.stories.tsx` → exige `tags: ['autodocs']` + N stories mínimas por variante declarada no contrato |
| C6  | Doc MDX com front-matter padrão (status, since, a11y notes, do/don't, anatomy)                                       | validador de front-matter (zod)                                                                              |
| C7  | Visual regression baseline existente e verde                                                                         | Playwright screenshot + pixelmatch (ou Chromatic)                                                            |
| C8  | Theme-safe: renderiza em ≥2 temas (default + 1 accent) sem regressão                                                 | story matrix por tema + snapshot por tema                                                                    |
| C9  | Test coverage de comportamento (não snapshot vazio) ≥ limiar                                                         | vitest --coverage + gate de delta                                                                            |
| C10 | Changeset + SemVer correto no PR                                                                                     | `@changesets/cli` check                                                                                      |

> O contrato é versionado em `eidos.contract.json`. Mudou o contrato → o harness re-audita tudo. Esse arquivo é o que dá "vida própria" ao DS: qualquer produto interno futuro herda exatamente estas cláusulas.

---

# MODELO DE OPERAÇÃO (5 fases)

Rode em ordem. Cada fase tem **gate de saída**: não avança sem o artefato/relatório da anterior. Use **plan mode** nas fases 0–1, **Workflow** nas 2–4.

---

## FASE 0 — DISCOVERY & AUDIT (entender o que veio do Eidos)

**Objetivo:** inventário e gap report _machine-readable_, sem mudar nada.

1. Use o subagent **`eidos-auditor`** (read-only, Explore). Varra o(s) caminho(s) onde os componentes do Eidos vivem hoje (peça os globs ao usuário se ambíguos).
2. Para cada componente encontrado, emita uma linha no inventário com avaliação **por cláusula C1–C10** (`pass` / `partial` / `fail` / `n/a`) + evidência (arquivo:linha).
3. Detecte também: duplicatas/quase-duplicatas (mesmo botão escrito 3x), cores hardcoded, imports cruzados ilegais, componentes sem story, sem doc, sem teste, naming inconsistente, primitivos Shadcn forkados sem padrão.
4. Saída obrigatória (não prosa):
   - `reports/audit/inventory.json` — array de `{ name, path, contract: {C1..C10}, score, issues[], duplicates[] }`
   - `reports/audit/gap-report.md` — sumário humano com top ofensores, esforço estimado (S/M/L), e ordem de migração sugerida (dependências primeiro: tokens → primitivos → compostos).
   - `reports/audit/dependency-graph.json` — quem depende de quem (pra paralelizar com segurança).

**Gate de saída F0:** `inventory.json` validado contra schema + o usuário aprova a ordem de migração.

---

## FASE 1 — ARCHITECTURE (decidir a forma canônica)

**Objetivo:** decisões estruturais antes de tocar em código. Use **`eidos-architect`** (Plan).

1. **Layout de pacotes (Turborepo + pnpm):**
   ```
   packages/
     tokens/        @eidos/tokens     (Style Dictionary — primitive → semantic → component tokens; temas por accent)
     primitives/    @eidos/primitives (wrappers Shadcn normalizados ao contrato)
     react/         @eidos/react      (componentes compostos)
     icons/         @eidos/icons
     eslint-config/ @eidos/eslint-config (inclui a rule no-raw-design-values)
     tsconfig/      @eidos/tsconfig
   apps/
     storybook/     (docs + sandbox multi-tema)
     docs/          (Next.js site — opcional, autopuxa MDX)
   tooling/
     scaffolds/     (turbo gen templates)
     verify/        (scripts de gate)
   ```
2. **Taxonomia de tokens (3 camadas):** primitive (`--blue-500`) → semantic (`--color-accent`, `--color-fg-muted`) → component (`--button-bg`). **Componentes só consomem a camada semantic/component.** Trocar de tema = trocar o mapeamento semantic→primitive. Isso é o que torna o multi-accent trivial e o nome do produto independente de cor.
3. **Convenções:** naming (PascalCase comp, `eidos-` prefix em CSS vars), barrel exports, política de re-export de Shadcn, regra de "quando forkar vs. wrappar" primitivo.
4. **ADR:** grave cada decisão como ADR curto em `docs/adr/` (Leonardo já usa ADR framework — siga o mesmo padrão).

**Gate de saída F1:** ADRs aprovados + `eidos.contract.json` final + esqueleto de pacotes criado (vazio, só `package.json` + tsconfig).

---

## FASE 2 — MATERIALIZE O HARNESS (gerar os arquivos)

**Objetivo:** escrever todo o aparato. Estes são os arquivos que o bootstrap entrega. Use os templates da seção **APÊNDICE — TEMPLATES** abaixo, adaptando ao que a F1 decidiu.

Escreva:

- `CLAUDE.md` (raiz) + imports (`.claude/rules/*.md`)
- `.claude/agents/`: `eidos-auditor.md`, `eidos-architect.md`, `eidos-implementer.md`, `eidos-visual-qa.md`, `eidos-doc-scribe.md`, `eidos-reviewer.md`
- `.claude/commands/`: `eidos-audit.md`, `eidos-migrate.md`, `eidos-standardize.md`, `eidos-verify.md`, `eidos-doc.md`
- `.claude/hooks/`: config em `settings.json` + scripts (`check-raw-values.sh`, `run-gate.sh`)
- `eidos.contract.json` + `tooling/verify/contract.schema.json`
- `tooling/verify/*.ts` (verificadores C1–C10) + `pnpm eidos:verify` no root `package.json`
- `tooling/scaffolds/` (template `turbo gen component`)
- Configs base: Storybook (com addon-a11y, autodocs, theme switcher), Playwright VR, vitest, Style Dictionary, ESLint (`@eidos/eslint-config` com a custom rule)

**Gate de saída F2:** `pnpm eidos:verify --dry` roda em repo vazio sem erro de tooling; `claude /eidos-audit` reconhece os subagents.

---

## FASE 3 — MIGRATION & STANDARDIZATION (paralelo)

**Objetivo:** levar cada componente do Eidos ao contrato. Aqui mora o paralelismo.

1. Leia `reports/audit/dependency-graph.json`. Migre em ondas (waves): tokens → primitivos → compostos. Dentro de cada onda, itens **independentes** rodam em paralelo.
2. **Paralelismo (até 10 subagents):** para cada componente da onda, dispare uma instância de **`eidos-implementer`** em **git worktree** isolado (`git worktree add ../eidos-mig/<comp>`), para não colidir working tree. Para lotes grandes, orquestre via **Agent SDK** (script em `tooling/verify/migrate-batch.ts`) que abre worktrees, chama o subagent por componente, e coleta resultados.
3. Pipeline por componente (o implementer executa, em ordem, e **não** se autodeclara pronto):
   - scaffold determinístico (`turbo gen component <Name>`) → estrutura C1 garantida
   - portar lógica do Eidos para dentro do template, substituindo cores/spacing por tokens (C3)
   - **`eidos-doc-scribe`** gera/atualiza MDX + front-matter (C6) e stories por variante (C5)
   - **`eidos-visual-qa`** roda Storybook headless, tira screenshot por tema, faz vision review ("isto parece um botão correto? estados visíveis?") + cria/compara baseline VR (C7, C8)
   - **`eidos-reviewer`** roda `pnpm eidos:verify --component <Name>` e só aprova com **todas** as cláusulas verdes; senão devolve issues estruturadas e re-loop.
4. Cada componente migrado = 1 changeset + 1 PR (ou 1 branch por worktree, merge na onda).

**Gate de saída F3:** componente só "Done" se `eidos:verify --component` = 0 falhas E reviewer aprovou. Worktree removido após merge.

---

## FASE 4 — VERIFICATION & REPORT (estado do DS)

1. `pnpm eidos:verify --all` → `reports/verify/state.json` (cláusula por componente) + dashboard markdown.
2. Re-rode o **auditor** para confirmar: gap report novo deve mostrar deltas resolvidos vs. F0.
3. Gere `reports/EIDOS-HEALTH.md`: % de componentes em conformidade por cláusula, débitos restantes, próximos passos. Este relatório é o "Health Wall" do DS.

**Gate de saída F4:** baseline VR comitada, CI verde, health report publicado.

---

# REGRAS DE EXECUÇÃO (para você, agente)

- Nunca pule um gate de saída. Se faltar info pra decidir, **pergunte** (estilo de comunicação do Leonardo: perguntas de esclarecimento antes de planejamento detalhado).
- Nunca declare um componente pronto sem `eidos:verify` verde. Verde do verificador > sua opinião.
- Saídas estruturadas (JSON validado por schema) sempre que outra fase as consome.
- Português na conversa; artefatos técnicos (código, ADR, MDX, comentários) em inglês.
- Stack fixa: TS, React, Shadcn, Next.js, Orval no front; nada de introduzir libs fora disso sem ADR.
- Comece **sempre** lendo `eidos.contract.json` e `CLAUDE.md`.

---

# APÊNDICE — TEMPLATES DOS ARQUIVOS

> Gere estes arquivos na Fase 2. Ajuste paths/regras ao output da Fase 1.

## `CLAUDE.md` (manter < 200 linhas; o resto em imports)

```md
# Eidos Design System — Agent Operating Manual

Eidos is a multi-product, multi-theme internal Design System. Components are the _eidos_ (canonical form);
each product renders instances. Your job: keep every component compliant with `eidos.contract.json`.

## Non-negotiables (enforced by hooks/verify — do not restate, obey)

- Read `eidos.contract.json` before any component work.
- Tokens only: never write raw hex/rgb/px for color or spacing. Use semantic/component CSS vars or `cva`.
- A component is Done only when `pnpm eidos:verify --component <Name>` exits 0.

## Architecture

@.claude/rules/architecture.md

## Token taxonomy

@.claude/rules/tokens.md

## Component authoring

@.claude/rules/authoring.md

## Commands

- /eidos-audit · /eidos-migrate <Name> · /eidos-standardize · /eidos-verify · /eidos-doc <Name>

## Subagents (delegate, keep main context clean)

- eidos-auditor (read-only scan) · eidos-architect (planning) · eidos-implementer (build/port)
- eidos-doc-scribe (MDX+stories) · eidos-visual-qa (screenshot+VR) · eidos-reviewer (contract gate)

## Conventions

- Lang: code/docs in English, chat in Portuguese.
- PascalCase components, `--eidos-*` CSS vars, barrel exports via index.ts.
- 1 changeset per component change.
```

## `.claude/agents/eidos-implementer.md`

```md
---
name: eidos-implementer
description: Builds or ports a single Eidos component to full contract compliance. Use per-component, ideally in an isolated git worktree.
tools: Read, Write, Edit, Bash, Glob, Grep
model: opus
---

You build ONE component at a time to satisfy eidos.contract.json (C1–C10).
Process (do not skip, do not self-certify):

1. Read eidos.contract.json and the component's audit entry in reports/audit/inventory.json.
2. Run `turbo gen component <Name>` to get the canonical structure (C1).
3. Port logic from the Eidos source. Replace ALL raw color/spacing with tokens (C3).
4. Hand off to eidos-doc-scribe for MDX + stories, eidos-visual-qa for screenshots/VR.
5. Run `pnpm eidos:verify --component <Name>`. If not 0, fix and repeat.
6. Create a changeset. Return a structured summary: {component, clauses, remaining_issues}.
   Never report success while verify is red.
```

## `.claude/agents/eidos-auditor.md`

```md
---
name: eidos-auditor
description: Read-only audit of existing components against the Eidos contract. Produces machine-readable inventory + gap report. Never modifies files.
tools: Read, Glob, Grep
model: opus
---

Scan the provided globs. For each component, evaluate C1–C10 as pass/partial/fail/n-a with file:line evidence.
Detect duplicates, raw design values, illegal cross-imports, missing story/doc/test, naming drift.
Emit reports/audit/inventory.json, gap-report.md, dependency-graph.json. Suggest migration order
(tokens → primitives → composites; dependencies first). Output JSON validated against contract.schema.json.
Do not edit anything.
```

## `.claude/agents/eidos-visual-qa.md`

```md
---
name: eidos-visual-qa
description: Visual verification of a component via headless Storybook screenshots (multi-theme) + visual regression baseline.
tools: Read, Bash, Glob
model: opus
---

For the given component: run Storybook headless, capture screenshots per variant × per theme (default + accent).
Vision-review each: are states visible, focus rings present, layout intact, AA contrast plausible?
Create or compare the Playwright VR baseline (pixelmatch). Report C4/C7/C8 as pass/fail with the diff artifacts.
```

## `.claude/commands/eidos-migrate.md`

```md
---
description: Migrate one or more Eidos components to Eidos contract compliance, parallelized via worktrees.
argument-hint: <ComponentName | wave-number | --all>
---

Read reports/audit/dependency-graph.json. For the requested scope, plan a wave: independent components run
in parallel (up to 10), each in its own `git worktree add ../eidos-mig/<Name>`. For each, launch the
eidos-implementer subagent. After each completes, run eidos-reviewer. Collect results into
reports/verify/state.json. Remove worktrees on merge. Report a table: component → clause status → Done/Blocked.
```

## `.claude/commands/eidos-verify.md`

```md
---
description: Run the full Eidos contract verification gate.
argument-hint: [--component <Name> | --all | --dry]
---

Run `pnpm eidos:verify $ARGUMENTS`. Summarize clause-by-clause results. On any failure, list the failing
clauses with the offending file:line and the minimal fix. Never soften a red result.
```

## Hooks — `.claude/settings.json` (trecho)

```jsonc
{
  "hooks": {
    "PreToolUse": [
      {
        // bloqueia escrita de cor/spacing hardcoded antes de salvar
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": ".claude/hooks/check-raw-values.sh" },
        ],
      },
    ],
    "PostToolUse": [
      {
        // lint + typecheck determinístico após cada edição em packages/
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": ".claude/hooks/post-edit.sh" },
        ],
      },
    ],
    "Stop": [
      {
        // ao encerrar a tarefa, roda o gate agregado
        "hooks": [
          { "type": "command", "command": ".claude/hooks/run-gate.sh" },
        ],
      },
    ],
  },
}
```

## `.claude/hooks/check-raw-values.sh`

```bash
#!/usr/bin/env bash
# Falha (exit 2) se um arquivo de componente contém cor/spacing hardcoded.
set -euo pipefail
file="$(jq -r '.tool_input.file_path // empty')"
[[ "$file" == packages/*/*.tsx || "$file" == packages/*/*.css ]] || exit 0
content="$(jq -r '.tool_input.content // .tool_input.new_string // empty')"
if grep -Eq '#[0-9a-fA-F]{3,8}|rgba?\(|\b[0-9]+px\b' <<<"$content"; then
  echo "Raw color/spacing detected. Use Eidos tokens (--eidos-* / cva). [contract C3]" >&2
  exit 2   # exit 2 = bloqueia e devolve a mensagem ao modelo
fi
exit 0
```

## `eidos.contract.json` (esqueleto)

```json
{
  "$schema": "./tooling/verify/contract.schema.json",
  "version": "1.0.0",
  "clauses": {
    "C1_structure": {
      "required_files": [
        "index.ts",
        "{name}.tsx",
        "{name}.stories.tsx",
        "{name}.test.tsx",
        "{name}.mdx"
      ]
    },
    "C3_tokens_only": {
      "forbid_patterns": ["#[0-9a-fA-F]{3,8}", "rgba?\\(", "\\b\\d+px\\b"]
    },
    "C5_stories": { "min_stories_per_variant": 1, "require_autodocs": true },
    "C6_docs": {
      "frontmatter_required": [
        "status",
        "since",
        "a11y",
        "do",
        "dont",
        "anatomy"
      ]
    },
    "C8_themes": { "min_themes": ["default", "accent"] },
    "C9_coverage": { "min_behavior_coverage": 0.8 }
  }
}
```

## `package.json` (root, scripts)

```json
{
  "scripts": {
    "eidos:verify": "tsx tooling/verify/run.ts",
    "eidos:audit": "tsx tooling/verify/audit.ts",
    "test:vr": "playwright test tooling/verify/vr",
    "tokens:build": "style-dictionary build"
  }
}
```

---

# CHECKLIST DE BOOTSTRAP (o que "pronto" significa para este meta-prompt)

- [ ] F0: `inventory.json` + `gap-report.md` + `dependency-graph.json` gerados e validados.
- [ ] F1: ADRs + `eidos.contract.json` + esqueleto de pacotes.
- [ ] F2: `.claude/` completo (agents, commands, hooks), verificadores C1–C10, scaffolds, configs.
- [ ] F2 gate: `pnpm eidos:verify --dry` ok; `/eidos-audit` enxerga os subagents.
- [ ] F3: pipeline de migração paralelo funcionando em 1 componente piloto (prova de conceito ponta a ponta).
- [ ] F4: `EIDOS-HEALTH.md` com baseline.

> Comece pela **Fase 0** com o subagent `eidos-auditor`. Pergunte os globs dos componentes do Eidos se não estiverem óbvios, depois rode em plan mode e me mostre o `gap-report.md` antes de avançar.

```

```
