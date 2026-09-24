# Análise de fundação — Etapa 1 (2026-09-24)

## Objetivo
Escolher a arquitetura/base do projeto `site-papagaios` conforme o PRD (`prd-start.md`, Etapa 1),
examinando `PAPAGAIO-NUCLEO` (motor `motor-criar-projetos`) e o `Processo-Padrao`.

## Achado 1 — Motor do PAPAGAIO-NUCLEO está quebrado (evidência)
O smoke test oficial do motor falha:

```
> testar-motor-projetos.ps1
criar-projeto-base.ps1:20 — não é possível localizar
'PAPAGAIO-NUCLEO\Guardrails\azure-devops-escopo.json' porque ele não existe.
```

Causa: os scripts (`criar-projeto.ps1` / `criar-projeto-base.ps1`) apontam para pastas na **raiz**
do núcleo (`Familias/`, `Guardrails/`, `Barramento/`, `.agents/.claude/.codex`, `Design-System/`,
`Evals/`, `Hooks/`, `MLOps/`, `Arquitetura/`) que foram **reorganizadas** para dentro de
`.padrao-papagaio/` e `.llm/`. Além disso, `Familias/` **não existe** (nenhuma família materializada).
Rodar o motor exigiria antes consertar o próprio núcleo.

## Achado 2 — Nenhuma família serve a um site institucional
O motor só aceita: `painel-clinicas`, `bot-llm`, `bot-deterministico`, `plataforma-papagaio`.
Um site de marketing em React + bot Guto (LLM) + Supabase não mapeia em nenhuma.

## Achado 3 — Motor recusa destino existente
`criar-projeto.ps1` lança erro se `-Destino` já existe; `site-papagaios/` já tinha `.env`,
`github.md`, `prd-start.md`, `visual/`.

## Decisão (aprovada pelo dono)
Base = **convenções do Processo-Padrão** + arquétipo **ProjetoProduto (enxuto)** + casas de código
`frontend/` (frontend React) e `backend/` (backend IA de conversação / bot Guto + Supabase).

Motivos: o scaffolder do Processo-Padrão (`propagar_estrutura.ps1`) **funciona**, é **idempotente e
não-destrutivo** (não apaga `.env`/`visual/`), e o repositório traz `skill-library` com
`especialista-react`, `especialista-front-end`, `ux-ui-design`, `especialista-banco-dados`,
`especialista-aws`, `especialista-qa`.

Pastas descartadas por não se aplicarem a um site: `10_Kafka`, `11_Orquestradora`, variante
Presencial/`13_Mendix`, blocos bancários `Blocos_PF`/`Blocos_PJ`.

## Convenções herdadas do Processo-Padrão
- Referenciar, não copiar (fonte única do padrão).
- `documento.md` por pasta explicando o conteúdo.
- Segredo nunca no Git (`.env` ignorado); hooks em `Hooks/` quando houver.
- Auto-commit semântico em pt-BR ao concluir tarefa; `push` só quando o dono pedir.
