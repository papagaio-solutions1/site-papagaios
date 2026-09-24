// WhatsApp do bot de agendamento — o site só faz handoff, nunca toca no bot.
// [DEMO Etapa 2] Placeholder — substituir pelo número oficial da Papagaios Solutions
// quando disponível (Etapa 3). Não é um número real em produção.
const WHATSAPP_NUMBER = "5521999999999";

export const siteConfig = {
  name: "Papagaios Solutions",
  shortName: "Papagaios Solutions",
  description:
    "Papagaios Solutions | IA & Automação — desenvolvemos e integramos agentes de IA, automação no WhatsApp, dashboards SaaS e engenharia de dados para empresas.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsappNumber: WHATSAPP_NUMBER,
  nav: [
    { label: "Serviços", href: "/servicos" },
    { label: "Cases", href: "/cases" },
    { label: "Sobre", href: "/sobre" },
    { label: "Contato", href: "/contato" },
  ],
  cta: { label: "Fale com um especialista", href: "/contato" },
  scheduleCta: {
    label: "Agendar reunião",
    href: "/agendar",
    message:
      "Olá! Vim pelo site da Papagaios Solutions e gostaria de agendar uma reunião.",
  },
  // Acesso restrito: só clientes cadastrados agendam/falam com especialista.
  auth: {
    login: { label: "Entrar", href: "/entrar" },
    signup: { label: "Cadastrar", href: "/cadastro" },
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Monta o link wa.me para handoff ao bot, com mensagem opcional pré-preenchida. */
export function whatsappLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
