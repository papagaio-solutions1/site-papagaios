import { Clock, TrendingUp, Users, Plug, Rocket, ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";

const benefits = [
  {
    icon: Clock,
    title: "Atendimento 24/7",
    description:
      "Seus clientes são respondidos na hora, todos os dias, sem fila e sem depender de horário comercial.",
  },
  {
    icon: TrendingUp,
    title: "Mais conversão",
    description:
      "Respostas rápidas e qualificação automática de leads transformam mais contatos em reuniões e vendas.",
  },
  {
    icon: Users,
    title: "Escale sem aumentar a equipe",
    description:
      "A IA absorve o volume repetitivo e seu time foca no que realmente exige decisão humana.",
  },
  {
    icon: Plug,
    title: "Integra com suas ferramentas",
    description:
      "Conecte WhatsApp, CRM e os sistemas que você já usa, mantendo tudo sincronizado.",
  },
  {
    icon: Rocket,
    title: "Implementação rápida",
    description:
      "Colocamos sua automação no ar em dias, não meses, com acompanhamento próximo.",
  },
  {
    icon: ShieldCheck,
    title: "Dados e controle",
    description:
      "Histórico das conversas, métricas claras e segurança para você acompanhar tudo de perto.",
  },
];

export function Benefits() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Benefícios"
          title="Mais resultado com menos esforço operacional"
          description="A automação inteligente da Papagaios Solutions devolve tempo ao seu time e receita ao seu negócio."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, i) => (
            <Reveal key={benefit.title} delay={(i % 3) * 0.1}>
              <div className="h-full rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <benefit.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
