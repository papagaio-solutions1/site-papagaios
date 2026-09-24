# Documento — Índice navegável do site-papagaios

Ponto de entrada do projeto **Site Papagaios Solutions**. Base arquitetural: **Processo-Padrão** (arquétipo `ProjetoProduto` enxuto) + casas de código `app/` e `server/`.

## Código
- `app/` — Frontend React/Vite (Etapa 2). Referência: `site_midia5d`.
- `server/` — Backend: IA de conversação / bot Guto + Supabase (Etapa 3).

## Áreas de governança / documentação
| Pasta | Para quê |
|---|---|
| `00_Indice_Mestre/` | Mapa de tudo, ponto de entrada |
| `00_Specs_SDD/` | Specs no padrão SDD |
| `01_Negocio/` | Info comercial da Papagaios Solutions + cases (preservados) |
| `02_Arquitetura/` | Arquitetura técnica + `desenhos/` |
| `03_Integracoes/` | Supabase, bot Guto (LLM), demais integrações |
| `04_Banco_de_Dados/` | Modelo de dados + migrações Supabase (Etapa 3) |
| `05_Seguranca/` | LGPD, `.env`, chaves, RLS |
| `06_Operacao/` | Runbook + deploy AWS (Etapa 4) |
| `07_Configuracoes/` | Parâmetros e variáveis (sem segredos) |
| `08_Estudos/` | Análises — inclui análise do `site_midia5d` |
| `09_Qualidade/` | QA (`features/`, `scripts/`) |
| `12_API_Contratos/` | Contratos de API frontend ↔ backend/Supabase |
| `specs/` | Specs (SDD) por feature |
| `_Conversas_Agentes/` | Handovers / barramento isolado do projeto |

## Arquivos-raiz
- `README.md` — porta de entrada humana.
- `projeto.yaml` — manifesto de identidade do projeto.
- `github.md` — repositórios pessoal e da organização.
- `prd-start.md` — PRD com as 4 etapas de construção.
- `.gitignore` — protege `.env` e artefatos de build.

## Decisão de fundação (Etapa 1)
O motor do `PAPAGAIO-NUCLEO` foi **descartado** nesta fundação porque:
1. o scaffolder está quebrado no layout atual do núcleo (o smoke test oficial falha — os scripts apontam para pastas de raiz que foram movidas para `.padrao-papagaio/` e `.llm/`, e `Familias/` não existe);
2. nenhuma das 4 famílias (`painel-clinicas`, `bot-llm`, `bot-deterministico`, `plataforma-papagaio`) serve a um site institucional.

Adotamos as **convenções do Processo-Padrão** (referenciar-não-copiar, `documento.md` por pasta, segredo fora do Git) com o arquétipo `ProjetoProduto` enxuto. Detalhe da análise em `08_Estudos/`.
