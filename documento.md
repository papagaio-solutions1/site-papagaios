# Documento — Índice navegável do site-papagaios

Ponto de entrada do projeto **Site Papagaios Solutions**. Base arquitetural: **Processo-Padrão**
(arquétipo `ProjetoProduto`) + casas de código `app/` e `server/`.

## Raiz
- `app/` — Frontend React (Next.js) (Etapa 2). Referência: `site_midia5d`.
- `server/` — Backend: IA de conversação / bot Guto + Supabase (Etapa 3).
- `docs/` — Documentação do arquétipo (ver abaixo).
- `Hooks/`, `scripts/`, `Conversa_Agentes/` — infra de agentes (hooks, barramento).
- `.claude/`, `.agents/`, `.codex/` — config dos agentes; `CLAUDE.md` / `AGENTS.md` — adaptadores.

## Documentação — `docs/`
| Pasta | Para quê |
|---|---|
| `docs/00_Indice_Mestre/` | Mapa de tudo, ponto de entrada |
| `docs/00_Specs_SDD/` | Specs no padrão SDD |
| `docs/01_Negocio/` | Info comercial da Papagaios Solutions + cases (preservados) |
| `docs/02_Arquitetura/` | Arquitetura técnica + `desenhos/` |
| `docs/03_Integracoes/` | Supabase, bot Guto (LLM), demais integrações |
| `docs/04_Banco_de_Dados/` | Modelo de dados + migrações Supabase (Etapa 3) |
| `docs/05_Seguranca/` | LGPD, `.env`, chaves, RLS |
| `docs/06_Operacao/` | Runbook + deploy AWS (Etapa 4) |
| `docs/07_Configuracoes/` | Parâmetros e variáveis (sem segredos) |
| `docs/08_Estudos/` | Análises — inclui análise do `site_midia5d` |
| `docs/09_Qualidade/` | QA (`features/`, `scripts/`) |
| `docs/12_API_Contratos/` | Contratos de API frontend ↔ backend/Supabase |
| `docs/specs/` | Specs (SDD) por feature |

## Infra de agentes
| Item | Para quê |
|---|---|
| `Hooks/` | Hooks de sessão/prompt + anti-segredo (ver `Hooks/documento.md`) |
| `scripts/` | `bus.ps1` (barramento), `restaurar-skills.ps1`, rotação |
| `Conversa_Agentes/` | Barramento local isolado Claude ↔ Codex |
| `.claude/` `.agents/` `.codex/` | Config e skills (junctions, não versionadas) |

## Arquivos-raiz
- `README.md` — porta de entrada humana.
- `CLAUDE.md` / `AGENTS.md` — adaptadores de governança do projeto.
- `projeto.yaml` — manifesto de identidade.
- `github.md` — repositórios pessoal e da organização.
- `prd-start.md` — PRD com as 4 etapas de construção.
- `.gitignore` — protege `.env`, artefatos de build e as junctions de skills.

## Decisão de fundação (Etapa 1)
O motor do `PAPAGAIO-NUCLEO` foi **descartado** nesta fundação porque (1) o scaffolder está quebrado no
layout atual do núcleo (o smoke test oficial falha) e (2) nenhuma das 4 famílias serve a um site
institucional. Adotamos as **convenções do Processo-Padrão** (referenciar-não-copiar, `documento.md`
por pasta, segredo fora do Git, harness de hooks + barramento + skills) com o arquétipo `ProjetoProduto`.
Detalhe da análise em `docs/08_Estudos/analise-fundacao-etapa1.md`.
