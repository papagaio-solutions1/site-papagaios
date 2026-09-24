# Site Papagaios Solutions

Site institucional da **Papagaios Solutions** — frontend em **React** e backend com **IA de conversação** (bot **Guto**) e **Supabase**.

## Arquitetura

Base arquitetural: convenções do **Processo-Padrão** (fonte única do padrão), arquétipo **ProjetoProduto** (versão enxuta, só o que se aplica a um site).
O motor do `PAPAGAIO-NUCLEO` foi descartado nesta fundação (scaffolder quebrado no layout atual e nenhuma família serve a um site institucional — ver `08_Estudos/` e `documento.md`).

### Raiz
| Pasta | O quê |
|---|---|
| `app/` | Frontend **React (Next.js)** (Etapa 2), mesma stack da referência `site_midia5d` (Next 16 + Tailwind 4 + shadcn/ui + motion). Identidade 100% Papagaios Solutions. Mantém o bot Guto. |
| `server/` | Backend (Etapa 3): **IA de conversação / bot Guto** (LLM), regras de negócio, APIs e integração **Supabase**. |
| `docs/` | Documentação do arquétipo **ProjetoProduto** (`00_..12_`, `specs/`). |
| `Hooks/`, `scripts/`, `Conversa_Agentes/` | Infra de agentes: hooks, barramento. |
| `.claude/`, `.agents/`, `.codex/` | Config operacional dos agentes (Claude/Codex). |

### Documentação (`docs/`)
`00_Indice_Mestre` · `00_Specs_SDD` · `01_Negocio` · `02_Arquitetura` · `03_Integracoes` · `04_Banco_de_Dados` · `05_Seguranca` · `06_Operacao` · `07_Configuracoes` · `08_Estudos` · `09_Qualidade` · `12_API_Contratos` · `specs`

Cada pasta tem um `documento.md` explicando o que vai nela. Índice navegável completo: [`documento.md`](./documento.md).

### Agentes / IA
- `CLAUDE.md` / `AGENTS.md` — adaptadores de governança do projeto.
- Skills não versionadas (junctions para o `skill-library` do Processo-Padrão); restaurar com `pwsh scripts/restaurar-skills.ps1`.

## Repositórios (ver `github.md`)
- Pessoal: https://github.com/josefarias3108/site-papagaios (privado)
- Organização: https://github.com/papagaio-solutions1/site-papagaios (público)
- Branch de trabalho: **`site-papagaios-solutions`** (push sempre nos dois)

## Regras
- **Segredo nunca entra no Git** — credenciais só via `.env` (ignorado). Ver `05_Seguranca/`.
- **Cases do dono são preservados** para a etapa de integração.
- **Não fazer deploy** até autorização explícita do dono (Etapa 4).

## Assets visuais (`visual/`)
- `logo2.png` — candidata a logo definitiva da Papagaios Solutions (a confirmar na Etapa 2).
- `ideiapaletasdecor.png` — referência de paleta / identidade visual.
- `homem-robo.PNG` — composição de fundo com transparência na primeira página (robô apertando a mão de um humano), à la `site_midia5d`.
