# Handover — site-papagaios (Papagaios Solutions IA)

> Última sessão: **2026-09-24**. Ponto de retomada para amanhã. Ler este arquivo primeiro.

## Onde parei / por onde começar amanhã

**Ordem de amanhã:** (1) terminar pendências visuais da Etapa 2 → (2) **Etapa 3 (Backend + Supabase)** → (3) Etapa 4 (deploy, sem publicar).

O José pediu para começar amanhã pela **Etapa 3 (backend)**. Antes, há ajustes visuais pendentes da Etapa 2 (abaixo) que ele ainda não aprovou.

---

## Status das etapas

| Etapa | Status | Observação |
|---|---|---|
| 1 — Arquitetura e repositórios | ✅ Concluída | Base Processo-Padrão + arquétipo ProjetoProduto; infra de agentes; branch nos 2 repos |
| 2 — Frontend React (Next.js) | ⚠️ Funcional, **ajustes visuais pendentes** | Site roda local sem backend; identidade trocada; falta aprovar logo/header/nitidez |
| 3 — Backend + Supabase | ⬜ Pendente (**primeira de amanhã**) | Precisa das credenciais do novo Supabase no `.env` |
| 4 — Deploy (sem publicar) | ⬜ Pendente | Referência AWS: `painel_medflow`. **Não publicar até o dono autorizar** |

---

## PENDÊNCIAS DA ETAPA 2 (visual — o dono ainda não gostou)

O header/logo e a nitidez ainda **não** foram aprovados. Já foi feito: header maior, logo como badge arredondado, avatar do Guto voltou ao original (metade humano/robô — `guto.webp`), otimização de imagem desligada (`next.config.ts: images.unoptimized`), véu do hero reduzido.

**Observação honesta a mostrar ao dono ao logar (pedido dele para registrar):**
> A logo (`logo2.png`) e a `homem-robo.PNG` agora aparecem na resolução real dos arquivos — se ainda parecerem limitadas, é porque o arquivo de origem tem resolução baixa. Nesse caso, o ideal seria você me passar versões em **alta resolução** (e, para o header, um **PNG só do papagaio com fundo transparente**), que aí fica perfeito.

**Preciso do dono para finalizar o visual:**
- [ ] Logo em **alta resolução** + versão **só do papagaio, fundo transparente** (para o símbolo do header).
- [ ] `homem-robo` em alta resolução (o atual é baixo → aspecto "fosco" no hero).
- [ ] Número de **WhatsApp** oficial (hoje é placeholder `5521999999999` em `frontend/src/lib/site.ts`).
- [ ] **E-mail** de contato oficial (hoje placeholder `contato@papagaiossolutions.com.br` em `frontend/src/app/contato/page.tsx`).
- [ ] Confirmar bio/foto do time em `frontend/src/app/sobre/page.tsx` (José Augusto mantido).

---

## ETAPA 3 — Backend + Supabase (começar por aqui amanhã)

Casa do backend: **`backend/`** (hoje só placeholder). Referência: `../site_midia5d/`.

**Tarefas:**
1. Examinar o backend do `site_midia5d` e migrar a lógica aplicável para `backend/` (e/ou manter as rotas Next em `frontend/src/app/api`, decidir a organização). Fontes no `site_midia5d`:
   - `src/app/api/chat/route.ts` — endpoint do Guto (Groq streaming, rate limit, guardrails).
   - `src/lib/guto/` — `knowledge.ts` (system prompt) e `flow.ts` (fluxo determinístico).
   - `src/lib/telegram.ts` — notificação de lead (Telegram).
   - `src/components/chat/actions.ts` e `src/app/contato/actions.ts` — server actions (gravam em Supabase).
   - `src/lib/supabase/{client,server}.ts` — clientes Supabase.
2. Levantar o **esquema de dados** do original: `../site_midia5d/supabase/migrations/` → reproduzir no **novo Supabase** com migrações versionadas em `docs/04_Banco_de_Dados/_entregaveis/` (ou `backend/`). Tabelas conhecidas: `leads_chat`, `leads`, `clientes`. Verificar relacionamentos, índices, permissões e **RLS**.
3. **Não alterar** o banco do `site_midia5d`.
4. Quando o dono enviar as credenciais no `.env` (`frontend/.env.local`): rodar migrações, ligar auth, formulários e o **Guto no modo IA** (`NEXT_PUBLIC_GUTO_AI=on` + `GROQ_API_KEY`), testar fluxos completos (Guto, cases, contato, login).
5. **Nunca** commitar `.env`/chaves.

**Variáveis de ambiente esperadas** (ver `frontend/.env.example`): `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GROQ_API_KEY`, `GROQ_MODEL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, e `NEXT_PUBLIC_GUTO_AI=on` para ativar a IA do Guto.

---

## ETAPA 4 — Deploy (sem publicar)

- Estudar como o `painel_medflow` usa a AWS; aproveitar acesso do ambiente **sem copiar segredos** para código/repos.
- Preparar recursos, variáveis e instruções de deploy só para a Papagaios; sem interferir no Medflow.
- Verificar **portas ocupadas** no servidor e escolher uma livre; conferir conflito de serviço/container/proxy.
- **NÃO executar o deploy** — só quando o dono autorizar.

---

## Como rodar o frontend (local)

```powershell
cd "C:\Users\Cliente\OneDrive\Área de Trabalho\Antigravity\site-papagaios\frontend"
npm run dev        # http://localhost:3000
```
Estado atual: navegável **sem backend** (Supabase/auth/contato mostram aviso de demo; Guto em modo fluxo determinístico offline).

## Estrutura do repositório

- `frontend/` — app **Next.js 16** (React 19 + Tailwind 4 + shadcn/ui + motion). Identidade Papagaios.
- `backend/` — backend (Etapa 3): IA de conversação / Guto + Supabase. Hoje placeholder.
- `docs/` — arquétipo ProjetoProduto (`00_..12_`, `specs/`), um `documento.md` por pasta.
- `Hooks/`, `scripts/`, `Conversa_Agentes/` — infra de agentes (anti-segredo, barramento).
- `.claude/ .agents/ .codex/` — config; skills por **junction** (não versionadas, restaurar com `pwsh scripts/restaurar-skills.ps1`).

## Repositórios (push SEMPRE nos dois)

- `origin` → `github.com/josefarias3108/site-papagaios` (privado)
- `org` → `github.com/papagaio-solutions1/site-papagaios` (público)
- Branch de trabalho: **`site-papagaios-solutions`**

## Decisões técnicas importantes (não reverter sem motivo)

- Motor do `PAPAGAIO-NUCLEO` **descartado** (quebrado + sem família p/ site) — ver `docs/08_Estudos/analise-fundacao-etapa1.md`.
- `next.config.ts`: `images.unoptimized = true` (nitidez máxima; imagens servidas na resolução original).
- Guto: `frontend/src/components/chat/useGutoChat.ts` inicia em **modo fluxo**; IA liga com `NEXT_PUBLIC_GUTO_AI=on`.
- Supabase: `client.ts`/`server.ts` retornam `null` quando não configurado → páginas degradam com `DemoBackendNotice`.
- Hook anti-segredo (`Hooks/check_secrets.py`): regex refinada p/ não marcar `process.env`/`String()`/campos de form como falso positivo (mantém detecção de segredos reais).

## ⚠️ Cuidados / lições

- **Nunca** rodar replace/edição em massa varrendo `.agents/skills/` ou `.claude/skills/` — são **junctions para o `skill-library` do Processo-Padrão**; editar ali altera a fábrica. (Ocorreu e foi revertido nesta sessão.)
- Não alterar `site_midia5d`, `Processo-Padrao` nem o banco do Medflow (só leitura como referência).
- Segredo nunca no Git; `.env` ignorado.
