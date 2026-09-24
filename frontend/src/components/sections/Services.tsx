import Link from "next/link";

import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { services } from "@/lib/services";

export function Services() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Serviços"
          title="Substituímos processos manuais por fluxos digitais"
          description="Atuamos em quatro frentes principais para automatizar atendimento, vendas e operação de ponta a ponta."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={(i % 4) * 0.08}>
              <Link
                href={`/servicos#${service.slug}`}
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <service.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{service.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {service.description}
                </p>
                <span className="mt-4 text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5">
                  Saiba mais →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
