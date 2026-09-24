import { Search, Workflow, TrendingUp } from "lucide-react";

import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";

// Framework Desafio → Solução → Resultado (textocliente.md §5).
const steps = [
  {
    icon: Search,
    label: "Desafio",
    text: "Processos manuais lentos ou descentralizados: planilhas isoladas, atendimento sobrecarregado e dados espalhados.",
  },
  {
    icon: Workflow,
    label: "Solução",
    text: "Um ecossistema em Python integrado — WhatsApp Bot + Banco de Dados + Dashboard — sob medida para a sua operação.",
  },
  {
    icon: TrendingUp,
    label: "Resultado",
    text: "Otimização de tempo, eliminação de erros manuais e dados confiáveis para a tomada de decisão.",
  },
];

export function Process() {
  return (
    <section className="border-y border-border bg-secondary/50 py-20 sm:py-28">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Como trabalhamos"
          title="Do gargalo operacional ao resultado"
          description="Um método claro: identificamos o problema, construímos o ecossistema e entregamos dados confiáveis para a gestão."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.1}>
              <div className="relative h-full rounded-xl border border-border bg-card p-7 shadow-sm">
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </div>
                <h3 className="mt-5 bg-gradient-to-r from-primary to-highlight bg-clip-text text-xl font-semibold text-transparent">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
