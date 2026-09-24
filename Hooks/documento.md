# Hooks

Harness de hooks do projeto (herdado do Processo-Padrão, conjunto de **produto**). Nudge, não bloqueia —
exceto o anti-segredo, que é o único de bloqueio.

| Arquivo | Evento | O que faz |
|---|---|---|
| `check_secrets.py` | PreToolUse (git) + `git/pre-commit` | **BLOQUEIA** `git add`/`commit` com segredo (.env, chaves, tokens, CPF). Único que bloqueia. |
| `git/pre-commit` | git | Roda o anti-segredo no nível git. Ativar: `git config core.hooksPath Hooks/git`. |
| `validar-estrutura-projeto.ps1` | SessionStart | Nudge: compara a árvore contra o molde e aponta o que falta. Falha segura (exit 0). |
| `estado-fluxo-agente.ps1` | SessionStart | Nudge: só em ProjetoAgent (tem `agentes/`); aqui sai em silêncio. |
| `roteador-escalonamento.ps1` | UserPromptSubmit | Nudge: sugere nível de modelo/perfil pelo verbo do prompt. |
| `lib-molde-estrutura.ps1` | — | Lib com as listas do molde (usada pelo validador de estrutura). |

Telemetria da tribo (`monitor-agents-hook`, `lembrete-consumo-maquina`, etc.) é interna do Processo-Padrão
e **não** pertence a um produto — por isso não foi trazida.

Extensão local opcional: `Hooks/check_secrets.local.py` (padrões extras específicos do projeto).
