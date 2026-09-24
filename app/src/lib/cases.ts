export type CaseImage = { src: string; alt: string; w: number; h: number };

export type CaseStudy = {
  slug: string;
  name: string;
  segment: string;
  summary: string;
  overview: string;
  challenge: string; // Desafio
  solution: string; // Solução
  result: string; // Resultado (qualitativo — sem métricas inventadas)
  highlights: string[];
  stack: string[];
  services: string[];
  images: CaseImage[]; // [0] = capa
};

// Cases reais (projetos da Papagaios Solutions), com prints das telas em public/cases/.
// Resultados qualitativos: NÃO inserir métricas numéricas sem dado real.
export const cases: CaseStudy[] = [
  {
    slug: "agendamentos-de-clinicas",
    name: "Agendamentos de Clínicas",
    segment: "Clínicas e consultórios",
    summary:
      "Um agente de IA no WhatsApp que agenda consultas 24/7 e um painel que organiza toda a recepção em tempo real.",
    overview:
      "Um ecossistema completo para a recepção da clínica. O paciente resolve tudo pelo WhatsApp — agendar, remarcar, cancelar, enviar exames e atualizar cadastro — conversando com um agente de IA a qualquer hora. Em paralelo, a equipe acompanha cada paciente num painel visual que se atualiza sozinho.",
    challenge:
      "A recepção vivia sobrecarregada respondendo agendamentos no WhatsApp, fazendo lembretes na mão e controlando a agenda em lugares separados. Isso gerava demora, risco de marcar dois pacientes no mesmo horário e nenhuma visão do que acontecia na clínica naquele momento.",
    solution:
      "Criamos um agente de IA que conversa no WhatsApp e cuida de todo o ciclo — cadastro, agendamento, remarcação, cancelamento, envio de exames e lembretes automáticos — sempre em sincronia com a agenda. Para a equipe, um painel operacional mostra os pacientes em colunas (agendados, aguardando, em atendimento, finalizados) com métricas ao vivo, e permite assumir a conversa quando precisa de um toque humano. Na sala de espera, um painel de chamada exibe o atendimento atual e a fila, para o próprio paciente acompanhar quando chega a sua vez.",
    result:
      "A clínica passou a atender e agendar 24 horas por dia, sem a recepção digitar cada confirmação. Os lembretes automáticos ajudam a reduzir faltas, a agenda deixa de ter conflitos e a gestão enxerga a operação inteira em tempo real.",
    highlights: [
      "Agendar, remarcar e cancelar pelo WhatsApp, sem ligação",
      "Lembretes automáticos antes da consulta",
      "Envio de exames e atualização de cadastro pelo chat",
      "Painel com os pacientes em tempo real (recepção → atendimento → finalizado)",
      "Painel de chamada na sala de espera: o paciente acompanha a fila e quando é chamado",
      "A equipe assume a conversa quando necessário",
      "Agenda sempre sincronizada, sem horário duplicado",
    ],
    stack: [
      "Agente de IA",
      "WhatsApp",
      "Painel web em tempo real",
      "Google Calendar",
      "Supabase",
    ],
    services: ["IA & Agentes", "Automação WhatsApp", "SaaS & Dashboards"],
    images: [
      { src: "/cases/agendamentos-de-clinicas/kanban.webp", alt: "Painel operacional com os pacientes do dia em tempo real", w: 1300, h: 565 },
      { src: "/cases/agendamentos-de-clinicas/chamada.webp", alt: "Painel de chamada da sala de espera: atendimento atual e fila", w: 1300, h: 622 },
      { src: "/cases/agendamentos-de-clinicas/bot.webp", alt: "Conversa do agente de IA no WhatsApp com o menu de atendimento", w: 465, h: 446 },
      { src: "/cases/agendamentos-de-clinicas/login.webp", alt: "Tela de acesso ao painel da clínica", w: 1300, h: 622 },
    ],
  },
  {
    slug: "prospeccao-no-whatsapp",
    name: "Prospecção e Follow-up no WhatsApp",
    segment: "Vendas e prospecção ativa",
    summary:
      "Um agente de IA que prospecta, qualifica e agenda demonstrações no WhatsApp — com central de disparos para o time.",
    overview:
      "Um agente de IA que faz a prospecção ativa pela empresa: aborda novos contatos no WhatsApp, apresenta a solução, envia o material e já agenda a demonstração. Internamente, o time dispara campanhas e acompanha tudo por um menu administrativo no próprio WhatsApp.",
    challenge:
      "Prospectar e fazer follow-up na mão não escala: consome o tempo do time comercial, esfria leads e depende de alguém lembrar de retornar cada contato.",
    solution:
      "Montamos um agente que conduz a conversa de prospecção — apresenta a empresa, envia o material em PDF e agenda a demonstração com o lead. Para o time, um menu administrativo permite disparar mensagens para novos contatos, para quem não respondeu ou para um número específico, além de consultar a agenda, ver status de contrato e cadastrar vendedores.",
    result:
      "A prospecção, o follow-up e o agendamento de demonstrações passaram a rodar de forma automática, liberando o time comercial do trabalho repetitivo e mantendo os leads aquecidos.",
    highlights: [
      "Abordagem e qualificação automáticas no WhatsApp",
      "Envio de material (PDF) sob demanda",
      "Agendamento de demonstração dentro da conversa",
      "Central de disparos: novos, sem resposta ou individual",
      "Consulta de agenda e status de contrato",
      "Cadastro de vendedores",
    ],
    stack: ["Agente de IA", "WhatsApp", "Google Calendar", "Supabase"],
    services: ["IA & Agentes", "Automação WhatsApp"],
    images: [
      { src: "/cases/prospeccao-no-whatsapp/cliente.webp", alt: "Agente de IA agendando uma demonstração com o lead no WhatsApp", w: 585, h: 1300 },
      { src: "/cases/prospeccao-no-whatsapp/admin.webp", alt: "Menu administrativo de disparos no WhatsApp", w: 585, h: 1300 },
    ],
  },
  {
    slug: "la-casa-de-pastel",
    name: "La Casa de Pastel",
    segment: "Delivery / food service",
    summary:
      "Um app de pedidos próprio e um painel de cozinha em tempo real — sem depender de marketplace.",
    overview:
      "Uma plataforma de delivery completa para a pastelaria. Os clientes pedem por um app próprio, com cardápio, carrinho e observações por item, e a cozinha gerencia tudo num painel que toca um alerta a cada novo pedido e mostra cada um avançando do recebimento até a entrega.",
    challenge:
      "Os pedidos chegavam pelo WhatsApp, sem padronização, sem histórico do cliente e sem controle do que estava na fila. Era fácil perder pedido e difícil organizar a produção.",
    solution:
      "Criamos o app de pedidos com a identidade da marca (cardápio com fotos, observações por item e reconhecimento do cliente que volta) e um painel de cozinha em formato Kanban: novos, em preparo, em entrega, concluídos e cancelados. Cada novo pedido toca um alerta sonoro, e a equipe acompanha valor, forma de pagamento e endereço, com chat e acionamento de motoboy.",
    result:
      "Os pedidos passaram a entrar direto no sistema, organizados e sem risco de se perder. A cozinha enxerga toda a fila em tempo real e o histórico do cliente facilita a recompra — tudo no canal da própria marca, sem comissão de marketplace.",
    highlights: [
      "App de pedidos com a identidade da marca",
      "Cardápio com fotos e observações por item",
      "Painel de cozinha em tempo real com alerta sonoro",
      "Fluxo recebido → preparo → entrega → concluído",
      "Pagamento (PIX), endereço e acionamento de motoboy",
      "Reconhece o cliente que volta pelo histórico",
    ],
    stack: ["App web", "Painel em tempo real", "Supabase"],
    services: ["SaaS & Dashboards", "Automação"],
    images: [
      { src: "/cases/la-casa-de-pastel/painel.webp", alt: "Painel da cozinha com os pedidos em tempo real", w: 1300, h: 624 },
      { src: "/cases/la-casa-de-pastel/app.webp", alt: "App de pedidos da La Casa de Pastel", w: 657, h: 1158 },
      { src: "/cases/la-casa-de-pastel/login.webp", alt: "Tela de acesso ao sistema da loja", w: 444, h: 488 },
    ],
  },
  {
    slug: "cooler-gym",
    name: "Cooler Gym",
    segment: "Vending fitness / alimentos saudáveis",
    summary:
      "App para comprar e abrir a geladeira inteligente, e um console que controla cada estação em tempo real.",
    overview:
      "Uma plataforma para geladeiras inteligentes de alimentos fitness em academias. O cliente compra pelo app e abre a porta na hora, enquanto o operador acompanha vendas, estoque e ocorrências de cada estação por um console em tempo real.",
    challenge:
      "As estações de vending operavam às cegas: o operador não sabia quando o estoque baixava ou quando havia uma ocorrência, e o cliente não tinha autonomia para comprar e retirar sozinho.",
    solution:
      "Construímos o app do cliente (catálogo com calorias e proteínas, compra e retirada em segundos abrindo a porta pelo celular) e o console do operador, que mostra a operação do dia, o estoque por equipamento, alertas automáticos de reposição e métricas de venda — tudo sincronizado em tempo real entre os pontos.",
    result:
      "Cada estação passou a ter visibilidade total: o cliente compra e retira sozinho, e o operador é avisado automaticamente de estoque baixo e ocorrências, gerenciando vários pontos de um lugar só.",
    highlights: [
      "Compra e abertura da geladeira pelo app",
      "Catálogo com calorias e proteínas",
      "Console do operador em tempo real",
      "Alertas automáticos de estoque baixo",
      "Métricas de venda e ocorrências por estação",
      "Operação de múltiplos pontos centralizada",
    ],
    stack: ["App web", "Console em tempo real", "Supabase"],
    services: ["SaaS & Dashboards", "Engenharia de Dados/BI"],
    images: [
      { src: "/cases/cooler-gym/painel.webp", alt: "Console operacional da Cooler Gym", w: 1300, h: 628 },
      { src: "/cases/cooler-gym/app.webp", alt: "App do cliente da Cooler Gym", w: 677, h: 1300 },
      { src: "/cases/cooler-gym/login.webp", alt: "Tela de acesso da Cooler Gym", w: 1038, h: 1144 },
    ],
  },
];

export function getCase(slug: string): CaseStudy | undefined {
  return cases.find((c) => c.slug === slug);
}
