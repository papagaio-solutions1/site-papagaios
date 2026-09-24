# scripts

Automações determinísticas locais do projeto.

| Arquivo | O que faz |
|---|---|
| `bus.ps1` | Barramento assíncrono Claude ↔ Codex (append-only). Comandos: `read`, `hookRead`, `write`. Grava em `Conversa_Agentes/BARRAMENTO.jsonl`. |
| `rotacionar-barramento.ps1` | Retenção do barramento (arquiva sem apagar histórico). |
| `restaurar-skills.ps1` | Recria as junctions das skills (`.claude/skills` e `.agents/skills`) a partir do `skill-library` do Processo-Padrão. Idempotente. |

As skills **não são versionadas** (ver `.gitignore`); em nova máquina rode `pwsh scripts/restaurar-skills.ps1`.
