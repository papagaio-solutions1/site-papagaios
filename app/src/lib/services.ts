import {
  Bot,
  MessageSquare,
  LayoutDashboard,
  Database,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  name: string;
  tagline: string;
  description: string; // texto oficial (textocliente.md §2)
  icon: LucideIcon;
  bullets: string[];
};

// As 4 frentes oficiais da Papagaios Solutions (textocliente.md §2).
export const services: Service[] = [
  {
    slug: "ia-agentes",
    name: "IA & Agentes Inteligentes",
    tagline: "Assistentes virtuais e chatbots que atendem por você.",
    description:
      "Criação de assistentes virtuais personalizados e chatbots configurados para interações diretas e eficientes com o cliente.",
    icon: Bot,
    bullets: [
      "Agentes de IA personalizados",
      "Chatbots para site e WhatsApp",
      "Qualificação e atendimento automático",
      "Integração com seus sistemas",
    ],
  },
  {
    slug: "automacao-whatsapp",
    name: "Automação via WhatsApp",
    tagline: "Atendimento e suporte que operam continuamente.",
    description:
      "Implementação de fluxos automatizados de atendimento e suporte que operam continuamente, integrados aos sistemas internos.",
    icon: MessageSquare,
    bullets: [
      "Fluxos de atendimento 24/7",
      "Disparos e follow-up automáticos",
      "Agendamento e lembretes",
      "Integração com CRM e sistemas internos",
    ],
  },
  {
    slug: "saas-dashboards",
    name: "SaaS & Dashboards",
    tagline: "Plataformas e painéis para decidir com dados em tempo real.",
    description:
      "Desenvolvimento de plataformas e painéis de controle em Python para centralização de dados e acompanhamento de métricas em tempo real.",
    icon: LayoutDashboard,
    bullets: [
      "Painéis de controle sob medida",
      "Métricas em tempo real",
      "Centralização de dados",
      "Plataformas SaaS multiusuário",
    ],
  },
  {
    slug: "engenharia-de-dados",
    name: "Engenharia de Dados (BI)",
    tagline: "Pipelines seguros que transformam dados brutos em decisão.",
    description:
      "Construção de pipelines seguros para coleta, tratamento e organização de informações brutas, estruturando os dados para a tomada de decisão.",
    icon: Database,
    bullets: [
      "Pipelines de dados (ETL)",
      "Coleta e tratamento de dados",
      "Modelagem e organização",
      "Base para BI e relatórios",
    ],
  },
];
