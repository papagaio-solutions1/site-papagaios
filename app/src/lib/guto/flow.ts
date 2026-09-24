import { services } from "@/lib/services";
import { siteConfig, whatsappLink } from "@/lib/site";

/** Dados coletados ao longo da conversa. */
export type GutoCtx = {
  name?: string;
  phone?: string;
  email?: string;
  interesse?: string;
  dor?: string;
  porte?: string;
};

export type FlowOption = {
  label: string;
  /** avança para outro nó do fluxo */
  next?: string;
  /** link (interno ou externo) — pode depender do contexto */
  href?: string | ((c: GutoCtx) => string);
  external?: boolean;
  /** grava dados no contexto ao ser escolhido */
  set?: Partial<GutoCtx>;
};

export type AskSpec = {
  field: "name" | "phone" | "email";
  placeholder: string;
  validate?: "name" | "phone" | "email-optional";
  next: string;
};

export type FlowNode = {
  id: string;
  bot: string | ((c: GutoCtx) => string);
  options?: FlowOption[];
  ask?: AskSpec;
  /** ao entrar neste nó, persiste o lead (server action) */
  save?: boolean;
};

export const START_NODE = "root";

/** Mensagem pré-preenchida do WhatsApp com o que o Guto já sabe. */
export function gutoWhatsappMessage(c: GutoCtx): string {
  const parts = [
    `Olá! ${c.name ? `Sou ${c.name}. ` : ""}Vim pelo chat do site da Papagaios Solutions.`,
  ];
  if (c.interesse) parts.push(`Tenho interesse em ${c.interesse}.`);
  if (c.dor) parts.push(`Principal desafio: ${c.dor}.`);
  if (c.porte) parts.push(`Porte: ${c.porte}.`);
  return parts.join(" ");
}

const firstName = (c: GutoCtx) => c.name?.trim().split(/\s+/)[0] ?? "";

// Nós das 4 frentes, gerados a partir de services.ts (fonte única).
const serviceNodes: FlowNode[] = services.map((s) => ({
  id: `svc_${s.slug}`,
  bot: `**${s.name}**\n${s.tagline}\n• ${s.bullets.join("\n• ")}`,
  options: [
    { label: "Quero isso no meu negócio", set: { interesse: s.name }, next: "dor" },
    { label: "Ver outra frente", next: "servicos" },
    { label: "Falar com especialista", next: "agendar_intro" },
  ],
}));

const nodes: FlowNode[] = [
  {
    id: "root",
    bot: "Oi! Eu sou o **Guto**, assistente da Papagaios Solutions 🤖 Como posso te ajudar hoje?",
    options: [
      { label: "🤖 Automatizar meu negócio", next: "dor" },
      { label: "💬 Conhecer os serviços", next: "servicos" },
      { label: "📅 Agendar uma reunião", next: "agendar_intro" },
      { label: "❓ Tirar uma dúvida", next: "faq" },
    ],
  },

  // ---------- Serviços ----------
  {
    id: "servicos",
    bot: "Temos 4 frentes 👇 Sobre qual você quer saber?",
    options: [
      ...services.map((s) => ({ label: s.name, next: `svc_${s.slug}` })),
      { label: "Falar com um especialista", next: "agendar_intro" },
    ],
  },
  ...serviceNodes,

  // ---------- FAQ ----------
  {
    id: "faq",
    bot: "Claro! Sobre o que é a sua dúvida?",
    options: [
      { label: "💰 Preço / investimento", next: "faq_preco" },
      { label: "⚙️ Como funciona", next: "faq_processo" },
      { label: "🏢 Atende meu segmento?", next: "faq_segmento" },
      { label: "⏱️ Prazo de entrega", next: "faq_prazo" },
      { label: "🔒 Segurança / LGPD", next: "faq_lgpd" },
      { label: "↩️ Voltar", next: "root" },
    ],
  },
  {
    id: "faq_preco",
    bot: "Cada projeto é **sob medida** — o investimento depende do escopo e do retorno esperado. O melhor caminho é a gente entender sua necessidade numa conversa rápida, sem compromisso. 😊",
    options: [
      { label: "Quero um orçamento", next: "dor" },
      { label: "Outra dúvida", next: "faq" },
      { label: "↩️ Início", next: "root" },
    ],
  },
  {
    id: "faq_processo",
    bot: "Trabalhamos em 3 passos:\n1️⃣ Entendemos o seu **Desafio**\n2️⃣ Desenhamos a **Solução** (agente, automação ou dashboard)\n3️⃣ Entregamos e medimos o **Resultado**",
    options: [
      { label: "Quero começar", next: "dor" },
      { label: "Outra dúvida", next: "faq" },
    ],
  },
  {
    id: "faq_segmento",
    bot: "Atendemos vários segmentos — de clínicas a delivery e serviços. Dá uma olhada em alguns resultados reais nos nossos cases! 🚀",
    options: [
      { label: "Ver cases", href: "/cases" },
      { label: "Quero conversar", next: "agendar_intro" },
      { label: "Outra dúvida", next: "faq" },
    ],
  },
  {
    id: "faq_prazo",
    bot: "Depende do escopo, mas trabalhamos de forma ágil: muitas automações entram no ar em **poucas semanas**.",
    options: [
      { label: "Quero começar", next: "dor" },
      { label: "Outra dúvida", next: "faq" },
    ],
  },
  {
    id: "faq_lgpd",
    bot: "Levamos **segurança e LGPD** a sério: tratamos dados com cuidado e isolamos ambientes. Inclusive aplicamos isso nos nossos próprios projetos. 🔒",
    options: [
      { label: "Quero conversar", next: "agendar_intro" },
      { label: "Outra dúvida", next: "faq" },
    ],
  },

  // ---------- Qualificação (vendas) ----------
  {
    id: "dor",
    bot: "Show! Pra eu te direcionar melhor: qual é a **principal dor** hoje?",
    options: [
      { label: "Atendimento demorado", set: { dor: "Atendimento demorado" }, next: "porte" },
      { label: "Tarefas repetitivas", set: { dor: "Tarefas repetitivas" }, next: "porte" },
      { label: "Falta de dados/relatórios", set: { dor: "Falta de dados/relatórios" }, next: "porte" },
      { label: "Quero vender mais", set: { dor: "Quero vender mais / gerar leads" }, next: "porte" },
      { label: "Outro", set: { dor: "Outro" }, next: "porte" },
    ],
  },
  {
    id: "porte",
    bot: "Entendi. E qual o **porte** da empresa?",
    options: [
      { label: "Autônomo / MEI", set: { porte: "Autônomo / MEI" }, next: "ask_name" },
      { label: "Pequena", set: { porte: "Pequena empresa" }, next: "ask_name" },
      { label: "Média", set: { porte: "Média empresa" }, next: "ask_name" },
      { label: "Grande", set: { porte: "Grande empresa" }, next: "ask_name" },
    ],
  },

  // ---------- Agendamento / handoff ----------
  {
    id: "agendar_intro",
    bot: "Boa! Pra te conectar com um especialista, posso pegar uns dados rápidos? Leva uns 30 segundos. 😊",
    options: [
      { label: "Pode pegar 👍", next: "ask_name" },
      {
        label: "Ir direto pro WhatsApp",
        href: whatsappLink(siteConfig.scheduleCta.message),
        external: true,
      },
    ],
  },

  // ---------- Captura ----------
  {
    id: "ask_name",
    bot: "Perfeito! Como posso te chamar?",
    ask: { field: "name", validate: "name", placeholder: "Seu nome", next: "ask_phone" },
  },
  {
    id: "ask_phone",
    bot: (c) =>
      `Prazer, ${firstName(c)}! 👋 Qual o seu WhatsApp? (com DDD)`,
    ask: {
      field: "phone",
      validate: "phone",
      placeholder: "(21) 90000-0000",
      next: "ask_email",
    },
  },
  {
    id: "ask_email",
    bot: 'E um e-mail pra contato? (ou digite "pular")',
    ask: {
      field: "email",
      validate: "email-optional",
      placeholder: "voce@empresa.com",
      next: "save",
    },
  },
  {
    id: "save",
    save: true,
    bot: (c) =>
      `Prontinho, ${firstName(c)}! 🎉 Já registrei seu interesse e nosso time vai te chamar. Quer adiantar e falar agora no WhatsApp?`,
    options: [
      {
        label: "Falar agora no WhatsApp 🚀",
        href: (c) => whatsappLink(gutoWhatsappMessage(c)),
        external: true,
      },
      { label: "Ver cases de sucesso", href: "/cases" },
      { label: "Recomeçar", next: "root" },
    ],
  },
];

export const FLOW: Record<string, FlowNode> = Object.fromEntries(
  nodes.map((n) => [n.id, n]),
);
