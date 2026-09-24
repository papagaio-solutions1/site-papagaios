Você será responsável por criar o site da **Papagaios Solutions**. Execute o trabalho em etapas, concluindo e testando cada uma antes de avançar para a próxima. Não faça o deploy até eu avisar.

## Etapa 1 — Arquitetura e repositórios  ✅ CONCLUÍDA (2026-09-24)

> **Decisão de arquitetura (ver `docs/08_Estudos/analise-fundacao-etapa1.md`):** o motor do
> `PAPAGAIO-NUCLEO` (`motor-criar-projetos`) foi **descartado** nesta fundação porque (1) o scaffolder
> está quebrado no layout atual do núcleo — o smoke test oficial `testar-motor-projetos.ps1` falha, pois
> os scripts apontam para pastas de raiz que foram movidas para `.padrao-papagaio/` e `.llm/`, e
> `Familias/` não existe — e (2) nenhuma das 4 famílias (`painel-clinicas`, `bot-llm`,
> `bot-deterministico`, `plataforma-papagaio`) serve a um site institucional.
>
> **Base adotada:** convenções do projeto **`Processo-Padrao`** (referenciar-não-copiar, `documento.md`
> por pasta, segredo fora do Git), com o arquétipo **`ProjetoProduto`** (versão enxuta) + casas de
> código próprias.

Estrutura do projeto (raiz limpa):

- `app/` — frontend **React (Next.js)** (Etapa 2), referência `site_midia5d`.
- `server/` — backend de **IA de conversação / bot Guto** (LLM) + Supabase (Etapa 3).
- `docs/` — documentação do arquétipo ProjetoProduto (`00_..12_`, `specs/`), um `documento.md` por pasta.
- Infra de agentes: `Hooks/` (anti-segredo + nudges), `scripts/` (barramento `bus.ps1`,
  `restaurar-skills.ps1`), `Conversa_Agentes/` (barramento local isolado), `.claude/` `.agents/` `.codex/`
  (config + skills por **junction**, não versionadas). Adaptadores `CLAUDE.md` / `AGENTS.md`.
- Skills ativas (junction para o `skill-library` do Processo-Padrão): `especialista-react`,
  `especialista-front-end`, `ux-ui-design`, `especialista-banco-dados`, `especialista-aws`,
  `especialista-qa` + núcleo (`escritor-tecnico`, `engenheiro-de-prompt`, `orquestrador-claude-code`,
  `curador-de-conhecimento`, `monitor-contexto-tokens`, `fechar-spec`).

Repositórios (`github.md`) — **branch `site-papagaios-solutions` criada e enviada nos dois**:

- Pessoal: `github.com/josefarias3108/site-papagaios` (privado) — remoto `origin`.
- Organização: `github.com/papagaio-solutions1/site-papagaios` (público) — remoto `org`.
- Regra: todo `push` vai **nos dois** remotos. Segredo nunca no Git (`.env` ignorado + hook anti-segredo).

## Etapa 2 — Frontend React, com teste local

O gestor definiu **React** para o frontend. Use o projeto `site-midia5d` como referência e reproduza com fidelidade seu visual, estrutura de páginas, navegação, componentes, animações e comportamento responsivo. Substitua integralmente a identidade e as informações comerciais da Mídia 5D pelas da **Papagaios Solutions**. Os *cases* existentes são meus e devem ser preservados para a etapa de integração.

Confira os arquivos da pasta `visual` antes de implementá-los:

* `visual\ideiapaletasdecor.png`: referência da paleta, do nome e da identidade visual do site.
* `visual\homem-robo.PNG`: use na primeira página, na composição de fundo com transparência atrás do conteúdo principal, seguindo a referência do robô apertando a mão de um humano no `site-midia5d`. Confira visualmente o arquivo para aplicá-lo corretamente.

Verifique também qual arquivo contém a logo definitiva da Papagaios Solutions; não presuma que a imagem `homem-robo.PNG` seja a logo apenas por ter sido citada junto dela. Se a logo não estiver disponível, deixe o ponto de aplicação preparado e identifique essa pendência.

Mantenha o bot Guto e reproduza sua interface. Nesta etapa, o site deve permitir navegar e avaliar o visual **sem backend**. Onde uma ação depender de dados, use apenas dados locais de demonstração, identificados no código, sem apresentar funcionalidades simuladas como se estivessem integradas.

Execute o frontend localmente. Teste navegação, layout em computador e celular, legibilidade sobre a imagem de fundo e ausência de informações da Mídia 5D. Corrija os problemas encontrados e me informe o endereço local para avaliação.

## Etapa 3 — Backend e Supabase

Depois de concluir os testes do frontend, examine o backend do `site-midia5d` e migre **toda a lógica aplicável** para os módulos corretos da arquitetura do novo projeto. Inclua os *cases* existentes, preservando seus conteúdos. Organize de forma clara as APIs, regras de negócio, integrações, configurações e dependências. Use os agentes, skills e orientações para LLMs do `PAPAGAIO-NUCLEO` quando forem pertinentes ao trabalho.

Levante o esquema de dados do projeto original e prepare a criação das mesmas tabelas e demais estruturas necessárias no **novo projeto Supabase**. Entregue as migrações versionadas e verifique relacionamentos, índices, permissões e políticas de acesso. Enviarei as credenciais do novo projeto no `.env`; até elas estarem disponíveis, prepare e valide o que for possível sem conectar ao banco. Não altere o banco do `site-midia5d`.

Quando as credenciais estiverem disponíveis, execute as migrações no novo Supabase, integre frontend e backend e teste os fluxos completos, inclusive o bot Guto e os *cases*. Nunca publique `.env`, chaves ou credenciais no Git.

## Etapa 4 — Preparação do deploy, sem publicar

Examine como o projeto `painel_medflow` usa a AWS e aproveite a configuração de acesso disponível no ambiente, sem copiar segredos para o código ou para os repositórios. Prepare recursos, variáveis de ambiente e instruções de deploy específicos para a Papagaios Solutions, sem interferir no Medflow.

Antes de definir a porta de produção, verifique as portas efetivamente ocupadas no servidor de destino e escolha uma livre. Confirme também que serviço, container e proxy não entrarão em conflito com outros projetos. **Não execute o deploy: eu avisarei quando autorizar essa etapa.**

## Acompanhamento

Ao final de cada etapa, apresente:

1. O que foi implementado e em quais módulos.
2. Os testes executados e seus resultados.
3. O que precisa da minha avaliação ou de credenciais para continuar.
4. A próxima etapa prevista.

Siga a ordem acima. Se alguma regra do `PAPAGAIO-NUCLEO` ou de `github.md` entrar em conflito com este pedido, mostre o trecho e a decisão necessária antes de alterar a arquitetura ou os repositórios.
