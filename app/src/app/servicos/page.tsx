import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buttonVariants } from "@/components/ui/button";
import { services } from "@/lib/services";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "As quatro frentes da Papagaios Solutions: IA & Agentes Inteligentes, Automação via WhatsApp, SaaS & Dashboards e Engenharia de Dados (BI).",
};

export default function ServicosPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-secondary to-background">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Serviços
            </span>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Soluções de negócio, de ponta a ponta
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Substituímos processos manuais por fluxos digitais automatizados,
              atuando em quatro frentes principais.
            </p>
          </div>
        </section>

        {/* Frentes */}
        <section className="pb-8">
          <div className="mx-auto max-w-[90rem] space-y-6 px-4 sm:px-6 lg:px-8">
            {services.map((service) => (
              <article
                key={service.slug}
                id={service.slug}
                className="scroll-mt-24 rounded-2xl border border-border bg-card p-7 shadow-sm sm:p-10"
              >
                <div className="grid gap-8 md:grid-cols-2 md:gap-12">
                  <div>
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <service.icon className="size-6" />
                    </div>
                    <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                      {service.name}
                    </h2>
                    <p className="mt-2 font-medium text-foreground">
                      {service.tagline}
                    </p>
                    <p className="mt-3 text-muted-foreground">
                      {service.description}
                    </p>
                  </div>

                  <ul className="grid content-center gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                    {service.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Check className="size-3.5" />
                        </span>
                        <span className="text-sm text-muted-foreground">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Qual processo você quer automatizar primeiro?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Conte seu desafio e desenhamos a frente ideal para o seu negócio.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={siteConfig.scheduleCta.href}
                className={cn(buttonVariants({ size: "lg" }))}
              >
                {siteConfig.scheduleCta.label}
                <ArrowRight />
              </a>
              <Link
                href="/cases"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Ver cases
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
